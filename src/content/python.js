export const pythonSection = {
  id: 'python',
  label: 'Python',
  icon: '🐍',
  groups: [
    {
      id: 'python-guide',
      label: 'Guide',
      topics: [
        {
          id: 'interview-layers',
          title: 'How Python Backend Interviews Are Layered',
          summary:
            'Expect four layers in roughly this order: Python language internals, concurrency models, framework-specific reasoning, and applied API design.',
          keyPoints: [
            'Layer 1 — Python language internals: the GIL, memory model, mutable-default-argument traps.',
            'Layer 2 — concurrency models: threading vs multiprocessing vs asyncio, and when each actually helps.',
            'Layer 3 — framework-specific reasoning: why FastAPI\'s dependency injection exists, why Flask\'s request context works the way it does.',
            'Layer 4 — applied API design: build a paginated endpoint, handle a long-running task, structure a production-grade project layout.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Python backend interviews rarely stay at "do you know the syntax." The four layers interviewers move through are: **(1) Python language internals** (GIL, memory model, mutable-default-argument traps — the things that separate "knows Python syntax" from "understands the runtime"), **(2) concurrency models** (threading vs multiprocessing vs asyncio — when each actually helps), **(3) framework-specific reasoning** (why FastAPI\'s dependency injection exists, why Flask\'s request context works the way it does), and **(4) applied API design** (build a paginated endpoint, handle a long-running task, structure a production-grade project layout).',
            },
            {
              type: 'heading',
              text: 'Practice prompts worth rehearsing out loud',
            },
            {
              type: 'list',
              items: [
                'Implement a rate limiter as FastAPI middleware/dependency.',
                'Design a background job system with retries using Celery.',
                'Implement an async, connection-pooled DB access layer.',
                'Explain how you\'d add request tracing/correlation IDs across an async call chain.',
                'Implement a custom Pydantic validator for cross-field validation.',
                'Design a file upload endpoint with streaming, avoiding loading a huge file fully into memory.',
                'Explain how you\'d structure a large FastAPI project (routers, dependency layering, settings management via `pydantic-settings`).',
              ],
            },
          ],
        },
        {
          id: 'gil',
          title: 'The GIL — What It Actually Constrains',
          summary:
            'The Global Interpreter Lock means threading doesn\'t speed up CPU-bound Python code, but it\'s still the right tool for I/O-bound work.',
          keyPoints: [
            'Only one thread executes Python bytecode at a time within a process — CPU-bound threads take turns, they don\'t run in parallel.',
            'The GIL is released during blocking I/O, so threading (and asyncio) genuinely help I/O-bound workloads.',
            'CPU-bound work needs multiprocessing (separate GIL per process) or a native extension that releases the GIL internally (e.g. NumPy).',
            'Python 3.13+ free-threaded builds (PEP 703) are an experimental, opt-in step toward removing the GIL for genuine multi-core parallelism.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The **Global Interpreter Lock** ensures only one thread executes Python bytecode at a time within a single process, even on a multi-core machine. This means **threading does not speed up CPU-bound work** in CPython — two threads doing pure computation run essentially sequentially, taking turns holding the GIL. Threading *does* help for **I/O-bound work** (network calls, file I/O, DB queries) because the GIL is released during blocking I/O operations, letting other threads run while one waits — this is the single most important GIL fact interviewers test, usually via "why doesn\'t adding threads speed up my CPU-heavy function?"',
            },
            {
              type: 'list',
              items: [
                '**CPU-bound work** → use **multiprocessing** (separate processes, each with its own GIL and memory space, genuinely parallel on multiple cores) or offload to a native extension/library that releases the GIL internally (NumPy, for instance, releases it during heavy array operations).',
                '**I/O-bound work** → use **threading** or, better in modern Python, **asyncio** (single-threaded cooperative concurrency, avoiding thread overhead and context-switching cost entirely for I/O-bound workloads).',
                '**Python 3.13+ free-threaded builds** (PEP 703, an opt-in "no-GIL" build) are worth naming as the forward-looking answer to "will this always be true" — an experimental, opt-in build variant as of its introduction, not yet the default, but it signals where CPython is heading for genuine multi-core parallelism without multiprocessing\'s memory-isolation overhead.',
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph CPUBound["CPU-bound work"]
        direction LR
        Threading1[Threading] -->|GIL serializes execution| NoSpeedup[No real speedup]
        Multiprocessing[Multiprocessing] -->|separate GIL per process| RealSpeedup[Genuine parallelism]
    end
    subgraph IOBound["I/O-bound work"]
        direction LR
        Threading2[Threading] -->|GIL released during I/O wait| Concurrency1[Good concurrency]
        Asyncio[Asyncio] -->|cooperative, no thread overhead| Concurrency2[Best concurrency/resource ratio]
    end`,
            },
          ],
        },
        {
          id: 'asyncio-event-loop',
          title: 'Asyncio — The Event Loop Model',
          summary:
            'A single-threaded event loop runs one coroutine at a time, and concurrency comes entirely from overlapping wait time — exactly the profile of I/O-bound web backends.',
          keyPoints: [
            'A coroutine voluntarily yields control at every `await`; nothing runs in true parallel, concurrency comes from overlapping wait time.',
            'A blocking call inside an `async def` function blocks the *entire* event loop, not just that coroutine.',
            'Calling an `async def` function without `await` just creates a coroutine object that silently does nothing.',
            '`asyncio.create_task(...)` without keeping a reference risks the task being garbage-collected mid-execution.',
            'Sequential `await` in a loop runs coroutines one at a time; `asyncio.gather(*coros)` runs them concurrently.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`asyncio` provides single-threaded **cooperative multitasking**: an event loop runs one coroutine at a time, and a coroutine voluntarily yields control (at every `await` point) back to the loop, which then runs another ready coroutine. Nothing runs in true parallel — the concurrency comes entirely from overlapping *waiting* time (e.g., while one coroutine awaits a network response, the loop runs another coroutine that\'s ready to proceed), which is exactly the profile of I/O-bound web backend workloads (mostly waiting on DB queries, external API calls, disk I/O).',
            },
            {
              type: 'heading',
              text: 'Common async pitfalls, precisely the ones interviewers plant in code review',
            },
            {
              type: 'list',
              items: [
                '**Blocking calls inside an async function**: calling a synchronous, blocking library (e.g. the classic `requests.get()`, or `time.sleep()`) inside an `async def` function blocks the *entire event loop*, not just that coroutine — every other coroutine waiting to run is stalled for the duration, defeating the entire point of async. The fix: use an async-native library (`httpx.AsyncClient`, `asyncpg`), or run the blocking call in a thread pool executor (`asyncio.to_thread` in modern Python) so it doesn\'t block the loop itself.',
                '**Forgetting to `await`**: calling an `async def` function without `await` doesn\'t execute it — it just creates a coroutine object that silently does nothing unless awaited or scheduled, a common source of "why didn\'t this run" bugs with no error raised.',
                '**Fire-and-forget tasks without a reference**: `asyncio.create_task(coro())` without keeping a reference to the returned task risks the task being garbage-collected mid-execution (Python\'s own docs warn about this) — always keep a reference (e.g., in a set) until the task completes, or explicitly await it.',
                '**Sequential `await` when concurrency was intended**: `await`ing several independent coroutines one after another in a loop runs them sequentially; wrapping them in `asyncio.gather(*coros)` runs them concurrently — the exact same conceptual bug as the `Promise.all` vs sequential-`await` distinction in JavaScript, and a frequent live-coding correction point.',
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'sequential vs concurrent awaits',
              code: `import asyncio, httpx

# BUGGY: sequential, takes sum of all request times
async def fetch_all_sequential(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient() as client:
        results = []
        for url in urls:
            resp = await client.get(url)
            results.append(resp.json())
        return results

# FIXED: concurrent, takes roughly the time of the SLOWEST request
async def fetch_all_concurrent(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient() as client:
        responses = await asyncio.gather(*(client.get(url) for url in urls))
        return [r.json() for r in responses]`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A blocking call inside an `async def` handler doesn\'t just slow down that one request — it stalls every other in-flight request being served by that same event loop for the duration of the block.',
            },
          ],
        },
        {
          id: 'mutable-defaults-and-references',
          title: 'Mutable Default Arguments & Python\'s Reference Model',
          summary:
            'Default argument values are evaluated once at function-definition time, not per call — the root cause of one of Python\'s most common "surprise" bugs.',
          keyPoints: [
            'A function\'s default argument values are created once, at definition time, and shared across every call that doesn\'t override them.',
            'Fix: use `None` as a sentinel and create the real default fresh inside the function body.',
            'Assignment binds a name to an object; it doesn\'t copy the object — this is why in-place mutation is visible to every reference.',
            'Mutable (list, dict, set) vs immutable (int, str, tuple); `is` checks identity, `==` checks value equality.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'the classic trap, and the fix',
              code: `# BUGGY: the default list is created ONCE, at function definition time,
# and is SHARED and MUTATED across every call that doesn't pass its own.
def add_item(item, items=[]):
    items.append(item)
    return items

add_item(1)  # [1]
add_item(2)  # [1, 2]  <- surprise, the same list persisted!

# FIXED: use None as a sentinel, create a fresh list inside the function.
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items`,
            },
            {
              type: 'p',
              text: 'A function\'s default argument values are evaluated exactly once, at function *definition* time, not on each call — the resulting object (e.g. an empty list) is created once and stored as part of the function object itself. Every subsequent call that doesn\'t explicitly pass its own value for that parameter receives a reference to that *same* persisted object, so any in-place mutation (like `.append()`) accumulates across calls instead of starting fresh each time.',
            },
            {
              type: 'heading',
              text: 'Everything is an object; variables are references',
            },
            {
              type: 'p',
              text: 'Assignment binds a name to an object; it doesn\'t copy the object. This is why mutable default arguments misbehave, and why passing a list into a function and mutating it in place affects the caller\'s list, while reassigning the parameter name inside the function does not. **Mutable vs immutable**: lists, dicts, sets are mutable (in-place changes visible to all references); ints, strings, tuples are immutable (any "modification" actually creates a new object). Know `is` (identity — same object in memory) vs `==` (equality — same value) as a related, frequently tested distinction — `a is b` can be `True` for small integers/interned strings due to CPython implementation details (an interpreter optimization, not a language guarantee), a classic "why did this work by accident" gotcha.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never use a mutable object (list, dict, set) as a default argument value unless you specifically intend it to be shared and mutated across every call — which is almost never what you want.',
            },
          ],
        },
        {
          id: 'decorators-and-context-managers',
          title: 'Decorators & Context Managers',
          summary:
            'Two of the most-tested Python mechanisms: decorators wrap behavior without touching source, and context managers guarantee cleanup runs no matter how the block exits.',
          keyPoints: [
            'A decorator is a higher-order function that wraps another function to extend its behavior without modifying its source.',
            '`functools.wraps` preserves the wrapped function\'s `__name__`/`__doc__` — omitting it silently breaks introspection and debugging.',
            'The `with` statement guarantees cleanup code runs even if an exception occurs inside the block.',
            '`@contextlib.contextmanager` turns a generator function into a context manager without a manual `__enter__`/`__exit__` class.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A decorator is a higher-order function that wraps another function to extend its behavior without modifying its source — the mechanism underlying `@app.route`, `@app.get`, `@property`, `@staticmethod`, `@lru_cache`, and any custom logging/timing/auth-check wrapper.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a timing decorator',
              code: `import functools
import time

def timed(func):
    @functools.wraps(func)  # preserves the wrapped function's __name__/docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@timed
def slow_query():
    ...`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`functools.wraps` is the detail interviewers specifically check for — omitting it silently replaces the wrapped function\'s metadata (`__name__`, `__doc__`) with the wrapper\'s own, breaking introspection, debugging output, and any framework that relies on function metadata.',
            },
            {
              type: 'heading',
              text: 'Context managers',
            },
            {
              type: 'p',
              text: 'The `with` statement guarantees cleanup code runs even if an exception occurs inside the block — implemented via `__enter__`/`__exit__` (or, more concisely, `@contextlib.contextmanager` around a generator function). The canonical case for understanding *why* this matters: a file handle or DB connection acquired without a context manager can leak if an exception is raised between acquisition and a manual `.close()` call; `with` makes that leak structurally impossible by running `__exit__` unconditionally on the way out of the block, exception or not.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a transactional context manager',
              code: `from contextlib import contextmanager

@contextmanager
def db_transaction(connection):
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()`,
            },
          ],
        },
        {
          id: 'generators-typing-and-dataclasses',
          title: 'Generators, Type Hints & Dataclasses',
          summary:
            'A generator holds constant memory regardless of dataset size; type hints are metadata, not runtime enforcement, unless something like Pydantic validates them.',
          keyPoints: [
            'A generator (`yield`) produces values lazily, holding only current state in memory — constant footprint vs a list\'s linear-in-size footprint.',
            'Reach for a generator when the dataset is large/unbounded and can be consumed one item at a time.',
            'Type hints are not enforced at runtime by the interpreter — they\'re metadata for static checkers and frameworks like Pydantic.',
            '`@dataclass` auto-generates `__init__`/`__repr__`/`__eq__`; `frozen=True` for immutability, `field(default_factory=list)` fixes the mutable-default problem for dataclasses.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A generator function (using `yield`) produces values lazily, one at a time, holding only the current position and local state in memory — instead of a list comprehension, which builds and holds the entire result in memory at once. For large or unbounded datasets (streaming a huge file line by line, paginating through millions of DB rows), a generator\'s constant memory footprint versus a list\'s linear-in-size footprint is the concrete, quantifiable reason to prefer it — a frequent "how would you process a 10GB file without running out of memory" prompt.',
            },
            {
              type: 'heading',
              text: 'Type hints and runtime validation',
            },
            {
              type: 'p',
              text: 'Type hints (`def f(x: int) -> str`) are not enforced at runtime by the interpreter itself — they\'re metadata consumed by static type checkers (mypy, pyright) and by frameworks like FastAPI/Pydantic that explicitly perform runtime validation using them. Know this distinction cold: a plain type-hinted function will happily accept and run with a wrong-typed argument at runtime with no error, unless something (Pydantic, an explicit `isinstance` check) actually validates it.',
            },
            {
              type: 'heading',
              text: '`*args`/`**kwargs` and dataclasses',
            },
            {
              type: 'p',
              text: '`@dataclass` auto-generates `__init__`, `__repr__`, and `__eq__` from declared fields, reducing boilerplate for simple data-holding classes — know `frozen=True` for immutability and `field(default_factory=list)` as the dataclass-native solution to the mutable-default-argument problem.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`*args` collects extra positional arguments into a tuple, `**kwargs` collects extra keyword arguments into a dict — both are how decorators (see the previous topic) can wrap a function of any signature transparently.',
            },
          ],
        },
        {
          id: 'fastapi-pydantic-validation',
          title: 'FastAPI — Pydantic Validation Is the Foundation',
          summary:
            'Request/response bodies are declared as Pydantic models, which act as the single source of truth for validation, serialization, and the auto-generated docs.',
          keyPoints: [
            'FastAPI uses the type hints on Pydantic models to validate incoming JSON before your handler code runs.',
            'A malformed request is rejected with a detailed 422 error automatically — no manual `if` checks needed.',
            'The same model definitions drive request validation, response serialization, and the OpenAPI schema/`/docs`.',
            'One source of truth instead of three independently-drifting artifacts (validation logic, serialization logic, hand-written docs).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'FastAPI\'s request/response bodies are declared as Pydantic models; FastAPI uses the type hints on those models to automatically validate incoming JSON (rejecting malformed requests with a detailed 422 error before your handler code ever runs), serialize responses, and generate an OpenAPI schema and interactive docs (`/docs`) — all from the same single source of truth (the model definitions), rather than separately maintaining validation logic, serialization logic, and API documentation by hand as three independently-drifting artifacts.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a validated create-user endpoint',
              code: `from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field, EmailStr

app = FastAPI()

class UserCreate(BaseModel):
    email: EmailStr
    age: int = Field(gt=0, le=150)

class UserOut(BaseModel):
    id: int
    email: EmailStr

@app.post("/users", response_model=UserOut, status_code=201)
async def create_user(payload: UserCreate):
    # payload is already validated and correctly typed here —
    # invalid input never reaches this line; FastAPI returns a 422
    # with field-level error detail automatically.
    user = await save_user(payload)
    return user`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A constraint change (e.g. `age: int = Field(gt=0)`) is applied and reflected everywhere derived from that model automatically — validation, serialization, and the generated docs never drift apart because they all read from the same model.',
            },
          ],
        },
        {
          id: 'fastapi-dependency-injection',
          title: 'FastAPI Dependency Injection & the Request Lifecycle',
          summary:
            '`Depends()` makes a route\'s actual dependencies explicit and composable; `yield`-based dependencies are FastAPI\'s request-scoped context managers.',
          keyPoints: [
            '`Depends()` lets you declare reusable, composable request-handling logic (auth, DB session, pagination) once and inject it per-route.',
            'FastAPI resolves the full dependency graph automatically per request, including dependencies of dependencies.',
            'A `yield`-based dependency runs its setup before `yield` and its teardown after, in a `finally`, guaranteeing cleanup even on error.',
            '`async def` handlers run on the event loop; plain `def` handlers run in FastAPI\'s thread pool, isolating blocking code from the loop.',
            '`BackgroundTasks` runs in-process after the response is sent — it is not a durable, retrying task queue.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'FastAPI\'s `Depends()` system lets you declare reusable, composable pieces of request-handling logic (auth, DB session acquisition, pagination parameters, rate limiting) once and inject them into any route that needs them, with FastAPI resolving the dependency graph (including dependencies of dependencies) automatically per-request.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'composable auth + DB dependencies',
              code: `from fastapi import Depends, Header, HTTPException

async def get_db():
    db = SessionLocal()
    try:
        yield db  # code after yield runs as teardown, like a context manager
    finally:
        db.close()

async def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db),
) -> User:
    token = authorization.removeprefix("Bearer ")
    user = await verify_token_and_load_user(token, db)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user

@app.get("/me")
async def read_current_user(user: User = Depends(get_current_user)):
    return user

@app.get("/me/orders")
async def read_orders(
    user: User = Depends(get_current_user),  # reused, no duplicated auth logic
    db: Session = Depends(get_db),
):
    return await get_orders_for_user(db, user.id)`,
            },
            {
              type: 'p',
              text: '**Why this beats decorator-based or middleware-based auth for per-route granularity**: middleware applies globally (or via broad path matching) and doesn\'t naturally support *different* routes needing *different combinations* of dependencies (some routes need auth + DB, some need just DB, some need neither) with each dependency\'s own typed return value flowing directly into the handler\'s parameters, fully visible to static analysis and the auto-generated docs. A dependency that itself has parameters (like `get_current_user` depending on `get_db`) composes automatically — FastAPI resolves the whole graph once per request and can even cache a dependency\'s result within that request if it\'s used multiple times (default behavior, overridable).',
            },
            {
              type: 'heading',
              text: 'The `yield`-based dependency as a request-scoped context manager',
            },
            {
              type: 'p',
              text: 'A dependency using `yield` (as `get_db` does above) is FastAPI\'s request-scoped equivalent of a context manager: the code before `yield` runs at request start, the code after runs at request end (in a `finally`, guaranteeing cleanup even if the handler raises) — this is the standard, correct pattern for anything needing setup/teardown per request (DB sessions, transaction boundaries, acquiring/releasing a resource), mirroring `contextlib.contextmanager` applied at the request-lifecycle level.',
            },
            {
              type: 'heading',
              text: 'Async vs sync route handlers',
            },
            {
              type: 'p',
              text: '`async def` route handlers run directly on the event loop (correct for I/O-bound work using async-native libraries) — but blocking synchronous code inside one blocks the whole event loop for every concurrent request being served. Plain `def` route handlers are automatically run by FastAPI in an external thread pool, so a blocking synchronous call inside them doesn\'t block the main event loop (other requests keep being served by other threads) — but you then get thread-pool concurrency limits and overhead instead of async\'s lighter-weight cooperative concurrency. The rule to state precisely: use `async def` when everything inside is async-native (or CPU-trivial); use plain `def` when the handler necessarily calls blocking/synchronous code (a legacy sync DB driver, a CPU-bound computation) you haven\'t converted to async, so FastAPI can isolate that blocking work in a thread rather than stalling the whole server.',
            },
            {
              type: 'heading',
              text: 'Background tasks vs a real task queue',
            },
            {
              type: 'p',
              text: 'FastAPI\'s `BackgroundTasks` runs a function after the response has been sent, within the same process — good for lightweight, best-effort work (sending a confirmation email, writing a log entry) where losing the task on a process restart/crash is an acceptable risk. It is **not** a durable task queue: there\'s no retry on failure, no persistence if the process dies mid-task, and no ability to distribute work across multiple worker processes/machines. For anything that must survive a crash, needs retries, or needs to scale independently of the web server, the correct answer is a real task queue (Celery, or a cloud-native equivalent like SQS + a worker fleet) — naming this distinction unprompted is a strong signal that you understand `BackgroundTasks`\' actual guarantees rather than just its API.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: '`BackgroundTasks` is appropriate only for work where losing it occasionally is a genuinely acceptable, low-stakes outcome — it has no persistence and no retries.',
            },
          ],
        },
        {
          id: 'flask-fundamentals',
          title: 'Flask — The Older, More Manual Model (and Why That\'s Sometimes Right)',
          summary:
            'Flask\'s context-local globals and WSGI foundation trade explicitness for convenience — a genuine, legitimate choice for the right kind of project.',
          keyPoints: [
            '`current_app`/`request`/`g` are context-local proxies (via `contextvars`) resolving to the right object per request without explicit parameter threading.',
            'That implicit, global-like state can make testing and reasoning about a function\'s dependencies harder than FastAPI\'s explicit `Depends()`.',
            'Flask is WSGI (synchronous, one request per worker) by default; FastAPI is ASGI (async-native) — scaling WSGI means adding more workers.',
            'Flask ships minimal and relies on extensions (Flask-SQLAlchemy, Flask-Login); FastAPI bundles opinionated, integrated defaults.',
            'Flask remains the right choice for server-rendered apps, teams without an async-concurrency need, or large existing Flask investments.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Flask uses a **context-local** pattern (`current_app`, `request`, `g`) — global-looking proxy objects that actually resolve to the correct object for the current request/thread under the hood, implemented via Python\'s `contextvars` (or, historically, thread-locals). This lets code deep in a call stack access `request.args` without the request object being explicitly threaded through every function call — convenient, but it\'s genuine implicit global-like state that can make testing and reasoning about a function\'s actual dependencies harder than FastAPI\'s explicit `Depends()` injection, which is the core philosophical difference between the two frameworks worth naming when asked to compare them.',
            },
            {
              type: 'heading',
              text: 'WSGI (synchronous) vs ASGI (async-native)',
            },
            {
              type: 'p',
              text: '**WSGI** (Web Server Gateway Interface, Flask\'s traditional foundation) handles one request per worker thread/process synchronously, blocking for the full duration of each request — scaling concurrency means adding more worker processes/threads (via Gunicorn/uWSGI), each with real memory/OS overhead. **ASGI** (Asynchronous Server Gateway Interface, FastAPI\'s foundation, also usable by newer Flask versions) supports async handlers natively, allowing a single worker to hold many concurrent I/O-bound requests in flight cooperatively, which is far more resource-efficient for I/O-heavy workloads at scale — though for CPU-bound or already-fast synchronous workloads, the difference matters much less, and WSGI\'s simpler mental model (no `async`/`await` discipline required anywhere in the codebase) is a genuine, legitimate reason some teams still choose Flask for services that aren\'t I/O-concurrency-bound.',
            },
            {
              type: 'heading',
              text: 'Extensions vs. built-in batteries',
            },
            {
              type: 'p',
              text: 'Flask deliberately ships minimal (routing + WSGI glue), relying on an extension ecosystem (Flask-SQLAlchemy, Flask-Login, Flask-Migrate, Flask-RESTful) to add validation, ORM integration, auth, etc. — giving maximal flexibility in how a project is assembled, at the cost of more upfront decisions and potential inconsistency across projects/teams in how those pieces are wired together. FastAPI bundles opinionated, integrated defaults (Pydantic validation, dependency injection, automatic docs) as first-class framework features — faster to get a consistent, well-documented API up correctly, at the cost of being more opinionated about how validation/DI should work if a project\'s needs diverge from FastAPI\'s model.',
            },
            {
              type: 'heading',
              text: 'When Flask is still the right choice',
            },
            {
              type: 'p',
              text: 'Existing large Flask codebases (rewrite cost rarely justified by framework preference alone), server-rendered (Jinja2-templated) traditional web apps rather than JSON APIs (Flask\'s templating story is more mature/idiomatic for this than FastAPI\'s, which is API-first), teams that value WSGI\'s simpler synchronous mental model and don\'t have an I/O-concurrency bottleneck that async would meaningfully address, or a need for a specific mature Flask extension with no equally mature FastAPI equivalent. The honest, senior-level answer to "FastAPI vs Flask" is never "FastAPI is strictly better" — it\'s "FastAPI wins for new, I/O-heavy JSON APIs that benefit from built-in validation/docs/async; Flask remains reasonable for server-rendered apps, teams without an async-concurrency need, or existing investment."',
            },
          ],
        },
        {
          id: 'case-study-paginated-api',
          title: 'Case Study: Designing a Production-Grade Paginated, Filterable API Endpoint',
          summary:
            'A common "show me you can build a real endpoint, not just a hello-world" prompt — cursor pagination, bounded page size, and layered dependencies.',
          keyPoints: [
            'Constraints on `limit` (`ge=1, le=100`) prevent a client from requesting an unbounded page size that could degrade DB performance.',
            'Cursor-based pagination stays O(limit) regardless of position and stays correct under concurrent inserts, unlike LIMIT/OFFSET.',
            'An optional filter modeled as a plain string trades validation/docs strictness for not having to redeploy when valid values grow.',
            'Dependency injection cleanly separates auth, DB access, and pagination parsing so each is independently testable and reusable.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'a paginated, filterable orders endpoint (condensed)',
              code: `from fastapi import FastAPI, Depends, Query
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"

class PaginationParams(BaseModel):
    cursor: Optional[str] = None
    limit: int = Field(default=20, ge=1, le=100)

def pagination_params(
    cursor: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
) -> PaginationParams:
    return PaginationParams(cursor=cursor, limit=limit)

class PaginatedOrders(BaseModel):
    items: list[OrderOut]
    next_cursor: Optional[str]

@app.get("/orders", response_model=PaginatedOrders)
async def list_orders(
    status: Optional[str] = Query(None, description="Filter by order status"),
    sort: SortOrder = Query(SortOrder.desc),
    pagination: PaginationParams = Depends(pagination_params),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Cursor-based, not offset-based -- stays O(limit) regardless of
    # position and stays correct under concurrent inserts, unlike LIMIT/OFFSET.
    orders, next_cursor = await fetch_orders_page(
        db, user_id=user.id, status=status, sort=sort,
        cursor=pagination.cursor, limit=pagination.limit,
    )
    return PaginatedOrders(items=orders, next_cursor=next_cursor)`,
            },
            {
              type: 'heading',
              text: 'Design points worth narrating out loud',
            },
            {
              type: 'list',
              items: [
                'Input validation and constraints (`ge=1, le=100` on `limit`) prevent a client from requesting an unbounded page size that could degrade DB performance.',
                'Cursor-based (not offset-based) pagination, for correctness under concurrent inserts and consistent performance regardless of position.',
                '`status` is modeled as a plain string with a description rather than an enum, since the underlying valid values are expected to grow without a code deploy — a real tradeoff to name: an enum gives better validation/docs but couples the API contract tightly to a fixed value set.',
                'Dependency injection cleanly separates auth (`get_current_user`), DB access (`get_db`), and pagination parameter parsing (`pagination_params`), so each is independently testable and reusable across other endpoints without duplicating logic.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'python-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'Ten Python/FastAPI/Flask interview questions with full-depth answers, covering the GIL, async, framework internals, and API design.',
          qa: [
            {
              question: 'Why doesn\'t adding more threads speed up a CPU-bound Python function, and what\'s the actual fix?',
              answer:
                'The GIL ensures only one thread executes Python bytecode at any instant within a process, so CPU-bound threads take turns rather than running in parallel — adding more threads to CPU-bound work adds context-switching overhead without adding real throughput, and can even make it slightly slower. The fix is multiprocessing (each process gets its own Python interpreter and GIL, achieving genuine parallelism across CPU cores at the cost of higher memory usage and the need to serialize data passed between processes), or delegating the CPU-heavy portion to a library that releases the GIL internally during its native/compiled computation (e.g., NumPy for numerical work).',
            },
            {
              question: 'Explain why a blocking call inside an `async def` function is worse than the equivalent blocking call in a synchronous Flask/WSGI handler.',
              answer:
                'In a synchronous WSGI model, each request is already handled by its own worker thread/process, so one request blocking doesn\'t prevent other *concurrent* requests (served by other workers) from proceeding — you pay for concurrency via more OS threads/processes. In an async event loop, a single thread is cooperatively multiplexing potentially hundreds of concurrent requests; a blocking call inside any one coroutine monopolizes that single thread and stalls the entire event loop, meaning every other in-flight request — not just the one that made the blocking call — stops making progress for the duration of the block. This is why "just add `async def`" without also using async-native libraries throughout can make an application\'s *worst-case* latency dramatically worse than the synchronous version it replaced, despite async\'s better best-case throughput.',
            },
            {
              question: 'Walk through the mutable default argument bug and explain precisely why it happens (not just that it happens).',
              answer:
                'A function\'s default argument values are evaluated exactly once, at function *definition* time, not on each call — the resulting object (e.g., an empty list) is created once and stored as part of the function object itself. Every subsequent call that doesn\'t explicitly pass its own value for that parameter receives a reference to that *same* persisted object, so any in-place mutation (like `.append()`) accumulates across calls instead of starting fresh each time, since there\'s only ever one such default object in existence for the function\'s entire lifetime. The fix (`None` as sentinel, create the real default inside the function body) works because it moves the object\'s creation to call time, giving each call its own fresh object.',
            },
            {
              question: 'What\'s the practical difference between FastAPI\'s `Depends()`-based dependency injection and Flask\'s `g`/`current_app` context-local pattern?',
              answer:
                '`Depends()` makes a route\'s actual dependencies explicit in its function signature — reading the signature alone tells you everything the handler needs (auth, a DB session, query parameters), and each dependency\'s return value is directly and statically type-checkable as a parameter. Flask\'s `g`/`current_app`/`request` proxies are implicit, ambient, context-local globals — a function deep in the call stack can silently read `g.user` or `request.headers` without that dependency being visible anywhere in its signature, which makes it harder to know a function\'s full set of inputs just by reading its definition, and correspondingly harder to unit test in isolation (you often need to push a real or fake application/request context just to call the function at all, versus FastAPI\'s dependencies being directly overridable per-test via `app.dependency_overrides`).',
            },
            {
              question: 'Why is `BackgroundTasks` in FastAPI not a substitute for a real task queue like Celery, specifically?',
              answer:
                '`BackgroundTasks` executes the function within the same process, after the response is sent, with no persistence — if the process crashes or restarts between the response being sent and the background task completing, the task is simply lost with no record it was ever supposed to run, and there\'s no built-in retry mechanism if it fails. A real task queue persists the task (in a broker like Redis/RabbitMQ) before acknowledging it, so a worker crash means the task is picked up again by another worker rather than silently disappearing, supports configurable retries with backoff, and lets task execution scale independently across a fleet of worker processes/machines rather than being tied to the web server process\'s own capacity. `BackgroundTasks` is appropriate only for work where losing it occasionally is a genuinely acceptable, low-stakes outcome.',
            },
            {
              question: 'In the paginated orders endpoint example, why is the pagination logic extracted into its own dependency function rather than declared as parameters directly on the route?',
              answer:
                'Extracting `pagination_params` into its own dependency makes pagination parsing/validation reusable verbatim across every endpoint that needs pagination (orders, users, products, etc.) without duplicating the same `Query(...)` declarations and constraints on each route, and FastAPI\'s dependency system means it\'s independently unit-testable (you can call `pagination_params` directly with test inputs) and independently overridable in tests (`app.dependency_overrides[pagination_params] = ...`) without needing to spin up a full request against a specific route. It\'s the direct FastAPI-native application of the same "extract shared responsibility instead of duplicating it" principle, applied at the API layer instead of the class layer.',
            },
            {
              question: 'What\'s the concrete difference in guarantees between using a generator and a list comprehension when processing a very large file, and when would you actually need the generator\'s guarantee?',
              answer:
                'A list comprehension eagerly evaluates and holds every produced item in memory simultaneously — for a file with millions of lines, the resulting list\'s memory footprint scales linearly with the file size, and can exhaust available memory well before processing finishes if the file is large enough. A generator produces one item at a time, holding only the current item and minimal iteration state in memory regardless of how many items exist overall — the memory footprint stays constant. You need this guarantee specifically when the total dataset size is large enough (or unbounded, as in a live stream) that materializing it all at once genuinely risks memory exhaustion, and when the consuming code can process items one at a time without needing random access or the full collection simultaneously (e.g., streaming line-by-line transformation, versus needing to sort the entire dataset, which does require having it all available at once regardless).',
            },
            {
              question: 'Why does FastAPI\'s automatic validation via Pydantic reduce bugs compared to manually validating a request body with `if` statements in a Flask route?',
              answer:
                'Manual `if`-statement validation in each route handler is duplicated per-endpoint, easy to forget a field or a constraint on any given route, and drifts silently out of sync with the actual API documentation (which then has to be maintained separately, by hand, and can lie about what\'s actually enforced). Pydantic models declared once and reused as FastAPI\'s `response_model`/body-parameter types are the single source of truth for validation, serialization, *and* the auto-generated OpenAPI docs simultaneously — a constraint change (e.g., `age: int = Field(gt=0)`) is applied and reflected everywhere derived from that model automatically, and a request that violates it is rejected with a structured, consistent 422 error before any handler code runs, rather than depending on every route author remembering to check it correctly and consistently by hand.',
            },
            {
              question: 'When would you deliberately choose a plain `def` route handler over `async def` in FastAPI, even in an otherwise async-native codebase?',
              answer:
                'When the handler necessarily calls a blocking, synchronous dependency you don\'t control or haven\'t converted to an async equivalent — a legacy synchronous ORM/DB driver without an async variant, a synchronous third-party SDK, or a genuinely CPU-bound computation. FastAPI automatically runs plain `def` handlers in an external thread pool rather than directly on the event loop, so that blocking call stalls only its own worker thread, not the shared event loop serving every other concurrent request — deliberately choosing `def` here isolates unavoidable blocking work rather than accidentally stalling the whole server by wrapping it in `async def` and calling blocking code inside it anyway, which would be strictly worse than either pure option.',
            },
            {
              question: 'Explain how you\'d add correlation/request IDs for tracing a request across an async call chain in FastAPI, and why this is slightly trickier than in a synchronous framework.',
              answer:
                'In a synchronous, one-thread-per-request model (classic Flask/WSGI), a thread-local variable set at request start naturally stays associated with that request for its entire lifetime, since the thread never handles another request concurrently. In an async event loop, a single thread interleaves many concurrent requests\' coroutines, so a naive thread-local would leak/mix values across unrelated concurrent requests. The correct tool is Python\'s `contextvars.ContextVar`, which is coroutine-aware — each `async def` call chain (including tasks spawned from it) that hasn\'t explicitly copied a new context sees the value set in its own logical execution context, correctly isolating one request\'s correlation ID from another\'s even while both run concurrently on the same thread. A FastAPI middleware typically sets the `ContextVar` at request start (generating or extracting an incoming correlation ID header) and a logging filter reads it to attach the ID to every log line emitted during that request\'s processing, including from deeply nested async calls.',
            },
          ],
        },
      ],
    },
  ],
}
