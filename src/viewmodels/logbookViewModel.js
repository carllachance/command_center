import { filterLogs } from '../shared/logFilters.js';

export function getLogbookViewModel(state) {
  return {
    logs: filterLogs(state.logbookState.entries, state.appShellState.logFilters)
  };
}
