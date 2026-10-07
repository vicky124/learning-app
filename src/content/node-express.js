export const nodeExpressSection = {
  id: 'node-express',
  label: 'Node.js & Express',
  icon: '🟢',
  groups: [
    {
      id: 'node-express-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-nodejs',
          title: 'What Node.js Actually Is',
          summary:
            'Node.js is a runtime that lets JavaScript run outside the browser — it combines Google\'s V8 engine (which executes JavaScript) with libuv (which talks to the operating system for files, network, and timers) and runs your code on a single main thread.',
          keyPoints: [
            'Node.js is **not a language and not a framework** — it is a *runtime*: a program that reads your `.js` files and executes them, adding server-side abilities (files, sockets, processes) that browsers do not give you.',
            '**V8** is the engine that compiles and runs JavaScript; **libuv** is a C library that handles asynchronous I/O (disk, network, DNS, timers) and owns a small thread pool for work the OS cannot do asynchronously.',
            'Your JavaScript runs on **one thread**, but Node can still serve thousands of connections because waiting for I/O does not block that thread — the work is handed off and a callback runs later.',
            'Node is great at **I/O-bound** work (APIs, proxies, real-time apps, tooling) and a poor fit for long **CPU-bound** work (video encoding, huge number crunching) on the main thread.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Before Node existed (2009), JavaScript lived only inside web browsers. Node took the V8 engine out of Chrome, wrapped it in a program you can run from a terminal, and added the things a server needs: reading files, opening network sockets, spawning processes. The result is one language for both the front end and the back end, and a very large package ecosystem (npm) on top.',
            },
            {
              type: 'heading',
              text: 'The pieces inside Node',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Code["Your JavaScript code<br/>routes, business logic"]
    Core["Node core modules<br/>fs, http, crypto, stream, path"]
    V8["V8 engine<br/>compiles and runs JavaScript"]
    Libuv["libuv<br/>event loop and async I/O"]
    Pool["Thread pool<br/>4 threads by default"]
    OS["Operating system<br/>files, sockets, timers"]
    Code --> Core
    Core --> V8
    Core --> Libuv
    Libuv --> Pool
    Libuv --> OS
    Pool --> OS`,
            },
            {
              type: 'list',
              items: [
                '**V8** turns JavaScript into machine code. It knows nothing about files or networks — it only runs the language.',
                '**Core modules** (`fs`, `http`, `crypto`, ...) are the JavaScript API you call. Under the hood they call C++ bindings.',
                '**libuv** runs the **event loop** (the loop that decides what code runs next) and asks the operating system to tell it when a socket has data or a file has been read.',
                '**The thread pool** handles jobs that have no async OS support, such as some file-system calls, `crypto.pbkdf2`, and `zlib` compression, so they do not freeze your main thread.',
              ],
            },
            {
              type: 'heading',
              text: 'An analogy: one waiter, many tables',
            },
            {
              type: 'p',
              text: 'Imagine a restaurant with **one waiter** (the main thread) and a busy **kitchen** (the operating system and thread pool). The waiter takes an order, hands it to the kitchen, and immediately walks to the next table instead of standing there waiting for the food. When the kitchen rings a bell, the waiter delivers the dish. One waiter can serve a lot of tables because most of the time is spent *waiting*, not working. But if the waiter starts cooking a 20-minute dish personally (a heavy calculation), every other table waits. That is the single most important rule of Node: **never hog the main thread**.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'blocking vs non-blocking (same job, very different behaviour)',
              code: `import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

// BLOCKING: the whole process freezes until the file is read.
// While this runs, no other request can be handled.
const data1 = readFileSync('./big-report.csv', 'utf8');
console.log('sync read finished, length =', data1.length);

// NON-BLOCKING: the read is handed to libuv, and Node keeps running.
const promise = readFile('./big-report.csv', 'utf8');
console.log('this line prints BEFORE the file is read');
const data2 = await promise;
console.log('async read finished, length =', data2.length);`,
            },
            {
              type: 'table',
              headers: ['', 'JavaScript in the browser', 'JavaScript in Node.js'],
              rows: [
                ['Global object', '`window` / `document` (the page)', '`globalThis` / `process` (no page, no DOM)'],
                ['Can read files / open sockets', 'No (sandboxed)', 'Yes, via `fs`, `net`, `http`'],
                ['Modules', 'ES modules via `<script type="module">`', 'CommonJS and ES modules'],
                ['Main job', 'Update the UI, react to clicks', 'Serve requests, run scripts and tools'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: '"Node is single-threaded" is only half true. **Your JavaScript** runs on one thread, but the process also has libuv\'s thread pool, V8 helper threads (garbage collection), and you can start extra threads yourself with `worker_threads`. The point is that you do not write locks and shared-memory code for ordinary request handling.',
            },
          ],
        },
        {
          id: 'event-loop',
          title: 'The Event Loop, Phase by Phase',
          summary:
            'The event loop is the endless cycle that picks the next piece of finished work (a timer, a socket read, a callback) and runs it on the main thread — and knowing its phases explains why code runs in the order it does.',
          keyPoints: [
            'The loop runs in **phases**: timers, pending callbacks, poll (I/O), check (`setImmediate`), and close callbacks — each phase has its own queue of callbacks to run.',
            '**Microtasks** (promise `.then`/`await` continuations and `process.nextTick`) run *between* callbacks, always before the loop moves on — `nextTick` first, then promises.',
            '`setTimeout(fn, 0)` does not mean "now" — it means "after at least 0 ms, in the timers phase"; `setImmediate` means "right after the poll phase".',
            'If one callback runs for a long time (a huge loop, `JSON.parse` of a giant string, a sync `fs` call), **nothing else runs** — no requests, no timers — until it finishes.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'JavaScript runs one callback at a time, to completion. The **event loop** is the manager that decides *which* callback comes next. Think of it as a ring road with several stops. At each stop, the loop runs all the callbacks waiting there (up to a limit), then moves to the next stop. When it has gone around the full ring, it starts again — as long as there is still pending work, the process stays alive.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Start["Run main script once"] --> Timers
    Timers["1. Timers<br/>setTimeout and setInterval callbacks"] --> Pending
    Pending["2. Pending callbacks<br/>some deferred system errors"] --> Idle
    Idle["3. Idle and prepare<br/>internal use only"] --> Poll
    Poll["4. Poll<br/>wait for and run I/O callbacks"] --> Check
    Check["5. Check<br/>setImmediate callbacks"] --> Close
    Close["6. Close callbacks<br/>socket close events"] --> More{"Anything left to do?"}
    More -- "yes" --> Timers
    More -- "no" --> Exit["Process exits"]`,
            },
            {
              type: 'heading',
              text: 'Microtasks: the queue that jumps the line',
            },
            {
              type: 'p',
              text: 'Between every callback (and after the main script), Node empties two special queues before doing anything else: first the **`process.nextTick` queue**, then the **promise microtask queue** (the code after `await` and inside `.then()`). Because they are drained completely each time, an endless chain of `nextTick` calls can **starve** the loop — the timers and I/O phases never get their turn.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'predict the output order',
              code: `console.log('1. sync start');

setTimeout(() => console.log('timers phase: setTimeout 0'), 0);
setImmediate(() => console.log('check phase: setImmediate'));

Promise.resolve().then(() => console.log('4. promise microtask'));
process.nextTick(() => console.log('3. nextTick'));

console.log('2. sync end');

// Output:
// 1. sync start
// 2. sync end
// 3. nextTick                 <- nextTick queue first
// 4. promise microtask        <- then promise microtasks
// then, in either order:
//   timers phase: setTimeout 0
//   check phase: setImmediate
// (From the main script the order of the last two is not guaranteed.)`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'inside an I/O callback the order IS guaranteed',
              code: `import { readFile } from 'node:fs';

readFile(import.meta.filename, () => {
  // We are in the poll phase now. The next phase is "check",
  // so setImmediate always wins against a 0 ms timer here.
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
// Always prints: immediate, then timeout`,
            },
            {
              type: 'heading',
              text: 'What "blocking the event loop" looks like',
            },
            {
              type: 'code',
              language: 'js',
              title: 'a timer that is "late" because the loop was busy',
              code: `const start = Date.now();

setTimeout(() => {
  console.log('timer fired after', Date.now() - start, 'ms'); // about 3000, not 100
}, 100);

// BAD: a synchronous loop that hogs the only thread for ~3 seconds.
// While it runs, the 100 ms timer cannot fire and no HTTP request
// could be answered either.
while (Date.now() - start < 3000) {
  // busy work
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Timers are **minimum** delays, not promises. `setTimeout(fn, 100)` means "run `fn` no sooner than 100 ms from now, when the loop gets to it". A busy loop makes every timer, request, and callback late.',
            },
          ],
        },
        {
          id: 'modules-cjs-esm',
          title: 'Modules: CommonJS vs ES Modules',
          summary:
            'Node supports two module systems — the older CommonJS (`require`/`module.exports`) and the standard ES modules (`import`/`export`) — and which one a file uses depends on its extension and the nearest `package.json`.',
          keyPoints: [
            '**CommonJS (CJS)** loads synchronously with `require()` and exports with `module.exports`; **ES modules (ESM)** use `import`/`export`, load asynchronously, and support top-level `await`.',
            'A file is ESM if it ends in `.mjs`, or ends in `.js` and the nearest `package.json` has `"type": "module"`; it is CJS if it ends in `.cjs` or the type is `"commonjs"` (the default).',
            'In ESM there is no `__dirname`, `__filename`, or `require` — use `import.meta.dirname` / `import.meta.filename` (Node 20.11+) or `import.meta.url`.',
            'ESM imports of relative files **must include the extension** (`./utils.js`), and `import` statements are hoisted and static — you cannot put them inside an `if`; use `await import()` for dynamic loading.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A *module* is just a file that keeps its variables private and shares only what it chooses to export. Node started with CommonJS in 2009, before JavaScript had an official module system. In 2015 the language added ES modules, and Node now supports both. New projects should choose **ESM** — it is the standard, works the same in browsers, and is where the ecosystem is heading — but you will meet CommonJS in a lot of existing code.',
            },
            {
              type: 'table',
              headers: ['', 'CommonJS (CJS)', 'ES modules (ESM)'],
              rows: [
                ['Import', '`const fs = require(\'node:fs\')`', '`import fs from \'node:fs\'`'],
                ['Export', '`module.exports = { add }`', '`export function add() {}`'],
                ['Loading', 'Synchronous, at the point `require` runs', 'Static analysis first, then async loading'],
                ['Top-level `await`', 'Not allowed', 'Allowed'],
                ['`__dirname`', 'Available', 'Use `import.meta.dirname`'],
                ['Imports inside `if`', 'Yes (`require` is a normal function)', 'Use `await import()`'],
                ['File extension in path', 'Optional', 'Required for relative files'],
                ['Default in Node', 'Yes, unless told otherwise', 'Opt in via `.mjs` or `"type": "module"`'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    F["Node loads a file"] --> Ext{"File extension?"}
    Ext -- ".mjs" --> ESM["Treated as ES module"]
    Ext -- ".cjs" --> CJS["Treated as CommonJS"]
    Ext -- ".js" --> Pkg{"Nearest package.json<br/>has type module?"}
    Pkg -- "yes" --> ESM
    Pkg -- "no or missing" --> CJS`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'the same tiny module in both styles',
              code: `// ---------- CommonJS: math.cjs ----------
function add(a, b) { return a + b; }
module.exports = { add };

// consumer.cjs
const { add } = require('./math.cjs');
console.log(add(2, 3));

// ---------- ES module: math.mjs ----------
export function add(a, b) { return a + b; }
export default function subtract(a, b) { return a - b; }

// consumer.mjs
import subtract, { add } from './math.mjs';   // extension is required
console.log(add(2, 3), subtract(5, 1));`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'common ESM gotchas and their fixes',
              code: `import path from 'node:path';
import { createRequire } from 'node:module';

// 1. __dirname does not exist in ESM
// console.log(__dirname);                       // ReferenceError
const dir = import.meta.dirname;                 // Node 20.11+ / 21.2+
const file = path.join(dir, 'data', 'seed.json');

// 2. Need a CommonJS-only package or require() itself? Build one.
const require = createRequire(import.meta.url);
const legacy = require('some-old-cjs-package');

// 3. Conditional / lazy loading uses dynamic import (it returns a promise)
if (process.env.ENABLE_REPORTS === 'true') {
  const { buildReport } = await import('./reports.js');
  await buildReport();
}

// 4. Top-level await is allowed: no need to wrap startup in an async main()
const config = JSON.parse(await (await import('node:fs/promises')).readFile(file, 'utf8'));`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Mixing the two is the classic source of `ERR_REQUIRE_ESM` and "Cannot use import statement outside a module" errors. `import` of a CommonJS package works (you get its `module.exports` as the default import). `require()` of an ES module was blocked for years; recent Node versions (22.12+, and 20.19+) allow it for modules that do not use top-level `await`, but do not rely on it in libraries that must support older versions.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Use the `node:` prefix for built-in modules (`node:fs`, `node:path`). It makes it obvious the module is built in, and prevents a package named `fs` on npm from ever being loaded by mistake.',
            },
          ],
        },
        {
          id: 'npm-package-json',
          title: 'npm, package.json, Semver, and Lockfiles',
          summary:
            'npm is Node\'s package manager: `package.json` describes your project and its dependencies with version *ranges*, and the lockfile records the *exact* versions installed so every machine gets the same result.',
          keyPoints: [
            '`package.json` lists `dependencies` (needed at runtime), `devDependencies` (tools for building and testing), `scripts` (shortcuts like `npm test`), and metadata such as `"type"` and `"engines"`.',
            '**Semver** (semantic versioning) numbers are `MAJOR.MINOR.PATCH`: patch = bug fix, minor = new backwards-compatible feature, major = breaking change; `^1.4.2` allows minor and patch updates, `~1.4.2` allows only patch updates.',
            '`package-lock.json` pins the exact version of every package (including nested ones) — **commit it**, and use `npm ci` in CI/production for a clean, reproducible install.',
            'Every dependency is code you run with full privileges: audit regularly (`npm audit`), keep dependencies few and well-known, and never `npm install` random packages by name guess (typo-squatting is a real attack).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A package manager downloads other people\'s code (packages) and keeps your project\'s list of them. **npm** ships with Node; alternatives such as **pnpm** and **Yarn** use the same `package.json` format but store packages differently (pnpm saves disk space by sharing one copy across projects). Everything below applies to all of them.',
            },
            {
              type: 'code',
              language: 'json',
              title: 'a realistic package.json for an Express API',
              code: `{
  "name": "orders-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20.11" },
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch --env-file=.env src/server.js",
    "test": "node --test",
    "lint": "eslint ."
  },
  "dependencies": {
    "express": "^5.1.0",
    "zod": "^3.23.8",
    "pino": "^9.4.0"
  },
  "devDependencies": {
    "supertest": "^7.0.0",
    "eslint": "^9.12.0"
  }
}`,
            },
            {
              type: 'table',
              headers: ['Range in package.json', 'Meaning', 'Accepts 1.4.2 -> ?'],
              rows: [
                ['`1.4.2`', 'Exactly this version', 'Only 1.4.2'],
                ['`~1.4.2`', 'Patch updates only', '1.4.3, 1.4.9 (not 1.5.0)'],
                ['`^1.4.2`', 'Minor + patch updates (npm default)', '1.4.3, 1.9.0 (not 2.0.0)'],
                ['`*` or `latest`', 'Anything', 'Everything, including breaking changes — avoid'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    PJ["package.json<br/>version ranges"] --> Install{"npm install or npm ci?"}
    Lock["package-lock.json<br/>exact versions"] --> Install
    Install -- "npm install" --> Resolve["Resolve ranges, update lockfile if needed"]
    Install -- "npm ci" --> Exact["Install exactly what the lockfile says<br/>fail if they disagree"]
    Resolve --> NM["node_modules folder"]
    Exact --> NM`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'daily npm commands',
              code: `npm init -y                       # create package.json
npm install express               # add a runtime dependency
npm install -D supertest          # add a dev-only dependency
npm ci                            # clean install from lockfile (CI, Docker)
npm ci --omit=dev                 # production install: skip devDependencies

npm run dev                       # run a script from "scripts"
npm test                          # shortcut for "npm run test"
npx eslint .                      # run a locally installed tool without global install

npm outdated                      # what has newer versions?
npm audit                         # known vulnerabilities in your tree
npm ls express                    # why is express installed, and which version?`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do **not** commit `node_modules` (add it to `.gitignore`) and do **not** delete `package-lock.json` to "fix" a problem. Without the lockfile, two machines can silently install different versions and you get bugs that only appear in production.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Install scripts run arbitrary code on your machine. Prefer well-maintained packages, check weekly download counts and repository activity before adding one, and consider `npm ci --ignore-scripts` in build pipelines that do not need install scripts.',
            },
          ],
        },
        {
          id: 'core-modules',
          title: 'Core Modules: fs, path, os, url, crypto',
          summary:
            'Node ships a standard library for the things servers constantly do — read files, build paths, inspect the machine, parse URLs, and hash or encrypt data — so you rarely need a package for these.',
          keyPoints: [
            'Use the **promise** versions: `import fs from \'node:fs/promises\'` — the callback and `*Sync` versions exist but are older or block the event loop.',
            'Always build file paths with `path.join` / `path.resolve`, never string concatenation, and never trust a user-supplied path without checking it stays inside an allowed folder (path traversal).',
            'The WHATWG `URL` and `URLSearchParams` classes (globals in Node) parse URLs and query strings correctly — avoid hand-splitting strings.',
            '`crypto` provides secure random values (`randomUUID`, `randomBytes`), hashing (`createHash`), HMAC, and constant-time comparison (`timingSafeEqual`) — never use `Math.random()` for tokens or ids that must be unguessable.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'These are "core" modules: they are compiled into Node itself, need no `npm install`, and are always available through the `node:` prefix. Here are the four groups you will use in nearly every backend.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'fs/promises: read, write, list, and check files',
              code: `import fs from 'node:fs/promises';
import path from 'node:path';

const dataDir = path.join(import.meta.dirname, 'data');

// Create a folder (recursive: true means "no error if it already exists")
await fs.mkdir(dataDir, { recursive: true });

// Write and read JSON
const file = path.join(dataDir, 'users.json');
await fs.writeFile(file, JSON.stringify([{ id: 1, name: 'Asha' }], null, 2));
const users = JSON.parse(await fs.readFile(file, 'utf8'));

// List a folder
const entries = await fs.readdir(dataDir, { withFileTypes: true });
for (const e of entries) console.log(e.isDirectory() ? 'dir ' : 'file', e.name);

// "Does it exist?" - prefer trying the operation and handling the error
try {
  await fs.access(file);
} catch {
  console.log('file missing');
}`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'path: build paths safely (and block path traversal)',
              code: `import path from 'node:path';

// BAD: breaks on Windows (\\ vs /) and with stray slashes
const bad = __dirname + '/uploads/' + name;

// GOOD
const uploads = path.resolve('uploads');
const target = path.resolve(uploads, userSuppliedName);

// A malicious name like '../../etc/passwd' escapes the folder.
// After resolving, check the result is still inside the allowed folder:
if (!target.startsWith(uploads + path.sep)) {
  throw new Error('Invalid file name');
}

console.log(path.basename('/a/b/report.pdf'));   // report.pdf
console.log(path.extname('report.pdf'));         // .pdf
console.log(path.dirname('/a/b/report.pdf'));    // /a/b`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'os and url',
              code: `import os from 'node:os';

console.log(os.cpus().length);                // logical CPU count (used to size worker pools)
console.log(os.totalmem(), os.freemem());     // bytes
console.log(os.platform(), os.hostname());

// URL and URLSearchParams are globals
const u = new URL('https://shop.example.com/search?q=red+shoes&page=2#top');
console.log(u.hostname);                      // shop.example.com
console.log(u.pathname);                      // /search
console.log(u.searchParams.get('q'));         // red shoes
console.log(Number(u.searchParams.get('page')));  // 2

// Build a URL with safe encoding
const api = new URL('https://api.example.com/users');
api.searchParams.set('name', 'A&B Corp');     // encoded automatically
console.log(api.toString());                  // ...?name=A%26B+Corp`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'crypto: ids, hashes, HMAC, and safe comparison',
              code: `import { randomUUID, randomBytes, createHash, createHmac, timingSafeEqual } from 'node:crypto';

const id = randomUUID();                          // e.g. '3b241101-e2bb-4255-8caf-4136c566a962'
const token = randomBytes(32).toString('hex');    // 64 hex chars, unguessable

// A hash is a one-way fingerprint. Good for checksums, NOT for passwords.
const etag = createHash('sha256').update('hello').digest('hex');

// HMAC = a hash mixed with a secret key. Used to sign webhooks and cookies.
const signature = createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(rawBody)
  .digest();

// Compare secrets in constant time, so an attacker cannot learn how many
// leading characters were correct by measuring response time.
function isValid(received, expected) {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A fast hash like SHA-256 is the **wrong** tool for storing passwords, because attackers can try billions of guesses per second. Passwords need a deliberately slow algorithm (bcrypt, scrypt, argon2) — covered in the authentication topics.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Reading a whole file with `readFile` loads it all into memory. That is fine for a small config file but a problem for a 2 GB log. For large files use **streams** (`createReadStream`) — covered a few topics ahead.',
            },
          ],
        },
        {
          id: 'async-patterns',
          title: 'Callbacks, Promises, and async/await',
          summary:
            'Node does slow things (disk, network, database) asynchronously: first with callbacks, then promises, and now `async`/`await`, which lets you write asynchronous code that reads top to bottom like synchronous code.',
          keyPoints: [
            'A **callback** is a function you hand to Node to call when the work finishes; Node\'s convention is **error-first**: `callback(err, result)` — check `err` before using `result`.',
            'A **promise** is an object representing a future result (pending, fulfilled, or rejected); `async` functions always return a promise, and `await` pauses *that function* (not the whole process) until the promise settles.',
            'Independent tasks should run **in parallel** with `Promise.all` — awaiting them one after another in sequence is a very common performance bug.',
            '`Promise.allSettled` collects every outcome without failing fast; `Promise.race` and `AbortSignal.timeout` let you put a deadline on slow operations.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Why asynchronous at all? Reading a file or querying a database takes milliseconds to seconds. On a single thread, waiting synchronously would freeze every other user. So Node starts the work, continues, and runs your code **when the result arrives**. The *style* of "run my code when it arrives" evolved over three generations.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'generation 1: callbacks (and why they got painful)',
              code: `import { readFile } from 'node:fs';

readFile('user.json', 'utf8', (err, userText) => {
  if (err) return console.error('read user failed', err);
  const user = JSON.parse(userText);

  readFile('orders-' + user.id + '.json', 'utf8', (err2, ordersText) => {
    if (err2) return console.error('read orders failed', err2);

    readFile('prices.json', 'utf8', (err3, pricesText) => {
      if (err3) return console.error('read prices failed', err3);
      // "callback hell": every step nests deeper, errors are handled by hand each time
      console.log(JSON.parse(ordersText).length, JSON.parse(pricesText).currency);
    });
  });
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'generation 2 and 3: promises and async/await',
              code: `import fs from 'node:fs/promises';
import { promisify } from 'node:util';
import { randomBytes } from 'node:crypto';

// Old callback API -> promise API in one line
const randomBytesAsync = promisify(randomBytes);

async function loadDashboard() {
  const user = JSON.parse(await fs.readFile('user.json', 'utf8'));
  const orders = JSON.parse(await fs.readFile('orders-' + user.id + '.json', 'utf8'));
  return { user, orderCount: orders.length };
}

// Errors from any await land in one try/catch
try {
  const dashboard = await loadDashboard();
  console.log(dashboard);
} catch (err) {
  console.error('dashboard failed:', err.message);
}`,
            },
            {
              type: 'heading',
              text: 'Sequential vs parallel: the most common performance bug',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Seq["Sequential awaits: about 300 ms"]
      direction LR
      S1["getUser 100 ms"] --> S2["getOrders 100 ms"] --> S3["getOffers 100 ms"]
    end
    subgraph Par["Promise.all: about 100 ms"]
      direction TB
      P1["getUser 100 ms"]
      P2["getOrders 100 ms"]
      P3["getOffers 100 ms"]
    end`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'fix: start independent work together',
              code: `// SLOW: each await waits for the previous one even though they do not depend on each other
const user = await getUser(id);
const orders = await getOrders(id);
const offers = await getOffers(id);

// FAST: start all three, then wait for all of them
const [user2, orders2, offers2] = await Promise.all([
  getUser(id),
  getOrders(id),
  getOffers(id),
]);

// If one failure should not cancel the others, use allSettled
const results = await Promise.allSettled([getUser(id), getOrders(id), getOffers(id)]);
for (const r of results) {
  if (r.status === 'fulfilled') console.log('ok', r.value);
  else console.log('failed', r.reason.message);
}

// Put a deadline on a slow call (built-in, no library)
const res = await fetch('https://slow.example.com/data', {
  signal: AbortSignal.timeout(3000),   // rejects with TimeoutError after 3 s
});`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`array.forEach(async (x) => { await save(x); })` does **not** wait. `forEach` ignores the promises the callback returns, so the code after it runs immediately and failures become unhandled rejections. Use `for (const x of items) await save(x)` for one-at-a-time, or `await Promise.all(items.map(save))` for parallel.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`Promise.all` on 10,000 items starts 10,000 operations at once, which can overwhelm a database or an API rate limit. Process in batches, or use a small concurrency-limiting helper such as `p-limit`.',
            },
          ],
        },
        {
          id: 'async-error-handling',
          title: 'Error Handling in Async Code',
          summary:
            'Good Node error handling separates *operational* errors (expected failures like a missing file or a timed-out API call) from *programmer* errors (bugs), handles the first kind gracefully, and lets the second crash loudly so a supervisor can restart a clean process.',
          keyPoints: [
            '`try/catch` works with `await`; a promise rejection that nobody handles becomes an **unhandled rejection**, which crashes modern Node (since v15) — that is on purpose.',
            '**Operational errors** (ENOENT, ECONNREFUSED, validation failure, timeout) are expected and should be handled; **programmer errors** (calling `undefined.foo`) mean the process state is unknown — log and restart.',
            'Create **custom error classes** (with a `statusCode`, `code`, and `cause`) so callers can tell errors apart with `instanceof` instead of parsing message strings.',
            'Never swallow errors with an empty `catch {}`; either handle, add context and rethrow (`new Error(\'...\', { cause: err })`), or let it propagate.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A server must keep serving other users when one request fails, and it must also never keep running in a corrupted state. The trick is to treat two kinds of failure differently.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Err["Something threw an error"] --> Kind{"Operational or programmer error?"}
    Kind -- "Operational: expected failure" --> Handle["Handle it<br/>retry, return 4xx or 5xx, show message"]
    Kind -- "Programmer: a bug" --> Crash["Log it fully, then crash<br/>process manager restarts a clean process"]
    Handle --> Continue["Server keeps serving other users"]
    Crash --> Fresh["Fresh process, known-good state"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'custom errors and adding context with cause',
              code: `import fs from 'node:fs/promises';

export class AppError extends Error {
  constructor(message, { statusCode = 500, code = 'INTERNAL', cause } = {}) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(what) {
    super(what + ' not found', { statusCode: 404, code: 'NOT_FOUND' });
  }
}

async function loadConfig(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') throw new NotFoundError('config file ' + file);
    // Keep the original error attached so logs show the whole story
    throw new AppError('Could not load config', { cause: err });
  }
}`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'the last safety net (log and exit, do not "carry on")',
              code: `process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  // Modern Node would crash anyway; this is for logging flush + clean exit.
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // After an uncaught exception the app may be half-broken.
  // Exit and let PM2 / Docker / Kubernetes start a fresh one.
  process.exit(1);
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'common mistakes',
              code: `// MISTAKE 1: forgetting await - the rejection escapes the try/catch
try {
  saveUser(user);          // returns a promise; nobody waits for it
} catch (e) {
  // never runs for async failures
}

// FIX
try {
  await saveUser(user);
} catch (e) {
  // runs
}

// MISTAKE 2: try/catch around a callback-style API
try {
  setTimeout(() => { throw new Error('late'); }, 10);
} catch (e) {
  // never runs - the error is thrown later, outside this stack
}

// MISTAKE 3: swallowing the error
try { await sendEmail(); } catch {}      // silent failure, impossible to debug

// BETTER: decide what failure means
try {
  await sendEmail();
} catch (err) {
  logger.warn({ err }, 'email failed, will retry from the queue');
  await retryQueue.add('email', payload);
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`process.on(\'uncaughtException\')` is **not** a way to keep running. It exists to log the error and shut down cleanly. A process that continues after an unknown exception may hold locks, half-written data, or leaked connections.',
            },
          ],
        },
        {
          id: 'event-emitter',
          title: 'EventEmitter: Node\'s Publish/Subscribe Core',
          summary:
            'An `EventEmitter` lets one part of your program announce "something happened" and any number of other parts react to it — it is the foundation under streams, HTTP servers, and sockets in Node.',
          keyPoints: [
            'Create or extend `EventEmitter`; subscribe with `.on(name, handler)` (or `.once`) and announce with `.emit(name, ...args)` — handlers run **synchronously**, in the order they were added.',
            'Emitting the special event name **`error`** with no listener throws and can crash the process — always attach an `error` listener on emitters that can fail (sockets, streams).',
            'Listeners that are added but never removed are a classic **memory leak**; Node warns after 10 listeners on one event (`MaxListenersExceededWarning`).',
            'Many Node objects are emitters: `http.Server` emits `request`, streams emit `data`/`end`, and `process` emits `exit` and `SIGTERM`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Think of a radio station and its listeners. The station (the emitter) broadcasts on a named channel (the event name); anyone tuned to that channel (a listener) hears it. The station does not know or care how many people are listening. This is the **publish/subscribe** pattern, and it keeps unrelated pieces of code decoupled: the code that creates an order does not need to know that emails, analytics, and inventory all react to it.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Svc as OrderService
    participant Bus as EventEmitter
    participant Mail as EmailListener
    participant Stock as InventoryListener
    Mail->>Bus: on order.created
    Stock->>Bus: on order.created
    Svc->>Bus: emit order.created with order
    Bus->>Mail: handler runs with order
    Bus->>Stock: handler runs with order`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a complete, runnable EventEmitter example',
              code: `import { EventEmitter } from 'node:events';

class OrderService extends EventEmitter {
  create(items) {
    const order = { id: Date.now(), items };
    // ... save to database ...
    this.emit('order.created', order);     // announce; do not care who listens
    return order;
  }
}

const orders = new OrderService();

orders.on('order.created', (o) => console.log('email: confirmation for order', o.id));
orders.on('order.created', (o) => console.log('stock: reserve', o.items.length, 'items'));
orders.once('order.created', () => console.log('first order of the day!'));   // runs once only

orders.create(['pen', 'notebook']);
orders.create(['stapler']);`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'the "error" event and listener leaks',
              code: `import { EventEmitter } from 'node:events';
import { once } from 'node:events';

const emitter = new EventEmitter();

// BAD: emitting 'error' with no listener THROWS and can crash the process
// emitter.emit('error', new Error('boom'));

// GOOD: always listen for 'error' on things that can fail
emitter.on('error', (err) => console.error('handled:', err.message));
emitter.emit('error', new Error('boom'));

// LEAK: this adds a new listener on every call and never removes it
function badSubscribe(bus) {
  bus.on('tick', () => console.log('tick'));   // called 1000 times = 1000 listeners
}

// FIX: remove listeners when done, or use once()
function goodSubscribe(bus) {
  const handler = () => console.log('tick');
  bus.on('tick', handler);
  return () => bus.off('tick', handler);       // return an unsubscribe function
}

// Promise style: wait for a single event
setTimeout(() => emitter.emit('ready', 42), 100);
const [value] = await once(emitter, 'ready');
console.log('ready with', value);`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Listeners run **synchronously inside `emit`**. If a handler throws, the exception goes back to the code that called `emit`, and the remaining listeners do not run. If a handler does slow work, it blocks the emitter. For real background work use a queue (covered later), not an in-process emitter.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'An in-process `EventEmitter` only works inside **one** Node process. If you run several servers, an event emitted on one server is never heard by the other — you need a shared message broker such as Redis pub/sub for that.',
            },
          ],
        },
        {
          id: 'buffers-streams',
          title: 'Buffers and Streams (Backpressure Explained)',
          summary:
            'A Buffer is a chunk of raw bytes, and a stream moves data in small chunks instead of loading everything into memory — which is how Node copies, compresses, and serves gigabytes of data using only a few megabytes of RAM.',
          keyPoints: [
            'A **Buffer** is a fixed-size block of bytes (for binary data like files, images, network packets); you convert it to and from text with an *encoding* such as `utf8`, `hex`, or `base64`.',
            'A **stream** processes data piece by piece: *Readable* (a source), *Writable* (a destination), *Duplex* (both, like a socket), and *Transform* (changes data on the way through, like gzip).',
            '**Backpressure** is the stream\'s way of saying "slow down, I cannot take more right now" — without it a fast reader floods a slow writer and memory usage explodes.',
            'Use `pipeline()` from `node:stream/promises` to connect streams: it handles backpressure, cleans up on errors, and avoids leaks that plain `.pipe()` can cause.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine moving water from a lake to a village. You could scoop **the entire lake** into one giant tank and then pour it out (that is `readFile` — everything in memory), or you can lay a **pipe** and let water flow continuously (a stream). A pipe needs almost no storage and the first drop arrives immediately. With a 3 GB file, the first approach crashes with an out-of-memory error; the second just works.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'Buffers: bytes and encodings',
              code: `const buf = Buffer.from('héllo', 'utf8');

console.log(buf);                    // <Buffer 68 c3 a9 6c 6c 6f>  (6 bytes for 5 characters!)
console.log(buf.length);             // 6  (bytes, not characters)
console.log(buf.toString('hex'));    // 68c3a96c6c6f
console.log(buf.toString('base64')); // aMOpbGxv

// Binary data from an upload or a network call
const png = Buffer.alloc(8);         // 8 zero bytes
png.writeUInt32BE(0x89504e47, 0);    // write a number at a byte offset

// Combine chunks that arrived separately
const joined = Buffer.concat([Buffer.from('abc'), Buffer.from('def')]);
console.log(joined.toString());      // abcdef`,
            },
            {
              type: 'heading',
              text: 'Backpressure: what actually happens',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant R as Readable file
    participant W as Writable network socket
    R->>W: write chunk 1
    W-->>R: buffer has room, keep going
    R->>W: write chunk 2
    W-->>R: buffer is FULL, write returns false
    Note over R: reader pauses, memory stays flat
    W-->>R: drain event, buffer emptied
    Note over R: reader resumes
    R->>W: write chunk 3`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a stream pipeline: read, gzip, write (constant memory)',
              code: `import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

try {
  await pipeline(
    createReadStream('huge-access.log'),      // Readable: source
    createGzip(),                              // Transform: compress each chunk
    createWriteStream('huge-access.log.gz'),  // Writable: destination
  );
  console.log('done');
} catch (err) {
  // pipeline destroys ALL the streams for you if any step fails
  console.error('pipeline failed', err);
}`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a custom Transform stream: uppercase every line',
              code: `import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

const shout = new Transform({
  transform(chunk, encoding, callback) {
    // chunk is a Buffer; do work on it and pass the result along
    callback(null, chunk.toString().toUpperCase());
  },
});

await pipeline(createReadStream('notes.txt'), shout, createWriteStream('NOTES.txt'));

// Streams are also async iterable - handy for line-by-line processing
import readline from 'node:readline';
const rl = readline.createInterface({ input: createReadStream('big.csv') });
let rows = 0;
for await (const line of rl) rows++;     // never holds the whole file
console.log('rows:', rows);`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'serving a large file from Express without loading it into memory',
              code: `import express from 'express';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const app = express();

// BAD: reads the whole file into RAM per request. 100 users x 500 MB = trouble.
app.get('/bad/:name', async (req, res) => {
  const data = await fs.readFile('./videos/' + req.params.name);
  res.send(data);
});

// GOOD: stream it. Memory use stays small no matter the file size.
app.get('/video', async (req, res, next) => {
  try {
    res.setHeader('Content-Type', 'video/mp4');
    await pipeline(createReadStream('./videos/intro.mp4'), res);   // res is a Writable stream
  } catch (err) {
    next(err);
  }
});`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Ignoring the return value of `writable.write()` is how memory leaks start: when it returns `false`, the internal buffer is full and you must wait for the `drain` event. `pipeline()` and `for await` do this for you — prefer them over hand-written `.on(\'data\')` loops.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'In Node you can also use the web-standard streams (`ReadableStream`) that `fetch` returns, and convert with `Readable.fromWeb()` / `Readable.toWeb()`.',
            },
          ],
        },
        {
          id: 'raw-http-server',
          title: 'A Raw http Server (What Express Wraps)',
          summary:
            'Node\'s built-in `http` module can already run a web server in a dozen lines — seeing it without a framework shows exactly what Express is simplifying: routing, body parsing, and response helpers.',
          keyPoints: [
            '`http.createServer(handler)` calls `handler(req, res)` once per request; `req` is a *readable stream* (the incoming request) and `res` is a *writable stream* (the response you build).',
            'You must set the status code and headers, then call `res.end()` — forgetting `end()` leaves the client hanging until it times out.',
            'There is no routing, no JSON body parsing, and no query-string handling built in — you do it by hand with `req.method`, `req.url`, and by collecting body chunks.',
            'HTTP is just text over TCP: a request line, headers, a blank line, and an optional body; `http` parses that text into objects for you.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A web server does one job: wait for a request, run some code, send back a response. The `http` module gives you the server socket and parses the raw text of each request. Below is a tiny API with two routes and a JSON body — written with **no framework**.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant C as Client browser
    participant S as Node http server
    participant H as Your handler
    C->>S: GET /users/7 HTTP/1.1 plus headers
    S->>S: parse request text into req object
    S->>H: handler with req and res
    H->>H: pick route, run logic
    H-->>S: res.writeHead 200 and res.end with JSON
    S-->>C: HTTP/1.1 200 OK plus body`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a complete API with the bare http module',
              code: `import http from 'node:http';

const users = [{ id: 1, name: 'Asha' }, { id: 2, name: 'Ravi' }];

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Collect the request body (it arrives in chunks, because req is a stream)
async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString() || '{}');
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://' + req.headers.host);

    if (req.method === 'GET' && url.pathname === '/users') {
      return sendJson(res, 200, users);
    }

    // manual "route parameter" parsing: /users/7
    const match = url.pathname.match(/^\\/users\\/(\\d+)$/);
    if (req.method === 'GET' && match) {
      const user = users.find((u) => u.id === Number(match[1]));
      return user ? sendJson(res, 200, user) : sendJson(res, 404, { error: 'Not found' });
    }

    if (req.method === 'POST' && url.pathname === '/users') {
      const body = await readJson(req);
      const user = { id: users.length + 1, name: body.name };
      users.push(user);
      return sendJson(res, 201, user);
    }

    sendJson(res, 404, { error: 'No such route' });
  } catch (err) {
    sendJson(res, 500, { error: 'Server error' });
  }
});

server.listen(3000, () => console.log('http://localhost:3000'));`,
            },
            {
              type: 'p',
              text: 'That works, but look at how much plumbing there is: URL parsing, regex routes, body collection, JSON headers, a hand-written 404, and a try/catch around everything. Every real project would repeat this plumbing. **Express exists to remove exactly that repetition** — here is the same app in Express:',
            },
            {
              type: 'code',
              language: 'js',
              title: 'the same API in Express',
              code: `import express from 'express';

const users = [{ id: 1, name: 'Asha' }, { id: 2, name: 'Ravi' }];
const app = express();
app.use(express.json());                      // body parsing: one line

app.get('/users', (req, res) => res.json(users));

app.get('/users/:id', (req, res) => {         // route params: built in
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

app.post('/users', (req, res) => {
  const user = { id: users.length + 1, name: req.body.name };
  users.push(user);
  res.status(201).json(user);
});

app.listen(3000);`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Express is a thin layer over this exact `http.createServer` call — `app` is simply a function with the signature `(req, res)`. That is why you can pass an Express app to `http.createServer(app)` or hand it to libraries like Socket.IO and test tools.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'In the raw version, one forgotten `return` after `sendJson` makes the code fall through and try to send **a second response** ("Cannot set headers after they are sent"). The same mistake exists in Express — always `return res.json(...)` when you have more code below.',
            },
          ],
        },
        {
          id: 'express-basics-routing',
          title: 'Express Basics and Routing',
          summary:
            'Express is a small, unopinionated web framework: you create an `app`, attach **routes** (a method + a path + a handler function), and call `listen`. Routes are matched top to bottom and the first one that sends a response wins.',
          keyPoints: [
            'Start with `npm install express`, then `const app = express()`; routes look like `app.get(\'/path\', (req, res) => { ... })` and exist for every HTTP method (`get`, `post`, `put`, `patch`, `delete`).',
            '**Route parameters** (`/users/:id` -> `req.params.id`) identify a resource; the **query string** (`/users?page=2` -> `req.query.page`) filters or modifies the request; both always arrive as *strings*.',
            'Routes and middleware run in the **order they are declared**: put specific routes before general ones, and a catch-all 404 handler last.',
            '`app.route(\'/books\')` and `express.Router()` group related handlers so you do not repeat path prefixes.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Express was released in 2010 and is still the most widely used Node web framework. Its philosophy is "minimal core, everything else is a plug-in" — it gives you routing and middleware, and you choose the rest (database, validation, auth). Below is a complete runnable app; save it as `app.js` and run `node app.js`.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'a minimal, complete Express app (ESM, Express 5)',
              code: `// npm init -y && npm pkg set type=module && npm install express
import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());   // parse JSON request bodies into req.body

app.get('/', (req, res) => {
  res.send('Hello from Express');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log('Listening on http://localhost:' + PORT);
});`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Client["Client sends GET /users/7"] --> App["Express app"]
    App --> R1{"Match GET /users ?"}
    R1 -- "no" --> R2{"Match GET /users/:id ?"}
    R2 -- "yes, id is 7" --> H["Handler runs<br/>res.json sends response"]
    R2 -- "no" --> NF["404 handler"]
    H --> Client`,
            },
            {
              type: 'heading',
              text: 'The four ways data arrives in a request',
            },
            {
              type: 'table',
              headers: ['Where', 'Example URL / request', 'How to read it', 'Typical use'],
              rows: [
                ['Route params', '`GET /users/42`', '`req.params.id` -> `\'42\'`', 'Identify one resource'],
                ['Query string', '`GET /users?role=admin&page=2`', '`req.query.role`, `req.query.page`', 'Filter, sort, paginate'],
                ['JSON body', '`POST /users` with `{"name":"Asha"}`', '`req.body.name` (needs `express.json()`)', 'Create or update data'],
                ['Headers', '`Authorization: Bearer abc`', '`req.get(\'Authorization\')`', 'Auth, content type, tracing ids'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'routing in practice',
              code: `const books = [
  { id: 1, title: 'Dune', author: 'Herbert' },
  { id: 2, title: 'Emma', author: 'Austen' },
];

// LIST with optional filter:  GET /books?author=Austen
app.get('/books', (req, res) => {
  const { author } = req.query;
  res.json(author ? books.filter((b) => b.author === author) : books);
});

// ONE item:  GET /books/2
app.get('/books/:id', (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));   // params are strings!
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// CREATE:  POST /books   body: { "title": "...", "author": "..." }
app.post('/books', (req, res) => {
  const book = { id: books.length + 1, ...req.body };
  books.push(book);
  res.status(201).location('/books/' + book.id).json(book);
});

// Group several methods on the same path
app.route('/books/:id')
  .put((req, res) => res.json({ replaced: req.params.id }))
  .delete((req, res) => res.status(204).end());

// Catch-all 404 MUST be last: it matches anything that nothing above handled
app.use((req, res) => {
  res.status(404).json({ error: 'No route for ' + req.method + ' ' + req.originalUrl });
});`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Route order matters. `app.get(\'/users/:id\', ...)` declared **before** `app.get(\'/users/me\', ...)` will treat the word `me` as an id and the second route never runs. Declare fixed paths (`/users/me`) before parameterized ones (`/users/:id`).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Convert and check params immediately: `const id = Number(req.params.id); if (!Number.isInteger(id)) return res.status(400).json({ error: \'id must be a number\' });`. Later you will let a validation library do this for you.',
            },
          ],
        },
        {
          id: 'middleware',
          title: 'Middleware: the Heart of Express',
          summary:
            'Middleware is a function with access to `req`, `res`, and a `next` function; every request flows through a chain of them in the order they were registered, and each one either ends the response or calls `next()` to pass it along.',
          keyPoints: [
            'Signature: `(req, res, next) => { ... }`. A middleware can **modify** `req`/`res`, **end** the request by sending a response, or **pass** control forward with `next()`.',
            '**Order is everything**: `app.use(express.json())` must come before the routes that read `req.body`, and the error handler must come last.',
            '`next()` continues to the next matching middleware; `next(err)` skips straight to the error-handling middleware (the one with **four** arguments).',
            'Forgetting to call `next()` *and* forgetting to send a response makes the request hang forever — the browser spins until it times out.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Picture an airport security line: your bag goes through passport check, then the scanner, then the gate agent. Each station can **let you pass** to the next station or **stop you** and send you away. Express middleware works exactly like that — a request travels through a pipeline of small functions, each doing one job (log it, parse JSON, check login, ...), until one of them responds.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Req["Incoming request"] --> M1["1. logger<br/>logs method and url"]
    M1 -- "next" --> M2["2. express.json<br/>parses body"]
    M2 -- "next" --> M3["3. requireAuth<br/>checks token"]
    M3 -- "valid, next" --> Route["4. route handler<br/>sends response"]
    M3 -- "invalid, responds 401" --> Stop["Response sent here<br/>later steps never run"]
    Route --> Res["Response to client"]
    Stop --> Res`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'writing your own middleware',
              code: `import express from 'express';

const app = express();

// 1. A logging middleware: do something, then pass along
function requestLogger(req, res, next) {
  const start = Date.now();
  // 'finish' fires when the response has been fully sent
  res.on('finish', () => {
    console.log(req.method, req.originalUrl, res.statusCode, Date.now() - start + 'ms');
  });
  next();                                  // REQUIRED, or the request hangs
}

// 2. A guard middleware: may stop the request
function requireApiKey(req, res, next) {
  if (req.get('x-api-key') !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });   // stop here, no next()
  }
  next();
}

// 3. A middleware factory: configurable middleware
function allowMethods(...methods) {
  return (req, res, next) => {
    if (!methods.includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
    next();
  };
}

app.use(requestLogger);                    // applies to every request
app.use(express.json());                   // built-in body parser
app.use('/admin', requireApiKey);          // only for paths starting with /admin
app.get('/admin/stats', (req, res) => res.json({ users: 120 }));
app.use('/webhook', allowMethods('POST'));`,
            },
            {
              type: 'heading',
              text: 'Where middleware is attached',
            },
            {
              type: 'table',
              headers: ['How', 'Scope', 'Example'],
              rows: [
                ['`app.use(fn)`', 'Every request', '`app.use(requestLogger)`'],
                ['`app.use(\'/api\', fn)`', 'Any path starting with `/api`', '`app.use(\'/api\', rateLimiter)`'],
                ['`app.get(\'/x\', fn1, fn2, handler)`', 'Only this route', '`app.get(\'/me\', requireAuth, getMe)`'],
                ['`router.use(fn)`', 'Every route in that router', 'Admin router with its own auth check'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'order matters: the classic bug and the fix',
              code: `// BUG: routes registered BEFORE express.json() -> req.body is undefined
app.post('/orders', (req, res) => {
  console.log(req.body);                   // undefined
  res.sendStatus(201);
});
app.use(express.json());                   // too late for the route above

// FIX: register shared middleware first
app.use(express.json());
app.post('/orders', (req, res) => {
  console.log(req.body);                   // { item: 'pen' }
  res.sendStatus(201);
});

// Recommended order of a production app:
//   security headers -> request id / logging -> CORS -> body parsers
//   -> rate limit -> routes -> 404 handler -> error handler`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Calling **both** `next()` and `res.send()` (or calling `next()` after a `return`-less response) runs later handlers on a request that already has a response, causing "Cannot set headers after they are sent to the client". After you send a response, `return`. After you do not send one, call `next()`.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Middleware is the right place for **cross-cutting concerns** — things that apply to many routes (logging, auth, rate limiting, request ids, compression). Business logic that belongs to one feature belongs in a handler or service, not in a global middleware.',
            },
          ],
        },
        {
          id: 'request-response-api',
          title: 'The Request and Response Objects',
          summary:
            'Express decorates Node\'s raw `req` and `res` with convenient helpers: `req` carries everything the client sent (params, query, body, headers, IP) and `res` carries what you send back (status, headers, JSON, cookies, redirects, files).',
          keyPoints: [
            '`req.params`, `req.query`, `req.body`, `req.headers` / `req.get()`, `req.cookies` (needs `cookie-parser`), and `req.ip` cover almost everything a client can send.',
            '`res.status(code).json(data)` is the standard JSON response; `res.send()`, `res.sendStatus()`, `res.redirect()`, `res.download()`, `res.cookie()`, and `res.set()` cover the rest.',
            '**Send exactly one response per request** — a second one throws `ERR_HTTP_HEADERS_SENT`; `res.json()` does not stop your function, so use `return`.',
            'Behind a load balancer or reverse proxy, `req.ip` and `req.protocol` show the proxy unless you set `app.set(\'trust proxy\', ...)` correctly.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['You want to read...', 'Use', 'Notes'],
              rows: [
                ['Path variable', '`req.params.id`', 'Always a string'],
                ['Query string value', '`req.query.page`', 'String, or array/object for repeated or nested keys'],
                ['Parsed JSON body', '`req.body`', 'Needs `express.json()`; `undefined` otherwise (Express 5)'],
                ['A header', '`req.get(\'content-type\')`', 'Case-insensitive'],
                ['Client IP', '`req.ip`', 'Needs correct `trust proxy` setting behind a proxy'],
                ['Full original path', '`req.originalUrl`', 'Unchanged even inside mounted routers'],
                ['Cookie', '`req.cookies.sid`', 'Needs `cookie-parser` middleware'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'common response patterns',
              code: `app.get('/demo', (req, res) => {
  // JSON with a status code (most common in APIs)
  res.status(200).json({ ok: true });
});

app.post('/items', (req, res) => {
  const item = { id: 1, ...req.body };
  res.status(201)                              // 201 Created
    .location('/items/1')                      // where the new thing lives
    .json(item);
});

app.delete('/items/:id', (req, res) => {
  res.sendStatus(204);                         // 204 No Content: success, nothing to return
});

app.get('/old-path', (req, res) => {
  res.redirect(301, '/new-path');              // permanent redirect
});

app.get('/report.pdf', (req, res) => {
  res.download('./files/report.pdf', 'monthly-report.pdf');   // sets Content-Disposition
});

app.get('/login-demo', (req, res) => {
  res.cookie('theme', 'dark', {
    httpOnly: true,                            // JavaScript in the browser cannot read it
    secure: true,                              // HTTPS only
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,           // milliseconds
  });
  res.set('Cache-Control', 'no-store');        // set a header
  res.json({ ok: true });
});`,
            },
            {
              type: 'heading',
              text: 'The "headers already sent" bug',
            },
            {
              type: 'code',
              language: 'js',
              title: 'sending two responses by accident',
              code: `// BUG: when the user is missing, we send a 404 ... and then keep going.
app.get('/users/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'Not found' });   // sends response #1
  }
  res.json(user);                                    // sends response #2 -> ERR_HTTP_HEADERS_SENT
});

// FIX: return immediately after responding
app.get('/users/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'attach your own data to req (the middleware handoff)',
              code: `// A middleware loads the current user once...
async function loadUser(req, res, next) {
  req.user = await db.findUserByToken(req.get('authorization'));
  next();
}

// ...and every later handler can simply read req.user
app.get('/me', loadUser, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not signed in' });
  res.json({ id: req.user.id, name: req.user.name });
});

// Request-scoped data belongs on req (or res.locals), never in a global variable:
// globals are shared by ALL concurrent requests and cause cross-user data leaks.
app.use((req, res, next) => {
  res.locals.requestStart = Date.now();
  next();
});`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never store per-request data in a module-level variable (`let currentUser;`). Node handles many requests interleaved on one thread, so a global written by request A can be read by request B during an `await` — a security bug that is very hard to reproduce.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`res.json()` converts the object with `JSON.stringify`, so `Date` becomes an ISO string, `undefined` fields disappear, and `BigInt` throws. Convert those yourself before sending.',
            },
          ],
        },
        {
          id: 'routers-and-structure',
          title: 'Routers and Project Structure: Routes, Controllers, Services',
          summary:
            'As an API grows, split it into layers: routers (URLs), controllers (HTTP in/out), services (business rules), and repositories (database access) — so each file has one job and can be tested on its own.',
          keyPoints: [
            '`express.Router()` creates a mini-app you mount at a path prefix (`app.use(\'/api/users\', usersRouter)`), letting each feature own its routes.',
            '**Layered architecture**: *route* maps URL -> controller; *controller* reads `req`, calls a service, writes `res`; *service* holds the business rules and knows nothing about HTTP; *repository* talks to the database.',
            'Separate **creating the app** (`app.js`, exports `app`) from **starting the server** (`server.js`, calls `listen`) so tests can import the app without opening a port.',
            'Organize by **feature** (`users/`, `orders/`) as the project grows, rather than by file type (`controllers/`, `models/`) — related code stays together.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A single 2000-line `index.js` is where most beginner projects end up. The fix is not clever tools but a simple rule: **each layer has one responsibility and only talks to the layer below it**. The service layer is the big win — because it does not import Express, you can call the same business logic from an HTTP route, a CLI script, a queue worker, or a unit test.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Client["Client"] --> Router["Router<br/>maps URL and method to a controller"]
    Router --> MW["Middleware<br/>auth, validation"]
    MW --> Ctrl["Controller<br/>reads req, calls service, writes res"]
    Ctrl --> Svc["Service<br/>business rules, no HTTP knowledge"]
    Svc --> Repo["Repository<br/>database queries"]
    Repo --> DB[("Database")]`,
            },
            {
              type: 'code',
              language: 'text',
              title: 'feature-based project layout',
              code: `orders-api/
  package.json
  .env.example
  src/
    server.js              # starts listening, handles shutdown signals
    app.js                 # builds and exports the Express app (no listen!)
    config.js              # validated environment variables
    middleware/
      error-handler.js
      require-auth.js
      validate.js
    modules/
      users/
        users.routes.js
        users.controller.js
        users.service.js
        users.repository.js
        users.schema.js    # validation schemas
      orders/
        orders.routes.js
        orders.controller.js
        orders.service.js
        orders.repository.js
  tests/
    orders.test.js`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'one feature, layer by layer',
              code: `// ---- modules/orders/orders.routes.js ----
import { Router } from 'express';
import * as controller from './orders.controller.js';
import { requireAuth } from '../../middleware/require-auth.js';

const router = Router();
router.use(requireAuth);                    // applies to every route in this router
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getOne);
export default router;

// ---- modules/orders/orders.controller.js ---- (HTTP only: no business rules here)
import * as service from './orders.service.js';

export async function create(req, res) {
  const order = await service.createOrder(req.user.id, req.body.items);
  res.status(201).json(order);
}
export async function getOne(req, res) {
  res.json(await service.getOrder(req.user.id, Number(req.params.id)));
}
export async function list(req, res) {
  res.json(await service.listOrders(req.user.id));
}

// ---- modules/orders/orders.service.js ---- (business rules: no req/res anywhere)
import * as repo from './orders.repository.js';
import { AppError, NotFoundError } from '../../errors.js';

export async function createOrder(userId, items) {
  if (items.length === 0) throw new AppError('Order needs at least one item', { statusCode: 400 });
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return repo.insert({ userId, items, total });
}
export async function getOrder(userId, id) {
  const order = await repo.findById(id);
  if (!order || order.userId !== userId) throw new NotFoundError('Order');   // never leak other users' orders
  return order;
}
export const listOrders = (userId) => repo.findByUser(userId);`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'app.js vs server.js (so tests can import the app)',
              code: `// ---- src/app.js ----
import express from 'express';
import ordersRouter from './modules/orders/orders.routes.js';
import { errorHandler, notFound } from './middleware/error-handler.js';

export const app = express();
app.use(express.json());
app.use('/api/orders', ordersRouter);       // mounted under a prefix
app.use(notFound);
app.use(errorHandler);

// ---- src/server.js ----
import { app } from './app.js';
import { config } from './config.js';

const server = app.listen(config.port, () => console.log('listening on', config.port));`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A quick test for a good split: can you call `createOrder(userId, items)` from a plain script without importing `express`? If yes, your service layer is clean. If it needs `req` or `res`, HTTP details have leaked into business logic.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do not over-engineer a small API. Three layers for a 5-route CRUD app is fine; adding interfaces, factories, and dependency-injection containers for it is not. Add structure when the pain appears.',
            },
          ],
        },
        {
          id: 'rest-api-design',
          title: 'REST API Design: Resources, Status Codes, Pagination, Idempotency',
          summary:
            'A REST API models your data as *resources* (nouns in URLs), uses HTTP methods as the verbs, and returns standard status codes — and a few conventions (pagination, idempotency, consistent errors) separate a pleasant API from a painful one.',
          keyPoints: [
            'Use **nouns, plural, lowercase** for resources (`/orders`, `/orders/42/items`) and let the HTTP method be the verb — not `/getOrder` or `/createOrder`.',
            'Pick status codes that carry meaning: `200` OK, `201` Created, `204` No Content, `400` bad input, `401` not signed in, `403` signed in but not allowed, `404` not found, `409` conflict, `422` unprocessable, `429` too many requests, `500` server bug.',
            'A method is **idempotent** if repeating it has the same effect as doing it once: `GET`, `PUT`, `DELETE` are; `POST` is not — use an **Idempotency-Key** header so a retried payment is not charged twice.',
            'Never return an unbounded list: always **paginate** (offset/limit for simple cases, **cursor** pagination for large or fast-changing data) and set a maximum page size.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'REST (Representational State Transfer) is a set of conventions for building APIs on top of HTTP. You do not need to follow every academic rule; the practical core is: **name things as resources, use methods and status codes honestly, and be consistent**. A client developer who has used one endpoint should be able to guess the others.',
            },
            {
              type: 'table',
              headers: ['Method + URL', 'Meaning', 'Success status', 'Safe?', 'Idempotent?'],
              rows: [
                ['`GET /orders`', 'List orders', '200', 'Yes', 'Yes'],
                ['`GET /orders/42`', 'Read one order', '200', 'Yes', 'Yes'],
                ['`POST /orders`', 'Create an order', '201 + `Location` header', 'No', 'No'],
                ['`PUT /orders/42`', 'Replace the whole order', '200 or 204', 'No', 'Yes'],
                ['`PATCH /orders/42`', 'Change some fields', '200', 'No', 'Not guaranteed'],
                ['`DELETE /orders/42`', 'Remove the order', '204', 'No', 'Yes'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Start["Request arrives"] --> Auth{"Valid credentials?"}
    Auth -- "no" --> E401["401 Unauthorized"]
    Auth -- "yes" --> Perm{"Allowed to do this?"}
    Perm -- "no" --> E403["403 Forbidden"]
    Perm -- "yes" --> Valid{"Input valid?"}
    Valid -- "no" --> E400["400 or 422 with field errors"]
    Valid -- "yes" --> Found{"Resource exists?"}
    Found -- "no" --> E404["404 Not Found"]
    Found -- "yes" --> Work{"Conflict or failure?"}
    Work -- "duplicate or stale" --> E409["409 Conflict"]
    Work -- "our bug" --> E500["500 Internal Server Error"]
    Work -- "success" --> OK["200, 201 or 204"]`,
            },
            {
              type: 'heading',
              text: 'Pagination: offset vs cursor',
            },
            {
              type: 'code',
              language: 'js',
              title: 'a paginated list endpoint with a hard limit',
              code: `app.get('/orders', async (req, res) => {
  // Always clamp user input: ?limit=1000000 must not be honoured
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  const { rows, total } = await ordersRepo.findPage({ offset: (page - 1) * limit, limit });

  res.json({
    data: rows,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

// Cursor pagination: "give me 20 items after the one with id 840"
// Stable even if new rows are inserted while the user pages, and fast on big tables.
app.get('/feed', async (req, res) => {
  const limit = 20;
  const after = req.query.after ? Number(req.query.after) : null;
  // SQL:  SELECT * FROM posts WHERE ($1::int IS NULL OR id < $1) ORDER BY id DESC LIMIT 21
  const rows = await postsRepo.findAfter(after, limit + 1);       // fetch one extra
  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;
  res.json({ data, nextCursor: hasMore ? data[data.length - 1].id : null });
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'idempotency key: make a retried POST safe',
              code: `// The client sends the SAME key when it retries after a timeout.
// Without this, "Pay" clicked twice (or retried by a flaky network) charges twice.
app.post('/payments', async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key header required' });

  const previous = await redis.get('idem:' + key);
  if (previous) {
    // Same key seen before: return the stored result instead of charging again
    return res.status(200).json(JSON.parse(previous));
  }

  const payment = await paymentService.charge(req.body);        // really charges once
  await redis.set('idem:' + key, JSON.stringify(payment), 'EX', 24 * 60 * 60);
  res.status(201).json(payment);
});
// (A production version also locks the key while the first request is still running.)`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Use one error shape everywhere, for example `{ "error": { "code": "VALIDATION_FAILED", "message": "...", "details": [...] } }`. Clients can then write one error handler instead of guessing.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do not return `200 OK` with `{ "success": false }` for failures. Monitoring tools, caches, retry logic, and browsers all rely on the status code. Also never return `404` for "you may not see this" if that leaks existence — and never mix `401` and `403`: `401` means "who are you?", `403` means "I know who you are, and no".',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Versioning (`/v1/orders`) lets you change the API without breaking existing clients. Adding optional fields is not a breaking change; renaming or removing fields is.',
            },
          ],
        },
        {
          id: 'validation',
          title: 'Input Validation with Zod (and Joi)',
          summary:
            'Everything that arrives from outside — body, query, params, headers — is untrusted. Validate it against a schema at the edge of your app so the rest of the code can rely on correct types and shapes.',
          keyPoints: [
            '**Never trust the client**: `req.body` can contain missing fields, wrong types, extra fields, or malicious values, whatever your front-end form allows.',
            'A **schema library** (Zod, Joi, Yup, Valibot) describes the allowed shape once and gives you checking, error messages, type coercion, and (with Zod) TypeScript types for free.',
            'Validate in a reusable **middleware** that parses `req.body`/`req.query`/`req.params`, replaces them with the *cleaned* result, and returns `400` with field-level errors on failure.',
            'Use **allow-lists** (`.strict()` or stripping unknown keys) to defend against *mass assignment* — a client sneaking in fields like `isAdmin: true`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine a nightclub door. The bouncer checks each person *once*, at the entrance — not at every table inside. Validation middleware is that bouncer: after the request passes the door, controllers and services can assume `req.body.email` is a real email string and `req.query.limit` is a bounded number, without re-checking everywhere.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Req["Request with body"] --> V["validate middleware<br/>schema.safeParse"]
    V -- "invalid" --> R400["400 response<br/>field-level errors"]
    V -- "valid" --> Clean["req.body replaced by cleaned data"]
    Clean --> Ctrl["Controller<br/>trusts the shape"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'schemas and a reusable validation middleware (Zod)',
              code: `// npm install zod
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(10, 'at least 10 characters').max(128),
    name: z.string().trim().min(1).max(80),
    age: z.number().int().min(13).optional(),
  }).strict(),                               // unknown keys (like isAdmin) are rejected
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),          // query values are strings; coerce
    limit: z.coerce.number().int().min(1).max(100).default(20),
    role: z.enum(['user', 'admin']).optional(),
  }),
});

// One middleware reused by every route
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_FAILED',
        details: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
    });
  }
  Object.assign(req, { validated: result.data });   // handlers read req.validated.body, etc.
  next();
};

// usage
app.post('/users', validate(createUserSchema), async (req, res) => {
  const { email, password, name } = req.validated.body;   // already trimmed, lowercased, typed
  const user = await userService.register({ email, password, name });
  res.status(201).json(user);
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'what goes wrong without validation',
              code: `// BAD: spreading the raw body straight into the database
app.post('/users', async (req, res) => {
  // A client sends { "email": "a@b.com", "role": "admin" } and promotes themselves.
  const user = await db.users.create({ data: req.body });
  res.json(user);
});

// BAD: trusting types - the client sent { "age": "abc" } or { "email": { "$ne": null } }
const result = await collection.findOne({ email: req.body.email });  // NoSQL injection

// GOOD: pick fields explicitly AND validate
const { email, name } = req.validated.body;
const user2 = await db.users.create({ data: { email, name, role: 'user' } });`,
            },
            {
              type: 'table',
              headers: ['Library', 'Style', 'Notes'],
              rows: [
                ['**Zod**', 'Chainable schemas, TypeScript-first', 'Types are inferred from the schema (`z.infer`); very popular today'],
                ['**Joi**', 'Chainable schemas, mature', 'Long-time Node standard; no built-in TS inference'],
                ['**Valibot**', 'Small, modular functions', 'Tiny bundles; similar ideas to Zod'],
                ['**express-validator**', 'Middleware chains per field', 'Express-specific; fine for small apps'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Validation tells you the data is **well-formed**, not that it is **allowed**. `{ "orderId": 42 }` can be a perfectly valid number that belongs to someone else. Ownership and permission checks are *authorization* (a later topic) and must happen in addition.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Validate **output** too when it matters, and keep the front-end and back-end schemas in sync (a shared package in a monorepo works well). Front-end validation is a convenience for users; back-end validation is the security boundary.',
            },
          ],
        },
        {
          id: 'error-handling-express',
          title: 'Centralized Error Handling (and Express 5 Async Errors)',
          summary:
            'Express has a special kind of middleware — one with **four** arguments `(err, req, res, next)` — that catches every error in the app, so you can format responses and logs in one place instead of in every route.',
          keyPoints: [
            'An error-handling middleware has the signature `(err, req, res, next)` and is registered **last**; any `next(err)` or thrown error jumps straight to it, skipping normal middleware.',
            '**Express 5** automatically forwards rejected promises and thrown errors from `async` handlers to the error handler; **Express 4** does not — an `async` handler that throws leaves the request hanging unless you wrap it or call `next(err)`.',
            'Throw typed errors (`NotFoundError`, `ValidationError`) from services, and map them to HTTP status codes **in one place** — the services never mention HTTP.',
            'Send **safe messages to clients** (no stack traces, SQL, or file paths) and log the full detail on the server with a request id.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Without a central handler, every route ends up with its own `try/catch` and its own idea of what an error response looks like. A central handler gives you one place to: pick the status code, hide internals from clients, log properly, and report to monitoring tools like Sentry.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Req["Request"] --> MW["Middleware and routes"]
    MW -- "success" --> Res["Normal response"]
    MW -- "error thrown or next with err" --> Skip["Skip all normal middleware"]
    Skip --> EH["Error handler with 4 arguments<br/>err, req, res, next"]
    EH --> Known{"Known AppError?"}
    Known -- "yes" --> Safe["Send its status and safe message"]
    Known -- "no, a bug" --> Log["Log full error<br/>send generic 500"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'the complete error-handling setup',
              code: `// ---- errors.js ----
export class AppError extends Error {
  constructor(message, { statusCode = 500, code = 'INTERNAL_ERROR', details } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;               // an expected, handled kind of failure
  }
}
export class NotFoundError extends AppError {
  constructor(what = 'Resource') {
    super(what + ' not found', { statusCode: 404, code: 'NOT_FOUND' });
  }
}
export class ConflictError extends AppError {
  constructor(message) { super(message, { statusCode: 409, code: 'CONFLICT' }); }
}

// ---- middleware/error-handler.js ----
export function notFound(req, res, next) {
  next(new NotFoundError('Route ' + req.method + ' ' + req.originalUrl));
}

// MUST have 4 parameters, or Express will not treat it as an error handler
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);     // too late to send JSON; let Express close the socket

  const status = err.statusCode ?? 500;
  const body = {
    error: {
      code: err.code ?? 'INTERNAL_ERROR',
      message: err.isOperational ? err.message : 'Something went wrong',   // hide bug details
      ...(err.details && { details: err.details }),
    },
  };

  // 5xx = our fault: log everything. 4xx = client fault: a short line is enough.
  if (status >= 500) req.log?.error({ err }, 'unhandled error');
  else req.log?.info({ code: err.code }, err.message);

  res.status(status).json(body);
}

// ---- app.js: register LAST ----
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);`,
            },
            {
              type: 'heading',
              text: 'async handlers: Express 4 vs Express 5',
            },
            {
              type: 'code',
              language: 'js',
              title: 'the Express 4 problem and its fixes',
              code: `// EXPRESS 4: an async handler that throws -> unhandled rejection, request HANGS
