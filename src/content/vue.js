export const vueSection = {
  id: 'vue',
  label: 'Vue.js',
  icon: '💚',
  groups: [
    {
      id: 'vue-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-vue',
          title: 'What Vue Is: the Progressive Framework',
          summary:
            'Vue is a JavaScript framework for building user interfaces. Its main idea is that you describe what the screen should look like for the current data, and Vue keeps the real page in sync whenever that data changes.',
          keyPoints: [
            'A **framework** is a ready-made structure for building apps. Vue calls itself **progressive**: you can sprinkle it into one page of an old website, or use it to build a full single-page application (SPA) with routing and a store.',
            'Vue is **declarative**: you write a template that says "show the user name here", not step-by-step DOM instructions like "find the element, then set its text".',
            'Vue 3 (the current major version) offers two ways to write components: the **Options API** (data, methods, computed objects) and the **Composition API** (plain functions such as `ref` and `computed`). New code usually uses the Composition API with `<script setup>`.',
            'The official ecosystem is small and consistent: Vue Router (navigation), Pinia (shared state), Vite (build tool), Vitest (testing), and Vue DevTools (debugging).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine a spreadsheet. When you change a number in cell A1, every cell that uses A1 in a formula updates by itself. You never write "now go and update B7". Vue brings that idea to web pages: you keep your data in **reactive** variables (variables Vue watches), write the page as a template that uses them, and Vue automatically updates exactly the parts of the page that depend on whatever changed.',
            },
            {
              type: 'heading',
              text: 'A first, complete Vue component',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'Counter.vue (a complete single-file component)',
              code: `<script setup>
import { ref } from 'vue'

// "ref" makes a reactive variable: Vue watches it for changes.
const count = ref(0)

function increment() {
  count.value++          // in JavaScript you use .value
}
</script>

<template>
  <!-- In the template, {{ count }} needs no .value -->
  <button @click="increment">You clicked {{ count }} times</button>
</template>

<style scoped>
button { padding: 0.5rem 1rem; }
</style>`,
            },
            {
              type: 'p',
              text: 'Notice what is missing: there is no `document.querySelector`, no `element.textContent = ...`. You only change `count`; Vue works out that the button text must be redrawn. This is the whole mental model of Vue, and everything else in this guide is built on top of it.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    S["Reactive state<br/>count = 0"] -->|"template reads it"| T["Template<br/>button text"]
    T -->|"Vue renders"| D["Real DOM<br/>what the user sees"]
    D -->|"user clicks"| E["Event handler<br/>increment()"]
    E -->|"changes"| S`,
            },
            {
              type: 'heading',
              text: 'What "progressive" really means',
            },
            {
              type: 'table',
              headers: ['Level', 'What you use', 'Typical situation'],
              rows: [
                ['1. Drop-in', 'One `<script>` tag from a CDN, no build step', 'Add a small interactive widget (a filter, a modal) to an existing server-rendered page'],
                ['2. Build setup', 'Vite + single-file components (`.vue` files)', 'A real front-end project with many components'],
                ['3. Full SPA', 'Plus Vue Router and Pinia', 'A web application with many screens and shared state'],
                ['4. Full-stack', 'Nuxt (a framework built on Vue) for server rendering and file-based routing', 'SEO-sensitive sites, server-side rendering (SSR), full-stack apps'],
              ],
            },
            {
              type: 'code',
              language: 'html',
              title: 'Level 1: no build tools, just a script tag',
              code: `<div id="app">{{ message }}</div>

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
  const { createApp, ref } = Vue
  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return { message }
    },
  }).mount('#app')
</script>`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Vue 2 reached end of life on December 31, 2023. Anything written for Vue 2 (`new Vue({...})`, `Vue.set`, filters, `$listeners`) is legacy. This guide covers Vue 3 only, and explains the Options API for context because you will meet it in many existing codebases.',
            },
          ],
        },
        {
          id: 'project-setup-vite',
          title: 'Creating a Project with Vite (create-vue)',
          summary:
            'The official way to start a Vue project is `npm create vue@latest`. It uses Vite, a very fast development server and build tool, and asks which extras (TypeScript, Router, Pinia, tests) you want.',
          keyPoints: [
            '**Vite** (French for "quick") is the tool that runs your dev server and builds your production bundle. In development it serves your files as native ES modules so startup is nearly instant.',
            '`npm create vue@latest` runs **create-vue**, the official scaffolding tool. It asks questions and generates a ready project.',
            'Key files: `index.html` (the entry page), `src/main.js` (creates and mounts the app), `src/App.vue` (the root component), `vite.config.js` (build settings).',
            'Common scripts: `npm run dev` (development server with hot reload), `npm run build` (optimized production files in `dist/`), `npm run preview` (try the built site locally).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A browser cannot read `.vue` files directly, and the code you write (modern JavaScript, TypeScript, SCSS) often needs converting. A **build tool** does that conversion. Vite is the build tool recommended by the Vue team, and it was in fact created by Evan You, the author of Vue. During development it only transforms the files the browser actually asks for, which is why the server starts in under a second even in big projects. **Hot Module Replacement (HMR)** means that when you save a file, only the changed component is swapped in the running page, so you keep your on-screen state.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating and running a project',
              code: `npm create vue@latest

# The wizard asks (you pick yes/no with arrow keys):
#   Project name:             shop-app
#   Add TypeScript?           Yes
#   Add JSX support?          No
#   Add Vue Router?           Yes
#   Add Pinia?                Yes
#   Add Vitest?               Yes
#   Add ESLint / Prettier?    Yes

cd shop-app
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve dist/ locally to check it`,
            },
            {
              type: 'code',
              language: 'text',
              title: 'what the generated project looks like',
              code: `shop-app/
  index.html            # the single HTML page; contains <div id="app">
  vite.config.js        # Vite settings (plugins, aliases, proxy)
  package.json
  src/
    main.js             # creates the app and mounts it
    App.vue             # root component
    router/index.js     # route table (if you chose Router)
    stores/counter.js   # example Pinia store (if you chose Pinia)
    views/              # one component per screen (HomeView.vue ...)
    components/         # reusable pieces (Button, Card ...)
    assets/             # css, images`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'src/main.js: where the app starts',
              code: `import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)   // App.vue is the root component

app.use(createPinia())       // plugins are installed with app.use()
app.use(router)

app.mount('#app')            // render into <div id="app"> in index.html`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    I["index.html<br/>div id=app"] --> M["main.js<br/>createApp(App)"]
    M --> P["app.use(router)<br/>app.use(pinia)"]
    P --> A["App.vue<br/>root component"]
    A --> V["RouterView<br/>current page"]
    V --> C["Child components"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'vite.config.js with an alias and an API proxy',
              code: `import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],                       // teaches Vite to read .vue files
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      // calls to /api/... go to your backend during development
      '/api': 'http://localhost:3000',
    },
  },
})`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Environment variables that the browser may read must start with `VITE_` (for example `VITE_API_URL` in a `.env` file) and are read with `import.meta.env.VITE_API_URL`. Anything without the prefix is intentionally hidden from client code, so secrets do not leak into your bundle. Never put a real secret in a `VITE_` variable: everything in the bundle is visible to users.',
            },
          ],
        },
        {
          id: 'single-file-components',
          title: 'Single-File Components (.vue files)',
          summary:
            'A single-file component (SFC) keeps a component\'s template, logic and styles together in one `.vue` file, split into `<template>`, `<script>` and `<style>` sections.',
          keyPoints: [
            'An SFC has up to three sections: `<template>` (HTML-like markup), `<script setup>` (JavaScript or TypeScript logic) and `<style>` (CSS).',
            '`<script setup>` is a compile-time shortcut: everything you declare at its top level (variables, functions, imports) is automatically available in the template, with no `return` and no `export default`.',
            '`<style scoped>` adds a unique attribute to the component\'s elements so its CSS cannot leak out and affect other components.',
            'A component is **not** reused by copying the file: you import it and use it as a custom HTML tag, e.g. `<UserCard />`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Older front-end code split a widget across three files: an HTML file, a CSS file and a JS file, and you had to jump between them. Vue groups by **what the piece is**, not by file type. One `.vue` file is one self-contained building block. Think of it like a LEGO brick that carries its own shape (template), behaviour (script) and colour (style).',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    F["UserCard.vue<br/>one single-file component"] --> T["template<br/>what it looks like"]
    F --> S["script setup<br/>state, props, logic"]
    F --> ST["style scoped<br/>CSS for this component only"]
    S -->|"variables and functions"| T
    B["Vite plus vue plugin<br/>at build time"] -->|"compiles into"| J["Plain JavaScript and CSS<br/>for the browser"]
    F --> B`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'UserCard.vue',
              code: `<script setup>
import { computed } from 'vue'

// defineProps declares what the parent may pass in.
const props = defineProps({
  name: { type: String, required: true },
  online: { type: Boolean, default: false },
})

const initials = computed(() =>
  props.name.split(' ').map(part => part[0]).join('').toUpperCase()
)
</script>

<template>
  <div class="card">
    <span class="avatar">{{ initials }}</span>
    <strong>{{ name }}</strong>
    <span v-if="online" class="dot">online</span>
  </div>
</template>

<style scoped>
.card { display: flex; gap: 0.5rem; align-items: center; }
.avatar { background: #42b883; color: white; border-radius: 50%; padding: 0.4rem; }
.dot { color: green; font-size: 0.8rem; }
</style>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'using the component in a parent (App.vue)',
              code: `<script setup>
import UserCard from './components/UserCard.vue'
</script>

<template>
  <UserCard name="Ada Lovelace" online />
  <UserCard name="Alan Turing" />
</template>`,
            },
            {
              type: 'heading',
              text: 'Options API vs Composition API: the same component both ways',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'Options API (older style, still fully supported)',
              code: `<script>
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    double() { return this.count * 2 }
  },
  methods: {
    increment() { this.count++ }
  },
  mounted() {
    console.log('ready')
  },
}
</script>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'Composition API with script setup (recommended)',
              code: `<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
function increment() { count.value++ }
onMounted(() => console.log('ready'))
</script>`,
            },
            {
              type: 'table',
              headers: ['', 'Options API', 'Composition API'],
              rows: [
                ['Organisation', 'Grouped by option type (data, methods, computed...)', 'Grouped by feature: related state and functions sit together'],
                ['Reusing logic', 'Mixins (hard to trace where things come from) or renderless components', 'Composables: ordinary functions you import'],
                ['`this`', 'Everything lives on `this`', 'No `this`; plain variables and functions'],
                ['TypeScript', 'Works, but `this` typing is complex', 'Natural: it is just typed variables and functions'],
                ['Learning curve', 'Gentle for beginners', 'Needs understanding of `ref` and `.value`, but scales better'],
                ['Best for', 'Small components, teams used to Vue 2', 'New projects, large components, shared logic'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Both APIs run on the same engine, and you can even mix them in one component. You do not need to rewrite old code. A good rule: write new components with `<script setup>`, leave old working components alone.',
            },
          ],
        },
        {
          id: 'template-syntax-directives',
          title: 'Template Syntax and Directives',
          summary:
            'A Vue template is HTML with extras: `{{ }}` shows a value, and **directives** (attributes starting with `v-`) tell Vue to bind data, run code on events, show or hide elements, and repeat elements.',
          keyPoints: [
            '`{{ expression }}` (mustache syntax) prints the result of one JavaScript expression as text. It is escaped, so it is safe from HTML injection.',
            '`v-bind` (shorthand `:`) sets an HTML attribute from data: `:src="imageUrl"`. `v-on` (shorthand `@`) listens to events: `@click="save"`.',
            '`v-if` / `v-else-if` / `v-else` add or remove elements; `v-show` only toggles CSS `display`. `v-for` repeats an element for each item and **needs a `:key`**.',
            '`v-html` renders raw HTML and is dangerous with untrusted content (XSS: cross-site scripting, where an attacker injects a script into your page).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A **directive** is a special attribute that gives an HTML element a new power. Writing `v-if="loggedIn"` is like telling the element: "only exist if loggedIn is true". The names always start with `v-` so you can spot them quickly. Inside the quotes you write a normal JavaScript **expression** (anything that produces a value, such as `count + 1` or `user.name.toUpperCase()`), but not statements such as `if (...)` or `let x = 1`.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'the directives you will use every day',
              code: `<script setup>
import { ref } from 'vue'

const title = ref('Shopping list')
const imageUrl = ref('/logo.png')
const isLoggedIn = ref(true)
const items = ref([
  { id: 1, name: 'Milk', bought: false },
  { id: 2, name: 'Eggs', bought: true },
  { id: 3, name: 'Bread', bought: false },
])
function toggle(item) { item.bought = !item.bought }
</script>

<template>
  <!-- 1. text interpolation -->
  <h1>{{ title.toUpperCase() }}</h1>

  <!-- 2. v-bind: set an attribute from data (":" is the shorthand) -->
  <img :src="imageUrl" :alt="title" />

  <!-- 3. v-if / v-else: really add or remove elements -->
  <p v-if="isLoggedIn">Welcome back!</p>
  <p v-else>Please log in.</p>

  <!-- 4. v-show: element stays in the DOM, only display:none changes -->
  <p v-show="isLoggedIn">Shown with CSS toggling</p>

  <!-- 5. v-for with a stable key, and v-on ("@" is the shorthand) -->
  <ul>
    <li v-for="item in items" :key="item.id" @click="toggle(item)">
      <s v-if="item.bought">{{ item.name }}</s>
      <span v-else>{{ item.name }}</span>
    </li>
  </ul>
</template>`,
            },
            {
              type: 'heading',
              text: 'v-if versus v-show',
            },
            {
              type: 'table',
              headers: ['', 'v-if', 'v-show'],
              rows: [
                ['What it does', 'Creates or destroys the element (and its child components)', 'Always renders the element, toggles `display: none`'],
                ['Cost to switch', 'Higher: mounts and unmounts every time', 'Very low: one CSS change'],
                ['Cost at first render', 'Lower if the condition starts false (nothing is built)', 'Higher: everything is built even if hidden'],
                ['Works with `v-else`', 'Yes', 'No'],
                ['Use when', 'The condition rarely changes, or the content is expensive or should reset', 'You toggle often (tabs, dropdowns, tooltips)'],
              ],
            },
            {
              type: 'heading',
              text: 'Why v-for needs :key',
            },
            {
              type: 'p',
              text: 'When a list changes, Vue must decide which old row matches which new row. The `key` is the row\'s **identity**, like a name tag. With a stable key (`item.id`), Vue moves existing rows and keeps their internal state (typed text, focus, a child component\'s data). Without a good key, Vue reuses rows by position, so inserting at the top makes every row shift and typed input can end up on the wrong item.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'common mistake with keys, and the fix',
              code: `<!-- WRONG: the index is the position, not the identity -->
<li v-for="(todo, index) in todos" :key="index">
  <input v-model="todo.draft" />
</li>

<!-- RIGHT: a unique, stable id from your data -->
<li v-for="todo in todos" :key="todo.id">
  <input v-model="todo.draft" />
</li>

<!-- v-for also works on objects and numbers -->
<span v-for="(value, key) in user" :key="key">{{ key }}: {{ value }}</span>
<span v-for="n in 5" :key="n">{{ n }}</span>`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A{"v-if condition"} -->|"true"| B["Element is created<br/>and inserted in the DOM"]
    A -->|"false"| C["Element does not exist<br/>(a comment placeholder remains)"]
    D{"v-show condition"} -->|"true"| E["Element visible"]
    D -->|"false"| F["Element exists with<br/>style display none"]`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do not put `v-if` and `v-for` on the same element. In Vue 3 `v-if` is evaluated first, so it cannot see the loop variable and you get an error. Filter the list in a `computed` property instead (`items.filter(i => i.visible)`) and loop over that, or wrap the loop in a `<template v-for>` and put `v-if` on the inner element.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never use `v-html` with text a user typed or that came from an unknown source. It inserts raw HTML, so a string like `<img src=x onerror=alert(1)>` would run script in your page. Plain `{{ }}` is always safe because it escapes the text.',
            },
          ],
        },
        {
          id: 'reactivity-ref-reactive',
          title: 'Reactivity Fundamentals: ref and reactive',
          summary:
            'Reactive state is data that Vue watches. `ref` wraps any single value in an object with a `.value` property; `reactive` makes a whole object reactive. Knowing their rules prevents the most common Vue bugs.',
          keyPoints: [
            '`ref(0)` returns an object `{ value: 0 }`. In JavaScript you read and write `.value`; in the template Vue unwraps it for you, so you write just `count`.',
            '`reactive({ ... })` returns a Proxy of the object. You access properties directly (`state.count`) with no `.value`, but it works only for objects, and the reference must never be replaced.',
            'Destructuring a reactive object (`const { count } = state`) copies a plain number and **loses reactivity**. Use `toRefs(state)` or `toRef(state, \'count\')` to keep the link.',
            'Prefer `ref` as your default: it works for every type, can be reassigned, and passes around safely. Use `reactive` for a grouped object that never gets replaced.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A normal JavaScript variable is invisible to Vue: if you write `let count = 0; count++`, nothing tells Vue that a change happened, so the screen stays old. To make a change detectable, Vue needs to wrap the value. A **ref** is a small box with a `.value` slot: reading `.value` tells Vue "this code depends on me", and writing `.value` tells Vue "everyone who depended on me must run again".',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'ref and reactive side by side',
              code: `<script setup>
import { ref, reactive } from 'vue'

// ref: works for any value (number, string, object, array)
const count = ref(0)
const user = ref({ name: 'Ada', age: 36 })

// reactive: only for objects, access without .value
const form = reactive({ email: '', password: '' })

function demo() {
  count.value++              // JS needs .value for refs
  user.value.name = 'Grace'  // still reactive (deep)
  user.value = { name: 'Alan', age: 41 }  // replacing the whole object is OK for ref
  form.email = 'a@b.com'     // no .value for reactive
}
</script>

<template>
  <!-- the template unwraps top-level refs automatically -->
  <p>{{ count }} / {{ user.name }} / {{ form.email }}</p>
  <button @click="demo">Run</button>
</template>`,
            },
            {
              type: 'table',
              headers: ['', 'ref', 'reactive'],
              rows: [
                ['Accepts', 'Any value: primitive, object, array', 'Objects only (including arrays, Map, Set)'],
                ['Access in JS', '`x.value`', '`x.prop` (no `.value`)'],
                ['Replace the whole thing', 'Yes: `x.value = newObj`', 'No: `x = newObj` breaks the Proxy link'],
                ['Destructuring', 'Safe to pass the ref itself around', 'Loses reactivity unless you use `toRefs`'],
                ['Passing to a function', 'The ref keeps the connection', 'Passing `state.count` passes a plain number'],
                ['Typical use', 'Default choice, single values, API data', 'A group of related fields such as a form'],
              ],
            },
            {
              type: 'heading',
              text: 'The classic pitfalls, with fixes',
            },
            {
              type: 'code',
              language: 'js',
              title: 'pitfalls with reactive()',
              code: `import { reactive, toRefs, toRef } from 'vue'

let state = reactive({ count: 0, name: 'Ada' })

// PITFALL 1: destructuring copies the values out, the link is lost
const { count } = state
count++                       // changes a plain local number, Vue sees nothing

// FIX: toRefs turns every property into a ref that stays linked
const { count: countRef, name } = toRefs(state)
countRef.value++              // updates state.count too

// or just one property
const nameRef = toRef(state, 'name')

// PITFALL 2: replacing the object breaks tracking
state = reactive({ count: 5, name: 'Bob' })   // old template still watches the OLD object

// FIX: change properties in place
Object.assign(state, { count: 5, name: 'Bob' })`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["Need reactive state"] --> B{"Is it a single value<br/>or might be replaced?"}
    B -->|"yes"| R["Use ref"]
    B -->|"no, a fixed group of fields"| C{"Will you destructure it<br/>or reassign it?"}
    C -->|"yes"| R
    C -->|"no"| RE["reactive is fine"]
    R --> D["Remember .value in script<br/>no .value in template"]`,
            },
            {
              type: 'heading',
              text: 'Unwrapping rules (when .value disappears)',
            },
            {
              type: 'list',
              items: [
                '**In templates**, top-level refs are unwrapped: `{{ count }}`. But a ref nested inside a plain object is **not** unwrapped: with `const obj = { n: ref(1) }`, writing `{{ obj.n }}` shows a ref object. Destructure it to the top level first.',
                '**Inside `reactive`**, refs are unwrapped when you read them as properties: `reactive({ n: ref(1) }).n` gives `1`, not a ref.',
                '**Inside reactive arrays and Maps**, refs are **not** unwrapped: `reactiveArray[0]` is still a ref, so you need `.value`.',
                '**`ref` of an object is deeply reactive**: nested properties become reactive too, because Vue wraps the object with `reactive` internally.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The most common beginner bug: forgetting `.value` in `<script>`. Writing `if (isOpen) { ... }` is always true (a ref object is truthy). Write `if (isOpen.value)`. Your editor with the Vue language tooling (Volar) will flag many of these when you use TypeScript.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Many teams simply use `ref` everywhere and never `reactive`, because the rules are uniform: a ref always needs `.value` in script. It removes the "which one did I use here?" question completely.',
            },
          ],
        },
        {
          id: 'computed-properties',
          title: 'Computed Properties',
          summary:
            'A `computed` is a value derived from other reactive state. Vue caches it and recalculates only when the things it depends on change, so it is both convenient and efficient.',
          keyPoints: [
            '`computed(() => ...)` returns a read-only ref whose value is a pure calculation based on other state (a **pure** function has no side effects: it only reads and returns).',
            '**Caching**: the result is stored until one of its dependencies changes, unlike a normal function call in the template that re-runs on every render.',
            'Never change state, call an API or touch the DOM inside a computed getter. Use `watch` or an event handler for side effects.',
            'A computed can be writable by providing `get` and `set`, which is useful to adapt a value for `v-model`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Suppose you store a list of products and want to show the total price. You could calculate it in the template, but that mixes logic with markup and repeats work. A computed property is like a spreadsheet formula cell: it says "my value is always the sum of those cells", and Vue remembers the answer until one of the input cells changes.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'a shopping cart with computed values',
              code: `<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: 'Keyboard', price: 49, qty: 1 },
  { id: 2, name: 'Mouse', price: 25, qty: 2 },
])
const search = ref('')

