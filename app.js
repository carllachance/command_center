const navItems = [
  'Home',
  'Foundry',
  'Lenses',
  'Ad Hoc',
  'Documents',
  'Feedback',
  'Artifacts',
  'Logbook'
];

const state = {
  currentView: 'Home',
  mode: 'morning',
  ingestComplete: false,
  foundryActive: false,
  documentActive: true,
  planApproved: false,
  milestones: [
    { name: 'File received', status: 'done', time: '07:14' },
    { name: 'Validation complete', status: 'done', time: '07:16' },
    { name: 'Raw load complete', status: 'done', time: '07:18' },
    { name: 'Transform complete', status: 'active', time: 'running' },
    { name: 'Derived refresh complete', status: 'pending', time: '-' },
    { name: 'Semantic refresh complete', status: 'pending', time: '-' },
    { name: 'Health checks passed', status: 'pending', time: '-' },
    { name: 'Ready for exploration', status: 'pending', time: '-' }
  ],
  logs: [
    'Fed file detected for April 6.',
    'Validation complete with 3 schema warnings.',
    'Derived balance tables refreshed successfully.',
    'Semantic refresh waiting on counterparty aggregation.'
  ]
};

function inferMode() {
  if (state.foundryActive) return 'run';
  if (!state.ingestComplete) return 'morning';
  if (state.documentActive) return 'document';
  return 'daytime';
}

function renderNav() {
  const nav = document.getElementById('navPrimary');
  nav.innerHTML = '';
  navItems.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = `nav-item ${state.currentView === item ? 'active' : ''}`;
    btn.textContent = item;
    btn.onclick = () => {
      state.currentView = item;
      render();
    };
    nav.appendChild(btn);
  });
}

function homeView() {
  const mode = inferMode();
  const path = ['Upload', 'Ingest', 'Refresh', 'Explore', 'Package', 'Review'];
  return `
    <div class="path-strip">${path
      .map((s, i) => `<span class="path-step ${i === (mode === 'morning' ? 1 : 3) ? 'active' : ''}">${s}</span>`)
      .join('')}</div>
    <div class="row" style="margin-bottom:12px"><h2>Home · ${mode.toUpperCase()} MODE</h2>
      <button class="ghost" id="toggleMode">Pin Daytime Mode</button></div>

    <div class="grid cols-2">
      <section class="card">
        <h3>Foundry Readiness</h3>
        <div class="heatmap">
          ${['available','ingested','ingested','failed','partial','awaiting','missing','ingested','ingested','partial','available','awaiting','ingested','missing']
            .map((s) => `<div class="day ${s}" title="${s}"></div>`).join('')}
        </div>
      </section>

      <section class="card">
        <h3>Foundry Plan</h3>
        <div class="list">
          <div class="row"><span>Load daily fed file</span><span class="status s-active">required</span></div>
          <div class="row"><span>Recompute anomaly baseline</span><span class="status s-warn">optional</span></div>
          <div class="row"><span>Refresh semantic lens cache</span><span class="status s-active">required</span></div>
        </div>
        <div class="row" style="margin-top:10px">
          <button class="ghost" id="approvePlan">Approve all</button>
          <button class="ghost" id="runPlan">Run plan</button>
        </div>
      </section>
    </div>

    <div class="grid cols-3" style="margin-top:12px">
      <section class="card">
        <h3>Foundry Milestones</h3>
        <div class="list">
          ${state.milestones.slice(0, 5).map((m) => `<div class="row"><span>${m.name}</span><span class="status ${m.status === 'done' ? 's-healthy' : m.status === 'active' ? 's-active' : 's-warn'}">${m.time}</span></div>`).join('')}
        </div>
      </section>

      <section class="card">
        <h3>Featured Artifact</h3>
        <p>Latest semantic anomaly summary with confidence caveats and freshness stamp.</p>
        <div class="row"><span class="subtle">Freshness: 18 min</span><button class="ghost">Open</button></div>
      </section>

      <section class="card">
        <h3>Document Pipeline</h3>
        <p>Q1_Controls_Pack.pdf · Relationships mapped · 68%</p>
        <div class="row"><span class="status s-warn">2 warnings</span><button class="ghost">Open full pipeline</button></div>
      </section>
    </div>`;
}

function foundryView() {
  return `
    <h2>Foundry</h2>
    <div class="card" style="margin-bottom:12px">
      <div class="row"><span>Last ingested date: 2026-04-06</span><span class="status s-active">processing</span></div>
      <p class="subtle">Missing dates: 1 · Failed dates: 1 · Pending downstream refresh: 2</p>
    </div>
    <div class="grid cols-3">
      <section class="card"><h3>Readiness Heatmap</h3><div class="heatmap">${Array.from({length:21}).map((_,i)=>`<div class="day ${['ingested','available','missing','partial','awaiting','failed'][i%6]}"></div>`).join('')}</div></section>
      <section class="card"><h3>Foundry Plan</h3><p>Approve and run to complete ingest and semantic refresh.</p><button class="ghost">Run plan</button></section>
      <section class="card"><h3>Milestones</h3><table class="table"><tr><th>Stage</th><th>Status</th></tr>${state.milestones.map(m=>`<tr><td>${m.name}</td><td>${m.status}</td></tr>`).join('')}</table></section>
    </div>
  `;
}

function lensesView() {
  return `<h2>Lenses</h2><div class="grid cols-2"><section class="card"><h3>Lens Deck</h3><div class="list"><div>Liquidity lens · Fresh 22m</div><div>Open / queue lens · Fresh 8m</div><div>Anomaly lens · Alert +3σ shift</div><div>Document intelligence lens · Fresh 3h</div></div></section><section class="card"><h3>Lens Hero Panel</h3><p>Featured anomaly lens with plain-language summary and caveat block.</p><div class="row"><button class="ghost">Open full lens</button><button class="ghost">Send to Ad Hoc</button></div></section></div>`;
}

