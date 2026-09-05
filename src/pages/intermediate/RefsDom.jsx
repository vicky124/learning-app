import { useEffect, useRef, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function AutoFocusInput() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus() // imperative DOM access, opt-in escape hatch
  }, [])

  return <input ref={inputRef} placeholder="Auto-focused on mount" />
}

function RenderCounter() {
  const [text, setText] = useState('')
  const renders = useRef(0)
  renders.current += 1 // mutating a ref does NOT trigger a re-render

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>This component has rendered {renders.current} times</p>
    </div>
  )
}`

function AutoFocusInput() {
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  return <input ref={inputRef} placeholder="Auto-focused on mount" />
}

function RenderCounter() {
  const [text, setText] = useState('')
  const renders = useRef(0)
  renders.current += 1
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here…" />
      <p className="demo-note">
        This component has rendered <strong>{renders.current}</strong> times. The counter itself
        does not cause re-renders — only the <code>setText</code> calls do.
      </p>
    </div>
  )
}

export default function RefsDom() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="refs"
      level="intermediate"
      title="useRef & the DOM"
      summary="useRef returns a mutable { current } box that persists across renders without causing re-renders when it changes — used both for direct DOM access and for stashing any mutable value."
      keyPoints={[
        'ref={someRef} on a DOM element gives you someRef.current, the actual DOM node.',
        'Mutating ref.current does not trigger a re-render — unlike setState, it is fully "silent".',
        "Common uses: focusing an input, reading scroll position, storing a timer/interval id, tracking a previous value.",
        "Refs persist for the component's whole lifetime, unlike ordinary variables which reset every render.",
        "Don't read or write ref.current during rendering — only in effects and event handlers.",
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — imperative focus</h3>
        <div className="demo-live">
          <AutoFocusInput />
        </div>
        <CodeBlock code={code} title="refs.jsx" />
      </div>

      <div className="demo-section">
        <h3>Live demo — ref as a render-less counter</h3>
        <div className="demo-live">
          <RenderCounter />
        </div>
      </div>

      <Callout kind="tip">
        Rule of thumb: if a value should show up on screen, it belongs in state. If it's purely
        an implementation detail (a DOM node, an interval id, "did we already fetch this?"), a
        ref is the right tool.
      </Callout>
    </TopicPage>
  )
}
