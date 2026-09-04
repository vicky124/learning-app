# Learning Hub — Documentation

A complete written guide to this project: what it teaches, how it's built, and the reasoning
behind every concept and every subject it covers. Read this alongside the running app
(`npm run dev`) — every section below points at the exact file that implements it.

The app started as a single-subject React tutorial and grew into a multi-subject learning /
interview-prep hub: React still gets hand-built, live interactive lessons; every other subject
(Python, JavaScript, TypeScript, Git, LLD, HLD, System Design Patterns, Authentication &
Authorization, LangChain, LangGraph, RAG) is a content-driven written guide plus a dedicated
Interview Q&A section, rendered by one shared, generic page component. Both models share the
same sidebar, the same lesson-page shell, and the same navigation data structure — see §3.

---

## Table of contents

1. [Purpose & how to use this app](#1-purpose--how-to-use-this-app)
2. [Getting started](#2-getting-started)
3. [Architecture](#3-architecture)
4. [Concept guide — React Basics](#4-concept-guide--react-basics)
5. [Concept guide — React Intermediate](#5-concept-guide--react-intermediate)
6. [Concept guide — React Advanced](#6-concept-guide--react-advanced)
7. [Concept guide — React Expert](#7-concept-guide--react-expert)
8. [Other subjects](#8-other-subjects)
9. [Design decisions](#9-design-decisions)
10. [Extending the app](#10-extending-the-app)
11. [Verifying the app](#11-verifying-the-app)
12. [Further resources](#12-further-resources)

---

## 1. Purpose & how to use this app

This project is a **teaching and interview-prep tool**, not a template for a production app. The
React section makes 25 React concepts — from "what is JSX" to React 19's `useOptimistic`/`use()`
— tangible, by pairing a short explanation with a demo you can actually interact with and the
exact source code that powers it. Every other subject trades the live demo for a thorough
written guide (diagrams included, rendered live via Mermaid) plus a self-quiz Interview Q&A
list, sourced from the user's own interview-prep notes and restructured into the app.

**Recommended path:** open the sidebar drawer for a subject (e.g. "React" or "Python"), then
work its sub-drawers top to bottom. For React that's Basics → Intermediate → Advanced → Expert;
for every other subject it's Guide → Interview Q&A. Each lesson page also has Previous/Next
links at the bottom that follow the same order.

**Recommended way to read a lesson:**
1. Read the summary and "Key concepts" list first — that's the *distilled* version.
2. Play with the live demo. Break it. Watch what does and doesn't cause a re-render.
3. Read the code block underneath the demo — it's either the exact component you just used, or
   a slightly simplified version for readability.
4. Read the callout box at the bottom — it's almost always a real gotcha you'll hit in practice.
5. Open the actual source file (paths given throughout this document) if you want to see
   everything, including the styling and wiring code that was trimmed from the on-page snippet.

---

## 2. Getting started

```bash
npm install
npm run dev
```

Requires Node.js (the project was built and tested against Node 24 / npm 11, but any reasonably
current Node LTS works). Open the printed local URL in a browser.

```bash
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint static analysis
```

---

## 3. Architecture

### 3.1 The three-level menu tree

[`src/data/topics.js`](./src/data/topics.js) defines the entire navigation as one array,
`menuSections` — a 3-level tree:

```
menuSections            (a subject, e.g. "React", "Python" — a collapsible drawer)
  └─ groups             (a category within it — a collapsible sub-drawer)
       └─ topics        (one lesson — becomes a route at /:groupId/:topicId)
```

```js
export const menuSections = [
  { id: 'react', label: 'React', icon: '⚛️', groups: [
      { id: 'basics', label: 'Basics', topics: [{ id: 'jsx', title: 'JSX & Rendering' }, ...] },
      ...
  ]},
  pythonSection,   // imported from src/content/python.js
  gitSection,      // imported from src/content/git.js
  ...
]
```

React's four groups (Basics/Intermediate/Advanced/Expert) are defined inline in `topics.js`,
since React's topic entries only need `{ id, title }` — their real content lives in hand-built
page components (§3.4). Every other subject is imported as a ready-made **section object** from
its own file under `src/content/` (e.g. `pythonSection`, `gitSection`, `authSection`) and simply
appended to the array — see §10 for the exact steps to add a new one.

Everything else derives from this one array:
- `topicGroups` flattens it to one entry per group (tagged with its owning section) — what
  [`Home.jsx`](./src/pages/Home.jsx) renders as section blocks of cards.
- `allTopics` further flattens to one entry per topic, in tree order — used for the
  Previous/Next pager.
- `getAdjacentTopics(groupId, topicId)` looks up a lesson's neighbors in that flattened order.
- `findContentTopic(groupId, topicId)` walks the tree directly to find one topic's *full*
  content (including its `blocks`/`qa`) plus its owning group/section — used by
  `GenericTopicPage` (§3.4).
- [`src/components/Sidebar.jsx`](./src/components/Sidebar.jsx) renders the nav by mapping over
  `menuSections`, one collapsible drawer per section, nesting one collapsible sub-drawer per
  group inside it (§3.5).
- [`src/App.jsx`](./src/App.jsx) declares one explicit `<Route>` per React lesson, plus a single
  generic `<Route path="/:groupId/:topicId">` that serves every other subject.

This means the sidebar, the URL structure, and the prev/next navigation can never drift out of
sync with each other — they all read from the same array, regardless of how many subjects exist.

### 3.2 Two content models, one lesson shell

Every lesson — React or otherwise — renders through
[`src/components/TopicPage.jsx`](./src/components/TopicPage.jsx), which standardizes a level/
subject badge, title + summary, a "Key concepts" list, a slot for the actual content, and the
Previous/Next pager. What goes in that slot differs by subject:

| | React lessons | Every other subject |
|---|---|---|
| Page component | One hand-written `.jsx` file per lesson, e.g. `pages/basics/JsxBasics.jsx` | One shared `GenericTopicPage.jsx` for all of them |
| Content | A real, interactive demo component + a displayed code sample | Structured "blocks" (paragraphs, lists, code, tables, diagrams) or a Q&A list |
| Where content lives | In the page component itself | In a plain data file under `src/content/` |
| Route | One explicit `<Route>` in `App.jsx` | The one generic `<Route path="/:groupId/:topicId">` |

### 3.3 The content-driven pipeline (non-React subjects)

A content topic is plain data, not markdown — a small block language, so the renderer never has
to parse text:

```js
{
  id: 'oauth2',
  title: 'OAuth 2.0 — What It Actually Is (and Isn\'t)',
  summary: '...',
  keyPoints: ['...', '...'],
  blocks: [
    { type: 'p', text: '**OAuth 2.0 is an authorization delegation protocol**, not ...' },
    { type: 'mermaid', code: 'sequenceDiagram\n  ...' },
    { type: 'callout', kind: 'tip', text: '...' },
  ],
}
```

A Q&A topic swaps `blocks` for `qa: [{ question, answer }, ...]`. Inline strings support a tiny
markdown subset — `**bold**`, `*italic*`, `` `code` ``, `[text](url)` — parsed by
[`Markdown.jsx`](./src/components/Markdown.jsx).

| Component | Responsibility |
|---|---|
| [`GenericTopicPage.jsx`](./src/pages/GenericTopicPage.jsx) | Reads `:groupId/:topicId` from the URL, looks the topic up via `findContentTopic`, and renders it through `TopicPage` as either an article or a Q&A list. |
| [`ContentBlocks.jsx`](./src/components/ContentBlocks.jsx) | Maps a `blocks` array to real markup: `heading`→`h3/h4`, `p`→paragraph, `list`→`ul/ol`, `code`→`CodeBlock`, `table`→an HTML table, `mermaid`→a diagram, `callout`→a tip/warning box. |
| [`Mermaid.jsx`](./src/components/Mermaid.jsx) | Renders one diagram from its text definition via the `mermaid` package, themed to match the app. Lazy-loaded (`React.lazy` + `Suspense`, from within `ContentBlocks`) so its sizeable dependency only loads on pages that actually contain a diagram. |
| [`QAAccordion.jsx`](./src/components/QAAccordion.jsx) | Renders a Q&A list as click-to-reveal accordion items — quiz yourself before checking the answer — reusing the same collapsible-drawer CSS as the sidebar. |
| [`Markdown.jsx`](./src/components/Markdown.jsx) | The tiny inline-formatting parser described above. |

### 3.4 Supporting components (shared by both models)

| Component | Responsibility |
|---|---|
| [`Layout.jsx`](./src/components/Layout.jsx) | Topbar + Sidebar + `<Outlet />`; owns both the mobile drawer's open state and the desktop sidebar's collapsed state (§3.6). |
| [`Sidebar.jsx`](./src/components/Sidebar.jsx) | Renders the section → group → topic nav from `menuSections` as nested collapsible drawers; highlights the active route via `NavLink`. |
| [`CodeBlock.jsx`](./src/components/CodeBlock.jsx) | Displays a titled, copy-to-clipboard code sample — shared by React's demo pages and every content topic's `code` blocks. |
| [`Callout.jsx`](./src/components/Callout.jsx) | Tip / warning / pitfall / note boxes. |
| [`ErrorBoundary.jsx`](./src/components/ErrorBoundary.jsx) | A real class-based error boundary — used both to protect the whole app in `App.jsx` and as the subject of the Error Boundaries lesson itself. |

### 3.5 Routing layout

```
<ErrorBoundary>                 // catches render errors anywhere in the app
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>       // topbar + sidebar wrap every page
        <Route path="/" element={<Home />} />
        <Route path="/basics/jsx" element={<JsxBasics />} />
        ... (24 more explicit React lesson routes)
        <Route path="/advanced/routing/*" element={<RoutingDeepDive />} />  // nested Routes inside
        <Route path="/:groupId/:topicId" element={<GenericTopicPage />} />  // every other subject
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
</ErrorBoundary>
```

React Router ranks literal path segments above dynamic `:param` segments regardless of
declaration order, so the 25 explicit React routes always win over the generic fallback for
their own URLs — there's no ambiguity even though `/:groupId/:topicId` could technically match
any of them too. The other exception to "one route, one page" is `/advanced/routing/*` — it
renders a *second*, nested `<Routes>` inside `RoutingDeepDive.jsx` to demonstrate nested routing,
dynamic params, and `useNavigate` with real, working URLs
(`/advanced/routing/products/:productId`), rather than just describing them in prose.

### 3.6 The sidebar: nested collapsible drawers, mobile + desktop

The sidebar is a 2-level accordion (section, then group) built from two pieces of state in
`Sidebar.jsx`: `openSections`/`openGroups`, each a `Set` of currently-expanded ids. Both start
containing whichever section/group the current URL belongs to (so landing on a lesson never
hides it), and clicking a header toggles membership. Expanding/collapsing is a pure CSS
animation — `grid-template-rows: 0fr → 1fr` on a wrapper div (the trick that lets a
`height: auto`-sized panel still transition smoothly, which plain `max-height` or `height`
cannot do cleanly) — and collapsed panels get the `inert` attribute so keyboard/screen-reader
focus skips their now-hidden links.

The same drawer mechanics serve two different visual purposes depending on viewport, driven by
one ☰ button in the topbar (`Layout.jsx`) that flips two independent flags together:
- **Mobile** (`mobileOpen`): the sidebar is a fixed-position overlay drawer that slides in over
  the content (`translateX`), with a backdrop to dismiss it — unchanged from a single-subject
  app.
- **Desktop** (`desktopCollapsed`, persisted to `localStorage`): the sidebar is a normal,
  persistent flex column that the same button shrinks to zero width, letting the content reflow
  to fill the freed space, instead of overlaying it.

Only one of the two rules is ever visually active at a given width (the desktop rule is scoped
inside `@media (min-width: 901px)`), so toggling both flags together is safe — whichever one
doesn't apply at the current viewport width is simply inert CSS.

---

## 4. Concept guide — React Basics

### 4.1 JSX & Rendering — `src/pages/basics/JsxBasics.jsx`
JSX compiles (via Babel/SWC, at build time — Vite uses `@vitejs/plugin-react`) to
`React.createElement(...)` calls. Practically that means: it's an *expression*, so it can be
assigned, returned, or passed around; `{ }` embeds arbitrary JS; and a JSX element must have one
root (a real tag or a Fragment). Component names must be capitalized so the compiler treats them
as component references rather than literal DOM tag names.

### 4.2 Components & Props — `src/pages/basics/ComponentsProps.jsx`
A component is a function returning JSX. Props are its read-only inputs, destructured in the
signature (`function Card({ title, children })`). Data flows one way, parent → child; a child
communicates upward only via a callback prop the parent supplies. `children` is the special prop
populated by whatever JSX was nested between a component's opening/closing tags.

### 4.3 State with `useState` — `src/pages/basics/StateHooks.jsx`
`const [value, setValue] = useState(initial)`. Calling the setter **schedules** a re-render — it
does not mutate `value` synchronously in the current render's closure. Two patterns matter:
- **Functional updates** — `setCount(c => c + 1)` — required whenever the next value depends on
  the previous one, especially when multiple updates might be queued together.
- **Lazy initialization** — `useState(() => expensiveCompute())` — the initializer function runs
  exactly once, on mount, not on every re-render.

### 4.4 Event Handling — `src/pages/basics/EventHandling.jsx`
React wires DOM events with camelCase props (`onClick`, `onKeyDown`) and wraps the native event
in a cross-browser `SyntheticEvent`. Pass a function *reference*, not a call
(`onClick={handleClick}`, never `onClick={handleClick()}`). Events bubble by default;
`event.stopPropagation()` stops an inner handler's event from also firing an ancestor's handler.

### 4.5 Conditional Rendering — `src/pages/basics/ConditionalRendering.jsx`
Because JSX is JavaScript, conditionals are just JavaScript: an early `return` for a whole
different tree, `condition ? <A/> : <B/>` for either/or, `condition && <A/>` for
render-or-nothing. The `&&` pitfall: if `condition` is `0` (or any falsy-but-not-boolean value),
React renders that literal value — guard with `condition > 0 && ...` instead of `count && ...`.

### 4.6 Lists & Keys — `src/pages/basics/ListsAndKeys.jsx`
`array.map()` turns data into elements; each needs a `key` prop that is **stable** (same item →
same key across renders) and **unique among siblings**. Keys let React match elements across
re-renders instead of rebuilding the DOM. Using the array index as a key is only safe for lists
that are never reordered/filtered/spliced — otherwise it causes state (focus, input values,
animation) to "stick" to the wrong row when order changes.

### 4.7 Forms & Controlled Inputs — `src/pages/basics/FormsControlled.jsx`
A controlled input's value is always driven by React state (`value={state}` +
`onChange={updateState}`) — the DOM node never holds its own separate value. One `handleChange`
keyed off `event.target.name` can drive many fields when state is a single object. Checkboxes
read `event.target.checked` (boolean), not `.value`. Always `event.preventDefault()` in
`onSubmit` — the browser default is a full-page navigation.

---

## 5. Concept guide — React Intermediate

### 5.1 `useEffect` & Lifecycle — `src/pages/intermediate/EffectsLifecycle.jsx`
`useEffect` synchronizes a component with something *outside* React — the DOM, a timer, a
subscription — after the browser has painted. The dependency array controls when it re-runs:
omitted = every render, `[]` = once on mount, `[a, b]` = whenever `a` or `b` changes. Whatever
function the effect *returns* is its cleanup, run before the next execution and on unmount —
this is how you cancel intervals, remove listeners, and abort in-flight requests. Prefer
thinking "keep X in sync with Y" over mapping to old class lifecycle names.

### 5.2 `useRef` & the DOM — `src/pages/intermediate/RefsDom.jsx`
`useRef(initial)` returns a mutable `{ current }` box that persists across renders **without**
causing a re-render when mutated. Two uses: (a) `ref={domRef}` on an element gives you the actual
DOM node for imperative access (`.focus()`, scroll position); (b) a general mutable "instance
variable" for values that shouldn't trigger rendering (a timer id, a render counter, "have we
already fetched?"). Rule of thumb: if a value should appear on screen, it's state; if it's
purely an implementation detail, it's a ref.

### 5.3 Context API — `src/pages/intermediate/ContextApi.jsx`
`createContext(default)` + `<Context.Provider value={...}>` shares a value with an entire
subtree without threading it through every intermediate component's props ("prop drilling").
`useContext(Context)` reads the nearest Provider above the calling component. Every consumer
re-renders when the Provider's value changes — so for a large tree, memoize the value object
(`useMemo(() => ({ theme, toggle }), [theme])`) rather than passing a fresh object literal every
render. A common idiom: wrap `useContext` in your own hook (`useTheme()`) that throws a clear
error when called outside its Provider.

### 5.4 `useReducer` — `src/pages/intermediate/ReducerState.jsx`
A reducer is a pure function `(state, action) => newState`. `dispatch({ type, payload })` is the
only way to request a change; the reducer alone decides what happens. Reach for `useReducer`
over several `useState` calls once state fields update together, or the next state depends on
*which action* fired rather than just the previous value — it centralizes the transition logic,
which is easier to test and to reason about than updates scattered across event handlers.

### 5.5 Custom Hooks — `src/pages/intermediate/CustomHooks.jsx`
Any function whose name starts with `use` and calls other hooks is a custom hook — React's
primary mechanism for sharing *stateful logic* (not state itself — each caller gets independent
state) between components. The `use` prefix lets the linter enforce the Rules of Hooks on your
own hooks too. See §7.4 for a library of more production-flavored examples
(`useLocalStorage`, `useDebounce`, `usePrevious`).

### 5.6 Fragments & Strict Mode — `src/pages/intermediate/FragmentsStrict.jsx`
`<>...</>` (shorthand for `<Fragment>...</Fragment>`) groups multiple elements with zero extra
DOM nodes — necessary when a parent tag requires specific direct children (`<dl><dt/><dd/></dl>`,
`<table><tr/></table>`). Use the explicit `<Fragment key={...}>` form when a key is needed, e.g.
inside a `.map()`. `<StrictMode>` adds no UI; in development only, it intentionally
mounts→unmounts→remounts components and double-invokes certain functions to surface effects and
state updates that aren't idempotent/pure. It has zero effect in production builds.

---

## 6. Concept guide — React Advanced

### 6.1 `memo`, `useMemo` & `useCallback` — `src/pages/advanced/Performance.jsx`
All three fight the same problem — unnecessary re-renders/recomputation — by letting React
**skip** work rather than making any single render faster:
- `React.memo(Component)` skips re-rendering when props are shallow-equal to last time.
- `useMemo(fn, deps)` caches an expensive computed value between renders.
- `useCallback(fn, deps)` caches a function *reference*, most useful so a `memo`-wrapped child
  doesn't see a "new" `onClick` prop every render (which would otherwise defeat its memoization).

`memo()`'s comparison is shallow — a fresh object/array/function literal passed as a prop every
render (`style={{...}}`) still looks "new" even if its contents are identical. Profile before
reaching for these; they add their own overhead and complexity.

### 6.2 Higher-Order Components — `src/pages/advanced/HOC.jsx`
A HOC is a function `Component => EnhancedComponent`, conventionally named `withX`
(`withLoading`, `withAuth`). It layers behavior around a component from the outside. Spread
pass-through props (`{...rest}`) so the wrapped component still gets what it needs. Custom hooks
have replaced most HOC use cases in modern React; HOCs remain useful specifically when you need
to wrap or replace the *returned element* itself, not just share logic.

### 6.3 Render Props — `src/pages/advanced/RenderProps.jsx`
A component whose `children` (or a `render` prop) is a *function* that returns JSX — the
component owns state/logic and calls `children(state)`, letting the caller decide exactly what
to render. Cleanly separates "who owns the logic" from "who decides the markup," at the cost of
nesting when several are composed. Custom hooks cover most of the same ground today with less
nesting.

### 6.4 Error Boundaries — `src/pages/advanced/ErrorBoundaries.jsx`, `src/components/ErrorBoundary.jsx`
A class component implementing `static getDerivedStateFromError` (to switch to a fallback UI) and
`componentDidCatch` (to log the error) catches JS errors thrown anywhere in its child tree
**during rendering** — but *not* inside event handlers, async callbacks, or its own render. There
is still no hook equivalent — this is one of the few places a class component is unavoidable in
modern React (`react-error-boundary` on npm wraps this same mechanism). This app wraps its entire
route tree in one at the top of `App.jsx`, in addition to the lesson's own local demo boundary.

### 6.5 Portals — `src/pages/advanced/Portals.jsx`
`createPortal(children, domNode)` renders children into a DOM node outside the parent's DOM
position — typically `document.body` — while keeping them in the same React tree: context still
flows through, and events still bubble as if the content were rendered in place. The standard use
case is anything that needs to visually escape a parent with `overflow: hidden` or a constrained
`z-index` — modals, tooltips, dropdowns.

### 6.6 `forwardRef` & `useImperativeHandle` — `src/pages/advanced/ForwardRefImperative.jsx`
Refs normally only attach to DOM elements/class components. In React 19, function components can
declare `ref` as an ordinary destructured prop (React 18 and earlier require wrapping with
`forwardRef((props, ref) => ...)`). `useImperativeHandle(ref, () => ({...}))` replaces what the
parent's `ref.current` sees with a curated object (e.g. `{ focus, clear }`) instead of the raw DOM
node — an intentional escape hatch for imperative needs (focus management, media control), not a
general substitute for props/state communication.

### 6.7 Lazy Loading & Suspense — `src/pages/advanced/CodeSplitting.jsx`, `src/pages/advanced/HeavyPanel.jsx`
`lazy(() => import('./Component.jsx'))` plus `<Suspense fallback={...}>` splits a component into
its own bundle chunk, fetched only when it first renders. Confirmed for real in this project: run
`npm run build` and `dist/assets/HeavyPanel-*.js` appears as its own chunk, separate from the main
bundle. A single `<Suspense>` boundary can cover several lazy children at once. Route-level code
splitting (one chunk per page) is the highest-impact application of this technique in a real app.

### 6.8 Data Fetching Patterns — `src/pages/advanced/DataFetching.jsx`
Fetching in an effect means tracking three states together — `{ data, error, loading }` — and
guarding against race conditions: if the input (e.g. a user id) changes while a request is still
in flight, an `AbortController` cancelled in the effect's cleanup function stops a stale response
from overwriting a newer one. This pattern is best wrapped in a reusable `useFetch(url)` hook. In
production, a dedicated library (TanStack Query, SWR, RTK Query) handles caching, retries, and
deduplication far more robustly than hand-rolled effects — this lesson teaches the underlying
mechanics those libraries automate.

### 6.9 Routing Deep Dive — `src/pages/advanced/RoutingDeepDive.jsx`
Beyond the app's own top-level routing (§3.4), this lesson embeds a second, working nested router
directly in the page: an index route, a `products` list, and a `products/:productId` detail route
reachable via real URLs like `/advanced/routing/products/kb-01`. It demonstrates `useParams()`
(reading the `:productId` segment), `<Link to="…">` (relative navigation without a full reload),
and `useNavigate()` (programmatic navigation, including `navigate(-1)` to go back).

---

## 7. Concept guide — React Expert

### 7.1 Reducer + Context (Global State) — `src/pages/expert/GlobalStateReducerContext.jsx`
Combining `useReducer` (predictable transitions) with Context (tree-wide access) produces a
small, dependency-free global store: the reducer owns the logic, the Provider exposes
`{ state, dispatch }`, and a guarded custom hook (`useCart()`) is the only access point. This is
structurally the same shape that Redux and Zustand formalize — the trade-off is that raw
Context has no partial-subscription mechanism, so *every* consumer re-renders on *every* state
change, unlike a selector-based store. Reach for a real state library once that becomes a
measured problem in a large tree.

### 7.2 Concurrent Features — `src/pages/expert/ConcurrentFeatures.jsx`
`useTransition()` returns `[isPending, startTransition]` — wrapping a state update in
`startTransition` marks it as interruptible/low-priority, so an urgent update (a keystroke) can
preempt it. `useDeferredValue(value)` achieves a similar goal without a separate setter: it
returns a lagging copy of a value that catches up once more urgent work finishes, useful when you
don't control where the value originates (e.g. it arrives as a prop). Neither hook makes the
underlying computation faster — they change *scheduling*. The lesson's demo deliberately
throttles a 4,000-item filter so the responsiveness difference is visible while typing.

### 7.3 React 19: Actions & `use()` — `src/pages/expert/React19Features.jsx`
Three additions this project's installed React version (19) provides:
- **`useActionState(action, initialState)`** wires a `<form action={fn}>` to React: `action`
  receives `(previousState, formData)`, can be async, and React tracks `isPending` plus
  whatever the action last returned.
- **`useOptimistic(state, updateFn)`** shows an immediate, optimistic UI update while a real
  async operation is in flight, then reconciles once it resolves. **Its setter must be called
  inside a transition or a form action** — calling it directly from a plain async event handler
  throws the console error *"An optimistic state update occurred outside a transition or
  action"* (a real bug caught and fixed during this project's build — see the `handleLike`
  function, which wraps the update in `startTransition(async () => {...})`).
- **`use(promise)`** reads a promise directly during render and suspends the component (via a
  `<Suspense>` ancestor) until it resolves; `use(context)` can also replace `useContext`. Unlike
  every other hook, `use()` may be called conditionally.

### 7.4 Custom Hook Library — `src/pages/expert/CustomHookLibrary.jsx`
Three more hand-rolled hooks, each following the same shape (wrap some state, add a
`useEffect`, return whatever's useful):
- **`useLocalStorage(key, initial)`** — mirrors `useState`, but persists to
  `window.localStorage` with a lazy initializer that reads the stored value once.
- **`useDebounce(value, delayMs)`** — delays reflecting a fast-changing value until it's been
  stable for `delayMs`; the classic pairing is debouncing a search box before firing a request.
- **`usePrevious(value)`** — exploits the fact that an effect runs *after* render: it writes
  `ref.current = value` in an effect, so during the *current* render, reading `ref.current`
  still returns the *previous* render's value. This is a widely used, historically canonical
  pattern (see React's own older docs/blog examples) — note that some newer lint rules flag
  reading `ref.current` during render as a caution, because it doesn't fit cleanly into fully
  compiler-optimized (React Compiler) code; it remains correct and safe for regular
  (non-compiled) React apps like this one.

### 7.5 Capstone: Todo App — `src/pages/expert/CapstoneTodoApp.jsx`
Ties nearly everything together in one feature: `todosReducer` owns every transition (add,
toggle, remove, edit, clearCompleted); `TodosProvider` + `useTodos()` expose it via Context;
`AddTodoForm` and each `TodoRow`'s inline edit field are controlled inputs; the todo list uses
proper keys and conditional "empty state" rendering; and a `useEffect` persists the reducer's
state to `localStorage` on every change, read back via a lazy `useReducer` initializer on first
load. The active filter (`all`/`active`/`completed`) deliberately stays as **local** state in
`TodoApp` rather than in the shared store, because no other component needs it — a small but
real example of *not* over-centralizing state.

---

## 8. Other subjects

Every subject below follows the pipeline described in §3.2-3.3: a **Guide** group of written
lessons (`src/content/<subject>.js`) and an **Interview Q&A** group with one click-to-reveal
quiz topic. Source material for all of them was adapted from the user's own interview-prep
notes. Counts are guide-topics / Q&A pairs.

| Subject | File | Guide topics | Q&A pairs | Covers |
|---|---|---|---|---|
| Python | `src/content/python.js` | 10 | 10 | The GIL, asyncio's event loop, language internals (mutable defaults, decorators, context managers, generators), FastAPI's Pydantic validation & dependency injection, Flask fundamentals, a paginated-API case study |
| JavaScript | `src/content/javascript.js` | 6 | 2 | The event loop precisely, closures, `this` binding rules, prototypal inheritance, equality/coercion gotchas, promises & async/await |
| TypeScript | `src/content/typescript.js` | 6 | 3 | Structural typing, generics, union/intersection/discriminated unions, utility types, `unknown` vs `any`, `interface` vs `type` |
| Git | `src/content/git.js` | 4 | 10 | How Git models history (the three-tree model), branching/merging/rebasing, undoing things (reset vs revert vs restore), remote collaboration workflows |
| LLD | `src/content/lld.js` | 14 | 25 | SOLID, creational/structural/behavioral design patterns, the repeatable LLD process, five full case studies (Parking Lot, Rate Limiter, Elevator, Splitwise, BookMyShow), concurrency patterns, anti-patterns |
| HLD | `src/content/hld.js` | 13 | 25 | The HLD framework, an estimation cheat sheet, core building blocks, five case studies (URL Shortener, News Feed, Chat, Ride-Sharing Dispatch, Video Streaming), consistency/availability tradeoffs, failure modes & observability |
| System Design Patterns | `src/content/system-design-patterns.js` | 11 | 25 | Consistent hashing, replication strategies, Paxos/Raft consensus, database storage engines, load balancing, caching, monolith vs microservices vs serverless, event sourcing/CQRS, 2PC/Saga, an e-commerce case study |
| Authentication & Authorization | `src/content/auth.js` | 10 | 17 | AuthN vs AuthZ, password hashing, sessions vs JWTs, OAuth 2.0 & PKCE, OIDC, CSRF/XSS/cookies, RBAC/ABAC/ReBAC, a multi-tenant SaaS case study |
| LangChain | `src/content/langchain.js` | 3 | 2 | What LangChain actually solves, LCEL chains in practice, where it earns criticism |
| LangGraph | `src/content/langgraph.js` | 5 | 6 | Why LangGraph exists beyond LangChain's agents, the Model Context Protocol (MCP), a hand-rolled agentic tool-use loop, agent architectures beyond ReAct |
| RAG | `src/content/rag.js` | 9 | 7 | LLM fundamentals, chunking, embeddings & vector search, hybrid search & re-ranking, RAG evaluation, advanced RAG patterns, fine-tuning vs RAG vs prompt engineering, an enterprise-assistant case study |

**Totals: 12 subjects, 26 groups, 129 topics, 132 Q&A pairs.**

Many of these lessons include a live-rendered **Mermaid diagram** (architecture flowcharts,
sequence diagrams, the Raft leader-election state machine, consistent-hashing rings) — see §3.3
for how `Mermaid.jsx` renders them and why it's lazy-loaded.

---

## 9. Design decisions

- **React 19, not an older version.** The project installs whatever `npm create vite@latest`
  currently scaffolds (React 19 at the time of writing), which made it possible to cover
  `useActionState`, `useOptimistic`, and `use()` as *working* demos rather than descriptions of
  future API. If you're learning React 18, everything except the Expert §7.3 lesson applies
  unchanged.
- **Plain CSS, no UI framework.** So that every visual element in a demo maps directly back to
  readable JSX/CSS in that lesson's own file — no framework class names or component library
  internals stand between "what you see" and "what you read".
- **One file per lesson, demo code co-located with the explanatory code snippet.** Slightly more
  duplication (the displayed snippet and the live version can drift if not updated together) in
  exchange for every lesson being independently readable top-to-bottom.
- **`react-router-dom` with explicit routes, not a generated/dynamic route table.** Keeps
  `App.jsx` the single, greppable place to see every URL the app responds to, while
  `data/topics.js` remains the single source of truth for ordering/labels.
- **A real class-based `ErrorBoundary`,** because that's still what React requires in 2025+ — the
  app doesn't pretend a hook-based alternative exists.

## 10. Extending the app

**To add a new React lesson** (say, "Suspense for Data") — the hand-built, interactive kind:

1. Create `src/pages/<group>/YourLesson.jsx`, following an existing lesson in the same group as a
   template — export a component that renders `<TopicPage groupId=... topicId=... level=...>`.
2. Add `{ id: 'your-lesson', title: 'Your Lesson' }` to the matching group inside the `react`
   entry of `menuSections` in `src/data/topics.js`.
3. Add `<Route path="/<group>/your-lesson" element={<YourLesson />} />` in `src/App.jsx`.

**To add a new lesson to an existing content-driven subject** (say, another Python topic) — no
component, no route, just data:

1. Open `src/content/<subject>.js` and add a new topic object to the `<subject>-guide` group's
   `topics` array — `{ id, title, summary, keyPoints, blocks }` (see §3.3 for the block types).
2. That's it. `GenericTopicPage` + the existing `/:groupId/:topicId` route pick it up
   automatically, and it appears in the sidebar and prev/next pager because they read from the
   same array.

**To add a whole new subject** (say, "Kubernetes"):

1. Create `src/content/kubernetes.js` exporting a section object — copy `src/content/git.js` as
   a template (it's the smallest complete example): `{ id: 'kubernetes', label: 'Kubernetes',
   icon: '☸️', groups: [{ id: 'kubernetes-guide', label: 'Guide', topics: [...] }, { id:
   'kubernetes-qa', label: 'Interview Q&A', topics: [{ id: 'qa', qa: [...] }] }] }`. Keep group
   ids prefixed with the subject id — they must be unique across the *entire* app, since routes
   are `/:groupId/:topicId` with no subject segment.
2. Import it and add it to the `menuSections` array in `src/data/topics.js`.

In every case, the sidebar, the Previous/Next pager, and the URL structure update automatically
— nothing else needs to change.

## 11. Verifying the app

This project was verified, not just written:

- `npm run build` — a clean production build (Vite/Rollup) with zero errors, confirming every
  file compiles, that `HeavyPanel` genuinely code-splits into its own chunk, and that `Mermaid`
  does too (so its sizeable dependency tree only loads on pages with a diagram).
- `npm run lint` (`oxlint`) — the only warnings remaining are intentional, pedagogical exceptions
  in the React lessons (e.g. `RefsDom.jsx` and `CustomHookLibrary.jsx`'s `usePrevious`
  deliberately read a ref during render *because that's the concept being taught*;
  `DataFetching.jsx` calls `setState` inside an effect because that's the canonical
  data-fetching-in-an-effect pattern).
- A programmatic check that every group id is unique across all 12 sections and every
  `groupId/topicId` pair is unique — required for the flat `/:groupId/:topicId` routing scheme
  to work with no subject segment in the URL.
- Manual, in-browser testing of the trickiest interactive demos (Error Boundaries actually
  catching and resetting, Portals actually escaping a clipped container, nested routing actually
  reading URL params, the Capstone app actually persisting to `localStorage`, React 19's
  `useOptimistic` actually reconciling, mermaid diagrams actually rendering across multiple
  diagram types — flowchart, sequence, and state diagrams). This process caught and fixed two
  real bugs: the `useOptimistic` demo originally called its setter outside a transition, which
  React 19 rejects at runtime (§7.3); and the inline-markdown renderer initially didn't support
  `*italic*` text, leaving literal asterisks in some content-driven lessons.
- The 9 content-driven subjects beyond Git and Authentication & Authorization were drafted by
  parallel agents against a shared schema and the same two worked examples (`git.js`, `auth.js`),
  then spot-checked in-browser across subjects for rendering correctness (tables, code blocks,
  diagrams, Q&A accordions) and checked programmatically for structural/id correctness.

## 12. Further resources

- [react.dev](https://react.dev) — the official docs; every React concept in this app maps to a
  page there, usually linked to directly from within each lesson.
- [react.dev/reference/react](https://react.dev/reference/react) — the hooks API reference used
  throughout the Intermediate/Advanced/Expert sections.
- [reactrouter.com](https://reactrouter.com) — full `react-router-dom` API used in §6.9.
- [TanStack Query](https://tanstack.com/query) — the production-grade evolution of the manual
  `useFetch` pattern in §6.8.
- [mermaid.js.org](https://mermaid.js.org) — the diagram syntax used throughout the
  content-driven subjects' `mermaid` blocks.
- [Refactoring.Guru](https://refactoring.guru/design-patterns) — a deeper reference for every
  design pattern named in the LLD section.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org) — production-grade depth beyond
  the Authentication & Authorization section's interview-level coverage.