function adHocView() {
  return `<h2>Ad Hoc</h2>
    <div class="card"><h3>Ask Panel</h3><p>What do you want to know?</p><input style="width:100%;padding:8px;background:#0f141c;color:white;border:1px solid #2a3443;border-radius:8px" value="Explain yesterday's settlement spike by counterparty"/></div>
    <div class="grid cols-2" style="margin-top:12px">
      <section class="card"><h3>Answer Card</h3><p><strong>Direct answer:</strong> Spike driven by 3 counterparties with late file arrivals.</p><p class="subtle">Coverage 97% · Confidence: medium (2 schema warnings)</p><button class="ghost">Save as artifact</button></section>
      <section class="card"><h3>Evidence Tabs</h3><div class="chips"><span class="chip">Source slice</span><span class="chip">Working table</span><span class="chip">Summary</span><span class="chip">Walker</span><span class="chip">Run record</span></div><p>Run record preserves interpretation, filters, transforms, assumptions, and caveats.</p></section>
    </div>
    <div class="card" style="margin-top:12px"><h3>Refocus Panel</h3><div class="chips"><span class="chip">Narrow time window</span><span class="chip">Break out by from</span><span class="chip">Explain spike</span><span class="chip">Branch analysis</span></div></div>`;
}

function documentsView() {
  const stages = ['Received','Preprocessed','Structure detected','Parse strategy chosen','Extraction complete','Relationships mapped','Summary generated','Review package prepared','Feedback applied','Artifact finalized'];
  return `<h2>Documents</h2><div class="card"><h3>Pipeline View</h3><div class="list">${stages.map((s,i)=>`<div class="row"><span>${s}</span><span class="status ${i<6?'s-healthy':i===6?'s-active':'s-warn'}">${i<6?'done':i===6?'active':'pending'}</span></div>`).join('')}</div></div>`;
}

function feedbackView() {
  return `<h2>Feedback</h2><div class="grid cols-2"><section class="card"><h3>Review Items</h3><p>Source snippet: "Approval node B"</p><p>Extracted output: Decision</p><div class="chips"><span class="chip">Wrong type</span><span class="chip">Rewrite suggestion</span></div></section><section class="card"><h3>Recognition Check</h3><p><strong>You said:</strong> This is a control, not a decision.</p><p><strong>System recognized:</strong> Reclassify node type Decision → Control</p><p><strong>Scope:</strong> Current document family</p></section></div>`;
}

function artifactsView() {
  return `<h2>Artifacts</h2><div class="grid cols-2"><section class="card"><h3>Pinned Artifacts</h3><div class="list"><div>Weekly liquidity package</div><div>Counterparty anomaly deck</div></div></section><section class="card"><h3>Recent Chart Packages</h3><div class="list"><div>MMD chart pack · 09:02</div><div>Semantic summary · 08:46</div></div></section></div>`;
}

function logbookView() {
  return `<h2>Logbook</h2><div class="card"><h3>Unified operational memory</h3>${state.logs.map((l)=>`<div class="log-entry">${l}</div>`).join('')}</div>`;
}

function renderWorkspace() {
  const workspace = document.getElementById('workspace');
  const views = {
    Home: homeView,
    Foundry: foundryView,
    Lenses: lensesView,
    'Ad Hoc': adHocView,
    Documents: documentsView,
    Feedback: feedbackView,
    Artifacts: artifactsView,
    Logbook: logbookView
  };
  workspace.innerHTML = views[state.currentView]();

  const approve = document.getElementById('approvePlan');
  if (approve) {
    approve.onclick = () => {
      state.planApproved = true;
      state.logs.unshift('Foundry plan approved by operator.');
      render();
    };
  }
  const run = document.getElementById('runPlan');
  if (run) {
    run.onclick = () => {
      state.foundryActive = true;
      state.logs.unshift('Foundry run started with approved steps.');
      render();
    };
  }
  const pin = document.getElementById('toggleMode');
  if (pin) {
    pin.onclick = () => {
      state.ingestComplete = true;
      state.documentActive = false;
      state.logs.unshift('Home default mode pinned to daytime analysis.');
      render();
    };
  }
}

function renderContextRail() {
  const el = document.getElementById('contextRail');
  el.innerHTML = `
    <section class="card"><h3>Active Jobs</h3><div class="list"><div>Foundry refresh · run_2026_04_07_01</div><div>Document parse · doc_1142</div></div></section>
    <section class="card"><h3>Active Alerts</h3><div class="list"><div class="status s-warn">Counterparty aggregate delayed</div><div class="status s-error">1 failed source date</div></div></section>
    <section class="card"><h3>Recent Artifacts</h3><div class="list"><div>Weekly report package</div><div>Anomaly explainer chart</div></div></section>
    <section class="card"><h3>Queued Review</h3><div class="list"><div>3 feedback items pending</div></div></section>
  `;
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  body.innerHTML = state.logs.map((l) => `<div class="log-entry">${l}</div>`).join('');
}

function render() {
  renderNav();
  renderWorkspace();
  renderContextRail();
  renderDrawer();
  document.getElementById('lastRefreshed').textContent = `Last refreshed ${new Date().toLocaleTimeString()}`;
}

document.getElementById('toggleDrawer').onclick = () => {
  document.getElementById('drawerBody').classList.toggle('hidden');
};

render();
