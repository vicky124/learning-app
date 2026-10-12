import { useEffect, useMemo, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

const code = `const API_URL = 'https://jsonplaceholder.typicode.com/users'

function UserSearch() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  // 1. Fetch the list once on mount
  useEffect(() => {
    const controller = new AbortController()

    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
        return res.json()
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  // 2. Derive the filtered list — never store it in state
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      [u.name, u.email, u.company.name].some((field) =>
        field.toLowerCase().includes(q)
      )
    )
  }, [users, query])

  // 3. Render each state
  if (loading) return <p>Loading users…</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name, email or company…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <p>{filtered.length} of {users.length} users</p>

      {filtered.length === 0 ? (
        <p>No users match "{query}"</p>
      ) : (
        <ul>
          {filtered.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> — {user.email}
              <br />
              <small>{user.company.name} · {user.address.city}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}`

// Wraps every case-insensitive match of `query` in <mark> so users can see why a row matched.
function Highlight({ text, query }) {
  const q = query.trim()
  if (!q) return text
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? <mark key={i}>{part}</mark> : part
  )
}

function UserSearchDemo() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err)
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      [u.name, u.email, u.company.name].some((field) => field.toLowerCase().includes(q))
    )
  }, [users, query])

  if (loading) return <p className="demo-note">Loading users…</p>
  if (error) return <p className="demo-note">Error: {error.message}</p>

  return (
    <div>
      <input
        type="text"
        aria-label="Search users"
        placeholder="Search by name, email or company…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', marginBottom: '0.6rem' }}
      />
      <p className="demo-note" aria-live="polite" style={{ margin: '0 0 0.6rem' }}>
        Showing {filtered.length} of {users.length} users
      </p>

      {filtered.length === 0 ? (
        <p className="demo-note">No users match “{query}”.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
          {filtered.map((user) => (
            <li
              key={user.id}
              style={{
                padding: '0.6rem 0.8rem',
                border: '1px solid var(--border, #ddd)',
                borderRadius: '6px',
              }}
            >
              <strong>
                <Highlight text={user.name} query={query} />
              </strong>{' '}
              — <Highlight text={user.email} query={query} />
              <br />
              <small>
                <Highlight text={user.company.name} query={query} /> · {user.address.city}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function FetchListSearch() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="fetch-list-search"
      level="advanced"
      title="Fetch a List & Search It"
      summary="A classic interview exercise: fetch a JSON array from an API, render it as a list, and filter it live as the user types in a search box."
      keyPoints={[
        'Fetch once in a useEffect with an empty dependency array, and track loading / error / data so every state has a UI.',
        'Keep only the raw list and the search query in state — the filtered list is derived during render (useMemo just avoids recomputing it).',
        'Search case-insensitively with toLowerCase() + includes(), and across several fields with some().',
        'Use a stable id from the data as the key, never the array index, since filtering changes item positions.',
        'Always handle the empty-result case ("No users match …") separately from the loading and error cases.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — users from JSONPlaceholder</h3>
        <p className="demo-note">
          Fetches <code>{API_URL}</code> (a free mock REST API) and filters by name, email or
          company. Matches are highlighted.
        </p>
        <div className="demo-live">
          <UserSearchDemo />
        </div>
        <CodeBlock code={code} title="UserSearch.jsx" />
      </div>

      <Callout kind="pitfall">
        Don’t store <code>filteredUsers</code> in its own <code>useState</code> and sync it in an
        effect. It duplicates state, causes an extra render, and can drift out of sync with the
        source list. Compute it from <code>users</code> and <code>query</code> instead.
      </Callout>

      <Callout kind="tip">
        For server-side search (large datasets), put <code>query</code> in the fetch URL and the
        effect’s dependency array, and debounce the input so you don’t send a request on every
        keystroke. The <code>AbortController</code> cleanup then cancels stale requests.
      </Callout>
    </TopicPage>
  )
}
