// Central navigation manifest for the whole app.
//
// The menu is a 3-level tree: sections -> groups -> topics.
//   - A "section" is a top-level subject (e.g. "React", "Python") and
//     renders as a collapsible drawer in the sidebar.
//   - A "group" is a category within that subject (Basics/Intermediate/...
//     for React, or "Guide"/"Interview Q&A" for the content-driven
//     subjects) and renders as a collapsible sub-menu.
//   - A "topic" is a single lesson and becomes a route at
//     /:groupId/:topicId.
//
// React's lessons are hand-built interactive pages (see App.jsx's explicit
// routes), so their topic entries here only need { id, title } for
// navigation. Every other subject is content-driven: its topic entries also
// carry { summary, keyPoints, blocks } (an article) or { summary, qa } (a
// Q&A list), rendered generically by GenericTopicPage — see
// src/content/*.js and findContentTopic below.
//
// To add a whole new subject, create src/content/<subject>.js exporting a
// { id, label, icon, groups } section object (see src/content/git.js for
// the shape to follow), import it below, and add it to this array — the
// sidebar, routing, and prev/next pager all derive from this one array, so
// nothing else needs to change.
import { pythonSection } from '../content/python.js'
import { javascriptSection } from '../content/javascript.js'
import { typescriptSection } from '../content/typescript.js'
import { gitSection } from '../content/git.js'
import { lldSection } from '../content/lld.js'
import { hldSection } from '../content/hld.js'
import { systemDesignPatternsSection } from '../content/system-design-patterns.js'
import { authSection } from '../content/auth.js'
import { langchainSection } from '../content/langchain.js'
import { langgraphSection } from '../content/langgraph.js'
import { ragSection } from '../content/rag.js'

export const menuSections = [
  {
    id: 'react',
    label: 'React',
    icon: '⚛️',
    groups: [
      {
        id: 'basics',
        label: 'Basics',
        topics: [
          { id: 'jsx', title: 'JSX & Rendering' },
          { id: 'components-props', title: 'Components & Props' },
          { id: 'state', title: 'State with useState' },
          { id: 'events', title: 'Event Handling' },
          { id: 'conditional-rendering', title: 'Conditional Rendering' },
          { id: 'lists-keys', title: 'Lists & Keys' },
          { id: 'forms', title: 'Forms & Controlled Inputs' },
        ],
      },
      {
        id: 'intermediate',
        label: 'Intermediate',
        topics: [
          { id: 'effects', title: 'useEffect & Lifecycle' },
          { id: 'refs', title: 'useRef & the DOM' },
          { id: 'context', title: 'Context API' },
          { id: 'reducer', title: 'useReducer' },
          { id: 'custom-hooks', title: 'Custom Hooks' },
          { id: 'fragments', title: 'Fragments & Strict Mode' },
        ],
      },
      {
        id: 'advanced',
        label: 'Advanced',
        topics: [
          { id: 'performance', title: 'memo, useMemo & useCallback' },
          { id: 'hoc', title: 'Higher-Order Components' },
          { id: 'render-props', title: 'Render Props' },
          { id: 'error-boundaries', title: 'Error Boundaries' },
          { id: 'portals', title: 'Portals' },
          { id: 'forward-ref', title: 'forwardRef & useImperativeHandle' },
          { id: 'code-splitting', title: 'Lazy Loading & Suspense' },
          { id: 'data-fetching', title: 'Data Fetching Patterns' },
          { id: 'routing', title: 'Routing Deep Dive' },
        ],
      },
      {
        id: 'expert',
        label: 'Expert',
        topics: [
          { id: 'global-state', title: 'Reducer + Context (Global State)' },
          { id: 'concurrent', title: 'Concurrent Features' },
          { id: 'react19', title: 'React 19: Actions & use()' },
          { id: 'hook-library', title: 'Custom Hook Library' },
          { id: 'capstone', title: 'Capstone: Todo App' },
        ],
      },
    ],
  },
  pythonSection,
  javascriptSection,
  typescriptSection,
  gitSection,
  lldSection,
  hldSection,
  systemDesignPatternsSection,
  authSection,
  langchainSection,
  langgraphSection,
  ragSection,
]

// Flattened, backward-compatible view: one entry per group, tagged with
// which section it belongs to. Existing pages (Home, routing) key off this.
export const topicGroups = menuSections.flatMap((section) =>
  section.groups.map((group) => ({
    ...group,
    sectionId: section.id,
    sectionLabel: section.label,
  }))
)

export const allTopics = topicGroups.flatMap((group) =>
  group.topics.map((topic) => ({
    ...topic,
    groupId: group.id,
    groupLabel: group.label,
    sectionId: group.sectionId,
    sectionLabel: group.sectionLabel,
  }))
)

export function findTopic(groupId, topicId) {
  return allTopics.find((t) => t.groupId === groupId && t.id === topicId)
}

export function getAdjacentTopics(groupId, topicId) {
  const index = allTopics.findIndex((t) => t.groupId === groupId && t.id === topicId)
  return {
    prev: index > 0 ? allTopics[index - 1] : null,
    next: index >= 0 && index < allTopics.length - 1 ? allTopics[index + 1] : null,
  }
}

// Full lookup (including blocks/qa) for GenericTopicPage — walks the tree
// directly rather than the flattened allTopics view, since it also needs
// the owning group/section objects (for labels shown on the page).
export function findContentTopic(groupId, topicId) {
  for (const section of menuSections) {
    const group = section.groups.find((g) => g.id === groupId)
    if (!group) continue
    const topic = group.topics.find((t) => t.id === topicId)
    if (!topic) continue
    return { topic, group, section }
  }
  return null
}
