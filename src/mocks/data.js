export function mockHeatmap() {
  const statuses = ['available', 'ingested', 'missing', 'failed', 'partial', 'awaiting-validation'];
  return Array.from({ length: 28 }).map((_, idx) => ({
    id: `day_${idx}`,
    date: `2026-03-${String(idx + 4).padStart(2, '0')}`,
    sourceAvailability: `Source ${((idx % 5) + 1)} available`,
    ingestDayStatus: statuses[idx % statuses.length],
    ingestHistory: idx % 5 === 0 ? 'late file + retry' : 'on time',
    downstreamStatus: idx % 6 === 3 ? 'blocked semantic refresh' : 'healthy',
    warnings: idx % 7 === 0 ? 'schema drift in optional field' : 'none'
  }));
}

export function mockLogEntries() {
  return [
    { id: 'l1', at: '07:14', source: 'Foundry', severity: 'info', title: 'Fed file detected for April 6.', detail: 'Source watch path confirmed checksum + naming contract.' },
    { id: 'l2', at: '07:16', source: 'Foundry', severity: 'warn', title: 'Validation complete with 3 schema warnings.', detail: 'Warnings are non-blocking optional fields in settlement extensions.' },
    { id: 'l3', at: '07:25', source: 'Foundry', severity: 'info', title: 'Derived balance tables refreshed successfully.', detail: '29 derived tables updated in 6m 11s.' },
    { id: 'l4', at: '07:27', source: 'Foundry', severity: 'warn', title: 'Semantic refresh blocked by counterparty aggregation.', detail: 'Dependency job agg_counterparty_92 is delayed by one partition.' },
    { id: 'l5', at: '09:03', source: 'Lenses', severity: 'ok', title: 'Anomaly lens updated with fresh baseline.', detail: 'Signals stable except one counterparty cluster.' },
    { id: 'l6', at: '09:14', source: 'Ad Hoc', severity: 'info', title: 'Analysis session opened for settlement spike.', detail: 'Session analysis_8841 captured interpretation + filters.' },
    { id: 'l7', at: '09:22', source: 'Documents', severity: 'warn', title: 'Document parser fallback triggered.', detail: 'Fallback to structural OCR on 4 scanned pages.' },
    { id: 'l8', at: '09:24', source: 'Feedback', severity: 'info', title: 'Recognition Check acknowledged by operator.', detail: 'Scope set to current document family for reclassification.' }
  ];
}