// recalculates only when items (or a price/qty inside) changes
const total = computed(() =>
  items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
)

// computed can depend on other computed values and on several refs
const visibleItems = computed(() =>
  items.value.filter(i => i.name.toLowerCase().includes(search.value.toLowerCase()))
)
const summary = computed(() => visibleItems.value.length + ' items, total $' + total.value)
</script>

<template>
  <input v-model="search" placeholder="Filter..." />
  <ul>
    <li v-for="i in visibleItems" :key="i.id">
      {{ i.name }} x {{ i.qty }}
      <button @click="i.qty++">+</button>
    </li>
  </ul>
  <p>{{ summary }}</p>
</template>`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["items or search changes"] --> B["computed marked as dirty"]
    B --> C{"Does anything read it?"}
    C -->|"no"| D["Nothing is calculated"]
    C -->|"yes, template renders"| E["Getter runs once"]
    E --> F["Result cached"]
    F --> G["Next reads return the cache<br/>until a dependency changes"]`,
            },
            {
              type: 'heading',
              text: 'Computed versus a method',
            },
            {
              type: 'table',
              headers: ['', 'computed', 'method / function'],
              rows: [
                ['Result cached?', 'Yes, until dependencies change', 'No, runs on every call'],
                ['Takes arguments?', 'No (it is a value, not a function)', 'Yes'],
                ['Best for', 'Derived data used in several places or expensive to calculate', 'Actions and calculations that need parameters'],
                ['Side effects allowed?', 'No', 'Yes (event handlers)'],
              ],
            },
            {
              type: 'heading',
              text: 'Writable computed',
            },
            {
              type: 'code',
              language: 'js',
              title: 'a computed with a setter',
              code: `import { ref, computed } from 'vue'

const firstName = ref('Ada')
const lastName = ref('Lovelace')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    // called when someone writes fullName.value = '...'
    const [first, ...rest] = newValue.split(' ')
    firstName.value = first
    lastName.value = rest.join(' ')
  },
})

fullName.value = 'Grace Hopper'   // updates firstName and lastName`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A computed getter must not change state. Code like `computed(() => { count.value++; return count.value })` can cause infinite loops or inconsistent screens. If you need "when X changes, do something", use `watch`. Also do not mutate arrays inside a computed: `list.value.sort()` sorts the original in place. Write `[...list.value].sort()` instead.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Since Vue 3.4, a computed only notifies its dependents if its new value is actually different from the old one. That means a computed that returns the same boolean after a change will not trigger needless re-renders downstream.',
            },
          ],
        },
        {
          id: 'watchers',
          title: 'Watchers: watch and watchEffect',
          summary:
            'Use `watch` or `watchEffect` when a change in data should trigger a side effect, such as calling an API, saving to storage or updating something outside Vue. `watch` is explicit about what it observes; `watchEffect` tracks automatically.',
          keyPoints: [
            'A **side effect** is anything that is not just calculating a value: network calls, timers, `localStorage`, logging, changing the DOM. Computed is for values; watchers are for side effects.',
            '`watch(source, callback)` runs the callback only when the source changes (lazy by default); the callback receives `(newValue, oldValue, onCleanup)`.',
            '`watchEffect(fn)` runs immediately and re-runs whenever any reactive value read **synchronously** inside it changes.',
            'Options: `immediate` (also run once at start), `deep` (look inside objects), `once` (run a single time), and `flush: \'post\'` (run after the DOM has updated).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'If a computed property is a formula cell, a watcher is an alarm: "when this value changes, ring and run this code". Typical examples are: fetch new data when a selected id changes, save a draft when a form changes, or start and stop a timer when a toggle flips.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'watch: refetch user when the id changes (with cleanup)',
              code: `<script setup>
import { ref, watch } from 'vue'

const userId = ref(1)
const user = ref(null)
const loading = ref(false)

watch(
  userId,                                   // the source: a ref, getter or array of them
  async (newId, oldId, onCleanup) => {
    // onCleanup runs before the next callback, so an old request is cancelled
    const controller = new AbortController()
    onCleanup(() => controller.abort())

    loading.value = true
    try {
      const res = await fetch('/api/users/' + newId, { signal: controller.signal })
      user.value = await res.json()
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e)
    } finally {
      loading.value = false
    }
  },
  { immediate: true }                       // also run once on creation
)
</script>

<template>
  <button @click="userId++">Next user</button>
  <p v-if="loading">Loading...</p>
  <pre v-else>{{ user }}</pre>
</template>`,
            },
            {
              type: 'heading',
              text: 'What can be watched',
            },
            {
              type: 'code',
              language: 'js',
              title: 'watch sources',
              code: `import { ref, reactive, watch, watchEffect } from 'vue'

const count = ref(0)
const state = reactive({ filter: { text: '', page: 1 } })

// 1. a ref
watch(count, (n, old) => console.log(old, '->', n))

// 2. a getter function (required to watch one property of a reactive object)
watch(() => state.filter.page, (page) => console.log('page', page))
// watch(state.filter.page, ...) would NOT work: that passes a plain number

// 3. several sources at once
watch([count, () => state.filter.text], ([c, t], [oldC, oldT]) => { /* ... */ })

// 4. deep watching an object (a ref's object needs deep: true for inner changes)
const settings = ref({ theme: { dark: false } })
watch(settings, (s) => console.log('saved', s), { deep: true })

// 5. run once and stop
watch(count, () => console.log('first change only'), { once: true })

// 6. watchEffect: no source, tracks what it reads
const stop = watchEffect(() => {
  console.log('count is', count.value)     // re-runs when count changes
})
stop()                                      // call the returned function to stop watching`,
            },
            {
              type: 'table',
              headers: ['', 'watch', 'watchEffect'],
              rows: [
                ['Dependencies', 'Listed explicitly', 'Detected automatically from what the function reads'],
                ['Runs at start', 'No (unless `immediate: true`)', 'Yes, always'],
                ['Old value available', 'Yes', 'No'],
                ['Best for', 'Reacting to a specific change, with old and new value', 'Several dependencies, simple "keep this in sync" effects'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["Need to react to data"] --> B{"Producing a value<br/>from other state?"}
    B -->|"yes"| C["Use computed"]
    B -->|"no, doing something"| D{"Know exactly which<br/>source triggers it?"}
    D -->|"yes"| E["Use watch"]
    D -->|"no, many reads inside"| F["Use watchEffect"]`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`watchEffect` only tracks reactive values read **before the first `await`**. In `watchEffect(async () => { await sleep(); use(count.value) })` the `count` read happens after the await, so it is not tracked. Read the values first (`const c = count.value`) or use `watch` with an explicit source.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Watchers created synchronously in `setup` stop automatically when the component unmounts. If you create one later (inside a `setTimeout` or after an `await`) you must call the returned `stop()` yourself. Vue 3.5 also added `onWatcherCleanup()` as an alternative to the `onCleanup` argument, and `pause()` and `resume()` on the returned handle.',
            },
          ],
        },
        {
          id: 'class-style-events',
          title: 'Class and Style Bindings, Event Handling',
          summary:
            'Vue lets you switch CSS classes and inline styles from data using objects and arrays, and listen to events with `@` plus **modifiers** that handle chores like `preventDefault` for you.',
          keyPoints: [
            '`:class` accepts a string, an object (`{ active: isActive }` adds the class when true) or an array; it merges with a plain static `class`.',
            '`:style` accepts an object with camelCase or kebab-case keys; Vue adds vendor prefixes where needed.',
            '`@click="handler"` calls a method; `@click="count++"` runs an inline expression; `$event` gives you the native event object.',
            'Event modifiers chain: `.prevent`, `.stop`, `.once`, `.self`, `.capture`, `.passive`; key modifiers like `@keyup.enter` and `@keydown.esc` avoid manual `event.key` checks.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'vue',
              title: 'class and style binding patterns',
              code: `<script setup>
import { ref, computed } from 'vue'

const isActive = ref(true)
const hasError = ref(false)
const size = ref(18)
const status = ref('warning')

// returning an object from computed keeps the template tidy
const classes = computed(() => ({
  active: isActive.value,
  'text-danger': hasError.value,
}))
</script>

<template>
  <!-- object: key = class name, value = condition -->
  <div class="box" :class="{ active: isActive, 'text-danger': hasError }">A</div>

  <!-- computed object -->
  <div :class="classes">B</div>

  <!-- array, with a conditional (ternary) inside -->
  <div :class="['badge', status, isActive ? 'on' : 'off']">C</div>

  <!-- style object -->
  <p :style="{ color: hasError ? 'red' : 'green', fontSize: size + 'px' }">D</p>

  <!-- several style objects merged -->
  <p :style="[baseStyles, overrideStyles]">E</p>
</template>`,
            },
            {
              type: 'heading',
              text: 'Handling events',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'events and modifiers',
              code: `<script setup>
import { ref } from 'vue'

const count = ref(0)
const text = ref('')

function onSubmit() {
  console.log('saving', text.value)
}
function remove(id, event) {
  console.log('remove', id, event.target)
}
function onScroll() { /* ... */ }
</script>

<template>
  <!-- inline expression -->
  <button @click="count++">Clicked {{ count }}</button>

  <!-- method handler: Vue passes the native event as the first argument -->
  <button @click="onSubmit">Save</button>

  <!-- with your own argument AND the event, use $event -->
  <button @click="remove(42, $event)">Delete</button>

  <!-- .prevent: stops the browser reloading the page on submit -->
  <form @submit.prevent="onSubmit">
    <input v-model="text" @keyup.enter="onSubmit" @keydown.esc="text = ''" />
    <button>Send</button>
  </form>

  <!-- .stop: the click will not bubble up to the parent -->
  <div @click="console.log('parent')">
    <button @click.stop="console.log('child only')">Child</button>
  </div>

  <!-- .once: handler runs a single time; chain modifiers freely -->
  <button @click.once="count = 100">Reset once</button>

  <!-- ctrl+click only -->
  <button @click.ctrl.exact="count = 0">Ctrl + click resets</button>

  <!-- .passive improves scroll performance on touch devices -->
  <div @scroll.passive="onScroll">...</div>
</template>`,
            },
            {
              type: 'table',
              headers: ['Modifier', 'What it does', 'Equivalent plain JS'],
              rows: [
                ['`.prevent`', 'Cancels the browser default action (form submit, link follow)', '`event.preventDefault()`'],
                ['`.stop`', 'Stops the event bubbling to parent elements', '`event.stopPropagation()`'],
                ['`.self`', 'Runs only if the event came from the element itself, not a child', '`if (event.target !== event.currentTarget) return`'],
                ['`.once`', 'Handler runs at most once', 'remove the listener after the first call'],
                ['`.capture`', 'Listen during the capture phase (parent before child)', '`addEventListener(..., true)`'],
                ['`.passive`', 'Promise never to call preventDefault; lets the browser scroll smoothly', '`{ passive: true }` option'],
                ['`.enter` `.esc` `.tab` ...', 'Only fire for that key', '`if (event.key === \'Enter\')`'],
                ['`.exact`', 'Only if exactly the listed system modifier keys are held', 'manual `ctrlKey` / `shiftKey` checks'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    U["User clicks the button"] --> A["Capture phase<br/>window down to target"]
    A --> B["Target element handler<br/>click.stop stops here"]
    B --> C["Bubble phase<br/>target up to window"]
    C --> D["Parent handlers run<br/>unless stopped"]`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Passing the **result** of a call instead of the function itself is a classic slip in plain JavaScript (`button.onclick = save()` runs immediately). In a Vue template, `@click="save"` and `@click="save()"` both work, and `@click="save(item)"` is how you pass arguments. Inline handlers are wrapped by Vue, so they run only on click.',
            },
          ],
        },
        {
          id: 'forms-v-model',
          title: 'Forms and v-model (including defineModel)',
          summary:
            '`v-model` creates two-way binding: the input shows the variable, and typing updates the variable. It works on native inputs and, with `defineModel`, on your own components.',
          keyPoints: [
            '**Two-way binding** means data flows both ways: variable to input (display) and input to variable (typing). `v-model` is shorthand for `:value` plus `@input` handlers.',
            '`v-model` adapts to the element: text inputs and textareas use a string, checkboxes use a boolean or an array, radios use the chosen value, selects use the selected option(s).',
            'Modifiers: `.trim` (strip spaces), `.number` (convert to number), `.lazy` (update on `change` instead of every keystroke).',
            'For your own components, `const model = defineModel()` (stable since Vue 3.4) gives a ref that stays in sync with the parent\'s `v-model`, replacing the old `modelValue` prop + `update:modelValue` event boilerplate.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'vue',
              title: 'a signup form using many input types',
              code: `<script setup>
import { reactive, computed } from 'vue'

const form = reactive({
  name: '',
  age: null,
  newsletter: false,          // single checkbox -> boolean
  topics: [],                 // several checkboxes -> array
  plan: 'free',               // radios -> the chosen value
  country: '',                // select
})

const isValid = computed(() => form.name.trim().length > 1 && form.age >= 18)

function submit() {
  if (!isValid.value) return
  console.log(JSON.stringify(form))
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model.trim="form.name" placeholder="Name" />
    <input v-model.number="form.age" type="number" placeholder="Age" />

    <label><input type="checkbox" v-model="form.newsletter" /> Newsletter</label>

    <label><input type="checkbox" value="vue" v-model="form.topics" /> Vue</label>
    <label><input type="checkbox" value="pinia" v-model="form.topics" /> Pinia</label>

    <label><input type="radio" value="free" v-model="form.plan" /> Free</label>
    <label><input type="radio" value="pro" v-model="form.plan" /> Pro</label>

    <select v-model="form.country">
      <option disabled value="">Choose...</option>
      <option>India</option>
      <option>Germany</option>
    </select>

    <button :disabled="!isValid">Sign up</button>
  </form>
</template>`,
            },
            {
              type: 'heading',
              text: 'v-model on your own component with defineModel',
            },
            {
              type: 'p',
              text: 'A custom component can take part in `v-model` too. The parent writes `<StarRating v-model="rating" />`. Inside the child, `defineModel()` returns a ref. Reading it gives the parent\'s value; assigning to it automatically tells the parent to update. You write far less than the older way, which required declaring a `modelValue` prop and emitting `update:modelValue` by hand.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'StarRating.vue (the child)',
              code: `<script setup>
// model is a ref linked to the parent's v-model
const model = defineModel({ type: Number, default: 0 })
</script>

<template>
  <span>
    <button
      v-for="n in 5"
      :key="n"
      :class="{ on: n <= model }"
      @click="model = n"
    >*</button>
  </span>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'parent: one v-model, plus a named second model',
              code: `<script setup>
import { ref } from 'vue'
import StarRating from './StarRating.vue'

const rating = ref(3)
const title = ref('')
</script>

<template>
  <StarRating v-model="rating" />
  <p>You gave {{ rating }} stars</p>

  <!-- A component can expose several models using names:
       <UserForm v-model:first="first" v-model:last="last" />
       and in the child: defineModel('first'), defineModel('last') -->
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'the older, manual way (you will still see it)',
              code: `<script setup>
const props = defineProps({ modelValue: Number })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <button @click="emit('update:modelValue', props.modelValue + 1)">
    {{ modelValue }}
  </button>
</template>`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant P as Parent
    participant C as Child with defineModel
    P->>C: v-model="rating" passes value 3
    C->>C: model = 4 (user clicks)
    C-->>P: emits update:modelValue with 4
    P->>P: rating becomes 4
    P->>C: new value 4 flows down`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A number input gives you a **string** unless you add `.number` (or `type="number"` together with `v-model.number`). Comparing `"18" >= 18` happens to work in JavaScript, but `"5" + 1` gives `"51"`. Convert deliberately. Also, on mobile keyboards and IME input (Chinese, Japanese), `v-model` waits for composition to finish; use `@input` yourself if you need every keystroke.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For serious forms (many fields, cross-field rules, async validation) consider a validation library such as VeeValidate, FormKit, or Vuelidate rather than hand-rolling error handling for every field.',
            },
          ],
        },
        {
          id: 'components-props-emits',
          title: 'Components: Props Down, Events Up',
          summary:
            'Components talk to each other by a strict rule: a parent passes data **down** to a child with props, and the child tells the parent something happened by emitting events **up**. This one-way flow keeps apps predictable.',
          keyPoints: [
            '**Props** are the inputs of a component: custom attributes the parent sets. A child must treat props as **read-only** and never modify them.',
            '**Emits** are the outputs: the child calls `emit(\'save\', payload)` and the parent listens with `@save="handler"`.',
            'Declare both with the macros `defineProps` and `defineEmits`. With TypeScript you can declare them with plain type syntax, and Vue checks usage in templates.',
            'Attributes that are not declared as props (like `class`, `id`, `data-*`) **fall through** onto the component\'s root element automatically.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Think of a component as a function: props are its parameters, and emitted events are callbacks it uses to report back. The parent owns the data; the child only displays it and asks for changes. If a child could secretly change the parent\'s data, then any bug would require searching the whole app to find who changed what. One direction of flow means you always know where to look.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    P["Parent component<br/>owns the data"] -->|"props go down"| C["Child component<br/>displays and asks"]
    C -.->|"events go up"| P
    P -->|"updates its state"| P`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'TodoItem.vue with runtime-declared props and emits',
              code: `<script setup>
const props = defineProps({
  todo: { type: Object, required: true },       // { id, text, done }
  editable: { type: Boolean, default: true },
})

const emit = defineEmits(['toggle', 'remove'])
</script>

<template>
  <li :class="{ done: todo.done }">
    <input type="checkbox" :checked="todo.done" @change="emit('toggle', todo.id)" />
    <span>{{ todo.text }}</span>
    <button v-if="editable" @click="emit('remove', todo.id)">x</button>
  </li>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'TodoList.vue: the parent owns the state and handles the events',
              code: `<script setup>
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

const todos = ref([
  { id: 1, text: 'Learn props', done: true },
  { id: 2, text: 'Learn emits', done: false },
])

function toggle(id) {
  const t = todos.value.find(t => t.id === id)
  if (t) t.done = !t.done
}
function remove(id) {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <ul>
    <TodoItem
      v-for="t in todos"
      :key="t.id"
      :todo="t"
      @toggle="toggle"
      @remove="remove"
    />
  </ul>
</template>`,
            },
            {
              type: 'heading',
              text: 'The same component with TypeScript types',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'type-based declarations (Vue 3.3+ syntax)',
              code: `<script setup lang="ts">
interface Todo { id: number; text: string; done: boolean }

// props: types and optional marks (?), defaults come from destructuring (Vue 3.5+)
const { todo, editable = true } = defineProps<{
  todo: Todo
  editable?: boolean
}>()

// emits: a named tuple per event describes the payload
const emit = defineEmits<{
  toggle: [id: number]
  remove: [id: number]
}>()

emit('toggle', todo.id)      // OK
// emit('toggle', 'abc')     // error: string is not a number
</script>`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never mutate a prop: `props.todo.done = true` or `props.count++`. For an object prop it may even appear to work (the object is shared), but then the parent\'s data changes behind its back, and Vue will warn for primitives. Instead emit an event and let the parent change its own data, or copy the prop into local state: `const draft = ref(props.initial)`.',
            },
            {
              type: 'heading',
              text: 'Attribute fallthrough',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'class and listeners fall onto the root element',
              code: `<!-- MyButton.vue -->
<template>
  <button class="btn"><slot /></button>
</template>

<!-- Parent -->
<MyButton class="big" id="save" @click="save">Save</MyButton>
<!-- renders: <button class="btn big" id="save">Save</button> and click works -->

<!-- To stop this, or to target a different element: -->
<script setup>
defineOptions({ inheritAttrs: false })
</script>
<template>
  <div class="wrapper">
    <button class="btn" v-bind="$attrs"><slot /></button>
  </div>
</template>`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Props are written in camelCase in JavaScript (`userName`) and can be passed in kebab-case in templates (`user-name="Ada"`); Vue connects them. Pass non-string values with `:`: `count="5"` passes the string "5", while `:count="5"` passes the number 5.',
            },
          ],
        },
        {
          id: 'slots',
          title: 'Slots: Passing Content into Components',
          summary:
            'A slot is a placeholder in a child component where the parent can inject its own markup. Named slots allow several placeholders, and scoped slots let the child hand data back to the content the parent provides.',
          keyPoints: [
            'Props pass **data**; slots pass **template content** (markup, other components). Use `<slot />` in the child to mark where the content goes.',
            'Content between the component\'s tags becomes the default slot. A fallback shown inside `<slot>...</slot>` appears if the parent gives nothing.',
            '**Named slots**: `<slot name="header" />` in the child, `<template #header>...</template>` in the parent (`#` is shorthand for `v-slot:`).',
            '**Scoped slots**: the child passes values to the slot (`<slot :item="item" />`) and the parent receives them with `#default="{ item }"`. This is how reusable list and table components work.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine a picture frame. The frame (component) decides the border, size and shadow; you decide what picture (content) goes inside. A `<Card>` component does the same: it controls the box styling, and each place that uses it supplies what is in the box.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'Card.vue with default and named slots',
              code: `<template>
  <div class="card">
    <header v-if="$slots.header">
      <slot name="header" />
    </header>

    <main>
      <!-- default slot with fallback content -->
      <slot>No content provided</slot>
    </main>

    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'using Card',
              code: `<Card>
  <template #header>
    <h2>Welcome</h2>
  </template>

  <!-- anything outside a <template #name> goes to the default slot -->
  <p>This is the card body.</p>

  <template #footer>
    <button>Close</button>
  </template>
</Card>`,
            },
            {
              type: 'heading',
              text: 'Scoped slots: the child provides data to the parent\'s template',
            },
            {
              type: 'p',
              text: 'A reusable list should not decide how each row looks. A scoped slot lets the list own the looping and the data while the parent decides the row markup. The child writes `<slot :item="item" :index="i" />`, and the parent receives those values as an object it can destructure.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'FancyList.vue (child)',
              code: `<script setup lang="ts" generic="T">
// "generic" makes the component typed: items and the slot data share a type T
defineProps<{ items: T[] }>()
defineSlots<{
  default(props: { item: T; index: number }): any
  empty(): any
}>()
</script>

<template>
  <ul v-if="items.length">
    <li v-for="(item, index) in items" :key="index">
      <slot :item="item" :index="index" />
    </li>
  </ul>
  <slot v-else name="empty">Nothing here</slot>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'parent decides how each row looks',
              code: `<script setup>
import { ref } from 'vue'
import FancyList from './FancyList.vue'

const users = ref([
  { id: 1, name: 'Ada', admin: true },
  { id: 2, name: 'Alan', admin: false },
])
</script>

<template>
  <FancyList :items="users">
    <!-- destructure the slot props -->
    <template #default="{ item, index }">
      {{ index + 1 }}. {{ item.name }}
      <strong v-if="item.admin">(admin)</strong>
    </template>

    <template #empty>
      <p>No users yet.</p>
    </template>
  </FancyList>
</template>`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Child["FancyList (child)"]
      L["loops over items"] --> S["slot with item and index"]
    end
    subgraph Parent["Parent template"]
      T["template default with item and index<br/>decides the markup"]
    end
    S -->|"data flows up into the slot"| T
    T -->|"rendered markup flows back"| S`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A scoped slot is the Vue version of React\'s "render prop": instead of passing a function, you write a template that receives arguments. Common uses are tables (custom cell rendering), dropdowns (custom option rendering) and data-fetching wrappers that expose `loading` and `data` to their content.',
            },
          ],
        },
        {
          id: 'lifecycle-and-template-refs',
          title: 'Lifecycle Hooks and Template Refs',
          summary:
            'Every component goes through stages: created, mounted, updated and unmounted. Lifecycle hooks let you run code at each stage. Template refs give you direct access to a real DOM element or child component when you truly need it.',
          keyPoints: [
            'Hooks are functions imported from `vue`, called inside `setup`: `onMounted`, `onUpdated`, `onBeforeUnmount`, `onUnmounted` (and `onBefore...` versions).',
            'The code in `<script setup>` itself runs when the component is **created**, before any DOM exists. The DOM is only guaranteed to exist from `onMounted`.',
            'Always undo what you set up: remove event listeners, clear timers, close sockets in `onBeforeUnmount` or `onUnmounted`.',
            '`useTemplateRef(\'name\')` (Vue 3.5+) or a `ref` with the same name as the `ref` attribute gives access to the element, which is `null` until the component is mounted.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TD
    A["setup runs<br/>script setup body"] --> B["onBeforeMount"]
    B --> C["Template rendered<br/>DOM created"]
    C --> D["onMounted<br/>DOM exists, safe to touch"]
    D --> E{"Reactive data<br/>changes?"}
    E -->|"yes"| F["onBeforeUpdate"]
    F --> G["DOM patched"]
    G --> H["onUpdated"]
    H --> E
    E -->|"component removed"| I["onBeforeUnmount<br/>clean up here"]
    I --> J["onUnmounted"]`,
            },
            {
              type: 'table',
              headers: ['Hook', 'When it runs', 'Typical use'],
              rows: [
                ['`script setup` body', 'When the component is created', 'Declare state, computed, watchers, register other hooks'],
                ['`onBeforeMount`', 'Just before the first render', 'Rarely needed'],
                ['`onMounted`', 'After the component is in the DOM', 'Fetch initial data, measure elements, start charts, add listeners'],
                ['`onBeforeUpdate` / `onUpdated`', 'Before and after a re-render caused by state change', 'Read DOM state before/after (rare; prefer `watch` with `flush: post` or `nextTick`)'],
                ['`onBeforeUnmount`', 'Right before removal', 'Cleanup'],
                ['`onUnmounted`', 'After removal', 'Final cleanup'],
                ['`onActivated` / `onDeactivated`', 'Component inside `<KeepAlive>` is shown or hidden', 'Resume or pause work'],
                ['`onErrorCaptured`', 'A descendant threw an error', 'Show a fallback UI, log the error'],
              ],
            },
            {
              type: 'code',
              language: 'vue',
              title: 'a live clock that cleans up after itself',
              code: `<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const now = ref(new Date())
let timerId = null

onMounted(() => {
  // the component is in the page now; start the timer
  timerId = setInterval(() => { now.value = new Date() }, 1000)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  // WITHOUT this the timer keeps running after the component is gone (a memory leak)
  clearInterval(timerId)
  window.removeEventListener('resize', onResize)
})

function onResize() { console.log(window.innerWidth) }
</script>

<template>
  <p>{{ now.toLocaleTimeString() }}</p>
</template>`,
            },
            {
              type: 'heading',
              text: 'Template refs: reaching the real DOM element',
            },
            {
              type: 'p',
              text: 'Normally you never touch the DOM; you change data and Vue updates it. Sometimes you must act directly: focus an input, measure an element\'s size, or call a method on a child component. A **template ref** is a handle to that element. It is `null` before the component mounts, so only use it from `onMounted` onward or inside event handlers.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'focus an input on mount, and read a list of refs',
              code: `<script setup>
import { useTemplateRef, onMounted, ref } from 'vue'

// Vue 3.5+: the string must match the ref="..." attribute below
const input = useTemplateRef('nameInput')
const rows = useTemplateRef('rows')          // refs inside v-for become an array
const items = ref(['a', 'b', 'c'])

onMounted(() => {
  input.value.focus()
  console.log(rows.value.length)             // 3
})
</script>

<template>
  <input ref="nameInput" />
  <ul>
    <li v-for="i in items" :key="i" ref="rows">{{ i }}</li>
  </ul>
</template>

<!-- Before 3.5 (and still valid): declare a ref with the SAME name
     const nameInput = ref(null)    and use  <input ref="nameInput" /> -->`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'calling a child method with defineExpose',
              code: `<!-- Dialog.vue -->
<script setup>
import { ref } from 'vue'
const open = ref(false)
// <script setup> components are closed by default: expose only what the parent may use
defineExpose({ show: () => (open.value = true), hide: () => (open.value = false) })
</script>

<!-- Parent -->
<script setup>
import { useTemplateRef } from 'vue'
import Dialog from './Dialog.vue'
const dialog = useTemplateRef('dlg')
</script>
<template>
  <Dialog ref="dlg" />
  <button @click="dialog.show()">Open</button>
</template>`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Updating state does not update the DOM immediately. Vue **batches** changes and applies them on the next tick. If you set `show.value = true` and instantly read the element\'s size, it is still old. Use `await nextTick()` (from `vue`) before reading the DOM. Also never fetch data in `onUpdated`: it runs after every re-render, causing infinite loops.',
            },
          ],
        },
        {
          id: 'composables',
          title: 'Composables: Reusable Logic',
          summary:
            'A composable is an ordinary function, usually named `useSomething`, that uses Vue\'s reactivity (and lifecycle hooks) to package a piece of stateful logic so any component can reuse it.',
          keyPoints: [
            'A composable bundles reactive state, computed values, watchers and lifecycle hooks behind one function and **returns** what the component needs.',
            'Each call creates fresh, independent state (unlike a shared module-level variable, which is shared by everyone).',
            'Convention: name starts with `use`, lives in a `composables/` folder, accepts refs or plain values (use `toValue()` to read either), returns an object of refs.',
            'Composables replaced **mixins**, which suffered from name clashes and unclear origin of properties.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine five components all need "load a URL and track loading and error state". Copy-pasting that is a maintenance nightmare. In the Composition API you move that logic into a function, and each component calls it. Because the function uses `ref` and `computed` inside, the state it returns is fully reactive.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'composables/useFetch.js',
              code: `import { ref, watchEffect, toValue } from 'vue'

// url may be a string, a ref, or a getter: toValue() handles all three
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  watchEffect(async (onCleanup) => {
    // read reactive values BEFORE the first await so they are tracked
    const target = toValue(url)
    const controller = new AbortController()
    onCleanup(() => controller.abort())

    data.value = null
    error.value = null
    loading.value = true
    try {
      const res = await fetch(target, { signal: controller.signal })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      data.value = await res.json()
    } catch (e) {
      if (e.name !== 'AbortError') error.value = e
    } finally {
      loading.value = false
    }
  })

  return { data, error, loading }
}`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'using it: refetches automatically when page changes',
              code: `<script setup>
import { ref, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'

const page = ref(1)
const url = computed(() => '/api/posts?page=' + page.value)
const { data, error, loading } = useFetch(url)
</script>

<template>
  <p v-if="loading">Loading...</p>
  <p v-else-if="error">Failed: {{ error.message }}</p>
  <ul v-else>
    <li v-for="p in data" :key="p.id">{{ p.title }}</li>
  </ul>
  <button @click="page++">Next page</button>
</template>`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'composables/useLocalStorage.js',
              code: `import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // read once at the start
  let initial = defaultValue
  try {
    const saved = localStorage.getItem(key)
    if (saved !== null) initial = JSON.parse(saved)
  } catch { /* corrupted or blocked storage: fall back to the default */ }

  const state = ref(initial)

  // write on every change (deep so objects inside are watched)
  watch(state, (value) => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota or private mode */ }
  }, { deep: true })

  return state
}

// in a component:
// const theme = useLocalStorage('theme', 'light')
// theme.value = 'dark'   // saved automatically`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'composables/useMouse.js: with lifecycle cleanup',
              code: `import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(e) { x.value = e.pageX; y.value = e.pageY }

  onMounted(() => window.addEventListener('mousemove', update))
  onBeforeUnmount(() => window.removeEventListener('mousemove', update))

  return { x, y }
}`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["Component A"] -->|"calls useMouse()"| S1["state copy 1<br/>x, y"]
    B["Component B"] -->|"calls useMouse()"| S2["state copy 2<br/>x, y"]
    S1 --- L["Same logic, separate state"]
    S2 --- L`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Call composables **synchronously at the top of `setup`** (not inside a click handler or after an `await`), because lifecycle hooks and watchers need to know which component they belong to. Also, return refs (not their unwrapped values): `return { count: count.value }` would hand back a dead number.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If you want state shared between components instead of copied, declare the `ref` **outside** the function (module scope). That works for tiny cases, but for real shared state prefer Pinia (covered later) which adds devtools support, SSR safety and structure.',
            },
          ],
        },
        {
          id: 'provide-inject',
          title: 'Provide / Inject: Avoiding Prop Drilling',
          summary:
            'When a distant descendant needs data from an ancestor, passing props through every level in between (**prop drilling**) is tedious. `provide` makes a value available to the whole subtree, and `inject` lets any descendant pick it up.',
          keyPoints: [
            '`provide(key, value)` in an ancestor; `inject(key, defaultValue)` in any descendant, no matter how deep.',
            'The provided value can be a ref or reactive object, so descendants stay in sync with changes.',
            'Use a Symbol (an `InjectionKey` in TypeScript) as the key to avoid name collisions and get type safety.',
            'Best for app-wide or section-wide context (theme, current user, form group) with a clear owner. Overuse makes data flow hard to follow.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TD
    A["App<br/>provide theme"] --> B["Layout"]
    B --> C["Sidebar"]
    B --> D["Content"]
    D --> E["Card"]
    E --> F["Button<br/>inject theme"]
    A -.->|"value reaches Button directly"| F`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'keys.ts: a typed key shared by provider and consumers',
              code: `import type { InjectionKey, Ref } from 'vue'

export interface ThemeContext {
  theme: Readonly<Ref<'light' | 'dark'>>
  toggle: () => void
}

// A unique Symbol key: no accidental collisions, and TypeScript knows the type
export const themeKey: InjectionKey<ThemeContext> = Symbol('theme')`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'App.vue: the provider owns the state and the way to change it',
              code: `<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import { themeKey } from './keys'

const theme = ref<'light' | 'dark'>('light')
function toggle() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// readonly() stops descendants from assigning theme directly; they must call toggle()
provide(themeKey, { theme: readonly(theme), toggle })
</script>

<template>
  <Layout />
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'DeepButton.vue: somewhere far below, no props needed',
              code: `<script setup lang="ts">
import { inject } from 'vue'
import { themeKey } from './keys'

// the second argument is a fallback when nobody provided the key
const ctx = inject(themeKey)
if (!ctx) throw new Error('DeepButton must be used inside a theme provider')
</script>

<template>
  <button :class="ctx.theme.value" @click="ctx.toggle()">
    Theme: {{ ctx.theme.value }}
  </button>
</template>`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Provide the **ability to change** the value (a function) alongside the value itself, and keep the state mutations inside the provider. That keeps one-way data flow: descendants ask, the owner decides. You can also `app.provide(key, value)` at the application level to make something available to every component.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Injected values are not visible in props or events, so a component using `inject` has a hidden dependency. Overusing it makes components hard to reuse and test. If only two or three levels are involved, plain props are clearer. If many unrelated parts of the app need the same data, a store (Pinia) is usually better than provide/inject.',
            },
          ],
        },
        {
          id: 'teleport-suspense',
          title: 'Teleport, Suspense and Async Components',
          summary:
            '`<Teleport>` renders part of a component somewhere else in the DOM (ideal for modals). Async components and `<Suspense>` let you load code and data lazily and show a fallback while waiting.',
          keyPoints: [
            '`<Teleport to="body">` keeps the logic and state in your component, but moves the rendered HTML to another place such as the end of `<body>`.',
            'Teleport solves CSS problems: a modal deep in the tree can be hidden or clipped by a parent with `overflow: hidden`, a transform, or a low `z-index` stacking context.',
            '`defineAsyncComponent(() => import(\'./Heavy.vue\'))` downloads a component only when it is first needed (code splitting).',
            '`<Suspense>` (still marked experimental) shows a `#fallback` until async dependencies (async `setup` with top-level `await`, async components) resolve.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'vue',
              title: 'a modal that escapes its parent\'s CSS',
              code: `<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <button @click="open = true">Open dialog</button>

  <!-- The HTML moves to the end of <body>, the component stays logically here -->
  <Teleport to="body">
    <div v-if="open" class="backdrop" @click.self="open = false">
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>Are you sure?</h2>
        <button @click="open = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: grid; place-items: center; }
.dialog { background: white; padding: 1rem; border-radius: 8px; }
</style>`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Logical["Component tree, logic and state"]
      P["Page"] --> M["Modal component"]
    end
    subgraph Real["Real DOM output"]
      R1["div id app<br/>page content"]
      R2["body end<br/>modal HTML"]
    end
    M -.->|"Teleport to body"| R2
    P --> R1`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The target of `to` must already exist when the Teleport mounts (Vue 3.5 added a `defer` prop to wait for it). Props, events, provide/inject and DevTools still treat the teleported content as a child of its original component, so nothing about data flow changes.',
            },
            {
              type: 'heading',
              text: 'Lazy loading components',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'async components: load a heavy chart only when needed',
              code: `<script setup>
import { defineAsyncComponent, ref } from 'vue'

// The code for HeavyChart.vue becomes a separate file, downloaded on first use
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: () => 'Loading chart...',
  errorComponent: () => 'Could not load the chart',
  delay: 200,         // wait 200ms before showing the loading UI (avoids a flash)
  timeout: 10000,     // give up after 10 seconds
})

const showChart = ref(false)
</script>

<template>
  <button @click="showChart = true">Show chart</button>
  <HeavyChart v-if="showChart" />
</template>`,
            },
            {
              type: 'heading',
              text: 'Suspense: waiting for async dependencies',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'async setup with top-level await inside Suspense',
              code: `<!-- UserProfile.vue: top-level await makes this component async -->
<script setup>
const res = await fetch('/api/me')
const me = await res.json()
</script>
<template><h1>Hello {{ me.name }}</h1></template>

<!-- Parent.vue -->
<template>
  <Suspense>
    <template #default>
      <UserProfile />
    </template>
    <template #fallback>
      <p>Loading profile...</p>
    </template>
  </Suspense>
</template>`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Suspense is documented as an experimental feature and its API could change, so do not build your whole data layer on it. Many teams skip it and show their own loading states with `v-if` or use TanStack Query\'s `isPending`. Also remember that errors in async dependencies are not caught by Suspense itself; use `onErrorCaptured` or an error-boundary component.',
            },
          ],
        },
        {
          id: 'transitions-directives',
          title: 'Transitions, Animations and Custom Directives',
          summary:
            '`<Transition>` and `<TransitionGroup>` animate elements as they enter, leave or move, using CSS classes Vue adds and removes for you. Custom directives package low-level DOM behaviour you want to reuse, such as auto-focus.',
          keyPoints: [
            '`<Transition name="fade">` wraps **one** element that appears and disappears (`v-if`, `v-show` or a dynamic component) and applies `fade-enter-from`, `fade-enter-active`, `fade-enter-to`, `fade-leave-*` classes.',
            '`<TransitionGroup>` animates lists: items entering, leaving and moving (`-move` class), and needs a unique `key` on each child.',
            '`mode="out-in"` waits for the old element to leave before the new one enters, which is what you want when swapping views.',
            'A custom directive (`v-focus`) is for direct DOM access on an element. It has hooks like `mounted` and `updated`. In `<script setup>`, any variable named `vSomething` is usable as `v-something`.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'vue',
              title: 'fade a message in and out',
              code: `<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<template>
  <button @click="show = !show">Toggle</button>

  <Transition name="fade">
    <p v-if="show">Hello, I fade!</p>
  </Transition>
</template>

<style>
/* starting state when entering and ending state when leaving */
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* the active classes carry the transition definition */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.4s ease; }
</style>`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["v-if becomes true"] --> B["enter-from<br/>opacity 0"]
    B --> C["enter-active<br/>transition runs"]
    C --> D["enter-to<br/>opacity 1"]
    D --> E["Classes removed"]
    F["v-if becomes false"] --> G["leave-from<br/>opacity 1"]
    G --> H["leave-active<br/>transition runs"]
    H --> I["leave-to<br/>opacity 0"]
    I --> J["Element removed from DOM"]`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'animated list with TransitionGroup',
              code: `<script setup>
import { ref } from 'vue'
let nextId = 4
const items = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
function add() { items.value.splice(1, 0, { id: nextId++ }) }
function remove(id) { items.value = items.value.filter(i => i.id !== id) }
</script>

<template>
  <button @click="add">Insert</button>
  <TransitionGroup name="list" tag="ul">
    <li v-for="i in items" :key="i.id" @click="remove(i.id)">Item {{ i.id }}</li>
  </TransitionGroup>
</template>

<style>
.list-enter-active, .list-leave-active, .list-move { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }
/* lets the remaining items glide into the gap instead of jumping */
.list-leave-active { position: absolute; }
</style>`,
            },
            {
              type: 'heading',
              text: 'Custom directives',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'v-focus and v-click-outside as local directives',
              code: `<script setup>
import { ref } from 'vue'

// any variable starting with "v" works as a directive inside <script setup>
const vFocus = {
  mounted: (el) => el.focus(),
}

const vClickOutside = {
  mounted(el, binding) {
    el._handler = (event) => {
      if (!el.contains(event.target)) binding.value(event)   // binding.value is the function passed
    }
    document.addEventListener('click', el._handler)
  },
  // always clean up what you attached
  unmounted(el) {
    document.removeEventListener('click', el._handler)
  },
}

const open = ref(true)
</script>

<template>
  <input v-focus placeholder="I get focus on load" />

  <div v-if="open" v-click-outside="() => (open = false)" class="menu">
    Click outside me to close
  </div>
</template>`,
            },
            {
              type: 'table',
              headers: ['Directive hook', 'Runs when'],
              rows: [
                ['`created`', 'Before the element\'s attributes or listeners are applied'],
                ['`beforeMount` / `mounted`', 'Before / after the element is inserted into the DOM'],
                ['`beforeUpdate` / `updated`', 'Before / after the element or its children update'],
                ['`beforeUnmount` / `unmounted`', 'Before / after the element is removed'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Reach for a custom directive only for low-level DOM work on a plain element. If the reusable thing is stateful logic or renders markup, a composable or a component is the better tool. Libraries like VueUse already provide ready-made directives (`v-on-click-outside`, `v-element-visibility`).',
            },
          ],
        },
        {
          id: 'reactivity-internals',
          title: 'How Vue 3 Reactivity Works Inside',
          summary:
            'Vue 3 reactivity is built on JavaScript Proxies. When code reads a reactive property Vue **tracks** who is reading; when the property is written Vue **triggers** those readers to run again. Understanding this explains almost every reactivity pitfall.',
          keyPoints: [
            'A **Proxy** is a JavaScript object that wraps another object and lets you intercept reading (`get`) and writing (`set`) of its properties. `reactive()` returns such a Proxy.',
            '**Track**: during a `get`, Vue records "the currently running effect depends on this property". **Trigger**: during a `set`, Vue re-runs all effects that depend on that property.',
            'An **effect** is a function Vue can re-run when its dependencies change. Rendering a component, a `computed`, and a `watch` are all effects.',
            '`ref` works with a plain class using a getter/setter on `.value` (a Proxy is not needed for a single value). Vue only tracks reads that actually happen while an effect runs.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine a notebook at a coffee shop. Every time a customer (an effect) asks for the price of "latte" (reads a property), the barista writes the customer\'s name next to "latte". Later, when the price changes (a write), the barista goes through the names next to "latte" and tells exactly those people. Nobody who never asked about latte is disturbed. Vue\'s dependency tracking is that notebook.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant E as Effect render function
    participant P as Reactive Proxy
    participant D as Dependency map
    E->>P: reads state.count (get trap)
    P->>D: track - record that E depends on count
    P-->>E: returns the value
    Note over D: count is now linked to E
    E->>P: later code sets state.count = 5 (set trap)
    P->>D: trigger - find effects depending on count
    D->>E: schedule E to run again
    E->>P: re-reads state.count, gets 5`,
            },
            {
              type: 'heading',
              text: 'A tiny working version (about 30 lines)',
            },
            {
              type: 'code',
              language: 'js',
              title: 'mini-reactivity.js: the idea in plain JavaScript',
              code: `// target object -> (property key -> set of effects that depend on it)
const targetMap = new WeakMap()
let activeEffect = null            // the effect that is running right now

function track(target, key) {
  if (!activeEffect) return        // nobody is reading on behalf of an effect
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)            // "this effect depends on this key"
}

function trigger(target, key) {
  const dep = targetMap.get(target)?.get(key)
  dep && dep.forEach(effect => effect())     // re-run everyone who depends on it
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)                      // someone reads: remember them
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)                    // someone writes: notify
      return result
    },
  })
}

