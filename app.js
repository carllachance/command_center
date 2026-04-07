import { createInitialState, navItems } from './src/state/domainState.js';
import { filterLogs } from './src/shared/logFilters.js';
import { severityClass, jobStateClass } from './src/shared/status.js';
import { logRow } from './src/shared/renderBits.js';
import { renderHomeView } from './src/views/homeView.js';
import { renderFoundryView } from './src/views/foundryView.js';
import { renderLensesView } from './src/views/lensesView.js';
import { renderAdHocView } from './src/views/adHocView.js';
import { renderArtifactsView, renderDocumentsView, renderFeedbackView, renderLogbookView } from './src/views/otherViews.js';

const state = createInitialState();
const routes = {
  Home: renderHomeView,
  Foundry: renderFoundryView,
  Lenses: renderLensesView,
  'Ad Hoc': renderAdHocView,
  Documents: renderDocumentsView,
  Feedback: renderFeedbackView,
  Artifacts: renderArtifactsView,
  Logbook: renderLogbookView
};

function renderNav() {
  document.getElementById('navPrimary').innerHTML = navItems.map((item) => `<button class="nav-item ${state.appShellState.currentRoute === item ? 'active' : ''}" data-action="navigate" data-route="${item}">${item}</button>`).join('');
}

function renderContextRail() {
  const active = state.foundryState.activeJob;
  document.getElementById('contextRail').innerHTML = `
    <section class="card"><h3>Active Jobs</h3><div class="list"><div>${active.label}</div><div class="subtle">${active.id} · ${state.foundryState.runId}</div><span class="status ${jobStateClass(active.state)}">${active.state}</span><p class="subtle">${active.blockerReason}</p></div></section>
    <section class="card"><h3>Active Alerts</h3><div class="list"><span class="status s-warn">Counterparty aggregate delayed</span><span class="status s-error">1 failed source date</span></div></section>
    <section class="card"><h3>Recent Artifacts</h3><div class="list">${state.artifactState.recent.map((r) => `<div>${r}</div>`).join('')}</div></section>
    <section class="card"><h3>Pinned Views</h3><div class="list"><div>Anomaly lens</div><div>Weekly reporting lens</div><div>Run health snapshot</div></div></section>`;
}

function renderDrawer() {
  document.getElementById('drawerBody').innerHTML = filterLogs(state.logbookState.entries, state.appShellState.logFilters).map(logRow).join('');
}

function renderWorkspace() {
  document.getElementById('workspace').innerHTML = routes[state.appShellState.currentRoute](state);
}

function updateTopBar() {
  state.appShellState.lastRefreshedAt = new Date();
  document.getElementById('lastRefreshed').textContent = `Last refreshed ${state.appShellState.lastRefreshedAt.toLocaleTimeString()}`;
  document.getElementById('activeJobPill').textContent = state.foundryState.activeJob.state === 'running' ? '1 Active Job' : '1 Job Blocked';
  document.getElementById('activeJobPill').className = `badge ${severityClass(state.foundryState.activeJob.state === 'running' ? 'ok' : 'warn')}`;
}

function render() {
  renderNav();
  renderWorkspace();
  renderContextRail();
  renderDrawer();
  updateTopBar();
}

function addLog(source, severity, title, detail) {
  state.logbookState.entries.unshift({ id: `l_${Date.now()}`, at: new Date().toISOString().slice(11, 16), source, severity, title, detail });
}

