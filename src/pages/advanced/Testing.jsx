import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect } from 'vitest'
import Counter from './Counter.jsx'

test('increments the count when the button is clicked', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  // Query the way a user would find things: by visible text/role, not
  // implementation details like class names or component internals.
  expect(screen.getByText('Count: 0')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /increment/i }))

  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})`

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p data-testid="count-display">Count: {count}</p>
      <button className="btn" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
    </div>
  )
}

function TestSimulator() {
  const [count, setCount] = useState(0)
  const [ran, setRan] = useState(false)

  const assertions = [
    { label: 'getByText("Count: 0") exists on mount', pass: !ran || null },
    { label: 'clicking the button increments the display', pass: ran ? count === 1 : null },
  ]

  function runTest() {
    setCount(0)
    setRan(true)
    // Simulate a user click, the way userEvent.click() would.
    setTimeout(() => setCount(1), 400)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <p className="demo-note" style={{ marginBottom: '0.4rem' }}>
            Component under test:
          </p>
          <Counter />
        </div>
        <div>
          <p className="demo-note" style={{ marginBottom: '0.4rem' }}>
            Simulated test assertions:
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
            {assertions.map((a) => (
              <li key={a.label}>
                {a.pass === null ? '⚪' : a.pass ? '✅' : '❌'} {a.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className="btn" style={{ marginTop: '0.8rem' }} onClick={runTest}>
        ▶ Run test
      </button>
    </div>
  )
}

export default function Testing() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="testing"
      level="advanced"
      title="Testing Components with React Testing Library"
      summary="React Testing Library (RTL) tests components the way a user experiences them — by visible text, labels, and roles — rather than by internal implementation details, which is what makes tests survive safe refactors."
      keyPoints={[
        'Query by what a user would see/hear: getByRole, getByLabelText, getByText — not by class names or component internals.',
        'render() mounts a component into a lightweight in-memory DOM (jsdom); screen gives you query methods scoped to the whole document.',
        'userEvent (not the lower-level fireEvent) simulates real user interactions — clicks, typing — including the events a browser would actually fire.',
        'Testing behavior instead of implementation means refactoring a component internally (renaming state, changing class→function) does not break its tests, as long as user-facing behavior is unchanged.',
        'RTL runs in Node via a test runner (Vitest or Jest) — it is not something that executes in the browser, so this lesson\'s demo below simulates what a passing test looks like rather than literally running one.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — a simulated test run</h3>
        <p className="demo-note">
          A real RTL test runs in Node against a virtual DOM, not in this browser page — the demo
          below simulates a user click and shows which assertions would pass, to make the
          "query by what the user sees" idea concrete.
        </p>
        <div className="demo-live">
          <TestSimulator />
        </div>
        <CodeBlock code={code} title="Counter.test.jsx" />
      </div>

      <Callout kind="pitfall">
        Reaching for <code>container.querySelector('.count-display')</code> or checking component
        internal state directly defeats the point of RTL — those break on harmless refactors
        (renaming a CSS class) while missing real regressions (the count no longer being visible
        to an actual user). If you find yourself needing a CSS-selector escape hatch, add a
        <code>data-testid</code> as a last resort, after exhausting role/label/text queries.
      </Callout>
    </TopicPage>
  )
}
