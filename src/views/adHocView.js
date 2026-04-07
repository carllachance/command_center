import { card } from '../shared/renderBits.js';
import { getAdHocViewModel } from '../viewmodels/adHocViewModel.js';

function renderEvidenceBody(session, tab) {
  if (tab === 'source-slice') return `<p class="subtle">${session.sourceSlice}</p>`;
  if (tab === 'working-table') return `<table class="table"><tr><th>Counterparty</th><th>Settlement</th><th>Δ vs baseline</th><th>Note</th></tr>${session.workingTable.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>`;
  if (tab === 'summary') return `<p>${session.summaryTable}</p>`;
  if (tab === 'walker') return `<div class="walker-card"><p><strong>Walker</strong></p><p class="subtle">${session.walkerConfig}</p><button class="ghost">Open Walker workspace</button></div>`;
  return `<p class="subtle">${session.runRecord}</p>`;
}

export function renderAdHocView(state) {
  const vm = getAdHocViewModel(state);
  const s = vm.active;
  const tabs = [
    ['source-slice', 'Source slice'],
    ['working-table', 'Working table'],
    ['summary', 'Summary'],
    ['walker', 'Walker'],
    ['run-record', 'Run record']
  ];

  return `<h2>Ad Hoc</h2>
    <section class="focus-strip card"><div><h3>Current Focus</h3><p><strong>${s.currentFocus}</strong></p><p class="subtle">Lineage: ${vm.lineage.join(' → ')}</p></div><div class="chips"><span class="chip">Root ${state.adHocSessionState.rootSessionId}</span><span class="chip">Current ${s.id}</span></div></section>
    <div class="grid cols-2 mt-12">
      ${card('Ask', `<input id="askInput" class="text-input" value="${s.rootQuestion}"/><button class="solid mt-12" data-action="interpret-question">Interpret question</button><p class="subtle mt-12">Interpreted: ${s.interpretedQuestion}</p>`)}
      ${card('Answer', `<p>${s.answer}</p><p class="subtle">${s.summaryTable}</p>`)}
    </div>
    <div class="grid cols-2 mt-12">
      ${card('Primary Chart', '<div class="chart-placeholder">Counterparty spike profile placeholder</div>')}
      ${card('Run Record', `<p>${s.runRecord}</p>`)}
    </div>
    ${card('Evidence', `<div class="chips">${tabs.map(([id, label]) => `<button class="chip chip-btn ${state.adHocSessionState.activeEvidenceTab === id ? 'chip-active' : ''}" data-action="switch-evidence-tab" data-tab="${id}">${label}</button>`).join('')}</div><div class="mt-12">${renderEvidenceBody(s, state.adHocSessionState.activeEvidenceTab)}</div>`) }
    ${card('Refocus', `<div class="row wrap"><button class="ghost" data-action="refine-current" data-suggestion="narrow time window">Refine current</button><button class="ghost" data-action="branch-analysis" data-suggestion="compare against baseline">Branch analysis</button><button class="ghost" data-action="reset-original">Reset to original</button></div><div class="chips mt-12"><button class="chip chip-btn" data-action="refine-current" data-suggestion="exclude dates">exclude dates</button><button class="chip chip-btn" data-action="refine-current" data-suggestion="switch to per-second">switch to per-second</button><button class="chip chip-btn" data-action="branch-analysis" data-suggestion="explain spike">explain spike</button><button class="chip chip-btn" data-action="branch-analysis" data-suggestion="drill to raw transactions">drill to raw transactions</button></div>`) }
  `;
}
