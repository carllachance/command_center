import { milestoneStateClass, severityClass } from './status.js';

export function card(title, body) {
  return `<section class="card"><h3>${title}</h3>${body}</section>`;
}

export function logRow(entry) {
  return `<details class="log-entry"><summary><span>${entry.at} · ${entry.source}</span><span class="status ${severityClass(entry.severity)}">${entry.severity}</span><strong>${entry.title}</strong></summary><p class="subtle">${entry.detail}</p></details>`;
}

export function milestoneRow(m) {
  return `<div class="milestone-row ${m.state === 'blocked' ? 'blocked' : ''}"><div><strong>${m.title}</strong><p class="subtle">${m.detail}</p></div><span class="status ${milestoneStateClass(m.state)}">${m.at}</span></div>`;
}
