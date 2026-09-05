import { useReducer } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `const initialState = { count: 0, step: 1 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step }
    case 'decrement':
      return { ...state, count: state.count - state.step }
    case 'setStep':
      return { ...state, step: action.payload }
    case 'reset':
      return initialState
    default:
      throw new Error(\`Unknown action: \${action.type}\`)
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      <p>Count: {state.count} (step {state.step})</p>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  )
}`

const initialState = { count: 0, step: 1 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step }
    case 'decrement':
      return { ...state, count: state.count - state.step }
    case 'setStep':
      return { ...state, step: action.payload }
    case 'reset':
      return initialState
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      <p style={{ fontSize: '1.2rem' }}>
        Count: <strong>{state.count}</strong>{' '}
        <span className="pill">step {state.step}</span>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => dispatch({ type: 'decrement' })}>
          -
        </button>
        <button className="btn" onClick={() => dispatch({ type: 'increment' })}>
          +
        </button>
        <button className="btn" onClick={() => dispatch({ type: 'reset' })}>
          Reset
        </button>
        <label style={{ fontSize: '0.85rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          Step:
          <input
            type="number"
            style={{ width: 60 }}
            value={state.step}
            onChange={(e) => dispatch({ type: 'setStep', payload: Number(e.target.value) || 1 })}
          />
        </label>
      </div>
    </div>
  )
}

export default function ReducerState() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="reducer"
      level="intermediate"
      title="useReducer"
      summary="useReducer centralizes state transitions into a single pure function — (state, action) => newState — which scales better than several useState calls once updates get interdependent."
      keyPoints={[
        'A reducer is a pure function: same (state, action) in, always the same new state out, no side effects.',
        'dispatch({ type, payload }) is the only way to request a change — the reducer decides what actually happens.',
        'Prefer useReducer over multiple useState calls when state fields update together or the next state depends on the action, not just the previous value.',
        'Reducers make state transitions easy to test in isolation (no rendering required) and easy to log/replay for debugging.',
        'useReducer is commonly paired with Context to build a small, app-wide store without an external library.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — counter with configurable step</h3>
        <div className="demo-live">
          <Counter />
        </div>
        <CodeBlock code={code} title="reducer.jsx" />
      </div>

      <Callout kind="tip">
        Reach for <code>useReducer</code> the moment you notice several{' '}
        <code>useState</code> calls that only ever change together in the same event handler —
        that's a sign the "real" state shape is one object with named transitions.
      </Callout>
    </TopicPage>
  )
}
