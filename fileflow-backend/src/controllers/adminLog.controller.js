import { createHash } from 'node:crypto';
import mongoose from 'mongoose';
import { z } from 'zod';
import User from '../models/User.js';
import AccountSearchStats from '../models/AccountSearchStats.js';
import SearchStatsReceipt from '../models/SearchStatsReceipt.js';
import { incrementsFor } from '../services/searchStatistics.js';
import AdminLog from '../models/AdminLog.js';
import { catchAsync } from '../utils/catchAsync.js';
import { batchSchema, filterSchema } from '../validations/adminLog.validation.js';

export const ingestLogs = catchAsync(async(req,res)=>{
  const {events}=batchSchema.parse(req.body);
  const receivedAt=new Date();
  const expiresAt=new Date(receivedAt.getTime()+90*86400000);
  const distinct=[...new Map(events.map(event=>[event.eventId,event])).values()];
  const writes=distinct.map(({errors,...event})=>({updateOne:{
    filter:{actor:req.user._id,eventId:event.eventId},
    update:{$setOnInsert:{...event,actor:req.user._id,actorRole:req.user.role,receivedAt,expiresAt,
      issues:errors.map(error=>({...error,fingerprint:createHash('sha256').update(
        [event.kind,error.code,error.stage,error.format,event.environment.appVersion,event.environment.engineVersion].join('|')
      ).digest('hex').slice(0,24)})),
    }},upsert:true,
  }}));
  // A failed/partial bulk write is retried idempotently by the durable client outbox.
  // Atomically persist logs, deduplication receipts and permanent numeric totals.
  // Network/database work stays in the desktop's background uploader.
  await mongoose.connection.transaction(async session => {
    await AdminLog.bulkWrite(writes, {ordered: true, session});
    const searches = distinct.filter(event => event.kind === 'search');
    if (!searches.length) return;
    const result = await SearchStatsReceipt.bulkWrite(searches.map(event => ({updateOne: {
      filter: {_id: `${req.user._id}:${event.eventId}`},
      update: {$setOnInsert: {_id: `${req.user._id}:${event.eventId}`}}, upsert: true,
    }})), {ordered: true, session});
    const added = Object.keys(result.upsertedIds || {}).map(index => searches[Number(index)]);
    if (!added.length) return;
    await AccountSearchStats.updateOne({_id: req.user._id}, {
      $inc: incrementsFor(added),
      $min: {trackingSince: receivedAt},
      $max: {lastReceivedAt: receivedAt, lastSearchAt: new Date(Math.max(...added.map(event => Date.parse(event.startedAt))))},
    }, {upsert: true, session});
  }, {writeConcern: {w: 'majority', j: true, wtimeout: 10000}});
  res.status(200).json({success:true,accepted:[...new Set(events.map(event=>event.eventId))]});
});

export function buildFilter(query){
  const input=filterSchema.parse(query);
  const filter={expiresAt:{$gt:new Date()}};
  for(const field of ['kind','status','eventId','searchId']) if(input[field])filter[field]=input[field];
  if(input.actor)filter.actor=input.actor;
  if(input.mode)filter['config.mode']=input.mode;
  if(input.scope)filter['config.scope']=input.scope;
  if(input.format)filter['formats.format']=input.format;
  if(input.code)filter['issues.code']=input.code;
  if(input.version)filter['environment.appVersion']=input.version;
  if(input.from||input.to){
    filter.receivedAt={};
    if(input.from)filter.receivedAt.$gte=new Date(input.from);
    if(input.to)filter.receivedAt.$lte=new Date(input.to);
  }
  return {input,filter};
}

export const listLogs=catchAsync(async(req,res)=>{
  const {input,filter}=buildFilter(req.query);
  const [total,data]=await Promise.all([
    AdminLog.countDocuments(filter),
    AdminLog.find(filter).sort({receivedAt:-1,_id:-1}).skip((input.page-1)*input.limit).limit(input.limit)
      .populate('actor','name handle role').lean(),
  ]);
  res.json({success:true,data:data.map(({issues,...event})=>({...event,errors:issues||[]})),total,page:input.page,limit:input.limit});
});