app.get('/orders/:id', async (req, res) => {
  const order = await repo.findById(req.params.id);   // throws on DB failure
  res.json(order);
});

// Express 4 fix #1: try/catch + next(err) in every handler (noisy)
app.get('/orders/:id', async (req, res, next) => {
  try {
    res.json(await repo.findById(req.params.id));
  } catch (err) {
    next(err);
  }
});

// Express 4 fix #2: one tiny wrapper (or the 'express-async-errors' package)
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/orders/:id', asyncHandler(async (req, res) => {
  res.json(await repo.findById(req.params.id));
}));

// EXPRESS 5: nothing needed. A thrown error or rejected promise in a handler
// or middleware is passed to next(err) automatically.
app.get('/orders/:id', async (req, res) => {
  const order = await repo.findById(req.params.id);
  if (!order) throw new NotFoundError('Order');       // reaches errorHandler
  res.json(order);
});`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The error handler **must declare four parameters** even if you do not use `next`. Express decides by `fn.length`; with three parameters it is treated as a normal middleware and your errors fall through to Express\'s default handler, which can leak a stack trace in non-production mode.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Errors thrown inside callbacks that are not part of the Express chain (`setTimeout`, event emitters, un-awaited promises) never reach the error handler. Await your promises, and attach `error` listeners to emitters and streams.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Map framework errors too: invalid JSON bodies produce an error with `type: \'entity.parse.failed\'` and `status: 400`; payload too large yields `413`. Respecting `err.status` / `err.statusCode` in your handler (as above) handles these correctly.',
            },
          ],
        },
        {
          id: 'config-env',
          title: 'Configuration and Environment Variables',
          summary:
            'Configuration (ports, database URLs, secrets) must live **outside the code** in environment variables, be validated once at startup, and never be committed to git — the same code then runs unchanged in development, staging, and production.',
          keyPoints: [
            'Read settings from `process.env` (always **strings**); Node 20.6+ can load a `.env` file natively with `node --env-file=.env app.js` — no `dotenv` package required.',
            '**Validate config at startup** and fail fast with a clear message if a variable is missing or malformed, instead of crashing mysteriously on the first request.',
            'Commit a **`.env.example`** with fake values documenting every variable; add the real `.env` to `.gitignore`. A secret that reaches git history must be considered leaked and rotated.',
            'Follow "12-factor" practice: config comes from the environment, one build artifact is promoted through stages, and secrets in production come from a secret manager (AWS Secrets Manager, Vault, Kubernetes secrets).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Hard-coding `const DB = \'postgres://admin:hunter2@prod-db:5432/shop\'` is dangerous twice over: the password sits in your git history forever, and you have to edit code to point the same app at a different database. Environment variables fix both — they belong to the *machine or container*, not the source code.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Code["Same application code"] --> Dev["Development<br/>.env file on laptop"]
    Code --> Stage["Staging<br/>variables set by CI"]
    Code --> Prod["Production<br/>secret manager injects variables"]
    Dev --> DB1[("dev database")]
    Stage --> DB2[("staging database")]
    Prod --> DB3[("production database")]`,
            },
            {
              type: 'code',
              language: 'bash',
              title: '.env.example (committed) and running with the native loader',
              code: `# .env.example - documents every setting, contains NO real secrets
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/shop
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=change-me-to-a-long-random-string
CORS_ORIGINS=http://localhost:5173,http://localhost:3001

# Run with the built-in loader (Node 20.6+). Later files override earlier ones.
node --env-file=.env src/server.js
node --env-file=.env --env-file=.env.local src/server.js`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'config.js: parse and validate once, export a typed object',
              code: `import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),   // env values are strings
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_ACCESS_SECRET: z.string().min(32, 'must be at least 32 characters'),
  CORS_ORIGINS: z.string().transform((s) => s.split(',').map((o) => o.trim())),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) console.error(' -', issue.path.join('.'), issue.message);
  process.exit(1);                               // fail fast, at startup, with a clear reason
}

