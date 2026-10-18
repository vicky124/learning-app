export const angularSection = {
  id: 'angular',
  label: 'Angular',
  icon: '🅰️',
  groups: [
    {
      id: 'angular-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-angular',
          title: 'What Angular Actually Is',
          summary:
            'Angular is a complete, opinionated, TypeScript-first application framework from Google — routing, forms, HTTP, dependency injection, testing, and a build CLI all ship in the box, rather than being assembled from separate libraries.',
          keyPoints: [
            'A **framework**, not a library: Angular owns the application structure (bootstrapping, DI, routing, forms) and calls your code, where React is a rendering library you build an architecture around yourself.',
            'TypeScript is mandatory and deeply integrated — decorators, DI tokens, typed forms, and the template type-checker all depend on it.',
            '"Modern Angular" (v17 onward) is a substantially different framework from the Angular of 2016–2022: standalone components instead of `NgModule`s, built-in `@if`/`@for` control flow, **signals** for reactivity, and zoneless change detection.',
            'As of late 2026 the current major is **Angular 22** (released June 2026): OnPush is the default change-detection strategy, Signal Forms and the `resource()`/`httpResource()` APIs are stable, `HttpClient` uses Fetch by default, and new projects are zoneless and tested with Vitest.',
            'Angular is not AngularJS: AngularJS (1.x, 2010) was a different JavaScript framework that reached end-of-life in 2021. Angular 2+ was a full rewrite and shares only the name.',
            'Angular ships a new major version roughly every six months, each with 18 months of support (6 months active + 12 months LTS), and provides automated `ng update` migrations for breaking changes.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Angular is designed for large, long-lived applications built by many developers. Its core bet is that **consistency beats flexibility** at scale: every Angular app is bootstrapped the same way, structures code into components and services the same way, does HTTP, routing, and forms with the same first-party packages, and is built and tested with the same CLI. A developer moving between two Angular codebases finds far fewer surprises than one moving between two React codebases that each picked a different router, state library, form library, and build setup.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    App["Your Angular application"]
    App --> Core["@angular/core<br/>components, signals, DI, change detection"]
    App --> Router["@angular/router<br/>routing, guards, lazy loading"]
    App --> Forms["@angular/forms<br/>template-driven and reactive forms"]
    App --> Http["@angular/common/http<br/>HttpClient, interceptors"]
    App --> SSR["@angular/ssr<br/>server rendering and hydration"]
    CLI["Angular CLI<br/>ng new / serve / build / test / update"] -.builds and tests.-> App`,
            },
            {
              type: 'table',
              headers: ['', 'Angular', 'React'],
              rows: [
                ['Kind', 'Full framework', 'UI rendering library'],
                ['Language', 'TypeScript (required)', 'JavaScript or TypeScript'],
                ['Templates', 'HTML templates with Angular syntax, compiled ahead of time', 'JSX — JavaScript expressions'],
                ['Reactivity', 'Signals (plus RxJS for async streams)', 'State + re-render the component function'],
                ['Routing / forms / HTTP', 'First-party, built in', 'Third-party choices (React Router, React Hook Form, TanStack Query…)'],
                ['Dependency injection', 'Built-in hierarchical DI system', 'None built in (Context is the closest analogue)'],
              ],
            },
            {
              type: 'heading',
              text: 'How Angular turns your code into a running app',
            },
            {
              type: 'p',
              text: 'The most important internal fact about Angular is that **templates are compiled ahead of time** (AOT). The Angular compiler (`ngtsc`, a TypeScript compiler plugin) reads every component\'s template and turns it into plain JavaScript *template functions* made of low-level instructions — "create element", "bind property", "listen to event". There is no template parsing and no virtual DOM at runtime: on each update Angular simply re-runs the "update" half of those instructions and compares each binding against the previous value it stored. This is why template errors (a misspelled input, a wrong type passed to a child) can be caught at **build time** with `strictTemplates`, and why the runtime can be so small and fast.',
            },
            {
              type: 'table',
              headers: ['Era', 'Versions', 'Defining characteristics'],
              rows: [
                ['Classic Angular', 'v2 – v13', '`NgModule`s, decorators everywhere, Zone.js, View Engine then Ivy compiler'],
                ['Transition', 'v14 – v16', 'Standalone components (preview → stable), typed forms, `inject()`, first signals preview'],
                ['Modern Angular', 'v17 – v20', 'Built-in control flow, `@defer`, signal inputs/outputs/queries, `linkedSignal`, zoneless preview, Vite/esbuild builder'],
                ['Signals-first Angular', 'v21 – v22+', 'Zoneless and Vitest by default, Signal Forms, stable resources, OnPush as the default strategy'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A lot of Angular content online still teaches the pre-v17 style: `NgModule`s everywhere, `*ngIf`/`*ngFor`, `@Input()` decorators, and `zone.js`-driven change detection. That code still works and you will meet it in older codebases, but this guide teaches the modern style first and points out the legacy equivalent where it matters.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When *not* to choose Angular: a small marketing site, a content-heavy blog, or a widget embedded in someone else\'s page. Angular\'s strengths (DI, structure, first-party everything) pay off over years and many contributors; for small, short-lived projects its conventions can feel like overhead.',
            },
          ],
        },
        {
          id: 'cli-and-project-structure',
          title: 'The Angular CLI and Project Structure',
          summary:
            'The `ng` CLI creates, serves, generates, builds, tests, and upgrades projects — and a new project boots from a single `bootstrapApplication` call configured by `app.config.ts`.',
          keyPoints: [
            '`ng new my-app` scaffolds a project; `ng serve` runs a dev server with hot reload; `ng build` produces an optimized production bundle in `dist/`.',
            '`ng generate component|service|pipe|directive|guard <name>` (short: `ng g c <name>`) creates correctly-wired files following the style guide.',
            '`main.ts` calls `bootstrapApplication(AppComponent, appConfig)` — there is no root `NgModule` in a modern app.',
            '`app.config.ts` is where app-wide providers live: `provideRouter(routes)`, `provideHttpClient()`, and so on — the `provideX()` functions replace the old `XModule.forRoot()` pattern.',
            'The build uses esbuild + Vite (`@angular/build:application`): fast rebuilds, ESM output, and a single builder for browser, SSR, and prerendering.',
            '`angular.json` configures the build (budgets, assets, styles, environments); `ng update` runs automated code migrations between major versions.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'everyday CLI commands',
              code: `npm install -g @angular/cli
ng new shop-app                 # prompts for stylesheet format, SSR, etc.
cd shop-app
ng serve --open                 # dev server on http://localhost:4200

ng g c products/product-list    # component: .ts, .html, .css, .spec.ts
ng g s products/product         # service
ng g pipe shared/currency-short
ng g guard auth/auth            # functional route guard

ng build                        # production build into dist/
ng test                         # unit tests
ng update @angular/core @angular/cli   # upgrade + run migrations`,
            },
            {
              type: 'code',
              language: 'text',
              title: 'a typical modern project layout',
              code: `src/
  main.ts                 # bootstrapApplication(App, appConfig)
  index.html              # contains <app-root></app-root>
  styles.css              # global styles
  app/
    app.ts                # root component (older CLIs: app.component.ts)
    app.html
    app.config.ts         # application-wide providers
    app.routes.ts         # route table
    products/
      product-list.ts
      product-list.html
      product.service.ts`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'main.ts and app.config.ts',
              code: `// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch(err => console.error(err));

// app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),       // report uncaught errors to ErrorHandler
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])), // Fetch backend is the default since v22
  ],
};
// New projects are zoneless by default (v21+). Older apps opt in with
// provideZonelessChangeDetection() and remove zone.js from polyfills.`,
            },
            {
              type: 'heading',
              text: 'What the build actually does',
            },
            {
              type: 'p',
              text: 'Since v17 the default builder is `@angular/build:application`, built on **esbuild** for bundling and **Vite** for the dev server. `ng build` type-checks your TypeScript *and* templates, compiles templates AOT, tree-shakes unused code (including `providedIn: \'root\'` services nobody injects), splits every lazy route and `@defer` block into its own chunk, and — if SSR is enabled — produces a server bundle alongside the browser bundle. The old webpack-based `@angular-devkit/build-angular:browser` builder still exists for legacy projects, but it is markedly slower; `ng update` offers a migration to the application builder.',
            },
            {
              type: 'table',
              headers: ['File', 'Owns', 'Change it when…'],
              rows: [
                ['`angular.json`', 'Build targets, budgets, assets, styles, file replacements, SSR/prerender options', 'Adding global styles, tightening budgets, configuring environments'],
                ['`tsconfig.json`', 'TypeScript strictness and `angularCompilerOptions` (`strictTemplates`, `strictInjectionParameters`)', 'Enabling stricter checks — do this early, it is painful later'],
                ['`app.config.ts`', 'Runtime providers for the whole app', 'Adding router features, HTTP interceptors, hydration, global error handling'],
                ['`app.routes.ts`', 'The URL → component map', 'Adding pages and lazy features'],
                ['`package.json`', 'Exact versions of `@angular/*` packages (they must all match)', 'Only through `ng update`, never by hand-editing one package'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Recent CLI versions generate shorter file names (`app.ts` rather than `app.component.ts`) following the updated style guide. Both conventions work — match whatever the codebase you are in already uses.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Upgrading by bumping versions in `package.json` skips the automated migrations that `ng update` runs — and those migrations are where breaking changes (renamed APIs, changed defaults like OnPush in v22) get rewritten for you. Always upgrade **one major at a time** with `ng update @angular/core@N @angular/cli@N`, commit, then do the next.',
            },
          ],
        },
        {
          id: 'components-and-templates',
          title: 'Components: The Building Block',
          summary:
            'A component is a TypeScript class decorated with `@Component`, pairing a template (what to render) with a class (the data and behaviour behind it) and scoped styles.',
          keyPoints: [
            '`selector` is the custom HTML tag (`app-product-card`) used to place the component in another template.',
            '`template`/`templateUrl` hold the HTML; `styles`/`styleUrl` hold CSS that is **scoped to this component** by default (emulated view encapsulation).',
            '`imports` lists every component, directive, and pipe the template uses — standalone components declare their own dependencies directly.',
            'Components are standalone by default since Angular 19; you no longer write `standalone: true`, and you do not need an `NgModule` to declare them.',
            'Class fields are available in the template; keep logic in the class and keep the template declarative. Mark template-only members `protected` so they are not part of the public API.',
            'Since v22, components use `ChangeDetectionStrategy.OnPush` **by default**; the old always-check behaviour is now called `Eager` and must be opted into explicitly.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'product-card.ts',
              code: `import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Product { id: number; name: string; price: number; inStock: boolean; }

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  template: \`
    <article class="card">
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency }}</p>
      <button [disabled]="!product().inStock" (click)="addToCart.emit(product())">
        Add to cart
      </button>
    </article>
  \`,
  styles: \`.card { border: 1px solid #ddd; padding: 1rem; border-radius: 8px; }\`,
})
export class ProductCard {
  product = input.required<Product>();
  addToCart = output<Product>();
}`,
            },
            {
              type: 'code',
              language: 'html',
              title: 'using it from a parent template',
              code: `<!-- parent component must list ProductCard in its imports -->
@for (p of products(); track p.id) {
  <app-product-card [product]="p" (addToCart)="cart.add($event)" />
}`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Class["Component class<br/>state and methods"] -- "property binding / interpolation" --> Template["Template<br/>HTML + Angular syntax"]
    Template -- "event binding" --> Class
    Styles["Scoped styles"] --> Template
    Template --> DOM["Rendered DOM<br/>host element: app-product-card"]`,
            },
            {
              type: 'heading',
              text: 'The host element and component metadata worth knowing',
            },
            {
              type: 'p',
              text: 'Every component renders *inside* a real DOM element — its **host element** (`<app-product-card>`). The host is a custom element the browser treats as an unknown inline element, so it has `display: inline` by default; a very common layout surprise is a card component whose host does not behave like a block. Fix it with `:host { display: block; }` in the component styles, and bind classes, attributes, and listeners on the host with the `host` metadata rather than wrapping everything in an extra `<div>`.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'host bindings, encapsulation, and explicit strategy',
              code: `@Component({
  selector: 'app-alert',
  template: \`<ng-content />\`,
  styles: \`:host { display: block; padding: .75rem; border-radius: 6px; }
           :host(.danger) { background: #fde8e8; }\`,
  host: {
    role: 'alert',
    '[class.danger]': 'level() === "danger"',
    '(click)': 'dismissed.emit()',
  },
  // OnPush is the default since v22; older versions need this line explicitly
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
  level = input<'info' | 'danger'>('info');
  dismissed = output<void>();
}`,
            },
            {
              type: 'table',
              headers: ['ViewEncapsulation', 'How styles are scoped', 'Use when'],
              rows: [
                ['`Emulated` (default)', 'Compiler adds `_ngcontent-*` / `_nghost-*` attributes and rewrites selectors', 'Almost always'],
                ['`ShadowDom`', 'Real browser Shadow DOM; global styles do not leak in', 'Web components / strict isolation (watch out: global themes and fonts stop applying)'],
                ['`None`', 'Styles become global', 'Rarely — theming a third-party widget; prefer a global stylesheet instead'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Forgetting to add a child component, directive, or pipe to `imports` is the most common beginner error in standalone Angular. The compiler reports it as *"is not a known element"* (for a component) or *"No pipe found with name"* — the fix is almost always a missing import, not a missing module.',
            },
          ],
        },
        {
          id: 'template-syntax-and-binding',
          title: 'Template Syntax and Data Binding',
          summary:
            'Angular templates connect class and DOM with four binding forms: interpolation and property binding (class → DOM), event binding (DOM → class), and two-way binding (both).',
          keyPoints: [
            '**Interpolation** `{{ expr }}` renders a value as text.',
            '**Property binding** `[prop]="expr"` sets a DOM property or component input — note it binds a *property*, not an HTML attribute.',
            '**Event binding** `(event)="handler($event)"` calls a method when a DOM event or component output fires.',
            '**Two-way binding** `[(value)]="field"` — "banana in a box" — is sugar for a property binding plus an `xxxChange` event binding.',
            '`[class.active]`, `[style.width.px]`, and `[attr.aria-label]` target a single class, style, or real HTML attribute.',
            '**Template reference variables** (`#nameInput`) give the template a handle to an element or component instance.',
            '`@let name = expr;` declares a read-only local variable in the template — handy for avoiding repeated signal reads or `async` pipes.',
            'Template expressions are a restricted TypeScript subset: no assignments (except in event handlers), no `new`, no globals like `window` or `console` — only members of the component class plus template-local variables.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'html',
              title: 'all the binding forms in one template',
              code: `<!-- interpolation -->
<h2>Hello, {{ user().name }}!</h2>

<!-- property binding: DOM property / component input -->
<img [src]="user().avatarUrl" [alt]="user().name" />
<button [disabled]="isSaving()">Save</button>

<!-- event binding -->
<button (click)="save()">Save</button>
<input (keyup.enter)="search(box.value)" #box />

<!-- class, style, and attribute bindings -->
<li [class.selected]="item.id === selectedId()">{{ item.label }}</li>
<div [style.width.%]="progress()"></div>
<td [attr.colspan]="span">...</td>

<!-- two-way binding (needs FormsModule for ngModel) -->
<input [(ngModel)]="query" />
<p>You typed: {{ query }}</p>`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    C["Component class"]
    D["DOM / child component"]
    C -- "{{ value }}  interpolation" --> D
    C -- "[property]  property binding" --> D
    D -- "(event)  event binding" --> C
    C <-- "[(ngModel)]  two-way binding" --> D`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Property vs attribute is a real distinction. `<input [value]="name">` sets the live `value` *property*; HTML attributes only set the *initial* value. Attributes that have no matching DOM property (like `colspan` or ARIA attributes) need `[attr.x]` binding instead.',
            },
            {
              type: 'code',
              language: 'html',
              title: '@let, template literals, and safe navigation',
              code: `@let user = currentUser();
@let total = cart.total();

<h2>{{ \`Hi \${user?.firstName ?? 'guest'}\` }}</h2>   <!-- untagged template literal -->
<p>Total: {{ total | currency }}</p>
<p>Plan: {{ user?.subscription?.plan }}</p>           <!-- ?. yields undefined since v22 (was null) -->`,
            },
            {
              type: 'p',
              text: '**How a binding is evaluated.** For each binding the compiler generates an update instruction that evaluates the expression and compares the result with the value stored from the previous check using `Object.is`-style identity. Only if it differs does Angular touch the DOM. This is why identity matters so much in Angular: a getter that returns a *new* array or object every time (`get items() { return this.all.filter(...) }`) is always "different", and in dev mode it trips the `ExpressionChangedAfterItHasBeenChecked` error (`NG0100`) when the value changes between the check and the dev-mode verification pass.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Template expressions should be cheap and side-effect free — they are re-evaluated whenever change detection checks the component. Avoid calling ordinary methods that do real work from templates; read a signal or a `computed()` instead, which caches its result.',
            },
          ],
        },
        {
          id: 'control-flow',
          title: 'Built-in Control Flow: @if, @for, @switch',
          summary:
            'Since Angular 17 templates use built-in block syntax — `@if`, `@for`, `@switch` — instead of the `*ngIf`/`*ngFor`/`ngSwitch` structural directives, with better type narrowing and a mandatory `track` expression for lists.',
          keyPoints: [
            '`@if (cond) { … } @else if (other) { … } @else { … }` — and `@if (user(); as u)` aliases the result for use inside the block.',
            '`@for (item of items(); track item.id) { … } @empty { … }` — `track` is **required** and tells Angular how to identify each item across re-renders.',
            '`@for` exposes implicit variables: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`.',
            '`@switch (value) { @case (\'a\') { … } @default { … } }` replaces the `ngSwitch` directive trio.',
            'Blocks are part of the compiler, not directives — no import needed, and the compiled output is faster than the directive equivalents.',
            'Because the compiler understands the blocks, `@if` and `@switch` **narrow types** like TypeScript does: inside `@case (\'error\')` on a discriminated union, the error-only fields are type-safe.',
            '`*ngIf`, `*ngFor`, and `*ngSwitch` are deprecated; plan to migrate with `ng generate @angular/core:control-flow`.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'html',
              title: 'modern control flow',
              code: `@if (user(); as u) {
  <p>Welcome back, {{ u.name }}</p>
} @else {
  <button (click)="login()">Log in</button>
}

<ul>
  @for (todo of todos(); track todo.id; let i = $index, last = $last) {
    <li [class.last]="last">{{ i + 1 }}. {{ todo.title }}</li>
  } @empty {
    <li>Nothing to do 🎉</li>
  }
</ul>

@switch (status()) {
  @case ('loading') { <app-spinner /> }
  @case ('error')   { <p class="error">Something went wrong.</p> }
  @default          { <app-results [items]="results()" /> }
}`,
            },
            {
              type: 'code',
              language: 'html',
              title: 'the legacy equivalent you will see in older code',
              code: `<p *ngIf="user as u; else loginBtn">Welcome back, {{ u.name }}</p>
<ng-template #loginBtn><button (click)="login()">Log in</button></ng-template>

<li *ngFor="let todo of todos; trackBy: trackById; let i = index">
  {{ i + 1 }}. {{ todo.title }}
</li>`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'type narrowing with a discriminated union',
              code: `type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; items: Product[] };

@Component({
  selector: 'app-list',
  template: \`
    @let s = state();            <!-- read the signal once into a local -->
    @switch (s.status) {
      @case ('loading') { <app-spinner /> }
      @case ('error')   { <p>{{ s.message }}</p> }   <!-- narrowed: message exists -->
      @case ('ok')      { <app-grid [items]="s.items" /> }
    }
  \`,
})
export class List {
  state = input.required<LoadState>();
}`,
            },
            {
              type: 'p',
              text: '**How `@for` reconciles.** When the collection changes, Angular computes the track key for every new item, matches keys against the existing views, and then performs the minimum set of operations: reuse views whose key is unchanged (updating only their bindings), move views whose position changed, create views for new keys, and destroy views for removed keys. The `track` expression is evaluated for every item on every change, so keep it a trivial property read — never call a function that does work.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '`track` is not boilerplate — it is the equivalent of React\'s `key`. Tracking by a stable id lets Angular move existing DOM nodes when a list is reordered or filtered. `track $index` re-uses DOM nodes by *position*, which is fine for static lists but causes wrong state (focused inputs, animations, child component state) to stick to the wrong row when items are inserted or removed. The CLI ships a migration (`ng generate @angular/core:control-flow`) to convert old templates.',
            },
          ],
        },
        {
          id: 'component-communication',
          title: 'Component Communication: input(), output(), model()',
          summary:
            'Data flows down through signal-based inputs, events flow up through outputs, and `model()` creates a two-way bindable input — with view queries and services covering the cases that parent/child bindings cannot.',
          keyPoints: [
            '`input<T>()` / `input.required<T>()` declare inputs as **read-only signals** — read them as `this.name()` and derive from them with `computed()`.',
            'Inputs support `transform` (e.g. `booleanAttribute`, `numberAttribute`) and `alias` options.',
            '`output<T>()` declares an event; the parent listens with `(eventName)="…"` and the child calls `.emit(value)`.',
            '`model<T>()` is a writable input: the child can `.set()` it, and the parent binds with `[(value)]` two-way syntax.',
            '`viewChild()` / `viewChildren()` / `contentChild()` query child elements or components as signals.',
            'For siblings or distant components, share a **service** rather than threading inputs/outputs through every layer.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a rating widget using all three',
              code: `import { Component, booleanAttribute, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: \`
    @for (star of stars(); track star) {
      <button [disabled]="readonly()" (click)="rate(star)">
        {{ star <= value() ? '★' : '☆' }}
      </button>
    }
  \`,
})
export class Rating {
  max = input(5);                                        // optional input, default 5
  readonly = input(false, { transform: booleanAttribute }); // <app-rating readonly />
  value = model(0);                                      // two-way bindable
  rated = output<number>();                              // event

  stars = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));

  rate(star: number) {
    this.value.set(star);   // updates the parent's bound signal too
    this.rated.emit(star);
  }
}`,
            },
            {
              type: 'code',
              language: 'html',
              title: 'parent template',
              code: `<app-rating [max]="10" [(value)]="score" (rated)="saveRating($event)" />
<p>Current score: {{ score() }}</p>`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Parent["Parent component"]
    Child["Child component"]
    Svc["Shared service<br/>signal state"]
    Parent -- "input: [max]=10" --> Child
    Child -- "output: (rated)" --> Parent
    Parent <-- "model: [(value)]" --> Child
    Parent -. "viewChild query" .-> Child
    Sibling["Distant / sibling component"] <--> Svc
    Parent <--> Svc`,
            },
            {
              type: 'table',
              headers: ['Need', 'Signal API (modern)', 'Decorator API (legacy)'],
              rows: [
                ['Data in', '`name = input<string>()`', '`@Input() name?: string`'],
                ['Required data in', '`name = input.required<string>()`', '`@Input({ required: true }) name!: string`'],
                ['Event out', '`saved = output<Item>()`', '`@Output() saved = new EventEmitter<Item>()`'],
                ['Two-way', '`value = model(0)`', '`@Input() value` + `@Output() valueChange`'],
                ['Child query', '`chart = viewChild.required(ChartCmp)`', '`@ViewChild(ChartCmp) chart!: ChartCmp`'],
                ['React to input change', '`computed()` / `effect()`', '`ngOnChanges(changes)`'],
                ['Observable as output', '`outputFromObservable(obs$)`', '`@Output() x = obs$` (worked by accident)'],
              ],
            },
            {
              type: 'p',
              text: '**Why signal inputs are a real improvement, not just new syntax.** With decorator inputs, a value could change at any time and you had to remember to react in `ngOnChanges`, comparing `SimpleChanges` by hand. A signal input is a read-only signal that Angular sets before each check of the component, so anything derived from it — `computed(() => this.price() * this.qty())` — is always consistent, with no lifecycle hook. Inputs are also read-only from inside the child (you cannot accidentally overwrite the parent\'s value), which removes a whole class of "the child mutated its input and the parent overwrote it again" bugs. When the child genuinely needs to change the value, that is what `model()` is for — it makes the two-way contract explicit.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Passing a mutable object through an input and then mutating it inside the child (`this.user().name = \'x\'`) silently changes the parent\'s data without any change notification — the parent\'s OnPush view will not update, and other consumers see inconsistent state. Treat inputs as immutable; emit an output or use `model()` to request a change.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The older decorator API — `@Input() name!: string;`, `@Output() changed = new EventEmitter<string>();`, `@ViewChild(\'ref\') el!: ElementRef;` — still works. The signal-based functions are preferred for new code because inputs become reactive values you can `computed()` from directly, instead of needing `ngOnChanges` to react to changes.',
            },
          ],
        },
        {
          id: 'signals',
          title: 'Signals: Angular\'s Reactivity Model',
          summary:
            'A signal is a reactive value container that notifies its consumers when it changes — `signal()` holds state, `computed()` derives from it, `effect()` runs side effects, and `linkedSignal()` holds state that resets when a source changes.',
          keyPoints: [
            'Read a signal by **calling** it: `count()`. Write with `.set(v)` or `.update(prev => next)`.',
            '`computed(() => …)` is lazily evaluated and memoized; it tracks exactly the signals it read during its last run and recomputes only when one of them changes.',
            '`effect(() => …)` runs whenever the signals it reads change — reserve it for side effects that leave Angular (logging, `localStorage`, imperative third-party APIs), not for deriving state.',
            '`linkedSignal()` is writable state whose value resets from a source signal, e.g. "the selected item, reset to the first item whenever the list changes".',
            'Signals let Angular know **exactly which components** need re-rendering, which is what makes zoneless change detection possible.',
            'Signals and immutability: `.update()` should return a new array/object — mutating in place does not change the reference, so consumers are not notified.',
            'Signals use **push-pull** propagation: a write pushes a "maybe dirty" flag through the dependency graph, and values are pulled (recomputed) lazily only when someone reads them — so there are no glitches (inconsistent intermediate states) and no wasted computation.',
            '`untracked(() => …)` reads a signal without creating a dependency; a custom `equal` function on `signal()`/`computed()` controls when a new value counts as a change.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'signal, computed, effect, linkedSignal',
              code: `import { Component, computed, effect, linkedSignal, signal } from '@angular/core';

interface Item { id: number; name: string; price: number; qty: number; }

@Component({ selector: 'app-cart', template: \`...\` })
export class Cart {
  items = signal<Item[]>([]);
  discountPct = signal(0);

  // derived, memoized, read-only
  subtotal = computed(() => this.items().reduce((s, i) => s + i.price * i.qty, 0));
  total = computed(() => this.subtotal() * (1 - this.discountPct() / 100));

  // writable, but resets to the first item whenever items() changes
  selected = linkedSignal(() => this.items()[0] ?? null);

  constructor() {
    // side effect: persist outside Angular
    effect(() => localStorage.setItem('cart', JSON.stringify(this.items())));
  }

  add(item: Item) {
    this.items.update(list => [...list, item]);   // new array — consumers are notified
  }
}`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    items["signal: items"] --> subtotal["computed: subtotal"]
    subtotal --> total["computed: total"]
    discount["signal: discountPct"] --> total
    items --> selected["linkedSignal: selected"]
    items --> eff["effect: save to localStorage"]
    total --> tpl["Template reads total()"]
    selected --> tpl`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The most common signals mistake is using `effect()` to copy one signal into another (`effect(() => this.b.set(this.a() * 2))`). That creates an extra change-detection pass and timing bugs; use `computed()` for derived values, and `linkedSignal()` when the derived value must also be locally writable.',
            },
            {
              type: 'heading',
              text: 'How signals work under the hood',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Tracking.** While a `computed`, `effect`, or template is executing, Angular sets it as the *active consumer*. Every signal read during that execution registers itself as a producer of that consumer. Dependencies are therefore **dynamic**: a `computed` that reads `a()` only inside an `if` branch depends on `a` only while that branch runs.',
                '**Notification (push).** `set()` bumps the signal\'s version and walks its consumers, marking them *possibly stale*. Nothing is recomputed yet. For templates, being marked stale schedules change detection for that specific view.',
                '**Re-evaluation (pull).** When a stale `computed` is next read, it checks whether any producer\'s version actually changed; only then does it rerun its function. If the new value is `equal` to the old one, *its* consumers are not considered changed — so a `computed` acts as a firewall that stops unnecessary downstream work.',
                '**Effects** are scheduled, not run synchronously: *root* effects (created outside components, e.g. in services) run during application change detection before the component tree is refreshed, and *view* effects (created in components) run as part of checking their component. Multiple writes in the same task therefore produce one effect run with the final values.',
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'untracked, custom equality, and effect cleanup',
              code: `import { computed, effect, signal, untracked } from '@angular/core';

const filters = signal({ q: '', page: 1 }, {
  // treat structurally equal objects as "no change" to avoid needless refetches
  equal: (a, b) => a.q === b.q && a.page === b.page,
});
const user = signal<User | null>(null);

effect((onCleanup) => {
  const { q } = filters();                       // tracked
  const name = untracked(() => user()?.name);    // read without subscribing
  const timer = setTimeout(() => analytics.track('search', { q, name }), 500);
  onCleanup(() => clearTimeout(timer));          // runs before the next run and on destroy
});`,
            },
            {
              type: 'table',
              headers: ['Primitive', 'Writable?', 'Lazy?', 'Use for'],
              rows: [
                ['`signal()`', 'Yes', 'n/a', 'Source state owned by a component or service'],
                ['`computed()`', 'No', 'Yes, memoized', 'Pure derivations — the default choice for anything derived'],
                ['`linkedSignal()`', 'Yes', 'Yes', 'State that resets/derives from a source but can be locally overridden'],
                ['`resource()` / `httpResource()`', 'Value can be set locally', 'Fetches when params change', 'Async data that depends on signals'],
                ['`effect()`', 'n/a', 'Scheduled', 'Side effects that leave the signal graph (DOM, storage, logging)'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Signals vs RxJS: signals model *values that change over time* and are always synchronously readable; Observables model *streams of events over time*, with powerful operators for timing and cancellation. They are complementary — `toSignal()` and `toObservable()` from `@angular/core/rxjs-interop` convert between them.',
            },
          ],
        },
        {
          id: 'dependency-injection',
          title: 'Services and Dependency Injection',
          summary:
            'Angular\'s hierarchical dependency injection creates and shares instances of services for you: a class asks for what it needs with `inject()`, and the injector tree decides which instance it gets.',
          keyPoints: [
            'A **service** is a plain class for logic or state not tied to one view — data access, auth, logging, shared state.',
            '`@Injectable({ providedIn: \'root\' })` registers an app-wide singleton that is also tree-shakable (dropped from the bundle if never injected).',
            '`inject(ProductService)` retrieves a dependency; it works in constructors, field initializers, and factory functions (an *injection context*). Constructor parameter injection is the older equivalent.',
            'Injectors form a **hierarchy**: environment injectors (root, lazy-loaded routes) and element injectors (a component\'s `providers`). Lookup walks up the tree to the nearest provider.',
            'Providing a service in a component\'s `providers` gives each instance of that component its own copy.',
            '`InjectionToken` provides non-class values (config objects, feature flags); `useClass`, `useValue`, `useFactory`, `useExisting` control how a provider creates its value.',
            'Resolution modifiers change the lookup: `inject(X, { optional: true })`, `{ self: true }`, `{ skipSelf: true }`, `{ host: true }`.',
            'Angular 22 adds `@Service()` — shorthand for `@Injectable({ providedIn: \'root\' })` that requires `inject()`-based dependencies — and the CLI now generates services with it.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a service, a token, and injection',
              code: `import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AppConfig { apiUrl: string; }
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  readonly favorites = signal<number[]>([]);

  getAll() {
    return this.http.get<Product[]>(\`\${this.config.apiUrl}/products\`);
  }
}

// app.config.ts
providers: [
  { provide: APP_CONFIG, useValue: { apiUrl: 'https://api.example.com' } },
]

// in any component
export class ProductList {
  private products = inject(ProductService);
}`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Platform["Platform injector"] --> Root["Root environment injector<br/>providedIn root singletons"]
    Root --> Lazy["Lazy route environment injector<br/>route-level providers"]
    Root --> AppEl["App component element injector"]
    AppEl --> ListEl["ProductList element injector<br/>component providers"]
    ListEl --> CardEl["ProductCard element injector"]
    CardEl -. "inject: looks up the tree to the nearest provider" .-> Root`,
            },
            {
              type: 'heading',
              text: 'Provider recipes you will use in real apps',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'factories, multi providers, abstract tokens, and feature-scoped providers',
              code: `// 1. Program to an abstraction: components depend on the abstract class
export abstract class Logger { abstract log(msg: string): void; }
@Injectable() export class ConsoleLogger extends Logger { log(m: string) { console.log(m); } }
@Injectable() export class RemoteLogger extends Logger { /* ships logs to a backend */ log(m: string) {} }

// 2. A factory decides at runtime which implementation to use
{ provide: Logger, useFactory: () => isDevMode() ? new ConsoleLogger() : new RemoteLogger() }

// 3. Multi providers: many contributions collected into one array
export const VALIDATION_RULES = new InjectionToken<Rule[]>('VALIDATION_RULES');
providers: [
  { provide: VALIDATION_RULES, useValue: noEmptyName, multi: true },
  { provide: VALIDATION_RULES, useValue: maxLength200, multi: true },
]
const rules = inject(VALIDATION_RULES);   // [noEmptyName, maxLength200]

// 4. Feature-scoped state: lives and dies with a lazy route
export const ADMIN_ROUTES: Routes = [{
  path: '',
  providers: [AdminStore],               // a separate instance for the admin feature only
  children: [/* ... */],
}];

// 5. Bundle related providers behind one function (the provideX() convention)
export function provideAnalytics(cfg: AnalyticsConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ANALYTICS_CONFIG, useValue: cfg },
    provideAppInitializer(() => inject(AnalyticsService).init()),
  ]);
}`,
            },
            {
              type: 'p',
              text: '**Why the abstraction matters.** Because consumers ask for `Logger` rather than a concrete class, you swap implementations per environment, per feature, or per test without touching a single consumer. Abstract classes make good DI tokens because they exist at runtime (TypeScript interfaces do not), so they can be both the type *and* the token. `provideAppInitializer()` replaced the old `APP_INITIALIZER` multi-token for work that must finish before the app starts — keep it fast, because it delays first render.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'DI is what makes Angular code easy to test: in a test you swap the real service for a fake with `{ provide: ProductService, useValue: fakeService }`, and the component under test never knows the difference.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '`inject()` only works inside an injection context. Calling it inside a `setTimeout`, an event handler, or `ngOnInit` throws `NG0203`. Call it in a field initializer or constructor and store the result, or use `runInInjectionContext()` when you genuinely need it later.',
            },
          ],
        },
        {
          id: 'lifecycle-hooks',
          title: 'Component Lifecycle Hooks',
          summary:
            'Angular calls lifecycle hook methods at defined moments — after inputs are set, after the view renders, and before destruction — and modern code increasingly replaces them with signals, `afterNextRender`, and `DestroyRef`.',
          keyPoints: [
            '`constructor` — the class is created; use for `inject()` calls. Inputs are **not** set yet.',
            '`ngOnInit` — runs once after the first inputs are set; the classic place for initialization that depends on inputs.',
            '`ngOnChanges(changes)` — runs when decorator-based `@Input()`s change; with signal inputs a `computed()` or `effect()` usually replaces it.',
            '`ngAfterViewInit` — the component\'s view and child views exist; `@ViewChild` results are available.',
            '`ngOnDestroy` — clean up subscriptions, timers, and listeners. `inject(DestroyRef).onDestroy(fn)` is the composable alternative.',
            '`afterNextRender()` / `afterEveryRender()` / `afterRenderEffect()` run after Angular has updated the DOM — the right place for direct DOM measurement or third-party DOM libraries, and they never run during server-side rendering.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    C["constructor<br/>inject dependencies"] --> Ch1["ngOnChanges<br/>first input values"]
    Ch1 --> Init["ngOnInit"]
    Init --> DC["ngDoCheck"]
    DC --> ACI["ngAfterContentInit / Checked<br/>projected content ready"]
    ACI --> AVI["ngAfterViewInit / Checked<br/>own view ready"]
    AVI --> R["afterNextRender<br/>DOM painted, browser only"]
    R -- "inputs change" --> Ch2["ngOnChanges"]
    Ch2 --> DC
    R -- "component removed" --> D["ngOnDestroy / DestroyRef callbacks"]`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'lifecycle in practice',
              code: `import { Component, DestroyRef, ElementRef, OnInit, afterNextRender, inject, input } from '@angular/core';

@Component({ selector: 'app-chart', template: '<canvas #c></canvas>' })
export class Chart implements OnInit {
  data = input.required<number[]>();
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // inputs are available here
    console.log('initial points', this.data().length);
  }

  constructor() {
    afterNextRender(() => {
      // safe to touch the real DOM; does not run on the server
      const chart = createThirdPartyChart(this.el.nativeElement.querySelector('canvas'));
      this.destroyRef.onDestroy(() => chart.dispose());
    });
  }
}`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'render phases: avoiding layout thrashing',
              code: `constructor() {
  afterNextRender({
    // phases run in order earlyRead -> write -> mixedReadWrite -> read across ALL components,
    // and each phase receives the previous phase's return value
    earlyRead: () => this.el.nativeElement.getBoundingClientRect().height,
    write: (height) => { this.tooltip.style.top = height + 'px'; },
  });

  // afterRenderEffect: like effect(), but runs after rendering and only when
  // the signals it reads change — ideal for syncing a signal to a DOM library
  afterRenderEffect(() => this.chart?.setData(this.data()));
}`,
            },
            {
              type: 'p',
              text: 'The phase split (`earlyRead`, `write`, `mixedReadWrite`, `read`) exists because the browser recomputes layout whenever you read geometry after a write. If twenty components each "read, then write" in turn, the browser performs twenty forced layouts; with phases, Angular runs every component\'s reads, then every write, giving a single layout. `afterRender` was renamed `afterEveryRender` in v20 — use it sparingly, because it runs after *every* change detection cycle.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Reading inputs in the `constructor` is a classic bug: they are still `undefined` (or a signal input throws `NG0950` when a required input is read too early). Anything that depends on inputs belongs in `ngOnInit`, a `computed()`, or an `effect()`.',
            },
          ],
        },
        {
          id: 'directives',
          title: 'Directives: Attribute, Structural, and Host Directives',
          summary:
            'A directive adds behaviour to an existing element without its own template — attribute directives change appearance or behaviour, structural directives add and remove DOM, and host directives compose behaviours onto components.',
          keyPoints: [
            'Components are directives with a template; plain `@Directive`s attach to elements matched by their `selector` (usually an attribute like `[appHighlight]`).',
            'The `host` metadata binds properties, classes, attributes, and listeners on the host element — preferred over the older `@HostBinding`/`@HostListener` decorators.',
            'Structural directives (the `*` prefix) operate on an `<ng-template>` via `TemplateRef` and `ViewContainerRef` to create and destroy views.',
            'Built-in attribute directives: `NgClass`, `NgStyle`, `NgModel`; `NgOptimizedImage` (`ngSrc`) for images. In new code prefer native `[class]`/`[style]` bindings over `NgClass`/`NgStyle` — they are compiled in and cheaper.',
            '`hostDirectives` lets a component or directive apply other standalone directives to its own host — composition instead of inheritance.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'an attribute directive with host bindings',
              code: `import { Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': 'active() ? color() : null',
    '(mouseenter)': 'active.set(true)',
    '(mouseleave)': 'active.set(false)',
  },
})
export class Highlight {
  color = input('yellow', { alias: 'appHighlight' });
  protected active = signal(false);
}

// usage: <p appHighlight="lightblue">Hover me</p>`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a small structural directive: *appIfRole',
              code: `import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

@Directive({ selector: '[appIfRole]' })
export class IfRole {
  private tpl = inject(TemplateRef<unknown>);
  private vcr = inject(ViewContainerRef);
  private auth = inject(AuthService);

  appIfRole = input.required<string>();

  constructor() {
    effect(() => {
      this.vcr.clear();
      if (this.auth.roles().includes(this.appIfRole())) {
        this.vcr.createEmbeddedView(this.tpl);
      }
    });
  }
}

// usage: <button *appIfRole="'admin'">Delete user</button>`,
            },
            {
              type: 'p',
              text: 'The `*` is pure syntactic sugar: `<button *appIfRole="\'admin\'">` is rewritten by the compiler into `<ng-template [appIfRole]="\'admin\'"><button>…</button></ng-template>`. The directive receives that template as `TemplateRef` and decides when to stamp it into its `ViewContainerRef`. Note that the example above destroys and recreates the view on every role change; a production version would remember whether the view is currently shown and only create or clear it when the condition actually flips, so child component state is not reset needlessly.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'composition with hostDirectives',
              code: `@Directive({ selector: '[appFocusRing]', host: { '[class.focus-ring]': 'true' } })
export class FocusRing {}

@Directive({ selector: '[appTooltip]' })
export class Tooltip { tooltipText = input(''); }

@Component({
  selector: 'app-icon-button',
  hostDirectives: [
    FocusRing,
    { directive: Tooltip, inputs: ['tooltipText: label'] },   // expose as <app-icon-button label="…">
  ],
  template: \`<ng-content />\`,
})
export class IconButton {}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`hostDirectives: [Highlight, { directive: Tooltip, inputs: [\'tooltipText\'] }]` on a component bakes those behaviours in for every usage, without consumers having to remember to add the attributes — a clean way to build design-system components out of small reusable behaviours.',
            },
          ],
        },
        {
          id: 'pipes',
          title: 'Pipes: Transforming Values in Templates',
          summary:
            'Pipes are pure, reusable functions applied in templates with `|` to format values for display — dates, currency, casing, JSON — and custom pipes are a small class with a `transform` method.',
          keyPoints: [
            'Built-ins from `@angular/common`: `DatePipe`, `CurrencyPipe`, `DecimalPipe`, `PercentPipe`, `UpperCasePipe`, `LowerCasePipe`, `TitleCasePipe`, `SlicePipe`, `JsonPipe`, `KeyValuePipe`, `AsyncPipe`.',
            'Pipes take arguments after colons: `{{ when | date:\'shortDate\' }}`, and can be chained: `{{ name | slice:0:20 | uppercase }}`.',
            'Pipes are **pure** by default — Angular only re-runs them when the input reference changes, which makes them a cheap, cached alternative to calling methods in templates.',
            'An **impure** pipe (`pure: false`) runs on every change detection pass — powerful but expensive; `AsyncPipe` is the classic impure pipe.',
            '`AsyncPipe` (`| async`) subscribes to an Observable or Promise, renders its latest value, and unsubscribes automatically when the view is destroyed.',
            'A pure pipe instance memoizes only its **last** call (one cache slot per usage in the template) — it is not a global cache, so an expensive pipe inside a long `@for` still runs once per row.',
            'Pipes can `inject()` services (e.g. `LOCALE_ID` for formatting), which is something a `computed()` in a presentational component cannot do as reusably.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a custom pure pipe',
              code: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string, now: Date = new Date()): string {
    const seconds = Math.floor((now.getTime() - new Date(value).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' h ago';
    return Math.floor(seconds / 86400) + ' d ago';
  }
}`,
            },
            {
              type: 'code',
              language: 'html',
              title: 'using pipes in a template',
              code: `<p>{{ order.total | currency:'EUR' }}</p>
<p>Placed {{ order.createdAt | timeAgo }}</p>
<p>{{ order.createdAt | date:'medium' }}</p>
<pre>{{ order | json }}</pre>

@if (user$ | async; as user) {
  <p>{{ user.name | titlecase }}</p>
}`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Because pure pipes only re-run when the input *reference* changes, mutating an array in place (`items.push(x)`) will not re-run a pure `filter` pipe — the template shows stale output. Create a new array instead, which is the same immutability rule signals follow.',
            },
          ],
        },
        {
          id: 'routing',
          title: 'Routing, Lazy Loading, and Guards',
          summary:
            'The Angular Router maps URLs to components, lazy-loads route code on demand, binds route parameters directly to component inputs, and protects routes with functional guards and resolvers.',
          keyPoints: [
            'Routes are an array of `{ path, component }` objects passed to `provideRouter(routes)`; `<router-outlet />` marks where the matched component renders.',
            'Navigate declaratively with `routerLink` (plus `routerLinkActive` for styling) or imperatively with `inject(Router).navigate([...])`.',
            '`loadComponent: () => import(…)` and `loadChildren: () => import(…)` split routes into separate bundles loaded only when visited.',
            '`withComponentInputBinding()` binds `:id` path params, query params, and resolved data directly to component `input()`s.',
            'Guards are plain functions: `CanActivateFn`, `CanMatchFn`, `CanDeactivateFn`; returning a `UrlTree` redirects.',
            '`ResolveFn` loads data before the route activates; child routes, wildcard `**` routes, and `redirectTo` cover nesting and not-found pages.',
            'Router features are opt-in functions: `withComponentInputBinding()`, `withViewTransitions()`, `withInMemoryScrolling({ scrollPositionRestoration: \'enabled\' })`, `withPreloading(PreloadAllModules)`, `withRouterConfig({...})`.',
            'Since v22, `paramsInheritanceStrategy` defaults to `\'always\'` — child routes see their parents\' params and data. Code that relied on the old empty-path-only inheritance may need review (no automatic migration).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'app.routes.ts',
              code: `import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () => import('./products/product-list').then(m => m.ProductList),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./products/product-detail').then(m => m.ProductDetail),
    resolve: { product: productResolver },
  },
  {
    path: 'admin',
    canMatch: [authGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  { path: '**', loadComponent: () => import('./not-found').then(m => m.NotFound) },
];`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a functional guard and input binding',
              code: `// auth.guard.ts
export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

// product-detail.ts — :id and resolved data arrive as inputs
export class ProductDetail {
  id = input.required<string>();        // from the :id path param
  product = input.required<Product>();  // from resolve: { product }
}`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant U as User
    participant R as Router
    participant G as authGuard
    participant L as Lazy chunk
    participant C as AdminComponent
    U->>R: navigate to /admin
    R->>G: canMatch?
    alt not logged in
        G-->>R: UrlTree to /login
        R-->>U: redirect to /login
    else logged in
        G-->>R: true
        R->>L: import admin.routes
        L-->>R: ADMIN_ROUTES
        R->>C: create component in router-outlet
    end`,
            },
            {
              type: 'table',
              headers: ['Hook', 'Runs', 'Typical use'],
              rows: [
                ['`canMatch`', 'While matching — before the route (and its lazy chunk) is chosen', 'Feature flags, role-based route variants, keeping admin code off non-admin devices'],
                ['`canActivate`', 'After matching, before activation', 'Auth checks on already-loaded routes'],
                ['`canActivateChild`', 'Before any child route activates', 'One check for a whole subtree'],
                ['`canDeactivate`', 'Before leaving the current route', '"You have unsaved changes" prompts'],
                ['`resolve`', 'After guards pass, before activation', 'Critical data the page cannot render without'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Resolvers block navigation: the user clicks and nothing visibly happens until the data arrives. For most pages it is better UX to navigate immediately and show a skeleton while an `httpResource` loads. Keep resolvers for small, critical data (e.g. a permission set) or when SEO/SSR requires the data before render.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Guards run in the browser, so they are a **UX** feature, not security. A user can always call your API directly — every protected endpoint must enforce authorization on the server. `canMatch` is preferable to `canActivate` for lazy routes because it prevents the lazy bundle from even being downloaded for unauthorized users.',
            },
          ],
        },
        {
          id: 'forms',
          title: 'Forms: Template-Driven vs Reactive',
          summary:
            'Angular has two mature form APIs — template-driven forms (`ngModel`, logic in the template) for simple cases and reactive forms (`FormGroup`/`FormControl`, logic in the class) for anything complex, dynamic, or heavily validated.',
          keyPoints: [
            '**Template-driven** (`FormsModule`): bind with `[(ngModel)]`, validate with HTML attributes like `required`; quick for small forms but hard to unit test and to make dynamic.',
            '**Reactive** (`ReactiveFormsModule`): the form model is built in TypeScript, so it is explicit, synchronous, testable, and composable.',
            'Reactive forms are **strictly typed** since Angular 14 — `form.value.email` is `string | null | undefined`, and `nonNullable` controls reset to their initial value instead of `null`.',
            'Validators: built-ins (`Validators.required`, `email`, `minLength`, `pattern`), custom sync `ValidatorFn`s, async validators (server-side checks), and cross-field validators on a `FormGroup`.',
            '`FormArray` handles dynamic lists of controls (e.g. "add another phone number").',
            'Every control tracks state: `valid`/`invalid`, `touched`/`untouched`, `dirty`/`pristine`, `pending` — use these to decide when to show errors.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a typed reactive form with a cross-field validator',
              code: `import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return pw === confirm ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
})
export class Signup {
  private fb = inject(FormBuilder).nonNullable;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: [''],
    phones: this.fb.array([this.fb.control('')]),
  }, { validators: passwordsMatch });

  get phones() { return this.form.controls.phones; }
  addPhone() { this.phones.push(this.fb.control('')); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { email, password } = this.form.getRawValue(); // fully typed strings
    // ...call the API
  }
}`,
            },
            {
              type: 'code',
              language: 'html',
              title: 'signup.html',
              code: `<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email" type="email" placeholder="Email" />
  @if (form.controls.email.touched && form.controls.email.hasError('email')) {
    <small class="error">Enter a valid email address.</small>
  }

  <input formControlName="password" type="password" />
  <input formControlName="confirm" type="password" />
  @if (form.hasError('passwordsMismatch') && form.controls.confirm.touched) {
    <small class="error">Passwords do not match.</small>
  }

  <div formArrayName="phones">
    @for (ctrl of phones.controls; track $index) {
      <input [formControlName]="$index" placeholder="Phone" />
    }
  </div>
  <button type="button" (click)="addPhone()">Add phone</button>
  <button type="submit" [disabled]="form.pending">Sign up</button>
</form>`,
            },
            {
              type: 'table',
              headers: ['', 'Template-driven', 'Reactive'],
              rows: [
                ['Form model lives in', 'The template (created by directives)', 'The component class'],
                ['Data flow', 'Asynchronous', 'Synchronous'],
                ['Validation', 'Directives / attributes', 'Functions'],
                ['Dynamic fields', 'Awkward', '`FormArray`, `addControl`'],
                ['Unit testing', 'Needs rendering', 'Test the model directly'],
                ['Best for', 'Small, simple forms', 'Anything non-trivial'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Angular 21 introduced **Signal Forms** (`@angular/forms/signals`) as experimental, and Angular 22 promoted them to **stable**. For new forms in a v22+ app, Signal Forms are now a first-class choice (next topic). Reactive forms are not deprecated and remain the right tool in existing codebases — there is no need to rewrite working forms.',
            },
            {
              type: 'heading',
              text: 'Custom form controls: ControlValueAccessor',
            },
            {
              type: 'p',
              text: 'To make your own component (a star rating, a date range picker) work with `formControlName` and `ngModel`, implement `ControlValueAccessor` — the bridge between the forms API and a UI control. Forms calls `writeValue` to push a value in, and you call the registered `onChange`/`onTouched` callbacks to push changes out.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a minimal ControlValueAccessor',
              code: `@Component({
  selector: 'app-stars',
  template: \`
    @for (s of [1, 2, 3, 4, 5]; track s) {
      <button type="button" [disabled]="disabled()" (click)="select(s)" (blur)="onTouched()">
        {{ s <= value() ? '★' : '☆' }}
      </button>
    }
  \`,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Stars), multi: true }],
})
export class Stars implements ControlValueAccessor {
  protected value = signal(0);
  protected disabled = signal(false);
  private onChange: (v: number) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(v: number | null) { this.value.set(v ?? 0); }            // model -> view
  registerOnChange(fn: (v: number) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled.set(d); }

  select(s: number) { this.value.set(s); this.onChange(s); }          // view -> model
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never call `onChange` from inside `writeValue` — the form wrote that value, so echoing it back marks the control dirty and can trigger `valueChanges` loops. Also remember that `valueChanges` fires on programmatic `setValue` too; pass `{ emitEvent: false }` when you set values that should not trigger your listeners.',
            },
          ],
        },
        {
          id: 'signal-forms',
          title: 'Signal Forms (Stable in v22)',
          summary:
            'Signal Forms build a form on top of a plain signal model: `form(model, schema)` returns a field tree, validation is declared in a schema function, and every field exposes its state — value, errors, touched, dirty — as signals.',
          keyPoints: [
            'The **model is yours**: a `signal<T>()` holding a plain object. The form reads and writes that signal directly; there is no separate copy of the data to keep in sync.',
            '`form(model, schemaFn)` returns a **field tree** that mirrors the shape of the model: `f.email`, `f.address.city`, `f.items[0].qty`.',
            'Validation rules (`required`, `email`, `min`, `max`, `minLength`, `pattern`, custom `validate`, async `validateHttp`/`validateAsync`) are declared once, in the schema function, against paths.',
            'Bind a field to an input with the `FormField` directive: `<input [formField]="f.email" />`; read state with `f.email().value()`, `.errors()`, `.touched()`, `.invalid()`.',
            '`submit(form, action)` marks fields touched, runs only if valid, exposes `submitting()`, and lets server-side errors be mapped back onto fields.',
            'Custom controls implement the lightweight `FormValueControl` interface (a `value` model) instead of the more ceremonious `ControlValueAccessor`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Reactive forms were designed in the RxJS era: each `FormControl` owns its own copy of the value, changes are announced via `valueChanges` Observables, and status is read imperatively. That works, but it duplicates state (your domain object *and* the form\'s internal values), makes typing awkward for dynamic shapes, and fits poorly with signal-based, zoneless components. Signal Forms invert the relationship: **your signal is the single source of truth**, and the form is a typed, reactive *view* over it that adds validation and interaction state.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a registration form with Signal Forms',
              code: `import { Component, inject, signal } from '@angular/core';
import { FormField, form, required, email, minLength, validate, submit } from '@angular/forms/signals';

interface Registration { email: string; password: string; confirm: string; }

@Component({
  selector: 'app-register',
  imports: [FormField],
  templateUrl: './register.html',
})
export class Register {
  private api = inject(AccountApi);

  protected model = signal<Registration>({ email: '', password: '', confirm: '' });

  protected f = form(this.model, (p) => {
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
    required(p.password);
    minLength(p.password, 12, { message: 'Use at least 12 characters' });
    // cross-field rule: attached to confirm, reads a sibling value
    validate(p.confirm, ({ value, valueOf }) =>
      value() === valueOf(p.password) ? null : { kind: 'mismatch', message: 'Passwords differ' });
  });

  async save() {
    await submit(this.f, async (form) => {
      await this.api.register(form().value());   // only runs when the form is valid
    });
  }
}`,
            },
            {
              type: 'code',
              language: 'html',
              title: 'register.html',
              code: `<form (submit)="$event.preventDefault(); save()">
  <input type="email" [formField]="f.email" />
  @if (f.email().touched() && f.email().invalid()) {
    @for (err of f.email().errors(); track err.kind) {
      <small class="error">{{ err.message }}</small>
    }
  }

  <input type="password" [formField]="f.password" />
  <input type="password" [formField]="f.confirm" />

  <button type="submit" [disabled]="f().submitting()">Create account</button>
</form>`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    M["model: signal of Registration"] <--> FT["field tree from form()"]
    S["schema function<br/>required, email, validate"] --> FT
    FT --> St["per-field signals<br/>value, errors, touched, dirty"]
    FT <--> D["[formField] directive"]
    D <--> I["input element"]
    St --> T["template: errors and disabled state"]`,
            },
            {
              type: 'table',
              headers: ['', 'Reactive forms', 'Signal Forms'],
              rows: [
                ['Source of truth', 'Values stored inside `FormControl`s', 'Your own `signal()` model'],
                ['Change notification', '`valueChanges` / `statusChanges` Observables', 'Signals — works naturally with `computed()` and zoneless'],
                ['Validation declared', 'Per control, at construction', 'Once, in a schema function over paths (reusable schemas)'],
                ['Typing', 'Typed since v14, awkward for dynamic shapes', 'Inferred from the model type'],
                ['Custom controls', '`ControlValueAccessor` (4 methods + provider)', '`FormValueControl` (a `value` model)'],
                ['Maturity', 'Stable since v2, huge ecosystem', 'Stable since v22, ecosystem catching up'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Migrate opportunistically: new forms in Signal Forms, existing reactive forms left alone unless you are already rewriting them. Mixing both in one app is fine; mixing both *in one form* is not worth the complexity. Because exact option names have shifted between the v21 preview and v22, check the official guide at [angular.dev](https://angular.dev/guide/forms/signals/overview) for your installed version.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The model must be replaced immutably like any signal. Writing `this.model().email = \'x\'` mutates the object without notifying anyone — the input and the validation state will be out of sync. Either let the bound inputs write through the field tree, or use `this.f.email().value.set(\'x\')` / `this.model.update(...)`.',
            },
          ],
        },
        {
          id: 'http-client',
          title: 'HttpClient, Interceptors, and httpResource',
          summary:
            '`HttpClient` makes typed HTTP requests that return Observables, functional interceptors add cross-cutting behaviour like auth headers and error handling, and `httpResource()` exposes a request as signals.',
          keyPoints: [
            'Enable with `provideHttpClient()` in `app.config.ts`. Since v22 the Fetch API backend is the default (`withFetch()` is now redundant and deprecated); `withXhr()` opts back into XMLHttpRequest, which you only need for **upload progress** events, since Fetch cannot report them.',
            '`http.get<T>(url)` returns a **cold** Observable — nothing is sent until something subscribes, and each subscription sends a new request.',
            'Interceptors are functions (`HttpInterceptorFn`) registered with `withInterceptors([...])`; they can modify the request, the response, or handle errors for every call.',
            'Requests are immutable: an interceptor uses `req.clone({ setHeaders: … })` to change one.',
            '`httpResource(() => url)` (signal-based, stable since v22) re-fetches when signals in the URL function change and exposes `value()`, `isLoading()`, `error()`, and `reload()` — it still goes through `HttpClient`, so interceptors apply.',
            'Interceptors run in registration order on the way out and in **reverse** order on the way back in — put the auth interceptor before retry/logging deliberately, not by accident.',
            'Handle errors with RxJS `catchError`, retry transient failures with `retry({ count, delay })`.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'functional interceptors',
              code: `import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const authReq = token ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } }) : req;
  return next(authReq);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) inject(Router).navigate(['/login']);
      return throwError(() => err);
    }),
  );

// app.config.ts
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'refreshing an expired token exactly once',
              code: `let refreshInFlight$: Observable<string> | null = null;

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || req.url.endsWith('/auth/refresh')) return throwError(() => err);

      // share ONE refresh call among all requests that failed concurrently
      refreshInFlight$ ??= auth.refresh().pipe(
        finalize(() => (refreshInFlight$ = null)),
        shareReplay(1),
      );
      return refreshInFlight$.pipe(
        switchMap(token => next(req.clone({ setHeaders: { Authorization: 'Bearer ' + token } }))),
      );
    }),
  );
};`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Without the shared `refreshInFlight$`, a page that fires five requests with an expired token triggers five refresh calls — and with rotating refresh tokens, four of them fail and log the user out. Also exclude the refresh endpoint itself, or a failed refresh will recursively try to refresh.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'httpResource: requests as signals',
              code: `import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  template: \`
    @if (user.isLoading()) { <app-spinner /> }
    @else if (user.error()) { <p>Could not load user. <button (click)="user.reload()">Retry</button></p> }
    @else if (user.hasValue()) { <h2>{{ user.value().name }}</h2> }
  \`,
})
export class UserProfile {
  userId = signal(1);
  // re-fetches automatically whenever userId() changes
  user = httpResource<User>(() => \`/api/users/\${this.userId()}\`);
}`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant C as Component
    participant H as HttpClient
    participant A as authInterceptor
    participant E as errorInterceptor
    participant S as Server
    C->>H: get /api/orders
    H->>A: request
    A->>E: clone with Authorization header
    E->>S: HTTP GET
    S-->>E: 401 Unauthorized
    E-->>C: navigate to /login and rethrow error`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Because HttpClient Observables are cold, subscribing twice sends **two requests** — a common surprise when a template uses `data$ | async` in two places. Use a single `@if (data$ | async; as data)`, convert to a signal with `toSignal()`, or share the result with `shareReplay(1)`.',
            },
          ],
        },
        {
          id: 'resource-api',
          title: 'Async Data with resource(), rxResource(), and httpResource()',
          summary:
            'Resources bring asynchronous data into the signal graph: you describe *which* data you need as a function of signals, and Angular fetches it, cancels stale requests, and exposes value, status, and errors as signals. All three APIs are stable since Angular 22.',
          keyPoints: [
            'A resource has two parts: **params** (a reactive function of signals that says what to load) and a **loader** (how to load it). When params change, the in-flight load is aborted and a new one starts.',
            '`resource({ params, loader })` — loader returns a Promise and receives an `abortSignal` to pass to `fetch`.',
            '`rxResource({ params, stream })` — the loader returns an Observable; ideal when you already have RxJS-based services.',
            '`httpResource(() => url | request)` — the shortcut for HTTP: goes through `HttpClient`, so interceptors, the SSR transfer cache, and testing utilities all apply.',
            'State is exposed as signals: `value()`, `hasValue()`, `error()`, `isLoading()`, and `status()` (`\'idle\' | \'loading\' | \'reloading\' | \'resolved\' | \'error\' | \'local\'`).',
            'If params returns `undefined`, the resource goes **idle** and does not load — the idiomatic way to express "wait until the user has picked something".',
            'Resources are for **reading** data. Mutations (POST/PUT/DELETE) are still imperative calls — then `reload()` or `set()`/`update()` the resource value optimistically.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Before resources, the idiomatic way to load data that depends on state was an RxJS pipeline: turn the signal into an Observable, `switchMap` to the request, `catchError`, track loading in a separate flag, and convert back with `toSignal()`. That works, but every component re-implemented the same loading/error/cancellation plumbing slightly differently. A resource packages that pattern into one primitive with a consistent status model, which also makes it easy for templates to render loading, error, and empty states explicitly.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'the three flavours side by side',
              code: `import { Component, inject, input, resource, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';

export class OrderDetail {
  orderId = input.required<string>();
  private orders = inject(OrderService);      // returns Observables

  // 1. Promise-based, any async source (fetch, IndexedDB, a Web Worker...)
  invoice = resource({
    params: () => ({ id: this.orderId() }),
    loader: async ({ params, abortSignal }) => {
      const res = await fetch(\`/api/invoices/\${params.id}\`, { signal: abortSignal });
      if (!res.ok) throw new Error('Invoice failed: ' + res.status);
      return (await res.json()) as Invoice;
    },
  });

  // 2. Observable-based, reuse an existing RxJS service
  order = rxResource({
    params: () => this.orderId(),
    stream: ({ params: id }) => this.orders.getById(id),
  });

  // 3. HTTP shortcut: interceptors and SSR transfer cache apply
  shipping = httpResource<Shipment>(() => \`/api/orders/\${this.orderId()}/shipment\`);

  // idle until a carrier is chosen: params returning undefined = do not load
  carrier = signal<string | undefined>(undefined);
  rates = httpResource<Rate[]>(() =>
    this.carrier() ? { url: '/api/rates', params: { carrier: this.carrier()! } } : undefined);
}`,
            },
            {
              type: 'mermaid',
              code: `stateDiagram-v2
    [*] --> idle: params is undefined
    idle --> loading: params defined
    loading --> resolved: loader succeeds
    loading --> error: loader throws
    resolved --> reloading: reload() called
    reloading --> resolved
    resolved --> loading: params change, previous load aborted
    error --> loading: params change or reload()
    resolved --> local: value.set() by the app
    local --> loading: params change`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'optimistic update after a mutation',
              code: `async toggleFavorite(p: Product) {
  const previous = this.products.value();
  // optimistic: update the UI immediately (status becomes 'local')
  this.products.update(list => list?.map(x => x.id === p.id ? { ...x, fav: !x.fav } : x));
  try {
    await firstValueFrom(this.api.toggleFavorite(p.id));
  } catch {
    this.products.set(previous);   // roll back
    this.toast.error('Could not update favorite');
  }
}`,
            },
            {
              type: 'table',
              headers: ['Need', 'Best tool'],
              rows: [
                ['Load data that depends on signals (route input, filters)', '`httpResource` / `resource`'],
                ['Existing service returns Observables', '`rxResource`'],
                ['Polling, websockets, retry with back-off, combining many streams', 'RxJS pipeline, then `toSignal()`'],
                ['Cross-component cache with deduplication and stale-while-revalidate', 'A shared store service, or TanStack Query for Angular'],
                ['Writes (create/update/delete)', 'Imperative `HttpClient` call + `reload()` or optimistic `set()`'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Reading `value()` while the resource is in the `error` state **throws**. Guard templates with `hasValue()` (which also narrows the type) or check `error()` first. Similarly, a resource is owned by the injector it was created in — creating one inside a method (outside an injection context) fails; declare resources as fields.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The resource API changed shape during its experimental period (v19 used `request`/`loader`; v20 renamed them to `params`/`loader`, and `rxResource` to `params`/`stream`). If you read older articles, translate accordingly — `ng update` migrations handled the renames.',
            },
          ],
        },
        {
          id: 'rxjs-essentials',
          title: 'RxJS Essentials for Angular',
          summary:
            'RxJS Observables model asynchronous streams — HTTP responses, form value changes, router events — and a handful of operators (especially the four flattening operators) cover most real Angular work.',
          keyPoints: [
            'An **Observable** is a lazy stream of values over time; an Observer subscribes to receive `next`, `error`, and `complete` notifications.',
            'Core operators: `map`, `filter`, `tap`, `debounceTime`, `distinctUntilChanged`, `catchError`, `startWith`, `combineLatest`, `shareReplay`.',
            'Flattening operators decide what happens when a new outer value arrives while an inner request is still running: `switchMap` cancels, `mergeMap` runs in parallel, `concatMap` queues, `exhaustMap` ignores.',
            '`Subject` multicasts to many subscribers; `BehaviorSubject` also holds a current value; `ReplaySubject` replays past values. In new code, a signal often replaces `BehaviorSubject` for state.',
            'Unsubscribe from long-lived streams: `async` pipe, `takeUntilDestroyed()`, or `toSignal()` all do it automatically. HTTP calls complete on their own.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a type-ahead search — the canonical RxJS example',
              code: `import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="query" placeholder="Search products" />
    @for (r of results(); track r.id) { <p>{{ r.name }}</p> }
  \`,
})
export class Search {
  private api = inject(ProductService);
  query = new FormControl('', { nonNullable: true });

  results = toSignal(
    this.query.valueChanges.pipe(
      debounceTime(300),                // wait for typing to pause
      distinctUntilChanged(),           // skip if the text didn't change
      filter(q => q.length >= 2),
      switchMap(q =>                    // cancel the previous in-flight request
        this.api.search(q).pipe(catchError(() => of([])))
      ),
    ),
    { initialValue: [] },
  );
}`,
            },
            {
              type: 'table',
              headers: ['Operator', 'When a new value arrives while the previous inner Observable is still running…', 'Typical use'],
              rows: [
                ['`switchMap`', 'Cancel the previous inner, switch to the new one', 'Search-as-you-type, route param → load data'],
                ['`mergeMap`', 'Run both concurrently', 'Independent parallel requests (e.g. upload many files)'],
                ['`concatMap`', 'Queue the new one until the previous completes', 'Ordered writes that must not interleave'],
                ['`exhaustMap`', 'Ignore the new one until the previous completes', 'Login / submit buttons — prevent double submit'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    K["keystrokes"] --> D["debounceTime 300ms"]
    D --> DU["distinctUntilChanged"]
    DU --> F["filter length >= 2"]
    F --> SM["switchMap<br/>cancels stale request"]
    SM --> API["HTTP search"]
    API --> SIG["toSignal: results()"]
    SIG --> T["template @for"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For subscriptions you manage manually, `takeUntilDestroyed()` (from `@angular/core/rxjs-interop`) ends them when the component is destroyed — `source$.pipe(takeUntilDestroyed()).subscribe(...)` in a field initializer or constructor. It replaces the old `destroy$ = new Subject()` + `takeUntil(this.destroy$)` + `ngOnDestroy` boilerplate.',
            },
          ],
        },
        {
          id: 'signals-rxjs-interop',
          title: 'Signals and RxJS Together: The Interop Layer',
          summary:
            '`@angular/core/rxjs-interop` bridges the two reactive models — `toSignal`, `toObservable`, `outputFromObservable`, `takeUntilDestroyed`, `rxResource` — and knowing which side a piece of logic belongs on is a core modern-Angular skill.',
          keyPoints: [
            '**Signals for state, RxJS for events and time.** Signals answer "what is the value now?"; Observables answer "what happens when, and in what order?"',
            '`toSignal(obs$, { initialValue })` subscribes immediately in an injection context and unsubscribes on destroy. Without `initialValue` the signal type includes `undefined`; `{ requireSync: true }` asserts the Observable emits synchronously (e.g. a `BehaviorSubject`).',
            '`toObservable(sig)` emits the signal\'s value through an effect — so emissions are **asynchronous** and intermediate values set in the same task are coalesced.',
            '`outputFromObservable(obs$)` exposes an Observable as a component output; `outputToObservable(this.someOutput)` goes the other way.',
            'Errors in an Observable passed to `toSignal` are re-thrown when the signal is read — handle errors in the pipe (`catchError`) unless you want the template to throw.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'choosing the right side for each concern',
              code: `import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of, fromEvent, map, startWith } from 'rxjs';

export class ProductSearch {
  private api = inject(ProductService);

  // state lives in signals
  query = signal('');
  category = signal<'all' | 'shoes' | 'bags'>('all');

  // timing logic (debounce + cancel) is RxJS's strength
  private results$ = toObservable(this.query).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(q => this.api.search(q).pipe(catchError(() => of([] as Product[])))),
  );
  results = toSignal(this.results$, { initialValue: [] });

  // pure derivation goes back to signals
  visible = computed(() =>
    this.category() === 'all' ? this.results() : this.results().filter(p => p.category === this.category()));

  // a DOM event stream with a sensible starting value
  isOnline = toSignal(
    fromEvent(window, 'online').pipe(map(() => true), startWith(navigator.onLine)),
    { requireSync: true },
  );
}`,
            },
            {
              type: 'table',
              headers: ['Concern', 'Signals', 'RxJS'],
              rows: [
                ['Current UI state', 'Natural fit', 'Possible (`BehaviorSubject`) but verbose'],
                ['Derived values', '`computed()` — memoized, glitch-free', '`combineLatest` + `map` — can emit intermediate states'],
                ['Debounce / throttle / timing', 'Not built in (v22 adds an experimental `debounced()`)', 'Rich operator set'],
                ['Cancellation and race conditions', 'Resources abort stale loads', '`switchMap`, `takeUntil`, `race`'],
                ['Streams of discrete events', 'Not a fit — signals hold one value and drop events', 'Natural fit (websockets, router events)'],
                ['Template consumption', 'Read directly, no pipe', '`async` pipe or `toSignal()`'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Signals are not event streams. Setting a signal to the same value twice notifies nobody (equality check), and setting it twice in one task delivers only the last value. If you model "the user clicked Save" as a signal, the second identical click is lost. Use an output, a method call, or a `Subject` for events.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Calling `toSignal()` inside a method or `ngOnInit` (outside an injection context) throws `NG0203`, and calling it repeatedly — e.g. inside a getter used by the template — creates a new subscription every time. Create it once, as a field.',
            },
          ],
        },
        {
          id: 'change-detection',
          title: 'Change Detection: Zone.js, OnPush, and Zoneless',
          summary:
            'Change detection is how Angular keeps the DOM in sync with component state — historically triggered by Zone.js after any async event, increasingly targeted precisely by signals in zoneless applications.',
          keyPoints: [
            'Angular checks components top-down through the component tree, re-evaluating template bindings and updating only the DOM nodes whose values changed.',
            '**Zone.js** patches browser async APIs (events, timers, promises, XHR) so Angular knows "something might have changed" and checks the whole tree — simple, but wasteful.',
            '`ChangeDetectionStrategy.OnPush` skips a component (and its subtree) unless an input reference changed, an event fired inside it, an `async` pipe emitted, a signal it reads changed, or `markForCheck()` was called.',
            '**Zoneless** (`provideZonelessChangeDetection()`, the default for new projects since Angular 21) removes Zone.js entirely; change detection is scheduled by signal updates, template events, `async` pipe, and `markForCheck()`.',
            'Zoneless means smaller bundles, no monkey-patching, cleaner stack traces, and predictable performance — but code that mutates plain fields inside a `setTimeout` or third-party callback will no longer update the view.',
            '**Angular 22 made OnPush the default** strategy. The old `ChangeDetectionStrategy.Default` is renamed `Eager`, and `ng update` adds `changeDetection: ChangeDetectionStrategy.Eager` to existing components that did not specify a strategy, so upgrades keep their behaviour.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph ZoneJs["With Zone.js, Default strategy"]
        E1["any click / timer / XHR anywhere"] --> All["check EVERY component"]
    end
    subgraph Zoneless["Zoneless + signals + OnPush"]
        E2["signal.set in CartService"] --> Mark["mark only components<br/>that read that signal"]
        Mark --> Few["check just those views"]
    end`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'the modern, efficient default',
              code: `@Component({
  selector: 'app-cart-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<span class="badge">{{ cart.count() }}</span>\`,
})
export class CartBadge {
  cart = inject(CartService);   // count is a signal — updating it schedules a check of this view
}

// A bug that appears when moving to zoneless:
export class Clock {
  time = new Date();                     // plain field, not a signal
  constructor() {
    setInterval(() => this.time = new Date(), 1000);  // view never updates without Zone.js
  }
}
// Fix: time = signal(new Date());  ...  this.time.set(new Date())`,
            },
            {
              type: 'heading',
              text: 'What actually happens during a check',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Something schedules a tick.** In zoneless apps, the scheduler is notified by a signal write that a template reads, a template/host event listener, `markForCheck()` (which the `async` pipe calls), `ComponentRef.setInput()`, or attaching/detaching a view. Multiple notifications in the same task coalesce into one tick.',
                '**`ApplicationRef.tick()` runs.** Root effects run first, then Angular walks the view tree from the root.',
                '**Each view decides whether to refresh.** An `Eager` view always refreshes. An `OnPush` view refreshes only if it is marked dirty. A view that is not dirty but contains a dirty descendant is *traversed* without refreshing its own bindings — signal-driven updates mark only the consuming view for refresh (rather than every ancestor), which is why a signal change deep in the tree is cheap.',
                '**Refreshing a view** runs its update instructions: evaluate each binding, compare with the stored value, write to the DOM only on change, then run view effects and lifecycle hooks.',
                '**After render**, `afterNextRender` / `afterEveryRender` callbacks run in their phases. In dev mode Angular then runs a verification pass and throws `NG0100` if any binding changed during the check.',
              ],
            },
            {
              type: 'table',
              headers: ['Trigger', 'Zone.js + Eager', 'Zone.js + OnPush', 'Zoneless + OnPush'],
              rows: [
                ['Click inside the component', 'Whole tree checked', 'Component and ancestors marked dirty', 'Component and ancestors marked dirty'],
                ['`setTimeout` mutating a plain field', 'View updates', 'View does NOT update', 'View does NOT update'],
                ['`signal.set()` read by the template', 'View updates', 'View updates', 'View updates (only that view refreshed)'],
                ['New input reference from parent', 'View updates', 'View updates', 'View updates'],
                ['Mutating an input object in place', 'View updates', 'View does NOT update', 'View does NOT update'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Migrating a large Zone.js app to zoneless: first make components OnPush and move state to signals (bugs surface early while Zone.js still masks timing), then remove `zone.js` from polyfills and add `provideZonelessChangeDetection()`. Watch for libraries that relied on `NgZone.onStable` or `NgZone.run` to trigger rendering — most maintained libraries support zoneless now, but check before you switch.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'OnPush + signals is the combination to aim for even in Zone.js apps (and since v22 OnPush is what you get without asking): it makes the component\'s update conditions explicit, catches accidental mutation bugs early, and makes a later move to zoneless a non-event.',
            },
          ],
        },
        {
          id: 'content-projection-and-templates',
          title: 'Content Projection and ng-template',
          summary:
            '`<ng-content>` lets a component render markup supplied by its parent (like React\'s `children`), while `<ng-template>` and `ngTemplateOutlet` pass around reusable chunks of template — Angular\'s equivalent of render props.',
          keyPoints: [
            '`<ng-content />` projects whatever the parent placed between the component\'s tags.',
            'Multi-slot projection: `<ng-content select="[card-title]" />` picks content by CSS selector.',
            'Projected content is created by the **parent**, so it is always instantiated even if the child never renders it — use `ng-template` when rendering should be conditional or repeated.',
            '`<ng-template #tpl let-item>` defines a template that does not render on its own; `*ngTemplateOutlet="tpl; context: { $implicit: item }"` renders it with data.',
            '`<ng-container>` is a grouping element that adds no DOM node — useful for applying directives without an extra wrapper `div`.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a card with named slots',
              code: `@Component({
  selector: 'app-card',
  template: \`
    <section class="card">
      <header><ng-content select="[card-title]" /></header>
      <div class="body"><ng-content /></div>
      <footer><ng-content select="[card-actions]" /></footer>
    </section>
  \`,
})
export class Card {}

// usage
// <app-card>
//   <h3 card-title>Order #1042</h3>
//   <p>3 items, shipped yesterday.</p>
//   <button card-actions>Track</button>
// </app-card>`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a generic list that lets the caller decide how each row looks',
              code: `@Component({
  selector: 'app-data-list',
  imports: [NgTemplateOutlet],
  template: \`
    <ul>
      @for (item of items(); track $index) {
        <li>
          <ng-container *ngTemplateOutlet="rowTemplate(); context: { $implicit: item }" />
        </li>
      }
    </ul>
  \`,
})
export class DataList<T> {
  items = input.required<T[]>();
  rowTemplate = input.required<TemplateRef<{ $implicit: T }>>();
}

// usage
// <ng-template #userRow let-user>
//   <strong>{{ user.name }}</strong> — {{ user.email }}
// </ng-template>
// <app-data-list [items]="users()" [rowTemplate]="userRow" />`,
            },
          ],
        },
        {
          id: 'animations',
          title: 'Animations: animate.enter / animate.leave and CSS',
          summary:
            'Modern Angular animates with native CSS driven by two compiler-supported features — `animate.enter` and `animate.leave` — replacing most uses of the older, JavaScript-based `@angular/animations` DSL.',
          keyPoints: [
            '`animate.enter="cls"` adds CSS classes when an element is inserted (by `@if`, `@for`, routing); the animation itself is plain CSS `@keyframes` or transitions.',
            '`animate.leave="cls"` adds classes when the element is about to be removed and **delays removal until the animation finishes** — the hard part of leave animations that CSS alone cannot do.',
            'Both accept a static string, a bound value (`[animate.enter]="cls()"`), or an event-binding form (`(animate.leave)="fn($event)"`) to hand off to a JS library; call `$event.animationComplete()` when done.',
            'They are compiler features, not directives — no import, no extra package, and they work in zoneless apps.',
            'The legacy `@angular/animations` package (`trigger`, `state`, `transition`, `animate`) is deprecated in favour of the native approach; it still works, but cannot be mixed with `animate.enter`/`animate.leave` in the same component.',
            'Respect `prefers-reduced-motion` in your CSS; for page transitions, `withViewTransitions()` uses the browser View Transitions API.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a toast list with enter and leave animations',
              code: `@Component({
  selector: 'app-toasts',
  template: \`
    @for (t of toasts(); track t.id) {
      <div class="toast" animate.enter="slide-in" animate.leave="fade-out">
        {{ t.text }} <button (click)="dismiss(t.id)">×</button>
      </div>
    }
  \`,
  styles: \`
    .slide-in { animation: slide-in 200ms ease-out; }
    .fade-out { animation: fade-out 150ms ease-in forwards; }
    @keyframes slide-in { from { transform: translateY(-8px); opacity: 0; } }
    @keyframes fade-out { to { opacity: 0; transform: scale(.96); } }
    @media (prefers-reduced-motion: reduce) {
      .slide-in, .fade-out { animation: none; }
    }
  \`,
})
export class Toasts {
  toasts = signal<{ id: number; text: string }[]>([]);
  dismiss(id: number) { this.toasts.update(list => list.filter(t => t.id !== id)); }
}`,
            },
            {
              type: 'table',
              headers: ['', '`@angular/animations` (legacy)', 'Native `animate.enter` / `animate.leave`'],
              rows: [
                ['Where animations are defined', 'TypeScript DSL in component metadata', 'Plain CSS (or any JS library via callbacks)'],
                ['Runtime cost', 'Animation engine in the bundle', 'Browser-native, GPU-friendly'],
                ['Leave animations', 'Yes (`:leave` transitions)', 'Yes — removal waits for the longest animation'],
                ['Complex choreography', '`query`, `stagger`, `group`', 'CSS delays / custom properties, or a library via callbacks'],
                ['Status', 'Deprecated', 'Recommended'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'With the function form `(animate.leave)="fn($event)"` you **must** call `$event.animationComplete()`; otherwise Angular waits for a timeout (a few seconds by default, configurable via `MAX_ANIMATION_TIMEOUT`) before removing the element, and the UI feels stuck. Also, a child component\'s own `animate.leave` does not run when its *parent* is removed — put `animate.leave` on the child\'s host element in the parent template instead.',
            },
          ],
        },
        {
          id: 'state-management',
          title: 'State Management: Signal Services, NgRx, and SignalStore',
          summary:
            'Most Angular state lives comfortably in services holding signals; NgRx Store adds a strict Redux-style architecture for large teams, and NgRx SignalStore offers a lighter, signal-native middle ground.',
          keyPoints: [
            'Start with **local component state** (signals), then lift shared state into a `providedIn: \'root\'` service exposing read-only signals and intent-revealing methods.',
            'Expose state as `asReadonly()` signals so only the service can mutate it — one place to look when state changes unexpectedly.',
            '**NgRx Store** (actions → reducers → store → selectors, side effects in Effects) gives strict unidirectional flow, time-travel debugging in Redux DevTools, and consistency across big teams — at the cost of boilerplate.',
            '**NgRx SignalStore** (`signalStore`, `withState`, `withComputed`, `withMethods`) is a functional, signal-based store with much less ceremony.',
            'Server data (caching, refetching) is a separate concern from client UI state — `httpResource`, `resource()`, or TanStack Query for Angular often replace hand-rolled caching.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a signal-based service store — enough for most apps',
              code: `@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.qty, 0));
  readonly total = computed(() => this._items().reduce((s, i) => s + i.qty * i.price, 0));

  add(product: Product) {
    this._items.update(items => {
      const existing = items.find(i => i.id === product.id);
      return existing
        ? items.map(i => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { ...product, qty: 1 }];
    });
  }

  remove(id: number) {
    this._items.update(items => items.filter(i => i.id !== id));
  }
}`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Cmp["Component"] -- "dispatch action" --> Store["NgRx Store"]
    Store --> Red["Reducer<br/>pure state transition"]
    Red --> Store
    Store -- "action stream" --> Eff["Effect<br/>calls API"]
    Eff -- "success / failure action" --> Store
    Store -- "selector" --> Cmp`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'the same cart as an NgRx SignalStore',
              code: `import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

type CartState = { items: CartItem[]; checkingOut: boolean };

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>({ items: [], checkingOut: false }),
  withComputed(({ items }) => ({
    count: computed(() => items().reduce((n, i) => n + i.qty, 0)),
    total: computed(() => items().reduce((s, i) => s + i.qty * i.price, 0)),
  })),
  withMethods((store, api = inject(CheckoutApi)) => ({
    add(p: Product) {
      patchState(store, ({ items }) => ({ items: [...items, { ...p, qty: 1 }] }));
    },
    async checkout() {
      patchState(store, { checkingOut: true });
      try { await api.submit(store.items()); patchState(store, { items: [] }); }
      finally { patchState(store, { checkingOut: false }); }
    },
  })),
);`,
            },
            {
              type: 'table',
              headers: ['Option', 'Ceremony', 'DevTools / audit trail', 'Best when'],
              rows: [
                ['Signals in a component', 'None', 'Angular DevTools signal graph', 'State used by one component'],
                ['Signal service', 'Low', 'Same', 'Shared state with a few operations — most apps'],
                ['NgRx SignalStore', 'Medium', 'Optional Redux DevTools integration', 'Many stores needing shared patterns (entities, request status, plugins)'],
                ['NgRx Store', 'High', 'Full action log, time travel', 'Large teams, complex cross-feature flows, auditable events'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Reach for NgRx Store when you have genuinely complex shared state, many developers touching it, and a need for an auditable event log — not by default. A rule of thumb many teams use: signals in components → signal services → SignalStore → NgRx Store, stepping up only when the previous level starts to hurt.',
            },
          ],
        },
        {
          id: 'defer-and-performance',
          title: 'Performance: @defer, Lazy Loading, and Optimization',
          summary:
            'Angular apps get fast by shipping less JavaScript up front (lazy routes and `@defer` blocks), doing less work per update (OnPush, signals, `track`), and using built-in tools like `NgOptimizedImage` and bundle budgets.',
          keyPoints: [
            '`@defer` splits a template section and its dependencies into a separate chunk, loaded when a **trigger** fires: `on viewport`, `on interaction`, `on hover`, `on idle` (default), `on timer(2s)`, `on immediate`, or `when condition`.',
            '`@placeholder`, `@loading` (with `minimum`/`after` to avoid flicker), and `@error` sub-blocks control what shows before and during loading; `prefetch on idle` downloads early but renders later.',
            'Lazy-load routes with `loadComponent` / `loadChildren` so each feature is its own bundle.',
            '`NgOptimizedImage` (`<img ngSrc>`) enforces width/height (no layout shift), lazy-loads offscreen images, and prioritizes the LCP image with `priority`.',
            '`angular.json` **budgets** fail the build if bundles grow past a threshold — catching regressions in CI rather than in production.',
            'Profile with Angular DevTools (component tree, change detection profiler, signal graph) before optimizing.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'html',
              title: 'deferring a heavy, below-the-fold component',
              code: `<app-product-hero [product]="product()" />

@defer (on viewport; prefetch on idle) {
  <app-reviews [productId]="product().id" />   <!-- separate JS chunk -->
} @placeholder (minimum 300ms) {
  <div class="skeleton">Reviews</div>
} @loading (after 150ms; minimum 500ms) {
  <app-spinner />
} @error {
  <p>Could not load reviews.</p>
}

<img ngSrc="/images/hero.jpg" width="1200" height="600" priority alt="Product" />`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant B as Browser
    participant A as Main bundle
    participant D as Reviews chunk
    B->>A: load page, render hero + placeholder
    Note over B: browser idle - prefetch
    B->>D: download reviews chunk early
    Note over B: user scrolls - placeholder enters viewport
    B->>B: render app-reviews from cached chunk`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '`@defer` only splits code when the deferred components, directives, and pipes are standalone and **not referenced anywhere else** in the same file (for example in a `viewChild` query or in the class code). If they are, the dependency is loaded eagerly and the block simply defers rendering.',
            },
          ],
        },
        {
          id: 'ssr-and-hydration',
          title: 'Server-Side Rendering and Hydration',
          summary:
            '`@angular/ssr` renders pages on the server for fast first paint and SEO, hydration reuses that server-rendered DOM instead of rebuilding it, and incremental hydration defers hydrating parts of the page until they are needed.',
          keyPoints: [
            'Add SSR with `ng new --ssr` or `ng add @angular/ssr`; routes can be configured to render on the server per request, prerender at build time (SSG), or render on the client only.',
            '**Hydration** (`provideClientHydration()`) makes the browser attach to the existing server DOM rather than destroying and re-creating it — avoiding flicker and improving Core Web Vitals.',
            '`withEventReplay()` records user clicks that happen before hydration finishes and replays them afterwards.',
            '**Incremental hydration** combines with `@defer (hydrate on viewport)` so parts of the page stay as static HTML until a trigger hydrates them. It was opt-in via `withIncrementalHydration()` (v19–v21) and is **on by default since v22**, where that function is deprecated.',
            'Per-route render modes live in `app.routes.server.ts`: `RenderMode.Server` (per request), `RenderMode.Prerender` (at build time, SSG), and `RenderMode.Client` (CSR only).',
            'Code that touches `window`, `document`, or `localStorage` directly breaks on the server — guard with `afterNextRender()` or inject `PLATFORM_ID` / `DOCUMENT`.',
            '`HttpClient` responses made on the server are cached into the page (transfer cache) so the client does not repeat them during hydration.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant U as Browser
    participant S as Node SSR server
    participant API as Backend API
    U->>S: GET /products/42
    S->>API: fetch product 42
    API-->>S: JSON
    S-->>U: full HTML + serialized HTTP transfer cache
    Note over U: user sees content immediately
    U->>U: download JS bundles
    U->>U: hydrate - attach listeners to existing DOM
    U->>U: replay clicks captured before hydration`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'configuration and SSR-safe code',
              code: `// app.config.ts
providers: [
  provideClientHydration(withEventReplay()),   // incremental hydration is the default in v22+
]

// app.routes.server.ts — choose a render mode per route
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },                 // static marketing page
  { path: 'products/:id', renderMode: RenderMode.Server },        // fresh per request, SEO
  { path: 'account/**', renderMode: RenderMode.Client },          // private, no SEO value
  { path: '**', renderMode: RenderMode.Server },
];

// SSR-safe browser-only code
export class ThemeToggle {
  theme = signal<'light' | 'dark'>('light');
  constructor() {
    afterNextRender(() => {
      // only ever runs in the browser
      this.theme.set((localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
    });
  }
}`,
            },
            {
              type: 'code',
              language: 'html',
              title: 'incremental hydration',
              code: `@defer (hydrate on viewport) {
  <app-comments [postId]="post().id" />
}`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Hydration requires the server and client to produce the **same DOM**. Rendering `Date.now()`, random ids, or browser-only values directly in a template, or manipulating the DOM by hand, causes hydration mismatch errors (`NG0500`-series). Keep templates deterministic and push browser-only work into `afterNextRender`.',
            },
            {
              type: 'table',
              headers: ['Mode', 'TTFB', 'Freshness', 'Server cost', 'Good for'],
              rows: [
                ['CSR', 'Fast (static shell) but blank until JS runs', 'Live', 'None', 'Authenticated dashboards'],
                ['SSR', 'Slower — rendered per request', 'Live', 'CPU per request', 'Product pages, search results, SEO-critical dynamic pages'],
                ['Prerender (SSG)', 'Fastest (CDN)', 'As of last build', 'Build time only', 'Marketing, docs, blogs'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'SSR servers are long-lived Node processes shared by all users. A `providedIn: \'root\'` service holds state *per request* (each request gets its own app instance), but module-level variables (`let cache = {}` at the top of a file) are shared across **all requests and users** — a classic data-leak bug. Also never let the server call your own public URL for data; call internal endpoints, and set timeouts so a slow API cannot exhaust the render pool.',
            },
          ],
        },
        {
          id: 'security',
          title: 'Security: XSS, Sanitization, CSP, and XSRF',
          summary:
            'Angular escapes and sanitizes untrusted values by default, which removes most XSS risk — as long as you do not bypass it. Content Security Policy, XSRF protection, and server-side authorization complete the picture.',
          keyPoints: [
            '**Interpolation and property bindings are safe by default**: `{{ value }}` is always text, and values bound to `[innerHTML]`, `[href]`, `[src]`, or `[style]` are sanitized for their *security context* (HTML, URL, resource URL, style).',
            '`DomSanitizer.bypassSecurityTrustHtml()` and friends turn off that protection for one value — every call is a potential XSS hole and should be rare, reviewed, and fed only trusted or pre-sanitized content.',
            'Direct DOM APIs (`el.innerHTML = …`, `ElementRef.nativeElement`, `document.write`) bypass Angular entirely; prefer bindings and `Renderer2`.',
            'Never build templates from user input at runtime: AOT compilation means templates are trusted code; mixing server-side templating with Angular templates enables template injection.',
            'A strict **CSP** with nonces is supported: the CLI\'s `autoCsp` option generates hash-based CSP for the index file, and `ngCspNonce` / the `CSP_NONCE` token supply a nonce for Angular\'s inline styles.',
            '`HttpClient` has built-in **XSRF** support: it reads the `XSRF-TOKEN` cookie and sends it as `X-XSRF-TOKEN` on mutating same-origin requests (configurable with `withXsrfConfiguration`) — the server must still validate it.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'what Angular does with untrusted values',
              code: `@Component({
  selector: 'app-comment',
  template: \`
    <p>{{ comment().body }}</p>                    <!-- always rendered as text -->
    <div [innerHTML]="comment().html"></div>      <!-- sanitized: <script>, onerror=... stripped -->
    <a [href]="comment().website">Website</a>     <!-- javascript: URLs neutralized -->
  \`,
})
export class Comment {
  comment = input.required<{ body: string; html: string; website: string }>();
}

// DANGEROUS: only for content you fully control (e.g. your own CMS output, sanitized server-side)
export class TrustedEmbed {
  private sanitizer = inject(DomSanitizer);
  embed = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(this.videoId())));
  videoId = input.required<string>();
}`,
            },
            {
              type: 'table',
              headers: ['Threat', 'Angular\'s built-in defence', 'What you still must do'],
              rows: [
                ['XSS via data', 'Auto-escaping + context-aware sanitization', 'Avoid `bypassSecurityTrust*` and raw DOM writes'],
                ['XSS via injected scripts', 'Works with strict CSP and Trusted Types', 'Configure CSP headers on the server'],
                ['CSRF / XSRF', 'Cookie-to-header token in `HttpClient`', 'Issue the cookie and verify the header server-side'],
                ['Unauthorized access', 'Guards hide UI only', 'Enforce authorization on every API endpoint'],
                ['Token theft', 'None', 'Prefer `HttpOnly`, `Secure`, `SameSite` cookies over tokens in `localStorage`'],
                ['Vulnerable dependencies', 'Regular, supported releases', 'Stay on a supported major; run `npm audit` in CI'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Storing JWTs in `localStorage` is common in Angular tutorials, but any XSS on your origin can read and exfiltrate them. `HttpOnly` cookies (with XSRF protection and `SameSite`) cannot be read by JavaScript at all. If you must keep tokens in JS, keep them in memory and short-lived, with refresh via an `HttpOnly` cookie.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Only versions under active or LTS support receive security patches. Running an out-of-support Angular major in production is itself a security finding in most audits — budget for staying within the supported window.',
            },
          ],
        },
        {
          id: 'testing',
          title: 'Testing Angular Applications',
          summary:
            'Angular ships first-class testing support — `TestBed` builds a real component with real DI in a test, `HttpTestingController` fakes the backend, and component harnesses give stable, implementation-agnostic test APIs.',
          keyPoints: [
            'Unit tests run with **Vitest** by default in new projects since Angular 21, via the CLI\'s `unit-test` builder. Karma + Jasmine is the legacy setup (Karma itself is deprecated upstream); v22 ships a `migrate-karma-to-vitest` migration. Jest is also common in existing codebases.',
            'In zoneless tests, prefer `await fixture.whenStable()` and Vitest fake timers over Zone-based `fakeAsync`/`tick` (which need Zone.js loaded in the test environment).',
            '`TestBed.configureTestingModule({ imports: [Cmp], providers: [...] })` sets up a component with its real template and DI.',
            '`fixture.detectChanges()` (or `await fixture.whenStable()` in zoneless apps) applies pending updates before assertions.',
            'Test services directly with `TestBed.inject(Service)`; swap real dependencies for fakes with `{ provide: X, useValue: fake }`.',
            '`provideHttpClientTesting()` + `HttpTestingController` assert which requests were made and flush fake responses — no real network.',
            'End-to-end tests run in a real browser with Playwright or Cypress.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'testing a component and a service',
              code: `import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProductCard', () => {
  it('emits addToCart when the button is clicked', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', { id: 1, name: 'Mouse', price: 25, inStock: true });
    await fixture.whenStable();

    let emitted: Product | undefined;
    fixture.componentInstance.addToCart.subscribe(p => (emitted = p));
    fixture.nativeElement.querySelector('button').click();

    expect(emitted?.id).toBe(1);
  });
});

describe('ProductService', () => {
  it('GETs all products', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: { apiUrl: '/api' } }],
    });
    const service = TestBed.inject(ProductService);
    const http = TestBed.inject(HttpTestingController);

    let result: Product[] = [];
    service.getAll().subscribe(r => (result = r));

    http.expectOne('/api/products').flush([{ id: 1, name: 'Mouse', price: 25, inStock: true }]);
    expect(result.length).toBe(1);
    http.verify(); // no unexpected requests
  });
});`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'testing a signal-based component with an httpResource (zoneless)',
              code: `import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

it('shows the user name once loaded', async () => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  const fixture = TestBed.createComponent(UserProfile);
  const http = TestBed.inject(HttpTestingController);

  fixture.detectChanges();                                  // resource issues its request
  await fixture.whenStable();
  http.expectOne('/api/users/1').flush({ id: 1, name: 'Ada' });

  await fixture.whenStable();                               // let signals propagate and render
  expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Ada');
  http.verify();
});`,
            },
            {
              type: 'table',
              headers: ['Layer', 'Tool', 'What to test', 'Rough share'],
              rows: [
                ['Pure functions, services, stores', 'Vitest + `TestBed.inject`', 'Business rules, state transitions', 'Most tests'],
                ['Components', 'TestBed (+ harnesses, Testing Library)', 'Rendering, inputs/outputs, user interaction', 'Many'],
                ['Integration', 'TestBed with router (`RouterTestingHarness`)', 'Navigation, guards, lazy routes', 'Some'],
                ['End-to-end', 'Playwright / Cypress', 'Critical user journeys against a real build', 'Few'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Test behaviour through the DOM and public API (click the button, assert the output) rather than calling private methods — the same philosophy as React Testing Library. Angular Material\'s **component harnesses** (`TestbedHarnessEnvironment`) apply this to library components, so tests survive internal markup changes.',
            },
          ],
        },
        {
          id: 'architecture-best-practices',
          title: 'Architecture and Best Practices at Scale',
          summary:
            'Large Angular codebases stay maintainable by organizing by feature, separating smart (container) and presentational components, keeping components thin and services focused, and enforcing boundaries with tooling.',
          keyPoints: [
            'Organize folders **by feature** (`products/`, `cart/`, `admin/`), each lazy-loaded, rather than by type (`components/`, `services/`).',
            '**Smart components** inject services and own data fetching; **presentational components** only take inputs and emit outputs, use OnPush, and are trivially reusable and testable.',
            'Keep business logic in services and pure functions, not in components or templates.',
            'Prefer `inject()`, signal inputs/outputs, built-in control flow, and standalone components in new code; migrate legacy code incrementally with the CLI schematics.',
            'Use strict TypeScript and `strictTemplates` so the template type-checker catches binding errors at build time (`strictTemplates` is on by default since v22; the upgrade migration sets it to `false` for projects that had not enabled it).',
            'Centralize error handling: `provideBrowserGlobalErrorListeners()` plus a custom `ErrorHandler` that reports to your monitoring tool, rather than `try/catch` sprinkled through components.',
            'In monorepos, Nx enforces module boundaries (e.g. "feature libs may not import other feature libs") with lint rules.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Route["Route: /products, lazy"] --> Smart["ProductsPage - smart<br/>injects ProductStore"]
    Smart -- "inputs" --> Filter["FilterBar - presentational"]
    Smart -- "inputs" --> Grid["ProductGrid - presentational"]
    Grid -- "inputs" --> Card["ProductCard - presentational"]
    Filter -- "outputs" --> Smart
    Card -- "outputs" --> Grid
    Grid -- "outputs" --> Smart
    Smart --> Store["ProductStore service<br/>signals + HttpClient"]
    Store --> API["REST API"]`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'migration schematics for modernizing legacy code',
              code: `ng generate @angular/core:standalone          # NgModules -> standalone components
ng generate @angular/core:control-flow        # *ngIf / *ngFor -> @if / @for
ng generate @angular/core:inject              # constructor params -> inject()
ng generate @angular/core:signal-input-migration   # @Input() -> input()
ng generate @angular/core:output-migration    # @Output() -> output()`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The presentational/smart split maps directly onto change detection: presentational components with OnPush only re-render when their inputs change, so a deep tree of them stays cheap no matter how often the smart parent updates.',
            },
          ],
        },
        {
          id: 'upgrading-and-modernizing',
          title: 'Upgrading and Modernizing a Legacy Angular App',
          summary:
            'Angular\'s predictable release cadence and automated migrations make upgrades routine if you do them regularly — and a large legacy app can be modernized incrementally, one feature at a time, without a rewrite.',
          keyPoints: [
            'Majors ship about every 6 months; each gets 6 months of active support plus 12 months of LTS. Falling more than two majors behind means losing security patches.',
            '`ng update` upgrades packages **and** runs code migrations; go one major at a time and follow the interactive guide at [angular.dev/update-guide](https://angular.dev/update-guide).',
            'Deprecated APIs are kept for at least two majors before removal, which gives you a window to migrate.',
            'Modernize in a deliberate order: standalone → control flow → `inject()` → signal inputs/outputs/queries → OnPush + signals → zoneless → Signal Forms / resources for new code.',
            'Check third-party library compatibility (component libraries, NgRx, testing tools) **before** starting a major upgrade — they are usually the real blocker.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'a safe upgrade routine',
              code: `git switch -c chore/angular-22
ng update                                   # lists what can be updated
ng update @angular/core@22 @angular/cli@22  # framework + automated migrations
ng update @angular/material@22              # first-party libraries next
npx ng build && npx ng test                 # verify, then commit before the next step

# opt-in modernization schematics (run one at a time, review the diff)
ng generate @angular/core:standalone
ng generate @angular/core:control-flow
ng generate @angular/core:inject
ng generate @angular/core:signal-input-migration
ng generate @angular/core:signal-queries-migration
ng generate @angular/core:output-migration`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["NgModules<br/>*ngIf, @Input"] --> B["Standalone<br/>components"]
    B --> C["@if / @for<br/>control flow"]
    C --> D["inject() and<br/>signal inputs/queries"]
    D --> E["OnPush +<br/>signal state"]
    E --> F["Zoneless"]
    F --> G["Signal Forms and<br/>resources for new code"]`,
            },
            {
              type: 'table',
              headers: ['v22 default change', 'What `ng update` does', 'What you should review'],
              rows: [
                ['OnPush by default (`Default` renamed `Eager`)', 'Adds `ChangeDetectionStrategy.Eager` to components without a strategy', 'Gradually remove `Eager` as components move to signals'],
                ['Fetch backend for `HttpClient`', 'Adds `withXhr()` where XHR-specific features are needed', 'Upload progress UI, interceptors relying on XHR behaviour'],
                ['`strictTemplates` on by default', 'Sets it to `false` where it was not enabled', 'Turn it on and fix the type errors it reveals'],
                ['Incremental hydration by default', 'Adds `withNoIncrementalHydration()` where needed', '`@defer` blocks with `hydrate` triggers'],
                ['`?.` returns `undefined` instead of `null`', 'Wraps affected expressions so behaviour is unchanged', 'Templates comparing against `null` strictly'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Make upgrades boring: schedule one shortly after each major ships (once your key libraries support it), keep the change set to "upgrade + migrations only", and do modernization refactors in separate PRs. Teams that upgrade every six months spend hours; teams that skip three majors spend weeks.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'AngularJS (1.x) apps are a different story: there is no `ng update` path. The realistic options are a hybrid app using `@angular/upgrade` during a strangler-fig migration, or a rewrite route by route behind a reverse proxy.',
            },
          ],
        },
        {
          id: 'angular-vs-react',
          title: 'Angular vs React: Mapping the Concepts',
          summary:
            'If you already know React, most Angular ideas have a direct counterpart — the real differences are DI, templates compiled ahead of time, fine-grained signal reactivity, and how much comes built in.',
          keyPoints: [
            'React re-runs a component function on state change and diffs a virtual DOM; Angular compiles templates to instructions that update only the bindings whose values changed — no virtual DOM.',
            'Signals ≈ `useState` + `useMemo`, but with automatic dependency tracking — no dependency arrays.',
            'Angular\'s DI has no React equivalent; Context is the closest, but DI also handles construction, scoping, and test substitution.',
            'Choosing between them is usually about team and project context rather than capability: Angular favours consistency in large enterprise teams; React favours flexibility and a larger ecosystem.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['React', 'Angular'],
              rows: [
                ['Function component + JSX', '`@Component` class + HTML template'],
                ['props', '`input()`'],
                ['callback props (`onChange`)', '`output()` + `(event)` binding'],
                ['controlled input `value` + `onChange`', '`model()` / `[(ngModel)]` / reactive forms'],
                ['`useState`', '`signal()`'],
                ['`useMemo`', '`computed()`'],
                ['`useEffect`', '`effect()`, lifecycle hooks, `afterNextRender`'],
                ['`useRef` (DOM)', '`viewChild()` / template reference variables'],
                ['Context', 'Services + dependency injection'],
                ['`children`', '`<ng-content>`'],
                ['render props', '`ng-template` + `ngTemplateOutlet`'],
                ['`{cond && <X/>}` / `.map()` with `key`', '`@if` / `@for` with `track`'],
                ['`React.lazy` + `Suspense`', '`loadComponent` / `@defer`'],
                ['React Router', '`@angular/router`'],
                ['Custom hooks', 'Services, or functions that call `inject()`'],
                ['React Testing Library', 'TestBed + component harnesses'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The biggest mindset shift for React developers is that an Angular component class is created **once** and lives for the component\'s lifetime — there is no "re-render the function" step. Fields are just fields; you never need `useCallback` or worry about stale closures, and signals handle the "recompute when dependencies change" job that dependency arrays do in React.',
            },
          ],
        },
        {
          id: 'case-study-product-catalog',
          title: 'Case Study: A Product Catalog Feature End to End',
          summary:
            'Putting it all together — a lazy-loaded catalog route with URL-driven filters, a signal store backed by `httpResource`, OnPush presentational components, a deferred reviews panel, and tests.',
          keyPoints: [
            'The URL is the source of truth for filters (`/products?category=shoes&page=2`), bound straight into inputs with `withComponentInputBinding()` — so filters survive refresh and are shareable.',
            'A route-scoped store derives the request URL from those inputs with `computed()`, and `httpResource` refetches whenever it changes.',
            'Presentational components (`FilterBar`, `ProductGrid`, `ProductCard`) are OnPush, input/output only.',
            'Non-critical UI (reviews, recommendations) sits in `@defer` blocks to keep the initial bundle small.',
            'Errors, loading, and empty states are designed explicitly, not left as afterthoughts.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    URL["URL /products?category=shoes&page=2"] --> Page["ProductsPage<br/>category and page as inputs"]
    Page --> Q["computed: request URL"]
    Q --> Res["httpResource<br/>value, isLoading, error"]
    Res --> Grid["ProductGrid OnPush"]
    Page --> FB["FilterBar OnPush"]
    FB -- "filterChange output" --> Nav["router.navigate with new queryParams"]
    Nav --> URL
    Grid --> Card["ProductCard OnPush"]
    Page --> Def["@defer on viewport<br/>Recommendations chunk"]`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'products-page.ts — the smart component',
              code: `@Component({
  selector: 'app-products-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterBar, ProductGrid, Recommendations],
  template: \`
    <app-filter-bar [category]="category()" (filterChange)="applyFilter($event)" />

    @if (products.isLoading()) {
      <app-grid-skeleton />
    } @else if (products.error()) {
      <p class="error">Could not load products. <button (click)="products.reload()">Retry</button></p>
    } @else if (products.hasValue() && products.value().items.length === 0) {
      <p>No products match these filters.</p>
    } @else if (products.hasValue()) {
      <app-product-grid [products]="products.value().items" (addToCart)="cart.add($event)" />
    }

    @defer (on viewport) {
      <app-recommendations [category]="category()" />
    } @placeholder {
      <div class="skeleton" style="height: 240px"></div>
    }
  \`,
})
export class ProductsPage {
  // bound from query params by withComponentInputBinding()
  category = input<string>('all');
  page = input(1, { transform: numberAttribute });

  private router = inject(Router);
  protected cart = inject(CartStore);

  products = httpResource<{ items: Product[]; total: number }>(() => ({
    url: '/api/products',
    params: { category: this.category(), page: this.page() },
  }));

  applyFilter(category: string) {
    this.router.navigate([], { queryParams: { category, page: 1 }, queryParamsHandling: 'merge' });
  }
}`,
            },
            {
              type: 'list',
              items: [
                '**Why URL state:** back/forward buttons, refresh, and shared links all just work; the component has no hidden filter state to keep in sync.',
                '**Why `httpResource`:** request cancellation on rapid filter changes, loading/error state, and refetch-on-change come for free — no manual `switchMap` pipeline.',
                '**Why OnPush everywhere:** updates are driven by signals and inputs only, so the grid of 50 cards is not re-checked when unrelated state elsewhere changes.',
                '**Why `@defer`:** the recommendations widget and its dependencies are a separate chunk that never loads for users who do not scroll that far.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'In an interview, walking through a feature like this — and explaining *why* each piece was chosen — demonstrates more Angular depth than reciting API names. Be ready to discuss the trade-offs: e.g. when you would move the resource into a shared store, or swap `httpResource` for an RxJS pipeline (complex orchestration such as polling, retries with back-off, or combining many streams).',
            },
          ],
        },
      ],
    },
    {
      id: 'angular-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'Angular interview questions from fundamentals through signals, change detection, DI, RxJS, and performance — with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'What is the difference between AngularJS and Angular?',
              answer:
                'They are different frameworks that share a name. AngularJS (1.x, 2010) was a JavaScript framework built around controllers, `$scope`, and two-way binding checked by a digest loop; it reached end-of-life in December 2021. Angular (2+, 2016) was a complete rewrite in TypeScript built around components, dependency injection, ahead-of-time compiled templates, and a unidirectional change-detection tree. There is no direct upgrade path beyond running both side by side during a migration (`ngUpgrade`); in practice, migrating means rewriting.',
            },
            {
              question: 'What are standalone components, and why did Angular move away from NgModules?',
              answer:
                'A standalone component declares its own template dependencies directly in its `imports` array instead of being declared in an `NgModule`. NgModules added a second, parallel dependency system on top of ES modules: to use a component you had to know which NgModule declared it and import that module, which was confusing for newcomers, made lazy loading and tree-shaking coarse-grained, and caused "is not a known element" errors that were hard to trace. Standalone components (default since v19) make each component self-describing, let routes lazy-load a single component with `loadComponent`, and make `@defer` code-splitting possible. NgModules still work for backward compatibility and for some libraries.',
            },
            {
              question: 'Explain signals. How do `signal`, `computed`, and `effect` differ, and when should you avoid `effect`?',
              answer:
                'A `signal` is a writable reactive value: read by calling it, written with `set`/`update`. A `computed` is a read-only derived value that tracks the signals it reads, recomputes lazily only when one changes, and memoizes the result. An `effect` runs a side-effect function whenever the signals it read change, scheduled asynchronously. Avoid `effect` for propagating state — copying one signal into another inside an effect creates extra change-detection cycles, intermediate inconsistent states, and is harder to reason about. Use `computed` for derived values, `linkedSignal` for derived-but-overridable state, and keep `effect` for genuinely external side effects like logging, syncing to `localStorage`, or driving an imperative third-party library.',
            },
            {
              question: 'How does change detection work in Angular, and what does OnPush actually change?',
              answer:
                'Angular keeps a tree of component views. When change detection runs, it walks the tree top-down and, for each view, re-evaluates template bindings and updates DOM nodes whose values differ from the last check. With Zone.js, any async event anywhere (click, timer, HTTP) triggers a check of the whole tree. `OnPush` marks a component as "only check me when I am marked dirty" — which happens when an input reference changes, an event handler in its template fires, an `async` pipe in it emits, a signal read in its template changes, or `markForCheck()` is called. Otherwise the component and its subtree are skipped. The key implication is that OnPush relies on immutability: mutating an object passed as an input does not change its reference, so the child will not update. Since Angular 22 OnPush is the **default** strategy and the old behaviour is called `Eager`; `ng update` adds `Eager` explicitly to existing components so upgrades do not change behaviour.',
            },
            {
              question: 'What is zoneless Angular and what breaks when you migrate to it?',
              answer:
                'Zoneless Angular (`provideZonelessChangeDetection()`, the default for new projects since v21) removes Zone.js, which monkey-patched browser async APIs to tell Angular "something might have changed". Without it, Angular schedules change detection only from explicit notifications: signal writes read by a template, template event handlers, `async` pipe emissions, `markForCheck()`, and input changes via `setInput`. Benefits are a smaller bundle, faster startup, no patched globals, and readable stack traces. What breaks is code that mutated plain class fields inside callbacks Angular does not know about — `setTimeout`, `setInterval`, third-party library callbacks, raw `addEventListener` — since nothing tells Angular to re-render. The fix is to hold that state in signals (or call `markForCheck()`), and code already written with OnPush + signals usually migrates without changes.',
            },
            {
              question: 'Explain Angular\'s hierarchical dependency injection. What happens if a service is provided in a component\'s `providers` array instead of `providedIn: \'root\'`?',
              answer:
                'Angular has two injector hierarchies: environment injectors (the root injector plus one per lazy-loaded route that declares providers) and element injectors (created for components and directives that declare `providers`). When something calls `inject(Token)`, Angular walks up the element injector tree from the requesting component, then up the environment injectors, and returns the first match. `providedIn: \'root\'` registers a single app-wide, tree-shakable instance. Listing the service in a component\'s `providers` creates a **new instance for each instance of that component**, shared by its descendants and destroyed with it — useful for per-widget state (e.g. each editor tab with its own undo stack) but a classic bug when someone adds it there by accident and ends up with several "singletons" that do not share state.',
            },
            {
              question: 'What is the difference between `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`? Give a use case for each.',
              answer:
                'All four map each outer value to an inner Observable and flatten the results; they differ in what happens when a new outer value arrives while an inner one is still active. `switchMap` unsubscribes from (cancels) the previous inner — ideal for type-ahead search or loading data for the current route param, where only the latest result matters. `mergeMap` runs all inners concurrently — for independent parallel work like uploading several files. `concatMap` queues inners and runs them one after another in order — for writes that must not interleave, like saving sequential edits. `exhaustMap` ignores new outer values until the current inner completes — for login or submit buttons, to prevent double submission.',
            },
            {
              question: 'How do you prevent memory leaks from subscriptions in Angular?',
              answer:
                'Long-lived subscriptions (to `valueChanges`, router events, a `Subject` in a service, `interval`) must be torn down when the component is destroyed, otherwise the callback keeps the component alive and keeps running. Preferred options, in order: avoid manual subscriptions by using the `async` pipe or `toSignal()`, both of which unsubscribe automatically; use `takeUntilDestroyed()` from `@angular/core/rxjs-interop` in an injection context; or register cleanup with `DestroyRef.onDestroy`. HttpClient requests complete after one response, so they generally do not leak, though cancelling them on destroy still avoids work for a view that is gone. The older pattern — a `destroy$` Subject with `takeUntil` and `ngOnDestroy` — works but is boilerplate, and `takeUntil` must be the last operator in the pipe to be reliable.',
            },
            {
              question: 'Template-driven vs reactive forms — which would you choose and why?',
              answer:
                'Template-driven forms build the form model implicitly from `ngModel` directives in the template; they are quick for a small login or contact form. Reactive forms build the model explicitly in the class with `FormGroup`/`FormControl`/`FormArray`; they are synchronous, strictly typed, easy to unit test without rendering, and handle dynamic fields, cross-field validation, and async validation cleanly. For anything beyond a trivial form, reactive forms have long been the standard choice. Since Angular 22 there is a third, stable option: **Signal Forms**, where your own signal is the model, validation is declared once in a schema function, and field state is exposed as signals. A senior answer: in a v22+ codebase I would build new forms with Signal Forms (they fit zoneless, signal-based components naturally), keep existing reactive forms unless I am already rewriting them, and reserve template-driven forms for very small cases.',
            },
            {
              question: 'What are pure and impure pipes? Why is calling a method in a template often worse than using a pipe?',
              answer:
                'A pure pipe (the default) is re-executed only when its input value or arguments change by reference; Angular caches the result otherwise. An impure pipe (`pure: false`) runs on every change detection cycle, like `AsyncPipe`, which must check for new emissions. A method call in a template (`{{ formatPrice(item) }}`) is re-executed on every change detection pass that checks that component, because Angular cannot know whether its result changed — with Zone.js and the default strategy that can mean on every click anywhere in the app. A pure pipe or, in modern code, a `computed()` signal gives the same result with caching.',
            },
            {
              question: 'How do route guards work, and are they a security mechanism?',
              answer:
                'Guards are functions the router calls during navigation: `canMatch` (should this route config even be considered — also prevents downloading its lazy bundle), `canActivate` / `canActivateChild` (may the user enter), `canDeactivate` (may the user leave, e.g. unsaved changes), and resolvers (`ResolveFn`) that load data before activation. They return `true`/`false`, a `UrlTree` to redirect, or an Observable/Promise of those. They are **not** security: they run in the browser, and anyone can modify client code or call the API directly. They improve UX by hiding unauthorized screens; real authorization must be enforced by the server on every request.',
            },
            {
              question: 'What does `track` do in `@for`, and what happens if you choose it badly?',
              answer:
                '`track` gives Angular an identity for each item so that when the array changes it can match old and new items, moving, inserting, or removing only the affected DOM nodes and preserving component state for unchanged items. Tracking by a stable unique id (`track item.id`) is correct for dynamic data. `track $index` identifies rows by position, so inserting at the top makes every row appear "changed" — Angular updates every row\'s bindings, and stateful children (focused inputs, expanded panels, child component state) stay attached to the wrong data. Tracking by object identity (`track item`) breaks when data is re-fetched, since new objects with the same content are treated as new items and the whole list is re-created.',
            },
            {
              question: 'What is `@defer` and how is it different from lazy-loaded routes?',
              answer:
                'Lazy-loaded routes split code at the *route* level — a feature\'s bundle loads when the user navigates to it. `@defer` splits code at the *template block* level within a page: the components, directives, and pipes inside the block go into a separate chunk loaded when a trigger fires (`on viewport`, `on interaction`, `on idle`, `on timer`, `when` condition), with `@placeholder`, `@loading`, and `@error` sub-blocks and optional `prefetch`. It is ideal for heavy below-the-fold or interaction-only UI (charts, comment sections, editors). It only splits code if the deferred dependencies are standalone and not referenced elsewhere in the same file; with SSR, `hydrate on …` triggers extend the idea to incremental hydration.',
            },
            {
              question: 'What is hydration and what causes hydration mismatch errors?',
              answer:
                'With SSR, the server sends fully rendered HTML. Hydration is the client-side process of attaching Angular to that existing DOM — wiring up listeners and component state — instead of discarding it and re-rendering, which avoids a visible flicker and layout shift. It requires the DOM the client would render to match what the server rendered. Mismatches come from non-deterministic templates (rendering `new Date()`, random ids), browser-only branches (`window.innerWidth` checks in templates), invalid HTML that the browser parser restructures (a `<div>` inside a `<p>`, tables without `<tbody>`), and direct DOM manipulation. Fixes: keep templates deterministic, move browser-only logic into `afterNextRender`, and use `ngSkipHydration` only as a last resort for components that must manipulate the DOM directly.',
            },
            {
              question: 'How would you share state between two sibling components that have no parent-child relationship?',
              answer:
                'Put the state in an injectable service and have both components `inject()` it. In modern Angular the service holds private writable signals and exposes them via `asReadonly()` plus `computed()` derived values, with methods for each state change — so there is one place where mutations happen, and every consumer updates automatically. Scope the service correctly: `providedIn: \'root\'` for app-wide state, a route\'s `providers` for state that should live and die with a feature, or a common ancestor component\'s `providers` for state local to one widget tree. For large apps with many developers and complex flows, NgRx Store or SignalStore add structure on top of the same idea.',
            },
            {
              question: 'What is the difference between `constructor` and `ngOnInit`?',
              answer:
                'The constructor is a TypeScript/JavaScript feature run when the class instance is created; Angular uses it (and field initializers) as an injection context, so it is where `inject()` calls belong. Inputs have not been bound yet at that point. `ngOnInit` is an Angular lifecycle hook called once after the first round of inputs is set, so it is the place for initialization that depends on inputs. Keeping heavy logic out of the constructor also makes classes easier to construct in tests. With signal inputs, much input-dependent setup moves into `computed()` or `effect()` instead of `ngOnInit`.',
            },
            {
              question: 'How do HTTP interceptors work, and what are typical uses?',
              answer:
                'An interceptor is a function (`HttpInterceptorFn`) in a chain that every `HttpClient` request passes through; it receives the request and a `next` handler, can return a modified request via `req.clone(...)` (requests are immutable), and can operate on the response stream with RxJS operators. They are registered in order with `provideHttpClient(withInterceptors([...]))`. Typical uses: attaching auth tokens, refreshing expired tokens and retrying, global error handling and redirecting on 401, logging and timing, adding correlation ids, showing a global loading indicator, and caching GET responses. Because they are functions running in an injection context, they can `inject()` services directly.',
            },
            {
              question: 'What is `ViewEncapsulation` and how does Angular scope component styles?',
              answer:
                'By default (`ViewEncapsulation.Emulated`), Angular rewrites a component\'s CSS selectors and adds unique attributes like `_ngcontent-abc-c12` to its template elements, so its styles apply only to that component\'s own template — not to children or the rest of the page. `ShadowDom` uses the browser\'s real Shadow DOM for true isolation, and `None` makes the styles global. To style the host element use `:host`; to style based on an ancestor use `:host-context()`. The deprecated `::ng-deep` pierces encapsulation to style child component internals and is best avoided in favour of CSS custom properties or the child exposing inputs/classes.',
            },
            {
              question: 'How would you diagnose and fix a slow Angular page?',
              answer:
                'Measure first: Lighthouse / Core Web Vitals for load performance, and the Angular DevTools profiler to see how often change detection runs and which components are expensive. For load: check bundle sizes (`ng build` stats, budgets), lazy-load routes, `@defer` heavy below-the-fold UI, use `NgOptimizedImage`, and consider SSR with hydration. For runtime: switch components to OnPush with signals, remove method calls from templates (use `computed` or pure pipes), ensure every `@for` tracks a stable id, avoid unnecessary `effect`s, debounce high-frequency inputs, virtualize very long lists with the CDK virtual scroll, and move to zoneless to stop whole-tree checks on every async event. Re-measure after each change.',
            },
            {
              question: 'What does `linkedSignal` solve that `computed` cannot?',
              answer:
                '`computed` is read-only: its value is always a pure function of its sources. Sometimes you need state that *defaults* from another signal but can also be changed by the user — for example "the selected shipping option, which resets to the cheapest option whenever the list of options changes, but which the user can change". With only `signal` + `effect`, you would copy values around and hit timing issues. `linkedSignal(() => options()[0])` is writable via `set`/`update`, and automatically recomputes from its source when the source changes; the longer form `{ source, computation: (newSource, previous) => … }` even lets you keep the previous selection if it still exists in the new list.',
            },
            {
              question: 'What is content projection, and when would you use `ng-template` instead of `ng-content`?',
              answer:
                '`<ng-content>` projects markup that a parent places between the component\'s tags into a slot in the component\'s template (with `select` for multiple named slots) — Angular\'s equivalent of React\'s `children`. The projected content is created and owned by the parent, so it is instantiated even if the child never displays it, and it can only be rendered once. When the child needs to render content conditionally, lazily, multiple times, or with data supplied by the child (like a row template for each list item), pass an `<ng-template>` instead and render it with `ngTemplateOutlet` and a context object — Angular\'s equivalent of render props.',
            },
            {
              question: 'Explain how signals propagate changes internally. Why is it called "push-pull", and why does it avoid glitches?',
              answer:
                'Signals form a dependency graph built dynamically: while a `computed`, `effect`, or template runs, every signal it reads records it as a consumer. On `set()`, the signal increments its version and *pushes* only a "possibly stale" notification to its consumers — nothing is recomputed. Values are *pulled* lazily: when a stale `computed` is read, it checks whether any producer\'s version actually changed and only then reruns. Because recomputation happens on read, after all writes in the task have finished, a consumer never observes a half-updated state (a "glitch", like `fullName` combining a new first name with an old last name) — the classic problem with `combineLatest`, which emits once per source change. Equality checks make `computed`s act as firewalls: if a recomputed value is equal to the previous one, downstream consumers are not considered changed.',
            },
            {
              question: 'What are `resource()`, `rxResource()`, and `httpResource()`, and when would you still use a hand-written RxJS pipeline?',
              answer:
                'They bring async data into the signal graph. You declare `params` as a reactive function of signals and a loader; Angular runs the loader whenever params change, aborts the stale in-flight load, and exposes `value()`, `hasValue()`, `error()`, `isLoading()`, and `status()` as signals. `resource` takes a Promise loader with an `abortSignal`; `rxResource` takes an Observable `stream`; `httpResource` is the HTTP shortcut that goes through `HttpClient`, so interceptors and the SSR transfer cache apply. Returning `undefined` from params keeps the resource idle. All three are stable since v22. I would still write an RxJS pipeline for polling, websockets, retry with exponential back-off, or coordinating multiple streams with precise timing — and resources are for reads, so mutations stay imperative followed by `reload()` or an optimistic `set()`.',
            },
            {
              question: 'What changed in Angular 22 that you need to know when upgrading?',
              answer:
                'The headline changes: OnPush became the default change-detection strategy (`Default` was renamed `Eager`, and the migration adds it explicitly to existing components); Signal Forms and the resource APIs became stable; `HttpClient` uses the Fetch backend by default (`withFetch()` deprecated, `withXhr()` to opt back into XHR, mainly for upload progress); incremental hydration is on by default; `strictTemplates` is on by default for new projects; safe navigation `?.` in templates now returns `undefined` like TypeScript instead of `null`; and the router\'s `paramsInheritanceStrategy` defaults to `\'always\'`. A new `@Service()` decorator offers a shorter root-provided service. TypeScript 6 is required. The practical advice is to run `ng update` one major at a time, review each migration\'s diff, and specifically check the router params change, which has no automatic migration.',
            },
            {
              question: 'Signal Forms vs reactive forms: what is the architectural difference?',
              answer:
                'In reactive forms each `FormControl` owns a copy of the value and announces changes through `valueChanges` Observables; your domain object and the form state are two things you keep in sync. In Signal Forms, `form(model, schema)` wraps **your own signal** — the model is the single source of truth, and the form is a typed field tree over it that adds validation and interaction state (`value`, `errors`, `touched`, `dirty`, `invalid`) as signals. Validation is declared once in a schema function against paths (`required(p.email)`, `validate(p.confirm, ...)`), which makes rules reusable across forms, and `submit()` handles touched-marking, validity checks, the `submitting` state, and mapping server errors back onto fields. Custom controls implement a lightweight `FormValueControl` instead of `ControlValueAccessor`. The trade-off is maturity: reactive forms have a decade of ecosystem; Signal Forms are stable since v22 but newer.',
            },
            {
              question: 'What is `ExpressionChangedAfterItHasBeenCheckedError` (NG0100), why does it exist, and how do you fix it properly?',
              answer:
                'In development mode, after each change detection pass Angular runs a second verification pass and checks that no binding value changed. If one did, it throws `NG0100`, because it means the data flow is not unidirectional: something updated state *during* rendering (a child changing parent state in `ngAfterViewInit`, a getter returning a new object every time, a service updated by a child that a parent already rendered). In production the check does not run, so the UI would silently show stale values. Wrong fixes are `setTimeout` or `detectChanges()` hacks that hide the symptom. Proper fixes: derive the value with `computed()` instead of setting it in a lifecycle hook, move the state up so it is set before the parent renders, return stable references from getters, or — when a child genuinely must inform a parent after render — use an output handled in the next cycle with signals, which schedule a new pass rather than mutating the current one.',
            },
            {
              question: 'How would you design an Angular app for 50+ developers across several teams?',
              answer:
                'Structure around **features and boundaries**, not file types. In an Nx (or similar) monorepo, split into libraries by domain and type — feature (smart, routed), UI (presentational), data-access (stores, API clients), and util — and enforce dependency rules with lint (`feature` may use `ui` and `data-access`, never another `feature`). Each feature is a lazy route with its own route-level providers so state is scoped and the code is split. Share a design system as a library of OnPush, signal-input components with harnesses for tests. Standardize the cross-cutting pieces once: HTTP interceptors, error handling, auth, logging, i18n. Enforce `strictTemplates`, OnPush, and the style guide with lint and CI budgets, and use affected-only builds/tests so CI stays fast. Organizationally, give each team ownership of a set of libraries via CODEOWNERS, and treat shared libraries as products with versioned, reviewed APIs. Micro-frontends (Module/Native Federation) are a last resort for genuinely independent deployment needs, not a default.',
            },
            {
              question: 'When should you NOT use `effect()`, and what are legitimate uses?',
              answer:
                'Do not use `effect()` to derive state (`effect(() => this.total.set(...))`) — use `computed()`; to reset state when a source changes — use `linkedSignal()`; or to fetch data when params change — use a resource. Those patterns create extra change-detection passes, ordering bugs, and potential loops, and they hide data flow. Legitimate uses are side effects that leave the signal world: syncing to `localStorage` or the URL, analytics/logging, driving an imperative third-party widget (often better as `afterRenderEffect` when it touches the DOM), or bridging to non-signal APIs. Use the `onCleanup` callback to cancel timers or subscriptions between runs, and `untracked()` for reads that should not retrigger the effect.',
            },
            {
              question: 'How does Angular protect against XSS, and how can developers accidentally defeat it?',
              answer:
                'Angular treats every bound value as untrusted. Interpolation renders text, never HTML. Property bindings into dangerous sinks are sanitized according to their security context: `[innerHTML]` strips scripts and event-handler attributes, URL bindings neutralize `javascript:` URLs, and resource URLs (iframe `src`, script `src`) are blocked unless explicitly trusted. Templates are compiled AOT, so user data never becomes template code. Developers defeat this by calling `DomSanitizer.bypassSecurityTrust*` on user-influenced data, writing to `nativeElement.innerHTML` directly, using third-party libraries that manipulate the DOM unsafely, or generating Angular templates on the server from user input. Defence in depth adds a strict CSP (Angular supports nonces and `autoCsp`), Trusted Types, and `HttpOnly` cookies so that even a successful injection cannot steal tokens.',
            },
            {
              question: 'What is the difference between `providedIn: \'root\'`, route-level `providers`, and component `providers` in terms of lifetime?',
              answer:
                '`providedIn: \'root\'` creates one instance lazily on first injection that lives for the whole application (and is tree-shaken if never used). Route-level `providers` create an environment injector when the route is first activated; the instance is shared by everything under that route and — importantly — **is not destroyed when you navigate away**; it lives as long as the route configuration\'s injector, which is effectively the app lifetime once created. Component `providers` create a new instance per component instance, shared by its view and content children, and destroyed with the component (its `ngOnDestroy`/`DestroyRef` fires). So for "state that must reset when I leave this screen", provide it on the routed component, not on the route.',
            },
            {
              question: 'How do you make a third-party, non-Angular library (charts, maps, editors) work well in a zoneless, SSR-enabled Angular app?',
              answer:
                'Wrap it in a component that owns its lifecycle. Create the instance in `afterNextRender` so it never runs on the server and the DOM exists; dispose of it with `DestroyRef.onDestroy`. Push data from signals into the library with `afterRenderEffect` (or an `effect`) that calls its imperative API. When the library fires callbacks (a marker click, an editor change), write to a signal or emit an output — in zoneless apps, mutating a plain field in that callback would not re-render. Lazy-load the heavy library with a dynamic `import()` inside `afterNextRender`, or wrap the whole component in `@defer (on viewport)`, so it does not bloat the initial bundle. With SSR, render a placeholder of the same size on the server to avoid layout shift.',
            },
            {
              question: 'Why can calling `inject()` fail with NG0203, and what is an injection context?',
              answer:
                'An injection context is a period during which Angular knows which injector is current: while constructing a class instantiated by DI (constructor and field initializers), inside a provider `useFactory`, in functional guards/resolvers/interceptors, and inside `runInInjectionContext(injector, fn)`. `inject()` reads that ambient injector, so calling it from a lifecycle hook, an event handler, a `setTimeout`, or after an `await` throws `NG0203`. The same rule applies to APIs that use `inject()` internally: `toSignal`, `takeUntilDestroyed` without an explicit `DestroyRef`, `effect`, and resources. The fix is to call them in field initializers or the constructor, or pass the needed `Injector`/`DestroyRef` explicitly when you must create them later.',
            },
            {
              question: 'How do you approach performance for a page rendering thousands of rows?',
              answer:
                'First question whether thousands of rows should be in the DOM at all — pagination or server-side filtering often solves it. If not, virtualize with the CDK `cdk-virtual-scroll-viewport` so only visible rows exist. Make the row component OnPush with signal inputs and immutable data, and `track` by a stable id so updates touch only changed rows. Avoid per-row work in templates (methods, impure pipes, `track` expressions that compute). Move heavy computation (sorting/filtering 100k items) into a `computed()` so it runs once per input change, or into a Web Worker if it blocks the main thread. Batch incoming updates (e.g. from a websocket) and write them to the signal once per frame rather than per message. Measure with the Angular DevTools profiler and the browser Performance panel before and after.',
            },
            {
              question: 'Explain the role of `ControlValueAccessor` and a common bug when implementing it.',
              answer:
                '`ControlValueAccessor` is the adapter that lets any component participate in reactive and template-driven forms. Forms calls `writeValue` to push a value from the model to the view, `registerOnChange` and `registerOnTouched` to give the component callbacks for view-to-model updates, and `setDisabledState` to propagate disabled status; the component registers itself with the `NG_VALUE_ACCESSOR` multi-provider (usually with `forwardRef`). Common bugs: calling `onChange` inside `writeValue` (echoing the model\'s own value back marks the control dirty and can loop), never calling `onTouched` (so "show errors when touched" logic never fires), and ignoring `setDisabledState`. With Signal Forms, the simpler `FormValueControl` interface replaces most of this.',
            },
          ],
        },
      ],
    },
  ],
}
