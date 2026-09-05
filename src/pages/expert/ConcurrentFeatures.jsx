import { useDeferredValue, useMemo, useState, useTransition } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function FilterableList({ items }) {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleChange(e) {
    const value = e.target.value
    setQuery(value) // urgent: keep the input responsive
    startTransition(() => {
      // non-urgent: the expensive filtered list can lag a frame behind
      // without blocking typing.
      setFilter(value)
    })
  }
  // ...
}

// useDeferredValue: similar goal, without needing a separate state setter —
// good when you don't control the value's origin (e.g. it's a prop).
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => expensiveSearch(deferredQuery), [deferredQuery])
  const isStale = query !== deferredQuery
  return <ul style={{ opacity: isStale ? 0.6 : 1 }}>{results.map(...)}</ul>
}`

function expensiveFilter(list, query) {
  // Artificially slow down filtering so the difference between blocking and
  // non-blocking updates is actually visible in this demo.
  const start = performance.now()
  while (performance.now() - start < 1) {
    /* burn a little time per call */
  }
  return list.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
}

const BIG_LIST = Array.from({ length: 4000 }, (_, i) => `Item #${i} — ${(i * 7919) % 97}`)

function TransitionDemo() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const results = useMemo(() => expensiveFilter(BIG_LIST, query), [query])

  function handleChange(e) {
    const value = e.target.value
    setInput(value)
    startTransition(() => setQuery(value))
  }

  return (
    <div>
      <input value={input} onChange={handleChange} placeholder="Filter 4,000 items…" />
      <p className="demo-note">
        {isPending ? '⏳ Updating list in the background…' : `${results.length} matches`} — the
        input above stays responsive because filtering runs as a low-priority transition.
      </p>
      <div style={{ maxHeight: 140, overflowY: 'auto', fontSize: '0.85rem', opacity: isPending ? 0.5 : 1 }}>
        {results.slice(0, 30).map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  )
}

function DeferredValueDemo() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => expensiveFilter(BIG_LIST, deferredQuery), [deferredQuery])
  const isStale = query !== deferredQuery

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter 4,000 items…" />
      <p className="demo-note">
        {isStale ? 'Showing slightly stale results while the fresh list catches up…' : `${results.length} matches`}
      </p>
      <div style={{ maxHeight: 140, overflowY: 'auto', fontSize: '0.85rem', opacity: isStale ? 0.5 : 1 }}>
        {results.slice(0, 30).map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  )
}

export default function ConcurrentFeatures() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="concurrent"
      level="expert"
      title="Concurrent Features"
      summary="useTransition and useDeferredValue let you mark some updates as lower priority, so React keeps the UI (typing, clicking) responsive while expensive re-renders happen in the background."
      keyPoints={[
        'useTransition() returns [isPending, startTransition] — wrap a state update in startTransition to mark it as interruptible/low priority.',
        'useDeferredValue(value) gives you a lagging copy of a value that updates after more urgent work finishes — no separate setter needed.',
        'Neither hook makes the underlying computation faster — they change scheduling, letting urgent updates (like a keystroke) preempt non-urgent ones.',
        'isPending (from useTransition) or comparing value !== deferredValue (with useDeferredValue) tells you when to show a stale/loading indicator.',
        "These are opt-in performance tools for specific bottlenecks — most components never need them; reach for them only when a measured interaction actually feels janky.",
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — useTransition</h3>
        <div className="demo-live">
          <TransitionDemo />
        </div>
      </div>

      <div className="demo-section">
        <h3>Live demo — useDeferredValue</h3>
        <div className="demo-live">
          <DeferredValueDemo />
        </div>
        <CodeBlock code={code} title="concurrent.jsx" />
      </div>

      <Callout kind="tip">
        Type quickly into either box above — notice the input never stutters even though
        filtering 4,000 items is deliberately slowed down to make the effect visible.
      </Callout>
    </TopicPage>
  )
}