export const config = Object.freeze({
  env: parsed.data.NODE_ENV,
  isProd: parsed.data.NODE_ENV === 'production',
  port: parsed.data.PORT,
  databaseUrl: parsed.data.DATABASE_URL,
  redisUrl: parsed.data.REDIS_URL,
  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  corsOrigins: parsed.data.CORS_ORIGINS,
});

// everywhere else:  import { config } from './config.js';   (never touch process.env directly)`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Environment variables are **strings**. `process.env.DEBUG = \'false\'` is the string `"false"`, which is *truthy* — `if (process.env.DEBUG)` runs! Parse booleans and numbers explicitly (`=== \'true\'`, `Number(...)`) — a schema library does this for you.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never log `process.env` or the whole config object, never return it from a debug endpoint, and never put secrets into front-end bundles or Docker image layers (`ENV SECRET=...` or `COPY .env` bakes them into the image permanently).',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`NODE_ENV=production` also changes behaviour in libraries — Express caches view templates and emits terser errors — so always set it in production, and never use it as a place to hide your own feature flags.',
            },
          ],
        },
        {
          id: 'password-hashing',
          title: 'Authentication I: Storing Passwords Safely',
          summary:
            '**Authentication** answers "who are you?". The first rule of doing it yourself is never to store a password — only a slow, salted hash of it, so that a stolen database does not reveal anyone\'s actual password.',
          keyPoints: [
            'Store a **hash** (a one-way scrambled fingerprint), never the password and never reversible encryption; on login, hash the attempt and compare.',
            'Use a deliberately **slow, salted** algorithm designed for passwords: **argon2id** (preferred), **scrypt**, or **bcrypt** — never MD5, SHA-1, or plain SHA-256.',
            'A **salt** is random data mixed into each hash so identical passwords produce different hashes and precomputed "rainbow tables" are useless; modern libraries add it automatically.',
            'Return the **same vague error** for "unknown email" and "wrong password" (and do the same amount of work), so attackers cannot discover which emails are registered.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Why slow on purpose? If an attacker steals your user table, they will try billions of guesses offline. A fast hash like SHA-256 lets them test billions per second on a GPU. bcrypt/argon2 can be tuned so a single guess costs ~100 ms of CPU and a lot of memory — fine for one login, ruinous for a billion guesses.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant U as User browser
    participant A as Express API
    participant D as Database
    Note over U,D: Registration
    U->>A: POST /register email and password over HTTPS
    A->>A: hash password with random salt, slow on purpose
    A->>D: store email and password hash only
    Note over U,D: Login
    U->>A: POST /login email and password
    A->>D: find user by email
    D-->>A: user row with stored hash
    A->>A: verify attempt against stored hash
    A-->>U: 200 and session or token, or 401 generic error`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'hashing and verifying with bcrypt (npm install bcrypt)',
              code: `import bcrypt from 'bcrypt';

const COST = 12;     // work factor: each +1 doubles the time. Aim for ~100-300 ms on your server.

export async function register(email, password) {
  const passwordHash = await bcrypt.hash(password, COST);   // salt is generated and stored inside the hash
  // passwordHash looks like: $2b$12$KIXx...  (algorithm, cost, salt and hash in one string)
  return db.users.create({ data: { email, passwordHash } });
}

// A fake hash to compare against when the email does not exist, so both
// paths take about the same time (prevents timing-based user enumeration).
const DUMMY_HASH = await bcrypt.hash('not-a-real-password', COST);

export async function login(email, password) {
  const user = await db.users.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) {
    throw new AppError('Invalid email or password', { statusCode: 401, code: 'INVALID_CREDENTIALS' });
  }
  return user;
}`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'argon2id (the current recommendation) is just as short',
              code: `// npm install argon2
import argon2 from 'argon2';

const hash = await argon2.hash(password, { type: argon2.argon2id });   // memory-hard
const valid = await argon2.verify(hash, attempt);

// Upgrade old hashes silently on login: if the stored hash uses weaker parameters,
// re-hash the correct password and save it.
if (valid && argon2.needsRehash(hash)) {
  await db.users.update({ where: { id }, data: { passwordHash: await argon2.hash(attempt) } });
}`,
            },
            {
              type: 'table',
              headers: ['Algorithm', 'Verdict', 'Why'],
              rows: [
                ['MD5, SHA-1, SHA-256', 'Never for passwords', 'Designed to be fast; billions of guesses per second'],
                ['bcrypt', 'Good', 'Slow and battle-tested; truncates input at 72 bytes'],
                ['scrypt', 'Good', 'Built into Node (`crypto.scrypt`); memory-hard'],
                ['argon2id', 'Best default', 'Winner of the Password Hashing Competition; tunable memory and time'],
                ['Encryption (AES)', 'Wrong tool', 'Reversible — whoever has the key can read every password'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'bcrypt\'s native version runs on the thread pool; the **cost factor** also decides how many logins/second one server can handle. Combine hashing with **rate limiting** on `/login` (for example 5 attempts per minute per account and IP) or attackers can still hammer weak passwords online.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Enforce length (at least 10-12 characters, allow long passphrases) rather than weird composition rules; check new passwords against a breached-password list; offer multi-factor authentication. And if you can, use an identity provider (Auth0, Clerk, Cognito, Keycloak) instead of owning password storage at all.',
            },
          ],
        },
        {
          id: 'sessions-jwt',
          title: 'Authentication II: Sessions, JWT, and Refresh Tokens',
          summary:
            'After a user logs in, the server must recognize them on later requests. **Sessions** store the login on the server and give the browser an opaque id; **JWTs** put signed claims inside a token the client carries — each with different trade-offs.',
          keyPoints: [
            'HTTP is **stateless** — each request is independent — so after login you need a credential on every request: a **session id cookie** (looked up server-side) or a **signed token** (verified without lookup).',
            'A **JWT** (JSON Web Token) is `header.payload.signature`, signed — *not encrypted*: anyone can read the payload, so never put secrets in it; the signature only proves nobody changed it.',
            'JWTs are hard to **revoke** before they expire, so keep **access tokens short-lived** (5-15 minutes) and pair them with a longer-lived **refresh token** that is stored server-side, rotated on use, and revocable.',
            'Store browser tokens in **`httpOnly`, `secure`, `sameSite` cookies** rather than `localStorage` (readable by any XSS script); use `Authorization: Bearer` mostly for mobile apps and server-to-server APIs.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Server-side session', 'JWT access token'],
              rows: [
                ['What the client holds', 'Random opaque id in a cookie', 'Signed token containing claims (user id, role, expiry)'],
                ['State lives', 'On the server (Redis or database)', 'In the token itself (stateless)'],
                ['Each request', 'Look up the session in the store', 'Verify the signature (no lookup)'],
                ['Logout / revoke', 'Delete the session: instant', 'Hard: valid until expiry unless you keep a deny-list'],
                ['Scaling', 'Needs a shared store across servers', 'Any server can verify it with the secret/public key'],
                ['Best for', 'Server-rendered sites and a single web app', 'APIs, mobile apps, microservices, third-party clients'],
              ],
            },
            {
              type: 'heading',
              text: 'Sessions with express-session and Redis',
            },
            {
              type: 'code',
              language: 'js',
              title: 'cookie-based sessions',
              code: `// npm install express-session connect-redis redis
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: config.redisUrl });
await redisClient.connect();

