import { card, logRow } from '../shared/renderBits.js';
import { getLogbookViewModel } from '../viewmodels/logbookViewModel.js';

export function renderDocumentsView(state) {
  return `<h2>Documents</h2>
    <div class="grid cols-2">
      ${card('Document Jobs Queue', `<div class="list">${state.documentPipelineState.queue.map((q) => `<div class="row"><div><strong>${q.name}</strong><p class="subtle">${q.stage} · Owner ${q.owner} · ETA ${q.eta}</p></div><span class="status ${q.risk === 'medium' ? 's-warn' : 's-active'}">risk ${q.risk}</span></div>`).join('')}</div>`) }
      ${card('Pipeline Car-Wash', `<div class="chips">${state.documentPipelineState.stageTimeline.map((s) => `<span class="chip ${s.status === 'active' ? 'chip-active' : ''}">${s.stage}</span>`).join('')}</div><p class="subtle mt-12"><strong>Current stage:</strong> ${state.documentPipelineState.currentStage}</p><p class="subtle">${state.documentPipelineState.stageDetail}</p><ul class="subtle">${state.documentPipelineState.stageWarnings.map((w) => `<li>${w}</li>`).join('')}</ul>`) }
    </div>
    ${card('Current Stage Detail', '<p class="subtle">Next up: reviewer package assembly, citation alignment, and approval routing preview.</p><div class="row mt-12"><button class="ghost">Open reviewer packet</button><button class="ghost">Preview extracted graph</button></div>')}
    ${card('Document Logbook Preview', state.logbookState.entries.filter((e) => e.source === 'Documents').map(logRow).join(''))}`;
}

export function renderFeedbackView(state) {
  return `<h2>Feedback</h2>
    <div class="grid cols-2">
      ${card('Review Surface', `<div class="list">${state.feedbackState.reviewItems.map((item) => `<div class="row"><div><strong>${item.item}</strong><p class="subtle">Owner ${item.owner}</p></div><span class="status ${item.status === 'applied' ? 's-healthy' : 's-warn'}">${item.status}</span></div>`).join('')}</div><div class="row mt-12"><button class="solid" data-action="apply-feedback">Apply pending feedback</button><button class="ghost">Open review diff</button></div>`) }
      ${card('Recognition Check', `<p><strong>You said:</strong> This is a control, not a decision.</p><p><strong>Normalized recognition:</strong> ${state.feedbackState.recognitionStatus}</p><p class="subtle">Feedback loop confirms normalization before applying to related content.</p><div class="chips"><span class="chip">scope: current family</span><span class="chip">confidence: high</span></div>`) }
    </div>
    ${card('Feedback History', `<div class="list">${state.feedbackState.history.map((h) => `<div>${h}</div>`).join('')}</div>`)}`;
}

export function renderArtifactsView(state) {
  return `<h2>Artifacts</h2>
    ${card('Artifacts Shelf', `<div class="grid cols-3">${state.artifactState.shelf.map((a) => `<div class="card shelf-item"><div class="row"><strong>${a.title}</strong><span class="status ${a.readiness === 'meeting-ready' ? 's-healthy' : 's-active'}">${a.readiness}</span></div><p class="subtle">${a.type} · updated ${a.updated} · trust ${a.trust}</p><div class="row mt-12"><button class="ghost" data-action="open-artifact" data-artifact-id="${a.id}">Open</button><button class="ghost" data-action="pin-artifact" data-artifact-id="${a.id}">Pin</button></div></div>`).join('')}</div>`) }
    <div class="grid cols-2 mt-12">
      ${card('Saved Sessions', `<div class="list">${state.artifactState.savedSessions.map((s) => `<div>${s}</div>`).join('')}</div>`)}
      ${card('Meeting-ready Outputs', `<div class="list">${state.artifactState.meetingOutputs.map((m) => `<div>${m}</div>`).join('')}</div><div class="row mt-12"><button class="solid">Export selected outputs</button></div>`) }
    </div>`;
}

export function renderLogbookView(state) {
  const vm = getLogbookViewModel(state);
  return `<h2>Logbook</h2>${card('Unified Operational Log', '<p class="subtle">Filter by source, severity, and search from the drawer controls. Human-readable entries first with expandable detail.</p>')}${card('Entries', vm.logs.map(logRow).join(''))}`;
}
