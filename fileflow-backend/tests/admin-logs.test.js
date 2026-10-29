import test from 'node:test';
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
  const writes=[];
  let reads=0;
  const record={...event(),actor:{_id:userId,name:'Test user'},receivedAt:new Date().toISOString()};
  t.mock.method(User,'findById',async id=>({id,_id:id,role:id===adminId?'admin':'user'}));
  t.mock.method(AdminLog,'bulkWrite',async batch=>{writes.push(batch);return {};});
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
    assert.equal(reads,0);
    const entry=event();
    const result=await request('/admin-logs/batch',{actor:userId,method:'POST',body:{events:[entry,entry]}});
    assert.equal(result.status,200);
    assert.deepEqual(result.body.accepted,[entry.eventId]);
    assert.equal(writes[0].length,1);
    const saved=writes[0][0].updateOne.update.$setOnInsert;
    assert.equal(saved.actor,userId);
    assert.equal(saved.actorRole,'user');
    assert.equal(saved.expiresAt.getTime()-saved.receivedAt.getTime(),90*86400000);
    assert.equal(saved.keywords,undefined);
    const invalid=await request('/admin-logs/batch',{actor:userId,method:'POST',body:{events:[{...entry,actor:adminId,keywords:['SECRET']}]}});
    assert.equal(invalid.status,400);
    assert.equal(writes.length,1);
    assert.equal((await request('/admin-logs',{actor:adminId})).status,200);
    assert.equal((await request('/admin-logs/summary',{actor:adminId})).status,200);
    assert.equal((await request('/admin-logs?actor[$ne]=anything',{actor:adminId})).status,400);
    assert.equal((await request('/search-events/history',{actor:adminId})).status,404);
    assert.equal((await request('/search-events',{actor:userId,method:'POST',body:{}})).status,404);
  }finally{
    server.closeAllConnections();
    await new Promise(resolve=>server.close(resolve));
  }
});
