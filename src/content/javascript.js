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
              ],
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
              text: '`array.sort()` mutates the original array **and** sorts as strings by default, so `[10, 2, 1].sort()` gives `[1, 10, 2]`, not numeric order. Pass a compare function (`.sort((a, b) => a - b)`) for numbers, and use `[...array].sort(...)` first if the original order must be preserved elsewhere.',
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
      .replace(/>/g, '&gt;');
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
              type: 'callout',
              kind: 'tip',
              text: 'Default to `===` everywhere; know the coercion rules well enough to explain *why* a `==` comparison in legacy code produces a surprising result, since that is exactly the kind of bug interviewers plant.',
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
              text: 'CommonJS (`require`/`module.exports`, still used throughout the Node.js ecosystem) resolves and executes modules dynamically at *runtime*, which is more flexible (e.g. `require()` inside an `if`) but prevents static tree-shaking. Modern bundlers and Node.js itself now support ES modules directly (`.mjs`, or `"type": "module"` in `package.json`) as the preferred format.',
            },
          ],
        },
        {
          id: 'event-loop',
          title: 'The Event Loop, Precisely',
          summary:
            'JavaScript runs on a single thread with one call stack, one microtask queue, and one macrotask queue — and the exact order those queues drain in explains almost every "why did that log in that order" surprise.',
          keyPoints: [
            'JS is single-threaded: one call stack, one microtask queue, one macrotask (task) queue.',
            'After each macrotask, the engine drains the *entire* microtask queue before running the next macrotask or letting the browser repaint.',
            'Promises (`.then`, `async`/`await` continuations) are microtasks; `setTimeout`, `setInterval`, and I/O callbacks are macrotasks.',
            'A microtask always runs before the next macrotask — even a `setTimeout(fn, 0)` — because the whole microtask queue is drained first.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'JavaScript is single-threaded with a **call stack**, a **microtask queue**, and a **macrotask (task) queue**. After each macrotask (e.g. a `setTimeout` callback, a UI event handler), the engine drains the **entire** microtask queue before running the next macrotask or repainting. Promises (`.then`, `async`/`await` continuations) are microtasks; `setTimeout`, `setInterval`, and I/O callbacks are macrotasks.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Stack[Call Stack] -->|empty| CheckMicro{Microtask queue empty?}
    CheckMicro -->|No| RunMicro[Run next microtask] --> CheckMicro
    CheckMicro -->|Yes| Render[Browser may render]
    Render --> CheckMacro[Take next macrotask<br/>setTimeout, event, I/O]
    CheckMacro --> Stack`,
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
              text: 'A `setTimeout(fn, 0)` does **not** mean "run immediately" — it means "run as the next macrotask, after the current script and the *entire* microtask queue have finished." A long chain of `.then()` calls can delay a `setTimeout(fn, 0)` indefinitely.',
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
            '`Promise.race` resolves/rejects as soon as the first promise settles — used for timeout patterns.',
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
const results = [];
for (const id of ids) {
  const result = await fetchThing(id);
  results.push(result);
}

// Concurrent: all requests start immediately, run in parallel (fast)
const results = await Promise.all(ids.map(id => fetchThing(id)));`,
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
          ],
        },
        {
          id: 'memory-management',
          title: 'Memory Management and Closures That Leak',
          summary:
            'JavaScript manages memory automatically via garbage collection based on reachability, but closures, forgotten timers, and detached DOM references are the classic ways application code accidentally keeps memory alive forever.',
          keyPoints: [
            'The garbage collector frees memory for objects that are no longer **reachable** from a "root" (global scope, the current call stack, or anything referenced by an already-reachable object) — not based on reference counting alone.',
            'A closure keeps its entire outer scope alive for as long as the closure itself is reachable, even if the closure only actually uses one variable from that scope.',
            'The most common real-world leaks: an interval/listener that\'s never cleared, and a closure retaining a reference to a large or detached object.',
            '`WeakMap`/`WeakSet` hold **weak** references — an entry doesn\'t keep its key alive, letting the garbage collector reclaim it once nothing else references it, which is exactly right for caches keyed by objects.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'JavaScript engines use a **mark-and-sweep** garbage collector: periodically, the engine starts from a set of "roots" (global variables, the current call stack) and marks every object reachable by following references, then frees everything left unmarked. This means a memory leak in JS isn\'t really about "forgetting to free" anything — it\'s about **accidentally keeping a reference alive** to something you no longer need, which prevents it from ever becoming unreachable.',
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

function throttle(fn, interval) {
  let lastRun = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastRun >= interval) {
      lastRun = now;
      fn(...args);
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
  const promise = fetch(\`/api/search?q=\${query}\`, { signal: controller.signal });
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
                'Objects (and arrays) are reference types — a variable holding an object doesn\'t hold the object\'s data directly, it holds a reference (pointer) to where that data lives in memory. `const copy = original` copies the *reference*, not the underlying data, so `copy` and `original` end up pointing at the exact same object; mutating one is indistinguishable from mutating the other. To get an actual independent copy: a shallow copy via spread (`{ ...original }` or `[...original]`) or `Object.assign({}, original)` copies one level deep (nested objects are still shared references); a true deep copy needs `structuredClone(original)` (native, handles most types including circular references) or, historically, the lossy `JSON.parse(JSON.stringify(original))` hack, which silently drops functions, `undefined`, and `Date`/`Map`/`Set` objects.',
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
                '`.map().filter()` (or `.filter().map()`) walks the array twice, allocating an intermediate array in between — for very large arrays or hot code paths, a single `.reduce()` call can do both the transform and the filter in one pass with no intermediate allocation, which is a genuine performance win in that specific scenario. In practice, though, this is a premature optimization for the vast majority of everyday code: `.map().filter()` is dramatically more readable and self-documenting than an equivalent `.reduce()`, and the performance difference is only measurable on arrays large enough, or in loops hot enough, that it would show up in profiling. The right default is to write the readable `.map()`/`.filter()` chain first, and only reach for a hand-fused `.reduce()` after profiling shows that specific code path actually matters.',
            },
          ],
        },
      ],
    },
  ],
}
