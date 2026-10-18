export const nuxtSection = {
  id: 'nuxt',
  label: 'Nuxt',
  icon: '🟩',
  groups: [
    {
      id: 'nuxt-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-nuxt',
          title: 'What Nuxt Is and Why It Exists',
          summary:
            'Nuxt is a full-stack framework built on top of Vue: it adds file-based routing, server-side rendering, auto-imports, data fetching helpers and a built-in server (Nitro) so you do not have to assemble those pieces yourself.',
          keyPoints: [
            'Vue is a *UI library* (it turns state into DOM). **Nuxt is a framework around Vue**: it decides folder layout, routing, rendering mode, data loading and deployment, so a Nuxt project looks the same from team to team.',
            '**Why it exists:** a plain Vue app sends an almost empty HTML page and builds everything in the browser, which is slow to first paint and hard for search engines. Nuxt can render the HTML **on the server first** (SSR), so users and crawlers get real content immediately.',
            '**Conventions over configuration:** drop a file in `pages/` and you get a route, drop one in `components/` and it is auto-imported, drop one in `server/api/` and you get a backend endpoint — almost no wiring code.',
            'Nuxt is **full-stack**: the same project contains your Vue pages *and* your server routes, because Nuxt ships with **Nitro**, a small server engine that runs on Node.js, edge workers (Cloudflare) or as static files.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A simple way to think about it: **Vue is the engine, Nuxt is the whole car.** An engine alone does not get you anywhere — you still need wheels (routing), a fuel line (data fetching), a dashboard (SEO and meta tags) and a garage to park in (deployment). Nuxt bolts all of those on in a standard way. This guide assumes you already know Vue 3 basics (components, `ref`, `computed`, props, the Composition API) — those are covered in the Vue.js section — and focuses only on **what Nuxt adds on top**.',
            },
            {
              type: 'heading',
              text: 'The problem Nuxt solves: the empty-page problem',
            },
            {
              type: 'p',
              text: 'A normal Vue single-page app (SPA) built with Vite sends the browser a nearly empty HTML file (`<div id="app"></div>`) plus a big JavaScript bundle. The browser must download the JS, run it, call your API, and only then does the user see anything. Search engines and link-preview bots (Slack, WhatsApp, LinkedIn) often see the empty shell. Nuxt fixes this by **running your Vue code on a server first** and sending finished HTML, then letting Vue "wake up" in the browser. This is called **server-side rendering (SSR)**.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Browser
    participant Server as Nuxt server Nitro
    participant API as Data source
    Browser->>Server: GET /posts/1
    Server->>API: fetch post 1
    API-->>Server: JSON data
    Server->>Server: render Vue components to HTML
    Server-->>Browser: full HTML plus JS bundle plus data payload
    Note over Browser: user already sees the real content
    Browser->>Browser: hydrate - attach Vue to the existing HTML
    Note over Browser: page is now interactive like a normal SPA`,
            },
            {
              type: 'table',
              headers: ['', 'Plain Vue + Vite (SPA)', 'Nuxt'],
              rows: [
                ['First HTML sent', 'Empty shell, content built in the browser', 'Fully rendered HTML (SSR) or prerendered file (SSG) — your choice per route'],
                ['SEO / link previews', 'Needs workarounds', 'Works out of the box'],
                ['Routing', 'Add `vue-router` and write a route table by hand', 'Automatic from the `pages/` folder'],
                ['Imports', 'Import every component and composable manually', 'Auto-imported'],
                ['Backend', 'Separate project needed', 'Optional built-in server in `server/` (Nitro)'],
                ['Deployment', 'Static hosting only', 'Node server, static files, serverless or edge — one config switch'],
              ],
            },
            {
              type: 'heading',
              text: 'What you get in the box',
            },
            {
              type: 'list',
              items: [
                '**Vite** as the dev server and bundler (instant start, hot reload).',
                '**Vue Router** wired up for you from the file system (see the Vue Router topic in the Vue.js section for the router itself).',
                '**Nitro** — the server engine that handles API routes, caching, and building for any hosting platform.',
                '**Auto-imports**, **layouts**, **route middleware**, **plugins**, **error pages**, **head/SEO helpers**, **data-fetching composables** (`useFetch`, `useAsyncData`) and **SSR-safe state** (`useState`).',
                '**A module ecosystem** (images, content, i18n, UI kits, auth) installed with one line in the config.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Versions (as of October 2026):** the current major is **Nuxt 4** (4.0 shipped in July 2025; the 4.x line has had regular minor releases since, 4.6 being the latest at the time of writing). It is an evolution of Nuxt 3 rather than a rewrite: application code moves into an `app/` directory, data fetching got stricter and faster defaults, and TypeScript is split per context. **Nuxt 3 reached end-of-life on July 31, 2026** and Nuxt 2 (Vue 2) on June 30, 2024 — new work belongs on Nuxt 4. **Nuxt 5** (built around **Nitro v3** and **h3 v2**) is being prepared inside the 4.x line: you can already opt into most of its changes with `future: { compatibilityVersion: 5 }` — see the "Preparing for Nuxt 5" topic.',
            },
            {
              type: 'heading',
              text: 'The mental model you need for everything else',
            },
            {
              type: 'p',
              text: 'Almost every hard Nuxt bug comes from forgetting one fact: **your component code runs twice, in two different environments.** First on the server (Node, Bun, Deno or an edge worker), once per request, with no `window` and with many users sharing the same process. Then in the browser, once per tab, where it must reproduce *exactly* the same first render so hydration can reuse the server HTML. Data that the server already loaded must be **transferred** (the *payload*), not fetched again, and state that belongs to one user must be **created per request**, never at module scope. Keep this two-pass model in your head and most of Nuxt\'s APIs — `useFetch`, `useState`, `<ClientOnly>`, `import.meta.client`, `useRequestFetch` — stop looking like magic and start looking like the obvious tools for that model.',
            },
            {
              type: 'table',
              headers: ['Concern', 'Server pass (SSR)', 'Browser pass (hydration and after)'],
              rows: [
                ['Runs', 'Once per HTTP request, in a shared long-lived process', 'Once per tab, for one user'],
                ['Available globals', 'No `window`, `document`, `localStorage`', 'Full DOM and browser APIs'],
                ['Lifecycle hooks', '`setup` runs; `onMounted`/`onUpdated` never run', 'All hooks run'],
                ['Data', 'Fetched here, then written into the payload', 'Read back from the payload on first load; fetched normally on later navigations'],
                ['Danger', 'Leaking state between users; slow upstream calls block the response', 'Rendering something different from the server (hydration mismatch)'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Nuxt does not make a bad Vue app good — it makes the *surrounding* decisions for you (rendering, routing, deployment). If you only need a logged-in dashboard behind a login wall, with no SEO needs, plain Vue + Vite may be simpler; see the final topic on when *not* to use Nuxt.',
            },
          ],
        },
        {
          id: 'project-structure-and-config',
          title: 'Project Structure and nuxt.config.ts',
          summary:
            'A Nuxt project is a set of folders where the folder name carries meaning, plus a single `nuxt.config.ts` for settings. Nuxt 4 puts app code in `app/`; Nuxt 3 keeps it at the project root.',
          keyPoints: [
            'Create a project with `npm create nuxt@latest` (or `npx nuxi@latest init my-app`), then `npm run dev` for the dev server with hot reload and `npm run build` for production.',
            '**Nuxt 4 layout:** application code lives in `app/` (`pages/`, `components/`, `composables/`, `layouts/`, `middleware/`, `plugins/`, `utils/`, `assets/`, `app.vue`); `server/`, `public/`, `shared/`, `modules/` and `nuxt.config.ts` stay at the project root. **Nuxt 3:** the same folders sit directly in the root.',
            '`nuxt.config.ts` is the one place for global settings: `modules`, `runtimeConfig`, `routeRules`, `app.head`, `css`, `nitro`, `devtools`. It is type-checked via `defineNuxtConfig`.',
            'The `.nuxt/` folder (generated types and glue code) and `.output/` (production build) are build artifacts — never edit or commit them.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'create and run a project',
              code: `npm create nuxt@latest my-app
cd my-app
npm run dev          # http://localhost:3000 with hot module reload

npm run build        # production build into .output/
npm run preview      # run the production build locally
npm run generate     # fully static site (prerender every page)`,
            },
            {
              type: 'code',
              language: 'text',
              title: 'Nuxt 4 project layout',
              code: `my-app/
  app/                      # <-- everything the browser/SSR renders
    app.vue                 # root component (can be omitted if you use pages/)
    app.config.ts           # build-time, public, non-secret settings
    error.vue               # custom error page
    pages/                  # file-based routes
    layouts/                # page shells (header/footer/sidebar)
    components/             # auto-imported Vue components
    composables/            # auto-imported use* functions
    utils/                  # auto-imported plain helpers
    middleware/             # route middleware (runs before navigation)
    plugins/                # code that runs once at app start
    assets/                 # files processed by Vite (css, images)
  server/                   # <-- backend, runs only on the server (Nitro)
    api/                    # /api/* endpoints
    routes/                 # endpoints without the /api prefix
    middleware/             # runs on every request
    utils/                  # auto-imported server helpers
  shared/                   # code usable by BOTH app/ and server/ (Nuxt 4)
    utils/                  # auto-imported in app AND server
    types/                  # auto-imported types
  layers/                   # local Nuxt layers, auto-registered (see the layers topic)
  public/                   # served as-is at the site root (favicon, robots.txt)
  modules/                  # your own local Nuxt modules
  nuxt.config.ts
  tsconfig.json`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Why the `app/` folder?** In Nuxt 3, `pages/`, `server/`, `node_modules/` and `.git/` all sat side by side, which made file watchers slow and made it unclear what was browser code and what was server code. Nuxt 4 groups browser-side code in `app/` (the `~` alias now points there) and keeps server code outside it. Existing Nuxt 3-style layouts (folders at the root) are still auto-detected, so the move is not forced on day one — but new projects should use `app/`.',
            },
            {
              type: 'table',
              headers: ['Alias', 'Points to', 'Use it for'],
              rows: [
                ['`~` / `@`', '`app/` (the `srcDir`)', 'App code: `~/components/Foo.vue`'],
                ['`~~` / `@@`', 'Project root (`rootDir`)', 'Root files: `~~/shared/schemas`, `~~/content`'],
                ['`#shared`', '`shared/`', 'Code imported by both app and server'],
                ['`#server`', '`server/` (Nuxt 4.3+)', 'Server-internal imports; import protection blocks it from client and shared code'],
                ['`#imports`', 'Every auto-import', 'Explicit imports in tests and libraries: `import { useState } from \'#imports\'`'],
              ],
            },
            {
              type: 'p',
              text: '**Three contexts, three TypeScript projects.** Nuxt 4 generates separate tsconfigs for the app, the server, shared code and the config/node context. That is not ceremony: it is what lets your editor tell you that `window` does not exist in a server handler, that `useRoute()` is not available in `server/`, and that a `shared/` file must not import either side. Nuxt 4 also turns on `noUncheckedIndexedAccess` by default, so `arr[0]` is typed as possibly `undefined` — expect a few new type errors when you upgrade, and fix them rather than switching it off.',
            },
            {
              type: 'heading',
              text: 'nuxt.config.ts — a realistic example',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts',
              code: `// defineNuxtConfig gives you autocompletion and type checking for every option
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15', // pins platform/Nitro behaviour to a known date
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@pinia/nuxt', '@vueuse/nuxt'],

  css: ['~/assets/css/main.css'],

  // Per-route rendering and caching rules (explained in the rendering topic)
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { swr: 600 },
    '/admin/**': { ssr: false },
  },

  // Values readable at runtime; env vars override them (see runtime config topic)
  runtimeConfig: {
    apiSecret: '',                 // server only
    public: { apiBase: '/api' },   // exposed to the browser
  },

  // Defaults for <head> on every page
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s - My Shop',
    },
  },

  // Settings for the server engine
  nitro: {
    compressPublicAssets: true,
  },
})`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Run `npx nuxt info` to print your Nuxt/Vue/Nitro versions and environment — paste it into bug reports. `npx nuxt prepare` regenerates the `.nuxt/` types after a fresh clone (the `postinstall` script usually does this for you).',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Importing from the wrong side: code in `server/` must never import from `app/` (components, composables that use `useNuxtApp`), and browser code must never import server-only packages (database drivers, `fs`). If both need the same code (types, zod schemas, constants), put it in `shared/` (Nuxt 4) or a plain file imported by both.',
            },
          ],
        },
        {
          id: 'auto-imports',
          title: 'Auto-Imports: Components, Composables and Utils',
          summary:
            'Nuxt scans specific folders at build time and makes everything in them available without `import` statements — plus all Vue and Nuxt APIs — while still generating real, tree-shaken imports in the output.',
          keyPoints: [
            'Components in `components/` are registered globally by name (`components/Cart/Item.vue` becomes `<CartItem />`); composables in `composables/` and helpers in `utils/` are importable by name with no `import` line.',
            'Vue APIs (`ref`, `computed`, `watch`, `onMounted`) and Nuxt APIs (`useFetch`, `useState`, `useRoute`, `navigateTo`) are auto-imported too.',
            'It is **not magic at runtime**: a build step (unimport) scans your code, spots which names you use and inserts the real `import` for you, so unused code is still tree-shaken. Types are generated into `.nuxt/` so your editor knows about them.',
            'Only **top-level files** of `composables/` and `utils/` are scanned by default — nested folders need a re-export in an `index.ts` or an `imports.dirs` entry in the config.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'In plain Vue you write `import { ref } from \'vue\'` and `import UserCard from \'@/components/UserCard.vue\'` in every file. Nuxt removes that ceremony. During the build a compiler plugin looks at the identifiers you use, matches them against a list of known exports, and **adds the import statements for you**. What lands in the browser bundle is ordinary ES module code — only the *authoring* experience changed.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["You write: const n = useCounter()"] --> B["Build step scans source"]
    B --> C{"Name known?"}
    C -- yes --> D["Inserts: import useCounter from composables/useCounter.ts"]
    C -- no --> E["Left as is, TypeScript error if undefined"]
    D --> F["Tree-shaken bundle"]
    B -. generates .-> G[".nuxt/types for the editor"]`,
            },
            {
              type: 'code',
              language: 'text',
              title: 'what is scanned',
              code: `components/
  AppButton.vue          ->  <AppButton />
  Cart/Item.vue          ->  <CartItem />        (path becomes part of the name)
  Cart/CartItem.vue      ->  <CartItem />        (duplicate prefix is collapsed)
  LazyChart.vue          ->  <LazyChart />       (Lazy prefix = load on demand)
composables/
  useCart.ts             ->  useCart()           (top-level file only)
  auth/useUser.ts        ->  NOT scanned         (nested; re-export it or add to imports.dirs)
utils/
  formatPrice.ts         ->  formatPrice()`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/composables/useCart.ts',
              code: `// No import for ref/computed/useState — they are auto-imported
export const useCart = () => {
  const items = useState<{ id: number; qty: number }[]>('cart-items', () => [])
  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))

  function add(id: number) {
    const existing = items.value.find(i => i.id === id)
    if (existing) existing.qty++
    else items.value.push({ id, qty: 1 })
  }

  return { items, count, add }
}`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/shop.vue — nothing imported',
              code: `<script setup lang="ts">
const { count, add } = useCart()          // from composables/
const price = formatPrice(1999)            // from utils/
</script>

<template>
  <div>
    <AppButton @click="add(1)">Add ({{ count }})</AppButton>   <!-- from components/ -->
    <p>{{ price }}</p>
  </div>
</template>`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — scan nested folders',
              code: `export default defineNuxtConfig({
  imports: {
    dirs: ['composables/**', 'stores'],   // scan nested composables and a stores folder
  },
  components: [
    { path: '~/components', pathPrefix: false },  // <Item /> instead of <CartItem />
  ],
})`,
            },
            {
              type: 'heading',
              text: 'The trade-offs',
            },
            {
              type: 'table',
              headers: ['Benefit', 'Cost'],
              rows: [
                ['Much less boilerplate; files stay short', 'Harder to see where a name comes from when reading code (use "Go to definition" or the DevTools Imports tab)'],
                ['Refactors (moving a file) do not break imports', 'Name collisions: two composables with the same export name conflict silently or warn'],
                ['Tree-shaking still works', 'Code outside Nuxt (a plain Node script, some test setups) has no auto-imports'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'You can always import explicitly — `import { useCart } from \'~/composables/useCart\'` — useful in tests, scripts and shared libraries. Explicit imports and auto-imports mix freely. Turn auto-imports off entirely with `imports: { autoImport: false }` if your team prefers explicit code.',
            },
            {
              type: 'heading',
              text: 'Auto-imports on the server and in shared code',
            },
            {
              type: 'p',
              text: 'The server has its own, separate auto-import scope: files in `server/utils/` plus Nitro and h3 helpers (`defineEventHandler`, `getQuery`, `useStorage`...) are available in `server/` without imports. Files in `shared/utils/` and `shared/types/` are auto-imported on **both** sides. The two scopes never mix — a composable from `app/composables/` is not visible in a server handler, and that is deliberate: it would usually depend on the Vue app, which does not exist there.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Direction of travel:** with `future: { compatibilityVersion: 5 }` server auto-imports become opt-in, and Nuxt 4.6 introduced explicit imports from `nuxt/server` for server code. Large teams increasingly keep auto-imports for Vue/Nuxt composables in the app but write explicit imports in `server/` — easier to grep, and portable across server runtimes.',
            },
          ],
        },
        {
          id: 'file-based-routing',
          title: 'File-Based Routing: Pages, Dynamic Routes and NuxtLink',
          summary:
            'Every file in `pages/` becomes a URL. Brackets in a file name make a dynamic parameter, folders make nested paths, and `<NuxtPage />` plus `<NuxtLink>` render and navigate between them.',
          keyPoints: [
            'The file path *is* the route: `pages/index.vue` is `/`, `pages/about.vue` is `/about`, `pages/blog/index.vue` is `/blog`. Nuxt generates a Vue Router table from them (see the Vue Router topic in the Vue.js section).',
            'Brackets mean parameters: `[id].vue` is required, `[[id]].vue` is optional, `[...slug].vue` is a catch-all that captures any depth. Read them with `useRoute().params`.',
            '**Nested routes:** a file `parent.vue` next to a folder `parent/` renders children where the parent places `<NuxtPage />`. The parent stays mounted while the child changes.',
            '`<NuxtLink to="/blog">` replaces `<a>`: client-side navigation, automatic **prefetching** of the target page code when the link scrolls into view, and normal `<a href>` for crawlers. `definePageMeta` attaches per-page options (layout, middleware, validate, transitions).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'text',
              title: 'file path -> URL',
              code: `app/pages/
  index.vue                 ->  /
  about.vue                 ->  /about
  blog/
    index.vue               ->  /blog
    [slug].vue              ->  /blog/hello-world          (param: slug)
  users/
    [[id]].vue              ->  /users  and  /users/42     (optional param)
  shop/
    [category]/[id].vue     ->  /shop/shoes/42             (two params)
  docs/
    [...path].vue           ->  /docs/a  /docs/a/b/c       (catch-all, params.path is an array)
  [...notFound].vue         ->  any URL nothing else matched (custom 404 page)`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    U["Browser requests /blog/hello-world"] --> R["Vue Router table generated from pages/"]
    R --> M{"Which file matches?"}
    M -- "blog/[slug].vue" --> P["Render page with params.slug = hello-world"]
    M -- no match --> C["[...notFound].vue or 404 error page"]
    P --> L["Wrapped by the layout"]`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/blog/[slug].vue',
              code: `<script setup lang="ts">
const route = useRoute()                      // reactive; works on server and client
const slug = route.params.slug as string

// Reject bad URLs BEFORE rendering: a failed validate gives a 404
definePageMeta({
  validate: (route) => typeof route.params.slug === 'string' && route.params.slug.length > 0,
})

const { data: post } = await useFetch(\`/api/posts/\${slug}\`)
</script>

<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <p>{{ post.body }}</p>
    <NuxtLink to="/blog">Back to all posts</NuxtLink>
  </article>
</template>`,
            },
            {
              type: 'heading',
              text: 'Nested routes',
            },
            {
              type: 'p',
              text: 'Think of nested routes as **picture frames inside a picture frame**. The outer file draws the frame (a settings sidebar, say) and the inner file is the picture. The outer page must contain `<NuxtPage />` — that is the hole where the matching child appears.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/settings.vue  (parent) + pages/settings/profile.vue (child)',
              code: `<!-- pages/settings.vue : shown for /settings and every /settings/* URL -->
<template>
  <div class="settings">
    <nav>
      <NuxtLink to="/settings/profile">Profile</NuxtLink>
      <NuxtLink to="/settings/billing">Billing</NuxtLink>
    </nav>
    <NuxtPage />   <!-- profile.vue or billing.vue renders here -->
  </div>
</template>`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'If you create `pages/settings.vue` **and** `pages/settings/index.vue` is missing, `/settings` renders the parent with an empty `<NuxtPage />`. Add `settings/index.vue` for the default child. Also: a page used with transitions or `<NuxtPage>` keys should have a **single root element**, otherwise transitions and route changes can misbehave.',
            },
            {
              type: 'heading',
              text: 'Route groups and named views',
            },
            {
              type: 'p',
              text: 'A folder in parentheses is a **route group**: it organises files without adding a URL segment. `pages/(marketing)/pricing.vue` is served at `/pricing`. Since Nuxt 4.3 the group names are exposed as `useRoute().meta.groups`, so one middleware can protect a whole group without listing every page. Nuxt 4.5 added **named views**: a sibling file named `child@sidebar.vue` renders into a `<NuxtPage name="sidebar" />` outlet next to the default one — useful for master/detail screens where a side panel depends on the route.',
            },
            {
              type: 'code',
              language: 'text',
              title: 'route groups and named views',
              code: `app/pages/
  (marketing)/
    pricing.vue             ->  /pricing              (meta.groups = ['marketing'])
  (protected)/
    dashboard.vue           ->  /dashboard            (meta.groups = ['protected'])
  inbox.vue                 ->  parent with <NuxtPage /> and <NuxtPage name="sidebar" />
  inbox/
    [id].vue                ->  /inbox/42, default outlet
    [id]@sidebar.vue        ->  /inbox/42, "sidebar" outlet (Nuxt 4.5+)`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/middleware/protected.global.ts — guard a whole group',
              code: `export default defineNuxtRouteMiddleware((to) => {
  const groups = (to.meta.groups as string[] | undefined) ?? []
  // useUserSession comes from nuxt-auth-utils; swap in your own auth composable
  if (groups.includes('protected') && !useUserSession().loggedIn.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Nuxt 4.4 moved to **vue-router v5**, which absorbed the typed-routes work from `unplugin-vue-router`. Typed pages (`experimental.typedPages`) give you autocompletion and type errors for `navigateTo({ name: ... })` and `<NuxtLink :to>`; they are still behind a flag in Nuxt 4 and on by default with `compatibilityVersion: 5`. Also note that Nuxt 5 makes routing **case-sensitive** by default — do not rely on `/About` matching `about.vue`.',
            },
            {
              type: 'heading',
              text: 'NuxtLink and programmatic navigation',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'NuxtLink, navigateTo and useRouter',
              code: `<script setup lang="ts">
async function afterSave() {
  // navigateTo works in components, middleware and plugins — on server it issues a redirect
  await navigateTo({ path: '/blog', query: { page: 2 } })
}
</script>

<template>
  <NuxtLink to="/blog">Blog</NuxtLink>
  <NuxtLink :to="{ name: 'blog-slug', params: { slug: 'hello' } }">Named route</NuxtLink>
  <NuxtLink to="https://nuxt.com" external target="_blank">External site</NuxtLink>
  <NuxtLink to="/heavy" :prefetch="false">Do not prefetch this one</NuxtLink>
  <button @click="afterSave">Save</button>
</template>`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Use `<NuxtLink>` instead of `<a href>` for internal links. A plain `<a>` causes a full page reload and throws away your client-side state; `NuxtLink` gives instant navigation and prefetches the next page\'s JavaScript when the link becomes visible.',
            },
          ],
        },
        {
          id: 'layouts-and-transitions',
          title: 'Layouts, Page Transitions and Loading Indicators',
          summary:
            'Layouts are reusable page shells (header, footer, sidebar) that wrap pages via `<NuxtLayout>`; transitions and `<NuxtLoadingIndicator>` make route changes feel smooth.',
          keyPoints: [
            'A file `layouts/default.vue` wraps every page automatically; the page is rendered into its `<slot />`. Pick another layout per page with `definePageMeta({ layout: \'admin\' })` or turn layouts off with `layout: false`.',
            'In `app.vue`, `<NuxtLayout><NuxtPage /></NuxtLayout>` is the standard skeleton. If you omit `app.vue`, Nuxt provides this skeleton itself when `pages/` exists.',
            'Change layout dynamically with `setPageLayout(\'admin\')` (for example after login) — useful when the layout depends on state, not on the file.',
            '**Page transitions** (CSS animations between routes) are set in `app.pageTransition` or per page; `<NuxtLoadingIndicator />` shows a thin progress bar while navigation or data loading is in progress.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A **layout** is the part of the screen that stays the same while the page content changes — the picture frame, not the picture. Without layouts you would repeat the header and footer in every page file.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    App["app.vue"] --> Ind["NuxtLoadingIndicator"]
    App --> Lay["NuxtLayout"]
    Lay -- "layouts/default.vue or the page's chosen layout" --> Shell["Header + slot + Footer"]
    Shell --> Page["NuxtPage renders the matched page"]
    Page --> Child["Nested NuxtPage renders child route"]`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/app.vue',
              code: `<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#00dc82,#34cdfe)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/layouts/default.vue and app/layouts/admin.vue',
              code: `<!-- layouts/default.vue -->
<template>
  <div>
    <AppHeader />
    <main><slot /></main>      <!-- the page is rendered here -->
    <AppFooter />
  </div>
</template>

<!-- layouts/admin.vue : a layout can itself be fed named slots or props -->
<template>
  <div class="admin">
    <AdminSidebar />
    <section><slot /></section>
  </div>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'choosing and switching layouts',
              code: `<script setup lang="ts">
// Static choice for this page
definePageMeta({ layout: 'admin' })

// Dynamic choice at runtime (e.g. after login)
function onLoggedIn() {
  setPageLayout('admin')
}
</script>

<!-- Or take full control inside a single page -->
<template>
  <NuxtLayout name="admin">
    <h1>Dashboard</h1>
  </NuxtLayout>
</template>`,
            },
            {
              type: 'heading',
              text: 'Page and layout transitions',
            },
            {
              type: 'p',
              text: 'Nuxt wraps pages in Vue\'s `<Transition>` component (covered in the Vue.js section). You name the transition and write CSS for the `-enter-active` / `-leave-active` classes. `mode: \'out-in\'` waits for the old page to leave before the new one enters.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts',
              code: `export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/app.vue (styles) and per-page override',
              code: `<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

<!-- In a page that should NOT animate: -->
<script setup lang="ts">
definePageMeta({ pageTransition: false })
</script>`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Transitions only work when the page and layout have **one single root element**. A page whose template has several top-level nodes (or comments at the top level) will not animate and may log "Component inside <Transition> renders non-element root node". Wrap content in one `<div>`.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`<NuxtLoadingIndicator>` hooks into navigation and `useAsyncData` automatically. For manual control (a long form submit), use `const { start, finish } = useLoadingIndicator()`. Add `<NuxtRouteAnnouncer />` so screen readers announce page changes after a client-side navigation — an accessibility detail that plain SPAs often miss. For in-page updates ("Message sent"), Nuxt 4.4 added `useAnnouncer()` with `polite()` and `assertive()` plus a `<NuxtAnnouncer />` component.',
            },
            {
              type: 'heading',
              text: 'Layouts from route rules, with props (Nuxt 4.3+)',
            },
            {
              type: 'p',
              text: 'Choosing the layout in every page file does not scale for a whole area of the site. Since Nuxt 4.3 you can assign a layout by URL pattern with the `appLayout` route rule, pass props to a layout with `setPageLayout(name, props)` (or `definePageMeta({ layout: { name, props } })`, typed from the layout\'s `defineProps` since 4.4), and read the resolved layout anywhere with `useLayout()` (4.5).',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'layout per URL pattern and layout props',
              code: `// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/admin/**': { appLayout: 'admin' },
    '/auth/**': { appLayout: 'minimal' },
  },
})

// in a page or composable: switch layout and give it props
setPageLayout('admin', { sidebar: true, theme: 'dark' })

// in any component: which layout is active for this route? (read-only computed)
const layout = useLayout()`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Layout state is **not** a good place for data. A layout stays mounted across navigations, so a `useFetch` inside it runs once and does not refetch when the page changes unless you watch the route. Keep layouts as dumb shells; fetch page data in pages, and shared data (current user, navigation menu) in a composable keyed with `useState`/`useAsyncData`.',
            },
          ],
        },
        {
          id: 'pages-vs-components',
          title: 'Pages vs Components, and Client-Only / Server-Only Components',
          summary:
            'Pages (in `pages/`) are routable and get route features; components (in `components/`) are reusable pieces. Special file suffixes and wrappers let a component run only in the browser, only on the server, or load lazily.',
          keyPoints: [
            'A **page** is a component that owns a URL: it can use `definePageMeta`, route middleware and gets the router\'s params. A **component** is just reusable UI; it never becomes a route by itself.',
            'Prefix a component name with `Lazy` (`<LazyHeavyChart />`) to split it into its own JavaScript chunk, loaded only when it is first rendered.',
            '`MyMap.client.vue` renders only in the browser; `<ClientOnly>` wraps any part of a template the same way. Use them for code that needs `window`, `document`, or a browser-only library.',
            '`MyCard.server.vue` renders only on the server (an **island** / server component): its JavaScript is never sent to the browser. This is useful for heavy, non-interactive content; it is an experimental feature to enable and has limits.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The mental split is: **pages answer "which URL?", components answer "what does this piece look like?"** Keep pages thin — fetch data, compose components, set SEO — and move markup and logic into components and composables. Pages are also where route-level features hang: `definePageMeta`, `useRoute`, middleware and transitions.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Q1{"Does it need its own URL?"}
    Q1 -- yes --> Page["pages/ file"]
    Q1 -- no --> Q2{"Needs window or browser-only library?"}
    Q2 -- yes --> Client["Name.client.vue or ClientOnly wrapper"]
    Q2 -- no --> Q3{"Heavy, below the fold or rarely shown?"}
    Q3 -- yes --> Lazy["Use with Lazy prefix"]
    Q3 -- no --> Q4{"Static content, no interactivity, big dependencies?"}
    Q4 -- yes --> Server["Name.server.vue island"]
    Q4 -- no --> Normal["Normal component in components/"]`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'Lazy prefix and ClientOnly',
              code: `<script setup lang="ts">
const showChart = ref(false)
</script>

<template>
  <!-- The chart JS is downloaded only when v-if becomes true -->
  <LazyRevenueChart v-if="showChart" :data="data" />
  <button @click="showChart = true">Show chart</button>

  <!-- A browser-only widget. The fallback is rendered on the server and until it mounts. -->
  <ClientOnly>
    <MapWidget :center="[51.5, -0.1]" />
    <template #fallback>
      <div class="map-skeleton">Loading map...</div>
    </template>
  </ClientOnly>
</template>`,
            },
            {
              type: 'heading',
              text: 'Client-only and server-only components',
            },
            {
              type: 'table',
              headers: ['File / wrapper', 'Rendered on server?', 'JS sent to browser?', 'Typical use'],
              rows: [
                ['`Card.vue`', 'Yes', 'Yes (hydrated)', 'Normal components'],
                ['`Map.client.vue` or `<ClientOnly>`', 'No (only fallback)', 'Yes', 'Maps, charts using `window`, WYSIWYG editors'],
                ['`Card.server.vue` (island)', 'Yes', 'No', 'Big markdown render, syntax highlighting, static widgets'],
                ['`<LazyCard />`', 'Yes (if visible at load)', 'Later, on demand', 'Modals, tabs, heavy below-the-fold sections'],
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — enable server components',
              code: `export default defineNuxtConfig({
  experimental: {
    componentIslands: true, // lets you use *.server.vue components
  },
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/components/RenderedMarkdown.server.vue',
              code: `<script setup lang="ts">
// This heavy dependency never reaches the browser bundle
import { marked } from 'marked'
const props = defineProps<{ source: string }>()
const html = computed(() => marked.parse(props.source))
</script>

<template>
  <div class="prose" v-html="html" />
</template>`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A server component cannot be interactive on its own — there is no JavaScript for it in the browser, so `@click` handlers inside do nothing. Props must be serializable (plain data, no functions), and each island update asks the server for fresh HTML. Treat islands as an optimization for static, expensive content, not a default.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '`v-html` with untrusted content is an XSS hole. In the example above, only render markdown from sources you trust, or sanitize the HTML first.',
            },
          ],
        },
        {
          id: 'rendering-modes',
          title: 'Rendering Modes: CSR, SSR, SSG, ISR/SWR, Hybrid and Islands',
          summary:
            'A rendering mode answers one question: **when and where is the HTML for a page created** — in the browser, on every request, at build time, or cached in between. Nuxt lets you choose per route with `routeRules`.',
          keyPoints: [
            '**CSR / SPA** (`ssr: false`): the browser builds the page from JS. **SSR** (the default): the server builds HTML on every request. **SSG / prerender**: HTML is built once at build time. **ISR / SWR**: built on demand, cached, and refreshed in the background.',
            '**Hybrid rendering** means mixing modes per route via `routeRules` — for example prerender the home page, SWR the blog, SSR the product pages and make `/admin` a pure SPA.',
            'Every SSR/SSG page is **hydrated** in the browser afterwards, so it behaves like a SPA from then on (see the next topic). Only the *first* load is special; later navigations are client-side.',
            'Pick by asking: *Does the content change per user or per second? Do I need SEO? Can I tolerate slightly stale data? Do I have a server?*',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine a restaurant. **CSR** is a meal kit: the kitchen mails you raw ingredients and you cook at home (the browser does all the work). **SSR** is cooking to order — fresh but the customer waits for the kitchen every time. **SSG** is a buffet prepared before opening — instant to serve, but not updated until the next batch. **ISR/SWR** is the buffet that refills a tray in the background when it gets old — people eat now, the next person gets the refreshed version.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph CSR["CSR - SPA"]
      direction TB
      c1["Browser gets empty HTML"] --> c2["Downloads JS"] --> c3["Fetches data"] --> c4["Renders page"]
    end
    subgraph SSR["SSR"]
      direction TB
      s1["Request arrives"] --> s2["Server fetches data + renders HTML"] --> s3["Browser shows HTML"] --> s4["Hydrates"]
    end
    subgraph SSG["SSG - prerender"]
      direction TB
      g1["Build time: render every page to a file"] --> g2["CDN serves file"] --> g3["Browser hydrates"]
    end
    subgraph ISR["ISR and SWR"]
      direction TB
      i1["Request arrives"] --> i2{"Cached copy fresh?"}
      i2 -- yes --> i3["Serve cache"]
      i2 -- stale --> i4["Serve stale and re-render in background"]
      i2 -- none --> i5["Render now and store"]
    end`,
            },
            {
              type: 'table',
              headers: ['Mode', 'HTML created', 'Needs a server at runtime?', 'Data freshness', 'SEO', 'Best for'],
              rows: [
                ['**CSR / SPA**', 'In the browser', 'No (static host)', 'Always live', 'Weak', 'Logged-in dashboards, internal tools'],
                ['**SSR**', 'On the server, per request', 'Yes', 'Always live', 'Strong', 'Personalised or fast-changing public pages'],
                ['**SSG / prerender**', 'At build time', 'No (CDN)', 'Frozen until rebuild', 'Strong', 'Marketing pages, docs, blogs that change rarely'],
                ['**ISR / SWR**', 'On first request, then cached and refreshed', 'Yes (or a platform with ISR)', 'Stale by at most N seconds', 'Strong', 'Catalogues, news, large content sites'],
                ['**Islands**', 'Server for just parts of a page', 'Yes', 'Per render', 'Strong', 'Heavy static widgets inside an interactive page'],
              ],
            },
            {
              type: 'heading',
              text: 'Choosing a mode',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Start["New route"] --> A{"Needs SEO or link previews?"}
    A -- no --> SPA["CSR: ssr false"]
    A -- yes --> B{"Same content for every visitor?"}
    B -- no --> SSR["SSR"]
    B -- yes --> C{"How often does it change?"}
    C -- "Rarely" --> SSG["Prerender at build"]
    C -- "Minutes to hours" --> ISR["SWR or ISR with a TTL"]
    C -- "Every request" --> SSR`,
            },
            {
              type: 'heading',
              text: 'Hybrid rendering with routeRules',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts',
              code: `export default defineNuxtConfig({
  // ssr: true is the default. ssr: false would turn the WHOLE app into an SPA.
  routeRules: {
    '/': { prerender: true },                       // built once at build time (SSG)
    '/about': { prerender: true },
    '/blog/**': { swr: 3600 },                      // cached 1 hour, refreshed in background
    '/products/**': { isr: 600 },                   // like swr but uses the platform CDN (Vercel, Netlify)
    '/admin/**': { ssr: false },                    // SPA only: no server rendering
    '/account/**': { ssr: true, headers: { 'cache-control': 'private, no-store' } },
    '/old-blog/**': { redirect: { to: '/blog/**', statusCode: 301 } },
    '/api/**': { cors: true },
  },
})`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`swr` stores the rendered response in Nitro\'s cache (works on any Node server) and sends `stale-while-revalidate` headers. `isr` delegates caching to the hosting platform\'s CDN and is supported on Vercel and Netlify; elsewhere use `swr`. `prerender: true` writes the HTML at build time (`nuxt generate` prerenders everything it can discover by following links).',
            },
            {
              type: 'heading',
              text: 'SPA mode and the loading template',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a pure SPA with a loading screen',
              code: `export default defineNuxtConfig({
  ssr: false,                 // no server rendering anywhere
  spaLoadingTemplate: true,   // uses app/spa-loading-template.html while JS boots
})`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Prerendering freezes data at build time. A page that shows "5 items in stock" and is prerendered will show 5 forever (until the next build) — unless the *client* fetches fresh data after hydration. Do not prerender pages that depend on cookies, the logged-in user, or per-request headers.',
            },
            {
              type: 'heading',
              text: 'How cached routes interact with the payload',
            },
            {
              type: 'p',
              text: 'When a user navigates client-side *to* a prerendered or cached page, Nuxt does not need to run that page\'s `useFetch` calls in the browser: it downloads a small `_payload.json` generated alongside the HTML and hydrates the data from it (**payload extraction**). Since Nuxt 4.3 these payload files are also produced for `isr`, `swr` and `cache` route rules, not just prerendered pages, so a CDN can cache them next to the HTML. The consequence: on a cached route, *client-side navigations also see the cached data* — the TTL you chose applies to both the HTML and the data.',
            },
            {
              type: 'heading',
              text: 'SSR streaming (experimental, Nuxt 4.5+)',
            },
            {
              type: 'p',
              text: 'Classic SSR is **buffered**: the server renders the entire page into a string, then sends it. If one `useFetch` takes 800 ms, the browser receives nothing for 800 ms — not even the `<head>` with CSS and preload hints. With `experimental.ssrStreaming`, Nuxt sends the shell (head, styles, preload hints, entry scripts) immediately and streams the body as Vue renders it, so the browser starts downloading assets while your data is still loading.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — opt into streaming',
              code: `export default defineNuxtConfig({
  experimental: {
    ssrStreaming: {
      // crawlers still get fully buffered HTML
      botRegex: /googlebot|bingbot|my-internal-crawler/i,
    },
  },
  routeRules: {
    '/checkout/**': { streaming: false },   // per-route opt-out
  },
})`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Streaming commits the status code and headers with the first byte.** After that, `setResponseStatus()` in `<script setup>`, a cookie written by middleware during render, or a late `createError({ status: 404 })` can no longer change the response the browser already received (Nuxt logs a warning per dropped mutation in dev). Routes with `redirect`, `cache`, `isr`, `swr`, `noScripts` or `ssr: false` automatically fall back to buffered rendering. Stream content pages; keep auth-sensitive and status-sensitive routes buffered.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Start with the default (SSR) and add `routeRules` only where you can name a concrete reason: speed (prerender/SWR), cost (cache expensive pages), or no SEO need (`ssr: false`). Hybrid rendering is one of Nuxt\'s strongest features because you can change a route\'s mode **without touching its component code**.',
            },
          ],
        },
        {
          id: 'hydration',
          title: 'Hydration and Hydration Mismatches',
          summary:
            'Hydration is the browser step that attaches Vue to the HTML the server already sent, making it interactive without re-creating it. A mismatch happens when the browser\'s first render differs from the server\'s HTML.',
          keyPoints: [
            'After SSR the page *looks* ready but is "dead" HTML — buttons do nothing. **Hydration** walks the existing DOM, builds Vue\'s virtual DOM, attaches event listeners and reuses the nodes instead of throwing the HTML away.',
            'It only works if the client\'s first render produces **exactly the same HTML** as the server did. If not, you get a hydration mismatch warning, a visible flicker, or broken behaviour.',
            'Typical causes: `Date.now()` / `Math.random()` / `new Date()` in render, `window` / `localStorage` branches, locale/timezone differences, invalid HTML nesting (`<div>` inside `<p>`), and browser extensions injecting nodes.',
            'Fixes: make the first render deterministic, move browser-only values to `onMounted`, share server-computed values with `useState`, or wrap the part in `<ClientOnly>`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Think of the server\'s HTML as a **doll that looks perfect but has no strings**. Hydration is the puppeteer attaching strings (event listeners and reactive state) to each limb. The puppeteer assumes limb number 7 is where the client-side blueprint says it should be. If the doll was built from a different blueprint (different content), the strings attach to the wrong places.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Server as Server render
    participant Browser as Browser DOM
    participant Vue as Vue in the browser
    Server-->>Browser: HTML plus payload JSON plus JS
    Note over Browser: user sees the page but clicks do nothing yet
    Browser->>Vue: JS loads and runs the app
    Vue->>Vue: render components using the payload data
    Vue->>Browser: compare virtual DOM with existing DOM
    alt same structure
        Vue->>Browser: attach listeners and reuse nodes
        Note over Browser: interactive and no flicker
    else different structure
        Vue->>Browser: warn and patch or re-render
        Note over Browser: flicker or broken state
    end`,
            },
            {
              type: 'heading',
              text: 'Mismatch cause 1: non-deterministic values',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'BAD - server and client compute different values',
              code: `<script setup lang="ts">
// Server renders 14:03:01, the client renders 14:03:02 -> mismatch
const now = new Date().toLocaleTimeString()
const token = Math.random().toString(36)
</script>

<template>
  <p>Rendered at {{ now }}</p>
  <p>Id: {{ token }}</p>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'GOOD - compute once on the server, reuse on the client',
              code: `<script setup lang="ts">
// useState serializes the server value into the payload; the client reuses it
const renderedAt = useState('rendered-at', () => new Date().toISOString())
const token = useState('token', () => Math.random().toString(36).slice(2))

// For ids that must be unique and stable: Vue 3.5 useId()
const inputId = useId()

// For something that should be "live" after load, update it only on the client:
const clock = ref('')
onMounted(() => {
  clock.value = new Date().toLocaleTimeString()
})
</script>

<template>
  <p>Rendered at {{ renderedAt }}</p>
  <label :for="inputId">Name</label>
  <input :id="inputId" />
  <p>Now: {{ clock }}</p> <!-- empty on server and on first client render, so they match -->
</template>`,
            },
            {
              type: 'heading',
              text: 'Mismatch cause 2: browser-only branches',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'BAD vs GOOD for window-dependent UI',
              code: `<!-- BAD: window does not exist on the server (ReferenceError) and the branches differ -->
<script setup lang="ts">
const isMobile = window.innerWidth < 768
</script>

<!-- GOOD: first render is identical everywhere, then adjust after mount -->
<script setup lang="ts">
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
})
// Or use VueUse: const { width } = useWindowSize()  (SSR-safe)
</script>

<template>
  <ClientOnly>
    <MobileMenu v-if="isMobile" />
    <template #fallback><DesktopMenu /></template>
  </ClientOnly>
</template>`,
            },
            {
              type: 'heading',
              text: 'Mismatch cause 3: invalid HTML',
            },
            {
              type: 'p',
              text: 'The browser\'s HTML parser fixes bad markup silently. If you write `<p><div>hi</div></p>`, the server string contains it, but when the browser parses the string it closes the `<p>` early and moves the `<div>` out — so the DOM no longer matches what Vue expects. Other offenders: `<a>` inside `<a>`, `<tr>` directly in `<table>` without `<tbody>` in some templates, and block elements inside `<p>`. The warning message usually names the offending element — use valid nesting.',
            },
            {
              type: 'table',
              headers: ['Symptom', 'Likely cause', 'Fix'],
              rows: [
                ['Text differs between server and client', 'Dates, random values, timezones, `toLocaleString`', '`useState`, `<NuxtTime>`, set values in `onMounted`'],
                ['`window is not defined` on the server', 'Browser API used during setup', '`onMounted`, `import.meta.client` check, `.client.vue`, `<ClientOnly>`'],
                ['Warning about a node/tag mismatch', 'Invalid HTML nesting', 'Fix the markup'],
                ['Flicker from logged-out to logged-in', 'Auth state only known on the client', 'Read the session cookie during SSR (`useCookie`, `useState`)'],
                ['Extra nodes in the DOM', 'Browser extension or translation tool', 'Test in a clean profile; usually not your bug'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Nuxt provides `import.meta.client` and `import.meta.server` (the old `process.client` / `process.server` are deprecated) for build-time branching. Vue 3.5 also supports `data-allow-mismatch` on an element when you *intentionally* render something different, such as a locale-dependent timestamp: `<span data-allow-mismatch>...</span>`. Use it sparingly.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Hiding a mismatch by wrapping *everything* in `<ClientOnly>` defeats the purpose of SSR: crawlers and first paint see only the fallback. Wrap the smallest possible piece, and prefer fixing the cause.',
            },
            {
              type: 'heading',
              text: 'What Vue actually does on a mismatch (and why it is worse in production)',
            },
            {
              type: 'p',
              text: 'Vue 3 hydration is a single depth-first walk that pairs each virtual node with the next real DOM node. Since Vue 3.4 it handles a mismatch *locally*: a text difference is patched in place; an element of the wrong tag, or a missing/extra node, causes Vue to throw that DOM subtree away and mount fresh nodes for it. Attribute and class mismatches are reported in dev but **not fixed** — the server value stays in the DOM, which is how you end up with a button that *looks* active but whose state says otherwise. In production the warnings are stripped for size, so a mismatch shows up only as flicker, lost focus/scroll, layout shift, or third-party widgets that were mounted into a node Vue later replaced.',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Reproduce with the production build** (`nuxt build && nuxt preview`) and also in dev, where Vue prints the mismatching node and expected vs actual value.',
                '**Compare raw HTML with the client render:** "view source" (the server HTML) against the Elements panel right after load. Disable browser extensions and auto-translation first.',
                '**Check the usual suspects:** time zones and locales (server in UTC, user in Europe/Berlin), `Intl` output differences between Node and the browser, random ids, `v-if` on browser state, invalid nesting, and data that changed between the server fetch and a *client* fetch (a `$fetch` in setup).',
                '**Need details in production?** Vue exposes the compile-time flag `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__`; define it as `true` through `vite.define` in a staging build to get full warnings without shipping them to everyone.',
                '**Fix at the source**, then add an end-to-end test that loads the page with `waitUntil: \'hydration\'` and asserts there are no console warnings.',
              ],
            },
            {
              type: 'code',
              language: 'vue',
              title: 'timezone-safe dates with NuxtTime',
              code: `<template>
  <!-- Renders a <time> element with Intl formatting; NuxtTime is built to avoid
       server/client mismatches caused by different locales and time zones -->
  <NuxtTime :datetime="post.publishedAt" date-style="medium" time-style="short" />

  <!-- Relative times ("3 minutes ago") are supported too -->
  <NuxtTime :datetime="post.publishedAt" relative />
</template>`,
            },
          ],
        },
        {
          id: 'ssr-lifecycle-and-payload',
          title: 'Inside an SSR Request: Lifecycle, Async Context and the Payload',
          summary:
            'What really happens between "request arrives" and "page is interactive": a fresh Vue app per request, plugins, middleware, Suspense-awaited setup, HTML rendering, head tags and a serialized payload that the browser revives instead of refetching.',
          keyPoints: [
            'Every request gets a **brand-new `nuxtApp` and Vue app instance**. Plugins run, route middleware runs, then pages render inside `<Suspense>`, which is why top-level `await useFetch()` can block the server render.',
            'The **payload** is everything the client needs to recreate server state: `useAsyncData` results, `useState` values, Pinia state, errors and some flags. It is serialized with **devalue** (supports `Date`, `Map`, `Set`, refs, cyclic references) into `<script id="__NUXT_DATA__">`, or into `_payload.json` for prerendered/cached pages.',
            'Composables find "the current app" through an **async context** (unctx). That context survives `await` only where Nuxt\'s compiler transforms the code (`<script setup>`, `defineNuxtPlugin`, `defineNuxtRouteMiddleware`) — elsewhere use `nuxtApp.runWithContext()`.',
            'Payload size is a performance budget: it is downloaded as part of the HTML *and* parsed before hydration. Shrink it with `pick`/`transform`, avoid duplicating data in both `useFetch` and a store, and teach Nuxt to serialize custom classes with `definePayloadReducer`/`definePayloadReviver`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Most Nuxt APIs make sense only once you can picture a single request flowing through the system. The diagram below is the version a senior engineer keeps in their head when debugging: if you know which phase a piece of code runs in, you know which APIs are available, what can block the response and what ends up in the HTML.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant B as Browser
    participant N as Nitro
    participant R as Vue renderer
    participant A as Nuxt app for this request
    B->>N: GET /products/42
    N->>N: server middleware and routeRules
    N->>R: no API match - render page
    R->>A: createNuxtApp and Vue app (fresh per request)
    A->>A: run plugins in order
    A->>A: run global then page route middleware
    A->>A: setup inside Suspense - await useFetch etc.
    A->>R: renderToString when all awaited setup resolved
    R->>R: collect head tags (unhead) and preload hints
    R->>R: serialize payload with devalue
    R-->>B: HTML + __NUXT_DATA__ + script tags
    B->>B: load entry JS, create app, run client plugins
    B->>B: revive payload - useAsyncData reads cached result
    B->>B: hydrate DOM, then onMounted hooks run`,
            },
            {
              type: 'table',
              headers: ['Phase', 'Server', 'Client (first load)', 'Typical code'],
              rows: [
                ['Nitro server plugins', 'Once per process start', 'Never', 'DB pool, Nitro hooks, logging'],
                ['Server middleware', 'Every HTTP request', 'Never', 'Request ids, `event.context.user`'],
                ['Nuxt plugins', 'Every SSR request', 'Once per tab', 'API clients, Vue plugins, auth bootstrap'],
                ['Route middleware', 'First navigation', 'Every later navigation', 'Guards, redirects'],
                ['`setup` / `useFetch`', 'Every SSR request', 'Hydration (reads payload, no refetch)', 'Page data'],
                ['`onMounted`', 'Never', 'After hydration', 'Browser APIs, analytics, widgets'],
              ],
            },
            {
              type: 'heading',
              text: 'Async context: why "Nuxt instance unavailable" happens',
            },
            {
              type: 'p',
              text: 'On the server, many requests are in flight at the same time inside one process, so `useNuxtApp()` cannot read a global variable — it would get another user\'s app. Nuxt keeps the current app in an *async context* that is set while your setup function runs. After an `await`, JavaScript resumes your function later, from the event loop, and the context may already belong to someone else. Nuxt\'s compiler rewrites `await` inside `<script setup>`, plugins and middleware so the context is restored afterwards (the `withAsyncContext` transform). Your own helper functions do not get that rewrite.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'losing and restoring the context',
              code: `// app/composables/useCheckout.ts
export async function startCheckout() {
  const nuxtApp = useNuxtApp()          // OK: called synchronously from setup
  await $fetch('/api/cart/validate')    // context may be lost after this line...

  // BAD: useRuntimeConfig()/useState() here may throw NUXT_E1001
  // GOOD: re-enter the context explicitly
  return nuxtApp.runWithContext(() => {
    const config = useRuntimeConfig()
    return navigateTo(config.public.checkoutUrl, { external: true })
  })
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Since Nuxt 4.5, warnings and errors carry stable codes (for example `NUXT_E1001` for a composable called outside the Nuxt context) with a "why" and a "fix" in development and a docs link for bigger problems. Search the code instead of the message text — it does not change between versions.',
            },
            {
              type: 'heading',
              text: 'The payload, concretely',
            },
            {
              type: 'code',
              language: 'html',
              title: 'what ends up in the HTML (simplified)',
              code: `<div id="__nuxt"><!-- server-rendered markup --></div>
<script type="application/json" data-nuxt-data="nuxt-app" id="__NUXT_DATA__">
  [{"data":1,"state":4},{"product-42":2},{"id":3,"name":"..."}, 42, {"$scart:items":5}, []]
</script>`,
            },
            {
              type: 'p',
              text: 'The format is devalue\'s flat array of values with index references, which is why it can represent `Date`, `Map`, `Set`, repeated objects and cycles that plain JSON cannot. Nuxt adds reducers for its own types (refs, `NuxtError`, shallow reactive objects). Anything else — a class instance, a function, a Luxon `DateTime` — either fails to serialize or arrives as a plain object without methods. Nuxt 4 removed the old `window.__NUXT__` global: read the payload through `useNuxtApp().payload` if you must.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/plugins/money-payload.ts — teach the payload about a custom class',
              code: `import { Money } from '~/utils/money'

export default definePayloadPlugin(() => {
  // server: turn a Money instance into plain data
  definePayloadReducer('Money', value => value instanceof Money && value.toJSON())
  // client: rebuild the instance from that data
  definePayloadReviver('Money', data => Money.fromJSON(data))
})`,
            },
            {
              type: 'table',
              headers: ['Payload problem', 'Symptom', 'Fix'],
              rows: [
                ['Whole API objects stored', 'HTML of hundreds of KB, slow TTI on mobile', '`pick` / `transform` in `useFetch`, paginate'],
                ['Same data in `useFetch` *and* a Pinia store', 'Data serialized twice', 'Pick one owner: store or async data'],
                ['Secrets in state', 'Tokens visible in view-source', 'Never put server-only data in `useState` or stores — the payload is public'],
                ['Custom classes', '`value.format is not a function` after hydration', 'Plain data, or payload reducer/reviver'],
                ['Large static content', 'Payload duplicates text already in the HTML', 'Server components (islands) or `hydrate-never`'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '**The payload is public.** Everything in `useState`, `useAsyncData` results and server-side Pinia state is embedded in the HTML that the user (and any cache in between) receives. Filter API responses on the server so that internal fields — emails of other users, cost prices, feature flags for staff — never enter a store that renders on a public page.',
            },
          ],
        },
        {
          id: 'data-fetching-basics',
          title: 'Data Fetching with useFetch',
          summary:
            '`useFetch` is Nuxt\'s main way to load data in a page or component: it runs on the server during SSR, ships the result to the browser in the page payload, and returns reactive `data`, `status`, `error` and `refresh`.',
          keyPoints: [
            '`const { data, status, error, refresh } = await useFetch(\'/api/posts\')` — `data` starts empty then fills; `status` is `idle | pending | success | error`; `error` is set (not thrown) when the request fails; `refresh()` re-runs the request.',
            '**During SSR the request runs on the server and the result is copied into the page payload**, so the browser hydrates with that data and does **not** repeat the request on first load. Later client-side navigations fetch normally in the browser.',
            '`useFetch` is `useAsyncData` + `$fetch` with an automatic key, plus reactive URL/query support. Treat it as the default for "load this when the page renders".',
            'Options you will use: `query`, `body`, `method`, `headers`, `lazy`, `server`, `default`, `transform`, `pick`, `watch`, `key`, `immediate`, `deep`, `dedupe`, `getCachedData` and (Nuxt 4.5+) `enabled`, a ref or getter that blocks fetching while it is `false`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Why not just call `fetch()` inside `onMounted`? Because `onMounted` does not run on the server — the server would render a page with no data, and the browser would then fetch it, giving users an empty page that fills in later (and crawlers an empty page forever). `useFetch` runs **during rendering** on the server so the HTML already contains the data, and it remembers the result so the browser does not ask again.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/posts/index.vue',
              code: `<script setup lang="ts">
interface Post { id: number; title: string }

const page = ref(1)

const { data: posts, status, error, refresh } = await useFetch('/api/posts', {
  query: { page },          // a ref in query: changing page refetches automatically
  default: () => [],        // never undefined in the template
  // keep only what the template shows (smaller payload). Note: \`pick\` only works on
  // a single object response; for arrays use transform.
  transform: (rows: Post[]) => rows.map(({ id, title }) => ({ id, title })),
})
</script>

<template>
  <div>
    <p v-if="status === 'pending'">Loading...</p>
    <p v-else-if="error">Could not load posts: {{ error.message }}</p>
    <ul v-else>
      <li v-for="post in posts" :key="post.id">
        <NuxtLink :to="\`/posts/\${post.id}\`">{{ post.title }}</NuxtLink>
      </li>
    </ul>
    <button @click="page++">Next page</button>
    <button @click="refresh()">Reload</button>
  </div>
</template>`,
            },
            {
              type: 'heading',
              text: 'Server render vs client navigation',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Browser
    participant Server as Nuxt server
    participant API as Data source
    Note over Browser,API: First visit - SSR
    Browser->>Server: GET /posts
    Server->>API: useFetch runs on the server
    API-->>Server: posts JSON
    Server-->>Browser: HTML plus payload containing the posts
    Note over Browser: hydration reuses payload - no second request
    Note over Browser,API: Later - user clicks a NuxtLink to /posts/3
    Browser->>API: useFetch runs in the browser
    API-->>Browser: post JSON
    Note over Browser: page updates with no full reload`,
            },
            {
              type: 'heading',
              text: 'Handling pending, error and empty states',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'a complete state-aware template',
              code: `<script setup lang="ts">
const route = useRoute()
const { data: product, status, error } = await useFetch(\`/api/products/\${route.params.id}\`)

// A missing item should be a real 404 for crawlers and users, not an empty page
if (!product.value && error.value) {
  throw createError({
    status: error.value.statusCode ?? 404,   // Nuxt 4.3+: status/statusText replace statusCode/statusMessage
    statusText: 'Product not found',
    fatal: true,
  })
}
</script>

<template>
  <ProductView v-if="product" :product="product" />
</template>`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Why `await`?** `await useFetch(...)` in `<script setup>` tells Nuxt to wait for the data before finishing the server render, so the HTML contains it. Without `await` the call still works but the server may render the page before the data arrives (it then shows `pending` in the HTML). Nuxt\'s compiler keeps the Nuxt context alive across the `await`, which is why this works inside `<script setup>` at the top level.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do not call `useFetch` inside an event handler or after another `await` in your own functions (for example inside a button click or a `setTimeout`). It is a **composable**: it must run synchronously during `setup`, a plugin or route middleware. For user-triggered requests (submitting a form, clicking Save) use `$fetch` — see the next topic.',
            },
            {
              type: 'heading',
              text: 'Dependent requests and conditional fetching',
            },
            {
              type: 'p',
              text: 'A frequent real-world shape: request B needs a value from request A, or should only run once the user has chosen something. Do not nest `useFetch` inside a `watch`. Make the second call reactive on the first and gate it with `enabled` (Nuxt 4.5+) — while `enabled` is false no request is made, and flipping it to false mid-flight cancels the request without clearing existing `data`.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'a dependent, gated request',
              code: `<script setup lang="ts">
const { data: user } = await useFetch('/api/me')

const selectedTeam = ref<string>()

// Reactive URL + enabled gate: runs only when both a user and a team exist,
// and refetches automatically when selectedTeam changes.
const { data: members, status } = await useFetch(
  () => \`/api/teams/\${selectedTeam.value}/members\`,
  {
    enabled: () => !!user.value && !!selectedTeam.value,
    default: () => [],
  },
)
</script>`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'On Nuxt versions before 4.5, the same effect is achieved with `immediate: false` plus a `watch` source, calling `execute()` once the precondition is met. Prefer `enabled` where available — it expresses the intent directly and also handles cancellation.',
            },
          ],
        },
        {
          id: 'usefetch-vs-useasyncdata-vs-fetch',
          title: 'useFetch vs useAsyncData vs $fetch',
          summary:
            '`$fetch` is the raw HTTP client; `useAsyncData` wraps any async function with SSR payload reuse, caching by key and status tracking; `useFetch` is the shortcut that combines both for HTTP calls.',
          keyPoints: [
            '**`$fetch`** (from ofetch) = just makes a request. It knows nothing about SSR payloads: in setup it runs on the server **and again in the browser** (double fetch). Use it for user actions: form submits, button clicks, mutations.',
            '**`useAsyncData(key, fn)`** = run *any* async function (a CMS SDK, several parallel `$fetch` calls, a database query on the server) once on the server and hand the result to the client through the payload.',
            '**`useFetch(url)`** = `useAsyncData` + `$fetch` with an auto-generated key from the URL and options — the shortest way to load an endpoint.',
            'The `key` identifies the result in the payload and in the client cache: same key = same data shared by every component that asks for it, and what `refreshNuxtData(key)` re-runs.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', '`$fetch`', '`useAsyncData`', '`useFetch`'],
              rows: [
                ['What it is', 'Plain HTTP client (ofetch)', 'SSR-aware wrapper around any async function', '`useAsyncData` + `$fetch` for URLs'],
                ['Returns', 'A Promise of the data', '`{ data, status, error, refresh, execute, clear }`', 'Same as `useAsyncData`'],
                ['Payload reuse (no double fetch)', 'No', 'Yes', 'Yes'],
                ['Reactive refetch (`watch`)', 'No', 'Yes', 'Yes, plus reactive URL and query'],
                ['Needs a key', 'No', 'Yes (explicit)', 'Auto from URL and options'],
                ['Use in setup top level', 'Avoid (double fetch)', 'Yes', 'Yes'],
                ['Use in event handlers', 'Yes — this is its job', 'No', 'No'],
                ['Typical use', 'Form submit, POST/PUT/DELETE, server code', 'SDK calls, combining requests, non-HTTP sources', 'GET data a page needs to render'],
              ],
            },
            {
              type: 'heading',
              text: 'The classic mistake: $fetch in setup',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'BAD - the request runs twice',
              code: `<script setup lang="ts">
// Server: runs once to render HTML.
// Browser: hydration runs setup again -> runs a SECOND request.
// Result: wasted request, possible flicker, and data may differ between the two runs.
const posts = await $fetch('/api/posts')
</script>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'GOOD - fetched once on the server, reused in the browser',
              code: `<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts')
// or, equivalently, with an explicit key and function:
const { data: sameThing } = await useAsyncData('posts', () => $fetch('/api/posts'))
</script>`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Browser
    participant Server as Nuxt server
    participant API
    Note over Browser,API: Using raw fetch in setup
    Browser->>Server: GET /page
    Server->>API: call 1
    API-->>Server: data
    Server-->>Browser: HTML with data
    Browser->>API: call 2 while hydrating
    Note over Browser,API: Using useFetch or useAsyncData
    Browser->>Server: GET /page
    Server->>API: call 1 only
    API-->>Server: data
    Server-->>Browser: HTML plus payload
    Note over Browser: reads payload - no call 2`,
            },
            {
              type: 'heading',
              text: 'When to use useAsyncData',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'useAsyncData for several requests and a non-HTTP source',
              code: `<script setup lang="ts">
const route = useRoute()

// A reactive (getter) key, supported in Nuxt 4: each product gets its own cache entry,
// and changing the id switches to (and fetches) the new entry automatically.
// A plain template string would be evaluated once and keep the FIRST id forever.
const { data, status, error } = await useAsyncData(
  () => \`product-\${route.params.id}\`,
  async (_nuxtApp, { signal }) => {
    // Two requests in parallel, merged into one result.
    // signal (Nuxt 4.2+) aborts both if the id changes again before they finish.
    const [product, reviews] = await Promise.all([
      $fetch(\`/api/products/\${route.params.id}\`, { signal }),
      $fetch(\`/api/products/\${route.params.id}/reviews\`, { signal }),
    ])
    return { product, reviews }
  },
  {
    // On Nuxt 3 (static keys only) you would instead add:
    // watch: [() => route.params.id]
    default: () => null,
  },
)
</script>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: '$fetch is right for user actions',
              code: `<script setup lang="ts">
const title = ref('')
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    // Runs only in the browser, after a click - $fetch is exactly right here
    await $fetch('/api/posts', { method: 'POST', body: { title: title.value } })
    await refreshNuxtData('posts')   // re-run the list page's data (it must use key: 'posts')
    await navigateTo('/posts')
  } catch (e: any) {
    alert(e.data?.statusMessage ?? 'Failed to save')
  } finally {
    saving.value = false
  }
}
</script>`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never use the same `key` for two different data sources. Two `useAsyncData(\'items\', ...)` calls with different functions share one cache entry and overwrite each other. In **Nuxt 4** all calls with the same key share the *same* `data`/`error`/`status` refs (a "singleton" data layer) — it is stricter about this than Nuxt 3.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Inside Nitro server code (`server/api/*`) there is no payload and no hydration: use `$fetch` or any normal async code there. `useFetch` / `useAsyncData` are composables for the **app** side only.',
            },
          ],
        },
        {
          id: 'data-fetching-advanced',
          title: 'Data Fetching in Depth: lazy, server, transform, keys, cookies and refresh',
          summary:
            'Options on `useFetch` / `useAsyncData` control blocking vs non-blocking loads, server vs client execution, response shaping, caching and refetching.',
          keyPoints: [
            '`lazy: true` (or `useLazyFetch`) does **not** block navigation: the page renders immediately with `data` empty and `status === \'pending\'`, and fills in later. Without it, navigation waits for the data.',
            '`server: false` skips the server entirely and fetches only in the browser after hydration — good for data that is private to the user or not needed for SEO.',
            '`transform` reshapes the response *before* it is stored in the payload (smaller HTML, fewer reactivity costs); `pick` keeps only named top-level fields of an *object* response; `default` supplies initial data.',
            '`refresh()` re-runs one call; `refreshNuxtData(\'key\')` re-runs by key from anywhere; `watch` refetches when reactive sources change; `getCachedData` controls reuse. In SSR, forward the visitor\'s cookies with `useRequestFetch()`.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Blocking vs lazy',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Blocking["default - await useFetch"]
      direction TB
      b1["Click NuxtLink"] --> b2["Old page stays visible"] --> b3["Data arrives"] --> b4["New page shows with data"]
    end
    subgraph Lazy["lazy true"]
      direction TB
      l1["Click NuxtLink"] --> l2["New page shows immediately with skeleton"] --> l3["Data arrives"] --> l4["Page fills in"]
    end`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'lazy and server:false',
              code: `<script setup lang="ts">
// Critical data (SEO content): blocking and server-rendered
const { data: article } = await useFetch('/api/article/42')

// Secondary data: do not hold up navigation; skeleton until it arrives
const { data: related, status } = useLazyFetch('/api/article/42/related', {
  default: () => [],
})

// Private data: fetch only in the browser after load (no SSR, no payload)
const { data: unread } = useFetch('/api/me/unread', {
  server: false,
  lazy: true,
})
</script>

<template>
  <h1>{{ article?.title }}</h1>
  <RelatedSkeleton v-if="status === 'pending'" />
  <RelatedList v-else :items="related" />
  <span v-if="unread">{{ unread.count }} unread</span>
</template>`,
            },
            {
              type: 'heading',
              text: 'Shrinking the payload with transform and pick',
            },
            {
              type: 'p',
              text: 'Everything `useFetch` returns is serialized into the HTML (inside `<script id="__NUXT_DATA__">`) so the browser can reuse it. If an API returns 200 fields and you display 3, you ship 200 fields to every visitor. Use `pick` for simple field lists or `transform` for anything more.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'transform keeps the payload small',
              code: `<script setup lang="ts">
const { data: cards } = await useFetch('/api/products', {
  transform: (products: any[]) =>
    products.map(p => ({ id: p.id, name: p.name, price: p.price })),  // drop descriptions, specs...
})
</script>`,
            },
            {
              type: 'heading',
              text: 'Refreshing and caching',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'refresh, refreshNuxtData, watch and getCachedData',
              code: `<script setup lang="ts">
const search = ref('')

const { data, refresh, status, clear } = await useFetch('/api/search', {
  key: 'search-results',
  query: { q: search },             // reactive: refetches when search changes
  watch: false,                     // ...but we want to control when with a button
  immediate: false,                 // do not run on mount at all; wait for execute()/refresh()
  // Reuse already-loaded data when navigating back to this page.
  // Nuxt 4 calls getCachedData on EVERY fetch (including refresh), so let manual
  // refreshes through - otherwise the Search button would always return the cache.
  getCachedData: (key, nuxtApp, ctx) => {
    if (ctx.cause === 'refresh:manual') return undefined   // undefined = fetch for real
    return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  },
})

// Elsewhere, any component can re-run it by key:
//   await refreshNuxtData('search-results')
// or clear it:  clearNuxtData('search-results')
</script>

<template>
  <input v-model="search" />
  <button :disabled="status === 'pending'" @click="refresh()">Search</button>
</template>`,
            },
            {
              type: 'heading',
              text: 'Forwarding cookies during SSR',
            },
            {
              type: 'p',
              text: 'When your server renders a page it calls your own API as a function call, **not** as the user\'s browser, so the user\'s cookies and headers are not automatically attached. Without them an authenticated endpoint sees an anonymous request. `useRequestFetch()` returns a `$fetch` that forwards the incoming request\'s headers.',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'forwarding the session cookie',
              code: `<script setup lang="ts">
const requestFetch = useRequestFetch()   // on the client this is just $fetch

const { data: me } = await useAsyncData('me', () => requestFetch('/api/me'))

// Or tell useFetch to use it:
const { data: orders } = await useFetch('/api/orders', { $fetch: requestFetch })
</script>`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Nuxt 4 data-fetching changes** (from Nuxt 3): `data` and `error` default to `undefined` instead of `null`; `data` is a **shallowRef** by default (set `deep: true` if you mutate nested fields and need deep reactivity); calls with the same key share one set of `data`/`error`/`status` refs (and Nuxt warns if they pass conflicting `transform`, `pick`, `default`, `deep` or `getCachedData`); keys can be refs, computeds or getters; `getCachedData` runs on every fetch and receives `ctx.cause`; `pending` is a computed that is true only while `status` is pending; `refresh({ dedupe })` takes `\'cancel\'` or `\'defer\'` instead of a boolean; `clear()` resets to your `default`; and prerender data is shared across pages, so keys must uniquely identify their data.',
            },
            {
              type: 'heading',
              text: 'Why shallowRef became the default',
            },
            {
              type: 'p',
              text: 'A deep `ref` wraps every nested object of the response in a reactive Proxy, lazily, as you touch it. For a 2,000-row table that is a lot of proxies, and the cost is paid on the server for *every request* and again in the browser. Fetched data is usually **replaced**, not mutated, so deep tracking buys nothing. `shallowRef` only tracks `.value` reassignment: assigning a new response re-renders, while `data.value.items.push(x)` silently does not. That is the trade: big wins for read-mostly data, one rule to remember for the rest.',
            },
            {
              type: 'heading',
              text: 'Race conditions and cancellation',
            },
            {
              type: 'p',
              text: 'Type "ne", then "nux" quickly into a search box and two requests race; if the first one is slower, its stale result can arrive last and overwrite the correct one. `useAsyncData` handles this with `dedupe: \'cancel\'` (the default): a new execution cancels the in-flight one. Since Nuxt 4.2 the handler also receives an `AbortSignal`, so the cancellation reaches the *network*, and `refresh()`/`execute()` accept your own signal.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'abort-aware fetching',
              code: `const q = ref('')

const { data, refresh } = await useAsyncData(
  () => \`search:\${q.value}\`,
  (_nuxtApp, { signal }) => $fetch('/api/search', { query: { q: q.value }, signal }),
)

// Abort a refresh from your own code, e.g. when a dialog closes
const controller = new AbortController()
refresh({ signal: controller.signal })
controller.abort()`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Mutating `data.value.items.push(x)` on a shallowRef will not trigger updates in Nuxt 4. Either replace the value (`data.value = { ...data.value, items: [...] }`), pass `deep: true`, or copy into a local `ref` first.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Rule of thumb: await the data the page *needs to make sense* (and that crawlers should see); make decorative or secondary data `lazy`; make private per-user data `server: false`; use `$fetch` for anything triggered by a click.',
            },
          ],
        },
        {
          id: 'custom-fetch-composables',
          title: 'Custom Fetch Composables and API Clients (createUseFetch, $fetch.create)',
          summary:
            'Real apps talk to one or more backends with a base URL, auth headers, error mapping and retries. Centralise that once — with `$fetch.create` for the raw client and `createUseFetch` / `createUseAsyncData` (Nuxt 4.4+) for SSR-aware composables — instead of repeating options in every page.',
          keyPoints: [
            '`$fetch.create({ baseURL, onRequest, onResponseError, retry })` returns a pre-configured ofetch instance. Use it for mutations and inside `useAsyncData` handlers.',
            '`createUseFetch(defaults | (options) => options)` (Nuxt 4.4+) produces your own `useFetch` variant — e.g. `useApiFetch` with a base URL from runtime config — that still has payload reuse, keys and SSR support. Define it in `composables/` so Nuxt registers it.',
            'On the server, forward cookies or bearer tokens explicitly (`useRequestHeaders`, `useRequestFetch`) — internal calls do not carry the visitor\'s credentials by themselves.',
            'Keep error handling in **one place**: map 401 to a login redirect, 403/404/5xx to `createError` or a toast, and never swallow errors silently.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Once an app has more than a handful of pages, the same `useFetch` options appear everywhere: `baseURL: config.public.apiBase`, an `Authorization` header, `server: false` for private data, a `transform` that unwraps `{ data: ... }`. Copy-paste becomes drift — one page forgets the header, another handles 401 differently. The fix is the same as in any codebase: one client, one composable, one policy.',
            },
            {
              type: 'heading',
              text: 'Your own useFetch with createUseFetch (Nuxt 4.4+)',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/composables/useApiFetch.ts',
              code: `// A plain object = defaults that call-site options override
export const useClientFetch = createUseFetch({ server: false })

// A function = full control over merging, with access to runtime config
export const useApiFetch = createUseFetch((currentOptions) => {
  const config = useRuntimeConfig()
  return {
    ...currentOptions,
    baseURL: currentOptions.baseURL ?? config.public.apiBase,
  }
})

// createUseAsyncData follows the same pattern for useAsyncData`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'usage — identical to useFetch',
              code: `<script setup lang="ts">
const { data: users } = await useApiFetch('/users')            // SSR, payload, keys - all intact
const { data: drafts } = await useClientFetch('/api/me/drafts') // browser-only by default
</script>`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Do **not** build a custom composable by wrapping `useFetch` in a function that changes its call site or key behaviour carelessly (for example by always passing the same `key`). Keys must stay unique per request, or different pages will share one cache entry. `createUseFetch` exists precisely so that the key generation and SSR registration keep working.',
            },
            {
              type: 'heading',
              text: 'A shared $fetch client for mutations',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/plugins/api.ts — one client, one error policy',
              code: `export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  // On the server, forward the visitor's cookie to the backend (empty object in the browser)
  const forwarded = useRequestHeaders(['cookie'])

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    headers: forwarded,
    retry: 1,                                  // retry idempotent requests once on network errors
    retryStatusCodes: [502, 503, 504],
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })

  return { provide: { api } }
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/composables/useOrders.ts — data + mutation together',
              code: `export function useOrders() {
  const { $api } = useNuxtApp()

  const list = useAsyncData('orders', (_app, { signal }) =>
    $api<Order[]>('/orders', { signal }), { default: () => [] })

  async function cancel(id: string) {
    await $api(\`/orders/\${id}/cancel\`, { method: 'POST' })
    await list.refresh()                      // re-sync from the server, do not guess
  }

  return { ...list, cancel }
}`,
            },
            {
              type: 'table',
              headers: ['Need', 'Tool'],
              rows: [
                ['Page data with SSR and payload reuse', '`useFetch` / your `createUseFetch` variant'],
                ['Non-HTTP source or several calls merged', '`useAsyncData` / `createUseAsyncData`'],
                ['Mutation on click / submit', 'Your `$fetch.create` client'],
                ['Call own `/api` on server with user cookies', '`useRequestFetch()`'],
                ['Call an external API from the server with a secret', 'A `server/api` proxy route using `useRuntimeConfig(event)` — never send the secret to the browser'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Retries are not free.** Automatic retries on `POST` can create duplicate orders. ofetch does not retry `POST`/`PUT`/`PATCH`/`DELETE` by default for this reason; if you enable it, make the endpoint idempotent (an idempotency key sent by the client and checked by the server).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer a **backend-for-frontend** route in `server/api` over calling third-party APIs directly from the browser: you keep secrets on the server, can cache with `defineCachedFunction`, reshape responses to exactly what the UI needs (smaller payload), and avoid CORS entirely.',
            },
          ],
        },
        {
          id: 'usestate-ssr-safe-state',
          title: 'SSR-Safe Shared State with useState',
          summary:
            '`useState` creates reactive state that is shared across components, serialized from the server to the browser, and **isolated per request**. A plain module-level `ref` is shared by *all* users on the server and leaks data between requests.',
          keyPoints: [
            '`const user = useState(\'user\', () => null)` — the first argument is a unique **key**, the second a function that provides the initial value. Every component calling `useState` with the same key gets the same ref.',
            'The state is created **per request on the server** (stored on the Nuxt app instance), written into the payload, and restored in the browser during hydration — so server and client start identical.',
            'A `ref()` defined at the **top of a module** lives for the lifetime of the Node process: it is created once and shared by every visitor. That causes **cross-request state pollution** (user A sees user B\'s data) and memory leaks.',
            'Only put JSON-like (serializable) data in `useState` — no class instances, functions or symbols. For anything larger or more structured, use Pinia (next topic).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'In a browser, your JavaScript runs for **one user**. On a Nuxt server, the *same* running program handles request after request for **thousands of different users**. Any variable defined outside a function (module scope) is shared by all of them — like a single whiteboard in a shared office that everyone writes on. State that is meant to belong to one visitor must therefore be created *inside* the request, which is what `useState` does.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/composables/useCounter.ts — BAD (module-level ref)',
              code: `// WRONG on the server: this ref is created ONCE when the module loads
// and then shared by every request until the process restarts.
const count = ref(0)
const currentUser = ref<{ name: string } | null>(null)

export const useCounter = () => ({ count, currentUser })

// Request 1 (Alice) sets currentUser = Alice.
// Request 2 (Bob) renders the page and may be served ... Alice's name in the HTML!
// It also never gets garbage collected, so memory grows.`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/composables/useCounter.ts — GOOD (useState)',
              code: `export const useCounter = () => {
  // Each request gets its own copy; the key must be unique across your app
  const count = useState<number>('counter', () => 0)
  const currentUser = useState<{ name: string } | null>('current-user', () => null)

  const increment = () => count.value++
  return { count, currentUser, increment }
}`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Alice
    participant Bob
    participant Server as Nuxt server process
    Note over Server: module-level ref user = null
    Alice->>Server: GET /profile
    Server->>Server: set shared ref user = Alice
    Server-->>Alice: HTML for Alice
    Bob->>Server: GET /profile
    Note over Server: shared ref still holds Alice
    Server-->>Bob: HTML containing Alice data - LEAK
    Note over Server: with useState each request has its own state and Bob would see his own`,
            },
            {
              type: 'heading',
              text: 'How useState travels from server to browser',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["Server render: useState creates value for this request"] --> B["Value stored in nuxtApp.payload.state"]
    B --> C["Payload serialized into the HTML as JSON"]
    C --> D["Browser hydrates"]
    D --> E["useState with same key reads the value from payload instead of running the init function"]`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'using the shared state in two unrelated components',
              code: `<!-- components/CartBadge.vue -->
<script setup lang="ts">
const { count } = useCounter()
</script>
<template><span class="badge">{{ count }}</span></template>

<!-- components/AddButton.vue -->
<script setup lang="ts">
const { increment } = useCounter()
</script>
<template><button @click="increment">Add to cart</button></template>`,
            },
            {
              type: 'heading',
              text: 'Other ways the same leak appears',
            },
            {
              type: 'list',
              items: [
                '**Module-level `reactive`, `Map` or plain objects used as caches** inside `composables/`, `utils/` or a Pinia store file (outside the store function).',
                '**Singletons in `server/utils`** that store per-user data: server handlers run for all users, so keep per-request data on `event.context` and only truly global data (config, a DB connection pool) in module scope.',
                '**Importing a library that keeps global state** and mutating it during render.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Module-level state is fine for **constants and pure helpers** (a regex, a number formatter, a lookup table). The problem is only *mutable, per-user* data. When in doubt, ask: "Could this value differ between two visitors?" If yes, it must live in `useState`, a Pinia store, a cookie, or `event.context`.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Because `useState` keys are global strings, prefix them by feature (`\'cart:items\'`, `\'auth:user\'`). Omit the key and Nuxt generates one from the call site — fine for one-off use, but an explicit key is safer when two files must share the state. Reset with `clearNuxtState(\'cart:items\')` — since Nuxt 4.4 this resets the state to its **initial value** (the init function result) rather than `undefined`.',
            },
          ],
        },
        {
          id: 'pinia-in-nuxt',
          title: 'Pinia in Nuxt (and What Happened to Vuex)',
          summary:
            'For structured, larger app state use Pinia via the `@pinia/nuxt` module: stores are created per request, serialized into the payload and rehydrated in the browser automatically. Vuex is in maintenance mode and not recommended for new Nuxt apps.',
          keyPoints: [
            'Install with `npx nuxt module add pinia` (adds `@pinia/nuxt` to `modules`). `defineStore`, `storeToRefs` and your store folder can be auto-imported. Pinia itself is covered in the Pinia topic of the Vue.js section — here is what Nuxt adds.',
            '**SSR hydration is automatic:** state set on the server is serialized into the payload and applied to the browser\'s Pinia instance, so the browser does not need to re-fetch what a server-side action already loaded.',
            '**Pattern for loading data into a store:** call the store action inside `await useAsyncData` or `callOnce`, so it runs once on the server and not again during hydration.',
            '**Vuex** was Nuxt 2\'s built-in store (`store/` folder). In Nuxt 3/4 it is not built in; Pinia is the official Vue state library. Use `useState` for small shared values and Pinia when you want actions, getters, devtools and structure.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'install',
              code: `npx nuxt module add pinia      # installs pinia + @pinia/nuxt and updates nuxt.config.ts`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts',
              code: `export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  pinia: {
    storesDirs: ['./stores/**'],   // auto-import stores from the stores folder
  },
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/stores/products.ts',
              code: `export const useProductsStore = defineStore('products', () => {
  // state
  const items = ref<{ id: number; name: string; price: number }[]>([])
  const loaded = ref(false)

  // getters
  const total = computed(() => items.value.reduce((sum, p) => sum + p.price, 0))

  // actions
  async function fetchAll() {
    if (loaded.value) return                 // simple guard against refetching
    items.value = await $fetch('/api/products')
    loaded.value = true
  }

  return { items, loaded, total, fetchAll }
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/products.vue — load once on the server',
              code: `<script setup lang="ts">
const store = useProductsStore()
const { items, total } = storeToRefs(store)   // keep reactivity when destructuring state/getters

// Runs on the server during SSR; skipped on the client during hydration
// (callOnce is available since Nuxt 3.9).
await callOnce('products', () => store.fetchAll())

// Equivalent, if you want status/error:
// await useAsyncData('products', () => store.fetchAll().then(() => true))
</script>

<template>
  <ul>
    <li v-for="p in items" :key="p.id">{{ p.name }} - {{ p.price }}</li>
  </ul>
  <p>Total: {{ total }}</p>
</template>`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Browser
    participant Server as Nuxt server
    participant API
    Browser->>Server: GET /products
    Server->>Server: create a NEW Pinia instance for this request
    Server->>API: store.fetchAll via callOnce
    API-->>Server: products
    Server->>Server: store state filled
    Server-->>Browser: HTML plus payload with pinia state
    Browser->>Browser: create Pinia instance and restore state from payload
    Note over Browser: callOnce skipped - no second API call
    Note over Browser: later actions run in the browser as normal`,
            },
            {
              type: 'heading',
              text: 'Pitfalls specific to SSR',
            },
            {
              type: 'list',
              items: [
                '**Do not call `useXStore()` outside setup/plugins/middleware**, for example at the top level of a module. A store instance belongs to one request\'s Pinia instance; creating it at module scope would reintroduce cross-request state.',
                '**Only serializable data goes in state.** Dates become strings after hydration; class instances lose their methods. Store ISO strings or numbers.',
                '**Browser-only sources** (`localStorage`, `useLocalStorage` from VueUse) in store state cause hydration mismatches — wrap the initial value with `skipHydrate()` or read it in `onMounted`.',
                '**Stores that depend on cookies/user** must fetch with `useRequestFetch()` on the server, otherwise the server request is anonymous.',
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a store that uses a browser-only value safely',
              code: `import { skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const usePrefsStore = defineStore('prefs', () => {
  // localStorage does not exist on the server: do not try to hydrate this from the payload
  const theme = skipHydrate(useLocalStorage('theme', 'light'))
  return { theme }
})`,
            },
            {
              type: 'table',
              headers: ['Tool', 'Use when', 'Notes'],
              rows: [
                ['`useState`', 'A few shared values (current user, toast message, drawer open)', 'Built in, tiny, SSR-safe'],
                ['Pinia', 'Many related states with actions/getters, devtools, plugins, testing', 'Official Vue state library; `@pinia/nuxt` handles SSR'],
                ['Vuex', 'Maintaining an existing Vuex app', 'Maintenance mode; not built into Nuxt 3/4; avoid for new work'],
                ['`useAsyncData` / `useFetch` data', 'Server data only used by one page', 'No store needed; share via the same key'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Do not put *server data* into a store just because you can. If only one page uses the data, `useFetch` is simpler and gets caching/refresh for free. Use a store when many distant components need the same state, or when it has real business logic (cart totals, wizard steps).',
            },
          ],
        },
        {
          id: 'nitro-server-engine',
          title: 'Nitro: The Server Engine Under Nuxt',
          summary:
            'Nitro is the server that Nuxt builds on. It turns your project into a self-contained `.output/` folder, handles API routes, caching, storage and rendering, and can target Node, serverless, edge or static hosting with the same code.',
          keyPoints: [
            'Nitro is built on **h3** (a tiny HTTP framework), **ofetch** (`$fetch`) and **unstorage** (key-value storage). Files in `server/` become routes automatically, like `pages/` does for the browser.',
            'The same Nitro server **renders your Vue pages** (the SSR renderer is just one more handler) *and* serves your API routes, so they can call each other without a network hop.',
            'Build output is **self-contained and tree-shaken**: `.output/server/index.mjs` runs with `node` and needs no `node_modules` at runtime.',
            '**Presets** (`node-server`, `static`, `vercel`, `netlify`, `cloudflare-pages`, `aws-lambda`, `bun`, ...) make Nitro emit the exact format a hosting platform expects.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'If Nuxt is the car, Nitro is the **engine room** that actually talks to the outside world. It receives HTTP requests, decides what handles them, runs your code, and sends the answer back. In development it runs inside the Vite dev process; in production it is a standalone program you deploy.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Req["Incoming HTTP request"] --> N["Nitro server - h3"]
    N --> SP["server/plugins run once at startup"]
    N --> MW["server/middleware - runs for EVERY request in file order"]
    MW --> RR{"routeRules match?"}
    RR -- "redirect, headers, cors, cache" --> Apply["Apply rule"]
    Apply --> Match
    RR -- no --> Match{"Which handler?"}
    Match -- "/api/*" --> API["server/api handler"]
    Match -- "server/routes file" --> Routes["server/routes handler"]
    Match -- "file in public/" --> Static["Static asset"]
    Match -- "anything else" --> Render["Vue SSR renderer - your pages"]
    API --> Res["Response"]
    Routes --> Res
    Static --> Res
    Render --> Res`,
            },
            {
              type: 'table',
              headers: ['Folder', 'URL it serves', 'Purpose'],
              rows: [
                ['`server/api/hello.get.ts`', '`GET /api/hello`', 'JSON endpoints; the method suffix (`.get`, `.post`, ...) limits the method'],
                ['`server/api/posts/[id].get.ts`', '`GET /api/posts/42`', 'Dynamic param, read with `getRouterParam(event, \'id\')`'],
                ['`server/routes/sitemap.xml.ts`', '`/sitemap.xml`', 'Endpoints that must not have the `/api` prefix'],
                ['`server/middleware/*.ts`', 'every request', 'Logging, auth context, headers. Must **not return** a value to continue.'],
                ['`server/plugins/*.ts`', 'at server start', 'Hook into Nitro (`render:response`), open connections'],
                ['`server/utils/*.ts`', '—', 'Auto-imported helpers for server code only (`useDb()`)'],
                ['`server/tasks/*.ts`', 'scheduled / on demand', 'Background tasks (behind `nitro.experimental.tasks`); Nuxt CLI v4 can run them with `nuxt task`'],
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/middleware/log.ts',
              code: `export default defineEventHandler((event) => {
  // Runs before every route handler, including page renders.
  // Do NOT return anything - returning a value ends the request here.
  console.log(\`[\${new Date().toISOString()}] \${event.method} \${getRequestURL(event).pathname}\`)

  // Share per-request data with later handlers:
  event.context.requestId = crypto.randomUUID()
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/plugins/headers.ts — hook into the render pipeline',
              code: `export default defineNitroPlugin((nitroApp) => {
  // Add a security header to every rendered page
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    response.headers['x-frame-options'] = 'DENY'
  })
})`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'what a production build gives you',
              code: `npm run build
# .output/
#   server/index.mjs     <- the server; start it with: node .output/server/index.mjs
#   server/chunks/...    <- your code and the few dependencies it actually uses
#   public/              <- hashed client assets and prerendered pages

PORT=3000 node .output/server/index.mjs`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Internal calls such as `$fetch(\'/api/hello\')` made on the **server** do not go over the network: Nitro invokes the handler function directly (zero latency). In the **browser** they are normal HTTP requests. This is why SSR + your own API is fast. The flip side: direct calls skip the user\'s cookies unless you forward them (`useRequestFetch()`).',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Server code runs in **many environments** (Node, Cloudflare Workers, Vercel Edge). Edge runtimes lack `fs`, native modules (`bcrypt`, `sharp`) and long-lived connections. If you target the edge, choose edge-friendly libraries (e.g. HTTP-based database clients) and test on the target preset.',
            },
            {
              type: 'heading',
              text: 'Nitro versions and the new nuxt/server entry point',
            },
            {
              type: 'p',
              text: 'Nuxt 4 runs on **Nitro v2** with **h3 v1**. Nuxt 5 moves to **Nitro v3** and **h3 v2**, whose request event is built on web standards (`event.req` is a standard `Request`, `event.url` a `URL`), so the same handler runs unchanged on Node, Bun, Deno and workers. To make that migration painless, Nuxt 4.6 introduced a small, version-neutral server API imported from `nuxt/server` — `defineEventHandler`, `createError`, `getQuery`, `getRouterParam(s)`, `readValidatedBody` (accepting any Standard Schema validator such as zod, valibot or arktype), `getRequestIP`, `handleCors`, `getRouteRules`, `useRuntimeConfig`, `useSession` and a few more. Handlers written against it work under Nitro v2, Nitro v3, and the experimental `@nuxt/vite-server`.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/hello.get.ts — portable across Nitro versions (Nuxt 4.6+)',
              code: `import { defineEventHandler, getQuery } from 'nuxt/server'

export default defineEventHandler((event) => {
  const { name } = getQuery<{ name?: string }>(event)
  return { message: \`Hello, \${name ?? 'world'}!\` }
})`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do not mix the two worlds in one handler. On Nuxt 4 the *auto-imported* `defineEventHandler` and `readBody` are still h3 v1\'s versions; combining them with `nuxt/server` helpers triggers error `NUXT_E8012`. Pick one style per file — for new code that should survive the Nuxt 5 upgrade, import everything explicitly from `nuxt/server`. Nitro remains the default and recommended server; `@nuxt/vite-server` has no storage, caching, tasks or server plugins.',
            },
          ],
        },
        {
          id: 'server-api-routes',
          title: 'Building APIs: server/api, Validation and Errors',
          summary:
            'Files in `server/api/` define endpoints with `defineEventHandler`. Read input with `getQuery`, `getRouterParam` and `readBody` (preferably validated with zod), return plain objects (auto-JSON) and signal failure with `createError`.',
          keyPoints: [
            'Return a value (object, array, string, Promise) and Nitro serialises it to JSON; throw `createError({ statusCode, statusMessage })` to send an error response.',
            'Input helpers: `getQuery(event)` (query string), `getRouterParam(event, \'id\')` (path param), `readBody(event)` (JSON body), `getHeader`, `getCookie`; and validating versions `readValidatedBody`, `getValidatedQuery`, `getValidatedRouterParams`.',
            '**Never trust input:** validate with a schema library such as **zod** and return **400** with the problems, instead of letting bad data reach your database.',
            'On the app side, `$fetch(\'/api/posts\')` and `useFetch` **infer the response type** from the handler\'s return value — one source of truth for the API contract.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'server/utils/db.ts — an in-memory "database" (replace with a real one)',
              code: `// Module scope is fine here: this is shared, global DATA (like a real database), not per-user state.
export interface Post { id: number; title: string; body: string }

const posts: Post[] = [
  { id: 1, title: 'Hello Nuxt', body: 'First post' },
  { id: 2, title: 'Nitro rocks', body: 'Second post' },
]
let nextId = 3

export const db = {
  list: () => posts,
  find: (id: number) => posts.find(p => p.id === id),
  create: (data: Omit<Post, 'id'>) => {
    const post = { id: nextId++, ...data }
    posts.push(post)
    return post
  },
}`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/posts.get.ts',
              code: `export default defineEventHandler((event) => {
  // GET /api/posts?limit=1
  const { limit } = getQuery(event)
  const all = db.list()                       // db is auto-imported from server/utils
  return limit ? all.slice(0, Number(limit)) : all
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/posts/[id].get.ts',
              code: `export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'id must be a number' })
  }

  const post = db.find(id)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }
  return post
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/posts.post.ts — validated with zod',
              code: `import { z } from 'zod'

const bodySchema = z.object({
  title: z.string().min(3, 'Title is too short').max(120),
  body: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  // readValidatedBody reads JSON and runs the validator; safeParse never throws
  const result = await readValidatedBody(event, body => bodySchema.safeParse(body))

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: result.error.issues,       // the client can show per-field messages
    })
  }

  const post = db.create(result.data)
  setResponseStatus(event, 201)         // 201 Created
  return post
})`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    R["POST /api/posts"] --> P["readValidatedBody parses JSON"]
    P --> V{"zod safeParse ok?"}
    V -- no --> E400["createError 400 with issues"]
    V -- yes --> W["Write to database"]
    W -- success --> OK["201 Created with the post"]
    W -- throws --> E500["Nitro returns 500 - hide details in production"]`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'calling it from a form, with typed errors',
              code: `<script setup lang="ts">
const form = reactive({ title: '', body: '' })
const issues = ref<{ path: (string | number)[]; message: string }[]>([])

async function submit() {
  issues.value = []
  try {
    // The return type is inferred from server/api/posts.post.ts
    const created = await $fetch('/api/posts', { method: 'POST', body: form })
    await navigateTo(\`/posts/\${created.id}\`)
  } catch (err: any) {
    if (err.statusCode === 400) issues.value = err.data?.data ?? []   // err.data is the response body
    else throw err
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.title" placeholder="Title" />
    <textarea v-model="form.body" />
    <ul><li v-for="i in issues" :key="i.path.join('.')">{{ i.path.join('.') }}: {{ i.message }}</li></ul>
    <button>Save</button>
  </form>
</template>`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never return raw database errors or stack traces to the client. Nitro hides stack traces in production, but a `statusMessage` you write yourself is sent as-is — keep it generic. Put detailed info in server logs. Also remember **client-side validation is only UX**; the server must always validate again.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Because `server/api/posts.get.ts` and `server/api/posts.post.ts` share the URL `/api/posts`, the method suffix is what separates them. A file with no suffix (`posts.ts`) answers **all** methods, which is rarely what you want — check `event.method` yourself or use suffixes.',
            },
          ],
        },
        {
          id: 'end-to-end-type-safety',
          title: 'End-to-End Type Safety: shared/ Schemas, Typed $fetch and Typed Routes',
          summary:
            'Because the frontend and the backend live in one Nuxt project, one schema can validate the request on the server, type the form on the client and type the response of `$fetch` — no code generation, no drift between API and UI.',
          keyPoints: [
            'Put validation schemas and DTO types in `shared/` (auto-imported from `shared/utils` and `shared/types` on both sides). The server validates with them; the client reuses them for forms.',
            '`$fetch` and `useFetch` infer the **response** type from the handler\'s return value. Since Nuxt 4.6, `experimental.routeTypedFetch` rebuilds this on `fetchdts` and also checks the request `body`, `query` and `headers`, scaling to hundreds of routes.',
            'Types describe what crosses the wire **after serialization**: a `Date` returned from a handler arrives as a `string`, and class instances become plain objects. Model DTOs as JSON-friendly data.',
            'Typed pages (`experimental.typedPages`) make `navigateTo` and `<NuxtLink :to>` type-check route names and params — rename a page and the compiler shows every broken link.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    S["shared/utils/schemas.ts<br/>zod schema + inferred type"] --> SV["server/api/posts.post.ts<br/>readValidatedBody"]
    S --> CL["app/pages/new.vue<br/>form validation"]
    SV -- "return type inferred" --> F["$fetch / useFetch<br/>typed response"]
    F --> CL`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'shared/utils/schemas.ts — one source of truth',
              code: `import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().min(1),
  tags: z.array(z.string()).max(5).default([]),
})

export type CreatePostInput = z.infer<typeof createPostSchema>

// Keep DTOs JSON-friendly: ISO strings instead of Date objects
export interface PostDto {
  id: number
  title: string
  publishedAt: string
}`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/posts.post.ts — validate with the shared schema',
              code: `export default defineEventHandler(async (event): Promise<PostDto> => {
  // Throws a 400 with the validation issues if the body does not match
  const input = await readValidatedBody(event, createPostSchema.parse)
  const row = await db.posts.insert(input)
  return { id: row.id, title: row.title, publishedAt: row.publishedAt.toISOString() }
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/posts/new.vue — the same schema on the client',
              code: `<script setup lang="ts">
const form = reactive<CreatePostInput>({ title: '', body: '', tags: [] })

const clientErrors = computed(() => {
  const r = createPostSchema.safeParse(form)
  return r.success ? [] : r.error.issues          // instant UX feedback, server re-validates
})

async function submit() {
  // created is typed as PostDto, inferred from the handler
  const created = await $fetch('/api/posts', { method: 'POST', body: form })
  await navigateTo(\`/posts/\${created.id}\`)
}
</script>`,
            },
            {
              type: 'heading',
              text: 'Typed $fetch and typed routes',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — opt-in type features (Nuxt 4.6)',
              code: `export default defineNuxtConfig({
  experimental: {
    routeTypedFetch: true,    // rebuilt typed $fetch: checks body/query/headers too
    strictRouteTypes: true,   // unknown API paths become type errors instead of "unknown"
    typedPages: true,         // typed route names and params for navigateTo / NuxtLink
  },
})`,
            },
            {
              type: 'p',
              text: 'Why was a rebuild needed? The older inference computed a giant union type of every route on each call, which hit TypeScript\'s "type instantiation is excessively deep" limit (`TS2589`) at a few hundred routes and made editors sluggish. The Nuxt 4.6 announcement reports type-checking a 300-route project dropping from several seconds (and an error) to a fraction of a second. If your project is large and editor performance matters, this flag is worth enabling early — it is on the path to becoming the Nuxt 5 default.',
            },
            {
              type: 'table',
              headers: ['Layer', 'Mechanism', 'Catches'],
              rows: [
                ['Request body/query', 'Shared zod (or any Standard Schema) + `readValidatedBody` / `getValidatedQuery`', 'Bad input at runtime (400) and at compile time on the client'],
                ['Response', 'Handler return type inferred by `$fetch` / `useFetch`', 'UI using fields that no longer exist'],
                ['Routes', '`typedPages`', 'Links to renamed or deleted pages, missing params'],
                ['Environment', '`runtimeConfig` typed from defaults', 'Typos in config keys'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Compile-time types are not a security boundary. TypeScript disappears at build time; anyone can POST anything to `/api/posts`. The schema must run **on the server** for every request, and it is the server\'s validated output — not the client\'s form type — that you trust.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Never import from `server/` into `app/` to "share a type" — import protection will (rightly) block server code from reaching the client bundle. Move the type into `shared/`. If a type depends on your ORM (`InferSelectModel<typeof posts>`), map it to a DTO in `shared/` so the client does not transitively import the database layer.',
            },
          ],
        },
        {
          id: 'route-middleware',
          title: 'Route Middleware and Auth Guards',
          summary:
            'Route middleware runs before a navigation completes — on the server for the first request and in the browser for later ones — and can redirect with `navigateTo` or block with `abortNavigation`. It is Nuxt\'s version of navigation guards.',
          keyPoints: [
            'Three kinds: **named** (`middleware/auth.ts`, applied per page), **global** (`middleware/analytics.global.ts`, runs on every route) and **inline** (a function inside `definePageMeta`).',
            'Signature: `defineNuxtRouteMiddleware((to, from) => { ... })`. Return nothing to continue, `navigateTo(path)` to redirect, `abortNavigation()` to cancel, or a `createError` to show an error page.',
            'Execution order: all **global** middleware (alphabetical by file name) first, then page middleware in the order listed in `definePageMeta`.',
            '**Not the same as `server/middleware`**: route middleware runs for page navigations inside the Vue app; `server/middleware` runs in Nitro for every HTTP request (including API calls and assets).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'app/middleware/auth.ts (named)',
              code: `export default defineNuxtRouteMiddleware((to) => {
  // useCookie works on the server (reads the request) and in the browser
  const token = useCookie('auth-token')

  if (!token.value) {
    // Remember where the user wanted to go, then send them to login
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/middleware/log.global.ts (global)',
              code: `// middleware/log.global.ts - runs on every navigation, automatically
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) console.log('navigating', from.path, '->', to.path)
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/account.vue — named plus inline middleware',
              code: `<script setup lang="ts">
definePageMeta({
  middleware: [
    'auth',                                  // named: middleware/auth.ts
    function (to) {                          // inline: only for this page
      if (to.query.debug === '1') return abortNavigation()
    },
  ],
})
</script>`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant User
    participant Router as Nuxt router
    participant G as Global middleware
    participant P as Page middleware
    participant Page
    User->>Router: navigate to /account
    Router->>G: run each .global file alphabetically
    G-->>Router: continue
    Router->>P: run middleware listed in definePageMeta
    alt no token cookie
        P-->>Router: navigateTo /login
        Router-->>User: redirect to /login
    else token present
        P-->>Router: continue
        Router->>Page: render the page
        Page-->>User: account page
    end`,
            },
            {
              type: 'heading',
              text: 'A role-based guard',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/middleware/admin.ts',
              code: `export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, user } = useUserSession()   // from nuxt-auth-utils; or your own composable

  if (!loggedIn.value) return navigateTo('/login')
  if (user.value?.role !== 'admin') {
    // Show a real 403 page instead of silently redirecting
    return abortNavigation(createError({ statusCode: 403, statusMessage: 'Admins only' }))
  }
})`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '**Route middleware is a user-experience feature, not security.** It protects *pages*, but your data lives behind *API endpoints*. Every `server/api` handler that returns private data must check the session itself (for example `await requireUserSession(event)`). A user can call `/api/admin/users` directly, bypassing every page guard.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Middleware runs on **every navigation**, so keep it fast and avoid awaiting slow network calls in a global middleware. Also be careful with redirect loops: a middleware that redirects to `/login` must not also apply to `/login` itself (check `to.path`, or do not add `auth` to the login page).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'On the server, `navigateTo()` becomes an HTTP **302 redirect** (so crawlers and curl see it); in the browser it is a client-side route change. Use `navigateTo(url, { redirectCode: 301 })` for permanent redirects and `{ external: true }` for other domains.',
            },
          ],
        },
        {
          id: 'plugins-and-composables',
          title: 'Plugins, provide/inject and Writing Composables',
          summary:
            'Plugins run once when the Nuxt app starts (server and/or client) and are the place to register libraries and inject helpers; composables are reusable `use*` functions that rely on the Nuxt context and must be called in the right place.',
          keyPoints: [
            'A file in `plugins/` runs at startup: `defineNuxtPlugin((nuxtApp) => { ... })`. Suffix `.client.ts` / `.server.ts` restricts where it runs. Order is alphabetical, so prefix with numbers (`01.first.ts`) or use `dependsOn` / `enforce`.',
            '`return { provide: { name: value } }` exposes `useNuxtApp().$name` (and `this.$name` in options API). Use plugins for third-party Vue plugins (`nuxtApp.vueApp.use(...)`), global directives and SDK clients.',
            'Composables (`use*`) can use `useNuxtApp()`, `useState`, `useRoute` — but only while the Nuxt context is active: **synchronously** in `setup`, plugins or route middleware. After an `await` it can be lost unless the compiler handles it.',
            'Rule: `useX()` in `composables/` = per-request/per-app logic; `utils/` = pure functions. Prefer composables returning refs and functions over modules with hidden global state.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'app/plugins/api.ts — provide an API client',
              code: `export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // A pre-configured $fetch that adds the base URL and the auth header
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const token = useCookie('auth-token').value
      if (token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', \`Bearer \${token}\`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) await nuxtApp.runWithContext(() => navigateTo('/login'))
    },
  })

  return { provide: { api } }   // available as useNuxtApp().$api
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'using it with useAsyncData',
              code: `<script setup lang="ts">
const { $api } = useNuxtApp()
const { data: profile } = await useAsyncData('profile', () => $api('/me'))
</script>`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/plugins/toast.client.ts — browser-only third-party plugin',
              code: `import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, { position: POSITION.BOTTOM_RIGHT })  // .client = never runs on the server
})`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    S["App starts - server or browser"] --> A["Create nuxtApp"]
    A --> P1["Plugins with enforce pre"]
    P1 --> P2["Normal plugins - numeric prefixes first, then alphabetical"]
    P2 --> P3["Plugins with enforce post"]
    P3 --> H["app:created hook"]
    H --> MW["Route middleware for the first route"]
    MW --> R["Render the page"]`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'ordering plugins explicitly',
              code: `// plugins/analytics.ts
export default defineNuxtPlugin({
  name: 'analytics',
  dependsOn: ['api'],          // wait for the plugin named "api" to finish first
  parallel: true,              // may run concurrently with other parallel plugins
  async setup(nuxtApp) {
    // ...
  },
  hooks: {
    'app:mounted'() { /* runs once in the browser after mount */ },
  },
})`,
            },
            {
              type: 'heading',
              text: 'Writing good composables',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/composables/useFavorites.ts',
              code: `// A composable = state (per request) + actions + derived values
export const useFavorites = () => {
  const ids = useState<number[]>('favorites', () => [])     // SSR-safe, not a module-level ref

  const isFavorite = (id: number) => ids.value.includes(id)
  const toggle = (id: number) => {
    ids.value = isFavorite(id) ? ids.value.filter(x => x !== id) : [...ids.value, id]
  }

  // Browser-only side effect: persist after mount
  if (import.meta.client) {
    watch(ids, v => localStorage.setItem('favorites', JSON.stringify(v)), { deep: true })
  }

  return { ids, isFavorite, toggle }
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**"Nuxt instance is unavailable" / "A composable that requires access to the Nuxt instance was called outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function."** It happens when you call `useFetch`, `useRoute` or `useState` inside a callback, `setTimeout` or after an unrelated `await`. Call composables at the top of `setup`, or wrap callbacks with `nuxtApp.runWithContext(() => ...)`.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Compose, do not nest deeply: a composable should do one thing (`useFavorites`, `useDebounced`, `useSort`). Return plain refs and functions so the caller decides how to render. Put the name `use` at the start so the auto-import scan, the linter and readers recognise it.',
            },
          ],
        },
        {
          id: 'nuxt-modules',
          title: 'The Module Ecosystem and Writing a Tiny Module',
          summary:
            'A Nuxt module is a build-time extension: one line in `modules: []` can add components, composables, server routes, plugins and config. The ecosystem covers images, content, UI, i18n, auth and more, and writing your own is a small function.',
          keyPoints: [
            'Install with `npx nuxt module add <name>` (installs the package and adds it to `modules`), then configure under the module\'s own key in `nuxt.config.ts`.',
            'Popular modules: `@nuxt/image` (optimised images), `@nuxt/content` (Markdown/CMS-style content), `@nuxt/ui` (components), `@nuxtjs/i18n` (translations), `@vueuse/nuxt` (VueUse composables), `@pinia/nuxt`, `nuxt-auth-utils` / `@sidebase/nuxt-auth` (authentication), `@nuxt/fonts`, `@nuxt/eslint`, `@nuxt/test-utils`.',
            'Modules run **at build time (and dev-server start)**, before the app is created. They use the `@nuxt/kit` helpers (`addPlugin`, `addImports`, `addComponent`, `addServerHandler`) to extend your app.',
            'A local module in `modules/` is picked up automatically — a good way to package team-specific setup (an analytics plugin plus a composable plus a config option) without publishing to npm.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Think of modules as **browser extensions for your framework**. Instead of writing the glue code yourself ("register this plugin, add this composable, serve this endpoint, tweak the build config"), you add the module and it does the wiring. Because they run at build time, they can change Vite config, generate types, and add server handlers — more than a runtime plugin can.',
            },
            {
              type: 'table',
              headers: ['Module', 'What it gives you', 'Use when'],
              rows: [
                ['`@nuxt/image`', '`<NuxtImg>` / `<NuxtPicture>`: resizing, modern formats (WebP/AVIF), lazy loading, srcset; v2 (Nov 2025) brought full TypeScript support and IPX v3', 'You show many or large images'],
                ['`@nuxt/content`', 'Write pages as Markdown/YAML/JSON files; v3 stores them in an SQL database (SQLite, D1, Postgres...) defined by typed collections and queried with `queryCollection`', 'Docs, blogs, marketing sites'],
                ['`@nuxt/ui`', 'Accessible component library on Tailwind CSS and Reka UI; since v4 (Sept 2025) the former Pro components are merged in and free (100+ components)', 'You want a ready-made design system'],
                ['`@nuxt/scripts`', 'Load third-party scripts (analytics, maps, chat) with triggers such as idle or interaction, plus typed wrappers', 'Third-party JS is hurting performance'],
                ['`@nuxt/fonts`', 'Self-hosts and optimises web fonts with fallback metrics to reduce layout shift', 'Any site using custom fonts'],
                ['`@nuxtjs/i18n`', 'Translations, locale routing (`/fr/about`), `useI18n`, SEO alternates', 'Multi-language sites'],
                ['`@vueuse/nuxt`', 'Auto-imports hundreds of SSR-aware VueUse composables', 'Browser utilities (`useMouse`, `useStorage`, `useDark`)'],
                ['`nuxt-auth-utils`', 'Sealed-cookie sessions, `useUserSession`, OAuth providers, password hashing', 'Simple, first-party session auth'],
                ['`@sidebase/nuxt-auth`', 'Auth.js / NextAuth-style providers for Nuxt', 'Many OAuth providers, adapters'],
                ['`@nuxtjs/sitemap` / `@nuxtjs/robots` (Nuxt SEO)', '`sitemap.xml`, `robots.txt`, OG images, schema.org', 'Public sites that need SEO'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'add modules',
              code: `npx nuxt module add image
npx nuxt module add @nuxt/ui
npx nuxt module add i18n
npx nuxt module remove i18n     # Nuxt CLI: uninstall and remove from nuxt.config`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — modules and their configuration keys',
              code: `export default defineNuxtConfig({
  modules: ['@nuxt/image', '@nuxtjs/i18n', '@vueuse/nuxt'],

  image: {                       // @nuxt/image options
    quality: 80,
    format: ['avif', 'webp'],
  },
  i18n: {                        // @nuxtjs/i18n options
    locales: [{ code: 'en', language: 'en-US' }, { code: 'fr', language: 'fr-FR' }],
    defaultLocale: 'en',
  },
})`,
            },
            {
              type: 'heading',
              text: 'Writing a tiny module',
            },
            {
              type: 'p',
              text: 'This module adds a composable, a plugin and an API endpoint, and takes one option. The part inside `setup` runs at **build time**; everything inside the `runtime/` folder is code that ships into the app or server.',
            },
            {
              type: 'code',
              language: 'text',
              title: 'modules/greeter/ — a local module (auto-registered)',
              code: `modules/greeter/
  index.ts                     # the module definition (build time)
  runtime/
    plugin.ts                  # app code the module injects
    composables/useGreeting.ts
    server/api/greeting.get.ts`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'modules/greeter/index.ts',
              code: `import { defineNuxtModule, addPlugin, addImports, addServerHandler, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  greeting: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: { name: 'greeter', configKey: 'greeter' },   // users configure it via nuxt.config greeter: {}
  defaults: { greeting: 'Hello' },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Make the option available to runtime code
    nuxt.options.runtimeConfig.public.greeter = { greeting: options.greeting }

    addPlugin(resolve('./runtime/plugin'))
    addImports({ name: 'useGreeting', from: resolve('./runtime/composables/useGreeting') })
    addServerHandler({ route: '/api/greeting', method: 'get', handler: resolve('./runtime/server/api/greeting.get') })
  },
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'runtime/composables/useGreeting.ts and runtime/server/api/greeting.get.ts',
              code: `// runtime/composables/useGreeting.ts
export const useGreeting = (name: string) => {
  const { greeter } = useRuntimeConfig().public as { greeter: { greeting: string } }
  return \`\${greeter.greeting}, \${name}!\`
}

// runtime/server/api/greeting.get.ts
export default defineEventHandler(() => ({ message: 'served by the greeter module' }))`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Start["nuxt dev or nuxt build"] --> Cfg["Load nuxt.config.ts"]
    Cfg --> Mods["Run each module setup in order"]
    Mods --> Kit["Modules call kit helpers: addPlugin, addImports, addComponent, addServerHandler, hooks"]
    Kit --> Gen["Nuxt generates .nuxt/ types and virtual files"]
    Gen --> Build["Vite and Nitro build the app and server"]
    Build --> Run["Runtime: plugins run, handlers serve"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Before adding a module, check its maintenance status, whether it supports your Nuxt major version (3 vs 4) and the number of open issues. Every module is a dependency you will upgrade together with Nuxt. A 30-line local module is often better than a heavy package for a small need.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The order of `modules` matters when modules depend on each other (for example a module that expects Pinia to be installed first). Hooks like `nuxt.hook(\'modules:done\', ...)` let you run code after all modules have loaded.',
            },
          ],
        },
        {
          id: 'nuxt-layers',
          title: 'Nuxt Layers: Sharing Apps, Themes and Domains Across Projects',
          summary:
            'A layer is a partial Nuxt app — its own `nuxt.config`, `app/`, `server/`, components and composables — that another project extends. Layers are how you share a design system, an auth setup or an entire feature domain across several Nuxt apps, or split one large app by domain.',
          keyPoints: [
            'Add layers with `extends: [\'../base\', \'github:org/repo\', \'@acme/nuxt-layer\']`, or drop them into `layers/` where they are registered automatically.',
            'Layers **merge**: configs are deep-merged, and files (components, pages, composables, server routes) are combined. When two layers define the same file, the **project wins over its layers**, which lets an app override a single component from a theme layer.',
            'Layers vs modules: a module is *code that configures Nuxt at build time*; a layer is *a Nuxt project* that gets merged in. Use a layer to share app code and conventions, a module to share an integration.',
            'Useful for monorepos: one layer per business domain (`layers/billing`, `layers/catalog`) keeps ownership clear while still building a single app.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine five marketing sites for five brands. They share the header, footer, cookie banner, analytics plugin, SEO defaults and a `/api/newsletter` endpoint, but each has its own pages and colours. With modules you would have to package each piece separately; with a **layer** you publish one small Nuxt project with all of it, and each site `extends` it and adds only what is different.',
            },
            {
              type: 'code',
              language: 'text',
              title: 'a monorepo split into domain layers',
              code: `my-app/
  nuxt.config.ts              # extends nothing explicitly: layers/ is auto-scanned
  app/pages/index.vue
  layers/
    base/                     # design system, layouts, app.config, error page
      nuxt.config.ts
      app/components/AppButton.vue
      app/layouts/default.vue
    auth/                     # login pages, middleware, server/api/auth/*
      nuxt.config.ts
      app/pages/login.vue
      app/middleware/auth.ts
      server/api/auth/login.post.ts
    billing/                  # invoices pages, stores and server routes
      nuxt.config.ts
      app/pages/billing/index.vue
      server/api/invoices.get.ts`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — extending remote and local layers',
              code: `export default defineNuxtConfig({
  extends: [
    '../shared-theme',                          // local path
    ['github:acme/nuxt-base-layer', { install: true }],  // remote git layer
    '@acme/nuxt-analytics-layer',               // npm package
  ],

  // Nuxt 4.3+: disable a module that a layer enabled
  image: false,
})`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    P["Your project<br/>highest priority"] --> M["Merged Nuxt app"]
    L1["layers/auth"] --> M
    L2["layers/base"] --> M
    E["extends: remote theme<br/>lowest priority"] --> M
    M --> O["Same file in several places?<br/>the higher-priority source wins"]`,
            },
            {
              type: 'table',
              headers: ['', 'Layer', 'Module'],
              rows: [
                ['What it is', 'A (partial) Nuxt project', 'A build-time function using `@nuxt/kit`'],
                ['Contains', 'Pages, components, composables, server routes, config, assets', 'Logic that adds or changes those things'],
                ['Overriding', 'Override any file by creating the same path in the project', 'Only through the options the module exposes'],
                ['Typical use', 'Themes, starter kits, shared domains, multi-brand sites', 'Integrations: images, i18n, auth providers, CMS'],
                ['Effort to create', 'Low: it is just a Nuxt folder', 'Medium: API design, kit helpers, publishing'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Relative paths inside a layer resolve against the project, not the layer.** In a layer\'s `nuxt.config.ts`, `css: [\'./assets/main.css\']` would look in the consuming app. Resolve paths explicitly (for example with `fileURLToPath(new URL(\'./app/assets/main.css\', import.meta.url))`) or use the layer aliases. Also remember that in Nuxt 4 **layer modules load before project modules**, which matters if a project module expects to configure something a layer module sets up.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Keep layer boundaries honest: a domain layer should expose a small public surface (its pages, a few composables, its API) and not reach into another domain\'s internals. If two layers keep importing each other, they are one domain. Auto-scanned `layers/` directories are ordered by name — prefix them with numbers when the override order between sibling layers matters.',
            },
          ],
        },
        {
          id: 'seo-and-meta',
          title: 'SEO and Meta: useHead, useSeoMeta, Sitemap and Open Graph',
          summary:
            'Because Nuxt renders HTML on the server, tags you set with `useHead` and `useSeoMeta` appear in the real `<head>` that crawlers and link-preview bots read. Titles, descriptions, canonical links and social cards can be set per page and per data.',
          keyPoints: [
            '`useHead({ title, meta, link, script, htmlAttrs })` sets any tag; `useSeoMeta({ title, description, ogTitle, ogImage, twitterCard })` is the typed, safer shortcut for SEO and social tags.',
            'Both accept **reactive values or getters** (`() => post.value?.title`), so the head updates when data arrives; on the server the final values are written into the HTML.',
            'Set site-wide defaults in `app.head` (`nuxt.config.ts`) and `titleTemplate`; page-level calls override them. Later and more specific calls win.',
            'For a complete SEO set-up add: a **canonical link**, **sitemap.xml** and **robots.txt** (e.g. the Nuxt SEO modules), **Open Graph/Twitter** tags, **structured data** (JSON-LD) and correct **status codes** (real 404s).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Why does this need Nuxt at all? A link-preview bot (Slack, WhatsApp, LinkedIn) and most search crawlers do **not run your JavaScript reliably**. They read the HTML they get back. In a plain SPA that HTML has the same generic title for every URL. With SSR/prerender, each URL\'s HTML already contains its own title, description and preview image.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph SPA["Plain SPA"]
      direction TB
      a1["Bot requests /posts/5"] --> a2["HTML head: generic title only"] --> a3["Preview shows nothing useful"]
    end
    subgraph NX["Nuxt SSR or prerender"]
      direction TB
      b1["Bot requests /posts/5"] --> b2["Server runs useSeoMeta with the post data"] --> b3["HTML head: title, description, og:image"] --> b4["Rich preview card"]
    end`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — site-wide defaults',
              code: `export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s | My Blog',            // becomes "Hello Nuxt | My Blog"
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:site_name', content: 'My Blog' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/posts/[slug].vue — dynamic SEO from fetched data',
              code: `<script setup lang="ts">
const route = useRoute()
const { data: post } = await useFetch(\`/api/posts/\${route.params.slug}\`)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const url = \`https://example.com/posts/\${route.params.slug}\`

// Getters keep the tags in sync if post changes
useSeoMeta({
  title: () => post.value!.title,
  description: () => post.value!.summary,
  ogTitle: () => post.value!.title,
  ogDescription: () => post.value!.summary,
  ogImage: () => post.value!.coverUrl,
  ogUrl: url,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: url }],       // tells search engines the preferred URL
  script: [{
    type: 'application/ld+json',                  // structured data for rich results
    // Serialize explicitly; never build JSON-LD by string concatenation (XSS risk)
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.value.title,
      datePublished: post.value.publishedAt,
    }),
  }],
})
</script>`,
            },
            {
              type: 'heading',
              text: 'Sitemap, robots and social images',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — the Nuxt SEO modules',
              code: `export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap', '@nuxtjs/robots'],

  site: { url: 'https://example.com', name: 'My Blog' },   // shared by the SEO modules

  sitemap: {
    sources: ['/api/__sitemap__/urls'],        // an endpoint that returns dynamic URLs
  },
  robots: {
    disallow: ['/admin'],
  },
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/__sitemap__/urls.ts',
              code: `export default defineSitemapEventHandler(async () => {
  const posts = await $fetch<{ slug: string; updatedAt: string }[]>('/api/posts')
  return posts.map(p => ({ loc: \`/posts/\${p.slug}\`, lastmod: p.updatedAt }))
})`,
            },
            {
              type: 'list',
              items: [
                '**One `<h1>` per page**, real headings and meaningful link text — content structure matters as much as meta tags.',
                '**Return correct status codes:** a missing post should be a real `404` (see `createError` above), not a 200 page that says "not found".',
                '**Do not rely on client-only rendering for content you want indexed:** `ssr: false` or `<ClientOnly>` hides it from simple crawlers.',
                '**Check the result:** view page source (not the DOM inspector) or run `curl https://yoursite/posts/5 | head` — if the title and text are in the raw response, bots can see them.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Setting `useHead` in `onMounted` is too late for SEO: `onMounted` never runs on the server, so the tags exist only in the browser. Call `useHead` / `useSeoMeta` directly in `setup` (after the data it needs is available). Also, keep descriptions under about 160 characters and images at least 1200x630 for good social cards.',
            },
          ],
        },
        {
          id: 'runtime-config',
          title: 'Runtime Config, Environment Variables and Secrets',
          summary:
            '`runtimeConfig` is Nuxt\'s typed way to read settings at runtime. Values can be overridden by environment variables named `NUXT_...`; keys under `public` are exposed to the browser, all others stay on the server.',
          keyPoints: [
            'Declare every setting in `runtimeConfig` (with a default). Top-level keys are **server-only secrets**; keys inside `public` are sent to the browser — never put a secret under `public`.',
            'Override at deploy time with env vars: `runtimeConfig.apiSecret` ← `NUXT_API_SECRET`; `runtimeConfig.public.apiBase` ← `NUXT_PUBLIC_API_BASE` (camelCase becomes UPPER_SNAKE_CASE). The key **must exist in the config** to be overridable.',
            'Read with `useRuntimeConfig()` in app code and `useRuntimeConfig(event)` in Nitro handlers. In the browser, only `public` (and `app`) are present; a secret read there is `undefined`.',
            '`.env` files are read in **development and build**, but the built `.output` server reads **real environment variables** only (unless you load a dotenv file yourself). Do not use `process.env` in app code; it is not reliable across targets.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts',
              code: `export default defineNuxtConfig({
  runtimeConfig: {
    // SERVER ONLY (overridden by NUXT_STRIPE_SECRET, NUXT_DB_URL)
    stripeSecret: '',
    dbUrl: 'file:./dev.db',

    // EXPOSED TO THE BROWSER (overridden by NUXT_PUBLIC_API_BASE, NUXT_PUBLIC_SITE_NAME)
    public: {
      apiBase: 'https://api.example.com',
      siteName: 'My Shop',
    },
  },
})`,
            },
            {
              type: 'code',
              language: 'bash',
              title: '.env (dev) and production environment',
              code: `# .env  - used by nuxt dev and nuxt build. Add it to .gitignore!
NUXT_STRIPE_SECRET=sk_test_123
NUXT_PUBLIC_API_BASE=http://localhost:4000

# production: set real environment variables on the host (Docker, Vercel, systemd...)
NUXT_STRIPE_SECRET=sk_live_xxx NUXT_PUBLIC_API_BASE=https://api.example.com \\
  node .output/server/index.mjs`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    D["Defaults in nuxt.config runtimeConfig"] --> M["Merge"]
    E["Environment variables NUXT_* at server start"] --> M
    M --> S["Server: useRuntimeConfig sees secrets and public"]
    M --> P["Payload: only public and app keys are sent"]
    P --> C["Browser: useRuntimeConfig sees public only"]`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'using it — server and app',
              code: `// server/api/checkout.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)         // pass event in server routes
  const stripe = new Stripe(config.stripeSecret)  // secret is only visible here
  // ...
})

// app/composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  return $fetch.create({ baseURL: config.public.apiBase })   // public only in the browser
}`,
            },
            {
              type: 'table',
              headers: ['', '`runtimeConfig`', '`app.config.ts`', '`process.env`'],
              rows: [
                ['Available at', 'Runtime (env overrides at start)', 'Build time (bundled)', 'Node only; unreliable on edge'],
                ['Secrets?', 'Yes, top-level keys', 'Never — it is public', 'Yes, but not recommended in app code'],
                ['Typical use', 'API URLs, keys, feature flags per environment', 'Theme colours, UI labels, static options', 'Read once inside `nuxt.config.ts` only'],
                ['Hot reload in dev', 'On restart', 'Yes, via `updateAppConfig`', '—'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Anything under `runtimeConfig.public` ends up in the HTML payload and in your JS — visible to every visitor. Putting an API key there is the same as publishing it. Also never log or return the whole config object from an API route.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Variable not overriding? Check that (1) the key exists in `runtimeConfig` with a default (even an empty string), (2) the env name is exactly `NUXT_` + UPPER_SNAKE path (`NUXT_PUBLIC_API_BASE`, not `API_BASE`), and (3) the variable is set in the **runtime** environment of the process that serves requests, not only at build time.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Reserved keys (Nuxt 4.6+):** runtime config keys starting with `app` are reserved for Nuxt. `runtimeConfig.appSecret` (set via `NUXT_APP_SECRET`) is the framework-level secret used by built-in sealed sessions, and modules derive their own purpose-specific secrets from it. In development Nuxt generates one if none is set; production builds never do — set a long random value per environment and rotate it like any other secret.',
            },
            {
              type: 'heading',
              text: 'Build time vs runtime: the mistake that ships the wrong URL',
            },
            {
              type: 'p',
              text: 'Anything evaluated while `nuxt build` runs — `process.env.X` inside `nuxt.config.ts`, `app.config.ts`, a value hard-coded into a module option — is **frozen into the bundle**. If you build one Docker image and promote it from staging to production, those values stay at their staging settings. `runtimeConfig` keys, by contrast, are re-read from `NUXT_*` variables every time the server starts. Rule: "build once, deploy many" requires every environment-specific value to be a `runtimeConfig` key.',
            },
          ],
        },
        {
          id: 'error-handling',
          title: 'Error Handling: error.vue, createError, showError and NuxtErrorBoundary',
          summary:
            'Nuxt separates *fatal* errors (the whole page fails and `error.vue` is shown) from *local* ones (one component fails and `<NuxtErrorBoundary>` shows a fallback). `createError`, `showError` and `clearError` are the three verbs.',
          keyPoints: [
            '`error.vue` (in the app root, not in `pages/`) is the global error page. It receives an `error` prop with `statusCode`, `statusMessage` and `data`; use `clearError({ redirect: \'/\' })` to leave it.',
            '`throw createError({ statusCode: 404, statusMessage: \'...\', fatal: true })` in a page or composable shows the error page; `showError(...)` does the same imperatively (for example from an event handler).',
            '`<NuxtErrorBoundary @error="log">` catches errors in its slot (a widget) and renders its `#error` slot, keeping the rest of the page alive — Nuxt\'s version of an error boundary.',
            '`useFetch` / `useAsyncData` do **not** throw on failure: they set `error`. Decide whether to render a local message or escalate with `createError({ fatal: true })`.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    E["Something fails"] --> W{"Where?"}
    W -- "Page setup or middleware on server" --> F["createError fatal true"]
    W -- "Component render in a boundary" --> B["NuxtErrorBoundary shows its fallback"]
    W -- "Failed useFetch" --> D{"Data essential?"}
    D -- yes --> F
    D -- no --> L["Show a local message from error ref"]
    W -- "API route" --> A["createError 4xx or 5xx JSON response"]
    F --> EV["error.vue renders with real HTTP status"]
    W -- "Click handler" --> S["showError or toast"]
    S --> EV`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/error.vue',
              code: `<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)
const goHome = () => clearError({ redirect: '/' })   // clears the error state, then navigates
</script>

<template>
  <div class="error-page">
    <h1>{{ is404 ? 'Page not found' : 'Something went wrong' }}</h1>
    <p v-if="!is404">{{ error.statusMessage }}</p>
    <button @click="goHome">Back to the home page</button>
  </div>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'a local boundary around a flaky widget',
              code: `<template>
  <div>
    <h1>Dashboard</h1>

    <NuxtErrorBoundary @error="(e) => console.error('widget failed', e)">
      <RevenueChart />        <!-- if this throws, only this block is replaced -->
      <template #error="{ error, clearError }">
        <p>The chart is unavailable: {{ error.message }}</p>
        <button @click="clearError">Try again</button>
      </template>
    </NuxtErrorBoundary>

    <ActivityFeed />          <!-- keeps working -->
  </div>
</template>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'showError from an action',
              code: `<script setup lang="ts">
async function deleteAccount() {
  try {
    await $fetch('/api/account', { method: 'DELETE' })
    await navigateTo('/goodbye')
  } catch (e: any) {
    if (e.statusCode === 403) {
      showError({ statusCode: 403, statusMessage: 'You cannot delete this account' })
    } else {
      throw e
    }
  }
}
</script>`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/plugins/errors.ts — report every uncaught Vue error',
              code: `export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vue:error', (error, instance, info) => {
    reportToSentry(error, { info })     // your monitoring service
  })
})`,
            },
            {
              type: 'heading',
              text: 'Which status code does the user get?',
            },
            {
              type: 'p',
              text: 'When you throw `createError` during **server rendering**, Nuxt sends the HTML of `error.vue` with the **matching HTTP status** (404, 500). That matters for SEO: search engines should see a real 404, not a "200 OK" page that says "not found". For unknown URLs Nuxt already returns 404 when no page matches; a catch-all page (`[...slug].vue`) would instead *match* and you must throw the 404 yourself.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A `createError` thrown during **client-side navigation** without `fatal: true` is treated as non-fatal: the current page stays visible. If you want the error page, set `fatal: true` (or call `showError`). Also do not forget `error.vue` replaces the whole app, including the layout — import a layout component or wrap the markup yourself if you want your header on error pages.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'In production, Nuxt hides stack traces from visitors. Log the real error on the server (Nitro plugin on `error`, or an observability tool) and show a friendly message with a request id so users can quote it to support.',
            },
            {
              type: 'heading',
              text: 'status / statusText replace statusCode / statusMessage (Nuxt 4.3+)',
            },
            {
              type: 'p',
              text: 'Nuxt 4.3 deprecated the `statusCode` and `statusMessage` options of `createError` in favour of the web-standard names `status` and `statusText` (matching `Response`). The old names still work during the deprecation period, so existing code keeps running, but write new code with the new names and migrate when convenient. Note that `$fetch` errors (ofetch `FetchError`) expose both `status` and `statusCode`.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'old and new spelling',
              code: `// Nuxt 3 / early Nuxt 4 style (deprecated, still works)
throw createError({ statusCode: 404, statusMessage: 'Not Found' })

// Nuxt 4.3+ style
throw createError({ status: 404, statusText: 'Not Found', data: { slug } })`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '`statusText` travels in the HTTP status line and in the error page; keep it short and generic. Put structured details in `data` (Nuxt 4 parses `error.data` automatically) and never include internal messages, SQL or stack traces — anything you put in an error you throw from a server route is sent to the client.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Development got better too: since Nuxt 4.2 you see *your* `error.vue` together with a toggleable technical overlay (stack trace, source-mapped code frame), so you can design the user-facing page and debug the cause at the same time.',
            },
          ],
        },
        {
          id: 'authentication',
          title: 'Authentication Patterns: Cookies, Sessions and SSR-Safe Tokens',
          summary:
            'With SSR the *server* must know who the user is while rendering, so the credential has to travel in a **cookie** (which the browser sends automatically) rather than in `localStorage`. Use an httpOnly session cookie and expose the user through `useState`, or use `nuxt-auth-utils`.',
          keyPoints: [
            '**Why not `localStorage` tokens?** The server cannot read them, so SSR renders a logged-out page and the client then flips it (flash of wrong content, hydration mismatch). A **cookie** is sent with the very first request.',
            '`useCookie(\'name\')` is a reactive, SSR-friendly cookie ref (reads the request header on the server, `document.cookie` in the browser). An **httpOnly** cookie set from the server is *not* readable by browser JS (good for security) — so tell the client *who is logged in* through an API response or `useState`.',
            '**Session pattern:** login endpoint verifies the password and sets a signed/sealed httpOnly cookie; a `/api/me` endpoint (or a plugin) loads the user into `useState`; route middleware checks that state; every private API handler re-checks the session.',
            '`nuxt-auth-utils` implements that pattern: `setUserSession`, `requireUserSession`, `useUserSession()` and OAuth providers; `@sidebase/nuxt-auth` offers Auth.js-style providers.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Browser
    participant Server as Nuxt server
    participant DB as User store
    Browser->>Server: POST /api/login with email and password
    Server->>DB: find user and verify password hash
    DB-->>Server: user
    Server-->>Browser: Set-Cookie session httpOnly secure sameSite
    Browser->>Server: GET /dashboard with cookie
    Server->>Server: read session cookie during SSR
    Server-->>Browser: HTML already showing the logged-in user
    Note over Browser: hydration matches - no logged-out flash
    Browser->>Server: GET /api/orders with cookie automatically
    Server->>Server: requireUserSession in the handler`,
            },
            {
              type: 'heading',
              text: 'Using nuxt-auth-utils',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'setup',
              code: `npx nuxt module add auth-utils
# .env  (a long random string, at least 32 characters; never commit it)
NUXT_SESSION_PASSWORD=change-me-to-a-long-random-string-32-chars-min`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/auth/login.post.ts',
              code: `import { z } from 'zod'

const schema = z.object({ email: z.string().email(), password: z.string().min(8) })

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, schema.parse)

  const user = await findUserByEmail(email)          // your own server/utils function
  // verifyPassword is provided by nuxt-auth-utils (scrypt)
  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    // Same message for "no such user" and "wrong password" so attackers learn nothing
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  // Stores the user in a sealed (encrypted + signed) httpOnly cookie
  await setUserSession(event, { user: { id: user.id, name: user.name, role: user.role } })
  return { ok: true }
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/orders.get.ts — protect data, not just pages',
              code: `export default defineEventHandler(async (event) => {
  // Throws 401 automatically when there is no valid session
  const { user } = await requireUserSession(event)
  return await getOrdersFor(user.id)
})`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'app/pages/login.vue — login form and session-aware header',
              code: `<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession, clear } = useUserSession()
const form = reactive({ email: '', password: '' })
const error = ref('')

async function login() {
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: form })
    await refreshSession()                 // reload session state into the client
    await navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e.statusMessage ?? 'Login failed'
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })   // server calls clearUserSession(event)
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div v-if="loggedIn">Hello {{ user?.name }} <button @click="logout">Log out</button></div>
  <form v-else @submit.prevent="login">
    <input v-model="form.email" type="email" />
    <input v-model="form.password" type="password" />
    <p v-if="error">{{ error }}</p>
    <button>Log in</button>
  </form>
</template>`,
            },
            {
              type: 'heading',
              text: 'Doing it by hand: a cookie and a plugin',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/auth/login.post.ts (manual cookie)',
              code: `export default defineEventHandler(async (event) => {
  const user = await authenticate(await readBody(event))   // your own logic
  const token = await createSessionToken(user.id)           // e.g. signed JWT or random id stored server-side

  setCookie(event, 'session', token, {
    httpOnly: true,         // JavaScript in the page cannot read it (limits XSS damage)
    secure: true,           // only sent over HTTPS
    sameSite: 'lax',        // basic CSRF protection
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return { id: user.id, name: user.name }
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'app/plugins/auth.ts — load the user once per request',
              code: `export default defineNuxtPlugin(async () => {
  const user = useState<{ id: number; name: string } | null>('auth:user', () => null)

  // On the server, forward the visitor's cookie to our own API
  if (import.meta.server) {
    const requestFetch = useRequestFetch()
    user.value = await requestFetch('/api/auth/me').catch(() => null)
  }
  // In the browser the value comes from the payload, so no extra request on first load.
})`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Security checklist: httpOnly + secure + sameSite cookies; hash passwords with a slow algorithm (scrypt/argon2, never plain SHA); rate-limit login; validate input; **authorize on the server for every private endpoint**; and add CSRF protection if you use `sameSite: \'none\'` or accept cross-site form posts. Never store tokens in `localStorage` when XSS would expose them.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Authentication ("who are you?") is different from authorization ("what may you do?"). Keep roles/permissions in the session or look them up server-side per request, and write a small helper like `requireRole(event, \'admin\')` in `server/utils` so every handler uses the same check.',
            },
            {
              type: 'heading',
              text: 'Built-in sealed sessions (Nuxt 4.6+)',
            },
            {
              type: 'p',
              text: 'Nuxt 4.6 added a framework-level `useSession(event)` to `nuxt/server`. The session data is sealed (encrypted and signed, using iron) into a cookie with the `runtimeConfig.appSecret` key, so no server-side store is required. It is a primitive, not a full auth solution — no OAuth, password hashing or client composable — so `nuxt-auth-utils` remains the pragmatic choice for login flows; but for "remember this visitor\'s cart / preferences / CSRF state" the built-in session avoids an extra dependency.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/visits.get.ts',
              code: `import { defineEventHandler, useSession } from 'nuxt/server'

export default defineEventHandler(async (event) => {
  const session = await useSession<{ visits: number }>(event)
  await session.update(d => ({ visits: (d.visits ?? 0) + 1 }))
  return { visits: session.data.visits }
})`,
            },
            {
              type: 'table',
              headers: ['Approach', 'Where state lives', 'Revocation', 'Good for'],
              rows: [
                ['Sealed cookie session (`nuxt-auth-utils`, `useSession`)', 'Encrypted in the cookie (about 4 KB max)', 'Hard: valid until expiry unless you add a server-side denylist or version check', 'Most apps; simple, stateless, scales horizontally'],
                ['Session id + server store (Redis/DB)', 'Server; cookie holds only a random id', 'Easy: delete the record', 'Banking, admin tools, "log out everywhere"'],
                ['JWT in httpOnly cookie from an external IdP', 'Token claims, verified per request', 'Short expiry + refresh token rotation', 'SSO, many services sharing one identity provider'],
                ['Token in `localStorage`', 'Browser JS', '—', 'Avoid with SSR: invisible to the server and exposed to XSS'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never render pages that read the session on a shared cache route (`swr`, `isr`, `cache`, `prerender`). The first visitor\'s personalised HTML would be stored and served to everyone. Keep authenticated areas on plain SSR with `cache-control: private, no-store`, or render the shell from cache and load user-specific parts on the client.',
            },
          ],
        },
        {
          id: 'security-hardening',
          title: 'Security Hardening: XSS, CSRF, Headers, SSRF and Secrets',
          summary:
            'A full-stack framework gives you a full-stack attack surface. The main Nuxt-specific risks are XSS through `v-html` and the public payload, CSRF on cookie-authenticated endpoints, SSRF through server-side proxies, leaked secrets via `runtimeConfig.public`, and cached personal data.',
          keyPoints: [
            'Vue escapes interpolations, so XSS mostly enters via `v-html`, `innerHTML` in head scripts, URLs in `:href` (`javascript:`), and untrusted Markdown. Sanitize on the server and add a **Content Security Policy**.',
            'Cookie sessions need **CSRF** protection for state-changing requests: `sameSite: \'lax\'` (or `strict`) cookies, only mutate on POST/PUT/PATCH/DELETE, and check `Origin` or a CSRF token for anything cross-site.',
            'Security headers (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, frame protection) can be set with `routeRules.headers`, a Nitro plugin, or the community `nuxt-security` module.',
            'Server routes that fetch a user-supplied URL are an **SSRF** risk; allow-list hosts. Rate-limit login and expensive endpoints, and validate every input with a schema.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Threat', 'How it shows up in Nuxt', 'Mitigation'],
              rows: [
                ['XSS', '`v-html` with CMS content; JSON-LD built by string concatenation; `:href` from user input', 'Sanitize (e.g. DOMPurify on the server), `JSON.stringify` for JSON-LD, validate URL schemes, CSP'],
                ['Data exposure', 'Secrets under `runtimeConfig.public`; full user objects in the payload', 'Server-only config; DTOs that whitelist fields'],
                ['CSRF', 'Cookie-authenticated `POST /api/*` reachable from other sites', '`sameSite` cookies, origin checks, CSRF tokens, no GET mutations'],
                ['SSRF', '`/api/proxy?url=...` or image fetchers', 'Allow-list hosts, block private IP ranges, timeouts'],
                ['Broken access control', 'Only route middleware protects data', 'Check session and ownership in every handler'],
                ['Cache poisoning / leaks', 'Personalised responses on `swr`/`cache` routes', 'Cache only public data; `private, no-store` for user pages'],
                ['Brute force / abuse', 'Login, signup, search endpoints', 'Rate limiting at the edge or in Nitro middleware'],
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — baseline security headers with routeRules',
              code: `export default defineNuxtConfig({
  routeRules: {
    '/**': {
      headers: {
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'x-frame-options': 'DENY',
        'permissions-policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
    '/account/**': { headers: { 'cache-control': 'private, no-store' } },
  },
})`,
            },
            {
              type: 'p',
              text: '**Content Security Policy is harder with SSR than it looks**: Nuxt injects inline scripts (the payload, and in some setups hydration helpers), so a naive `script-src \'self\'` breaks the app. You need per-request **nonces** (or hashes for prerendered pages). This is the main reason teams adopt the community `nuxt-security` module, which generates nonces, sets the other headers with sensible defaults, and adds rate limiting, request size limits and an XSS validator. Whatever you choose, roll out CSP in `report-only` mode first and watch the reports.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/middleware/csrf-origin.ts — a simple origin check for mutations',
              code: `const SAFE = new Set(['GET', 'HEAD', 'OPTIONS'])

export default defineEventHandler((event) => {
  if (SAFE.has(event.method) || !event.path.startsWith('/api/')) return

  const origin = getHeader(event, 'origin')
  const host = getRequestHost(event, { xForwardedHost: true })
  // Browsers send Origin on cross-site POSTs; reject mismatches
  if (origin && new URL(origin).host !== host) {
    throw createError({ status: 403, statusText: 'Cross-site request blocked' })
  }
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/preview.get.ts — avoiding SSRF in a URL fetcher',
              code: `const ALLOWED_HOSTS = new Set(['images.example-cdn.com', 'api.partner.com'])

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)
  let target: URL
  try { target = new URL(String(url)) } catch {
    throw createError({ status: 400, statusText: 'Invalid URL' })
  }
  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
    throw createError({ status: 400, statusText: 'Host not allowed' })
  }
  return $fetch(target.toString(), { timeout: 5000 })
})`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '**The trust boundary is the server handler.** Route middleware, hidden buttons, TypeScript types and client-side validation are all UX. Every handler that reads or writes private data must authenticate, authorize (does *this* user own *this* order?), and validate input itself.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Keep dependencies patched: Nuxt publishes coordinated security releases (for example the July 2026 patch releases for Nuxt 4.5.1, Nuxt 3.21.10 and DevTools). Subscribe to the GitHub security advisories of `nuxt/nuxt` and your modules, run `npm audit` in CI, and never expose Nuxt DevTools or a dev server on a public network.',
            },
          ],
        },
        {
          id: 'performance',
          title: 'Performance: Lazy Hydration, Lazy Components, Images and Bundles',
          summary:
            'SSR gives a fast first paint, but the browser still has to download and run JavaScript to hydrate. Nuxt performance work is mostly about **sending less JS, hydrating later, loading images smartly and caching what you can**.',
          keyPoints: [
            '**Measure first:** Lighthouse/PageSpeed and the DevTools Network tab for load; `npx nuxt analyze` to visualise what is in your bundles; Nuxt DevTools for payload size and components.',
            '**Lazy components:** prefix with `Lazy` to split code; **lazy hydration** (`hydrate-on-visible`, `hydrate-on-idle`, `hydrate-on-interaction`, `hydrate-never`) delays the *activation* of server-rendered components until needed (Nuxt 3.16+ / 4).',
            '**Images** are usually the heaviest assets: `<NuxtImg>`/`<NuxtPicture>` from `@nuxt/image` resize, convert to WebP/AVIF, set `width/height` (prevents layout shift) and lazy-load.',
            '**Payload and caching:** `transform`/`pick` shrink the data embedded in the HTML; prerendered pages get a separate `_payload.json` (payload extraction); `routeRules` (prerender/swr) avoid re-rendering the same page for every visitor.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Think of a page load as three costs: **(1) download** bytes, **(2) execute** JavaScript, **(3) render** pixels. SSR helps (3) a lot — the HTML is already there — but it can make (1) and (2) *worse* because you ship both the HTML **and** the JS that re-creates it during hydration. The fixes below attack each cost.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Start["Component below the fold or rarely needed?"] --> Q1{"Needs JS interaction at all?"}
    Q1 -- "No, static content" --> Island["Server component island or hydrate-never"]
    Q1 -- yes --> Q2{"When is it needed?"}
    Q2 -- "When scrolled into view" --> V["LazyX with hydrate-on-visible"]
    Q2 -- "After the main thread is idle" --> I["LazyX with hydrate-on-idle"]
    Q2 -- "On first click or hover" --> X["LazyX with hydrate-on-interaction"]
    Q2 -- "Only on wide screens" --> M["LazyX with hydrate-on-media-query"]
    Q2 -- "Not rendered until a condition" --> W["LazyX with v-if so its code loads on demand"]
    Q2 -- "Needed immediately" --> N["Normal component - hydrate right away"]`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'lazy hydration',
              code: `<template>
  <HeroBanner />                                   <!-- critical: hydrates immediately -->

  <!-- Server-rendered HTML shown at once; its JS downloads and hydrates when scrolled into view -->
  <LazyReviewList hydrate-on-visible :product-id="id" />

  <!-- Hydrate when the browser is idle -->
  <LazyNewsletterForm hydrate-on-idle />

  <!-- Hydrate on first user interaction with this element -->
  <LazyChatWidget hydrate-on-interaction="click" />

  <!-- Wait for a condition / a delay -->
  <LazyRecommendations :hydrate-when="isDesktop" />
  <LazyPromoBanner :hydrate-after="3000" />

  <!-- Never hydrate: pure static HTML, no JS for it -->
  <LazyFooterLinks hydrate-never />
</template>`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Lazy hydration needs the `Lazy` prefix (so the component is split into its own chunk). With `hydrate-on-interaction` the triggering event is replayed once hydration finishes; with `hydrate-on-visible`, clicks made before the component scrolls into view do nothing — do not use it for something the user must interact with immediately.',
            },
            {
              type: 'heading',
              text: 'Images',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'NuxtImg and NuxtPicture',
              code: `<template>
  <!-- The main (LCP) image: resized and converted on demand, loaded early.
       width/height reserve space, so the layout does not jump. -->
  <NuxtImg
    src="/photos/hero.jpg"
    width="1200"
    height="600"
    format="webp"
    quality="80"
    sizes="100vw sm:50vw"
    alt="Mountain at sunrise"
    preload
  />

  <!-- Below the fold: lazy -->
  <NuxtImg src="/photos/team.jpg" width="400" height="300" loading="lazy" alt="Our team" />

  <!-- Several formats with fallback -->
  <NuxtPicture src="/photos/logo.png" format="avif,webp" alt="Logo" />
</template>`,
            },
            {
              type: 'heading',
              text: 'Find what is big',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'analyze the bundle',
              code: `npx nuxt analyze          # opens an interactive treemap of client and server bundles
# Look for: a huge date/charts library used on one page, duplicate dependencies,
# whole icon sets imported instead of single icons.`,
            },
            {
              type: 'table',
              headers: ['Symptom', 'Likely cause', 'Fix'],
              rows: [
                ['Slow first paint', 'Waiting on slow API during SSR', 'Cache with `routeRules` swr/prerender; make secondary data `lazy`'],
                ['Large HTML document', 'Huge payload (full API objects)', '`pick` / `transform`, paginate'],
                ['Page looks ready but is not clickable for seconds', 'Heavy hydration (too much JS)', 'Lazy hydration, `Lazy` components, remove big libraries, islands'],
                ['Layout jumps while loading', 'Images/fonts without size', '`NuxtImg` with width/height, `@nuxt/fonts`'],
                ['Big client bundle', 'Library imported on every page', '`npx nuxt analyze`; dynamic `import()` or `Lazy` component; swap for a lighter package'],
                ['Third-party scripts slow everything', 'Analytics, chat, ads loaded eagerly', '`@nuxt/scripts` to load on idle/interaction'],
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — a few cheap wins',
              code: `export default defineNuxtConfig({
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },  // hashed assets: cache forever
    '/': { prerender: true },
    '/blog/**': { swr: 3600 },
  },
  experimental: {
    // Payload extraction is on by default. 'client' (Nuxt 4.4+, experimental) inlines the
    // payload in the first HTML and caches _payload.json in memory on navigation;
    // it becomes the default under compatibilityVersion 5.
    payloadExtraction: 'client',
    extractAsyncDataHandlers: true,   // Nuxt 4.2+: move useAsyncData handlers into lazy chunks
    early404: true,                   // Nuxt 4.6+: skip app setup for URLs that match no page
  },
  nitro: { compressPublicAssets: true },   // pre-gzip/brotli static files
})`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`<NuxtLink>` already **prefetches** the next page\'s JavaScript when a link enters the viewport (and the data for prerendered pages with payload extraction), which makes later navigations feel instant. Disable per link with `:prefetch="false"` if you have hundreds of links.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do not optimise blindly. Hydration cost depends on how many components must be created and how much work they do on start. A big `useState`/`useFetch` payload costs *twice*: once in HTML bytes, once to parse. Remove what the browser never displays.',
            },
          ],
        },
        {
          id: 'nitro-caching',
          title: 'Caching with Nitro: Cached Handlers, routeRules and Storage',
          summary:
            'Nitro can cache whole responses (`defineCachedEventHandler`), single functions (`defineCachedFunction`) or whole routes (`routeRules`), using a pluggable storage layer (memory by default; Redis/KV in production) with stale-while-revalidate behaviour.',
          keyPoints: [
            '`defineCachedEventHandler(handler, { maxAge })` caches the full response for `maxAge` seconds; `swr: true` (default) serves a stale copy instantly while refreshing in the background.',
            '`defineCachedFunction(fn, { maxAge, getKey })` caches an expensive function result (a slow SQL query, a third-party API call) by key, not a whole response.',
            '`routeRules: { \'/api/stats\': { cache: { maxAge: 60 } }, \'/blog/**\': { swr: 600 } }` sets caching per route pattern from the config without touching handler code.',
            'Cached data lives in Nitro\'s **storage layer** (`useStorage`), which defaults to in-memory *per server instance*. For several instances or serverless, mount a shared driver such as Redis.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**Stale-while-revalidate (SWR)** is like a newspaper stand: if you ask for today\'s paper and the stand has yesterday\'s copy, you are handed that one immediately, and someone is sent to fetch the new edition for the next customer. Users never wait for the slow work, at the price of being a little behind.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant User
    participant Nitro as Nitro cached handler
    participant Store as Storage
    participant Src as Slow source
    User->>Nitro: request 1
    Nitro->>Store: lookup key
    Store-->>Nitro: nothing
    Nitro->>Src: compute
    Src-->>Nitro: result
    Nitro->>Store: save with timestamp
    Nitro-->>User: fresh result
    User->>Nitro: request 2 within maxAge
    Nitro-->>User: cached result immediately
    User->>Nitro: request 3 after maxAge
    Nitro-->>User: stale result immediately
    Nitro->>Src: recompute in background
    Nitro->>Store: replace entry`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/stats.get.ts — cache a whole response',
              code: `export default defineCachedEventHandler(async (event) => {
  // This slow query runs at most once per minute (plus background refreshes)
  const rows = await runExpensiveReportQuery()
  return { generatedAt: new Date().toISOString(), rows }
}, {
  maxAge: 60,                  // fresh for 60 seconds
  swr: true,                   // after that, serve stale while refreshing (default)
  staleMaxAge: 60 * 10,        // never serve data staler than 10 minutes
  name: 'stats',
  getKey: event => getRequestURL(event).pathname + getRequestURL(event).search,  // include query in the key
  // varies: ['accept-language'],  // add headers that change the response so users do not share the wrong copy
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/utils/weather.ts — cache one function',
              code: `export const getWeather = defineCachedFunction(
  async (city: string) => {
    return await $fetch(\`https://api.example.com/weather?city=\${encodeURIComponent(city)}\`)
  },
  {
    maxAge: 60 * 15,
    name: 'weather',
    getKey: (city: string) => city.toLowerCase(),   // one cache entry per city
  },
)`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — rules, and a shared Redis cache',
              code: `export default defineNuxtConfig({
  routeRules: {
    '/api/stats': { cache: { maxAge: 60 } },       // cache an API route without editing it
    '/blog/**': { swr: 600 },                      // cache rendered pages
    '/docs/**': { prerender: true },
  },

  nitro: {
    storage: {
      // Replace the in-memory "cache" mount with Redis so all instances share it
      cache: {
        driver: 'redis',
        // CAREFUL: process.env here is read at BUILD time and baked into the output.
        // For "build once, deploy many", mount the driver at runtime in a Nitro plugin
        // (useStorage().mount('cache', redisDriver({ url: useRuntimeConfig().redisUrl })))
        url: process.env.REDIS_URL,
      },
    },
    devStorage: {
      cache: { driver: 'fs', base: './.data/cache' }, // simple file cache while developing
    },
  },
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'server/api/posts.post.ts — invalidate after a write',
              code: `export default defineEventHandler(async (event) => {
  const post = await createPost(await readBody(event))

  // Cached entries live under keys prefixed with nitro:handlers / nitro:functions
  const storage = useStorage('cache')
  const keys = await storage.getKeys('nitro:handlers:stats')
  await Promise.all(keys.map(k => storage.removeItem(k)))

  return post
})`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Cache **only data that is the same for everyone**. A cached handler that reads the session cookie and returns "my orders" would serve the first user\'s orders to the next visitor. For per-user responses, either do not cache, or include the user in the key and the `varies` list. Also remember cached **pages** (`swr`/`isr`) are shared: never render personal data on them — fetch it on the client after hydration.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'There are three layers you can combine: **browser** (HTTP headers like `Cache-Control`), **CDN** (`s-maxage` and `stale-while-revalidate`, which `swr`/`isr` route rules emit), and **Nitro storage** (the server-side cache described here). Decide which layer should hold each piece of data and how it is invalidated.',
            },
            {
              type: 'heading',
              text: 'Production caching pitfalls',
            },
            {
              type: 'table',
              headers: ['Pitfall', 'What happens', 'Prevention'],
              rows: [
                ['Cache stampede', 'An entry expires under heavy load and hundreds of requests recompute it at once', 'Keep `swr: true` so only a background refresh recomputes; Nitro also de-duplicates concurrent resolutions of the same key within one instance'],
                ['Per-instance memory cache', 'Each of 10 pods has its own copy; users see different data depending on the pod; invalidation hits only one', 'Shared driver (Redis, Cloudflare KV) for anything you invalidate'],
                ['Serverless memory', 'Cache vanishes on every cold start, hit ratio near zero', 'Use the platform KV/CDN (`isr`) or a remote store'],
                ['Missing `varies` / key parts', 'English page served to French users; page 1 served for `?page=2`', 'Put every input that changes the output into `getKey` or `varies`'],
                ['Caching errors', 'A transient 500 from upstream is cached for an hour', 'Throw instead of returning error objects; use `shouldBypassCache` / `shouldInvalidateCache` for special cases'],
                ['Unbounded keys', 'Free-text search terms create millions of entries and exhaust Redis memory', 'Normalise keys, cap length, set TTLs, do not cache long-tail queries'],
              ],
            },
          ],
        },
        {
          id: 'deployment',
          title: 'Deployment: Node, Static, Serverless, Edge and Docker',
          summary:
            'Because Nitro compiles your app for a target (a *preset*), the same Nuxt project can run as a Node server, as static files on a CDN, on serverless platforms, or at the edge — choose by how much server rendering you need.',
          keyPoints: [
            '`nuxt build` outputs `.output/`. A Node server runs with `node .output/server/index.mjs` (configure with `PORT`/`HOST`). `nuxt generate` (static preset) outputs plain HTML/JS/CSS to `.output/public` that any static host can serve.',
            'Platforms like **Vercel, Netlify and Cloudflare Pages** are auto-detected during their builds; you can force a target with `NITRO_PRESET=<name>` or `nitro: { preset }`.',
            '**Static hosting cannot run server code or SSR on demand** — pages must be prerendered, and `server/api` endpoints will not exist unless you deploy them elsewhere. Pick a server/serverless target if you need SSR or an API.',
            '**Docker**: build in one stage, copy just `.output` to a slim runtime image, pass secrets as `NUXT_*` environment variables at start.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TD
    Q["Deploy decision"] --> A{"Need server code, SSR on request or API routes?"}
    A -- no --> S["Static: nuxt generate to any CDN or static host"]
    A -- yes --> B{"Where should it run?"}
    B -- "My own server or container" --> N["node-server preset plus Docker or PM2"]
    B -- "Managed serverless" --> SV["vercel, netlify, aws-lambda presets"]
    B -- "Edge close to users" --> E["cloudflare-module, cloudflare-pages, deno-deploy presets"]
    SV --> I["ISR and swr route rules supported by platform CDN"]
    E --> L["Limited Node APIs: choose edge-friendly libraries"]`,
            },
            {
              type: 'table',
              headers: ['Target', 'SSR', 'Server API', 'Notes'],
              rows: [
                ['**Static** (`nuxt generate`)', 'At build time only', 'No', 'Cheapest and fastest; rebuild to update content; use client fetch for live data'],
                ['**Node server** (`node-server`)', 'Per request', 'Yes', 'Full control; run behind Nginx; scale with multiple processes/containers'],
                ['**Vercel / Netlify**', 'Per request in serverless functions', 'Yes', 'Zero-config deploys from git, ISR support; watch cold starts and function time limits'],
                ['**Cloudflare Pages/Workers**', 'At the edge', 'Yes (Workers runtime)', 'Very low latency; no full Node (`fs`, native modules); use KV/D1 for storage'],
                ['**AWS Lambda / others**', 'Serverless', 'Yes', 'Presets exist for most providers'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'common commands',
              code: `# Node server
npm run build
PORT=8080 HOST=0.0.0.0 node .output/server/index.mjs

# Static site
npm run generate           # -> .output/public (upload to S3, GitHub Pages, Netlify, ...)

# Force a preset
NITRO_PRESET=cloudflare-pages npm run build
NITRO_PRESET=static npm run build`,
            },
            {
              type: 'code',
              language: 'dockerfile',
              title: 'Dockerfile — multi-stage build',
              code: `# --- build stage: needs dev dependencies ---
# Use an active LTS Node; recent Nuxt tooling requires a current Node 22.x/24.x or newer
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime stage: only the self-contained output ---
FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
EXPOSE 3000
USER node
CMD ["node", ".output/server/index.mjs"]

# Run with secrets supplied at start time, not baked into the image:
#   docker run -p 3000:3000 -e NUXT_SESSION_PASSWORD=... -e NUXT_PUBLIC_API_BASE=https://api.example.com my-nuxt`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — presets and prerender',
              code: `export default defineNuxtConfig({
  nitro: {
    preset: 'node-server',            // usually auto-detected on hosting platforms
    prerender: {
      crawlLinks: true,               // follow links starting from routes below
      routes: ['/', '/sitemap.xml', '/pricing'],
      failOnError: false,
    },
  },
})`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '"It works locally but the API returns 404 in production" on a static host: `nuxt generate` does not include `server/api`. "It works locally but env vars are empty": `.env` is not read by the built server — set real environment variables on the host. "Page URLs 404 on refresh": a static SPA needs a rewrite of all routes to `index.html` (or use prerendering).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Always run `npm run build && npm run preview` before shipping: it starts the production build locally, which catches problems that the dev server hides (missing env vars, server-only code leaking to the client, hydration differences, prerender failures).',
            },
          ],
        },
        {
          id: 'testing-and-devtools',
          title: 'Testing (Vitest, Test Utils, Playwright) and Nuxt DevTools',
          summary:
            '`@nuxt/test-utils` lets Vitest run tests inside a real Nuxt environment (auto-imports, `useFetch`, `useState`) and boot the whole app for end-to-end checks; Playwright covers real browser flows; Nuxt DevTools helps you inspect the running app.',
          keyPoints: [
            '**Unit/component tests:** Vitest with `environment: \'nuxt\'`; `mountSuspended(Component)` mounts with Nuxt context and async setup; `registerEndpoint` fakes API routes; `mockNuxtImport` replaces an auto-imported composable.',
            '**E2E tests:** `setup({ rootDir })` builds and starts the app for the test file; `$fetch(\'/\')` returns server-rendered HTML — great for checking SSR output and server routes. For full browser flows use Playwright (also via `@nuxt/test-utils/playwright`).',
            'Test **pure logic as plain functions** (in `utils/`, `server/utils/`) with ordinary Vitest — fast and no Nuxt environment needed.',
            '**Nuxt DevTools** (`devtools: { enabled: true }`, toggle with Shift+Alt+D in the browser) shows pages, components, auto-imports, payload, server routes, modules, a timeline and lets you open files in your editor.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Pyramid["Testing layers - many at the bottom"]
      direction TB
      U["Pure functions and server utils: plain Vitest - fastest"]
      C["Components and composables: Vitest with nuxt environment and mountSuspended"]
      S["Server routes and SSR HTML: test-utils e2e setup with fetch"]
      B["Real user flows in a browser: Playwright - slowest"]
    end
    U --> C --> S --> B`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'install',
              code: `npm i -D @nuxt/test-utils vitest @vue/test-utils happy-dom playwright-core`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'vitest.config.ts',
              code: `import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',                 // run tests inside a Nuxt runtime
    environmentOptions: { nuxt: { domEnvironment: 'happy-dom' } },
  },
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'tests/ProductList.nuxt.test.ts — component test',
              code: `import { describe, it, expect } from 'vitest'
import { mountSuspended, registerEndpoint, mockNuxtImport } from '@nuxt/test-utils/runtime'
import ProductList from '~/components/ProductList.vue'

// Fake the API the component calls with useFetch('/api/products')
registerEndpoint('/api/products', () => [
  { id: 1, name: 'Running shoe', price: 8000 },
  { id: 2, name: 'Sandal', price: 3000 },
])

// Replace an auto-imported composable for this test file
mockNuxtImport('useUserSession', () => () => ({ loggedIn: { value: true }, user: { value: { name: 'Asha' } } }))

describe('ProductList', () => {
  it('renders products fetched from the API', async () => {
    const wrapper = await mountSuspended(ProductList)   // waits for async setup (useFetch)
    expect(wrapper.text()).toContain('Running shoe')
    expect(wrapper.findAll('li')).toHaveLength(2)
  })
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'tests/ssr.e2e.test.ts — server-rendered output and API',
              code: `import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('SSR', async () => {
  await setup({ rootDir: fileURLToPath(new URL('..', import.meta.url)) })   // builds and starts the app

  it('puts content in the first HTML response (good for SEO)', async () => {
    const html = await $fetch<string>('/posts/1')
    expect(html).toContain('<h1>Hello Nuxt</h1>')
    expect(html).toContain('og:title')
  })

  it('validates POST bodies', async () => {
    await expect($fetch('/api/posts', { method: 'POST', body: { title: 'x' } })).rejects.toThrow()
  })
})`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'tests/e2e/login.spec.ts — Playwright',
              code: `import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({ nuxt: { rootDir: fileURLToPath(new URL('../..', import.meta.url)) } })

test('user can log in and see the dashboard', async ({ page, goto }) => {
  await goto('/login', { waitUntil: 'hydration' })      // wait until Vue has hydrated, so clicks work
  await page.getByLabel('Email').fill('asha@example.com')
  await page.getByLabel('Password').fill('correct-horse-battery')
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('Hello Asha')).toBeVisible()
})`,
            },
            {
              type: 'heading',
              text: 'Nuxt DevTools',
            },
            {
              type: 'list',
              items: [
                '**Pages / Components / Imports tabs:** see the generated route table, where each component and auto-import comes from.',
                '**Payload tab:** inspect exactly what `useAsyncData`, `useState` and Pinia sent to the browser — the quickest way to spot huge payloads.',
                '**Server Routes tab:** call your `server/api` endpoints from the UI.',
                '**Timeline and Hooks tabs:** where time goes during setup and navigation; **Modules tab:** installed modules and quick-add of new ones.',
                '**Open in editor:** click a component in the page overlay to jump to its source.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Other everyday commands: `npx nuxt typecheck` (run vue-tsc over the project), `npx nuxt cleanup` (delete `.nuxt/` and caches when things get weird), `npx nuxt info` (versions for bug reports) and `npx nuxt prepare` (regenerate types). Newer additions: `nuxt build --profile` (Nuxt 4.4+, writes a Chrome trace and CPU profile of the build), `nuxt typecheck --checker=vue-tsc|golar` (4.5+), and in Nuxt CLI v4 `nuxt curl` (request a route of the running dev server) and `nuxt docs "<query>"`.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'When testing a component that uses `useFetch`, mounting it with plain `@vue/test-utils` `mount()` fails because there is no Nuxt context or async handling. Use `mountSuspended` and `registerEndpoint` instead of hand-mocking `fetch` globally.',
            },
            {
              type: 'heading',
              text: 'Keep the Nuxt environment for tests that need it',
            },
            {
              type: 'p',
              text: 'Booting a Nuxt environment costs time per test file. A common production setup uses **two Vitest projects**: a plain `node` project for pure functions and server utils (fast, the majority of tests), and a `nuxt` project only for files that mount components or call composables (by convention named `*.nuxt.test.ts` or kept in `test/nuxt/`). `@nuxt/test-utils` documents this split with `defineVitestProject`; check the version you install for the exact helper names.',
            },
            {
              type: 'list',
              items: [
                '**Test SSR output, not just client behaviour:** an e2e `$fetch(\'/page\')` assertion catches content that accidentally became client-only (and thus invisible to crawlers).',
                '**Test hydration:** in Playwright, `goto(url, { waitUntil: \'hydration\' })` and fail the test on console messages containing "Hydration".',
                '**Test cross-request isolation:** fire two concurrent requests as different users in an e2e test and assert neither response contains the other\'s data — the cheapest guard against module-level state bugs.',
                '**Test the production build in CI** (`nuxt build` then `nuxt preview`), because the dev server hides prerender errors, missing env vars and import-protection issues.',
              ],
            },
          ],
        },
        {
          id: 'migration',
          title: 'Migrating: Nuxt 2 to 3 and Nuxt 3 to 4',
          summary:
            'Nuxt 2 to 3 is a real rewrite of the code you write (Vue 2 to 3, new data fetching, Pinia, Vite). Nuxt 3 to 4 is a much gentler upgrade: a new `app/` folder, stricter data-fetching defaults and better TypeScript, with codemods to help.',
          keyPoints: [
            '**Nuxt 2 to 3:** Vue 2 to Vue 3, Webpack to Vite, `asyncData`/`fetch()` hooks to `useAsyncData`/`useFetch`, Vuex `store/` to Pinia, `head()` to `useHead`, `serverMiddleware` to `server/`, `this.$axios` to `$fetch`, and `nuxt.config.js` to `nuxt.config.ts`.',
            '**Nuxt 3 to 4:** `npx nuxt upgrade --dedupe`, move app code into `app/`, adapt to data-fetching changes (`undefined` defaults, shallow `data`, shared keys), and review TypeScript project separation. You can try changes in Nuxt 3 first with `future: { compatibilityVersion: 4 }`.',
            'An incremental path for large Nuxt 2 apps: **Nuxt Bridge** (Nuxt 2 with Nuxt 3 features) to move gradually; Nuxt 2 reached end-of-life on June 30, 2024, so a still-running Nuxt 2 app should go straight to Nuxt 4 rather than stopping at 3.',
            '**Support status:** Nuxt 3 reached end-of-life on **July 31, 2026** — no more security fixes from the core team. Any Nuxt 3 app still in production is now a security liability; upgrading to Nuxt 4 is the priority, and the next topic covers preparing for Nuxt 5.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    N2["Nuxt 2 - Vue 2, Webpack, Vuex"] --> Br["Nuxt Bridge - optional stepping stone"]
    N2 --> N3["Nuxt 3 - Vue 3, Vite, Nitro, Composition API"]
    Br --> N3
    N3 --> Flag["future compatibilityVersion 4 - try Nuxt 4 behaviour"]
    Flag --> N4["Nuxt 4 - app directory, stricter data fetching"]
    N3 --> N4`,
            },
            {
              type: 'heading',
              text: 'Nuxt 2 to Nuxt 3: the main code changes',
            },
            {
              type: 'code',
              language: 'vue',
              title: 'Nuxt 2 (Options API, Vue 2)',
              code: `<script>
export default {
  async asyncData({ $axios, params }) {
    const post = await $axios.$get(\`/api/posts/\${params.id}\`)
    return { post }
  },
  head() {
    return { title: this.post.title }
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>`,
            },
            {
              type: 'code',
              language: 'vue',
              title: 'Nuxt 3/4 (Composition API)',
              code: `<script setup lang="ts">
const route = useRoute()
const { data: post } = await useFetch(\`/api/posts/\${route.params.id}\`)
const userStore = useUserStore()        // Pinia replaces Vuex mapState

useHead({ title: () => post.value?.title })
</script>`,
            },
            {
              type: 'table',
              headers: ['Nuxt 2', 'Nuxt 3 / 4'],
              rows: [
                ['`asyncData`, `fetch()` hooks', '`useAsyncData`, `useFetch`'],
                ['`this.$axios`, `$http`', '`$fetch` (ofetch)'],
                ['Vuex `store/` folder', 'Pinia (`@pinia/nuxt`) or `useState`'],
                ['`<nuxt-link>`, `<nuxt-child>`', '`<NuxtLink>`, `<NuxtPage>`'],
                ['`head()` option', '`useHead`, `useSeoMeta`'],
                ['`serverMiddleware`', '`server/api`, `server/middleware` (Nitro)'],
                ['`middleware/` with context `{ redirect }`', '`defineNuxtRouteMiddleware` returning `navigateTo()`'],
                ['`process.client`, `process.server`', '`import.meta.client`, `import.meta.server`'],
                ['`nuxt.config.js`, `modules` for Vue 2', '`nuxt.config.ts` and Nuxt 3 compatible modules (check each)'],
                ['`mixins`, `Vue.filter`, `Vue.use`', 'composables, plain functions, plugins with `vueApp.use`'],
              ],
            },
            {
              type: 'heading',
              text: 'Nuxt 3 to Nuxt 4',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'upgrade steps',
              code: `# 1. Upgrade the framework
npx nuxt upgrade --dedupe

# 2. Run the automated codemods (moves files into app/, updates APIs)
npx codemod@latest nuxt/4/migration-recipe

# 3. Check types and run tests
npx nuxt typecheck
npm test`,
            },
            {
              type: 'table',
              headers: ['Area', 'What changes in Nuxt 4'],
              rows: [
                ['Directory layout', 'App code lives in `app/`; `~` points to it; `server/`, `public/`, `modules/`, `shared/` stay at the root'],
                ['Data fetching', '`data`/`error` default to `undefined`; `data` is a shallowRef; calls with the same key share state; reactive keys; `dedupe` cancels the older request'],
                ['TypeScript', 'Separate TS projects for app, server, shared and config (better types in each context)'],
                ['`shared/` folder', 'New place for code, types and utils imported by both app and server'],
                ['Defaults', 'Several experimental features became defaults (check the upgrade guide for your version)'],
                ['Head management', 'Unhead v2: `hid`, `vmid`, `children` and `body` props removed, promise inputs unsupported, Capo-style tag sorting on by default'],
                ['Component names', 'Normalised to the Nuxt naming pattern (`SomeFolderMyComponent`) — update `<KeepAlive include>` lists and `findComponent` in tests'],
                ['Misc', '`window.__NUXT__` removed (use `useNuxtApp().payload`); top-level `generate` config removed (use `nitro.prerender`); `route.meta.name` moved to `route.name`; layer modules load before project modules'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Upgrade in small steps: first update dependencies and modules, get the build and tests green, *then* move folders. Keep the `app/` move in its own commit so history stays readable, and upgrade modules to versions that support Nuxt 4 before the framework itself.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The Nuxt 2 to 3 migration is not a find-and-replace: mixed Options/Composition code, Vue 2 libraries (Vuetify 2, many plugins) and Webpack-specific config all need decisions. For big apps, budget for it as a project and consider the Bridge route, or a gradual rewrite page by page.',
            },
          ],
        },
        {
          id: 'preparing-for-nuxt-5',
          title: 'Preparing for Nuxt 5: Nitro v3, h3 v2 and compatibilityVersion 5',
          summary:
            'Nuxt 5 is being delivered incrementally inside Nuxt 4.x: most of its breaking changes are already available behind flags, and `future: { compatibilityVersion: 5 }` turns them on together. The headline change no flag can fully emulate is the move to Nitro v3 and h3 v2 — which is what the new `nuxt/server` imports prepare you for.',
          keyPoints: [
            'As of October 2026, Nuxt 4 is the current major; Nuxt 4.5 and 4.6 shipped "groundwork for Nuxt 5" (Vite 8, unhead v3, unctx v3, `nuxt/server`). Nuxt 5 itself was originally planned for early 2026 and has not yet had a stable release at the time of writing — check nuxt.com before planning dates.',
            '`future.compatibilityVersion: 5` (available since 4.2, for testing) enables, among others: case-sensitive routing, the Vite Environment API, typed pages, serializable page meta, opt-in server auto-imports, Options API removed from the client bundle by default, PostCSS defaults off, `payloadExtraction: \'client\'` and the shared builder watcher.',
            'Server code is the biggest migration: Nitro v3 and h3 v2 move to a web-standard event (`event.req` is a `Request`). Writing handlers against `nuxt/server` (Nuxt 4.6+) makes them work on both versions today.',
            'Strategy: upgrade to the latest 4.x, enable the v5 flag in a branch, fix what breaks, and keep individual flags off only where you have a documented reason.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The Nuxt team learned from the painful Nuxt 2 to 3 migration. Instead of one big-bang release, breaking changes now land early as opt-in flags, are bundled under a `compatibilityVersion`, and then flip to defaults in the next major. Nuxt 4 itself was previewed this way (`compatibilityVersion: 4` on Nuxt 3). For a team this means you can do the Nuxt 5 work **now**, in small pull requests, while still on a supported Nuxt 4 release.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'nuxt.config.ts — trying Nuxt 5 behaviour on Nuxt 4',
              code: `export default defineNuxtConfig({
  future: {
    compatibilityVersion: 5,      // opt into upcoming breaking changes (testing)
  },
  experimental: {
    // individual flags can still be toggled; e.g. keep server auto-imports while migrating
    // (check the upgrade guide for the exact flag names in your version)
  },
})`,
            },
            {
              type: 'table',
              headers: ['Change under v5', 'What breaks', 'What to do now'],
              rows: [
                ['Case-sensitive routing', 'Links or bookmarks with different casing (`/About`)', 'Normalise links; add redirects for old casings via `routeRules`'],
                ['Server auto-imports opt-in', 'Server files relying on implicit `defineEventHandler`, `useStorage`, your `server/utils`', 'Add explicit imports — ideally from `nuxt/server`'],
                ['Options API off in the client bundle by default', 'Components or libraries still written with `data()`/`methods`', 'Migrate to `<script setup>`, or re-enable the Options API explicitly'],
                ['Typed pages', 'Type errors on `navigateTo` with unknown route names', 'Fix the links; they were bugs'],
                ['Serializable page meta', 'Functions or non-serializable values in `definePageMeta`', 'Move logic into middleware; keep meta to plain data'],
                ['PostCSS defaults off', 'Styles that relied on default autoprefixing/nesting', 'Configure PostCSS plugins explicitly'],
                ['Nitro v3 / h3 v2 (Nuxt 5 itself)', 'Direct `h3`/`nitropack` imports, Node-only `event.node.req` usage', 'Use `nuxt/server` helpers and web-standard `event.req` / `event.url`'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["Nuxt 3 app<br/>EOL July 2026"] --> B["Nuxt 4 latest<br/>codemods + app dir"]
    B --> C["Enable compatibilityVersion 5<br/>in a branch"]
    C --> D["Fix breakages flag by flag<br/>adopt nuxt/server imports"]
    D --> E["Nuxt 5 stable<br/>Nitro v3 + h3 v2"]`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'h3 v1 style vs portable style',
              code: `// Before: Node-specific, tied to h3 v1
export default defineEventHandler((event) => {
  const ua = event.node.req.headers['user-agent']
  return { ua }
})

// After: portable (Nuxt 4.6+), runs on Nitro v2 today and v3 tomorrow
import { defineEventHandler } from 'nuxt/server'

export default defineEventHandler((event) => {
  const ua = event.req.headers.get('user-agent')
  return { ua, path: event.url.pathname }
})`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The `compatibilityVersion: 5` flag is meant for **testing and preparation**; the set of changes can still move before Nuxt 5 is final. Pin your Nuxt minor version, read the release notes of each 4.x minor, and re-run your end-to-end suite whenever you flip a flag.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Modules are the usual upgrade blocker, not your own code. Before a major, list every module, check that it supports the target major (and, for server-side modules, Nitro v3), and replace abandoned ones. Module authors can detect the server stack with `getNitroVersion()` / `hasNitroVersion()` from `@nuxt/kit` and register per-version handlers with `addServerHandler`.',
            },
          ],
        },
        {
          id: 'when-not-to-use-nuxt',
          title: 'When NOT to Use Nuxt: Honest Trade-offs vs Vue + Vite, Next.js, SvelteKit and Astro',
          summary:
            'Nuxt is excellent for public, SEO-sensitive, content-and-data-driven Vue apps. It adds real complexity (server runtime, hydration, caching) that is wasted on small widgets, internal tools or sites with no server-side needs.',
          keyPoints: [
            '**Use Nuxt when** you need SEO/link previews, fast first paint, per-route rendering choices, a built-in backend-for-frontend, or just want a conventional structure for a team of Vue developers.',
            '**Skip it (use Vue + Vite)** for a login-only internal dashboard, an embedded widget or an app added to an existing server-rendered site: a SPA is simpler to build, debug and host.',
            '**Choose another framework** when your team is already on React (Next.js), when bundle size is the priority (SvelteKit), or when the site is mostly static content with a few interactive islands (Astro).',
            'Real costs of Nuxt: you must understand SSR pitfalls (hydration mismatches, per-request state, browser-only APIs), you often need a Node/edge runtime, and major-version upgrades move modules and conventions.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TD
    S["New project"] --> Q1{"Public pages that need SEO or link previews?"}
    Q1 -- no --> V["Vue + Vite SPA"]
    Q1 -- yes --> Q3{"Team and ecosystem"}
    Q3 -- "Vue team" --> Q4{"Mostly static content with few interactions?"}
    Q4 -- yes --> A["Astro with Vue islands or Nuxt prerender"]
    Q4 -- no --> NX["Nuxt"]
    Q3 -- "React team" --> NJ["Next.js"]
    Q3 -- "Free to choose, tiny bundles matter" --> SK["SvelteKit"]`,
            },
            {
              type: 'table',
              headers: ['', 'Vue + Vite (SPA)', 'Nuxt', 'Next.js', 'SvelteKit', 'Astro'],
              rows: [
                ['UI library', 'Vue', 'Vue', 'React', 'Svelte', 'Any (Vue, React, Svelte...) or none'],
                ['Strength', 'Simplicity, tiny mental model', 'Conventions, full-stack Vue, hybrid rendering, modules', 'Largest ecosystem and hiring pool, React Server Components', 'Small bundles, simple reactivity, fast', 'Content sites: ships almost zero JS by default'],
                ['SEO / SSR', 'Needs extra work', 'Built in', 'Built in', 'Built in', 'Built in (static-first)'],
                ['Backend in the same project', 'No', 'Yes (Nitro)', 'Yes (route handlers, server actions)', 'Yes (endpoints, form actions)', 'Limited (endpoints, SSR adapters)'],
                ['Typical weak spot', 'SEO, structure left to you', 'SSR gotchas, module quality varies, smaller ecosystem than React', 'Frequent paradigm shifts, caching complexity, tied to React', 'Smaller ecosystem and talent pool', 'Not ideal for highly interactive app-like UIs'],
                ['Best fit', 'Dashboards, widgets, prototypes', 'Marketing + app hybrids, e-commerce, blogs, docs, SaaS front ends in Vue', 'Large React apps and teams', 'Performance-focused apps, small teams', 'Docs, blogs, marketing, portfolios'],
              ],
            },
            {
              type: 'heading',
              text: 'Real downsides to weigh',
            },
            {
              type: 'list',
              items: [
                '**Hydration cost:** the browser still downloads and runs the JS that rebuilds the page. A static-first tool (Astro) or islands can be lighter for content pages.',
                '**SSR needs a runtime** (or prerendering). That means servers or serverless functions to pay for, monitor and secure; pure SPAs are just files on a CDN.',
                '**Debugging two environments:** a bug may exist only on the server (no `window`), only in hydration, or only after navigation.',
                '**"Magic" conventions:** auto-imports and file-based routing speed you up but hide where things come from; new developers need to learn the rules.',
                '**Module dependency risk:** a small module that stops being maintained can block an upgrade; keep your module list short.',
                '**You can still do plain SPA in Nuxt** (`ssr: false`), so choosing Nuxt early is not a trap — but then much of its value is unused.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'There is no universally "best" framework. A good decision is based on **your team\'s skills, SEO needs, hosting constraints and how much interactivity pages have**, not on benchmark screenshots. If you already know Vue and the site is public, Nuxt is the default sensible choice; otherwise start from the simplest tool that meets your requirements and add SSR only when the need appears.',
            },
          ],
        },
      ],
    },
    {
      id: 'nuxt-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary:
            'Frequently asked Nuxt interview questions, with answers that explain the reasoning — rendering modes, hydration, data fetching, state, Nitro, middleware, and the trade-offs behind Nuxt\'s conventions.',
          qa: [
            {
              question: 'What is Nuxt and what problem does it solve over plain Vue?',
              answer:
                'Nuxt is a full-stack framework on top of Vue. Plain Vue (with Vite) is a UI library that, by default, builds the page in the browser: the server sends an almost empty HTML file and a JavaScript bundle. That hurts first paint and SEO (crawlers and link-preview bots may not run your JS). Nuxt adds server-side rendering and prerendering, file-based routing, auto-imports, data-fetching helpers that work on both server and client, a built-in server (Nitro) for API routes, and deployment presets. It also fixes a project structure, which makes teams more consistent. The price is extra complexity: you have to understand SSR, hydration and server/client differences.',
            },
            {
              question: 'Explain SSR, SSG, CSR and ISR/SWR. When would you pick each in Nuxt?',
              answer:
                'They differ in *when and where the HTML is produced*. **CSR** builds it in the browser (`ssr: false`): fine for logged-in dashboards with no SEO need. **SSR** builds it on the server for every request: right for content that is personalised or changes constantly and must be indexed. **SSG/prerender** builds it once at build time and serves files from a CDN: fastest and cheapest for content that rarely changes (marketing pages, docs). **ISR/SWR** serves a cached page and regenerates it in the background after a time window: great for catalogues and news where a few minutes of staleness is fine. In Nuxt you do not choose one for the whole app: `routeRules` assigns a mode per route pattern (`\'/\': { prerender: true }`, `\'/blog/**\': { swr: 3600 }`, `\'/admin/**\': { ssr: false }`). That is called hybrid rendering. Note that `isr` relies on a platform CDN (Vercel/Netlify) while `swr` uses Nitro\'s own cache.',
            },
            {
              question: 'What is hydration, and why can a page "look ready" but not respond to clicks?',
              answer:
                'With SSR the server sends finished HTML, so the user sees content immediately, but that HTML has no event handlers or reactive state. Hydration is the browser step where Vue runs the same components again, walks the existing DOM, reuses the nodes and attaches listeners and state. Until the JavaScript has been downloaded and has hydrated, the page is visible but inert. That gap is why hydration cost (how much JS and how many components) matters for Time to Interactive, and why Nuxt added lazy hydration (`hydrate-on-visible`, `hydrate-on-idle`, `hydrate-on-interaction`) and server-only components (islands) to delay or skip hydration for parts of the page.',
            },
            {
              question: 'What causes a hydration mismatch and how do you fix it?',
              answer:
                'Hydration assumes the browser\'s first render produces exactly the HTML the server sent. A mismatch happens when they differ. Common causes: non-deterministic values in render (`Date.now()`, `Math.random()`, `new Date().toLocaleString()` with different timezone/locale on server and client), browser-only branches (`window.innerWidth`, `localStorage`), invalid HTML nesting that the browser parser silently repairs (a `<div>` inside a `<p>`), auth state that exists only on the client, and browser extensions. Fixes: compute such values once with `useState` so the server value is reused; move browser-dependent values into `onMounted`; wrap only the small affected part in `<ClientOnly>` with a `#fallback`; use `useId()` for ids; fix the HTML structure; read the session from a cookie during SSR. Wrapping everything in `<ClientOnly>` is a bad fix because it removes the SEO and speed benefits of SSR.',
            },
            {
              question: 'What is the difference between useFetch, useAsyncData and $fetch?',
              answer:
                '`$fetch` is just an HTTP client (ofetch): it makes a request and returns a promise, with no knowledge of SSR. `useAsyncData(key, fn)` wraps *any* async function: it runs on the server during SSR, stores the result in the page payload under the key, and the browser reads it instead of calling again; it also gives you `data`, `status`, `error`, `refresh`. `useFetch(url)` is a shortcut for `useAsyncData` + `$fetch` with an auto-generated key and reactive URL/query support. Use `useFetch` for GET data a page needs, `useAsyncData` when the source is not a simple URL (an SDK, several parallel calls, merging results), and `$fetch` for actions triggered by the user — form submits, button clicks, POST/PUT/DELETE — where you do not want payload reuse.',
            },
            {
              question: 'Why is calling $fetch directly in <script setup> considered a mistake?',
              answer:
                'Setup runs on the server during SSR and **again in the browser during hydration**. `$fetch` does not know about the payload, so it performs the request twice: once on the server to render HTML, and again in the client — a wasted request, possibly different data (causing a hydration mismatch) and a flicker. `useFetch`/`useAsyncData` store the server result in the payload (`__NUXT_DATA__`) and the client reuses it, so the data is fetched once on first load. `$fetch` is fine inside event handlers or server code, where there is no hydration.',
            },
            {
              question: 'What does the key in useAsyncData do, and what can go wrong with it?',
              answer:
                'The key identifies the cached result: it is the name under which the server stores data in the payload, how the browser finds it during hydration, how components share the same data, and what `refreshNuxtData(key)` or `clearNuxtData(key)` target. If you forget to include the varying part of the request in the key (a route param, a page number), different requests reuse the same entry and show stale or wrong data; if two different sources share one key, they overwrite each other. `useFetch` builds the key from URL and options automatically, which is one reason to prefer it. In Nuxt 4 calls with the same key share the same refs, which makes accidental key reuse even more visible.',
            },
            {
              question: 'What is the difference between lazy: true, server: false and immediate: false?',
              answer:
                '`lazy: true` (or `useLazyFetch`) stops the fetch from blocking client-side navigation: the new page renders immediately with `status === \'pending\'` and fills in later (during SSR it still waits). `server: false` means do not fetch on the server at all — the request happens only in the browser after hydration, so the data is absent from the HTML (use it for private or non-SEO data). `immediate: false` means do not start the request automatically; it only runs when you call `execute()`/`refresh()` or a watched source changes. They can be combined, and each answers a different question: *block navigation?*, *run on the server?*, *run right now?*',
            },
            {
              question: 'useState vs a plain ref — why can a module-level ref cause serious bugs in Nuxt?',
              answer:
                'A browser executes your code for one user, but a Nuxt server is one long-running Node process handling requests from many users. A `ref` declared at module scope is created once when the module loads and is then shared by *every request*, so one user\'s data can appear in another user\'s HTML (cross-request state pollution) and the object never gets garbage-collected. `useState(key, init)` stores the value on the per-request Nuxt app instance, serializes it into the payload so the client starts with the same value, and gives each request its own copy. Module-level state is only safe for constants and pure helpers; anything per-user must go in `useState`, a Pinia store, a cookie, or `event.context`.',
            },
            {
              question: 'When would you use Pinia instead of useState in Nuxt, and how does SSR work with it?',
              answer:
                '`useState` is perfect for a few shared values (current user, toast, drawer state). Pinia is better when you have many related states with actions and getters, want devtools, plugins, structured testing and clear boundaries. With the `@pinia/nuxt` module, a new Pinia instance is created per request on the server; after rendering, its state is serialized into the payload and restored in the browser, so the client does not need to reload what the server already put in the store. Load data inside `await callOnce(() => store.fetchAll())` or `useAsyncData` so the action runs once on the server and is skipped during hydration. Store only serializable state, avoid creating stores at module scope, and use `skipHydrate` for state backed by `localStorage`. Vuex is in maintenance mode and not built into Nuxt 3/4, so Pinia is the standard choice.',
            },
            {
              question: 'How does Nitro work, and what does it give Nuxt?',
              answer:
                'Nitro is the server engine under Nuxt. It is built on h3 (an HTTP framework), ofetch and unstorage, and it compiles your server code into a self-contained `.output/` folder that runs with `node`, as serverless functions, at the edge or as static files, selected by a *preset*. Files in `server/api`, `server/routes`, `server/middleware`, `server/plugins` become handlers automatically. Requests go through Nitro middleware, route rules (redirects, headers, cache), then the matching API/route handler, or the Vue SSR renderer for pages. It also provides a storage layer, response caching (`defineCachedEventHandler`), tree-shaking of server dependencies, and direct in-process calls for `$fetch(\'/api/...\')` made on the server (no network hop).',
            },
            {
              question: 'Why do I get "window is not defined" (or "document is not defined") and how do I solve it?',
              answer:
                'During SSR your component code runs in Node.js, where there is no `window`, `document` or `localStorage`. Any such access in `setup` (or at module top level of something imported during SSR) throws. Solutions, from best to worst: put browser-only work in `onMounted` (never runs on the server); guard with `import.meta.client`; use SSR-safe wrappers (VueUse composables, `useCookie` instead of `document.cookie`); render browser-only components via `<ClientOnly>` or a `.client.vue` file; make a plugin `.client.ts`; and load libraries that touch the DOM at import time with a dynamic `import()` inside `onMounted`. Remember to keep the first render identical on server and client to avoid hydration mismatches.',
            },
            {
              question: 'What are routeRules and what can you do with them?',
              answer:
                '`routeRules` in `nuxt.config.ts` map URL patterns to behaviours without changing the code of pages or handlers. You can set the rendering mode (`prerender`, `ssr: false`, `swr`, `isr`), caching (`cache: { maxAge }`), response `headers`, `cors`, and `redirect`/proxy rules. That is how Nuxt does hybrid rendering: the home page prerendered, the blog on SWR, the admin area as an SPA, the API with CORS. Rules are matched most-specific-first and applied by Nitro. The caveat is that `isr` and some options depend on the hosting platform, and cached pages are shared by all users, so personal data must not be rendered into them.',
            },
            {
              question: 'What is the difference between route middleware and server middleware?',
              answer:
                'Route middleware (`app/middleware`, `defineNuxtRouteMiddleware`) runs inside the Vue app while navigating between pages: on the server for the first request and in the browser for later navigations. It can redirect with `navigateTo` or cancel with `abortNavigation`, and is used for page-level concerns like auth guards. Server middleware (`server/middleware`, `defineEventHandler`) runs in Nitro for every HTTP request, including API calls and static assets, before the route handler; it is used for logging, request context, headers, or auth checks on APIs. Route middleware is a UX feature only; real security must be enforced in server handlers because users can call APIs directly.',
            },
            {
              question: 'How do the auto-imports work, and what are the trade-offs?',
              answer:
                'At build time Nuxt scans `components/`, `composables/`, `utils/` (and Vue/Nuxt APIs) and generates the real `import` statements for names you use, plus type declarations in `.nuxt/`. Output is ordinary ES modules, tree-shaken as usual. Pros: much less boilerplate, easy refactors, consistent code. Cons: it is harder to see where a name comes from when reading (IDE navigation or DevTools helps), name clashes between composables, code outside Nuxt (scripts, some test setups) does not get them, and only top-level files of `composables/` and `utils/` are scanned by default (nested ones need re-exports or `imports.dirs`). You can import explicitly at any time, or disable auto-imports with `imports.autoImport: false`.',
            },
            {
              question: 'How do you manage environment variables and secrets in Nuxt?',
              answer:
                'Declare settings in `runtimeConfig` in `nuxt.config.ts` with defaults. Top-level keys are server-only; keys under `public` are exposed to the browser. At runtime, environment variables override them using the `NUXT_` prefix and upper snake case (`NUXT_API_SECRET`, `NUXT_PUBLIC_API_BASE`) — the key must already exist in the config. Read values with `useRuntimeConfig()` (or `useRuntimeConfig(event)` in server handlers). `.env` is for development and build; the built server reads real environment variables, so set them on the host or container. Never put secrets under `public`, avoid `process.env` in app code, and use `app.config.ts` only for non-secret build-time options such as theme settings.',
            },
            {
              question: 'How would you implement authentication in a Nuxt app with SSR?',
              answer:
                'Use a cookie, not `localStorage`, because the server needs the credential on the very first request to render the correct state without a logged-out flash. A login endpoint verifies credentials (hashed passwords, rate limiting), then sets a signed or sealed `httpOnly`, `secure`, `sameSite` session cookie — `nuxt-auth-utils` does this with `setUserSession`. During SSR the app reads the session (via `useUserSession`, or a plugin that calls `/api/me` using `useRequestFetch()` to forward the cookie) and keeps the user in `useState`. Route middleware redirects unauthenticated users for UX, but every private API handler must check the session again (for example `requireUserSession(event)`) because middleware can be bypassed by calling the API directly. Add role checks on the server and CSRF protection where relevant.',
            },
            {
              question: 'How do you handle errors in Nuxt?',
              answer:
                'There are three levels. For fatal errors, `throw createError({ statusCode, statusMessage, fatal: true })` (or `showError`) renders `error.vue` with the correct HTTP status — important so a missing resource is a real 404 for crawlers. For local failures, wrap a section in `<NuxtErrorBoundary>` so only that widget shows a fallback and the rest of the page keeps working. For data fetching, remember `useFetch`/`useAsyncData` do not throw; they populate `error`, so you decide between showing a local message and escalating with `createError`. In server routes you throw `createError` to send JSON error responses. Use `clearError({ redirect })` to leave the error page, and a `vue:error` hook or monitoring service to report uncaught errors.',
            },
            {
              question: 'How do you do SEO in Nuxt? What can go wrong?',
              answer:
                'Render real HTML on the server (SSR or prerender), set per-page tags with `useSeoMeta` and `useHead` using values from the fetched data, define site defaults and a title template in `app.head`, add canonical links, Open Graph/Twitter tags, structured data (JSON-LD), a sitemap and `robots.txt` (the Nuxt SEO modules), and return correct status codes. Things that go wrong: calling `useHead` in `onMounted` (tags exist only in the browser), content rendered only in `<ClientOnly>` or with `ssr: false`, prerendered pages with stale data, catch-all routes returning 200 for missing content, and missing canonical URLs for pages reachable by several URLs. Verify with "view source" or `curl`, not just the browser inspector.',
            },
            {
              question: 'How do you cache in Nuxt? What are the risks?',
              answer:
                'At several layers. Browser and CDN caching use HTTP headers (`Cache-Control`, `stale-while-revalidate`), which `routeRules` `swr`/`isr` can emit. Nitro caches responses with `defineCachedEventHandler` and functions with `defineCachedFunction`, stored through the storage layer (memory by default — per instance — or Redis/KV for sharing), with `maxAge`, `swr`, and custom `getKey`. `routeRules` can enable this per URL pattern. The main risks are: caching personalised responses so one user sees another\'s data (include the user in the key or do not cache), stale data and invalidation (clear entries after writes), per-instance memory caches giving inconsistent results behind a load balancer, and cache keys that forget query parameters.',
            },
            {
              question: 'How do plugins and modules differ in Nuxt?',
              answer:
                'Plugins (`plugins/`) run at application start (on the server, the client, or both) and are used to register Vue plugins, provide helpers (`provide` becomes `useNuxtApp().$name`), add directives, or create SDK clients. Modules run earlier, at **build time**, and extend the framework itself: they can add plugins, components, composables, server handlers, config and Vite/Nitro options through `@nuxt/kit` helpers. A module is how packages like `@nuxt/image` or `@pinia/nuxt` integrate with one line in `modules`. Rule of thumb: use a plugin to wire something into the running app, and a module to package reusable build-time integration for several projects.',
            },
            {
              question: 'What changed in Nuxt 4 compared to Nuxt 3?',
              answer:
                'Nuxt 4 is an evolution, not a rewrite. The visible change is the directory structure: application code (pages, components, composables, layouts, middleware, plugins, `app.vue`) lives in `app/`, while `server/`, `public/`, `shared/` and `modules/` stay at the root; the `~` alias points to `app/`. Data fetching became stricter and faster: `data` and `error` default to `undefined`, `data` is a shallowRef (no deep proxies for big responses), calls with the same key share one set of refs (a singleton data layer that warns on conflicting options), keys can be reactive, `getCachedData` runs on every fetch with a `cause`, `clear()` resets to `default`, and `refresh({ dedupe })` takes `\'cancel\'`/`\'defer\'` instead of booleans. TypeScript projects are separated per context (app, server, shared, node) with `noUncheckedIndexedAccess` on, there is a `shared/` folder auto-imported on both sides, Unhead v2 replaced v1, component names were normalised, and `window.__NUXT__` was removed. Upgrade with `npx nuxt upgrade --dedupe` and the migration codemod. Since Nuxt 3 reached end-of-life on July 31, 2026, staying on 3 is no longer an option for production apps. The 4.x minors kept adding features (route-rule layouts, `createUseFetch`, vue-router v5, Vite 8, experimental SSR streaming, `nuxt/server`) on the way to Nuxt 5.',
            },
            {
              question: 'What are islands / server components, and when are they a good idea?',
              answer:
                'A server component (`Name.server.vue`, enabled with `experimental.componentIslands`) is rendered only on the server; its HTML is sent but its JavaScript is not, and it is not hydrated. That removes heavy dependencies (Markdown parsers, syntax highlighters) from the client bundle. They fit non-interactive, expensive content inside an otherwise interactive page. Limits: no client-side interactivity inside the island, props must be serializable, updates require a server round trip, and the feature is still experimental. For simpler cases, lazy hydration or `hydrate-never` can achieve a similar saving while keeping the component code normal.',
            },
            {
              question: 'How would you improve the performance of a slow Nuxt page?',
              answer:
                'Measure first (Lighthouse, Network tab, `nuxt analyze`, DevTools payload tab). If the server is slow, cache with `routeRules` (prerender/swr) or `defineCachedEventHandler`, make secondary data `lazy`, and parallelise requests. If the HTML is huge, cut the payload with `pick`/`transform` and paginate. If the page is visible but slow to become interactive, reduce hydration cost: `Lazy` components, `hydrate-on-visible`/`idle`/`interaction`, islands, smaller libraries, fewer components rendered at start. For images use `<NuxtImg>` with width/height, modern formats and lazy loading; for fonts use `@nuxt/fonts`; load third-party scripts late. Finally check caching headers for hashed assets. Re-measure after each change so you know what helped.',
            },
            {
              question: 'Where can you deploy a Nuxt app, and how do you choose?',
              answer:
                'Nitro presets let the same code target a Node server (VM or Docker), static hosting (`nuxt generate`), serverless platforms (Vercel, Netlify, AWS Lambda) and edge runtimes (Cloudflare, Deno Deploy). Choose by need: static hosting is cheapest and fastest but has no runtime server code or on-demand SSR; serverless gives zero-ops SSR and ISR but has cold starts and time limits; edge gives low latency but restricts Node APIs and native modules; a container/VM gives full control and long-lived connections. Run `npm run build && npm run preview` before deploying, supply secrets as `NUXT_*` environment variables, and remember that `server/api` does not exist on a purely static deployment.',
            },
            {
              question: 'When would you not choose Nuxt?',
              answer:
                'Skip Nuxt when you do not need what it adds: an internal dashboard behind a login, an embeddable widget or an app dropped into an existing server-rendered site can be a plain Vue + Vite SPA, which is simpler to build, debug and host. Consider other tools when the team is on React (Next.js, with a larger ecosystem), when minimal bundle size is the top priority (SvelteKit), or when the site is mostly static content with a few interactive islands (Astro ships almost no JS by default). Nuxt also brings real costs: SSR pitfalls (hydration mismatches, per-request state, browser-only APIs), a runtime to host, convention "magic" that newcomers must learn, and module/upgrade risk. The honest answer is to decide from SEO needs, team skills, hosting and interactivity, not from hype.',
            },
            {
              question: 'Walk me through what happens on the server, step by step, when a Nuxt page is requested.',
              answer:
                'Nitro receives the request and runs server middleware and route rules (redirects, headers, cached responses — a cache hit can return here without rendering). If no API route matches, the Vue renderer handles it: it creates a **fresh `nuxtApp` and Vue app for this request**, runs Nuxt plugins in order, runs global and page route middleware for the target route, then renders the page tree inside `<Suspense>`, which waits for every top-level `await` in setup (`useFetch`, `useAsyncData`, `callOnce`). Once everything resolves, `renderToString` produces the HTML, unhead collects head tags, preload hints are added, and the payload (async data, `useState`, Pinia state, errors) is serialized with devalue into `__NUXT_DATA__`. In the browser the entry script creates the app, runs client plugins, revives the payload so data composables return cached results instead of refetching, hydrates the DOM, and only then runs `onMounted`. Knowing this tells you what can block TTFB (any awaited call), what is per-request (everything created inside the app), and what is shared (module scope in the Node process). With experimental SSR streaming (4.5+), the shell is sent before rendering finishes, which also means headers are committed early.',
            },
            {
              question: 'What exactly is in the Nuxt payload, how is it serialized, and how do you keep it small?',
              answer:
                'The payload is the state the client needs to reproduce the server render: `useAsyncData`/`useFetch` results by key, `useState` values, Pinia state, the error (if any), and some flags. It is serialized with **devalue**, which handles `Date`, `Map`, `Set`, `BigInt`, repeated references and cycles that JSON cannot; Nuxt adds reducers for refs and its own types, and you can add your own with `definePayloadReducer`/`definePayloadReviver`. It is embedded in the HTML as `<script id="__NUXT_DATA__">`, or written to `_payload.json` for prerendered and (since 4.3) ISR/SWR/cached routes so client navigations can reuse it. It costs bytes *and* parse time before hydration, so: `transform`/`pick` responses down to what the template uses, paginate, do not store the same data in both async data and a store, move big static content into server components, and treat it as public — never put secrets or other users\' data in it.',
            },
            {
              question: 'Why did Nuxt 4 make `data` a shallowRef by default, and what bugs does that introduce?',
              answer:
                'A deep ref proxies every nested object as you access it; for large API responses that is significant CPU and memory, paid on every SSR request and again in the browser, for data that is almost always replaced wholesale rather than mutated. `shallowRef` only tracks reassignment of `.value`, so refetching and assigning still re-render, but in-place mutation such as `data.value.items.push(x)` or `data.value.title = \'new\'` no longer triggers updates — the classic bug is an optimistic UI update that silently does nothing. Fixes: replace immutably (`data.value = { ...data.value, items: [...data.value.items, x] }`), pass `deep: true` for that call, or copy into a local editable `ref` for forms. Also watch out for `watch(data, ..., { deep: true })` assumptions and for code that checks `=== null` — Nuxt 4 defaults are `undefined`.',
            },
            {
              question: 'Explain the Nuxt 4 "singleton data layer". What problems does it solve and what new mistakes does it surface?',
              answer:
                'In Nuxt 4 all `useAsyncData`/`useFetch` calls with the same key share one set of `data`, `error` and `status` refs, and one in-flight request. That means two components asking for `\'current-user\'` get the same object, deduplicated network calls, and consistent refresh — `refreshNuxtData(\'current-user\')` updates both. It also makes keys an explicit contract: if two calls use the same key with different handlers or options (`transform`, `pick`, `default`, `deep`, `getCachedData`), they now visibly conflict and Nuxt warns. Common mistakes it exposes: static keys that should include a route param (fixed by reactive keys like `() => \`product-${id.value}\``), generic keys like `\'list\'` reused across pages (which also collide in shared prerender data), and per-component transforms applied to shared data. Rule: the key identifies *the data*, not the component.',
            },
            {
              question: 'What does getCachedData do, and how did its semantics change in Nuxt 4?',
              answer:
                '`getCachedData(key, nuxtApp, ctx)` lets you return already-available data instead of running the handler; returning `undefined` means "fetch". By default it reads the hydration payload (and static/prerender data), which is how the first client render avoids refetching. People customise it to reuse data on back-navigation or implement a TTL. In Nuxt 4 it is called on **every** fetch — including watcher-triggered fetches and manual `refresh()`/`refreshNuxtData()` — and receives `ctx.cause` (`\'initial\'`, `\'refresh:manual\'`, `\'refresh:hook\'`, `\'watch\'`). The trap: a Nuxt 3 style implementation that always returns cached data makes the Refresh button and reactive refetches do nothing. Check `ctx.cause` and return `undefined` for manual refreshes, or store a timestamp alongside the data and expire it.',
            },
            {
              question: 'How do you prevent cross-request state pollution beyond just "use useState"?',
              answer:
                'Treat every module-scope variable in code that runs on the server as shared by all users for the lifetime of the process. Audit for: module-level `ref`/`reactive`/`Map` caches in composables, utils and store files; singletons in `server/utils` that store per-user data (put it on `event.context` instead); third-party SDKs initialised once with a user token (create them per request, e.g. in a Nuxt plugin, and `provide` them); Pinia stores created outside the per-request Pinia instance; and libraries with global mutable config (i18n, date libraries set to a user\'s locale) mutated during render. Detect it with a concurrency e2e test (two users in parallel, assert no data crossover) and code review rules. Legitimately global things — config, DB pools, compiled regexes, a shared cache of *public* data — can stay at module scope.',
            },
            {
              question: 'What are Nuxt layers, and when would you choose a layer over a module?',
              answer:
                'A layer is a partial Nuxt project (its own `nuxt.config`, `app/`, `server/`, components, composables, pages) that another project includes via `extends` or by placing it in `layers/`. Configs are deep-merged and files are combined, with the consuming project overriding layer files at the same path. A module is a build-time function using `@nuxt/kit` that programmatically adds or changes things. Choose a layer to share *application code and conventions* — a design system with layouts and error page, an auth area, a multi-brand starter, or one domain of a large monorepo — because it is just Nuxt code and individual files can be overridden. Choose a module for a reusable *integration* with options and logic (image optimisation, a CMS client, i18n). Watch out for relative paths in layer configs (resolve them against the layer) and for module load order (in Nuxt 4 layer modules load before project modules).',
            },
            {
              question: 'What is SSR streaming in Nuxt and what are its trade-offs?',
              answer:
                'With `experimental.ssrStreaming` (Nuxt 4.5+), the server sends the HTML shell — head, styles, preload hints, entry scripts — immediately and streams the body as Vue renders, instead of buffering the whole page. That improves TTFB and lets the browser fetch CSS and JS while slow data is still loading. Trade-offs: the HTTP status and headers are committed with the first byte, so `setResponseStatus`, late 404s or cookie writes during render can no longer take effect (Nuxt warns in dev); bots get buffered HTML by default via `botRegex`; routes with `redirect`, `cache`, `isr`, `swr`, `noScripts` or `ssr: false` fall back to buffered rendering; and you can opt out per route with `streaming: false`. It is still experimental, so measure TTFB and LCP before and after, and keep status-critical routes buffered.',
            },
            {
              question: 'How would you design a type-safe API layer in a Nuxt app?',
              answer:
                'Put request schemas (zod or any Standard Schema library) and JSON-friendly DTO types in `shared/`, so both sides import them. On the server, validate every input with `readValidatedBody`/`getValidatedQuery`/`getValidatedRouterParams` using those schemas and return DTOs, mapping ORM rows explicitly so internal fields never leak. On the client, `$fetch` and `useFetch` infer the response type from the handler; enable `experimental.routeTypedFetch` (Nuxt 4.6) for typed bodies/queries and scalable type-checking, and `typedPages` for typed links. Centralise base URLs, auth headers and error policy in a `$fetch.create` client and a `createUseFetch` composable. Remember types describe the *serialized* shape (a `Date` becomes a `string`), and that types are not validation — the server schema is the security boundary.',
            },
            {
              question: 'A CDN or swr route is serving one user\'s personalised page to other users. How did it happen and how do you fix it?',
              answer:
                'A shared cache stores the first response for a URL and replays it. If a route with `swr`, `isr`, `cache` or `prerender` renders anything derived from the session cookie — a name in the header, a cart count, prices for a customer tier — that HTML (and its payload, including `useState` user data) gets cached and served to everyone. Likewise a `defineCachedEventHandler` that reads the session without putting the user in `getKey`/`varies`. Immediate fix: purge the cache and remove caching from that route. Structural fix: keep cached routes strictly public; render the personalised bits on the client after hydration (`server: false` fetch or `<ClientOnly>` for the small widget), or keep the route on uncached SSR with `cache-control: private, no-store`. Add a test that requests the cached route as two different users and compares responses, and review `routeRules` whenever a page gains user-specific content.',
            },
            {
              question: 'What is `nuxt/server`, and why does it matter for upgrading to Nuxt 5?',
              answer:
                'Introduced in Nuxt 4.6, `nuxt/server` is a small, Nuxt-owned server API (`defineEventHandler`, `createError`, `getQuery`, `getRouterParam(s)`, `readValidatedBody`, `getRequestIP`, `handleCors`, `getRouteRules`, `useRuntimeConfig`, `useSession` and so on) with a web-standard request event. Handlers written against it run unchanged on Nitro v2 (Nuxt 4), Nitro v3 (Nuxt 5) or the experimental `@nuxt/vite-server`. Nuxt 5 moves to Nitro v3 and h3 v2, whose APIs differ from h3 v1, so code importing `h3` or `nitropack` directly or using `event.node.req` will need changes. Migrating server files to `nuxt/server` now — one file at a time, without mixing it with the auto-imported h3 helpers in the same file — turns the future major upgrade into a non-event for your server code.',
            },
            {
              question: 'How do you protect a Nuxt app against XSS and CSRF?',
              answer:
                'XSS: Vue escapes text interpolation, so the risk is concentrated in `v-html`, head scripts built from strings, user-controlled URLs in `:href`/`:src` (`javascript:` URLs) and Markdown from untrusted sources. Sanitize HTML on the server (and preferably store sanitized output), serialize JSON-LD with `JSON.stringify`, validate URL schemes, and add a Content Security Policy — with SSR this requires per-request nonces because Nuxt emits inline payload scripts, which is why many teams use the `nuxt-security` module. Keep session cookies `httpOnly` so an XSS cannot steal them. CSRF: cookie-based sessions are sent automatically on cross-site requests, so use `sameSite: \'lax\'` or `strict`, never mutate on GET, verify the `Origin` header (or a CSRF token) on state-changing API routes, and be extra careful with `sameSite: \'none\'` and CORS configurations that allow credentials.',
            },
            {
              question: 'callOnce, useAsyncData and onServerPrefetch: how do they differ?',
              answer:
                '`useAsyncData` fetches data, stores it in the payload under a key, and gives you reactive `data`/`status`/`error`/`refresh` — the right tool when a component *renders* that data. `callOnce(key, fn)` runs a side effect once during SSR and skips it during hydration (and, with `mode: \'navigation\'`, once per navigation); it returns nothing reactive, which makes it ideal for filling a Pinia store whose state is serialized separately. `onServerPrefetch` is the low-level Vue hook that Nuxt\'s composables build on: it lets a component await work during SSR, but it does not transfer results to the client by itself — you must put the result into serializable state yourself, otherwise the client re-runs the work and risks a mismatch. In Nuxt code, reach for `useAsyncData` or `callOnce` and leave `onServerPrefetch` to library authors.',
            },
            {
              question: 'How do you debug a hydration mismatch that only happens in production?',
              answer:
                'First reproduce it locally with `nuxt build && nuxt preview` rather than the dev server, and compare "view source" (server HTML) with the DOM right after load. Production builds strip Vue\'s detailed warnings, so for a staging build define `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true` via `vite.define` to get the node and the expected vs actual value. Then look for production-only differences: the server running in UTC while users are in other time zones, `Intl` output differing between Node and browsers, data that changed between the server fetch and a client refetch (a `$fetch` in setup, or a `getCachedData` that misses), CDN-cached HTML whose payload is older than the client bundle after a deploy, A/B testing or feature flags evaluated differently on each side, and HTML minification or edge rewrites that alter markup. Fix the root cause — `useState` for shared values, `onMounted` for browser-only values, `<NuxtTime>` for dates, `data-allow-mismatch` only for intentional differences — and add a Playwright check that fails on hydration warnings.',
            },
          ],
        },
      ],
    },
  ],
}
