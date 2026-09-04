import { useEffect, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function DocumentTitle({ count }) {
  // Runs after every commit where "count" changed — synchronizes the
  // component with something outside React (the browser tab title).
  useEffect(() => {
    document.title = \`Count: \${count}\`
  }, [count])

  return <p>Open the tab title to see it update.</p>
}

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    // Cleanup: runs before the next effect and on unmount — prevents leaks.
    return () => clearInterval(id)
  }, []) // empty deps => run once on mount, clean up on unmount

  return <p>Elapsed: {seconds}s</p>
}`

function DocumentTitleDemo() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = `Count: ${count} · React Learning App`
    return () => {
      document.title = 'React Learning App'
    }
  }, [count])
  return (
    <div>
      <p>
        Count: <strong>{count}</strong> — check the browser tab title.
      </p>
      <button className="btn" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
    </div>
  )
}

function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  return (
    <div>
      <p style={{ fontSize: '1.3rem' }}>⏱ {seconds}s</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button className="btn" onClick={() => setSeconds(0)}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default function EffectsLifecycle() {
  return (
    <TopicPage
      groupId="intermediate"
      topicId="effects"
      level="intermediate"
      title="useEffect & Lifecycle"
      summary="useEffect lets a component synchronize with something outside React — the DOM, a timer, a subscription, a network request — after React has committed changes to the screen."
      keyPoints={[
        'The dependency array controls when the effect re-runs: omitted = every render, [] = once on mount, [a, b] = when a or b changes.',
        'The function an effect returns is its cleanup — React runs it before the next effect execution and on unmount.',
        'Effects run after the browser has painted, so they never block visual updates.',
        "Think in terms of synchronization (\"keep X in sync with Y\"), not classic lifecycle names like componentDidMount.",
        "Don't put every side effect in useEffect — event-triggered logic (e.g. a fetch after a button click) usually belongs in the event handler itself.",
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — syncing the document title</h3>
        <div className="demo-live">
          <DocumentTitleDemo />
        </div>
        <CodeBlock code={code} title="effects.jsx" />
      </div>

      <div className="demo-section">
        <h3>Live demo — interval with cleanup</h3>
        <p className="demo-note">
          The cleanup function clears the previous interval whenever "running" changes, so
          intervals never stack up.
        </p>
        <div className="demo-live">
          <Timer />
        </div>
      </div>

      <Callout kind="warning">
        In development, React 18/19's Strict Mode intentionally mounts, unmounts, and
        re-mounts every component once to surface effects that aren't properly cleaned up. If
        your effect misbehaves only in dev with a double-log, that's the point — fix the
        missing cleanup rather than suppressing Strict Mode.
      </Callout>
    </TopicPage>
  )
}
