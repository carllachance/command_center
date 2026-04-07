export function filterLogs(entries, filters) {
  return entries.filter((entry) => {
    const sourceMatch = filters.source === 'all' || entry.source === filters.source;
    const severityMatch = filters.severity === 'all' || entry.severity === filters.severity;
    const query = filters.search.trim().toLowerCase();
    const text = `${entry.title} ${entry.detail}`.toLowerCase();
    const searchMatch = !query || text.includes(query);
    return sourceMatch && severityMatch && searchMatch;
  });
}