function applyFoundryPhaseProgression() {
  const phase = state.foundryState.progressionPhase;
  const next = phase + 1;
  state.foundryState.progressionPhase = next;

  if (next === 1) {
    state.foundryState.activeJob = { ...state.foundryState.activeJob, state: 'running', label: 'Foundry run executing approved steps', blockerReason: 'No blocker. Transform and derived refresh in progress.' };
    state.foundryState.milestones = state.foundryState.milestones.map((m) => (m.id === 'm4' ? { ...m, title: 'Transform running', state: 'active', at: 'Running · 1m' } : m));
    addLog('Foundry', 'info', 'Foundry run started.', `Run id ${state.foundryState.runId}`);
    return;
  }

  if (next === 2) {
    state.foundryState.milestones = state.foundryState.milestones.map((m) => {
      if (m.id === 'm4') return { ...m, title: 'Transform complete', state: 'done', at: '08:01 UTC', detail: 'Transform completed successfully.' };
      if (m.id === 'm5') return { ...m, title: 'Derived refresh complete', state: 'done', at: '08:03 UTC', detail: 'Derived refresh completed on all partitions.' };
      if (m.id === 'm6') return { ...m, title: 'Semantic refresh running', state: 'active', at: 'Running · 2m', detail: 'Semantic refresh currently building lens indexes.' };
      return m;
    });
    addLog('Foundry', 'info', 'Transform and derived refresh completed.', 'Semantic refresh advanced to active.');
    return;
  }

  state.foundryState.activeJob = { ...state.foundryState.activeJob, state: 'complete', label: 'Foundry run complete', blockerReason: 'All stages complete. Ready for exploration.' };
  state.foundryState.readinessComplete = true;
  state.foundryState.milestones = state.foundryState.milestones.map((m) => {
    if (m.id === 'm6') return { ...m, title: 'Semantic refresh complete', state: 'done', at: '08:06 UTC', detail: 'Semantic indexes refreshed successfully.' };
    if (m.id === 'm7') return { ...m, title: 'Health checks passed', state: 'done', at: '08:08 UTC', detail: 'Health checks passed with no critical findings.' };
    if (m.id === 'm8') return { ...m, state: 'done', at: '08:09 UTC', detail: 'Ready for exploration confirmed.' };
    return m;
  });
  addLog('Foundry', 'ok', 'Foundry run completed.', 'All milestones completed and environment is ready.');
}

