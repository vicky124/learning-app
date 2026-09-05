import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// React.memo skips re-rendering a component if its props are shallow-equal
// to last time.
const ExpensiveRow = memo(function ExpensiveRow({ label, onClick }) {
  console.log('rendering', label)
  return <button onClick={onClick}>{label}</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  // useMemo: recompute only when a dependency changes, not every render.
  const expensiveValue = useMemo(() => {
    console.log('recomputing…')
    return count * 2
  }, [count])

  // useCallback: keep the same function identity across renders so
  // ExpensiveRow's memo() comparison sees "unchanged props".
  const handleClick = useCallback(() => setCount((c) => c + 1), [])

  return (
    <div>
      <p>Doubled: {expensiveValue}</p>
      <ExpensiveRow label="Increment count" onClick={handleClick} />
      <button onClick={() => setOther((o) => o + 1)}>Re-render parent ({other})</button>
    </div>
  )
}`

const ExpensiveRow = memo(function ExpensiveRow({ label, onClick, onRender }) {
  // Reporting the render up via an effect (rather than mutating something
  // during the render itself) keeps this component's render pure.
  useEffect(() => {
    onRender()
  })
  return (
    <button className="btn" onClick={onClick}>
      {label}
    </button>
  )
})

function MemoDemo() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)
  const [useStableCallback, setUseStableCallback] = useState(true)
  const rowRenderCount = useRef(0)
  const reportRender = useCallback(() => {
    rowRenderCount.current += 1
  }, [])

  const expensiveValue = useMemo(() => count * 2, [count])

  const stableClick = useCallback(() => setCount((c) => c + 1), [])
  const unstableClick = () => setCount((c) => c + 1)
  const handleClick = useStableCallback ? stableClick : unstableClick

  return (
    <div>
      <p>
        Doubled value: <strong>{expensiveValue}</strong> · ExpensiveRow render count so far:{' '}
        <strong>{rowRenderCount.current}</strong>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        <ExpensiveRow label={`Increment count (${count})`} onClick={handleClick} onRender={reportRender} />
        <button className="btn" onClick={() => setOther((o) => o + 1)}>
          Re-render parent only ({other})
        </button>
        <label style={{ fontSize: '0.85rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={useStableCallback}
            onChange={(e) => setUseStableCallback(e.target.checked)}
          />
          use useCallback (stable identity)
        </label>
      </div>
      <p className="demo-note">
        Click "Re-render parent only" a few times, then toggle the checkbox off and repeat:
        without <code>useCallback</code>, <code>ExpensiveRow</code> gets a brand-new{' '}
        <code>onClick</code> every render, so <code>memo()</code> can no longer skip it — the
        render count climbs even though nothing it displays changed.
      </p>
    </div>
  )
}

export default function Performance() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="performance"
      level="advanced"
      title="memo, useMemo & useCallback"
      summary="These three tools all fight the same problem — unnecessary re-renders and recomputation — by letting React skip work when nothing relevant has actually changed."
      keyPoints={[
        'React.memo(Component) skips re-rendering when props are shallow-equal to the previous render.',
        'useMemo(fn, deps) caches the return value of an expensive computation between renders.',
        'useCallback(fn, deps) caches a function reference itself — most useful so a memoized child does not see a "new" prop every render.',
        'None of these make a single render faster — they only let React skip renders/work entirely. Profile before reaching for them.',
        'Overusing memoization adds complexity and its own overhead; apply it where profiling shows a real, measurable win.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — memo + useCallback interaction</h3>
        <div className="demo-live">
          <MemoDemo />
        </div>
        <CodeBlock code={code} title="performance.jsx" />
      </div>

      <Callout kind="warning">
        <code>memo()</code> only performs a shallow prop comparison. Passing a new object,
        array, or function literal as a prop every render (e.g. <code>style=&#123;&#123;...&#125;&#125;</code>)
        defeats it — the reference is different even if the contents look the same.
      </Callout>
    </TopicPage>
  )
}