function effect(fn) {
  activeEffect = fn
  fn()                              // first run collects the dependencies
  activeEffect = null
}

// try it
const state = reactive({ count: 0, name: 'Ada' })
effect(() => console.log('count is', state.count))   // logs: count is 0
state.count++                                         // logs: count is 1
state.name = 'Bob'                                    // logs nothing: effect never read name`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'how ref differs: a getter/setter pair',
              code: `function ref(initial) {
  const r = {
    _value: initial,
    get value() {
      track(r, 'value')
      return r._value
    },
    set value(newValue) {
      r._value = newValue
      trigger(r, 'value')
    },
  }
  return r
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The real implementation is more advanced: it cleans up stale dependencies on every run, batches updates so a component renders once after many changes, handles arrays, `Map` and `Set`, nested effects, and since Vue 3.5 stores dependencies in a doubly linked list with version counters, which cut memory use significantly. The principle, track on read and trigger on write, is unchanged.',
            },
            {
              type: 'heading',
              text: 'What this explains',
            },
            {
              type: 'table',
              headers: ['Symptom', 'Why it happens (internals)', 'Fix'],
              rows: [
                ['Destructured `const { count } = state` stops updating', 'The read happened once, outside an effect, and the result is a plain number. No Proxy is involved after that.', '`toRefs(state)` or read through `state.count` inside the effect'],
                ['Replacing `state = reactive({...})` breaks the UI', 'Effects tracked the old Proxy\'s properties; the new object has no subscribers', 'Mutate properties or use a `ref`'],
                ['Adding a new property still works in Vue 3', 'A Proxy sees every `set`, even for new keys (Vue 2 used `defineProperty` and needed `Vue.set`)', 'Nothing to fix; no `Vue.set` needed'],
                ['A value read after `await` in `watchEffect` is not tracked', '`activeEffect` is only set during the synchronous part of the run', 'Read values before `await`'],
                ['Putting a class instance in `reactive` behaves oddly', 'Proxy returns a wrapped copy, so `===` comparisons with the raw object fail', '`toRaw()`, `markRaw()`, or keep it out of reactive state'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["State written<br/>state.count = 5"] --> B["set trap fires<br/>trigger count"]
    B --> C["Effects depending on count<br/>queued, duplicates removed"]
    C --> D["Scheduler flushes queue<br/>on next tick"]
    D --> E["Component render effect re-runs"]
    D --> F["computed marked dirty"]
    D --> G["watch callbacks run"]
    E --> H["New virtual DOM compared<br/>real DOM patched"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The queue is why several changes in one function cost only one re-render: `a.value++; b.value++; c.value++` marks the component\'s render effect as stale three times, but it runs once, on the next microtask. This also explains why DOM reads right after a write show old values until `await nextTick()`.',
            },
          ],
        },
        {
          id: 'rendering-virtual-dom',
          title: 'Rendering: Templates, the Virtual DOM and the Compiler',
          summary:
            'Vue compiles your template into a render function that builds a lightweight tree of JavaScript objects (the virtual DOM), compares it with the previous tree, and updates only the real DOM nodes that differ. The compiler adds hints that make this much faster than a blind comparison.',
          keyPoints: [
            'The **DOM** (Document Object Model) is the browser\'s live tree of page elements. Touching it is comparatively slow, so frameworks minimise how much they change.',
            'A **virtual node (vnode)** is a plain JavaScript object describing an element: its tag, props and children. A **virtual DOM** is a tree of such objects. Creating and comparing them is cheap.',
            '**Patching**: after state changes, Vue builds a new vnode tree, diffs it against the old one, and applies only the differences to the real DOM.',
            'Vue\'s compiler analyses your template ahead of time and marks what can change (**patch flags**), hoists static content, and groups dynamic nodes into **blocks**, so most updates skip diffing static parts entirely.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    T["Template<br/>HTML-like"] -->|"compiler at build time"| R["Render function<br/>returns vnodes"]
    R -->|"runs on state change"| V["New vnode tree"]
    V -->|"diff vs old tree"| P["Patch operations"]
    P --> D["Real DOM updated<br/>only changed nodes"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'what a vnode looks like (simplified)',
              code: `// <p class="title">Hello</p> becomes roughly:
