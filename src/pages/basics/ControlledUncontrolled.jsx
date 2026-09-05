import { useRef, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// Controlled: React state is the single source of truth.
function ControlledInput() {
  const [value, setValue] = useState('')
  return (
    <input value={value} onChange={(e) => setValue(e.target.value)} />
    // re-renders on every keystroke — you can validate/transform live
  )
}

// Uncontrolled: the DOM holds the value; React reads it only when needed.
function UncontrolledInput() {
  const inputRef = useRef(null)
  function handleSubmit(e) {
    e.preventDefault()
    alert(inputRef.current.value) // read once, at submit time
  }
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  )
}`

function ControlledDemo() {
  const [value, setValue] = useState('')
  const [renders, setRenders] = useState(0)
  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setRenders((r) => r + 1)
        }}
        placeholder="Type here…"
      />
      <p className="demo-note">
        Live value: <strong>{value || '""'}</strong> — this component re-rendered{' '}
        <strong>{renders}</strong> time(s) as you typed, because React state changes on every
        keystroke.
      </p>
    </div>
  )
}

function UncontrolledDemo() {
  const inputRef = useRef(null)
  const [submitted, setSubmitted] = useState(null)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(inputRef.current.value)
      }}
    >
      <input ref={inputRef} defaultValue="" placeholder="Type here…" />
      <button className="btn" type="submit" style={{ marginLeft: '0.5rem' }}>
        Submit
      </button>
      <p className="demo-note">
        React never sees a keystroke here — only when you submit does the code read{' '}
        <code>inputRef.current.value</code>. Submitted:{' '}
        <strong>{submitted !== null ? `"${submitted}"` : '(nothing yet)'}</strong>
      </p>
    </form>
  )
}

export default function ControlledUncontrolled() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="controlled-uncontrolled"
      level="basics"
      title="Controlled vs Uncontrolled Components"
      summary="A controlled input's value lives in React state; an uncontrolled input's value lives in the DOM and is only read via a ref when needed. Both are legitimate — the choice is about who owns the data at any given moment."
      keyPoints={[
        'Controlled: value={state} + onChange. React re-renders on every keystroke and is always the source of truth.',
        'Uncontrolled: ref + defaultValue (not value). The DOM owns the value; React reads it on demand via inputRef.current.value.',
        'Controlled inputs make live validation/formatting/masking straightforward, since every keystroke is visible to your code.',
        'Uncontrolled inputs avoid a re-render per keystroke — useful for large forms or performance-sensitive cases where only the final value matters.',
        'File inputs (<input type="file">) are always uncontrolled — the browser refuses to let JavaScript set their value for security reasons.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — controlled</h3>
        <div className="demo-live">
          <ControlledDemo />
        </div>
      </div>

      <div className="demo-section">
        <h3>Live demo — uncontrolled</h3>
        <div className="demo-live">
          <UncontrolledDemo />
        </div>
        <CodeBlock code={code} title="controlled-vs-uncontrolled.jsx" />
      </div>

      <Callout kind="tip">
        Libraries like <code>react-hook-form</code> deliberately keep most fields uncontrolled
        (registering a ref per field) and only sync to React state at validation/submit time —
        trading the "live value on every keystroke" convenience for far fewer re-renders on
        large forms.
      </Callout>
    </TopicPage>
  )
}
