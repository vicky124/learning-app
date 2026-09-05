import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function StatusBadge({ status }) {
  // 1. if/else style, computed before the return
  if (status === 'loading') return <span>Loading…</span>

  return (
    <span>
      {/* 2. ternary for either/or */}
      {status === 'error' ? '❌ Error' : '✅ OK'}

      {/* 3. && for render-or-nothing (careful with falsy numbers like 0!) */}
      {status === 'ok' && <em> — all systems normal</em>}
    </span>
  )
}`

function StatusBadge({ status }) {
  if (status === 'loading') return <span>Loading…</span>
  return (
    <span>
      {status === 'error' ? '❌ Error' : '✅ OK'}
      {status === 'ok' && <em> — all systems normal</em>}
    </span>
  )
}

function ConditionalDemo() {
  const [status, setStatus] = useState('ok')
  const [showDetails, setShowDetails] = useState(false)
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
        {['ok', 'loading', 'error'].map((s) => (
          <button key={s} className="btn" onClick={() => setStatus(s)}>
            {s}
          </button>
        ))}
      </div>
      <p>
        Status: <StatusBadge status={status} />
      </p>
      <button className="btn" onClick={() => setShowDetails((v) => !v)}>
        {showDetails ? 'Hide' : 'Show'} details
      </button>
      {showDetails && (
        <p className="demo-note">
          These extra details only exist in the tree while <code>showDetails</code> is true —
          they are mounted/unmounted, not just hidden with CSS.
        </p>
      )}
    </div>
  )
}

export default function ConditionalRendering() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="conditional-rendering"
      level="basics"
      title="Conditional Rendering"
      summary="Because JSX is just JavaScript, you show or hide UI with the same tools you'd use anywhere else: if statements, ternaries, and logical &&."
      keyPoints={[
        'Early-return from a component to render a completely different tree for a special case.',
        'condition ? <A /> : <B /> for either/or branches inside JSX.',
        'condition && <A /> to render something or nothing — but guard against condition being 0, "" or NaN, which would render literally.',
        'Conditionally rendering unmounts the hidden branch entirely (state resets), unlike CSS display:none which keeps it mounted.',
        'Extract a variable before the return when the JSX would otherwise get hard to read.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <div className="demo-live">
          <ConditionalDemo />
        </div>
        <CodeBlock code={code} title="StatusBadge.jsx" />
      </div>

      <Callout kind="pitfall">
        <code>{'{count && <Badge />}'}</code> renders a literal <code>0</code> on the page when{' '}
        <code>count</code> is <code>0</code>, because <code>0</code> is falsy but not{' '}
        <code>false</code>/<code>null</code>/<code>undefined</code>. Prefer{' '}
        <code>{'{count > 0 && <Badge />}'}</code>.
      </Callout>
    </TopicPage>
  )
}