const vnode = {
  type: 'p',
  props: { class: 'title' },
  children: 'Hello',
}

// You can write render functions by hand with h(), but templates are
// usually better because the compiler can optimise them.
import { h } from 'vue'
const Manual = { render: () => h('p', { class: 'title' }, 'Hello') }`,
            },
            {
              type: 'heading',
              text: 'What the compiler does for you',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'a template...',
              code: `<template>
  <div>
    <h1>Static title</h1>
    <p>{{ message }}</p>
    <button :class="{ active: on }" @click="toggle">Go</button>
  </div>
</template>`,
            },
            {
              type: 'code',
              language: 'js',
              title: '...and (simplified) compiled output',
              code: `import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode,
         normalizeClass as _normalizeClass, openBlock as _openBlock,
         createElementBlock as _createElementBlock } from 'vue'

// 1. Static hoisting: this vnode never changes, so it is created ONCE
const _hoisted_1 = _createElementVNode('h1', null, 'Static title', -1 /* HOISTED */)

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock('div', null, [
    _hoisted_1,                                           // reused, never re-diffed
    // 2. Patch flag 1 = TEXT: only the text of this <p> can change
    _createElementVNode('p', null, _toDisplayString(_ctx.message), 1 /* TEXT */),
    // 3. Patch flag 10 = CLASS + PROPS: only class and the click handler matter
    _createElementVNode('button', {
      class: _normalizeClass({ active: _ctx.on }),
      onClick: _ctx.toggle,
    }, 'Go', 10 /* CLASS, PROPS */),
  ]))
}
// 4. The enclosing "block" keeps a flat list of just the dynamic nodes
//    (p and button), so an update loops over 2 nodes instead of walking the tree.`,
            },
            {
              type: 'table',
              headers: ['Optimisation', 'What it means in plain words', 'Benefit'],
              rows: [
                ['Static hoisting', 'Parts of a template that can never change are created once, outside the render function', 'No re-creation or comparison of static markup'],
                ['Patch flags', 'Each dynamic node is labelled with *what* may change (text, class, props...)', 'The diff checks only that one thing instead of every attribute'],
                ['Block tree', 'Dynamic descendants are collected in a flat array on the nearest block root', 'Updates skip the static parts of the tree entirely'],
                ['Handler caching', 'Inline event handlers are cached between renders', 'Fewer needless prop changes on child components'],
                ['Component-level updates', 'Vue re-renders only components whose reactive dependencies changed', 'A change in one component does not re-render its siblings'],
              ],
            },
            {
              type: 'heading',
              text: 'Keys and the diff algorithm',
            },
            {
              type: 'p',
              text: 'When children are lists, Vue compares old and new children. With `key`s it can tell "this row moved" from "this row was replaced"; without keys it patches rows in place by position, which can be both slower and wrong for stateful rows. For long lists Vue uses an algorithm that finds the longest increasing subsequence of positions, so it moves as few DOM nodes as possible.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Because of these optimisations, a template is usually **faster** than a hand-written render function or JSX, which Vue cannot analyse. Use `h()` or JSX only when you need genuinely dynamic structure. The same compile-time knowledge is the basis for the experimental Vapor mode (covered in the last topic), which skips the virtual DOM entirely.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Why not update the real DOM directly on every change? You can, and Svelte/Solid style frameworks do it with compile-time analysis. The virtual DOM trades a little CPU for flexibility and a simple mental model: your render logic is just "state in, tree out". Vue gets most of the performance of direct updates through the compiler hints above.',
            },
          ],
        },
        {
          id: 'vue-router',
          title: 'Vue Router: Pages in a Single-Page App',
          summary:
            'Vue Router maps URLs to components so one HTML page can behave like many pages without full reloads. It supports dynamic params, nested routes, named routes, redirects and 404 pages.',
          keyPoints: [
            'A **single-page application (SPA)** loads one HTML page and swaps components as the URL changes. Vue Router does the URL matching; `<RouterView />` is where the matched component is rendered; `<RouterLink>` renders navigation links.',
            'Create it with `createRouter({ history, routes })`. Use `createWebHistory()` for clean URLs (needs server fallback to `index.html`) or `createWebHashHistory()` for `#/path` URLs that work on any static host.',
            'Dynamic segments like `/users/:id` expose the value in `route.params.id`. `useRoute()` reads the current route (reactive); `useRouter()` navigates programmatically (`router.push`).',
            'Nested routes use `children` and a nested `<RouterView>`, which is how layouts (a sidebar that stays while the content changes) are built.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'src/router/index.js',
              code: `import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },

    // dynamic segment: /users/42 -> params.id = '42' (always a string!)
    {
      path: '/users/:id',
      name: 'user',
      component: () => import('@/views/UserView.vue'),   // lazy-loaded chunk
      props: true,                                        // pass params as props
    },

    // nested routes: UserLayout renders a <RouterView> for its children
    {
      path: '/account',
      component: () => import('@/layouts/AccountLayout.vue'),
      children: [
        { path: '', redirect: { name: 'profile' } },
        { path: 'profile', name: 'profile', component: () => import('@/views/Profile.vue') },
        { path: 'billing', name: 'billing', component: () => import('@/views/Billing.vue') },
      ],
    },

    { path: '/old-url', redirect: '/' },

    // catch-all 404 must be last
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') },
  ],
})

export default router`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'App.vue: links and the place where pages render',
              code: `<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <!-- RouterLink adds the router-link-active class automatically -->
    <RouterLink to="/">Home</RouterLink>
    <RouterLink :to="{ name: 'user', params: { id: 42 } }">User 42</RouterLink>
    <RouterLink :to="{ path: '/account/billing', query: { tab: 'invoices' } }">Billing</RouterLink>
  </nav>

  <RouterView />   <!-- the matched component appears here -->
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'UserView.vue: reading params and navigating in code',
              code: `<script setup>
import { watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()      // reactive: updates when the URL changes
const router = useRouter()    // the navigator
const user = ref(null)

// IMPORTANT: going from /users/1 to /users/2 REUSES this component,
// so onMounted would not run again. Watch the param instead.
watch(
  () => route.params.id,
  async (id) => { user.value = await (await fetch('/api/users/' + id)).json() },
  { immediate: true }
)

function goBack() { router.back() }
function openBilling() { router.push({ name: 'billing', query: { from: 'user' } }) }
function replaceUrl() { router.replace('/') }   // no new history entry
</script>

<template>
  <h1>User {{ route.params.id }} (page {{ route.query.page ?? 1 }})</h1>
  <button @click="goBack">Back</button>
</template>`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    U["URL changes<br/>link click or push"] --> M["Router matches path<br/>against route table"]
    M --> G["Run navigation guards"]
    G --> L["Load lazy component chunk"]
    L --> RV["RouterView renders<br/>matched component"]
    M -->|"no match"| NF["catch-all route<br/>404 page"]`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`route.params.id` is always a **string**, even for `/users/42`. Compare with `Number(route.params.id)`, or use route `props` with a function (`props: route => ({ id: Number(route.params.id) })`). And never destructure `useRoute()` (`const { params } = useRoute()`): it breaks reactivity just like destructuring `reactive`. Also reusing the same component across param changes is the #1 source of "my page does not update" bugs.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'With `createWebHistory`, a user who refreshes at `/users/42` makes the browser ask your server for `/users/42`, which has no such file. Configure the host to serve `index.html` for unknown paths (a "fallback"), or the user sees a 404 from the server.',
            },
          ],
        },
        {
          id: 'router-guards-lazy',
          title: 'Navigation Guards, Meta Fields and Lazy Loading',
          summary:
            'Navigation guards are functions that run during a route change and can allow, block, or redirect it. Together with `meta` fields they power login protection, unsaved-changes warnings and permission checks.',
          keyPoints: [
            'A guard returns `undefined` or `true` to allow navigation, `false` to cancel, or a route location (`{ name: \'login\' }`) to redirect. They can be `async`.',
            'Global guards: `router.beforeEach` (before every navigation), `beforeResolve`, `afterEach` (no ability to cancel; good for analytics and page titles). Per-route: `beforeEnter`. In components: `onBeforeRouteLeave`, `onBeforeRouteUpdate`.',
            '`meta` is a free-form object on a route, such as `{ requiresAuth: true, roles: [\'admin\'] }`, which guards read to decide what to do.',
            'Guards in the browser are for **user experience**, not security: anyone can change client code. The server must always enforce permissions on its API.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'protecting routes with meta and a global guard',
              code: `import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/Login.vue') },
    {
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true, title: 'Dashboard' },
    },
    {
      path: '/admin',
      component: () => import('@/views/Admin.vue'),
      meta: { requiresAuth: true, roles: ['admin'] },
      // per-route guard: runs only for this route
      beforeEnter: (to, from) => {
        const auth = useAuthStore()
        if (!auth.isAdmin) return { name: 'home' }
      },
    },
  ],
})

router.beforeEach(async (to, from) => {
  // IMPORTANT: call useAuthStore() INSIDE the guard, not at the top of the file,
  // because Pinia is not installed yet when this module is first loaded.
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // send them to login, remembering where they wanted to go
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // returning nothing (undefined) allows the navigation
})

router.afterEach((to) => {
  document.title = to.meta.title ? to.meta.title + ' | MyApp' : 'MyApp'
})

export default router`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["Navigation triggered"] --> B["beforeRouteLeave<br/>in components being left"]
    B --> C["Global beforeEach"]
    C --> D["beforeRouteUpdate<br/>in reused components"]
    D --> E["beforeEnter<br/>in route config"]
    E --> F["Resolve lazy components"]
    F --> G["beforeRouteEnter<br/>in entering components"]
    G --> H["Global beforeResolve"]
    H --> I["Navigation confirmed<br/>URL updates"]
    I --> J["Global afterEach"]
    J --> K["DOM updates"]
    C -.->|"return false or a redirect"| X["Navigation cancelled or redirected"]`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'warn about unsaved changes inside a component',
              code: `<script setup>
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const draft = ref('')
const saved = ref(true)

onBeforeRouteLeave(() => {
  if (!saved.value) {
    const leave = window.confirm('You have unsaved changes. Leave anyway?')
    if (!leave) return false           // cancel the navigation
  }
})
</script>

<template>
  <textarea v-model="draft" @input="saved = false" />
  <button @click="saved = true">Save</button>
</template>`,
            },
            {
              type: 'heading',
              text: 'Lazy loading and scroll behaviour',
            },
            {
              type: 'p',
              text: 'Writing `component: () => import(\'./View.vue\')` (a **dynamic import**) tells the bundler to put that view in its own file, downloaded only on first visit. This keeps the first page load small. You can also name chunks with a comment so related views are bundled together.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'bundling related routes and restoring scroll',
              code: `const routes = [
  // eager: part of the main bundle (small, always needed)
  { path: '/', component: HomeView },

  // lazy: separate file loaded on demand
  { path: '/reports', component: () => import('@/views/Reports.vue') },

  // group several views into one downloaded chunk called "admin"
  { path: '/admin/users', component: () => import(/* webpackChunkName: "admin" */ '@/views/AdminUsers.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition          // back/forward button
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A guard that returns `{ name: \'login\' }` for a route that is itself guarded can cause an infinite redirect loop. Make sure the login route is reachable (no `requiresAuth`), and if you check `to.name !== \'login\'` explicitly, do it first. Also remember: hiding the admin page in the router does not protect your data. A user can still call the API, so the backend must verify permissions.',
            },
          ],
        },
        {
          id: 'state-when-store',
          title: 'State Management: Do You Even Need a Store?',
          summary:
            '**State** is the data your app remembers (the logged-in user, a cart, a selected filter). Most state belongs inside one component. A store is for state that many distant components share. Choose the simplest tool that works.',
          keyPoints: [
            'Start local: keep state in the component that uses it. Share by props down and events up between parent and child.',
            'When distant components need the same data, climb a ladder: provide/inject, then a composable with shared (module-level) state, then a real store such as **Pinia**.',
            'Distinguish **client state** (UI state you own: sidebar open, wizard step, theme) from **server state** (data that lives on a server and you cache a copy of: lists, user profiles). Server state is better handled by TanStack Query than by a store.',
            'Putting everything in a global store is a common beginner mistake: it makes components dependent on global data and harder to reuse and test.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TD
    A["I have some state"] --> B{"Used by one<br/>component only?"}
    B -->|"yes"| L["Local ref in the component"]
    B -->|"no"| C{"Parent and direct children?"}
    C -->|"yes"| PE["Props down, emits up"]
    C -->|"no"| D{"Data comes from a server<br/>and needs caching or refetching?"}
    D -->|"yes"| TQ["TanStack Query or a data composable"]
    D -->|"no"| E{"Only a branch of the tree needs it,<br/>one clear owner?"}
    E -->|"yes"| PI["provide / inject"]
    E -->|"no, app-wide or many screens"| F{"Small and simple?"}
    F -->|"yes"| CS["Composable with shared state"]
    F -->|"no, needs devtools, structure, persistence"| ST["Pinia store"]`,
            },
            {
              type: 'heading',
              text: 'The ladder, from simplest to most structured',
            },
            {
              type: 'table',
              headers: ['Step', 'Tool', 'Good for', 'Watch out for'],
              rows: [
                ['1', 'Local `ref` / `reactive`', 'State only one component needs', 'Not shareable'],
                ['2', 'Props and emits', 'Parent to child and back', 'Prop drilling through many layers'],
                ['3', 'provide / inject', 'Context for a subtree (theme, form group)', 'Hidden dependencies, no devtools timeline'],
                ['4', 'Composable with shared state', 'Small app-wide state (current theme, toasts)', 'Shared state is a module singleton: problematic for SSR and tests'],
                ['5', 'Pinia store', 'Real app-wide state: auth, cart, settings', 'Over-use for server data or purely local state'],
                ['6', 'TanStack Query', 'Server data: fetching, caching, refetching, mutations', 'It is not a place for UI-only state'],
              ],
            },
            {
              type: 'heading',
              text: 'Step 4 in code: a shared composable',
            },
            {
              type: 'code',
              language: 'js',
              title: 'composables/useToasts.js: state declared OUTSIDE the function is shared',
              code: `import { ref, readonly } from 'vue'

// Module scope: created once, shared by every component that imports this file
const toasts = ref([])
let nextId = 1

export function useToasts() {
  function show(message, ms = 3000) {
    const id = nextId++
    toasts.value.push({ id, message })
    setTimeout(() => dismiss(id), ms)
  }
  function dismiss(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
  // expose a read-only view so components cannot mutate the array directly
  return { toasts: readonly(toasts), show, dismiss }
}

// ComponentA: const { show } = useToasts(); show('Saved!')
// ToastHost:  const { toasts } = useToasts()   -> sees the same array`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Module-level shared state is created **once per JavaScript process**. In a browser SPA that is fine. With server-side rendering (SSR) the server process is shared by all visitors, so one user\'s data could leak into another user\'s page. Tests also share it between test cases unless you reset it. This is a main reason to graduate to Pinia, which creates a fresh store instance per app.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A useful rule: if you cannot name two unrelated components that must see the same value, you probably do not need a store yet. Also resist copying server data into a store "just in case"; two copies of the truth drift apart.',
            },
          ],
        },
        {
          id: 'pinia-basics',
          title: 'Pinia: the Official Store (Basics)',
          summary:
            'Pinia is the state management library recommended by the Vue team. A store is an object holding **state** (data), **getters** (derived data, like computed) and **actions** (functions that change state, like methods), shared by every component that uses it.',
          keyPoints: [
            'Create a store with `defineStore(\'id\', ...)`. The id must be unique; by convention the returned function is named `useXxxStore`.',
            'Two styles: **Setup stores** (a function using `ref`, `computed`, functions, just like a composable) and **Options stores** (`{ state, getters, actions }`, familiar from Vuex and the Options API).',
            'Unlike Vuex, Pinia has **no mutations**: you can change state directly or inside actions. It has first-class TypeScript support, a tiny size, and no namespaced modules (each store is already separate).',
            'Install once: `app.use(createPinia())`. Use in components: `const cart = useCartStore()`.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    C["Component<br/>user clicks Add"] -->|"calls"| A["Store action<br/>addItem()"]
    A -->|"changes"| S["Store state<br/>items array"]
    S -->|"derives"| G["Getters<br/>total, count"]
    S -->|"read by"| C
    G -->|"read by"| C
    S -.->|"observed by"| DT["Vue DevTools<br/>timeline"]`,
            },
            {
              type: 'heading',
              text: 'Setup store: the style that matches the Composition API',
            },
            {
              type: 'code',
              language: 'js',
              title: 'stores/cart.js (setup style)',
              code: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ref()       -> state
  const items = ref([])
  const coupon = ref(null)

  // computed()  -> getters
  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  const total = computed(() => coupon.value ? subtotal.value * (1 - coupon.value.percent / 100) : subtotal.value)

  // function() -> actions
  function addItem(product) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) existing.qty++
    else items.value.push({ ...product, qty: 1 })
  }
  function removeItem(id) {
    items.value = items.value.filter(i => i.id !== id)
  }
  async function checkout() {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.value }),
    })
    if (!res.ok) throw new Error('Checkout failed')
    items.value = []
  }
  // setup stores must RETURN everything that should be public
  return { items, coupon, count, subtotal, total, addItem, removeItem, checkout }
})`,
            },
            {
              type: 'heading',
              text: 'Options store: the same idea in the Vuex-like style',
            },
            {
              type: 'code',
              language: 'js',
              title: 'stores/counter.js (options style)',
              code: `import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Counter' }),      // a function returning the initial state

  getters: {
    double: (state) => state.count * 2,
    // use "this" (with a return type in TS) to read another getter
    doublePlusOne() { return this.double + 1 },
  },

  actions: {
    increment() { this.count++ },                    // "this" is the store
    async loadFromServer() {
      const res = await fetch('/api/count')
      this.count = (await res.json()).value
    },
  },
})`,
            },
            {
              type: 'heading',
              text: 'Using a store in a component',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'CartButton.vue',
              code: `<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

// State and getters: destructure with storeToRefs to KEEP reactivity
const { items, count, total } = storeToRefs(cart)

// Actions are plain functions: destructure them directly
const { addItem, removeItem } = cart
</script>

<template>
  <button @click="addItem({ id: 1, name: 'Mug', price: 12 })">Add mug</button>
  <p>{{ count }} items, total {{ total }}</p>
  <ul>
    <li v-for="i in items" :key="i.id">
      {{ i.name }} x {{ i.qty }}
      <button @click="removeItem(i.id)">remove</button>
    </li>
  </ul>
</template>`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The store is a `reactive` object, so `const { count, total } = useCartStore()` breaks reactivity exactly like destructuring `reactive`. Always use `storeToRefs(store)` for state and getters. Actions are fine to destructure because they are plain functions bound to the store.',
            },
            {
              type: 'heading',
              text: 'Setup vs options stores',
            },
            {
              type: 'table',
              headers: ['', 'Setup store', 'Options store'],
              rows: [
                ['Looks like', 'A composable: `ref`, `computed`, functions', 'Vuex-like object with `state`, `getters`, `actions`'],
                ['Flexibility', 'High: can use watchers, other composables, `inject`', 'Limited to the three sections'],
                ['`$reset()` built in', 'No: you must write your own reset function', 'Yes'],
                ['Must return public members', 'Yes (and return **all** state for DevTools and SSR to work)', 'No'],
                ['Best for', 'New code, complex logic, sharing composables', 'Simple stores, teams migrating from Vuex'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Pinia allows direct mutation: `cart.coupon = null` or `cart.items.push(x)` from a component works and is tracked by DevTools. A good habit is still to route non-trivial changes through actions, so rules live in one place and are easy to test. For changing several fields at once use `cart.$patch({ coupon: null, items: [] })`.',
            },
          ],
        },
        {
          id: 'pinia-advanced',
          title: 'Pinia in Depth: Subscriptions, Plugins, Persistence, DevTools',
          summary:
            'Beyond the basics, Pinia lets you observe changes (`$subscribe`, `$onAction`), extend every store with plugins, persist state to storage, compose stores, and inspect everything in Vue DevTools with time travel.',
          keyPoints: [
            '`store.$subscribe(callback)` runs after state changes; `store.$onAction(callback)` wraps every action call so you can log, time, or catch errors.',
            'A **plugin** is a function `({ store }) => ...` registered with `pinia.use()` that can add properties, wrap actions, or react to changes in **every** store.',
            '**pinia-plugin-persistedstate** is the popular community plugin that saves selected state to `localStorage` or `sessionStorage` and restores it at startup.',
            'Stores can use other stores by calling `useOtherStore()` **inside** an action or getter (not at module top level), which avoids circular import problems.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Watching a store',
            },
            {
              type: 'code',
              language: 'js',
              title: '$subscribe and $onAction',
              code: `import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

// 1. State subscription: any state change. {detached:true} keeps it alive after
//    the component that created it unmounts.
cart.$subscribe((mutation, state) => {
  // mutation.type: 'direct' | 'patch object' | 'patch function'
  // mutation.storeId: 'cart'
  localStorage.setItem('cart-backup', JSON.stringify(state.items))
}, { detached: true })

// 2. Action subscription: runs when any action is CALLED
const unsubscribe = cart.$onAction(({ name, args, after, onError }) => {
  const started = Date.now()
  console.log('action', name, 'with', args)

  after((result) => console.log(name, 'finished in', Date.now() - started, 'ms'))
  onError((error) => console.error(name, 'failed:', error))
})

// later: unsubscribe()  stops listening`,
            },
            {
              type: 'heading',
              text: 'Stores that use other stores',
            },
            {
              type: 'code',
              language: 'js',
              title: 'cross-store usage: call the other store inside the action',
              code: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { useCartStore } from './cart'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref([])

  async function placeOrder() {
    // call useXxxStore() INSIDE the function, when Pinia is ready
    const auth = useAuthStore()
    const cart = useCartStore()
    if (!auth.isLoggedIn) throw new Error('Please log in')

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' },
      body: JSON.stringify(cart.items),
    })
    orders.value.push(await res.json())
    cart.items = []
  }
  return { orders, placeOrder }
})`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Two stores that read each other\'s **state during setup** (at the top of the setup function) create an infinite loop, because each needs the other to exist first. Reading inside actions or computed getters, as above, avoids it. If both truly depend on each other, you probably have one store too many.',
            },
            {
              type: 'heading',
              text: 'Plugins',
            },
            {
              type: 'code',
              language: 'js',
              title: 'a plugin that adds a logger and a reset to every store',
              code: `import { createPinia } from 'pinia'

