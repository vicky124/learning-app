import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// A component whose "children" is a function — it owns some state/logic
// and hands the *rendering* decision to the caller.
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setPos({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) })
    }}>
      {children(pos)}
    </div>
  )
}

// Usage — the caller decides exactly what to render with the shared state:
<MouseTracker>
  {(pos) => <p>Mouse is at {pos.x}, {pos.y}</p>}
</MouseTracker>`

function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPos({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) })
      }}
      style={{
        height: 120,
        border: '1px dashed var(--border)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children(pos)}
    </div>
  )
}

export default function RenderProps() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="render-props"
      level="advanced"
      title="Render Props"
      summary="A render prop is a prop whose value is a function that returns JSX — it lets a component share stateful logic while leaving the actual rendering entirely up to the caller."
      keyPoints={[
        'The pattern: a component calls props.children(state) or props.render(state) instead of rendering fixed markup itself.',
        'Using "children" as the function (rather than a separate "render" prop) is the common modern spelling of this pattern.',
        'It cleanly separates "who owns the logic" from "who decides the markup" — useful for things like mouse position, list virtualization, or animation state.',
        'Downside: can lead to deep nesting ("render prop hell") when several are composed together.',
        'Custom hooks now cover most of these use cases with less nesting — render props remain useful when you specifically need to control *where* something renders in the tree.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — move your mouse over the box</h3>
        <div className="demo-live">
          <MouseTracker>
            {(pos) => (
              <p style={{ margin: 0 }}>
                Mouse position: <strong>{pos.x}</strong>, <strong>{pos.y}</strong>
              </p>
            )}
          </MouseTracker>
        </div>
        <CodeBlock code={code} title="MouseTracker.jsx" />
      </div>

      <Callout kind="note">
        The same <code>MouseTracker</code> could power a tooltip, a custom cursor, or a
        drag-to-select box — the logic doesn't change, only what the caller passes as{' '}
        <code>children</code>.
      </Callout>
    </TopicPage>
  )
}
