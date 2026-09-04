import { useState } from 'react'
import { Link } from 'react-router-dom'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// A Higher-Order Component: a function that takes a component and
// returns a new component with extra behavior/props layered on.
function withLoading(Wrapped) {
  return function WithLoading({ isLoading, ...rest }) {
    if (isLoading) return <p>Loading…</p>
    return <Wrapped {...rest} />
  }
}

function UserList({ users }) {
  return <ul>{users.map((u) => <li key={u}>{u}</li>)}</ul>
}

const UserListWithLoading = withLoading(UserList)

// Usage: <UserListWithLoading isLoading={loading} users={users} />`

function withLoading(Wrapped) {
  return function WithLoading({ isLoading, ...rest }) {
    if (isLoading) return <p className="demo-note">Loading…</p>
    return <Wrapped {...rest} />
  }
}

function UserList({ users }) {
  return (
    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
      {users.map((u) => (
        <li key={u}>{u}</li>
      ))}
    </ul>
  )
}

const UserListWithLoading = withLoading(UserList)

function HOCDemo() {
  const [loading, setLoading] = useState(false)

  function simulateFetch() {
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div>
      <button className="btn" onClick={simulateFetch}>
        Simulate 1.2s fetch
      </button>
      <div className="demo-live" style={{ marginTop: '0.6rem' }}>
        <UserListWithLoading isLoading={loading} users={['Ada', 'Grace', 'Linus']} />
      </div>
    </div>
  )
}

export default function HOC() {
  return (
    <TopicPage
      groupId="advanced"
      topicId="hoc"
      level="advanced"
      title="Higher-Order Components"
      summary="A Higher-Order Component (HOC) is a function that takes a component and returns a new, enhanced component — a pattern for reusing cross-cutting behavior like loading states, auth checks, or data subscriptions."
      keyPoints={[
        'Signature: Component => EnhancedComponent — the same shape as a JS decorator, applied manually.',
        'Prefix the wrapper with "with" by convention: withLoading, withAuth, withRouter.',
        'Spread pass-through props ({...rest}) so the wrapped component still receives everything it needs.',
        'Copy static methods or set displayName on the returned component to keep debugging/dev-tools friendly.',
        'Custom hooks have replaced most HOC use cases in modern React — reach for a HOC mainly when you need to wrap the returned element itself, not just share logic.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <div className="demo-live">
          <HOCDemo />
        </div>
        <CodeBlock code={code} title="withLoading.jsx" />
      </div>

      <Callout kind="tip">
        Compare this to the <Link to="/advanced/render-props">Render Props</Link> and{' '}
        <Link to="/intermediate/custom-hooks">Custom Hooks</Link> lessons — all three solve "share
        logic between components", just with different ergonomics and trade-offs.
      </Callout>
    </TopicPage>
  )
}