function loggerPlugin({ store, options }) {
  // runs once for each store when it is created

  // 1. add a property to every store
  store.createdAt = Date.now()

  // 2. react to every store's state changes
  store.$subscribe((mutation) => {
    console.log('[' + store.$id + ']', mutation.type)
  })

  // 3. a generic $reset for setup stores: remember the initial state
  const initial = JSON.parse(JSON.stringify(store.$state))
  store.$resetDeep = () => store.$patch(JSON.parse(JSON.stringify(initial)))
}

const pinia = createPinia()
pinia.use(loggerPlugin)
export default pinia`,
            },
            {
              type: 'heading',
              text: 'Persisting state with pinia-plugin-persistedstate',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'install',
              code: `npm install pinia-plugin-persistedstate`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'register the plugin and opt stores in',
              code: `// main.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// stores/settings.js: SETUP store, options go in the 3rd argument
export const useSettingsStore = defineStore('settings', () => {
  const theme = ref('light')
  const language = ref('en')
  const tempBanner = ref(null)     // we do not want this one saved
  return { theme, language, tempBanner }
}, {
  persist: {
    key: 'my-app-settings',        // storage key (default: the store id)
    storage: localStorage,         // or sessionStorage
    pick: ['theme', 'language'],   // save only these (older versions called this "paths")
  },
})

