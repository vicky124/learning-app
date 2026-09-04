import { useState } from 'react'
import { createPortal } from 'react-dom'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function Modal({ onClose, children }) {
  // Renders into document.body instead of the parent's DOM position,
  // while remaining part of the normal React tree (context, events still work).
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  )
}

function App() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(true)}>Open modal</button>
      {open && <Modal onClose={() => setOpen(false)}>Hello from a portal!</Modal>}
    </div>
  )
}`

function Modal({ onClose, children }) {
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '1.5rem',
          minWidth: 260,
        }}
      >
        {children}
        <div style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function PortalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ overflow: 'hidden', border: '1px dashed var(--border)', padding: '1rem', borderRadius: 8 }}>
      <p className="demo-note">
        This container has <code>overflow: hidden</code> — a normal child would get clipped, but
        the modal below escapes it via a portal straight to <code>document.body</code>.
      </p>
      <button className="btn" onClick={() => setOpen(true)}>
        Open modal
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <p style={{ marginTop: 0 }}>👋 Rendered outside the clipped container via a portal.</p>
        </Modal>
      )}
    </div>
  )
}

export default function Portals() {
  return (
    <TopicPage
      groupId="advanced"
      topicId="portals"
      level="advanced"
      title="Portals"
      summary="createPortal renders children into a DOM node outside the parent component's DOM hierarchy, while keeping them inside the same React tree for context, state, and event bubbling."
      keyPoints={[
        'createPortal(children, domNode) — the second argument is any DOM node, often document.body.',
        'Ideal for modals, tooltips, and dropdowns that need to visually escape a parent with overflow:hidden or a low z-index.',
        'Events still bubble through the React tree as if the portal content were rendered in place, not through the actual DOM ancestry.',
        'Context providers above the portal call site are still visible to the portaled content — it is not a separate app.',
        "Remember to stopPropagation on the inner content's click if the overlay itself closes on click, so clicking inside doesn't also close it.",
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <div className="demo-live">
          <PortalDemo />
        </div>
        <CodeBlock code={code} title="Modal.jsx" />
      </div>

      <Callout kind="tip">
        Inspect the DOM with your browser's dev tools while the modal is open — you'll find it
        as a direct child of <code>&lt;body&gt;</code>, not nested inside this lesson's card.
      </Callout>
    </TopicPage>
  )
}
