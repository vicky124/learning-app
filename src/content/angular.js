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
            'Angular is not AngularJS: AngularJS (1.x, 2010) was a different JavaScript framework that reached end-of-life in 2021. Angular 2+ was a full rewrite and shares only the name.',
            'Angular ships a new major version roughly every six months, each with 18 months of support, and provides automated `ng update` migrations for breaking changes.',
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
              type: 'callout',
              kind: 'note',
              text: 'A lot of Angular content online still teaches the pre-v17 style: `NgModule`s everywhere, `*ngIf`/`*ngFor`, `@Input()` decorators, and `zone.js`-driven change detection. That code still works and you will meet it in older codebases, but this guide teaches the modern style first and points out the legacy equivalent where it matters.',
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
            '`app.config.ts` is where app-wide providers live: `provideRouter(routes)`, `provideHttpClient()`, and so on.',
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
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
};`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Recent CLI versions generate shorter file names (`app.ts` rather than `app.component.ts`) following the updated style guide. Both conventions work — match whatever the codebase you are in already uses.',
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
            'Class fields are available in the template; keep logic in the class and keep the template declarative.',
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
            '`afterNextRender()` / `afterEveryRender()` run after the DOM is painted — the right place for direct DOM measurement or third-party DOM libraries, and they never run during server-side rendering.',
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
            'Built-in attribute directives: `NgClass`, `NgStyle`, `NgModel`; `NgOptimizedImage` (`ngSrc`) for images.',
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
              text: 'Angular 21 introduced experimental **Signal Forms** (`@angular/forms/signals`), where the form model is a signal and validation is declared with a schema function. It is the likely long-term direction, but reactive forms remain the stable, production choice until Signal Forms graduates from experimental.',
            },
          ],
        },
        {
          id: 'http-client',
          title: 'HttpClient, Interceptors, and httpResource',
          summary:
            '`HttpClient` makes typed HTTP requests that return Observables, functional interceptors add cross-cutting behaviour like auth headers and error handling, and `httpResource()` exposes a request as signals.',
          keyPoints: [
            'Enable with `provideHttpClient()` in `app.config.ts`; `withFetch()` uses the Fetch API (recommended, and required for good SSR support).',
            '`http.get<T>(url)` returns a **cold** Observable — nothing is sent until something subscribes, and each subscription sends a new request.',
            'Interceptors are functions (`HttpInterceptorFn`) registered with `withInterceptors([...])`; they can modify the request, the response, or handle errors for every call.',
            'Requests are immutable: an interceptor uses `req.clone({ setHeaders: … })` to change one.',
            '`httpResource(() => url)` (signal-based) re-fetches when signals in the URL function change and exposes `value()`, `isLoading()`, `error()`, and `reload()`.',
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
provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor]))`,
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
              type: 'callout',
              kind: 'note',
              text: 'OnPush + signals is the combination to aim for even in Zone.js apps: it makes the component\'s update conditions explicit, catches accidental mutation bugs early, and makes a later move to zoneless a non-event.',
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
            '**Incremental hydration** (`withIncrementalHydration()`) combines with `@defer (hydrate on viewport)` so parts of the page stay as static HTML until a trigger hydrates them.',
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
  provideClientHydration(withEventReplay(), withIncrementalHydration()),
]

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
          ],
        },
        {
          id: 'testing',
          title: 'Testing Angular Applications',
          summary:
            'Angular ships first-class testing support — `TestBed` builds a real component with real DI in a test, `HttpTestingController` fakes the backend, and component harnesses give stable, implementation-agnostic test APIs.',
          keyPoints: [
            'Unit tests run with **Vitest** by default in new projects since Angular 21 (Karma + Jasmine is the long-standing legacy setup, now deprecated); Jest is also common.',
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
            'Use strict TypeScript and `strictTemplates` so the template type-checker catches binding errors at build time.',
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
                'Angular keeps a tree of component views. When change detection runs, it walks the tree top-down and, for each view, re-evaluates template bindings and updates DOM nodes whose values differ from the last check. With Zone.js, any async event anywhere (click, timer, HTTP) triggers a check of the whole tree. `OnPush` marks a component as "only check me when I am marked dirty" — which happens when an input reference changes, an event handler in its template fires, an `async` pipe in it emits, a signal read in its template changes, or `markForCheck()` is called. Otherwise the component and its subtree are skipped. The key implication is that OnPush relies on immutability: mutating an object passed as an input does not change its reference, so the child will not update.',
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
                'Template-driven forms build the form model implicitly from `ngModel` directives in the template; they are quick for a small login or contact form. Reactive forms build the model explicitly in the class with `FormGroup`/`FormControl`/`FormArray`; they are synchronous, strictly typed, easy to unit test without rendering, and handle dynamic fields, cross-field validation, and async validation cleanly. For anything beyond a trivial form, reactive forms are the standard choice. Worth mentioning that Angular 21 introduced experimental Signal Forms, which model the form as a signal with schema-based validation — promising, but experimental, so reactive forms remain the production default.',
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
          ],
        },
      ],
    },
  ],
}
