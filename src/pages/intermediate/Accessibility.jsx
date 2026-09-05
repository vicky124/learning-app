import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// Inaccessible: looks like a button, but Tab skips it and Enter/Space do nothing.
function BadToggle({ on, onToggle }) {
  return <div className="toggle" onClick={onToggle}>{on ? 'On' : 'Off'}</div>
}

// Accessible: a real <button>, or a div with the semantics added back manually.
function GoodToggle({ on, onToggle }) {
  return (
    <button
      className="toggle"
      onClick={onToggle}
      aria-pressed={on}         // announces "pressed"/"not pressed" to screen readers
    >
      {on ? 'On' : 'Off'}
    </button>
  )
}

// Announcing a dynamic update to screen readers (e.g. after an async save)
function SaveStatus({ status }) {
  return (
    <p role="status" aria-live="polite">
      {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved.' : ''}
    </p>
  )
}`

function BadToggle({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'inline-block',
        padding: '0.4rem 0.9rem',
        borderRadius: 6,
        background: on ? 'var(--accent-soft)' : 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
      }}
    >
      {on ? 'On' : 'Off'} (div — try Tab, then Enter/Space)
    </div>
  )
}

function GoodToggle({ on, onToggle }) {
  return (
    <button className="btn" onClick={onToggle} aria-pressed={on}>
      {on ? 'On' : 'Off'} (button — Tab + Enter/Space both work)
    </button>
  )
}

function KeyboardDemo() {
  const [badOn, setBadOn] = useState(false)
  const [goodOn, setGoodOn] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-start' }}>
      <BadToggle on={badOn} onToggle={() => setBadOn((v) => !v)} />
      <GoodToggle on={goodOn} onToggle={() => setGoodOn((v) => !v)} />
      <p className="demo-note">
        Click into this demo, then press <kbd>Tab</kbd> to move focus and{' '}
        <kbd>Enter</kbd>/<kbd>Space</kbd> to activate. The <code>div</code> can only be operated
        with a mouse — a keyboard-only or screen-reader user cannot use it at all.
      </p>
    </div>
  )
}

function LiveRegionDemo() {
  const [status, setStatus] = useState('idle')
  function simulateSave() {
    setStatus('saving')
    setTimeout(() => setStatus('saved'), 1200)
  }
  return (
    <div>
      <button className="btn" onClick={simulateSave}>
        Save
      </button>
      <p role="status" aria-live="polite" className="demo-note" style={{ minHeight: '1.4em' }}>
        {status === 'saving' ? 'Saving…' : status === 'saved' ? '✅ Saved.' : ''}
      </p>
      <p className="demo-note">
        <code>aria-live="polite"</code> makes a screen reader announce this text automatically
        when it changes — without it, a sighted user sees "Saved." appear, but a screen-reader
        user gets no notification at all unless they happen to re-focus this element.
      </p>
    </div>
  )
}

export default function Accessibility() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="a11y"
      level="intermediate"
      title="Accessibility (a11y) Patterns"
      summary="Most accessibility bugs in React apps come from re-implementing interactive elements that native HTML already provides for free — losing keyboard support and screen-reader semantics in the process."
      keyPoints={[
        'Prefer a real <button>/<a>/<select> over a styled <div> whenever one exists — you get keyboard operability and correct semantics for free.',
        'When a native element genuinely cannot express the UI, add back what was lost: a role, tabIndex={0}, an onKeyDown handler for Enter/Space, and the relevant aria-* state attributes.',
        'aria-live="polite" (or role="status") announces dynamic content changes to screen readers — without it, visual-only updates are invisible to non-sighted users.',
        'aria-pressed, aria-expanded, aria-selected communicate a control\'s current state, mirroring what a sighted user sees visually (a highlighted toggle, an open panel).',
        'Test with a keyboard alone (unplug the mouse mentally): if you cannot reach and operate every interactive element with Tab/Enter/Space/Arrow keys, neither can many real users.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — keyboard operability</h3>
        <div className="demo-live">
          <KeyboardDemo />
        </div>
        <CodeBlock code={code} title="accessible-toggle.jsx" />
      </div>

      <div className="demo-section">
        <h3>Live demo — announcing dynamic updates</h3>
        <div className="demo-live">
          <LiveRegionDemo />
        </div>
      </div>

      <Callout kind="tip">
        Browser extensions like axe DevTools (and the Lighthouse accessibility audit built into
        Chrome DevTools) catch a large share of these issues automatically — run one on any page
        you build, but treat it as a floor, not a ceiling: automated tools cannot verify that
        your keyboard flow or announcements actually make sense.
      </Callout>
    </TopicPage>
  )
}