app.set('trust proxy', 1);                      // needed for secure cookies behind a proxy
app.use(session({
  store: new RedisStore({ client: redisClient }),   // NOT the default MemoryStore (leaks, single-process)
  secret: config.sessionSecret,
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: config.isProd, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 },
}));

app.post('/login', async (req, res) => {
  const user = await authService.login(req.body.email, req.body.password);
  req.session.regenerate((err) => {              // new id after login: prevents session fixation
    if (err) throw err;
    req.session.userId = user.id;
    res.json({ id: user.id });
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.sendStatus(204);
  });
});`,
            },
            {
              type: 'heading',
              text: 'JWT access + refresh tokens',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant C as Client
    participant A as API
    participant S as Token store
    C->>A: POST /login email and password
    A->>S: save hash of refresh token
    A-->>C: access token 15 min and refresh token 7 days in httpOnly cookie
    C->>A: GET /orders with access token
    A->>A: verify signature and expiry
    A-->>C: 200 data
    Note over C,A: Some time later the access token expires
    C->>A: GET /orders with expired token
    A-->>C: 401 token expired
    C->>A: POST /refresh with refresh cookie
    A->>S: check token exists, then rotate it
    A-->>C: new access token and new refresh token
    Note over A,S: If an OLD refresh token is ever reused, revoke the whole token family`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'issuing and verifying tokens (npm install jsonwebtoken)',
              code: `import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'node:crypto';

export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role },     // claims: keep them small, no secrets
    config.jwtAccessSecret,
    { algorithm: 'HS256', expiresIn: '15m', issuer: 'orders-api' },
  );
}

export async function issueRefreshToken(userId) {
  const token = randomBytes(48).toString('base64url');            // opaque random string
  const tokenHash = createHash('sha256').update(token).digest('hex');
  // store only the HASH, so a database leak does not hand out working tokens
  await db.refreshTokens.create({ data: { userId, tokenHash, expiresAt: addDays(7) } });
  return token;
}

// Express middleware: verify the Bearer token on protected routes
export function requireAuth(req, res, next) {
  const header = req.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: { code: 'NO_TOKEN' } });

  try {
    // ALWAYS pin the algorithm list, or an attacker may send alg "none"
    const payload = jwt.verify(token, config.jwtAccessSecret, { algorithms: ['HS256'], issuer: 'orders-api' });
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch (err) {
    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    res.status(401).json({ error: { code } });
  }
}`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'refresh endpoint with rotation',
              code: `app.post('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  const tokenHash = createHash('sha256').update(token).digest('hex');
  const record = await db.refreshTokens.findUnique({ where: { tokenHash } });

  if (!record || record.expiresAt < new Date()) return res.sendStatus(401);

  if (record.usedAt) {
    // This token was already exchanged once: it was stolen or replayed.
    await db.refreshTokens.deleteMany({ where: { userId: record.userId } });   // log everyone out
    return res.sendStatus(401);
  }

  await db.refreshTokens.update({ where: { tokenHash }, data: { usedAt: new Date() } });  // rotate: one use only
  const user = await db.users.findUnique({ where: { id: record.userId } });

  res.cookie('refreshToken', await issueRefreshToken(user.id), {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/refresh', maxAge: 7 * 86400 * 1000,
  });
  res.json({ accessToken: signAccessToken(user) });
});`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Common JWT mistakes: putting sensitive data in the payload (it is only Base64-encoded, not secret), long expiry times (30 days) with no way to revoke, accepting any algorithm (`alg: none`), storing tokens in `localStorage`, and using JWTs as sessions in a single-server app that would be simpler and safer with a plain session cookie.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Passport.js** is a popular Express library that standardizes login "strategies" (local username/password, Google, GitHub OAuth, JWT) behind one `passport.authenticate()` middleware. It saves boilerplate for social login, but the concepts above — hashing, sessions vs tokens, rotation — still apply underneath. For "Sign in with Google", the protocol is **OAuth 2.0 / OpenID Connect**: your app redirects to Google, and Google redirects back with a one-time code you exchange for the user\'s identity.',
            },
          ],
        },
        {
          id: 'authorization-rbac',
          title: 'Authorization: Roles, Permissions, and Ownership',
          summary:
            '**Authorization** answers "what are you allowed to do?" — it comes *after* authentication, and it must be checked on the server for every protected action, including whether the record being touched belongs to the requesting user.',
          keyPoints: [
            'Authentication = identity (401 on failure); authorization = permission (403 on failure). A logged-in user is not automatically allowed to do everything.',
            '**RBAC** (role-based access control) gives each user one or more roles (`admin`, `editor`, `viewer`), and each role a set of permissions; check the **permission**, not the role name, where possible.',
            'The most common real-world vulnerability is **IDOR / broken access control**: `GET /orders/42` works for *any* logged-in user because the code checks login but not ownership.',
            'Enforce authorization on the **server** in middleware and in the service layer; hiding a button in the UI is not security.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Req["Request to PATCH /orders/42"] --> Authn{"Authenticated?"}
    Authn -- "no" --> R401["401 Unauthorized"]
    Authn -- "yes" --> Perm{"Role has permission<br/>orders:update ?"}
    Perm -- "no" --> R403a["403 Forbidden"]
    Perm -- "yes" --> Own{"Order belongs to this user<br/>or user is admin?"}
    Own -- "no" --> R404["404 Not Found<br/>do not reveal it exists"]
    Own -- "yes" --> Do["Perform the update"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'role and permission middleware',
              code: `// Map roles to permissions in ONE place
const PERMISSIONS = {
  viewer: ['orders:read'],
  editor: ['orders:read', 'orders:create', 'orders:update'],
  admin: ['orders:read', 'orders:create', 'orders:update', 'orders:delete', 'users:manage'],
};

export const can = (permission) => (req, res, next) => {
  const allowed = PERMISSIONS[req.user?.role] ?? [];
  if (!allowed.includes(permission)) {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } });
  }
  next();
};

// usage: authenticate first, then check permission
router.get('/orders', requireAuth, can('orders:read'), controller.list);
router.delete('/orders/:id', requireAuth, can('orders:delete'), controller.remove);`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'the ownership bug (IDOR) and its fix',
              code: `// BUG: any logged-in user can read ANY order by guessing ids 1, 2, 3, ...
app.get('/orders/:id', requireAuth, async (req, res) => {
  const order = await db.orders.findUnique({ where: { id: Number(req.params.id) } });
  res.json(order);
});

// FIX 1: scope the query to the current user, so other people's rows simply do not exist
app.get('/orders/:id', requireAuth, async (req, res) => {
  const order = await db.orders.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!order) throw new NotFoundError('Order');     // 404, not 403: do not confirm it exists
  res.json(order);
});

// FIX 2: explicit policy function when rules are richer (admins, team members, ...)
function canEditOrder(user, order) {
  return user.role === 'admin' || order.userId === user.id || order.teamId === user.teamId;
}`,
            },
            {
              type: 'table',
              headers: ['Model', 'Idea', 'Good for'],
              rows: [
                ['**RBAC**', 'Users have roles; roles have permissions', 'Most business apps'],
                ['**Ownership checks**', 'A user may touch only their own records', 'Every multi-user app, in addition to RBAC'],
                ['**ABAC** (attribute-based)', 'Rules over attributes: "managers may approve orders under 1000 in their region"', 'Complex, fine-grained rules'],
                ['**Policy libraries**', 'CASL, Casbin, OPA centralise rules', 'Large systems with many rules'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do not trust role information that comes from the client (a `role` field in the request body, or a header). Take it from the verified token or the database. Also remember that a role stored in a JWT stays valid until the token expires — demoting a user takes effect only after the next refresh unless you re-check the database for sensitive actions.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Write tests specifically for access control: "user A requests user B\'s order -> 404", "viewer tries DELETE -> 403", "no token -> 401". These are the bugs that become data-breach headlines.',
            },
          ],
        },
        {
          id: 'database-sql',
          title: 'Databases I: PostgreSQL, Connection Pools, and Prisma',
          summary:
            'A Node server talks to PostgreSQL through a **connection pool** — a small set of reusable database connections — and should always use **parameterized queries** (or an ORM/query builder) so user input can never be executed as SQL.',
          keyPoints: [
            'Opening a database connection is slow, so a **pool** (`pg.Pool`) keeps a handful open and lends them out per query; size it small (about 10 per app instance) because the database also has a global connection limit.',
            '**SQL injection** happens when user input is pasted into the query string; fix it with placeholders (`$1`, `$2`) so the driver sends values separately from the SQL text.',
            'Group related writes in a **transaction** (`BEGIN ... COMMIT`) so they all succeed or none do — essential for transfers, orders with line items, and inventory.',
            'An **ORM / query builder** (Prisma, Drizzle, Knex, Sequelize, TypeORM) saves boilerplate and gives type safety; learn the SQL underneath anyway, because you will need to debug slow queries.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Think of the pool as a taxi rank outside a station. Hiring a new taxi (opening a connection) for every passenger (query) is slow and wasteful, so a fixed fleet waits at the rank; each query takes a free taxi and returns it when done. If all taxis are busy, new passengers queue. The database can only support so many taxis in total, which is why you must not make the fleet huge.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    R1["Request 1"] --> Pool
    R2["Request 2"] --> Pool
    R3["Request 3"] --> Pool
    R4["Request 4 waits for a free connection"] --> Pool
    Pool["Connection pool<br/>max 10 connections"] --> C1["connection 1"]
    Pool --> C2["connection 2"]
    Pool --> Cn["... connection 10"]
    C1 --> DB[("PostgreSQL<br/>max_connections limit")]
    C2 --> DB
    Cn --> DB`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'node-postgres: a pool, safe queries, and a transaction',
              code: `// npm install pg
import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,                        // connections per Node process
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000, // fail instead of waiting forever for a free connection
});

// SAFE: placeholders keep data and SQL separate
export async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT id, email, role FROM users WHERE email = $1', [email]);
  return rows[0] ?? null;
}

// UNSAFE (SQL injection): an email of  ' OR '1'='1  returns every user
// await pool.query("SELECT * FROM users WHERE email = '" + email + "'");

// Transaction: move money - both updates happen, or neither does
export async function transfer(fromId, toId, amount) {
  const client = await pool.connect();         // take ONE connection for the whole transaction
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $1 RETURNING balance',
      [amount, fromId],
    );
    if (rows.length === 0) throw new AppError('Insufficient funds', { statusCode: 409 });
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();                           // ALWAYS give the connection back, or the pool runs dry
  }
}`,
            },
            {
              type: 'code',
              language: 'prisma',
              title: 'Prisma schema (prisma/schema.prisma)',
              code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  orders    Order[]
  createdAt DateTime @default(now())
}

model Order {
  id        Int         @id @default(autoincrement())
  userId    Int
  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]
  total     Decimal     @db.Decimal(10, 2)
  createdAt DateTime    @default(now())

  @@index([userId, createdAt])   // speeds up "my recent orders"
}

model OrderItem {
  id       Int   @id @default(autoincrement())
  orderId  Int
  order    Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  sku      String
  quantity Int
}`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'Prisma client: queries, relations, transactions, and the N+1 trap',
              code: `// npx prisma migrate dev --name init    # creates tables from schema.prisma
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();      // create ONE per process and reuse it

// Create with a nested relation, atomically
const order = await prisma.order.create({
  data: {
    userId: 7,
    total: 59.98,
    items: { create: [{ sku: 'PEN-1', quantity: 2 }, { sku: 'NOTE-9', quantity: 1 }] },
  },
  include: { items: true },
});

// Filter, sort, paginate
const recent = await prisma.order.findMany({
  where: { userId: 7 },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: 0,
});

// Several writes in one transaction
await prisma.$transaction([
  prisma.order.update({ where: { id: 1 }, data: { total: 10 } }),
  prisma.orderItem.deleteMany({ where: { orderId: 2 } }),
]);

// N+1 problem: 1 query for orders + 1 query PER order for its items = 101 queries
const orders = await prisma.order.findMany({ take: 100 });
for (const o of orders) {
  o.items = await prisma.orderItem.findMany({ where: { orderId: o.id } });   // SLOW
}
// FIX: ask for the relation in the same call (Prisma issues 2 queries total)
const fast = await prisma.order.findMany({ take: 100, include: { items: true } });`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The two classic pool bugs: **forgetting `client.release()`** (the pool slowly drains until every request hangs) and **creating a new `Pool`/`PrismaClient` inside a request handler** (a new pool per request exhausts the database). Create it once at startup and import it.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Use **migrations** (`prisma migrate`, `knex migrate`, `node-pg-migrate`) for every schema change so the database structure is versioned in git like code. Add indexes for columns you filter or sort by, and check slow queries with `EXPLAIN ANALYZE`. Money belongs in `NUMERIC`/`DECIMAL` or integer cents, never in floating point.',
            },
          ],
        },
        {
          id: 'database-mongo',
          title: 'Databases II: MongoDB with Mongoose',
          summary:
            'MongoDB stores flexible JSON-like **documents** in collections instead of rows in tables; Mongoose adds schemas, validation, and helper methods on top, which is useful because MongoDB itself does not enforce a structure.',
          keyPoints: [
            'A **document** is a JSON-like object (stored as BSON); a **collection** groups documents; there are no joins by default — you either **embed** related data inside a document or **reference** it by id and `populate`.',
            'Mongoose **schemas** define fields, types, defaults, and validators; a **model** is the class you use to query (`User.find`, `User.create`).',
            'Connect once at startup (`mongoose.connect`) — Mongoose manages a connection pool for you; do not reconnect per request.',
            'Beware **NoSQL injection**: passing `req.body` objects straight into `find()` lets attackers send operators like `{ "$ne": null }`; validate types and strip `$`-keys.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The key design question in MongoDB is **embed or reference?** Embed data that is always read together and owned by the parent (an order\'s line items). Reference data that is shared, large, or changes independently (a product used by many orders). A good rule: embed when the child has no life outside its parent and stays small; reference otherwise.',
            },
            {
              type: 'code',
              language: 'js',
              title: 'a Mongoose schema and model',
              code: `// npm install mongoose
import mongoose from 'mongoose';

await mongoose.connect(config.mongoUrl, { maxPoolSize: 10 });   // once, at startup

const itemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });                              // embedded: no separate id needed

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },   // reference
  items: { type: [itemSchema], validate: (v) => v.length > 0 },                               // embedded
  status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
  total: { type: Number, required: true },
}, { timestamps: true });                        // adds createdAt and updatedAt

orderSchema.index({ user: 1, createdAt: -1 });   // compound index for "my latest orders"

export const Order = mongoose.model('Order', orderSchema);`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'queries, populate, and the safe way to read user input',
              code: `// create
const order = await Order.create({
  user: userId,
  items: [{ sku: 'PEN-1', quantity: 2, price: 9.99 }],
  total: 19.98,
});

// read with filtering, sorting, pagination; .lean() returns plain objects (faster, less memory)
const mine = await Order.find({ user: userId, status: 'pending' })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();

// populate: follow the reference and fetch the user (a second query behind the scenes)
const withUser = await Order.findById(id).populate('user', 'name email');

// update atomically (no read-modify-write race)
await Order.updateOne({ _id: id, status: 'pending' }, { $set: { status: 'paid' } });
await Order.updateOne({ _id: id }, { $inc: { total: 5 } });

// NoSQL INJECTION: body is { "email": { "$ne": null }, "password": { "$ne": null } }
// and this matches the FIRST user in the collection:
const bad = await User.findOne({ email: req.body.email, password: req.body.password });

// FIX: validate that these are strings (Zod / Joi), and never store plain passwords at all
const email = String(req.validated.body.email);
const user = await User.findOne({ email });`,
            },
            {
              type: 'table',
              headers: ['', 'PostgreSQL (SQL)', 'MongoDB (document)'],
              rows: [
                ['Data shape', 'Fixed columns, strict schema', 'Flexible documents (schema optional)'],
                ['Relationships', 'Foreign keys and joins', 'Embed or reference; joins are awkward'],
                ['Transactions', 'Mature, multi-table by default', 'Supported but rarely the main design tool'],
                ['Strengths', 'Consistency, reporting, complex queries', 'Evolving shapes, nested data, easy horizontal scaling'],
                ['Pick when', 'Money, inventory, relational data (default choice)', 'Content, catalogues, event logs, rapidly changing shapes'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'MongoDB documents have a **16 MB size limit**, and arrays that grow without bound (every comment ever on a popular post) are a design smell. Also, Mongoose **buffers commands** before the connection is ready, which hides a wrong connection string until a query times out after 10 seconds — await the connection at startup so you fail fast.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Add `mongoose.set(\'sanitizeFilter\', true)` (Mongoose 6+) to treat query-filter objects from user input as literal values instead of operators — a cheap extra layer against NoSQL injection.',
            },
          ],
        },
        {
          id: 'file-uploads',
          title: 'File Uploads with Multer and Streaming to S3',
          summary:
            'Browsers send files as `multipart/form-data`, which `express.json()` cannot parse; **multer** handles it, and for anything but tiny files you should stream the upload to object storage (S3) rather than buffering it in memory or keeping it on the server disk.',
          keyPoints: [
            '`multipart/form-data` is the encoding used for file uploads; **multer** (built on busboy) parses it and exposes `req.file` / `req.files` plus the text fields in `req.body`.',
            'Always set **limits** (`fileSize`, `files`) and a **file filter**; check the real file type (magic bytes), not just the extension or the client-provided `Content-Type`.',
            '`memoryStorage` keeps each file in RAM (risky with big files or many users); `diskStorage` writes to local disk (lost when containers restart); production apps stream to **object storage** like S3.',
            'Never use the client\'s file name for the stored path — generate your own (`randomUUID()`), to prevent path traversal and overwriting.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'js',
              title: 'a basic, safe upload endpoint (disk storage)',
              code: `// npm install multer
import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve('uploads'),
    // NEVER trust file.originalname for the path: it can be "../../app.js"
    filename: (req, file, cb) => cb(null, randomUUID() + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },        // 5 MB, one file
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) return cb(new AppError('Only JPEG, PNG or WebP', { statusCode: 415 }));
    cb(null, true);
  },
});

// field name 'avatar' must match the <input type="file" name="avatar"> / FormData key
app.post('/profile/avatar', requireAuth, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(201).json({ file: req.file.filename, size: req.file.size });
});

// handle multer's own errors (file too large, too many files)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(413).json({ error: err.code });
  next(err);
});`,
            },
            {
              type: 'heading',
              text: 'Two ways to get a file into S3',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph A["Option A: stream through your server"]
      direction LR
      A1["Browser"] -->|"multipart upload"| A2["Express with busboy"]
      A2 -->|"stream chunks"| A3[("S3 bucket")]
    end
    subgraph B["Option B: presigned URL - best for big files"]
      direction LR
      B1["Browser"] -->|"1 ask for upload URL"| B2["Express API"]
      B2 -->|"2 signed URL valid 5 min"| B1
      B1 -->|"3 PUT file directly"| B3[("S3 bucket")]
    end`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'Option A: stream the upload straight to S3 (no temp file, constant memory)',
              code: `// npm install @aws-sdk/client-s3 @aws-sdk/lib-storage busboy
import busboy from 'busboy';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'node:crypto';

const s3 = new S3Client({ region: config.awsRegion });

app.post('/uploads', requireAuth, (req, res, next) => {
  const bb = busboy({ headers: req.headers, limits: { fileSize: 50 * 1024 * 1024, files: 1 } });
  let started = false;

  bb.on('file', (field, fileStream, info) => {
    started = true;
    const key = 'uploads/' + req.user.id + '/' + randomUUID();
    // fileStream is a Readable stream: S3 receives chunks as they arrive from the browser
    const job = new Upload({
      client: s3,
      params: { Bucket: config.bucket, Key: key, Body: fileStream, ContentType: info.mimeType },
    });
    fileStream.on('limit', () => job.abort());                     // too big: stop uploading
    job.done()
      .then(() => res.status(201).json({ key }))
      .catch(next);
  });

  bb.on('close', () => { if (!started) res.status(400).json({ error: 'No file' }); });
  req.pipe(bb);
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'Option B: presigned URL (the file never touches your server)',
              code: `import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

app.post('/uploads/presign', requireAuth, async (req, res) => {
  const { contentType } = req.validated.body;             // validate: only allowed types
  const key = 'uploads/' + req.user.id + '/' + randomUUID();

  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: contentType }),
    { expiresIn: 300 },                                    // valid for 5 minutes only
  );
  res.json({ url, key });
});

// Browser side:
//   const { url, key } = await (await fetch('/uploads/presign', {...})).json();
//   await fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
//   then tell your API "I uploaded key X" so you can save it against the user.`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Uploaded files are untrusted input. Never serve them from the same origin as your app with their original type (an uploaded `.html` or `.svg` can run script — stored XSS), never execute them, and consider virus scanning for user-to-user sharing. Serving from a separate domain (a CDN bucket) with `Content-Disposition: attachment` for risky types is the safest setup.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`multer.memoryStorage()` with no `fileSize` limit lets one client upload a 2 GB file and crash your server with an out-of-memory error — or ten clients at once. Always set limits, and remember a reverse proxy (nginx `client_max_body_size`) has its own limit too.',
            },
          ],
        },
        {
          id: 'security-hardening',
          title: 'Security: Helmet, CORS, Rate Limiting, and OWASP Basics',
          summary:
            'Express is not secure by default. A handful of middleware plus a few habits — security headers, a strict CORS allow-list, rate limits, validated input, parameterized queries — block most common web attacks.',
          keyPoints: [
            '**helmet** sets protective HTTP response headers (`Content-Security-Policy`, `X-Content-Type-Options`, `Strict-Transport-Security`, ...) in one line; **disable `X-Powered-By`** so you do not advertise your stack.',
            '**CORS** (Cross-Origin Resource Sharing) is a *browser* rule: a page on one origin may call your API on another only if your API says so; use an explicit **allow-list of origins**, never `origin: \'*\'` together with credentials.',
            '**Rate limiting** (`express-rate-limit`, or Redis-backed for multiple servers) slows brute-force logins, scraping, and accidental floods — apply stricter limits to `/login` and `/register`.',
            'The **OWASP Top 10** is the standard checklist: broken access control, injection, insecure design, misconfiguration, vulnerable dependencies, and authentication failures cover most real breaches.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Req["Request from internet"] --> TLS["HTTPS and reverse proxy<br/>TLS, body size limit"]
    TLS --> H["helmet<br/>security headers"]
    H --> Cors["CORS allow-list"]
    Cors --> RL["Rate limiter"]
    RL --> Body["Body parser with size limit"]
    Body --> Val["Schema validation"]
    Val --> Auth["Authentication and authorization"]
    Auth --> App["Business logic with<br/>parameterized queries"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'a hardened Express app setup',
              code: `// npm install helmet cors express-rate-limit
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
app.disable('x-powered-by');            // helmet does this too; do not announce "Express"
app.set('trust proxy', 1);              // 1 = trust exactly one proxy hop (e.g. nginx / load balancer)

app.use(helmet());                      // sensible default headers

// CORS: explicit allow-list from config
app.use(cors({
  origin: (origin, cb) => {
    // requests without an Origin header (curl, server-to-server) are not browsers; allow them
    if (!origin || config.corsOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Origin not allowed by CORS'));
  },
  credentials: true,                    // allow cookies; requires a NON-wildcard origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  maxAge: 600,                          // browsers cache the preflight answer for 10 min
}));

// Global limit, plus a much stricter one on credential endpoints
app.use(rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }));
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, skipSuccessfulRequests: true });
app.use('/auth/login', loginLimiter);

app.use(express.json({ limit: '100kb' }));     // refuse huge JSON bodies`,
            },
            {
              type: 'heading',
              text: 'What CORS really does',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant B as Browser on app.example.com
    participant A as API on api.example.com
    B->>A: OPTIONS /orders preflight with Origin header
    A-->>B: Access-Control-Allow-Origin app.example.com and allowed methods
    Note over B: browser checks the answer and allows the real request
    B->>A: GET /orders with cookies
    A-->>B: 200 data with Allow-Origin header
    Note over B,A: curl and servers ignore CORS entirely - it only protects browser users`,
            },
            {
              type: 'table',
              headers: ['Attack (OWASP area)', 'What it is', 'Defence in an Express API'],
              rows: [
                ['**Broken access control**', 'Using someone else\'s data by changing an id', 'Ownership checks on every query; deny by default'],
                ['**Injection** (SQL/NoSQL/command)', 'Input executed as code', 'Parameterized queries, schema validation, never `exec()` with user input'],
                ['**XSS** (cross-site scripting)', 'Attacker script runs in a user\'s browser', 'Escape output, CSP via helmet, `httpOnly` cookies'],
                ['**CSRF**', 'Another site makes the browser send your cookies', '`sameSite` cookies, CSRF tokens for cookie-auth forms'],
                ['**Auth failures**', 'Weak passwords, brute force, bad sessions', 'argon2/bcrypt, rate limits, short-lived tokens, MFA'],
                ['**Vulnerable dependencies**', 'A package you use has a known CVE', '`npm audit`, Dependabot/Renovate, lockfile, fewer packages'],
                ['**Misconfiguration**', 'Debug on in production, default passwords, open buckets', 'Validated config, `NODE_ENV=production`, least privilege'],
                ['**SSRF**', 'Your server fetches an attacker-chosen URL', 'Allow-list outbound hosts; block private IP ranges'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'dangerous patterns to avoid',
              code: `import { exec, execFile } from 'node:child_process';

// COMMAND INJECTION: name = "a.png; rm -rf /"
exec('convert ' + req.query.name + ' out.png');
// FIX: no shell, arguments passed as an array
execFile('convert', [safeName, 'out.png']);

// REGEX DENIAL OF SERVICE (ReDoS): nested quantifiers can take minutes on crafted input
const bad = /^(a+)+$/;
// FIX: avoid nested repetition; limit input length BEFORE running a regex

// PROTOTYPE POLLUTION: merging untrusted JSON into an object
// { "__proto__": { "isAdmin": true } }  can change every object in the process
// FIX: validate with a strict schema; never deep-merge raw user input into config objects

// OPEN REDIRECT: res.redirect(req.query.next) sends users to phishing sites
const allowed = ['/dashboard', '/profile'];
res.redirect(allowed.includes(req.query.next) ? req.query.next : '/dashboard');`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'CORS is **not** a server security feature — it only tells browsers whether JavaScript on another site may read your responses. Anyone can call your API directly with `curl`. Real protection is authentication, authorization, and validation. A common "fix" for CORS errors, `Access-Control-Allow-Origin: *` with credentials, is both rejected by browsers and unsafe.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Behind a proxy, set `trust proxy` to the **exact number of hops** (or a subnet), not `true`. With `true`, a client can send a fake `X-Forwarded-For` header and bypass IP-based rate limiting.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Treat security headers and rate limits as the *last* line of defence; the first lines are validated input, least-privilege database users, patched dependencies, and secrets kept out of code.',
            },
          ],
        },
        {
          id: 'logging-observability',
          title: 'Logging with Pino and Request IDs',
          summary:
            'In production you cannot attach a debugger, so logs are your eyes: write **structured JSON logs** with a fast logger like pino, attach a unique **request id** to every line, and log to stdout so the platform collects them.',
          keyPoints: [
            '**Structured logging** means each line is a JSON object (`{"level":30,"reqId":"abc","msg":"order created"}`) that tools like Datadog, ELK, or CloudWatch can search and filter — far better than free text.',
            '**pino** is a very fast Node logger; `pino-http` logs each request/response automatically; use `pino-pretty` only in development for readable output.',
            'A **request id** (correlation id) ties every log line from one request together — and can be passed to other services in a header so you can follow a request across the whole system.',
            'Use log **levels** deliberately (`error`, `warn`, `info`, `debug`) and **never log secrets**: passwords, tokens, full card numbers, or personal data — configure `redact` paths.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`console.log("here 2")` is fine for a script, but on a server handling 500 requests per second the lines of different requests are interleaved. Without a request id you cannot tell which "payment failed" belongs to which user. Structured logs with a request id turn a pile of text into a searchable timeline.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Client["Client"] -->|"x-request-id header or none"| Gen["Middleware<br/>reuse or generate request id"]
    Gen --> Child["Create child logger with reqId"]
    Child --> Handler["Route handler logs with req.log"]
    Handler --> Svc["Service logs with same reqId"]
    Handler --> Out["stdout as JSON lines"]
    Svc --> Out
    Out --> Coll["Log collector<br/>CloudWatch, Datadog, Loki"]
    Gen -->|"response header x-request-id"| Client`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'pino + pino-http with request ids and redaction',
              code: `// npm install pino pino-http   (and pino-pretty as a dev dependency)
import pino from 'pino';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['req.headers.authorization', 'req.headers.cookie', 'password', '*.password', '*.token'],
  ...(process.env.NODE_ENV !== 'production' && {
    transport: { target: 'pino-pretty' },          // human-friendly output in development only
  }),
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const id = req.headers['x-request-id'] ?? randomUUID();   // honour an upstream id if present
    res.setHeader('x-request-id', id);                         // let the client quote it in bug reports
    return id;
  },
  customLogLevel: (req, res, err) => (err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'),
});

app.use(httpLogger);                                // adds req.log, a child logger bound to this request

app.post('/orders', async (req, res) => {
  req.log.info({ userId: req.user.id, items: req.body.items.length }, 'creating order');
  try {
    const order = await orderService.create(req.user.id, req.body);
    res.status(201).json(order);
  } catch (err) {
    req.log.error({ err }, 'order creation failed');   // pino serializes err.message, stack, cause
    throw err;
  }
});`,
            },
            {
              type: 'heading',
              text: 'Using the request id in deeper code without passing it around',
            },
            {
              type: 'code',
              language: 'js',
              title: 'AsyncLocalStorage: request-scoped context',
              code: `import { AsyncLocalStorage } from 'node:async_hooks';

const als = new AsyncLocalStorage();

// middleware: everything that runs during this request can read the store
app.use((req, res, next) => {
  als.run({ reqId: req.id, userId: null }, next);
});

// deep inside a repository - no req object available, but the context follows the async calls
export function currentLogger() {
  const store = als.getStore();
  return logger.child({ reqId: store?.reqId });
}

export async function findOrder(id) {
  currentLogger().debug({ id }, 'querying order');   // includes the request id automatically
  return prisma.order.findUnique({ where: { id } });
}`,
            },
            {
              type: 'table',
              headers: ['Level', 'Use it for', 'Example'],
              rows: [
                ['`error`', 'Something failed and needs attention', 'Unhandled exception, payment provider down'],
                ['`warn`', 'Unexpected but handled', 'Retry succeeded on 2nd try, 4xx spikes'],
                ['`info`', 'Normal business events', 'Order created, server started'],
                ['`debug`', 'Detail for troubleshooting', 'SQL parameters, cache hits (off in production)'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Log lines are often kept for months and read by many people. Logging `req.body` on a login route writes passwords into your log storage. Use `redact`, log ids rather than whole objects, and treat logs as sensitive data.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Logs say *what happened*; **metrics** (request rate, error rate, latency percentiles via Prometheus) say *how often*; **traces** (OpenTelemetry) say *where time went across services*. Together they are called observability — start with good logs, add metrics next.',
            },
          ],
        },
        {
          id: 'testing-node-express',
          title: 'Testing: node:test, Jest, and Supertest',
          summary:
            'Test your API at two levels: fast **unit tests** for pure logic (services, helpers) and **integration tests** that fire real HTTP requests at your Express app with Supertest — Node now ships a built-in test runner, so you can start without installing anything.',
          keyPoints: [
            'Node 20+ includes `node:test` (`node --test`) with `describe`/`it`, hooks, mocking, and coverage (`--experimental-test-coverage`); **Jest** and **Vitest** remain popular, with richer mocking and watch UIs.',
            '**Supertest** calls your Express app *without opening a port* (`request(app).get(\'/users\')`) — this is why `app.js` and `server.js` are kept separate.',
            'Follow a **test pyramid**: many fast unit tests, a moderate number of integration tests (with a real or containerized database), few end-to-end tests.',
            'Tests must be **independent and repeatable**: reset or isolate the database between tests, mock external services (payments, email), and never depend on test order or the real clock.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    E2E["End-to-end tests<br/>real browser or deployed API, few and slow"]
    Int["Integration tests<br/>Supertest plus a real test database, moderate"]
    Unit["Unit tests<br/>services and helpers, many and fast"]
    Unit --> Int --> E2E`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'unit test with the built-in runner (no dependencies)',
              code: `// calc.js
export function orderTotal(items, discountPercent = 0) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('empty order');
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return Math.round(subtotal * (1 - discountPercent / 100) * 100) / 100;
}

// calc.test.js   ->   run with:  node --test
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { orderTotal } from './calc.js';

describe('orderTotal', () => {
  it('adds up price x quantity', () => {
    assert.equal(orderTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }]), 25);
  });
  it('applies a percentage discount', () => {
    assert.equal(orderTotal([{ price: 100, qty: 1 }], 15), 85);
  });
  it('rejects an empty order', () => {
    assert.throws(() => orderTotal([]), { message: 'empty order' });
  });
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'integration tests with Supertest and mocking',
              code: `// npm install -D supertest
import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';          // the app, NOT server.js: no port is opened
import { prisma } from '../src/db.js';
import * as emailService from '../src/email.js';

describe('POST /api/users', () => {
  before(async () => { await prisma.user.deleteMany(); });   // clean state
  after(async () => { await prisma.$disconnect(); });        // let the process exit

  it('creates a user and returns 201', async () => {
    const sendMock = mock.method(emailService, 'sendWelcome', async () => {});   // no real email

    const res = await request(app)
      .post('/api/users')
      .send({ email: 'asha@example.com', password: 'correct-horse-battery', name: 'Asha' })
      .expect(201)
      .expect('Content-Type', /json/);

    assert.equal(res.body.email, 'asha@example.com');
    assert.equal('passwordHash' in res.body, false);          // never leak the hash
    assert.equal(sendMock.mock.callCount(), 1);
  });

  it('rejects invalid input with 400 and field errors', async () => {
    const res = await request(app).post('/api/users').send({ email: 'not-an-email' }).expect(400);
    assert.equal(res.body.error.code, 'VALIDATION_FAILED');
  });

  it('returns 401 for a protected route without a token', async () => {
    await request(app).get('/api/orders').expect(401);
  });

  it('prevents reading another user\\'s order (access control)', async () => {
    const token = await loginAs('userA');
    await request(app).get('/api/orders/' + orderOfUserB.id).set('Authorization', 'Bearer ' + token).expect(404);
  });
});`,
            },
            {
              type: 'table',
              headers: ['Tool', 'Notes'],
              rows: [
                ['`node:test`', 'Built in, zero dependencies, mocking and coverage; ideal for small to medium projects'],
                ['**Jest**', 'Batteries included (mocks, snapshots, coverage); ESM support needs extra configuration'],
                ['**Vitest**', 'Jest-compatible API, fast, native ESM and TypeScript'],
                ['**Supertest**', 'HTTP assertions against an Express app; works with any of the runners above'],
                ['**Testcontainers**', 'Starts a real PostgreSQL/Redis in Docker for tests — more realistic than mocks'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A test process that never exits usually means an open handle: a database pool, Redis client, or `app.listen` left running. Close them in an `after` hook. Mocking the **database** in integration tests hides real bugs (bad SQL, missing indexes, constraint violations) — prefer a throwaway real database.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Test the unhappy paths as seriously as the happy ones: invalid input, missing auth, someone else\'s data, duplicate emails, third-party timeouts. That is where production bugs live.',
            },
          ],
        },
        {
          id: 'redis-caching-jobs',
          title: 'Redis: Caching and Background Jobs with BullMQ',
          summary:
            'Redis is a very fast in-memory data store. In a Node backend it has two big jobs: a **cache** that avoids repeating slow work, and the storage behind a **job queue** (BullMQ) that moves slow work (emails, reports, image processing) out of the request.',
          keyPoints: [
            '**Cache-aside** is the standard pattern: check Redis first; on a miss, load from the database, store the result with a **TTL** (time to live), and return it.',
            'The hard part of caching is **invalidation**: when the data changes, delete or update the cached copy — or accept staleness for a short TTL. Cache keys must include everything that changes the answer (user id, filters, page).',
            'A **queue** lets the HTTP request reply immediately ("202 Accepted") while a separate **worker** process does the slow job, with automatic **retries**, delays, and concurrency limits.',
            'Jobs can run more than once (a retry after a crash), so write them to be **idempotent** — safe to repeat — and store only small payloads (ids), not whole objects.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine a busy librarian. Fetching a popular book from the basement archive (the database) takes five minutes, so the librarian keeps copies of the most-requested books on a desk (the cache) for a day. Most requests are answered in seconds. The risk: the desk copy can be out of date if the archive version is updated. That trade-off is the whole game of caching.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant C as Client
    participant A as Express API
    participant R as Redis
    participant D as Database
    C->>A: GET /products/42
    A->>R: GET product:42
    alt cache hit
      R-->>A: cached JSON
      A-->>C: 200 fast
    else cache miss
      R-->>A: nil
      A->>D: SELECT product 42
      D-->>A: row
      A->>R: SET product:42 with TTL 300 s
      A-->>C: 200
    end`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'cache-aside with ioredis, TTL, invalidation, and stampede protection',
              code: `// npm install ioredis
import Redis from 'ioredis';
export const redis = new Redis(config.redisUrl);

const TTL_SECONDS = 300;

export async function getProduct(id) {
  const key = 'product:' + id;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);                    // HIT

  const product = await prisma.product.findUnique({ where: { id } });   // MISS: go to the database
  if (product) await redis.set(key, JSON.stringify(product), 'EX', TTL_SECONDS);
  return product;
}

export async function updateProduct(id, data) {
  const product = await prisma.product.update({ where: { id }, data });
  await redis.del('product:' + id);                         // invalidate: next read reloads fresh data
  return product;
}

// STAMPEDE: when a hot key expires, 1000 requests all miss and hit the database together.
// Fix: only one request recomputes; others briefly wait or serve stale data.
export async function getProductSafe(id) {
  const key = 'product:' + id;
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);

  const gotLock = await redis.set('lock:' + key, '1', 'EX', 10, 'NX');   // NX = only if not exists
  if (!gotLock) {
    await new Promise((r) => setTimeout(r, 100));           // someone else is loading it; retry shortly
    return getProductSafe(id);
  }
  try {
    return await getProduct(id);
  } finally {
    await redis.del('lock:' + key);
  }
}`,
            },
            {
              type: 'heading',
              text: 'Background jobs: keep slow work out of the request',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Client["Client"] -->|"POST /reports"| API["Express API"]
    API -->|"1 add job with reportId"| Q[("Redis queue<br/>BullMQ")]
    API -->|"2 respond 202 Accepted"| Client
    Q --> W1["Worker process 1"]
    Q --> W2["Worker process 2"]
    W1 --> Work["Slow task<br/>build PDF, send email"]
    W2 --> Work
    Work -->|"failed"| Retry["Retry with backoff"]
    Retry --> Q
    Work -->|"done"| Done["Save result, notify user"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'BullMQ: producer (in the API) and worker (separate process)',
              code: `// npm install bullmq
// ---- queues.js (used by the API) ----
import { Queue } from 'bullmq';
const connection = { url: config.redisUrl };

export const emailQueue = new Queue('email', { connection });

// in a route handler: enqueue and return immediately
app.post('/signup', async (req, res) => {
  const user = await userService.register(req.validated.body);
  await emailQueue.add(
    'welcome',
    { userId: user.id },                              // small payload: an id, not the whole user
    { attempts: 5, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 1000, removeOnFail: 5000 },
  );
  res.status(201).json({ id: user.id });              // user does not wait for SMTP
});

// ---- worker.js (run as its own process: node src/worker.js) ----
import { Worker } from 'bullmq';

const worker = new Worker('email', async (job) => {
  const user = await prisma.user.findUnique({ where: { id: job.data.userId } });
  if (!user || user.welcomeEmailSentAt) return;       // idempotent: safe if the job runs twice
  await mailer.sendWelcome(user.email);
  await prisma.user.update({ where: { id: user.id }, data: { welcomeEmailSentAt: new Date() } });
}, { connection, concurrency: 5 });

worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'email job failed'));

process.on('SIGTERM', async () => { await worker.close(); process.exit(0); });   // finish current jobs first`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Redis is **not** your primary database by default: unless you configure persistence it can lose data on restart, and it holds everything in RAM. Set a `maxmemory` limit with an eviction policy (`allkeys-lru` for pure caches), and never put anything in a cache that you cannot rebuild.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Cache keys that leave out context cause data leaks: caching `/me` under the key `me` serves **one user\'s profile to everyone**. Include the user id (or skip caching personalized responses), and also remember `Cache-Control: private` for HTTP-level caches.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A simple in-process `Map` cache works for a single server, but each cluster worker and each container has its own copy. Use Redis when several processes must agree.',
            },
          ],
        },
        {
          id: 'realtime-websockets-sse',
          title: 'Real-time: WebSockets, Socket.IO, and Server-Sent Events',
          summary:
            'Normal HTTP is "client asks, server answers". For live chat, notifications, or dashboards the server must push data without being asked — done with **WebSockets** (two-way), **Server-Sent Events** (one-way), or old-fashioned polling.',
          keyPoints: [
            '**WebSocket**: one long-lived connection, started with an HTTP "upgrade", through which both sides can send messages at any time — ideal for chat, collaborative editing, and games.',
            '**Server-Sent Events (SSE)**: a normal HTTP response that never ends, streaming `text/event-stream` events from server to browser — simpler than WebSockets, auto-reconnects, and perfect for notifications and progress bars.',
            '**Socket.IO** is a library on top of WebSockets that adds rooms, acknowledgements, automatic reconnection, and an HTTP fallback — convenient, but it uses its own protocol (a Socket.IO client is required).',
            'Authenticate during the **handshake**, and remember that each open connection costs memory: with multiple servers you need a shared **adapter** (Redis) so a message reaches clients connected to other servers.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Polling', 'SSE', 'WebSocket / Socket.IO'],
              rows: [
                ['Direction', 'Client asks repeatedly', 'Server -> client only', 'Both directions'],
                ['Connection', 'Many short requests', 'One long HTTP response', 'One long-lived socket'],
                ['Reconnect on drop', 'Natural', 'Built into the browser `EventSource`', 'Manual (or built into Socket.IO)'],
                ['Works through proxies', 'Always', 'Usually, but needs buffering off', 'Needs upgrade support'],
                ['Best for', 'Rare updates, simplicity', 'Notifications, live feeds, progress', 'Chat, presence, collaboration, games'],
              ],
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant B as Browser
    participant S as Node server
    B->>S: GET /socket with Upgrade websocket header
    S-->>B: 101 Switching Protocols
    Note over B,S: the same TCP connection now carries WebSocket frames both ways
    B->>S: message chat.send hello
    S-->>B: message chat.new from Asha hello
    S-->>B: message presence.update Ravi joined
    B->>S: close`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'Socket.IO chat with JWT authentication and rooms',
              code: `// npm install socket.io
import http from 'node:http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { app } from './app.js';

const httpServer = http.createServer(app);          // share one port with Express
const io = new Server(httpServer, { cors: { origin: config.corsOrigins, credentials: true } });

// Authenticate ONCE, during the handshake, before any event is processed
io.use((socket, next) => {
  try {
    const payload = jwt.verify(socket.handshake.auth.token, config.jwtAccessSecret, { algorithms: ['HS256'] });
    socket.data.userId = payload.sub;
    next();
  } catch {
    next(new Error('unauthorized'));
  }
});

io.on('connection', (socket) => {
  socket.join('user:' + socket.data.userId);        // personal room: push notifications to this user

  socket.on('room:join', async (roomId, ack) => {
    if (!(await roomService.isMember(roomId, socket.data.userId))) return ack({ ok: false });  // authorize!
    socket.join('room:' + roomId);
    ack({ ok: true });
  });

  socket.on('chat:send', ({ roomId, text }) => {
    if (typeof text !== 'string' || text.length > 2000) return;           // validate socket input too
    io.to('room:' + roomId).emit('chat:new', { from: socket.data.userId, text, at: Date.now() });
  });

  socket.on('disconnect', () => logger.info({ userId: socket.data.userId }, 'socket closed'));
});

// Anywhere else in the app, push to a user (e.g. from a queue worker or an Express route)
export const notifyUser = (userId, event, data) => io.to('user:' + userId).emit(event, data);

httpServer.listen(config.port);`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'Server-Sent Events: a progress stream in plain Express',
              code: `app.get('/jobs/:id/events', requireAuth, (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',     // tells the browser this is an event stream
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',               // nginx: do not buffer, send events immediately
  });
  res.flushHeaders();

  const send = (event, data) => res.write('event: ' + event + '\\ndata: ' + JSON.stringify(data) + '\\n\\n');

  let percent = 0;
  const timer = setInterval(() => {
    percent += 10;
    send('progress', { percent });
    if (percent >= 100) { clearInterval(timer); send('done', {}); res.end(); }
  }, 1000);

  const heartbeat = setInterval(() => res.write(': ping\\n\\n'), 25_000);  // keeps proxies from closing it

  req.on('close', () => { clearInterval(timer); clearInterval(heartbeat); });   // client left: clean up!
});

