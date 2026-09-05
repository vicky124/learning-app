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
4. [Concept guide — React](#4-concept-guide--react)
5. [Other subjects](#5-other-subjects)
6. [Design decisions](#6-design-decisions)
7. [Extending the app](#7-extending-the-app)
8. [Verifying the app](#8-verifying-the-app)
9. [Further resources](#9-further-resources)

---

## 1. Purpose & how to use this app

This project is a **teaching and interview-prep tool**, not a template for a production app. The
React section makes 33 React concepts — from "what is JSX" to React 19's `useOptimistic`/`use()`
— tangible, by pairing a short explanation with a demo you can actually interact with and the
exact source code that powers it. Every other subject trades the live demo for a thorough
written guide (diagrams included, rendered live via Mermaid) plus a self-quiz Interview Q&A
list, sourced from the user's own interview-prep notes (or, for subjects with no existing notes,
written from scratch) and restructured into the app.

**Recommended path:** open the sidebar drawer for a subject (e.g. "React" or "Python"), then
work its two sub-drawers — **Guide** (the lessons, ordered basic → advanced) then **Interview
Q&A** (a self-quiz once you've read the Guide). This is the same shape for every subject,
including React — its four old Basics/Intermediate/Advanced/Expert sidebar groups are now one
combined Guide, with each lesson's difficulty still shown as its page badge. Each lesson page
also has Previous/Next links at the bottom that follow the same order.

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
      { id: 'react-guide', label: 'Guide', topics: [{ id: 'jsx', title: 'JSX & Rendering' }, ...] },
      { id: 'react-qa', label: 'Interview Q&A', topics: [{ id: 'qa', ..., qa: reactQA }] },
  ]},
  pythonSection,   // imported from src/content/python.js
  gitSection,      // imported from src/content/git.js
  ...
]
```

React's two groups (`react-guide` and `react-qa`) are defined inline in `topics.js` — every
other subject arrives as one ready-made group pair from its own `src/content/` file — but
React's `react-guide` topic entries only need `{ id, title }`, since their real content lives in
hand-built page components (§3.2), not in the topic object itself. `react-qa`'s `qa` array is the
one exception: it's imported from `src/content/react-qa.js` and embedded directly, since that one
topic is content-driven like every other subject's Q&A, not a hand-built page. Every other
subject is imported as a ready-made **section object** from its own file under `src/content/`
(e.g. `pythonSection`, `gitSection`, `authSection`) and simply appended to the array — see §7 for
the exact steps to add a new one.

Everything else derives from this one array:
- `topicGroups` flattens it to one entry per group (tagged with its owning section) — what
  [`Home.jsx`](./src/pages/Home.jsx) renders as section blocks of cards.
- `allTopics` further flattens to one entry per topic, in tree order — used for the
  Previous/Next pager.
- `getAdjacentTopics(groupId, topicId)` looks up a lesson's neighbors in that flattened order.
- `findContentTopic(groupId, topicId)` walks the tree directly to find one topic's *full*
  content (including its `blocks`/`qa`) plus its owning group/section — used by
  `GenericTopicPage` (§3.3).
- [`src/components/Sidebar.jsx`](./src/components/Sidebar.jsx) renders the nav by mapping over
  `menuSections`, one collapsible drawer per section, nesting one collapsible sub-drawer per
  group inside it (§3.6).
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

## 4. Concept guide — React

All 33 React lessons now live in one merged sidebar group (`react-guide` — see §3.6's note on
the sidebar, and §6's design-decisions entry on why), plus a separate Interview Q&A group
(`react-qa`, `src/content/react-qa.js`, 20 questions). The four-level structure below
(Basics/Intermediate/Advanced/Expert) is preserved here purely as this document's own
organization — and as each lesson's `level` badge, still shown on the page — not as separate
sidebar drawers.

### React Basics

### JSX & Rendering — `src/pages/basics/JsxBasics.jsx`
JSX compiles (via Babel/SWC, at build time — Vite uses `@vitejs/plugin-react`) to
`React.createElement(...)` calls. Practically that means: it's an *expression*, so it can be
assigned, returned, or passed around; `{ }` embeds arbitrary JS; and a JSX element must have one
root (a real tag or a Fragment). Component names must be capitalized so the compiler treats them
as component references rather than literal DOM tag names.

### Components & Props — `src/pages/basics/ComponentsProps.jsx`
A component is a function returning JSX. Props are its read-only inputs, destructured in the
signature (`function Card({ title, children })`). Data flows one way, parent → child; a child
communicates upward only via a callback prop the parent supplies. `children` is the special prop
populated by whatever JSX was nested between a component's opening/closing tags.

### State with `useState` — `src/pages/basics/StateHooks.jsx`
`const [value, setValue] = useState(initial)`. Calling the setter **schedules** a re-render — it
does not mutate `value` synchronously in the current render's closure. Two patterns matter:
- **Functional updates** — `setCount(c => c + 1)` — required whenever the next value depends on
  the previous one, especially when multiple updates might be queued together.
- **Lazy initialization** — `useState(() => expensiveCompute())` — the initializer function runs
  exactly once, on mount, not on every re-render.

### Event Handling — `src/pages/basics/EventHandling.jsx`
React wires DOM events with camelCase props (`onClick`, `onKeyDown`) and wraps the native event
in a cross-browser `SyntheticEvent`. Pass a function *reference*, not a call
(`onClick={handleClick}`, never `onClick={handleClick()}`). Events bubble by default;
`event.stopPropagation()` stops an inner handler's event from also firing an ancestor's handler.

### Conditional Rendering — `src/pages/basics/ConditionalRendering.jsx`
Because JSX is JavaScript, conditionals are just JavaScript: an early `return` for a whole
different tree, `condition ? <A/> : <B/>` for either/or, `condition && <A/>` for
render-or-nothing. The `&&` pitfall: if `condition` is `0` (or any falsy-but-not-boolean value),
React renders that literal value — guard with `condition > 0 && ...` instead of `count && ...`.

### Lists & Keys — `src/pages/basics/ListsAndKeys.jsx`
`array.map()` turns data into elements; each needs a `key` prop that is **stable** (same item →
same key across renders) and **unique among siblings**. Keys let React match elements across
re-renders instead of rebuilding the DOM. Using the array index as a key is only safe for lists
that are never reordered/filtered/spliced — otherwise it causes state (focus, input values,
animation) to "stick" to the wrong row when order changes.

### Forms & Controlled Inputs — `src/pages/basics/FormsControlled.jsx`
A controlled input's value is always driven by React state (`value={state}` +
`onChange={updateState}`) — the DOM node never holds its own separate value. One `handleChange`
keyed off `event.target.name` can drive many fields when state is a single object. Checkboxes
read `event.target.checked` (boolean), not `.value`. Always `event.preventDefault()` in
`onSubmit` — the browser default is a full-page navigation.

### Controlled vs Uncontrolled Components — `src/pages/basics/ControlledUncontrolled.jsx`
A controlled input's value lives in React state (`value` + `onChange`); an uncontrolled input's
value lives in the DOM and is read on demand via a `ref` (`defaultValue`, not `value`).
Controlled makes live validation/formatting trivial since every keystroke is visible; uncontrolled
avoids a re-render per keystroke, which matters for large or performance-sensitive forms. File
inputs are always uncontrolled — the browser refuses to let JavaScript set their value.

### React Intermediate

### `useEffect` & Lifecycle — `src/pages/intermediate/EffectsLifecycle.jsx`
`useEffect` synchronizes a component with something *outside* React — the DOM, a timer, a
subscription — after the browser has painted. The dependency array controls when it re-runs:
omitted = every render, `[]` = once on mount, `[a, b]` = whenever `a` or `b` changes. Whatever
function the effect *returns* is its cleanup, run before the next execution and on unmount —
this is how you cancel intervals, remove listeners, and abort in-flight requests. Prefer
thinking "keep X in sync with Y" over mapping to old class lifecycle names.

### `useRef` & the DOM — `src/pages/intermediate/RefsDom.jsx`
`useRef(initial)` returns a mutable `{ current }` box that persists across renders **without**
causing a re-render when mutated. Two uses: (a) `ref={domRef}` on an element gives you the actual
DOM node for imperative access (`.focus()`, scroll position); (b) a general mutable "instance
variable" for values that shouldn't trigger rendering (a timer id, a render counter, "have we
already fetched?"). Rule of thumb: if a value should appear on screen, it's state; if it's
purely an implementation detail, it's a ref.

### Context API — `src/pages/intermediate/ContextApi.jsx`
`createContext(default)` + `<Context.Provider value={...}>` shares a value with an entire
subtree without threading it through every intermediate component's props ("prop drilling").
`useContext(Context)` reads the nearest Provider above the calling component. Every consumer
re-renders when the Provider's value changes — so for a large tree, memoize the value object
(`useMemo(() => ({ theme, toggle }), [theme])`) rather than passing a fresh object literal every
render. A common idiom: wrap `useContext` in your own hook (`useTheme()`) that throws a clear
error when called outside its Provider.

### `useReducer` — `src/pages/intermediate/ReducerState.jsx`
A reducer is a pure function `(state, action) => newState`. `dispatch({ type, payload })` is the
only way to request a change; the reducer alone decides what happens. Reach for `useReducer`
over several `useState` calls once state fields update together, or the next state depends on
*which action* fired rather than just the previous value — it centralizes the transition logic,
which is easier to test and to reason about than updates scattered across event handlers.

### Custom Hooks — `src/pages/intermediate/CustomHooks.jsx`
Any function whose name starts with `use` and calls other hooks is a custom hook — React's
primary mechanism for sharing *stateful logic* (not state itself — each caller gets independent
state) between components. The `use` prefix lets the linter enforce the Rules of Hooks on your
own hooks too. See the Custom Hook Library lesson for a library of more production-flavored examples
(`useLocalStorage`, `useDebounce`, `usePrevious`).

### Fragments & Strict Mode — `src/pages/intermediate/FragmentsStrict.jsx`
`<>...</>` (shorthand for `<Fragment>...</Fragment>`) groups multiple elements with zero extra
DOM nodes — necessary when a parent tag requires specific direct children (`<dl><dt/><dd/></dl>`,
`<table><tr/></table>`). Use the explicit `<Fragment key={...}>` form when a key is needed, e.g.
inside a `.map()`. `<StrictMode>` adds no UI; in development only, it intentionally
mounts→unmounts→remounts components and double-invokes certain functions to surface effects and
state updates that aren't idempotent/pure. It has zero effect in production builds.

### Accessibility (a11y) Patterns — `src/pages/intermediate/Accessibility.jsx`
Most React accessibility bugs come from re-implementing an interactive element that native HTML
already provides for free (a `<div>` styled as a button loses keyboard operability and screen-reader
semantics that a real `<button>` gets automatically). When a native element cannot express the
needed UI, add back what was lost explicitly: a `role`, `tabIndex={0}` plus an `onKeyDown` handler
for Enter/Space, and the relevant `aria-*` state attributes. `aria-live="polite"` announces dynamic
content changes to screen readers, which a purely visual update never does on its own.

### React Advanced

### `memo`, `useMemo` & `useCallback` — `src/pages/advanced/Performance.jsx`
All three fight the same problem — unnecessary re-renders/recomputation — by letting React
**skip** work rather than making any single render faster:
- `React.memo(Component)` skips re-rendering when props are shallow-equal to last time.
- `useMemo(fn, deps)` caches an expensive computed value between renders.
- `useCallback(fn, deps)` caches a function *reference*, most useful so a `memo`-wrapped child
  doesn't see a "new" `onClick` prop every render (which would otherwise defeat its memoization).

`memo()`'s comparison is shallow — a fresh object/array/function literal passed as a prop every
render (`style={{...}}`) still looks "new" even if its contents are identical. Profile before
reaching for these; they add their own overhead and complexity.

### Higher-Order Components — `src/pages/advanced/HOC.jsx`
A HOC is a function `Component => EnhancedComponent`, conventionally named `withX`
(`withLoading`, `withAuth`). It layers behavior around a component from the outside. Spread
pass-through props (`{...rest}`) so the wrapped component still gets what it needs. Custom hooks
have replaced most HOC use cases in modern React; HOCs remain useful specifically when you need
to wrap or replace the *returned element* itself, not just share logic.

### Render Props — `src/pages/advanced/RenderProps.jsx`
A component whose `children` (or a `render` prop) is a *function* that returns JSX — the
component owns state/logic and calls `children(state)`, letting the caller decide exactly what
to render. Cleanly separates "who owns the logic" from "who decides the markup," at the cost of
nesting when several are composed. Custom hooks cover most of the same ground today with less
nesting.

### Error Boundaries — `src/pages/advanced/ErrorBoundaries.jsx`, `src/components/ErrorBoundary.jsx`
A class component implementing `static getDerivedStateFromError` (to switch to a fallback UI) and
`componentDidCatch` (to log the error) catches JS errors thrown anywhere in its child tree
**during rendering** — but *not* inside event handlers, async callbacks, or its own render. There
is still no hook equivalent — this is one of the few places a class component is unavoidable in
modern React (`react-error-boundary` on npm wraps this same mechanism). This app wraps its entire
route tree in one at the top of `App.jsx`, in addition to the lesson's own local demo boundary.

### Portals — `src/pages/advanced/Portals.jsx`
`createPortal(children, domNode)` renders children into a DOM node outside the parent's DOM
position — typically `document.body` — while keeping them in the same React tree: context still
flows through, and events still bubble as if the content were rendered in place. The standard use
case is anything that needs to visually escape a parent with `overflow: hidden` or a constrained
`z-index` — modals, tooltips, dropdowns.

### `forwardRef` & `useImperativeHandle` — `src/pages/advanced/ForwardRefImperative.jsx`
Refs normally only attach to DOM elements/class components. In React 19, function components can
declare `ref` as an ordinary destructured prop (React 18 and earlier require wrapping with
`forwardRef((props, ref) => ...)`). `useImperativeHandle(ref, () => ({...}))` replaces what the
parent's `ref.current` sees with a curated object (e.g. `{ focus, clear }`) instead of the raw DOM
node — an intentional escape hatch for imperative needs (focus management, media control), not a
general substitute for props/state communication.

### Lazy Loading & Suspense — `src/pages/advanced/CodeSplitting.jsx`, `src/pages/advanced/HeavyPanel.jsx`
`lazy(() => import('./Component.jsx'))` plus `<Suspense fallback={...}>` splits a component into
its own bundle chunk, fetched only when it first renders. Confirmed for real in this project: run
`npm run build` and `dist/assets/HeavyPanel-*.js` appears as its own chunk, separate from the main
bundle. A single `<Suspense>` boundary can cover several lazy children at once. Route-level code
splitting (one chunk per page) is the highest-impact application of this technique in a real app.

### Suspense Boundary Placement Patterns — `src/pages/advanced/SuspenseBoundaries.jsx`
Where a `<Suspense>` boundary sits in the tree is a real UX decision, not just plumbing: one
shared boundary around several async children shows a single fallback until the *slowest* child
resolves; giving each child its own boundary lets each pop in independently as soon as it's ready.
Choose a shared boundary when staggered rendering would look broken (parts of one coherent card);
choose separate boundaries when the pieces are genuinely independent (a dashboard's widgets). The
demo uses `use(promise)` with artificially staggered delays (400/900/1500ms) to make the
difference directly visible.

### Animating with CSS Transitions & the View Transitions API — `src/pages/advanced/Animation.jsx`
Most React animation is just CSS reacting to a state-driven class or inline style — React's job
is only to flip a boolean; the browser's compositor does the actual animating. Animate
`transform`/`opacity` where possible (compositor-only, no layout/paint per frame). A CSS
transition needs an actual before/after state change to animate — an element mounted already in
its "final" class shows no transition. The View Transitions API
(`document.startViewTransition(updateCallback)`) lets the browser auto-capture before/after
snapshots of a DOM change and cross-fade between them; feature-detect
(`'startViewTransition' in document`) since support isn't universal.

### Testing Components with React Testing Library — `src/pages/advanced/Testing.jsx`
RTL queries the rendered DOM the way a user or screen reader would — by role, label, or visible
text (`getByRole('button', { name: /submit/i })`) — rather than by implementation details like
class names or component internals, which is what makes tests survive safe refactors.
`userEvent` (not the lower-level `fireEvent`) simulates real user interaction. RTL itself runs in
Node via a test runner (Vitest/Jest), not in the browser, so this lesson's demo simulates what a
passing test's assertions look like rather than literally executing one.

### Data Fetching Patterns — `src/pages/advanced/DataFetching.jsx`
Fetching in an effect means tracking three states together — `{ data, error, loading }` — and
guarding against race conditions: if the input (e.g. a user id) changes while a request is still
in flight, an `AbortController` cancelled in the effect's cleanup function stops a stale response
from overwriting a newer one. This pattern is best wrapped in a reusable `useFetch(url)` hook. In
production, a dedicated library (TanStack Query, SWR, RTK Query) handles caching, retries, and
deduplication far more robustly than hand-rolled effects — this lesson teaches the underlying
mechanics those libraries automate.

### Routing Deep Dive — `src/pages/advanced/RoutingDeepDive.jsx`
Beyond the app's own top-level routing (§3.4), this lesson embeds a second, working nested router
directly in the page: an index route, a `products` list, and a `products/:productId` detail route
reachable via real URLs like `/react-guide/routing/products/kb-01`. It demonstrates `useParams()`
(reading the `:productId` segment), `<Link to="…">` (relative navigation without a full reload),
and `useNavigate()` (programmatic navigation, including `navigate(-1)` to go back).

### React Expert

### Reducer + Context (Global State) — `src/pages/expert/GlobalStateReducerContext.jsx`
Combining `useReducer` (predictable transitions) with Context (tree-wide access) produces a
small, dependency-free global store: the reducer owns the logic, the Provider exposes
`{ state, dispatch }`, and a guarded custom hook (`useCart()`) is the only access point. This is
structurally the same shape that Redux and Zustand formalize — the trade-off is that raw
Context has no partial-subscription mechanism, so *every* consumer re-renders on *every* state
change, unlike a selector-based store. Reach for a real state library once that becomes a
measured problem in a large tree.

### Concurrent Features — `src/pages/expert/ConcurrentFeatures.jsx`
`useTransition()` returns `[isPending, startTransition]` — wrapping a state update in
`startTransition` marks it as interruptible/low-priority, so an urgent update (a keystroke) can
preempt it. `useDeferredValue(value)` achieves a similar goal without a separate setter: it
returns a lagging copy of a value that catches up once more urgent work finishes, useful when you
don't control where the value originates (e.g. it arrives as a prop). Neither hook makes the
underlying computation faster — they change *scheduling*. The lesson's demo deliberately
throttles a 4,000-item filter so the responsiveness difference is visible while typing.

### React 19: Actions & `use()` — `src/pages/expert/React19Features.jsx`
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

### Custom Hook Library — `src/pages/expert/CustomHookLibrary.jsx`
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

### Profiling with React DevTools — `src/pages/expert/DevToolsProfiler.jsx`
The React DevTools Profiler records a real interaction and shows a flame graph — one bar per
component that rendered in that commit, bar width = render duration, so wide bars are where time
is actually going. Its "why did this render?" panel names the specific prop/state/hook/context
that changed, which should be checked *before* reaching for `memo`/`useMemo`/`useCallback`
speculatively. This lesson's demo measures a component's real render duration with
`performance.now()` (the same primitive the Profiler itself uses internally) since the actual
browser extension can't be embedded inline.

### Capstone: Todo App — `src/pages/expert/CapstoneTodoApp.jsx`
Ties nearly everything together in one feature: `todosReducer` owns every transition (add,
toggle, remove, edit, clearCompleted); `TodosProvider` + `useTodos()` expose it via Context;
`AddTodoForm` and each `TodoRow`'s inline edit field are controlled inputs; the todo list uses
proper keys and conditional "empty state" rendering; and a `useEffect` persists the reducer's
state to `localStorage` on every change, read back via a lazy `useReducer` initializer on first
load. The active filter (`all`/`active`/`completed`) deliberately stays as **local** state in
`TodoApp` rather than in the shared store, because no other component needs it — a small but
real example of *not* over-centralizing state.

### Interview Q&A — `src/content/react-qa.js`
20 questions spanning the whole curriculum above (re-render triggers, keys, functional state
updates, the `useEffect` dependency array, Context's re-render limitation, `useReducer` vs
`useState`, `memo`/`useMemo`/`useCallback`, error boundaries, portals, React 19's `ref`-as-prop
and `useOptimistic`, `useTransition` vs `useDeferredValue`, RTL's philosophy, accessibility,
animation timing, controlled vs uncontrolled, Suspense boundary placement, profiling, and more),
rendered through the same generic `GenericTopicPage` + `QAAccordion` pipeline as every other
subject's Q&A — the only React content that isn't a hand-built interactive page, since a Q&A
list has no demo of its own to build.

---

## 5. Other subjects

Every subject below follows the pipeline described in §3.2-3.3: a single **Guide** group of
written lessons (`src/content/<subject>.js`), ordered basic → advanced within that one group
(deliberately *not* split into per-level sub-groups the way React's section is — see the note at
the end of this section), plus an **Interview Q&A** group with one click-to-reveal quiz topic.
Source material started from the user's own interview-prep notes, then each subject was
independently restructured and substantially expanded by treating the task as "have an expert
in that technology redesign the curriculum," rather than just lightly editing the original
notes. Counts are guide-topics / Q&A pairs / Mermaid diagrams.

| Subject | File | Guide topics | Q&A pairs | Diagrams | Covers |
|---|---|---|---|---|---|
| Python | `src/content/python.js` | 22 | 20 | 18 | What Python is, variables/objects, core data structures, control flow, functions & LEGB scope, comprehensions, the mutable-default-argument trap, decorators, context managers, generators/iterators, type hints & dataclasses, exceptions, modules, the GIL, asyncio, metaclasses & descriptors, memory management/GC, testing with pytest, FastAPI validation & DI, Flask, a paginated-API case study |
| JavaScript | `src/content/javascript.js` | 18 | 12 | 15 | Values/types, `var`/`let`/`const` & scoping, operators/coercion, functions, arrays/objects, closures, `this` binding, prototypal inheritance, destructuring/spread, ES modules, the event loop precisely, promises & async/await, generators/iterators, the Proxy/Reflect API, memory leaks, debounce/throttle & Web APIs, performance patterns |
| TypeScript | `src/content/typescript.js` | 17 | 12 | 15 | What TypeScript is, basic types, interfaces vs type aliases, structural typing, generics, union/intersection/discriminated unions, utility types, `unknown` vs `any`, conditional types & `infer`, mapped types, template literal types, `satisfies`, decorators, `tsconfig.json`'s consequential options |
| Git | `src/content/git.js` | 13 | 13 | 12 | What version control is, the core add/commit/status workflow, basic branching, how Git models history (three trees), `.gitignore`/stashing/tags, merging vs rebasing, undoing things, remote collaboration, Git internals (objects/refs/packfiles), interactive rebase & history rewriting, hooks, submodules vs monorepos, debugging with bisect/blame |
| LLD | `src/content/lld.js` | 17 | 30 | 34 (28 classDiagrams) | What LLD is, OOP fundamentals, UML notation literacy, interfaces vs abstract classes, SOLID (each principle with a violation/fix classDiagram), the LLD interview process, creational/structural/behavioral design patterns (each with a classDiagram), concurrency patterns, anti-patterns, five full case studies (Parking Lot, Rate Limiter, Elevator, Splitwise, BookMyShow) each with a classDiagram |
| HLD | `src/content/hld.js` | 19 | 30 | 18 | HLD vs LLD, the client-server model, single-server starting point, vertical vs horizontal scaling, what HLD interviews test, the repeatable framework, interview time-budgeting, estimation, core building blocks, CDNs & edge caching, five case studies (URL Shortener, News Feed, Chat, Ride-Sharing Dispatch, Video Streaming), consistency/availability tradeoffs, a distributed rate limiter, failure modes & observability |
| System Design Patterns | `src/content/system-design-patterns.js` | 15 | 31 | 14 | What a distributed system is, the CAP theorem, basic sharding/partitioning, consistent hashing, replication strategies, database storage engines, Paxos/Raft consensus, load balancing, caching, monolith vs microservices vs serverless, event sourcing/CQRS, idempotency & delivery semantics, 2PC/Saga, an e-commerce case study |
| Authentication & Authorization | `src/content/auth.js` | 18 | 26 | 18 | Identity fundamentals, a plain login-flow walkthrough, password hashing, MFA, passwordless/WebAuthn passkeys, sessions vs JWTs (structure + security pitfalls), rate limiting & brute-force defenses, CSRF/XSS/cookies, OAuth 2.0 & PKCE, OIDC, SSO/SAML, RBAC/ABAC/ReBAC, API auth patterns, distributed authorization, a multi-tenant SaaS case study |
| LangChain | `src/content/langchain.js` | 8 | 8 | 6 | The chain abstraction as a mental model, core building blocks (prompts/models/parsers/retrievers), LCEL in practice, LCEL composition patterns, memory/conversation history, tool/function-calling integration, classic ReAct agents, where LangChain earns criticism |
| LangGraph | `src/content/langgraph.js` | 9 | 11 | 8 | The graph mental model (nodes/edges/state), why LangGraph exists beyond LangChain's agents, StateGraph core primitives, the Model Context Protocol (MCP), human-in-the-loop patterns, multi-agent/supervisor patterns, a hand-rolled agentic tool-use loop, agent architectures beyond ReAct |
| RAG | `src/content/rag.js` | 13 | 13 | 9 | Vector embeddings & semantic similarity, the basic RAG loop, LLM fundamentals, chunking, embeddings & vector search, vector index tradeoffs (HNSW vs IVF), hybrid search & re-ranking, RAG evaluation, RAG failure modes, advanced/agentic RAG patterns, fine-tuning vs RAG vs prompt engineering, an enterprise-assistant case study |
| AWS | `src/content/aws.js` | 26 | 26 | 31 | Cloud computing & AWS basics, global infrastructure, shared responsibility, IAM, EC2, Auto Scaling/ELB, Lambda, ECS/EKS/Fargate, S3, EBS/EFS/S3 comparison, RDS/Aurora, DynamoDB, ElastiCache, VPC, security groups vs NACLs, Route 53/CloudFront, SQS/SNS/EventBridge/Kinesis/Step Functions, the Well-Architected Framework, HA/DR, IaC, cost optimization, KMS/Secrets, CloudWatch/CloudTrail/X-Ray, Organizations, Bedrock/SageMaker, a three-tier case study |
| Azure | `src/content/azure.js` | 24 | 21 | 24+ | Azure & the resource model, ARM, Entra ID, VMs, App Service, Functions, AKS/Container Apps, Storage redundancy, Azure SQL, Cosmos DB consistency levels, VNets, load balancer/App Gateway/Front Door, the Well-Architected Framework, Bicep/ARM IaC, cost management, Key Vault, Monitor/Log Analytics, RBAC vs Entra ID identity, governance/landing zones, a three-tier case study |
| Java | `src/content/java.js` | 24 | 24 | 14 | WORA & the JVM/bytecode model, primitives/autoboxing, OOP's four pillars, interfaces vs abstract classes, `equals`/`hashCode`/`toString`, generics & type erasure, checked vs unchecked exceptions, the Collections Framework, lambdas & the Streams API, `Optional`, records & sealed classes, JVM memory & garbage collection, class loading, the Java Memory Model & `volatile`, threads & `java.util.concurrent`, deadlock, JUnit 5 & Mockito, Maven vs Gradle |
| DSA | `src/content/dsa.js` | 28 | 31 | 25 | Algorithmic complexity & Big-O/Θ/Ω precisely, space-time tradeoffs, arrays vs linked lists, stacks/queues, hashing, two-pointer/sliding-window, recursion, binary trees & traversal, BSTs & self-balancing trees, heaps, tries, graph representations, BFS/DFS, Dijkstra's, MST/Union-Find, topological sort, merge/quicksort, counting/radix sort, binary search variants, dynamic programming (fundamentals + framework), greedy algorithms, backtracking, bit manipulation, an interview-approach capstone |

**Totals: 16 subjects, 32 groups, 320 topics, 329 Q&A pairs, 248+ Mermaid diagrams.**

Most of these lessons include a live-rendered **Mermaid diagram** — architecture flowcharts,
sequence diagrams, the Raft leader-election state machine, consistent-hashing rings, UML class
diagrams for every LLD design pattern and case study, even the odd `pie` chart for an interview
grading rubric — see §3.3 for how `Mermaid.jsx` renders them and why it's lazy-loaded.

**Why one group instead of Basics/Intermediate/Advanced sub-drawers, unlike React**: React's
four groups exist because each level's lessons are genuinely different *pages* (different demo
components). A content-driven subject's lessons are just entries in one array — splitting them
into separate collapsible groups would only add clicks without adding real structure, so each
subject instead relies on **topic order** within its single Guide group to carry the
basic-to-advanced narrative, the same way a well-organized book uses chapter order instead of
separate volumes.

---

## 6. Design decisions

- **React 19, not an older version.** The project installs whatever `npm create vite@latest`
  currently scaffolds (React 19 at the time of writing), which made it possible to cover
  `useActionState`, `useOptimistic`, and `use()` as *working* demos rather than descriptions of
  future API. If you're learning React 18, everything except the "React 19: Actions & `use()`"
  lesson applies unchanged.
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

## 7. Extending the app

**To add a new React lesson** (say, "Server Components") — the hand-built, interactive kind:

1. Create `src/pages/<level>/YourLesson.jsx` (the folder is just organizational, by difficulty —
   `basics`/`intermediate`/`advanced`/`expert` — it no longer maps to a sidebar group), following
   an existing lesson as a template — export a component that renders
   `<TopicPage groupId="react-guide" topicId="your-lesson" level="advanced" ...>` (`level` still
   picks the page's difficulty badge).
2. Add `{ id: 'your-lesson', title: 'Your Lesson' }` to the `react-guide` group's `topics` array
   in `src/data/topics.js`, positioned where it belongs in the basic-to-advanced order.
3. Add `<Route path="/react-guide/your-lesson" element={<YourLesson />} />` in `src/App.jsx`.

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

## 8. Verifying the app

This project was verified, not just written:

- `npm run build` — a clean production build (Vite/Rollup) with zero errors, confirming every
  file compiles, that `HeavyPanel` genuinely code-splits into its own chunk, and that `Mermaid`
  does too (so its sizeable dependency tree only loads on pages with a diagram).
- `npm run lint` (`oxlint`) — the only warnings remaining are intentional, pedagogical exceptions
  in the React lessons (e.g. `RefsDom.jsx` and `CustomHookLibrary.jsx`'s `usePrevious`
  deliberately read a ref during render *because that's the concept being taught*;
  `DataFetching.jsx` calls `setState` inside an effect because that's the canonical
  data-fetching-in-an-effect pattern).
- A programmatic check that every group id is unique across all 16 sections and every
  `groupId/topicId` pair is unique (320 topics, zero collisions) — required for the flat
  `/:groupId/:topicId` routing scheme to work with no subject segment in the URL.
- Manual, in-browser testing of the trickiest interactive demos (Error Boundaries actually
  catching and resetting, Portals actually escaping a clipped container, nested routing actually
  reading URL params, the Capstone app actually persisting to `localStorage`, React 19's
  `useOptimistic` actually reconciling, mermaid diagrams actually rendering across multiple
  diagram types — flowchart, sequence, and state diagrams). This process caught and fixed two
  real bugs: the `useOptimistic` demo originally called its setter outside a transition, which
  React 19 rejects at runtime (in "React 19: Actions & `use()`"); and the inline-markdown renderer initially didn't support
  `*italic*` text, leaving literal asterisks in some content-driven lessons.
- The 13 content-driven subjects beyond Git and Authentication & Authorization were drafted by
  parallel agents against a shared schema and the same two worked examples (`git.js`, `auth.js`),
  then spot-checked in-browser across subjects for rendering correctness (tables, code blocks,
  diagrams, Q&A accordions) and checked programmatically for structural/id correctness.
- **Every one of the app's 257 Mermaid diagrams is parsed programmatically**, not just eyeballed
  — a small Node script imports the `mermaid` package directly and calls `mermaid.parse()` on
  every diagram string extracted from every `src/content/*.js` file, since a diagram that visually
  renders fine 99% of the time can still contain a genuine grammar error that only a real parse
  catches. This caught and fixed real bugs invisible to a casual read: a plain `[Label]` node
  containing unquoted parentheses (`Data Center(s)`) that Mermaid's flowchart grammar
  misinterprets as a shape delimiter; a `Note over X: ...` line broken across two physical lines
  in the source (Mermaid sequence-diagram notes must be single-line); a semicolon inside a
  `Note over X:` line, which Mermaid treats as a statement separator; and, most subtly, a
  sequence-diagram participant literally named `Loop` — `loop` is a reserved keyword in Mermaid's
  sequence-diagram grammar (it opens a `loop ... end` block), so naming a participant that
  collides with it silently breaks parsing even though nothing about it looks wrong to a reader.

## 9. Further resources

- [react.dev](https://react.dev) — the official docs; every React concept in this app maps to a
  page there, usually linked to directly from within each lesson.
- [react.dev/reference/react](https://react.dev/reference/react) — the hooks API reference used
  throughout the Intermediate/Advanced/Expert sections.
- [reactrouter.com](https://reactrouter.com) — full `react-router-dom` API used in the Routing Deep Dive lesson.
- [TanStack Query](https://tanstack.com/query) — the production-grade evolution of the manual
  `useFetch` pattern in the Data Fetching Patterns lesson.
- [mermaid.js.org](https://mermaid.js.org) — the diagram syntax used throughout the
  content-driven subjects' `mermaid` blocks.
- [Refactoring.Guru](https://refactoring.guru/design-patterns) — a deeper reference for every
  design pattern named in the LLD section.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org) — production-grade depth beyond
  the Authentication & Authorization section's interview-level coverage.
