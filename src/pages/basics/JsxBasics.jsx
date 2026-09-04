import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function Greeting() {
  const name = 'World'
  const isMorning = new Date().getHours() < 12

  // JSX is an expression: you can embed any JS value in { }
  return (
    <div className="greeting">
      <h2>Hello, {name}!</h2>
      <p>{isMorning ? 'Good morning ☀️' : 'Good afternoon 🌤️'}</p>
    </div>
  )
}`

function Greeting() {
  const name = 'World'
  const isMorning = new Date().getHours() < 12
  return (
    <div>
      <h2 style={{ margin: 0 }}>Hello, {name}!</h2>
      <p style={{ marginBottom: 0 }}>
        {isMorning ? 'Good morning ☀️' : 'Good afternoon 🌤️'}
      </p>
    </div>
  )
}

export default function JsxBasics() {
  return (
    <TopicPage
      groupId="basics"
      topicId="jsx"
      level="basics"
      title="JSX & Rendering"
      summary="JSX is a syntax extension that lets you write markup directly inside JavaScript. It compiles to React.createElement() calls, which build the tree the DOM ends up mirroring."
      keyPoints={[
        'JSX is an expression — it can be assigned to variables, passed as props, or returned from functions.',
        'Use { } to embed any JavaScript expression (variables, ternaries, function calls) inside markup.',
        'JSX elements must have a single root — wrap siblings in a <div> or a Fragment (<>...</>).',
        'className, not class; htmlFor, not for — JSX attributes mirror the DOM property names, not HTML.',
        'Under the hood, <Greeting /> compiles to React.createElement(Greeting, null).',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <p className="demo-note">A component rendering an expression-driven greeting.</p>
        <div className="demo-live">
          <Greeting />
        </div>
        <CodeBlock code={code} title="JsxBasics.jsx" />
      </div>

      <Callout kind="pitfall">
        JSX turns into <code>React.createElement(...)</code> calls at build time (via Babel/SWC),
        which is why a component name must start with a capital letter — lowercase tags are
        treated as native DOM elements like <code>div</code> or <code>span</code>.
      </Callout>
    </TopicPage>
  )
}
