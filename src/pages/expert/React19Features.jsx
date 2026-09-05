import { use, useActionState, useOptimistic, useState, startTransition, Suspense } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const actionCode = `function fakeSaveName(prevState, formData) {
  const name = formData.get('name')
  if (!name?.trim()) return { error: 'Name is required', name: prevState.name }
  await new Promise((r) => setTimeout(r, 600)) // pretend network request
  return { error: null, name }
}

function ProfileForm() {
  // useActionState wires a <form action> to React state: it tracks the
  // pending status and the latest returned state for you.
  const [state, formAction, isPending] = useActionState(fakeSaveName, { name: 'Ada' })

  return (
    <form action={formAction}>
      <input name="name" defaultValue={state.name} />
      <button type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Save'}</button>
      {state.error && <p>{state.error}</p>}
    </form>
  )
}`

const optimisticCode = `function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)
  // The UI shows +1 immediately; if the "server call" fails, React
  // automatically reverts to the real state once it resolves.
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (current, amount) => current + amount
  )

  function handleLike() {
    // The optimistic setter must be called inside a transition (or a
    // form action) — React 19 requires this so it knows when to
    // reconcile the optimistic value back to the real one.
    startTransition(async () => {
      addOptimisticLike(1)          // instant UI feedback
      const real = await fakeLikeRequest(likes + 1) // actual request
      setLikes(real)
    })
  }

  return <button onClick={handleLike}>❤️ {optimisticLikes}</button>
}`

const useHookCode = `// use() can read a Context (like useContext) OR unwrap a Promise —
// and unlike other hooks, it can be called conditionally / in loops.
function Avatar({ userPromise }) {
  const user = use(userPromise) // suspends until the promise resolves
  return <img src={user.avatarUrl} alt={user.name} />
}

<Suspense fallback={<Spinner />}>
  <Avatar userPromise={fetchUser(id)} />
</Suspense>`

function fakeSaveName(prevState, formData) {
  const name = formData.get('name')
  if (!name?.trim()) {
    return { error: 'Name is required', name: prevState.name }
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve({ error: null, name: name.trim() }), 700)
  })
}

function ProfileForm() {
  const [state, formAction, isPending] = useActionState(fakeSaveName, { name: 'Ada', error: null })
  return (
    <form action={formAction} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <input name="name" defaultValue={state.name} />
      <button className="btn" type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : 'Save'}
      </button>
      {state.error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{state.error}</span>}
      {!isPending && !state.error && <span className="pill">saved: {state.name}</span>}
    </form>
  )
}

function fakeLikeRequest(nextCount) {
  return new Promise((resolve) => setTimeout(() => resolve(nextCount), 900))
}

function LikeButton() {
  const [likes, setLikes] = useState(12)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (current, amount) => current + amount)

  function handleLike() {
    // useOptimistic's setter must run inside a transition (or a form
    // action) — startTransition is what makes the "reconcile once the
    // real update lands" behavior possible.
    startTransition(async () => {
      addOptimisticLike(1)
      const real = await fakeLikeRequest(likes + 1)
      setLikes(real)
    })
  }

  return (
    <div>
      <button className="btn" onClick={handleLike}>
        ❤️ {optimisticLikes}
      </button>
      <p className="demo-note">
        The count jumps immediately on click (optimistic), then settles once the simulated
        900ms request resolves.
      </p>
    </div>
  )
}

function makeUserPromise(name) {
  return new Promise((resolve) => setTimeout(() => resolve({ name }), 600))
}

function UserFromPromise({ promise }) {
  const user = use(promise)
  return <p style={{ margin: 0 }}>Resolved via use(): {user.name}</p>
}

function UseHookDemo() {
  const [promise, setPromise] = useState(() => makeUserPromise('Grace Hopper'))
  return (
    <div>
      <button
        className="btn"
        onClick={() => setPromise(makeUserPromise(`User-${Math.floor(Math.random() * 1000)}`))}
      >
        Fetch a new "user"
      </button>
      <div className="demo-live" style={{ marginTop: '0.6rem' }}>
        <Suspense fallback={<span className="demo-note">⏳ Suspended, waiting on the promise…</span>}>
          <UserFromPromise promise={promise} />
        </Suspense>
      </div>
    </div>
  )
}

export default function React19Features() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="react19"
      level="expert"
      title="React 19: Actions & use()"
      summary="React 19 (installed in this project) adds first-class support for async form actions and a new use() hook that can read promises and context, unifying several older patterns."
      keyPoints={[
        'useActionState(action, initialState) wires a <form action={fn}> to React: it tracks pending status and the latest state returned by the action.',
        'A form action receives (previousState, formData) and can be async — React shows isPending while it runs and re-renders with whatever it returns.',
        'useOptimistic(state, updateFn) shows an immediate, optimistic UI update while a real async operation is still in flight, then reconciles with the real result.',
        'use(promise) reads a promise directly in render and suspends the component until it resolves — must be wrapped in a <Suspense> boundary.',
        'use(context) can also replace useContext(context) — the key difference is that use() may be called conditionally, unlike other hooks.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — useActionState with a form action</h3>
        <div className="demo-live">
          <ProfileForm />
        </div>
        <CodeBlock code={actionCode} title="useActionState.jsx" />
      </div>

      <div className="demo-section">
        <h3>Live demo — useOptimistic</h3>
        <div className="demo-live">
          <LikeButton />
        </div>
        <CodeBlock code={optimisticCode} title="useOptimistic.jsx" />
      </div>

      <div className="demo-section">
        <h3>Live demo — use() reading a Promise</h3>
        <div className="demo-live">
          <UseHookDemo />
        </div>
        <CodeBlock code={useHookCode} title="use-hook.jsx" />
      </div>

      <Callout kind="note">
        These are the newest additions covered in this app — check the installed{' '}
        <code>react</code> version in <code>package.json</code> before relying on them; they
        require React 19+.
      </Callout>
    </TopicPage>
  )
}
