export const typescriptSection = {
  id: 'typescript',
  label: 'TypeScript',
  icon: '🔷',
  groups: [
    {
      id: 'typescript-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-typescript',
          title: 'What TypeScript Actually Is',
          summary:
            'TypeScript is a structural, gradually-adoptable type layer that compiles down to plain JavaScript by erasing every type annotation — it is not a separate language with its own runtime.',
          keyPoints: [
            'TypeScript is a **syntactic superset** of JavaScript — any JS *syntax* parses as TS. Whether that JS *type-checks* cleanly is another matter: under `strict` (the default since TypeScript 6.0) plenty of loose JS produces errors you must fix or suppress.',
            'Types exist only at compile time; the compiler (`tsc`) or a transpiler (esbuild, swc, Babel, Oxc, or Node.js\'s built-in type stripping) **erases** every annotation, producing plain JavaScript with zero runtime overhead.',
            'A few legacy constructs — `enum`, runtime `namespace`, constructor parameter properties, legacy decorators — are **not** pure erasure; they emit real JavaScript. Modern codebases increasingly ban them with `--erasableSyntaxOnly`.',
            'Type checking and transpiling are **separate jobs**. Most production builds transpile with a fast type-unaware tool and run `tsc --noEmit` (or the native TypeScript 7 `tsc`) in CI/the editor purely as a checker.',
            'Adoption is gradual: a codebase can mix typed and untyped files (`allowJs`, `checkJs`, JSDoc types), and `any` lets you opt out of checking for a specific value when needed.',
            'The same type information powers the editor — autocomplete, inline signatures, "go to definition," safe renames, and automatic import fixes.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'TypeScript adds a static type system on top of JavaScript\'s existing syntax and semantics, checked entirely at compile time by the TypeScript compiler. It does not introduce a new runtime, a new execution model, or new language semantics — every type annotation is stripped away during compilation, and the JavaScript that remains behaves identically to hand-written JS. This is called **type erasure**, and it is the single most important fact about how TypeScript works.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    TS["yourFile.ts<br/>(with type annotations)"] --> Checker["tsc --noEmit<br/>type-checks only"]
    TS --> Strip["esbuild / swc / Oxc / Node.js<br/>ERASES types, no checking"]
    Strip --> JS["yourFile.js<br/>(plain JavaScript, no types)"]
    Checker --> Report["errors in editor / CI"]
    JS --> Runtime["Browser / Node.js<br/>runs it, has never seen a type"]`,
            },
            {
              type: 'p',
              text: 'The diagram shows the most important architectural fact about modern TypeScript tooling: **checking and emitting are decoupled**. The type checker needs the whole program (every import, every `.d.ts`) to answer "is this assignment valid?", which is expensive. Erasing types needs only the current file, which is trivially parallel and fast. That is why Vite, Next.js, Bun, Deno and Node.js all strip types per file and leave checking to `tsc` running in your editor and CI.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'what actually survives compilation',
              code: `interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}\`;
}

// compiles to (roughly):
// function greet(user) {
//   return \`Hello, \${user.name}\`;
// }
// -- 'interface User' vanishes entirely; ': User' and ': string' vanish too.`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Because types are erased, TypeScript cannot catch every bug — it only catches the ones detectable *statically*, from the shapes you\'ve described. A value crossing a genuinely untrusted boundary (an API response, `JSON.parse`, user input) still needs runtime validation; TypeScript can only guarantee your own code uses that value consistently with whatever type you declared for it.',
            },
            {
              type: 'heading',
              text: 'TypeScript is deliberately unsound',
            },
            {
              type: 'p',
              text: 'A *sound* type system guarantees that a value of type `T` really is a `T` at runtime. TypeScript explicitly does not aim for soundness; its design goal is to be a *productive* checker for real-world JavaScript. Known holes include `any`, type assertions (`as`), array index access without `noUncheckedIndexedAccess`, method-parameter bivariance, and mutable array covariance (a `Dog[]` is assignable to `Animal[]`, and you can then push a `Cat` into it). Knowing where the holes are is what separates "it compiles" from "it is correct."',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'two classic soundness holes',
              code: `const names: string[] = [];
const first = names[0];      // typed string, actually undefined
first.toUpperCase();         // compiles, throws at runtime (unless noUncheckedIndexedAccess)

type Animal = { name: string };
type Dog = Animal & { bark(): void };
const dogs: Dog[] = [];
const animals: Animal[] = dogs; // allowed: arrays are treated covariantly
animals.push({ name: 'Tom' });  // now dogs[0].bark() throws`,
            },
            {
              type: 'heading',
              text: 'Where TypeScript stands in 2026',
            },
            {
              type: 'table',
              headers: ['Release', 'When', 'Why it matters'],
              rows: [
                ['TypeScript 5.x', '2023 to 2025', 'Standard decorators, `const` type parameters, `using`, `NoInfer`, inferred type predicates, `isolatedDeclarations`, `--erasableSyntaxOnly`, `--module nodenext` support for `require(esm)`.'],
                ['TypeScript 6.0', 'March 2026', 'Last compiler written in TypeScript. A "bridge" release: new defaults (`strict: true`, `module: esnext`, `types: []`) and deprecation of legacy options (`target: es5`, `moduleResolution: node10`, `baseUrl`, AMD/UMD/SystemJS, `outFile`).'],
                ['TypeScript 7.0', 'July 2026', 'The compiler and language service ported to **Go** (the project code-named Corsa, previewed as `tsgo`). Typically around 10x faster full builds thanks to native code and shared-memory parallelism. Same type-checking behavior as 6.0; legacy options deprecated in 6.0 are now hard errors.'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'TypeScript 7.0 shipped **without** the old JavaScript programmatic compiler API (a new API is planned for a later 7.x release), and embedded-language tooling (Vue/Volar, Svelte, Astro, MDX, Angular templates) still relies on the 6.0 language service. Tools that `import ts from "typescript"` may need TypeScript 6 installed side by side (the `@typescript/typescript6` package). Check your linters and framework plugins before upgrading.',
            },
          ],
        },
        {
          id: 'basic-types-and-annotations',
          title: 'Basic Types and Type Annotations',
          summary:
            'Most TypeScript code barely uses explicit annotations at all — the compiler infers types from context almost everywhere, and annotations are reserved for the boundaries inference cannot see across.',
          keyPoints: [
            'Primitive type annotations mirror JS\'s runtime types: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.',
            '**Type inference** means TypeScript figures out most types automatically from a value\'s initializer — explicit annotations are needed mainly for function parameters (which have no initializer to infer from) and empty containers.',
            'Function return types are usually left to inference too; annotate them explicitly at public API boundaries, where an accidental change in a function\'s implementation would otherwise silently change its inferred return type (and `isolatedDeclarations` requires them on exports).',
            '**Literal types** and **widening**: `const x = \'a\'` has type `\'a\'`, `let x = \'a\'` widens to `string` because it can be reassigned. `as const` freezes a whole expression to its narrowest readonly literal type.',
            '`never` is the empty type (no value inhabits it) — the result of exhaustive narrowing and the return type of functions that always throw. `object` means "any non-primitive"; avoid `{}`, which means "any non-nullish value", not "empty object".',
            '`any` opts a value out of type checking entirely; `void` marks a function that returns nothing meaningful; `unknown` is the type-safe counterpart to `any` (covered in depth later).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'inference vs explicit annotation',
              code: `let age = 30;          // inferred as 'number' — no annotation needed
let name = 'Ava';      // inferred as 'string'

// Function PARAMETERS have no initializer, so TS can't infer them —
// annotate them explicitly, or they silently become 'any'.
function double(n: number): number {
  return n * 2;
}

// Return type is usually left to inference; TS infers 'number' here on its own.
function triple(n: number) {
  return n * 3;
}`,
            },
            {
              type: 'table',
              headers: ['Type', 'Example values', 'Notes'],
              rows: [
                ['`string`', "`'hi'`, `\\`template\\``", 'Any text value.'],
                ['`number`', '`42`, `3.14`, `NaN`', 'One numeric type — no separate int/float.'],
                ['`boolean`', '`true`, `false`', ''],
                ['`null` / `undefined`', '`null`, `undefined`', 'Distinct types; excluded from other types unless `strictNullChecks` is off.'],
                ['`any`', 'anything', 'Disables checking entirely for that value — avoid.'],
                ['`unknown`', 'anything', 'Type-safe `any` — must be narrowed before use.'],
                ['`void`', '(nothing)', "A function's return type when it returns nothing meaningful."],
                ['`never`', '(no value)', 'The bottom type: assignable to everything, nothing is assignable to it. Signals unreachable code.'],
                ['`object`', '`{}`, `[]`, `() => {}`', 'Any non-primitive. Prefer a concrete shape or `Record<string, unknown>`.'],
                ['`{}`', 'anything except `null`/`undefined`', 'A frequent mistake: `{}` accepts `42` and `\'hi\'` too.'],
              ],
            },
            {
              type: 'heading',
              text: 'Literal types and widening',
            },
            {
              type: 'p',
              text: 'Every literal value has its own *literal type*. The checker then decides how far to **widen** it based on whether the binding can change. Understanding widening explains a large share of "why is this `string` and not `\'GET\'`?" errors, especially when passing object properties to functions that expect a union of literals.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'widening and as const',
              code: `const method = 'GET';        // type: 'GET'   (const can never change)
let verb = 'GET';            // type: string  (widened: you might reassign it)

const req = { method: 'GET', url: '/users' };
// req.method: string — object properties are mutable, so they widen

declare function send(m: 'GET' | 'POST', url: string): void;
send(req.method, req.url);   // Error: string is not assignable to 'GET' | 'POST'

const req2 = { method: 'GET', url: '/users' } as const;
// { readonly method: 'GET'; readonly url: '/users' }
send(req2.method, req2.url); // OK

// Arrays: as const turns string[] into a readonly tuple of literals
const roles = ['admin', 'editor', 'viewer'] as const;
type Role = (typeof roles)[number]; // 'admin' | 'editor' | 'viewer'`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A function declared to return `void` does not forbid a returned value when you assign a function *expression* to a `void`-returning function type: `const f: () => void = () => 42` compiles. This is intentional (so `arr.forEach(x => list.push(x))` works even though `push` returns a number), but it means `void` is "the caller must ignore the result", not "the function returns `undefined`".',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Let inference do the work wherever it can — hand-annotating every single variable adds noise without adding safety, since TypeScript already knows `const age = 30` is a `number`. Reserve explicit annotations for function parameters, empty arrays/objects (`const items: string[] = []`), and public function signatures.',
            },
          ],
        },
        {
          id: 'interfaces-and-type-aliases-basics',
          title: 'Describing Object Shapes: Interfaces and Type Aliases',
          summary:
            'An `interface` or a `type` alias both describe the shape of an object — optional properties, readonly properties, and index signatures cover the vast majority of real-world data shapes.',
          keyPoints: [
            'An `interface` names a reusable object shape: `interface User { id: number; name: string; }`.',
            'A `type` alias does the same thing with different syntax (`type User = { id: number; name: string; }`) and can additionally name unions, primitives, and other non-object types.',
            'A `?` after a property name marks it optional (`age?: number`); `readonly` before it prevents reassignment after the object is created.',
            'An **index signature** (`{ [key: string]: number }`) types an object used as a dictionary, where the exact keys aren\'t known ahead of time.',
            '`readonly` is shallow and compile-time only: nested objects remain mutable, and nothing stops runtime mutation. Use `Object.freeze` (or a deep-readonly type plus discipline) if you need guarantees.',
            'Under `exactOptionalPropertyTypes`, `age?: number` means "may be **absent**", not "may be `undefined`" — writing `{ age: undefined }` becomes an error, which matters for PATCH semantics and `in` checks.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'optional, readonly, and index signatures',
              code: `interface Product {
  readonly id: string;   // can be read, never reassigned after creation
  name: string;
  description?: string;  // optional — may be omitted entirely
  price: number;
}

const p: Product = { id: 'p1', name: 'Mouse', price: 25 };
p.name = 'Wireless Mouse'; // fine
p.id = 'p2';               // Error: cannot assign to 'id' because it's readonly

// Index signature — a dictionary of unknown-in-advance string keys to numbers
interface Scoreboard {
  [playerName: string]: number;
}
const scores: Scoreboard = { Ava: 10, Ben: 7 };
scores.Cleo = 5; // fine — any string key is allowed

const s = scores.Dana;  // typed number, but actually undefined!
// With noUncheckedIndexedAccess: typed number | undefined — forces a check.`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'optional vs undefined under exactOptionalPropertyTypes',
              code: `interface Prefs {
  theme?: 'light' | 'dark';
}

const a: Prefs = {};                     // OK: property absent
const b: Prefs = { theme: undefined };   // OK normally; ERROR with exactOptionalPropertyTypes

// If 'explicitly cleared' is a real state, say so in the type:
interface Prefs2 {
  theme?: 'light' | 'dark' | undefined;
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For dictionaries, prefer `Record<string, T>` or a `Map<K, V>` over a hand-written index signature. A `Map` has honest semantics (`get` returns `T | undefined`), never collides with prototype keys like `constructor`, and preserves insertion order for any key type.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'For simple object shapes, `interface` and `type` are close to interchangeable — the choice mostly comes down to team convention at this basic level. The precise differences (declaration merging, what each can express beyond object shapes) matter more once you\'re building shared library types, and are covered in depth later in this guide.',
            },
          ],
        },
        {
          id: 'arrays-tuples-enums',
          title: 'Arrays, Tuples, and Enums',
          summary:
            'Beyond plain arrays, TypeScript can type a fixed-length, fixed-position tuple precisely, and enums give a name to a fixed set of related constant values — though modern TypeScript often prefers a union of string literals instead.',
          keyPoints: [
            'Array types are written `string[]` or `Array<string>` — both are identical, `[]` syntax is more common.',
            'A **tuple** (`[string, number]`) types a fixed-length array where each position has its own specific type — e.g. modeling a `[key, value]` pair, or a React `useState` return value.',
            'A numeric `enum` assigns auto-incrementing numbers to named constants by default; a `string enum` assigns explicit string values, which is usually preferable for debuggability (`console.log` shows the actual value, not a number).',
            'A union of string literal types (`type Status = \'idle\' | \'loading\' | \'error\'`) is often preferred over an `enum` in modern TypeScript — it requires no runtime code at all (pure type erasure) and integrates more naturally with plain JS values like API responses.',
            'Enums cannot run under Node.js type stripping and are rejected by `--erasableSyntaxOnly`; the erasable replacement is an `as const` object plus a derived union type.',
            'Prefer `readonly T[]` (or `ReadonlyArray<T>`) for parameters you don\'t mutate — it documents intent and lets callers pass `as const` arrays.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'tuples in practice',
              code: `// A tuple: exactly 2 elements, first a string, second a number.
let entry: [string, number] = ['temperature', 72];

// This is (simplified) how React types useState's return value:
declare function useState<T>(initial: T): [T, (next: T) => void];
const [count, setCount] = useState(0); // count: number, setCount: (n: number) => void

// Labeled, optional and rest elements — labels show up in editor hints
type HttpResult = [status: number, body: string, headers?: Record<string, string>];
type AtLeastOne<T> = [first: T, ...rest: T[]];

// Variadic tuple types: typed concatenation
type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [...A, ...B];
type C = Concat<[1, 2], ['a']>; // [1, 2, 'a']`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Tuples are still arrays at runtime: `entry.push(99)` compiles on a mutable `[string, number]`, silently breaking the "exactly 2 elements" promise. Use `readonly [string, number]` when the length truly matters.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'enum vs a string-literal union',
              code: `enum Direction { Up, Down, Left, Right }      // numeric: Up = 0, Down = 1, ...
enum Status { Active = 'ACTIVE', Done = 'DONE' } // string enum — explicit values

console.log(Status.Active);  // 'ACTIVE'

// The modern alternative — no runtime object generated at all:
type StatusLiteral = 'ACTIVE' | 'DONE';
function isDone(s: StatusLiteral) { return s === 'DONE'; }`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Unlike almost everything else in TypeScript, `enum` is one of the few constructs that is **not** purely type erasure — it generates a real JavaScript object at runtime. This is exactly why many style guides prefer a string-literal union for simple cases: it costs nothing at runtime and is what you get "for free" typing an API response anyway.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'the erasable enum replacement: as const object + derived union',
              code: `export const Status = {
  Active: 'ACTIVE',
  Done: 'DONE',
} as const;

// Derive the union from the object, so there is one source of truth
export type Status = (typeof Status)[keyof typeof Status]; // 'ACTIVE' | 'DONE'

function setStatus(s: Status) { /* ... */ }
setStatus(Status.Active); // dot-notation still works
setStatus('DONE');        // and so does a plain string from an API
Object.values(Status);    // iterable at runtime, no reverse-mapping surprises`,
            },
            {
              type: 'table',
              headers: ['Option', 'Runtime code?', 'Works with type stripping?', 'Notes'],
              rows: [
                ['Numeric `enum`', 'Yes (with reverse mapping)', 'No', '`Object.values` returns names *and* numbers; numeric values are easy to misuse.'],
                ['String `enum`', 'Yes', 'No', 'Nominal-ish: a plain `\'ACTIVE\'` string is not assignable to it.'],
                ['`const enum`', 'Inlined (none)', 'No', 'Breaks under `isolatedModules` across files; avoid in published libraries.'],
                ['Literal union', 'No', 'Yes', 'Zero cost; no runtime list of values.'],
                ['`as const` object + union', 'Yes (plain object)', 'Yes', 'Best of both: runtime values, dot-access, erasable.'],
              ],
            },
          ],
        },
        {
          id: 'structural-typing',
          title: 'Structural Typing',
          summary:
            'TypeScript compares types by shape, not by declared name or inheritance — a frequent source of confusion for developers coming from Java/C#, and a common interview question in its own right.',
          keyPoints: [
            'TypeScript uses **structural** (duck) typing, not nominal typing.',
            'Two types are compatible if their shapes match, regardless of declared name or inheritance relationship.',
            'An object literal can satisfy an interface it never declared it implements, as long as its shape is compatible.',
            'Extra properties on an object are fine for structural compatibility — only the *required* shape has to match.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'TypeScript uses **structural** (duck) typing, not nominal typing — two types are compatible if their shapes match, regardless of declared name or inheritance relationship. This is a frequent source of confusion for developers coming from Java/C#, and a common interview question: "why does this object literal satisfy this interface even though it never declared it?"',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'structural compatibility',
              code: `interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(\`\${p.x}, \${p.y}\`);
}

// obj never declared "implements Point" — it doesn't need to.
const obj = { x: 10, y: 20, z: 30 };
logPoint(obj); // fine — obj's shape satisfies Point; extra properties are allowed`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["const obj = { x, y, z }"] -->|"does obj have AT LEAST<br/>all of Point's members,<br/>with compatible types?"| Check{"Structural check"}
    Point["interface Point { x: number; y: number }"] --> Check
    Check -->|"Yes: extra z is fine"| Pass["Compatible, assignment allowed"]
    Check -->|"No: missing or wrong-typed member"| Fail["Type error"]`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Structural typing is also why two differently-named interfaces with identical members are fully interchangeable in TypeScript — there is no equivalent of Java\'s "implements" declaration required for compatibility. A class\'s `implements` clause is only a *check* that the class matches; it adds nothing to compatibility.',
            },
            {
              type: 'heading',
              text: 'Excess property checks: the one "exactness" rule',
            },
            {
              type: 'p',
              text: 'Structural typing alone would let typos slip through (`{ colour: \'red\' }` for an options object with optional `color`). So the checker applies **excess property checking** to *fresh* object literals — literals written directly at the place a type is expected. Once the literal is stored in a variable it loses freshness and the normal "at least these members" rule applies again.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'freshness in action',
              code: `interface Options { color?: string; size?: number }

declare function configure(o: Options): void;

configure({ colour: 'red' });     // Error: 'colour' does not exist in type 'Options'

const opts = { colour: 'red' };
configure(opts);                  // Error anyway: no properties in common with Options (weak type detection)

const opts2 = { colour: 'red', size: 2 };
configure(opts2);                 // OK: not fresh, shares 'size', extra 'colour' ignored`,
            },
            {
              type: 'heading',
              text: 'Where structural typing stops',
            },
            {
              type: 'list',
              items: [
                '**Classes with `private`/`protected` or `#private` members** are compared nominally for those members: two classes with identical shapes but separate private fields are not assignable to each other. This is the cheapest way to get nominal behavior.',
                '**Weak types** (all-optional properties) require at least one overlapping property, or assignment fails.',
                '**Enums** are nominal: a string enum member is not assignable from a plain string.',
                '**`unique symbol`** and **branded types** (covered later) deliberately add a phantom member nothing else can have.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Structural typing means `type UserId = string` and `type OrderId = string` are *the same type* — the checker will happily let you pass an order id where a user id is expected. A type alias is just a name, never a new type. Use branded types when mixing them up would be a real bug.',
            },
          ],
        },
        {
          id: 'generics',
          title: 'Generics',
          summary:
            'Generics let a function or type be parameterized over the types it operates on while preserving type relationships, instead of falling back to `any`, which discards all type safety.',
          keyPoints: [
            'A generic parameter (`<T>`) lets a function/type work with many types while keeping their relationships tracked.',
            'TypeScript can infer `T` from how a generic function is called — you rarely have to specify it explicitly.',
            'A `extends` **constraint** (`<T extends { id: number }>`) restricts `T` to shapes with certain required members, so the body can safely use them.',
            'A **default type parameter** (`<T = string>`) is used when the caller doesn\'t specify one, similar to a default function parameter.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Generics let a function/type be parameterized over the types it operates on while preserving type relationships, instead of falling back to `any` (which discards all type safety):',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'basic inference',
              code: `function firstOrDefault<T>(items: T[], fallback: T): T {
  return items.length > 0 ? items[0] : fallback;
}
// TypeScript infers T from usage; the return type is correctly tied to
// the input array's element type, unlike a version typed with \`any\`.

const a = firstOrDefault([1, 2, 3], 0);        // T inferred as number, a: number
const b = firstOrDefault(['x', 'y'], 'none');  // T inferred as string, b: string`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Call["firstOrDefault([1,2,3], 0)"] --> Infer["TS infers T = number<br/>from the call-site arguments"]
    Infer --> Sub["substitutes T with number<br/>everywhere in the signature"]
    Sub --> Result["items: number[], fallback: number,<br/>return type: number"]`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'constraints and default type parameters',
              code: `// Constraint: T must have an 'id' — lets the body safely read item.id
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Default: ApiResponse<T = unknown> lets callers omit T when it isn't known
interface ApiResponse<T = unknown> {
  status: number;
  data: T;
}

const raw: ApiResponse = { status: 200, data: 'anything' };       // T defaults to unknown
const typed: ApiResponse<{ name: string }> = { status: 200, data: { name: 'Ava' } };`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a generic class',
              code: `class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  get size() { return this.items.length; }
}

const numbers = new Stack<number>();
numbers.push(1);
numbers.push(2);
// numbers.push('x'); // Error: Argument of type 'string' is not assignable to 'number'`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A generic without a constraint (bare `<T>`) can be anything, so the function body can only do things valid for *every* possible type — no property access, no arithmetic. A constraint (`<T extends ...>`) is what makes a generic function\'s body actually useful, by narrowing "any type" down to "any type with at least these members."',
            },
            {
              type: 'heading',
              text: 'The "use it twice" rule',
            },
            {
              type: 'p',
              text: 'A type parameter earns its place only when it **relates** two or more positions — an input to an output, or two inputs to each other. A type parameter that appears exactly once is just a disguised `any`-ish cast and usually a code smell.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'useless vs useful type parameters',
              code: `// BAD: T appears once. Caller can pick any T and get an unchecked cast.
declare function parse<T>(json: string): T;
const user = parse<User>(body); // looks safe, validates nothing

// BETTER: be honest, then validate
declare function parseJson(json: string): unknown;

// BAD: T only used once in params, adds nothing over (x: object) => string
declare function keysOf<T extends object>(obj: T): string[];

// GOOD: K ties the key argument to the return type
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const n = getProp({ a: 1, b: 'x' }, 'a'); // number
getProp({ a: 1 }, 'z');                   // Error: 'z' is not assignable to 'a'`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Generics are erased like every other type: inside the function body you cannot do `if (T === string)` or `new T()`. If you need runtime behavior per type, pass a runtime value (a constructor, a schema, a discriminant) and let `T` be inferred *from* it.',
            },
          ],
        },
        {
          id: 'advanced-generics-inference',
          title: 'Advanced Generics: Inference, `const` Type Parameters, and `NoInfer`',
          summary:
            'How the checker actually infers type arguments — candidates, inference sites and contextual typing — and the modern tools (`const` type parameters, `NoInfer`, constraints vs defaults) that let you steer inference instead of fighting it.',
          keyPoints: [
            'Inference collects **candidates** for each type parameter from every argument position where it appears (an *inference site*), then picks a best common type — or reports an error when candidates conflict.',
            'Literal candidates are **widened** (`\'a\'` becomes `string`) unless the type parameter has a literal-friendly constraint or is declared `const`.',
            '`const` type parameters (TS 5.0) make inference behave as if the caller wrote `as const` — readonly tuples and literal types without burdening call sites.',
            '`NoInfer<T>` (TS 5.4) marks a position that must **not** contribute inference candidates, so it is checked against `T` inferred elsewhere.',
            'Context-sensitive arguments (unannotated arrow functions) are inferred in a later pass, after non-context-sensitive ones — which is why argument order sometimes affects inference.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'When you call a generic function without explicit type arguments, the checker runs a small constraint solver. For each parameter whose declared type mentions `T`, it structurally matches the argument type against the parameter type and records what `T` would have to be. Multiple candidates are unified (usually to a union or a best common supertype). Then the solved `T` is substituted into the signature and the call is checked normally.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    A["Call: pick(obj, ['a','b'])"] --> B["Pass 1: match non-context-sensitive args<br/>collect candidates for T and K"]
    B --> C["Fix type params that context-sensitive<br/>callbacks depend on"]
    C --> D["Pass 2: contextually type arrow functions<br/>collect more candidates from their returns"]
    D --> E["Unify candidates, widen literals<br/>unless const or literal constraint"]
    E --> F{"Solution satisfies<br/>constraints?"}
    F -->|"yes"| G["Substitute and check the call"]
    F -->|"no"| H["Error at the argument"]`,
            },
            {
              type: 'heading',
              text: '`const` type parameters',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'preserving literals without as const at every call site',
              code: `declare function routes<T extends readonly string[]>(paths: T): T;
const r1 = routes(['/home', '/about']);       // string[]  (widened)

declare function routes2<const T extends readonly string[]>(paths: T): T;
const r2 = routes2(['/home', '/about']);      // readonly ['/home', '/about']

// Typical use: config builders, routers, state machines, i18n keys
function defineEvents<const E extends Record<string, readonly string[]>>(events: E) {
  return events;
}
const ev = defineEvents({ user: ['created', 'deleted'] });
// ev.user: readonly ['created', 'deleted']`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Use a `readonly` array constraint with `const` type parameters. If the constraint is a mutable `string[]`, a readonly tuple does not satisfy it and inference silently falls back to `string[]` — the `const` modifier appears to do nothing.',
            },
            {
              type: 'heading',
              text: '`NoInfer`: blocking unwanted inference sites',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'the default value should not widen the union',
              code: `declare function createFSM<S extends string>(states: S[], initial: S): void;
createFSM(['idle', 'running'], 'stopped');
// No error! 'stopped' became a second candidate, S = 'idle' | 'running' | 'stopped'

declare function createFSM2<S extends string>(states: S[], initial: NoInfer<S>): void;
createFSM2(['idle', 'running'], 'stopped');
// Error: '"stopped"' is not assignable to '"idle" | "running"'`,
            },
            {
              type: 'heading',
              text: 'Constraints vs defaults vs explicit arguments',
            },
            {
              type: 'table',
              headers: ['Tool', 'What it does', 'Use it when'],
              rows: [
                ['`T extends C`', 'Upper bound: every inferred or supplied `T` must be assignable to `C`', 'The body needs members of `C`, or you want literal inference (`T extends string` keeps `\'a\'`)'],
                ['`T = D`', 'Fallback when nothing is inferred and nothing is supplied', 'Generic *types* used without arguments, e.g. `ApiResponse` meaning `ApiResponse<unknown>`'],
                ['`fn<User>(...)`', 'Skips inference for all type parameters', 'Rarely — TS has no partial inference; supplying one argument forces you to supply all without defaults'],
                ['`const T`', 'Infers readonly literal types', 'DSLs and config objects where exact literals matter'],
                ['`NoInfer<T>`', 'Excludes a position from inference', 'Defaults, fallbacks, "must be one of the above" parameters'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The lack of partial type-argument inference is a common pain point. The standard workaround is **currying**: `makeStore<State>()({ ...initial })` — the outer call fixes the explicit parameter, the inner call infers the rest.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Hover your types. If a generic signature produces a hover tooltip that a teammate cannot read, or inference fails in non-obvious ways, the API is too clever. Library-grade type gymnastics belong in libraries; application code should favor explicit, boring types.',
            },
          ],
        },
        {
          id: 'union-intersection-discriminated',
          title: 'Union, Intersection, and Discriminated Unions',
          summary:
            'Union types model "one of several shapes," intersection types model "must satisfy all of these shapes," and discriminated unions — a shared literal tag TypeScript can narrow on — are the idiomatic way to model state machines and API response shapes precisely.',
          keyPoints: [
            'Union types (`A | B`) model "one of several shapes."',
            'Intersection types (`A & B`) model "must satisfy all of these shapes."',
            'A discriminated union uses a shared literal "tag" field that TypeScript narrows on inside a `switch`/`if`.',
            'This eliminates a whole class of bugs where `data` and `error` are both optional on one flat type, and nothing stops you reading `data` while a request is still loading.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Union types (`A | B`) model "one of several shapes"; intersection types (`A & B`) model "must satisfy all of these shapes." **Discriminated unions** — a shared literal "tag" field that TypeScript can narrow on — are the idiomatic way to model state machines and API response shapes precisely:',
            },
            {
              type: 'code',
              language: 'ts',
              code: `type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function render<T>(state: RequestState<T>) {
  switch (state.status) {
    case 'idle': return 'Waiting to start';
    case 'loading': return 'Loading...';
    case 'success': return state.data; // TS knows .data exists ONLY here
    case 'error': return state.error;  // TS knows .error exists ONLY here
  }
}`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    S["state: RequestState of T"] --> Switch{"switch (state.status)"}
    Switch -->|"'idle'"| B1["state narrowed to<br/>{ status: 'idle' }"]
    Switch -->|"'loading'"| B2["state narrowed to<br/>{ status: 'loading' }"]
    Switch -->|"'success'"| B3["state narrowed to<br/>{ status: 'success'; data: T }<br/>.data is safely accessible"]
    Switch -->|"'error'"| B4["state narrowed to<br/>{ status: 'error'; error: string }<br/>.error is safely accessible"]`,
            },
            {
              type: 'heading',
              text: 'Exhaustiveness checking with `never`',
            },
            {
              type: 'p',
              text: 'The real power of discriminated unions appears when the union *grows*. If every `switch` ends in a check that the remaining type is `never`, adding a new variant turns every unhandled site into a compile error — the compiler becomes your refactoring checklist.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'assertNever makes new variants impossible to forget',
              code: `function assertNever(x: never): never {
  throw new Error('Unhandled variant: ' + JSON.stringify(x));
}

function label<T>(state: RequestState<T>): string {
  switch (state.status) {
    case 'idle': return 'Waiting';
    case 'loading': return 'Loading...';
    case 'success': return 'Done';
    case 'error': return state.error;
    default: return assertNever(state); // state is 'never' here
  }
}

// Later someone adds | { status: 'cancelled' } to RequestState:
// Error: Argument of type '{ status: "cancelled" }' is not assignable to parameter of type 'never'.

// Lighter alternative without a helper:
//   default: { const _exhaustive: never = state; return _exhaustive; }`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'intersection: combining shapes',
              code: `type WithId = { id: number };
type WithTimestamps = { createdAt: Date; updatedAt: Date };

type Entity = WithId & WithTimestamps; // must satisfy BOTH shapes at once
const r: Entity = { id: 1, createdAt: new Date(), updatedAt: new Date() };

// Conflicting members do not error at the declaration — they collapse:
type A = { kind: 'a'; id: string };
type B = { kind: 'b'; id: string };
type AB = A & B; // never  ('a' & 'b' is never, and a discriminant conflict reduces the whole object)

type Weird = { id: string } & { id: number }; // { id: never } — unusable, no error until you try`,
            },
            {
              type: 'heading',
              text: 'Why `|` on objects feels "backwards"',
            },
            {
              type: 'p',
              text: 'Think in **sets of values**. `A | B` is the set of values that are an `A` *or* a `B`, so you can only safely touch members that exist on **both** — the union of value sets gives the *intersection* of accessible members. `A & B` is the set of values that are both, so you get **all** members of each. Narrowing is how you move from the wide union to one specific member set.',
            },
            {
              type: 'table',
              headers: ['Type', 'Values allowed', 'Members you can access without narrowing'],
              rows: [
                ['`A | B`', 'Anything that is an A, or a B', 'Only those common to both'],
                ['`A & B`', 'Only values that are both an A and a B', 'All members of A and of B'],
                ['`unknown`', 'Everything (top type)', 'None'],
                ['`never`', 'Nothing (bottom type)', 'All (vacuously) — but you can never have one'],
              ],
            },
            {
              type: 'p',
              text: "This pattern eliminates an entire class of bugs where `data` and `error` are both optional fields on one flat type and nothing stops you from accidentally reading `data` while the request is actually still loading. The general principle has a name: **make illegal states unrepresentable**.",
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Destructuring early breaks narrowing in older code: `const { status, data } = state` used to lose the link between the two. Modern TypeScript does narrow destructured discriminants when the variables are `const` (since TS 4.6), but it still cannot narrow if you destructure into `let` or reassign. Prefer narrowing on `state.status` directly.',
            },
          ],
        },
        {
          id: 'function-types-and-overloads',
          title: 'Function Types and Overloads',
          summary:
            'A function\'s type can be written and reused like any other type, and overload signatures let a single function present multiple, more precise call signatures than one general signature could express.',
          keyPoints: [
            'A function type is written `(param: Type) => ReturnType` — usable anywhere a type is expected, including as a parameter type for higher-order functions.',
            'Overload signatures declare several specific call shapes above one general implementation signature — callers see only the specific overloads, never the implementation signature.',
            'Overloads are for genuinely different behavior/return types per input shape — a single signature with optional/union parameters is preferred whenever it can express the same thing.',
            'A callback parameter\'s type is usually written inline (`onSuccess: (data: T) => void`) rather than as a separately named type, unless it\'s reused in several places.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'function types for callbacks',
              code: `function fetchData<T>(
  url: string,
  onSuccess: (data: T) => void,
  onError: (error: Error) => void
): void {
  /* ... */
}

// A reusable, named function type — handy when the same shape appears often
type Comparator<T> = (a: T, b: T) => number;
function sortBy<T>(items: T[], compare: Comparator<T>): T[] {
  return [...items].sort(compare);
}`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'overload signatures',
              code: `// Overload signatures — the public, callable shapes:
function makeElement(tag: 'a'): HTMLAnchorElement;
function makeElement(tag: 'img'): HTMLImageElement;
function makeElement(tag: string): HTMLElement;
// Implementation signature — broad, and NOT directly visible to callers:
function makeElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const link = makeElement('a');   // typed as HTMLAnchorElement, not just HTMLElement
const img = makeElement('img');  // typed as HTMLImageElement`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Call["makeElement('a')"] --> Check1{"Does 'a' match<br/>overload 1: (tag: 'a')?"}
    Check1 -->|Yes| Use1["use overload 1's return type:<br/>HTMLAnchorElement"]
    Check1 -->|No| Check2{"Does 'a' match<br/>overload 2: (tag: 'img')?"}
    Check2 -->|Yes| Use2["use overload 2's return type:<br/>HTMLImageElement"]
    Check2 -->|No| Check3{"Does 'a' match<br/>overload 3: (tag: string)?"}
    Check3 -->|Yes| Use3["use overload 3's return type:<br/>HTMLElement"]
    Use1 -.->|"the broad implementation<br/>signature itself is never<br/>visible to callers"| Impl["actual function body runs"]
    Use2 -.-> Impl
    Use3 -.-> Impl`,
            },
            {
              type: 'heading',
              text: 'Variance: why callbacks are checked the way they are',
            },
            {
              type: 'p',
              text: 'Assignability of function types depends on **variance**. Return types are *covariant* (a function returning `Dog` can stand in for one returning `Animal`). Parameter types are *contravariant* under `strictFunctionTypes` (a function accepting `Animal` can stand in for one that accepts `Dog`, not the reverse). **Method syntax** (`m(x: T): void`) is deliberately exempt and stays *bivariant*, an unsound compromise that keeps `Array<Dog>` assignable to `Array<Animal>`. You can annotate generic type parameters with `in`/`out` (TS 4.7) to declare variance explicitly and speed up checking.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'property syntax vs method syntax',
              code: `interface Animal { name: string }
interface Dog extends Animal { bark(): void }

type HandlerProp = { handle: (a: Dog) => void };   // property: strict (contravariant)
type HandlerMeth = { handle(a: Dog): void };       // method: bivariant (lenient)

declare const animalHandler: (a: Animal) => void;
declare const dogOnlyHandler: (a: Dog) => void;

const ok: (a: Dog) => void = animalHandler;      // OK: accepts anything a Dog is
// const bad: (a: Animal) => void = dogOnlyHandler;  // Error under strictFunctionTypes

// Explicit variance annotations
interface Producer<out T> { get(): T }
interface Consumer<in T> { accept(x: T): void }`,
            },
            {
              type: 'heading',
              text: 'Other signature features worth knowing',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'this parameters, rest tuples, assertion and predicate signatures',
              code: `// 'this' is a fake first parameter, erased at compile time
function handleClick(this: HTMLButtonElement, ev: MouseEvent) {
  this.disabled = true;
}

// Rest parameters typed with tuples give you labeled, checked arity
function logEvent(name: string, ...args: [id: number, ok?: boolean]) {}

// Type predicate: caller's variable is narrowed when this returns true
function isString(x: unknown): x is string { return typeof x === 'string'; }

// Assertion signature: narrows by THROWING otherwise
function assertDefined<T>(x: T | undefined, msg: string): asserts x is T {
  if (x === undefined) throw new Error(msg);
}

// Since TS 5.5 simple predicates are inferred — no annotation needed:
const nums = [1, null, 3].filter(x => x !== null); // number[] (was (number | null)[])`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Reach for overloads only when different input shapes genuinely produce different, more specific return types (as with `makeElement` above) — if one general signature with a union parameter type can express the same contract, prefer that; it is simpler to read and to maintain than several overload declarations that all point at one implementation.',
            },
          ],
        },
        {
          id: 'utility-types',
          title: 'Utility Types Worth Knowing Cold',
          summary:
            'A handful of built-in utility types cover most day-to-day type transformations — knowing them cold avoids reinventing them badly, and avoids duplicating a type that should be derived from an existing one.',
          keyPoints: [
            '`Partial<T>` / `Required<T>` — make every property optional, or the opposite.',
            '`Pick<T, K>` / `Omit<T, K>` — select or exclude a subset of properties.',
            '`Readonly<T>` — immutability at the type level.',
            '`Record<K, V>` — a dictionary type keyed by `K` with values of type `V`.',
            '`ReturnType<F>` / `Parameters<F>` — extract types from a function signature, so a type can be derived rather than duplicated.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Utility Type', 'What it does'],
              rows: [
                ['`Partial<T>`', 'All properties of `T` become optional — useful for update/patch payloads.'],
                ['`Required<T>`', 'All properties of `T` become required — the opposite of `Partial<T>`.'],
                ['`Pick<T, K>`', 'A type with only the properties `K` selected from `T`.'],
                ['`Omit<T, K>`', 'A type with the properties `K` excluded from `T`.'],
                ['`Readonly<T>`', 'Every property of `T` becomes read-only at the type level.'],
                ['`Record<K, V>`', 'A dictionary type: keys of type `K`, values of type `V`.'],
                ['`ReturnType<F>`', 'Extracts the return type of a function type `F`.'],
                ['`Parameters<F>`', "Extracts a tuple of a function type `F`'s parameter types."],
                ['`Exclude<T, U>`', 'Removes from union `T` every member assignable to `U`.'],
                ['`Extract<T, U>`', 'Keeps from union `T` only members assignable to `U` (the opposite of `Exclude`).'],
                ['`NonNullable<T>`', 'Removes `null` and `undefined` from `T`.'],
                ['`Awaited<T>`', 'Unwraps a `Promise<T>` (recursively) to the type it resolves to.'],
                ['`InstanceType<C>`', 'The instance type produced by constructing class `C` with `new`.'],
                ['`ConstructorParameters<C>`', 'Tuple of the parameter types of constructor `C`.'],
                ['`NoInfer<T>`', 'Blocks inference from this position (TS 5.4); resolves to `T`.'],
                ['`ThisType<T>`', 'Marker (needs `noImplicitThis`) that sets `this` inside object-literal methods.'],
                ['`Uppercase`/`Lowercase`/`Capitalize`/`Uncapitalize`', 'Intrinsic string-literal transforms.'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`Omit<T, K>` is **not** distributive and does not check that `K` is a real key (`Omit<User, \'idd\'>` silently omits nothing). On a union such as `A | B` it collapses to the common members only. Use a distributive helper (`T extends unknown ? Omit<T, K> : never`) for unions, and `Exclude<keyof T, ...>` with `Pick` when you want key checking. Similarly `Partial` and `Readonly` are *shallow*.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'deriving types from values instead of duplicating them',
              code: `const defaultConfig = { retries: 3, mode: 'fast' as 'fast' | 'safe' };
type Config = typeof defaultConfig;               // { retries: number; mode: 'fast' | 'safe' }

const handlers = { start: () => 1, stop: () => 'x' };
type HandlerName = keyof typeof handlers;         // 'start' | 'stop'
type Results = { [K in HandlerName]: ReturnType<(typeof handlers)[K]> };

async function load() { return { id: 1, tags: ['a'] }; }
type Loaded = Awaited<ReturnType<typeof load>>;   // { id: number; tags: string[] }

// A deep readonly you will eventually write yourself:
type DeepReadonly<T> = T extends (...a: any[]) => any ? T
  : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'utility types in a real update-payload scenario',
              code: `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// A PATCH payload: any subset of the editable fields, never 'id' or 'createdAt'.
type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;
// equivalent to: { name?: string; email?: string }

function updateUser(id: number, changes: UserUpdate) { /* ... */ }
updateUser(1, { name: 'New Name' }); // fine — email is optional here`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`ReturnType<F>`/`Parameters<F>` are specifically useful to avoid duplicating a type that should be *derived* from an existing function — e.g. typing a variable as `ReturnType<typeof buildConfig>` instead of hand-writing a parallel interface that can drift out of sync.',
            },
          ],
        },
        {
          id: 'unknown-vs-any',
          title: '`unknown` vs `any`, and Type Narrowing',
          summary:
            '`any` disables type checking entirely for a value; `unknown` accepts anything but forces you to narrow it before you can operate on it — the correct type for data crossing an untrusted boundary.',
          keyPoints: [
            '`any` disables type checking entirely for that value — a footgun that should be rare and deliberate.',
            '`unknown` accepts any value (like `any`) but forces narrowing before you can operate on it.',
            'Narrowing tools: `typeof`, `instanceof`, a custom type guard, or a schema validator.',
            '`unknown` is the correct type for "data from an untrusted boundary" — an API response, `JSON.parse` output, user input.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`any` disables type checking entirely for that value — a footgun that should be rare and deliberate. `unknown` is the type-safe counterpart: it accepts any value (like `any`) but forces you to **narrow** it (via `typeof`, `instanceof`, a custom type guard, or a schema validator) before you can operate on it — this is the correct type for "data from an untrusted boundary" (an API response, `JSON.parse` output, user input) because it forces explicit validation rather than silently trusting an assumed shape.',
            },
            {
              type: 'code',
              language: 'ts',
              code: `function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x && 'email' in x;
}
// A user-defined type guard — the "x is User" return type lets TS narrow
// x to User in any branch where this function returns true.`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    U["value: unknown"] --> Check{"typeof value === 'string'?"}
    Check -->|Yes| Str["value narrowed to: string<br/>-- .toUpperCase() now allowed"]
    Check -->|No| Check2{"isUser(value)?<br/>(custom type guard)"}
    Check2 -->|Yes| Usr["value narrowed to: User<br/>-- .email now allowed"]
    Check2 -->|No| Rest["value stays: unknown<br/>-- still cannot be used directly"]`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Typing an API response or `JSON.parse` result as `any` silently propagates type-unsafety through everything downstream that touches it. Typing it as `unknown` and narrowing at the boundary contains the risk to one well-audited spot.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The hand-written guard `isUser` above checks only that `id` and `email` *exist*, not their types, so it is a lie the compiler believes. A type predicate is an unchecked promise. For anything crossing a trust boundary, validate with a schema library (Zod, Valibot, ArkType, or any Standard Schema compatible validator) and derive the TypeScript type from the schema (`z.infer<typeof Schema>`) so the runtime check and the static type cannot drift.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'any leaks, unknown contains',
              code: `const a: any = JSON.parse(text);
const len = a.items.length;        // no error; len is any, and so is everything derived from it

const u: unknown = JSON.parse(text);
// u.items                          // Error: 'u' is of type 'unknown'
if (typeof u === 'object' && u !== null && 'items' in u && Array.isArray(u.items)) {
  u.items.length;                  // OK: narrowed step by step
}

// 'catch (e)' is unknown with useUnknownInCatchVariables (part of strict)
try { risky(); } catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
}`,
            },
          ],
        },
        {
          id: 'type-narrowing-control-flow',
          title: 'Type Narrowing and Control-Flow Analysis',
          summary:
            'Narrowing is how TypeScript refines a wide type (a union, `unknown`) to a specific one as it walks your code — the checker tracks a type per variable per program point, and every `if`, `switch`, `in`, `typeof` and assignment can change it.',
          keyPoints: [
            'The declared type of a variable never changes, but its **narrowed type** is computed at each point in the control-flow graph, merging at joins (after an `if/else`).',
            'Built-in narrowing constructs: `typeof`, `instanceof`, `in`, equality (`===`, `!==`), truthiness, discriminant checks, `Array.isArray`, user-defined predicates and assertion functions.',
            'Narrowing is lost across function boundaries (callbacks) for `let` and mutable properties, because the checker cannot prove nothing reassigned them in between.',
            'Since TS 5.5 the compiler infers type predicates from simple function bodies, and since 5.4 closures after the last assignment keep narrowing of `let`/parameters.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TD
    S["x: string | number | null"] --> N{"x == null?"}
    N -->|"true"| T1["x: null"]
    N -->|"false"| T2["x: string | number"]
    T2 --> Ty{"typeof x === 'string'?"}
    Ty -->|"true"| T3["x: string"]
    Ty -->|"false"| T4["x: number"]
    T3 --> J["after merge: string | number | null<br/>(union of all branch exits)"]
    T4 --> J
    T1 --> J`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'the narrowing toolbox',
              code: `type Shape = { kind: 'circle'; r: number } | { kind: 'rect'; w: number; h: number };
type Cat = { meow(): void };
type Fish = { swim(): void };

function demo(x: string | number | Date | Cat | Fish | null | undefined) {
  if (x == null) return;                 // equality: removes null AND undefined
  if (typeof x === 'string') x.trim();   // typeof
  else if (typeof x === 'number') x.toFixed();
  else if (x instanceof Date) x.getTime(); // instanceof
  else if ('meow' in x) x.meow();          // 'in' narrows by property presence
  else x.swim();                           // only Fish remains
}

// Truthiness narrowing removes falsy values, which can also remove valid ones:
function pad(n: number | undefined) {
  if (n) { /* BUG: n === 0 is excluded too */ }
  if (n !== undefined) { /* correct */ }
}`,
            },
            {
              type: 'heading',
              text: 'Where narrowing is lost',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'callbacks and mutation',
              code: `function f(user: { name?: string }) {
  if (user.name) {
    [1, 2].forEach(() => {
      user.name.toUpperCase();  // Error: narrowing of a mutable property is not kept inside callbacks
    });
    const name = user.name;     // idiom: copy to a const; narrowing of a const is permanent
    setTimeout(() => name.toUpperCase());
  }
}

// Aliased conditions (TS 4.4) also narrow, when the alias is const / readonly:
function g(x: unknown) {
  const isStr = typeof x === 'string';
  if (isStr) x.length;          // OK
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer narrowing by **discriminant** over shape-probing with `in`. A literal `kind` field is cheap to check, is exhaustiveness-checkable, and survives refactors. Use `in` mostly for unions of unrelated third-party types you cannot add a tag to.',
            },
          ],
        },
        {
          id: 'interface-vs-type',
          title: '`interface` vs `type`, Precisely',
          summary:
            'Both can describe object shapes and are largely interchangeable for that — the real differences are declaration merging and what each can express beyond plain object shapes.',
          keyPoints: [
            '`interface` supports **declaration merging** — multiple `interface Foo {}` declarations with the same name merge into one.',
            'Declaration merging is used heavily for extending third-party library types.',
            '`type` can express unions, intersections, tuples, mapped, and conditional types that `interface` cannot.',
            'Common team convention: `interface` for object/class shapes meant to be extended or implemented; `type` for unions, aliases, and computed/utility types.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Both can describe object shapes and are largely interchangeable for that use case. Key differences: `interface` supports **declaration merging** (multiple `interface Foo {}` declarations with the same name merge into one — used heavily for extending third-party library types) and is generally preferred for public object/class shapes for slightly better error messages and extendability; `type` can express unions, intersections, tuples, mapped, and conditional types that `interface` cannot.',
            },
            {
              type: 'table',
              headers: ['', '`interface`', '`type`'],
              rows: [
                ['Object shapes', 'Yes', 'Yes'],
                ['Declaration merging', 'Yes — redeclaring the same name merges members', 'No — redeclaring the same name is a compile error'],
                ['Unions / intersections', 'No', 'Yes (`A | B`, `A & B`)'],
                ['Tuples, mapped, conditional types', 'No', 'Yes'],
                ['Typical use', 'Object/class shapes meant to be extended or implemented', 'Unions, aliases, and computed/utility types'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    D1["interface Window {<br/>  title: string;<br/>}"] --> Merge["TypeScript merges them<br/>automatically — same name,<br/>same scope"]
    D2["interface Window {<br/>  isVisible: boolean;<br/>}"] --> Merge
    Merge --> Result["effective Window = {<br/>  title: string;<br/>  isVisible: boolean;<br/>}"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The common team convention: `interface` for object shapes meant to be extended/implemented, `type` for unions, aliases, and utility/computed types.',
            },
            {
              type: 'heading',
              text: 'The subtler differences',
            },
            {
              type: 'list',
              items: [
                '**`extends` vs `&`:** `interface B extends A` reports an error immediately if a member conflicts; `type B = A & { ... }` silently intersects (conflicting property types become `never`). Interface extension is also cached by name, which the compiler resolves faster than repeated deep intersections.',
                '**Implicit index signatures:** an object *type alias* is assignable to `Record<string, unknown>`, but an *interface* is not, because interfaces are open to merging. This surprises people passing interfaces to functions that take `Record<string, unknown>`.',
                '**Error messages and hover:** interfaces display by name; aliases of intersections can expand to a wall of members.',
                '**`class implements`** works with both, as long as the type is an object shape (not a union).',
                '**Recursive types:** both can be recursive; aliases can recurse through unions, conditional types and tuples (`type Json = string | number | boolean | null | Json[] | { [k: string]: Json }`).',
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'module augmentation uses interface merging',
              code: `// types/express.d.ts — must be a module (has an import/export) to augment
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; roles: string[] };
  }
}

