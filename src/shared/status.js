/**
 * Badge semantics:
 * healthy=complete/ok, active=in-progress/info, warn=attention, error=blocked/failure, muted=pending/neutral.
 */
export function severityClass(severity) {
  return ({ ok: 's-healthy', info: 's-active', warn: 's-warn', error: 's-error' }[severity]) || 's-muted';
}

export function jobStateClass(jobState) {
  return ({ idle: 's-muted', running: 's-active', blocked: 's-error', complete: 's-healthy' }[jobState]) || 's-muted';
}

export function milestoneStateClass(state) {
  return ({ pending: 's-muted', active: 's-active', done: 's-healthy', blocked: 's-error' }[state]) || 's-muted';
}

export function ingestDayClass(state) {
  return ({
    available: 'day-available',
    ingested: 'day-ingested',
    missing: 'day-missing',
    failed: 'day-failed',
    partial: 'day-partial',
    'awaiting-validation': 'day-awaiting-validation'
  }[state]) || 'day-available';
}
