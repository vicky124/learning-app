import { useEffect, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, error: null, loading: true })

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
        return res.json()
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name === 'AbortError') return // effect cleaned up — ignore
        setState({ data: null, error, loading: false })
      })

    // Cancel the in-flight request if "url" changes or the component unmounts
    return () => controller.abort()
  }, [url])

  return state
}

function UserProfile({ userId }) {
  const { data, error, loading } = useFetch(
    \`https://jsonplaceholder.typicode.com/users/\${userId}\`
  )
  if (loading) return <p>Loading…</p>
  if (error) return <p>Error: {error.message}</p>
  return <p>{data.name} — {data.email}</p>
}`

function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, error: null, loading: true })

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setState({ data: null, error, loading: false })
      })

    return () => controller.abort()
  }, [url])

  return state
}

function UserProfile({ userId }) {
  const { data, error, loading } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  )
  if (loading) return <p className="demo-note">Loading user {userId}…</p>
  if (error) return <p className="demo-note">Error: {error.message}</p>
  return (
    <p style={{ margin: 0 }}>
      <strong>{data.name}</strong> — {data.email} ({data.company?.name})
    </p>
  )
}

function DataFetchingDemo() {
  const [userId, setUserId] = useState(1)
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
        {[1, 2, 3].map((id) => (
          <button key={id} className="btn" onClick={() => setUserId(id)}>
            User {id}
          </button>
        ))}
      </div>
      <div className="demo-live">
        <UserProfile userId={userId} />
      </div>
    </div>
  )
}

export default function DataFetching() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="data-fetching"
      level="advanced"
      title="Data Fetching Patterns"
      summary="Fetching data from an effect requires handling three states — loading, error, success — and cancelling stale requests when inputs change or the component unmounts."
      keyPoints={[
        'Track { data, error, loading } together so the UI can render the right state at every point in time.',
        'AbortController + the effect cleanup function cancels a request that is still in flight when the URL/params change again ("race condition" guard).',
        "Re-run the effect whenever a fetch input changes by including it in the dependency array (e.g. [url] or [userId]).",
        'Wrapping this pattern in a custom hook (useFetch) keeps components declarative and makes the logic reusable.',
        'In real apps, a data-fetching library (TanStack Query, SWR, RTK Query) handles caching, retries, and deduping far more robustly than hand-rolled effects.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — fetching from a public API</h3>
        <p className="demo-note">
          Uses <code>jsonplaceholder.typicode.com</code>; switching users cancels any
          still-in-flight request for the previous one.
        </p>
        <div className="demo-live">
          <DataFetchingDemo />
        </div>
        <CodeBlock code={code} title="useFetch.js" />
      </div>

      <Callout kind="pitfall">
        Without the <code>AbortController</code> cleanup, rapidly switching users can let an
        older, slower response arrive <em>after</em> a newer one and overwrite it — a classic
        race condition in effect-based data fetching.
      </Callout>
    </TopicPage>
  )
}
