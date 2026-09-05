import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function SignupForm() {
  const [form, setForm] = useState({ name: '', plan: 'free', updates: true })
  const [submitted, setSubmitted] = useState(null)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(form) // in a real app: send \`form\` to a server here
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <select name="plan" value={form.plan} onChange={handleChange}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
      <label>
        <input type="checkbox" name="updates" checked={form.updates} onChange={handleChange} />
        Email me updates
      </label>
      <button type="submit">Sign up</button>
    </form>
  )
}`

function SignupForm() {
  const [form, setForm] = useState({ name: '', plan: 'free', updates: true })
  const [submitted, setSubmitted] = useState(null)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(form)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <select name="plan" value={form.plan} onChange={handleChange}>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
        <label style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', fontSize: '0.9rem' }}>
          <input type="checkbox" name="updates" checked={form.updates} onChange={handleChange} />
          Email updates
        </label>
        <button className="btn" type="submit">
          Sign up
        </button>
      </form>
      {submitted && (
        <p className="demo-note" style={{ marginTop: '0.7rem' }}>
          Submitted: <code>{JSON.stringify(submitted)}</code>
        </p>
      )}
    </div>
  )
}

export default function FormsControlled() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="forms"
      level="basics"
      title="Forms & Controlled Inputs"
      summary="A controlled input's value always comes from React state, and every keystroke flows back through onChange — React is the single source of truth instead of the DOM."
      keyPoints={[
        'Controlled input: value={state} + onChange={updateState}. The DOM element never has its own hidden value.',
        'One handleChange keyed off event.target.name works for many fields when state is a single object.',
        'Checkboxes use checked + the "checked" boolean from event.target, not "value".',
        'Uncontrolled inputs (using a ref + defaultValue) are an escape hatch for simple/one-off cases, notably file inputs.',
        'Always call event.preventDefault() in onSubmit — the browser default is a full page navigation/reload.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <div className="demo-live">
          <SignupForm />
        </div>
        <CodeBlock code={code} title="SignupForm.jsx" />
      </div>

      <Callout kind="tip">
        For complex, deeply-nested, or performance-sensitive forms, libraries like{' '}
        <code>react-hook-form</code> minimize re-renders by keeping most field state
        uncontrolled and only syncing to React state on submit/validation.
      </Callout>
    </TopicPage>
  )
}
