import { useMemo, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import Callout from '../../components/Callout.jsx'

function expensiveWork(iterations) {
  const start = performance.now()
  let acc = 0
  for (let i = 0; i < iterations; i++) acc += Math.sqrt(i)
  return performance.now() - start
}

function MeasuredComponent({ heavy }) {
  const renderStart = performance.now()
  // Simulate real work happening during render — the kind a flame graph
  // in the actual React DevTools Profiler would show as a wide bar.
  const workMs = useMemo(() => (heavy ? expensiveWork(4_000_000) : expensiveWork(1_000)), [heavy])
  const totalMs = (performance.now() - renderStart).toFixed(1)

  return (
    <div
      style={{
        padding: '0.8rem 1rem',
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'var(--bg-elevated)',
      }}
    >
      <strong>{heavy ? '🐢 Heavy render' : '⚡ Fast render'}</strong>
      <p className="demo-note" style={{ margin: '0.3rem 0 0' }}>
        This render took ~<strong>{totalMs}ms</strong> (work: {workMs.toFixed(1)}ms) — in the real
        DevTools Profiler, this is exactly what a wide vs. narrow bar in the flame graph
        represents for this component.
      </p>
    </div>
  )
}

function ProfilerSimulator() {
  const [heavy, setHeavy] = useState(false)
  const [tick, setTick] = useState(0)

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => setTick((t) => t + 1)}>
          Trigger a render
        </button>
        <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.9rem' }}>
          <input type="checkbox" checked={heavy} onChange={(e) => setHeavy(e.target.checked)} />
          Simulate expensive work in this component
        </label>
      </div>
      <MeasuredComponent key={tick} heavy={heavy} />
    </div>
  )
}

export default function DevToolsProfiler() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="devtools-profiler"
      level="expert"
      title="Profiling with React DevTools"
      summary="The React DevTools Profiler records what actually happened during a real interaction — which components rendered, how long each took, and why — replacing guesswork about performance with measurement."
      keyPoints={[
        'Install the React Developer Tools browser extension, open its Profiler tab, click record, perform the interaction you care about, then stop recording.',
        'The flame graph shows one bar per component that rendered during that commit — bar width is render duration, so wide bars are where time is actually going.',
        'The Profiler can highlight *why* a component rendered (props changed, state changed, a parent re-rendered, a hook changed) — check this before reaching for memo/useMemo/useCallback speculatively.',
        'The ranked chart view sorts components by render duration within a commit — often faster than visually scanning the flame graph for the widest bar.',
        'Profile a realistic interaction, not an artificial one — "click the button 50 times fast" measures something different from "type a normal sentence in the search box".',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — what a flame graph bar actually measures</h3>
        <p className="demo-note">
          This app cannot embed the real DevTools extension inline, so this demo simulates what
          it measures: a component's actual render duration, using <code>performance.now()</code>{' '}
          the same way the Profiler does internally.
        </p>
        <div className="demo-live">
          <ProfilerSimulator />
        </div>
      </div>

      <div className="demo-section">
        <h3>Reading a real Profiler session</h3>
        <ul>
          <li>
            <strong>Flame graph:</strong> one row per commit; within a row, wider bars = slower
            components. Grey bars mean "did not render this commit" — useful for confirming{' '}
            <code>memo()</code> is actually skipping renders as intended.
          </li>
          <li>
            <strong>"Why did this render?"</strong> panel (enable it in Profiler settings): shows
            the specific prop/state/hook/context that changed — the fastest way to confirm
            whether a re-render was actually necessary.
          </li>
          <li>
            <strong>Commit count:</strong> a high number of commits for one simple interaction
            (e.g. one keystroke causing five commits) often points to redundant state updates
            worth consolidating.
          </li>
        </ul>
      </div>

      <Callout kind="warning">
        Profile a production-like build when measuring absolute numbers — development builds
        (including this whole app, in dev mode) include extra checks and Strict Mode's
        double-invocation, both of which inflate render times relative to what users actually
        experience.
      </Callout>
    </TopicPage>
  )
}