export function summarize(records){
  const counts={},durations=[],issues=new Map(),versions=new Map(),formats=new Map(),modes=new Map();
  let searches=0,files=0,failedFiles=0;
  for(const event of records){
    counts[event.status]=(counts[event.status]||0)+1;
    if(event.kind==='search'){
      searches++;files+=event.metrics.filesProcessed||0;failedFiles+=event.metrics.filesFailed||0;
      if(event.status!=='interrupted')durations.push(event.metrics.durationMs);
    }
    const appVersion=event.environment.appVersion;
    const version=versions.get(appVersion)||{version:appVersion,events:0,failures:0,durations:[]};
    version.events++;if(['failed','partial_failure','interrupted'].includes(event.status))version.failures++;
    if(event.kind==='search'&&event.status!=='interrupted'){
      version.durations.push(event.metrics.durationMs);
      const key=event.config.mode+'/'+event.config.scope;
      const mode=modes.get(key)||{mode:event.config.mode,scope:event.config.scope,searches:0,files:0,durations:[]};
      mode.searches++;mode.files+=event.metrics.filesProcessed||0;mode.durations.push(event.metrics.durationMs);modes.set(key,mode);
    }
    versions.set(appVersion,version);
    for(const entry of event.formats){
      const bucket=formats.get(entry.format)||{format:entry.format,processed:0,failed:0,processingMs:0};
      bucket.processed+=entry.processed;bucket.failed+=entry.failed;bucket.processingMs+=entry.processingMs||0;formats.set(entry.format,bucket);
    }
    for(const error of (event.issues||event.errors||[])){
      const key=error.fingerprint||[error.code,error.stage,error.format,appVersion].join('|');
      const bucket=issues.get(key)||{fingerprint:key,code:error.code,stage:error.stage,format:error.format,version:appVersion,count:0,events:0,actors:new Set()};
      bucket.count+=error.count;bucket.events++;bucket.actors.add(String(event.actor));issues.set(key,bucket);
    }
  }
  const timing=({durations,...record})=>{
    durations.sort((a,b)=>a-b);
    return {...record,medianMs:durations.length?durations[Math.ceil(durations.length*.5)-1]:null,p95Ms:durations.length?durations[Math.ceil(durations.length*.95)-1]:null};
  };
  durations.sort((a,b)=>a-b);
  const percentile=p=>durations.length?durations[Math.max(0,Math.ceil(p*durations.length)-1)]:null;
  return {sampleSize:records.length,searches,files,failedFiles,counts,medianMs:percentile(.5),p95Ms:percentile(.95),
    topErrors:[...issues.values()].sort((a,b)=>b.count-a.count).slice(0,20).map(({actors,...entry})=>({...entry,affectedUsers:actors.size})),
    versions:[...versions.values()].map(timing).sort((a,b)=>b.events-a.events),modes:[...modes.values()].map(timing),formats:[...formats.values()].sort((a,b)=>b.processed-a.processed)};
}

export const logSummary=catchAsync(async(req,res)=>{
  const {filter}=buildFilter(req.query);
  const [total,records]=await Promise.all([AdminLog.countDocuments(filter),AdminLog.find(filter).sort({receivedAt:-1,_id:-1}).limit(5000).lean()]);
  res.json({success:true,data:{...summarize(records),total,sampleLimit:5000}});
});

const accountQuery = z.strictObject({q: z.string().trim().max(80).default('')});
export const findLogAccounts = catchAsync(async (req, res) => {
  const {q} = accountQuery.parse(req.query);
  const literal = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = q ? {$or: [{name: {$regex: literal, $options: 'i'}}, {handle: {$regex: literal, $options: 'i'}},
    ...(/^[a-fA-F0-9]{24}$/.test(q) ? [{_id: q}] : [])]} : {};
  const data = await User.find(filter).select('_id name handle role').sort({name: 1, _id: 1}).limit(20).lean();
  res.json({success: true, data, limit: 20});
});

export const accountStatistics = catchAsync(async (req, res) => {
  const {actor} = filterSchema.parse({actor: req.params.actor});
  const data = await AccountSearchStats.findById(actor).lean();
  res.json({success: true, data: data || null});
});
