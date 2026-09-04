import { Suspense, lazy, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `import { lazy, Suspense, useState } from 'react'

// The import() only fires the first time HeavyPanel actually renders,
// producing a separate JS chunk the bundler loads on demand.
const HeavyPanel = lazy(() => import('./HeavyPanel.jsx'))

function App() {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button onClick={() => setShow(true)}>Load heavy panel</button>
      {show && (
        <Suspense fallback={<p>Loading chunk…</p>}>
          <HeavyPanel />
        </Suspense>
      )}
    </div>
  )
}`

const HeavyPanel = lazy(
  () =>
    new Promise((resolve) => {
      // Artificial delay so the Suspense fallback is actually visible in the demo.
      setTimeout(() => resolve(import('./HeavyPanel.jsx')), 800)
    })
)

function CodeSplittingDemo() {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button className="btn" onClick={() => setShow(true)} disabled={show}>
        {show ? 'Loading / loaded below' : 'Load heavy panel'}
      </button>
      <div style={{ marginTop: '0.8rem' }}>
        {show && (
          <Suspense fallback={<p className="demo-note">⏳ Loading chunk…</p>}>
            <HeavyPanel />
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default function CodeSplitting() {
  return (
    <TopicPage
      groupId="advanced"
      topicId="code-splitting"
      level="advanced"
      title="Lazy Loading & Suspense"
      summary="React.lazy() plus dynamic import() lets you split a component into its own bundle chunk, fetched only when it's first rendered. Suspense declares what to show while that chunk is loading."
      keyPoints={[
        'lazy(() => import("./Component.jsx")) returns a component that resolves once the module has loaded.',
        '<Suspense fallback={...}> must wrap (an ancestor of) any lazy component, and shows the fallback while it loads.',
        'A single Suspense boundary can cover many lazy children — the fallback shows until all of them are ready.',
        'Route-level code splitting (one chunk per page) is the most common and highest-impact use — see the routing lesson.',
        'Suspense in React 18/19 also integrates with data fetching (frameworks like Next.js/Relay) and features like useTransition, beyond just lazy().',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <p className="demo-note">
          An artificial 800ms delay was added so you can actually see the Suspense fallback.
        </p>
        <div className="demo-live">
          <CodeSplittingDemo />
        </div>
        <CodeBlock code={code} title="CodeSplitting.jsx" />
      </div>

      <Callout kind="tip">
        Open your browser's Network tab, refresh, then click "Load heavy panel" — you'll see a
        new JS chunk request fire at that moment rather than at initial page load.
      </Callout>
    </TopicPage>
  )
}
