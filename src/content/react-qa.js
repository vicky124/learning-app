// Interview Q&A for the React section. Kept as its own data file (like
// every other subject's content) even though React's lessons themselves
// are hand-built interactive pages — this one topic is rendered through
// the same generic Q&A pipeline (GenericTopicPage + QAAccordion) as every
// other subject's Interview Q&A group, since it's just a list of
// questions/answers with no interactive demo of its own.
export const reactQA = [
  {
    question: 'What actually triggers a React component to re-render?',
    answer:
      'Three things, and only three: its own state changes (a `useState`/`useReducer` setter is called with a different value), its parent re-renders (which by default re-renders every child, regardless of whether that child\'s own props changed), or a context value it subscribes to changes. Re-rendering does not mean the DOM is touched — React reconciles the new render output against the previous one (the virtual DOM diff) and only applies the minimal set of real DOM mutations needed. This distinction — "render" (calling the component function) vs "commit" (touching the actual DOM) — is the basis for nearly every performance optimization technique (`memo`, `useMemo`, `useCallback`).',
  },
  {
    question: 'Why does React need a `key` prop on list items, and what goes wrong with a bad key?',
    answer:
      'Keys let React match elements across renders by identity rather than by position, so it can correctly preserve, reorder, or destroy the right DOM nodes (and their internal state) when a list changes. Using the array index as a key is safe only for lists that never reorder, filter, or have items inserted in the middle — otherwise, when items shift position, React matches the wrong old element to the wrong new data (since the index, not the item, is what it is comparing), which shows up as state "sticking" to the wrong row: a text input keeps its old value after the list reorders, an animation plays on the wrong item, or a checked checkbox appears next to the wrong label.',
  },
  {
    question: 'Explain the functional-update form of `setState` and when it is required, not just nice-to-have.',
    answer:
      '`setCount(c => c + 1)` computes the next state from the *current* state at the moment the update actually applies, rather than from whatever value was captured in the closure when the event handler ran. It is required — not just stylistically preferred — whenever multiple updates to the same state might be queued before a re-render happens, most commonly when calling the setter more than once in the same handler (`setCount(count + 1); setCount(count + 1)` only increments once, since both reads see the same stale `count`; `setCount(c => c + 1)` twice correctly increments twice) or when an update is scheduled from inside a closure that might be stale by the time it runs (an interval, a delayed callback, an event handler attached long ago).',
  },
  {
    question: 'What is the dependency array in `useEffect`, and what is the most common mistake made with it?',
    answer:
      'The dependency array tells React when to re-run the effect: omitted entirely means every render, `[]` means once on mount only, `[a, b]` means whenever `a` or `b` changes between renders (compared by `Object.is`). The most common mistake is omitting a value the effect actually reads (a "stale closure" bug) — the effect keeps using the value from whenever it last ran, not the current one, because an omitted dependency does not cause the effect to re-run when that value changes. The `eslint-plugin-react-hooks` exhaustive-deps rule exists specifically to catch this class of bug; the correct fix is almost always to include the dependency, not to suppress the lint rule.',
  },
  {
    question: 'What problem does the Context API solve, and what is its main performance limitation?',
    answer:
      'Context lets a value be read by any descendant component, at any depth, without threading it through every intermediate component\'s props ("prop drilling") — used for values many components need broadly, like theme, authenticated user, or locale. Its main limitation is that every component consuming a context via `useContext` re-renders whenever that context\'s value changes, with no built-in way to subscribe to just part of it — unlike a selector-based external store (Redux, Zustand), which can re-render only the components that actually use the changed slice. For a large tree with frequently-changing context values, this can force unnecessary re-renders across many consumers, which is why Context is best suited to values that change rarely (theme, locale) or trees that are not performance-critical.',
  },
  {
    question: 'When would you reach for `useReducer` instead of several `useState` calls?',
    answer:
      'When state fields update together as part of the same logical transition, or when the next state depends on *which action* occurred rather than just the previous value — `useReducer` centralizes that transition logic into one pure `(state, action) => newState` function instead of scattering it across event handlers. This makes the state transitions easier to test in isolation (no rendering required), easier to log/replay for debugging, and it is the natural fit for state with many possible transitions (a form wizard, a shopping cart, undo/redo) where several `useState` calls would otherwise need to be kept in sync manually.',
  },
  {
    question: 'What is the difference between `useMemo` and `useCallback`, precisely?',
    answer:
      '`useMemo(fn, deps)` caches the *return value* of calling `fn` — useful for expensive computations you do not want to redo every render. `useCallback(fn, deps)` caches the *function reference itself* — it is exactly equivalent to `useMemo(() => fn, deps)`. The most common use for `useCallback` is not performance of the function call itself, but keeping a stable reference to pass as a prop to a `React.memo`-wrapped child, so that child\'s shallow prop comparison sees "nothing changed" and can skip re-rendering — without it, a new function identity every render would defeat `memo()` even though the child\'s actual behavior never changed.',
  },
  {
    question: 'Why must error boundaries be class components, and what do they NOT catch?',
    answer:
      'Error boundaries rely on two lifecycle methods — `static getDerivedStateFromError` (to switch to a fallback UI) and `componentDidCatch` (to log the error) — that have no hook equivalent in current React; this is one of the few places a class component remains necessary. They only catch errors thrown during rendering, in lifecycle methods, and in constructors of the component tree *below* them — they do not catch errors in event handlers (use a plain `try/catch` there), asynchronous code (a rejected promise needs its own `.catch()`), server-side rendering, or errors thrown in the boundary\'s own render method.',
  },
  {
    question: 'What does `createPortal` actually do, and does it break event bubbling?',
    answer:
      '`createPortal(children, domNode)` renders `children` into a DOM node outside the parent\'s DOM hierarchy — typically `document.body` — while keeping it part of the same React tree. Event bubbling still follows the React tree, not the DOM tree: a click inside the portaled content bubbles up through its React ancestors exactly as if it had been rendered in place, even though in the actual DOM it is a sibling of `<body>`. This is what makes portals useful for modals/tooltips that need to escape a parent\'s `overflow:hidden` or stacking context while still behaving like a normal part of the component tree for event handling and context.',
  },
  {
    question: 'In React 19, why is `ref` no longer wrapped in `forwardRef` for function components, and what changed?',
    answer:
      'React 19 allows a function component to declare `ref` as an ordinary prop in its destructured parameter list, without wrapping the whole component in `forwardRef((props, ref) => ...)` first. Under the hood this is a change to how React resolves `ref` for function components — it is now just another named prop React recognizes and forwards specially — but the effect for application code is that the extra wrapper boilerplate that was required in React 18 and earlier is no longer necessary. Libraries that need to support both React 18 and 19 still use `forwardRef` for backward compatibility.',
  },
  {
    question: 'Explain what `useOptimistic` does and why its setter must be called inside a transition.',
    answer:
      '`useOptimistic(state, updateFn)` shows an immediate, "optimistic" UI update while a real asynchronous operation is still in flight, then reconciles back to the real value once it resolves — used for things like a like button that increments instantly instead of waiting for a network round trip. React requires the optimistic setter to be called inside a transition (`startTransition`) or a form action specifically so React knows this update is provisional and can correctly discard/reconcile it once the real state update lands; calling it directly from a plain event handler throws a runtime error ("An optimistic state update occurred outside a transition or action") because React has no way to know when to revert it if the underlying operation fails.',
  },
  {
    question: 'What is the actual difference between `useTransition` and `useDeferredValue`, given they solve a similar problem?',
    answer:
      '`useTransition` wraps a *state update you are about to make* in `startTransition`, marking that specific update as low-priority/interruptible so an urgent update (like a keystroke) can preempt it — you need a `setState` call to wrap. `useDeferredValue(value)` instead takes a value you already have (often one you do not control the origin of, like a prop) and returns a lagging copy of it that catches up once more urgent work finishes, with no separate setter required. Both achieve the same underlying effect — letting React deprioritize expensive re-renders relative to urgent input — but `useTransition` is used at the point you trigger the update, while `useDeferredValue` is used at the point you consume a value that might be updating rapidly.',
  },
  {
    question: 'Why is testing with React Testing Library described as testing "the way a user would interact with your app"? What does that mean concretely?',
    answer:
      'RTL deliberately avoids querying by implementation details like component internal state, class names, or CSS selectors, and instead queries the rendered DOM the way a real user or assistive technology would find things — by visible text, label, role, or placeholder (`getByRole(\'button\', { name: /submit/i })`, `getByLabelText(\'Email\')`). This means a refactor that changes a component\'s internal implementation (switching from a class to a function component, renaming an internal variable, changing how state is stored) does not break the test as long as the rendered, user-facing behavior is unchanged — the test suite ends up validating behavior, not implementation, which is exactly what makes it resilient to safe refactors and genuinely useful as a regression safety net.',
  },
  {
    question: 'What is the single most impactful accessibility mistake in React apps, and how do you avoid it?',
    answer:
      'Building custom interactive elements (a `<div>` styled to look like a button, a custom dropdown) without any of the semantics a native element provides for free — keyboard operability (Tab/Enter/Space), a correct ARIA role, and screen-reader-announced state. The fix is to reach for a native element first whenever one exists (a real `<button>` instead of a clickable `<div>`, a real `<select>` instead of a custom-styled dropdown when the native styling constraint is acceptable), and when a native element genuinely cannot express the needed UI, add the missing pieces explicitly: a correct `role`, `tabIndex={0}` plus an `onKeyDown` handler for Enter/Space, and `aria-*` attributes reflecting current state (`aria-expanded`, `aria-selected`, `aria-pressed`).',
  },
  {
    question: 'Why do CSS transitions sometimes fail to fire when toggling a class in React, and how do you fix it?',
    answer:
      'A CSS transition only animates a *change* to a property\'s computed value — if an element is newly mounted with its "final" class already applied (e.g. conditionally rendering `<div className={open ? \'open\' : \'\'}>` only once `open` is already true), there is no prior state for the browser to transition *from*, so it just appears instantly in its end state. The fix is to mount the element in its initial (closed) state first, then trigger the class change in a subsequent render/effect (often via `requestAnimationFrame` or a short `setTimeout(0)` to ensure the browser has painted the initial state before the transition-triggering class is applied) — or use a library (Framer Motion, React Transition Group) that handles this mount/unmount transition timing for you.',
  },
  {
    question: 'What is the difference between a controlled and an uncontrolled input, and when is uncontrolled the right choice?',
    answer:
      'A controlled input\'s value is always driven by React state (`value={state}` + `onChange`) — the DOM node never holds its own independent value, so React is the single source of truth and every keystroke is visible to your code as it happens. An uncontrolled input keeps its value in the DOM itself, read only when needed via a `ref` (`inputRef.current.value`) — React does not re-render on every keystroke. Uncontrolled is the right choice for simple, one-off cases where you only need the value at submit time (not on every keystroke), for performance-sensitive forms with many fields where re-rendering on every keystroke is measurably expensive, and it is the *only* option for file inputs, whose value cannot be set programmatically by React for security reasons.',
  },
  {
    question: 'Why does placing multiple lazy/async components under one shared `<Suspense>` boundary versus giving each its own boundary produce different loading UX?',
    answer:
      'One shared `<Suspense>` boundary wrapping several async children shows a single fallback until *all* of them are ready — simpler, but means a fast component waits for the slowest sibling before anything renders. Giving each its own `<Suspense>` boundary lets each resolve and render independently, so fast content appears immediately while slower content keeps showing its own fallback — better perceived performance, at the cost of a UI that "pops in" piece by piece rather than all at once. The right choice depends on whether the pieces are visually/logically related enough that showing them staggered would look broken (in which case, share one boundary) or independent enough that progressive reveal is actually the better experience.',
  },
  {
    question: 'What should you actually look for in the React DevTools Profiler when investigating a slow component?',
    answer:
      'Start with the flame graph for a recorded interaction: each bar is a component that rendered during that commit, and its width represents render duration — wide bars are where time is actually going, not necessarily the component you assumed. Check whether a component re-rendered when its *rendered output* did not actually need to change (the Profiler can highlight "why did this render" — often a new object/array/function literal passed as a prop, or a parent re-rendering unconditionally) before reaching for `memo`/`useMemo`/`useCallback` — those tools only help when the underlying cause is genuinely unnecessary re-rendering, and applying them speculatively without profiling first usually just adds complexity without a measurable win.',
  },
  {
    question: 'Why does React\'s reconciliation algorithm assume that two elements of different types produce entirely different trees?',
    answer:
      'This is a deliberate O(n) heuristic trade-off: a fully general tree-diffing algorithm is O(n³) in the number of nodes, which is impractical for UI updates that need to feel instant. React instead assumes that if an element\'s type changes between renders (a `<div>` becomes a `<span>`, or `<ComponentA>` becomes `<ComponentB>`), the old subtree is torn down completely (including all descendant state) and a new one is built from scratch, rather than trying to find a minimal diff between them — in practice, different element types almost always do represent genuinely different UI, so this heuristic rarely produces a worse result than true minimal diffing would, while being vastly cheaper to compute.',
  },
  {
    question: 'What is "prop drilling" and what are the tradeoffs between the different ways to avoid it (Context, component composition, external state)?',
    answer:
      'Prop drilling is passing a value through several layers of components that do not themselves use it, purely so a deeply nested descendant can receive it. Context avoids the drilling but couples every consumer to that context and re-renders all of them on any change, as covered earlier. Component composition (passing already-rendered elements as `children` or named props, so an intermediate component does not need to know about a prop it is not using) often eliminates the need to drill at all, by restructuring which component renders which children — frequently the better first fix, since it adds no new abstraction. External state libraries (Zustand, Redux, Jotai) solve it with selector-based subscriptions, avoiding Context\'s all-consumers-re-render limitation, at the cost of an added dependency and a store to reason about — worth it once Context\'s re-render cost becomes a measured, real problem in a large or update-heavy tree.',
  },
  {
    question: 'Why does Strict Mode intentionally mount, unmount, and remount every component once in development?',
    answer:
      'This simulates what real-world scenarios (a component being removed and re-added by a parent, a future React feature like reusable component state, or simply a fast-refresh during development) do to a component\'s lifecycle, specifically to surface effects and state initializers that are not properly idempotent — an effect that sets up a subscription but forgets to clean it up in its returned cleanup function will visibly leak (double-fire, double-subscribe) under this double-invocation, which is exactly the point: it turns a subtle bug that might only manifest in a rare production scenario into something you see immediately in development. It has zero effect on production builds.',
  },
]
