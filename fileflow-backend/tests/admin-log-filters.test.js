import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import AccountSearchStats from '../src/models/AccountSearchStats.js';
import { batchSchema, eventSchema, filterSchema } from '../src/validations/adminLog.validation.js';
import { buildFilter, summarize } from '../src/controllers/adminLog.controller.js';
import { incrementsFor } from '../src/services/searchStatistics.js';

const semanticEvent=()=>({eventId:crypto.randomUUID(),schemaVersion:1,kind:'search',status:'success',
  startedAt:'2026-11-14T10:00:00.000Z',finishedAt:'2026-11-14T10:00:01.000Z',
  environment:{appVersion:'0.0.0',engineVersion:'1.0.0',pythonVersion:'3.11.0',os:'windows',osRelease:'10',parsers:{}},
  config:{mode:'semantic',scope:'content',formats:['doc','msg'],resultLimit:20,semanticBackend:'onnx',semanticDevice:'cpu',semanticFallback:false,keywordCount:1},
  metrics:{durationMs:900,filesProcessed:4,filesMatched:2,passages:5,cacheHits:3,cacheMisses:1,warmStart:false,
    modelLoadMs:400,prepareMs:300,scoringMs:5,passagesPrepared:12,passagesScored:40,firstResultMs:850},
  formats:[{format:'doc',processed:2,failed:0,matched:1,passages:2,processingMs:100}],errors:[]});
const where=filter=>filter.$and||[filter];

test('the real Python semantic event passes the closed schema',()=>{
  const fixture=JSON.parse(readFileSync(new URL('./fixtures/python-semantic-event.json',import.meta.url),'utf8'));
  const [event]=batchSchema.parse(fixture).events;
  assert.equal(event.config.mode,'semantic');
  assert.ok(event.metrics.modelLoadMs>=0);
  assert.ok(['onnx','onnx-int8','torch','other'].includes(event.config.semanticBackend));
});

test('semantic fields stay closed: unknown runtimes, text and oversize limits are rejected',()=>{
  assert.equal(eventSchema.safeParse(semanticEvent()).success,true);
  for(const config of [{semanticBackend:'my-model'},{semanticDevice:'quantum'},{resultLimit:500},{semanticFallback:'GPU missing on PC-NAME'}]){
    assert.equal(eventSchema.safeParse({...semanticEvent(),config:{...semanticEvent().config,...config}}).success,false,JSON.stringify(config));
  }
  assert.equal(eventSchema.safeParse({...semanticEvent(),metrics:{...semanticEvent().metrics,query:'secret'}}).success,false);
  for(const code of ['SEMANTIC_NOT_INSTALLED','SEMANTIC_TIMEOUT','SEMANTIC_WORKER_FAILED','INVALID_INPUT']){
    const event={...semanticEvent(),status:'failed',errors:[{code,stage:'search',format:'other',exception:'RuntimeError',count:1}]};
    assert.equal(eventSchema.safeParse(event).success,true,code);
  }
});

