const metrics = ['filesDiscovered', 'filesEligible', 'filesProcessed', 'filesSkipped',
  'filesPending', 'filesFailed', 'filesMatched', 'passages', 'cacheHits', 'cacheMisses',
  'passagesPrepared', 'passagesScored'];
const timings = ['modelLoadMs', 'prepareMs', 'scoringMs'];

export function incrementsFor(events) {
  const increments = {};
  const add = (key, value) => { increments[key] = (increments[key] || 0) + value; };
  for (const event of events) {
    add('totals.searches', 1);
    add(`statuses.${event.status}`, 1);
    add(`modes.${event.config.mode}.${event.config.scope}`, 1);
    for (const field of metrics) add(`totals.${field}`, event.metrics[field] || 0);
    const mode = `modeTotals.${event.config.mode}`;
    add(`${mode}.searches`, 1);
    add(`${mode}.filesProcessed`, event.metrics.filesProcessed || 0);
    add(`${mode}.filesMatched`, event.metrics.filesMatched || 0);
    add(`${mode}.passages`, event.metrics.passages || 0);
    if (['failed', 'partial_failure'].includes(event.status)) add(`${mode}.failures`, 1);
    if (event.status !== 'interrupted') {
      add(`${mode}.durationMs`, event.metrics.durationMs);
      add(`${mode}.timedSearches`, 1);
    }
    if (event.config.mode === 'semantic') {
      for (const field of timings) if (event.metrics[field] !== undefined) add(`semantic.${field}`, event.metrics[field]);
      if (event.config.semanticBackend) add(`semantic.runtimes.${event.config.semanticBackend}_${event.config.semanticDevice || 'cpu'}`, 1);
      if (event.config.semanticFallback) add('semantic.fallbacks', 1);
    }
    // An interrupted process has no reliable duration: do not treat it as zero.
    if (event.status !== 'interrupted') {
      add('totals.durationMs', event.metrics.durationMs);
      add('totals.timedSearches', 1);
    }
    for (const field of ['keywordCount', 'excludedKeywordCount']) {
      if (event.config[field] !== undefined) {
        add(`totals.${field}`, event.config[field]);
        add(`totals.${field}KnownSearches`, 1);
      }
    }
    for (const format of event.formats) {
      for (const field of ['processed', 'failed', 'matched', 'passages', 'processingMs']) {
        add(`formats.${format.format}.${field}`, format[field] || 0);
      }
    }
  }
  return increments;
}
