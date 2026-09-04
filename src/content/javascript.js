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
              text: 'A closure is a function bundled with references to its surrounding lexical scope, persisting after the outer function has returned. This is the mechanism behind private state (module pattern), memoization, and — notoriously — the classic loop-variable bug:',
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
          id: 'promises-async-await',
          title: 'Promises and Async/Await',
          summary:
            '`async`/`await` is syntactic sugar over Promises, and the choice between `Promise.all`, `allSettled`, and `race` — plus sequential versus concurrent `await`ing — is one of the most common real performance bugs in code review.',
          keyPoints: [
            'An `async` function always returns a Promise; `await` pauses execution of *that function*, not the whole program, until the awaited Promise settles.',
            '`Promise.all` runs concurrently and rejects as soon as any one rejects (fails fast) — use when you need every result.',
            '`Promise.allSettled` runs concurrently, never short-circuits, and returns the status of every promise — use when partial failure is acceptable.',
            '`Promise.race` resolves/rejects as soon as the first promise settles — used for timeout patterns.',
            '`await`ing one at a time inside a loop runs requests sequentially; mapping to promises first and `Promise.all`-ing them runs them concurrently.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`async`/`await` is syntactic sugar over Promises — an `async` function always returns a Promise, and `await` pauses execution of that function (not the whole program) until the awaited Promise settles.',
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
              type: 'callout',
              kind: 'pitfall',
              text: 'Writing `for (const id of ids) { await fetchThing(id); }` when the requests are actually independent is one of the most common real-world performance bugs — it turns N requests that could run in parallel into N sequential round trips.',
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
          summary: 'JavaScript interview questions on Promises and async control flow, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: "Why is `Promise.all` sometimes the wrong choice compared to `Promise.allSettled`, with a concrete example?",
              answer:
                "`Promise.all` rejects as soon as any single promise in the collection rejects, discarding the results of every other promise even if they succeeded — appropriate when every result is required for the operation to make sense (e.g. all pieces of a page's initial data must load, or there's nothing coherent to render). If you're fetching independent pieces of optional data (e.g. a user's profile, their recent activity, and their notification count, each shown in a separate widget), using `Promise.all` means one failing endpoint (say, notifications) blanks out the entire page instead of just that one widget. `Promise.allSettled` lets you render every widget that succeeded and show an error state only for the one that failed, which is almost always the better user experience for independently-failable, independently-renderable pieces of a page.",
            },
            {
              question: "In a debounced search implementation, why is clearing the timeout AND aborting the fetch both necessary — wouldn't just one of them be enough?",
              answer:
                "Clearing the timeout prevents a *not-yet-fired* debounced request from firing at all once a newer keystroke has superseded it — without this, every keystroke's timer would eventually fire and hit the API regardless of debouncing, defeating its purpose entirely. Aborting the fetch handles the separate case where a request has *already been sent* (its timer already fired) before a newer query arrives — clearing a timeout does nothing for a request that's already in flight; only `AbortController.abort()` actually cancels that outstanding network request (or at minimum stops its result from being used). Both bugs are real and independent: without clearing the timeout you get redundant requests; without aborting in-flight requests you get a race condition where a slower, stale response overwrites a faster, current one.",
            },
          ],
        },
      ],
    },
  ],
}