// Browser:
//   const es = new EventSource('/jobs/7/events');
//   es.addEventListener('progress', (e) => console.log(JSON.parse(e.data).percent));`,
            },
            {
              type: 'heading',
              text: 'Scaling real-time across several servers',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    U1["User A connected to server 1"] --> S1["Node server 1"]
    U2["User B connected to server 2"] --> S2["Node server 2"]
    S1 --> Bus[("Redis pub/sub<br/>Socket.IO Redis adapter")]
    S2 --> Bus
    Bus --> S1
    Bus --> S2
    LB["Load balancer<br/>sticky sessions for Socket.IO polling"] --> S1
    LB --> S2`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Forgetting cleanup is the classic real-time leak: a timer, listener, or room membership that is not removed on `close`/`disconnect` keeps running for every client that ever connected. Also, WebSocket messages **bypass your Express middleware** — you must validate and authorize each event yourself.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Pick the simplest tool: if only the server talks (notifications, live scores, long-job progress), use SSE. Reach for WebSockets/Socket.IO when the client also needs to send frequent messages.',
            },
          ],
        },
        {
          id: 'scaling-concurrency',
          title: 'Scaling and Performance: Cluster, Worker Threads, Child Processes',
          summary:
            'One Node process uses one CPU core for your JavaScript. To use all cores run several processes (**cluster**), to move CPU-heavy calculations off the event loop use **worker threads**, and to run other programs use **child processes** — and measure before optimizing.',
          keyPoints: [
            '**Cluster** (or PM2 / multiple containers) runs one Node process per CPU core, all sharing the same port; it multiplies *request* throughput but each process still has its own memory and one event loop.',
            '**Worker threads** run JavaScript in a separate thread inside the same process, ideal for CPU-heavy work (image resizing, hashing, parsing huge files) that would otherwise freeze the event loop.',
            '**Child processes** start a separate program (`ffmpeg`, `git`, a Python script) and talk to it through pipes — use `execFile`/`spawn` with an argument array, never `exec` with user input.',
            'Find the real bottleneck first: measure **event loop delay**, use `--cpu-prof` or Clinic.js flame graphs, and fix the biggest cost (usually a slow query or a missing index, not JavaScript speed).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    LB["Incoming connections on port 3000"] --> Primary["Primary process<br/>forks workers, does no request work"]
    Primary --> W1["Worker 1<br/>own event loop and memory"]
    Primary --> W2["Worker 2<br/>own event loop and memory"]
    Primary --> W3["Worker 3<br/>own event loop and memory"]
    Primary --> W4["Worker 4<br/>own event loop and memory"]
    W1 --> Shared[("Shared state lives OUTSIDE<br/>Redis and database")]
    W2 --> Shared
    W3 --> Shared
    W4 --> Shared`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'the cluster module: one worker per core, restart on crash',
              code: `import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';

if (cluster.isPrimary) {
  const cores = os.availableParallelism();
  console.log('primary', process.pid, 'starting', cores, 'workers');
  for (let i = 0; i < cores; i++) cluster.fork();

  cluster.on('exit', (worker, code) => {
    console.warn('worker', worker.process.pid, 'died with code', code, '- starting a new one');
    cluster.fork();                                   // self-healing
  });
} else {
  // each worker runs its own server; the OS/primary spreads incoming connections between them
  http.createServer((req, res) => {
    res.end('handled by pid ' + process.pid + '\\n');
  }).listen(3000);
}

// WARNING: in-memory state is NOT shared. A login stored in a plain JS Map on worker 1
// is invisible to worker 2. Keep sessions, caches and rate-limit counters in Redis.`,
            },
            {
              type: 'heading',
              text: 'CPU-heavy work: block the loop, or use a worker thread',
            },
            {
              type: 'code',
              language: 'js',
              title: 'the problem: a heavy calculation freezes every request',
              code: `import { pbkdf2Sync } from 'node:crypto';

// BAD: while this runs (about 300 ms), NO other request is served by this process
app.get('/hash-sync', (req, res) => {
  const hash = pbkdf2Sync(req.query.text, 'salt', 2_000_000, 64, 'sha512');
  res.send(hash.toString('hex'));
});

// BAD in the same way: JSON.parse on a 200 MB string, a huge regex, sorting a million rows,
// a big synchronous loop, fs.readFileSync in a handler, bcrypt.hashSync.

// The async crypto API runs on libuv's thread pool, so it does NOT block:
import { pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';
const pbkdf2Async = promisify(pbkdf2);
app.get('/hash-async', async (req, res) => {
  res.send((await pbkdf2Async(req.query.text, 'salt', 2_000_000, 64, 'sha512')).toString('hex'));
});`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'worker_threads for your own CPU-bound JavaScript',
              code: `// ---- main.js ----
import { Worker } from 'node:worker_threads';

function runInWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./heavy-worker.js', import.meta.url), { workerData: data });
    worker.once('message', resolve);                  // result posted back by the worker
    worker.once('error', reject);
    worker.once('exit', (code) => code !== 0 && reject(new Error('worker exited with ' + code)));
  });
}

app.get('/primes/:n', async (req, res) => {
  const count = await runInWorker({ limit: Number(req.params.n) });   // event loop stays free
  res.json({ count });
});

// ---- heavy-worker.js ----
import { parentPort, workerData } from 'node:worker_threads';

function countPrimes(limit) {
  let count = 0;
  for (let n = 2; n <= limit; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) { isPrime = false; break; }
    if (isPrime) count++;
  }
  return count;
}
parentPort.postMessage(countPrimes(workerData.limit));

// In production use a worker POOL (piscina) instead of starting a new thread per request.`,
            },
            {
              type: 'table',
              headers: ['Tool', 'What it is', 'Use for', 'Shares memory?'],
              rows: [
                ['**cluster / PM2 / containers**', 'Several full Node processes', 'Using all cores for request handling', 'No'],
                ['**worker_threads**', 'Extra threads in one process', 'CPU-bound JavaScript (image, parsing, crypto)', 'Optional (`SharedArrayBuffer`); messages are copied'],
                ['**child_process**', 'A separate program or Node script', 'Running `ffmpeg`, `git`, shell tools, isolating risky code', 'No (pipes / IPC)'],
                ['**Job queue workers**', 'Separate worker service', 'Long jobs that outlive a request', 'No (via Redis)'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'measuring event-loop delay (the single best Node health metric)',
              code: `import { monitorEventLoopDelay } from 'node:perf_hooks';

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  logger.info({
    eventLoopDelayP99Ms: Math.round(histogram.percentile(99) / 1e6),   // nanoseconds -> ms
    heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  }, 'runtime health');
  histogram.reset();
}, 10_000).unref();                                  // unref: this timer must not keep the process alive

// Healthy: p99 delay in the low milliseconds. Hundreds of ms = something is blocking the loop.
// Profile: node --cpu-prof server.js   (open the .cpuprofile in Chrome DevTools)
//          node --inspect server.js    (attach DevTools, take heap snapshots for memory leaks)
//          npx clinic flame -- node server.js`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Scaling out with cluster does not fix a slow database query, and worker threads do not help I/O (that is already asynchronous). Match the tool to the bottleneck: CPU-bound -> threads, not enough cores used -> cluster/containers, slow I/O -> indexes, caching, fewer round trips.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'In containers and Kubernetes the usual approach is *one Node process per container* and scale by adding containers — the orchestrator replaces `cluster`. Use `cluster`/PM2 when you manage a single VM yourself.',
            },
          ],
        },
        {
          id: 'production-ops',
          title: 'Production Readiness: Graceful Shutdown, Health Checks, Docker, PM2, Reverse Proxy',
          summary:
            'Getting an API to production safely means it must stop without dropping requests (graceful shutdown), tell the platform whether it is healthy (health checks), run in a reproducible container, restart on crashes, and sit behind a reverse proxy that handles TLS.',
          keyPoints: [
            '**Graceful shutdown**: on `SIGTERM` stop accepting new connections, let in-flight requests finish, close the database/Redis connections, then exit — otherwise every deploy drops requests mid-flight.',
            '**Health checks**: a *liveness* endpoint ("the process is up") and a *readiness* endpoint ("dependencies work, send me traffic") let load balancers and Kubernetes route traffic and restart sick instances.',
            'A good **Dockerfile** uses a small base image, installs with `npm ci --omit=dev`, runs as a **non-root user**, and runs `node` directly as PID 1 so signals reach your app.',
            'Put **nginx / a cloud load balancer** in front for TLS termination, compression, static files, request limits, and buffering; run the app with a process manager (PM2, systemd, or the container orchestrator) so crashes restart it.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'When you deploy a new version, the platform sends the old instance a `SIGTERM` signal ("please shut down") and, after a grace period (30 seconds on Kubernetes by default), a hard `SIGKILL`. If your app simply dies on `SIGTERM`, any request in progress gets a broken connection. A graceful shutdown makes deployments invisible to users.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant P as Platform or PM2
    participant A as Node app
    participant L as Load balancer
    participant D as DB and Redis
    P->>A: SIGTERM
    A->>A: set readiness to failing
    L->>A: readiness check fails, stop sending traffic
    A->>A: server.close, stop accepting new connections
    Note over A: finish in-flight requests
    A->>D: close pool and Redis connections
    A->>P: exit code 0
    Note over P,A: if still alive after grace period, platform sends SIGKILL`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'server.js: graceful shutdown with health endpoints',
              code: `import { app } from './app.js';
import { pool } from './db.js';
import { redis } from './redis.js';
import { logger } from './logger.js';
import { config } from './config.js';

let shuttingDown = false;

// LIVENESS: is the process alive? (cheap, no dependencies)
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// READINESS: can I serve real traffic right now?
app.get('/readyz', async (req, res) => {
  if (shuttingDown) return res.status(503).json({ status: 'shutting down' });
  try {
    await Promise.all([pool.query('SELECT 1'), redis.ping()]);
    res.json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ status: 'dependency down' });
  }
});

