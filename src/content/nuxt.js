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
              text: '**Versions:** the current major version is **Nuxt 4** (released mid-2025). It is an evolution of Nuxt 3 rather than a rewrite: the biggest visible change is that your application code moves into an `app/` directory, plus some stricter data-fetching defaults. This guide says explicitly where Nuxt 3 and Nuxt 4 differ. Nuxt 2 (Vue 2 based) is end-of-life and works very differently.',
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
  public/                   # served as-is at the site root (favicon, robots.txt)
  modules/                  # your own local Nuxt modules
  nuxt.config.ts
  tsconfig.json`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Why the `app/` folder?** In Nuxt 3, `pages/`, `server/`, `node_modules/` and `.git/` all sat side by side, which made file watchers slow and made it unclear what was browser code and what was server code. Nuxt 4 groups browser-side code in `app/` (the `~` alias now points there) and keeps server code outside it. Nuxt 3 projects can opt in early with `future: { compatibilityVersion: 4 }`.',
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
              text: '`<NuxtLoadingIndicator>` hooks into navigation and `useAsyncData` automatically. For manual control (a long form submit), use `const { start, finish } = useLoadingIndicator()`. Add `<NuxtRouteAnnouncer />` so screen readers announce page changes after a client-side navigation — an accessibility detail that plain SPAs often miss.',
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
            'Options you will use: `query`, `body`, `method`, `headers`, `lazy`, `server`, `default`, `transform`, `pick`, `watch`, `key`, `immediate`.',
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

const { data: posts, status, error, refresh } = await useFetch<Post[]>('/api/posts', {
  query: { page },          // a ref in query: changing page refetches automatically
  default: () => [],        // never undefined in the template
  pick: ['id', 'title'] as any, // keep only these fields in the payload (smaller HTML)
})
</script>

<template>
  <div>
    <p v-if="status === 'pending'">Loading...</p>
    <p v-else-if="error">Could not load posts: {{ error.statusMessage }}</p>
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
    statusCode: error.value.statusCode ?? 404,
    statusMessage: 'Product not found',
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

// Key includes the route param so each product gets its own cache entry
const { data, status, error } = await useAsyncData(
  \`product-\${route.params.id}\`,
  async () => {
    // Two requests in parallel, merged into one result
    const [product, reviews] = await Promise.all([
      $fetch(\`/api/products/\${route.params.id}\`),
      $fetch(\`/api/products/\${route.params.id}/reviews\`),
    ])
    return { product, reviews }
  },
  {
    watch: [() => route.params.id],     // refetch when the id changes (same page component reused)
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
    await refreshNuxtData('posts')   // re-run the data of the list page
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
            '`transform` reshapes the response *before* it is stored in the payload (smaller HTML, fewer reactivity costs); `pick` keeps only named fields; `default` supplies initial data.',
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
  // Reuse the client-side cache on navigation back to this page
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
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
              text: '**Nuxt 4 data-fetching changes** (from Nuxt 3): `data` and `error` default to `undefined` instead of `null`; `data` is a **shallowRef** by default (set `deep: true` if you mutate nested fields and need deep reactivity); calls with the same key share their refs; reactive keys are supported and `dedupe` defaults to cancelling the previous in-flight request. In Nuxt 3, set `future: { compatibilityVersion: 4 }` to try them.',
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
              text: 'Because `useState` keys are global strings, prefix them by feature (`\'cart:items\'`, `\'auth:user\'`). Omit the key and Nuxt generates one from the call site — fine for one-off use, but an explicit key is safer when two files must share the state. Reset with `clearNuxtState(\'cart:items\')`.',
            },
          ],
        },
        {
          id: 'pinia-in-nuxt',
          title: 'Pinia in Nuxt (and What Happened to Vuex)',
          summary:
            'For structured, larger app state use Pinia via the `@pinia/nuxt` module: stores are created per request, serialized into the payload and rehydrated in the browser automatically. Vuex is in maintenance mode and not recommended for new Nuxt apps.',
          keyPoints: [
            'Install with `npx nuxi module add pinia` (adds `@pinia/nuxt` to `modules`). `defineStore`, `storeToRefs` and your store folder can be auto-imported. Pinia itself is covered in the Pinia topic of the Vue.js section — here is what Nuxt adds.',
            '**SSR hydration is automatic:** state set on the server is serialized into the payload and applied to the browser\'s Pinia instance, so the browser does not need to re-fetch what a server-side action already loaded.',
            '**Pattern for loading data into a store:** call the store action inside `await useAsyncData` or `callOnce`, so it runs once on the server and not again during hydration.',
            '**Vuex** was Nuxt 2\'s built-in store (`store/` folder). In Nuxt 3/4 it is not built in; Pinia is the official Vue state library. Use `useState` for small shared values and Pinia when you want actions, getters, devtools and structure.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'install',
              code: `npx nuxi module add pinia      # installs pinia + @pinia/nuxt and updates nuxt.config.ts`,
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
                ['`server/tasks/*.ts`', 'scheduled / on demand', 'Background tasks (experimental feature flag)'],
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
                ['`@nuxt/image`', '`<NuxtImg>` / `<NuxtPicture>`: resizing, modern formats (WebP/AVIF), lazy loading, srcset', 'You show many or large images'],
                ['`@nuxt/content`', 'Write pages as Markdown/YAML/JSON files; query them with `queryCollection` (v3)', 'Docs, blogs, marketing sites'],
                ['`@nuxt/ui`', 'Accessible component library on Tailwind CSS (buttons, forms, modals, tables)', 'You want a ready-made design system'],
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
npx nuxt module add i18n`,
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
    innerHTML: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.value.title,
      datePublished: post.value.publishedAt,
    },
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
    payloadExtraction: true,    // prerendered pages load data from a small _payload.json on client navigation
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
        url: process.env.REDIS_URL,                // read at build time; or use runtime env for the driver
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
    B -- "Edge close to users" --> E["cloudflare-pages, cloudflare module, deno-deploy presets"]
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
              language: 'text',
              title: 'Dockerfile — multi-stage build',
              code: `# --- build stage: needs dev dependencies ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime stage: only the self-contained output ---
FROM node:22-alpine
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
              text: 'Other everyday commands: `npx nuxt typecheck` (run vue-tsc over the project), `npx nuxt cleanup` (delete `.nuxt/` and caches when things get weird), `npx nuxt info` (versions for bug reports) and `npx nuxt prepare` (regenerate types).',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'When testing a component that uses `useFetch`, mounting it with plain `@vue/test-utils` `mount()` fails because there is no Nuxt context or async handling. Use `mountSuspended` and `registerEndpoint` instead of hand-mocking `fetch` globally.',
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
            'An incremental path for large Nuxt 2 apps: **Nuxt Bridge** (Nuxt 2 with Nuxt 3 features) to move gradually; Nuxt 2 itself is end-of-life, so it no longer receives fixes.',
            'Check the official upgrade guide and the **current support dates** for each major before planning; Nuxt 3 enters end-of-life some time after Nuxt 4\'s release, so new projects should start on Nuxt 4.',
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
                'Nuxt 4 is an evolution, not a rewrite. The visible change is the directory structure: application code (pages, components, composables, layouts, middleware, plugins, `app.vue`) lives in `app/`, while `server/`, `public/`, `shared/` and `modules/` stay at the root; the `~` alias points to `app/`. Data fetching became stricter: `data` and `error` default to `undefined`, `data` is a shallowRef, calls with the same key share state, reactive keys are supported and the older in-flight request is cancelled by default. TypeScript projects are separated per context (app, server, shared), there is a new `shared/` folder, and some experimental flags became defaults. Upgrade with `npx nuxt upgrade --dedupe` and the migration codemod, and you can pre-test with `future.compatibilityVersion: 4` on Nuxt 3.',
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
          ],
        },
      ],
    },
  ],
}
