import { card, logRow, milestoneRow } from '../shared/renderBits.js';
import { ingestDayClass } from '../shared/status.js';
import { getHomeViewModel } from '../viewmodels/homeViewModel.js';

function todayPathStrip(currentStage) {
  const path = ['Upload', 'Ingest', 'Refresh', 'Explore', 'Package', 'Review'];
  return `<div class="path-strip">${path.map((s) => `<span class="path-step ${s === currentStage ? 'active' : ''}">${s}</span>`).join('')}</div>`;
}

function readinessHeatmapCard(state, vm) {
  const selected = state.foundryState.selectedDayId;
  const body = `
    <p class="subtle">Select a day to inspect source availability, ingest history, downstream status, and warnings.</p>
    <div class="heatmap">${state.foundryState.heatmapDays.map((day) => `<button class="day ${ingestDayClass(day.ingestDayStatus)} ${selected === day.id ? 'selected' : ''}" data-action="select-day" data-day-id="${day.id}" title="${day.date}: ${day.ingestDayStatus}"></button>`).join('')}</div>
    <div class="detail-panel subtle">${vm.selectedDayHtml || 'Select a day to inspect readiness details.'}</div>`;
  return card('Foundry Readiness', body);
}

function foundryPlanCard(state) {
  const approved = state.foundryState.planApproved ? '<span class="status s-healthy">approved</span>' : '<span class="status s-warn">awaiting approval</span>';
  return card('Foundry Plan', `
    <div class="row"><p class="subtle">Recommended plan for this ingestion window.</p>${approved}</div>
    <div class="list">${state.foundryState.plan.map((row) => `<div class="plan-row">
      <div><strong>${row.title}</strong><p class="subtle">Why: ${row.why}</p></div>
      <div class="plan-meta">
        <span class="status ${row.required ? 's-active' : 's-warn'}">${row.required ? 'required' : 'optional'}</span>
        <span class="subtle">Dep: ${row.dependency}</span>
        <span class="subtle">Impact: ${row.impact}</span>
        <input type="checkbox" data-action="toggle-plan-step" data-plan-id="${row.id}" ${row.enabled ? 'checked' : ''} ${row.required ? 'disabled' : ''} />
      </div>
    </div>`).join('')}</div>
    <div class="row mt-12 wrap">
      <button class="ghost" data-action="approve-plan">Approve all</button>
      <button class="ghost" data-action="toggle-optional">Toggle optional steps</button>
      <button class="ghost">Edit plan</button>
      <button class="solid" data-action="run-plan">Run plan</button>
    </div>`);
}

function lensDeck(state) {
  return card('Lenses', `<div class="grid lens-grid">${state.lensState.sessions.map((lens) => `
    <button class="lens-card" data-action="open-lens-from-home" data-lens-id="${lens.id}">
      <strong>${lens.name}</strong>
      <span class="subtle">Freshness ${lens.freshnessLabel}</span>
      <p class="subtle">${lens.note}</p>
    </button>`).join('')}</div>`);
}

export function renderHomeView(state) {
  const vm = getHomeViewModel(state);
  const selectedDay = state.foundryState.heatmapDays.find((d) => d.id === state.foundryState.selectedDayId);
  vm.selectedDayHtml = selectedDay ? `<strong>${selectedDay.date}</strong> · ${selectedDay.ingestDayStatus}<br/>Source availability: ${selectedDay.sourceAvailability}<br/>Ingest history: ${selectedDay.ingestHistory}<br/>Downstream status: ${selectedDay.downstreamStatus}<br/>Warnings: ${selectedDay.warnings}` : '';
  const morning = vm.morningMode;

  return `<div class="home-posture ${morning ? 'morning' : 'daytime'}">
    <div class="row"><h2>Home</h2><div class="row"><span class="status ${morning ? 's-active' : 's-healthy'}">${vm.mode}</span><button class="ghost" data-action="pin-home-mode" data-mode="${morning ? 'daytime-analysis' : 'morning-readiness'}">Pin ${morning ? 'daytime' : 'morning'} mode</button></div></div>
    ${vm.mode === 'foundry-blocked' ? `<p class="status s-error">Blocked: ${vm.blockerReason}</p>` : ''}
    ${todayPathStrip(vm.pathStage)}
    <div class="grid ${morning ? 'cols-2' : 'cols-3'}">
      ${morning
        ? `${readinessHeatmapCard(state, vm)}${foundryPlanCard(state)}`
        : `${lensDeck(state)}${card('Featured Artifact', `<h4>${state.artifactState.featured.title}</h4><p>${state.artifactState.featured.summary}</p><div class="row"><span class="subtle">Freshness ${state.artifactState.featured.freshnessLabel}</span><span class="chip">meeting-ready</span></div>`)}${card('Explore', '<div class="grid"><button class="ghost" data-action="navigate" data-route="Ad Hoc">Ask a question</button><button class="ghost">Open Walker</button><button class="ghost">Resume recent analysis</button><button class="ghost">Open saved session</button></div>')}`}
    </div>
    <div class="grid ${morning ? 'cols-2' : 'cols-3'} mt-12">
      ${card('Foundry Milestones', state.foundryState.milestones.slice(0, 6).map(milestoneRow).join(''))}
      ${!morning ? card('Foundry Summary', '<p>Ingestion: 82% complete · freshness 12m.</p><p class="subtle">Hold-up remains in semantic refresh.</p>') : ''}
      ${card('Logbook Preview', vm.logPreview.map(logRow).join(''))}
    </div>
  </div>`;
}
