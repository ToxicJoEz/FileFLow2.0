import test from 'node:test';
import mongoose from 'mongoose';
import AccountSearchStats from '../src/models/AccountSearchStats.js';
import SearchStatsReceipt from '../src/models/SearchStatsReceipt.js';
import {incrementsFor} from '../src/services/searchStatistics.js';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import User from '../src/models/User.js';
import AdminLog from '../src/models/AdminLog.js';
import { eventSchema } from '../src/validations/adminLog.validation.js';
import { summarize } from '../src/controllers/adminLog.controller.js';
import { readFileSync } from 'node:fs';
import { batchSchema } from '../src/validations/adminLog.validation.js';

const userId='111111111111111111111111',adminId='222222222222222222222222';
const event=()=>({eventId:crypto.randomUUID(),schemaVersion:1,kind:'search',status:'success',startedAt:new Date().toISOString(),finishedAt:new Date().toISOString(),
  environment:{appVersion:'0.0.0',engineVersion:'1.0.0',pythonVersion:'3.11.0',os:'windows',osRelease:'11',parsers:{}},
  config:{mode:'standard',scope:'content',caseSensitive:false,wholeWord:false,matchAll:false,hasExclusions:true,formats:[]},
  metrics:{durationMs:20,filesProcessed:3,filesFailed:0,filesMatched:0,passages:0},formats:[{format:'pdf',processed:3,failed:0,matched:0,passages:0}],errors:[]});

test('actual Python event contract accepts version metadata and offset timestamps',()=>{
  const fixture=JSON.parse(readFileSync(new URL('./fixtures/python-admin-events.json',import.meta.url),'utf8'));
  assert.ok(batchSchema.parse(fixture).events.length===2);
});

test('closed DTO rejects private fields, raw messages, arbitrary formats and identity overrides',()=>{
  assert.equal(eventSchema.safeParse(event()).success,true);
  for(const key of ['keywords','excludedWords','target_paths','filename','snippet','content','actor','role','error_message']) {
    assert.equal(eventSchema.safeParse({...event(),[key]:'SECRET'}).success,false,key);
    assert.equal(eventSchema.safeParse({...event(),config:{...event().config,[key]:'SECRET'}}).success,false,key);
  }
  assert.equal(eventSchema.safeParse({...event(),errors:[{code:'PRIVATE_ERROR_TEXT',stage:'extraction',format:'pdf',exception:'ValueError',count:1}]}).success,false);
  assert.equal(eventSchema.safeParse({...event(),environment:{...event().environment,parsers:{'SECRET_FILENAME':'1.0'}}}).success,false);
});

test('summary handles no-match successes, errors, percentiles and affected accounts',()=>{
  const base=event();
  const error={code:'PARSER_FAILURE',stage:'extraction',format:'pdf',count:2,fingerprint:'known'};
  const records=[{...base,actor:userId},{...base,actor:adminId,status:'partial_failure',metrics:{...base.metrics,durationMs:100,filesFailed:2},errors:[error]}];
  const summary=summarize(records);
  assert.equal(summary.counts.success,1);
  assert.equal(summary.searches,2);
  assert.equal(summary.medianMs,20);
  assert.equal(summary.p95Ms,100);
  assert.equal(summary.topErrors[0].affectedUsers,1);
});

test('indexes provide idempotency and expiry support',()=>{
  const indexes=AdminLog.schema.indexes();
  assert.ok(indexes.some(([fields,options])=>fields.actor===1&&fields.eventId===1&&options.unique));
  assert.ok(indexes.some(([fields,options])=>fields.expiresAt===1&&options.expireAfterSeconds===0));
});

