import { Suspense, use, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// ONE shared boundary: nothing shows until the SLOWEST widget is ready.
<Suspense fallback={<Spinner />}>
  <Widget delayMs={400} />
  <Widget delayMs={900} />
  <Widget delayMs={1500} />
</Suspense>

// SEPARATE boundaries: each widget appears as soon as IT is ready.
<Suspense fallback={<Spinner />}><Widget delayMs={400} /></Suspense>
<Suspense fallback={<Spinner />}><Widget delayMs={900} /></Suspense>
<Suspense fallback={<Spinner />}><Widget delayMs={1500} /></Suspense>`

function makeDelayed(ms, label) {
  return new Promise((resolve) => setTimeout(() => resolve(label), ms))
}

function Widget({ promise, ms }) {
  const label = use(promise)
  return (
    <div
      style={{
        padding: '0.6rem 0.9rem',
        border: '1px solid var(--border)',
        borderRadius: 8,
        background: 'var(--bg-elevated)',
      }}
    >
      ✅ {label} ready ({ms}ms)
    </div>
  )
}

function Fallback({ ms }) {
  return (
    <div
      style={{
        padding: '0.6rem 0.9rem',
        border: '1px dashed var(--border)',
        borderRadius: 8,
        color: 'var(--text-dim)',
      }}
    >
      ⏳ loading widget ({ms}ms)…
    </div>
  )
}

const DELAYS = [400, 900, 1500]

function SharedBoundaryDemo() {
  const [key, setKey] = useState(0)
  const [promises] = useState(() => DELAYS.map((ms) => makeDelayed(ms, `Widget ${ms}`)))

  return (
    <div key={key}>
      <button className="btn" onClick={() => setKey((k) => k + 1)}>
        Replay
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem' }}>
        <Suspense fallback={<Fallback ms="all 3" />}>
          {DELAYS.map((ms, i) => (
            <Widget key={ms} promise={promises[i]} ms={ms} />
          ))}
        </Suspense>
      </div>
      <p className="demo-note">
        Nothing appears until the slowest (1500ms) widget resolves — one fallback covers all
        three children.
      </p>
    </div>
  )
}

function SeparateBoundariesDemo() {
  const [key, setKey] = useState(0)
  const [promises] = useState(() => DELAYS.map((ms) => makeDelayed(ms, `Widget ${ms}`)))

  return (
    <div key={key}>
      <button className="btn" onClick={() => setKey((k) => k + 1)}>
        Replay
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem' }}>
        {DELAYS.map((ms, i) => (
          <Suspense key={ms} fallback={<Fallback ms={ms} />}>
            <Widget promise={promises[i]} ms={ms} />
          </Suspense>
        ))}
      </div>
      <p className="demo-note">
        Each widget pops in independently, as soon as it is ready — the fast 400ms widget doesn't
        wait for the slow 1500ms one.
      </p>
    </div>
  )
}

export default function SuspenseBoundaries() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="suspense-boundaries"
      level="advanced"
      title="Suspense Boundary Placement Patterns"
      summary="Where you place a Suspense boundary — wrapping many children together or giving each its own — directly controls whether loading async content 'pops in' together or independently, a real UX decision, not just plumbing."
      keyPoints={[
        'A single Suspense boundary around several async children shows one fallback until every child is ready — simple, but the fastest child waits for the slowest.',
        'Giving each child its own boundary lets each resolve and render independently — better perceived performance, at the cost of staggered, piece-by-piece rendering.',
        'Choose per-boundary when the pieces are visually independent (a dashboard\'s separate widgets); choose one shared boundary when showing them staggered would look broken (parts of one coherent card).',
        'Suspense boundaries can nest — an outer boundary can catch a fallback state that an inner, more specific boundary does not need to handle itself.',
        'This is the same underlying mechanism as the Lazy Loading & Suspense lesson\'s code-splitting demo — Suspense doesn\'t care whether a child is suspended waiting on a lazy-loaded component or on data via use(promise).',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — one shared boundary</h3>
        <div className="demo-live">
          <SharedBoundaryDemo />
        </div>
      </div>

      <div className="demo-section">
        <h3>Live demo — separate boundaries per widget</h3>
        <div className="demo-live">
          <SeparateBoundariesDemo />
        </div>
        <CodeBlock code={code} title="suspense-boundaries.jsx" />
      </div>

      <Callout kind="tip">
        Click "Replay" on each demo above and compare — same three widgets, same delays, visibly
        different loading experience purely from where the <code>&lt;Suspense&gt;</code>{' '}
        boundary sits in the tree.
      </Callout>
    </TopicPage>
  )
}
