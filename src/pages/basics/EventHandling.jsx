import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function ClickTracker() {
  const [clicks, setClicks] = useState(0)

  function handleClick(event) {
    // event is a React SyntheticEvent — a cross-browser wrapper around the native event
    console.log('native type:', event.type)
    setClicks((c) => c + 1)
  }

  return <button onClick={handleClick}>Clicked {clicks} times</button>
}

function StopPropagationDemo() {
  function handleInner(e) {
    e.stopPropagation() // prevents the outer div's handler from firing
    alert('Inner button clicked')
  }
  return (
    <div onClick={() => alert('Outer div clicked')}>
      <button onClick={handleInner}>Click me (stops propagation)</button>
    </div>
  )
}`

function ClickTracker() {
  const [clicks, setClicks] = useState(0)
  const [lastKey, setLastKey] = useState('—')
  return (
    <div>
      <button className="btn" onClick={() => setClicks((c) => c + 1)}>
        Clicked {clicks} times
      </button>
      <div style={{ marginTop: '0.8rem' }}>
        <input
          type="text"
          placeholder="Focus and press a key…"
          onKeyDown={(e) => setLastKey(e.key)}
        />
        <span style={{ marginLeft: '0.6rem' }} className="pill">
          last key: {lastKey}
        </span>
      </div>
    </div>
  )
}

function StopPropagationDemo() {
  const [log, setLog] = useState([])
  const push = (msg) => setLog((l) => [msg, ...l].slice(0, 4))
  return (
    <div>
      <div
        onClick={() => push('Outer div handler fired')}
        style={{ border: '1px dashed var(--border)', padding: '1rem', borderRadius: 8 }}
      >
        Outer area — click anywhere here
        <div style={{ marginTop: '0.6rem' }}>
          <button
            className="btn"
            onClick={(e) => {
              e.stopPropagation()
              push('Inner button handler fired (propagation stopped)')
            }}
          >
            Inner button (stops propagation)
          </button>
        </div>
      </div>
      <ul style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </div>
  )
}

export default function EventHandling() {
  return (
    <TopicPage
      groupId="basics"
      topicId="events"
      level="basics"
      title="Event Handling"
      summary="React wraps native DOM events in a SyntheticEvent for consistent cross-browser behavior, and wires listeners with camelCase props like onClick instead of addEventListener."
      keyPoints={[
        'Pass a function reference (onClick={handleClick}), not a call (onClick={handleClick()}).',
        'The handler receives a SyntheticEvent; call event.preventDefault() / event.stopPropagation() as usual.',
        'React attaches one listener at the root and dispatches synthetically — you rarely need addEventListener yourself.',
        'Inline arrow functions (onClick={() => doThing(id)}) are fine for passing arguments, at the cost of a new function per render.',
        'Events bubble by default: a click inside a nested button also triggers ancestor onClick handlers unless stopped.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — click & keyboard events</h3>
        <div className="demo-live">
          <ClickTracker />
        </div>
        <CodeBlock code={code} title="events.jsx" />
      </div>

      <div className="demo-section">
        <h3>Live demo — event bubbling & stopPropagation</h3>
        <div className="demo-live">
          <StopPropagationDemo />
        </div>
      </div>

      <Callout kind="note">
        React 17+ attaches events to the root DOM container the app renders into (not{' '}
        <code>document</code>), which makes it safe to mix multiple React roots on one page.
      </Callout>
    </TopicPage>
  )
}