test('HTTP access control, safe ingestion, retired endpoints and admin reads',async t=>{
  process.env.JWT_SECRET='local-test-only-secret';
  const writes=[], statisticsWrites=[], receipts=new Set(), accountQueries=[];
  const session={testSession:true};
  let failStatistics=false;
  t.mock.method(mongoose.connection,'transaction',async (callback,options)=>{
    assert.equal(options.writeConcern.w,'majority');
    const snapshot=new Set(receipts), count=statisticsWrites.length, logCount=writes.length;
    try {return await callback(session);} catch(error) {
      receipts.clear();for(const id of snapshot)receipts.add(id);
      statisticsWrites.length=count;writes.length=logCount;
      throw error;
    }
  });
  t.mock.method(SearchStatsReceipt,'bulkWrite',async (batch,options)=>{
    assert.equal(options.session,session);
    const upsertedIds={};
    batch.forEach((item,index)=>{
      const id=item.updateOne.filter._id;
      if(!receipts.has(id)){receipts.add(id);upsertedIds[index]=id;}
    });
    return {upsertedIds};
  });
  t.mock.method(AccountSearchStats,'updateOne',async (filter,update,options)=>{
    assert.equal(options.session,session);
    if(failStatistics)throw new Error('Simulated statistics database outage');
    statisticsWrites.push({filter,update});
    return {};
  });
  t.mock.method(AccountSearchStats,'findById',id=>({lean:async()=>({_id:id,totals:{searches:1}})}));
  t.mock.method(User,'find',filter=>{
    accountQueries.push(filter);
    return {select(fields){assert.equal(fields,'_id name handle role');return this;},sort(){return this;},
      limit(value){assert.equal(value,20);return this;},lean:async()=>[{_id:userId,name:'Test user'}]};
  });
  let reads=0;
  const record={...event(),actor:{_id:userId,name:'Test user'},receivedAt:new Date().toISOString()};
  t.mock.method(User,'findById',async id=>({id,_id:id,role:id===adminId?'admin':'user'}));
  t.mock.method(AdminLog,'bulkWrite',async (batch,options)=>{assert.equal(options.session,session);writes.push(batch);return {};});
  t.mock.method(AdminLog,'countDocuments',async()=>1);
  t.mock.method(AdminLog,'find',()=>{
    reads++;
    const query={sort(){return this;},skip(){return this;},limit(){return this;},populate(){return this;},lean:async()=>[record]};
    return query;
  });
  const server=app.listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const base=`http://127.0.0.1:${server.address().port}/api`;
  const auth=id=>'Bearer '+jwt.sign({id},process.env.JWT_SECRET);
  async function request(path,{actor,body,method='GET'}={}){
    const response=await fetch(base+path,{method,headers:{...(actor?{Authorization:auth(actor)}:{}),'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
    return {status:response.status,body:await response.json()};
  }
  try{
    assert.equal((await request('/admin-logs')).status,401);
    assert.equal((await request('/admin-logs',{actor:userId})).status,403);
    assert.equal((await request('/admin-logs/summary',{actor:userId})).status,403);
    assert.equal((await request('/admin-logs/accounts',{actor:userId})).status,403);
    assert.equal((await request(`/admin-logs/accounts/${userId}/statistics`,{actor:userId})).status,403);
    assert.equal((await request('/admin-logs/accounts')).status,401);
    assert.equal(accountQueries.length,0);
    assert.equal(reads,0);
    const entry=event();
    entry.config.keywordCount=2;entry.config.excludedKeywordCount=1;
    const result=await request('/admin-logs/batch',{actor:userId,method:'POST',body:{events:[entry,entry]}});
    assert.equal(result.status,200);
    assert.deepEqual(result.body.accepted,[entry.eventId]);
    assert.equal(writes[0].length,1);
    const saved=writes[0][0].updateOne.update.$setOnInsert;
    assert.equal(saved.actor,userId);
    assert.equal(saved.actorRole,'user');
    assert.equal(saved.expiresAt.getTime()-saved.receivedAt.getTime(),90*86400000);
    assert.equal(saved.keywords,undefined);
    assert.equal(statisticsWrites.length,1);
    assert.equal(statisticsWrites[0].filter._id,userId);
    assert.equal(statisticsWrites[0].update.$inc['totals.searches'],1);
    assert.equal(statisticsWrites[0].update.$inc['totals.keywordCount'],2);
    // Retry after an acknowledged or lost response cannot increment totals twice.
    assert.equal((await request('/admin-logs/batch',{actor:userId,method:'POST',body:{events:[entry]}})).status,200);
    assert.equal(statisticsWrites.length,1);
    // Preview/export events never count as searches.
    const preview={...event(),kind:'preview',config:{}};
    assert.equal((await request('/admin-logs/batch',{actor:userId,method:'POST',body:{events:[preview]}})).status,200);
    assert.equal(statisticsWrites.length,1);
    const accounts=await request('/admin-logs/accounts?q='+encodeURIComponent('.*[x]'),{actor:adminId});
    assert.equal(accounts.status,200);
    assert.equal(accountQueries[0].$or[0].name.$regex,String.raw`\.\*\[x\]`);
    assert.equal((await request('/admin-logs/accounts?q[$ne]=x',{actor:adminId})).status,400);
    const stats=await request(`/admin-logs/accounts/${userId}/statistics`,{actor:adminId});
    assert.equal(stats.status,200);assert.equal(stats.body.data._id,userId);
    assert.equal((await request('/admin-logs/accounts/invalid/statistics',{actor:adminId})).status,400);
    const invalid=await request('/admin-logs/batch',{actor:userId,method:'POST',body:{events:[{...entry,actor:adminId,keywords:['SECRET']}]}});
    assert.equal(invalid.status,400);
    assert.equal(writes.length,3);
    assert.equal((await request('/admin-logs',{actor:adminId})).status,200);
    assert.equal((await request('/admin-logs/summary',{actor:adminId})).status,200);
    assert.equal((await request('/admin-logs?actor[$ne]=anything',{actor:adminId})).status,400);
    const pending=event();
    failStatistics=true;
    const failed=await request('/admin-logs/batch',{actor:userId,method:'POST',body:{events:[pending]}});
    assert.equal(failed.status,500);
    assert.equal(failed.body.accepted,undefined);
    assert.equal(statisticsWrites.length,1);
    failStatistics=false;
    assert.equal((await request('/admin-logs/batch',{actor:userId,method:'POST',body:{events:[pending]}})).status,200);
    assert.equal(statisticsWrites.length,2);
    assert.equal((await request('/search-events/history',{actor:adminId})).status,404);
    assert.equal((await request('/search-events',{actor:userId,method:'POST',body:{}})).status,404);
  }finally{
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
  }
});

test('numeric lifetime increments preserve outcomes, count coverage and per-format attempts',()=>{
  const first=event();first.config.keywordCount=3;first.config.excludedKeywordCount=0;
  const interrupted={...event(),status:'interrupted',metrics:{durationMs:0,filesFailed:1}};
  const totals=incrementsFor([first,interrupted]);
  assert.equal(totals['totals.searches'],2);
  assert.equal(totals['totals.filesProcessed'],3);
  assert.equal(totals['totals.filesFailed'],1);
  assert.equal(totals['totals.keywordCount'],3);
  assert.equal(totals['totals.keywordCountKnownSearches'],1);
  assert.equal(totals['totals.excludedKeywordCountKnownSearches'],1);
  assert.equal(totals['totals.timedSearches'],1);
  assert.equal(totals['totals.durationMs'],20);
  assert.equal(totals['formats.pdf.processed'],6);
  assert.equal(totals['statuses.interrupted'],1);
  assert.equal(totals['modes.standard.content'],2);
  assert.equal(AccountSearchStats.schema.indexes().some(([,options])=>options.expireAfterSeconds!==undefined),false);
  assert.equal(SearchStatsReceipt.schema.path('_id').instance,'String');
});

test('keyword counts are optional for older clients and strictly numeric for new clients',()=>{
  assert.equal(eventSchema.safeParse(event()).success,true);
  for(const value of [-1,1.5,'SECRET',1e10]){
    const input=event();input.config.keywordCount=value;
    assert.equal(eventSchema.safeParse(input).success,false);
  }
  const input=event();input.config.keywordCount=2;input.config.excludedKeywordCount=0;
  assert.equal(eventSchema.safeParse(input).success,true);
});

test('real Mongoose update casting preserves aggregate increments and transaction session',async t=>{
  const session={testSession:true};let captured;
  t.mock.method(AccountSearchStats.collection,'updateOne',async (filter,update,options)=>{
    captured={filter,update,options};return {acknowledged:true,upsertedCount:1};
  });
  const input=event();input.config.keywordCount=2;
  await AccountSearchStats.updateOne({_id:userId},{
    $inc:incrementsFor([input]),$min:{trackingSince:new Date()},
    $max:{lastReceivedAt:new Date(),lastSearchAt:new Date()},
  },{upsert:true,session});
  assert.equal(String(captured.filter._id),userId);
  assert.equal(captured.update.$inc['totals.searches'],1);
  assert.equal(captured.update.$inc['totals.keywordCount'],2);
  assert.equal(captured.update.$setOnInsert?.totals,undefined);
  assert.ok(captured.update.$min.trackingSince instanceof Date);
  assert.deepEqual(captured.options.session,session);
});
