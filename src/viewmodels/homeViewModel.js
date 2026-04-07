import { filterLogs } from '../shared/logFilters.js';

export function inferHomeMode(state) {
  const preferred = state.appShellState.homeModePreference;
  const criticalOverride = state.foundryState.criticalOverrideMode;
  const jobState = state.foundryState.activeJob.state;

  if (criticalOverride) return criticalOverride;
  if (preferred) return preferred;
  if (jobState === 'blocked') return 'foundry-blocked';
  if (jobState === 'running') return 'foundry-run';
  if (!state.foundryState.readinessComplete) return 'morning-readiness';
  if (state.foundryState.documentAttentionRequired) return 'document-attention';
  return 'daytime-analysis';
}

export function getHomeViewModel(state) {
  const mode = inferHomeMode(state);
  const morningMode = ['foundry-blocked', 'foundry-run', 'morning-readiness'].includes(mode);
  return {
    mode,
    morningMode,
    pathStage: morningMode ? 'Ingest' : 'Explore',
    logPreview: filterLogs(state.logbookState.entries, state.appShellState.logFilters).slice(0, 4),
    blockerReason: state.foundryState.activeJob.blockerReason
  };
}
