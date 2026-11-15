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

const fields={
  kind:'kind',status:'status',eventId:'eventId',searchId:'searchId',actor:'actor',role:'actorRole',
  mode:'config.mode',scope:'config.scope',caseSensitive:'config.caseSensitive',wholeWord:'config.wholeWord',
  matchAll:'config.matchAll',hasExclusions:'config.hasExclusions',fuzzyTolerance:'config.fuzzyTolerance',
  dateFilter:'config.dateFilter',sizeFilter:'config.sizeFilter',semanticBackend:'config.semanticBackend',
  semanticDevice:'config.semanticDevice',semanticFallback:'config.semanticFallback',warmStart:'metrics.warmStart',
  format:'formats.format',code:'issues.code',stage:'issues.stage',exception:'issues.exception',
  version:'environment.appVersion',engineVersion:'environment.engineVersion',pythonVersion:'environment.pythonVersion',
  os:'environment.os',osRelease:'environment.osRelease',
};
const ranges={DurationMs:'metrics.durationMs',Files:'metrics.filesProcessed',Keywords:'config.keywordCount'};
const sortOrders={newest:{receivedAt:-1,_id:-1},oldest:{receivedAt:1,_id:1},slowest:{'metrics.durationMs':-1,_id:-1},
  fastest:{'metrics.durationMs':1,_id:1},most_files:{'metrics.filesProcessed':-1,_id:-1},
  most_failures:{'metrics.filesFailed':-1,_id:-1},most_results:{'metrics.passages':-1,_id:-1}};

// Every value is validated against a closed schema first, so no input becomes an operator.
export function buildFilter(query){
  const input=filterSchema.parse(query);
  const and=[{expiresAt:{$gt:new Date()}}];
  for(const [key,path] of Object.entries(fields)){
    if(input[key]===undefined)continue;
    // A flag older clients never sent counts as "off".
    and.push({[path]:input[key]===false?{$ne:true}:input[key]});
  }
  for(const [suffix,path] of Object.entries(ranges)){
    const min=input['min'+suffix],max=input['max'+suffix];
    if(min!==undefined||max!==undefined)and.push({[path]:{...(min!==undefined?{$gte:min}:{}),...(max!==undefined?{$lte:max}:{})}});
  }
  if(input.hasErrors!==undefined)and.push(input.hasErrors?{'issues.0':{$exists:true}}:{'issues.0':{$exists:false}});
  if(input.hasMatches!==undefined)and.push(input.hasMatches?{'metrics.filesMatched':{$gt:0}}:{'metrics.filesMatched':{$not:{$gt:0}}});
  if(input.usedCache!==undefined)and.push(input.usedCache?{'metrics.cacheHits':{$gt:0}}:{'metrics.cacheHits':{$not:{$gt:0}}});
  if(input.from||input.to){
    const received={};
    if(input.from)received.$gte=new Date(input.from);
    if(input.to)received.$lte=new Date(input.to);
    and.push({receivedAt:received});
  }
  const filter=and.length===1?and[0]:{$and:and};
  return {input,filter,sort:sortOrders[input.sort]};
}

export const listLogs=catchAsync(async(req,res)=>{
  const {input,filter,sort}=buildFilter(req.query);
  const [total,data]=await Promise.all([
    AdminLog.countDocuments(filter),
    AdminLog.find(filter).sort(sort).skip((input.page-1)*input.limit).limit(input.limit)
      .populate('actor','name handle role').lean(),
  ]);
  res.json({success:true,data:data.map(({issues,...event})=>({...event,errors:issues||[]})),total,page:input.page,limit:input.limit});
});

