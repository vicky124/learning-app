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
            'Using `any` instead of a generic discards type safety entirely; using a generic preserves it.',
            'The return type of a generic function can be correctly tied to its input types, rather than being widened to `any`/`unknown`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Generics let a function/type be parameterized over the types it operates on while preserving type relationships, instead of falling back to `any` (which discards all type safety):',
            },
            {
              type: 'code',
              language: 'ts',
              code: `function firstOrDefault<T>(items: T[], fallback: T): T {
  return items.length > 0 ? items[0] : fallback;
}
// TypeScript infers T from usage; the return type is correctly tied to
// the input array's element type, unlike a version typed with \`any\`.`,
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
              type: 'p',
              text: "This pattern eliminates an entire class of bugs where `data` and `error` are both optional fields on one flat type and nothing stops you from accidentally reading `data` while the request is actually still loading.",
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
                ['`Parameters<F>`', 'Extracts a tuple of a function type `F`\'s parameter types.'],
              ],
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
              type: 'callout',
              kind: 'tip',
              text: 'The common team convention: `interface` for object shapes meant to be extended/implemented, `type` for unions, aliases, and utility/computed types.',
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
          summary: 'TypeScript interview questions on declaration merging, `unknown` vs `any`, and discriminated unions, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'Explain the difference between `interface` declaration merging and why it matters when working with third-party TypeScript libraries.',
              answer:
                "Declaration merging means multiple `interface` declarations with the same name in the same scope are automatically combined into a single interface with all their members — `type` aliases cannot do this (redeclaring a `type` with the same name is a compile error). This is specifically useful for augmenting third-party library types you don't control: for example, extending an Express `Request` interface to add a custom `user` property attached by your auth middleware, by declaring `interface Request { user?: User }` in your own ambient type declaration file — TypeScript merges it with the library's own `Request` interface rather than conflicting with it, which would be impossible to do cleanly with a `type` alias.",
            },
            {
              question: "Why is `unknown` considered safer than `any` for typing the result of `JSON.parse` or an external API response, given that both technically \"accept anything\"?",
              answer:
                "`any` disables type checking entirely for that value AND for anything derived from it — you can call any method, access any property, and pass it anywhere, all without a compile error, even if the actual runtime shape is completely different, silently propagating type-unsafety through your codebase. `unknown` also accepts any value being *assigned* to it, but the compiler refuses to let you *operate* on an `unknown` value (call a method, access a property) until you've narrowed it via a type guard, `typeof`/`instanceof` check, or a runtime schema validator (e.g. Zod) — forcing you to explicitly handle the fact that data from an untrusted boundary might not match your assumed shape, which is exactly the discipline you want at a JSON-parsing or API-response boundary where the actual runtime shape is genuinely unverified until checked.",
            },
            {
              question: "What's the practical difference between a discriminated union and simply making every field on a type optional, for modeling something like an API request's loading/success/error states?",
              answer:
                "With every field optional (`{ data?: T; error?: string; isLoading?: boolean }`), the type system allows — and does nothing to prevent — logically impossible combinations, like `isLoading: true` and `data` simultaneously populated with stale results, or both `data` and `error` set at once; consuming code has to defensively check combinations that should never happen, and the compiler provides no guarantee that a given code path is actually handling every real state correctly. A discriminated union makes illegal states genuinely unrepresentable: each variant only has the fields relevant to that state, and TypeScript's control-flow narrowing (via `switch`/`if` on the discriminant field) guarantees, at compile time, that you can only access `data` in the branch where the type system has proven it exists — turning a class of runtime bugs (reading `undefined` data, or missing a state) into compile-time errors instead.",
            },
          ],
        },
      ],
    },
  ],
}
