export function getAdHocViewModel(state) {
  const active = state.adHocSessionState.sessionsById[state.adHocSessionState.activeSessionId];
  return {
    active,
    lineage: buildLineage(state.adHocSessionState.sessionsById, active.id)
  };
}

function buildLineage(all, startId) {
  const out = [];
  let cursor = all[startId];
  while (cursor) {
    out.push(cursor.id);
    cursor = cursor.parentSessionId ? all[cursor.parentSessionId] : null;
  }
  return out.reverse();
}
