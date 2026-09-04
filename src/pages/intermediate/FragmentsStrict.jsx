import { Fragment, StrictMode, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function DefinitionRow({ term, description }) {
  // Fragment groups two elements without adding an extra DOM node —
  // needed here because <dl> requires <dt>/<dd> as direct children.
  return (
    <>
      <dt>{term}</dt>
      <dd>{description}</dd>
    </>
  )
}

function Glossary() {
  return (
    <dl>
      <DefinitionRow term="JSX" description="Syntax extension for writing markup in JS" />
      <DefinitionRow term="Hook" description="Function that lets you use React features" />
    </dl>
  )
}`

function DefinitionRow({ term, description }) {
  return (
    <>
      <dt style={{ fontWeight: 600 }}>{term}</dt>
      <dd style={{ marginBottom: '0.5rem', color: 'var(--text-dim)' }}>{description}</dd>
    </>
  )
}

function Glossary() {
  return (
    <dl style={{ margin: 0 }}>
      <DefinitionRow term="JSX" description="Syntax extension for writing markup in JS" />
      <DefinitionRow term="Hook" description="Function that lets you use React features" />
      <Fragment key="fragment-with-key">
        <dt style={{ fontWeight: 600 }}>Fragment</dt>
        <dd style={{ color: 'var(--text-dim)' }}>
          Groups children with zero extra DOM nodes; use <code>&lt;Fragment key=...&gt;</code>{' '}
          (not the <code>&lt;&gt;</code> shorthand) when a key is needed, e.g. inside a list.
        </dd>
      </Fragment>
    </dl>
  )
}

let mountLog = []
function LoggingChild() {
  const [mounts] = useState(() => {
    mountLog.push('mount')
    return mountLog.length
  })
  return <span className="pill">mount #{mounts} for this instance</span>
}

function StrictModeDemo() {
  const [key, setKey] = useState(0)
  return (
    <div>
      <button
        className="btn"
        onClick={() => {
          mountLog = []
          setKey((k) => k + 1)
        }}
      >
        Remount child (watch console)
      </button>
      <div style={{ marginTop: '0.6rem' }}>
        <StrictMode>
          <LoggingChild key={key} />
        </StrictMode>
      </div>
      <p className="demo-note">
        In development, StrictMode mounts, unmounts, then remounts this child once, on purpose —
        that's why effects/log statements can appear to run twice.
      </p>
    </div>
  )
}

export default function FragmentsStrict() {
  return (
    <TopicPage
      groupId="intermediate"
      topicId="fragments"
      level="intermediate"
      title="Fragments & Strict Mode"
      summary="Fragments (<>...</>) let a component return multiple elements without an extra wrapper DOM node. StrictMode is a development-only wrapper that helps surface unsafe patterns early."
      keyPoints={[
        '<>...</> is shorthand for <Fragment>...</Fragment> — use the explicit form only when you need to pass a key.',
        'Fragments avoid invalid/unwanted DOM nesting, e.g. returning <dt>/<dd> pairs, or <tr> rows from a component used inside a <table>.',
        '<StrictMode> adds no UI; it only runs extra checks and double-invokes certain functions in development to catch impure logic.',
        'Effects, state initializers, and reducers should be pure enough to safely run twice — if double-invocation breaks something, that logic needs fixing, not StrictMode removing.',
        'StrictMode has zero effect in production builds — it is purely a development-time safety net.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — Fragment grouping</h3>
        <div className="demo-live">
          <Glossary />
        </div>
        <CodeBlock code={code} title="Fragments.jsx" />
      </div>

      <div className="demo-section">
        <h3>Live demo — StrictMode double-invoking on mount</h3>
        <div className="demo-live">
          <StrictModeDemo />
        </div>
      </div>

      <Callout kind="note">
        This whole app is already wrapped in <code>&lt;StrictMode&gt;</code> at the root (see{' '}
        <code>src/main.jsx</code>) — that's on by default from the Vite React template.
      </Callout>
    </TopicPage>
  )
}
