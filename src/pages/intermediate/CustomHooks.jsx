import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `// A custom hook is just a function that starts with "use" and calls other hooks.
// It lets you extract and reuse stateful logic between components.
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

function ResponsiveLabel() {
  const width = useWindowWidth()
  return <p>Window width: {width}px {width < 640 ? '(narrow)' : '(wide)'}</p>
}`

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return width
}

function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = () => setValue((v) => !v)
  return [value, toggle]
}

function ResponsiveLabel() {
  const width = useWindowWidth()
  return (
    <p>
      Window width: <strong>{width}px</strong> — {width < 640 ? 'narrow layout' : 'wide layout'}
      <br />
      <span className="demo-note">Resize your browser window to see this update live.</span>
    </p>
  )
}

function ToggleDemo() {
  const [isOn, toggle] = useToggle(false)
  return (
    <button className="btn" onClick={toggle}>
      {isOn ? '🟢 ON' : '⚪ OFF'} (click to toggle)
    </button>
  )
}

export default function CustomHooks() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="custom-hooks"
      level="intermediate"
      title="Custom Hooks"
      summary="A custom hook is a plain function whose name starts with 'use' that calls other hooks inside it — the primary way React encourages you to extract and share stateful logic."
      keyPoints={[
        "Custom hooks share logic, not state — each component calling useToggle() gets its own independent state.",
        "The 'use' naming convention lets the linter enforce the Rules of Hooks (no conditional calls, top-level only) on your own hooks too.",
        "A custom hook can call useState, useEffect, useContext, or any other hook — including other custom hooks.",
        'They return whatever is useful to the caller: a value, a [value, setter] pair, or an object of values and functions.',
        'Extracting a custom hook is the React-native alternative to older patterns like HOCs and render props for logic reuse.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — useWindowWidth</h3>
        <div className="demo-live">
          <ResponsiveLabel />
        </div>
        <CodeBlock code={code} title="useWindowWidth.js" />
      </div>

      <div className="demo-section">
        <h3>Live demo — useToggle</h3>
        <div className="demo-live">
          <ToggleDemo />
        </div>
      </div>

      <Callout kind="tip">
        See the <Link to="/react-guide/hook-library">Custom Hook Library</Link> lesson for more
        production-ready examples: <code>useLocalStorage</code>, <code>useDebounce</code>, and{' '}
        <code>useFetch</code>.
      </Callout>
    </TopicPage>
  )
}
