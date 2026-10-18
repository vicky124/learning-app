export const javascriptSection = {
  id: 'javascript',
  label: 'JavaScript',
  icon: '🟨',
  groups: [
    {
      id: 'javascript-guide',
      label: 'Guide',
      topics: [
        {
          id: 'values-and-types',
          title: 'Values and Types: Primitives vs Objects',
          summary:
            'JavaScript has exactly seven primitive types plus objects, and the distinction between them — copied by value vs shared by reference — underlies nearly every "why did mutating this affect that" surprise.',
          keyPoints: [
            'The seven primitive types: `string`, `number`, `boolean`, `undefined`, `null`, `symbol`, and `bigint` — everything else is an `object` (including arrays, functions, and dates).',
            'Primitives are immutable and are compared/copied **by value**; objects are compared/copied **by reference**, to the same underlying data in memory.',
            '`typeof` reliably identifies primitives, with one famous historical bug: `typeof null === \'object\'`.',
            'Assigning an object (or array) to a new variable, or passing it into a function, copies the *reference* — both variables point at the exact same underlying object.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Every value in JavaScript is either a **primitive** (a plain, immutable value with no identity of its own) or an **object** (a reference to a mutable structure living in memory). This single distinction explains a huge share of beginner confusion: why copying a number "just works" while copying an array can produce two variables that both change together.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'value semantics vs reference semantics',
              code: `let a = 5;
let b = a;   // b gets a COPY of the value 5
b = 10;
console.log(a); // 5 — unaffected, a and b are independent

const obj1 = { x: 1 };
const obj2 = obj1;   // obj2 gets a COPY of the REFERENCE, pointing at the same object
obj2.x = 2;
console.log(obj1.x); // 2 — obj1 and obj2 point at the same underlying object`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Primitives["Primitives — copied by value"]
      a["a = 5"]
      b["b = 5<br/>(independent copy)"]
    end
    subgraph Objects["Objects — copied by reference"]
      obj1["obj1"] --> Heap["{ x: 2 }<br/>(one object in memory)"]
      obj2["obj2"] --> Heap
    end`,
            },
            {
              type: 'table',
              headers: ['Type', '`typeof` result', 'Example'],
              rows: [
                ['string', "`'string'`", "`'hello'`"],
                ['number', "`'number'`", '`42`, `NaN`, `Infinity`'],
                ['boolean', "`'boolean'`", '`true`, `false`'],
                ['undefined', "`'undefined'`", 'a declared-but-unassigned variable'],
                ['null', "`'object'` (bug)", '`null` — intentional absence of a value'],
                ['symbol', "`'symbol'`", '`Symbol(\'id\')` — a guaranteed-unique value'],
                ['bigint', "`'bigint'`", '`123n` — integers beyond `Number` precision'],
                ['object / array / function', "`'object'` / `'object'` / `'function'`", '`{}`, `[]`, `function(){}`'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`typeof null === \'object\'` is a bug baked into JavaScript since its first version and kept for backwards compatibility — it does not mean `null` is an object. To reliably check for `null`, compare directly: `value === null`.',
            },
            {
              type: 'heading',
              text: 'Numbers are IEEE 754 doubles — with all the consequences',
            },
            {
              type: 'p',
              text: 'The `number` type is a 64-bit IEEE 754 double. That gives you exact integers only up to `Number.MAX_SAFE_INTEGER` (2^53 − 1 = 9007199254740991); beyond that, adjacent integers collapse onto the same double. It is also why `0.1 + 0.2 !== 0.3`: neither 0.1 nor 0.2 has an exact binary representation. Engines internally optimize small integers (V8 stores them as "Smis", small integers tagged directly in the pointer, avoiding heap allocation), but that is an implementation detail — the language semantics are always "double".',
            },
            {
              type: 'code',
              language: 'js',
              title: 'precision traps and the right tools',
              code: `0.1 + 0.2;                       // 0.30000000000000004
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true — compare floats with a tolerance

2 ** 53 === 2 ** 53 + 1;         // true (!) — precision lost past MAX_SAFE_INTEGER
Number.isSafeInteger(2 ** 53);   // false

// IDs from APIs (e.g. 64-bit database / snowflake IDs) must stay strings or BigInt
JSON.parse('{"id": 9007199254740993}').id; // 9007199254740992 — silently wrong
BigInt('9007199254740993');                 // 9007199254740993n — exact

// Money: store integer minor units (cents), never float dollars
const totalCents = 1999 + 1;               // 2000
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  .format(totalCents / 100);              // '$20.00'`,
            },
            {
              type: 'heading',
              text: 'Primitive wrappers and why `"abc".length` works',
            },
            {
              type: 'p',
              text: 'Primitives have no properties, yet `\'abc\'.toUpperCase()` works. The spec performs **ToObject** on property access: the engine conceptually wraps the primitive in a temporary `String`/`Number`/`Boolean` object, looks up the method on `String.prototype`, and discards the wrapper (real engines skip the allocation entirely). Never construct wrappers yourself — `new Boolean(false)` is an object and therefore **truthy**, and `new String(\'a\') === \'a\'` is `false`.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For a robust type check of objects, `Array.isArray(x)` beats `x instanceof Array` (which fails across iframes/realms), and `Object.prototype.toString.call(x)` returns tags like `\'[object Date]\'` for built-ins. For "is this an Error, even from another realm", ES2026 adds `Error.isError(x)`.',
            },
          ],
        },
        {
          id: 'variables-scoping',
          title: '`var`, `let`, `const`, and Scoping',
          summary:
            'JavaScript has three ways to declare a variable, but only two belong in modern code — understanding function scope vs block scope, and the temporal dead zone, explains why `let`/`const` replaced `var`.',
          keyPoints: [
            '`var` is **function-scoped** (or globally scoped) and hoisted with an initial value of `undefined`; `let`/`const` are **block-scoped**.',
            '`let`/`const` declarations are hoisted too, but stay in a "temporal dead zone" (TDZ) — accessing them before their declaration line throws a `ReferenceError` instead of silently returning `undefined`.',
            '`const` prevents *reassignment* of the binding, not mutation of the value — `const arr = []; arr.push(1)` is perfectly legal.',
            'Default to `const`; use `let` only for variables you know will be reassigned (loop counters, accumulators); avoid `var` in new code entirely.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`var` predates block scope in JavaScript entirely — it is scoped to the nearest enclosing function (or the global scope if there is none), which means a `var` declared inside an `if` block or a `for` loop "leaks" out into the surrounding function. `let` and `const`, added in ES2015, are scoped to the nearest enclosing block (`{ }`) — matching the scoping rules of most other C-like languages and eliminating a whole category of accidental-leakage bugs.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'function scope vs block scope',
              code: `function example() {
  if (true) {
    var fromVar = 'leaks out';
    let fromLet = 'stays in this block';
  }
  console.log(fromVar);  // 'leaks out' — var ignores the if-block
  console.log(fromLet);  // ReferenceError — fromLet is not defined here
}`,
            },
            {
              type: 'heading',
              text: 'Hoisting and the temporal dead zone',
            },
            {
              type: 'p',
              text: 'All three keywords are technically "hoisted" — the JavaScript engine registers the variable name at the top of its scope during a compile pass, before running any code. The difference is what happens if you read the variable before its declaration line executes: a `var` reads as `undefined` (no error, just confusing); a `let`/`const` sits in the **temporal dead zone** and throws a `ReferenceError` the instant you touch it.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["Scope entered<br/>(function/block starts)"] --> B["let x is hoisted,<br/>but uninitialized —<br/>Temporal Dead Zone"]
    B -->|"access x here"| C["ReferenceError:<br/>Cannot access 'x' before initialization"]
    B --> D["let x = 5;<br/>(declaration line reached)"]
    D --> E["x is now usable normally"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The TDZ is a *feature*, not a quirk — it turns a class of "used before assigned" bugs that `var` would silently paper over (reading `undefined`) into a loud, immediate error instead, right at the point of the mistake.',
            },
            {
              type: 'heading',
              text: 'Less obvious scoping rules',
            },
            {
              type: 'table',
              headers: ['Behavior', '`var`', '`let` / `const`', '`function` declaration'],
              rows: [
                ['Scope', 'Function (or script/global)', 'Block', 'Block in strict mode/modules; function-ish in sloppy legacy code'],
                ['Hoisted?', 'Yes, initialized to `undefined`', 'Yes, but uninitialized (TDZ)', 'Yes, fully initialized'],
                ['Top-level in a classic script', 'Becomes a property of `globalThis`', 'Global lexical binding, *not* on `globalThis`', 'Becomes a property of `globalThis`'],
                ['Top-level in an ES module', 'Module-scoped', 'Module-scoped', 'Module-scoped'],
                ['Redeclaration in same scope', 'Allowed (silently)', '`SyntaxError`', 'Allowed in sloppy scripts'],
                ['Per-iteration binding in `for` loops', 'No — one shared binding', 'Yes — fresh binding per iteration', 'n/a'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'TDZ shows up in places people do not expect',
              code: `// 1. Default parameters are evaluated left-to-right in their own scope
function f(a = b, b = 1) {}   // f() -> ReferenceError: Cannot access 'b' before initialization

// 2. typeof is NOT safe inside the TDZ (it is safe for undeclared names)
typeof undeclaredName;        // 'undefined'
{ typeof x; let x = 1; }      // ReferenceError

// 3. Classes are hoisted with a TDZ too
new Widget();                 // ReferenceError
class Widget {}

// 4. Circular ES module imports can hit the TDZ at runtime when module A
//    reads an exported 'const' from B before B has finished evaluating.`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Engines must check the TDZ on every access to a `let`/`const` binding that *might* be uninitialized. In practice the optimizing compilers (V8 TurboFan/Maglev, SpiderMonkey Warp, JSC FTL) prove most accesses safe and eliminate the check, so the TDZ has no measurable cost in normal code — do not choose `var` "for performance".',
            },
          ],
        },
        {
          id: 'operators-and-coercion',
          title: 'Operators, Truthiness, and Implicit Coercion',
          summary:
            'Beyond arithmetic and comparison, JavaScript\'s `??` and `?.` operators exist specifically to work safely with values that might be `null`/`undefined`, and every `if` condition silently coerces its operand to a boolean.',
          keyPoints: [
            'Every value is "truthy" or "falsy" in a boolean context; the only falsy values are `false`, `0`, `-0`, `0n`, `\'\'`, `null`, `undefined`, and `NaN` — everything else, including `\'0\'` and `[]`, is truthy.',
            'The **nullish coalescing operator** (`??`) falls back only for `null`/`undefined`, unlike `||`, which falls back for *any* falsy value.',
            '**Optional chaining** (`?.`) short-circuits to `undefined` instead of throwing when accessing a property on `null`/`undefined`.',
            'The `+` operator coerces to a string if either operand is a string; every other arithmetic operator coerces both operands to numbers.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TD
    Value["a value used as an if(...) condition"] --> Check{"Is it exactly one of:<br/>false, 0, -0, 0n, '', null,<br/>undefined, or NaN?"}
    Check -->|Yes| Falsy["falsy — the else branch runs"]
    Check -->|No| Truthy["truthy — the if branch runs<br/>(includes '0', [], {}, and 'false')"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: '`||` vs `??`, and optional chaining',
              code: `const settings = { volume: 0, name: '' };

// || falls back for ANY falsy value — a common bug when 0/'' are valid values
console.log(settings.volume || 50);   // 50 — WRONG, 0 was a valid, intended volume

// ?? falls back ONLY for null/undefined — 0 and '' are preserved
console.log(settings.volume ?? 50);   // 0 — correct

// Optional chaining: short-circuits instead of throwing
const user = { profile: null };
console.log(user.profile?.address?.city); // undefined, no TypeError
console.log(user.profile.address.city);   // TypeError: Cannot read properties of null`,
            },
            {
              type: 'table',
              headers: ['Expression', 'Result', 'Why'],
              rows: [
                ["`1 + '1'`", "`'11'`", 'string present — `+` coerces the number to a string and concatenates.'],
                ["`1 - '1'`", '`0`', "`-` always coerces to numbers — `'1'` becomes `1`."],
                ['`[] + []`', "`''`", 'Both arrays coerce to empty strings, then concatenate.'],
                ['`[] + {}`', "`'[object Object]'`", 'The array coerces to `\'\'`, the object to `\'[object Object]\'`.'],
                ["`if ('0')`", 'truthy', 'A non-empty string is always truthy, even the string `\'0\'`.'],
                ['`+[]` / `+{}`', '`0` / `NaN`', 'Unary `+` is ToNumber: `[]` becomes `\'\'` then `0`; `{}` becomes `\'[object Object]\'` then `NaN`.'],
                ['`10n + 1`', '`TypeError`', 'BigInt and Number never mix implicitly — convert explicitly with `Number()` or `BigInt()`.'],
              ],
            },
            {
              type: 'heading',
              text: 'How objects become primitives: ToPrimitive',
            },
            {
              type: 'p',
              text: 'When an operator needs a primitive from an object, the spec calls **ToPrimitive** with a *hint* (`\'number\'`, `\'string\'`, or `\'default\'`). It first checks for a `[Symbol.toPrimitive]` method; otherwise it tries `valueOf()` then `toString()` for the number/default hint (reversed for the string hint). `Date` is the notable built-in that treats `\'default\'` as `\'string\'`, which is why `date + 1` concatenates while `date - 1` subtracts.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'controlling coercion explicitly, and logical assignment',
              code: `const money = {
  cents: 1999,
  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? \`$\${(this.cents / 100).toFixed(2)}\` : this.cents;
  },
};
\`\${money}\`;  // '$19.99' (string hint)
money + 1;     // 2000     (default hint -> number branch)

// Logical assignment (ES2021): assign only when needed, short-circuiting
options.timeout ??= 5000;   // set only if null/undefined
cache.entries ||= [];       // set if falsy
user.isAdmin &&= checkAdminStillValid(user); // re-validate only if currently true`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`??` cannot be mixed with `||` or `&&` without parentheses — `a || b ?? c` is a `SyntaxError` by design, because the intended precedence is ambiguous to readers. Write `(a || b) ?? c`.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`settings.volume || 50` is one of the most common real bugs involving `||` — if `0` (or `\'\'`) is a legitimate, intentional value, `||` incorrectly treats it as "missing" and overrides it. Reach for `??` whenever the fallback should apply only to genuinely absent (`null`/`undefined`) values.',
            },
          ],
        },
        {
          id: 'functions-fundamentals',
          title: 'Functions: Declarations, Expressions, and Arrow Functions',
          summary:
            'JavaScript has three ways to write a function, and they differ in more than syntax — hoisting behavior, whether they get their own `this`, and whether they have an `arguments` object are all different.',
          keyPoints: [
            'Function **declarations** (`function foo() {}`) are fully hoisted — callable even before their line in the source.',
            'Function **expressions** (`const foo = function() {}`) are only hoisted as a variable — calling before the assignment throws.',
            '**Arrow functions** (`const foo = () => {}`) have no own `this`, no own `arguments` object, and cannot be used as constructors (`new`).',
            'Default parameters and rest parameters (`function f(a, b = 10, ...rest)`) replace older, more error-prone patterns for optional/variadic arguments.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Function Declaration', 'Function Expression', 'Arrow Function'],
              rows: [
                ['Hoisting', 'Fully hoisted (callable before defined)', 'Only the variable is hoisted, not the assignment', 'Same as expression'],
                ['Own `this`', 'Yes — depends on how it\'s called', 'Yes — depends on how it\'s called', 'No — inherits `this` lexically'],
                ['`arguments` object', 'Yes', 'Yes', 'No (use rest params: `...args`)'],
                ['Usable with `new`', 'Yes', 'Yes (if not arrow)', 'No — throws `TypeError`'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'default and rest parameters',
              code: `function createUser(name, role = 'member', ...permissions) {
  return { name, role, permissions };
}

createUser('Ava');
// { name: 'Ava', role: 'member', permissions: [] }

createUser('Ben', 'admin', 'read', 'write', 'delete');
// { name: 'Ben', role: 'admin', permissions: ['read', 'write', 'delete'] }`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Because arrow functions have no `arguments` object of their own, `...rest` parameters are the modern replacement for it in every function form — they also give you a real array (with `.map`, `.filter`, etc.) instead of `arguments`\' array-like object.',
            },
            {
              type: 'heading',
              text: 'Functions are objects — and other details that bite',
            },
            {
              type: 'code',
              language: 'js',
              title: 'gotchas worth knowing cold',
              code: `// 1. Default values are evaluated on EVERY call (unlike Python's def-time defaults)
function addItem(item, list = []) { list.push(item); return list; }
addItem(1); // [1]
addItem(2); // [2] — a fresh array each call, no shared-mutable-default bug

// 2. Returning an object literal from an arrow needs parentheses
const bad  = () => { id: 1 };   // returns undefined — braces parsed as a block, 'id:' as a label
const good = () => ({ id: 1 }); // returns { id: 1 }

// 3. Functions are objects with properties
function greet(name, greeting = 'Hi') {}
greet.length; // 1 — counts params before the first default/rest
greet.name;   // 'greet'

// 4. Arrow functions in class fields are created PER INSTANCE
class Button {
  onClick = () => this.handle(); // new function object for every Button
  handle() {}                    // one shared function on Button.prototype
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Arrow-function class fields fix `this`-loss but cost one closure per instance and are invisible to `super.method()` calls and prototype patching/mocking. For thousands of instances, prefer a prototype method plus `.bind` at the one place it is passed as a callback.',
            },
          ],
        },
        {
          id: 'arrays-and-objects-fundamentals',
          title: 'Arrays and Objects: The Methods You Use Every Day',
          summary:
            'A small set of array and object methods — `map`, `filter`, `reduce`, and the `Object.*` static methods — covers the overwhelming majority of everyday data transformation in JavaScript.',
          keyPoints: [
            '`.map()` transforms each element into a new array of the same length; `.filter()` keeps only elements matching a condition; `.reduce()` folds an array down to a single accumulated value.',
            '`.find()` / `.findIndex()` return the first matching element/index; `.some()` / `.every()` return a boolean for "at least one" / "all" matches.',
            '`Object.keys()`, `Object.values()`, and `Object.entries()` turn an object\'s properties into arrays, unlocking every array method for object data too.',
            'None of `.map`/`.filter`/`.reduce`/etc. mutate the original array — they return a new one; `.push`/`.pop`/`.splice`/`.sort` **do** mutate in place, which is a common source of bugs when the original reference is shared elsewhere.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'map, filter, reduce in one pipeline',
              code: `const orders = [
  { id: 1, total: 25, status: 'paid' },
  { id: 2, total: 60, status: 'pending' },
  { id: 3, total: 15, status: 'paid' },
];

const paidTotal = orders
  .filter(order => order.status === 'paid')  // keep only paid orders
  .map(order => order.total)                  // pull out just the totals
  .reduce((sum, total) => sum + total, 0);     // fold into one number

console.log(paidTotal); // 40`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Orders["orders<br/>(3 order objects)"] -->|".filter(status === 'paid')"| Filtered["2 paid orders"]
    Filtered -->|".map(o => o.total)"| Totals["[25, 15]"]
    Totals -->|".reduce((sum, t) => sum + t, 0)"| Result["40"]`,
            },
            {
              type: 'table',
              headers: ['Method', 'Mutates original?', 'What it returns'],
              rows: [
                ['`.map(fn)`', 'No', 'A new array, same length, each element transformed'],
                ['`.filter(fn)`', 'No', 'A new array of only the matching elements'],
                ['`.reduce(fn, initial)`', 'No', 'A single accumulated value (number, object, array...)'],
                ['`.find(fn)` / `.findIndex(fn)`', 'No', 'The first matching element / its index, or `undefined`/`-1`'],
                ['`.sort(fn)` / `.reverse()`', '**Yes**', 'The same array, reordered in place'],
                ['`.push()` / `.pop()` / `.splice()`', '**Yes**', 'Adds/removes elements in place'],
                ['`Object.keys/values/entries(obj)`', 'No', 'An array of keys / values / `[key, value]` pairs'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`array.sort()` mutates the original array **and** sorts as strings by default, so `[10, 2, 1].sort()` gives `[1, 10, 2]`, not numeric order. Pass a compare function (`.sort((a, b) => a - b)`) for numbers, and use the non-mutating `array.toSorted(...)` (ES2023) when the original order must be preserved elsewhere.',
            },
            {
              type: 'heading',
              text: 'Modern additions (ES2022–ES2024) you should be using',
            },
            {
              type: 'table',
              headers: ['API', 'Standard', 'What it replaces'],
              rows: [
                ['`arr.at(-1)`', 'ES2022', '`arr[arr.length - 1]`'],
                ['`Object.hasOwn(obj, key)`', 'ES2022', '`Object.prototype.hasOwnProperty.call(obj, key)`'],
                ['`arr.findLast(fn)` / `findLastIndex(fn)`', 'ES2023', '`[...arr].reverse().find(fn)`'],
                ['`toSorted` / `toReversed` / `toSpliced` / `with(i, v)`', 'ES2023', 'Copy-then-mutate (`[...arr].sort()`) — ideal for immutable React/Redux state'],
                ['`Object.groupBy(items, fn)` / `Map.groupBy(items, fn)`', 'ES2024', 'Hand-written `reduce` grouping'],
                ['`structuredClone(value)`', 'HTML/Web platform (also in Node, Deno, Bun)', '`JSON.parse(JSON.stringify(value))`'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'grouping and immutable updates without reduce gymnastics',
              code: `const orders = [
  { id: 1, total: 25, status: 'paid' },
  { id: 2, total: 60, status: 'pending' },
  { id: 3, total: 15, status: 'paid' },
];

const byStatus = Object.groupBy(orders, o => o.status);
// { paid: [order1, order3], pending: [order2] }
// Note: the result has a null prototype — no inherited toString/hasOwnProperty.

const cheapestFirst = orders.toSorted((a, b) => a.total - b.total); // orders untouched
const updated = orders.with(1, { ...orders[1], status: 'paid' });  // replace index 1 immutably

const biggest = orders.reduce((max, o) => (o.total > max.total ? o : max)); // 60-total order`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`Array.prototype.sort` has been required to be **stable** since ES2019 (V8 switched to TimSort), so sorting by a secondary key and then a primary key preserves the secondary order among ties. Also note that `reduce` without an initial value throws on an empty array — always pass an initial value unless you have proved the array is non-empty.',
            },
          ],
        },
        {
          id: 'collections-map-set',
          title: 'Map, Set, and the ES2025 Set Methods',
          summary:
            '`Map` and `Set` are purpose-built keyed collections with predictable iteration order, any-type keys, and O(1) average lookups — and since ES2025, `Set` finally has union, intersection, and difference built in.',
          keyPoints: [
            'Use a `Map` (not a plain object) when keys are dynamic, user-supplied, or non-strings — objects coerce keys to strings and inherit from `Object.prototype`, which invites prototype-pollution bugs.',
            '`Map` and `Set` iterate in **insertion order** and expose `.size` directly; they compare keys with **SameValueZero** (`NaN` equals `NaN`, `+0` equals `-0`, objects by identity).',
            'ES2025 added `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, and `isDisjointFrom` to `Set.prototype`.',
            '`WeakMap`/`WeakSet` hold keys weakly (keys must be objects or non-registered symbols) and are not iterable — perfect for per-object metadata and caches.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Before ES2015, developers used plain objects as hash maps, and many still do out of habit. That works for fixed, known string keys (a record or config) but fails in subtle ways for dictionaries: every key is coerced to a string (`obj[1]` and `obj[\'1\']` collide; object keys all become `\'[object Object]\'`), inherited keys like `constructor` and `__proto__` are visible to `in` checks, and there is no cheap size. Engines also optimize the two very differently: objects are tuned for a *stable shape* (V8 "hidden classes" with inline caches), while `Map` is a hash table tuned for frequent inserts and deletes. An object used as a churning dictionary falls back to slow "dictionary mode" anyway.',
            },
            {
              type: 'table',
              headers: ['Need', 'Plain object', '`Map`'],
              rows: [
                ['Key types', 'Strings and symbols only', 'Any value, including objects'],
                ['Accidental inherited keys', 'Yes (unless `Object.create(null)`)', 'No'],
                ['Size', '`Object.keys(o).length` — O(n)', '`.size` — O(1)'],
                ['Frequent add/delete', 'Can deoptimize to dictionary mode', 'Designed for it'],
                ['JSON serialization', 'Native', 'Manual: `Object.fromEntries(map)` or `[...map]`'],
                ['Best for', 'Records with a known shape', 'Dynamic dictionaries, caches, lookups by object'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'Map with object keys, and the ES2025 Set methods',
              code: `const visits = new Map();
const userA = { id: 1 };
visits.set(userA, (visits.get(userA) ?? 0) + 1);
visits.get({ id: 1 }); // undefined — keys compare by identity, not structure

// Converting both ways
const asObject = Object.fromEntries(visits.entries()); // only safe for string-like keys
const fromObject = new Map(Object.entries({ a: 1, b: 2 }));

// ES2025 Set methods — return NEW sets, never mutate
const frontend = new Set(['ava', 'ben', 'chen']);
const oncall   = new Set(['ben', 'dee']);

frontend.union(oncall);               // Set {'ava', 'ben', 'chen', 'dee'}
frontend.intersection(oncall);        // Set {'ben'}
frontend.difference(oncall);          // Set {'ava', 'chen'}
frontend.symmetricDifference(oncall); // Set {'ava', 'chen', 'dee'}
new Set(['ben']).isSubsetOf(frontend); // true
frontend.isDisjointFrom(new Set(['zed'])); // true

// Deduplicate while preserving first-seen order
const unique = [...new Set(['b', 'a', 'b', 'c'])]; // ['b', 'a', 'c']`,
            },
            {
              type: 'p',
              text: 'The Set methods accept any **set-like** argument — an object with `size`, `has()`, and `keys()` — so a `Map` works as the argument (its keys are used). They do not accept plain arrays; wrap them in `new Set(array)` first. This design lets the algorithm iterate whichever side is smaller, which is why the spec requires `size`.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Using a plain object as a dictionary keyed by user input (`counts[userInput]++`) is a classic prototype-pollution and correctness bug: a key of `__proto__` or `constructor` behaves very differently from a normal key. Use `Map`, or at minimum `Object.create(null)` and `Object.hasOwn` checks.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A `Map.prototype.getOrInsert` / `getOrInsertComputed` ("upsert") proposal has reached Stage 4 and is slated for a future edition; until it is available everywhere, use the `map.get(k) ?? (map.set(k, init), map.get(k))` pattern or a small helper.',
            },
          ],
        },
        {
          id: 'destructuring-spread-rest',
          title: 'Destructuring, Spread, and Rest',
          summary:
            'Destructuring pulls values out of arrays/objects into named variables in one step; spread expands a collection into individual elements; rest does the reverse, collecting many arguments into one array.',
          keyPoints: [
            'Object destructuring pulls named properties out by key: `const { name, age } = user;` — array destructuring pulls by position: `const [first, second] = list;`.',
            'Destructuring supports renaming (`const { name: userName } = user`), default values (`const { role = \'guest\' } = user`), and nesting.',
            'The **spread** operator (`...`) expands an array/object into individual elements — `{ ...obj, extra: 1 }` shallow-copies `obj` and adds a property; `Math.max(...numbers)` spreads an array into arguments.',
            'The **rest** operator uses the identical `...` syntax in the opposite direction — collecting multiple items into one array, as in function parameters (`...args`) or destructuring (`const [first, ...rest] = list`).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'destructuring with defaults and renaming',
              code: `const user = { id: 1, name: 'Ava', address: { city: 'Pune' } };

const { name, role = 'guest', address: { city } } = user;
// name = 'Ava', role = 'guest' (not present, so default used), city = 'Pune'

const [first, second, ...remaining] = [1, 2, 3, 4, 5];
// first = 1, second = 2, remaining = [3, 4, 5]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'spread for immutable updates — the standard React/Redux pattern',
              code: `const state = { user: { name: 'Ava' }, theme: 'dark', count: 0 };

// Create a NEW object with count updated, everything else copied over.
const nextState = { ...state, count: state.count + 1 };

console.log(state.count);     // 0 — original untouched
console.log(nextState.count); // 1`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Spread only performs a **shallow** copy — `{ ...state }` copies top-level keys, but a nested object like `state.user` is still the *same reference* in both the old and new object. Mutating `nextState.user.name` would also change `state.user.name`. Nested spreads (`{ ...state, user: { ...state.user, name: \'x\' } }`) are needed to update nested data immutably.',
            },
            {
              type: 'heading',
              text: 'What spread actually copies',
            },
            {
              type: 'table',
              headers: ['Technique', 'Depth', 'Keeps prototype / class?', 'Handles Date, Map, Set, cycles?', 'Functions?'],
              rows: [
                ['`{ ...obj }` / `Object.assign`', 'Shallow', 'No — plain object; getters are *invoked* and copied as values', 'References shared', 'Copied by reference'],
                ['`JSON.parse(JSON.stringify(obj))`', 'Deep', 'No', 'No — Dates become strings, Map/Set become `{}`, cycles throw', 'Dropped'],
                ['`structuredClone(obj)`', 'Deep', 'No — class instances become plain objects', 'Yes (also typed arrays, Blob, Error)', 'Throws `DataCloneError`'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'destructuring edge cases',
              code: `// Defaults apply ONLY for undefined, not null
const { limit = 10 } = { limit: null }; // limit === null

// Destructuring null/undefined throws — guard with a default
function render({ title, items = [] } = {}) { /* ... */ }
render(); // fine thanks to '= {}'

// Swap without a temp variable
let a = 1, b = 2;
[a, b] = [b, a];

// Object rest excludes picked keys — handy for "omit"
const { password, ...publicUser } = { id: 1, name: 'Ava', password: 'x' };
// publicUser = { id: 1, name: 'Ava' }`,
            },
          ],
        },
        {
          id: 'template-literals-tagged-templates',
          title: 'Template Literals and Tagged Templates',
          summary:
            'Template literals replace string concatenation with readable interpolation and native multi-line strings, and tagged templates let a function intercept and transform a template literal before it becomes a string.',
          keyPoints: [
            'Template literals use backticks and `${expression}` interpolation — any valid JS expression is allowed inside `${}`.',
            'Unlike regular string literals, template literals can span multiple lines without any escape sequence.',
            'A **tagged template** is a function call written immediately before a template literal, like `tagFn` followed by a backtick string — the tag function receives the literal string pieces and the interpolated values separately, before they\'re joined.',
            'Tagged templates are the mechanism behind libraries like `styled-components` (CSS-in-JS) and safe SQL/HTML templating helpers.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'basic interpolation and multi-line strings',
              code: `const name = 'Ava';
const cartTotal = 42.5;

const message = \`Hi \${name}, your total is $\${cartTotal.toFixed(2)}.
Thanks for shopping with us!\`;
// Interpolation + a real newline, with no string concatenation or \\n needed.`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a tagged template that escapes HTML automatically',
              code: `function safeHtml(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    const escaped = String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')   // quotes matter inside attribute values
      .replace(/'/g, '&#39;');
    return result + escaped + str;
  });
}

const userInput = '<script>alert(1)</script>';
const html = safeHtml\`<p>Comment: \${userInput}</p>\`;
// '<p>Comment: &lt;script&gt;alert(1)&lt;/script&gt;</p>' — safe to render`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The tag function receives the literal text split into an array (`strings`) and each interpolated `${}` value as a separate argument (`values`) — this separation is exactly what lets a tag safely escape or transform each dynamic value individually before it is combined back into the final string.',
            },
            {
              type: 'heading',
              text: 'Under the hood: the strings array is frozen and cached',
            },
            {
              type: 'p',
              text: 'The `strings` argument is a frozen array with an extra `raw` property holding the unprocessed source text (escape sequences not interpreted). Per spec, the engine creates this template object **once per call site** and passes the identical array on every evaluation — libraries such as lit-html exploit this by using `strings` as a `WeakMap` key to cache parsed templates, so re-rendering only diffs the dynamic values. `String.raw` is the built-in tag that returns the raw text, useful for regexes and Windows paths.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'String.raw and per-call-site caching',
              code: `String.raw\`C:\\new\\table\`;   // 'C:\\\\new\\\\table' as source text — no newline/tab interpretation

const seen = new Set();
function tag(strings) { seen.add(strings); }
for (let i = 0; i < 3; i++) tag\`hello \${i}\`;
seen.size; // 1 — same frozen strings array every iteration`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Escaping is **context-dependent**. An HTML-escaping tag is safe for element text and quoted attribute values, but not for URLs (`javascript:` schemes), inline `<script>`, or CSS. For SQL, never escape by hand — tagged SQL helpers (e.g. in postgres.js or Prisma\'s raw queries) turn each `${}` into a bound parameter, which is the real protection against injection.',
            },
          ],
        },
        {
          id: 'closures',
          title: 'Closures',
          summary:
            'A closure is a function bundled with references to its surrounding lexical scope, persisting after the outer function has returned — the mechanism behind private state, memoization, and the classic loop-variable bug.',
          keyPoints: [
            'A closure keeps a live reference to its defining scope\'s variables, not a snapshot of their values at creation time.',
            'Closures are the mechanism behind the module pattern (private state) and memoization.',
            '`var` is function-scoped, so callbacks created in a loop all share the *same* variable — the classic `i` bug.',
            '`let` is block-scoped: each loop iteration gets its own binding, captured independently by each closure.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A closure is a function bundled with references to its surrounding lexical scope, persisting after the outer function has returned. Every function in JavaScript forms a closure over the scope it was defined in — this is not an opt-in feature, it is simply how scope resolution works. What makes closures notable is that the outer scope\'s variables stay alive in memory for as long as any inner function might still reference them, even long after the outer function has returned.',
            },
            {
              type: 'heading',
              text: 'The scope chain',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Global["Global scope"]
      G["appName = 'MyApp'"]
      subgraph Outer["makeCounter() scope"]
        O["count = 0"]
        subgraph Inner["returned function's scope"]
          I["increment() reads/writes 'count'<br/>by walking UP the scope chain"]
        end
      end
    end
    I -.->|"looks up 'count'"| O
    I -.->|"would look up 'appName'"| G`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'private state via closures — the module pattern',
              code: `function makeCounter() {
  let count = 0; // private — inaccessible from outside except via the closure
  return {
    increment: () => ++count,
    reset: () => { count = 0; },
    get value() { return count; },
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
console.log(counter.value); // 2 — 'count' has no global existence, only via the closure`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'the loop-variable bug, and the fix',
              code: `// Bug: logs 3, 3, 3 — var is function-scoped, so all three callbacks
// share the SAME i, which is 3 by the time any callback runs.
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

// Fix: let is block-scoped — each iteration gets its own binding,
// captured independently by each closure.
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Output: 0, 1, 2`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The `var` version is not a timing bug — it has nothing to do with `setTimeout` being "slow." Every callback closes over the *same* `i` variable, and by the time any of them run, the loop has already finished and `i` is `3`. Swapping in `let`, or wrapping the body in an IIFE that captures `i` by value, are the two classic fixes.',
            },
            {
              type: 'heading',
              text: 'How engines actually store closures',
            },
            {
              type: 'p',
              text: 'Spec-wise, every function holds a reference to its defining **Environment Record**. Real engines are smarter: V8 analyzes each scope at parse time and only variables referenced by *some* inner function are moved into a heap-allocated **Context** object; everything else stays on the stack (or in registers) and dies when the function returns. The catch is that all closures created in the same scope **share one Context**. If closure A captures a tiny counter and sibling closure B captures a 50 MB buffer, keeping A alive keeps the buffer alive too — a non-obvious leak source. (`eval` or `with` inside a scope defeats this analysis and forces everything to be retained.)',
            },
            {
              type: 'code',
              language: 'js',
              title: 'shared-context retention, and a stale closure',
              code: `function setup() {
  const huge = new Array(1e7).fill(0);
  const onDebug = () => huge.length;   // captures 'huge'
  let clicks = 0;
  return () => ++clicks;               // captures only 'clicks'...
}
const handler = setup();
// ...but 'huge' lives on: it sits in the SAME context object as 'clicks'
// because onDebug captured it. Fix: null it out, or split the scopes.

// Stale closure (React-style): the callback captured an OLD value
function makeLogger() {
  let current = 'v1';
  const log = ((snapshot) => () => console.log(snapshot))(current); // captures a copy
  current = 'v2';
  return log;
}
makeLogger()(); // 'v1' — it closed over the snapshot, not the live variable`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The "stale closure" bug in React hooks is pure JavaScript: each render is a new function call with new `const` bindings, so a `useEffect` or `setInterval` callback created in render N keeps seeing render N\'s state forever unless it is recreated (dependency array) or reads from a ref/functional updater.',
            },
          ],
        },
        {
          id: 'this-binding',
          title: '`this` Binding Rules',
          summary:
            'What `this` resolves to inside a function depends entirely on *how* the function was called, not where it was defined — except for arrow functions, which deliberately opt out of the whole system.',
          keyPoints: [
            'Precedence order: `new` binding > explicit binding (`call`/`apply`/`bind`) > implicit binding (`obj.method()`) > default binding (plain call).',
            'A plain function call has `this` as `undefined` in strict mode (or the global object otherwise).',
            'Arrow functions have no own `this` — they lexically inherit it from their enclosing scope at definition time.',
            'Arrow functions are the standard fix for `this`-loss bugs in callbacks (a class method passed as an event handler, or a function inside `setTimeout`).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The rules apply in this precedence order — the highest-precedence rule that applies wins:',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '`new Foo()` — `this` is the newly created object.',
                '`.call`/`.apply`/`.bind` — `this` is explicitly set.',
                'Method call (`obj.method()`) — `this` is `obj` (**implicit binding**).',
                'Plain function call — `this` is `undefined` in strict mode (or the global object otherwise).',
                '**Arrow functions have no own `this`** — they lexically inherit `this` from their enclosing scope at definition time.',
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Start["How was the function called?"] --> Q1{"Called with 'new'?"}
    Q1 -->|Yes| R1["this = the newly created object"]
    Q1 -->|No| Q2{"Called via call/apply/bind?"}
    Q2 -->|Yes| R2["this = explicitly passed object"]
    Q2 -->|No| Q3{"Called as obj.method()?"}
    Q3 -->|Yes| R3["this = obj (implicit binding)"]
    Q3 -->|No| Q4{"Is it an arrow function?"}
    Q4 -->|Yes| R4["this = lexical this from<br/>enclosing scope at definition time"]
    Q4 -->|No| R5["this = undefined (strict mode)<br/>or global object"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'losing and regaining `this` in a callback',
              code: `class Timer {
  seconds = 0;

  // Regular method: 'this' depends on HOW it's called.
  tickBroken() {
    this.seconds++;
  }

  start() {
    // Passing tickBroken as a bare reference loses its 'this' —
    // setTimeout calls it as a plain function, so this === undefined.
    setTimeout(this.tickBroken, 1000); // TypeError: Cannot read 'seconds' of undefined

    // Fix 1: arrow function wrapper captures the outer 'this' lexically.
    setTimeout(() => this.tickBroken(), 1000); // works

    // Fix 2: .bind() explicitly locks 'this' to the instance.
    setTimeout(this.tickBroken.bind(this), 1000); // works
  }
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Rule 5 is why arrow functions are the standard fix for `this`-loss bugs in callbacks — e.g. inside a class method passed as an event handler, or inside a `setTimeout` callback where a regular `function` would otherwise lose track of the enclosing instance.',
            },
            {
              type: 'heading',
              text: 'Edge cases interviewers love',
            },
            {
              type: 'table',
              headers: ['Situation', '`this` is...', 'Why'],
              rows: [
                ['Class bodies and ES modules', 'Strict-mode rules always', 'Class code and module code are implicitly strict, so default binding gives `undefined`, never `globalThis`.'],
                ['Top level of an ES module', '`undefined`', 'Modules are not scripts; use `globalThis` for the global object.'],
                ['`addEventListener` with a regular function', 'The element (`e.currentTarget`)', 'The DOM invokes the listener with `this` set to the current target.'],
                ['`bind` called twice', 'The first bound value', 'A bound function ignores later `bind`/`call`/`apply` for `this` — but `new` still overrides it.'],
                ['`(obj.method)()` vs `(0, obj.method)()`', '`obj` vs `undefined`', 'Parentheses keep the Reference; the comma operator produces a plain value, dropping the base object.'],
                ['Callback passed to `arr.map(fn, thisArg)`', '`thisArg`', 'Many array methods accept an explicit `this` argument (ignored by arrow functions).'],
              ],
            },
          ],
        },
        {
          id: 'prototypal-inheritance',
          title: 'Prototypal Inheritance',
          summary:
            'Every object has an internal prototype link, and property lookup walks up that chain — `class` syntax is sugar over exactly this mechanism, not a different one.',
          keyPoints: [
            'Every object has an internal `[[Prototype]]` link (`Object.getPrototypeOf`, historically `__proto__`).',
            'Property lookup walks up the prototype chain until the property is found, or the chain ends at `null`.',
            '`class B extends A` is sugar that sets `B.prototype.__proto__ = A.prototype` — the same underlying mechanism.',
            'Methods defined via `class` live once on the prototype and are shared across all instances; instance fields (`this.x = ...`) are per-instance.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Every object has an internal `[[Prototype]]` link (`Object.getPrototypeOf`, accessible historically via `__proto__`); property lookup walks up this prototype chain until found or the chain ends at `null`. `class` syntax is sugar over this same mechanism — `class B extends A` sets `B.prototype.__proto__ = A.prototype`.',
            },
            {
              type: 'mermaid',
              code: `flowchart BT
    instance["dog (an instance)<br/>own property: name = 'Rex'"] -->|"[[Prototype]]"| DogProto["Dog.prototype<br/>bark()"]
    DogProto -->|"[[Prototype]]"| AnimalProto["Animal.prototype<br/>eat()"]
    AnimalProto -->|"[[Prototype]]"| ObjProto["Object.prototype<br/>toString(), hasOwnProperty()"]
    ObjProto -->|"[[Prototype]]"| Null["null — chain ends"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'class syntax is sugar over the prototype chain',
              code: `class Animal {
  constructor(name) { this.name = name; } // per-instance field
  eat() { return \`\${this.name} is eating\`; }  // lives once, on Animal.prototype
}

class Dog extends Animal {
  bark() { return \`\${this.name} says woof\`; } // lives once, on Dog.prototype
}

const rex = new Dog('Rex');
rex.bark();  // found directly on Dog.prototype
rex.eat();   // NOT on Dog.prototype — found by walking up to Animal.prototype

console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Understanding this explains why methods defined via `class` are shared across all instances (they live once on the prototype) while instance fields (`this.x = ...` in the constructor) are per-instance — a frequent source of "why did changing it on one instance affect all of them" bugs when a method is accidentally overwritten on a single instance versus the shared prototype.',
            },
            {
              type: 'heading',
              text: 'The mechanics: lookup, shadowing, and `instanceof`',
            },
            {
              type: 'code',
              language: 'js',
              title: 'prototypes without class syntax',
              code: `const animal = { eat() { return \`\${this.name} eats\`; } };
const dog = Object.create(animal, { name: { value: 'Rex', enumerable: true } });
dog.eat();                          // 'Rex eats' — found on the prototype, 'this' is dog

// Writes never go up the chain: assignment creates an OWN property (shadowing)
dog.eat = () => 'overridden';       // only dog changes; animal.eat untouched

// instanceof walks the chain looking for Ctor.prototype
class Animal {}
const a = new Animal();
a instanceof Animal;                // true
Object.setPrototypeOf(a, null);
a instanceof Animal;                // false — the link is gone

// Dictionary objects with no prototype at all
const dict = Object.create(null);
'toString' in dict;                 // false`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never change an existing object\'s prototype (`Object.setPrototypeOf`, assigning `__proto__`) on a hot path. Engines cache property lookups per **hidden class/shape** with inline caches; mutating a prototype invalidates those caches for every object sharing it and can deoptimize unrelated code. Set the prototype once at creation (`Object.create`, `class`).',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Prototype pollution: if untrusted JSON is deep-merged into an object, a key like `__proto__` can write onto `Object.prototype` and change the behavior of *every* object in the process (a recurring CVE class in merge/clone libraries). Defend by rejecting `__proto__`, `constructor`, and `prototype` keys, using `Map` or `Object.create(null)` targets, or freezing `Object.prototype` in hardened environments.',
            },
          ],
        },
        {
          id: 'modern-classes',
          title: 'Modern Classes: Private Fields, Static Blocks, and Accessors',
          summary:
            'Class syntax grew real encapsulation in ES2022 — `#private` fields and methods enforced by the engine, static initialization blocks, and ergonomic brand checks — while decorators are still a TC39 proposal you mostly meet through TypeScript.',
          keyPoints: [
            '`#field` and `#method()` are **hard-private**: inaccessible from outside the class body, invisible to `Object.keys`, `JSON.stringify`, and `Proxy` — unlike TypeScript\'s `private`, which is erased at compile time.',
            'Public and private **class fields** are initialized per instance, before the constructor body runs (after `super()` in subclasses).',
            '`static { ... }` blocks run once when the class is evaluated and can access private static state — useful for complex static setup.',
            '`#x in obj` is an ergonomic **brand check**: true only if `obj` was constructed by this class (or a subclass), with no throw.',
            'Decorators (`@logged`) are a Stage 3 TC39 proposal, implemented by TypeScript 5+ and Babel; do not assume native engine support yet.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'a class using every modern feature',
              code: `class BankAccount {
  static #instances = 0;              // private static field
  static currency;                    // public static field

  static {                            // static initialization block (ES2022)
    BankAccount.currency = globalThis.APP_CURRENCY ?? 'USD';
  }

  #balanceCents = 0;                  // private instance field
  owner;                              // public instance field (own property)

  constructor(owner) {
    this.owner = owner;
    BankAccount.#instances++;
  }

  get balance() { return this.#balanceCents / 100; } // accessor on the prototype

  deposit(cents) {
    this.#assertPositive(cents);
    this.#balanceCents += cents;
    return this;
  }

  #assertPositive(n) {                // private method
    if (!Number.isInteger(n) || n <= 0) throw new RangeError('amount must be a positive integer');
  }

  static isAccount(obj) { return #balanceCents in obj; } // brand check (ES2022)
  static get count() { return BankAccount.#instances; }
}

const acct = new BankAccount('Ava').deposit(2500);
acct.balance;                 // 25
acct.#balanceCents;           // SyntaxError — not even parseable outside the class
BankAccount.isAccount({});    // false
JSON.stringify(acct);         // '{"owner":"Ava"}' — private state never leaks`,
            },
            {
              type: 'table',
              headers: ['', '`#private` (JS)', '`private` (TypeScript)', '`_convention`', 'Closure / `WeakMap`'],
              rows: [
                ['Enforced at runtime', 'Yes, by the engine', 'No — erased on compile', 'No', 'Yes'],
                ['Visible to reflection/serialization', 'No', 'Yes', 'Yes', 'No'],
                ['Works through a `Proxy`', 'No — throws `TypeError`', 'Yes', 'Yes', 'Yes'],
                ['Accessible from other instances of the same class', 'Yes', 'Yes', 'Yes', 'Depends'],
                ['Testability / monkey-patching', 'Hard by design', 'Easy', 'Easy', 'Hard'],
              ],
            },
            {
              type: 'heading',
              text: 'Field initialization order and `[[Define]]` semantics',
            },
            {
              type: 'p',
              text: 'Class fields use **define** semantics (`Object.defineProperty`), not assignment. That means a field declared in a subclass *replaces* any accessor of the same name inherited from the base class instead of calling its setter — a frequent surprise when migrating from TypeScript\'s legacy `useDefineForClassFields: false` behavior. The construction order is: base constructor runs, then the subclass\'s fields are initialized, then the rest of the subclass constructor body runs. So a base constructor that calls an overridden method will see the subclass\'s fields as `undefined`.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'the base-constructor-calls-override trap',
              code: `class Base {
  constructor() { this.init(); }
  init() {}
}
class Child extends Base {
  items = [];                   // initialized AFTER Base's constructor returns
  init() { this.items.push(1); } // TypeError: Cannot read properties of undefined
}
new Child();`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Private fields and `Proxy` do not mix: a method doing `this.#x` throws when `this` is a Proxy (the proxy object does not have the private slot). This is why reactive libraries that wrap instances in proxies (Vue\'s `reactive`, MobX observables) document that classes with `#private` state must be handled specially.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Decorators: the current TC39 proposal (with `accessor` keyword and `context` object) differs from TypeScript\'s older `experimentalDecorators`, which Angular and NestJS were built on. They are not interchangeable — check which semantics your framework expects before enabling either.',
            },
          ],
        },
        {
          id: 'equality-coercion',
          title: 'Equality, Coercion, and Type Gotchas',
          summary:
            '`==` coerces types before comparing and `===` never does — default to `===` everywhere, but know the coercion rules well enough to explain a surprising legacy `==` result when interviewers plant one.',
          keyPoints: [
            '`==` performs type coercion before comparing; `===` never coerces.',
            'Default to `===` everywhere in new code.',
            '`NaN !== NaN` — use `Number.isNaN()` or `Object.is()` to test for it.',
            '`typeof null === \'object\'` is a long-standing language bug, not a design choice — know it, do not defend it.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'When you compare two values with `==`, JavaScript first checks whether they are already the same type. If they are, `==` behaves exactly like `===` — no coercion happens. If the types differ, `==` tries to convert one or both sides so they *can* be compared, following a fixed set of rules (for example: a string compared to a number gets converted to a number first). `===` skips all of that — if the types differ, the answer is simply `false`, full stop. That is the entire reason `===` is easier to reason about: there is no hidden conversion step to keep track of.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Start["a == b"] --> SameType{"Are a and b<br/>already the same type?"}
    SameType -->|Yes| StrictCompare["Compare exactly like ===<br/>(no coercion happens)"]
    SameType -->|No| NullCheck{"Is one of them<br/>null or undefined?"}
    NullCheck -->|"both are null/undefined"| True1["true"]
    NullCheck -->|"only one is"| False1["false — null/undefined only equal each other"]
    NullCheck -->|No| NumStr{"Is one a number<br/>and the other a string?"}
    NumStr -->|Yes| ConvertStr["convert the string to a number,<br/>then compare"]
    NumStr -->|No| BoolCheck{"Is either one a boolean?"}
    BoolCheck -->|Yes| ConvertBool["convert the boolean to a number<br/>(true to 1, false to 0), then re-run"]
    BoolCheck -->|No| ObjCheck{"Is one an object and<br/>the other a primitive?"}
    ObjCheck -->|Yes| ToPrimitive["convert the object to a primitive<br/>(via valueOf/toString), then re-run"]
    ObjCheck -->|No| False2["false"]`,
            },
            {
              type: 'table',
              headers: ['Expression', 'Result', 'Why'],
              rows: [
                ["`'' == 0`", '`true`', 'The empty string coerces to `0` before comparing.'],
                ['`null == undefined`', '`true`', 'Special-cased to be equal to each other, and to nothing else.'],
                ['`null == 0`', '`false`', '`null` does **not** coerce to `0` under `==`, despite the previous row.'],
                ['`NaN === NaN`', '`false`', 'Use `Number.isNaN()` or `Object.is()` to actually test for `NaN`.'],
                ['`typeof null`', "`'object'`", 'A long-standing language bug baked in for backwards compatibility.'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'a real `==` bug, and the `===` fix',
              code: `// Common mistake: using == to check "is this value empty/falsy"
// lets in far more values than intended.
function isEmptyMistake(value) {
  return value == false; // BUG: coercion makes this match way more than "empty"
}

isEmptyMistake('');    // true  — okay, that was the intent
isEmptyMistake(0);     // true  — okay, that was the intent
isEmptyMistake('0');   // true  — WRONG: '0' is a non-empty string the user typed
isEmptyMistake([]);    // true  — WRONG: an empty array is not "false"

// Fix: name the exact conditions you mean, and compare with ===
// so nothing gets coerced into matching by accident.
function isEmptyFixed(value) {
  return value === '' || value === null || value === undefined;
}

isEmptyFixed('0'); // false — correctly treated as real input
isEmptyFixed([]);  // false — correctly not treated as "empty"`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Default to `===` everywhere; know the coercion rules well enough to explain *why* a `==` comparison in legacy code produces a surprising result, since that is exactly the kind of bug interviewers plant.',
            },
            {
              type: 'heading',
              text: 'The four equality algorithms in the spec',
            },
            {
              type: 'table',
              headers: ['Algorithm', 'Used by', '`NaN` vs `NaN`', '`+0` vs `-0`'],
              rows: [
                ['IsLooselyEqual', '`==`', '`false`', '`true`'],
                ['IsStrictlyEqual', '`===`, `indexOf`, `switch`', '`false`', '`true`'],
                ['SameValueZero', '`Array.prototype.includes`, `Map` keys, `Set` membership', '`true`', '`true`'],
                ['SameValue', '`Object.is`, React `useState`/`memo` comparisons', '`true`', '`false`'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'why includes() finds NaN but indexOf() does not',
              code: `[NaN].indexOf(NaN);   // -1  (strict equality)
[NaN].includes(NaN);  // true (SameValueZero)
new Set([NaN, NaN]).size; // 1
Object.is(-0, 0);     // false — matters for e.g. Math.sign or 1 / x direction

// The one sanctioned use of == : checking for both null and undefined at once
if (value == null) { /* value is null OR undefined, nothing else */ }`,
            },
          ],
        },
        {
          id: 'es-modules',
          title: 'ES Modules: import/export',
          summary:
            'ES modules are JavaScript\'s native, standardized module system — statically analyzable at build time, which is precisely what makes tree-shaking, bundling, and reliable dependency graphs possible.',
          keyPoints: [
            'A **named export** (`export const x = ...`) can have many per module and must be imported by the same name (or renamed with `as`); a **default export** (`export default ...`) is limited to one per module and can be imported under any name.',
            '`import`/`export` are statically analyzable — the engine/bundler knows every module\'s dependencies without running any code, unlike CommonJS\'s dynamic `require()`.',
            'This static structure is what makes **tree-shaking** possible: a bundler can detect an exported binding is never imported anywhere and omit it from the final bundle.',
            'ES modules run in **strict mode** automatically and have their own top-level scope — a variable declared in one module never leaks into another.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'named vs default exports',
              code: `// utils.js
export const add = (a, b) => a + b;      // named export
export const subtract = (a, b) => a - b; // another named export
export default function formatCurrency(n) { // the one default export
  return \`$\${n.toFixed(2)}\`;
}

// main.js
import formatCurrency, { add, subtract as sub } from './utils.js';
//     ^default, any name       ^named, must match     ^renamed with 'as'

import * as utils from './utils.js'; // grab everything as one namespace object`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    main["main.js"] -->|imports| utils["utils.js"]
    utils -->|imports| format["formatters.js"]
    main -->|imports, but doesn't use export C| helpers["helpers.js"]
    helpers -.->|"tree-shaken away — C unused"| C["export C (dead code)"]`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'CommonJS (`require`/`module.exports`, still common in the Node.js ecosystem) resolves and executes modules dynamically and synchronously at *runtime*, which is more flexible (e.g. `require()` inside an `if`) but prevents reliable static tree-shaking. Modern bundlers and Node.js support ES modules directly (`.mjs`, or `"type": "module"` in `package.json`) as the preferred format, and current Node.js LTS lines can also `require()` a synchronous ES module graph (no top-level `await`), which has removed most of the old "ESM-only package breaks my CJS app" pain.',
            },
            {
              type: 'heading',
              text: 'How a module graph loads: three phases',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["1. Construction<br/>fetch + parse every module,<br/>discover static imports"] --> B["2. Linking<br/>allocate bindings for all exports,<br/>wire imports to them (live)"]
    B --> C["3. Evaluation<br/>run module bodies,<br/>dependencies first (post-order)"]
    C --> D["Top-level await pauses<br/>this module and its dependents only"]`,
            },
            {
              type: 'p',
              text: 'Because linking happens before any code runs, an import is a **live binding** to the exporter\'s variable, not a copy of its value — if the exporting module later reassigns an exported `let`, importers see the new value. Imports are also read-only from the importer\'s side. Each module is evaluated **once** per realm and cached by its resolved URL, which is why module-level state behaves like a singleton.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'dynamic import, top-level await, import attributes, and import.meta',
              code: `// Code-split a heavy dependency: only fetched when actually needed
button.addEventListener('click', async () => {
  const { renderChart } = await import('./chart.js'); // returns a Promise of the namespace
  renderChart(data);
});

// Top-level await (ES2022): this module (and its importers) wait; siblings do not
const config = await fetch('/config.json').then(r => r.json());

// Import attributes + JSON modules (ES2025)
import schema from './schema.json' with { type: 'json' };

// Module-relative paths without __dirname
const dataUrl = new URL('./data.csv', import.meta.url);
console.log(import.meta.dirname); // Node.js (and Deno/Bun) convenience; not in browsers`,
            },
            {
              type: 'table',
              headers: ['', 'ES modules', 'CommonJS'],
              rows: [
                ['Syntax', '`import` / `export`', '`require()` / `module.exports`'],
                ['Resolution', 'Static, before execution', 'Dynamic, during execution'],
                ['Bindings', 'Live, read-only', 'Copied value of `module.exports` at require time'],
                ['Loading', 'Asynchronous-capable (top-level `await`)', 'Synchronous'],
                ['Strict mode', 'Always', 'Opt-in'],
                ['`this` at top level', '`undefined`', '`module.exports`'],
                ['Tree-shaking', 'Reliable', 'Heuristic at best'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Barrel files (`index.js` re-exporting everything) and modules with top-level side effects defeat tree-shaking: a bundler must keep code it cannot prove is side-effect free. Mark packages with `"sideEffects": false` in `package.json` when true, and import from specific paths in hot bundles. Circular imports work with live bindings but can expose TDZ errors if a module reads a `const` from a cycle partner during evaluation.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Browsers resolve bare specifiers (`import \'lodash-es\'`) via **import maps** (`<script type="importmap">`), which let you ship unbundled ESM in production for small apps. For larger apps, bundling still wins on request count, compression and dead-code elimination.',
            },
          ],
        },
        {
          id: 'event-loop',
          title: 'The Event Loop, Precisely',
          summary:
            'Each JavaScript agent (a page, a worker) runs your code on a single thread with one call stack; the event loop picks **tasks** from several task queues, drains the **microtask** queue after each one, and only then may render — that ordering explains almost every "why did that log in that order" surprise.',
          keyPoints: [
            'Your JS runs on one thread per agent (window or worker): one call stack, one microtask queue, and **multiple task (macrotask) queues** — the HTML spec groups tasks by source (timers, user input, networking, messaging) and lets the browser prioritize between them.',
            'After each task, the engine drains the *entire* microtask queue — including microtasks queued by microtasks — before running another task or letting the browser render.',
            'Promise reactions (`.then`, `await` continuations) and `queueMicrotask` are microtasks; `setTimeout`, `setInterval`, `MessageChannel`, UI events, and network callbacks are tasks.',
            'Rendering (style, layout, paint) is a separate step the browser runs *between* tasks, typically once per display frame; `requestAnimationFrame` callbacks run right before it.',
            'Node.js uses libuv with explicit **phases** (timers, poll, check, close) and has `process.nextTick`, a queue that runs even before Promise microtasks.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The JavaScript language spec only defines *jobs* (what we call microtasks); the event loop itself is defined by the **host** — the HTML spec for browsers, libuv for Node.js. In a browser, the loop repeatedly: picks the oldest runnable task from a task queue the browser chooses, runs it to completion on the call stack, drains the entire microtask queue, and then, if it is time for a new frame, runs the rendering steps (resize/scroll events, `requestAnimationFrame` callbacks, style, layout, paint). "Run to completion" is the key guarantee: nothing — not even a click handler — can interrupt a function midway, which is why JavaScript needs no locks for ordinary data, and also why a long-running function freezes the page.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Task["Pick ONE task<br/>(timer, event, network, message)"] --> Run["Run it to completion<br/>on the call stack"]
    Run --> CheckMicro{"Microtask queue empty?"}
    CheckMicro -->|No| RunMicro["Run next microtask<br/>(may queue more)"] --> CheckMicro
    CheckMicro -->|Yes| Frame{"Time to render a frame?"}
    Frame -->|Yes| RAF["rAF callbacks, then<br/>style, layout, paint"] --> Task
    Frame -->|No| Task`,
            },
            {
              type: 'heading',
              text: 'The classic interview question',
            },
            {
              type: 'p',
              text: 'Predict the output of:',
            },
            {
              type: 'code',
              language: 'js',
              code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2`,
            },
            {
              type: 'p',
              text: "`1` and `4` run synchronously first. The promise callback (`3`) is a microtask and runs before the `setTimeout` callback (`2`), a macrotask, even though both were \"scheduled\" for as soon as possible.",
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A `setTimeout(fn, 0)` does **not** mean "run immediately" — it means "queue a task once at least 0 ms have passed," which runs only after the current script and the *entire* microtask queue have finished. Browsers also clamp nested timers (5+ levels deep) to a minimum of about 4 ms and throttle timers heavily in background tabs.',
            },
            {
              type: 'heading',
              text: 'A harder ordering puzzle',
            },
            {
              type: 'code',
              language: 'js',
              title: 'async functions, await, and queueMicrotask',
              code: `async function a() {
  console.log('A1');
  await null;               // everything after this is a microtask continuation
  console.log('A2');
}

console.log('S1');
setTimeout(() => console.log('T1'), 0);
a();
queueMicrotask(() => console.log('M1'));
Promise.resolve().then(() => console.log('P1')).then(() => console.log('P2'));
console.log('S2');

// Output: S1, A1, S2, A2, M1, P1, P2, T1
// - 'A1' is synchronous: an async function runs synchronously until its first await.
// - A2, M1, P1 were queued in that order; P2 is queued only when P1 finishes.
// - T1 is a task, so it waits for the whole microtask queue to drain.`,
            },
            {
              type: 'heading',
              text: 'Starvation, long tasks, and yielding',
            },
            {
              type: 'p',
              text: 'Because the microtask queue is drained to empty, a microtask that keeps queuing microtasks (a recursive `.then`, or a loop of `await Promise.resolve()`) starves tasks *and* rendering — the page freezes as hard as a `while (true)`. Conversely, a single task that runs longer than 50 ms is a **long task**: input handlers queue behind it, which shows up directly in the Interaction to Next Paint (INP) Core Web Vital. The fix is to break work into chunks and *yield to the event loop* between them, so input and rendering can run.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'yielding inside long-running work',
              code: `function yieldToMain() {
  // scheduler.yield() resumes with priority ahead of other queued tasks
  // where supported; fall back to a fresh task via setTimeout.
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise(resolve => setTimeout(resolve, 0));
}

async function processAll(items) {
  let lastYield = performance.now();
  for (const item of items) {
    process(item);
    if (performance.now() - lastYield > 40) { // stay under the 50 ms long-task budget
      await yieldToMain();                    // NOTE: await Promise.resolve() would NOT yield
      lastYield = performance.now();
    }
  }
}`,
            },
            {
              type: 'heading',
              text: 'Node.js is different in the details',
            },
            {
              type: 'table',
              headers: ['Mechanism', 'Browser', 'Node.js'],
              rows: [
                ['`process.nextTick(fn)`', 'n/a', 'Runs before Promise microtasks; can starve I/O if recursive'],
                ['Promise reactions / `queueMicrotask`', 'Microtask', 'Microtask (after the nextTick queue)'],
                ['`setTimeout(fn, 0)`', 'Task (timers source)', 'Timers phase (minimum 1 ms)'],
                ['`setImmediate(fn)`', 'n/a', 'Check phase — right after I/O polling'],
                ['I/O callbacks', 'Networking task source', 'Poll phase'],
                ['Rendering / `requestAnimationFrame`', 'Between tasks, per frame', 'n/a'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'In Node, the order of `setTimeout(fn, 0)` vs `setImmediate(fn)` from the main module is non-deterministic (it depends on how fast the loop starts), but inside an I/O callback `setImmediate` always fires first, because the check phase comes right after the poll phase.',
            },
          ],
        },
        {
          id: 'promises-async-await',
          title: 'Promises and Async/Await',
          summary:
            '`async`/`await` is syntactic sugar over Promises, and the choice between `Promise.all`, `allSettled`, and `race` — plus sequential versus concurrent `await`ing — is one of the most common real performance bugs in code review.',
          keyPoints: [
            'An `async` function always returns a Promise; `await` pauses execution of *that function*, not the whole program, until the awaited Promise settles.',
            'A Promise has exactly one of three states — `pending`, `fulfilled`, or `rejected` — and once settled (fulfilled/rejected), it can never change state again.',
            '`Promise.all` runs concurrently and rejects as soon as any one rejects (fails fast) — use when you need every result.',
            '`Promise.allSettled` runs concurrently, never short-circuits, and returns the status of every promise — use when partial failure is acceptable.',
            '`Promise.race` resolves/rejects as soon as the first promise settles — used for timeout patterns; `Promise.any` resolves with the first *fulfillment*.',
            'Newer helpers: `Promise.withResolvers()` (ES2024) and `Promise.try()` (ES2025); for real cancellation and timeouts use `AbortSignal.timeout()` / `AbortSignal.any()`.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`async`/`await` is syntactic sugar over Promises — an `async` function always returns a Promise, and `await` pauses execution of that function (not the whole program) until the awaited Promise settles. Under the hood, an `async` function is transformed by the engine into something conceptually similar to a generator driven by Promise `.then()` callbacks: each `await` splits the function into a "before" and "after" piece, with the "after" piece scheduled as a microtask once the awaited value resolves.',
            },
            {
              type: 'mermaid',
              code: `stateDiagram-v2
    [*] --> pending
    pending --> fulfilled: resolve(value)
    pending --> rejected: reject(error)
    fulfilled --> [*]: .then() microtask runs
    rejected --> [*]: .catch() microtask runs
    note right of fulfilled : Once settled, state never changes again`,
            },
            {
              type: 'heading',
              text: 'Key patterns',
            },
            {
              type: 'list',
              items: [
                '**`Promise.all`**: runs promises concurrently, rejects as soon as any one rejects (fails fast) — use when you need every result and would fail the whole operation if any part fails.',
                '**`Promise.allSettled`**: runs concurrently, never short-circuits, returns the status of every promise — use when partial failure is acceptable and you need to know which ones failed.',
                '**`Promise.race`**: resolves/rejects as soon as the first promise settles — used for timeout patterns (race a real request against a timer promise).',
                '**Sequential vs. concurrent `await`**: awaiting inside a `for` loop one at a time runs requests sequentially (slow, but sometimes required — e.g. rate-limited APIs or when each step depends on the previous result); mapping to promises first and `Promise.all`-ing them runs them concurrently — a frequent, real performance bug in interview code review rounds.',
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'sequential vs. concurrent awaiting',
              code: `// Sequential: each request waits for the previous one to finish (slow)
const sequential = [];
for (const id of ids) {
  const result = await fetchThing(id);
  sequential.push(result);
}

// Concurrent: all requests start immediately and are in flight together (fast)
const concurrent = await Promise.all(ids.map(id => fetchThing(id)));

// Bounded concurrency: at most 'limit' in flight — the production-grade middle ground
async function mapWithLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;              // safe: no await between read and increment
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
const limited = await mapWithLimit(ids, 5, fetchThing);`,
            },
            {
              type: 'table',
              headers: ['Combinator', 'Settles when', 'Result on success', 'Typical use'],
              rows: [
                ['`Promise.all`', 'All fulfill, or first rejection', 'Array of values (input order)', 'Everything is required'],
                ['`Promise.allSettled`', 'All settle', 'Array of `{ status, value / reason }`', 'Independent, partially-failable work'],
                ['`Promise.race`', 'First settles (either way)', 'That value or rejection', 'Timeouts, first-response-wins'],
                ['`Promise.any` (ES2021)', 'First fulfillment, or all reject', 'First value; `AggregateError` if all fail', 'Redundant mirrors/replicas'],
              ],
            },
            {
              type: 'heading',
              text: 'Newer Promise utilities',
            },
            {
              type: 'code',
              language: 'js',
              title: 'Promise.withResolvers (ES2024), Promise.try (ES2025), and abortable timeouts',
              code: `// Promise.withResolvers: get resolve/reject out without the constructor dance
function once(target, eventName) {
  const { promise, resolve } = Promise.withResolvers();
  target.addEventListener(eventName, resolve, { once: true });
  return promise;
}
await once(window, 'load');

// Promise.try: run a callback that may throw synchronously OR return a promise,
// and always get a promise back (sync throws become rejections)
const result = await Promise.try(() => maybeSyncMaybeAsync(input));

// Timeouts: prefer AbortSignal.timeout over racing a timer — it also cancels the work
const res = await fetch('/api/report', { signal: AbortSignal.timeout(5000) });

// Combine a user-cancel signal with a timeout
const userCancel = new AbortController();
await fetch('/api/export', {
  signal: AbortSignal.any([userCancel.signal, AbortSignal.timeout(30_000)]),
});`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '`Promise.race([request, timeout])` only stops *waiting* — the losing request keeps running, consuming sockets and server work, and its result is silently discarded. Real cancellation needs an `AbortSignal` passed down to the operation itself.',
            },
            {
              type: 'heading',
              text: 'Error-handling semantics that trip up seniors',
            },
            {
              type: 'list',
              items: [
                '**Unhandled rejections are fatal in Node.js** (default mode `throw` since Node 15): a rejected promise with no handler by the end of the microtask drain crashes the process. In browsers it fires an `unhandledrejection` event — wire it to your error reporting.',
                '**`return await` inside `try`**: `return promise` in a `try` block skips the `catch` if that promise rejects, because the function already returned; `return await promise` keeps the rejection inside the `try`. Outside `try`, `return await` is redundant (though it improves async stack traces).',
                '**Forgotten `await`**: `if (await isAllowed())` vs `if (isAllowed())` — a Promise object is always truthy, a real authorization bug. TypeScript-ESLint\'s `no-floating-promises` and `no-misused-promises` catch these.',
                '**`forEach` does not await**: `items.forEach(async x => await save(x))` fires all saves concurrently and returns immediately; errors become unhandled rejections. Use `for...of` or `Promise.all(items.map(...))`.',
                '**Thenables**: `await` and `resolve()` adopt any object with a `then` method, so returning an object with a `then` property from an async function has surprising effects.',
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'try/catch around await — the async equivalent of .catch()',
              code: `async function loadUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    return await response.json();
  } catch (err) {
    console.error('Failed to load user:', err);
    throw err; // re-throw so the caller can also react, if needed
  }
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Writing `for (const id of ids) { await fetchThing(id); }` when the requests are actually independent is one of the most common real-world performance bugs — it turns N requests that could run in parallel into N sequential round trips.',
            },
          ],
        },
        {
          id: 'error-handling',
          title: 'Error Handling: Error Types, `cause`, and Failure Design',
          summary:
            'Robust JavaScript treats errors as data with structure — typed `Error` subclasses, `cause` chains that preserve the root failure, `AggregateError` for many failures — and draws a clear line between expected failures and bugs.',
          keyPoints: [
            'Always throw `Error` instances (or subclasses), never strings or plain objects — only `Error`s carry a `stack` and work with `instanceof` and error tooling.',
            'ES2022 `new Error(message, { cause })` chains errors so you can add context at each layer without losing the original failure.',
            '`AggregateError` (thrown by `Promise.any`) carries multiple underlying errors in `.errors`.',
            'Expected failures (validation, not found, network) are part of your API contract; bugs (`TypeError` from undefined access) should crash loudly and be reported, not swallowed.',
            '`finally` always runs, and a `return` or `throw` inside `finally` *overrides* the original outcome — avoid both.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'JavaScript lets you `throw` any value, which is a design mistake you should not use: a thrown string has no stack trace, cannot be distinguished by type, and breaks error-reporting SDKs. The built-in hierarchy — `Error`, `TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`, `URIError`, `EvalError`, `AggregateError` — plus your own subclasses gives you something you can branch on reliably.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'typed errors with cause chains',
              code: `class HttpError extends Error {
  constructor(status, url, options) {
    super(\`HTTP \${status} for \${url}\`, options); // passes { cause } through
    this.name = 'HttpError';                      // shows in stack traces and logs
    this.status = status;
  }
  get retryable() { return this.status >= 500 || this.status === 429; }
}

async function getJson(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    // Network failure / abort: add context, keep the original as cause
    throw new Error(\`Network error fetching \${url}\`, { cause: err });
  }
  if (!res.ok) throw new HttpError(res.status, url);
  return res.json();
}

try {
  await getJson('/api/orders');
} catch (err) {
  if (err instanceof HttpError && err.retryable) scheduleRetry();
  else if (err.name === 'AbortError') { /* user cancelled — not an error worth reporting */ }
  else reportError(err); // err.cause holds the underlying TypeError / DOMException
}`,
            },
            {
              type: 'heading',
              text: 'Where errors go when nobody catches them',
            },
            {
              type: 'table',
              headers: ['Failure', 'Browser', 'Node.js'],
              rows: [
                ['Sync throw escaping a task', '`window` `error` event; logged to console', '`uncaughtException`; process exits'],
                ['Rejected promise with no handler', '`unhandledrejection` event', 'Process exits by default (`--unhandled-rejections=throw`)'],
                ['Error inside a `setTimeout` callback', 'Not catchable by a `try` around `setTimeout` — it runs later on a fresh stack', 'Same'],
                ['Error in an event listener', 'Reported, other listeners still run', 'EventEmitter `error` event with no listener throws'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'finally pitfalls and a catch that preserves types',
              code: `function surprising() {
  try {
    throw new Error('real problem');
  } finally {
    return 'ok'; // swallows the error entirely — lint rule: no-unsafe-finally
  }
}
surprising(); // 'ok'

// Catch only what you understand; rethrow the rest
try {
  config = JSON.parse(text);
} catch (err) {
  if (!(err instanceof SyntaxError)) throw err; // never swallow unknown errors
  config = defaults;
}

// Optional catch binding (ES2019) when the error object is irrelevant
try { localStorage.setItem('k', 'v'); } catch { /* storage disabled — degrade */ }`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Use `Error.isError(value)` (ES2026) rather than `instanceof Error` when values may come from another realm (iframes, `vm` contexts, workers via structured clone); `instanceof` checks the prototype chain against *this* realm\'s `Error` and returns `false` for foreign errors. Also, `Error.captureStackTrace` is a V8/Node-specific API — do not rely on it in cross-runtime code.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'An empty `catch {}` around broad code is the most expensive line in many codebases: it converts a loud, debuggable bug into silent data corruption. If you must suppress, suppress a specific, named error type and log it.',
            },
          ],
        },
        {
          id: 'generators-iterators',
          title: 'Generators and Iterators',
          summary:
            'The iterator protocol standardizes "how to produce a sequence of values one at a time," and generator functions are the easiest way to implement it — pausing and resuming their own execution with `yield`.',
          keyPoints: [
            'An **iterator** is any object with a `.next()` method that returns `{ value, done }`; an **iterable** is any object with a `[Symbol.iterator]` method that returns an iterator — this is what `for...of` and spread rely on.',
            'A **generator function** (`function*`) is a convenient way to write an iterator: calling it doesn\'t run the body, it returns a generator object; each call to `.next()` runs until the next `yield`, then pauses.',
            'Generators can produce **infinite** lazy sequences safely, since values are only computed as they\'re requested.',
            '`yield` can also receive a value passed into the *next* `.next(value)` call, making generators a (rarely used) two-way communication channel.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Anything you can `for...of` over, or spread with `...`, is an **iterable**: an object implementing `Symbol.iterator`, a well-known symbol whose method returns an **iterator** — an object with a `.next()` method returning `{ value, done }` each time it\'s called. Arrays, strings, `Map`s, and `Set`s are all built-in iterables. Writing this protocol by hand is tedious; a **generator function** does it for you, using `yield` to pause execution and hand back a value each time `.next()` is called.',
            },
            {
              type: 'mermaid',
              code: `stateDiagram-v2
    [*] --> Suspended: generator object created (body NOT run yet)
    Suspended --> Running: .next() called
    Running --> Suspended: yield reached — pauses, returns { value, done:false }
    Running --> Completed: function body returns — { value, done:true }
    Suspended --> Running: .next(passedValue) resumes after the yield`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a lazy, infinite generator',
              code: `function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++; // pauses here, hands back the current id
  }
}

const ids = idGenerator();
console.log(ids.next().value); // 1
console.log(ids.next().value); // 2
console.log(ids.next().value); // 3
// Safe despite "while (true)" — nothing runs until .next() is called`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'implementing the iterable protocol for a custom class',
              code: `class Range {
  constructor(start, end) { this.start = start; this.end = end; }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  }
}

console.log([...new Range(1, 5)]); // [1, 2, 3, 4, 5] — spread works because it's iterable
for (const n of new Range(1, 3)) console.log(n); // 1, 2, 3`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Async generators (`async function*`, consumed with `for await...of`) combine this same pausing mechanism with Promises — the standard way to model a stream of asynchronously-arriving values, like paginated API results fetched one page at a time.',
            },
            {
              type: 'heading',
              text: 'Iterator helpers (ES2025): lazy map/filter/take',
            },
            {
              type: 'p',
              text: 'ES2025 added a global `Iterator` class whose prototype has `map`, `filter`, `take`, `drop`, `flatMap`, `reduce`, `toArray`, `forEach`, `some`, `every`, and `find`. Every built-in iterator (and every generator) inherits them. Unlike array methods, the transforming helpers are **lazy**: nothing runs until you pull values, and each element flows through the whole pipeline before the next one is produced — so no intermediate arrays, and infinite sources are fine. `Iterator.from(obj)` wraps any iterable or iterator-like object.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'lazy pipelines over iterators and async sources',
              code: `function* naturals() { let n = 1; while (true) yield n++; }

const firstFiveEvenSquares = naturals()
  .filter(n => n % 2 === 0)
  .map(n => n * n)
  .take(5)          // stops pulling from the infinite source after 5 items
  .toArray();       // [4, 16, 36, 64, 100]

// Works on any built-in iterator — e.g. Map keys — without spreading to an array
const longKeys = map.keys().filter(k => k.length > 10).toArray();

// Async generator for pagination, collected with Array.fromAsync (ES2026)
async function* pages(url) {
  while (url) {
    const res = await fetch(url);
    const body = await res.json();
    yield* body.items;          // delegate: yields each item individually
    url = body.nextPageUrl;
  }
}
const allItems = await Array.fromAsync(pages('/api/items?page=1'));

// Breaking out early calls the generator's return(), running its finally blocks
for await (const item of pages('/api/items?page=1')) {
  if (item.id === targetId) break;
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Iterator helpers are synchronous only; async iterator helpers are a separate, still-in-progress TC39 proposal. Also note that an iterator is **single-use**: after `.toArray()` consumes it, iterating again yields nothing. Arrays are iterables (re-iterable); `arr.values()` gives you a one-shot iterator with helpers.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Generators are not free: each `next()` call resumes a suspended frame and allocates a result object. In hot numeric loops a plain `for` loop over an array is still markedly faster; use generators and iterator helpers where laziness, streaming, or clarity matter.',
            },
          ],
        },
        {
          id: 'explicit-resource-management',
          title: 'Explicit Resource Management: `using` and `Symbol.dispose`',
          summary:
            'The `using` and `await using` declarations give JavaScript deterministic, scope-based cleanup — like C# `using` or Python `with` — so file handles, locks, subscriptions, and transactions are released even when code throws.',
          keyPoints: [
            'A `using` declaration binds an object with a `[Symbol.dispose]()` method; when the enclosing block exits — normally, via `return`, or via `throw` — that method is called automatically.',
            '`await using` does the same with `[Symbol.asyncDispose]()`, awaited at scope exit; it is only allowed where `await` is.',
            'Multiple resources are disposed in **reverse** declaration order, just like nested `try/finally` blocks.',
            'If disposal itself throws while another error is propagating, both are preserved in a `SuppressedError` (`.error` and `.suppressed`).',
            '`DisposableStack` / `AsyncDisposableStack` manage a dynamic set of resources and adapt APIs that do not implement the protocol.',
            'The proposal reached Stage 4 and is slated for the ES2027 edition; runtime support is still partial — feature-detect or transpile (TypeScript 5.2+ and Babel support it).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Before `using`, the only reliable cleanup tool was `try/finally`, which scales badly: three resources mean three nested blocks, and it is easy to forget one on an early return. Garbage collection is not a substitute — it is non-deterministic and never closes OS-level resources like sockets or file descriptors on a schedule you control. `using` ties a resource\'s lifetime to a lexical block, which is exactly the lifetime most resources need.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'what using desugars to',
              code: `{
  using lock = acquireLock('orders');        // lock[Symbol.dispose] runs at block exit
  await using conn = await pool.connect();   // conn[Symbol.asyncDispose] is awaited at exit
  await conn.query('UPDATE orders SET status = $1', ['shipped']);
} // disposal order: conn first, then lock (reverse of declaration)

// Roughly equivalent hand-written code:
{
  const lock = acquireLock('orders');
  try {
    const conn = await pool.connect();
    try {
      await conn.query('UPDATE orders SET status = $1', ['shipped']);
    } finally {
      await conn[Symbol.asyncDispose]();
    }
  } finally {
    lock[Symbol.dispose]();
  }
}`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'making your own disposable, and adapting legacy APIs',
              code: `function subscribe(emitter, event, handler) {
  emitter.on(event, handler);
  return {
    [Symbol.dispose]() { emitter.off(event, handler); }, // cleanup travels with the resource
  };
}

function handleRequest(req) {
  using _sub = subscribe(bus, 'config-changed', reload);
  using stack = new DisposableStack();
  const timer = setInterval(heartbeat, 1000);
  stack.defer(() => clearInterval(timer));           // adapt a non-disposable API
  const tmp = stack.use(openTempFile());              // register a disposable
  return process(req, tmp);
} // stack disposes tmp, then clears the timer; then _sub unsubscribes

// Feature detection when shipping untranspiled code
const supportsUsing = typeof Symbol.dispose === 'symbol';`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`using` only disposes at the end of its *block*. Declaring a resource with `using` inside a function and then returning it hands the caller an already-disposed object. If ownership must transfer, use `DisposableStack` and call `stack.move()` to hand the resources off, or let the caller own the `using`.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`using` is not allowed at the top level of a classic script or in `switch` case clauses without a block, and the value must be an object with a dispose method, `null`, or `undefined` (the last two are skipped) — anything else throws a `TypeError` at declaration time.',
            },
          ],
        },
        {
          id: 'proxy-reflect',
          title: 'The Proxy and Reflect APIs',
          summary:
            'A `Proxy` wraps an object and lets you intercept fundamental operations on it — property reads, writes, deletions — making it the mechanism behind reactive frameworks like Vue 3\'s reactivity system.',
          keyPoints: [
            'A `Proxy` wraps a target object with a `handler` of **traps** — functions that intercept operations like `get`, `set`, `has`, and `deleteProperty`.',
            '`Reflect` provides the default implementation of each trap as a plain function — used inside a trap to "forward" the operation after your custom logic runs.',
            'Common real uses: validation on write, logging/auditing access, computed/virtual properties, and reactive state tracking (knowing exactly which property changed).',
            'A `Proxy` is transparent to code using the wrapped object — callers interact with it exactly like the original object, unaware their operations are being intercepted.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Caller["code doing obj.name = 'x'"] --> Proxy["Proxy wrapping obj"]
    Proxy -->|"set trap intercepts it"| Handler["handler.set(target, 'name', 'x')"]
    Handler -->|"validate, log, react..."| Handler
    Handler -->|"Reflect.set(target, 'name', 'x')"| Target["the real underlying object"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'validating writes with a Proxy',
              code: `function createValidatedUser(initial) {
  return new Proxy(initial, {
    set(target, property, value) {
      if (property === 'age' && (typeof value !== 'number' || value < 0)) {
        throw new TypeError('age must be a non-negative number');
      }
      return Reflect.set(target, property, value); // forward to the real object
    },
    get(target, property) {
      console.log(\`read: \${String(property)}\`);
      return Reflect.get(target, property);
    },
  });
}

const user = createValidatedUser({ name: 'Ava', age: 30 });
user.age = 31;     // fine
user.age = -5;     // throws TypeError — invalid write blocked before it happens`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is essentially how Vue 3\'s reactivity system works under the hood: component state is wrapped in a `Proxy`, and the `get` trap records which properties a component read (to know what to watch), while the `set` trap triggers a re-render when one of those tracked properties changes.',
            },
            {
              type: 'heading',
              text: 'Things that make or break real Proxy code',
            },
            {
              type: 'code',
              language: 'js',
              title: 'always forward the receiver',
              code: `const target = {
  _first: 'Ava', _last: 'Lee',
  get fullName() { return \`\${this._first} \${this._last}\`; }, // getter uses 'this'
};

const tracked = new Proxy(target, {
  get(t, key, receiver) {
    track(key);
    // Passing 'receiver' makes the getter run with this === the proxy,
    // so the inner reads of _first/_last are ALSO tracked.
    return Reflect.get(t, key, receiver);
  },
});
// With t[key] instead, 'this' inside fullName would be the raw target and
// _first/_last reads would bypass the proxy — a classic missed-dependency bug.`,
            },
            {
              type: 'list',
              items: [
                '**Invariants**: traps cannot lie about non-configurable or non-extensible state — e.g. a `get` trap must return the real value for a non-writable, non-configurable property, or the engine throws `TypeError`.',
                '**Identity**: `proxy !== target`. Code that stores the raw object in a `Set`/`WeakMap` and later looks it up with the proxy (or vice versa) fails — reactive libraries keep a target-to-proxy `WeakMap` to return the same proxy every time.',
                '**Internal slots**: built-ins like `Map`, `Date`, and objects with `#private` fields keep data in internal slots that a proxy does not have, so `new Proxy(new Map(), {}).get(\'k\')` throws. You must bind methods to the target or wrap them.',
                '**Performance**: every intercepted operation is a function call that defeats inline caches; proxies are fine for state objects but avoid them in tight loops over large arrays.',
                '**`Proxy.revocable`** returns a proxy plus a `revoke()` function — useful for handing out capability-style access that you can later cut off.',
              ],
            },
          ],
        },
        {
          id: 'memory-management',
          title: 'Memory Management and Closures That Leak',
          summary:
            'JavaScript manages memory automatically via garbage collection based on reachability, but closures, forgotten timers, and detached DOM references are the classic ways application code accidentally keeps memory alive forever.',
          keyPoints: [
            'The garbage collector frees memory for objects that are no longer **reachable** from a "root" (global scope, the current call stack, or anything referenced by an already-reachable object) — not based on reference counting alone.',
            'A closure keeps the outer variables it captures alive for as long as the closure is reachable — and because engines like V8 store all captured variables of a scope in one shared context object, a variable captured by *any* sibling closure is retained too.',
            'Modern engines use a **generational, mostly concurrent/incremental** collector: short-lived objects die cheaply in the young generation; survivors are promoted and collected less often.',
            'The most common real-world leaks: an interval/listener that\'s never cleared, and a closure retaining a reference to a large or detached object.',
            '`WeakMap`/`WeakSet` hold **weak** references — an entry doesn\'t keep its key alive, letting the garbage collector reclaim it once nothing else references it, which is exactly right for caches keyed by objects.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'JavaScript engines use a **mark-and-sweep** garbage collector: periodically, the engine starts from a set of "roots" (global variables, the current call stack) and marks every object reachable by following references, then frees everything left unmarked. This means a memory leak in JS isn\'t really about "forgetting to free" anything — it\'s about **accidentally keeping a reference alive** to something you no longer need, which prevents it from ever becoming unreachable.',
            },
            {
              type: 'p',
              text: 'Real engines refine this considerably. V8 (Orinoco) splits the heap into a **young generation**, collected by a fast parallel *scavenger* that copies the few survivors and discards everything else, and an **old generation**, collected by a mark-compact collector whose marking runs concurrently on helper threads and incrementally between your tasks. This relies on the *generational hypothesis* — most objects die young — which is why allocating many short-lived objects is cheap, while objects that survive a couple of scavenges (then get promoted) are what make old-generation GC pauses longer. Cycles are no problem for a tracing collector: two objects referencing each other but unreachable from roots are collected together.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Root["Roots: global scope,<br/>current call stack"] --> A["object A (in use)"]
    A --> B["object B (in use)"]
    C["object C"] --> D["object D"]
    C -.->|"nothing references C anymore"| Root
    subgraph Unreachable["Unreachable — eligible for GC"]
      C
      D
    end`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a closure leak: forgetting to clear an interval',
              code: `function startPolling(largeDataset) {
  const id = setInterval(() => {
    // This closure references 'largeDataset', keeping the ENTIRE
    // dataset alive in memory for as long as the interval keeps running —
    // even if only a small piece of it is actually used below.
    console.log(largeDataset.length);
  }, 1000);

  return () => clearInterval(id); // caller MUST call this to stop the leak
}

const stopPolling = startPolling(hugeArray);
// ... if stopPolling() is never called, hugeArray can never be garbage collected`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'WeakMap for a leak-proof, object-keyed cache',
              code: `const cache = new WeakMap(); // vs. a regular Map, which would leak every key forever

function computeExpensive(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = /* expensive computation */ JSON.stringify(obj).length;
  cache.set(obj, result);
  return result;
}
// Once 'obj' has no other references anywhere in the app, it (and its
// cache entry) becomes eligible for garbage collection automatically —
// a regular Map would keep it alive forever just by being a cache key.`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'In frameworks, the single most common real leak is an event listener or subscription set up when a component mounts but never torn down when it unmounts — the listener\'s closure keeps referencing (and thus keeps alive) the entire component instance and everything it closed over, long after the component was removed from the page.',
            },
            {
              type: 'heading',
              text: 'Leak catalogue and the tools to find them',
            },
            {
              type: 'table',
              headers: ['Leak', 'What retains it', 'Fix'],
              rows: [
                ['Forgotten listener / subscription', 'The event target (often `window` or a global bus) holds the callback, which holds the component', 'Remove on teardown; register with `{ signal }` and abort once'],
                ['Detached DOM tree', 'A JS variable or cache still references a node removed from the document — keeping the whole subtree alive', 'Drop references on removal; prefer `WeakMap` for node metadata'],
                ['Unbounded cache / `Map`', 'A module-level `Map` that only ever grows', 'LRU eviction, size caps, or `WeakMap` when keyed by objects'],
                ['Closures in long-lived timers', '`setInterval` callback references large data', '`clearInterval`; capture only what you need'],
                ['Console logging objects', 'DevTools keeps logged objects alive while open', 'Avoid logging big objects in production builds'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'one AbortController tears down many listeners',
              code: `function mountWidget(el) {
  const controller = new AbortController();
  const { signal } = controller;
  window.addEventListener('resize', onResize, { signal });
  document.addEventListener('keydown', onKey, { signal });
  el.addEventListener('click', onClick, { signal });
  fetch('/api/widget', { signal }).then(render).catch(ignoreAbort);
  return () => controller.abort(); // removes all listeners AND cancels the fetch
}`,
            },
            {
              type: 'heading',
              text: '`WeakRef` and `FinalizationRegistry` (ES2021): use sparingly',
            },
            {
              type: 'p',
              text: 'A `WeakRef` lets you hold an object without keeping it alive (`ref.deref()` returns the object or `undefined` once collected), and a `FinalizationRegistry` lets you request a callback *some time after* an object is collected. Both expose GC timing, which the spec deliberately leaves unspecified: callbacks may run late, in batches, or never (e.g. if the page closes). Use them for optimizations such as caches of expensive-but-recreatable values — never for correctness-critical cleanup like closing files or releasing locks (use `using`/`try...finally` for that).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'To hunt a leak: take a heap snapshot in Chrome DevTools (Memory panel), perform the suspect action several times (open/close the dialog), take another snapshot, and use the **Comparison** view filtered by "Detached" or by constructor name. The **Retainers** pane shows the exact reference path from a GC root that is keeping the object alive. In Node, use `--inspect` with the same tooling or `node --heapsnapshot-signal`.',
            },
          ],
        },
        {
          id: 'web-apis-performance-patterns',
          title: 'Web APIs and Performance Patterns',
          summary:
            'A handful of browser APIs and coding patterns — debouncing, throttling, event delegation, and `requestAnimationFrame` — solve the most common real-world performance problems in interactive UIs.',
          keyPoints: [
            '**Debounce**: delay running a function until a burst of calls has stopped for a given interval — ideal for search-as-you-type.',
            '**Throttle**: guarantee a function runs at most once per interval no matter how often it\'s called — ideal for scroll/resize handlers.',
            '**Event delegation**: attach one listener to a parent element instead of one per child, relying on event bubbling — far cheaper for large or dynamic lists.',
            '`AbortController` cancels an in-flight `fetch` (or any abortable operation); `structuredClone()` deep-clones a value natively, without the JSON round-trip hack and its limitations.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'debounce vs throttle, implemented',
              code: `function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);                 // cancel any pending call
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Leading + trailing throttle: runs immediately, then at most once per interval,
// and ALWAYS delivers the final call (a leading-only throttle drops it, leaving
// e.g. a scroll indicator stuck at a stale position).
function throttle(fn, interval) {
  let lastRun = 0;
  let trailingId;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    const remaining = interval - (performance.now() - lastRun);
    if (remaining <= 0) {
      clearTimeout(trailingId);
      trailingId = undefined;
      lastRun = performance.now();
      fn(...lastArgs);
    } else if (trailingId === undefined) {
      trailingId = setTimeout(() => {
        trailingId = undefined;
        lastRun = performance.now();
        fn(...lastArgs);
      }, remaining);
    }
  };
}

const debouncedSearch = debounce(query => fetchResults(query), 300);
const throttledScroll = throttle(() => updateScrollIndicator(), 100);`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant User as Keystrokes
    participant Debounce as debounce(fn, 300ms)
    User->>Debounce: 'r'
    Debounce->>Debounce: start 300ms timer
    User->>Debounce: 're' (50ms later)
    Debounce->>Debounce: cancel old timer, start new one
    User->>Debounce: 'rea' (50ms later)
    Debounce->>Debounce: cancel old timer, start new one
    Note over User,Debounce: user pauses typing for 300ms
    Debounce->>Debounce: timer fires — fn('rea') runs ONCE`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'event delegation for a large, dynamic list',
              code: `// Instead of attaching a click listener to every <li> (expensive, and
// misses items added later), attach ONE listener to the parent <ul>.
document.querySelector('#todo-list').addEventListener('click', (e) => {
  const item = e.target.closest('li');
  if (!item) return; // click wasn't on/inside an <li>
  console.log('Toggled:', item.dataset.id);
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'AbortController for a cancellable fetch',
              code: `function search(query) {
  const controller = new AbortController();
  // Always encode user input placed in a URL
  const url = \`/api/search?q=\${encodeURIComponent(query)}\`;
  const promise = fetch(url, { signal: controller.signal });
  return { promise, cancel: () => controller.abort() };
}

let current = search('a');
current.cancel();          // aborts the in-flight request
current = search('ab');    // start the new one — no stale response can win the race`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For visual updates driven by scroll/animation, prefer `requestAnimationFrame` over throttling with a fixed millisecond interval — it schedules your callback right before the browser\'s next repaint, which both matches the display\'s actual refresh rate and automatically pauses when the tab is in the background.',
            },
            {
              type: 'heading',
              text: 'Observers beat polling and scroll handlers',
            },
            {
              type: 'table',
              headers: ['API', 'Replaces', 'Use for'],
              rows: [
                ['`IntersectionObserver`', 'Scroll listeners + `getBoundingClientRect()`', 'Lazy loading, infinite scroll, impression tracking'],
                ['`ResizeObserver`', '`window` resize + measuring elements', 'Container-driven layouts, charts that fit their box'],
                ['`MutationObserver`', 'Deprecated mutation events, polling the DOM', 'Reacting to third-party DOM changes'],
                ['`PerformanceObserver`', 'Manual timing code', 'Long tasks, long animation frames, LCP/INP field data'],
                ['`{ passive: true }` listeners', 'Default non-passive `touchstart`/`wheel` handlers', 'Telling the browser you will not `preventDefault()`, so scrolling never waits for JS'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'lazy-load images with IntersectionObserver',
              code: `const io = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    img.src = img.dataset.src;   // start the download only when near the viewport
    observer.unobserve(img);     // one-shot
  }
}, { rootMargin: '200px' });     // begin 200px before it scrolls into view

document.querySelectorAll('img[data-src]').forEach(img => io.observe(img));
// For plain images, native <img loading="lazy"> is simpler — use the observer
// when you need custom behavior (analytics, animations, infinite lists).`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Layout thrashing: interleaving DOM writes and layout reads in a loop (`el.style.width = ...` then `el.offsetHeight`) forces a synchronous layout on every iteration. Batch all reads first, then all writes — or do writes inside `requestAnimationFrame` — so the browser lays out once per frame.',
            },
          ],
        },
        {
          id: 'dates-and-temporal',
          title: 'Dates and Time: From `Date` to Temporal',
          summary:
            '`Date` is a mutable wrapper around a millisecond timestamp with a confusing, local-time-biased API; Temporal is its standardized replacement with immutable, explicit types for instants, wall-clock dates, and time zones.',
          keyPoints: [
            'A `Date` is just a UTC millisecond count since the epoch; "local time" is applied only when you read or format it, using the *host machine\'s* time zone.',
            '`Date` pitfalls: months are 0-based, objects are mutable, date-only ISO strings parse as UTC while date-time strings without an offset parse as local time.',
            'Temporal provides distinct types — `Temporal.Instant`, `ZonedDateTime`, `PlainDate`, `PlainTime`, `PlainDateTime`, `Duration` — so the type itself tells you whether a value is a moment or a calendar concept.',
            'Temporal reached TC39 Stage 4 (slated for the ES2027 edition); native support is shipping in some engines but is not yet Baseline — use a polyfill (`@js-temporal/polyfill` or `temporal-polyfill`) where needed.',
            'Use `Intl.DateTimeFormat` (or `toLocaleString`) for display, and ISO 8601 strings with an explicit offset or `Z` for storage and APIs.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Time bugs come from conflating three different things: an **instant** (an exact point on the global timeline, like a log timestamp), a **wall-clock time in a zone** (a meeting at 09:00 in Europe/Berlin, which shifts in UTC when daylight saving changes), and a **plain calendar value** (a birthday, which has no time zone at all). `Date` models only the first and then guesses the rest from the machine it runs on — which is why the same code renders different dates on a server in UTC and a laptop in California.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'classic Date traps',
              code: `new Date(2026, 0, 31);            // January 31 — months are 0-based
const d = new Date(2026, 0, 31);
d.setMonth(1);                     // "February 31" overflows to March 3 (2026 is not a leap year)

new Date('2026-03-10');            // midnight UTC  -> may display as March 9 in the Americas
new Date('2026-03-10T00:00');      // midnight LOCAL time — same-looking input, different instant

const start = new Date();
const copy = start;                // same mutable object!
copy.setHours(0);                  // also changes 'start'`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'the same tasks with Temporal',
              code: `// An exact moment — e.g. for logs and database timestamps
const now = Temporal.Now.instant();              // e.g. 2026-10-12T09:30:00.123456789Z (ns precision)

// A birthday: a calendar date, no time zone, no time
const birthday = Temporal.PlainDate.from('1990-03-10');
const nextMonth = birthday.add({ months: 1 });   // immutable: returns a new PlainDate
Temporal.PlainDate.from('2026-01-31').add({ months: 1 }); // 2026-02-28 (constrained, no overflow)

// A meeting in a specific zone — DST-aware arithmetic
const meeting = Temporal.ZonedDateTime.from('2026-03-28T09:00[Europe/Berlin]');
const nextWeek = meeting.add({ weeks: 1 });       // still 09:00 Berlin time, across the DST change
nextWeek.withTimeZone('America/New_York').toString();

// Differences and durations
const days = Temporal.PlainDate.from('2026-12-25')
  .since(Temporal.Now.plainDateISO(), { largestUnit: 'day' }).days;

// Interop with existing Date-based code
const instant = new Date().toTemporalInstant();
const legacy = new Date(instant.epochMilliseconds);`,
            },
            {
              type: 'table',
              headers: ['Type', 'Represents', 'Example use'],
              rows: [
                ['`Temporal.Instant`', 'Exact moment, no zone or calendar', 'Event timestamps, expiry times'],
                ['`Temporal.ZonedDateTime`', 'Moment + time zone + calendar', 'Scheduling, recurring meetings across DST'],
                ['`Temporal.PlainDate`', 'Calendar date only', 'Birthdays, holidays, due dates'],
                ['`Temporal.PlainTime`', 'Wall-clock time only', 'Store opening hours'],
                ['`Temporal.PlainDateTime`', 'Date + time, no zone', 'User input before a zone is known'],
                ['`Temporal.Duration`', 'An amount of time (years to nanoseconds)', 'Timeouts, "3 months from now"'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Store instants as UTC (ISO strings with `Z`, or epoch milliseconds) and store the user\'s IANA time zone name (`Intl.DateTimeFormat().resolvedOptions().timeZone`) separately when wall-clock intent matters. A UTC offset like `+02:00` is *not* a time zone — it does not know about future DST transitions.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'If you cannot use Temporal yet, small immutable libraries (date-fns, Luxon, Day.js) remain reasonable. Moment.js is in maintenance mode and its own maintainers recommend alternatives for new projects.',
            },
          ],
        },
        {
          id: 'workers-and-concurrency',
          title: 'Concurrency Beyond the Main Thread: Workers and Shared Memory',
          summary:
            'Async code is still single-threaded; for CPU-heavy work, JavaScript offers real parallelism through Web Workers (and Node.js `worker_threads`), communicating by message passing or, with care, through `SharedArrayBuffer` and `Atomics`.',
          keyPoints: [
            '`async`/`await` gives **concurrency** (interleaving while waiting on I/O), not **parallelism** — a 2-second CPU loop inside an async function still blocks the thread.',
            'A Worker is a separate agent with its own event loop, heap, and global scope (no DOM access); communication is via `postMessage`, which uses the structured clone algorithm.',
            '**Transferable** objects (`ArrayBuffer`, `MessagePort`, `ImageBitmap`, `OffscreenCanvas`) can be moved to a worker in O(1) instead of copied — the sender loses access.',
            '`SharedArrayBuffer` enables true shared memory with `Atomics` for synchronization, but browsers require the page to be **cross-origin isolated** (COOP + COEP headers) because of Spectre-class timing attacks.',
            'Workers have startup and messaging costs — use them for chunky work (parsing, image processing, compression, search indexing), not for tiny tasks.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Main["Main thread<br/>DOM, input, rendering"] -->|"postMessage (structured clone)"| W["Worker thread<br/>own heap and event loop"]
    W -->|"postMessage result"| Main
    Main -. "transfer ArrayBuffer (zero-copy move)" .-> W
    Main <-->|"SharedArrayBuffer + Atomics<br/>(cross-origin isolated only)"| W`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'offloading work to a module worker',
              code: `// main.js
const worker = new Worker(new URL('./hash-worker.js', import.meta.url), { type: 'module' });

function hashInWorker(buffer) {
  const { promise, resolve, reject } = Promise.withResolvers();
  const id = crypto.randomUUID();
  const onMessage = (e) => {
    if (e.data.id !== id) return;
    worker.removeEventListener('message', onMessage);
    e.data.error ? reject(new Error(e.data.error)) : resolve(e.data.hash);
  };
  worker.addEventListener('message', onMessage);
  worker.postMessage({ id, buffer }, [buffer]); // transfer: buffer is now detached here
  return promise;
}

// hash-worker.js
self.addEventListener('message', async (e) => {
  const { id, buffer } = e.data;
  try {
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    const hash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
    self.postMessage({ id, hash });
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
});`,
            },
            {
              type: 'table',
              headers: ['Option', 'Shares memory?', 'Typical use'],
              rows: [
                ['Dedicated `Worker`', 'No (messages)', 'CPU-heavy work for one page'],
                ['`SharedWorker`', 'No (messages, many tabs)', 'One connection/cache shared across same-origin tabs'],
                ['Service Worker', 'No', 'Network proxy: offline caching, push — not for computation'],
                ['Worklets (Audio, Paint)', 'No', 'Hooks into rendering/audio pipelines'],
                ['Node.js `worker_threads`', 'Optional (`SharedArrayBuffer`)', 'CPU work in servers without blocking the event loop'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Shared memory reintroduces data races that single-threaded JavaScript never had. Plain reads/writes on a `SharedArrayBuffer` can be torn or reordered; use `Atomics.load/store/add/compareExchange` for shared counters and `Atomics.wait`/`notify` (or `Atomics.waitAsync` on the main thread, where blocking `wait` is not allowed) for coordination. Prefer message passing unless profiling proves copying is the bottleneck.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Libraries like Comlink wrap `postMessage` in an RPC-style proxy so worker functions can be `await`ed like local ones. In Node.js servers, offload CPU-bound requests (image resizing, PDF generation, bcrypt) to a worker pool such as Piscina; a single 200 ms synchronous call blocks every other in-flight request on that process.',
            },
          ],
        },
      ],
    },
    {
      id: 'javascript-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'JavaScript interview questions covering the language from fundamentals to async control flow, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'Why does copying an object with `const copy = original` not actually create an independent copy, and what are the practical ways to fix that?',
              answer:
                'Objects (and arrays) are reference types — a variable holding an object doesn\'t hold the object\'s data directly, it holds a reference (pointer) to where that data lives in memory. `const copy = original` copies the *reference*, not the underlying data, so `copy` and `original` end up pointing at the exact same object; mutating one is indistinguishable from mutating the other. To get an actual independent copy: a shallow copy via spread (`{ ...original }` or `[...original]`) or `Object.assign({}, original)` copies one level deep (nested objects are still shared references); a true deep copy needs `structuredClone(original)` (native, handles most types including circular references) or, historically, the lossy `JSON.parse(JSON.stringify(original))` hack, which silently drops functions and `undefined`, turns `Date`s into strings and `Map`/`Set` into empty objects, converts `NaN`/`Infinity` to `null`, throws on `BigInt` and on circular references.',
            },
            {
              question: 'What is the temporal dead zone, and why does it exist for `let`/`const` but not `var`?',
              answer:
                'The temporal dead zone (TDZ) is the span between entering a scope (where `let`/`const` declarations are hoisted, i.e. registered) and the actual declaration line executing — accessing the variable anywhere in that span throws a `ReferenceError` instead of returning `undefined`. `var` has no TDZ: it\'s hoisted AND initialized to `undefined` immediately, so reading it early just silently gives `undefined`, masking bugs where code accidentally runs before the intended assignment. The TDZ was a deliberate design choice for `let`/`const` — it converts what would be a silent, confusing `undefined` (that only surfaces as a bug much later) into a loud, immediate error exactly at the point of the mistake, which is strictly more helpful for catching real "used before assigned" bugs during development.',
            },
            {
              question: 'Why is `Promise.all` sometimes the wrong choice compared to `Promise.allSettled`, with a concrete example?',
              answer:
                '`Promise.all` rejects as soon as any single promise in the collection rejects, discarding the results of every other promise even if they succeeded — appropriate when every result is required for the operation to make sense (e.g. all pieces of a page\'s initial data must load, or there\'s nothing coherent to render). If you\'re fetching independent pieces of optional data (e.g. a user\'s profile, their recent activity, and their notification count, each shown in a separate widget), using `Promise.all` means one failing endpoint (say, notifications) blanks out the entire page instead of just that one widget. `Promise.allSettled` lets you render every widget that succeeded and show an error state only for the one that failed, which is almost always the better user experience for independently-failable, independently-renderable pieces of a page.',
            },
            {
              question: 'In a debounced search implementation, why is clearing the timeout AND aborting the fetch both necessary — wouldn\'t just one of them be enough?',
              answer:
                'Clearing the timeout prevents a *not-yet-fired* debounced request from firing at all once a newer keystroke has superseded it — without this, every keystroke\'s timer would eventually fire and hit the API regardless of debouncing, defeating its purpose entirely. Aborting the fetch handles the separate case where a request has *already been sent* (its timer already fired) before a newer query arrives — clearing a timeout does nothing for a request that\'s already in flight; only `AbortController.abort()` actually cancels that outstanding network request (or at minimum stops its result from being used). Both bugs are real and independent: without clearing the timeout you get redundant requests; without aborting in-flight requests you get a race condition where a slower, stale response overwrites a faster, current one.',
            },
            {
              question: 'Explain the precedence order of `this` binding rules, and why arrow functions are described as having "no own `this`."',
              answer:
                'The rules apply in strict precedence, highest wins: `new` binding (constructor call — `this` is the new object) beats explicit binding (`call`/`apply`/`bind` — `this` is whatever was passed) beats implicit binding (a method call `obj.method()` — `this` is `obj`) beats default binding (a bare function call — `this` is `undefined` in strict mode). Arrow functions sit outside this system entirely: they don\'t have their own `this` binding at all, so none of the four rules apply to them — instead, when the engine encounters `this` inside an arrow function, it resolves it by looking at the *enclosing* (lexical) scope at the point the arrow function was defined, exactly like it would resolve any other free variable. This is why arrow functions can\'t be fixed with `.bind()` (there\'s no own `this` to rebind) and why they\'re the standard fix for `this`-loss when passing a class method as a callback — wrapping it in an arrow function captures the surrounding `this` permanently.',
            },
            {
              question: 'How is `class` inheritance in JavaScript actually implemented, given that JavaScript has no separate "class" construct at the engine level?',
              answer:
                '`class` is syntactic sugar over the same prototype-chain mechanism every JS object already uses. Every object has an internal `[[Prototype]]` link, and property/method lookup walks up that chain until it finds a match or reaches `null`. `class Dog extends Animal` compiles down to setting `Dog.prototype`\'s own `[[Prototype]]` to `Animal.prototype` — so an instance of `Dog` first checks its own properties, then `Dog.prototype` (where `Dog`\'s methods live), then `Animal.prototype` (where inherited methods live), then `Object.prototype`, then `null`. This is why methods defined in a class body are shared by every instance (they live once, on the prototype object) while fields assigned via `this.x = ...` in the constructor are per-instance — they\'re set directly on the new object, not on the shared prototype.',
            },
            {
              question: 'What does it mean that `NaN !== NaN`, and what is the correct way to check whether a value is `NaN`?',
              answer:
                '`NaN` (Not-a-Number) is the one value in JavaScript, per the IEEE 754 floating-point spec that JS numbers follow, that is defined to be unequal to itself under both `==` and `===` — this is standard floating-point semantics, not a JS-specific bug. Because of this, `value === NaN` can never be true for any value, including an actual `NaN`, making it useless as a check. The correct approaches are `Number.isNaN(value)` (returns `true` only for the actual `NaN` value, without any type coercion — preferred) or `Object.is(value, NaN)` (a general "same value" comparison that also correctly distinguishes `NaN` from every other value, including telling `+0` and `-0` apart, which even `===` cannot do).',
            },
            {
              question: 'What is the practical difference between `Object.freeze()` and `const` for creating immutable data?',
              answer:
                '`const` only prevents *reassigning the variable binding* — it says nothing about the value itself. `const arr = [1, 2, 3]; arr.push(4);` is completely legal because `arr` still refers to the same array object; only `arr = anotherArray` would be blocked. `Object.freeze(obj)` operates on the *value*, not the binding — it makes the object\'s own top-level properties non-writable and non-configurable, so `frozen.x = 5` silently fails (or throws in strict mode). Critically, `Object.freeze` is also shallow: freezing an object does not freeze any nested objects within it, so `frozen.nested.y = 5` still succeeds unless `nested` was frozen separately (or recursively, with a helper function).',
            },
            {
              question: 'Why can a `for...of` loop iterate over an array but not over a plain object, and how would you make a custom object iterable?',
              answer:
                '`for...of` works on any **iterable** — an object implementing the well-known `Symbol.iterator` method, which must return an iterator object with a `.next()` method that yields `{ value, done }` pairs. Arrays, strings, `Map`s, and `Set`s all implement this out of the box; a plain object literal (`{}`) does not, which is why `for...of` throws `TypeError: object is not iterable` on one, while `for...in` (which iterates enumerable *keys*, not values, and works differently) does not. To make a custom object iterable, you implement `[Symbol.iterator]()` yourself, either by hand-returning an iterator object with `.next()`, or far more simply, by writing it as a generator method (`*[Symbol.iterator]() { yield ...; }`), since generator objects already satisfy the iterator protocol automatically.',
            },
            {
              question: 'What is a real, non-toy use case for `Proxy`, and how does `Reflect` fit into it?',
              answer:
                'A concrete production use case is a reactive state system (this is essentially how Vue 3\'s reactivity works): wrapping a component\'s state object in a `Proxy` whose `get` trap records which properties were read during a render (building a list of dependencies) and whose `set` trap detects when one of those tracked properties changes and triggers a re-render — all without the component author writing any explicit subscription code. `Reflect` provides the default, spec-correct implementation of each trap operation as a plain function (`Reflect.get`, `Reflect.set`, etc.); traps use it to "forward" the operation to the real target after running their own custom logic (validation, logging, dependency tracking), rather than reimplementing property get/set semantics by hand, which is easy to get subtly wrong for edge cases like inherited properties or property descriptors.',
            },
            {
              question: 'A page keeps growing in memory usage the longer a single-page app runs, even though components appear to unmount correctly. What are the likely closure-related causes?',
              answer:
                'The most common cause is an event listener, `setInterval`/`setTimeout`, or subscription set up when a component mounts that is never explicitly torn down — its callback is a closure that keeps the entire component instance (and everything the callback\'s outer scope references) reachable from a long-lived root, like `window` or a global event bus, even after the component has been visually removed. Since JavaScript\'s garbage collector frees memory based on *reachability*, not on whether something "looks" gone from the UI, the component instance simply never becomes eligible for collection. The fix is always the same shape: whatever registers the listener/timer/subscription on mount must explicitly unregister it on unmount (`clearInterval`, `removeEventListener`, `unsubscribe()`) — a `WeakMap`/`WeakSet` can also help for caches keyed by objects, since they don\'t keep their keys alive by themselves.',
            },
            {
              question: 'Why does mapping over an array with `.map()` followed by `.filter()` sometimes get "optimized" by developers into a single `.reduce()` call, and is that actually a good idea?',
              answer:
                '`.map().filter()` (or `.filter().map()`) walks the array twice, allocating an intermediate array in between — for very large arrays or hot code paths, a single `.reduce()` call can do both the transform and the filter in one pass with no intermediate allocation, which is a genuine performance win in that specific scenario. In practice, though, this is a premature optimization for the vast majority of everyday code: `.map().filter()` is dramatically more readable and self-documenting than an equivalent `.reduce()`, and the performance difference is only measurable on arrays large enough, or in loops hot enough, that it would show up in profiling. The right default is to write the readable `.map()`/`.filter()` chain first, and only reach for a hand-fused `.reduce()` after profiling shows that specific code path actually matters. A modern middle ground is iterator helpers (ES2025): `arr.values().map(f).filter(g).toArray()` is lazy and single-pass with no intermediate array, while still reading like a chain. For the common "transform and drop some" case, `.flatMap(x => (keep(x) ? [f(x)] : []))` also fuses both steps.',
            },
            {
              question: 'Which recent ECMAScript features are actually standard now, and which are still proposals? How do you keep track?',
              answer:
                'Roughly: ES2022 brought class fields, `#private`, static blocks, top-level `await`, `.at()`, `Object.hasOwn`, and `Error` `cause`; ES2023 added `findLast` and the change-by-copy methods (`toSorted`, `toReversed`, `toSpliced`, `with`); ES2024 added `Object.groupBy`/`Map.groupBy`, `Promise.withResolvers`, the RegExp `v` flag, resizable `ArrayBuffer`, and well-formed-string helpers; ES2025 added iterator helpers, the new `Set` methods, `Promise.try`, import attributes with JSON modules, RegExp modifiers, duplicate named capture groups, and `Float16Array`; ES2026 includes `Array.fromAsync`, `Error.isError`, `Math.sumPrecise`, `RegExp.escape`, `Uint8Array` base64/hex conversion, and iterator sequencing (`Iterator.concat`). Temporal and explicit resource management (`using`) have reached Stage 4 and are slated for ES2027, but engine support is still uneven. Decorators remain a Stage 3 proposal (TypeScript and Babel implement them). The authoritative sources are the tc39/proposals repository (its finished-proposals list shows each feature\'s edition) and MDN\'s compatibility tables; "standardized" and "safe to ship untranspiled to all your users" are two separate questions — the second is answered by Baseline status and your browserslist targets.',
            },
            {
              question: 'An `async` function seems to "block" the UI even though it uses `await`. How can that happen?',
              answer:
                '`await` only yields when it waits on something that is genuinely pending — and even then it yields only to *microtasks* until the awaited promise settles via a task (network, timer). Two common causes: (1) CPU-bound synchronous code between awaits — a big `JSON.parse`, sorting 1M rows, or a regex with catastrophic backtracking runs to completion on the main thread regardless of being inside an async function; (2) awaiting already-resolved promises in a loop (`await Promise.resolve()`), which only queues microtasks, and the microtask queue is drained completely before rendering or input handling, so it does not yield at all. Fixes: chunk the work and yield with `scheduler.yield()` or `setTimeout(0)` (a real task boundary), move heavy computation to a Web Worker, or use a streaming/incremental algorithm. Measure with the Performance panel\'s long-task markers and the INP metric.',
            },
            {
              question: 'What exactly does `structuredClone` copy, and when would you still choose something else?',
              answer:
                '`structuredClone` implements the HTML structured clone algorithm — the same one used by `postMessage` and IndexedDB. It deep-copies plain objects, arrays, primitives (including BigInt), `Date`, `RegExp`, `Map`, `Set`, typed arrays and `ArrayBuffer`, `Blob`/`File`, `Error` types, and it preserves cycles and shared references within the graph. It does **not** copy functions or DOM nodes (it throws `DataCloneError`), it drops prototypes (a class instance comes back as a plain object, so methods and `instanceof` are lost), it ignores getters/setters and non-enumerable properties, and symbol-keyed properties are skipped. Choose something else when you need class instances preserved (write an explicit `clone()` method), when you only need a shallow copy (spread is far cheaper), or when you want structural sharing for immutable updates (spread at the changed path, or Immer). It can also move rather than copy buffers via the `transfer` option.',
            },
            {
              question: 'Explain how V8 makes property access fast, and what code patterns defeat it.',
              answer:
                'V8 assigns each object a hidden class ("map" or "shape") describing its property layout; objects created the same way share a shape, and properties are stored at fixed offsets. At each property-access site, an **inline cache** remembers the shapes it has seen and the offset to use. A site that sees one shape is monomorphic (fastest), 2–4 shapes is polymorphic, and beyond that it becomes megamorphic and falls back to a slower generic lookup. The optimizing compilers (Maglev, TurboFan) then speculate on the observed shapes and types and emit machine code with cheap checks; if a speculation fails, the function *deoptimizes* back to the interpreter (Ignition). Patterns that hurt: adding properties in different orders or conditionally after construction, `delete obj.prop` (often forces dictionary mode — assign `undefined` instead), mixing types in one array (e.g. integers then a float then a string changes the elements kind permanently), creating holes in arrays, changing prototypes at runtime, and functions that receive wildly different object shapes. The practical advice: initialize all fields in the constructor or class field declarations, keep shapes consistent, and profile before micro-optimizing.',
            },
            {
              question: 'What is the difference between concurrency and parallelism in JavaScript, and what tools exist for each?',
              answer:
                'Concurrency is making progress on multiple tasks by interleaving them; parallelism is literally executing them at the same time on multiple cores. A single JavaScript agent is concurrent but never parallel: while `fetch` waits, the browser\'s network stack (written in C++ on other threads) does the I/O, and your callbacks run one at a time on the event loop. Concurrency tools are promises, `async`/`await`, async iterators, and combinators like `Promise.all`. Parallelism requires additional agents: Web Workers, SharedWorkers, worklets, and Node.js `worker_threads` (or separate processes via `child_process`/cluster). Agents do not share heaps; they communicate via structured clone messages, transferables, or `SharedArrayBuffer` with `Atomics`. The trade-off: parallelism adds startup cost, serialization overhead, and — with shared memory — data races, so you only reach for it for CPU-bound work that measurably blocks the main thread or server event loop.',
            },
            {
              question: 'How do you cancel asynchronous work properly in modern JavaScript?',
              answer:
                'The standard primitive is `AbortController`/`AbortSignal`. You pass `signal` down to everything that supports it — `fetch`, `addEventListener` (removes the listener on abort), many Node.js APIs (`fs.promises.readFile`, `timers/promises`, streams), and your own functions, which should check `signal.aborted` or call `signal.throwIfAborted()` at safe points and listen for the `abort` event to stop work. `AbortSignal.timeout(ms)` creates a signal that aborts automatically (with a `TimeoutError` `DOMException`), and `AbortSignal.any([...])` combines signals so a user cancel or a deadline both work. Aborted operations reject with an error whose `name` is `AbortError` (or `TimeoutError`), which callers should usually treat as a non-error outcome rather than reporting it. Contrast with `Promise.race` against a timer, which only stops waiting while the underlying work keeps running — that is abandonment, not cancellation.',
            },
            {
              question: 'What are the security implications of common JavaScript patterns — what should a senior reviewer flag?',
              answer:
                'Key items: (1) **DOM XSS** — `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, and `eval`/`new Function`/string `setTimeout` with untrusted data; prefer `textContent`, DOM APIs, framework escaping, or a sanitizer like DOMPurify, and enforce with a Content Security Policy and Trusted Types. (2) **Prototype pollution** — deep merges or path-setters (`set(obj, \'a.b.c\', v)`) with user-controlled keys reaching `__proto__`/`constructor.prototype`; use `Map`, null-prototype objects, and key allowlists. (3) **Unsafe URLs** — assigning user input to `href`/`src`/`location` permits `javascript:` URLs; validate the scheme with `new URL()`. (4) **ReDoS** — regexes with nested quantifiers on user input can hang the single thread; Node servers are especially exposed. (5) **postMessage** — always check `event.origin` and pass a specific `targetOrigin`. (6) **Secrets** — anything shipped to the browser, including environment variables inlined by bundlers, is public. (7) **Supply chain** — lockfiles, minimal dependencies, and audit tooling, since a single compromised npm package runs with your app\'s full privileges.',
            },
            {
              question: 'Why do module-level singletons sometimes appear twice in an application, and how are ES modules cached?',
              answer:
                'An ES module is evaluated once per realm per **resolved URL** (module specifier after resolution), and that instance is shared by every importer — which is why module-level state behaves like a singleton. Duplicates happen when the same logical module resolves to two different URLs: two copies of a package at different versions in `node_modules` (common with React or a state library, causing "invalid hook call" or broken `instanceof` checks), the same file imported via different paths or symlinks, query strings (`./mod.js?v=2`), a dual-package where one consumer loads the CommonJS build and another the ESM build (the "dual package hazard"), or separate realms such as iframes, workers, and Node `vm` contexts. Diagnose with `npm ls <pkg>` and bundler analyzer output; fix with deduplication, `resolve.alias`/`dedupe` in the bundler, peer dependencies for libraries, or by keeping shared state outside the duplicated module.',
            },
            {
              question: 'When would you use `using` (explicit resource management) instead of `try/finally`, and what are its sharp edges?',
              answer:
                'Use `using`/`await using` whenever a value owns a resource whose lifetime should end with a block: database connections and transactions, file handles, locks, temporary directories, event subscriptions, or tracing spans. It removes nesting, guarantees reverse-order disposal, runs on every exit path including `return` and `throw`, and preserves both the original error and any disposal error through `SuppressedError`. Sharp edges: it disposes at block exit, so returning a `using`-bound resource hands back a disposed object (use `DisposableStack.move()` to transfer ownership); the value must implement `Symbol.dispose`/`Symbol.asyncDispose` (wrap legacy APIs with `DisposableStack.defer` or `adopt`); `await using` makes the block\'s exit asynchronous; and runtime support is still partial even though the proposal reached Stage 4, so you need TypeScript/Babel down-leveling plus a `Symbol.dispose` polyfill for older targets.',
            },
            {
              question: 'Why is `Date` considered broken, and how does Temporal fix the specific problems?',
              answer:
                '`Date` conflates an exact instant with local wall-clock interpretation, uses the *host\'s* time zone implicitly, is mutable (passing a `Date` to a function that calls `setHours` changes the caller\'s value), has 0-based months, silently overflows invalid dates (Feb 31 becomes March), has inconsistent string parsing (date-only ISO strings are UTC, date-time strings without offset are local), supports only millisecond precision, and has no notion of time zones other than local and UTC, nor of durations or non-Gregorian calendars. Temporal splits the concepts into distinct immutable types (`Instant`, `ZonedDateTime`, `PlainDate`, `PlainTime`, `PlainDateTime`, `PlainYearMonth`, `PlainMonthDay`, `Duration`), uses 1-based months, requires explicit IANA time zones for zoned values, performs DST-correct arithmetic, rejects or constrains invalid values by explicit option (`overflow: \'reject\'`), offers nanosecond precision, and supports calendars. The migration path is incremental: convert at boundaries with `date.toTemporalInstant()` and `new Date(instant.epochMilliseconds)`, using a polyfill until native support covers your targets.',
            },
            {
              question: 'What is the difference between `process.nextTick`, `queueMicrotask`, `setImmediate`, and `setTimeout(fn, 0)` in Node.js?',
              answer:
                'After each callback from the event loop, Node first drains the `process.nextTick` queue, then the Promise/`queueMicrotask` microtask queue (repeating until both are empty). `setTimeout(fn, 0)` is scheduled for the **timers** phase with a minimum delay of 1 ms; `setImmediate(fn)` runs in the **check** phase, immediately after the poll (I/O) phase. Consequences: `nextTick` runs before any promise callback, and a recursive `nextTick` (or recursive microtask) starves I/O completely; inside an I/O callback, `setImmediate` always runs before `setTimeout(fn, 0)`, while from the main module their relative order is non-deterministic. Guidance: prefer `queueMicrotask` for "run after the current operation but before anything else" (it is standard and cross-platform), use `setImmediate` to yield to I/O in long-running loops, and reserve `nextTick` for library code that must emit events after the caller has had a chance to attach listeners.',
            },
            {
              question: 'Private `#fields` vs closures vs `WeakMap` for encapsulation — what are the trade-offs?',
              answer:
                '`#private` fields are engine-enforced, fast (they are stored in fixed slots like normal fields and benefit from hidden classes), work with inheritance (subclass instances carry the base class\'s private slots), and allow access to the same private field on *other* instances of the class (useful for `equals(other)`). Their costs: they are invisible to `Proxy`-based reactivity (a method touching `this.#x` throws when `this` is a proxy), cannot be accessed from tests or debugging code outside the class (DevTools can show them), and cannot be added dynamically. Closures (factory functions) give perfect privacy without classes but create a new set of function objects per instance, increasing memory for many instances. A module-level `WeakMap` keyed by instance was the pre-ES2022 polyfill strategy: private data lives outside the object, is GC-friendly, and works with proxies if you key by the target, but lookups are slower and the code is noisier. Default to `#private` for class-based code; use closures for small functional modules.',
            },
          ],
        },
      ],
    },
  ],
}