// stores/counter.js: OPTIONS store, "persist" goes inside the object
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  persist: true,                   // simplest form: save everything to localStorage
})`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never persist secrets such as access tokens to `localStorage` without thinking: any script on the page (including an XSS attack) can read it. Persist only non-sensitive preferences, or keep auth in secure `HttpOnly` cookies that JavaScript cannot read. Also, option names changed between major versions of the plugin (for example `paths` became `pick`), so check the version you installed.',
            },
            {
              type: 'heading',
              text: 'Devtools and hot reload',
            },
            {
              type: 'list',
              items: [
                'The **Vue DevTools** browser extension shows every Pinia store, its state and getters, lets you edit state live, and has a timeline that records each mutation and action call so you can see exactly what changed and when. A store appears in DevTools only after a component has called it.',
                'Add `import.meta.hot` handling so editing a store keeps your running state during development: `if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))` (`acceptHMRUpdate` comes from `pinia`).',
                'Because Pinia exposes state as plain reactive data, you can read `useCartStore().$state` in the console while debugging.',
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    subgraph Store["Pinia store lifecycle"]
      I["defineStore called<br/>first useStore"] --> P["Plugins run on the new store"]
      P --> U["Store is ready<br/>state getters actions"]
      U --> A["Action called"]
      A --> OA["onAction callbacks<br/>before after onError"]
      A --> M["State mutated"]
      M --> SB["subscribe callbacks"]
      SB --> DT["DevTools timeline entry"]
    end`,
            },
          ],
        },
        {
          id: 'pinia-testing-ssr',
          title: 'Pinia: Testing, Use Outside Components, and SSR Caveats',
          summary:
            'Stores are plain functions, so they are easy to unit-test. Use `setActivePinia(createPinia())` for store tests, `createTestingPinia` for component tests, and know the rules for calling stores outside components and in server-side rendering.',
          keyPoints: [
            'To test a store alone: create a fresh Pinia with `setActivePinia(createPinia())` in `beforeEach` so tests do not share state.',
            'To test a component that uses stores: mount it with `createTestingPinia()` from `@pinia/testing`. It stubs every action (so no real API calls) and lets you set initial state.',
            'Outside components (router guards, interceptors, plain modules), call `useXxxStore()` **inside a function that runs after** `app.use(pinia)`, or pass the pinia instance: `useXxxStore(pinia)`.',
            'In SSR, create a **new Pinia instance per request** and never keep state in module-level variables; otherwise users could see each other\'s data.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'cart.spec.js: unit-testing a store with Vitest',
              code: `import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'

describe('cart store', () => {
  beforeEach(() => {
    // a brand-new Pinia for every test, so no leftover state
    setActivePinia(createPinia())
  })

  it('adds a new item', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Mug', price: 12 })
    expect(cart.items).toHaveLength(1)
    expect(cart.count).toBe(1)
  })

  it('increases quantity for the same product', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Mug', price: 12 })
    cart.addItem({ id: 1, name: 'Mug', price: 12 })
    expect(cart.items[0].qty).toBe(2)
    expect(cart.subtotal).toBe(24)
  })

  it('applies a coupon in the total getter', () => {
    const cart = useCartStore()
    cart.addItem({ id: 1, name: 'Mug', price: 100 })
    cart.coupon = { percent: 10 }
    expect(cart.total).toBe(90)
  })
})`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'CartButton.spec.js: testing a component with createTestingPinia',
              code: `import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CartButton from '@/components/CartButton.vue'
import { useCartStore } from '@/stores/cart'

describe('CartButton', () => {
  it('calls addItem when clicked and shows the count', async () => {
    const wrapper = mount(CartButton, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,                 // use vi.fn for spies (not needed if globals are on)
            initialState: { cart: { items: [{ id: 1, name: 'Mug', price: 12, qty: 2 }] } },
            // stubActions defaults to true: actions are spies, they do NOT run the real code
          }),
        ],
      },
    })

    const cart = useCartStore()               // the same store instance the component uses
    expect(wrapper.text()).toContain('2 items')

    await wrapper.find('button').trigger('click')
    expect(cart.addItem).toHaveBeenCalledTimes(1)
  })
})`,
            },
            {
              type: 'heading',
              text: 'Using a store outside a component',
            },
            {
              type: 'code',
              language: 'js',
              title: 'axios interceptor and router guard',
              code: `import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// WRONG: running useAuthStore() at the top of the module
// const auth = useAuthStore()   // error: "getActivePinia() was called but there was no active Pinia"
//                                  because this file is imported before app.use(pinia) runs

// RIGHT: call it when the request actually happens (Pinia is installed by then)
axios.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = 'Bearer ' + auth.token
  return config
})

// Also RIGHT: pass the instance explicitly where you have it
// import pinia from '@/pinia'
// const auth = useAuthStore(pinia)`,
            },
            {
              type: 'heading',
              text: 'Server-side rendering (SSR) caveats',
            },
            {
              type: 'list',
              items: [
                '**SSR** means a Node server renders your app to an HTML string for each request, so the page appears fast and is readable by search engines. The browser then **hydrates** it (attaches Vue to the existing HTML).',
                'On the server, create `createPinia()` **inside the per-request function**, not once at the top of the module. A single shared instance would mix state between visitors.',
                'Pinia serialises `pinia.state.value` into the HTML and the browser restores it before hydration, so the client starts with the same data the server used. Only JSON-friendly data (no functions, class instances, `Map`) survives this.',
                'Do not touch `window`, `localStorage` or `document` while a store is being set up, because they do not exist on the server. Do it inside `onMounted` or guard with `typeof window !== \'undefined\'`. Frameworks such as **Nuxt** wire all of this up for you with `@pinia/nuxt`.',
              ],
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant B as Browser
    participant S as Server
    B->>S: GET /products
    S->>S: new Pinia for THIS request
    S->>S: components fill the store
    S-->>B: HTML plus serialised pinia state
    B->>B: createPinia and restore the state
    B->>B: hydrate - Vue attaches to existing HTML`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If you do not want the real action to be stubbed in a component test (for example you want to test integration with a mocked `fetch`), pass `createTestingPinia({ stubActions: false })`. You can also override a getter in a test by assigning it, because the testing Pinia makes getters writable.',
            },
          ],
        },
        {
          id: 'vuex-legacy',
          title: 'Vuex: the Legacy Official Store',
          summary:
            'Vuex was the original official store for Vue. It enforces a strict flow: components **dispatch** actions, actions **commit** mutations, and mutations are the only code allowed to change state. Vuex 4 supports Vue 3, but it is in maintenance mode and Pinia is now the recommended choice for new projects.',
          keyPoints: [
            '**State** holds data; **getters** derive data (like computed); **mutations** are synchronous functions that change state; **actions** can be asynchronous and call mutations through `commit`; **modules** split a big store into pieces.',
            'Mutations exist so every state change is a small, synchronous, named event. DevTools can then record each one and let you time-travel (replay and undo states).',
            'Because everything funnels through string names (`\'cart/ADD_ITEM\'`), Vuex needs a lot of ceremony and has weak TypeScript support. This was the main motivation for Pinia.',
            'You will still meet Vuex in many existing Vue 2 and early Vue 3 apps, so recognising it matters.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    C["Component"] -->|"dispatch"| A["Action<br/>async work, API calls"]
    A -->|"commit"| M["Mutation<br/>sync, only way to change state"]
    M -->|"mutates"| S["State"]
    S -->|"re-render"| C
    S -.->|"records each mutation"| DT["DevTools<br/>time travel"]
    A -->|"API"| BE["Backend server"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'store/index.js: a root store plus a namespaced cart module',
              code: `import { createStore } from 'vuex'

const cart = {
  namespaced: true,                       // keys become 'cart/ADD_ITEM', 'cart/total', ...

  state: () => ({
    items: [],
    status: 'idle',
  }),

  getters: {
    count: (state) => state.items.reduce((n, i) => n + i.qty, 0),
    total: (state) => state.items.reduce((s, i) => s + i.price * i.qty, 0),
    // getters can use other getters and the root state
    summary: (state, getters, rootState) => rootState.user.name + ': ' + getters.count + ' items',
  },

  // MUTATIONS: synchronous only, the single place state is allowed to change
  mutations: {
    ADD_ITEM(state, product) {
      const existing = state.items.find(i => i.id === product.id)
      if (existing) existing.qty++
      else state.items.push({ ...product, qty: 1 })
    },
    SET_ITEMS(state, items) { state.items = items },
    SET_STATUS(state, status) { state.status = status },
  },

  // ACTIONS: can be async, call mutations through commit
  actions: {
    async fetchCart({ commit }) {
      commit('SET_STATUS', 'loading')
      try {
        const res = await fetch('/api/cart')
        commit('SET_ITEMS', await res.json())
        commit('SET_STATUS', 'idle')
      } catch (e) {
        commit('SET_STATUS', 'error')
      }
    },
    addAndSync({ commit, state }, product) {
      commit('ADD_ITEM', product)
      return fetch('/api/cart', { method: 'PUT', body: JSON.stringify(state.items) })
    },
  },
}

export default createStore({
  state: () => ({ user: { name: 'Guest' } }),
  mutations: { SET_USER(state, user) { state.user = user } },
  modules: { cart },
})`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'main.js',
              code: `import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

createApp(App).use(store).mount('#app')`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'using Vuex in a component (Composition API)',
              code: `<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// state and getters: wrap in computed to stay reactive
const items = computed(() => store.state.cart.items)
const total = computed(() => store.getters['cart/total'])
const count = computed(() => store.getters['cart/count'])

function add(product) {
  store.commit('cart/ADD_ITEM', product)           // call a mutation: 'module/NAME'
}
function load() {
  store.dispatch('cart/fetchCart')                 // call an action
}
</script>

<template>
  <button @click="load">Reload</button>
  <button @click="add({ id: 1, name: 'Mug', price: 12 })">Add</button>
  <p>{{ count }} items - {{ total }}</p>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'the older helper style in the Options API',
              code: `<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('cart', ['items']),
    ...mapGetters('cart', ['total', 'count']),
  },
  methods: {
    ...mapMutations('cart', ['ADD_ITEM']),
    ...mapActions('cart', ['fetchCart']),
  },
  created() { this.fetchCart() },
}
</script>`,
            },
            {
              type: 'heading',
              text: 'Why mutations existed (and why Pinia dropped them)',
            },
            {
              type: 'list',
              items: [
                '**Traceability**: every change is a named, synchronous event (`ADD_ITEM`), so the DevTools timeline shows a readable history and can move backwards and forwards through states.',
                '**Predictability**: if only mutations change state, you only have to read mutations to understand how state can change. Async code lives in actions, which cannot change state directly.',
                '**Cost**: for simple changes you write a mutation, an action and string names, three places to edit for one feature. Typing the strings is error-prone, and modules require string-path access.',
                '**Pinia\'s answer**: DevTools can track direct state changes and actions without the extra layer (Pinia\'s `$patch` and `$subscribe` still tell you what changed and from where), so the ceremony was removed.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Do not change `state` outside a mutation in Vuex (e.g. `store.state.cart.items.push(x)` in a component). It may seem to work, but it breaks time travel and, in strict mode, throws an error. Also never do asynchronous work (a `setTimeout`, a fetch) inside a mutation: the DevTools snapshot would be taken before the data arrives.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The official Vue documentation now states that Pinia is the recommended state management library, and that Vuex is in maintenance mode: it works, and will receive critical fixes, but no new features. Use Vuex when you maintain an existing app, and Pinia for new work.',
            },
          ],
        },
        {
          id: 'vuex-to-pinia-migration',
          title: 'Migrating from Vuex to Pinia',
          summary:
            'Migration can be done one module at a time because Vuex and Pinia can run side by side. Each Vuex module becomes a Pinia store, mutations disappear into actions or direct assignment, and `this.$store` calls become `useXxxStore()`.',
          keyPoints: [
            'Each **Vuex module** becomes its own **Pinia store**. A namespace path like `cart/ADD_ITEM` becomes an ordinary function call `cart.addItem()`.',
            '**Mutations are removed**: their body becomes the body of an action (or code that assigns state directly). Actions that only committed a mutation can be merged.',
            'Getters become `computed` (setup stores) or `getters` (options stores). `rootState` and `rootGetters` become calls to other stores.',
            'Migrate gradually: install Pinia next to Vuex, convert one module and its components, test, repeat, and finally remove Vuex.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Vuex', 'Pinia equivalent'],
              rows: [
                ['`createStore({...})` single root store', 'Many small stores, each with `defineStore(\'id\', ...)`'],
                ['`modules: { cart }` with `namespaced: true`', 'A separate `useCartStore` (namespacing is automatic)'],
                ['`state: () => ({...})`', '`state: () => ({...})` (options) or `ref()` (setup)'],
                ['`getters`', '`getters` (options) or `computed()` (setup)'],
                ['`mutations` (synchronous)', 'No equivalent: logic moves to actions or direct state changes'],
                ['`actions` with `{ commit, dispatch, state }`', '`actions` with `this` (options) or plain functions (setup)'],
                ['`store.commit(\'cart/ADD_ITEM\', x)`', '`cart.addItem(x)` or `cart.items.push(x)`'],
                ['`store.dispatch(\'cart/fetchCart\')`', '`cart.fetchCart()` (returns a promise)'],
                ['`rootState`, `rootGetters`', 'Call `useOtherStore()` inside the action or getter'],
                ['`mapState` / `mapGetters` / `mapActions`', '`storeToRefs`, or `mapState` / `mapActions` / `mapStores` from `pinia` (Options API)'],
                ['Plugins (`store.subscribe`)', 'Pinia plugins and `$subscribe` / `$onAction`'],
                ['`store.replaceState`, `store.registerModule`', '`$patch` / `$state`; stores are registered lazily on first use'],
                ['Strict mode', 'Not needed: direct mutation is allowed by design'],
              ],
            },
            {
              type: 'heading',
              text: 'Before and after: the same cart module',
            },
            {
              type: 'code',
              language: 'js',
              title: 'BEFORE (Vuex module), shortened',
              code: `export default {
  namespaced: true,
  state: () => ({ items: [], status: 'idle' }),
  getters: { count: (s) => s.items.reduce((n, i) => n + i.qty, 0) },
  mutations: {
    ADD_ITEM(state, product) { state.items.push({ ...product, qty: 1 }) },
    SET_ITEMS(state, items) { state.items = items },
    SET_STATUS(state, status) { state.status = status },
  },
  actions: {
    async fetchCart({ commit }) {
      commit('SET_STATUS', 'loading')
      commit('SET_ITEMS', await (await fetch('/api/cart')).json())
      commit('SET_STATUS', 'idle')
    },
  },
}`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'AFTER (Pinia store): three mutations vanish',
              code: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const status = ref('idle')
  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))

  function addItem(product) { items.value.push({ ...product, qty: 1 }) }   // was ADD_ITEM

  async function fetchCart() {
    status.value = 'loading'                       // was commit('SET_STATUS')
    items.value = await (await fetch('/api/cart')).json()   // was commit('SET_ITEMS')
    status.value = 'idle'
  }
  return { items, status, count, addItem, fetchCart }
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'component: before and after',
              code: `<!-- BEFORE -->
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const count = computed(() => store.getters['cart/count'])
const add = (p) => store.commit('cart/ADD_ITEM', p)
const load = () => store.dispatch('cart/fetchCart')
</script>

<!-- AFTER -->
<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
const { count } = storeToRefs(cart)
const { addItem, fetchCart } = cart
</script>`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["Install pinia<br/>app.use(createPinia()) next to Vuex"] --> B["Pick one small Vuex module"]
    B --> C["Create the matching Pinia store<br/>state, getters, actions"]
    C --> D["Fold mutations into actions<br/>replace rootState with other stores"]
    D --> E["Update components using that module<br/>useStore to useCartStore"]
    E --> F["Move or write tests for the store"]
    F --> G{"More modules left?"}
    G -->|"yes"| B
    G -->|"no"| H["Remove vuex and the store folder"]`,
            },
            {
              type: 'heading',
              text: 'A safe migration checklist',
            },
            {
              type: 'list',
              items: [
                '**Start with leaf modules** that depend on no other module (settings, UI flags) and finish with the biggest or most connected ones (auth, user).',
                '**Keep the old Vuex module and the new Pinia store in sync only briefly**, if at all. Two sources of truth for the same data are a bug waiting to happen. Convert a module and all its users in one change.',
                '**Replace string-based calls** (`dispatch(\'auth/login\')`) with direct imports. TypeScript will now catch typos at compile time.',
                '**Check what used the module\'s namespaced getters** in `mapGetters` and in other modules\' `rootGetters`. Search for the module name across the code base.',
                '**Move plugins** (persistence, logging) to Pinia plugins. For `vuex-persistedstate`, use `pinia-plugin-persistedstate`.',
                '**Rewrite tests**: store tests become `setActivePinia(createPinia())`; component tests use `createTestingPinia` instead of a mocked `$store`.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Migrating Options API components is not required. Pinia works from them too, through `mapState(useCartStore, [\'count\'])` and `mapActions(useCartStore, [\'addItem\'])` in the `computed` and `methods` sections. You can move to Pinia first and to `<script setup>` later.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'When you fold a mutation into an action, do not forget what Vuex gave you for free: a mutation was synchronous and atomic. If your new action contains several `await`s between state assignments, another part of the app may see a half-updated state in between. Prepare data first, then assign state in one step (or use `$patch`).',
            },
          ],
        },
        {
          id: 'tanstack-query-vue',
          title: 'Server State with TanStack Query for Vue',
          summary:
            '**Server state** is data that lives on a server that you borrow a copy of. TanStack Query (`@tanstack/vue-query`) manages that copy for you: fetching, caching, refetching, de-duplicating requests and updating after changes, so you do not hand-write loading flags in a store.',
          keyPoints: [
            'Client state (UI toggles) is owned by the browser; server state is owned by a server and can become **stale** (out of date) at any moment. They need different tools.',
            '`useQuery({ queryKey, queryFn })` fetches and caches by **key**; the same key anywhere in the app shares one cached result and one request.',
            '`useMutation({ mutationFn })` sends changes (POST, PUT, DELETE); on success you **invalidate** related query keys so they refetch automatically.',
            'Defaults worth knowing: data is stale immediately (`staleTime: 0`), refetches on window focus and reconnect, retries failed queries 3 times, unused cache is garbage-collected after 5 minutes (`gcTime`).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Many apps start by putting `products`, `loading` and `error` into a store and writing the same fetch code again and again. Every screen then has to decide: should I refetch? is this data too old? is another component already loading it? TanStack Query answers those questions for you. Your store stays small and holds only real **client** state.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'install and register',
              code: `npm install @tanstack/vue-query

# main.js
import { VueQueryPlugin } from '@tanstack/vue-query'
app.use(VueQueryPlugin)`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'TodoList.vue: reading data with useQuery',
              code: `<script setup>
import { ref } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'

const page = ref(1)

async function fetchTodos(p) {
  const res = await fetch('/api/todos?page=' + p)
  if (!res.ok) throw new Error('Failed to load todos')      // thrown errors become "isError"
  return res.json()
}

const { data, isPending, isError, error, isFetching, refetch } = useQuery({
  // the key identifies the data; refs inside it are tracked, so changing page refetches
  queryKey: ['todos', page],
  queryFn: () => fetchTodos(page.value),
  staleTime: 30_000,                    // treat data as fresh for 30 seconds
  placeholderData: keepPreviousData,    // keep showing the old page while the next loads
})
</script>

<template>
  <p v-if="isPending">Loading...</p>
  <p v-else-if="isError">Error: {{ error.message }} <button @click="refetch()">Retry</button></p>
  <template v-else>
    <ul><li v-for="t in data.items" :key="t.id">{{ t.title }}</li></ul>
    <button :disabled="page === 1" @click="page--">Prev</button>
    <button @click="page++">Next</button>
    <small v-if="isFetching">updating...</small>
  </template>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'AddTodo.vue: changing data with useMutation and invalidation',
              code: `<script setup>
import { ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()
const title = ref('')

const { mutate, isPending, isError, error } = useMutation({
  mutationFn: (newTodo) =>
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    }).then((r) => { if (!r.ok) throw new Error('Save failed'); return r.json() }),

  onSuccess: () => {
    // mark every query whose key starts with 'todos' as stale -> they refetch
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    title.value = ''
  },
})
</script>

<template>
  <form @submit.prevent="mutate({ title })">
    <input v-model="title" />
    <button :disabled="isPending">{{ isPending ? 'Saving...' : 'Add' }}</button>
    <p v-if="isError">{{ error.message }}</p>
  </form>
</template>`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["Component calls useQuery<br/>key todos 1"] --> B{"In cache?"}
    B -->|"no"| F["Fetch from server"]
    B -->|"yes"| C{"Still fresh?<br/>within staleTime"}
    C -->|"yes"| R["Return cached data<br/>no request"]
    C -->|"no, stale"| S["Return cached data now<br/>and refetch in background"]
    S --> F
    F --> U["Update cache<br/>all components using this key re-render"]
    M["Mutation succeeds"] --> I["invalidateQueries todos"]
    I --> C`,
            },
            {
              type: 'heading',
              text: 'Server state vs client state',
            },
            {
              type: 'table',
              headers: ['', 'Client state', 'Server state'],
              rows: [
                ['Owned by', 'Your app in the browser', 'A remote server or database'],
                ['Examples', 'Sidebar open, current wizard step, theme, unsaved form draft', 'Products, user profile, orders, comments'],
                ['Becomes stale?', 'No, you control every change', 'Yes, others may change it at any time'],
                ['Challenges', 'Sharing, structure, persistence', 'Caching, refetching, loading and error states, de-duplication, pagination, optimistic updates'],
                ['Best tool', 'ref, composable, Pinia', 'TanStack Query (or similar: SWR-style libraries, Apollo for GraphQL)'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Combine them: use Pinia for the selected filters (`category`, `sort`) and feed those into `queryKey: [\'products\', category, sort]`. Changing the filter in the store automatically triggers a new, cached query. Do not copy `data` from `useQuery` into a Pinia store; read it from the query wherever you need it.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A `queryFn` must **throw** on HTTP errors. The browser `fetch` does not reject for a 404 or 500 response, so without `if (!res.ok) throw ...` the query would be marked successful with an error body as data. Also keep query keys complete: if the function depends on `userId`, `userId` must be in the key, or different users will share one cache entry.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'API details (such as `isPending` replacing `isLoading` for the first load, and how refs in keys are handled) have changed between major versions. This section follows v5. Check the docs for the version you install.',
            },
          ],
        },
        {
          id: 'vueuse-ecosystem',
          title: 'VueUse and the Wider Ecosystem (UI Libraries)',
          summary:
            'VueUse is a large collection of ready-made composables for browser features and common patterns. Alongside it, Vue has several mature UI component libraries, so you rarely need to build buttons, tables and dialogs from scratch.',
          keyPoints: [
            '**VueUse** (`@vueuse/core`) offers 200+ composables: `useLocalStorage`, `useMouse`, `useDark`, `useDebounceFn`, `useIntersectionObserver`, `onClickOutside`, `useWindowSize`, `useClipboard` and more. Everything is tree-shakable, SSR-friendly and cleans up after itself.',
            'Before writing a composable for a browser API, check whether VueUse already has one; it handles edge cases such as unsupported browsers and SSR.',
            'UI libraries: **Vuetify** (Material Design), **PrimeVue** (very large set, styled or unstyled), **Element Plus** (admin dashboards), **Naive UI** (TypeScript-first, themeable), **Quasar** (a full framework that also builds mobile and desktop apps).',
            'Choose a UI library by design language, accessibility, bundle size and theming, not only by number of components.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'install',
              code: `npm install @vueuse/core`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'a handful of VueUse composables in one component',
              code: `<script setup>
import { ref, watch } from 'vue'
import {
  useLocalStorage, useDark, useToggle, useDebounceFn,
  useWindowSize, onClickOutside, useClipboard, useIntersectionObserver,
} from '@vueuse/core'

// 1. a ref that is saved to localStorage automatically (and synced across tabs)
const draft = useLocalStorage('draft-note', '')

// 2. dark mode that follows the OS and toggles a "dark" class on <html>
const isDark = useDark()
const toggleDark = useToggle(isDark)

// 3. debounce: wait until the user stops typing for 300ms
const results = ref([])
const search = useDebounceFn(async (q) => {
  results.value = await (await fetch('/api/search?q=' + encodeURIComponent(q))).json()
}, 300)

// 4. reactive window size
const { width } = useWindowSize()

// 5. close a menu when clicking outside
const menu = ref(null)
const menuOpen = ref(true)
onClickOutside(menu, () => (menuOpen.value = false))

// 6. clipboard
const { copy, copied } = useClipboard()

// 7. lazy-load when an element scrolls into view
const target = ref(null)
const seen = ref(false)
useIntersectionObserver(target, ([entry]) => { if (entry.isIntersecting) seen.value = true })
</script>

<template>
  <textarea v-model="draft" placeholder="Saved as you type" />
  <input @input="search($event.target.value)" placeholder="Search..." />
  <p>Window is {{ width }}px wide</p>
  <button @click="toggleDark()">{{ isDark ? 'Light' : 'Dark' }} mode</button>
  <div v-if="menuOpen" ref="menu">Click outside to close</div>
  <button @click="copy(draft)">{{ copied ? 'Copied!' : 'Copy note' }}</button>
  <div ref="target">{{ seen ? 'I was scrolled into view' : '...' }}</div>
</template>`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    N["Need browser or utility logic"] --> Q{"Exists in VueUse?"}
    Q -->|"yes"| U["Import the composable"]
    Q -->|"no"| W["Write your own composable<br/>reuse VueUse building blocks"]
    U --> T["Handles SSR and cleanup for you"]
    W --> T`,
            },
            {
              type: 'heading',
              text: 'UI component libraries at a glance',
            },
            {
              type: 'table',
              headers: ['Library', 'Style', 'Notable strengths', 'Consider'],
              rows: [
                ['**Vuetify**', 'Material Design', 'Very complete, strong theming and layout system, good documentation', 'Opinionated look; larger CSS and JS footprint'],
                ['**PrimeVue**', 'Many themes; styled or unstyled (works with Tailwind)', 'Huge component set including a powerful DataTable, tree, charts', 'Many options to learn; some advanced themes are commercial'],
                ['**Element Plus**', 'Clean, business look', 'Great for admin panels and forms; widely used', 'Documentation and community are strongest in China; less customisable by default'],
                ['**Naive UI**', 'Modern, themeable', 'Written in TypeScript, good performance, no required CSS file', 'Smaller community than the big three'],
                ['**Quasar**', 'Material-inspired framework', 'One code base for web, PWA, mobile, desktop; CLI included', 'It is a framework, not just components'],
                ['**Headless libraries** (for example Reka UI, formerly Radix Vue)', 'No styles at all', 'Accessible behaviour (dialogs, menus, tabs) that you style yourself, often with Tailwind', 'You build the visual design'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'registering a UI library (Element Plus example)',
              code: `import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// For smaller bundles use on-demand imports via the unplugin-vue-components plugin
createApp(App).use(ElementPlus).mount('#app')`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Evaluate a UI library with a real screen of your app before committing: build your most complex form or table. Check keyboard accessibility and dark mode, and measure how much it adds to your bundle. Switching libraries later is expensive because components appear in every file.',
            },
          ],
        },
        {
          id: 'state-comparison',
          title: 'Choosing a State Tool: Side-by-Side Comparison',
          summary:
            'No single tool is best. This topic puts every option side by side, shows a typical architecture that combines them, and gives rules of thumb for choosing.',
          keyPoints: [
            'Most real apps combine tools: local `ref`s for component state, Pinia for shared client state, TanStack Query for server data, and `provide/inject` for subtree context.',
            'Pinia is the default store for Vue 3. Vuex is for existing apps. A composable singleton is for tiny cases. TanStack Query is for server data.',
            'A **state machine** library such as **XState** is worth a look when state has strict, named phases and rules about allowed transitions (checkout flows, wizards, media players).',
            'The most expensive mistake is not choosing the "wrong" library, it is putting state in a place broader than it needs to be.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Option', 'Scope', 'Best for', 'DevTools', 'Boilerplate', 'Watch out for'],
              rows: [
                ['Local `ref` / `reactive`', 'One component', 'UI state of a single component', 'Component inspector', 'None', 'Not shareable'],
                ['Props / emits', 'Parent and child', 'Direct communication', 'Component inspector', 'Low', 'Prop drilling in deep trees'],
                ['Composable (per call)', 'Each caller gets a copy', 'Reusable logic: `useFetch`, `useMouse`', 'Shows as component state', 'Low', 'Not shared across components'],
                ['Composable (shared singleton)', 'Whole app (module scope)', 'Tiny global state: toasts, theme', 'Limited', 'Low', 'SSR leaks, hard to reset in tests'],
                ['provide / inject', 'A component subtree', 'Context: form group, theme, tabs and tab panels', 'Visible but untracked', 'Low', 'Hidden dependencies'],
                ['**Pinia**', 'Whole app', 'Shared client state with structure: auth, cart, settings', 'Excellent: timeline, edit state, time travel', 'Low to medium', 'Using it for server data or for purely local state'],
                ['**Vuex**', 'Whole app', 'Existing Vuex apps', 'Good: timeline and time travel', 'High: mutations, string names', 'Maintenance mode; weaker TypeScript'],
                ['**TanStack Query**', 'Whole app (cache)', 'Server state: fetching, caching, mutations', 'Dedicated devtools', 'Low', 'Not meant for UI-only state'],
                ['**XState**', 'Per machine, app-wide if needed', 'Complex flows with strict transitions', 'Visualiser and inspector', 'Medium to high', 'Steeper learning curve for small problems'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    subgraph Client["Browser app"]
      C1["Components<br/>local refs"] --> P["Pinia stores<br/>client state: auth, cart, filters"]
      C1 --> Q["TanStack Query cache<br/>server state"]
      C1 --> PI["provide / inject<br/>subtree context"]
      P -->|"filters feed query keys"| Q
    end
    Q <-->|"fetch / mutate"| API["Backend API"]
    P -->|"persist plugin"| LS[("localStorage")]`,
            },
            {
              type: 'heading',
              text: 'Rules of thumb',
            },
            {
              type: 'list',
              items: [
                '**Pinia vs Vuex**: pick Pinia for anything new. Keep Vuex only where migration is not worth it yet, and plan to migrate one module at a time.',
                '**Pinia vs TanStack Query**: if the data comes from an API and can change without you knowing, use Query. If you created the data in the browser, use Pinia.',
                '**Pinia vs composable singleton**: if you need DevTools, SSR safety, persistence or testing support, use Pinia. For a two-ref toast list, a composable is enough.',
                '**Pinia vs provide/inject**: provide/inject is for a **subtree** with a single owner (a `Tabs` component providing its active tab to `Tab` children). Pinia is for state not tied to a particular place in the component tree.',
                '**Add XState** only when you can draw the states and arrows of the problem on a whiteboard and illegal states (for example "paid" and "cancelled" at once) must be impossible.',
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'combining Pinia (client state) with Query (server state)',
              code: `// stores/productFilters.js : client state only
export const useProductFilters = defineStore('productFilters', () => {
  const category = ref('all')
  const sort = ref('price')
  const search = ref('')
  return { category, sort, search }
})

// composables/useProducts.js : server state, driven by the store
import { storeToRefs } from 'pinia'
import { useQuery } from '@tanstack/vue-query'

export function useProducts() {
  const { category, sort, search } = storeToRefs(useProductFilters())
  return useQuery({
    queryKey: ['products', category, sort, search],     // change a filter -> new cached query
    queryFn: () => fetch('/api/products?category=' + category.value + '&sort=' + sort.value + '&q=' + search.value).then(r => r.json()),
  })
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When unsure, begin with the lowest rung of the ladder and move up only when it hurts. Moving state from a component to Pinia later is a small refactor. Unwinding a store that holds everything is a big one.',
            },
          ],
        },
        {
          id: 'typescript-with-vue',
          title: 'TypeScript with Vue',
          summary:
            'Vue 3 is written in TypeScript and works very well with it. With `<script setup lang="ts">` you get typed props, emits, refs, stores and even template checking via the `vue-tsc` tool.',
          keyPoints: [
            '**TypeScript (TS)** adds types to JavaScript so mistakes are caught by the editor and compiler before the code runs. Add `lang="ts"` to `<script setup>`.',
            'Type props with `defineProps<{ ... }>()` and emits with `defineEmits<{ event: [payload] }>()`. Optional props use `?`; Vue 3.5 allows defaults via normal destructuring.',
            '`ref<User | null>(null)` states the type explicitly when it cannot be inferred; `computed` infers from its return value.',
            'Run `vue-tsc --noEmit` in CI: it type-checks `.vue` files including templates, which plain `tsc` cannot do. Use the official Vue (Volar) extension in your editor.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'vue',
              title: 'a typed component with refs, computed and emits',
              code: `<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'

interface User {
  id: number
  name: string
  email?: string       // optional
}

// 1. Props: a type literal. required unless marked with ?
const props = defineProps<{
  users: User[]
  pageSize?: number
}>()

// 2. Emits: each event has its payload types listed as a tuple
const emit = defineEmits<{
  select: [user: User]
  close: []
}>()

// 3. ref: explicit type for values that start empty
const selected = ref<User | null>(null)
const query = ref('')                           // inferred: Ref<string>

// 4. computed: type inferred from the return
const filtered = computed(() =>
  props.users.filter(u => u.name.toLowerCase().includes(query.value.toLowerCase()))
)

// 5. Template ref: say which element type it will hold
const searchInput = useTemplateRef<HTMLInputElement>('search')

function choose(user: User) {
  selected.value = user
  emit('select', user)           // emit('select', 5) would be a compile error
}

// 6. DOM event typing
function onInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value
}
</script>

<template>
  <input ref="search" :value="query" @input="onInput" />
  <ul>
    <li v-for="u in filtered" :key="u.id" @click="choose(u)">{{ u.name }}</li>
  </ul>
</template>`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'typed provide/inject, composables and Pinia',
              code: `// 1. Generic composable: the type flows from the argument to the result
import { ref, type Ref } from 'vue'

export function useList<T>(initial: T[] = []): {
  items: Ref<T[]>
  add: (item: T) => void
} {
  const items = ref(initial) as Ref<T[]>
  const add = (item: T) => { items.value.push(item) }
  return { items, add }
}
const { items, add } = useList<string>()
add('hello')        // OK
// add(42)          // error: number is not assignable to string

// 2. Typed Pinia store: inferred from state and actions, nothing extra to write
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', () => {
  const current = ref<{ id: number; name: string } | null>(null)
  function login(id: number, name: string) { current.value = { id, name } }
  return { current, login }
})