// Same trick for Vite env vars:
//   interface ImportMetaEnv { readonly VITE_API_URL: string }`,
            },
          ],
        },
        {
          id: 'conditional-types-infer',
          title: 'Conditional Types and `infer`',
          summary:
            'A conditional type picks between two types based on a compile-time compatibility check, and `infer` lets that check simultaneously *capture* a piece of the type being checked for reuse in the result.',
          keyPoints: [
            'Syntax: `T extends U ? X : Y` — a type-level ternary, evaluated entirely at compile time.',
            '`infer` can only appear inside the `extends` clause of a conditional type — it declares a new type variable that TypeScript fills in by pattern-matching against the checked type.',
            'This is exactly how built-in utilities like `ReturnType<F>` and `Awaited<T>` are implemented — they are not special-cased by the compiler, just ordinary conditional types shipped in the standard library.',
            'Conditional types **distribute** over a union input by default — `ToArray<A | B>` produces `ToArray<A> | ToArray<B>`, not one combined array type.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A conditional type is a type-level `if`: `T extends U ? X : Y` evaluates to `X` if `T` is assignable to `U`, otherwise `Y` — entirely at compile time, with no runtime cost. `infer` extends this by letting you *extract* a piece of `T` into a new type variable, usable in the `X` branch, based on how `T` structurally matches a pattern.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'building ReturnType from scratch with infer',
              code: `// If T is a function type, CAPTURE its return type as R and produce it;
// otherwise fall back to 'never' (T didn't match the function shape).
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet() { return 'hello'; }
type Greeting = MyReturnType<typeof greet>; // 'string'

// This is (almost) exactly how the built-in ReturnType<F> is implemented.`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    T["T = () => string"] --> Match{"Does T match the pattern<br/>(...args: any[]) => infer R ?"}
    Match -->|"Yes — R captured as 'string'"| Result["MyReturnType<T> = R = string"]
    Match -->|No match| Never["MyReturnType<T> = never"]`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'unwrapping a Promise with infer',
              code: `type Unwrap<T> = T extends Promise<infer V> ? V : T;

type A = Unwrap<Promise<number>>; // number
type B = Unwrap<string>;          // string — T didn't match Promise<...>, so it passes through`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Conditional types distributing over unions is a common source of surprise: `Unwrap<Promise<number> | string>` does NOT collapse into one check — it evaluates `Unwrap<Promise<number>>` and `Unwrap<string>` separately and unions the results (`number | string`). Wrapping the checked type in a tuple (`[T] extends [U] ? ... : ...`) is the standard trick to disable this distribution when you want a single, non-distributed check.',
            },
            {
              type: 'heading',
              text: 'Distribution, `never`, and `infer ... extends`',
            },
            {
              type: 'p',
              text: 'Distribution only happens when the checked type is a **naked type parameter** (`T extends ...`). Distributing over `never` (an empty union) yields `never` with no branches evaluated, which is why `IsString<never>` is `never`, not `false`. Also, a conditional type whose checked type is still generic is **deferred**: the checker cannot pick a branch until `T` is known, so inside a generic function body you usually cannot assign a value to a conditional return type without a cast.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'distributive vs non-distributive, and constrained infer',
              code: `type IsString<T> = T extends string ? true : false;
type D = IsString<string | number>;       // boolean  (true | false, distributed)
type N = IsString<never>;                 // never

type IsStringND<T> = [T] extends [string] ? true : false;
type D2 = IsStringND<string | number>;    // false
type N2 = IsStringND<never>;              // true

// 'infer X extends C' (TS 4.7) constrains the captured type
type FirstNum<T> = T extends [infer H extends number, ...unknown[]] ? H : never;
type F1 = FirstNum<[1, 'a']>;   // 1
type F2 = FirstNum<['a', 1]>;   // never

// Recursion: split a path into segments
type Split<S extends string> = S extends \`\${infer H}/\${infer T}\` ? [H, ...Split<T>] : [S];
type Parts = Split<'users/42/posts'>;     // ['users', '42', 'posts']`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Recursive conditional types hit instantiation depth limits ("Type instantiation is excessively deep") and slow the checker and editor for every consumer. Tail-recursive forms are optimized up to about 1000 levels, others far fewer. If a type needs heroic recursion, ask whether a runtime function or a schema would serve better.',
            },
          ],
        },
        {
          id: 'mapped-types',
          title: 'Mapped Types',
          summary:
            'A mapped type produces a new object type by iterating over the keys of an existing one, transforming each property — the mechanism `Partial`, `Readonly`, `Pick`, and every similar built-in utility type are actually built from.',
          keyPoints: [
            'Syntax: `{ [K in keyof T]: SomeTransform<T[K]> }` — iterates every key `K` of `T`, producing a new type with the same keys and transformed value types.',
            '`+`/`-` modifiers before `readonly` or `?` add or strip that modifier explicitly — `{ -readonly [K in keyof T]: T[K] }` removes `readonly` from every property.',
            '**Key remapping** with `as` (e.g. `[K in keyof T as NewKeyType]`) can rename, filter out (by mapping to `never`), or transform keys themselves, not just their values.',
            'This is literally how `Partial<T>`, `Required<T>`, and `Readonly<T>` are implemented in TypeScript\'s own standard library — they are just mapped types, not compiler built-ins.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    T["T = { name: string; age: number }"] --> Iter["{ [K in keyof T]?: T[K] }<br/>iterates each key K of T"]
    Iter --> K1["K = 'name' -> name?: string"]
    Iter --> K2["K = 'age' -> age?: number"]
    K1 --> Out["MyPartial<T> =<br/>{ name?: string; age?: number }"]
    K2 --> Out`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'implementing Partial and Readonly from scratch',
              code: `type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Stripping readonly and optionality back off with -modifiers:
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] }; // removes '?' from every property`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'key remapping with `as`',
              code: `interface Person {
  name: string;
  age: number;
}

// Rename every key by prefixing it with 'get' and capitalizing — building a
// type for a getter-object, e.g. { getName: () => string; getAge: () => number }
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Mapping a key to `never` inside a remap (`[K in keyof T as T[K] extends Function ? never : K]`) filters that key out of the resulting type entirely — a common pattern for producing a type with only the non-function (data) properties of another type.',
            },
            {
              type: 'heading',
              text: 'Homomorphic mapped types and arrays',
            },
            {
              type: 'p',
              text: 'A mapped type of the form `{ [K in keyof T]: ... }` where `T` is a type parameter is **homomorphic**: it preserves the `readonly` and `?` modifiers of the original keys, and when `T` is an array or tuple it maps element-wise and returns an array or tuple, not an object. Writing the key set some other way (`[K in Keys]` over a plain union) loses this behavior. This is why `Partial<[1, 2]>` is `[1?, 2?]`.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'building lookups from unions and discriminated unions',
              code: `type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'key'; code: string };