test('every filter maps to a fixed field and never to a client-chosen operator',()=>{
  const {filter,sort}=buildFilter({mode:'fuzzy',kind:'search',status:'failed',code:'PARSER_FAILURE',stage:'extraction',exception:'ValueError',
    format:'doc',version:'1.2.0',engineVersion:'1.0.0',pythonVersion:'3.11.9',os:'windows',osRelease:'10',role:'admin',
    caseSensitive:'true',wholeWord:'false',fuzzyTolerance:'3',dateFilter:'week',sizeFilter:'large',
    semanticBackend:'onnx',semanticDevice:'gpu',warmStart:'true',hasErrors:'true',hasMatches:'false',usedCache:'true',
    minDurationMs:'100',maxDurationMs:'5000',minFiles:'2',minKeywords:'1',maxKeywords:'4',sort:'slowest'});
  const clauses=where(filter);
  const find=path=>clauses.find(clause=>path in clause)?.[path];
  assert.equal(find('config.mode'),'fuzzy');
  assert.equal(find('issues.stage'),'extraction');
  assert.equal(find('issues.exception'),'ValueError');
  assert.equal(find('actorRole'),'admin');
  assert.equal(find('config.caseSensitive'),true);
  assert.deepEqual(find('config.wholeWord'),{$ne:true});
  assert.equal(find('config.fuzzyTolerance'),3);
  assert.equal(find('environment.pythonVersion'),'3.11.9');
  assert.equal(find('config.semanticDevice'),'gpu');
  assert.deepEqual(find('metrics.durationMs'),{$gte:100,$lte:5000});
  assert.deepEqual(find('metrics.filesProcessed'),{$gte:2});
  assert.deepEqual(find('config.keywordCount'),{$gte:1,$lte:4});
  assert.deepEqual(find('issues.0'),{$exists:true});
  assert.deepEqual(find('metrics.filesMatched'),{$not:{$gt:0}});
  assert.deepEqual(find('metrics.cacheHits'),{$gt:0});
  assert.ok(find('expiresAt').$gt instanceof Date);
  assert.deepEqual(sort,{'metrics.durationMs':-1,_id:-1});
  assert.deepEqual(buildFilter({}).sort,{receivedAt:-1,_id:-1});
  for(const bad of [{mode:'regex'},{caseSensitive:'yes'},{minDurationMs:'-1'},{sort:'$natural'},{'metrics.durationMs':'1'},{osRelease:'PC-NAME'},{stage:{$ne:1}}]){
    assert.equal(filterSchema.safeParse(bad).success,false,JSON.stringify(bad));
  }
});

test('summary adds a daily timeline, operation counts and a semantic section',()=>{
  const standard={...semanticEvent(),config:{mode:'standard',scope:'content'},metrics:{durationMs:50,filesProcessed:10,filesMatched:1,passages:3},receivedAt:'2026-11-13T09:00:00.000Z'};
  const fallback={...semanticEvent(),status:'partial_failure',config:{...semanticEvent().config,semanticFallback:true,semanticDevice:'gpu'},receivedAt:'2026-11-14T09:00:00.000Z'};
  const preview={...semanticEvent(),kind:'preview',config:{},metrics:{durationMs:4,filesProcessed:1},receivedAt:'2026-11-14T09:30:00.000Z'};
  const summary=summarize([standard,{...semanticEvent(),receivedAt:'2026-11-14T08:00:00.000Z'},fallback,preview]);
  assert.deepEqual(summary.kinds,{search:3,preview:1});
  assert.deepEqual(summary.timeline.map(day=>[day.day,day.events,day.failures]),[['2026-11-13',1,0],['2026-11-14',3,1]]);
  assert.equal(summary.semantic.searches,2);
  assert.equal(summary.semantic.fallbacks,1);
  assert.equal(summary.semantic.cacheHits,6);
  assert.equal(summary.semantic.medianModelLoadMs,400);
  assert.equal(summary.semantic.runtimes.length,2);
  assert.equal(summary.matchedFiles,5);
  const semantic=summary.modes.find(mode=>mode.mode==='semantic');
  assert.equal(semantic.failures,1);assert.equal(semantic.passages,10);
});

test('per-account totals keep per-mode and semantic runtime numbers, never text',()=>{
  const totals=incrementsFor([semanticEvent(),{...semanticEvent(),config:{mode:'fuzzy',scope:'name'},metrics:{durationMs:10,filesProcessed:2}}]);
  assert.equal(totals['modeTotals.semantic.searches'],1);
  assert.equal(totals['modeTotals.semantic.durationMs'],900);
  assert.equal(totals['modeTotals.fuzzy.filesProcessed'],2);
  assert.equal(totals['semantic.modelLoadMs'],400);
  assert.equal(totals['semantic.runtimes.onnx_cpu'],1);
  assert.equal(totals['totals.cacheHits'],3);
  assert.equal(totals['totals.passagesPrepared'],12);
  assert.ok(Object.values(totals).every(value=>typeof value==='number'));
  assert.ok(AccountSearchStats.schema.path('modeTotals'));
  assert.ok(AccountSearchStats.schema.path('semantic'));
});