// 3. Typed global properties or route meta by augmenting the library's types
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
  }
}`,
            },
            {
              type: 'code',
              language: 'json',
              title: 'package.json scripts for type-checking',
              code: `{
  "scripts": {
    "dev": "vite",
    "type-check": "vue-tsc --noEmit -p tsconfig.app.json",
    "build": "run-p type-check \\"build-only {@}\\" --",
    "build-only": "vite build"
  }
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Vite does **not** type-check: it only strips types for speed. Your editor and `vue-tsc` do the checking. If your build is green but types are wrong, you probably never ran `vue-tsc`.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'With `defineProps<T>()` the type argument must be understandable by the Vue compiler. Since Vue 3.3 it can import types from other files, but very complex conditional or mapped types can still fail. In that case, extract a simple interface or use the runtime form with `PropType<...>`: `type: Object as PropType<User>`.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    S["Source files<br/>.ts and .vue"] --> V["Vite<br/>strips types and bundles quickly"]
    S --> T["vue-tsc<br/>checks .vue templates and scripts"]
    V --> B["Production bundle"]
    T --> OK{"Type errors?"}
    OK -->|"yes"| F["CI fails"]
    OK -->|"no"| B`,
            },
          ],
        },
        {
          id: 'testing-vue',
          title: 'Testing with Vitest and Vue Test Utils',
          summary:
            'Vitest runs your tests (it shares Vite\'s configuration), and Vue Test Utils (VTU) mounts components in a simulated browser so you can click, type and assert on what a user would see.',
          keyPoints: [
            '**Vitest** is the test runner (similar API to Jest). **Vue Test Utils** provides `mount`, `find`, `trigger`, `setValue`, `emitted` for components. A simulated DOM like `jsdom` or `happy-dom` stands in for the browser.',
            'Test **behaviour**, not implementation: click the button and check the text, instead of reading private variables.',
            'Test stores with `setActivePinia(createPinia())` and components with `createTestingPinia`. Test composables directly, or inside a tiny host component if they use lifecycle hooks.',
            'After an action that changes state, `await` the trigger or `await nextTick()` before asserting, because Vue updates the DOM asynchronously.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'vue',
              title: 'Counter.vue (the component under test)',
              code: `<script setup>
import { ref } from 'vue'
const props = defineProps({ start: { type: Number, default: 0 } })
const emit = defineEmits(['change'])
const count = ref(props.start)
function inc() { count.value++; emit('change', count.value) }
</script>
<template>
  <p data-test="value">Count: {{ count }}</p>
  <button data-test="inc" @click="inc">+</button>
</template>`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'Counter.spec.js',
              code: `import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter', () => {
  it('renders the start value from props', () => {
    const wrapper = mount(Counter, { props: { start: 5 } })
    expect(wrapper.get('[data-test="value"]').text()).toBe('Count: 5')
  })

  it('increments and emits when clicked', async () => {
    const wrapper = mount(Counter)

    await wrapper.get('[data-test="inc"]').trigger('click')   // await: DOM updates are async

    expect(wrapper.get('[data-test="value"]').text()).toBe('Count: 1')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')[0]).toEqual([1])          // payload of the first emit
  })
})`,
            },
            {
              type: 'heading',
              text: 'Testing async data and mocking fetch',
            },
            {
              type: 'code',
              language: 'js',
              title: 'UserList.spec.js',
              code: `import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserList from '@/components/UserList.vue'

afterEach(() => vi.restoreAllMocks())

describe('UserList', () => {
  it('shows users after loading', async () => {
    // replace the real fetch with a fake that returns two users
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: 'Ada' }, { id: 2, name: 'Alan' }],
    })

    const wrapper = mount(UserList)
    expect(wrapper.text()).toContain('Loading')

    await flushPromises()            // wait for pending promises, then re-render

    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Ada')
  })

  it('shows an error message when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
    const wrapper = mount(UserList)
    await flushPromises()
    expect(wrapper.text()).toContain('Could not load users')
  })
})`,
            },
            {
              type: 'heading',
              text: 'Testing composables',
            },
            {
              type: 'code',
              language: 'js',
              title: 'a composable with no lifecycle hooks: call it directly',
              code: `import { it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

it('increments', () => {
  const { count, inc } = useCounter(10)
  inc()
  expect(count.value).toBe(11)
})`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a composable with onMounted: run it inside a host component',
              code: `import { createApp } from 'vue'

// helper: runs a composable inside a real component so lifecycle hooks work
export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      return () => null          // render nothing
    },
  })
  app.mount(document.createElement('div'))
  return [result, app]
}

// in a test
import { it, expect } from 'vitest'
import { useMouse } from '@/composables/useMouse'

