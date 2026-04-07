import { filterLogs } from '../shared/logFilters.js';

export function getFoundryViewModel(state) {
  const severity = state.appShellState.foundryLogSeverity;
  const logs = filterLogs(state.logbookState.entries, { source: 'Foundry', severity, search: '' });
  const selectedDay = state.foundryState.heatmapDays.find((d) => d.id === state.foundryState.selectedDayId) || null;
  const blockedMilestone = state.foundryState.milestones.find((m) => m.state === 'blocked') || null;
  return { logs, selectedDay, blockedMilestone };
}
