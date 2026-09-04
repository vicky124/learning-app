import { useEffect, useRef, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

function useDebounce(value, delayMs) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id) // cancel if "value" changes before delay elapses
  }, [value, delayMs])
  return debounced
}

function usePrevious(value) {
  const ref = useRef(undefined)
  useEffect(() => {
    ref.current = value // stores the value *after* this render's return
  })
  return ref.current // still holds the value from the render before
}`

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable (private mode, quota) — ignore.
    }
  }, [key, value])
  return [value, setValue]
}

function useDebounce(value, delayMs) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

function usePrevious(value) {
  const ref = useRef(undefined)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('rla-demo-name', '')
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name…" />
      <p className="demo-note">
        Persisted to <code>localStorage</code> under key <code>rla-demo-name</code> — reload
        this page and it will still be here.
      </p>
    </div>
  )
}

function DebounceDemo() {
  const [text, setText] = useState('')
  const debouncedText = useDebounce(text, 500)
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type quickly…" />
      <p className="demo-note">
        Live value: <code>{text || '""'}</code>
        <br />
        Debounced (500ms after you stop typing): <code>{debouncedText || '""'}</code>
      </p>
    </div>
  )
}

function PreviousDemo() {
  const [count, setCount] = useState(0)
  const previous = usePrevious(count)
  return (
    <div>
      <button className="btn" onClick={() => setCount((c) => c + 1)}>
        Increment ({count})
      </button>
      <p className="demo-note">
        Current: <strong>{count}</strong> · Previous: <strong>{previous ?? '—'}</strong>
      </p>
    </div>
  )
}

export default function CustomHookLibrary() {
  return (
    <TopicPage
      groupId="expert"
      topicId="hook-library"
      level="expert"
      title="Custom Hook Library"
      summary="A few more production-flavored custom hooks, building on the introduction in the Custom Hooks lesson: persisting to localStorage, debouncing fast-changing input, and remembering the previous value of a prop or state."
      keyPoints={[
        'useLocalStorage mirrors useState but persists to window.localStorage, with a lazy initializer that reads the stored value only once.',
        'useDebounce delays reflecting a fast-changing value until it has been stable for a set period — ideal before firing a search request on every keystroke.',
        "usePrevious exploits the fact that a ref's effect runs *after* render — so during render it still holds last render's value.",
        'All three follow the same shape: wrap a piece of state, add one useEffect, return values/setters that feel just like the built-in hooks.',
        'Battle-tested versions of these exist in libraries like usehooks-ts — writing your own is a great way to learn the underlying primitives first.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — useLocalStorage</h3>
        <div className="demo-live">
          <LocalStorageDemo />
        </div>
      </div>

      <div className="demo-section">
        <h3>Live demo — useDebounce</h3>
        <div className="demo-live">
          <DebounceDemo />
        </div>
      </div>

      <div className="demo-section">
        <h3>Live demo — usePrevious</h3>
        <div className="demo-live">
          <PreviousDemo />
        </div>
        <CodeBlock code={code} title="hooks.js" />
      </div>

      <Callout kind="tip">
        Debouncing is a classic pairing with data fetching: debounce the search box's value,
        then pass the debounced value (not the raw keystrokes) into a{' '}
        <code>useFetch</code>-style hook.
      </Callout>
    </TopicPage>
  )
}
