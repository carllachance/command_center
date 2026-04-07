import { card, logRow, milestoneRow } from '../shared/renderBits.js';
import { ingestDayClass, jobStateClass } from '../shared/status.js';
import { getFoundryViewModel } from '../viewmodels/foundryViewModel.js';

export function renderFoundryView(state) {
  const vm = getFoundryViewModel(state);
  const selected = vm.selectedDay;
  const detail = selected ? `<strong>${selected.date}</strong> · ${selected.ingestDayStatus}<br/>Source availability: ${selected.sourceAvailability}<br/>Ingest history: ${selected.ingestHistory}<br/>Downstream status: ${selected.downstreamStatus}<br/>Warnings: ${selected.warnings}` : 'Select a day to inspect readiness details.';

  return `<h2>Foundry</h2>
  <section class="card foundry-header ${state.foundryState.activeJob.state === 'blocked' ? 'blocked-outline' : ''}">
    <div><h3>Foundry Readiness</h3><p>Run ${state.foundryState.runId} · obvious hold-ups are shown without opening raw logs.</p><p class="subtle">${state.foundryState.activeJob.blockerReason}</p></div>
    <span class="status ${jobStateClass(state.foundryState.activeJob.state)}">${state.foundryState.activeJob.state}</span>
  </section>

  <div class="grid cols-2 mt-12">
    ${card('Foundry Readiness', `<div class="heatmap">${state.foundryState.heatmapDays.map((day) => `<button class="day ${ingestDayClass(day.ingestDayStatus)} ${state.foundryState.selectedDayId === day.id ? 'selected' : ''}" data-action="select-day" data-day-id="${day.id}"></button>`).join('')}</div><div class="detail-panel subtle">${detail}</div>`) }
    ${card('Foundry Plan', `<div class="row"><span class="subtle">${state.foundryState.planApproved ? 'Plan approved and ready to run.' : 'Approve and run to continue processing.'}</span><span class="status ${state.foundryState.planApproved ? 's-healthy' : 's-warn'}">${state.foundryState.planApproved ? 'approved' : 'pending'}</span></div><div class="list mt-12">${state.foundryState.plan.map((p) => `<div class="row"><span>${p.title}</span><span class="subtle">${p.enabled ? 'enabled' : 'disabled'} · ${p.approved ? 'approved' : 'pending'}</span></div>`).join('')}</div><div class="row mt-12"><button class="ghost" data-action="approve-plan">Approve all</button><button class="ghost" data-action="toggle-optional">Toggle optional</button><button class="solid" data-action="run-plan">Run plan</button></div>`) }
  </div>

  <div class="grid cols-2 mt-12">
    ${card('Foundry Milestones', `${state.foundryState.milestones.map(milestoneRow).join('')}`)}
    ${card('Foundry Logbook', `<div class="row"><label class="subtle">Severity</label><select class="select-input mini" data-action="foundry-log-severity"><option value="all" ${state.appShellState.foundryLogSeverity === 'all' ? 'selected' : ''}>all</option><option value="ok">ok</option><option value="info">info</option><option value="warn">warn</option><option value="error">error</option></select></div>${vm.logs.map(logRow).join('')}`)}
  </div>`;
}
