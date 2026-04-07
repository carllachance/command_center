import { mockHeatmap, mockLogEntries } from '../mocks/data.js';

export const navItems = ['Home', 'Foundry', 'Lenses', 'Ad Hoc', 'Documents', 'Feedback', 'Artifacts', 'Logbook'];

export function createInitialState() {
  return {
    appShellState: {
      currentRoute: 'Home',
      environment: 'PROD',
      lastRefreshedAt: new Date(),
      drawerOpen: true,
      logFilters: { search: '', source: 'all', severity: 'all' },
      foundryLogSeverity: 'all',
      homeModePreference: null
    },
    foundryState: {
      runId: 'run_2026_04_07_01',
      readinessComplete: false,
      documentAttentionRequired: false,
      criticalOverrideMode: null,
      progressionPhase: 0,
      activeJob: {
        id: 'job_transform_77',
        label: 'Semantic refresh blocked by counterparty aggregation',
        state: 'blocked',
        blockerReason: 'Counterparty aggregate partition 92 has not landed yet.'
      },
      selectedDayId: null,
      planApproved: false,
      plan: [
        { id: 'p1', title: 'Load daily fed file', why: 'required for liquidity truth set', dependency: 'source/fed', required: true, impact: 'high', enabled: true, approved: false },
        { id: 'p2', title: 'Recompute anomaly baseline', why: 'normalize day-over-day volatility', dependency: 'derived/liquidity', required: false, impact: 'medium', enabled: true, approved: false },
        { id: 'p3', title: 'Refresh semantic lens cache', why: 'unlock daytime lens confidence', dependency: 'semantic/core', required: true, impact: 'high', enabled: true, approved: false },
        { id: 'p4', title: 'Run counterparty health checks', why: 'surface hidden ingestion drift', dependency: 'aggregate/counterparty', required: false, impact: 'medium', enabled: true, approved: false }
      ],
      milestones: [
        { id: 'm1', title: 'File received', state: 'done', detail: 'Fed file detected for April 6.', at: '07:14 UTC' },
        { id: 'm2', title: 'Validation complete', state: 'done', detail: 'Validation complete with 3 schema warnings.', at: '07:16 UTC' },
        { id: 'm3', title: 'Raw load complete', state: 'done', detail: 'Raw partition load closed cleanly.', at: '07:18 UTC' },
        { id: 'm4', title: 'Transform running', state: 'active', detail: 'Transform currently processing derived balance tables.', at: 'Running · 9m' },
        { id: 'm5', title: 'Derived refresh pending', state: 'pending', detail: 'Queued immediately after transform complete.', at: '-' },
        { id: 'm6', title: 'Semantic refresh blocked', state: 'blocked', detail: 'Semantic refresh waiting on counterparty aggregation.', at: 'Blocked · upstream lag' },
        { id: 'm7', title: 'Health checks pending', state: 'pending', detail: 'Health checks queued after semantic refresh.', at: '-' },
        { id: 'm8', title: 'Ready for exploration', state: 'pending', detail: 'Will unlock after health checks.', at: '-' }
      ],
      heatmapDays: mockHeatmap()
    },
    lensState: {
      hero: {
        title: 'Counterparty Volatility Lens',
        summary: 'Core volatility profile is stable with one concentrated settlement spike cluster.',
        caveat: 'Caveat: optional schema field drift may undercount low-value transfers.',
        lastRun: '09:18 UTC',
        actions: ['Open full lens', 'Pin artifact', 'Send to Ad Hoc', 'Export snapshot']
      },
      sessions: [
        { id: 'lens_s_101', name: 'Liquidity lens', freshnessLabel: '12m old', note: 'Open queue stable; one pocket of late files.' },
        { id: 'lens_s_102', name: 'Open / queue lens', freshnessLabel: '7m old', note: 'Queue pressure eased after 10:00 batch.' },
        { id: 'lens_s_103', name: 'Anomaly lens', freshnessLabel: '4m old', note: 'Spike concentrated in 3 counterparties.' },
        { id: 'lens_s_104', name: 'Document intelligence lens', freshnessLabel: '2h old', note: 'New control terms extracted from policy pack.' },
        { id: 'lens_s_105', name: 'Weekly reporting lens', freshnessLabel: '19m old', note: 'Meeting-ready charts updated.' },
        { id: 'lens_s_106', name: 'Custom saved lenses', freshnessLabel: 'varies', note: '6 personal views pinned.' }
      ],
      comparisonViews: ['Day-over-day settlement drift', 'Baseline vs event-window queue depth'],
      savedViews: ['Morning readiness monitor', 'Counterparty exception matrix', 'Liquidity watchboard']
    },
    adHocSessionState: {
      rootSessionId: 'analysis_8841',
      activeSessionId: 'analysis_8841',
      activeEvidenceTab: 'source-slice',
      sessionsById: {
        analysis_8841: {
          id: 'analysis_8841',
          parentSessionId: null,
          rootQuestion: 'Explain yesterday\'s settlement spike by counterparty',
          interpretedQuestion: 'Compare settlement amount by counterparty for Apr 6 vs 14-day baseline; isolate delayed feed effects.',
          currentFocus: 'Counterparty lag and arrival timing',
          chartConfig: { type: 'bar', x: 'counterparty', y: 'settlement_amount' },
          sourceSlice: 'settlement events where arrival_delay > 10m',
          workingTable: [
            ['Aster', '$42.1M', '+198%', 'late file 09:17'],
            ['Northline', '$31.4M', '+146%', 'late file 09:22'],
            ['Kestral', '$24.0M', '+121%', 'late file 09:14']
          ],
          summaryTable: '3 counterparties explain 81% of spike magnitude.',
          walkerConfig: 'Walker preloaded with settlement + arrival timing dimensions.',
          answer: 'The spike was driven by three counterparties with delayed arrivals collapsing into one settlement window.',
          runRecord: 'Filters: date=2026-04-06, domain=settlement, exclusions=weekend backfill; caveat: optional schema warning.',
          refinements: []
        }
      }
    },
    documentPipelineState: {
      documentJobId: 'doc_1142',
      queue: [
        { id: 'doc_1142', name: 'Q1_Controls_Pack.pdf', stage: 'Relationships mapped', owner: 'Nora', eta: '8m', risk: 'medium' },
        { id: 'doc_1149', name: 'Liquidity_Addendum.docx', stage: 'Structure detected', owner: 'Milo', eta: '13m', risk: 'low' }
      ],
      stageTimeline: [
        { stage: 'Received', status: 'done' },
        { stage: 'Preprocess', status: 'done' },
        { stage: 'Extract', status: 'done' },
        { stage: 'Map', status: 'active' },
        { stage: 'Summarize', status: 'pending' },
        { stage: 'Review', status: 'pending' }
      ],
      currentStage: 'Relationships mapped',
      stageDetail: 'Mapping control relationships and preparing confidence annotations for review.',
      stageWarnings: ['2 low-confidence control edges', '1 unresolved counterparty alias']
    },
    feedbackState: {
      recognitionStatus: 'Reclassify node type Decision → Control',
      reviewItems: [
        { id: 'fb_1', item: 'Node 14 classification likely incorrect.', status: 'pending', owner: 'Nora' },
        { id: 'fb_2', item: 'Summary phrasing too broad for policy text.', status: 'pending', owner: 'Milo' },
        { id: 'fb_3', item: 'Missing confidence note for extracted control dependency.', status: 'applied', owner: 'Nora' }
      ],
      history: ['09:04 · Classification fix accepted for node 8.', '08:49 · Summary rule narrowed for liquidity policy family.', '08:31 · Relationship threshold adjusted after reviewer note.']
    },
    artifactState: {
      featured: { artifactId: 'artifact_302', title: 'Counterparty Spike Brief', summary: 'Meeting-ready brief with caveats, baseline comparison, and export package.', freshnessLabel: '18m old' },
      shelf: [
        { id: 'art_1', title: 'Weekly liquidity package', type: 'deck', readiness: 'meeting-ready', updated: '09:20', trust: 'high' },
        { id: 'art_2', title: 'Anomaly explainer chart set', type: 'chart-pack', readiness: 'review-ready', updated: '09:12', trust: 'medium' },
        { id: 'art_3', title: 'Document control delta brief', type: 'brief', readiness: 'meeting-ready', updated: '08:58', trust: 'high' }
      ],
      savedSessions: ['analysis_8841', 'analysis_8832', 'analysis_8799'],
      meetingOutputs: ['Exec standup packet', 'Counterparty incident recap', 'Regulatory appendix export']
    },
    logbookState: {
      entries: mockLogEntries()
    }
  };
}
