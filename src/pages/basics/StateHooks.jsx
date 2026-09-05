import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function Counter() {
  const [count, setCount] = useState(0)

  // Functional update form — safe when the next value depends on the previous one
  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset = () => setCount(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>-1</button>
      <button onClick={increment}>+1</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p style={{ fontSize: '1.4rem', margin: '0 0 0.6rem' }}>Count: {count}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn" onClick={() => setCount((c) => c - 1)}>
          -1
        </button>
        <button className="btn" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <button className="btn" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </div>
  )
}

function LazyInitDemo() {
  const [seed] = useState(() => {
    // This runs only on the very first render, not on every re-render.
    return Math.floor(Math.random() * 1000)
  })
  const [, force] = useState(0)
  return (
    <div>
      <p>
        Lazily-initialized random seed: <strong>{seed}</strong>
      </p>
      <button className="btn" onClick={() => force((n) => n + 1)}>
        Re-render this component
      </button>
      <p className="demo-note">Click re-render — the seed stays the same because the initializer only runs once.</p>
    </div>
  )
}

export default function StateHooks() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="state"
      level="basics"
      title="State with useState"
      summary="State is data a component owns that can change over time. Calling the setter schedules a re-render with the new value — React does not mutate state in place."
      keyPoints={[
        'useState(initial) returns a [value, setValue] pair.',
        'Setting state schedules a re-render; it does not update the variable synchronously in the current render.',
        'Use the functional updater setX(prev => next) whenever the new value depends on the old one.',
        'Pass a function to useState (lazy initialization) when computing the initial value is expensive.',
        'State is local to the component instance — two instances of the same component have independent state.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — Counter</h3>
        <div className="demo-live">
          <Counter />
        </div>
        <CodeBlock code={code} title="Counter.jsx" />
      </div>

      <div className="demo-section">
        <h3>Live demo — Lazy initialization</h3>
        <div className="demo-live">
          <LazyInitDemo />
        </div>
      </div>

      <Callout kind="pitfall">
        <code>setCount(count + 1)</code> called twice in the same event handler only increments
        once, because both calls close over the same stale <code>count</code>. Use{' '}
        <code>setCount(c =&gt; c + 1)</code> to queue updates that build on each other correctly.
      </Callout>
    </TopicPage>
  )
}