// Map each discriminant to its payload: key remapping with 'as' over a union
type EventMap = { [E in Event as E['type']]: Omit<E, 'type'> };
// { click: { x: number; y: number }; key: { code: string } }

// Promisify every method of an API
type Async<T> = {
  [K in keyof T]: T[K] extends (...a: infer A) => infer R ? (...a: A) => Promise<R> : T[K];
};

// Safe event emitter: handler argument depends on the event name
declare function on<K extends keyof EventMap>(name: K, h: (p: EventMap[K]) => void): void;
on('key', p => p.code);   // p: { code: string }`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Prefer built-in utilities and named helper types over inlining a mapped type everywhere. A hover that shows `Async<UserApi>` is far more readable than the expanded mapped result, and giving types good names is the cheapest documentation you can write.',
            },
          ],
        },
        {
          id: 'template-literal-types',
          title: 'Template Literal Types',
          summary:
            'Template literal types apply the same interpolation syntax as runtime template literals, but at the type level — combining unions of string literals into every possible resulting combination.',
          keyPoints: [
            'Syntax mirrors runtime template literals: `` `prefix-${SomeUnion}` `` — but `SomeUnion` is a type, and the result is a new union of every possible interpolated string.',
            'Combining two union types inside one template literal type produces the full cross-product of every combination.',
            'Paired with `keyof` and mapped-type key remapping, template literal types can derive precise event-name or CSS-property-style string types directly from an existing object type.',
            'Built-in intrinsic string manipulation types — `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>` — operate on string literal types the same way.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'combining unions into every combination',
              code: `type Size = 'small' | 'medium' | 'large';
type Color = 'red' | 'blue';

type Variant = \`\${Color}-\${Size}\`;
// 'red-small' | 'red-medium' | 'red-large' | 'blue-small' | 'blue-medium' | 'blue-large'
// -- all 6 combinations generated automatically, exhaustively`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'deriving event-handler prop names from a data shape',
              code: `interface FormFields {
  email: string;
  password: string;
}

// { onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void }
type ChangeHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}Change\`]: (value: T[K]) => void;
};`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Template literal types are entirely a compile-time construct — like every TypeScript type, they vanish after erasure. Their real value is catching typos and mismatches in string-based APIs (CSS-in-JS class names, event names, route paths) at compile time instead of at runtime.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'parsing strings with infer: typed route params',
              code: `type RouteParams<P extends string> =
  P extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? { [K in Param | keyof RouteParams<\`/\${Rest}\`>]: string }
    : P extends \`\${string}:\${infer Param}\`
      ? { [K in Param]: string }
      : {};

type UserPostParams = RouteParams<'/users/:userId/posts/:postId'>;
// { userId: string; postId: string }

declare function navigate<P extends string>(path: P, params: RouteParams<P>): void;
navigate('/users/:userId', { userId: '42' });   // OK
navigate('/users/:userId', {});                 // Error: property 'userId' is missing

// Pattern literal types: a string that merely STARTS with a prefix
type DataAttr = \`data-\${string}\`;
const ok: DataAttr = 'data-testid';
// const no: DataAttr = 'aria-label';  // Error`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Cross-products grow multiplicatively: a template over three unions of ten members each is a 1000-member union, and the compiler caps unions at roughly 100,000 members ("Expression produces a union type that is too complex"). Keep template unions small, and prefer `` `${string}-${string}` `` pattern types when you only need a shape check.',
            },
          ],
        },
        {
          id: 'satisfies-operator',
          title: 'The `satisfies` Operator',
          summary:
            '`satisfies` checks that a value is compatible with a type without widening the value\'s own inferred type the way an explicit annotation or `as` cast would — giving you validation and precise inference at the same time.',
          keyPoints: [
            'A plain annotation (`const config: Config = {...}`) validates the value **and** widens its inferred type to exactly `Config`, losing more specific literal types.',
            '`as` casts trust the developer completely and perform no real validation — TypeScript checks only that the cast is at least plausible, not that the value is correct.',
            '`satisfies` validates that the value is compatible with a type, while letting TypeScript infer the value\'s own **most specific** type from the literal itself.',
            'This matters whenever you need downstream code to see narrower types than the checked-against type provides — e.g. a specific string literal instead of the general `string` it was declared as.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'annotation vs as vs satisfies',
              code: `type RGB = { r: number; g: number; b: number };

// 1) Plain annotation: validated, but widened — 'palette' is typed exactly as
//    Record<string, RGB>, so palette.red isn't specifically known to exist.
const paletteA: Record<string, RGB> = {
  red: { r: 255, g: 0, b: 0 },
};
// paletteA.red.r is fine, but paletteA.blue is also "valid" per the type (undefined at runtime)

// 2) 'as': no real validation — a typo wouldn't be caught.
const paletteB = { red: { r: 255, g: 0, b: 0 } } as Record<string, RGB>;

// 3) satisfies: validated AND keeps the precise literal type.
const paletteC = {
  red: { r: 255, g: 0, b: 0 },
} satisfies Record<string, RGB>;
// paletteC's inferred type is { red: { r: number; g: number; b: number } } --
// TS still knows exactly which keys exist, so paletteC.red.r autocompletes correctly
// AND paletteC.blue is correctly flagged as a compile error (unlike paletteA).`,
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    V["{ red: { r: 255, g: 0, b: 0 } }"] --> A["const x: Record<string, RGB> = ...<br/>validated, but WIDENED to Record<string, RGB>"]
    V --> B["... as Record<string, RGB><br/>NOT really validated, WIDENED to Record<string, RGB>"]
    V --> C["... satisfies Record<string, RGB><br/>validated, type stays the specific literal shape"]
    C --> Keep["x.red.r autocompletes;<br/>x.blue is correctly a compile error"]`,
            },
            {
              type: 'table',
              headers: ['Approach', 'Validates the value?', "Widens the value's inferred type?"],
              rows: [
                ['`const x: T = value`', 'Yes', 'Yes — `x` is exactly `T`'],
                ['`value as T`', 'No (barely — must be "plausible")', 'Yes — the expression is exactly `T`'],
                ['`value satisfies T`', 'Yes', 'No — keeps the most specific inferred type'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`satisfies` is especially useful for configuration objects consumed by strongly-typed APIs (routers, theme systems, state machines) where you want compile-time validation that every value matches an expected shape, but still want autocomplete and exact literal types for each individual value afterward.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'satisfies + as const, and exhaustive key tables',
              code: `// 1) Exact literals AND validation: combine with as const
const routes = {
  home: '/',
  user: '/users/:id',
} as const satisfies Record<string, \`/\${string}\`>;
type RouteName = keyof typeof routes;      // 'home' | 'user'
type UserPath = typeof routes.user;        // '/users/:id'

// 2) Contextual typing flows in: callbacks get parameter types from the target
type Handlers = Record<'click' | 'key', (e: { at: number }) => void>;
const h = {
  click: e => e.at,        // e is typed from Handlers
  key: e => e.at + 1,
} satisfies Handlers;
// h is still the specific object type, so h.click exists and h.nope would be an error

// 3) Exhaustive tables: adding a union member forces you to update the table
type Plan = 'free' | 'pro' | 'team';
const limits = { free: 1, pro: 10, team: 100 } satisfies Record<Plan, number>;`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`satisfies` only affects checking and inference, it never changes emitted JavaScript. It is also erasable syntax, so it works under `--erasableSyntaxOnly` and Node.js type stripping (unlike `enum`).',
            },
          ],
        },
        {
          id: 'decorators',
          title: 'Decorators',
          summary:
            'A decorator is a function that intercepts and can transform a class, method, or property declaration at definition time — the mechanism behind frameworks like Angular and NestJS, now standardized (Stage 3) after years as a TypeScript-only experimental feature.',
          keyPoints: [
            'A decorator is applied with `@decoratorName` immediately above a class, method, property, or accessor declaration.',
            'TypeScript originally shipped decorators as an experimental, non-standard feature (`experimentalDecorators: true`, closely matching an old ECMAScript proposal). Since TypeScript 5.0, decorators written **without** that flag use the newer TC39 (Stage 3) semantics, which have a different runtime signature. The proposal is still not part of the ECMAScript standard, and Node.js type stripping rejects decorator syntax.',
            '`emitDecoratorMetadata` (used by NestJS and TypeORM for dependency injection by constructor parameter type) works only with the legacy mode, so many frameworks still require `experimentalDecorators`.',
            'A method decorator receives the target and a `context` object, and can replace the method entirely — the mechanism used for logging, memoization, and access-control wrappers.',
            'Frameworks like Angular (`@Component`, `@Injectable`) and NestJS (`@Controller`, `@Get`) use class decorators heavily to attach metadata that their dependency-injection systems read at startup.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A decorator is just a function, called automatically by the compiler/runtime at the moment a class (or one of its members) is defined, and given the chance to observe or replace it. This is a compile-time-adjacent mechanism — unlike most of TypeScript, standardized (Stage 3) decorators do produce real, runtime-executed code (they run once, when the class is defined, not on every instantiation).',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'a logging method decorator (Stage 3 syntax)',
              code: `function logCalls<This, Args extends unknown[], Return>(
  originalMethod: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const methodName = String(context.name);
  function replacementMethod(this: This, ...args: Args): Return {
    console.log(\`Calling \${methodName} with\`, args);
    const result = originalMethod.call(this, ...args);
    console.log(\`\${methodName} returned\`, result);
    return result;
  }
  return replacementMethod;
}

class Calculator {
  @logCalls
  add(a: number, b: number) {
    return a + b;
  }
}

new Calculator().add(2, 3);
// logs: "Calling add with [2, 3]" then "add returned 5"`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Define["class Calculator { @logCalls add(...) {...} }<br/>is being defined"] --> Apply["logCalls(originalAddMethod, context)<br/>runs ONCE, at class-definition time"]
    Apply --> Replace["returns replacementMethod,<br/>which BECOMES Calculator.prototype.add"]
    Replace --> Later["new Calculator().add(2, 3)<br/>calls replacementMethod, which wraps<br/>and still calls the original"]`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The legacy `experimentalDecorators` decorators (still used by many existing Angular/NestJS codebases; check your framework\'s current guidance) and the newer Stage 3 standardized decorators are **not** the same feature — they have different runtime call signatures and are not fully interchangeable. Check which mode a codebase\'s `tsconfig.json` enables before writing a new decorator, since code copied from one style will not compile correctly under the other.',
            },
          ],
        },
        {
          id: 'tsconfig-essentials',
          title: '`tsconfig.json`\'s Most Consequential Options',
          summary:
            'A handful of `tsconfig.json` options meaningfully change what the type checker actually catches — `strict` mode alone is the single highest-leverage setting in the entire file.',
          keyPoints: [
            '`"strict": true` enables a whole bundle of stricter checks at once — turning it on (rather than opting into checks piecemeal) is the standard recommendation for any new project.',
            '`strictNullChecks` (included in `strict`) is the single most impactful of the bundle: without it, `null`/`undefined` are silently assignable to every type, defeating a huge share of TypeScript\'s value.',
            '`noImplicitAny` (included in `strict`) errors on a value that would otherwise silently fall back to `any` because TypeScript couldn\'t infer anything more specific — usually a missing annotation.',
            '`moduleResolution` (`"bundler"`, `"node16"`, etc.) controls how TypeScript resolves `import` paths to files — mismatching it against your actual bundler/runtime\'s resolution algorithm is a common source of "works in the editor, fails at build" errors.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Strict["strict: true"] --> A["strictNullChecks<br/>null/undefined no longer<br/>silently fit every type"]
    Strict --> B["noImplicitAny<br/>unannotated values can't<br/>silently become any"]
    Strict --> C["strictFunctionTypes<br/>function parameters checked<br/>more rigorously"]
    Strict --> D["...and several more,<br/>all bundled as one flag"]`,
            },
            {
              type: 'table',
              headers: ['Option', 'What it actually changes'],
              rows: [
                ['`strict: true`', 'Enables the full bundle below at once — the recommended default for new projects.'],
                ['`strictNullChecks`', '`null`/`undefined` are no longer silently assignable to every other type — you must explicitly include them in a type (`string | null`) to allow them.'],
                ['`noImplicitAny`', 'Errors when TS would otherwise silently infer `any` (e.g. an unannotated function parameter) instead of a real type.'],
                ['`strictFunctionTypes`', 'Checks function parameter types contravariantly — catches more real bugs when comparing function types.'],
                ['`noUncheckedIndexedAccess`', "Index signature access (`obj[key]`) returns `T | undefined` instead of just `T`, correctly reflecting that the key might not exist."],
                ['`target`', 'Which JS language version the output is compiled down to (e.g. `ES2020`) — affects what syntax is transformed vs. left as-is.'],
                ['`module` / `moduleResolution`', 'Which module system output to generate, and the algorithm used to resolve `import` specifiers to files — must match your actual runtime/bundler.'],
                ['`exactOptionalPropertyTypes`', '`x?: T` no longer accepts an explicit `undefined`. Not part of `strict`.'],
                ['`noImplicitOverride`, `noFallthroughCasesInSwitch`, `noImplicitReturns`', 'Cheap safety nets, not part of `strict`; worth enabling on new code.'],
                ['`verbatimModuleSyntax`', 'Imports/exports are emitted exactly as written; anything without a `type` modifier is kept. Replaces `importsNotUsedAsValues`/`preserveValueImports`.'],
                ['`isolatedModules`', 'Reports constructs a per-file transpiler cannot handle (re-exporting types without `type`, `const enum` across files).'],
                ['`erasableSyntaxOnly`', 'Errors on `enum`, runtime `namespace`, parameter properties and other non-erasable syntax (TS 5.8).'],
                ['`skipLibCheck`', 'Skips type-checking `.d.ts` files: faster and hides dependency conflicts, at the cost of not catching broken declarations.'],
                ['`noEmit`', 'Use `tsc` purely as a checker when a bundler or runtime does the transpiling.'],
              ],
            },
            {
              type: 'heading',
              text: 'Modern 2026 baselines',
            },
            {
              type: 'p',
              text: 'TypeScript 6.0 changed defaults to match how people already configure projects: `strict` is on, `module` defaults to `esnext`, `target` to a recent ES version, `types` to `[]` (so `@types/*` packages are no longer auto-included; list `"types": ["node"]` explicitly), and `rootDir` to the tsconfig directory. TypeScript 7.0 keeps those defaults and turns options deprecated in 6.0 into errors: `target: es5`, `moduleResolution: node`/`node10`, `baseUrl`, `module: amd/umd/systemjs`, `outFile`, and `esModuleInterop: false`. Check the official release notes for your exact compiler version.',
            },
            {
              type: 'code',
              language: 'json',
              title: 'app bundled by Vite/esbuild/Next (compiler is only a checker)',
              code: `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["vite/client"],
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "erasableSyntaxOnly": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}`,
            },
            {
              type: 'code',
              language: 'json',
              title: 'Node.js package or library compiled with tsc',
              code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "declaration": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
            },
            {
              type: 'table',
              headers: ['Situation', '`module` / `moduleResolution`', 'Why'],
              rows: [
                ['Code is bundled (Vite, webpack, esbuild, Next.js)', '`ESNext` (or `Preserve`) / `bundler`', 'Bundler-style resolution: extensionless relative imports, `exports` maps, no need to match Node exactly.'],
                ['Code runs directly in Node.js (apps, CLIs, libraries)', '`NodeNext` / `NodeNext`', 'Mirrors Node: relative imports need explicit extensions (`./a.js`), format follows `package.json` `type`.'],
                ['Running `.ts` directly with Node type stripping', '`NodeNext` + `allowImportingTsExtensions` / `rewriteRelativeImportExtensions`, `erasableSyntaxOnly`', 'Imports carry the real `.ts` extension; only erasable syntax is allowed.'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '`moduleResolution: "bundler"` is **wrong for a published library or a Node program run without a bundler**: it lets you write imports that Node itself cannot resolve at runtime. If the output is executed by Node directly, use `NodeNext` so the checker enforces what Node enforces.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'what strictNullChecks actually catches',
              code: `function getLength(s: string) {
  return s.length;
}

function find(items: string[], target: string) {
  return items.find(item => item === target); // string | undefined
}

const result = find(['a', 'b'], 'c');

// WITHOUT strictNullChecks: this compiles, then throws at RUNTIME if
// result happens to be undefined — TS treats undefined as assignable to string.
getLength(result);

// WITH strictNullChecks: this is a COMPILE-TIME error —
// Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
// Forces you to handle the undefined case explicitly:
if (result !== undefined) {
  getLength(result); // now safely narrowed to 'string'
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A codebase without `strictNullChecks` gets dramatically less real protection from TypeScript than its type annotations suggest — every type implicitly includes `null`/`undefined` as valid values, so a huge share of the "TypeScript would have caught this" bugs that actually happen in practice are really "strictNullChecks would have caught this, and it wasn\'t on."',
            },
          ],
        },
        {
          id: 'modules-and-declaration-files',
          title: 'Modules, Type-Only Imports, and Declaration Files',
          summary:
            'How TypeScript resolves and emits modules, why `import type` and `verbatimModuleSyntax` matter, and how `.d.ts` files, `@types` packages and module augmentation describe code the compiler did not compile.',
          keyPoints: [
            'Use `import type { X }` (or inline `import { type X }`) for anything that exists only as a type; with `verbatimModuleSyntax` the compiler emits value imports exactly as written and errors where a type import is missing its `type` modifier.',
            'Under `NodeNext`, relative imports need the **runtime** extension (`./util.js` even when the file is `util.ts`), because TypeScript never rewrites specifiers. `rewriteRelativeImportExtensions` (TS 5.7) lets you write `./util.ts` and have it rewritten on emit.',
            'A `.d.ts` file contains only declarations: it describes the shape of JavaScript that exists elsewhere. Libraries publish them via the `types` field or `exports` conditions in `package.json`.',
            '`@types/*` packages (DefinitelyTyped) supply declarations for untyped JS packages. Since TS 6.0 `types` defaults to `[]`, so globals like `node` or `jest` must be listed in `tsconfig.json` explicitly.',
            '`isolatedDeclarations` (TS 5.5) requires exported APIs to be fully annotated so declaration files can be generated per file without a full type check, which parallel tools exploit.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'type-only imports and re-exports',
              code: `import type { User } from './user.js';        // erased completely
import { fetchUser, type UserId } from './user.js'; // value kept, type erased

export type { User };                          // type-only re-export
export { fetchUser };

// Why it matters: a per-file transpiler (esbuild, swc, Node type stripping) cannot know
// whether 'User' is a type or a value without reading ./user.ts. The 'type' keyword removes
// the guess, so output is the same whether you check types or not.`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'writing a declaration for an untyped module and augmenting a global',
              code: `// src/types/legacy-chart.d.ts
declare module 'legacy-chart' {
  export interface ChartOptions { width: number; height: number }
  export function render(el: HTMLElement, opts: ChartOptions): void;
}

// Wildcard module for asset imports
declare module '*.svg' {
  const url: string;
  export default url;
}

// Augment a global (file must be a module, hence the empty export)
declare global {
  interface Window { analytics: { track(event: string): void } }
}
export {};`,
            },
            {
              type: 'code',
              language: 'json',
              title: 'package.json for a dual-typed library',
              code: `{
  "name": "my-lib",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"]
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'In `exports` maps the `"types"` condition must come **first**; conditions are matched in order, so a `"default"` listed before it will be picked and your types never load. Publish tools such as `arethetypeswrong` (attw) catch the CJS/ESM dual-package mistakes that otherwise show up as confusing consumer-side errors.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer `export type { ... }` and `isolatedModules` in shared code, avoid `const enum` and `export =`/`import = require()` in new code, and use `import x = require()` only for genuine CommonJS interop. ES modules are the default in current Node.js, which can also `require()` ES modules, which is why `NodeNext` models both worlds.',
            },
          ],
        },
        {
          id: 'branded-types-and-runtime-validation',
          title: 'Branded Types and Runtime Validation',
          summary:
            'Structural typing makes `UserId` and `OrderId` interchangeable strings; brands add a phantom marker to create nominal-like types, and schema validation turns untrusted data into branded or typed values at the boundary.',
          keyPoints: [
            'A **brand** is an intersection with a phantom property (`string & { readonly __brand: \'UserId\' }`) that exists only in the type system, so ids, validated emails or sanitized HTML cannot be mixed up with plain strings.',
            'Brands cost nothing at runtime, but create them only through one **smart constructor** that validates; casting with `as` anywhere else defeats the purpose.',
            'The compiler cannot validate external data. Pair types with a schema library (Zod, Valibot, ArkType, or any Standard Schema implementation) and **derive the type from the schema**, so there is a single source of truth.',
            'Validate at the edge (HTTP handlers, queue consumers, `localStorage` reads, env vars) and pass parsed, typed values inward; do not re-validate in every function.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'a branded id with a smart constructor',
              code: `declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function toUserId(raw: string): UserId {
  if (!/^usr_[a-z0-9]{8}$/.test(raw)) throw new Error('Invalid user id');
  return raw as UserId;               // the ONE place the cast is allowed
}

declare function loadUser(id: UserId): Promise<unknown>;
declare const orderId: OrderId;

loadUser(toUserId('usr_ab12cd34')); // OK
loadUser('usr_ab12cd34');           // Error: string is not assignable to UserId
loadUser(orderId);                  // Error: OrderId is not assignable to UserId`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'schema as the single source of truth (Zod-style)',
              code: `import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'member']),
});
type User = z.infer<typeof UserSchema>;   // derived, cannot drift from the validator

async function getUser(id: string): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  return UserSchema.parse(await res.json()); // throws if the payload is wrong
}

// Non-throwing variant for expected failures
const result = UserSchema.safeParse(input);
if (!result.success) return result.error.issues;
result.data.email; // typed`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A generic helper like `async function get<T>(url: string): Promise<T>` is a lie detector in reverse: it lets every caller claim any `T` without proof. Make the validator a parameter instead (`get(url, UserSchema)`) so the type is inferred from something that actually runs.',
            },
          ],
        },
        {
          id: 'modern-typescript-features',
          title: 'Modern TypeScript 5.x and 6.x Features Worth Adopting',
          summary:
            'A guided tour of the newer language and compiler features that change how idiomatic TypeScript is written: `using`, `satisfies`, `const` type parameters, `NoInfer`, inferred predicates, `erasableSyntaxOnly`, and the TypeScript 6 defaults.',
          keyPoints: [
            '`using` / `await using` (TS 5.2) give deterministic cleanup via `Symbol.dispose` / `Symbol.asyncDispose`, like C# `using` or Python `with`.',
            '`satisfies` (4.9), `const` type parameters (5.0), `NoInfer` (5.4) and inferred type predicates (5.5) remove common reasons for casts and manual annotations.',
            '`--erasableSyntaxOnly` (5.8) restricts TypeScript to syntax that can be stripped to whitespace, so files run unmodified under Node.js type stripping, Deno and Bun.',
            '`--isolatedDeclarations` (5.5) and `--verbatimModuleSyntax` (5.0) make output predictable for fast, per-file tooling.',
            'TypeScript 6.0 (March 2026) adds `es2025` lib/target, Temporal types, `RegExp.escape`, `Map.getOrInsert`, `#/` subpath imports and flips defaults; 7.0 (July 2026) is the native port.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'using: deterministic resource cleanup',
              code: `class TempFile implements Disposable {
  constructor(readonly path: string) {}
  [Symbol.dispose]() {
    console.log('deleting', this.path);
    // fs.rmSync(this.path)
  }
}

function work() {
  using file = new TempFile('/tmp/a.txt');   // disposed when the block exits,
  if (Math.random() > 0.5) throw new Error('boom'); // even on throw or return
}

async function withConn() {
  await using conn = await openConnection(); // calls Symbol.asyncDispose
  await conn.query('select 1');
}
declare function openConnection(): Promise<AsyncDisposable & { query(s: string): Promise<void> }>;`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`using` needs the `esnext.disposable` lib (included by `esnext`) and a runtime that has `Symbol.dispose`, or a polyfill. Check your target runtimes before adopting it; the compiler can downlevel the syntax but not invent the symbols.',
            },
            {
              type: 'table',
              headers: ['Feature', 'Version', 'Replaces / enables'],
              rows: [
                ['`satisfies`', '4.9', 'Validate without widening; fewer `as` casts'],
                ['Standard decorators', '5.0', 'Non-experimental decorator semantics'],
                ['`const` type parameters', '5.0', '`as const` at every call site'],
                ['`verbatimModuleSyntax`', '5.0', '`importsNotUsedAsValues`, `preserveValueImports`'],
                ['`using` declarations', '5.2', 'try/finally cleanup boilerplate'],
                ['`NoInfer`', '5.4', 'Tricks like `T & {}` to block inference'],
                ['Inferred type predicates', '5.5', 'Manual `x is T` on simple filters'],
                ['`isolatedDeclarations`', '5.5', 'Fast declaration emit for monorepos'],
                ['`rewriteRelativeImportExtensions`', '5.7', 'Writing `.js` for `.ts` files under NodeNext'],
                ['`erasableSyntaxOnly`', '5.8', 'Guards against enums/namespaces for Node stripping'],
                ['`es2025` target/lib, Temporal types', '6.0', 'Newer built-ins in lib typings'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Adopt features by problem, not by novelty. Turn on `erasableSyntaxOnly` and `verbatimModuleSyntax` for new projects, use `satisfies` for config objects, and reach for `const` type parameters and `NoInfer` only when you are authoring generic APIs.',
            },
          ],
        },
        {
          id: 'typescript-7-native-and-type-stripping',
          title: 'TypeScript 7 (Native) and Running TypeScript Directly',
          summary:
            'The compiler has been rewritten in Go and ships as TypeScript 7.0, roughly an order of magnitude faster; meanwhile Node.js can run erasable TypeScript directly. Together they change what "build step" means.',
          keyPoints: [
            'TypeScript 7.0 (July 2026) is the native port of the compiler and language service. The team reports typical full-build speedups of about 8x to 12x, from native code and shared-memory parallelism (`--checkers`, `--builders`, `--singleThreaded`).',
            'It is designed to give the same diagnostics as TypeScript 6.0; the 6.0 release deprecated old options and changed defaults precisely so 7.0 could drop them. Plan the upgrade as 5.x to 6.0 (fix deprecations) then 7.0.',
            'Initial gaps: no stable JavaScript programmatic API yet (a new one is planned for a later 7.x), and embedded-language tooling for Vue, Svelte, Astro, MDX and Angular templates still relies on 6.0. Verify your tool chain before switching.',
            'Node.js strips types natively and without a flag in current releases (stable in v24.12 and v25.2, unflagged since v22.18 and v23.6). It does not type-check and ignores `tsconfig.json`.',
            'Only **erasable syntax** works under stripping: no `enum`, runtime `namespace`, parameter properties, or decorators; imports must use real `.ts` extensions and `import type` for types.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Src["app.ts"] --> Old["Classic pipeline<br/>tsc or bundler transpile then dist/app.js then node"]
    Src --> Strip["Type stripping<br/>node app.ts<br/>(types become whitespace)"]
    Src --> Check["tsc --noEmit (TS 7 native)<br/>check only, in CI and editor"]
    Strip --> Run["Runs immediately<br/>no source maps needed,<br/>line numbers preserved"]
    Check --> Gate["Type errors fail the build"]`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'a minimal modern workflow',
              code: `# check types only (the native tsc in TypeScript 7)
npx tsc --noEmit

# run TypeScript directly on a recent Node.js (no ts-node, no tsx, no build)
node src/server.ts

# a tsconfig that keeps you honest about what stripping can run
#   "erasableSyntaxOnly": true,
#   "verbatimModuleSyntax": true,
#   "allowImportingTsExtensions": true,
#   "rewriteRelativeImportExtensions": true   // only if you also emit JS with tsc`,
            },
            {
              type: 'table',
              headers: ['Concern', 'Type stripping (Node)', 'Transpiler (esbuild/swc/tsx)', 'tsc emit'],
              rows: [
                ['Type checking', 'No', 'No', 'Yes (unless noEmit)'],
                ['`enum`, `namespace` code, parameter properties', 'Not supported', 'Supported', 'Supported'],
                ['Reads `tsconfig.json` (`paths`, JSX, target)', 'No', 'Partly', 'Yes'],
                ['Downlevels new syntax', 'No', 'Yes', 'Yes'],
                ['Build step', 'None', 'Yes', 'Yes'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Type stripping is not a replacement for `tsc`: it executes code that has type errors without complaint. Keep a type-check step in CI. Also remember that `paths` aliases are a compiler-only feature; at runtime use package `imports` (`#utils/*`) which both Node and TypeScript understand.',
            },
          ],
        },
        {
          id: 'type-level-performance-and-testing',
          title: 'Type Performance, Project Structure, and Testing Types',
          summary:
            'Types are code: they can be slow, buggy and in need of tests. Learn how to find expensive types, structure large repos with project references, and assert on types in a test suite.',
          keyPoints: [
            'Slow checking usually comes from a few hot spots: huge unions, deep recursive conditional types, intersections of many large object types, and implicit return types of complex generics.',
            'Diagnose with `tsc --extendedDiagnostics` and `tsc --generateTrace dir`, then inspect the trace in a Chromium trace viewer or with `@typescript/analyze-trace`.',
            'Fixes: name and annotate types so the checker caches them, prefer `interface extends` over big `&` chains, split giant unions, use `skipLibCheck`, and add explicit return types on hot public functions.',
            '**Project references** (`composite`, `references`, `tsc -b`) split a monorepo into incrementally built units with declaration-only boundaries.',
            'Test types like code: `expectTypeOf` (Vitest), `tsd`, or `// @ts-expect-error` lines assert both that valid code compiles and invalid code is rejected.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'finding where the checker spends time',
              code: `tsc --noEmit --extendedDiagnostics          # check time, memory, instantiation counts
tsc --noEmit --generateTrace ./trace         # writes trace.json and types.json
npx @typescript/analyze-trace ./trace        # lists hot files and types

# incremental builds across packages
tsc -b                                       # builds referenced projects in dependency order`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'asserting on types',
              code: `import { expectTypeOf, test } from 'vitest';

test('getProp keeps the key-to-value relationship', () => {
  const user = { id: 1, name: 'Ava' };
  expectTypeOf(getProp(user, 'id')).toEqualTypeOf<number>();
  expectTypeOf(getProp(user, 'name')).toEqualTypeOf<string>();
});

// No framework needed: a negative test with @ts-expect-error.
// If the line below ever STOPS being an error, the directive itself becomes an error.
// @ts-expect-error  'z' is not a key of the object
getProp({ a: 1 }, 'z');

declare function getProp<T, K extends keyof T>(obj: T, key: K): T[K];`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer `// @ts-expect-error` to `// @ts-ignore`. The former fails when the error goes away, so suppressions cannot silently rot; the latter hides everything forever. ESLint\'s `@typescript-eslint/ban-ts-comment` can enforce this with a required description.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Over-clever types are technical debt. A type that needs a paragraph to explain, produces an unreadable error message, and costs seconds in the editor should be replaced with something simpler, even if that means a small runtime check or a looser type at one boundary.',
            },
          ],
        },
      ],
    },
    {
      id: 'typescript-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'TypeScript interview questions covering the type system from fundamentals to advanced type-level programming, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'Explain the difference between `interface` declaration merging and why it matters when working with third-party TypeScript libraries.',
              answer:
                'Declaration merging means multiple `interface` declarations with the same name in the same scope are automatically combined into a single interface with all their members — `type` aliases cannot do this (redeclaring a `type` with the same name is a compile error). This is specifically useful for augmenting third-party library types you don\'t control: for example, extending an Express `Request` interface to add a custom `user` property attached by your auth middleware, by declaring `interface Request { user?: User }` in your own ambient type declaration file — TypeScript merges it with the library\'s own `Request` interface rather than conflicting with it, which would be impossible to do cleanly with a `type` alias.',
            },
            {
              question: "Why is `unknown` considered safer than `any` for typing the result of `JSON.parse` or an external API response, given that both technically \"accept anything\"?",
              answer:
                '`any` disables type checking entirely for that value AND for anything derived from it — you can call any method, access any property, and pass it anywhere, all without a compile error, even if the actual runtime shape is completely different, silently propagating type-unsafety through your codebase. `unknown` also accepts any value being *assigned* to it, but the compiler refuses to let you *operate* on an `unknown` value (call a method, access a property) until you\'ve narrowed it via a type guard, `typeof`/`instanceof` check, or a runtime schema validator (e.g. Zod) — forcing you to explicitly handle the fact that data from an untrusted boundary might not match your assumed shape, which is exactly the discipline you want at a JSON-parsing or API-response boundary where the actual runtime shape is genuinely unverified until checked.',
            },
            {
              question: "What's the practical difference between a discriminated union and simply making every field on a type optional, for modeling something like an API request's loading/success/error states?",
              answer:
                'With every field optional (`{ data?: T; error?: string; isLoading?: boolean }`), the type system allows — and does nothing to prevent — logically impossible combinations, like `isLoading: true` and `data` simultaneously populated with stale results, or both `data` and `error` set at once; consuming code has to defensively check combinations that should never happen, and the compiler provides no guarantee that a given code path is actually handling every real state correctly. A discriminated union makes illegal states genuinely unrepresentable: each variant only has the fields relevant to that state, and TypeScript\'s control-flow narrowing (via `switch`/`if` on the discriminant field) guarantees, at compile time, that you can only access `data` in the branch where the type system has proven it exists — turning a class of runtime bugs (reading `undefined` data, or missing a state) into compile-time errors instead.',
            },
            {
              question: 'Why does TypeScript allow an object literal with extra properties to satisfy an interface that declares fewer properties, and is this a loophole?',
              answer:
                'It follows directly from structural typing: TypeScript checks whether a value has *at least* the required shape, not whether it has *exactly* that shape — an object with extra properties still structurally satisfies an interface requiring a subset of them, which is sound (any code expecting `{ x, y }` can safely ignore an extra `z`). It is not a loophole so much as a deliberate design choice for flexibility. The one place this seems to break is "excess property checking" on object *literals* assigned directly (e.g. `const p: Point = { x: 1, y: 2, z: 3 }` does error) — TypeScript special-cases fresh object literals specifically to catch likely typos, even though the same object assigned via an intermediate variable (`const obj = { x: 1, y: 2, z: 3 }; const p: Point = obj;`) is allowed, since at that point it\'s indistinguishable from any other structurally-compatible value.',
            },
            {
              question: 'What does a generic constraint (`<T extends SomeType>`) actually restrict, and why does a plain unconstrained `<T>` limit what a generic function can do internally?',
              answer:
                'An unconstrained `<T>` could be instantiated with literally any type, so inside the function body TypeScript can only allow operations valid for every conceivable type — which is almost nothing beyond assignment and passing the value through unchanged; you cannot access `.length`, call a method, or do arithmetic, because some possible `T` wouldn\'t support it. A constraint (`<T extends { length: number }>`) narrows the universe of types `T` could be to only those with at least the given shape, which is what licenses the function body to safely use `.length` on any value of type `T` — the constraint is a promise to the compiler (enforced at every call site) that whatever type is actually passed in will have that member, letting the body rely on it.',
            },
            {
              question: 'Walk through how `infer` extracts a type inside a conditional type, using `ReturnType<F>` as the example.',
              answer:
                '`type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never` works by structurally pattern-matching the input type `F` against the shape `(...args: any[]) => infer R`. If `F` is a function type, TypeScript performs the match and, in doing so, binds whatever appears in the return-type position of that match to the new type variable `R` — `infer` is only legal inside this `extends` clause precisely because it needs the compiler to be in the middle of a structural comparison to have something to bind against. The `? R : never` branch then simply returns that captured `R` if the match succeeded, or `never` if `F` wasn\'t a function type at all (the match failed, so there was nothing to infer). This same technique underlies most of TypeScript\'s advanced built-in utility types — `Awaited<T>`, `Parameters<F>`, and `InstanceType<C>` are all ordinary conditional types using `infer` in different positions of the pattern.',
            },
            {
              question: 'Why are `Partial<T>`, `Readonly<T>`, and similar utility types described as "just mapped types," and what does that mean practically?',
              answer:
                'It means they aren\'t special compiler intrinsics — they\'re ordinary TypeScript code, defined in TypeScript\'s own standard library `.d.ts` files using the mapped-type syntax `{ [K in keyof T]: ... }` that\'s available to any TypeScript developer to use themselves. `Partial<T>` is literally `{ [K in keyof T]?: T[K] }` — iterate every key of `T`, keep the same value type, but add `?`. Practically, this means you\'re never limited to the built-in set: if you need a transformation the standard library doesn\'t provide (e.g. a type that makes only SOME properties optional, or renames every key with a prefix), you write your own mapped type using the exact same `[K in keyof T]` mechanism, optionally combined with key remapping (`as`) or template literal types for the key names.',
            },
            {
              question: 'What is the actual difference between casting a value with `as SomeType` and validating it with `satisfies SomeType`?',
              answer:
                '`as` performs no real validation beyond a loose plausibility check (the source and target types must have SOME overlap) — it\'s an assertion that tells the compiler "trust me, treat this value as this type," and after the cast, the expression\'s type becomes exactly the asserted type, discarding whatever more specific type TypeScript could otherwise have inferred. `satisfies` does the opposite on both counts: it genuinely checks that the value is structurally compatible with the given type (a real error if it isn\'t, unlike a permissive `as` cast), and then — critically — it does NOT change the value\'s inferred type at all; the expression keeps its own most specific, literal inferred type. The practical payoff is a configuration object where `satisfies SomeSchema` catches a typo\'d key or wrong-shaped value at compile time, while still letting you autocomplete on and read the object\'s own precise per-property types afterward, something a plain `: SomeSchema` annotation would prevent by widening every value up to the general schema\'s types.',
            },
            {
              question: 'Why might a codebase choose a union of string literals over a TypeScript `enum` for something like a status field?',
              answer:
                'A `enum` is one of the few TypeScript constructs that isn\'t purely erased at compile time — it generates an actual JavaScript object at runtime (for numeric and string enums alike), adding real code and a real runtime dependency that a plain string-literal union (`type Status = \'active\' | \'done\'`) does not. A string-literal union costs nothing at runtime, since it\'s pure type erasure, and it integrates more naturally with values that are already plain strings in practice — an API response\'s status field is just the string `\'active\'`, not an instance of an enum type, so comparing it against a literal union requires no conversion, while comparing it against an enum member can require extra care depending on how the enum was declared. Enums remain useful when you specifically want a bundled, importable runtime object (e.g. to iterate over all its values, or when a team strongly prefers the dot-notation call-site syntax `Status.Active`), but for a field that\'s really just describing a fixed set of allowed strings, the union is usually the lighter-weight, more idiomatic modern choice.',
            },
            {
              question: 'What specifically does turning on `strictNullChecks` change about how TypeScript checks code, and why is it considered the single most impactful flag in the `strict` bundle?',
              answer:
                'Without `strictNullChecks`, `null` and `undefined` are treated as valid values for *every* type — a variable typed as `string` can silently hold `null` with no error, meaning a function like `.find()` that can return `undefined` produces a value TypeScript will let you use as if it were guaranteed to exist, right up until it throws a runtime `TypeError` on a real `undefined`. With `strictNullChecks` on, `null`/`undefined` are excluded from every type unless explicitly included in a union (`string | null`), so `Array.prototype.find`\'s real return type of `T | undefined` becomes something the compiler forces you to check before using — attempting to call a method on it without first narrowing out `undefined` is a compile-time error. Given how many real bugs in JavaScript are exactly "forgot to check for null/undefined before using a value," this one flag is responsible for catching a disproportionate share of the actual runtime errors TypeScript is capable of preventing — a codebase with `strict: false` (or `strictNullChecks: false` specifically) is running with a large fraction of TypeScript\'s real protection turned off, even though its code is full of type annotations that look reassuring.',
            },
            {
              question: 'How would you type a function whose return type genuinely depends on which overload/shape of arguments was passed, and why not just use a union parameter type instead?',
              answer:
                'Function overloads are the right tool specifically when different input shapes should produce different, more *specific* return types than a single general signature could express — e.g. a `makeElement(tag: \'a\')` that should return `HTMLAnchorElement`, not just the general `HTMLElement` that every tag name would otherwise widen to. A single signature with a union parameter (`function makeElement(tag: string): HTMLElement`) is simpler and is the right choice whenever the return type doesn\'t actually vary in a way callers need reflected in the type — reaching for overloads by default, even when one general signature would express the same real contract, adds maintenance overhead (every overload has to be kept in sync with the shared implementation signature) without adding real safety. The deciding question is: does a caller who passed a more specific argument shape genuinely benefit from a more specific return type at the call site? If yes, overloads earn their complexity; if no, a single signature is preferable.',
            },
            {
              question: 'A teammate writes `const config = { retries: 3, timeout: 1000 } as Config;` to satisfy a `Config` interface. What could go wrong with this, and what would you suggest instead?',
              answer:
                '`as Config` performs essentially no real validation — TypeScript only checks that the object literal\'s type and `Config` have some structural overlap, not that every required property of `Config` is actually present with a compatible type; if `Config` requires a `retryDelay: number` property that was simply forgotten, `as Config` will happily compile, and the missing property will be `undefined` at runtime with no compile-time warning at all. The safer alternative is `satisfies Config`: `const config = { retries: 3, timeout: 1000 } satisfies Config;` genuinely validates that the object has every property `Config` requires (a missing `retryDelay` would be a real compile error), while also — unlike a plain `: Config` annotation — preserving `config`\'s own precise inferred type afterward, so downstream code still gets the exact literal types of `retries` and `timeout` rather than the wider types `Config` declares for them.',
            },
            {
              question: 'Explain variance in TypeScript. Why are function parameters contravariant, and why is `Array<Dog>` still assignable to `Array<Animal>`?',
              answer:
                'Variance describes how subtyping of type arguments carries into subtyping of the generic type. Return positions are covariant (a producer of Dogs is a producer of Animals). Parameter positions are contravariant: a function that can handle any `Animal` can safely be used where a function handling only `Dog` is expected, but not vice versa. `strictFunctionTypes` enforces this for function-typed properties and aliases. Method syntax and `Array<T>` are deliberately left bivariant/covariant for practicality: otherwise common patterns like passing `Dog[]` to a function taking `Animal[]` would fail. The price is unsoundness (you can push a `Cat` into what is really a `Dog[]`). Use `readonly Animal[]` for parameters you only read, which is genuinely safe, and use `in`/`out` annotations on generics you author to document and speed up variance checks.',
            },
            {
              question: 'What does `NoInfer<T>` solve, and how does inference work when a type parameter appears in several argument positions?',
              answer:
                'The checker collects an inference candidate from every argument position where `T` appears, then unifies them (often into a union). That means a "default" or "initial" argument can widen `T` rather than being checked against it: `createFSM([\'idle\', \'running\'], \'stopped\')` happily infers a union including `\'stopped\'`. Wrapping the secondary position in `NoInfer<T>` (TS 5.4) removes it as an inference site, so `T` is inferred from the primary argument only and the secondary one is then validated against it. Before 5.4 people used hacks like `T & {}`. Related tools: `const` type parameters preserve literal types, and curried calls work around the lack of partial type-argument inference.',
            },
            {
              question: 'What is a distributive conditional type? Show how to turn distribution off and explain what happens with `never`.',
              answer:
                'When the checked type in `T extends U ? X : Y` is a naked type parameter, instantiating it with a union applies the conditional to each member separately and unions the results, so `ToArray<string | number>` is `string[] | number[]`. Wrapping both sides in tuples (`[T] extends [U]`) makes the check run once on the whole union. `never` is the empty union, so a distributive conditional over `never` returns `never` without evaluating any branch, while the non-distributive form `[never] extends [string]` is `true`. This explains surprising results in helpers like `IsUnion` or `IsNever`, and is why `Exclude<T, U>` and `Extract<T, U>` are distributive by design.',
            },
            {
              question: 'How do you make an exhaustive `switch` on a discriminated union fail to compile when someone adds a new variant?',
              answer:
                'Narrowing removes handled members from the union, so after all cases the remaining type is `never`. Add a `default` branch that assigns the value to a `never`-typed variable or passes it to an `assertNever(x: never)` helper. When a new variant is added to the union, that variable stops being `never` and compilation fails at every unhandled switch, turning a runtime omission into a compile-time checklist. In addition, a function with an explicit return type fails with "not all code paths return a value" if a case is missed. The ESLint rule `@typescript-eslint/switch-exhaustiveness-check` provides the same guarantee without boilerplate.',
            },
            {
              question: 'How do you create nominal-like types in a structurally typed language, and when is it worth it?',
              answer:
                'Structural typing makes two aliases of `string` interchangeable. A branded type intersects the base type with a phantom property (`string & { readonly __brand: \'UserId\' }`) that never exists at runtime, so only values produced by a validating constructor (the single place an `as` cast is allowed) can flow into functions requiring that brand. Classes with private or `#private` fields are also nominal for those members, and `unique symbol` gives unique tags. It is worth it where mixing values is a real bug class: identifiers of different entities, units (meters vs feet), validated or sanitized strings, and currency amounts. It is not worth it for ordinary strings: the friction of casting at every boundary outweighs the benefit.',
            },
            {
              question: 'What are `verbatimModuleSyntax`, `isolatedModules` and `erasableSyntaxOnly`, and why do they exist?',
              answer:
                'They all exist because most pipelines no longer transpile with `tsc`. Tools like esbuild, swc and Node.js process one file at a time and cannot resolve imports to learn whether a name is a type. `isolatedModules` reports constructs that a per-file transpiler cannot handle correctly (re-exporting a type without `export type`, cross-file `const enum`). `verbatimModuleSyntax` simplifies the rule: whatever you write without a `type` modifier is kept in the output, whatever has it is dropped, so output never depends on type information. `erasableSyntaxOnly` (TS 5.8) goes further and forbids features that generate JavaScript (`enum`, runtime `namespace`, parameter properties), so a file can be run by stripping types to whitespace, as Node.js now does natively.',
            },
            {
              question: 'What changed with TypeScript 6.0 and 7.0, and how would you plan an upgrade of a large codebase?',
              answer:
                'TypeScript 6.0 (March 2026) was the last release of the compiler written in TypeScript. It changed defaults (`strict` on, `module` esnext, `types` empty, `rootDir` at the config directory) and deprecated legacy options such as `target: es5`, `moduleResolution: node10`, `baseUrl`, AMD/UMD/SystemJS and `outFile`. TypeScript 7.0 (July 2026) is the port of the compiler and language service to Go, with the same checking behavior and typically around ten times faster builds, and with those deprecated options turned into errors. A sound plan: upgrade to 6.0 first, fix every deprecation warning without suppressing it with `ignoreDeprecations`, explicitly list `types`, then try 7.0 in CI alongside 6.0. Audit tooling that imports the old `typescript` JavaScript API (linters, codegen, framework language-service plugins) because 7.0 does not yet ship the programmatic API and some embedded-language tools remain on 6.0.',
            },
            {
              question: 'Why can `Omit` and `Pick` on a union behave unexpectedly, and how do you fix it?',
              answer:
                '`Pick`/`Omit` are mapped types over `keyof T`, and `keyof (A | B)` is only the keys common to both members, so applying `Omit` to a union collapses it into a single object with just the shared keys and loses the discriminant. `Omit` also takes `K extends keyof any`, so a misspelled key silently omits nothing. The fix is a distributive helper, `type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never`, which applies `Omit` to each member. For key safety, constrain `K extends keyof T` in your own helper.',
            },
            {
              question: 'How does TypeScript treat `readonly` and `as const`, and what are the limits of each?',
              answer:
                '`readonly` properties and `ReadonlyArray` are checked at compile time only and are shallow: nested objects stay mutable, and a mutable `string[]` can be passed where `readonly string[]` is expected, after which the original mutable reference can still change it. `as const` infers the narrowest type for an expression: literal types, readonly tuples and readonly properties, recursively. It is the standard way to derive a union from a runtime array or object (`(typeof arr)[number]`). Neither freezes anything at runtime; use `Object.freeze` for that, and remember `Object.freeze` itself is only shallow.',
            },
            {
              question: 'How would you type an HTTP client or form library so that the response type is verified, not just asserted?',
              answer:
                'Avoid `get<T>(url): Promise<T>`, because `T` appears only in the return position and the compiler cannot verify it; it is an unchecked cast in disguise. Instead, take a runtime schema as a parameter (`get(url, UserSchema)`), parse the JSON with it, and derive the static type from the schema (`z.infer`, or an equivalent with Valibot, ArkType or any Standard Schema validator). The inferred return type then comes from something that actually executes. For internal-only calls where you control both ends, consider sharing types or generating clients from an OpenAPI/tRPC contract so the type is generated, not hand-written, and still validate at the true trust boundary (public inputs, third-party responses).',
            },
            {
              question: 'When would you choose `unknown` over a generic type parameter, and when is `any` actually acceptable?',
              answer:
                'Use `unknown` when a value is genuinely of unknown shape and the function should not depend on it (a logger, a catch clause variable, parsed JSON, an event payload): callers can pass anything and the body must narrow before use. Use a type parameter when the output type must relate to the input type (`identity`, `getProp`, `map`). A type parameter that appears only once is usually just `unknown` or `any` with extra steps. `any` is acceptable in a few narrow cases: inside a well-tested low-level helper where the public signature is correctly typed (overload implementations, wrapper utilities), when migrating a JavaScript codebase incrementally, and as `any[]` in a constraint like `(...args: any[]) => unknown`, where `unknown[]` would break parameter contravariance. Enable `noImplicitAny` and a lint rule for explicit `any` so each use is deliberate.',
            },
          ],
        },
      ],
    },
  ],
}
