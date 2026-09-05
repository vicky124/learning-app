import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// CSS-transition approach: toggle a class, let CSS handle the animation.
function Panel({ open }) {
  return (
    <div className={\`panel \${open ? 'panel--open' : ''}\`}>
      Content that grows/fades in
    </div>
  )
}
/* .panel { max-height: 0; opacity: 0; transition: max-height .3s, opacity .3s; }
   .panel--open { max-height: 200px; opacity: 1; } */

// View Transitions API: animate a DOM change as a smooth cross-fade/morph,
// without hand-writing the transition yourself.
function toggleWithViewTransition(setOpen) {
  if (!document.startViewTransition) {
    setOpen((o) => !o) // unsupported browser: falls back to an instant change
    return
  }
  document.startViewTransition(() => {
    // React's DOM update happens synchronously enough inside this
    // callback for the browser to capture before/after snapshots.
    setOpen((o) => !o)
  })
}`

function CssTransitionDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button className="btn" onClick={() => setOpen((o) => !o)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.3s ease',
          marginTop: '0.6rem',
          border: '1px dashed var(--border)',
          borderRadius: 8,
          padding: open ? '0.8rem 1rem' : '0 1rem',
        }}
      >
        <p style={{ margin: 0 }}>
          This panel's height and opacity are plain CSS properties — React only ever toggles the
          <code> open</code> boolean; the browser's compositor handles the animation itself.
        </p>
      </div>
    </div>
  )
}

function ViewTransitionDemo() {
  const [open, setOpen] = useState(false)
  const supported = typeof document !== 'undefined' && 'startViewTransition' in document

  function toggle() {
    if (!supported) {
      setOpen((o) => !o)
      return
    }
    document.startViewTransition(() => setOpen((o) => !o))
  }

  return (
    <div>
      <button className="btn" onClick={toggle}>
        {open ? 'Show list view' : 'Show grid view'}
      </button>
      <p className="demo-note">
        {supported
          ? 'Your browser supports the View Transitions API — toggling will cross-fade smoothly.'
          : "Your browser doesn't support the View Transitions API — this falls back to an instant swap, exactly like the code's if-check above."}
      </p>
      <div style={{ marginTop: '0.6rem', display: open ? 'flex' : 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {['🍎', '🍌', '🍇'].map((emoji) => (
          <div
            key={emoji}
            style={{
              padding: '0.8rem',
              textAlign: 'center',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: '1.4rem',
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Animation() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="animation"
      level="advanced"
      title="Animating with CSS Transitions & the View Transitions API"
      summary="Most React animations are just CSS reacting to a state-driven class or inline style — React's job is only to flip the boolean; the browser's compositor does the actual animating."
      keyPoints={[
        "The cheapest, most common React animation pattern: toggle a class/style based on state, let a CSS transition animate the property change.",
        'Animate transform/opacity where possible — the browser can run these on the compositor thread without triggering layout/paint on every frame, unlike animating height/width/top/left directly.',
        'A CSS transition needs an actual before/after state change to animate — an element mounted already in its "final" class shows no transition (see the React 19 lesson\'s "combine to one section" note on similar gotchas — mount in the initial state first, then flip the class).',
        'The View Transitions API (document.startViewTransition(updateCallback)) lets the browser automatically capture before/after snapshots of a DOM change and cross-fade/morph between them, without hand-writing the transition.',
        'For complex, interruptible, or physics-based animation (drag gestures, staggered lists), a dedicated library (Framer Motion, React Spring) handles far more than plain CSS can express cleanly.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — CSS transition on state change</h3>
        <div className="demo-live">
          <CssTransitionDemo />
        </div>
      </div>

      <div className="demo-section">
        <h3>Live demo — View Transitions API</h3>
        <div className="demo-live">
          <ViewTransitionDemo />
        </div>
        <CodeBlock code={code} title="animation.jsx" />
      </div>

      <Callout kind="note">
        The View Transitions API is a genuinely newer browser capability with growing but not
        universal support — always feature-detect (<code>'startViewTransition' in document</code>
        ) and fall back to an instant (or CSS-transitioned) update, exactly like the demo above.
      </Callout>
    </TopicPage>
  )
}
