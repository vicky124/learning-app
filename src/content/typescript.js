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
            'TypeScript is a strict **superset** of JavaScript — every valid JS file is already valid TS (with `any` types inferred where needed).',
            'Types exist only at compile time; the compiler (`tsc`, or a transpiler like Babel/esbuild/swc) **erases** every type annotation, producing plain JavaScript with zero runtime overhead or footprint.',
            'Adoption is gradual: a codebase can mix typed and untyped files, and `any` lets you opt out of checking for a specific value when needed.',
            'The same type information that catches errors at compile time also powers editor features — autocomplete, inline signatures, "go to definition," and safe renames.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'TypeScript adds a static type system on top of JavaScript\'s existing syntax and semantics, checked entirely at compile time by the TypeScript compiler. It does not introduce a new runtime, a new execution model, or new language semantics — every type annotation is stripped away during compilation, and the JavaScript that remains behaves identically to hand-written JS. This is called **type erasure**, and it is the single most important fact about how TypeScript works.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    TS["yourFile.ts<br/>(with type annotations)"] --> Compiler["tsc / esbuild / swc<br/>type-checks, then ERASES types"]
    Compiler --> JS["yourFile.js<br/>(plain JavaScript, no types)"]
    JS --> Runtime["Browser / Node.js<br/>runs it — has never seen a type"]`,
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
            'Function return types are usually left to inference too; annotate them explicitly at public API boundaries, where an accidental change in a function\'s implementation would otherwise silently change its inferred return type.',
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
              ],
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
scores.Cleo = 5; // fine — any string key is allowed`,
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
          ],
          blocks: [
            {
              type: 'code',
              language: 'ts',
              title: 'tuples in practice',
              code: `// A tuple: exactly 2 elements, first a string, second a number.
let entry: [string, number] = ['temperature', 72];

// This is exactly how React types useState's return value:
function useState<T>(initial: T): [T, (next: T) => void] {
  /* ... */
}
const [count, setCount] = useState(0); // count: number, setCount: (n: number) => void`,
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
    A["const obj = { x, y, z }"] -->|"does obj have AT LEAST\\nall of Point's members,\\nwith compatible types?"| Check{Structural check}
    Point["interface Point { x: number; y: number }"] --> Check
    Check -->|Yes — extra 'z' is fine| Pass["Compatible — assignment allowed"]
    Check -->|No — missing/wrong-typed member| Fail["Type error"]`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Structural typing is also why two differently-named interfaces with identical members are fully interchangeable in TypeScript — there is no equivalent of Java\'s "implements" declaration required for compatibility.',
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
    Call["firstOrDefault([1,2,3], 0)"] --> Infer["TS infers T = number\\nfrom the call-site arguments"]
    Infer --> Sub["substitutes T -> number\\neverywhere in the signature"]
    Sub --> Result["items: number[], fallback: number,\\nreturn type: number"]`,
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
    S["state: RequestState<T>"] --> Switch{"switch (state.status)"}
    Switch -->|"'idle'"| B1["state narrowed to\\n{ status: 'idle' }"]
    Switch -->|"'loading'"| B2["state narrowed to\\n{ status: 'loading' }"]
    Switch -->|"'success'"| B3["state narrowed to\\n{ status: 'success'; data: T }\\n-- .data is safely accessible"]
    Switch -->|"'error'"| B4["state narrowed to\\n{ status: 'error'; error: string }\\n-- .error is safely accessible"]`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'intersection: combining shapes',
              code: `type WithId = { id: number };
type WithTimestamps = { createdAt: Date; updatedAt: Date };

type Record = WithId & WithTimestamps; // must satisfy BOTH shapes at once
const r: Record = { id: 1, createdAt: new Date(), updatedAt: new Date() };`,
            },
            {
              type: 'p',
              text: "This pattern eliminates an entire class of bugs where `data` and `error` are both optional fields on one flat type and nothing stops you from accidentally reading `data` while the request is actually still loading.",
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
    Call["makeElement('a')"] --> Check1{"Does 'a' match\\noverload 1: (tag: 'a')?"}
    Check1 -->|Yes| Use1["use overload 1's return type:\\nHTMLAnchorElement"]
    Check1 -->|No| Check2{"Does 'a' match\\noverload 2: (tag: 'img')?"}
    Check2 -->|Yes| Use2["use overload 2's return type:\\nHTMLImageElement"]
    Check2 -->|No| Check3{"Does 'a' match\\noverload 3: (tag: string)?"}
    Check3 -->|Yes| Use3["use overload 3's return type:\\nHTMLElement"]
    Use1 -.->|"the broad implementation\\nsignature itself is never\\nvisible to callers"| Impl["actual function body runs"]
    Use2 -.-> Impl
    Use3 -.-> Impl`,
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
              ],
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
    Check -->|Yes| Str["value narrowed to: string\\n-- .toUpperCase() now allowed"]
    Check -->|No| Check2{"isUser(value)?\\n(custom type guard)"}
    Check2 -->|Yes| Usr["value narrowed to: User\\n-- .email now allowed"]
    Check2 -->|No| Rest["value stays: unknown\\n-- still cannot be used directly"]`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Typing an API response or `JSON.parse` result as `any` silently propagates type-unsafety through everything downstream that touches it. Typing it as `unknown` and narrowing at the boundary contains the risk to one well-audited spot.',
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
    D1["interface Window {\\n  title: string;\\n}"] --> Merge["TypeScript merges them\\nautomatically — same name,\\nsame scope"]
    D2["interface Window {\\n  isVisible: boolean;\\n}"] --> Merge
    Merge --> Result["effective Window = {\\n  title: string;\\n  isVisible: boolean;\\n}"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The common team convention: `interface` for object shapes meant to be extended/implemented, `type` for unions, aliases, and utility/computed types.',
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
    T["T = () => string"] --> Match{"Does T match the pattern\\n(...args: any[]) => infer R ?"}
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
    T["T = { name: string; age: number }"] --> Iter["{ [K in keyof T]?: T[K] }\\niterates each key K of T"]
    Iter --> K1["K = 'name' -> name?: string"]
    Iter --> K2["K = 'age' -> age?: number"]
    K1 --> Out["MyPartial<T> =\\n{ name?: string; age?: number }"]
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
    V["{ red: { r: 255, g: 0, b: 0 } }"] --> A["const x: Record<string, RGB> = ...\\nvalidated, but WIDENED to Record<string, RGB>"]
    V --> B["... as Record<string, RGB>\\nNOT really validated, WIDENED to Record<string, RGB>"]
    V --> C["... satisfies Record<string, RGB>\\nvalidated, type stays the specific literal shape"]
    C --> Keep["x.red.r autocompletes;\\nx.blue is correctly a compile error"]`,
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
          ],
        },
        {
          id: 'decorators',
          title: 'Decorators',
          summary:
            'A decorator is a function that intercepts and can transform a class, method, or property declaration at definition time — the mechanism behind frameworks like Angular and NestJS, now standardized (Stage 3) after years as a TypeScript-only experimental feature.',
          keyPoints: [
            'A decorator is applied with `@decoratorName` immediately above a class, method, property, or accessor declaration.',
            'TypeScript originally shipped decorators as an experimental, non-standard feature (`experimentalDecorators: true`, closely matching an old ECMAScript proposal) — modern TypeScript (5.0+) also supports the newer, standardized Stage 3 decorators proposal, which has a different runtime signature.',
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
              code: `function logCalls(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  function replacementMethod(this: any, ...args: any[]) {
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
    Define["class Calculator { @logCalls add(...) {...} }\\nis being defined"] --> Apply["logCalls(originalAddMethod, context)\\nruns ONCE, at class-definition time"]
    Apply --> Replace["returns replacementMethod,\\nwhich BECOMES Calculator.prototype.add"]
    Replace --> Later["new Calculator().add(2, 3)\\ncalls replacementMethod, which wraps\\nand still calls the original"]`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The legacy `experimentalDecorators` decorators (still used by many existing Angular/NestJS codebases) and the newer Stage 3 standardized decorators are **not** the same feature — they have different runtime call signatures and are not fully interchangeable. Check which mode a codebase\'s `tsconfig.json` enables before writing a new decorator, since code copied from one style will not compile correctly under the other.',
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
    Strict["strict: true"] --> A["strictNullChecks\\nnull/undefined no longer\\nsilently fit every type"]
    Strict --> B["noImplicitAny\\nunannotated values can't\\nsilently become any"]
    Strict --> C["strictFunctionTypes\\nfunction parameters checked\\nmore rigorously"]
    Strict --> D["...and several more,\\nall bundled as one flag"]`,
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
              ],
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
          ],
        },
      ],
    },
  ],
}
