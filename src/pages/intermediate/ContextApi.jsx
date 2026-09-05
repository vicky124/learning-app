import { createContext, useContext, useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `const ThemeContext = createContext(null)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Any descendant, no matter how deep, reads the value directly —
// no prop drilling through intermediate components.
function ThemeButton() {
  const { theme, toggle } = useContext(ThemeContext)
  return <button onClick={toggle}>Current theme: {theme}</button>
}`

const ThemeContext = createContext(null)

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

function ThemeButton() {
  const { theme, toggle } = useContext(ThemeContext)
  return (
    <button className="btn" onClick={toggle}>
      Current theme: <strong>{theme}</strong> (click to toggle)
    </button>
  )
}

function DeeplyNested() {
  return (
    <div style={{ paddingLeft: '1rem', borderLeft: '2px dashed var(--border)' }}>
      <p className="demo-note">Some wrapper component that doesn't care about theme…</p>
      <div style={{ paddingLeft: '1rem', borderLeft: '2px dashed var(--border)' }}>
        <p className="demo-note">…and another one…</p>
        <ThemeButton />
      </div>
    </div>
  )
}

export default function ContextApi() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="context"
      level="intermediate"
      title="Context API"
      summary="Context lets a value be shared across a whole subtree without threading it through every intermediate component's props — solving 'prop drilling' for data like theme, auth, or locale."
      keyPoints={[
        'createContext(defaultValue) creates a Context object; <Context.Provider value={...}> supplies the value to descendants.',
        'useContext(Context) reads the nearest matching Provider above the calling component in the tree.',
        'Every consumer re-renders whenever the Provider value changes — keep the value stable (e.g. memoize it) to avoid unnecessary renders.',
        "Context is for values many components need broadly; it isn't a general replacement for all prop passing or for global state management.",
        'A common pattern is a custom hook (useTheme()) that wraps useContext and throws a clear error if used outside its Provider.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — theme shared 2 levels deep, no prop drilling</h3>
        <div className="demo-live">
          <ThemeProvider>
            <DeeplyNested />
          </ThemeProvider>
        </div>
        <CodeBlock code={code} title="ThemeContext.jsx" />
      </div>

      <Callout kind="pitfall">
        A fresh object literal passed as <code>value=&#123;&#123; theme, toggle &#125;&#125;</code> is a
        new reference every render, so every consumer re-renders even if the actual data
        didn't change. For a large consumer tree, wrap the value in{' '}
        <code>useMemo(() =&gt; ({'{ theme, toggle }'}), [theme])</code>.
      </Callout>
    </TopicPage>
  )
}
