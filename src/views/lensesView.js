import { card } from '../shared/renderBits.js';

export function renderLensesView(state) {
  const hero = state.lensState.hero;
  return `<h2>Lenses</h2>
    ${card('Lens Deck', `<div class="grid lens-grid">${state.lensState.sessions.map((lens) => `<button class="lens-card" data-action="open-lens" data-lens-id="${lens.id}"><strong>${lens.name}</strong><span class="subtle">Freshness ${lens.freshnessLabel}</span><p class="subtle">${lens.note}</p></button>`).join('')}</div>`) }
    <div class="grid cols-2 mt-12">
      ${card('Lens Hero', `<div class="hero-panel"><p><strong>${hero.title}</strong></p><p>${hero.summary}</p><p class="subtle">${hero.caveat}</p><p class="subtle">Last run: ${hero.lastRun}</p><div class="row wrap">${hero.actions.map((action) => `<button class="ghost" ${action === 'Send to Ad Hoc' ? 'data-action="send-hero-to-adhoc"' : ''}>${action}</button>`).join('')}</div></div>`)}
      ${card('Supporting Grid', `<div class="list"><div><strong>Recent lens runs</strong><p class="subtle">12 runs today, 3 flagged for caveats.</p></div><div><strong>Comparison views</strong><p class="subtle">${state.lensState.comparisonViews.join(' · ')}</p></div><div><strong>Saved views</strong><p class="subtle">${state.lensState.savedViews.join(' · ')}</p></div><div><strong>Observations</strong><p class="subtle">Counterparty concentration remains above weekly median.</p></div></div>`) }
    </div>`;
}
