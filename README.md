# Learning Hub

[![Deploy to GitHub Pages](https://github.com/vicky124/react-learning-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/vicky124/react-learning-app/actions/workflows/deploy.yml)

**🔗 Live demo: [vicky124.github.io/react-learning-app](https://vicky124.github.io/react-learning-app/)**

An interactive, single-page app for learning React live and studying for technical interviews
across a growing list of subjects — Python, JavaScript, TypeScript, Git, Low-Level Design,
High-Level Design, System Design Patterns, Authentication & Authorization, LangChain, LangGraph,
and RAG. React gets **live, working demos** you can click and type into; every other subject
gets a thorough written guide (with rendered diagrams) plus a dedicated, self-quiz
**Interview Q&A** section. Built with React 19, Vite, and React Router.

For the full written guide to how this app itself is built — the architecture, the content
pipeline, every React concept explained — see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint     # run oxlint
```

## What's inside

The sidebar is a collapsible drawer per subject, each with its own collapsible sub-drawers
(mobile: an overlay; desktop: a persistent column you can shrink with the ☰ button).

**React** — 25 hand-built interactive lessons across four levels:

| Level        | Topics |
|--------------|--------|
| Basics       | JSX & Rendering, Components & Props, State (`useState`), Event Handling, Conditional Rendering, Lists & Keys, Forms & Controlled Inputs |
| Intermediate | `useEffect` & Lifecycle, `useRef` & the DOM, Context API, `useReducer`, Custom Hooks, Fragments & Strict Mode |
| Advanced     | `memo`/`useMemo`/`useCallback`, Higher-Order Components, Render Props, Error Boundaries, Portals, `forwardRef` & `useImperativeHandle`, Lazy Loading & Suspense, Data Fetching Patterns, Routing Deep Dive |
| Expert       | Reducer + Context (Global State), Concurrent Features (`useTransition`/`useDeferredValue`), React 19 Actions & `use()`, Custom Hook Library, Capstone Todo App |

Every React lesson follows the same shape: a short explanation, a **Key concepts** list, one or
more **live demos** you can actually click/type into, the demo's source code in a copyable code
block, and a callout with a tip, warning, or common pitfall.

**Every other subject** — Python, JavaScript, TypeScript, Git, LLD, HLD, System Design Patterns,
Authentication & Authorization, LangChain, LangGraph, and RAG — follows a **Guide** +
**Interview Q&A** shape instead: a written lesson per topic (with tables, code samples, and
Mermaid diagrams where the source material has them) and a click-to-reveal Q&A accordion you can
quiz yourself against. This content was adapted from the user's own interview-prep notes.

## Project structure

```
src/
  main.jsx                # React root, mounts <App /> in <StrictMode>
  App.jsx                 # BrowserRouter + explicit React routes + one generic fallback route
  index.css                # global styles / design tokens (single stylesheet, no CSS framework)
  data/
    topics.js              # the menuSections tree: single source of truth for sidebar + routes + prev/next order
  content/
    git.js, auth.js, python.js, javascript.js, typescript.js,   # one file per non-React subject —
    lld.js, hld.js, system-design-patterns.js,                  # each exports a { id, label, icon, groups }
    langchain.js, langgraph.js, rag.js                          # "section" object plugged into topics.js
  components/
    Layout.jsx              # topbar + sidebar + <Outlet /> shell; owns mobile-drawer + desktop-collapse state
    Sidebar.jsx              # nested collapsible drawers rendered from data/topics.js
    TopicPage.jsx            # standard lesson shell (badge, title, summary, key points, content slot, pager)
    ContentBlocks.jsx         # renders a content topic's structured "blocks" (heading/p/list/code/table/mermaid/callout)
    QAAccordion.jsx            # click-to-reveal Q&A list
    Markdown.jsx                # tiny inline-markdown renderer (**bold**, *italic*, `code`, [link](url))
    Mermaid.jsx                  # renders one diagram from its text definition (lazy-loaded, own chunk)
    CodeBlock.jsx                 # copyable code sample display
    Callout.jsx                    # tip / warning / pitfall / note boxes
    ErrorBoundary.jsx               # class-based error boundary used both by the app shell and its own lesson
  pages/
    Home.jsx, NotFound.jsx
    GenericTopicPage.jsx     # the one page component that renders every non-React lesson
    basics/        7 React lesson files
    intermediate/   6 React lesson files
    advanced/       9 React lesson files (+ HeavyPanel.jsx, a lazy-loaded demo target)
    expert/         5 React lesson files
```

React's lessons are self-contained: the demo component(s) and the code sample shown to the
reader live in the same file, so what you read in the code block is what's actually running.
Every other subject's lessons are plain data (see `src/content/*.js`) rendered generically —
adding a new lesson there means editing data, not writing a new component.

## How routing maps to lessons

`src/data/topics.js` assembles one `menuSections` array (React's four groups defined inline,
every other subject imported as a ready-made section from `src/content/`). `src/App.jsx`
declares one explicit `<Route>` per React lesson, plus a single
`<Route path="/:groupId/:topicId">` that serves every other subject via `GenericTopicPage`. The
sidebar, prev/next pager, and URLs all stay in sync automatically because they all read from the
same array — see [DOCUMENTATION.md §3](./DOCUMENTATION.md) and §10 ("Extending the app") for the
exact steps to add a new lesson or a whole new subject.

## Tech stack

- **React 19** — including newer APIs covered in the Expert section (`useActionState`,
  `useOptimistic`, `use()`)
- **React Router v7** (`react-router-dom`) for client-side routing
- **Mermaid** for diagrams in the content-driven subjects, lazy-loaded so its bundle only loads
  on pages that actually render one
- **Vite** for the dev server and build
- Plain CSS (`src/index.css`) — no UI framework, so every visual element is easy to read as
  plain React + CSS

## Notes on the demos

- The **Data Fetching** lesson calls the public `jsonplaceholder.typicode.com` API — it needs
  network access to show real data (it degrades to an error state gracefully if offline).
- The **Custom Hook Library** and **Capstone Todo App** lessons persist to `localStorage` in
  your browser — reload the page and your data is still there.
- The **Lazy Loading & Suspense** lesson's `HeavyPanel` component is genuinely code-split; check
  your browser's Network tab to see its chunk load on demand.
- The desktop sidebar's collapsed/expanded state also persists to `localStorage`.