it('tracks the mouse', () => {
  const [mouse, app] = withSetup(() => useMouse())
  window.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 20 }))
  // ...assert mouse.x.value as appropriate for your implementation
  app.unmount()                  // runs onBeforeUnmount cleanup, which you can also verify
})`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    subgraph Pyramid["Testing layers"]
      E["End-to-end tests<br/>Playwright or Cypress<br/>few, slow, full browser"]
      I["Component tests<br/>Vitest and Vue Test Utils<br/>some, user-level behaviour"]
      U["Unit tests<br/>stores, composables, utils<br/>many, fast"]
    end
    U --> I --> E`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Select elements by stable hooks such as `data-test="..."` attributes or by visible text and ARIA roles, not by CSS classes that change with styling. To use a router in a component test, pass a real router created with `createMemoryHistory()` as a plugin, and `await router.push(\'/\'); await router.isReady()` before mounting.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Forgetting `await` before `trigger`, `setValue` or `setProps` is the most common cause of "the test sees the old text". Also `shallowMount` replaces child components with stubs, which can hide real integration bugs; prefer `mount` unless a child is heavy or needs mocking.',
            },
          ],
        },
        {
          id: 'vue-performance',
          title: 'Performance: Making Vue Apps Fast',
          summary:
            'Vue is fast by default. Performance work is mostly about doing less: loading less code, rendering fewer nodes, and avoiding reactivity for data that does not need it. Always measure first.',
          keyPoints: [
            'Two kinds of performance: **load** (how fast the page appears: bundle size, lazy loading, SSR) and **update** (how fast the page reacts: how much work each state change causes).',
            '`shallowRef` / `shallowReactive` only track the top level, which is much cheaper for big objects such as thousands of table rows or chart data you replace as a whole. `markRaw` excludes an object from reactivity entirely.',
            '`v-once` renders once and never updates; `v-memo="[a, b]"` re-renders a list item only when listed values change; **virtual scrolling** renders only the rows visible on screen.',
            'Lazy load routes and heavy components (`defineAsyncComponent`), and use `KeepAlive` when remounting is more expensive than keeping the component in memory.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TD
    A["Something feels slow"] --> B["Measure<br/>Lighthouse and Vue DevTools performance tab"]
    B --> C{"Slow to load or<br/>slow to update?"}
    C -->|"load"| D["Smaller bundle:<br/>lazy routes, async components,<br/>tree-shaking, image sizes, SSR"]
    C -->|"update"| E{"Huge list?"}
    E -->|"yes"| F["Virtual scrolling<br/>pagination"]
    E -->|"no"| G{"Big data made deeply reactive?"}
    G -->|"yes"| H["shallowRef or markRaw"]
    G -->|"no"| I["Look for expensive template work:<br/>move into computed, v-memo, split components"]`,
            },
            {
              type: 'heading',
              text: 'Avoid unnecessary reactivity',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'shallowRef for a large dataset replaced as a whole',
              code: `<script setup>
import { ref, shallowRef, markRaw, triggerRef } from 'vue'

// BAD for 50,000 rows: ref() walks every nested property and wraps it in a Proxy
const rowsDeep = ref([])

// GOOD: only .value itself is tracked. Replace the array to update the UI.
const rows = shallowRef([])

async function load() {
  const data = await (await fetch('/api/rows')).json()
  rows.value = data                              // triggers an update (new reference)
}

function editRow(i) {
  rows.value[i].price = 0                        // NOT detected by shallowRef!
  rows.value = [...rows.value]                   // new array makes Vue notice
  // or: triggerRef(rows)                        // force the notification
}

// markRaw: a third-party object (a map, a chart instance) must never be proxied
const chart = ref({ instance: markRaw(createChart()) })
</script>`,
            },
            {
              type: 'heading',
              text: 'Skip work in lists and templates',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'v-once, v-memo and computed instead of template work',
              code: `<script setup>
import { ref, computed } from 'vue'
const items = ref([/* thousands of { id, name, selected } */])
const selectedId = ref(null)
const search = ref('')

// BAD: filtering inside the template re-runs for EVERY re-render
// <li v-for="i in items.filter(x => x.name.includes(search))">

// GOOD: computed caches until items or search change
const visible = computed(() => items.value.filter(i => i.name.includes(search.value)))
</script>

<template>
  <!-- v-once: contents never change, Vue skips them on every later update -->
  <footer v-once>Copyright 2026 MyCompany</footer>

  <ul>
    <!-- v-memo: re-render a row only when its selected state changes -->
    <li
      v-for="item in visible"
      :key="item.id"
      v-memo="[item.id === selectedId]"
      @click="selectedId = item.id"
    >
      {{ item.name }}
    </li>
  </ul>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'virtual scrolling with VueUse: only about 10 rows exist in the DOM',
              code: `<script setup>
import { useVirtualList } from '@vueuse/core'

const all = Array.from({ length: 100000 }, (_, i) => 'Row ' + i)

// list = the visible slice, containerProps and wrapperProps = bindings that make scrolling work
const { list, containerProps, wrapperProps } = useVirtualList(all, { itemHeight: 32 })
</script>

<template>
  <div v-bind="containerProps" style="height: 320px; overflow: auto">
    <div v-bind="wrapperProps">
      <div v-for="row in list" :key="row.index" style="height: 32px">{{ row.data }}</div>
    </div>
  </div>
</template>`,
            },
            {
              type: 'table',
              headers: ['Technique', 'What it saves', 'Trade-off'],
              rows: [
                ['Lazy-loaded routes and `defineAsyncComponent`', 'Initial download size', 'A short wait the first time a feature opens'],
                ['`shallowRef` / `markRaw`', 'Time and memory building Proxies for big data', 'Nested changes are not detected; replace or `triggerRef`'],
                ['`computed` instead of template expressions or methods', 'Repeated calculation', 'None for pure calculations'],
                ['`v-memo`, `v-once`', 'Re-rendering rows or blocks that did not change', 'Easy to leave stale UI if the dependency list is incomplete'],
                ['Virtual scrolling or pagination', 'DOM nodes for off-screen rows', 'Extra library, fixed or measured heights'],
                ['`KeepAlive`', 'Re-creating expensive components (tab content)', 'Uses memory; use `max` to cap cached instances'],
                ['Stable props (avoid creating new objects in the template)', 'Child re-renders caused by changed props', 'Slightly more code'],
                ['Debounce / throttle input handlers', 'Work per keystroke or scroll event', 'Short delay in feedback'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Passing an inline object or array as a prop (`<Child :style-opts="{ a: 1 }" />` or `:items="items.filter(...)"`) creates a **new reference on every render**, so the child re-renders every time. Create it once in a `computed` or a constant. Also, do not optimise before measuring: `v-memo` on a short list adds complexity and no benefit.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The Vue DevTools **Performance** tab shows component render time and how often each updates. Use the browser Performance panel for long tasks. For load speed, run `npx vite-bundle-visualizer` (or the equivalent for your build) to see which libraries make your bundle large; replacing one heavy dependency often beats any micro-optimisation.',
            },
          ],
        },
        {
          id: 'whats-new-vue',
          title: 'What Is New in Recent Vue 3.x',
          summary:
            'Vue 3.3 to 3.5 made `<script setup>` nicer to use (`defineModel`, props destructure, typed slots and generics), added `useTemplateRef` and `useId`, and improved memory use and SSR hydration. Vapor mode, a compile-only rendering mode, is still experimental.',
          keyPoints: [
            '**3.3**: generic components (`<script setup generic="T">`), `defineSlots`, `defineOptions`, and importing types from other files into `defineProps`.',
            '**3.4**: `defineModel` became stable, a much faster template parser, same-name shorthand in `v-bind` (`:id` means `:id="id"`), and `computed` no longer triggers when its value is unchanged.',
            '**3.5**: reactive props destructure is stable, `useTemplateRef()`, `useId()`, `onWatcherCleanup()`, `Teleport` `defer`, lazy hydration strategies for async components, and a large reduction in reactivity memory use.',
            '**Vapor mode** compiles components to direct DOM operations without a virtual DOM. It is under active development, opt-in and **experimental**; do not use it for production without checking the current release notes.',
          ],
          blocks: [
            {
              type: 'callout',
              kind: 'note',
              text: 'Version details change quickly. Treat the version numbers below as a guide and confirm in the official release notes and the changelog of the exact version you install. Anything labelled experimental can change or be removed.',
            },
            {
              type: 'heading',
              text: 'Reactive props destructure (3.5)',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'before and after',
              code: `<script setup lang="ts">
// BEFORE (3.4 and earlier): defaults need withDefaults and props.xxx everywhere
const props = withDefaults(defineProps<{ count?: number; label?: string }>(), {
  count: 0,
  label: 'Items',
})
console.log(props.count)

// AFTER (3.5): normal destructuring with default values. The compiler rewrites
// each use to props.count, so it STAYS reactive.
const { count = 0, label = 'Items' } = defineProps<{ count?: number; label?: string }>()
</script>

<template>
  <p>{{ label }}: {{ count }}</p>
</template>`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The destructured variable is reactive only because the compiler rewrites it. If you pass it into a function or a watcher, wrap it in a getter: `watch(() => count, ...)`, not `watch(count, ...)` (that would pass a plain number). To pass it to a composable use `useThing(() => count)`.',
            },
            {
              type: 'heading',
              text: 'useId and useTemplateRef (3.5)',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'stable unique ids for accessibility',
              code: `<script setup>
import { useId, useTemplateRef, onMounted } from 'vue'

// useId() makes an id that is unique per app and the SAME on server and client,
// so SSR hydration does not report a mismatch (Math.random() would).
const id = useId()
const input = useTemplateRef('field')
onMounted(() => input.value?.focus())
</script>

<template>
  <label :for="id">Email</label>
  <input :id="id" ref="field" type="email" />
</template>`,
            },
            {
              type: 'heading',
              text: 'Other notable additions',
            },
            {
              type: 'table',
              headers: ['Feature', 'Version (approx.)', 'What it gives you'],
              rows: [
                ['`defineModel()`', '3.4 stable', 'Two-way `v-model` for components in one line'],
                ['`defineSlots`, `defineOptions`, generics', '3.3', 'Typed slots, options such as `inheritAttrs` in `<script setup>`, generic components'],
                ['Reactivity refactor', '3.4 and 3.5', 'Fewer needless effect runs; 3.5 cut reactivity memory usage substantially and sped up large arrays'],
                ['`onWatcherCleanup()`, watcher `pause()` / `resume()`', '3.5', 'Cleaner side-effect cancellation; control over watchers'],
                ['`Teleport` `defer`', '3.5', 'Teleport to a target rendered later in the same tick'],
                ['Lazy hydration (`hydrateOnVisible`, `hydrateOnIdle`, ...)', '3.5', 'SSR pages hydrate async components only when needed, improving interactivity time'],
                ['`data-allow-mismatch`', '3.5', 'Silence a known, intentional hydration mismatch (such as a date)'],
                ['Custom elements improvements (`useHost`, `useShadowRoot`)', '3.5', 'Better Web Components support with `defineCustomElement`'],
              ],
            },
            {
              type: 'heading',
              text: 'Vapor mode: status and idea',
            },
            {
              type: 'p',
              text: 'Today a Vue component re-runs its render function, creates a virtual tree, and compares it with the previous one. **Vapor mode** is an alternative compilation strategy, inspired by Solid and Svelte: the compiler turns your template into direct instructions like "when `count` changes, set the text of this one node". With no virtual tree there is less memory and less runtime work, particularly for large apps. It is designed to be opt-in per component, so Vapor and normal components can live in the same app.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Std["Standard mode today"]
      T1["Template"] --> R1["Render function"]
      R1 --> V1["Virtual DOM tree"]
      V1 --> D1["Diff and patch real DOM"]
    end
    subgraph Vap["Vapor mode, experimental"]
      T2["Template"] --> I2["Compiler emits direct DOM instructions"]
      I2 --> D2["Reactive effects update specific nodes"]
    end`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Vapor mode is experimental at the time of writing. Its syntax, supported features and package layout can change, and some features (such as certain `Transition` and `Suspense` behaviours, and third-party libraries that assume a virtual DOM) may not work. It will keep the same `<script setup>` authoring style, so your code is not expected to need a rewrite when it matures. Look at the official Vue blog and release notes before trying it.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'To stay current without rewriting everything: upgrade minor versions regularly (they are backwards compatible), adopt `defineModel` and props destructure in new code, and rely on the official Vue and Pinia changelogs rather than blog posts, which date quickly.',
            },
          ],
        },
      ],
    },
    {
      id: 'vue-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary:
            'Vue interview questions from fundamentals through the Composition API, reactivity internals, Vue Router, Pinia and Vuex, server state, testing and performance, with the reasoning interviewers actually listen for.',
          qa: [
            {
              question: 'What is Vue, and what does "progressive framework" mean?',
              answer:
                'Vue is a JavaScript framework for building user interfaces, centred on a declarative template syntax and fine-grained reactivity: you describe the UI for the current state and Vue updates the DOM when the state changes. "Progressive" means you can adopt it in layers. You can add a single script tag to enhance one page of a server-rendered site, then move to a build setup with single-file components, then add Vue Router and Pinia for a full single-page application, and finally use Nuxt for server rendering. You are never forced to take the whole stack up front, which is a key difference from more all-or-nothing frameworks.',
            },
            {
              question: 'What is the difference between the Options API and the Composition API? Which would you use and why?',
              answer:
                'The Options API organises a component by option type (`data`, `computed`, `methods`, `watch`, lifecycle options) and relies on `this`. The Composition API organises code by feature using functions such as `ref`, `computed`, `watch` and `onMounted`. The practical differences are in reuse and scale. In the Options API, logic for one feature is scattered across several sections, and sharing logic means mixins, which cause name collisions and unclear origins. In the Composition API, related code sits together and can be extracted into a composable, a plain function that returns reactive state, with explicit imports and no collisions. The Composition API also has better TypeScript inference because there is no `this` magic. I would use `<script setup>` with the Composition API for new work, and leave working Options API components alone, since both run on the same reactivity engine and can coexist.',
            },
            {
              question: 'Explain `ref` versus `reactive`. When would you choose each?',
              answer:
                '`ref` wraps any value in an object with a `.value` property; Vue tracks reads and writes of `.value`. `reactive` returns a Proxy of an object so you access properties directly with no `.value`. `reactive` only works for objects, and the reference must never be replaced (`state = reactive({})` disconnects everything that tracked the old object). Destructuring a reactive object copies plain values and loses reactivity, unless you use `toRefs`. `ref` works for primitives, can be reassigned, and is safe to pass around and return from functions, since the ref itself keeps the connection. In templates top-level refs are unwrapped automatically. My default is `ref` everywhere for consistency; `reactive` is acceptable for a fixed group of fields, like a form, that will be mutated but never replaced.',
            },
            {
              question: 'What is the difference between `computed` and `watch`?',
              answer:
                'They solve different problems. `computed` derives a **value** from other state: it is lazy, cached, returns a read-only ref, and re-evaluates only when its dependencies change and someone reads it. It must be pure: no side effects. `watch` performs a **side effect** in response to a change, such as calling an API, writing to storage, or logging, and gives you the new and old value plus a cleanup hook. A good test: if you want to produce a value to display, use `computed`; if you want to do something when a value changes, use `watch`. A common mistake is using a watcher to copy one value into another ref, which should be a computed; it adds an extra render cycle and risks the two values going out of sync.',
            },
            {
              question: 'How does `watchEffect` differ from `watch`?',
              answer:
                '`watch` takes explicit sources, is lazy by default (runs only after a change unless `immediate: true`), and gives you old and new values. `watchEffect` takes just a function, runs it immediately, and automatically tracks every reactive value read synchronously inside it, re-running when any of them change. It is shorter when several dependencies are involved, but less explicit: it gives no old value, and any value read after the first `await` is not tracked. I use `watch` when I need to react to a specific change or need the old value, and `watchEffect` for simple keep-in-sync effects.',
            },
            {
              question: 'What is the difference between `v-if` and `v-show`?',
              answer:
                '`v-if` is real conditional rendering: when false the element and its child components are not created at all (a comment placeholder remains), and toggling to true mounts them and runs lifecycle hooks. `v-show` always renders the element and only toggles the CSS `display` property. So `v-if` has a higher cost when toggling but a lower cost at first render if the condition starts false, and it supports `v-else`; `v-show` is cheap to toggle but costs the initial render even when hidden. Use `v-show` for things toggled often (tabs, tooltips) and `v-if` when the condition rarely changes or the hidden content should be fully reset or is expensive to keep alive.',
            },
            {
              question: 'Why does `v-for` need a `key`, and why is using the array index a problem?',
              answer:
                'The key gives each list item a stable identity so Vue\'s diff can tell which rows were added, removed or moved, and so it can preserve per-row state (typed input text, focus, child component state). Without keys, or with index as the key, Vue matches rows by position. If you insert an item at the top, every following row appears to have "changed" and Vue patches them all, while stateful children stay attached to the wrong data, for example the text typed in the first input remains in the first input although the row it belonged to has moved. Use a unique, stable id from the data. The index is acceptable only for static lists that are never reordered or edited.',
            },
            {
              question: 'Can you use `v-if` and `v-for` on the same element?',
              answer:
                'You should not. In Vue 3, `v-if` has higher priority than `v-for` (the reverse of Vue 2), so the condition is evaluated before the loop runs and cannot access the loop variable, which produces an error or surprising behaviour. The clean solutions are to filter the list in a `computed` property and loop over the result, which also avoids re-filtering on every render, or to put `v-for` on a `<template>` wrapper and `v-if` on the inner element.',
            },
            {
              question: 'How does reactivity work in Vue 3? How is it different from Vue 2?',
              answer:
                'Vue 3 wraps objects in JavaScript Proxies. When an effect (a component render, a computed, a watcher) is running and reads a reactive property, the Proxy\'s `get` trap calls `track`, which records that this effect depends on that property in a map from target to key to set of effects. When the property is later written, the `set` trap calls `trigger`, which re-runs the registered effects, batched through a scheduler so a component renders once after many changes. Vue 2 used `Object.defineProperty` to convert each existing property into a getter/setter at creation time, which could not detect added or deleted properties or array index assignment, hence `Vue.set` and `Vue.delete`. Proxies see every operation, including new keys and array changes, with no special API, and Vue 3 also creates reactivity lazily when nested objects are accessed rather than walking everything up front.',
            },
            {
              question: 'Why do you lose reactivity when you destructure a reactive object or a Pinia store, and how do you fix it?',
              answer:
                'Reactivity is established by reading a property through the Proxy while an effect runs. Destructuring `const { count } = state` performs that read once, outside any tracking effect, and stores a plain number, so there is no connection to the source later. The fix is to keep the property access inside reactive code, or to convert the properties into refs with `toRefs(state)` or `toRef(state, \'count\')`, which keep a live link. For Pinia the equivalent is `storeToRefs(store)` for state and getters, because the store is a reactive object; actions are plain functions and can be destructured directly. Vue 3.5\'s props destructure is a special case: the compiler rewrites the destructured names to `props.name` accesses, so it stays reactive.',
            },
            {
              question: 'What is the virtual DOM, and how does Vue optimise it?',
              answer:
                'The virtual DOM is a tree of lightweight JavaScript objects (vnodes) describing the UI. On a state change Vue builds a new tree, diffs it against the previous one, and applies the minimal set of real DOM operations, since DOM operations are comparatively expensive. Vue\'s distinguishing point is a compiler-informed virtual DOM: because templates are static and analysable at build time, the compiler hoists static content so it is created once, adds patch flags marking what can change on each dynamic node (text, class, props), and groups dynamic descendants into a flat array on a block root, so updates skip the static parts of the tree entirely. Combined with fine-grained reactivity (only components whose dependencies changed re-render), this is why a template is generally faster than a hand-written render function or JSX, which cannot be analysed this way.',
            },
            {
              question: 'What is `nextTick` and when do you need it?',
              answer:
                'Vue updates the DOM asynchronously: when state changes, it queues the component update and flushes the queue once on the next microtask, so many changes cause one render. That means right after `count.value++` the DOM still shows the old value. `await nextTick()` returns a promise that resolves after the pending DOM updates have been applied. You need it when your code must read or act on the updated DOM, for example to measure an element that was just shown with `v-if`, to focus an input that has just been rendered, or to scroll a list to its new last item. Alternatives are `watch` with `flush: \'post\'` and `onUpdated`. Needing it often can be a sign that the logic belongs in a lifecycle hook or watcher instead.',
            },
            {
              question: 'Explain the component lifecycle in Vue 3 and where you would put certain kinds of code.',
              answer:
                'In `<script setup>` the top-level code runs when the component instance is created (this replaces `beforeCreate` and `created`). Then `onBeforeMount`, the first render, and `onMounted` once the DOM exists. On each reactive change there are `onBeforeUpdate` and `onUpdated`, and on removal `onBeforeUnmount` and `onUnmounted`. Also `onActivated`/`onDeactivated` for `KeepAlive` and `onErrorCaptured` for errors from descendants. I put state, computed and watchers at the top level, code that needs the DOM (measuring, third-party widgets, focusing) in `onMounted`, and teardown (removing listeners, clearing timers, closing sockets) in `onBeforeUnmount`. On the server during SSR only the setup phase runs; `onMounted` never executes, so browser-only code must live there.',
            },
            {
              question: 'How do props and emits work, and why should you never mutate a prop?',
              answer:
                'Props are the inputs a parent passes down; emits are the events a child sends up. Both are declared with `defineProps` and `defineEmits`, which validate and, with TypeScript, type them. Props are one-way: updates flow from parent to child, never back. If a child mutated a prop, the parent\'s data would change behind its back; with primitives Vue warns, and with objects it silently mutates shared state, making bugs impossible to trace because any component could have changed the data. The correct patterns are to emit an event and let the owner update its state, to copy the prop into local state if the child needs a private editable version, or to use `v-model` through `defineModel` for a deliberate two-way contract.',
            },
            {
              question: 'How does `v-model` work on a custom component, and what does `defineModel` change?',
              answer:
                '`v-model` on a component is shorthand for passing a `modelValue` prop and listening for an `update:modelValue` event. Before Vue 3.4 the child had to declare that prop, declare that emit, and emit by hand. `defineModel()` (stable in 3.4) does all three: it returns a ref that reads the parent\'s value and, when you assign to it, automatically emits the update. You can have several models with names (`v-model:title` and `defineModel(\'title\')`), set defaults and types, and handle modifiers. It also works locally if the parent does not pass a value. The data flow is unchanged (still props down, events up); the boilerplate disappears.',
            },
            {
              question: 'What are slots and scoped slots? Give a use case for each.',
              answer:
                'Slots let a parent pass template content into a child, whereas props pass data. A default slot is the content between the tags; named slots (`<template #header>`) provide several insertion points; a fallback inside `<slot>` appears if the parent provides nothing. A typical use of a plain slot is a `Card` or `Modal` layout component. A scoped slot lets the child pass data back to the slot content, as in `<slot :item="item" />` and `#default="{ item }"` in the parent. That is how a reusable list, table or dropdown separates the child\'s job (looping, data, state) from the parent\'s job (how each row looks). It is Vue\'s analogue of render props.',
            },
            {
              question: 'What is a composable, and how is it different from a mixin or a utility function?',
              answer:
                'A composable is a function, conventionally named `useX`, that uses the Composition API (`ref`, `computed`, `watch`, lifecycle hooks) to encapsulate stateful logic and returns the reactive pieces a component needs, such as `useFetch` or `useLocalStorage`. A plain utility function is stateless: given input it returns output. A composable owns reactive state and can register lifecycle hooks, so it ties into the calling component\'s lifetime. Compared to mixins, composables make the data source explicit (you destructure what you use and can rename it), so there are no hidden name collisions, no implicit dependencies between mixins, and TypeScript can infer everything. Each call creates independent state unless you deliberately declare state outside the function. Composables must be called synchronously during `setup`, so hooks attach to the right component.',
            },
            {
              question: 'What is `provide`/`inject` and when would you use it over props or a store?',
              answer:
                '`provide` makes a value available to every descendant of a component, and `inject` lets any descendant read it regardless of depth, avoiding prop drilling. Use it for context with a clear owner and subtree scope, like a theme, a form group, or tabs providing their active tab to tab panels; use a Symbol (`InjectionKey`) as the key for safety and typing. Provide functions to change state alongside the value so the owner keeps control. Compared with props it hides the dependency, which hurts reuse and readability if overused, so for two or three levels props are clearer. Compared with Pinia, it is tied to a place in the component tree and has no DevTools timeline or persistence, so it is wrong for app-wide state that unrelated parts of the app share.',
            },
            {
              question: 'What does `<Teleport>` do and why would you need it?',
              answer:
                'Teleport renders part of a component\'s template into a different place in the DOM (such as the end of `<body>`), while keeping it logically part of the original component, so props, events, state and provide/inject all still work. The main use is modals, toasts and tooltips: if they are rendered inside a deeply nested element, an ancestor with `overflow: hidden`, a CSS transform or a lower stacking context can clip them or put them beneath other content. Teleporting to `body` avoids those layout problems without moving the component in the code.',
            },
            {
              question: 'How does Vue Router handle navigation guards? Are they a security feature?',
              answer:
                'Guards are functions the router calls during navigation, and they return `false` to cancel, a route location to redirect, or nothing to allow; they may be async. The order is: leave guards of the old components, global `beforeEach`, `beforeRouteUpdate` for reused components, per-route `beforeEnter`, resolution of lazy components, `beforeRouteEnter`, global `beforeResolve`, then navigation is confirmed and `afterEach` runs. Typical uses are redirecting unauthenticated users to a login page using `meta.requiresAuth`, warning about unsaved changes with `onBeforeRouteLeave`, and setting the page title in `afterEach`. They are not security: all code in the browser can be modified, and anyone can call the API directly. Guards improve user experience; real authorisation must be enforced by the server on every request.',
            },
            {
              question: 'What is the difference between `createWebHistory` and `createWebHashHistory`?',
              answer:
                '`createWebHistory` uses the browser History API to produce clean URLs like `/users/42`. It requires server configuration so that any unknown path returns `index.html`; otherwise refreshing or opening a deep link makes the server answer with a 404. `createWebHashHistory` puts the route after a `#` (`/#/users/42`), which the server never sees, so it works on any static hosting with no configuration, but the URLs are less clean and worse for SEO. I choose the web history by default and configure a fallback on the server, and use hash history for quick static hosting or embedded apps where I cannot control server rules.',
            },
            {
              question: 'A route changes from `/users/1` to `/users/2` but the page does not update. Why?',
              answer:
                'Vue Router reuses the same component instance when only params change, because it is more efficient than destroying and recreating it. That means `onMounted` or any code in `setup` does not run again, so data loaded there stays stale. The fix is to react to the change: `watch(() => route.params.id, load, { immediate: true })`, or use `onBeforeRouteUpdate`. A blunt alternative is giving `<RouterView :key="route.fullPath" />` a key so everything is recreated, at the cost of losing component state and extra rendering. Also remember params are strings, so convert with `Number()` if needed.',
            },
            {
              question: 'What is Pinia, and how does it differ from Vuex?',
              answer:
                'Pinia is the official state management library for Vue 3. A store holds state, getters and actions, and there are no mutations. Compared with Vuex: Pinia has no mutations, so you change state directly or in actions, and DevTools still record changes; there are no namespaced modules because each store is separate and stores can import each other; the API is simple and gives full TypeScript inference with no wrapper types; setup stores allow the Composition API style; and it is lighter and supports code splitting because stores are registered lazily on first use. Vuex is now in maintenance mode, so Pinia is recommended for new projects, while Vuex stays viable in existing apps until you decide to migrate.',
            },
            {
              question: 'Why did Vuex have mutations, and why did Pinia remove them?',
              answer:
                'In Vuex every state change has to go through a mutation: a named, synchronous function. That gave a precise, replayable log, so DevTools could record each mutation, show a before and after state, and time-travel; it also enforced a rule of "async in actions, sync state changes in mutations" so snapshots were always consistent. The cost was ceremony: for a simple change you wrote a mutation, usually an action, and string names, with poor TypeScript support. Pinia\'s authors found that DevTools could get the same traceability by tracking direct state changes, `$patch` and action calls, so the extra layer added friction without much benefit. Pinia keeps the discipline as a convention instead of a requirement: put business logic in actions, and you still get a timeline with action names.',
            },
            {
              question: 'Setup stores or options stores in Pinia?',
              answer:
                'Both are supported and equivalent in capability for most things. An options store (`state`, `getters`, `actions`) is familiar to Vuex and Options API users, is compact for simple stores, and has `$reset()` built in. A setup store is a function using `ref`, `computed` and plain functions like a composable; it is more flexible because you can use watchers, other composables and `inject`, and it matches the Composition API style, but you must return all state you want public (for DevTools, SSR and plugins to work) and write your own reset. I prefer setup stores for new code in a Composition API codebase and options stores when migrating from Vuex or on a team that finds the object shape easier to read.',
            },
            {
              question: 'How do you persist Pinia state and test a Pinia store?',
              answer:
                'For persistence I register `pinia-plugin-persistedstate` with `pinia.use(...)` and add `persist: true` (or an object with `key`, `storage`, `pick`) to the stores that should be saved, being careful not to store secrets in `localStorage`. To test a store in isolation I call `setActivePinia(createPinia())` in a `beforeEach` so each test starts with a fresh store, then call actions and assert on state and getters directly, since a store is just a function and some reactive data. For components I mount with `createTestingPinia()` from `@pinia/testing`, which stubs actions as spies by default so I can assert they were called without real side effects, and lets me set `initialState`. Using a store outside a component, for example in a router guard, requires calling `useXStore()` inside the function that runs after `app.use(pinia)`, not at module top level.',
            },
            {
              question: 'What is the difference between client state and server state, and why does it matter for tools?',
              answer:
                'Client state is owned by the browser app, such as whether a sidebar is open or the current step of a wizard; you control every change, so it never goes stale. Server state is a copy of data owned by a server, such as products or a profile; it can change without you knowing, so you have to deal with caching, staleness, refetching, loading and error states, request de-duplication, pagination and optimistic updates. Putting server data into a Pinia store means hand-writing all of that for each resource. A tool like TanStack Query for Vue is designed for it: `useQuery` with a key caches and shares results, refetches on focus or after `invalidateQueries`, and `useMutation` handles writes. A good architecture uses Pinia for client state (filters, auth session) and TanStack Query for server data, with the filters feeding query keys.',
            },
            {
              question: 'When do you need a store at all, and how do you decide between composable, provide/inject and Pinia?',
              answer:
                'I start with local state and props and emits. If distant components share data and the data belongs to a subtree with one owner, provide/inject. If it is tiny app-wide state such as a toast list, a composable with module-level state can work, but it is a singleton that leaks between users in SSR and between tests. When the state is shared across many unrelated screens or needs DevTools, persistence, plugins, SSR safety and testability, I use Pinia. If the data comes from a server, I reach for TanStack Query before a store. The principle is to keep state as close to where it is used as possible, since a global store makes components depend on global data and harder to reuse.',
            },
            {
              question: 'How would you handle performance problems with a very large list or large reactive data?',
              answer:
                'I would measure first with the Vue DevTools performance tab and the browser profiler. For large datasets that are replaced as a whole, I would use `shallowRef` (or `markRaw` for third-party objects) so Vue does not wrap every nested property in a Proxy; updates then happen by replacing `.value` or calling `triggerRef`. For long lists I would paginate or use virtual scrolling (for example `useVirtualList` from VueUse) so only visible rows exist in the DOM. I would move filtering and sorting into `computed` properties, use `v-memo` on rows for selection changes, use stable keys, avoid passing fresh inline objects as props, lazy-load routes and heavy components, and debounce expensive handlers. Each of these has trade-offs (stale UI risk with `v-memo`, nested changes undetected with `shallowRef`), so I would apply them only where measurements show a problem.',
            },
            {
              question: 'How do you type props, emits and refs in Vue with TypeScript?',
              answer:
                'In `<script setup lang="ts">` I use type-only declarations: `defineProps<{ user: User; size?: number }>()` for props, with `?` for optional; `defineEmits<{ select: [user: User]; close: [] }>()` for emits, so `emit(\'select\', 5)` is a compile error. In Vue 3.5 defaults come from normal destructuring (`const { size = 10 } = defineProps<...>()`), and earlier versions use `withDefaults`. Refs infer their type from the initial value; for values that start empty I write `ref<User | null>(null)`. Template refs use `useTemplateRef<HTMLInputElement>(\'name\')`. For provide/inject I use `InjectionKey<T>`. The important detail is that Vite only strips types and does not check them, so I run `vue-tsc --noEmit` in CI to type-check templates as well.',
            },
            {
              question: 'How do you test a Vue component, a composable and a store?',
              answer:
                'I use Vitest as the runner and Vue Test Utils for components. For a component I `mount` it with props, interact the way a user would (`await wrapper.get(\'button\').trigger(\'click\')`), and assert on rendered text and `wrapper.emitted()`; I always `await` interactions because DOM updates are asynchronous, and use `flushPromises` after mocked network calls (with `vi.spyOn(globalThis, \'fetch\')`). A composable that uses only refs can be called directly in a test; if it uses lifecycle hooks I run it inside a small host component so the hooks attach. Stores are tested with `setActivePinia(createPinia())`, and components that use stores with `createTestingPinia`. I select elements by `data-test` attributes or visible text rather than CSS classes, and keep a few end-to-end tests with Playwright or Cypress for critical flows.',
            },
            {
              question: 'What are `Suspense` and async components, and what is their status?',
              answer:
                '`defineAsyncComponent(() => import(\'./Heavy.vue\'))` creates a component whose code is loaded on demand, which is Vue\'s way of code splitting at the component level; it supports loading and error components, a delay and a timeout. `<Suspense>` coordinates async dependencies in its subtree (components with an async `setup`, meaning top-level `await` in `<script setup>`, and async components) and shows a `#fallback` slot until they resolve. Suspense is still documented as experimental, so I use it cautiously and keep my own explicit loading and error states, or use TanStack Query\'s `isPending` for data. Note that Suspense does not catch errors; those need `onErrorCaptured` or an error boundary.',
            },
            {
              question: 'What is new in recent Vue 3 versions that you would use in new code?',
              answer:
                'I use `defineModel` (stable in 3.4) for component `v-model`, reactive props destructure with defaults (stable in 3.5) instead of `withDefaults`, `useTemplateRef` (3.5) instead of matching a ref name to a template string, `useId` (3.5) for SSR-safe accessible ids, and generic components with `defineSlots` (3.3) for typed reusable components. Under the hood, 3.4 and 3.5 improved the template parser, avoided needless computed triggers, and cut memory use in reactivity; 3.5 also added lazy hydration for async components in SSR. Vapor mode, a compile-time rendering mode without a virtual DOM, is under development and experimental, so I would watch it but not rely on it in production until the Vue team marks it stable.',
            },
          ],
        },
      ],
    },
  ],
}