function handleAction(el) {
  const action = el.dataset.action;
  if (!action) return;

  if (action === 'navigate') state.appShellState.currentRoute = el.dataset.route;
  if (action === 'select-day') state.foundryState.selectedDayId = el.dataset.dayId;

  if (action === 'approve-plan') {
    state.foundryState.planApproved = true;
    addLog('Foundry', 'info', 'Foundry plan approved by operator.', 'All required and enabled optional steps approved.');
  }
  if (action === 'toggle-optional') {
    state.foundryState.plan = state.foundryState.plan.map((step) => (step.required ? step : { ...step, enabled: !step.enabled }));
    addLog('Foundry', 'info', 'Optional plan steps toggled.', 'Operator changed optional step states.');
  }
  if (action === 'toggle-plan-step') {
    state.foundryState.plan = state.foundryState.plan.map((step) => (step.id === el.dataset.planId ? { ...step, enabled: !step.enabled } : step));
  }
  if (action === 'run-plan') {
    state.foundryState.planApproved = true;
    applyFoundryPhaseProgression();
  }
  if (action === 'foundry-log-severity') state.appShellState.foundryLogSeverity = el.value;
  if (action === 'pin-home-mode') state.appShellState.homeModePreference = el.dataset.mode;

  if (action === 'send-hero-to-adhoc') {
    state.appShellState.currentRoute = 'Ad Hoc';
    addLog('Lenses', 'info', 'Lens hero handed off to Ad Hoc.', 'Counterparty volatility context sent to analysis workspace.');
  }

  if (action === 'open-lens' || action === 'open-lens-from-home') {
    addLog('Lenses', 'info', 'Lens opened from deck.', `Lens ${el.dataset.lensId}`);
  }

  if (action === 'interpret-question') {
    const s = state.adHocSessionState.sessionsById[state.adHocSessionState.activeSessionId];
    const input = document.getElementById('askInput').value.trim();
    s.rootQuestion = input || s.rootQuestion;
    addLog('Ad Hoc', 'info', 'Question interpreted and evidence run prepared.', `Prompt: ${s.rootQuestion}`);
  }
  if (action === 'switch-evidence-tab') state.adHocSessionState.activeEvidenceTab = el.dataset.tab;

  if (action === 'refine-current') {
    const s = state.adHocSessionState.sessionsById[state.adHocSessionState.activeSessionId];
    s.currentFocus = `Refined: ${el.dataset.suggestion}`;
    s.refinements.push({ type: 'refine', suggestion: el.dataset.suggestion, at: new Date().toISOString() });
    addLog('Ad Hoc', 'info', `Refinement applied: ${el.dataset.suggestion}.`, 'Current analysis updated in place.');
  }
  if (action === 'branch-analysis') {
    const parent = state.adHocSessionState.sessionsById[state.adHocSessionState.activeSessionId];
    const id = `analysis_${Date.now()}`;
    state.adHocSessionState.sessionsById[id] = {
      ...parent,
      id,
      parentSessionId: parent.id,
      currentFocus: `Branched: ${el.dataset.suggestion}`,
      refinements: [...parent.refinements, { type: 'branch', suggestion: el.dataset.suggestion, at: new Date().toISOString() }]
    };
    state.adHocSessionState.activeSessionId = id;
    addLog('Ad Hoc', 'info', `Branch created: ${el.dataset.suggestion}.`, `Parent session ${parent.id}`);
  }

  if (action === 'apply-feedback') {
    state.feedbackState.reviewItems = state.feedbackState.reviewItems.map((r) => r.status === 'pending' ? { ...r, status: 'applied' } : r);
    state.feedbackState.history.unshift('09:33 · Pending feedback batch applied across current family.');
    addLog('Feedback', 'info', 'Pending feedback applied.', 'Recognition updates and summary refinements were applied.');
  }

  if (action === 'open-artifact') {
    const item = state.artifactState.shelf.find((a) => a.id === el.dataset.artifactId);
    if (item) addLog('Artifacts', 'info', `Artifact opened: ${item.title}.`, 'Opened from artifacts shelf.');
  }

  if (action === 'pin-artifact') {
    const item = state.artifactState.shelf.find((a) => a.id === el.dataset.artifactId);
    if (item) {
      state.artifactState.shelf = [{ ...item, readiness: 'meeting-ready' }, ...state.artifactState.shelf.filter((a) => a.id !== item.id)];
      addLog('Artifacts', 'ok', `Artifact pinned: ${item.title}.`, 'Pinned to top of shelf for rapid access.');
    }
  }
  if (action === 'reset-original') {
    state.adHocSessionState.activeSessionId = state.adHocSessionState.rootSessionId;
    state.adHocSessionState.activeEvidenceTab = 'source-slice';
    addLog('Ad Hoc', 'info', 'Analysis reset to original session.', `Session ${state.adHocSessionState.rootSessionId} restored.`);
  }

  render();
}

function bindEvents() {
  document.getElementById('app').addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (target) handleAction(target);
  });
  document.getElementById('app').addEventListener('change', (event) => {
    const target = event.target;
    if (target.matches('[data-action="foundry-log-severity"]')) handleAction(target);
  });

  document.getElementById('toggleDrawer').onclick = () => {
    state.appShellState.drawerOpen = !state.appShellState.drawerOpen;
    document.getElementById('drawerBody').classList.toggle('hidden', !state.appShellState.drawerOpen);
  };
  document.getElementById('drawerSearch').oninput = (e) => { state.appShellState.logFilters.search = e.target.value; renderDrawer(); };
  document.getElementById('drawerSource').onchange = (e) => { state.appShellState.logFilters.source = e.target.value; renderDrawer(); };
  document.getElementById('drawerSeverity').onchange = (e) => { state.appShellState.logFilters.severity = e.target.value; renderDrawer(); };
}

bindEvents();
render();
