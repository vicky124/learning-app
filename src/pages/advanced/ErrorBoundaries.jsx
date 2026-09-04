import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'
import ErrorBoundary from '../../components/ErrorBoundary.jsx'

const code = `class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error } // triggers the fallback render on the next pass
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info.componentStack)
  }

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}

// Usage — wrap any subtree that might throw during render:
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <BuggyWidget />
</ErrorBoundary>`

function BuggyWidget({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Simulated render error from BuggyWidget')
  }
  return <p>✅ BuggyWidget rendered fine.</p>
}

function ErrorBoundaryDemo() {
  const [shouldThrow, setShouldThrow] = useState(false)
  const [resetToken, setResetToken] = useState(0)

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
        <button className="btn" onClick={() => setShouldThrow((v) => !v)}>
          {shouldThrow ? 'Fix the widget' : 'Break the widget'}
        </button>
      </div>
      <ErrorBoundary
        key={resetToken}
        fallback={(error, reset) => (
          <div className="callout callout--pitfall">
            <span className="callout__icon">🐛</span>
            <div className="callout__body">
              <strong>Caught: {error.message}</strong>
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  className="btn"
                  onClick={() => {
                    setShouldThrow(false)
                    reset()
                    setResetToken((t) => t + 1)
                  }}
                >
                  Reset boundary
                </button>
              </div>
            </div>
          </div>
        )}
      >
        <BuggyWidget shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  )
}

export default function ErrorBoundaries() {
  return (
    <TopicPage
      groupId="advanced"
      topicId="error-boundaries"
      level="advanced"
      title="Error Boundaries"
      summary="An error boundary is a component that catches JavaScript errors thrown anywhere in its child tree during rendering, logs them, and displays a fallback UI instead of crashing the whole app."
      keyPoints={[
        'Error boundaries must be class components — getDerivedStateFromError and componentDidCatch have no hook equivalent yet.',
        'They only catch errors during rendering, in lifecycle methods, and in constructors of the tree below them.',
        'They do NOT catch errors in event handlers, async code, server-side rendering, or errors thrown in the boundary itself.',
        'Use a try/catch inside event handlers or .catch() on promises for those cases instead.',
        'Place boundaries strategically — around a whole route, or around an individual risky widget — so one failure does not take down the entire page.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <div className="demo-live">
          <ErrorBoundaryDemo />
        </div>
        <CodeBlock code={code} title="ErrorBoundary.jsx" />
      </div>

      <Callout kind="warning">
        No <code>useErrorBoundary()</code> hook exists in stable React — libraries like{' '}
        <code>react-error-boundary</code> wrap the class-component mechanics for you, but the
        underlying primitive is still a class.
      </Callout>
    </TopicPage>
  )
}