export function summarize(records){
  const counts={},kinds={},durations=[],issues=new Map(),versions=new Map(),formats=new Map(),modes=new Map(),days=new Map(),runtimes=new Map();
  const semantic={searches:0,cacheHits:0,cacheMisses:0,passagesPrepared:0,passagesScored:0,fallbacks:0,warmStarts:0,modelLoad:[],prepare:[],firstResult:[]};
  let searches=0,files=0,failedFiles=0,matchedFiles=0,passages=0,cacheHits=0,cacheMisses=0;
  for(const event of records){
    counts[event.status]=(counts[event.status]||0)+1;
    kinds[event.kind]=(kinds[event.kind]||0)+1;
    const day=new Date(event.receivedAt||event.startedAt).toISOString().slice(0,10);
    const daily=days.get(day)||{day,events:0,failures:0,searches:0};
    daily.events++;if(['failed','partial_failure','interrupted'].includes(event.status))daily.failures++;
    if(event.kind==='search')daily.searches++;days.set(day,daily);
    if(event.kind==='search'){
      matchedFiles+=event.metrics.filesMatched||0;passages+=event.metrics.passages||0;
      cacheHits+=event.metrics.cacheHits||0;cacheMisses+=event.metrics.cacheMisses||0;
    }
    if(event.kind==='search'&&event.config.mode==='semantic'){
      semantic.searches++;
      for(const key of ['cacheHits','cacheMisses','passagesPrepared','passagesScored'])semantic[key]+=event.metrics[key]||0;
      if(event.config.semanticFallback)semantic.fallbacks++;
      if(event.metrics.warmStart)semantic.warmStarts++;
      if(event.metrics.modelLoadMs!=null)semantic.modelLoad.push(event.metrics.modelLoadMs);
      if(event.metrics.prepareMs!=null)semantic.prepare.push(event.metrics.prepareMs);
      if(event.metrics.firstResultMs!=null)semantic.firstResult.push(event.metrics.firstResultMs);
      const key=(event.config.semanticBackend||'unknown')+'/'+(event.config.semanticDevice||'unknown');
      const runtime=runtimes.get(key)||{backend:event.config.semanticBackend||'unknown',device:event.config.semanticDevice||'unknown',searches:0,durations:[]};
      runtime.searches++;if(event.status!=='interrupted')runtime.durations.push(event.metrics.durationMs);runtimes.set(key,runtime);
    }
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
      const mode=modes.get(key)||{mode:event.config.mode,scope:event.config.scope,searches:0,files:0,failures:0,passages:0,durations:[]};
      mode.searches++;mode.files+=event.metrics.filesProcessed||0;mode.passages+=event.metrics.passages||0;
      if(['failed','partial_failure'].includes(event.status))mode.failures++;
      mode.durations.push(event.metrics.durationMs);modes.set(key,mode);
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
  const median=values=>{const sorted=[...values].sort((a,b)=>a-b);return sorted.length?sorted[Math.ceil(sorted.length*.5)-1]:null;};
  const {modelLoad,prepare,firstResult,...semanticTotals}=semantic;
  return {sampleSize:records.length,searches,files,failedFiles,matchedFiles,passages,cacheHits,cacheMisses,counts,kinds,
    medianMs:percentile(.5),p95Ms:percentile(.95),
    timeline:[...days.values()].sort((a,b)=>a.day.localeCompare(b.day)),
    semantic:{...semanticTotals,medianModelLoadMs:median(modelLoad),medianPrepareMs:median(prepare),medianFirstResultMs:median(firstResult),
      runtimes:[...runtimes.values()].map(timing).sort((a,b)=>b.searches-a.searches)},
    topErrors:[...issues.values()].sort((a,b)=>b.count-a.count).slice(0,20).map(({actors,...entry})=>({...entry,affectedUsers:actors.size})),
    versions:[...versions.values()].map(timing).sort((a,b)=>b.events-a.events),modes:[...modes.values()].map(timing),formats:[...formats.values()].sort((a,b)=>b.processed-a.processed)};
}

export const logSummary=catchAsync(async(req,res)=>{
  const {filter}=buildFilter(req.query);
  const [total,records]=await Promise.all([AdminLog.countDocuments(filter),AdminLog.find(filter).sort({receivedAt:-1,_id:-1}).limit(5000).lean()]);
  res.json({success:true,data:{...summarize(records),total,sampleLimit:5000}});
});

// Values actually present in retained records, so the page can offer them as choices.
export const logFacets=catchAsync(async(req,res)=>{
  const live={expiresAt:{$gt:new Date()}};
  const paths={versions:'environment.appVersion',engineVersions:'environment.engineVersion',pythonVersions:'environment.pythonVersion',osReleases:'environment.osRelease'};
  const entries=await Promise.all(Object.entries(paths).map(async([key,path])=>[key,(await AdminLog.distinct(path,live)).filter(value=>typeof value==='string').sort().reverse().slice(0,50)]));
  res.json({success:true,data:Object.fromEntries(entries)});
});

const accountQuery = z.strictObject({q: z.string().trim().max(254).default('')});
export const findLogAccounts = catchAsync(async (req, res) => {
  const {q} = accountQuery.parse(req.query);
  if (!q) return res.json({success: true, data: [], limit: 20});
  const literal = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = q ? {$or: [{name: {$regex: literal, $options: 'i'}}, {handle: {$regex: literal, $options: 'i'}}, {email: {$regex: literal, $options: 'i'}},
    ...(/^[a-fA-F0-9]{24}$/.test(q) ? [{_id: q}] : [])]} : {};
  const data = await User.find(filter).select('_id name handle role').sort({name: 1, _id: 1}).limit(20).lean();
  res.json({success: true, data, limit: 20});
});

export const accountStatistics = catchAsync(async (req, res) => {
  const {actor} = filterSchema.parse({actor: req.params.actor});
  const data = await AccountSearchStats.findById(actor).lean();
  res.json({success: true, data: data || null});
});
