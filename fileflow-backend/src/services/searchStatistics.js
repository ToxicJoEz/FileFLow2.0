const metrics = ['filesDiscovered', 'filesEligible', 'filesProcessed', 'filesSkipped',
  'filesPending', 'filesFailed', 'filesMatched', 'passages'];

export function incrementsFor(events) {
  const increments = {};
  const add = (key, value) => { increments[key] = (increments[key] || 0) + value; };
  for (const event of events) {
    add('totals.searches', 1);
    add(`statuses.${event.status}`, 1);
    add(`modes.${event.config.mode}.${event.config.scope}`, 1);
    for (const field of metrics) add(`totals.${field}`, event.metrics[field] || 0);
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