const server = app.listen(config.port, () => logger.info({ port: config.port }, 'server started'));

// keep-alive timeouts must be LONGER than the load balancer's idle timeout (often 60 s)
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'shutting down');

  const forceExit = setTimeout(() => process.exit(1), 25_000);   // safety net below the platform grace period
  forceExit.unref();

  server.close(async () => {                      // runs when all connections have ended
    await pool.end();                             // finish queries, close DB connections
    await redis.quit();
    logger.info('clean exit');
    process.exit(0);
  });
  server.closeIdleConnections();                  // do not wait for idle keep-alive sockets
}

process.on('SIGTERM', () => shutdown('SIGTERM'));   // sent by Docker / Kubernetes / PM2
process.on('SIGINT', () => shutdown('SIGINT'));     // Ctrl+C in a terminal`,
            },
            {
              type: 'code',
              language: 'dockerfile',
              title: 'a production Dockerfile (multi-stage, non-root)',
              code: `# ---- stage 1: install production dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- stage 2: final small image ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

# never run as root inside the container
USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/healthz || exit 1

# exec form, and call node directly (NOT "npm start"): npm would swallow SIGTERM
CMD ["node", "src/server.js"]

# .dockerignore must contain:  node_modules  .git  .env  tests`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    User["Users on the internet"] --> DNS["DNS and CDN"]
    DNS --> LB["Reverse proxy or load balancer<br/>nginx, ALB, Traefik<br/>TLS, gzip, rate limits"]
    LB --> A1["Node container 1"]
    LB --> A2["Node container 2"]
    LB --> A3["Node container 3"]
    A1 --> DB[("PostgreSQL")]
    A2 --> DB
    A3 --> DB
    A1 --> Cache[("Redis")]
    A2 --> Cache
    A3 --> Cache`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'PM2 process manager (when you run on a plain VM) and an nginx server block',
              code: `// ecosystem.config.cjs   ->   pm2 start ecosystem.config.cjs && pm2 save
module.exports = {
  apps: [{
    name: 'orders-api',
    script: 'src/server.js',
    instances: 'max',               // one process per CPU core (cluster mode)
    exec_mode: 'cluster',
    max_memory_restart: '600M',     // restart a leaking process before it takes the box down
    env_production: { NODE_ENV: 'production', PORT: 3000 },
    kill_timeout: 30000,            // wait up to 30 s for graceful shutdown before SIGKILL
  }],
};

/* /etc/nginx/conf.d/orders.conf  (not JavaScript - shown here for reference)
server {
  listen 443 ssl http2;
  server_name api.example.com;
  # ssl_certificate ... managed by certbot / your cloud

  client_max_body_size 10m;
  gzip on;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;             # WebSocket support
    proxy_set_header Connection "upgrade";
  }
}
*/`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`CMD ["npm", "start"]` and shell-form `CMD node server.js` put `npm`/`sh` as PID 1; they do not forward `SIGTERM` to Node, so your graceful-shutdown code never runs and Docker kills the container after 10 seconds. Use the exec form with `node` directly (or `tini`/`--init`).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Remember `app.set(\'trust proxy\', 1)` when behind nginx or a load balancer, or `req.ip`, `req.protocol`, and `secure` cookies will all be wrong. Never bake secrets into the image; inject them as environment variables at runtime.',
            },
          ],
        },
        {
          id: 'modern-node-express5',
          title: 'Modern Node.js Features and Express 5',
          summary:
            'Recent Node versions absorbed many things that used to need packages — `fetch`, a test runner, watch mode, `.env` loading, TypeScript stripping — and Express 5 finally fixed async error handling; knowing both lets you write less code with fewer dependencies.',
          keyPoints: [
            'Even-numbered Node releases become **LTS** (Long-Term Support) each October — use an active LTS in production; odd-numbered releases are short-lived "Current" versions.',
            'Built in now: global `fetch`, `node:test`, `--watch`, `--env-file`, `AbortSignal.timeout`, `structuredClone`, `import.meta.dirname`, top-level `await`, `os.availableParallelism()`, and (on recent versions) running `.ts` files with erasable syntax.',
            '**Express 5** (stable on npm\'s `latest` since 2025) requires Node 18+, forwards errors from `async` handlers automatically, and uses a stricter route-path syntax (path-to-regexp v8).',
            'Upgrading from Express 4 is mostly mechanical: named wildcards, `req.body` undefined when unparsed, removed legacy methods (`res.json(status, obj)`, `app.del`) — a codemod handles most of it.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Cur["Current release<br/>new features, about 6 months"] --> Act["Active LTS<br/>recommended for production, 12 months"]
    Act --> Maint["Maintenance LTS<br/>critical fixes only, 18 more months"]
    Maint --> EOL["End of life<br/>no security fixes"]`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'things you no longer need a package for',
              code: `// 1. HTTP client: global fetch (replaces axios / node-fetch for most cases)
const res = await fetch('https://api.example.com/users/1', {
  headers: { Accept: 'application/json' },
  signal: AbortSignal.timeout(5000),                // built-in timeout
});
if (!res.ok) throw new Error('API returned ' + res.status);   // fetch does NOT throw on 404/500!
const user = await res.json();

// 2. Test runner: node --test            (replaces mocha / jest for simple projects)
// 3. Restart on change: node --watch src/server.js    (replaces nodemon)
// 4. Load a .env file: node --env-file=.env src/server.js      (replaces dotenv)
//    or from code:     process.loadEnvFile('.env');

// 5. Deep copy: structuredClone (replaces JSON.parse(JSON.stringify(x)) and lodash cloneDeep)
const copy = structuredClone({ when: new Date(), tags: new Set(['a']) });

// 6. CLI argument parsing without a library
import { parseArgs } from 'node:util';
const { values } = parseArgs({ options: { port: { type: 'string', short: 'p', default: '3000' } } });

// 7. Top-level await in ES modules: no async main() wrapper
const config = JSON.parse(await (await import('node:fs/promises')).readFile('./config.json', 'utf8'));

// 8. Run TypeScript directly (recent versions, erasable syntax only: no enums or namespaces)
//    node src/server.ts`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'permission model: least privilege for a Node process',
              code: `# Node can restrict what a process is allowed to touch (introduced as experimental in Node 20;
# the flag was later renamed --permission - check the docs for your version).
node --permission --allow-fs-read=/app --allow-fs-write=/app/uploads src/server.js

# Without --allow-child-process, spawning "ffmpeg" or "sh" throws ERR_ACCESS_DENIED.
# Without --allow-worker, new Worker() is blocked. A compromised dependency can do less damage.`,
            },
            {
              type: 'heading',
              text: 'Express 5: what changed from Express 4',
            },
            {
              type: 'table',
              headers: ['Area', 'Express 4', 'Express 5'],
              rows: [
                ['Async errors', 'Must catch and call `next(err)` (or use a wrapper)', 'Rejected promises and thrown errors reach the error handler automatically'],
                ['Wildcard routes', '`app.get(\'/files/*\')`', '`app.get(\'/files/*path\')` — wildcards must be named (`req.params.path` is an array)'],
                ['Optional params', '`/users/:id?`', '`/users{/:id}` — braces mark optional parts'],
                ['Regex in paths', 'Many patterns allowed', 'Raw regex characters in string paths are no longer supported'],
                ['`req.body` when unparsed', '`{}`', '`undefined` — always add a body parser first'],
                ['`req.query` parser', '"extended" (qs library) by default', '"simple" (Node `querystring`) by default'],
                ['Removed', '`res.json(200, obj)`, `res.send(404)`, `app.del`, `req.param()`', 'Use `res.status(200).json(obj)`, `res.sendStatus(404)`, `app.delete`'],
                ['Node version', 'Old versions fine', 'Node 18 or newer'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'upgrading routes from Express 4 to 5',
              code: `// Express 4                                    // Express 5
app.get('/files/*', handler);                    app.get('/files/*path', handler);        // req.params.path = ['a','b']
app.get('/users/:id?', handler);                 app.get('/users{/:id}', handler);
app.get('/ab?cd', handler);                      app.get('/a{b}cd', handler);              // optional "b"

// Express 5: async handlers just work
app.get('/orders/:id', async (req, res) => {
  const order = await orderService.get(req.params.id);   // a throw here reaches errorHandler
  res.json(order);
});

// Query parsing changes: opt back in to nested parsing if you rely on ?filter[status]=open
app.set('query parser', 'extended');

// Express 5 also lets you read a possibly-missing body safely
app.post('/echo', express.json(), (req, res) => res.json(req.body ?? {}));`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Upgrade path: move to Express 4.21+ first, then `npm install express@5` and run the official codemods (`npx @expressjs/codemod upgrade`), then fix route patterns and re-run your tests. Check that third-party middleware (such as `express-async-errors`) is still needed — it is redundant on Express 5.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Because `fetch` only rejects on network failure, a `500` response resolves normally. Always check `res.ok` (or `res.status`). Also, new built-ins do not mean dropping libraries blindly: `node:test` has fewer features than Jest/Vitest, and `--watch` restarts the whole process, which can matter in larger apps.',
            },
          ],
        },
        {
          id: 'frameworks-alternatives',
          title: 'Alternatives: Fastify, NestJS, Hono — and When to Choose What',
          summary:
            'Express is the most familiar choice, but not the only one: Fastify is faster and schema-driven, NestJS adds a full structured framework, and Hono runs on any runtime including edge platforms. The best choice depends on your team and project, not on benchmarks.',
          keyPoints: [
            '**Express**: minimal, huge ecosystem, every Node developer knows it; has no built-in validation, structure, or TypeScript story — you assemble it yourself.',
            '**Fastify**: plugin-based, validates and serializes with JSON Schema (faster responses, auto-generated docs), has built-in logging (pino) and encapsulation; smaller ecosystem than Express, but mature.',
            '**NestJS**: opinionated TypeScript framework (modules, controllers, providers, dependency injection, decorators) that runs on top of Express or Fastify; great for large teams, heavier for small services.',
            '**Hono** (and similar): tiny, web-standard `Request`/`Response` API that runs on Node, Bun, Deno, Cloudflare Workers, and AWS Lambda; ideal for edge and serverless, newer ecosystem.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Express 5', 'Fastify', 'NestJS', 'Hono'],
              rows: [
                ['Philosophy', 'Minimal, bring your own', 'Fast, schema-first, plugins', 'Structured, Angular-style DI', 'Tiny, web standards, multi-runtime'],
                ['Language', 'JavaScript (TS via types)', 'JavaScript / TypeScript', 'TypeScript-first', 'TypeScript-first'],
                ['Validation', 'Add Zod/Joi yourself', 'Built in (JSON Schema, Ajv)', 'Pipes and `class-validator`', 'Validators with Zod middleware'],
                ['Performance', 'Good enough for most', 'Roughly 2 to 3 times faster in raw benchmarks', 'Depends on Express/Fastify adapter', 'Very fast, small footprint'],
                ['Learning curve', 'Lowest', 'Low to medium', 'Highest (many concepts)', 'Low'],
                ['Ecosystem', 'Largest', 'Large, growing', 'Large, official modules', 'Growing'],
                ['Best fit', 'Small and medium APIs, learning, teams that know it', 'High-throughput APIs, schema-driven services', 'Large teams, enterprise, many modules', 'Edge, serverless, multi-runtime'],
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'the same endpoint in Fastify (with built-in validation)',
              code: `// npm install fastify
import Fastify from 'fastify';

const app = Fastify({ logger: true });                 // pino logging built in

app.post('/users', {
  schema: {
    body: {
      type: 'object',
      required: ['email'],
      additionalProperties: false,
      properties: { email: { type: 'string', format: 'email' }, name: { type: 'string' } },
    },
    response: { 201: { type: 'object', properties: { id: { type: 'integer' }, email: { type: 'string' } } } },
    // the response schema also FILTERS fields (a passwordHash is never serialized) and speeds up JSON output
  },
}, async (request, reply) => {
  const user = await userService.create(request.body);   // already validated
  return reply.code(201).send(user);
});

await app.listen({ port: 3000 });                       // async handlers: return the value, errors handled for you`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'Hono and NestJS in a few lines each',
              code: `// ---- Hono (works on Node, Bun, Deno, Cloudflare Workers ...) ----
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const hono = new Hono();
hono.get('/users/:id', (c) => c.json({ id: c.req.param('id') }));
serve({ fetch: hono.fetch, port: 3000 });

// ---- NestJS (TypeScript with decorators; shown as comments because it needs a TS build) ----
// @Controller('users')
// export class UsersController {
//   constructor(private readonly users: UsersService) {}   // dependency injection
//
//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.users.findOne(id);                        // validation via pipes
//   }
//
//   @Post()
//   @UsePipes(new ValidationPipe({ whitelist: true }))
//   create(@Body() dto: CreateUserDto) { return this.users.create(dto); }
// }`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Start["New backend project"] --> Edge{"Runs on edge or serverless<br/>across many runtimes?"}
    Edge -- "yes" --> Hono["Consider Hono"]
    Edge -- "no" --> Team{"Large team wanting enforced<br/>structure and TypeScript?"}
    Team -- "yes" --> Nest["Consider NestJS"]
    Team -- "no" --> Perf{"Need top throughput or<br/>schema-driven validation?"}
    Perf -- "yes" --> Fastify["Consider Fastify"]
    Perf -- "no" --> Express["Express is a fine, safe default"]`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Honest trade-off: in most real applications the database, network, and your own code dominate response time — the framework\'s routing speed rarely matters. Benchmarks that show Fastify at 2-3 times Express measure empty "hello world" handlers. Choose on **team familiarity, structure, and ecosystem** first.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Everything you learned here — the event loop, streams, validation, auth, error handling, queues, graceful shutdown — transfers directly. Frameworks differ in syntax; the concepts are the same, so learning Express first is never wasted.',
            },
          ],
        },
      ],
    },
    {
      id: 'node-express-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary:
            'Frequently asked Node.js and Express.js interview questions, with answers that explain the reasoning rather than just the definition.',
          qa: [
            {
              question: 'What is Node.js, and why can a single-threaded server handle thousands of connections?',
              answer:
                'Node.js is a JavaScript runtime built on Google\'s V8 engine plus libuv, a C library for asynchronous I/O. Your JavaScript runs on one main thread, but that thread almost never *waits*: when you call a database or read a file, Node hands the job to the operating system (or libuv\'s thread pool) and immediately moves on to the next callback; when the result is ready, a callback is queued and run by the event loop. Most web servers spend nearly all their time waiting for I/O, so one thread juggling thousands of waiting connections is efficient and avoids the memory cost and locking complexity of one thread per connection. The trade-off is that CPU-heavy work on the main thread blocks everybody, so it must be moved to worker threads, a queue, or another service.',
            },
            {
              question: 'Explain the event loop and its phases. How do process.nextTick, promises, setTimeout, and setImmediate differ?',
              answer:
                'The event loop repeatedly cycles through phases, each with a queue of callbacks: timers (setTimeout/setInterval whose time has elapsed), pending callbacks, idle/prepare (internal), poll (retrieve and run I/O callbacks, and wait for new ones), check (setImmediate callbacks), and close callbacks. Between each callback Node drains the microtask queues: first `process.nextTick`, then promise reactions (`.then`, code after `await`). So the order is: synchronous code, nextTick, promise microtasks, and only then the next loop phase. `setTimeout(fn, 0)` runs in the timers phase after a minimum delay, while `setImmediate` runs in the check phase right after poll; from the main module their order is not guaranteed, but inside an I/O callback `setImmediate` always fires first. Over-using nextTick or endless promise chains can starve the loop because microtasks are drained completely before I/O gets a turn.',
            },
            {
              question: 'What does "blocking the event loop" mean, and how would you detect and fix it?',
              answer:
                'Because all JavaScript runs on one thread, any long synchronous operation — a huge loop, `JSON.parse` of a giant payload, `fs.readFileSync`, a catastrophic regex, a synchronous bcrypt — prevents every other request, timer, and callback from running until it finishes, so latency spikes for all users. You detect it with event-loop delay metrics (`perf_hooks.monitorEventLoopDelay`), CPU profiles (`node --cpu-prof`, Clinic.js flame graphs), and by noticing that p99 latency jumps while CPU sits at 100 percent on one core. Fixes depend on the cause: use asynchronous APIs, stream large data instead of loading it, break work into chunks that yield with `setImmediate`, move CPU-bound work to worker threads or a job queue, and bound input sizes before parsing or running regexes.',
            },
            {
              question: 'CommonJS versus ES modules: what are the differences and common pitfalls?',
              answer:
                'CommonJS uses `require()` and `module.exports`, loads modules synchronously at runtime, and provides `__dirname` and `__filename`. ES modules use static `import`/`export`, are analyzed before execution (enabling tree shaking and top-level `await`), load asynchronously, require file extensions on relative imports, and use `import.meta.dirname`/`import.meta.url` instead of `__dirname`. A file is ESM if it ends in `.mjs` or the nearest `package.json` has `"type": "module"`. Pitfalls: `require` is not defined in ESM (use `createRequire`), importing a CJS package gives you `module.exports` as the default export so named imports can fail, and `require()` of an ES module only works in newer Node versions for modules without top-level await. For new projects ESM is the right default.',
            },
            {
              question: 'What is the difference between callbacks, promises, and async/await? What is callback hell and how do you avoid it?',
              answer:
                'A callback is a function passed to be called later, with Node using the error-first convention `(err, result)`. Nesting dependent callbacks produces "callback hell": deeply indented code where each level repeats error handling. A promise represents a future value that is pending, fulfilled, or rejected, and can be chained with `.then`/`.catch` and combined with `Promise.all`. `async/await` is syntax built on promises that lets you write asynchronous code in a sequential style and handle errors with ordinary `try/catch`. An `async` function always returns a promise, and `await` pauses only that function, not the thread. A common performance mistake is awaiting independent calls one after another instead of starting them together with `Promise.all`.',
            },
            {
              question: 'How should errors be handled in a Node/Express application?',
              answer:
                'Distinguish operational errors (expected failures: invalid input, missing record, timeout, dependency down) from programmer errors (bugs such as reading a property of undefined). Operational errors are handled — converted to the right HTTP status and a safe message; programmer errors should be logged in full and the process allowed to restart, because its state may be corrupted. In Express, put a centralized error-handling middleware with four parameters `(err, req, res, next)` last; throw typed errors (`NotFoundError`, `ValidationError`) from services and map them to status codes in that one place; hide stack traces from clients; and log with a request id. Express 5 forwards thrown errors and rejected promises from async handlers automatically, while Express 4 needs `try/catch` with `next(err)` or a wrapper. Also handle `unhandledRejection` and `uncaughtException` by logging and exiting so a supervisor can restart the process.',
            },
            {
              question: 'What is middleware in Express, and why does the order matter?',
              answer:
                'Middleware is a function `(req, res, next)` that runs during the request-response cycle: it can read or change `req` and `res`, end the response, or call `next()` to pass control to the next function in the chain. Express executes middleware and routes strictly in registration order, so the order is the program logic. `express.json()` must be registered before any route that reads `req.body`; authentication must come before the routes it protects; a 404 handler goes after all routes; and the error handler goes last. If a middleware neither responds nor calls `next()`, the request hangs; if it calls `next()` after responding, later handlers may try to send a second response and cause the "headers already sent" error.',
            },
            {
              question: 'How do you structure a large Express application?',
              answer:
                'Separate responsibilities into layers and group by feature. Routers map URLs and methods to controllers; controllers handle HTTP concerns only (read `req`, call a service, write `res`); services contain business rules and know nothing about Express; repositories or an ORM handle database access. Shared concerns (auth, validation, error handling, logging) live in middleware. Split creating the app (`app.js`, exported) from starting the server (`server.js`, calls `listen`) so tests can use Supertest without opening a port. Validate configuration at startup, keep secrets in environment variables, and organize folders by feature (`users/`, `orders/`) so related code stays together. The goal is that business logic can be tested and reused without HTTP.',
            },
            {
              question: 'What are streams, and why is backpressure important?',
              answer:
                'A stream processes data in chunks instead of loading it all into memory. Node has Readable, Writable, Duplex, and Transform streams; HTTP requests and responses, files, sockets, and gzip are all streams. Backpressure happens when a producer is faster than its consumer — for example reading a file from a fast disk and writing to a slow client over the network. A writable signals "full" by returning `false` from `write()`, and the producer must pause until the `drain` event; if it ignores this, chunks pile up in memory and the process can crash. `stream.pipeline()` (or `for await` loops) handles backpressure and also destroys all streams on error, which avoids leaks. Streaming lets a server send a multi-gigabyte file using only a few megabytes of RAM.',
            },
            {
              question: 'How would you scale a Node application on a multi-core server?',
              answer:
                'One Node process runs JavaScript on one core, so you run several processes: the built-in `cluster` module or PM2 cluster mode forks one worker per core sharing a port, or — more commonly today — you run one process per container and add containers behind a load balancer. Since each process has its own memory, shared state (sessions, caches, rate-limit counters, WebSocket rooms) must move to external stores like Redis or the database, and the app should be stateless. For CPU-heavy tasks inside a process use worker threads, ideally a pool; for long jobs use a queue with separate worker processes. Before scaling out, check that the bottleneck is not a slow query or a blocked event loop, because more processes will not fix those.',
            },
            {
              question: 'When would you use worker threads, child processes, and cluster?',
              answer:
                'Cluster (or multiple containers) duplicates the whole app across processes to use more cores for handling many concurrent requests. Worker threads run extra JavaScript threads inside one process, with their own event loops, communicating by message passing or `SharedArrayBuffer` — the right tool for CPU-bound work in your own code such as image processing, large parsing, or hashing, because it keeps the main event loop responsive. Child processes launch a separate program (ffmpeg, git, a Python script) or a separate Node script and communicate through stdin/stdout or IPC; they give strong isolation and are the way to run non-Node tools, using `execFile` or `spawn` with an argument array to avoid command injection. I/O-bound work needs none of them, since async I/O already runs without blocking.',
            },
            {
              question: 'Sessions versus JWT: how do you choose, and what are the downsides of JWT?',
              answer:
                'With sessions the server stores the login state (in Redis or a database) and the browser holds only an opaque id in an httpOnly cookie; logout and revocation are instant, but each request needs a store lookup. A JWT is a signed token containing claims; any server can verify it without a lookup, which suits APIs, mobile apps, and microservices. The downsides: a JWT is valid until it expires, so you cannot easily revoke it; the payload is only encoded, not encrypted, so it must hold no secrets; and storing it in `localStorage` exposes it to XSS. The usual mitigation is a short-lived access token (about 15 minutes) plus a rotating, server-stored refresh token delivered in an httpOnly cookie, with reuse detection. For a single server-rendered or single-page app with its own backend, a plain session cookie is often simpler and safer.',
            },
            {
              question: 'How should passwords be stored, and why not use SHA-256?',
              answer:
                'Store only a password hash made with a slow, salted, purpose-built algorithm — argon2id (preferred), scrypt, or bcrypt — and verify logins by hashing the attempt and comparing. SHA-256 is designed to be fast, so an attacker who steals the database can test billions of guesses per second on GPUs; password hashes are deliberately expensive in time (and memory for argon2/scrypt) so each guess is costly. A unique random salt per password, generated automatically by these libraries, prevents rainbow tables and hides which users share a password. Also use constant-time comparison, return the same generic error for unknown email and wrong password, rate-limit login attempts, and consider MFA or delegating to an identity provider.',
            },
            {
              question: 'What is the difference between authentication and authorization? Give an example of broken access control.',
              answer:
                'Authentication verifies identity ("who are you?") and fails with 401; authorization decides permissions ("what may you do?") and fails with 403. Authorization has layers: role or permission checks (RBAC) and ownership checks on the specific record. A classic broken access control bug (IDOR, insecure direct object reference) is `GET /orders/42` that checks the user is logged in but loads the order by id without verifying it belongs to that user, so anyone can read other users\' orders by changing the number. The fix is to scope queries by the current user (`WHERE id = $1 AND user_id = $2`), return 404 for records the user cannot see, and write tests for cross-user access. Authorization must be enforced on the server; hiding UI elements is not security.',
            },
            {
              question: 'What is CORS, and does it protect my API?',
              answer:
                'CORS (Cross-Origin Resource Sharing) is a browser mechanism: by default a page loaded from one origin cannot read responses from another origin. A server opts in with headers such as `Access-Control-Allow-Origin`; for non-simple requests the browser first sends an `OPTIONS` preflight to check the method and headers are allowed. CORS does not protect your API, it only controls which web pages may read responses in a user\'s browser — anyone can call the API with curl or a script. So you still need authentication, authorization, and validation. Configure an explicit allow-list of origins, and never combine `Access-Control-Allow-Origin: *` with credentials (browsers reject it, and it would be unsafe anyway).',
            },
            {
              question: 'What security measures would you add to an Express API?',
              answer:
                'At the HTTP layer: HTTPS with a reverse proxy, `helmet` for security headers, a strict CORS allow-list, rate limiting (stricter on login and registration), body size limits, and `trust proxy` configured correctly. At the application layer: schema validation of all input with allow-listed fields, parameterized queries or an ORM to prevent SQL injection, sanitizing or encoding output to prevent XSS, ownership and role checks for access control, httpOnly/secure/sameSite cookies with CSRF protection when using cookie auth, and hashed passwords. Operationally: keep dependencies updated and audited, store secrets outside the code, run as a non-root user with least-privilege database accounts, avoid leaking stack traces, and log security events without logging secrets. The OWASP Top 10 is a good checklist.',
            },
            {
              question: 'How do you prevent SQL injection and NoSQL injection?',
              answer:
                'Injection happens when untrusted input is treated as part of a command. For SQL, never concatenate input into query strings; use parameterized queries (`$1` placeholders in `pg`) or an ORM/query builder, which send the values separately so the database never parses them as SQL. For MongoDB, the risk is operator injection: if `req.body.email` is `{ "$ne": null }`, a naive `findOne({ email })` matches any user. Validate that fields have the expected primitive types (a schema library), strip keys starting with `$`, or enable Mongoose `sanitizeFilter`. Defence in depth also includes least-privilege database users and not exposing raw database errors to clients. The same principle covers shell commands: use `execFile` with an argument array, not `exec` with a concatenated string.',
            },
            {
              question: 'What is a connection pool, and what happens if you misuse it?',
              answer:
                'Opening a database connection involves network handshakes, TLS, and authentication, so it is slow, and databases support only a limited number of simultaneous connections. A pool keeps a fixed number of open connections and lends one to each query, returning it afterwards; extra requests queue. Typical misuse: creating a new pool or ORM client per request (exhausts the database connection limit), not releasing a client obtained with `pool.connect()` (the pool drains and all requests hang), making the pool too large (each Node instance multiplies it), and holding a connection during slow non-database work. Create the pool once at startup, release clients in a `finally` block, size it conservatively (about 10 per instance), and set connection timeouts so problems fail fast.',
            },
            {
              question: 'How would you handle file uploads securely and efficiently?',
              answer:
                'Use a multipart parser such as multer or busboy, set limits on size and file count, and validate the type by checking magic bytes rather than trusting the extension or client-sent MIME type. Never use the client\'s file name to build a path (path traversal); generate your own name. Avoid buffering large files in memory: stream them to object storage like S3, or better, issue a short-lived presigned URL so the browser uploads directly to the bucket and the file never touches your server. Serve uploads from a separate domain or with `Content-Disposition: attachment` and safe content types, since uploaded HTML or SVG can execute script. Remember the reverse proxy has its own body size limit as well.',
            },
            {
              question: 'Explain cache-aside caching with Redis. What are the main risks?',
              answer:
                'In cache-aside the application checks the cache first; on a hit it returns the cached value, on a miss it loads from the database, stores the result with a TTL, and returns it. Writes update the database and then delete (or update) the cached key. Risks: stale data if invalidation is missed (mitigated with TTLs and deleting keys on writes), cache stampede when a hot key expires and many requests rebuild it at once (use locks, request coalescing, or jittered/early refresh), wrong keys that omit context such as the user id and leak one user\'s data to another, unbounded memory without a `maxmemory` and eviction policy, and treating the cache as a source of truth. The cache must always be rebuildable from the database.',
            },
            {
              question: 'When should work go to a background queue, and what must jobs guarantee?',
              answer:
                'Move work out of the request when it is slow, can fail and need retrying, depends on third parties, or does not need to complete before responding: sending email, generating reports, processing images, calling webhooks. The API enqueues a small job (with ids, not whole objects) and returns 202 or 201 quickly; separate worker processes consume the queue with concurrency limits, retries with exponential backoff, and dead-letter handling. Because delivery is typically at-least-once, a job can run twice after a crash or retry, so jobs must be idempotent (check whether the effect already happened, use unique keys). Workers should also shut down gracefully, finishing the current job on SIGTERM. BullMQ on Redis is a common Node choice.',
            },
            {
              question: 'WebSockets versus Server-Sent Events versus polling: how do you choose?',
              answer:
                'Polling means the client repeatedly asks; it is simple and works everywhere but wastes requests and adds latency. Server-Sent Events keep one HTTP response open and stream events from server to client; they are simple, reconnect automatically, and fit notifications, live feeds, and progress updates. WebSockets provide a persistent two-way channel after an HTTP upgrade, suitable for chat, collaboration, and games where the client also sends frequent messages; Socket.IO adds rooms, acknowledgements, and reconnection on top. Operationally, long-lived connections use memory, need authentication during the handshake and authorization for each event, and require a shared adapter (such as Redis pub/sub) and sticky sessions or equivalent when scaled across servers. I would choose the simplest one that meets the requirement.',
            },
            {
              question: 'How do you implement graceful shutdown, and why does it matter?',
              answer:
                'Orchestrators and process managers stop an app by sending SIGTERM and later SIGKILL after a grace period. If the app just exits, in-flight requests, queue jobs, and transactions are cut off on every deploy. A graceful shutdown listens for SIGTERM/SIGINT, marks the readiness endpoint as failing so the load balancer stops sending traffic, calls `server.close()` so no new connections are accepted while existing requests finish, then closes database pools, Redis connections, and queue workers, and exits with code 0, with a forced-exit timer slightly below the platform grace period. In Docker, run `node` directly as PID 1 with the exec-form `CMD`, because `npm start` or a shell wrapper will not forward the signal.',
            },
            {
              question: 'What is the difference between liveness and readiness health checks?',
              answer:
                'A liveness check answers "is this process alive and not deadlocked?"; if it fails the platform restarts the instance, so it should be cheap and not depend on external services (otherwise a database outage would trigger pointless restarts of every instance). A readiness check answers "can this instance serve traffic right now?" — it verifies critical dependencies such as the database and cache, and returns 503 while starting up or shutting down; if it fails, the load balancer simply stops routing requests there without killing it. Separating them prevents restart storms during dependency outages and enables zero-downtime deployments.',
            },
            {
              question: 'What changed in Express 5, and how would you upgrade from Express 4?',
              answer:
                'Express 5 requires Node 18+, forwards rejected promises and exceptions from async handlers and middleware to the error handler automatically, and upgrades to path-to-regexp v8, so route strings are stricter: wildcards must be named (`/files/*path`), optional segments use braces (`/users{/:id}`), and raw regex characters are no longer allowed. `req.body` is `undefined` when no parser ran, the default query parser is "simple", and legacy APIs such as `res.json(status, obj)`, `res.send(status)`, `app.del`, and `req.param()` were removed. To upgrade: update to the latest 4.x, run the official codemods, change route patterns, remove async wrapper hacks like `express-async-errors`, check third-party middleware compatibility, and rely on the test suite to catch behavioral differences.',
            },
            {
              question: 'How would you test an Express API?',
              answer:
                'Use a pyramid. Unit-test pure logic and services quickly with no HTTP (the layered structure makes services independent of Express). Integration-test the HTTP layer with Supertest against the exported `app`, which exercises routing, middleware, validation, auth, and error handling without opening a port — ideally against a real throwaway database (Testcontainers or a test schema) rather than mocking it, since mocks hide bad SQL and constraint errors. Mock only external services like email and payment providers. Keep tests independent by resetting data between tests, avoid reliance on real time (use fake timers), and close pools and servers so the runner exits. Cover unhappy paths: invalid input, missing or expired tokens, access to another user\'s data, and duplicates. `node:test`, Jest, or Vitest all work.',
            },
            {
              question: 'How do you debug a memory leak or high memory usage in Node?',
              answer:
                'First confirm it is a leak: watch `process.memoryUsage().heapUsed` over time after garbage collection — steady growth under constant load is a leak, while a sawtooth is normal. Then take heap snapshots with `node --inspect` and Chrome DevTools (or `v8.writeHeapSnapshot`) at different times and compare which object types grow and what retains them. Common causes in Node servers: unbounded in-memory caches or global arrays and Maps, event listeners added on every request and never removed, timers or intervals never cleared, closures holding large objects, unconsumed or unclosed streams, and per-request data stored in module scope. Fixes include bounding caches (LRU with a max size), removing listeners, clearing timers, using streams, and moving shared state to Redis. Setting a container memory limit with auto-restart is a safety net, not a fix.',
            },
            {
              question: 'Express versus Fastify versus NestJS: how would you choose?',
              answer:
                'Express is minimal, universally known, and has the largest ecosystem, which makes it a safe default for small and medium APIs and for teams that already know it, but validation, structure, and TypeScript support are things you add yourself. Fastify is schema-driven (JSON Schema validation and fast serialization), has built-in pino logging and a plugin encapsulation model, and is noticeably faster in synthetic benchmarks, which suits high-throughput services. NestJS is an opinionated TypeScript framework with modules, dependency injection, and decorators, running on Express or Fastify; it enforces consistent structure for large teams at the cost of more concepts and boilerplate. Raw framework speed rarely dominates real latency, which is usually the database, so I choose on team familiarity, structure needs, and ecosystem, and consider Hono for edge or multi-runtime deployments.',
            },
            {
              question: 'What does `npm ci` do differently from `npm install`, and why is the lockfile important?',
              answer:
                '`npm install` resolves the version ranges in `package.json` (such as `^1.4.2`), may update the lockfile, and reuses an existing `node_modules`. `npm ci` deletes `node_modules` and installs exactly what `package-lock.json` specifies, failing if the lockfile and `package.json` disagree, so it is faster, deterministic, and meant for CI and Docker builds. The lockfile records the exact resolved version and integrity hash of every direct and transitive dependency; without it two machines (or two builds a day apart) can install different versions and produce bugs that only appear in production, or pull in a compromised release. Commit the lockfile, use `npm ci --omit=dev` for production images, and review dependency updates with `npm audit` and tools like Dependabot.',
            },
            {
              question: 'What is the difference between `process.nextTick()` and `setImmediate()`, and when would you ever use either?',
              answer:
                '`process.nextTick(fn)` queues `fn` in the nextTick queue, which Node drains immediately after the current operation completes — before promise microtasks and before the event loop continues to any next phase. `setImmediate(fn)` queues `fn` for the check phase of the current loop iteration, after pending I/O callbacks have had their turn. Their names are famously swapped relative to behavior: nextTick fires "more immediately". In application code you rarely need nextTick; it exists mainly for library authors who must emit an event or invoke a callback asynchronously after the constructor returns so callers can attach listeners. `setImmediate` is useful for breaking a long synchronous task into chunks that yield to I/O between slices. Recursive nextTick calls can starve I/O, which is why `setImmediate` is the safer yielding mechanism.',
            },
          ],
        },
      ],
    },
  ],
}
