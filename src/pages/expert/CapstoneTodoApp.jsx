import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import Callout from '../../components/Callout.jsx'

const STORAGE_KEY = 'rla-capstone-todos'

function loadInitialTodos() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // Corrupt/unavailable storage — fall back to a seeded list below.
  }
  return [
    { id: 1, text: 'Learn useState', done: true },
    { id: 2, text: 'Learn useEffect', done: true },
    { id: 3, text: 'Build something real', done: false },
  ]
}

function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }]
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))
    case 'remove':
      return state.filter((t) => t.id !== action.id)
    case 'edit':
      return state.map((t) => (t.id === action.id ? { ...t, text: action.text } : t))
    case 'clearCompleted':
      return state.filter((t) => !t.done)
    default:
      return state
  }
}

const TodosContext = createContext(null)

function TodosProvider({ children }) {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadInitialTodos)

  // Sync the reducer's state to localStorage any time it changes.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const value = useMemo(() => ({ todos, dispatch }), [todos])
  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

function useTodos() {
  const ctx = useContext(TodosContext)
  if (!ctx) throw new Error('useTodos must be used within TodosProvider')
  return ctx
}

function AddTodoForm() {
  const { dispatch } = useTodos()
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({ type: 'add', text: trimmed })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs doing?"
        style={{ flex: 1 }}
      />
      <button className="btn" type="submit">
        Add
      </button>
    </form>
  )
}

function TodoRow({ todo }) {
  const { dispatch } = useTodos()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed) dispatch({ type: 'edit', id: todo.id, text: trimmed })
    setEditing(false)
  }

  return (
    <li className={todo.done ? 'done' : ''}>
      <input type="checkbox" checked={todo.done} onChange={() => dispatch({ type: 'toggle', id: todo.id })} />
      {editing ? (
        <input
          className="label"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') {
              setDraft(todo.text)
              setEditing(false)
            }
          }}
        />
      ) : (
        <span className="label" onDoubleClick={() => setEditing(true)}>
          {todo.text}
        </span>
      )}
      <button className="btn btn--danger" onClick={() => dispatch({ type: 'remove', id: todo.id })}>
        Delete
      </button>
    </li>
  )
}

function TodoList({ filter }) {
  const { todos } = useTodos()
  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.done
    if (filter === 'completed') return t.done
    return true
  })

  if (filtered.length === 0) {
    return <p className="demo-note">Nothing here — {filter === 'all' ? 'add a todo above' : `no ${filter} todos`}.</p>
  }

  return (
    <ul className="todo-list">
      {filtered.map((todo) => (
        <TodoRow key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

function TodoStats() {
  const { todos, dispatch } = useTodos()
  const remaining = todos.filter((t) => !t.done).length
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
      <span className="pill">
        {remaining} of {todos.length} remaining
      </span>
      <button className="btn" onClick={() => dispatch({ type: 'clearCompleted' })}>
        Clear completed
      </button>
    </div>
  )
}

function TodoApp() {
  const [filter, setFilter] = useState('all')
  return (
    <TodosProvider>
      <AddTodoForm />
      <div style={{ display: 'flex', gap: '0.4rem', margin: '0.8rem 0' }}>
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            className="btn"
            style={{ opacity: filter === f ? 1 : 0.6 }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <TodoList filter={filter} />
      <TodoStats />
    </TodosProvider>
  )
}

export default function CapstoneTodoApp() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="capstone"
      level="expert"
      title="Capstone: Todo App"
      summary="A small but complete app that combines nearly everything covered so far: useReducer for transitions, Context to avoid prop drilling, a custom hook (useTodos), controlled forms, lists & keys, conditional rendering, and localStorage persistence."
      keyPoints={[
        'State shape & transitions live in one reducer (todosReducer) — add, toggle, remove, edit, clearCompleted.',
        'TodosProvider exposes { todos, dispatch } via Context; useTodos() is the guarded access point every component uses.',
        'AddTodoForm is a controlled input; TodoRow doubles as a controlled edit field, toggled with local component state.',
        'Filtering (all/active/completed) is local UI state in TodoApp — it does not belong in the shared store because no other component needs it.',
        'A useEffect syncs the reducer state to localStorage on every change, and a lazy useReducer initializer reads it back on first load.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <p className="demo-note">
          Double-click a todo's text to rename it. Everything you do here persists to{' '}
          <code>localStorage</code> — reload the page and your list is still there.
        </p>
        <div className="demo-live">
          <TodoApp />
        </div>
      </div>

      <Callout kind="tip">
        This is a good page to read top-to-bottom in the source (
        <code>src/pages/expert/CapstoneTodoApp.jsx</code>) once you've been through every other
        lesson — see how many concepts you can now recognize at a glance.
      </Callout>
    </TopicPage>
  )
}
