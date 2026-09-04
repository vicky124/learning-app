import { useImperativeHandle, useRef, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// React 19: function components accept "ref" as a normal prop — no
// forwardRef() wrapper needed anymore (older React needs forwardRef()).
function FancyInput({ ref, ...props }) {
  const inputRef = useRef(null)

  // useImperativeHandle customizes exactly what the parent's ref sees —
  // here, a small API instead of the raw DOM node.
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' },
  }))

  return <input ref={inputRef} {...props} />
}

function Parent() {
  const apiRef = useRef(null)
  return (
    <div>
      <FancyInput ref={apiRef} placeholder="Type something…" />
      <button onClick={() => apiRef.current.focus()}>Focus</button>
      <button onClick={() => apiRef.current.clear()}>Clear</button>
    </div>
  )
}`

function FancyInput({ ref, ...props }) {
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => {
      inputRef.current.value = ''
    },
  }))
  return <input ref={inputRef} {...props} />
}

function ForwardRefDemo() {
  const apiRef = useRef(null)
  const [note, setNote] = useState('')

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <FancyInput ref={apiRef} placeholder="Type something…" />
        <button
          className="btn"
          onClick={() => {
            apiRef.current.focus()
            setNote('Called apiRef.current.focus()')
          }}
        >
          Focus
        </button>
        <button
          className="btn"
          onClick={() => {
            apiRef.current.clear()
            setNote('Called apiRef.current.clear()')
          }}
        >
          Clear
        </button>
      </div>
      {note && <p className="demo-note">{note}</p>}
    </div>
  )
}

export default function ForwardRefImperative() {
  return (
    <TopicPage
      groupId="advanced"
      topicId="forward-ref"
      level="advanced"
      title="forwardRef & useImperativeHandle"
      summary="Refs normally only attach to DOM elements or class components. Function components need to opt in to exposing a ref, and useImperativeHandle lets them expose a curated API instead of the raw DOM node."
      keyPoints={[
        'In React 19, function components can declare ref as a normal prop; React 18 and earlier require wrapping with forwardRef((props, ref) => ...).',
        'useImperativeHandle(ref, () => ({...})) replaces what the parent sees on ref.current with a custom object.',
        'Use it to expose a minimal, intentional API (focus(), scrollIntoView(), reset()) instead of the entire underlying DOM node.',
        'This is an escape hatch for imperative needs (focus management, media playback, animations) — most component communication should still flow through props/state.',
        'Overusing imperative handles instead of props/state makes data flow harder to trace — reserve it for truly imperative operations.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <div className="demo-live">
          <ForwardRefDemo />
        </div>
        <CodeBlock code={code} title="FancyInput.jsx" />
      </div>

      <Callout kind="note">
        Before React 19, the same component needed{' '}
        <code>forwardRef((props, ref) =&gt; ...)</code> — plain props destructuring of{' '}
        <code>ref</code> is a React 19 addition that removes the extra wrapper.
      </Callout>
    </TopicPage>
  )
}
