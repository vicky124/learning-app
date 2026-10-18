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
          id: 'what-is-python',
          title: 'What Is Python, and What Is It Optimizing For?',
          summary:
            'Python is a high-level, dynamically-typed, interpreted language that trades raw execution speed for readability and developer productivity — nearly every other design choice follows from that trade-off.',
          keyPoints: [
            'Interpreted: source is compiled to bytecode, then run by the CPython virtual machine — there is no separate ahead-of-time compile-to-native-machine-code step.',
            'Dynamically typed: a variable\'s type is determined at runtime by whatever object it currently refers to, never declared upfront.',
            '\'Batteries included\' standard library plus PyPI, a third-party ecosystem covering nearly every domain (web, data, ML, scripting, automation).',
            'The Zen of Python (`import this`) codifies the design philosophy: readability counts, explicit is better than implicit, there should be one obvious way to do it.',
            'CPython is the reference implementation nearly everyone means by \'Python\'; PyPy, GraalPy, and MicroPython are alternative implementations with different trade-offs.',
            'Modern CPython (3.11+) specializes bytecode at runtime based on observed types, and ships an experimental JIT — "interpreted" no longer means "naively interpreted".',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Python is deliberately optimized for **developer time**, not CPU time. It reads close to pseudocode, has minimal ceremony (no mandatory type declarations, no braces, significant whitespace instead of explicit block delimiters), and a standard library plus package ecosystem that means most problems are a `pip install` away from solved. The cost of that convenience is real: Python is markedly slower than compiled, statically-typed languages for raw CPU-bound work, which is exactly why performance-critical Python code often drops down to a C extension (NumPy, Pydantic\'s Rust core) rather than trying to out-optimize the interpreter in pure Python.',
            },
            {
              type: 'heading',
              text: 'From source to execution',
            },
            {
              type: 'p',
              text: 'Running a `.py` file is a two-stage process: CPython first compiles the source into **bytecode** (a compact, portable instruction set — visible via `dis.dis()`, and cached on disk as `.pyc` files under `__pycache__/` so re-imports skip recompilation), then the **Python Virtual Machine** executes that bytecode instruction by instruction. This is the same shape as the JVM/Java model, and it\'s why "Python is interpreted" is a slight oversimplification — it\'s compiled to bytecode first, then interpreted, rather than compiled straight to the CPU\'s native machine code the way C or Rust is.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Source[".py source file"] -->|"compile()"| Bytecode["bytecode\\n(.pyc, cached)"]
    Bytecode -->|"interpreted, one instruction at a time"| PVM["Python Virtual Machine\\n(CPython's eval loop)"]
    PVM --> Output["program behavior"]`,
            },
            {
              type: 'heading',
              text: 'The Zen of Python',
            },
            {
              type: 'p',
              text: 'Typing `import this` in any Python interpreter prints the **Zen of Python** — 19 aphorisms that genuinely shape the language\'s design and the community\'s code-review norms, not just a joke Easter egg. A few worth internalizing: **"Explicit is better than implicit"** (why Python avoids hidden magic like implicit type coercion between very different types), **"Simple is better than complex"** and **"There should be one — and preferably only one — obvious way to do it"** (why Python resists adding many overlapping syntaxes for the same operation), and **"Readability counts"** (why significant whitespace and minimal punctuation are a deliberate choice, not an accident).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'seeing the bytecode a function actually compiles to',
              code: `import dis

def add(a, b):
    return a + b

dis.dis(add)
# Representative output (exact opcode names change between releases --
# e.g. 3.13+ fuses the two loads into a LOAD_FAST_LOAD_FAST superinstruction):
#   RESUME                   0
#   LOAD_FAST                0 (a)
#   LOAD_FAST                1 (b)
#   BINARY_OP                0 (+)
#   RETURN_VALUE
# This is what actually runs, one instruction at a time, inside the
# Python Virtual Machine -- the .py source is never executed directly.`,
            },
            {
              type: 'heading',
              text: 'The interpreter is not static: specialization and the JIT',
            },
            {
              type: 'p',
              text: 'Since 3.11, CPython\'s eval loop is a **specializing adaptive interpreter** (PEP 659): after an instruction has run a few times, it is rewritten in place to a specialized variant based on the types it actually saw — a generic `BINARY_OP` that keeps adding two ints becomes an int-specific fast path, and a `LOAD_ATTR` on the same class becomes a cached slot lookup. If the types change, the instruction de-optimizes back to the generic form. This is why "monomorphic" code (the same types flowing through the same lines) is measurably faster in modern CPython, and why 3.11 was roughly 1.25x faster than 3.10 on the standard benchmark suite without any change to your code. On top of that, 3.13 added an **experimental copy-and-patch JIT** (off by default, and still experimental in current releases) that stitches pre-compiled machine-code templates for hot traces — promising, but not yet something to plan production performance around.',
            },
            {
              type: 'table',
              headers: ['Implementation', 'What it is', 'When you would pick it'],
              rows: [
                ['CPython', 'Reference implementation in C; bytecode VM + specializing interpreter', 'The default for essentially everything; widest C-extension compatibility'],
                ['PyPy', 'Tracing JIT compiler written in RPython', 'Long-running, pure-Python, CPU-bound workloads; lags CPython on newest language versions'],
                ['GraalPy', 'Python on the GraalVM (JVM ecosystem)', 'Embedding Python inside JVM applications'],
                ['MicroPython / CircuitPython', 'Tiny subset for microcontrollers', 'Embedded and hardware projects'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'CPython is the reference implementation and what \'Python\' means by default. Interviews almost always mean CPython unless stated otherwise — its GIL, reference counting, memory model and bytecode are CPython implementation details, not guarantees of the language spec. Code that depends on them (for example, relying on a file being closed the instant its last reference disappears) can behave differently on PyPy.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Since 3.13 the interactive REPL (`python` with no arguments) is a new PyPy-derived implementation with multi-line editing, colored output, history browsing, and paste mode (F3) — so you no longer need IPython just to edit a multi-line function interactively. Set `PYTHON_BASIC_REPL=1` to fall back to the old one.',
            },
          ],
        },
        {
          id: 'modern-python-releases',
          title: 'Modern Python: What Changed from 3.11 to 3.15',
          summary:
            'Python ships a new feature release every October with roughly five years of support each — knowing what landed in the last few releases is how you tell current best practice from tutorials written for a Python that no longer exists.',
          keyPoints: [
            'Annual cadence (PEP 602): a new 3.x every October, about two years of bugfix releases followed by security-only fixes, roughly five years in total.',
            '3.11–3.12 were the "speed and ergonomics" releases: specializing interpreter, exception groups and `except*`, `TaskGroup`, `tomllib`, the `type` statement and PEP 695 generics, f-string grammar formalization.',
            '3.13 brought the new interactive REPL, an experimental free-threaded (no-GIL) build, an experimental JIT, and removed the "dead batteries" modules (PEP 594).',
            '3.14 made free-threading officially supported (still optional), added template strings (t-strings), deferred evaluation of annotations, `concurrent.interpreters`, and Zstandard compression.',
            '3.15 (October 2026) adds explicit lazy imports, UTF-8 as the default text encoding, a built-in `frozendict`, and a new `profiling` package with a sampling profiler.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A senior Python engineer is expected to know roughly which version introduced which capability, because it dictates what your code can use: a library that supports 3.10+ cannot use `TaskGroup` or `except*`; a service pinned to 3.12 cannot rely on t-strings. Python follows a predictable **annual release cycle** (PEP 602): each October brings a new minor version, which gets about two years of full bugfix releases and then security-only patches until roughly five years after release. The practical rule for applications is to run the newest release your dependencies support; the practical rule for libraries is to support every version that is not end-of-life.',
            },
            {
              type: 'table',
              headers: ['Version', 'Headline changes worth knowing'],
              rows: [
                ['3.11 (2022)', 'Specializing adaptive interpreter (~25% faster on average), fine-grained error locations in tracebacks, `ExceptionGroup` and `except*`, `asyncio.TaskGroup` and `asyncio.timeout()`, `tomllib`, `typing.Self`'],
                ['3.12 (2023)', 'PEP 695 `type` statement and `class Box[T]:` generic syntax, PEP 701 f-strings (any nesting/quotes allowed), `@typing.override`, inlined comprehensions (PEP 709), per-interpreter GIL in the C API, `distutils` removed'],
                ['3.13 (2024)', 'New colorful multi-line REPL, experimental free-threaded build (`python3.13t`), experimental JIT, PEP 594 dead batteries removed (`cgi`, `telnetlib`, `crypt`, ...), `TypeIs`, TypeVar defaults, `copy.replace()`'],
                ['3.14 (2025)', 'Free-threaded build officially supported (PEP 779), template strings / t-strings (PEP 750), deferred annotations + `annotationlib` (PEP 649/749), `concurrent.interpreters` (PEP 734), `compression.zstd`, asyncio introspection CLI, `forkserver` default start method on Linux'],
                ['3.15 (2026)', '`lazy import` (PEP 810), UTF-8 mode on by default (PEP 686), built-in `frozendict` (PEP 814), `profiling.sampling` sampling profiler (PEP 799), unpacking in comprehensions (PEP 798)'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'a few modern idioms side by side',
              code: `# 3.12+: generic syntax and type aliases without TypeVar boilerplate
type UserId = int
def first[T](items: list[T]) -> T | None:
    return items[0] if items else None

# 3.11+: structured concurrency and exception groups
import asyncio
async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(fetch("a"))
            tg.create_task(fetch("b"))
    except* TimeoutError as eg:
        print(f"{len(eg.exceptions)} fetches timed out")

# 3.14+: template strings return a Template object, not a str
from string.templatelib import Template
name = "O'Brien"
t = t"SELECT * FROM users WHERE name = {name}"
assert isinstance(t, Template)   # a library can now escape/parameterize {name} safely

# 3.15+: explicit lazy imports -- the module loads on first attribute access
lazy import json`,
            },
            {
              type: 'heading',
              text: 'Deprecated and removed: things you should stop writing',
            },
            {
              type: 'table',
              headers: ['Old habit', 'Status', 'Use instead'],
              rows: [
                ['`from distutils import ...`', 'Removed in 3.12', '`setuptools`, or a modern build backend declared in `pyproject.toml`'],
                ['`import cgi`, `telnetlib`, `crypt`, `imp`, `asynchat`, `asyncore`, `smtpd`', 'Removed (3.12/3.13)', '`email`/`multipart` parsing, `asyncio`, `importlib`, third-party packages'],
                ['`datetime.utcnow()` / `utcfromtimestamp()`', 'Deprecated since 3.12', '`datetime.now(timezone.utc)` — aware datetimes'],
                ['`python setup.py install` / `setup.py develop`', 'Deprecated by setuptools', '`pip install .` / `uv pip install -e .` with `pyproject.toml`'],
                ['`typing.List`, `Dict`, `Optional[X]`', 'Still work, but legacy', '`list[int]`, `dict[str, int]`, `X | None`'],
                ['`asyncio.get_event_loop()` at top level to run code', 'Discouraged', '`asyncio.run(main())`'],
                ['`open(path)` assuming the platform encoding', 'UTF-8 by default from 3.15', 'Always pass `encoding="utf-8"` explicitly in code that must run on older versions'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Free-threading and the JIT are the two features most often over-claimed. As of the current releases, the default CPython download still has a GIL; the free-threaded build is a separate, officially supported but opt-in interpreter (`python3.14t`), and the JIT remains experimental. Say exactly that in an interview rather than "Python removed the GIL".',
            },
          ],
        },
        {
          id: 'variables-and-objects',
          title: 'Variables, Dynamic Typing & Everything Is an Object',
          summary:
            'A Python variable is a name bound to an object, not a labeled box holding a value — that one mental model explains mutation, aliasing, and function-argument passing all at once.',
          keyPoints: [
            'Assignment binds a *name* to an *object*; it never copies the object — `a = b` makes `a` point at the same object `b` points at.',
            'Every value in Python — including functions, classes, and modules — is an object with a type, an identity, and a reference count.',
            'Mutable objects (list, dict, set, and custom classes by default) can change in place; immutable objects (int, float, str, tuple, frozenset) cannot — any "change" creates a new object.',
            '`is` compares identity (same object in memory, `id(a) == id(b)`); `==` compares value equality (`__eq__`) — they agree for immutables holding equal values but diverge for distinct mutable objects with equal contents.',
            'Function arguments are passed by "assignment" (often called pass-by-object-reference): the parameter name is bound to the same object the caller passed — mutating it in place affects the caller, reassigning the parameter name does not.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Think of a Python variable as a **sticky note with a name on it, placed on an object** — not a box that contains a value. `x = [1, 2, 3]` creates a list object somewhere in memory and sticks the note `x` onto it. `y = x` does not copy the list; it places a second note, `y`, on the *same* object. From that point on, `x` and `y` are two names for one object — mutating it through either name is visible through both.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Names["names (the sticky notes)"]
      X["x"]
      Y["y"]
    end
    subgraph Heap["objects in memory"]
      L["list object\\n[1, 2, 3]\\nid: 0x7f...  refcount: 2"]
    end
    X --> L
    Y --> L`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'aliasing vs reassignment',
              code: `x = [1, 2, 3]
y = x                # y is now another name for the SAME list object
y.append(4)
print(x)              # [1, 2, 3, 4]  <- visible through x too, same object

y = [9, 9, 9]         # this REBINDS the name y to a brand-new object
print(x)              # [1, 2, 3, 4]  <- unaffected; x still points at the original`,
            },
            {
              type: 'heading',
              text: 'Mutable vs immutable',
            },
            {
              type: 'table',
              headers: ['Immutable', 'Mutable'],
              rows: [
                ['`int`, `float`, `bool`, `complex`', '`list`, `dict`, `set`'],
                ['`str`, `bytes`, `tuple`, `frozenset`', 'most user-defined classes, by default'],
                ['"changing" one always creates a new object', 'in-place methods (`.append`, `.update`) mutate the existing object'],
                ['safe to share freely across functions/threads', 'aliasing means an in-place mutation is visible everywhere it\'s referenced'],
              ],
            },
            {
              type: 'heading',
              text: '`is` vs `==`, and function arguments',
            },
            {
              type: 'p',
              text: '`==` asks "do these have equal value" (it calls `__eq__`); `is` asks "are these literally the same object in memory" (it compares `id()`). Two separately-constructed lists with identical contents are `==` but not `is`. CPython additionally **interns** small integers (-5 to 256) and some string literals as a memory optimization, so `a = 5; b = 5; a is b` often prints `True` — this is an implementation detail, not a language guarantee, and relying on `is` for value comparison on anything but `None`/`True`/`False`/enum members is a classic bug. This same reference model explains argument passing: a parameter name is bound to whatever object the caller passed (not a copy of it), so mutating that object in place inside the function is visible to the caller, but rebinding the parameter name to a new object inside the function is not — it only changes what the *local* name points to.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never use `is` to compare values (`if x is 5` instead of `if x == 5`) — it can silently work by accident thanks to integer/string interning and then silently break for a value just outside the interned range. Use `is` only for identity checks that are meant to be identity checks: `if x is None`, `if x is True`. Since 3.8 the compiler even emits a `SyntaxWarning` for `is` against a literal.',
            },
            {
              type: 'heading',
              text: 'Under the hood: what an object actually is in CPython',
            },
            {
              type: 'p',
              text: 'Every CPython object begins with a common header (`PyObject`): a **reference count** and a pointer to its **type object**. The type object is what defines behavior — which `__add__`, `__eq__`, `__hash__` and so on apply — which is why "dynamic typing" really means "types belong to objects, not to names". A name in a function is just a slot in the frame\'s local array holding a pointer; rebinding it changes the pointer, never the object. An `int` is a full heap object (28 bytes for a small one on 64-bit builds, per `sys.getsizeof(1)`), which is the fundamental reason a Python `list` of a million ints uses far more memory than a NumPy array of the same values: the list holds a million pointers to a million separate objects, while the array holds raw machine integers contiguously.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'inspecting identity, type and references',
              code: `import sys

x = [1, 2, 3]
y = x
print(id(x) == id(y))        # True -- same object
print(type(x), type(type(x)))  # <class 'list'> <class 'type'>
print(sys.getrefcount(x))    # 3: x, y, and the temporary argument reference

# copying is always explicit
import copy
nested = [[1, 2], [3, 4]]
shallow = nested.copy()          # new outer list, SAME inner lists
deep = copy.deepcopy(nested)     # recursively independent
shallow[0].append(99)
print(nested[0])                 # [1, 2, 99] -- shared inner list mutated
print(deep[0])                   # [1, 2]`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Since 3.12 (PEP 683) some objects — `None`, `True`, `False`, small ints, interned strings — are **immortal**: their refcount is pinned and never changes. That removes cache-line contention on hot shared objects (important for multiple interpreters and the free-threaded build), and is why `sys.getrefcount(None)` now returns a huge constant instead of a meaningful number.',
            },
          ],
        },
        {
          id: 'core-data-structures',
          title: 'Core Data Structures — List, Tuple, Dict & Set',
          summary:
            'Four built-in containers cover almost every data-shaping need in Python — picking the right one is mostly about mutability, ordering, uniqueness, and what operation you\'ll do most.',
          keyPoints: [
            '`list` — ordered, mutable, allows duplicates; the general-purpose sequence, O(1) append/index, O(n) search/insert-at-front.',
            '`tuple` — ordered, immutable, allows duplicates; cheaper than a list and hashable (usable as a dict key/set member) if its contents are.',
            '`dict` — ordered (insertion order, guaranteed since 3.7) key→value mapping; O(1) average lookup/insert/delete by key.',
            '`set`/`frozenset` — unordered, unique elements only; O(1) average membership test, and the natural tool for de-duplication and set algebra.',
            'Dict keys and set members must be hashable, which means effectively immutable — this is why you can\'t use a list as a dict key, but a tuple works fine.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Structure', 'Ordered?', 'Mutable?', 'Duplicates?', 'Typical use'],
              rows: [
                ['`list`', 'Yes', 'Yes', 'Yes', 'A general sequence you\'ll iterate, index, or grow'],
                ['`tuple`', 'Yes', 'No', 'Yes', 'A fixed-shape record (a coordinate pair, a DB row), or a hashable key'],
                ['`dict`', 'Yes (insertion order)', 'Yes', 'Duplicate values fine, keys unique', 'Lookup by key — the workhorse of most real programs'],
                ['`set`', 'No', 'Yes', 'No — auto-deduplicated', 'Membership tests, de-duplication, set algebra (union/intersection)'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'each structure doing what it\'s for',
              code: `# list: ordered, growable
users = ["alice", "bob"]
users.append("carol")

# tuple: fixed shape, hashable if contents are
point = (3, 4)
seen_points = {point}          # a tuple CAN be a set member; a list can't

# dict: O(1) average lookup by key
user_by_id = {1: "alice", 2: "bob"}
user_by_id[3] = "carol"

# set: uniqueness + fast membership + set algebra
active = {1, 2, 3}
admins = {2, 3, 4}
print(active & admins)          # {2, 3} -- intersection
print(active | admins)          # {1, 2, 3, 4} -- union
print(active - admins)          # {1} -- difference`,
            },
            {
              type: 'heading',
              text: 'Why hashability gates dict keys and set membership',
            },
            {
              type: 'p',
              text: 'A `dict`/`set` is backed by a **hash table**: inserting a key computes `hash(key)` to pick a bucket, so lookup is O(1) average instead of scanning every entry. That only works if a key\'s hash never changes for as long as it lives in the table — which is why only **hashable** objects (immutable ones: `int`, `str`, `tuple` of hashables, `frozenset`) can be keys. `list`, `dict`, and `set` are unhashable precisely because they\'re mutable — if you mutated a list after using it as a key, its hash would change and the table would no longer be able to find it, silently corrupting lookups. Python enforces this by raising `TypeError: unhashable type` upfront rather than allowing that corruption.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Key["key: 'alice'"] -->|"hash('alice')"| HashVal["hash value, e.g. 4821...92"]
    HashVal -->|"mod table size"| Bucket["bucket #4"]
    Bucket --> Lookup["found in one step —\\nno scanning other buckets"]
    Mutation["if the key could change\\nafter insertion..."] -.->|"hash would change too"| Broken["table looks in the OLD bucket,\\nkey is gone — corrupted lookup"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A quick rule of thumb: reach for a `dict` the moment you catch yourself writing a loop to find something "matching an ID"; reach for a `set` the moment you catch yourself writing `if x not in some_list` inside a loop (that\'s O(n) per check on a list, O(1) average on a set).',
            },
            {
              type: 'heading',
              text: 'Complexity cheat sheet and how the implementations really work',
            },
            {
              type: 'table',
              headers: ['Operation', 'list', 'dict / set', 'collections.deque'],
              rows: [
                ['append / add at end', 'O(1) amortized', 'O(1) average', 'O(1)'],
                ['insert / pop at front', 'O(n) — shifts every element', 'n/a', 'O(1)'],
                ['index by position', 'O(1)', 'n/a', 'O(n) in the middle'],
                ['`x in container`', 'O(n) scan', 'O(1) average', 'O(n) scan'],
                ['delete by key / value', 'O(n)', 'O(1) average', 'O(n)'],
                ['sort', 'O(n log n) Timsort/Powersort, stable', 'n/a (use `sorted()`)', 'n/a'],
              ],
            },
            {
              type: 'p',
              text: 'A `list` is a dynamic array of pointers that over-allocates when it grows (roughly 12.5% extra plus a constant), which is why `append` is amortized O(1) but inserting at index 0 is O(n). A `dict` (since 3.6) is a **compact hash table**: a dense array of `(hash, key, value)` entries in insertion order, plus a sparse index table of small integers pointing into it. That design is why dicts preserve insertion order for free and use 20–25% less memory than the older layout. Collisions are resolved by open addressing with perturbed probing, so a pathological set of keys with colliding hashes degrades lookups toward O(n) — this is exactly why `str`/`bytes` hashing is randomized per process (`PYTHONHASHSEED`), to defeat hash-flooding denial-of-service attacks.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'the specialized containers in collections',
              code: `from collections import deque, Counter, defaultdict, OrderedDict

queue = deque(maxlen=1000)        # O(1) at both ends; bounded ring buffer
queue.append("job-1"); queue.popleft()

words = "the cat and the hat".split()
Counter(words).most_common(1)     # [('the', 2)]

graph = defaultdict(list)         # missing keys get a fresh list automatically
graph["a"].append("b")

lru = OrderedDict()               # still useful: move_to_end() + popitem(last=False)
lru["k"] = 1; lru.move_to_end("k")`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Using `list.pop(0)` or `list.insert(0, x)` as a queue is a classic accidental O(n²): each call shifts every remaining element. Use `collections.deque` for FIFO queues, `heapq` for priority queues, and `queue.Queue`/`asyncio.Queue` when producers and consumers are in different threads or tasks.',
            },
          ],
        },
        {
          id: 'control-flow',
          title: 'Control Flow — Conditionals, Loops & the `for`/`while`…`else` Clause',
          summary:
            'Python\'s control-flow syntax looks familiar coming from any C-like language, with two genuinely distinctive features: significant whitespace instead of braces, and a `for`/`while`…`else` clause most languages don\'t have.',
          keyPoints: [
            'Blocks are delimited by indentation, not braces — consistent indentation is not a style preference, it is the syntax.',
            '`for` iterates over any iterable directly (no manual index bookkeeping needed); `while` runs until a condition is falsy.',
            'A loop\'s `else` clause runs only if the loop completed *without* hitting a `break` — a clean way to express "search, and do X only if not found".',
            'Structural pattern matching (`match`/`case`, Python 3.10+) destructures a value against shape-based patterns, going beyond a simple switch.',
            '`break` exits the loop entirely; `continue` skips to the next iteration; both work the same in `for` and `while`.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'the familiar shapes',
              code: `for user in users:                 # iterate directly over the collection
    print(user)

for i, user in enumerate(users):    # need the index too? enumerate(), don't hand-roll a counter
    print(i, user)

i = 0
while i < len(users):
    print(users[i])
    i += 1`,
            },
            {
              type: 'heading',
              text: 'The `else` clause on loops — a genuinely under-used feature',
            },
            {
              type: 'p',
              text: 'A `for` or `while` loop can carry an `else` block that runs **only if the loop finished normally, without a `break`**. It\'s the cleanest built-in way to express "search for something, and only if it truly wasn\'t found do the fallback" — without a separate `found = False` flag variable to track and check afterward.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Start(["for item in items:"]) --> Check{"items left\\nto iterate?"}
    Check -- yes --> Body["run loop body"]
    Body --> Match{"break hit?"}
    Match -- yes --> Done1["loop exits\\n(else SKIPPED)"]
    Match -- no --> Check
    Check -- no, exhausted --> ElseBlock["else block runs"]
    ElseBlock --> Done2["loop exits"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'for/else instead of a manual found-flag',
              code: `def find_first_admin(users):
    for user in users:
        if user.role == "admin":
            print(f"found: {user.name}")
            break
    else:
        # runs ONLY if the loop never hit break -- i.e. no admin was found
        print("no admin in this list")`,
            },
            {
              type: 'heading',
              text: 'Structural pattern matching (`match`/`case`)',
            },
            {
              type: 'p',
              text: 'Introduced in Python 3.10, `match` goes beyond a C-style `switch`: patterns can destructure sequences, dicts, and objects by shape, bind variables out of the match, and combine with guards. It\'s especially useful for handling shaped data — parsed JSON, command dispatch, AST-like structures — more declaratively than a chain of `isinstance`/`if` checks.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'match/case destructuring',
              code: `def handle_event(event: dict):
    match event:
        case {"type": "click", "x": x, "y": y}:
            print(f"click at ({x}, {y})")
        case {"type": "key", "key": key} if key in ("q", "Escape"):
            print("quit requested")
        case {"type": "key", "key": key}:
            print(f"key pressed: {key}")
        case _:
            print("unhandled event")`,
            },
            {
              type: 'p',
              text: 'Patterns are tried top to bottom and the first match wins. Mapping patterns match if the listed keys exist (extra keys are ignored); sequence patterns match lists and tuples but deliberately **not** `str`/`bytes`; class patterns like `Point(x=0, y=y)` call `isinstance` and then read attributes, with positional sub-patterns mapped through the class\'s `__match_args__` (generated automatically by `@dataclass`). Under the hood `match` compiles to ordinary type checks and attribute/key lookups — it is not a jump table, so a long `match` over plain values is no faster than an `if`/`elif` chain; choose it for readability on *shaped* data.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'class patterns, or-patterns, and the capture-pattern trap',
              code: `from dataclasses import dataclass
from enum import Enum

@dataclass
class Point:
    x: float
    y: float

class Color(Enum):
    RED = 1
    GREEN = 2

def describe(shape):
    match shape:
        case Point(0, 0):
            return "origin"
        case Point(x, 0) | Point(0, x):      # or-pattern; both arms must bind the same names
            return f"on an axis at {x}"
        case [Point() as a, Point() as b]:   # sequence of exactly two Points
            return f"segment {a} -> {b}"
        case Color.RED:                      # dotted name = value pattern (compared with ==)
            return "red"
        case _:
            return "unknown"

RED = "red"
match "blue":
    case RED:        # BUG: a bare name is a CAPTURE pattern -- matches anything
        print("matched")   # prints, and rebinds RED = "blue"!`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A bare name in a `case` is always a capture pattern that matches anything and binds it — it never compares against an existing variable. To match a constant, use a dotted name (`Color.RED`, `http.HTTPStatus.OK`), a literal, or a guard (`case x if x == RED`). Linters such as ruff flag the unreachable cases this creates.',
            },
            {
              type: 'heading',
              text: 'Assignment expressions (the walrus operator)',
            },
            {
              type: 'code',
              language: 'python',
              title: ':= binds inside an expression (3.8+)',
              code: `import re

# avoids computing the match twice, or a separate assignment line
if (m := re.match(r"(\\d+)-(\\d+)", "10-20")) is not None:
    start, end = map(int, m.groups())

# read fixed-size chunks until EOF
with open("data.bin", "rb") as f:
    while chunk := f.read(65536):
        process(chunk)

# keep the computed value from a comprehension filter
results = [y for x in data if (y := expensive(x)) is not None]`,
            },
          ],
        },
        {
          id: 'functions-and-scope',
          title: 'Functions, Scope (LEGB) & `*args`/`**kwargs`',
          summary:
            'A name lookup inside a function walks outward through four scopes in a fixed order — knowing that order (LEGB) explains most "which variable did this actually use" surprises.',
          keyPoints: [
            'LEGB: Local → Enclosing → Global → Built-in — the order Python searches when resolving a name inside a function.',
            'A name assigned anywhere inside a function is local to that function for its *entire* body, even before the assignment line — this is what causes `UnboundLocalError` surprises.',
            '`nonlocal` lets an inner function assign to a variable in an *enclosing* function\'s scope (not global); `global` lets it assign to module-level scope.',
            '`*args` collects extra positional arguments into a tuple; `**kwargs` collects extra keyword arguments into a dict — the mechanism that lets decorators wrap a function of any signature.',
            'A closure is an inner function that remembers variables from its enclosing scope even after that outer function has returned.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'When code inside a function references a name, Python resolves it by searching four scopes in order, stopping at the first match: **Local** (names assigned inside the current function), **Enclosing** (any enclosing function\'s local scope, for nested functions/closures), **Global** (the module\'s top level), then **Built-in** (`len`, `print`, `range`, and the rest of Python\'s built-ins). This is the **LEGB rule**, and it\'s the precise mechanism behind "why did this function use that variable and not the other one with the same name".',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Ref["name referenced\\ninside a function"] --> L{"assigned in the\\ncurrent (Local) scope?"}
    L -- yes --> UseL["use the local binding"]
    L -- no --> E{"assigned in an\\nEnclosing function's scope?"}
    E -- yes --> UseE["use the enclosing binding"]
    E -- no --> G{"assigned at\\nModule (Global) scope?"}
    G -- yes --> UseG["use the global binding"]
    G -- no --> B{"a Built-in name?\\n(len, print, range...)"}
    B -- yes --> UseB["use the built-in"]
    B -- no --> Err["NameError"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'the UnboundLocalError trap',
              code: `count = 0

def increment():
    count += 1   # count = count + 1 -- this ASSIGNS to count, making it local
    return count

increment()  # UnboundLocalError: local variable 'count' referenced before assignment
             # because the assignment on this line makes 'count' local to the WHOLE
             # function body -- even the read on the right-hand side, before the
             # assignment executes, is now looking for a LOCAL 'count' that doesn't exist yet.

def increment_fixed():
    global count
    count += 1   # 'global' tells Python this name refers to module-level 'count'
    return count`,
            },
            {
              type: 'heading',
              text: 'Closures and `nonlocal`',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a closure-based counter',
              code: `def make_counter():
    count = 0
    def increment():
        nonlocal count   # without this, 'count += 1' would try to make count LOCAL to increment()
        count += 1
        return count
    return increment

counter = make_counter()
counter()  # 1
counter()  # 2 -- 'count' persists between calls, captured by the closure`,
            },
            {
              type: 'heading',
              text: '`*args` and `**kwargs`',
            },
            {
              type: 'p',
              text: '`*args` collects any extra positional arguments into a tuple; `**kwargs` collects any extra keyword arguments into a dict. Beyond letting a function accept a flexible signature, this is precisely the mechanism that lets a **decorator** wrap a function of *any* signature transparently — the wrapper accepts `*args, **kwargs` and forwards them untouched to the wrapped function, without needing to know or replicate its exact parameter list.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'flexible signatures and unpacking',
              code: `def summarize(*args, **kwargs):
    print("positional:", args)     # a tuple
    print("keyword:", kwargs)      # a dict

summarize(1, 2, name="alice", age=30)
# positional: (1, 2)
# keyword: {'name': 'alice', 'age': 30}

# the reverse operation -- unpacking -- uses the same * / ** syntax at the CALL site
nums = [1, 2, 3]
def add3(a, b, c): return a + b + c
add3(*nums)                        # unpacks the list into 3 positional args

opts = {"name": "alice", "age": 30}
def greet(name, age): return f"{name} is {age}"
greet(**opts)                      # unpacks the dict into keyword args`,
            },
            {
              type: 'heading',
              text: 'Positional-only, keyword-only, and designing a signature',
            },
            {
              type: 'p',
              text: 'A full Python signature has five kinds of parameters in a fixed order: positional-only (before `/`, 3.8+), positional-or-keyword, `*args`, keyword-only (after `*` or `*args`), and `**kwargs`. Library authors use `/` to keep the freedom to rename a parameter without breaking callers, and `*` to force callers to name boolean flags and options so call sites stay readable (`connect(host, timeout=5, retry=True)` rather than `connect(host, 5, True)`).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'all parameter kinds in one signature',
              code: `def fetch(url, /, method="GET", *, timeout=10.0, retries=0, **headers):
    ...

fetch("https://x.io", "POST", timeout=2.0, Authorization="Bearer t")
# fetch(url="https://x.io")      TypeError: url is positional-only
# fetch("https://x.io", "GET", 5) TypeError: timeout is keyword-only`,
            },
            {
              type: 'heading',
              text: 'How closures are actually implemented',
            },
            {
              type: 'p',
              text: 'The compiler decides scope statically. When an inner function references a variable of its enclosing function, both functions store that variable in a **cell object** instead of a plain local slot; the inner function keeps a tuple of those cells in `__closure__`. That is why closures capture *variables*, not *values* — the classic late-binding trap below happens because every lambda shares the same cell for `i`, which holds its final value by the time any of them is called.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'late binding in closures',
              code: `callbacks = [lambda: i for i in range(3)]
print([cb() for cb in callbacks])     # [2, 2, 2] -- all share the variable i

callbacks = [lambda i=i: i for i in range(3)]   # default arg captures the VALUE now
print([cb() for cb in callbacks])     # [0, 1, 2]

import functools
callbacks = [functools.partial(print, i) for i in range(3)]  # also binds values eagerly`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Function calls are comparatively expensive in CPython (frame setup, argument binding), though 3.11 made Python-to-Python calls much cheaper by avoiding C-stack recursion. In a hot loop, hoisting an attribute lookup into a local (`append = out.append`) or replacing a per-item call with a built-in like `sum()`/`map()` still pays off — but only after a profiler has shown the loop matters.',
            },
          ],
        },
        {
          id: 'string-formatting',
          title: 'Strings & f-strings — Immutability, Methods & Formatting',
          summary:
            'Strings are immutable sequences of Unicode code points, and f-strings are the modern, fastest, most readable way to build formatted text from them.',
          keyPoints: [
            'Strings are immutable — every "modifying" method (`.upper()`, `.replace()`, `.strip()`) returns a *new* string rather than changing the original.',
            'f-strings (`f"{expr}"`) embed live expressions directly in the string literal, evaluated at runtime — the modern default over `%`-formatting or `.format()`.',
            'A format spec after `:` controls width, alignment, precision, and type — `f"{price:,.2f}"`, `f"{pct:.1%}"`, `f"{n:>10}"`.',
            'The `=` debug specifier (`f"{value=}"`, 3.8+) prints both the expression text and its value — invaluable for quick debug prints.',
            'Repeated string concatenation in a loop (`s += chunk`) is O(n²) in the general case because each `+=` builds a new string; prefer `"".join(chunks)` for building a large string from many pieces.',
            'Since 3.12 (PEP 701) f-strings are parsed by the real grammar: you can reuse the same quote type inside, nest arbitrarily, and use backslashes and comments in the expressions.',
            'Template strings (`t"..."`, 3.14+) look like f-strings but produce a `Template` object that keeps the literal parts and interpolated values separate, so a library can escape or parameterize them — the safe answer to SQL/HTML injection via f-strings.',
            'Text (`str`, Unicode code points) and binary data (`bytes`) are distinct types; convert explicitly with `.encode()`/`.decode()` and always name the encoding.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'f-strings in practice',
              code: `name = "Ada"
score = 93.456
count = 1234567

print(f"Hello, {name}!")                  # Hello, Ada!
print(f"Score: {score:.1f}%")              # Score: 93.5%
print(f"Count: {count:,}")                 # Count: 1,234,567
print(f"{name:>10}|")                      # right-align in a 10-char field:      Ada|
print(f"{name=}, {score=}")                # debug specifier: name='Ada', score=93.456
print(f"{'yes' if score > 90 else 'no'}")  # expressions, including ternaries, work inline`,
            },
            {
              type: 'heading',
              text: 'Why not just concatenate with `+`?',
            },
            {
              type: 'p',
              text: 'Because strings are immutable, `s = s + chunk` inside a loop allocates a brand-new string on every iteration and copies everything so far into it — total work across `n` iterations is O(n²), not O(n). `"".join(list_of_chunks)` computes the total length once and copies each chunk exactly once, giving O(n) — the standard fix any time you\'re accumulating a string from many pieces in a loop.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'O(n²) trap vs the O(n) fix',
              code: `# O(n^2): each += allocates and copies a new, longer string
result = ""
for chunk in chunks:
    result += chunk

# O(n): builds the final string in one pass
result = "".join(chunks)`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'CPython has an implementation-specific optimization: when the left-hand string of `s += t` has no other references, it may be resized in place, so a naive loop is sometimes not quadratic in practice. Do not rely on it — it silently disappears as soon as another name references the string, and it does not exist on PyPy. `"".join()` is the portable O(n) answer.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'f-strings are also generally faster than `str.format()` or `%`-formatting, since the expressions are compiled directly into the bytecode rather than parsed out of a format-string mini-language at runtime — prefer them by default. The one place to keep `%`-style is the `logging` module: `log.info("user %s", user_id)` defers formatting until a handler actually emits the record, which matters on hot paths with debug logging disabled.',
            },
            {
              type: 'heading',
              text: 'Template strings (t-strings, 3.14+): f-strings you can safely post-process',
            },
            {
              type: 'p',
              text: 'An f-string is evaluated immediately into a plain `str` — by the time a database driver or HTML renderer receives it, there is no way to tell which parts came from your code and which came from an untrusted user. That is the root cause of injection bugs like `cursor.execute(f"... WHERE name = \'{name}\'")`. PEP 750 template strings use the same syntax with a `t` prefix but evaluate to a `string.templatelib.Template`: an object holding the static string parts and a sequence of `Interpolation` objects (each with `.value`, `.expression`, `.conversion` and `.format_spec`). The consumer decides how to combine them — escape for HTML, turn into `?` placeholders for SQL, or structure a log record.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'processing a t-string safely',
              code: `from string.templatelib import Template, Interpolation
import html

def render_html(template: Template) -> str:
    parts = []
    for item in template:                      # iterates static strings and Interpolations in order
        if isinstance(item, Interpolation):
            parts.append(html.escape(str(item.value)))
        else:
            parts.append(item)                 # literal text written by the developer
    return "".join(parts)

user_input = "<script>alert('x')</script>"
print(render_html(t"<p>Hello, {user_input}!</p>"))
# <p>Hello, &lt;script&gt;alert(&#x27;x&#x27;)&lt;/script&gt;!</p>

def to_sql(template: Template) -> tuple[str, list]:
    sql, params = [], []
    for item in template:
        if isinstance(item, Interpolation):
            sql.append("?"); params.append(item.value)
        else:
            sql.append(item)
    return "".join(sql), params

to_sql(t"SELECT * FROM users WHERE name = {user_input}")
# ('SELECT * FROM users WHERE name = ?', ["<script>alert('x')</script>"])`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A `Template` deliberately has no `__str__` that renders it — `str(t"...")` gives a debug representation, not the joined text. That friction is intentional: it forces every consumer to make an explicit escaping decision. Until your libraries accept templates natively, keep using parameterized queries (`cursor.execute(sql, params)`) rather than any kind of string building.',
            },
            {
              type: 'heading',
              text: 'str vs bytes, and encodings',
            },
            {
              type: 'p',
              text: 'Internally CPython stores each `str` in the narrowest fixed-width form that fits its widest character (1, 2 or 4 bytes per code point, PEP 393), which keeps indexing O(1) while keeping ASCII text compact — but means one emoji in a large string can quadruple its memory. Anything crossing a process boundary (files, sockets, HTTP) is bytes; decode at the edge, work in `str`, encode at the edge. Python 3.15 finally makes UTF-8 the default for `open()` without an `encoding=` argument (PEP 686); on earlier versions the default was the locale encoding, which is still `cp1252`-style on many Windows machines and a classic "works on Linux, breaks on Windows" bug.',
            },
          ],
        },
        {
          id: 'comprehensions',
          title: 'Comprehensions — List, Dict, Set & Generator Expressions',
          summary:
            'A comprehension is a single expression that builds a collection from an iterable, a condition, and a transformation — usually more readable and faster than the equivalent `for` loop.',
          keyPoints: [
            'List comprehension `[expr for x in iterable if cond]` builds a full list eagerly, in memory.',
            'Dict and set comprehensions use the same shape with `{}` — `{k: v for ...}` and `{expr for ...}` respectively.',
            'A generator expression `(expr for x in iterable)` looks identical but with `()` — it produces values lazily instead of building the whole collection upfront.',
            'Comprehensions isolate their loop variable (it does not leak into the enclosing scope) and are typically faster than the equivalent explicit loop, because they use a dedicated `LIST_APPEND` opcode instead of looking up and calling `.append` each iteration — and since 3.12 (PEP 709) they are inlined rather than compiled as a hidden nested function.',
            'Nesting more than two `for` clauses, or mixing several `if`s, usually means an explicit loop would be more readable — comprehensions optimize for a *single* clear transformation.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'the four shapes',
              code: `nums = range(10)

squares = [n * n for n in nums]                       # list comprehension
evens_squared = [n * n for n in nums if n % 2 == 0]     # with a filter
square_map = {n: n * n for n in nums}                   # dict comprehension
unique_lengths = {len(w) for w in ["hi", "bye", "ok"]}  # set comprehension

# generator expression: same shape, () instead of [] -- LAZY, doesn't build a list
lazy_squares = (n * n for n in nums)
sum(lazy_squares)   # consumes it one value at a time, no intermediate list ever built`,
            },
            {
              type: 'p',
              text: 'The list-comprehension form is equivalent to a `for` loop that appends to a list, but is usually both more concise and measurably faster. The loop is still ordinary bytecode — the win comes from the compiler emitting a specialized `LIST_APPEND` instruction rather than a repeated attribute lookup plus method call for `result.append(x)`, and (since 3.12, PEP 709) from inlining the comprehension instead of creating and calling a hidden function object each time. The **generator-expression** form (parentheses instead of brackets) looks almost identical but is fundamentally different: it produces a generator object that yields values one at a time on demand, rather than eagerly building and holding the entire result in memory — see the dedicated generators topic for when that distinction actually matters.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'when nesting gets unreadable, use a loop instead',
              code: `# borderline: a nested comprehension flattening a matrix -- still readable
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [n for row in matrix for n in row]

# past the line: multiple conditions AND nested logic crammed into one expression
# -- prefer an explicit loop here, comprehensions are for ONE clear transformation
result = []
for row in matrix:
    for n in row:
        if n % 2 == 0 and n > 2:
            result.append(n * 10)`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A comprehension used purely for its side effects (calling a function per item and discarding the result, e.g. `[print(x) for x in items]`) builds and immediately throws away a list for no reason — use a plain `for` loop when you don\'t actually need the resulting collection.',
            },
            {
              type: 'heading',
              text: 'Scope subtleties and when to pass a generator straight to a function',
            },
            {
              type: 'code',
              language: 'python',
              title: 'details that come up in code review',
              code: `x = "outer"
squares = [x * 2 for x in range(3)]
print(x)            # "outer" -- the comprehension variable does not leak (unlike Python 2)

# a generator expression as the ONLY argument needs no extra parentheses
total = sum(order.amount for order in orders)
has_admin = any(u.role == "admin" for u in users)   # short-circuits on the first True

# class bodies are NOT enclosing scopes for comprehensions (except the first iterable)
class Config:
    base = 10
    values = [base * i for i in range(3)]    # NameError: name 'base' is not defined
    # fix: compute outside the class body, or use a classmethod/helper function`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Feed `any()`, `all()`, `sum()`, `min()`, `max()`, `"".join()` and `dict()` a generator expression rather than a list comprehension when you only consume the result once: `any()`/`all()` short-circuit without building the rest, and memory stays flat. (`"".join()` is the exception where a list is slightly faster, because join materializes its input anyway.)',
            },
          ],
        },
        {
          id: 'mutable-default-arguments',
          title: 'The Mutable Default Argument Trap',
          summary:
            'Default argument values are evaluated once, at function-definition time, not per call — the single most common "surprise" bug rooted directly in Python\'s reference model.',
          keyPoints: [
            'A function\'s default argument values are created once, when the `def` statement runs, and reused across every call that doesn\'t override them.',
            'For a mutable default (list, dict, set), every call sharing that default shares and mutates the *same* underlying object.',
            'Fix: use `None` as a sentinel default, and create the real default fresh inside the function body on each call.',
            '`dataclasses` hits the same problem and solves it the same way, via `field(default_factory=list)` instead of `= []`.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'the classic trap, and the fix',
              code: `# BUGGY: the default list is created ONCE, at function-definition time,
# and is SHARED and MUTATED across every call that doesn't pass its own.
def add_item(item, items=[]):
    items.append(item)
    return items

add_item(1)  # [1]
add_item(2)  # [1, 2]  <- surprise, the same list persisted across calls!

# FIXED: use None as a sentinel, create a fresh list inside the function.
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Def["def add_item(item, items=[]):\\n... the empty list is built ONCE, right here,\\nand stored on the function object itself"]
    Def --> Obj["the one shared default-list object"]
    Call1["add_item(1)"] -->|"items param bound to"| Obj
    Call2["add_item(2)"] -->|"items param bound to\\nthe SAME object"| Obj
    Obj --> Result["[1, 2] -- both calls' mutations\\nlanded on one shared object"]`,
            },
            {
              type: 'p',
              text: 'This follows directly from two facts already covered: assignment binds a name to an object rather than copying it, and a `def` statement\'s default-argument expressions are evaluated exactly once, at definition time, with the resulting object stored as part of the function object itself (inspectable via `add_item.__defaults__`). Every call that doesn\'t supply its own `items` argument receives a reference to that one persisted object — so `.append()` calls from unrelated invocations all land on the same list.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never use a mutable object (list, dict, set) as a default argument value unless you specifically intend it to be shared and mutated across every call — which is almost never what you want. The same trap applies to `@dataclass` fields: use `field(default_factory=list)`, never `items: list = []` (dataclasses actually raise `ValueError` for a bare list/dict/set default for exactly this reason).',
            },
            {
              type: 'heading',
              text: 'Variations of the same root cause',
            },
            {
              type: 'code',
              language: 'python',
              title: 'when None is a legitimate value, and other definition-time evaluations',
              code: `# If None is a meaningful argument, use a private sentinel object instead
_MISSING = object()

def get_setting(key, default=_MISSING):
    try:
        return settings[key]
    except KeyError:
        if default is _MISSING:
            raise
        return default          # caller may legitimately pass default=None

# Same definition-time trap with non-mutable but time-dependent defaults
from datetime import datetime, timezone
def log_event(msg, at=datetime.now(timezone.utc)):   # BUG: frozen at import time
    ...
def log_event_fixed(msg, at=None):
    at = at or datetime.now(timezone.utc)`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Let tooling catch this for you: ruff\'s flake8-bugbear rules (`B006` mutable argument default, `B008` function call in default argument) flag both variants at lint time, which is far cheaper than discovering cross-request state leakage in production.',
            },
          ],
        },
        {
          id: 'decorators-and-context-managers',
          title: 'Decorators & Context Managers',
          summary:
            'Two of the most-tested Python mechanisms: decorators wrap behavior around a function without touching its source, and context managers guarantee cleanup code runs no matter how a block exits.',
          keyPoints: [
            'A decorator is a higher-order function that takes a function and returns a (usually wrapping) replacement — the mechanism behind `@app.route`, `@property`, `@staticmethod`, `@lru_cache`.',
            '`@decorator` above a `def` is exactly equivalent to `func = decorator(func)` right after the definition.',
            '`functools.wraps` preserves the wrapped function\'s `__name__`/`__doc__` — omitting it silently breaks introspection, debugging, and tools that read function metadata.',
            'The `with` statement guarantees `__exit__`/cleanup code runs even if an exception occurs inside the block — structurally preventing leaked file handles, connections, and locks.',
            '`@contextlib.contextmanager` turns a generator function (one `yield`, split into setup/teardown) into a full context manager without writing a class.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A decorator is a higher-order function: it takes a function as input and returns a function (usually one that wraps the original with extra behavior) as output. `@timed` above a `def` is pure syntactic sugar for `slow_query = timed(slow_query)` executed immediately after the function is defined — nothing more exotic than that.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph DefTime["at module load / definition time"]
      Original["def slow_query(): ..."] --> Wrap["timed(slow_query)"]
      Wrap --> Wrapper["returns wrapper()\\n(closure holding a\\nreference to the original func)"]
      Wrapper --> Rebind["name 'slow_query' is REBOUND\\nto point at wrapper, not the original"]
    end
    subgraph CallTime["every time slow_query() is later called"]
      Call["slow_query(...)"] --> RunsWrapper["actually runs wrapper(...)"]
      RunsWrapper --> Before["extra behavior BEFORE\\n(e.g. start timer)"]
      Before --> Inner["calls the ORIGINAL func(*args, **kwargs)"]
      Inner --> After["extra behavior AFTER\\n(e.g. print elapsed time)"]
      After --> Return["returns the original result"]
    end`,
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
    ...

# stacking decorators applies bottom-up: log_calls(timed(slow_query))
@log_calls
@timed
def slow_query_2():
    ...`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`functools.wraps` is the detail interviewers specifically check for — omitting it silently replaces the wrapped function\'s metadata (`__name__`, `__doc__`) with the wrapper\'s own, breaking introspection, debugging output, and any framework that relies on function metadata (like FastAPI\'s route introspection).',
            },
            {
              type: 'heading',
              text: 'Decorators with arguments, and the built-ins',
            },
            {
              type: 'p',
              text: 'A decorator that itself takes arguments (`@retry(times=3)`) needs one extra layer of nesting: the outer function takes the decorator\'s own arguments and returns the actual decorator. Beyond hand-written decorators, know the built-in ones cold: `@staticmethod` (no implicit `self`/`cls`, just a regular function namespaced on the class), `@classmethod` (receives the class as `cls` instead of an instance — used for alternate constructors), and `@functools.lru_cache` (memoizes a function\'s return value per distinct set of arguments, trading memory for avoiding recomputation).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a parameterized retry decorator, plus caching built-ins',
              code: `import functools, time, random

def retry(times: int = 3, exceptions: tuple[type[Exception], ...] = (ConnectionError,)):
    def decorator(func):                     # the real decorator
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions:
                    if attempt == times:
                        raise
                    time.sleep(0.1 * 2 ** attempt + random.random() / 10)  # backoff + jitter
        return wrapper
    return decorator

@retry(times=5)                              # retry(times=5) runs first and returns decorator
def call_payment_api(): ...

@functools.cache                             # unbounded memoization (3.9+), = lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

class Report:
    @functools.cached_property               # computed once per instance, then stored in __dict__
    def totals(self): ...`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`@lru_cache`/`@cache` on an instance method caches on `self` as part of the key, so the cache holds a strong reference to every instance ever passed in — a memory leak for long-lived processes. Cache a module-level function, use `cached_property`, or key the cache on an explicit identifier instead. Also remember cached arguments must be hashable, and a cached mutable return value is shared between callers.',
            },
            {
              type: 'heading',
              text: 'Context managers and `with`',
            },
            {
              type: 'p',
              text: 'The `with` statement guarantees cleanup code runs even if an exception occurs inside the block — implemented via `__enter__`/`__exit__` (or, more concisely, `@contextlib.contextmanager` around a generator function). The canonical case for understanding *why* this matters: a file handle or DB connection acquired without a context manager can leak if an exception is raised between acquisition and a manual `.close()` call; `with` makes that leak structurally impossible by running `__exit__` unconditionally on the way out of the block, exception or not.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Code as your code
    participant CM as context manager
    Code->>CM: __enter__()
    CM-->>Code: resource (e.g. connection)
    Code->>Code: run the with-block body
    alt block raised an exception
        Code->>CM: __exit__(exc_type, exc_val, tb)
        Note right of CM: cleanup STILL runs here
    else block completed normally
        Code->>CM: __exit__(None, None, None)
    end
    CM-->>Code: resource released either way`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'a transactional context manager',
              code: `from contextlib import contextmanager

@contextmanager
def db_transaction(connection):
    try:
        yield connection      # code before yield = __enter__, code after = __exit__
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()

with db_transaction(conn) as tx:
    tx.execute("INSERT INTO orders ...")
    # commit happens automatically on success; rollback + close on any exception`,
            },
            {
              type: 'p',
              text: 'Two `__exit__` details matter in production. First, if `__exit__` returns a truthy value, the exception is **suppressed** — that is how `contextlib.suppress(FileNotFoundError)` works, and an accidental `return True` in a hand-written `__exit__` silently swallows errors. Second, when you need to enter a *variable* number of context managers (open N files, acquire N locks) use `contextlib.ExitStack`, which unwinds them in reverse order even if entering one of them fails halfway through. Since 3.10 you can also group several managers in parentheses across lines: `with (open(a) as f, open(b) as g):`.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'ExitStack and async context managers',
              code: `from contextlib import ExitStack, asynccontextmanager

def merge_files(paths: list[str], out_path: str) -> None:
    with ExitStack() as stack:
        files = [stack.enter_context(open(p, encoding="utf-8")) for p in paths]
        out = stack.enter_context(open(out_path, "w", encoding="utf-8"))
        for f in files:
            out.writelines(f)
    # every file is closed here, in reverse order, even if one open() failed

@asynccontextmanager
async def lifespan(app):
    pool = await create_pool()     # startup
    try:
        yield {"pool": pool}
    finally:
        await pool.close()         # shutdown -- FastAPI/Starlette accept exactly this shape`,
            },
          ],
        },
        {
          id: 'generators-and-iterators',
          title: 'Generators & Iterators — The Protocol Behind Every `for` Loop',
          summary:
            'A `for` loop is syntactic sugar over a well-defined iterator protocol, and a generator function is the easiest way to implement that protocol without writing a class.',
          keyPoints: [
            'An **iterable** implements `__iter__` (returns an iterator); an **iterator** implements both `__iter__` (returns itself) and `__next__` (returns the next value or raises `StopIteration`).',
            '`for x in obj:` is sugar for calling `iter(obj)` once, then `next()` repeatedly until `StopIteration` is caught internally.',
            'A generator function (containing `yield`) automatically returns an object implementing the full iterator protocol — no manual class needed.',
            'A generator produces values lazily, one at a time, holding only current state in memory — constant memory footprint vs a list\'s footprint that scales with size.',
            'Reach for a generator when the dataset is large/unbounded and can be consumed one item at a time without needing random access to the whole collection at once.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Every `for x in collection:` loop is built on a formal protocol, not magic: Python calls `iter(collection)` once to get an **iterator**, then calls `next()` on it repeatedly, using each returned value as `x`, until the iterator raises `StopIteration` — which the loop catches internally to know it\'s done. Anything implementing `__iter__`/`__next__` correctly can be looped over with `for`, unpacked, passed to `list()`, or consumed by any function expecting an iterable.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Start(["for x in obj:"]) --> Iter["it = iter(obj)\\n(calls obj.__iter__())"]
    Iter --> Loop{"call it.__next__()"}
    Loop -- "returns a value" --> Bind["x = that value\\nrun loop body"]
    Bind --> Loop
    Loop -- "raises StopIteration" --> End(["loop exits\\n(caught internally,\\nnot propagated)"])`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'the protocol, written out by hand vs. via a generator',
              code: `# writing the iterator protocol manually
class Countdown:
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

for n in Countdown(3):
    print(n)   # 3, 2, 1

# the SAME behavior, expressed as a generator function --
# 'yield' makes Python build the __iter__/__next__ machinery for you
def countdown(start):
    current = start
    while current > 0:
        yield current
        current -= 1

for n in countdown(3):
    print(n)   # 3, 2, 1`,
            },
            {
              type: 'heading',
              text: 'Why lazy evaluation matters: memory',
            },
            {
              type: 'p',
              text: 'A list comprehension eagerly evaluates and holds every produced item in memory simultaneously — for a file with millions of lines, the resulting list\'s memory footprint scales linearly with size, and can exhaust available memory before processing even finishes. A generator produces one item at a time, holding only the current position and minimal local state — the memory footprint stays constant regardless of how many items exist overall. This is the concrete, quantifiable answer to "how would you process a 10GB file without running out of memory": iterate it with a generator, never materialize it as a list.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'streaming a huge file with constant memory',
              code: `def read_large_file(path):
    with open(path) as f:
        for line in f:          # file objects are themselves iterators -- one line in memory at a time
            yield line.strip()

def error_lines(path):
    for line in read_large_file(path):   # generators compose without buffering between stages
        if "ERROR" in line:
            yield line

# nothing is read into memory until this loop actually pulls values one at a time
for error in error_lines("huge_log.txt"):
    print(error)`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The `itertools` module (`chain`, `islice`, `groupby`, `takewhile`, `tee`, and `batched` since 3.12) is the standard toolkit for composing lazy pipelines out of generators without ever materializing an intermediate list — worth knowing by name even if not memorized in full.',
            },
            {
              type: 'heading',
              text: 'How a generator suspends: frames, send(), and yield from',
            },
            {
              type: 'p',
              text: 'Calling a generator function runs none of its body; it creates a generator object that owns a suspended **frame** (instruction pointer plus local variables). Each `next()` resumes that frame until the next `yield`, which hands a value out and freezes the frame again. Because the frame lives on the heap rather than the C stack, a generator can be paused indefinitely at near-zero cost — and this is exactly the machinery coroutines were originally built on. `gen.send(value)` resumes the frame and makes the paused `yield` expression evaluate to `value`; `gen.throw(exc)` raises inside it; `gen.close()` raises `GeneratorExit` at the paused point so `finally` blocks run. `yield from sub` delegates the whole protocol to a sub-generator and evaluates to the sub-generator\'s `return` value.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'send(), yield from, and itertools.batched',
              code: `def running_average():
    total = count = 0
    average = None
    while True:
        value = yield average        # receives whatever is sent in
        total += value
        count += 1
        average = total / count

avg = running_average()
next(avg)                 # "prime" it: run to the first yield
avg.send(10)              # 10.0
avg.send(20)              # 15.0

def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)   # delegate to the recursive sub-generator
        else:
            yield item

list(flatten([1, [2, [3, 4]], 5]))     # [1, 2, 3, 4, 5]

from itertools import batched           # 3.12+
for chunk in batched(range(10), 4):
    print(chunk)                        # (0, 1, 2, 3) (4, 5, 6, 7) (8, 9)`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Generators are single-use: iterating an exhausted generator silently yields nothing, so passing one to two consumers (`total = sum(g); count = len(list(g))`) gives a wrong answer with no error. Also, a generator that is abandoned mid-iteration only runs its `finally`/`with` cleanup when it is closed or garbage-collected — wrap resource-holding generators with `contextlib.closing()` or consume them fully if cleanup timing matters.',
            },
          ],
        },
        {
          id: 'python-data-model',
          title: 'The Python Data Model — Dunder Methods & Protocols',
          summary:
            'Built-in syntax and functions (`len()`, `in`, `+`, `==`, `with`, `for`, `hash()`) are all hooks into special methods on the object\'s type — implementing the right dunders is how your own classes become first-class citizens.',
          keyPoints: [
            'Syntax dispatches to special methods looked up on the *type*, not the instance: `len(x)` calls `type(x).__len__(x)`, `a + b` tries `a.__add__(b)` and then `b.__radd__(a)`.',
            'Return `NotImplemented` (not `False`, not an exception) from a binary operator or comparison you cannot handle, so Python can try the reflected operation on the other operand.',
            'Defining `__eq__` without `__hash__` makes instances unhashable — the two must agree: equal objects must have equal hashes.',
            '`__repr__` is for developers (unambiguous, ideally eval-able); `__str__` is for end users and falls back to `__repr__`.',
            'Python favors protocols (duck typing) over inheritance: implement `__iter__` and you are iterable; implement `__len__` and `__getitem__` and you are a sequence. `collections.abc` gives you mixin methods for free.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The "data model" (documented in the language reference) is the contract between the interpreter and your objects. When CPython executes `len(cart)`, it does not look for a method called `len` — it reads a C-level slot on `type(cart)` that is populated from your class\'s `__len__`. Because the lookup goes through the **type**, assigning `instance.__len__ = ...` on an instance has no effect on `len(instance)`; special methods must be defined on the class. This design is why built-ins are fast (a slot read, not a dictionary lookup) and why consistent protocols work across every type in the language.',
            },
            {
              type: 'table',
              headers: ['You write', 'Python calls', 'Typical use'],
              rows: [
                ['`repr(x)`, `str(x)`, `f"{x}"`', '`__repr__`, `__str__`, `__format__`', 'debugging output, user-facing text'],
                ['`x == y`, `x < y`', '`__eq__`, `__lt__` (and reflected forms)', 'value equality, sorting'],
                ['`hash(x)`, `x in some_set`', '`__hash__` (+ `__eq__`)', 'dict keys, set membership'],
                ['`len(x)`, `bool(x)`', '`__len__`, `__bool__` (falls back to `__len__`)', 'containers, truthiness'],
                ['`x[k]`, `x[k] = v`, `k in x`', '`__getitem__`, `__setitem__`, `__contains__`', 'custom collections'],
                ['`for i in x`', '`__iter__` (falls back to `__getitem__` with 0, 1, 2...)', 'iteration'],
                ['`x + y`, `y + x`, `x += y`', '`__add__`, `__radd__`, `__iadd__`', 'numeric/vector types'],
                ['`with x:`', '`__enter__`, `__exit__`', 'resource management'],
                ['`x(...)`', '`__call__`', 'callable objects, stateful functions'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'a well-behaved value type',
              code: `from functools import total_ordering
import math

@total_ordering                          # derives <=, >, >= from __eq__ and __lt__
class Money:
    __slots__ = ("amount", "currency")

    def __init__(self, amount: int, currency: str):
        self.amount = amount              # minor units (cents) -- never floats for money
        self.currency = currency

    def __repr__(self) -> str:
        return f"Money({self.amount!r}, {self.currency!r})"

    def __str__(self) -> str:
        return f"{self.amount / 100:,.2f} {self.currency}"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Money):
            return NotImplemented         # let Python try other.__eq__ / fall back to identity
        return (self.amount, self.currency) == (other.amount, other.currency)

    def __hash__(self) -> int:            # consistent with __eq__
        return hash((self.amount, self.currency))

    def __lt__(self, other: "Money") -> bool:
        if not isinstance(other, Money) or other.currency != self.currency:
            return NotImplemented
        return self.amount < other.amount

    def __add__(self, other: "Money") -> "Money":
        if not isinstance(other, Money) or other.currency != self.currency:
            return NotImplemented
        return Money(self.amount + other.amount, self.currency)

    def __radd__(self, other):            # makes sum([...]) work: sum starts with 0
        return self if other == 0 else NotImplemented

    def __bool__(self) -> bool:
        return self.amount != 0

prices = [Money(1999, "EUR"), Money(501, "EUR")]
print(sum(prices))           # 25.00 EUR
print(max(prices))           # 19.99 EUR (uses __lt__)
print({Money(1, "EUR")})     # hashable, usable in sets`,
            },
            {
              type: 'heading',
              text: 'Binary operator dispatch',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Expr["a + b"] --> Sub{"is type(b) a subclass<br/>of type(a) that overrides __radd__?"}
    Sub -- yes --> RFirst["try b.__radd__(a) first"]
    Sub -- no --> Add["try a.__add__(b)"]
    Add -- "returns a value" --> Done["result"]
    Add -- "returns NotImplemented" --> Radd["try b.__radd__(a)"]
    RFirst -- "NotImplemented" --> Add2["try a.__add__(b)"]
    Add2 -- "value" --> Done
    Add2 -- "NotImplemented" --> Err
    RFirst -- "value" --> Done
    Radd -- "value" --> Done
    Radd -- "NotImplemented" --> Err["TypeError: unsupported operand"]`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Overriding `__eq__` sets `__hash__ = None` implicitly, so instances silently become unhashable and fail as dict keys or set members. Conversely, a `__hash__` based on mutable fields means mutating an object after inserting it into a set makes it unfindable. Hash only on immutable identity fields — or use `@dataclass(frozen=True)`, which generates a consistent pair for you.',
            },
            {
              type: 'heading',
              text: 'Protocols over inheritance: collections.abc',
            },
            {
              type: 'code',
              language: 'python',
              title: 'implement two methods, get a full read-only mapping',
              code: `from collections.abc import Mapping

class EnvConfig(Mapping):
    """Read-only view over environment-style key/value pairs."""
    def __init__(self, data: dict[str, str]):
        self._data = dict(data)
    def __getitem__(self, key: str) -> str:
        return self._data[key]
    def __iter__(self):
        return iter(self._data)
    def __len__(self) -> int:
        return len(self._data)

cfg = EnvConfig({"DEBUG": "1"})
cfg.get("PORT", "8000")      # .get, .keys, .items, __contains__, __eq__ come from the ABC
isinstance(cfg, Mapping)     # True -- works with any code written against Mapping`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer composition plus a `collections.abc` base (or a `typing.Protocol`) over subclassing `dict`/`list` directly. The built-in types\' C implementations do not route their own methods through your overrides — subclassing `dict` and overriding `__setitem__` does *not* affect `update()` or the constructor — which is why `collections.UserDict` exists for the rare case you really want dict inheritance.',
            },
          ],
        },
        {
          id: 'type-hints-and-dataclasses',
          title: 'Type Hints & Dataclasses',
          summary:
            'Type hints are optional, unenforced-at-runtime metadata that static tools and frameworks like Pydantic can act on; dataclasses use that same annotation syntax to auto-generate boilerplate.',
          keyPoints: [
            'Type hints (`def f(x: int) -> str`) are not enforced at runtime by the interpreter itself — they\'re metadata for static checkers (mypy, pyright) and frameworks (Pydantic, FastAPI) that explicitly validate against them.',
            'A plain type-hinted function happily runs with a wrong-typed argument at runtime with no error unless something actually checks it.',
            'Common typing constructs: `X | None` (formerly `Optional[X]`), `A | B` (formerly `Union[A, B]`), generic containers (`list[int]`, `dict[str, int]`), and `Protocol` for structural typing.',
            'Since 3.14, annotations are evaluated lazily (PEP 649/749), so forward references no longer need quotes and `from __future__ import annotations` is no longer needed in new code.',
            '`@dataclass` auto-generates `__init__`, `__repr__`, and `__eq__` from annotated fields, reducing boilerplate for simple data-holding classes.',
            '`frozen=True` makes a dataclass immutable (raises on attribute assignment); `field(default_factory=list)` is the dataclass-native fix for the mutable-default-argument problem.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Type hints (`def f(x: int) -> str`) are pure metadata as far as the interpreter is concerned — nothing about running `f("not an int")` raises a `TypeError` from the hint alone. Their value comes from what *reads* them afterward: static type checkers (mypy, pyright) analyze code without running it and flag mismatches at develop time; runtime-validating frameworks (Pydantic, and therefore FastAPI) explicitly inspect the annotations and raise real validation errors when data doesn\'t match. Know this distinction cold — it\'s a frequent "wait, so type hints don\'t actually do anything?" clarifying question.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'hints as metadata, not enforcement',
              code: `def add(a: int, b: int) -> int:
    return a + b

add("2", "3")   # runs fine at the interpreter level -- returns "23" (string concat)
                # no TypeError, despite violating the hints: nothing checked them.

from pydantic import BaseModel

class Add(BaseModel):
    a: int
    b: int

Add(a="2", b="3")   # Pydantic DOES check -- coerces "2" -> 2 (or raises, depending on config)`,
            },
            {
              type: 'heading',
              text: 'Common typing constructs',
            },
            {
              type: 'table',
              headers: ['Construct', 'Meaning'],
              rows: [
                ['`int \\| None` (legacy: `Optional[int]`)', 'an `int`, or `None` — the `X \\| Y` syntax works at runtime since 3.10'],
                ['`int \\| str` (legacy: `Union[int, str]`)', 'either type is acceptable'],
                ['`list[int]`, `dict[str, int]`', 'a generic container with typed contents (built-in generics since 3.9; `typing.List` is legacy)'],
                ['`Sequence[int]`, `Mapping[str, int]` from `collections.abc`', 'accept the read-only abstract type in parameters; return concrete types'],
                ['`Protocol`', 'structural typing — "anything with this method shape", no inheritance required'],
                ['`def f[T](x: T) -> T` (legacy: `TypeVar`)', 'a generic function/class parameterized over a type — PEP 695 syntax since 3.12'],
                ['`Literal["r", "w"]`, `Final`, `ClassVar`', 'exact allowed values; a constant; a class-level (non-instance) attribute'],
              ],
            },
            {
              type: 'heading',
              text: 'When annotations are evaluated (3.14 changed this)',
            },
            {
              type: 'p',
              text: 'Historically annotations were evaluated eagerly when the `def` or `class` statement ran, which caused two problems: forward references (a method returning its own class) had to be written as strings, and importing heavy modules just for annotations cost startup time. The old workaround, `from __future__ import annotations` (PEP 563), turned every annotation into a string — which broke runtime consumers like Pydantic in subtle ways. Python 3.14 adopted **deferred evaluation** (PEP 649/749): annotations are compiled into a hidden function and only evaluated when something asks for them, via the new `annotationlib` module (`annotationlib.get_annotations(obj, format=Format.FORWARDREF)`) or `typing.get_type_hints()`. Forward references now just work without quotes, and code that never introspects annotations never pays for them.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'forward references without quotes (3.14+)',
              code: `class Node:
    def add_child(self, child: Node) -> Node:   # fine in 3.14: not evaluated at def time
        ...

import annotationlib
annotationlib.get_annotations(Node.add_child)
# {'child': <class 'Node'>, 'return': <class 'Node'>}

# On 3.13 and earlier you still need quotes or the __future__ import:
# def add_child(self, child: "Node") -> "Node": ...`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Do not read `obj.__annotations__` directly in library code — its behavior differs across versions and under the `__future__` import. Use `annotationlib.get_annotations()` (3.14+) or `inspect.get_annotations()`/`typing.get_type_hints()` on older versions. New code targeting 3.14+ should generally drop `from __future__ import annotations`.',
            },
            {
              type: 'heading',
              text: 'Dataclasses — annotations doing double duty',
            },
            {
              type: 'p',
              text: '`@dataclass` reuses the same annotation syntax to auto-generate `__init__`, `__repr__`, and `__eq__` from a class\'s declared fields, cutting out the repetitive `self.x = x` boilerplate of a hand-written class. `frozen=True` makes instances immutable (any attribute assignment after construction raises `FrozenInstanceError`), and `field(default_factory=list)` is the dataclass-native solution to the mutable-default-argument trap covered earlier — the factory is called fresh per instance instead of being evaluated once at class-definition time.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a dataclass, boilerplate-free',
              code: `from dataclasses import dataclass, field

@dataclass(frozen=True)
class Point:
    x: float
    y: float

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
p1 == p2        # True -- __eq__ is auto-generated, compares field values
# p1.x = 5.0    # raises FrozenInstanceError -- frozen=True makes it immutable

@dataclass
class Order:
    id: int
    items: list[str] = field(default_factory=list)   # NOT items: list = [] -- same trap as before`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'the production-grade dataclass options',
              code: `from dataclasses import dataclass, replace

@dataclass(frozen=True, slots=True, kw_only=True)   # slots/kw_only since 3.10
class RetryPolicy:
    attempts: int = 3
    backoff_s: float = 0.5
    retry_on: tuple[type[Exception], ...] = (ConnectionError,)

    def __post_init__(self):                  # validation hook after generated __init__
        if self.attempts < 1:
            raise ValueError("attempts must be >= 1")

default = RetryPolicy()
aggressive = replace(default, attempts=10)   # copy-with-changes; copy.replace() also works (3.13+)`,
            },
            {
              type: 'table',
              headers: ['Tool', 'Validates at runtime?', 'Best for'],
              rows: [
                ['`@dataclass`', 'No (only `__post_init__` checks you write)', 'internal domain objects, zero dependencies'],
                ['`typing.NamedTuple`', 'No', 'lightweight immutable records that must also be tuples'],
                ['`attrs`', 'Optional validators', 'richer dataclass features, slots by default'],
                ['Pydantic `BaseModel`', 'Yes — parses and coerces', 'untrusted input at boundaries: HTTP bodies, config, messages'],
                ['`msgspec.Struct`', 'Yes, during decode', 'very high-throughput JSON/MessagePack serialization'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Validate at the edges, trust in the core: parse untrusted data once into a Pydantic model at the boundary, then pass plain dataclasses (or the model) inward. Re-validating the same data in every layer costs CPU and spreads validation rules around the codebase.',
            },
          ],
        },
        {
          id: 'advanced-typing',
          title: 'Advanced Typing — Generics, Protocols & Static Checkers in Practice',
          summary:
            'Modern Python typing is a full gradual type system: PEP 695 generics, structural Protocols, precise narrowing, and typed decorators let a checker catch real bugs — if you adopt it deliberately and know where it stops.',
          keyPoints: [
            'PEP 695 (3.12+): `class Box[T]:`, `def first[T](xs: list[T]) -> T`, and `type Alias = ...` replace most `TypeVar`/`Generic`/`TypeAlias` boilerplate, with lazily evaluated aliases.',
            '`Protocol` gives structural ("duck") typing that the checker verifies — accept the smallest interface you actually use rather than a concrete class.',
            'Narrowing: `isinstance`, `is None` checks, `match`, and user-defined `TypeIs` (3.13) functions let the checker refine a union inside a branch.',
            '`ParamSpec` and `Concatenate` let decorators preserve the wrapped function\'s exact signature; `@overload` describes functions whose return type depends on argument types.',
            'Gradual typing means `Any` silently switches checking off; run the checker in strict mode on new code and ratchet strictness up over time on legacy code.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Typing in Python is **gradual**: un-annotated code is treated as `Any`, and the checker only verifies what you annotate. That makes adoption incremental, but it also means a codebase can look typed while most of it is unchecked. The value appears when annotations are precise enough to rule out real mistakes — `None` dereferences, wrong argument order, forgetting a branch of a union — and when the checker runs in CI. The main checkers are **mypy** (the original, reference behavior), **pyright** (fast, powers VS Code\'s Pylance), and newer Rust-based checkers such as Astral\'s `ty` and Meta\'s Pyrefly; they agree on the typing spec but differ on inference details, so pick one per project and pin its version.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'PEP 695 generics and type aliases (3.12+)',
              code: `from collections.abc import Callable, Iterable, Sized

type JSON = dict[str, JSON] | list[JSON] | str | int | float | bool | None   # recursive alias
type Handler[E] = Callable[[E], None]                                       # generic alias

class Stack[T]:
    def __init__(self) -> None:
        self._items: list[T] = []
    def push(self, item: T) -> None:
        self._items.append(item)
    def pop(self) -> T:
        return self._items.pop()

def first[T](items: Iterable[T], default: T) -> T:
    return next(iter(items), default)

def biggest[N: (int, float)](a: N, b: N) -> N:     # constrained type parameter
    return a if a >= b else b

def longest[S: Sized](items: list[S]) -> S: ...     # upper bound: any Sized subtype

s = Stack[int]()
s.push("x")      # checker error: "str" is not assignable to "int"`,
            },
            {
              type: 'heading',
              text: 'Protocols: structural typing the checker can verify',
            },
            {
              type: 'code',
              language: 'python',
              title: 'depend on behavior, not on a class hierarchy',
              code: `from typing import Protocol, runtime_checkable

class SupportsClose(Protocol):
    def close(self) -> None: ...

class Repository[T](Protocol):
    def get(self, id: int) -> T | None: ...
    def add(self, item: T) -> None: ...

def shutdown(resources: list[SupportsClose]) -> None:
    for r in resources:
        r.close()

shutdown([open("a.txt"), socket_conn, db_pool])   # none of them inherit SupportsClose

@runtime_checkable           # opt-in isinstance() support -- checks method NAMES only
class Drawable(Protocol):
    def draw(self) -> None: ...`,
            },
            {
              type: 'heading',
              text: 'Narrowing, TypedDict, and exhaustiveness',
            },
            {
              type: 'code',
              language: 'python',
              title: 'make the checker prove every case is handled',
              code: `from typing import Literal, TypedDict, NotRequired, TypeIs, assert_never

class Created(TypedDict):
    kind: Literal["created"]
    id: int

class Deleted(TypedDict):
    kind: Literal["deleted"]
    id: int
    reason: NotRequired[str]

type Event = Created | Deleted

def handle(event: Event) -> str:
    match event["kind"]:
        case "created":
            return f"new {event['id']}"
        case "deleted":
            return f"gone {event['id']}"
        case _ as unreachable:
            assert_never(unreachable)   # checker errors here if a new kind is added and not handled

def is_str_list(val: list[object]) -> TypeIs[list[str]]:   # 3.13+, narrows in both branches
    return all(isinstance(x, str) for x in val)`,
            },
            {
              type: 'heading',
              text: 'Typing decorators and overloads',
            },
            {
              type: 'code',
              language: 'python',
              title: 'ParamSpec keeps the wrapped signature intact',
              code: `import functools, time
from collections.abc import Callable
from typing import Literal, overload

def timed[**P, R](func: Callable[P, R]) -> Callable[P, R]:   # PEP 695 ParamSpec syntax
    @functools.wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__}: {time.perf_counter() - start:.3f}s")
    return wrapper

@timed
def charge(customer_id: str, cents: int) -> bool: ...
charge("c1", "10")      # checker error: still sees (customer_id: str, cents: int)

@overload
def load(path: str, *, raw: Literal[True]) -> bytes: ...
@overload
def load(path: str, *, raw: Literal[False] = ...) -> str: ...
def load(path: str, *, raw: bool = False) -> str | bytes:
    data = open(path, "rb").read()
    return data if raw else data.decode("utf-8")`,
            },
            {
              type: 'table',
              headers: ['Feature', 'Since', 'Why it matters'],
              rows: [
                ['`typing.Self`', '3.11', 'methods returning their own (sub)class, fluent builders'],
                ['`@typing.override`', '3.12', 'checker errors if the base method you think you override was renamed'],
                ['TypeVar defaults (PEP 696)', '3.13', '`class Response[T = bytes]:` — sensible default type parameter'],
                ['`TypeIs`', '3.13', 'precise user-defined narrowing (preferred over `TypeGuard`)'],
                ['`ReadOnly` TypedDict items', '3.13', 'mark keys that must not be mutated'],
                ['Deferred annotations', '3.14', 'forward references without quotes, no import-time cost'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Typing has limits a senior engineer should name: it cannot see through heavy dynamism (`getattr` by computed name, monkeypatching, metaclass magic), `cast()` and `# type: ignore` are unchecked promises, and untyped third-party libraries degrade everything they touch to `Any`. Enable `warn_unused_ignores`/`reportUnnecessaryTypeIgnoreComment` and prefer narrowing over `cast` so the escape hatches stay visible.',
            },
          ],
        },
        {
          id: 'exception-handling',
          title: 'Exception Handling & Custom Exceptions',
          summary:
            'Exceptions are objects arranged in a class hierarchy, `try`/`except`/`else`/`finally` gives precise control over what runs when, and custom exception classes let error handling be as specific as the errors themselves.',
          keyPoints: [
            'Every exception is an instance of a class inheriting (directly or indirectly) from `BaseException`; almost everything you should catch inherits from `Exception`.',
            '`try`/`except` runs the risky code and handles matching errors; `else` runs only if no exception occurred; `finally` always runs, exception or not.',
            'Catch the most specific exception type you can meaningfully handle — a bare `except:` (or `except Exception:` used carelessly) swallows bugs you didn\'t intend to catch.',
            'Custom exceptions (subclassing `Exception`) make error handling precise and self-documenting — `except InsufficientFundsError:` says exactly what went wrong.',
            '`raise NewError("...") from original_err` chains exceptions, preserving the original traceback as context instead of discarding it.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Exceptions in Python are ordinary objects, instances of classes that ultimately inherit from `BaseException`. Nearly everything an application should ever catch inherits from `Exception` (a deliberate subclass boundary — `BaseException` also covers `SystemExit` and `KeyboardInterrupt`, which a broad `except` should generally *not* swallow, hence `except Exception` rather than `except BaseException` as the conventional "catch broadly" choice).',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    BE["BaseException"] --> SE["SystemExit"]
    BE --> KI["KeyboardInterrupt"]
    BE --> Exc["Exception"]
    Exc --> VE["ValueError"]
    Exc --> TE["TypeError"]
    Exc --> KE["KeyError / IndexError\\n(LookupError subclasses)"]
    Exc --> Custom["YourAppError\\n(custom base)"]
    Custom --> Custom1["InsufficientFundsError"]
    Custom --> Custom2["InvalidOrderStateError"]`,
            },
            {
              type: 'heading',
              text: 'try / except / else / finally — the full control flow',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Try["try: block runs"] --> Raised{"exception\\nraised?"}
    Raised -- no --> ElseB["else: runs\\n(only on success)"]
    Raised -- yes --> Match{"matches an\\nexcept clause?"}
    Match -- yes --> ExceptB["except: handler runs"]
    Match -- no --> Propagate["exception propagates\\nup the call stack"]
    ElseB --> Finally["finally: ALWAYS runs"]
    ExceptB --> Finally
    Propagate --> Finally
    Finally --> Done["control continues\\n(or re-raises, if unhandled)"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'all four clauses doing distinct jobs',
              code: `def process_order(order_id):
    conn = acquire_connection()
    try:
        order = fetch_order(conn, order_id)
    except OrderNotFoundError:
        log.warning(f"order {order_id} not found")
        return None
    except ConnectionError as e:
        log.error(f"DB unreachable: {e}")
        raise
    else:
        # only runs if the try block raised NOTHING
        log.info(f"fetched order {order_id} successfully")
        return order
    finally:
        # ALWAYS runs -- success, handled exception, or unhandled exception
        conn.close()`,
            },
            {
              type: 'heading',
              text: 'Custom exceptions and chaining',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a precise, self-documenting exception hierarchy',
              code: `class AppError(Exception):
    """Base class for this application's own exceptions."""

class InsufficientFundsError(AppError):
    def __init__(self, balance: float, requested: float):
        self.balance = balance
        self.requested = requested
        super().__init__(f"balance {balance} insufficient for {requested}")

def withdraw(account, amount):
    if amount > account.balance:
        raise InsufficientFundsError(account.balance, amount)

# exception chaining: preserves the ORIGINAL error as context, doesn't discard it
def load_config(path):
    try:
        return parse(path)
    except json.JSONDecodeError as e:
        raise ConfigError(f"invalid config at {path}") from e
        # 'from e' keeps the original traceback visible as
        # "The above exception was the direct cause of the following exception"`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A bare `except:` (no exception type at all) catches *everything*, including `KeyboardInterrupt` and `SystemExit` — it can make a program impossible to stop with Ctrl+C and routinely masks real bugs (typos, `AttributeError`s) as if they were the expected failure case. Always name the exception type(s) you intend to handle.',
            },
            {
              type: 'heading',
              text: 'Exception groups and except* (3.11+)',
            },
            {
              type: 'p',
              text: 'Concurrent code can fail in several places at once: three of ten tasks in a `TaskGroup` raise, or a batch validator finds five bad records. A single exception cannot represent that, so 3.11 added `ExceptionGroup` (a container of exceptions, itself an exception) and the `except*` syntax. Each `except*` clause handles the *subset* of the group matching its type and lets the rest continue propagating — several `except*` clauses can run for one group, unlike plain `except`, where at most one clause runs.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'handling several failures at once',
              code: `def validate_all(records):
    errors = []
    for i, r in enumerate(records):
        try:
            validate(r)
        except ValueError as e:
            e.add_note(f"record index {i}")     # 3.11+: extra context shown in the traceback
            errors.append(e)
    if errors:
        raise ExceptionGroup("validation failed", errors)

try:
    validate_all(batch)
except* ValueError as eg:                       # eg is an ExceptionGroup of ONLY the ValueErrors
    for e in eg.exceptions:
        log.warning("bad record: %s %s", e, e.__notes__)
except* KeyError:
    log.error("missing field somewhere")         # can ALSO run for the same group`,
            },
            {
              type: 'heading',
              text: 'Cost model and production practice',
            },
            {
              type: 'p',
              text: 'Since 3.11 CPython uses **zero-cost exceptions**: entering a `try` block costs nothing at runtime (the handlers are looked up in a side table only when something is raised), so wrapping code in `try` is free on the happy path and EAFP style ("easier to ask forgiveness than permission" — `try: d[k] except KeyError`) is idiomatic. Actually *raising* is still comparatively expensive (allocating the exception and building the traceback), so do not use exceptions for control flow in a tight loop where the exceptional case is common. In services, log an exception exactly once with full context (`log.exception(...)` inside the handler records the traceback), at the layer that decides what to do about it — catching, logging and re-raising at every layer produces the same stack trace five times in your log aggregator.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Use `raise ... from None` to deliberately hide an implementation-detail cause (for example, translating an internal `KeyError` into a clean `UnknownUserError` in a public API), and `raise` with no arguments inside an `except` block to re-raise the current exception with its original traceback intact.',
            },
          ],
        },
        {
          id: 'modules-and-imports',
          title: 'Modules, Packages & the Import System',
          summary:
            'A module is executed once per process and cached; understanding `sys.path` and `sys.modules` explains both why imports are fast on repeat and why circular imports break.',
          keyPoints: [
            'A **module** is any `.py` file; a **package** is a directory containing an `__init__.py` (or, since 3.3, an implicit namespace package without one).',
            'The first `import x` executes `x.py` top to bottom and caches the resulting module object in `sys.modules`; every subsequent `import x` anywhere just returns the cached object.',
            'Python searches `sys.path` in order to locate a module — the current script\'s directory, `PYTHONPATH`, then the standard library and installed site-packages.',
            'Absolute imports (`from mypackage.utils import helper`) are preferred over relative imports (`from .utils import helper`) for clarity, though relative imports are legitimate inside a package.',
            'A circular import (A imports B, B imports A) can fail with `ImportError` if the imported name isn\'t defined yet at the point of the circular reference — restructure the dependency rather than working around it.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Every module is executed **exactly once** per Python process, on its first import — top-level code (function/class definitions, module-level assignments, any statements at file scope) runs then, and the resulting module object is cached in `sys.modules` keyed by its fully-qualified name. Every later `import` of that same module, from anywhere in the program, skips re-execution and simply returns the cached object — which is also why mutable module-level state is effectively a process-wide singleton, and why a print statement at module top level only ever fires once no matter how many places import it.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Import["import mypackage.utils"] --> Cached{"already in\\nsys.modules?"}
    Cached -- yes --> ReturnCached["return the cached\\nmodule object immediately\\n(no re-execution)"]
    Cached -- no --> Search["search sys.path, in order:\\nscript dir -> PYTHONPATH ->\\nstdlib -> site-packages"]
    Search --> Found{"found?"}
    Found -- no --> Err["ModuleNotFoundError"]
    Found -- yes --> Execute["execute the module's\\ntop-level code, once"]
    Execute --> Cache["store the resulting module\\nobject in sys.modules"]
    Cache --> ReturnNew["return it"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'package layout and import styles',
              code: `# myapp/
#   __init__.py
#   utils.py
#   services/
#     __init__.py
#     orders.py

# absolute import -- explicit about exactly where it comes from, preferred
from myapp.utils import parse_date

# relative import -- valid inside a package, common for closely-coupled sibling modules
# (inside myapp/services/orders.py)
from ..utils import parse_date       # ".." = one level up from this module's package
from . import validators              # "." = the current package`,
            },
            {
              type: 'heading',
              text: 'Circular imports',
            },
            {
              type: 'p',
              text: 'If module A imports module B at the top level, and module B imports module A at the top level, whichever one finishes executing first will find the other only **partially initialized** in `sys.modules` — any name B needs from A that hadn\'t been defined yet (because A\'s execution paused mid-file to import B) raises `ImportError`. The real fix is almost always restructuring — extract the shared piece both modules need into a third module they both import, or move one import inside a function body so it happens lazily at call time rather than at module load time — rather than reordering imports and hoping.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A virtual environment (`python -m venv .venv`, or `uv venv`) gives each project its own isolated `site-packages`, so installing a dependency for one project never affects another\'s — the standard baseline for any real Python project, and usually the first thing to check when "it works on my machine" turns out to be a version mismatch. See the packaging and tooling topic for the modern workflow.',
            },
            {
              type: 'heading',
              text: '`__main__`, `python -m`, and import-time cost',
            },
            {
              type: 'p',
              text: 'When you run `python app.py`, that file is executed as a module named `__main__`, not `app` — so `if __name__ == "__main__":` guards code that should run only as a script, and importing `app` from elsewhere creates a *second*, separate module object (a subtle source of "my singleton exists twice" bugs). Prefer `python -m package.module`: it puts the current directory (not the script\'s folder) on `sys.path` and resolves relative imports correctly. Import time is also a real production concern for CLIs and serverless cold starts — `python -X importtime -c "import myapp"` prints a per-module breakdown of where startup time goes.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'deferring expensive imports',
              code: `# 3.15+: explicit lazy imports (PEP 810) -- bound now, loaded on first use
lazy import pandas as pd
lazy from myapp.reports import build_report

def export(rows):
    return pd.DataFrame(rows)        # pandas is actually imported here, the first time

# Any version: import inside the function that needs it
def export_legacy(rows):
    import pandas as pd              # cached in sys.modules after the first call
    return pd.DataFrame(rows)

# Type-only imports that should never run at import time
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from myapp.models import Order   # seen by the type checker, skipped at runtime`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Naming your own file after a standard-library or installed module (`random.py`, `email.py`, `requests.py`) shadows the real one, because the script directory comes first on `sys.path` — producing baffling `AttributeError: module \'random\' has no attribute \'randint\'` errors. Recent CPython versions detect this case and print a hint suggesting the file is shadowing the module.',
            },
          ],
        },
        {
          id: 'packaging-and-tooling',
          title: 'Packaging & Tooling — pyproject.toml, uv, ruff and Lockfiles',
          summary:
            'Modern Python projects are declared in `pyproject.toml`, managed by a fast resolver such as uv, linted and formatted by ruff, type-checked in CI, and deployed from a lockfile — replacing the old `setup.py` + `requirements.txt` + five-tools stack.',
          keyPoints: [
            '`pyproject.toml` is the single standard config file: project metadata and dependencies (PEP 621), the build backend (PEP 517/518), and tool settings for ruff, mypy, pytest and others.',
            'uv (from Astral, written in Rust) replaces pip, pip-tools, virtualenv, pyenv and pipx with one fast tool: it installs Python versions, creates venvs, resolves, locks and syncs.',
            'Separate *abstract* dependencies (ranges in `pyproject.toml`) from *concrete* pins (a lockfile with exact versions and hashes) — libraries publish ranges, applications deploy locks.',
            'ruff replaces flake8, isort, pyupgrade and black-style formatting with one very fast linter/formatter; pair it with a type checker and pytest in CI.',
            'Use a `src/` layout so tests run against the installed package rather than accidentally importing from the working directory.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'For years Python packaging meant `setup.py` (arbitrary code executed at install time), `requirements.txt` (a list with no distinction between direct and transitive dependencies), `virtualenv`, `pip-tools` and `pyenv` stitched together. The ecosystem has converged on standards instead: **`pyproject.toml`** declares what the project is, a **build backend** (hatchling, setuptools, flit-core, uv_build, maturin for Rust extensions) turns it into a wheel, and an installer/resolver produces a reproducible environment. **uv** has become the de facto fast front-end for that workflow; Poetry, PDM and Hatch are mature alternatives built on the same standards, and plain `pip` + `venv` still works everywhere.',
            },
            {
              type: 'code',
              language: 'toml',
              title: 'pyproject.toml for a service',
              code: `[project]
name = "orders-service"
version = "1.4.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "pydantic>=2.7,<3",
    "httpx>=0.27",
]

[dependency-groups]            # PEP 735: dev-only groups, not published as extras
dev = ["pytest>=8", "ruff", "mypy"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM", "ASYNC"]   # pycodestyle, pyflakes, isort, bugbear, pyupgrade...

[tool.mypy]
strict = true

[tool.pytest.ini_options]
addopts = "-ra --strict-markers"
testpaths = ["tests"]`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'the everyday uv workflow',
              code: `uv python install 3.14          # fetch a managed CPython build
uv init orders-service          # scaffold pyproject.toml
uv add fastapi "pydantic>=2.7"  # add deps, update uv.lock, sync .venv
uv add --dev pytest ruff        # into the dev dependency group
uv run pytest                   # run inside the project env (auto-syncs first)
uv lock --upgrade-package httpx # bump one transitive pin deliberately
uv sync --locked                # CI/prod: fail if the lockfile is out of date
uvx ruff check --fix .          # run a tool in an ephemeral env (like pipx)
uv export --format requirements-txt > requirements.txt   # for tools that need it`,
            },
            {
              type: 'heading',
              text: 'Ranges vs pins: the rule that prevents most dependency incidents',
            },
            {
              type: 'table',
              headers: ['Artifact', 'Contains', 'Who uses it'],
              rows: [
                ['`pyproject.toml` dependencies', 'Compatible ranges for *direct* dependencies only', 'Libraries (published to PyPI) and apps alike'],
                ['`uv.lock` / `poetry.lock` / `pylock.toml` (PEP 751)', 'Exact versions + hashes for the whole transitive tree', 'Applications and CI; never shipped by libraries'],
                ['`requirements.txt` with `==` pins and `--hash`', 'Legacy flat lock format', 'Older deploy pipelines, Docker images'],
              ],
            },
            {
              type: 'p',
              text: 'A **library** must declare loose ranges (`pydantic>=2.7,<3`) — pinning exact versions in a library makes it impossible to install alongside anything else that needs a different patch release. An **application** must deploy from a lockfile so that the bits tested in CI are byte-for-byte the bits in production, and should upgrade those pins deliberately (Dependabot/Renovate PRs) rather than implicitly on the next build. Hashes in the lock also protect against a compromised or re-uploaded package on the index — part of basic supply-chain hygiene, alongside trusted publishing to PyPI and scanning with `pip-audit`.',
            },
            {
              type: 'code',
              language: 'dockerfile',
              title: 'a reproducible, cache-friendly container build',
              code: `FROM python:3.14-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
# 1) dependencies only -- this layer is cached until the lockfile changes
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project
# 2) then the application code
COPY src ./src
RUN uv sync --locked --no-dev
CMD ["/app/.venv/bin/uvicorn", "orders_service.main:app", "--host", "0.0.0.0"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Pin the uv image to a specific version tag in real pipelines rather than `latest`, for the same reproducibility reason you lock dependencies. And remember that wheels are platform-specific for packages with C/Rust extensions: lock and build on the same OS/architecture (and libc — musl-based Alpine images often force slow source builds) that you deploy to.',
            },
            {
              type: 'heading',
              text: 'Project layout',
            },
            {
              type: 'code',
              language: 'text',
              title: 'src layout',
              code: `orders-service/
  pyproject.toml
  uv.lock
  src/
    orders_service/
      __init__.py
      main.py
      py.typed        # marker: this package ships inline type hints (PEP 561)
  tests/
    conftest.py
    test_orders.py`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'With a flat layout, `pytest` run from the repo root can import `orders_service` straight from the working directory and pass even though the *installed* package is broken (missing files in the wheel, wrong package data). The `src/` layout forces tests to import the installed (editable) package, so packaging mistakes surface in CI instead of in production.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never `sudo pip install` into the system interpreter. Modern Linux distributions mark it "externally managed" (PEP 668) and refuse, because overwriting distro-owned packages can break OS tools. Use a venv per project and `uv tool install`/`pipx` for global CLI tools.',
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
            'Free-threaded CPython (PEP 703) arrived as an experimental build in 3.13 and became officially supported — but still optional, not the default — in 3.14 (PEP 779); it runs as a separate `python3.14t` interpreter.',
            'The GIL never made *your* code thread-safe: it protects the interpreter\'s internals, but a compound operation like `counter += 1` can still be interrupted between bytecodes. Use locks or queues regardless of build.',
            'Other parallelism options: `ProcessPoolExecutor` (pickling cost, separate memory), subinterpreters via `concurrent.interpreters`/`InterpreterPoolExecutor` (3.14), and native code that releases the GIL.',
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
                '**Free-threaded builds** (PEP 703) are the forward-looking answer to "will this always be true": experimental in 3.13, officially supported but still opt-in from 3.14 (PEP 779). They give genuine multi-core parallelism for pure-Python threads without multiprocessing\'s memory-isolation and pickling overhead — at a single-threaded cost the 3.14 docs put at roughly 5–10%, and only if every C extension you import has been made thread-safe.',
              ],
            },
            {
              type: 'heading',
              text: 'How the GIL actually works',
            },
            {
              type: 'p',
              text: 'The GIL exists mainly because CPython\'s memory management is built on **non-atomic reference counting**: every `Py_INCREF`/`Py_DECREF` is a plain integer update, and without a global lock two threads could corrupt a refcount and free a live object. A thread holding the GIL runs bytecode until it blocks on I/O (C code explicitly releases the GIL around `read()`, `recv()`, `sleep()`, compression, hashing of large buffers, and so on) or until another thread has been waiting longer than the **switch interval** (`sys.getswitchinterval()`, 5 ms by default), at which point the running thread is asked to drop the GIL at the next safe point. That forced switching is why CPU-bound threads do not merely fail to speed up but can get slightly *slower*: they spend time handing the lock back and forth and trashing each other\'s CPU caches.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'the GIL does not make compound operations atomic',
              code: `import threading

counter = 0
def work():
    global counter
    for _ in range(1_000_000):
        counter += 1          # LOAD, ADD, STORE: a thread switch can land between them

threads = [threading.Thread(target=work) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(counter)                # may be < 4_000_000 -- lost updates, even WITH the GIL

lock = threading.Lock()
def safe_work():
    global counter
    for _ in range(1_000_000):
        with lock:
            counter += 1      # correct on both GIL and free-threaded builds`,
            },
            {
              type: 'heading',
              text: 'Free-threaded CPython: what changes',
            },
            {
              type: 'p',
              text: 'The free-threaded build replaces the GIL with a set of finer-grained techniques: **biased reference counting** (the owning thread updates a refcount cheaply; other threads use atomic operations), **immortal objects** for shared singletons, per-object locks inside built-in containers so a `list` or `dict` is never corrupted by concurrent access, deferred reference counting for frequently shared objects such as functions and modules, and the `mimalloc` allocator. Built-in operations on a single container stay internally consistent, but **your** read-modify-write sequences still need locks, exactly as above. C extensions must declare free-threading support; importing one that does not re-enables the GIL at runtime (with a warning) unless you force it off with `PYTHON_GIL=0` / `-X gil=0`.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'checking which build you are on',
              code: `uv python install 3.14t                # or the "free-threaded" option in the python.org installer
python3.14t -c "import sys; print(sys._is_gil_enabled())"   # False on a free-threaded build
python3.14t -X gil=1 app.py            # force the GIL back on for comparison
python -c "import sysconfig; print(sysconfig.get_config_var('Py_GIL_DISABLED'))"  # 1 = free-threaded build`,
            },
            {
              type: 'table',
              headers: ['Approach', 'True CPU parallelism?', 'Shared memory?', 'Main cost'],
              rows: [
                ['`threading` (GIL build)', 'No for Python code; yes inside GIL-releasing C code', 'Yes', 'GIL contention; race conditions'],
                ['`threading` (free-threaded build)', 'Yes', 'Yes', '~5–10% single-thread slowdown; extension compatibility; you own thread safety'],
                ['`multiprocessing` / `ProcessPoolExecutor`', 'Yes', 'No (pickle data across; `shared_memory` for buffers)', 'Process startup, serialization, memory per worker'],
                ['`concurrent.interpreters` (3.14)', 'Yes (one GIL per interpreter)', 'Very limited', 'Young API; many extensions not yet compatible'],
                ['`asyncio`', 'No', 'Yes, single thread', 'Needs async-native libraries end to end'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Since 3.14 the default `multiprocessing` start method on Linux changed from `fork` to `forkserver` (macOS and Windows already used `spawn`). Code that relied on `fork` silently inheriting module-level globals, open connections or lambdas in child processes can now fail with pickling errors — pass picklable, top-level functions and explicit arguments, and guard the entry point with `if __name__ == "__main__":`.',
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
            {
              type: 'code',
              language: 'python',
              title: 'threads don\'t help a CPU-bound loop — processes do',
              code: `import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def count_to(n):
    total = 0
    for i in range(n):
        total += i
    return total

# MISLEADING FIX: throwing threads at pure computation.
# The GIL means only one thread runs Python bytecode at a time, so this
# takes roughly the SAME time as running count_to(50_000_000) twice in a row --
# sometimes slightly WORSE, once you add the thread overhead.
start = time.perf_counter()
with ThreadPoolExecutor(max_workers=2) as pool:
    list(pool.map(count_to, [25_000_000, 25_000_000]))
print("threads:", time.perf_counter() - start)

# ACTUAL FIX: separate processes, each with its own interpreter and GIL --
# they genuinely run on different CPU cores at the same time.
start = time.perf_counter()
with ProcessPoolExecutor(max_workers=2) as pool:
    list(pool.map(count_to, [25_000_000, 25_000_000]))
print("processes:", time.perf_counter() - start)  # meaningfully faster on a multi-core machine`,
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
            'Sequential `await` in a loop runs coroutines one at a time; `asyncio.gather(*coros)` or, preferably since 3.11, an `asyncio.TaskGroup` runs them concurrently.',
            'Offload unavoidable blocking calls with `asyncio.to_thread()` and CPU-bound work with a process pool via `loop.run_in_executor()`.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`asyncio` provides single-threaded **cooperative multitasking**: an event loop runs one coroutine at a time, and a coroutine voluntarily yields control (at every `await` point) back to the loop, which then runs another ready coroutine. Nothing runs in true parallel — the concurrency comes entirely from overlapping *waiting* time (e.g., while one coroutine awaits a network response, the loop runs another coroutine that\'s ready to proceed), which is exactly the profile of I/O-bound web backend workloads (mostly waiting on DB queries, external API calls, disk I/O).',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant EventLoop as Event Loop, single thread
    participant A as Coroutine A
    participant B as Coroutine B
    A->>EventLoop: await db.fetch -- yields control
    EventLoop->>B: resume B, it was ready
    B->>EventLoop: await http.get -- yields control
    EventLoop->>A: A's DB result is ready -- resume A
    A->>EventLoop: return result -- A finishes
    EventLoop->>B: B's HTTP result is ready -- resume B
    B->>EventLoop: return result -- B finishes
    Note over EventLoop: never two coroutines running at the SAME instant -- only ever overlapping WAIT time`,
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
              text: 'A blocking call inside an `async def` handler doesn\'t just slow down that one request — it stalls every other in-flight request being served by that same event loop for the duration of the block. Run with `PYTHONASYNCIODEBUG=1` (or `asyncio.run(main(), debug=True)`) in development: the loop then logs every callback that holds it for longer than 100 ms, which pinpoints the blocking call.',
            },
            {
              type: 'heading',
              text: 'What a coroutine really is',
            },
            {
              type: 'p',
              text: 'A coroutine is built on the same suspendable-frame machinery as a generator. `await x` delegates to `x.__await__()`, and somewhere at the bottom of every await chain sits a **Future** — an object representing a result that does not exist yet. When a coroutine awaits a Future that is not done, the whole chain of frames suspends and control returns to the event loop. The loop itself is a `while True` around the OS readiness API (`epoll` on Linux, `kqueue` on macOS, IOCP on Windows): it asks which sockets are ready, runs the callbacks that resolve the corresponding Futures, and resumes the **Tasks** wrapping the coroutines that were waiting on them. A `Task` is just a Future that drives a coroutine step by step. Nothing preempts a running coroutine — so between two `await`s your code is effectively atomic with respect to other tasks, which is why asyncio code rarely needs locks for simple shared state (and why a CPU-heavy loop with no `await` starves everyone).',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Loop["event loop<br/>(one thread)"] -->|"select/epoll:<br/>which sockets are ready?"| OS["OS kernel"]
    OS -->|"socket 7 readable"| Loop
    Loop -->|"set_result on the Future<br/>waiting on socket 7"| Fut["Future"]
    Fut -->|"wake the Task"| Task["Task wrapping<br/>your coroutine"]
    Task -->|"run until the<br/>next await"| Loop`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'offloading blocking and CPU-bound work correctly',
              code: `import asyncio, hashlib
from concurrent.futures import ProcessPoolExecutor

def legacy_sync_call(user_id: int) -> dict: ...     # e.g. a sync SDK
def hash_password(pw: bytes) -> bytes:               # CPU-bound
    return hashlib.scrypt(pw, salt=b"s", n=2**14, r=8, p=1)

process_pool = ProcessPoolExecutor()

async def handler(user_id: int, pw: bytes):
    # blocking I/O -> default thread pool, the loop keeps serving other tasks
    profile = await asyncio.to_thread(legacy_sync_call, user_id)
    # CPU-bound -> a process pool (threads would still hold the GIL for pure-Python CPU work)
    loop = asyncio.get_running_loop()
    digest = await loop.run_in_executor(process_pool, hash_password, pw)
    return profile, digest`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Debugging a hung async service used to mean guessing. Since 3.14, `python -m asyncio ps <PID>` and `python -m asyncio pstree <PID>` attach to a running process and print every task with its await chain, and `asyncio.print_call_graph()` does the same from inside the program — the async equivalent of a thread dump.',
            },
          ],
        },
        {
          id: 'asyncio-structured-concurrency',
          title: 'Structured Concurrency — TaskGroup, Timeouts & Cancellation',
          summary:
            '`asyncio.TaskGroup` and `asyncio.timeout()` (3.11+) make concurrent tasks behave like a block of code: they start together, finish together, and fail together — fixing the orphaned-task and swallowed-error problems of bare `create_task` and `gather`.',
          keyPoints: [
            'Structured concurrency: no task outlives the block that created it. `async with asyncio.TaskGroup() as tg:` waits for every child task before exiting.',
            'If any child raises, the TaskGroup cancels the remaining siblings and raises an `ExceptionGroup` containing all the failures — nothing is silently lost.',
            '`asyncio.timeout(seconds)` cancels the enclosed work and raises `TimeoutError`; it composes with nested timeouts and with TaskGroup.',
            'Cancellation is delivered as `CancelledError` at the next `await`; always let it propagate (clean up in `finally`, then re-raise) or you break timeouts and shutdown.',
            'Bound concurrency explicitly with `asyncio.Semaphore` — unbounded fan-out to 10,000 URLs exhausts sockets, memory, and the patience of the server you are calling.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`asyncio.gather()` and fire-and-forget `create_task()` share a flaw: task lifetimes are not tied to any scope. With `gather`, if one coroutine raises, the exception propagates immediately but the other coroutines **keep running in the background**, unobserved; a bare `create_task` can be garbage-collected or fail with an error nobody ever sees ("Task exception was never retrieved"). **Structured concurrency** — an idea popularized by Trio and adopted into asyncio as `TaskGroup` in 3.11 — fixes this by making a group of tasks lexically scoped: the `async with` block does not exit until every child is done, and a failure in one child cancels its siblings.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'TaskGroup with bounded concurrency and a deadline',
              code: `import asyncio
import httpx

async def fetch_one(client: httpx.AsyncClient, sem: asyncio.Semaphore, url: str) -> dict:
    async with sem:                                  # at most N requests in flight
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()

async def fetch_all(urls: list[str], max_in_flight: int = 20) -> list[dict]:
    sem = asyncio.Semaphore(max_in_flight)
    async with httpx.AsyncClient(timeout=10) as client:
        async with asyncio.timeout(30):              # overall deadline for the whole batch
            async with asyncio.TaskGroup() as tg:
                tasks = [tg.create_task(fetch_one(client, sem, u)) for u in urls]
    # reaching here means EVERY task succeeded
    return [t.result() for t in tasks]

try:
    results = asyncio.run(fetch_all(urls))
except* httpx.HTTPStatusError as eg:
    print(f"{len(eg.exceptions)} requests failed with bad status")
except* TimeoutError:
    print("batch exceeded its 30s deadline")`,
            },
            {
              type: 'table',
              headers: ['', '`asyncio.gather()`', '`asyncio.TaskGroup`'],
              rows: [
                ['On first failure', 'Raises it; other awaitables keep running unless you cancel them', 'Cancels remaining siblings, waits for them, raises `ExceptionGroup`'],
                ['Multiple failures', 'Only the first is raised (others lost) unless `return_exceptions=True`', 'All collected in the `ExceptionGroup`'],
                ['Collect partial results despite failures', 'Yes, with `return_exceptions=True`', 'Not directly — catch inside each task if you want partial results'],
                ['Adding tasks dynamically', 'No — fixed list up front', 'Yes, `tg.create_task()` anywhere inside the block'],
                ['Available since', 'Forever', '3.11'],
              ],
            },
            {
              type: 'heading',
              text: 'Cancellation semantics you must respect',
            },
            {
              type: 'p',
              text: '`task.cancel()` does not stop a task immediately; it schedules a `CancelledError` to be thrown into the coroutine at its current `await`. Timeouts, TaskGroup sibling cancellation, server shutdown and client disconnects in ASGI frameworks are all built on this. Since 3.8 `CancelledError` inherits from `BaseException`, so `except Exception:` no longer swallows it by accident — but a bare `except:` or `except BaseException:` that does not re-raise will turn a cancellation into a hang. Use `finally` (or `async with`) for cleanup, keep cleanup short, and if a critical section must not be interrupted, wrap it in `asyncio.shield()` knowing the outer await still gets cancelled.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'cooperating with cancellation',
              code: `async def worker(queue: asyncio.Queue):
    while True:
        job = await queue.get()
        try:
            await process(job)
        except asyncio.CancelledError:
            await requeue(job)           # brief cleanup...
            raise                        # ...then ALWAYS re-raise
        except Exception:
            log.exception("job %s failed", job.id)
        finally:
            queue.task_done()

# Fire-and-forget done right (when a TaskGroup scope genuinely does not fit):
background: set[asyncio.Task] = set()
def spawn(coro):
    task = asyncio.create_task(coro)
    background.add(task)                     # strong reference prevents GC mid-flight
    task.add_done_callback(background.discard)
    return task`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Mixing old-style timeouts: `asyncio.wait_for(coro, timeout)` still works, but nested `wait_for` calls and manual `loop.call_later` cancellation are error-prone. Prefer `async with asyncio.timeout(...)` (or `asyncio.timeout_at()` for absolute deadlines) and pass deadlines down the call chain. And never call `asyncio.run()` from inside a running loop (for example inside a Jupyter cell or an async framework) — it raises `RuntimeError`; just `await` the coroutine instead.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Alternatives worth knowing: **Trio** pioneered structured concurrency with "nurseries"; **AnyIO** provides Trio-style task groups and cancel scopes on top of either asyncio or Trio, and is what Starlette/FastAPI use internally. **uvloop** is a drop-in, libuv-based event loop implementation that is often noticeably faster for network-heavy services.',
            },
          ],
        },
        {
          id: 'metaclasses-and-descriptors',
          title: 'Metaclasses & Descriptors — How Class Creation and Attribute Access Really Work',
          summary:
            'Classes are themselves objects, created by calling a metaclass; and attribute access on an instance is itself a small protocol — the one `@property` is built directly on top of.',
          keyPoints: [
            'A class is an instance of `type` (its metaclass) — `class Foo: ...` is sugar for calling `type(name, bases, namespace)` to build the class object itself.',
            'A custom metaclass (`class Meta(type)`, then `class Foo(metaclass=Meta)`) can hook class *creation* itself — validating fields, auto-registering subclasses, injecting methods.',
            'Multiple inheritance is resolved via the **MRO** (Method Resolution Order, computed by the C3 linearization algorithm) — `ClassName.__mro__` shows the exact lookup order, and `super()` walks it.',
            'A **descriptor** is an object implementing `__get__`/`__set__`/`__delete__`, placed as a class attribute — it intercepts attribute access on every instance.',
            '`@property` is a built-in data descriptor: `@property` def getter, `.setter` def setter — the mechanism behind computed, validated attributes that still look like plain field access.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'In Python, **everything is an object — including classes themselves**. A class is an instance of its **metaclass**, and by default that metaclass is `type`. `class Foo: x = 1` is executed by Python roughly as `Foo = type("Foo", (), {"x": 1})` — `type` is called with the class\'s name, its base classes, and its namespace (the dict of everything defined in the class body), and it returns a new class object. This is why `type(some_instance)` gives you its class, and `type(SomeClass)` gives you `type` itself (or a custom metaclass, if one was used).',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    ClassStmt["class Foo(Base):\\n    x = 1\\n    def method(self): ..."] --> Namespace["Python executes the class body,\\ncollecting a namespace dict:\\n{'x': 1, 'method': <function>}"]
    Namespace --> Call["metaclass(name, bases, namespace)\\ne.g. type('Foo', (Base,), {...})"]
    Call --> ClassObj["Foo -- a class object,\\nitself an instance of the metaclass"]
    ClassObj --> Instantiate["Foo() -- calls Foo.__call__,\\nwhich runs __new__ then __init__"]
    Instantiate --> Instance["an instance of Foo"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'a metaclass hooking class creation',
              code: `class ValidatedMeta(type):
    def __new__(mcs, name, bases, namespace):
        for attr, value in namespace.items():
            if callable(value) and not attr.startswith("_"):
                if not value.__doc__:
                    raise TypeError(f"{name}.{attr} is missing a docstring")
        return super().__new__(mcs, name, bases, namespace)

class Service(metaclass=ValidatedMeta):
    def run(self):
        """Docstring required by ValidatedMeta, or class creation itself fails."""
        ...

# real-world equivalents of this pattern: ORM base classes (Django models, SQLAlchemy's
# declarative base) use a metaclass to scan class-body annotations and turn them into
# actual database column descriptors at class-creation time, before any instance exists.`,
            },
            {
              type: 'p',
              text: 'Before writing a metaclass, check whether a lighter hook does the job — most real uses do not need one. `__init_subclass__` (3.6+) runs on the parent whenever a subclass is created, which covers plugin registration and subclass validation; class decorators can post-process a single class; `__set_name__` lets a descriptor learn its attribute name. Metaclasses also compose badly: a class cannot have two unrelated metaclasses, so combining two frameworks that each insist on their own metaclass raises a `TypeError: metaclass conflict`.',
            },
            {
              type: 'code',
              language: 'python',
              title: '__init_subclass__: plugin registration without a metaclass',
              code: `class Exporter:
    registry: dict[str, type["Exporter"]] = {}

    def __init_subclass__(cls, /, format: str, **kwargs):
        super().__init_subclass__(**kwargs)
        if format in Exporter.registry:
            raise TypeError(f"duplicate exporter for {format!r}")
        Exporter.registry[format] = cls

class CsvExporter(Exporter, format="csv"): ...
class JsonExporter(Exporter, format="json"): ...

Exporter.registry["csv"]     # <class 'CsvExporter'> -- registered at class-creation time`,
            },
            {
              type: 'heading',
              text: 'MRO and `super()` under multiple inheritance',
            },
            {
              type: 'p',
              text: 'When a class inherits from more than one base, Python needs a deterministic order to search for an attribute/method — the **Method Resolution Order**, computed by the **C3 linearization** algorithm, which guarantees a consistent order that respects each base class\'s own MRO and never puts a class before its own subclass. `ClassName.__mro__` shows this order directly, and `super()` doesn\'t mean "my direct parent" — it means "the next class in the MRO after the current one", which is precisely what makes cooperative multiple inheritance (every class\'s `__init__` calling `super().__init__()`) work correctly even in diamond-shaped hierarchies.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'MRO in a diamond hierarchy',
              code: `class Base:
    def greet(self): print("Base")

class Left(Base):
    def greet(self): print("Left"); super().greet()

class Right(Base):
    def greet(self): print("Right"); super().greet()

class Child(Left, Right):
    def greet(self): print("Child"); super().greet()

Child().greet()
# Child -> Left -> Right -> Base   (each super() call follows the MRO, not "my direct parent")
print(Child.__mro__)  # (Child, Left, Right, Base, object) -- the exact search/call order`,
            },
            {
              type: 'heading',
              text: 'Descriptors — the protocol `@property` is built on',
            },
            {
              type: 'p',
              text: 'A **descriptor** is any object defining `__get__` (and optionally `__set__`/`__delete__`) that is placed as a **class-level** attribute. When you access `instance.attr`, if `type(instance).attr` is a descriptor, Python routes the access through its `__get__`/`__set__` methods instead of doing a plain dict lookup — this is exactly how `@property` works under the hood: `@property` wraps a getter function into a descriptor object, and `.setter` attaches a setter to that same descriptor. A descriptor defining both `__get__` and `__set__` is a **data descriptor** and takes priority over an instance\'s own `__dict__`; one defining only `__get__` is a **non-data descriptor** (this is how plain methods work — a function is a non-data descriptor, which is why `instance.method` binds `self` automatically) and an instance attribute of the same name would shadow it.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Access["instance.balance"] --> Check{"is 'balance' a data\\ndescriptor on the CLASS?\\n(has __get__ AND __set__)"}
    Check -- yes --> Descriptor["call type(instance).balance.__get__(instance, type)\\n-- this is what @property does"]
    Check -- no --> InstDict{"is 'balance' in\\ninstance.__dict__?"}
    InstDict -- yes --> Plain["return instance.__dict__['balance']\\ndirectly"]
    InstDict -- no --> NonData{"non-data descriptor\\non the class? (e.g. a method)"}
    NonData -- yes --> Bind["bind and return\\n(e.g. a bound method)"]
    NonData -- no --> AttrErr["AttributeError"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: '@property, and the descriptor it desugars to',
              code: `class Account:
    def __init__(self, balance):
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("balance cannot go negative")
        self._balance = value

acct = Account(100)
acct.balance          # calls the getter -- looks like plain field access
acct.balance = 50     # calls the setter -- validation runs transparently
# acct.balance = -10  # raises ValueError -- impossible to bypass via normal attribute access

# a hand-rolled descriptor doing roughly the same thing @property does internally
class PositiveNumber:
    def __set_name__(self, owner, name):
        self.private_name = f"_{name}"
    def __get__(self, obj, objtype=None):
        return getattr(obj, self.private_name)
    def __set__(self, obj, value):
        if value < 0:
            raise ValueError("must be positive")
        setattr(obj, self.private_name, value)

class Account2:
    balance = PositiveNumber()   # a class-level descriptor instance
    def __init__(self, balance):
        self.balance = balance   # routes through PositiveNumber.__set__`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is not just theory: Django model fields, SQLAlchemy columns, and `functools.cached_property` are all descriptors under the hood — recognizing "class attribute that intercepts get/set with custom logic" as a descriptor is what makes those APIs feel less like magic.',
            },
          ],
        },
        {
          id: 'memory-management-and-gc',
          title: 'Memory Management, Reference Counting & Garbage Collection',
          summary:
            'CPython frees most objects the instant their reference count hits zero, and runs a separate generational garbage collector specifically to catch the reference cycles that counting alone can never resolve.',
          keyPoints: [
            'Every object carries a reference count; it is deallocated immediately once that count drops to zero — this is why most memory is reclaimed promptly and deterministically, unlike a purely mark-and-sweep GC.',
            'A **reference cycle** (two or more objects referencing each other) never naturally reaches a refcount of zero, even after nothing external references the cycle — refcounting alone leaks it.',
            'The generational **garbage collector** (the `gc` module) periodically scans for and collects unreachable cycles, using three generations to avoid re-scanning long-lived objects on every pass.',
            '`weakref` creates a reference that does not increment the refcount, letting you observe an object without keeping it alive — used to break cycles deliberately (e.g. a parent/child back-reference).',
            '`__slots__` on a class skips creating a per-instance `__dict__`, cutting memory per instance meaningfully when creating very many instances of a simple class.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'CPython\'s primary memory-reclamation mechanism is **reference counting**: every object carries a count of how many references point to it, incremented on every new binding (assignment, appending to a container, passing as an argument) and decremented whenever a reference goes out of scope, is reassigned, or is explicitly deleted (`del`). The moment that count hits zero, the object is deallocated **immediately** — not on some later GC pass — which is why Python\'s memory reclamation is largely prompt and deterministic rather than the unpredictable pauses associated with some other garbage-collected languages.',
            },
            {
              type: 'heading',
              text: 'The gap refcounting can\'t close: reference cycles',
            },
            {
              type: 'p',
              text: 'Refcounting has exactly one blind spot: **reference cycles**. If object A references object B and B references A (directly, or through a longer chain), each keeps the other\'s count at least 1 forever, even after nothing outside the cycle references either one — refcounting alone would leak this memory permanently. This is common and often accidental: a parent object holding a list of children, each child holding a `.parent` back-reference, is already a cycle.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Unreachable["unreachable from any live root, but refcounts > 0"]
      A["Node A\\nrefcount: 1"] -->|.next| B["Node B\\nrefcount: 1"]
      B -->|.prev| A
    end
    External["your code's last variable\\npointing at this pair"] -.->|"del'd / went out of scope"| A
    GC["generational garbage collector"] -.->|"periodically scans for\\nand reclaims exactly this pattern"| Unreachable`,
            },
            {
              type: 'p',
              text: 'This is exactly what the separate **generational garbage collector** (the `gc` module, running automatically alongside refcounting) exists to catch: it periodically traces object graphs looking for groups of objects that are only reachable from within themselves (a cycle) and not from any external root, and reclaims the whole group at once. It organizes tracked objects into three **generations** (new objects start in generation 0); an object that survives a collection pass is promoted to the next generation, which is scanned less frequently — the working assumption (borne out empirically) being that most objects die young, so scanning long-lived objects on every pass would be wasted work. Collections are triggered by allocation counts (`gc.get_threshold()`), not by a timer. CPython 3.14.0 briefly shipped an *incremental* collector with two generations to cut pause times, but it was reverted to the 3.13-style generational GC in 3.14.5 after reports of higher memory pressure — a good reminder that GC internals are implementation details that change between patch releases.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a cycle, and breaking it with weakref',
              code: `import gc, weakref

class Node:
    def __init__(self, name):
        self.name = name
        self.parent = None
        self.children = []

parent = Node("parent")
child = Node("child")
parent.children.append(child)
child.parent = parent          # <- a genuine reference cycle: parent -> child -> parent

del parent, child
# both are now unreachable from your code, but each still holds a refcount from the
# other -- pure refcounting would leak them; gc.collect() finds and frees the cycle
gc.collect()

# the idiomatic fix: make the back-reference a weakref so it never
# contributes to the refcount in the first place, no cycle is ever created
class NodeFixed:
    def __init__(self, name):
        self.name = name
        self.parent = None          # will hold a weakref.ref, not a strong reference
        self.children = []

    def add_child(self, child):
        self.children.append(child)
        child.parent = weakref.ref(self)   # doesn't increment self's refcount

# reading it back: call the weakref -- returns None once the parent is gone
# parent_obj = child.parent()
# weakref.WeakValueDictionary / WeakSet build caches that don't keep entries alive`,
            },
            {
              type: 'heading',
              text: 'Finding memory leaks in a long-running process',
            },
            {
              type: 'p',
              text: 'Pure-Python "leaks" are almost always objects that are still reachable: an ever-growing module-level cache or list, an unbounded `lru_cache`, callbacks registered and never removed, or tracebacks stored with their frames (an exception object keeps every local variable of every frame in its traceback alive). `tracemalloc` snapshots compared over time show which source lines own the growing allocations. Also note that CPython\'s small-object allocator (pymalloc) and the C library allocator do not always return freed memory to the OS, so a process\'s RSS can stay high after a spike even with no leak — a reason to recycle workers periodically (`max_requests` in Gunicorn).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'diffing tracemalloc snapshots, and __slots__ savings',
              code: `import tracemalloc

tracemalloc.start(25)                     # keep 25 frames of allocation traceback
before = tracemalloc.take_snapshot()
run_suspect_workload()
after = tracemalloc.take_snapshot()
for stat in after.compare_to(before, "lineno")[:5]:
    print(stat)                           # top 5 lines by memory growth

class PointDict:                          # each instance carries a __dict__
    def __init__(self, x, y): self.x, self.y = x, y

class PointSlots:                         # fixed attribute slots, no per-instance __dict__
    __slots__ = ("x", "y")
    def __init__(self, x, y): self.x, self.y = x, y
# For millions of small objects, slots typically cut per-instance memory substantially
# and make attribute access slightly faster -- at the cost of no dynamic attributes.`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'In pre-fork servers (Gunicorn with `preload_app`), call `gc.freeze()` in the parent after loading the app: it moves all existing objects into a permanent generation the collector ignores, so the GC does not touch (and thereby copy-on-write duplicate) memory pages shared with the forked workers.',
            },
          ],
        },
        {
          id: 'performance-and-profiling',
          title: 'Performance Engineering & Profiling',
          summary:
            'Fast Python comes from measuring first, then choosing better algorithms, pushing loops into C (built-ins, NumPy, Polars), caching, and only then reaching for compiled extensions — not from micro-tricks applied by intuition.',
          keyPoints: [
            'Measure before optimizing: `timeit` for micro-benchmarks, `cProfile` (now also `profiling.tracing`) for deterministic call counts, and sampling profilers (py-spy, Scalene, `profiling.sampling` in 3.15) for production-like workloads with low overhead.',
            'The biggest wins are algorithmic and structural: the right data structure, batching I/O (fixing N+1 queries), and avoiding repeated work — not rewriting a loop to save one attribute lookup.',
            'Python is slow per bytecode, fast per C call: move inner loops into built-ins, comprehensions, `str.join`, NumPy/Polars vectorized operations, or `itertools`.',
            'When a hot path must be fast, compile it: Cython, mypyc, or a Rust extension via PyO3/maturin — and keep the boundary coarse because each Python-to-native call has overhead.',
            'Modern CPython itself gets faster each release (specialization since 3.11, experimental JIT); upgrading the interpreter is often the cheapest optimization available.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Every bytecode instruction in CPython costs on the order of nanoseconds of dispatch overhead, plus pointer chasing to heap-allocated objects — so an inner loop doing 100 million simple additions in pure Python takes seconds, while the same work in a NumPy vectorized call takes milliseconds because it runs one tight C loop over contiguous machine integers. That cost model drives the whole playbook: reduce the number of bytecodes executed per unit of work, and hand bulk work to code written in C or Rust.',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Define the target** — a latency budget or throughput number, measured on realistic data. Without one you cannot know when to stop.',
                '**Profile** to find where time actually goes. Wall-clock samples for I/O-heavy services; CPU samples for compute.',
                '**Fix the biggest item first**, usually algorithmic (O(n²) to O(n log n)), I/O shape (batch queries, connection pooling, concurrency), or redundant work (caching).',
                '**Vectorize or delegate** remaining hot loops to built-ins/NumPy/Polars.',
                '**Compile** only the proven hot path (Cython, mypyc, PyO3), or scale out with processes.',
                '**Re-measure** and add a benchmark to CI so the regression cannot silently return.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'the profiling toolbox',
              code: `python -m timeit -s "xs = list(range(10_000))" "sum(xs)"     # micro-benchmark
python -m cProfile -s cumulative app.py                         # deterministic, per function
python -m profiling.sampling run app.py                         # 3.15+ built-in sampling profiler
py-spy top --pid 12345                                          # attach to a live process, no restart
py-spy record -o profile.svg --pid 12345                        # flame graph from production
scalene app.py                                                  # CPU vs native vs memory, per line
python -X importtime -c "import app" 2> import.log              # startup cost per module`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'same result, very different cost',
              code: `import numpy as np

values = list(range(10_000_000))

# 1) pure Python loop: millions of bytecodes and boxed int objects
total = 0
for v in values:
    total += v * v

# 2) generator into a built-in: the loop is still Python, but sum() itself runs in C
total = sum(v * v for v in values)

# 3) vectorized: one C loop over contiguous int64s -- typically orders of magnitude faster
arr = np.arange(10_000_000, dtype=np.int64)
total = int(np.dot(arr, arr))

# Caching repeated work is often a bigger win than any of the above
from functools import lru_cache
@lru_cache(maxsize=4096)
def tax_rate(region: str) -> float: ...`,
            },
            {
              type: 'table',
              headers: ['Technique', 'Typical gain', 'Cost / caveat'],
              rows: [
                ['Better algorithm / data structure', 'Unbounded (changes complexity class)', 'Thinking time'],
                ['Batching I/O, fixing N+1 queries', 'Often 10–100x on request latency', 'Query/API redesign'],
                ['Built-ins, comprehensions, `join`', 'Modest (tens of percent)', 'Almost free'],
                ['NumPy / Polars vectorization', 'Large for numeric/tabular work', 'Data must fit array/columnar model'],
                ['Cython / mypyc / PyO3 extension', 'Large on tight loops', 'Build complexity, platform wheels'],
                ['`multiprocessing` / free-threaded build', 'Up to number of cores', 'Serialization or thread-safety work'],
                ['PyPy', 'Large for long-running pure-Python code', 'C-extension compatibility, version lag'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Micro-benchmarks lie easily: a `timeit` result on 100 integers says nothing about cache behavior on 10 million, and deterministic profilers like `cProfile` add per-call overhead that inflates the apparent cost of small, frequently called functions. Confirm a finding with a sampling profiler or an end-to-end benchmark before rewriting code around it.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Optimize the algorithm before the implementation — an O(n²) function micro-optimized into a slightly faster O(n²) function is almost always the wrong fix compared to finding the O(n log n) or O(n) approach in the first place. Profiling tells you *where* time goes; it doesn\'t replace choosing better data structures and algorithms.',
            },
          ],
        },
        {
          id: 'testing-with-pytest',
          title: 'Testing with pytest — Fixtures, Parametrize & Mocking',
          summary:
            'pytest\'s fixture system builds exactly the test setup a test declares it needs, parametrize turns one test into many, and mocking isolates a test from the dependencies it shouldn\'t actually call.',
          keyPoints: [
            'A test is just a function named `test_*`; `assert` alone is enough — pytest rewrites assertions to show rich failure diffs without needing `self.assertEqual`-style methods.',
            'A **fixture** (`@pytest.fixture`) provides setup (and, via `yield`, teardown) that a test requests by naming it as a parameter — pytest resolves and injects it automatically.',
            'Fixtures can depend on other fixtures, forming a dependency graph pytest resolves per test, matching each fixture\'s declared **scope** (`function`, `class`, `module`, `session`).',
            '`@pytest.mark.parametrize` runs the same test body against multiple input/expected-output pairs, reported as separate test cases.',
            '`unittest.mock.Mock`/`MagicMock`/`patch` (or pytest\'s `monkeypatch`) replace a real dependency (an API call, a DB write) with a controllable stand-in, so a unit test doesn\'t depend on external systems.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'a first pytest test, no boilerplate',
              code: `# test_math_utils.py
from math_utils import add

def test_add_positive_numbers():
    assert add(2, 3) == 5

def test_add_negative_numbers():
    assert add(-1, -1) == -2
# run with: pytest -v
# a failing assert gets a rich, auto-generated diff -- no assertEqual/assertTrue needed`,
            },
            {
              type: 'heading',
              text: 'Fixtures — declared dependencies, resolved automatically',
            },
            {
              type: 'p',
              text: 'A fixture is a function decorated with `@pytest.fixture` that a test (or another fixture) requests simply by naming it as a parameter — pytest inspects each test\'s signature, matches parameter names to fixture names, resolves the whole dependency graph (fixtures can themselves depend on other fixtures), and injects the results. A fixture using `yield` instead of `return` splits cleanly into setup (before `yield`) and teardown (after it, guaranteed to run even if the test fails) — the same before/after shape as a context manager.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Test["test_create_order(client, db_session, sample_user)"] --> Client["fixture: client\\n(depends on: app)"]
    Test --> DBSession["fixture: db_session\\n(depends on: db_engine)"]
    Test --> SampleUser["fixture: sample_user\\n(depends on: db_session)"]
    Client --> App["fixture: app\\n(scope: session)"]
    DBSession --> DBEngine["fixture: db_engine\\n(scope: session)"]
    SampleUser -.->|"reuses the SAME\\ndb_session instance"| DBSession
    App -. built once per test session .- SessionNote(( ))
    DBEngine -. built once per test session .- SessionNote`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'fixtures with setup/teardown and scope',
              code: `import pytest

@pytest.fixture(scope="session")     # built ONCE, shared across the whole test run
def db_engine():
    engine = create_engine("sqlite:///:memory:")
    yield engine
    engine.dispose()                  # teardown -- runs after the LAST test using it

@pytest.fixture                       # default scope="function": fresh for every test
def db_session(db_engine):            # depends on db_engine -- pytest resolves it automatically
    session = Session(db_engine)
    yield session
    session.rollback()                # each test gets a clean, isolated transaction
    session.close()

def test_create_order(db_session):
    order = create_order(db_session, item="widget")
    assert order.id is not None`,
            },
            {
              type: 'heading',
              text: 'Parametrize — one test body, many cases',
            },
            {
              type: 'code',
              language: 'python',
              title: 'data-driven tests',
              code: `import pytest

@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, -1, -2),
    (0, 0, 0),
    (100, -100, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
# pytest reports each tuple as its own test case: test_add[2-3-5], test_add[-1--1--2], etc.`,
            },
            {
              type: 'heading',
              text: 'Mocking external dependencies',
            },
            {
              type: 'p',
              text: 'A unit test should not actually call a real payment API, send a real email, or hit a real external service — `unittest.mock` (via `Mock`, `MagicMock`, or the `patch` decorator/context manager) substitutes a controllable stand-in that records how it was called and returns whatever the test configures, so the test verifies *your* code\'s logic in isolation from what it depends on.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'mocking an external API call',
              code: `from unittest.mock import patch

def charge_customer(payment_client, customer_id, amount):
    response = payment_client.charge(customer_id, amount)
    if not response["success"]:
        raise PaymentError("charge failed")
    return response["transaction_id"]

@patch("mymodule.payment_client")
def test_charge_customer_success(mock_client):
    mock_client.charge.return_value = {"success": True, "transaction_id": "tx_123"}
    result = charge_customer(mock_client, "cust_1", 42.00)
    assert result == "tx_123"
    mock_client.charge.assert_called_once_with("cust_1", 42.00)   # verify the call itself`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A `conftest.py` file in a test directory holds fixtures shared across every test file in that directory (and below), without needing to import them explicitly — pytest auto-discovers it. FastAPI\'s `app.dependency_overrides` pairs naturally with pytest fixtures to swap real dependencies (a real DB session, a real auth check) for test doubles at the framework level, not just the mock-library level.',
            },
            {
              type: 'heading',
              text: 'Built-in fixtures, async tests and what to mock',
            },
            {
              type: 'code',
              language: 'python',
              title: 'monkeypatch, tmp_path, caplog and async tests',
              code: `import pytest

def test_reads_config(tmp_path, monkeypatch):
    cfg = tmp_path / "app.toml"                  # tmp_path: a unique temp dir per test
    cfg.write_text("debug = true", encoding="utf-8")
    monkeypatch.setenv("APP_CONFIG", str(cfg))   # automatically undone after the test
    monkeypatch.setattr("myapp.clock.now", lambda: FIXED_TIME)
    assert load_settings().debug is True

def test_logs_warning(caplog):
    with caplog.at_level("WARNING"):
        run_job()
    assert "retrying" in caplog.text

def test_rejects_negative():
    with pytest.raises(ValueError, match="must be positive"):
        set_quantity(-1)

# async tests need a plugin: pytest-asyncio (mark/auto mode) or anyio's pytest plugin
@pytest.mark.asyncio
async def test_fetch_user(async_client):
    resp = await async_client.get("/users/1")
    assert resp.status_code == 200`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`patch` must target the name **where it is looked up**, not where it is defined: if `myapp/orders.py` does `from payments import charge`, patch `myapp.orders.charge`, not `payments.charge`. Prefer `create_autospec` or `patch(..., autospec=True)` so the mock rejects calls with a wrong signature — a bare `MagicMock` happily accepts any call and lets interface drift pass silently. Mock at system boundaries (HTTP, clock, payment gateway); over-mocking your own internals produces tests that pass while the real wiring is broken.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Beyond example-based tests: `hypothesis` generates inputs and shrinks failures to a minimal case (excellent for parsers and serializers), `pytest-cov` measures coverage (a signal, not a goal), and `pytest-xdist` (`-n auto`) runs tests across CPU cores — which requires tests to be order-independent and not share external state.',
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
              type: 'mermaid',
              code: `flowchart LR
    Client["client sends\\nJSON request body"] --> Parse["FastAPI parses JSON\\nagainst the Pydantic model"]
    Parse --> Valid{"matches the\\nmodel's fields/types?"}
    Valid -- no --> Reject["422 response,\\nfield-level error detail\\n-- handler never runs"]
    Valid -- yes --> Handler["your route handler runs,\\nreceives a validated,\\ncorrectly-typed object"]
    Handler --> RespModel["return value validated/serialized\\nagainst response_model"]
    RespModel --> JSONOut["JSON response to client"]
    Parse -.-> Docs["same model also generates\\nOpenAPI schema + /docs"]`,
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
            {
              type: 'heading',
              text: 'Pydantic v2 specifics worth knowing',
            },
            {
              type: 'p',
              text: 'Current FastAPI uses **Pydantic v2**, whose validation core (`pydantic-core`) is written in Rust and is several times faster than v1. The API changed in ways that trip up old tutorials: `.dict()` became `.model_dump()`, `.parse_obj()` became `.model_validate()`, `@validator` became `@field_validator` (and `@root_validator` became `@model_validator`), `class Config` became `model_config = ConfigDict(...)`, and `orm_mode` became `from_attributes=True`. Pydantic\'s default **lax mode** coerces compatible input (`"42"` to `42`); use `strict=True` on a field or model when coercion would hide client bugs. Also note `EmailStr` requires the separate `email-validator` package.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'v2-style model with validators and config',
              code: `from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

class OrderIn(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)  # reject unknown fields

    sku: str = Field(min_length=3, max_length=32)
    quantity: int = Field(gt=0, le=1000)
    coupon: str | None = None

    @field_validator("sku")
    @classmethod
    def sku_upper(cls, v: str) -> str:
        return v.upper()

    @model_validator(mode="after")
    def coupon_needs_bulk(self):
        if self.coupon and self.quantity < 10:
            raise ValueError("coupons require quantity >= 10")
        return self

order = OrderIn.model_validate({"sku": " ab-1 ", "quantity": "12"})  # lax: "12" -> 12
order.model_dump()           # {'sku': 'AB-1', 'quantity': 12, 'coupon': None}`,
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
              type: 'mermaid',
              code: `flowchart TD
    Route1["GET /me"] --> GetUser1["Depends(get_current_user)"]
    Route2["GET /me/orders"] --> GetUser2["Depends(get_current_user)"]
    Route2 --> GetDB2["Depends(get_db)"]
    GetUser1 --> GetDB1["Depends(get_db)"]
    GetUser2 -.->|"same request:\\nresult cached, DB\\nsession not re-created"| GetDB2
    GetDB1 --> DBConn["actual DB session\\n(yield-based, torn down\\nafter the request)"]
    GetDB2 --> DBConn`,
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
              text: 'Modern style: Annotated dependencies and lifespan',
            },
            {
              type: 'p',
              text: 'Current FastAPI documentation recommends declaring dependencies with `Annotated` so a dependency becomes a reusable type alias, rather than a default value (`= Depends(...)`). The same style applies to `Query`, `Header` and friends. For application-wide resources (HTTP client, connection pool, ML model) use a **lifespan** async context manager; the old `@app.on_event("startup")` / `"shutdown"` hooks are deprecated.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Annotated aliases and lifespan',
              code: `from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends, FastAPI, Request
import httpx

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http = httpx.AsyncClient(timeout=10)   # created once per process
    yield
    await app.state.http.aclose()

app = FastAPI(lifespan=lifespan)

async def get_http(request: Request) -> httpx.AsyncClient:
    return request.app.state.http

CurrentUser = Annotated[User, Depends(get_current_user)]    # reusable alias
Http = Annotated[httpx.AsyncClient, Depends(get_http)]

@app.get("/me/profile")
async def profile(user: CurrentUser, http: Http):
    resp = await http.get(f"https://profiles.internal/{user.id}")
    return resp.json()`,
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
              type: 'code',
              language: 'python',
              title: 'implicit context-locals vs explicit parameters',
              code: `from flask import Flask, request, g

app = Flask(__name__)

# Implicit: nothing in the signature says this function needs a request
# at all -- you have to read the BODY to discover the hidden dependency.
# Calling this outside of a real request (e.g. directly from a unit test)
# raises "Working outside of request context" unless you fake one up.
def get_current_user_flask():
    token = request.headers.get("Authorization")
    return load_user_from_token(token)

@app.route("/me")
def read_current_user():
    g.user = get_current_user_flask()   # stashed on 'g', another implicit global
    return {"name": g.user.name}

# Compare with FastAPI's explicit version: the dependency is a normal
# function parameter, testable by just calling it with a plain string --
# no request context needs to exist at all.
# def get_current_user(authorization: str = Header(...)) -> User: ...`,
            },
            {
              type: 'heading',
              text: 'WSGI (synchronous) vs ASGI (async-native)',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph WSGI["WSGI (Flask's traditional foundation)"]
      direction LR
      W1["Worker 1 (thread/process)"] -->|"blocks for the FULL\\nduration of request A"| ReqA["Request A"]
      W2["Worker 2"] -->|"blocks for the FULL\\nduration of request B"| ReqB["Request B"]
      NoteW["scaling concurrency = adding\\nmore workers (real OS overhead)"]
    end
    subgraph ASGI["ASGI (FastAPI's foundation)"]
      direction LR
      Loop["one event loop"] -->|"holds MANY requests\\nin flight cooperatively"| ReqC["Request C (awaiting DB)"]
      Loop --> ReqD["Request D (awaiting HTTP)"]
      Loop --> ReqE["Request E (awaiting DB)"]
      NoteA["far more resource-efficient\\nfor I/O-heavy workloads at scale"]
    end`,
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
              text: 'Why cursor pagination, specifically',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant C as Client
    participant API as orders endpoint
    participant DB as Database
    C->>API: GET orders, limit=20
    API->>DB: WHERE id greater than none, ORDER BY id LIMIT 20
    DB-->>API: 20 rows
    API-->>C: items + next_cursor = last row's id
    Note over DB: a new order is INSERTED here -- LIMIT/OFFSET would now skip or duplicate a row on the next page, but cursor-based does NOT
    C->>API: GET orders, cursor=next_cursor, limit=20
    API->>DB: WHERE id greater than cursor, ORDER BY id LIMIT 20
    DB-->>API: next 20 rows, unaffected by the insert
    API-->>C: items + next_cursor`,
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
          summary: 'Thirty-plus Python interview questions with full-depth answers, spanning language fundamentals, the object/reference model, the data model, concurrency (GIL, asyncio, free-threading), typing, tooling, framework internals, testing, performance, and API design.',
          qa: [
            {
              question: 'Explain the LEGB rule, and give a concrete example where it produces a surprising result.',
              answer:
                'LEGB is the order Python searches when resolving a name referenced inside a function: Local (names assigned in the current function), Enclosing (any outer function\'s local scope, for nested functions), Global (module top level), then Built-in (`len`, `range`, etc.) — resolution stops at the first match. The surprising case is `UnboundLocalError`: if a name is assigned *anywhere* in a function\'s body, Python treats it as local for the *entire* function, including lines before the assignment. So `def f(): print(x); x = 1` raises `UnboundLocalError` on the print line, not a LEGB fallback to a same-named global `x` — the mere presence of `x = 1` later in the function already made `x` local for the whole function body, at compile time, regardless of execution order.',
            },
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
              question: 'What\'s the difference between a shallow copy and a deep copy, and when does the distinction actually matter?',
              answer:
                'A shallow copy (`list(x)`, `x.copy()`, `copy.copy(x)`) creates a new outer container but fills it with references to the *same* nested objects the original contained — mutating a top-level element (replacing it) doesn\'t affect the original, but mutating a nested mutable element in place does, since both copies still point at that same nested object. `copy.deepcopy(x)` recursively copies every nested object too, so the two structures share no mutable state at any depth. The distinction matters the moment you have nested mutable structures (a list of lists, a dict of lists) and need true independence — a shallow copy of `[[1, 2], [3, 4]]` followed by `copy[0].append(99)` also mutates the original\'s first inner list, which is rarely what "give me a copy" was intended to mean.',
            },
            {
              question: 'What\'s the difference between `@staticmethod`, `@classmethod`, and a regular instance method?',
              answer:
                'An instance method\'s first parameter (`self`) is automatically bound to the instance it was called on, giving access to instance state. A `@classmethod`\'s first parameter (`cls`) is bound to the class itself rather than an instance — used chiefly for alternate constructors (`Point.from_tuple((1, 2))`) that need to build and return an instance of the class (or a subclass, since `cls` respects inheritance) without an instance existing yet. A `@staticmethod` receives neither `self` nor `cls` automatically — it\'s a plain function namespaced inside the class purely for organizational purposes, called the same way whether accessed via the class or an instance, with no automatic access to either.',
            },
            {
              question: 'What\'s the difference between an iterable and an iterator, and how does a generator function satisfy that protocol automatically?',
              answer:
                'An iterable implements `__iter__`, which returns an iterator — a list is iterable, but re-iterating it (e.g., two separate `for` loops over the same list) starts fresh each time because `iter(list)` returns a new iterator object each call. An iterator implements both `__iter__` (returning itself) and `__next__` (returning the next value, or raising `StopIteration` when exhausted) — it is inherently stateful and single-use; once exhausted, it stays exhausted. A generator function (one containing `yield`) is the easiest way to get a correct iterator without writing a class by hand: calling it doesn\'t run its body immediately, it returns a generator object that already implements `__iter__`/`__next__` correctly, resuming execution from the last `yield` point each time `__next__` is called.',
            },
            {
              question: 'What is a descriptor, and how is `@property` implemented on top of it?',
              answer:
                'A descriptor is any object defining `__get__` (and optionally `__set__`/`__delete__`) that\'s placed as a class-level attribute; when an instance attribute of that name is accessed, Python routes the access through the descriptor\'s methods instead of a plain `__dict__` lookup. `@property` is a built-in data descriptor: decorating a method with `@property` wraps it into a descriptor object whose `__get__` calls the original method, and `.setter` attaches a corresponding `__set__` to that same descriptor — the result is an attribute that looks like plain field access from the caller\'s side (`obj.balance`, not `obj.get_balance()`) but actually runs arbitrary code (validation, computed values, logging) on every access, with no way for calling code to bypass it.',
            },
            {
              question: 'What actually happens when Python executes a `class` statement, and what problem does the MRO solve?',
              answer:
                'Python executes the class body as a block of code, collecting everything defined in it (methods, class attributes) into a namespace dict, then calls the metaclass — `type` by default — as `type(name, bases, namespace)`, which constructs and returns the new class object; the class itself is therefore an instance of its metaclass, and a custom metaclass can hook this construction step (validating fields, auto-registering the class, injecting methods). The MRO (Method Resolution Order, computed via C3 linearization) solves the ambiguity in multiple inheritance: when several base classes define the same attribute/method, the MRO gives one deterministic, consistent search order that respects each base\'s own MRO and never places a class before its own subclass — and `super()` doesn\'t mean "my direct parent", it means "the next class after the current one in the MRO", which is what makes cooperative `super().__init__()` chains work correctly even in diamond-shaped hierarchies.',
            },
            {
              question: 'Why does CPython need a separate garbage collector if it already does reference counting?',
              answer:
                'Reference counting deallocates an object the instant its refcount hits zero, which handles the vast majority of cases promptly and deterministically — but it has one structural blind spot: a reference cycle (object A references B, B references A, directly or through a longer chain) keeps each object\'s refcount at least 1 forever, even once nothing outside the cycle references either of them, since refcounting only ever looks at direct reference counts, never at overall reachability from a live root. The generational garbage collector exists specifically to catch this: it periodically traces object graphs looking for groups of objects reachable only from within themselves, and reclaims the whole unreachable group at once — something pure refcounting can never do on its own.',
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
              question: 'How would you find out why a specific Python function is slow, concretely — what tools, in what order?',
              answer:
                'Start by measuring, not guessing: run `cProfile` (`python -m cProfile -s cumulative script.py`, or `%prun` in a notebook) to get a per-function call-count and cumulative-time breakdown across the whole program, identifying which function(s) actually dominate total runtime — intuition about what "should" be slow is frequently wrong. Once a specific function is identified as the bottleneck, `line_profiler` narrows it down to which individual lines inside that function consume the time, which is often far more actionable than a function-level number. Only after that measurement should you fix anything — usually either an algorithmic issue (an O(n²) approach where O(n log n) exists), an unnecessary intermediate data structure, or a call into something that should be batched (N+1 DB queries is the classic real-world case) — and then re-profile to confirm the fix actually moved the number, rather than assuming it did.',
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
            {
              question: 'What\'s the difference between a pytest fixture and a plain setup function, and how do you keep a test from calling a real external dependency?',
              answer:
                'A plain setup function has to be called explicitly at the top of every test that needs it, and any teardown has to be handled manually (often via a fragile `try`/`finally` repeated in each test). A pytest fixture is *requested* by a test simply naming it as a parameter — pytest resolves the whole dependency graph automatically (fixtures can depend on other fixtures), manages scope (rebuild per test, or share across a class/module/session), and, if the fixture uses `yield`, runs teardown automatically after the test regardless of whether it passed or failed. To avoid a unit test calling a real external dependency (a payment API, a real database), replace that dependency with a controllable stand-in via `unittest.mock` (`Mock`/`MagicMock`/`patch`) or pytest\'s `monkeypatch` fixture — the test then asserts both on the return value your code produced and, separately, on exactly how the mock was called (`mock.assert_called_once_with(...)`), verifying your code\'s logic without ever touching the real system.',
            },
            {
              question: 'Why must dict keys and set members be hashable, and what does that rule out?',
              answer:
                'A `dict`/`set` is backed by a hash table: inserting or looking up a key computes `hash(key)` to determine which bucket it belongs in, giving average O(1) lookup instead of scanning every entry linearly. That only works correctly if a key\'s hash never changes for as long as it\'s stored in the table — if it did, the table could no longer find the entry in the bucket it originally computed, silently corrupting lookups. This is why only immutable (or at least implementation-guaranteed-stable-hash) objects are hashable: `int`, `str`, `tuple` of hashable elements, and `frozenset` all qualify, while `list`, `dict`, and plain `set` are explicitly unhashable, because Python enforces this constraint upfront with a `TypeError` rather than allowing the silent corruption that mutating a key in place would eventually cause.',
            },
            {
              question: 'Is the GIL gone in current Python? What exactly is true today about free-threading?',
              answer:
                'Not by default. Free-threaded CPython (PEP 703) shipped as an experimental opt-in build in 3.13 and became officially supported, but still optional, in 3.14 (PEP 779); you run it as a separate interpreter (`python3.14t`), and the standard build still has a GIL. The free-threaded build replaces the lock with biased reference counting, immortal objects, per-object locks in built-in containers and a different allocator; the 3.14 documentation puts the single-threaded penalty at roughly 5-10%. Caveats: every C extension must declare free-threading support (importing one that does not re-enables the GIL with a warning), and your own compound operations such as `counter += 1` were never atomic even with the GIL, so you still need locks or queues. The right answer for CPU-bound work today remains: measure, then choose processes, free-threaded threads (if your dependency stack supports it), or native code.',
            },
            {
              question: 'Why can `counter += 1` race between threads even though the GIL exists?',
              answer:
                'The GIL guarantees that the interpreter\'s own data structures are not corrupted, not that your multi-step operations are atomic. `counter += 1` compiles to separate load, add and store bytecodes; the interpreter may switch threads between any two of them (the switch interval is 5 ms by default, and the lock is also released around blocking calls), so two threads can read the same old value and both write old+1, losing an update. Individual operations such as `list.append` are atomic as an implementation detail, but relying on that is fragile and breaks the reasoning entirely once you consider free-threaded builds. Protect shared read-modify-write sequences with `threading.Lock`, use `queue.Queue` to hand work between threads, or avoid shared mutable state by design.',
            },
            {
              question: 'How does asyncio.TaskGroup differ from asyncio.gather, and why was it added?',
              answer:
                'Both run coroutines concurrently, but TaskGroup (3.11) gives structured concurrency: the `async with` block does not exit until every child task finishes, and if any child raises, the group cancels the remaining siblings, waits for them, and raises an `ExceptionGroup` containing all failures (handled with `except*`). With `gather`, the first exception propagates immediately while the other awaitables keep running unobserved in the background unless you cancel them yourself, and later failures are lost unless `return_exceptions=True`. That orphaned-task behavior causes resource leaks and "Task exception was never retrieved" warnings. `gather(return_exceptions=True)` remains handy when you genuinely want partial results from independent calls; TaskGroup is the safer default when the tasks are parts of one unit of work. Combine it with `asyncio.timeout()` for a deadline and a `Semaphore` to bound concurrency.',
            },
            {
              question: 'How should cancellation be handled correctly in asyncio code?',
              answer:
                'Cancellation is delivered as a `CancelledError` raised at the task\'s current `await`. It inherits from `BaseException` (since 3.8), so `except Exception` does not catch it, but a bare `except:` or `except BaseException:` that does not re-raise will swallow it and break timeouts, TaskGroup sibling cancellation and graceful shutdown. The rule is to clean up in `finally` or `async with` blocks, keep that cleanup short, and re-raise if you catch the error. `asyncio.timeout()` and TaskGroup both rely on this mechanism. `asyncio.shield()` protects an inner awaitable from being cancelled, but the outer await still raises, so it is for critical sections like committing a transaction, not a way to ignore cancellation.',
            },
            {
              question: 'What changed about annotations in Python 3.14, and what should library code do?',
              answer:
                'Annotations are now evaluated lazily (PEP 649, with PEP 749 describing the implementation): the compiler stores them in an annotate function that runs only when something asks, so forward references work without quotes and unused annotations cost nothing at import time. The new `annotationlib` module provides `get_annotations()` with formats `VALUE`, `FORWARDREF` and `STRING`. Consequently `from __future__ import annotations` (PEP 563 stringification) is unnecessary for new code and has downsides for runtime consumers like Pydantic. Library code that inspects annotations should use `annotationlib.get_annotations()` on 3.14+, or `inspect.get_annotations()`/`typing.get_type_hints()` on older versions, and never read `__annotations__` directly.',
            },
            {
              question: 'What are t-strings, and what problem do they solve that f-strings cannot?',
              answer:
                'Template strings (PEP 750, Python 3.14) use a `t` prefix and evaluate to a `string.templatelib.Template` object rather than a `str`. The object holds the literal parts and the `Interpolation` objects (value, expression text, conversion, format spec) separately, so a consumer can process the dynamic parts differently from the static text. An f-string collapses everything into one string immediately, so a database or HTML layer cannot tell developer-written text from user input, which is what makes injection bugs easy to write. With a t-string a library can escape for HTML, convert to bound SQL parameters, or build structured log records. A `Template` is intentionally not a `str` and does not render itself, so each consumer must make an explicit decision; until your libraries support templates, parameterized queries remain the correct defense.',
            },
            {
              question: 'Explain the difference between `__repr__` and `__str__`, and what must hold between `__eq__` and `__hash__`.',
              answer:
                '`__repr__` targets developers: unambiguous, ideally something that could recreate the object, and it is what appears in tracebacks, logs and the REPL, including inside containers. `__str__` targets end users and is what `print` and `str()` use; if it is missing Python falls back to `__repr__`, so implement `__repr__` first. For hashing, equal objects must have equal hashes. Defining `__eq__` without `__hash__` sets `__hash__` to `None`, making instances unhashable; defining a hash from mutable fields lets an object get lost inside a set or dict after it mutates. Hash a tuple of the immutable identity fields, or use `@dataclass(frozen=True)` which generates a consistent pair. Return `NotImplemented` (not `False`) for unsupported operand types so Python can try the reflected operation.',
            },
            {
              question: 'How do you structure and ship a modern Python project, and why does it matter to separate ranges from lockfiles?',
              answer:
                'Declare metadata, dependencies (PEP 621) and tool configuration in `pyproject.toml`, choose a build backend (hatchling, setuptools, uv_build), use a `src/` layout so tests run against the installed package, and manage environments with uv (or Poetry/pip-tools). Direct dependencies get compatible ranges in `pyproject.toml`; an application additionally commits a lockfile (`uv.lock`, `poetry.lock`, or the standard `pylock.toml` format) with exact versions and hashes, and CI/production install with a frozen/locked mode that fails if the lock is stale. Libraries must not pin exact versions because that makes them uninstallable alongside other packages; applications must pin so that the tested artifact is the deployed artifact. Add ruff, a type checker and pytest to CI, audit dependencies (`pip-audit`), and build container images in two layers so dependency installs are cached until the lockfile changes.',
            },
            {
              question: 'A Python service\'s memory grows steadily. How do you investigate?',
              answer:
                'First distinguish a real leak from allocator behavior: RSS can stay high after a spike because pymalloc and the C allocator do not always return memory to the OS. To find growth, enable `tracemalloc` (with several frames), take snapshots at intervals and use `compare_to` to see which lines own the increasing allocations; `gc.get_objects()` counted by type, or `objgraph`, shows what accumulates and who references it. Typical culprits are unbounded module-level caches or `lru_cache(maxsize=None)`, `lru_cache` on instance methods (keeps `self` alive), callbacks or listeners never unregistered, exceptions stored with their tracebacks (frames keep locals alive), reference cycles with `__del__`, and per-request data added to global structures. Mitigate with bounded caches, `weakref`, `WeakValueDictionary`, and periodic worker recycling as a safety net, then confirm the fix by repeating the same measurement.',
            },
            {
              question: 'When would you reach for a metaclass versus `__init_subclass__`, a class decorator, or a descriptor?',
              answer:
                'Use the lightest tool that works. `__init_subclass__` runs on the parent whenever a subclass is defined and covers plugin registries and subclass validation. A class decorator post-processes one class without affecting inheritance (dataclasses work this way). A descriptor (with `__set_name__`) customizes per-attribute access and learns its name. A metaclass is only necessary when you must control class creation itself: altering the namespace before the class exists (for example `__prepare__` returning a custom mapping), customizing instance creation via `__call__`, or intercepting attribute access on the class object. Metaclasses cost readability and compose poorly, since a class can have only one metaclass and two frameworks with different ones raise a metaclass conflict, so ORMs and enum-like libraries are the main legitimate users.',
            },
            {
              question: 'Why is `multiprocessing` behavior different on Linux in newer Python versions, and what breaks?',
              answer:
                'Historically Linux defaulted to the `fork` start method, which clones the parent process and lets children inherit globals, open file descriptors and even unpicklable objects. Forking a process that already has threads is unsafe (locks held by other threads are copied in a locked state), so since 3.14 the default on Linux and other non-macOS Unix platforms is `forkserver`; macOS and Windows already used `spawn`. With these methods the child imports your module fresh and receives arguments by pickling, so lambdas, locally defined functions, open connections and module state set only at runtime are not inherited. The fix is to use top-level picklable functions, pass explicit arguments, initialize per-process resources in a worker initializer, guard the entry point with `if __name__ == "__main__":`, and request `fork` explicitly via `get_context("fork")` only if you fully understand the risk.',
            },
            {
              question: 'How do you make a decorator preserve type information and behave correctly for both sync and async functions?',
              answer:
                'Use `functools.wraps` so metadata (`__name__`, `__doc__`, `__wrapped__`) survives, and type it with `ParamSpec` and a return `TypeVar` (in 3.12+ syntax `def deco[**P, R](f: Callable[P, R]) -> Callable[P, R]`) so the type checker sees the original signature through the wrapper. A decorator written with a plain `def wrapper` around an `async def` function returns a coroutine without awaiting it, so timing, retry or error-handling logic silently runs before the work happens; handle coroutine functions separately by checking `inspect.iscoroutinefunction(func)` and providing an `async def wrapper` that awaits the call, or provide two decorators. For decorators with arguments, add one more nesting level, and for class-based decorators remember to apply `functools.update_wrapper`. Finally, never use `@lru_cache` directly on async functions, since it caches the coroutine object, which can only be awaited once.',
            },
          ],
        },
      ],
    },
  ],
}
