import { z } from 'zod';

export const formats = 'pdf txt docx doc rtf xlsx xls xlsm xlsb ods csv pptx epub eml msg zip json xml html htm md css py js jsx ts tsx java c cpp cs go rs php rb sh other'.split(' ');
export const codes = 'PERMISSION_DENIED FILE_MISSING DOCUMENT_ENCRYPTED DOCUMENT_CORRUPT UNSUPPORTED_FORMAT ENCODING_ERROR MEMORY_EXHAUSTED WORKER_CRASH PARSER_FAILURE SEARCH_FAILURE PREVIEW_FAILURE EXPORT_FAILURE INTERRUPTED SEMANTIC_NOT_INSTALLED SEMANTIC_TIMEOUT SEMANTIC_WORKER_FAILED INVALID_INPUT'.split(' ');
export const kinds = ['search', 'preview', 'export'];
export const modes = ['standard', 'fuzzy', 'semantic'];
export const semanticBackends = ['onnx', 'onnx-int8', 'torch', 'other'];
export const outcomes = ['success', 'partial_failure', 'failed', 'cancelled', 'interrupted'];
export const stages = 'discovery metadata prefilter extraction matching worker search preview export'.split(' ');
const number = z.number().finite().nonnegative().max(1e12);
const count = number.int().max(1e9);
const version = z.string().regex(/^[0-9][0-9A-Za-z.+-]{0,39}$/);
export const exceptions = 'PermissionError FileNotFoundError UnicodeDecodeError MemoryError BrokenProcessPool ValueError OSError BadZipFile RuntimeError OtherError ArrowInvalid CalamineError FileDataError PackageNotFoundError'.split(' ');
const parserNames = ['PyMuPDF', 'python-docx', 'python-calamine', 'pyarrow', 'python-pptx', 'regex', 'XlsxWriter'];
const metrics = z.strictObject({
  durationMs: number, engineMs: number.optional(), discoveryMs: number.optional(), processingMs: number.optional(), prefilterMs: number.optional(),
  firstResultMs: number.nullable().optional(), cancelResponseMs: number.nullable().optional(),
  filesDiscovered: count.optional(), filesEligible: count.optional(), filesProcessed: count.optional(), filesSkipped: count.optional(),
  filesPending: count.optional(), filesFailed: count.optional(), filesMatched: count.optional(), passages: count.optional(),
  cacheHits: count.optional(), cacheMisses: count.optional(), workerCount: count.max(256).optional(), warmStart: z.boolean().optional(),
  errorGroupsOmitted:count.optional(), foldersSkipped:count.optional(),
  // Semantic search: model start/query time, time spent preparing uncached files and ranking.
  modelLoadMs: number.optional(), prepareMs: number.optional(), scoringMs: number.optional(),
  passagesPrepared: count.optional(), passagesScored: count.optional(),
});
export const eventSchema = z.strictObject({
  eventId: z.uuid(), schemaVersion: z.literal(1), kind: z.enum(['search', 'preview', 'export']), searchId: z.uuid().optional(),
  status: z.enum(outcomes), startedAt: z.iso.datetime({ offset: true }), finishedAt: z.iso.datetime({ offset: true }),
  environment: z.strictObject({
    appVersion: version, engineVersion: version, pythonVersion: version, os: z.enum(['windows', 'other']),
    osRelease: z.string().regex(/^(?:[0-9.]{1,30}|unknown)$/), parsers: z.partialRecord(z.enum(parserNames), version),
  }),
  config: z.strictObject({
    keywordCount: count.optional(), excludedKeywordCount: count.optional(),
    mode: z.enum(['standard', 'fuzzy', 'semantic']).optional(), scope: z.enum(['name', 'content']).optional(),
    caseSensitive: z.boolean().optional(), wholeWord: z.boolean().optional(), matchAll: z.boolean().optional(), hasExclusions: z.boolean().optional(),
    fuzzyTolerance: z.number().int().min(1).max(3).optional(), dateFilter: z.enum(['any','24h','week','month','year']).optional(),
    sizeFilter: z.enum(['any','small','medium','large','huge']).optional(), formats: z.array(z.enum(formats)).max(64).optional(),
    resultLimit: z.number().int().min(1).max(100).optional(), semanticBackend: z.enum(semanticBackends).optional(),
    semanticDevice: z.enum(['cpu','gpu']).optional(), semanticFallback: z.boolean().optional(),
  }), metrics,
  formats: z.array(z.strictObject({format:z.enum(formats), processed:count, failed:count, matched:count, passages:count, processingMs:number.optional()})).max(64),
  errors: z.array(z.strictObject({
    code: z.enum(codes), stage:z.enum(stages), format:z.enum(formats), count:count.min(1),
    exception:z.enum(exceptions),
  })).max(64),
}).superRefine((event, context) => {
  if (new Date(event.finishedAt) < new Date(event.startedAt)) context.addIssue({code:'custom', message:'Invalid event timestamps'});
  if (event.kind === 'search' && (!event.config.mode || !event.config.scope)) context.addIssue({code:'custom', message:'Search configuration required'});
});
export const batchSchema = z.strictObject({events:z.array(eventSchema).min(1).max(10)});

// Query strings never become arbitrary MongoDB objects/regular expressions.
const flag = z.enum(['true', 'false']).transform(value => value === 'true');
const amount = z.coerce.number().finite().nonnegative().max(1e12);
export const sorts = ['newest', 'oldest', 'slowest', 'fastest', 'most_files', 'most_failures', 'most_results'];
export const filterSchema = z.strictObject({
  kind:z.enum(kinds).optional(), status:z.enum(outcomes).optional(),
  mode:z.enum(modes).optional(), scope:z.enum(['name','content']).optional(),
  format:z.enum(formats).optional(), code:z.enum(codes).optional(),
  stage:z.enum(stages).optional(), exception:z.enum(exceptions).optional(),
  version:version.optional(), engineVersion:version.optional(), pythonVersion:version.optional(),
  os:z.enum(['windows','other']).optional(), osRelease:z.string().regex(/^(?:[0-9.]{1,30}|unknown)$/).optional(),
  role:z.enum(['user','admin']).optional(), actor:z.string().regex(/^[a-fA-F0-9]{24}$/).optional(),
  eventId:z.uuid().optional(), searchId:z.uuid().optional(),
  caseSensitive:flag.optional(), wholeWord:flag.optional(), matchAll:flag.optional(), hasExclusions:flag.optional(),
  fuzzyTolerance:z.coerce.number().int().min(1).max(3).optional(),
  dateFilter:z.enum(['any','24h','week','month','year']).optional(), sizeFilter:z.enum(['any','small','medium','large','huge']).optional(),
  semanticBackend:z.enum(semanticBackends).optional(), semanticDevice:z.enum(['cpu','gpu']).optional(), semanticFallback:flag.optional(),
  warmStart:flag.optional(), hasErrors:flag.optional(), hasMatches:flag.optional(), usedCache:flag.optional(),
  minDurationMs:amount.optional(), maxDurationMs:amount.optional(), minFiles:amount.optional(), maxFiles:amount.optional(),
  minKeywords:amount.optional(), maxKeywords:amount.optional(),
  from:z.iso.datetime({offset:true}).optional(), to:z.iso.datetime({offset:true}).optional(),
  sort:z.enum(sorts).default('newest'),
  page:z.coerce.number().int().min(1).max(10000).default(1), limit:z.coerce.number().int().min(1).max(100).default(25),
});
