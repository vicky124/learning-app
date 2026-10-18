export const dsaSection = {
  id: 'dsa',
  label: 'DSA',
  icon: '🧮',
  groups: [
    {
      id: 'dsa-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-algorithmic-complexity',
          title: 'What "Algorithmic Complexity" Actually Means',
          summary:
            'Complexity measures how the resources an algorithm needs — time, memory — grow as the input grows, not how fast a specific run happens to feel on your laptop.',
          keyPoints: [
            'Complexity describes a **growth rate**, not a stopwatch reading: it answers "if I double the input, roughly how much more work happens?"',
            'Two algorithms solving the same problem can feel identical on a 10-item test case and differ by orders of magnitude on a 10-million-item production input.',
            'Complexity ignores hardware, language, and constant-factor micro-optimizations — those affect wall-clock time but not the underlying growth curve.',
            'This is the one property of a solution that survives contact with real, large-scale data — which is exactly why interviewers probe it relentlessly.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine two functions that both find a value in a list of one million items. One checks every item one by one; the other repeatedly cuts the search space in half. On a list of 5 items, you would probably not notice a difference — both finish instantly. On a list of 10 million items, the first might take a noticeable pause while the second finishes in about 24 steps. **Algorithmic complexity is the formal language for describing that difference before you ever run the code.**',
            },
            {
              type: 'p',
              text: 'Concretely, complexity asks: as the input size *n* grows without bound, how does the amount of work (time complexity) or extra memory (space complexity) grow? An algorithm that does roughly *n* units of work for *n* items is "linear." One that does roughly *n × n* units of work is "quadratic," and quadratic algorithms become impractical shockingly fast — not because the code is slow, but because the *shape of the curve* is steep.',
            },
            {
              type: 'heading',
              text: 'Why this matters more than raw speed',
            },
            {
              type: 'list',
              items: [
                'A quadratic algorithm on a faster machine is still quadratic — it will eventually lose to a linear algorithm on a slower machine, just at a larger input size.',
                'Production data grows over time. Code that was "fast enough" at launch with 1,000 users can become the outage-causing bottleneck at 10 million users, purely because of its complexity class, not a regression in the code itself.',
                'Interviewers use complexity analysis as a proxy for whether you actually understand *why* your solution works, not just that it happens to produce the right output on the examples given.',
              ],
            },
            {
              type: 'heading',
              text: 'Seeing the difference with real numbers',
            },
            {
              type: 'p',
              text: 'Take that same idea and put actual numbers on it. Checking every item one by one (**linear search**) needs, in the worst case, one comparison per element — on a sorted list of 1,000,000 items, that is up to 1,000,000 comparisons. Repeatedly cutting the search space in half (**binary search**) needs roughly log₂(1,000,000) ≈ 20 comparisons, because each comparison throws away half of what is left. The code below counts the comparisons each approach actually makes, so the difference is not just asserted, it is measured.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'counting comparisons: linear search vs binary search',
              code: `def linear_search(nums, target):
    steps = 0
    for i, val in enumerate(nums):
        steps += 1                # one comparison per element checked
        if val == target:
            return i, steps
    return -1, steps

def binary_search(nums, target):
    steps = 0
    left, right = 0, len(nums) - 1
    while left <= right:
        steps += 1                # one comparison per halving of the search space
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid, steps
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1, steps

# On a sorted list of 1,000,000 items, searching for a value near the very end:
# linear_search(nums, target)  -> up to  1,000,000 steps  (O(n))
# binary_search(nums, target)  -> at most        20 steps  (O(log n))`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    N0["1,000,000 items to search"] --> N1["step 1: 500,000 items remain"]
    N1 --> N2["step 2: 250,000 items remain"]
    N2 --> N3["step 3: 125,000 items remain"]
    N3 --> Dots["... halves again every step ..."]
    Dots --> N20["step 20: 1 item remains -- found or done"]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When thinking about complexity, always ask two separate questions: "how much **time** does this take as input grows?" and "how much extra **memory** does this use as input grows?" They are independent axes, and a good solution is explicit about both, not just time.',
            },
          ],
        },
        {
          id: 'big-o-big-theta-big-omega',
          title: 'Big-O, Big-Θ, and Big-Ω Notation, Precisely',
          summary:
            'Big-O is an upper bound, Big-Ω is a lower bound, and Big-Θ is a tight bound that pins down both — most casual use of "O(n)" in interviews is really informally describing Θ(n).',
          keyPoints: [
            '**Big-O (O)** describes an **upper bound** on a function: f(n) = O(g(n)) means there exist constants c > 0 and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀ — "grows no faster than g."',
            '**Big-Ω (Omega)** describes a **lower bound** on a function: f(n) ≥ c·g(n) for all large n — "grows at least as fast as g."',
            '**Big-Θ (Theta)** describes a **tight bound** — f is both O(g) and Ω(g), so it grows *exactly* like g up to constant factors.',
            '**Bounds are not cases.** "Worst case," "best case," and "average case" pick *which function* you are describing; O/Ω/Θ describe *how tightly* you bound it. "Quicksort\'s worst case is Θ(n²)" and "quicksort\'s best case is Θ(n log n)" are both precise statements.',
            'When combining complexities: sequential steps **add** (O(a) then O(b) → O(a + b)); nested steps **multiply** (a loop of `b` inside a loop of `a` → O(a × b)). Always drop constants and non-dominant lower-order terms.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'These three notations describe *bounds* on a function that represents an algorithm\'s resource usage as input size *n* grows. In casual interview conversation people almost always say "Big-O" even when they mean the tight Big-Θ bound of the **worst case** — for example, "binary search is O(log n)" really means "its worst-case number of comparisons is Θ(log n)." (Its best case is Θ(1): the target might sit exactly at the first midpoint.) Technically, saying binary search is O(n) is also *true* — just uselessly loose — which is why precise speakers reach for Θ when they want to claim tightness.',
            },
            {
              type: 'p',
              text: 'The distinction matters when an algorithm\'s cases genuinely differ. Quicksort\'s worst-case running time is Θ(n²), its best and expected running time are Θ(n log n). A blanket "quicksort is Θ(n log n)" is wrong without the word "expected"; a blanket "quicksort is O(n²)" is correct but hides the fact that it almost never behaves that way. Senior interviewers listen for whether you name the case *and* the bound.',
            },
            {
              type: 'table',
              headers: ['Statement', 'Case being described', 'Precise?'],
              rows: [
                ['"Binary search is O(log n)"', 'Worst case (implicitly)', 'Yes — and also Θ(log n) for the worst case'],
                ['"Insertion sort is Ω(n)"', 'All inputs', 'Yes — it must at least read every element'],
                ['"Insertion sort is Θ(n²)"', 'Unqualified', 'No — on sorted input it is Θ(n); say "worst case Θ(n²)"'],
                ['"Hash lookup is O(1)"', 'Expected/average case', 'Only with the qualifier — the worst case is Θ(n) for chaining'],
                ['"Dynamic array append is O(1)"', 'Amortized', 'Yes amortized; a single append can cost Θ(n) during a resize'],
              ],
            },
            {
              type: 'heading',
              text: 'Growth rates at increasing input sizes',
            },
            {
              type: 'table',
              headers: ['n', 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
              rows: [
                ['10', '1', '~3', '10', '~33', '100', '1,024'],
                ['100', '1', '~7', '100', '~664', '10,000', 'astronomically large'],
                ['1,000', '1', '~10', '1,000', '~9,966', '1,000,000', 'astronomically large'],
                ['10,000', '1', '~13', '10,000', '~132,877', '100,000,000', 'astronomically large'],
                ['1,000,000', '1', '~20', '1,000,000', '~19,931,569', '1,000,000,000,000', 'astronomically large'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The table is the entire intuition you need: O(n²) already crosses one billion operations at just one million items, while O(n log n) is still under twenty million — that gap is why "just optimize the sort" or "avoid the nested loop" is so often the whole interview.',
            },
            {
              type: 'heading',
              text: 'Rules for combining complexities',
            },
            {
              type: 'list',
              items: [
                '**Sequential operations add**: a function that loops over *n* items and then, separately, loops over *m* items is O(n + m), not O(n × m).',
                '**Nested operations multiply**: a loop of *n* containing a loop of *m* is O(n × m) — this is where accidental O(n²) solutions usually come from (a nested loop searching for a match instead of a hash lookup).',
                '**Drop constants**: O(3n) and O(n/2) are both simply O(n) — constant factors matter for real-world speed but not for complexity *class*.',
                '**Drop non-dominant terms**: O(n² + n) simplifies to O(n²), because the n² term dominates completely once n is large.',
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'spotting the complexity by counting operations',
              code: `def has_duplicate_naive(nums):
    # nested loop: for each item, scan the rest -> O(n^2)
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False

def has_duplicate_fast(nums):
    # single pass + O(1) average hash-set lookup -> O(n)
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A very common interview mistake: calling `x in some_list` inside a loop. A Python `list` membership check is O(n), so `x in list` inside a loop over n items silently creates an O(n²) algorithm. `x in some_set` (or `dict`) is O(1) average — swapping the container, not the algorithm\'s shape, is often the entire fix.',
            },
            {
              type: 'heading',
              text: 'Analyzing recursive algorithms: recurrences and the Master Theorem',
            },
            {
              type: 'p',
              text: 'Loops are analyzed by counting iterations; recursive divide-and-conquer algorithms are analyzed by writing a **recurrence** of the form T(n) = a·T(n/b) + f(n): the work splits into *a* subproblems of size n/b, plus f(n) work to split and combine. Picture the recursion tree: level *k* has aᵏ nodes each doing f(n/bᵏ) work. The answer depends on which levels dominate — the root (combine work is heavy), the leaves (there are many subproblems), or all levels equally.',
            },
            {
              type: 'table',
              headers: ['Recurrence', 'Example', 'Solution', 'Intuition'],
              rows: [
                ['T(n) = T(n/2) + O(1)', 'Binary search', 'O(log n)', 'log n levels, constant work per level'],
                ['T(n) = 2T(n/2) + O(n)', 'Merge sort', 'O(n log n)', 'log n levels, each doing O(n) total work'],
                ['T(n) = 2T(n/2) + O(1)', 'Tree traversal, max of an array by halving', 'O(n)', 'Leaves dominate: n leaves, O(1) each'],
                ['T(n) = T(n/2) + O(n)', 'Quickselect (lucky pivots)', 'O(n)', 'Geometric series n + n/2 + n/4 + ... = 2n — the root dominates'],
                ['T(n) = T(n − 1) + O(n)', 'Quicksort worst case, selection sort', 'O(n²)', 'n levels of shrinking linear work: n + (n−1) + ... = n(n+1)/2'],
                ['T(n) = 2T(n − 1) + O(1)', 'Naive Towers of Hanoi', 'O(2ⁿ)', 'The number of calls doubles every level'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The Master Theorem formalizes this by comparing f(n) against n^(log_b a): if f grows polynomially slower, leaves dominate and T(n) = Θ(n^(log_b a)); if they match, every level costs the same and T(n) = Θ(n^(log_b a) · log n); if f grows polynomially faster (with a regularity condition), the root dominates and T(n) = Θ(f(n)). In interviews, drawing the recursion tree and summing per level is usually more convincing than quoting the theorem.',
            },
          ],
        },
        {
          id: 'space-complexity-tradeoffs',
          title: 'Space Complexity and the Time-Space Tradeoff',
          summary:
            'Space complexity counts the extra (auxiliary) memory an algorithm uses beyond its input, including the hidden cost of the call stack — and it can often be traded directly against time.',
          keyPoints: [
            'Space complexity usually refers to **auxiliary space** — extra memory used beyond the input itself — unless a problem explicitly asks about total space including input.',
            'Recursion has a hidden space cost: each active call frame lives on the call stack, so a recursion of depth *d* uses O(d) space even if no other data structure is allocated.',
            'A classic trade: using a hash set for O(1) average lookups costs O(n) extra space in exchange for turning an O(n) linear scan into O(1) — trading space for time.',
            'The reverse trade also exists: an in-place algorithm (like heap sort or in-place quicksort partitioning) uses O(1) or O(log n) extra space at the cost of being harder to write and sometimes slower in practice than an out-of-place equivalent.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Just as time complexity asks "how does runtime grow with input?", space complexity asks "how does extra memory usage grow with input?" The two are independent — an algorithm can be fast but memory-hungry (a hash-based frequency count), or slow but memory-frugal (an in-place bubble sort). A complete answer to "what\'s the complexity of your solution?" states both.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'the hidden space cost of recursion',
              code: `# Iterative: O(1) auxiliary space
def sum_iterative(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

# Recursive: O(n) auxiliary space -- n stacked call frames live
# on the call stack simultaneously before any of them return
def sum_recursive(n):
    if n == 0:
        return 0
    return n + sum_recursive(n - 1)`,
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Call5["sum_recursive(5)"] --> Call4["sum_recursive(4)"]
    Call4 --> Call3["sum_recursive(3)"]
    Call3 --> Call2["sum_recursive(2)"]
    Call2 --> Call1["sum_recursive(1)"]
    Call1 --> Call0["sum_recursive(0) -- base case, returns 0"]
    Note["all 6 calls sit on the stack at once,<br/>waiting for the one below to return -- O(n) space"]`,
            },
            {
              type: 'list',
              items: [
                '**Memoization (space for time)**: caching subproblem results turns an exponential-time recursive algorithm (like naive Fibonacci) into a linear-time one, at the cost of O(n) extra memory for the cache.',
                '**Precomputed lookup tables**: storing precomputed answers for a small, bounded input range converts repeated computation into O(1) array lookups.',
                '**Bloom filters / probabilistic structures**: accepting a small, tunable false-positive rate in exchange for a fixed handful of bits per element (roughly 10 bits for a ~1% false-positive rate), no matter how large each element is — instead of storing every element exactly. HyperLogLog (approximate distinct counts) and Count-Min Sketch (approximate frequencies) make the same trade.',
                '**Recomputation (time for space)**: the reverse trade — instead of storing a big table, recompute values on demand. Rolling-array DP (keep only the previous row) and Hirschberg\'s linear-space LCS reconstruction are classic examples.',
              ],
            },
            {
              type: 'heading',
              text: 'What counts toward space complexity',
            },
            {
              type: 'table',
              headers: ['Item', 'Counted as auxiliary space?', 'Notes'],
              rows: [
                ['The input itself', 'No (by convention)', 'Unless you copy it — `sorted(nums)` allocates O(n), `nums.sort()` does not'],
                ['The output', 'Usually not', 'Returning all n² pairs is not "extra" space; state your convention out loud'],
                ['Recursion call stack', 'Yes', 'O(max depth) — easy to forget because no variable holds it'],
                ['Slices and string concatenation', 'Yes', '`arr[1:]` in Python copies; repeated `s += ch` can be O(n²) total time and churn'],
                ['Hash maps / sets / visited arrays', 'Yes', 'Often the dominant term in graph and DP solutions'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When an interviewer says "can you do this in O(1) space?", they are usually asking you to either process input in place (no auxiliary array/hash map) or convert a recursive solution to an iterative one that doesn\'t carry an implicit call stack — both are legitimate, distinct ways to satisfy the constraint.',
            },
          ],
        },
        {
          id: 'amortized-analysis-dynamic-arrays',
          title: 'Amortized Analysis and Dynamic Arrays',
          summary:
            'Amortized analysis bounds the average cost per operation over any worst-case sequence of operations — it is why appending to a Python list, a JavaScript array, or a Java ArrayList is "O(1)" even though an individual append occasionally copies the entire array.',
          keyPoints: [
            '**Amortized ≠ average case.** Average-case analysis assumes a probability distribution over inputs; amortized analysis makes **no** probabilistic assumption — it guarantees the *total* cost of any sequence of m operations, divided by m.',
            'A dynamic array keeps spare capacity. When it fills up, it allocates a bigger block (a constant factor larger) and copies everything over — an O(n) step that happens rarely enough that the total cost of n appends is still O(n).',
            'The growth factor must be **geometric** (multiply capacity by some factor > 1). Growing by a constant amount (+10 slots each time) makes n appends cost Θ(n²) total.',
            'Real runtimes use different factors — Java\'s `ArrayList` grows by about 1.5×, CPython\'s `list` over-allocates by roughly 12.5% plus a small constant — and *any* factor > 1 gives amortized O(1); the factor only trades wasted memory against copy frequency.',
            'Amortized arguments also explain monotonic stacks, two-stack queues, Union-Find with path compression, and hash table resizing.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Consider doubling: start at capacity 1 and double whenever full. Appending n items triggers copies of size 1, 2, 4, ..., up to n — a geometric series that sums to less than 2n. Add the n ordinary O(1) writes and the total is under 3n operations, so each append costs O(1) **amortized**, even though the append that triggers the final resize costs Θ(n) by itself.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    C1["cap 1<br/>copy 1"] --> C2["cap 2<br/>copy 2"] --> C4["cap 4<br/>copy 4"] --> C8["cap 8<br/>copy 8"] --> Cn["cap n<br/>copy n"]
    Cn --> Sum["total copies: 1 + 2 + 4 + ... + n < 2n<br/>so n appends cost O(n) overall"]`,
            },
            {
              type: 'heading',
              text: 'Three ways to prove an amortized bound',
            },
            {
              type: 'list',
              items: [
                '**Aggregate method**: bound the total cost of n operations directly, then divide by n — the geometric-series argument above.',
                '**Accounting (banker\'s) method**: charge each cheap operation a little extra "credit" (say 3 units per append: 1 to write, 2 saved). When a resize happens, every element being copied is paid for by credit stored earlier. If the bank balance never goes negative, the charged cost is a valid amortized bound.',
                '**Potential method**: define a potential function Φ on the data structure state (for a dynamic array, Φ = 2·size − capacity). Amortized cost = actual cost + ΔΦ. Expensive operations release potential that cheap operations accumulated.',
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'a minimal dynamic array with geometric growth',
              code: `class DynamicArray:
    def __init__(self):
        self._cap = 1
        self._size = 0
        self._data = [None] * self._cap

    def append(self, value):
        if self._size == self._cap:
            self._resize(self._cap * 2)      # geometric growth -> amortized O(1)
        self._data[self._size] = value
        self._size += 1

    def pop(self):
        if self._size == 0:
            raise IndexError("pop from empty array")
        self._size -= 1
        value = self._data[self._size]
        self._data[self._size] = None        # drop the reference for the GC
        # shrink only at 1/4 full -- shrinking at 1/2 would thrash
        if 0 < self._size <= self._cap // 4:
            self._resize(self._cap // 2)
        return value

    def _resize(self, new_cap):
        new_data = [None] * new_cap
        for i in range(self._size):          # the O(n) copy
            new_data[i] = self._data[i]
        self._data, self._cap = new_data, new_cap`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Thrashing**: if you double when full *and* halve when half-empty, alternating push/pop at the boundary triggers an O(n) resize on every single operation. Shrinking only when the array drops to one quarter full leaves a buffer on both sides and keeps both operations amortized O(1).',
            },
            {
              type: 'heading',
              text: 'Amortized queue from two stacks',
            },
            {
              type: 'code',
              language: 'python',
              title: 'queue with two stacks -- amortized O(1) per operation',
              code: `class TwoStackQueue:
    def __init__(self):
        self._in, self._out = [], []

    def enqueue(self, x):
        self._in.append(x)

    def dequeue(self):
        if not self._out:
            # transfer reverses order so the oldest element ends on top;
            # each element is moved at most once in its lifetime
            while self._in:
                self._out.append(self._in.pop())
        if not self._out:
            raise IndexError("dequeue from empty queue")
        return self._out.pop()`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Amortized O(1) is not good enough for hard latency budgets: a real-time system or a request with a strict p99 target can still be hurt by the occasional Θ(n) resize. Pre-sizing (`new ArrayList<>(n)`, `[None] * n`, `reserve()` in C++) or incremental/deamortized resizing removes the spike when you know the size up front.',
            },
          ],
        },
        {
          id: 'arrays-vs-linked-lists',
          title: 'Arrays vs Linked Lists',
          summary:
            'Arrays store elements contiguously for O(1) random access but O(n) insert/delete in the middle; linked lists trade that away for O(1) insert/delete given a pointer, at the cost of O(n) access and pointer overhead.',
          keyPoints: [
            'Arrays store elements in one contiguous memory block — index arithmetic gives O(1) random access, but inserting/deleting in the middle requires shifting every following element, O(n).',
            'Linked lists store elements as independent nodes connected by pointers — insert/delete is O(1) *once you already hold a reference to the right node*, but reaching that node in the first place is O(n).',
            'Doubly linked lists add a `prev` pointer per node, enabling O(1) backward traversal and O(1) removal of a known node without needing its predecessor — at the cost of extra memory per node.',
            'Arrays have far better **cache locality** (contiguous memory means fewer cache misses), which in practice often makes them faster than linked lists even for operations where both have the same Big-O.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Array["Array (contiguous memory)"]
        A0["[0] 10"] --- A1["[1] 20"] --- A2["[2] 30"] --- A3["[3] 40"]
    end
    subgraph LinkedList["Singly Linked List (scattered nodes)"]
        N1["10 | next"] -->|ptr| N2["20 | next"] -->|ptr| N3["30 | next"] -->|ptr| N4["40 | null"]
    end`,
            },
            {
              type: 'table',
              headers: ['Operation', 'Array', 'Singly Linked List'],
              rows: [
                ['Access by index', 'O(1)', 'O(n)'],
                ['Search (unsorted)', 'O(n)', 'O(n)'],
                ['Insert at end', 'O(1) amortized (dynamic array)', 'O(1) with a tail pointer, else O(n)'],
                ['Delete at end', 'O(1)', 'O(n) even with a tail pointer — you must find the new tail (O(1) in a doubly linked list)'],
                ['Insert/delete at front', 'O(n) — must shift everything', 'O(1)'],
                ['Insert/delete in middle', 'O(n) — must shift', 'O(1) given a pointer to the *predecessor*; O(n) to find it'],
                ['Extra memory per element', 'No pointers, but a dynamic array may hold up to ~2× slack capacity', 'One (or two) pointers per node plus per-object allocator overhead'],
              ],
            },
            {
              type: 'p',
              text: 'The asymmetry hidden in that table is worth internalizing: in a singly linked list, deleting a node requires changing its *predecessor\'s* `next` pointer, so "O(1) delete" really means "O(1) once you hold the node *before* the one you want to remove." This is why so many linked-list interview solutions walk with a `prev` pointer, or start from a **dummy (sentinel) head** node so that deleting the real first node is not a special case.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'dummy head: remove all nodes with a given value, no special cases',
              code: `def remove_elements(head, val):
    dummy = ListNode(0, head)     # sentinel in front of the real head
    prev = dummy
    while prev.next:
        if prev.next.val == val:
            prev.next = prev.next.next   # unlink; do NOT advance prev yet
        else:
            prev = prev.next
    return dummy.next             # the head may have changed`,
            },
            {
              type: 'heading',
              text: 'Linked-list patterns worth recognizing',
            },
            {
              type: 'table',
              headers: ['Problem shape', 'Technique', 'Complexity'],
              rows: [
                ['Reverse the whole list or a sublist', 'Three-pointer reversal (prev, curr, next)', 'O(n) time, O(1) space'],
                ['Find the middle node', 'Slow/fast pointers — fast moves 2, slow moves 1', 'O(n) time, O(1) space'],
                ['Detect a cycle / find its start', 'Floyd\'s tortoise and hare', 'O(n) time, O(1) space'],
                ['Remove the k-th node from the end', 'Advance a lead pointer k steps, then move both together', 'One pass, O(1) space'],
                ['Merge two sorted lists', 'Dummy head + tail pointer, splice the smaller node', 'O(n + m) time, O(1) space'],
                ['Merge k sorted lists', 'Min-heap of the k current heads', 'O(N log k) for N total nodes'],
                ['Palindrome check in O(1) space', 'Find middle, reverse second half, compare, (optionally) restore', 'O(n) time, O(1) space'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'a minimal singly linked list',
              code: `class ListNode:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def insert_after(node: ListNode, val) -> None:
    # O(1): no shifting required, unlike an array insert
    node.next = ListNode(val, node.next)

def reverse(head: ListNode) -> ListNode:
    # classic pointer-reversal pattern -- O(n) time, O(1) space
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Big-O comparisons hide **cache locality**: an array\'s contiguous layout means the CPU can prefetch upcoming elements and rarely misses cache, while a linked list\'s scattered nodes cause a cache miss on nearly every `next` hop. In practice, an O(n) array scan is often faster in wall-clock time than an O(n) linked-list traversal — Big-O describes the growth curve, not the constant factor.',
            },
          ],
        },
        {
          id: 'stacks-and-queues',
          title: 'Stacks and Queues',
          summary:
            'A stack is Last-In-First-Out (undo history, function calls, DFS); a queue is First-In-First-Out (task scheduling, BFS) — both are O(1) per operation when built on the right underlying structure.',
          keyPoints: [
            'Stack (LIFO): `push`/`pop` both happen at the same end, O(1) each — the runtime call stack, undo/redo, and DFS all rely on this shape.',
            'Queue (FIFO): `enqueue` at the back, `dequeue` at the front, both O(1) with the right structure (a linked list, a circular buffer, or `collections.deque`) — BFS and task/job scheduling rely on this shape.',
            'A plain Python `list` used as a queue (`pop(0)`) is O(n) per dequeue because everything shifts — always use `collections.deque` for an actual O(1) queue.',
            'A **deque** (double-ended queue) generalizes both: O(1) push/pop from *either* end, which is why it is the standard building block for sliding-window problems too.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Stack["Stack (LIFO)"]
        direction TB
        S3["push/pop here ->  [C]"] --> S2["[B]"] --> S1["[A]  (bottom)"]
    end
    subgraph Queue["Queue (FIFO)"]
        direction LR
        Q1["dequeue <- [A]"] --- Q2["[B]"] --- Q3["[C]  <- enqueue"]
    end`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'stack: validating balanced brackets',
              code: `def is_balanced(s: str) -> bool:
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack  # nothing left unmatched`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'queue: level-order traversal scaffold (BFS)',
              code: `from collections import deque

def bfs_order(start, neighbors_of):
    visited = {start}
    order = []
    queue = deque([start])
    while queue:
        node = queue.popleft()   # O(1), unlike list.pop(0)
        order.append(node)
        for nxt in neighbors_of(node):
            if nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)
    return order`,
            },
            {
              type: 'list',
              items: [
                '**Stack use cases**: the language runtime\'s own function call stack, undo/redo in an editor, matching/validating nested structures (brackets, HTML tags), DFS traversal, the "monotonic stack" pattern for next-greater-element problems.',
                '**Queue use cases**: BFS traversal, task/job scheduling (first requested, first served), rate limiting (sliding window of timestamps), producer-consumer pipelines.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A **monotonic stack** (keeping the stack always increasing or always decreasing) solves "next greater element," "daily temperatures," and "largest rectangle in histogram" in O(n) — instead of the naive O(n²) of comparing every pair, each element is pushed and popped from the stack at most once.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The same trap exists outside Python: in JavaScript, `array.shift()` is O(n) in the general case because every remaining element is re-indexed, and Java\'s `Stack` class is a legacy synchronized `Vector` subclass. Use a head index into an array (or a ring buffer) for a JS queue, and `ArrayDeque` in Java for both stacks and queues.',
            },
            {
              type: 'heading',
              text: 'Circular buffer (ring buffer) queue',
            },
            {
              type: 'p',
              text: 'When the maximum size is known — a bounded job queue, the last N log lines, an audio buffer — a fixed array plus a `head` index and a `count` gives O(1) enqueue/dequeue with zero allocation after construction. The index wraps with modulo arithmetic, so the "front" of the queue chases the "back" around the array.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'fixed-capacity ring buffer',
              code: `class RingBuffer:
    def __init__(self, capacity):
        self._buf = [None] * capacity
        self._head = 0          # index of the oldest element
        self._count = 0

    def enqueue(self, x):
        if self._count == len(self._buf):
            raise OverflowError("queue full")
        tail = (self._head + self._count) % len(self._buf)
        self._buf[tail] = x
        self._count += 1

    def dequeue(self):
        if self._count == 0:
            raise IndexError("queue empty")
        x = self._buf[self._head]
        self._buf[self._head] = None
        self._head = (self._head + 1) % len(self._buf)
        self._count -= 1
        return x`,
            },
          ],
        },
        {
          id: 'hashing-hash-tables',
          title: 'Hashing and Hash Tables',
          summary:
            'A hash table maps keys to array slots via a hash function for average O(1) lookup, insert, and delete — collisions are inevitable by the pigeonhole principle, and how they are resolved (chaining vs open addressing) defines the table\'s worst-case behavior.',
          keyPoints: [
            'A hash function converts a key into an array index; a good hash function distributes keys uniformly to minimize collisions.',
            'Collisions are mathematically unavoidable once the number of possible keys exceeds the number of slots (pigeonhole principle) — the question is only how gracefully they are handled.',
            '**Chaining**: each slot holds a small list/bucket of all keys that hashed there — simple, degrades gracefully, but adds pointer overhead.',
            '**Open addressing** (linear/quadratic probing, double hashing): on a collision, probe for the next free slot within the array itself — better cache locality, but clustering can degrade performance and requires careful deletion handling (tombstones).',
            'Average-case operations are O(1), but worst case (all keys colliding, or an adversarially crafted input against a weak hash function) degrades to O(n).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Chaining
        H0["bucket 0"] --> C1["key: 'cat'"] --> C2["key: 'ate'"]
        H1["bucket 1"] --> C3["key: 'dog'"]
        H2["bucket 2"] -.-> empty1[" (empty) "]
    end`,
            },
            {
              type: 'table',
              headers: ['', 'Chaining', 'Open Addressing'],
              rows: [
                ['Storage', 'Each slot holds a linked list/bucket of entries', 'All entries live directly in the array itself'],
                ['On collision', 'Append to that slot\'s bucket', 'Probe forward (linear/quadratic/double hash) for the next free slot'],
                ['Cache locality', 'Worse — bucket entries are scattered in memory', 'Better — everything lives in one contiguous array'],
                ['Load factor > 1?', 'Fine, buckets just get longer', 'Impossible — table must resize before it fills up'],
                ['Deletion', 'Simple — remove from the bucket', 'Tricky — needs a tombstone marker, not a true empty slot, or probing breaks'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'a hash table with chaining, from first principles',
              code: `class HashMap:
    def __init__(self, capacity=8):
        self.capacity = capacity
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _index(self, key):
        return hash(key) % self.capacity

    def put(self, key, value):
        bucket = self.buckets[self._index(key)]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)   # overwrite existing
                return
        bucket.append((key, value))
        self.size += 1
        if self.size / self.capacity > 0.75:
            self._resize()

    def get(self, key):
        bucket = self.buckets[self._index(key)]
        for k, v in bucket:
            if k == key:
                return v
        raise KeyError(key)

    def _resize(self):
        old_buckets = self.buckets
        self.capacity *= 2
        self.buckets = [[] for _ in range(self.capacity)]
        self.size = 0
        for bucket in old_buckets:
            for k, v in bucket:
                self.put(k, v)`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Average O(1) is not guaranteed O(1). A hash table degrades to O(n) per operation if the **load factor** (entries ÷ capacity) grows too high without resizing, or if an attacker can predict the hash function and craft keys that all collide into the same bucket (a real denial-of-service technique against naive hash implementations) — this is why languages randomize their string hash seed per process.',
            },
            {
              type: 'heading',
              text: 'How production hash tables actually behave',
            },
            {
              type: 'list',
              items: [
                '**CPython `dict`** uses open addressing with a perturbed probe sequence and a compact layout (a sparse index table pointing into a dense, insertion-ordered entries array) — which is why dicts preserve insertion order and iterate quickly. String hashing is randomized per process unless `PYTHONHASHSEED` is fixed.',
                '**Java `HashMap`** uses chaining, but converts a bucket into a small red-black tree once it grows past a threshold (when keys are `Comparable`), so a flood of colliding keys degrades that bucket to O(log n) rather than O(n).',
                '**Resizing** is the hidden O(n) step: when the load factor crosses a threshold, every entry is rehashed into a larger table. Like dynamic arrays, geometric growth keeps inserts amortized O(1) — but one unlucky insert pays the full cost.',
                '**Ordered vs unordered**: a hash map gives no ordering by key. If you need "smallest key ≥ x" or range scans, you want a balanced BST / skip list (`TreeMap`, C++ `std::map`, the `sortedcontainers` package in Python) at O(log n) per operation.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Two correctness rules every hash-based collection depends on: (1) **equal objects must have equal hashes** — overriding `equals` without `hashCode` in Java silently breaks `HashMap`/`HashSet`; (2) **never mutate a key after inserting it** — its hash changes, it now lives in the "wrong" bucket, and lookups for it fail. This is why Python refuses to hash lists and why tuples or frozensets are used as composite keys.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'the canonical hash-map pattern: group anagrams in O(n · k)',
              code: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        # a 26-length count tuple is a hashable, order-independent key;
        # sorting each word (O(k log k)) also works but is asymptotically slower
        counts = [0] * 26
        for ch in w:                      # assumes lowercase a-z input
            counts[ord(ch) - ord('a')] += 1
        groups[tuple(counts)].append(w)
    return list(groups.values())`,
            },
          ],
        },
        {
          id: 'two-pointer-technique',
          title: 'The Two-Pointer Technique',
          summary:
            'Two indices moving through a (typically sorted) structure — either converging from opposite ends or both advancing in the same direction — turn many O(n²) brute-force problems into O(n).',
          keyPoints: [
            'The pattern applies naturally to **sorted** arrays/strings, or to linked lists, and turns a nested-loop O(n²) search into a single O(n) pass.',
            '**Opposite-ends variant**: one pointer starts at the beginning, one at the end, and they move toward each other based on a comparison — classic for "pair sums to target" in a sorted array.',
            '**Same-direction variant** (slow/fast pointers): both pointers move forward, often at different speeds — classic for cycle detection or removing duplicates in place.',
            'Recognize the pattern from the prompt: "sorted array" + "pair/triplet that satisfies X" is the single strongest signal for two pointers.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The key insight that makes two pointers correct (not just fast) on a sorted array is an **elimination argument**. Suppose `nums[left] + nums[right] < target`. The largest possible partner for `nums[left]` among the remaining candidates is `nums[right]` — and even that is too small. So `nums[left]` cannot be part of *any* valid pair, and you can permanently discard it by moving `left` forward. Symmetrically, if the sum is too big, `nums[right]` is too big even paired with the smallest remaining value, so it is discarded. Each comparison eliminates one candidate for good, the pointers cross after at most n steps, and no valid pair is ever skipped.',
            },
            {
              type: 'p',
              text: 'Thinking of it as a grid makes the argument visual: the n×n table of all pairs (i, j) with i < j is sorted along both axes, and each comparison deletes an entire row or column of that table. A brute-force double loop checks every cell; two pointers walks a staircase path through it in O(n).',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Arr["sorted array, target = 9"]
        A0["2"] --- A1["3"] --- A2["5"] --- A3["6"] --- A4["8"]
    end
    L["left pointer<br/>starts here (2)"] -.-> A0
    R["right pointer<br/>starts here (8)"] -.-> A4
    Note["2 + 8 = 10 > 9 -> move right pointer left<br/>2 + 6 = 8 < 9 -> move left pointer right<br/>3 + 6 = 9 -> found!"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'two sum on a sorted array — O(n) time, O(1) space',
              code: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current = nums[left] + nums[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1     # need a bigger sum -> advance the smaller value
        else:
            right -= 1    # need a smaller sum -> retreat the larger value
    return []  # no pair found`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'fast/slow pointers — detect a cycle in a linked list',
              code: `def has_cycle(head) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next          # moves 1 step
        fast = fast.next.next     # moves 2 steps
        if slow is fast:
            return True            # they must meet inside a cycle
    return False`,
            },
            {
              type: 'p',
              text: 'Why must they meet? Once both pointers are inside the cycle, the gap between them shrinks by exactly one node per step (fast gains 1 on slow each iteration), so it cannot "jump over" zero. A follow-up interviewers love is finding *where* the cycle starts: if the tail before the cycle has length μ and they meet k steps into the cycle, the algebra works out so that a pointer restarted from the head and a pointer continuing from the meeting point, both moving one step at a time, collide exactly at the cycle entrance.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Floyd: return the node where the cycle begins',
              code: `def cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            ptr = head
            while ptr is not slow:       # both advance one step at a time
                ptr, slow = ptr.next, slow.next
            return ptr                   # entrance of the cycle
    return None                          # no cycle`,
            },
            {
              type: 'heading',
              text: 'Extending the pattern: 3Sum and in-place partitioning',
            },
            {
              type: 'code',
              language: 'python',
              title: '3Sum (all unique triplets summing to 0) -- O(n^2) time',
              code: `def three_sum(nums):
    nums.sort()                               # O(n log n), enables two pointers
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue                          # skip duplicate anchors
        if nums[i] > 0:
            break                             # sorted: no way to reach 0 anymore
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s < 0:
                left += 1
            elif s > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1                 # skip duplicate second values
    return result`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'same-direction pointers: remove duplicates from a sorted array in place',
              code: `def remove_duplicates(nums):
    # invariant: nums[:write] holds the unique values seen so far
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[write - 1]:
            nums[write] = nums[read]
            write += 1
    return write          # new logical length`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The "reader/writer" form of same-direction pointers is the general recipe for any in-place filter: `read` scans every element, `write` marks the end of the kept prefix. State the invariant ("everything before `write` is final") out loud — it is what makes the code obviously correct to an interviewer.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A brute-force pair-finding solution is O(n²): for each element, scan the rest for a match. A hash-set solution gets it to O(n) time but O(n) space. Two pointers on a **sorted** input gets O(n) time *and* O(1) extra space — always mention this three-way tradeoff explicitly; it is exactly what interviewers want to hear you reason through.',
            },
          ],
        },
        {
          id: 'sliding-window-technique',
          title: 'The Sliding Window Technique',
          summary:
            'A window (a contiguous subarray/substring) that expands and contracts as it slides across the input avoids recomputing overlapping work from scratch, turning many O(n²) or O(n³) brute-force scans into O(n).',
          keyPoints: [
            '**Fixed-size window**: the window size is given (e.g., "max sum of any 3 consecutive elements") — slide by one, subtracting the element leaving and adding the element entering, O(1) per step.',
            '**Variable-size window**: the window grows by advancing the right edge, and shrinks by advancing the left edge whenever some constraint is violated — the classic shape for "longest/shortest substring satisfying X."',
            'The technique works because the window\'s running state (a sum, a character-frequency count, a distinct-count) can be updated incrementally in O(1) rather than recomputed from scratch for every window position.',
            'Recognize the pattern from the prompt: "contiguous subarray/substring" + "longest/shortest/max/min satisfying some condition" is the strongest signal for sliding window.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    S1["s = 'a b c a b'<br/>window [a,b,c]  right hits 2nd 'a' -> shrink"]
    S2["left jumps past first 'a'<br/>window becomes [b,c,a]  size 3"]
    S3["right hits 2nd 'b' -> shrink again<br/>window becomes [c,a,b]  size 3"]
    S1 --> S2 --> S3`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'longest substring without repeating characters — O(n) time',
              code: `def length_of_longest_substring(s: str) -> int:
    last_seen = {}       # char -> most recent index
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            # duplicate found inside the current window -> shrink from the left
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
            },
            {
              type: 'p',
              text: 'Compare this to the brute-force approach: check every substring for uniqueness, which is O(n²) substrings times O(n) to verify each, i.e. O(n³) — or O(n²) with a smarter uniqueness check. Sliding window collapses this to a single O(n) pass because the `right` pointer only ever moves forward, and the `left` pointer only ever moves forward too — each index is visited by each pointer at most once, giving O(2n) = O(n) total work.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When a sliding-window problem asks for a *minimum* window satisfying some condition (e.g., "minimum window substring containing all characters of T"), the shape flips slightly: grow the window until the condition is satisfied, then shrink it as far as possible while it stays satisfied, recording the minimum size seen — grow-then-shrink instead of grow-with-conditional-shrink.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'minimum window substring -- the grow-then-shrink template, O(|s| + |t|)',
              code: `from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""
    need = Counter(t)
    missing = len(t)               # characters of t still not covered (with multiplicity)
    left = 0
    best_start, best_len = 0, float('inf')
    for right, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1              # may go negative: surplus copies inside the window
        while missing == 0:        # window is valid -> shrink as far as possible
            if right - left + 1 < best_len:
                best_start, best_len = left, right - left + 1
            need[s[left]] += 1
            if need[s[left]] > 0:  # we just dropped a required character
                missing += 1
            left += 1
    return "" if best_len == float('inf') else s[best_start:best_start + best_len]`,
            },
            {
              type: 'heading',
              text: 'When sliding window does NOT apply',
            },
            {
              type: 'p',
              text: 'A variable window only works when the constraint is **monotonic in the window**: extending the window can only make it "more violated" (or "more satisfied"), and shrinking it can only undo that. "Sum ≤ K with non-negative numbers" is monotonic; "sum exactly K with negative numbers allowed" is not — adding an element might decrease the sum, so you can never safely decide to move `left`. That is the cue to switch to **prefix sums with a hash map**.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Counting subarrays with *exactly* K of something (exactly K distinct values, exactly K odd numbers) is awkward with one window, but `exactly(K) = atMost(K) − atMost(K − 1)`, and "at most K" is a clean monotonic window. Each window run is O(n), so the whole thing stays O(n).',
            },
          ],
        },
        {
          id: 'prefix-sums-difference-arrays',
          title: 'Prefix Sums, Difference Arrays, and Prefix + Hash Map',
          summary:
            'Precomputing running totals turns any range-sum query into O(1) subtraction; pairing prefix sums with a hash map counts subarrays with a target sum in O(n) even when values are negative, and difference arrays apply many range updates in O(1) each.',
          keyPoints: [
            'Define `prefix[i]` = sum of the first i elements (with `prefix[0] = 0`). Then the sum of `nums[l..r]` inclusive is `prefix[r + 1] − prefix[l]` — O(n) preprocessing, O(1) per query.',
            '"Subarray sums to K" becomes "find two prefix sums that differ by K": scan once, and at each position ask a hash map how many earlier prefixes equal `current − K`. This works with negative numbers, where sliding window fails.',
            'A **difference array** is the inverse: to add v to every element in `[l, r]`, do `diff[l] += v; diff[r + 1] −= v`, then one prefix-sum pass reconstructs the final array. Many range updates, one O(n) materialization.',
            'The idea generalizes to any associative, invertible operation (XOR prefix for "subarray XOR equals K"), to 2D grids (inclusion–exclusion), and — when updates and queries interleave — to Fenwick and segment trees.',
            'Pattern cue: "sum/count of a contiguous range," many range queries, or "number of subarrays whose sum/XOR/balance equals K."',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Nums["nums"]
        direction LR
        N0["3"] --- N1["-1"] --- N2["4"] --- N3["2"]
    end
    subgraph Prefix["prefix (one longer)"]
        direction LR
        P0["0"] --- P1["3"] --- P2["2"] --- P3["6"] --- P4["8"]
    end
    Nums --> Prefix
    Prefix --> Q["sum of nums[1..3] = prefix[4] - prefix[1] = 8 - 3 = 5"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'range sum queries in O(1) after O(n) preprocessing',
              code: `from itertools import accumulate

class RangeSum:
    def __init__(self, nums):
        self.prefix = [0, *accumulate(nums)]   # prefix[i] = sum(nums[:i])

    def query(self, l, r):                      # inclusive bounds
        return self.prefix[r + 1] - self.prefix[l]`,
            },
            {
              type: 'heading',
              text: 'Prefix sum + hash map: count subarrays summing to K',
            },
            {
              type: 'code',
              language: 'python',
              title: 'subarray sum equals K -- O(n) time, O(n) space, negatives allowed',
              code: `from collections import defaultdict

def subarray_sum(nums, k):
    seen = defaultdict(int)
    seen[0] = 1            # the empty prefix -- lets a subarray start at index 0
    running = count = 0
    for x in nums:
        running += x
        count += seen[running - k]   # earlier prefixes p with running - p == k
        seen[running] += 1           # record AFTER querying, so length >= 1
    return count`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The two classic bugs here are forgetting `seen[0] = 1` (which misses every subarray that starts at index 0) and inserting the current prefix *before* querying (which counts an empty subarray when k = 0). For "longest subarray with sum K," store the **first** index at which each prefix appears instead of a count.',
            },
            {
              type: 'heading',
              text: 'Difference arrays: many range updates, one pass',
            },
            {
              type: 'code',
              language: 'python',
              title: 'apply range increments, then materialize',
              code: `def apply_range_updates(n, updates):
    # updates: list of (l, r, v) meaning "add v to every index in [l, r]"
    diff = [0] * (n + 1)
    for l, r, v in updates:
        diff[l] += v
        diff[r + 1] -= v           # stop the effect after r
    result, running = [], 0
    for i in range(n):
        running += diff[i]
        result.append(running)
    return result

# O(n + U) instead of O(n * U) for U updates -- the basis of
# "car pooling", "corporate flight bookings", and sweep-line counting`,
            },
            {
              type: 'heading',
              text: '2D prefix sums',
            },
            {
              type: 'code',
              language: 'python',
              title: 'sum of any sub-rectangle in O(1) via inclusion-exclusion',
              code: `def build_2d(grid):
    rows, cols = len(grid), len(grid[0])
    P = [[0] * (cols + 1) for _ in range(rows + 1)]
    for r in range(rows):
        for c in range(cols):
            P[r + 1][c + 1] = grid[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c]
    return P

def rect_sum(P, r1, c1, r2, c2):     # inclusive corners
    return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]`,
            },
            {
              type: 'table',
              headers: ['Need', 'Tool', 'Build', 'Query', 'Update'],
              rows: [
                ['Static array, many range sums', 'Prefix sums', 'O(n)', 'O(1)', 'O(n) — rebuild'],
                ['Many range updates, read once at the end', 'Difference array', 'O(n)', 'O(n) once', 'O(1)'],
                ['Interleaved point updates and range sums', 'Fenwick tree', 'O(n)', 'O(log n)', 'O(log n)'],
                ['Range updates + range queries, or min/max', 'Segment tree (lazy propagation)', 'O(n)', 'O(log n)', 'O(log n)'],
              ],
            },
          ],
        },
        {
          id: 'monotonic-stack-and-deque',
          title: 'Monotonic Stacks and Monotonic Deques',
          summary:
            'Keeping a stack or deque sorted by evicting elements that can never be the answer again turns "next greater element," "largest rectangle," and "sliding window maximum" from O(n²) or O(n·k) into O(n) — each element is pushed and popped at most once.',
          keyPoints: [
            'A **monotonic stack** keeps its contents increasing or decreasing; before pushing x, it pops everything that x "beats." The popped elements have just found their answer: x is their next greater (or smaller) element.',
            'Why O(n): there is an inner `while` loop, but each index is pushed exactly once and popped at most once over the whole run — an **amortized** argument, total work ≤ 2n.',
            'Store **indices**, not values: you usually need distances ("how many days until warmer") or widths ("rectangle spanning these bars"), and you can always look up the value.',
            'A **monotonic deque** adds a second exit: the front is popped when it slides out of a window. The front always holds the window\'s best element, giving sliding-window max/min in O(n).',
            'Decreasing stack → next *greater* element; increasing stack → next *smaller* element. Iterate right-to-left instead when you want the *previous* greater/smaller.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    T["temps: 73, 74, 75, 71, 69, 72, 76, 73"] --> S1["see 71, 69: push, stack holds 75, 71, 69"]
    S1 --> S2["see 72: pop 69 (ans 1 day), pop 71 (ans 2 days)<br/>stack holds 75, 72"]
    S2 --> S3["see 76: pop 72 (ans 1 day), pop 75 (ans 4 days)<br/>stack holds 76"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'daily temperatures (next greater element) -- O(n)',
              code: `def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []                       # indices; temps[stack] strictly decreasing
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i - j        # t is j's next warmer day
        stack.append(i)
    return answer                    # indices left on the stack keep 0`,
            },
            {
              type: 'heading',
              text: 'Largest rectangle in a histogram',
            },
            {
              type: 'p',
              text: 'For each bar, the widest rectangle using that bar\'s full height extends left and right until it hits a strictly shorter bar. An increasing stack discovers both boundaries at once: when bar i pops bar j, i is j\'s right boundary, and the element now below j on the stack is j\'s left boundary. A sentinel height of 0 at the end flushes every remaining bar.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'largest rectangle in histogram -- O(n)',
              code: `def largest_rectangle(heights):
    stack = []                         # indices with increasing heights
    best = 0
    for i, h in enumerate(heights + [0]):    # sentinel 0 flushes the stack
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            left = stack[-1] if stack else -1  # previous smaller bar
            best = max(best, height * (i - left - 1))
        stack.append(i)
    return best`,
            },
            {
              type: 'heading',
              text: 'Monotonic deque: sliding window maximum',
            },
            {
              type: 'code',
              language: 'python',
              title: 'max of every window of size k -- O(n) instead of O(n*k)',
              code: `from collections import deque

def max_sliding_window(nums, k):
    dq = deque()                       # indices; nums[dq] strictly decreasing
    out = []
    for i, x in enumerate(nums):
        if dq and dq[0] <= i - k:
            dq.popleft()               # front slid out of the window
        while dq and nums[dq[-1]] <= x:
            dq.pop()                   # dominated: older AND not larger
        dq.append(i)
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The intuition behind "dominated" elements: if an element is both **older** (will leave the window sooner) and **not larger** than a newer one, it can never be the maximum of any future window — so throwing it away is safe. Every monotonic structure is built on this kind of dominance argument; say it explicitly when you use one.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Strict vs non-strict comparisons matter with duplicates. In "largest rectangle," popping on `>=` vs `>` changes which bar is credited with a run of equal heights (both are correct there). In "count subarrays where x is the minimum," you must use strict on one side and non-strict on the other, or equal elements get counted twice.',
            },
          ],
        },
        {
          id: 'recursion-and-call-stack',
          title: 'Recursion and the Call Stack',
          summary:
            'Recursion expresses a solution in terms of smaller instances of itself; every active call occupies a stack frame, which is why recursion depth translates directly into O(depth) space — and why very deep recursion can crash with a stack overflow.',
          keyPoints: [
            'Every recursive function needs a **base case** (stops the recursion) and a **recursive case** (reduces the problem toward the base case) — missing or unreachable base cases cause infinite recursion.',
            'Each call that has not yet returned occupies a frame on the call stack holding its local variables and return address — a recursion of depth *d* therefore uses O(d) auxiliary space, invisible in the code itself.',
            'Python does **not** optimize tail recursion (unlike some functional languages), so a deeply recursive Python function can hit `RecursionError` well before it hits any theoretical algorithmic limit.',
            'Trees and graphs are naturally recursive structures (a tree is a node plus two smaller trees), which is why recursion is the default tool for traversing them, even when an equivalent iterative version with an explicit stack exists.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    F4["factorial(4)<br/>waiting for factorial(3)"] --> F3["factorial(3)<br/>waiting for factorial(2)"]
    F3 --> F2["factorial(2)<br/>waiting for factorial(1)"]
    F2 --> F1["factorial(1)<br/>waiting for factorial(0)"]
    F1 --> F0["factorial(0)<br/>base case: returns 1"]
    F0 -.->|"returns 1"| F1
    F1 -.->|"returns 1*1=1"| F2
    F2 -.->|"returns 2*1=2"| F3
    F3 -.->|"returns 3*2=6"| F4
    F4 -.->|"returns 4*6=24"| Done["result: 24"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'base case + recursive case',
              code: `def factorial(n):
    if n <= 1:          # base case: stops the recursion
        return 1
    return n * factorial(n - 1)   # recursive case: shrinks toward the base case

# 4 stack frames are alive simultaneously at the deepest point:
# factorial(4) -> factorial(3) -> factorial(2) -> factorial(1)`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A recursive solution that is correct on small test cases can still fail in production on a large or adversarial input purely from stack depth — e.g., a naive recursive traversal of a linked list with 100,000 nodes will blow Python\'s default recursion limit (~1000) even though the *algorithm* is a perfectly fine O(n). When depth is unbounded by input size, prefer an iterative version with an explicit stack/queue.',
            },
            {
              type: 'heading',
              text: 'How to think recursively: trust the contract',
            },
            {
              type: 'p',
              text: 'The mental move that makes recursion easy is the same one used in proofs by induction: **assume the recursive call already works on the smaller input** (the inductive hypothesis), and only ask "given that, how do I build the answer for this input?" You never trace the whole call tree in your head. For tree height: "if I already know the heights of both subtrees, my height is 1 + the larger one." That sentence *is* the code. Then check the base case and that every call strictly shrinks toward it — together, those prove termination and correctness.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'recursion as induction: write the contract first',
              code: `def height(node):
    """Contract: returns the number of nodes on the longest root-to-leaf path."""
    if node is None:                 # base case: empty tree has height 0
        return 0
    # inductive step: trust height() on the strictly smaller subtrees
    return 1 + max(height(node.left), height(node.right))`,
            },
            {
              type: 'heading',
              text: 'Converting recursion to iteration',
            },
            {
              type: 'p',
              text: 'Any recursion can be made iterative by managing the stack yourself: push a frame describing "work still to do," pop and process it, and push sub-frames. For pure pre-order style work this is trivial; for post-order work (where the parent needs its children\'s results) push each node twice, or push a `(node, visited_children)` flag, so you know whether you are entering or leaving it.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'iterative post-order with an explicit stack and an "exit" marker',
              code: `def height_iterative(root):
    if root is None:
        return 0
    heights = {None: 0}
    stack = [(root, False)]
    while stack:
        node, children_done = stack.pop()
        if children_done:                       # leaving the node
            heights[node] = 1 + max(heights[node.left], heights[node.right])
        else:                                   # entering the node
            stack.append((node, True))          # come back after children
            if node.right: stack.append((node.right, False))
            if node.left:  stack.append((node.left, False))
    return heights[root]`,
            },
            {
              type: 'table',
              headers: ['Language / runtime', 'Default stack behavior', 'Practical consequence'],
              rows: [
                ['Python (CPython)', 'Recursion limit of 1000 frames by default (`sys.getrecursionlimit()`); no tail-call optimization', 'Raising the limit with `sys.setrecursionlimit` can still crash the interpreter on very deep recursion — prefer iteration for depth ~10⁴+'],
                ['JavaScript', 'Engine-dependent stack size; proper tail calls are in the spec but only Safari/JavaScriptCore ships them', 'Do not rely on tail calls for depth; "Maximum call stack size exceeded" is a RangeError'],
                ['Java / C# / Go', 'Fixed per-thread stack (configurable); no guaranteed tail-call elimination', 'Deep recursion throws `StackOverflowError` (Java); Go grows goroutine stacks dynamically up to a large maximum'],
                ['Scheme, Haskell, many functional languages', 'Tail calls are guaranteed to not grow the stack', 'Idiomatic loops are written as tail recursion'],
              ],
            },
          ],
        },
        {
          id: 'binary-trees-and-traversals',
          title: 'Binary Trees and Traversal Orders',
          summary:
            'A binary tree is a node with up to two children; the order in which you visit a node relative to its children (in/pre/post-order, all DFS) or level by level (level-order, BFS) determines what each traversal is useful for.',
          keyPoints: [
            '**Inorder** (left, node, right): visits nodes in **sorted order** for a binary search tree — the single most important fact about traversal order.',
            '**Preorder** (node, left, right): visits the root before its subtrees — useful for copying/serializing a tree, since it reconstructs the structure top-down.',
            '**Postorder** (left, right, node): visits children before the parent — useful when a node\'s computation depends on its children\'s results first (e.g., computing subtree sizes, safely deleting a tree bottom-up).',
            '**Level-order** (BFS, via a queue): visits nodes level by level, left to right — the only one of the four that is not depth-first, and the natural choice for "shortest path in an unweighted tree" or "print by level."',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    A((1)) --> B((2))
    A --> C((3))
    B --> D((4))
    B --> E((5))
    C --> F((6))
    C --> G((7))`,
            },
            {
              type: 'table',
              headers: ['Traversal', 'Visit order for the tree above', 'Typical use'],
              rows: [
                ['Preorder', '1, 2, 4, 5, 3, 6, 7', 'Serialize/clone a tree; process root before descending'],
                ['Inorder', '4, 2, 5, 1, 6, 3, 7', 'Sorted output for a BST'],
                ['Postorder', '4, 5, 2, 6, 7, 3, 1', 'Delete a tree safely; compute values bottom-up'],
                ['Level-order', '1, 2, 3, 4, 5, 6, 7', 'Shortest path in levels; breadth-first processing'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'the four traversals',
              code: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder(node, out):
    if not node: return
    out.append(node.val)
    preorder(node.left, out)
    preorder(node.right, out)

def inorder(node, out):
    if not node: return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)

def postorder(node, out):
    if not node: return
    postorder(node.left, out)
    postorder(node.right, out)
    out.append(node.val)

def level_order(root):
    from collections import deque
    if not root: return []
    out, queue = [], deque([root])
    while queue:
        node = queue.popleft()
        out.append(node.val)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    return out`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'All three DFS traversals are O(n) time and O(h) auxiliary space for the recursion stack, where h is the tree\'s height — O(log n) for a balanced tree, but O(n) for a completely skewed one. Level-order is O(n) time and O(w) space, where w is the tree\'s maximum width (which can itself be O(n) for a wide, shallow tree).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'iterative inorder -- the explicit-stack version interviewers ask for',
              code: `def inorder_iterative(root):
    out, stack, node = [], [], root
    while stack or node:
        while node:                 # go as far left as possible
            stack.append(node)
            node = node.left
        node = stack.pop()          # leftmost unvisited node
        out.append(node.val)
        node = node.right           # then its right subtree
    return out`,
            },
            {
              type: 'heading',
              text: 'The "return information upward" pattern',
            },
            {
              type: 'p',
              text: 'Most medium/hard tree problems are post-order computations where each call returns a small summary of its subtree and the parent combines them. The trick is that the value the parent *needs* is often different from the global answer you are tracking. In "diameter of a binary tree," each call returns its **height** (what the parent needs), while the **diameter** through that node (left height + right height) updates a global best.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'diameter of a binary tree -- return one thing, record another',
              code: `def diameter(root):
    best = 0
    def depth(node):
        nonlocal best
        if not node:
            return 0
        left, right = depth(node.left), depth(node.right)
        best = max(best, left + right)      # longest path through this node (edges)
        return 1 + max(left, right)         # what the parent needs
    depth(root)
    return best`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'lowest common ancestor in a binary tree (not necessarily a BST)',
              code: `def lowest_common_ancestor(root, p, q):
    # returns p, q, their LCA, or None -- whichever is found in this subtree
    if root is None or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root              # p and q are in different subtrees
    return left or right         # both on one side (or neither)

# Assumes both p and q exist in the tree. O(n) time, O(h) space.`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Pattern cue: if a tree question asks for a global max/min over "paths" (diameter, max path sum, longest univalue path), write a helper that returns the best **downward** path from a node, and update a global answer with the best path **bending** through that node. Mixing up those two quantities is the most common bug in this family.',
            },
          ],
        },
        {
          id: 'binary-search-trees',
          title: 'Binary Search Trees',
          summary:
            'A BST maintains the invariant that every node\'s left subtree holds only smaller values and its right subtree only larger ones — giving O(log n) search/insert/delete on a balanced tree, but degrading to O(n) if the tree becomes a skewed chain.',
          keyPoints: [
            'The BST invariant — left < node < right, recursively, for every node — is what makes binary search itself possible on a tree shape instead of just a sorted array.',
            'On a **balanced** BST, search/insert/delete are all O(log n): each comparison eliminates roughly half the remaining nodes.',
            'On a **degenerate/skewed** BST (e.g., built by inserting already-sorted data one element at a time), the tree collapses into a linked list, and every operation becomes O(n).',
            'An inorder traversal of any valid BST always yields values in sorted order — a useful fact for both validating a BST and for in-order successor/predecessor queries.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Balanced["Balanced BST -- O(log n) search"]
        B4((4)) --> B2((2))
        B4 --> B6((6))
        B2 --> B1((1))
        B2 --> B3((3))
        B6 --> B5((5))
        B6 --> B7((7))
    end
    subgraph Skewed["Skewed BST (sorted insert order) -- O(n) search"]
        S1((1)) --> S2((2))
        S2 --> S3((3))
        S3 --> S4((4))
        S4 --> S5((5))
    end`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'BST search and insert',
              code: `class BSTNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def search(node, target):
    if node is None or node.val == target:
        return node
    if target < node.val:
        return search(node.left, target)
    return search(node.right, target)

def insert(node, val):
    if node is None:
        return BSTNode(val)
    if val < node.val:
        node.left = insert(node.left, val)
    else:
        node.right = insert(node.right, val)
    return node`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A plain BST offers **no** worst-case guarantee — inserting already-sorted data produces a tree that is really just a linked list in disguise, silently degrading every operation from the expected O(log n) to O(n). This exact failure mode is the entire motivation for self-balancing trees.',
            },
            {
              type: 'heading',
              text: 'Validating a BST: the invariant is global, not local',
            },
            {
              type: 'code',
              language: 'python',
              title: 'validate a BST by passing down an allowed (low, high) range',
              code: `def is_valid_bst(node, low=float('-inf'), high=float('inf')):
    if node is None:
        return True
    if not (low < node.val < high):        # strict: assumes no duplicates
        return False
    return (is_valid_bst(node.left, low, node.val) and
            is_valid_bst(node.right, node.val, high))`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The classic wrong answer only checks `node.left.val < node.val < node.right.val` at each node. That accepts trees like root 5, left child 3, and 3\'s right child 7 — every parent/child pair looks fine, but 7 sits in 5\'s left subtree. The bound must be inherited from **all** ancestors, which is exactly what the `(low, high)` window carries. (An equivalent check: an inorder traversal must be strictly increasing.)',
            },
            {
              type: 'heading',
              text: 'Deletion: the three cases',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Leaf**: just remove it.',
                '**One child**: splice the child into the deleted node\'s place.',
                '**Two children**: copy in the value of the **inorder successor** (the minimum of the right subtree, which has at most one child), then delete that successor from the right subtree — reducing to case 1 or 2.',
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'BST delete -- O(h)',
              code: `def delete(node, key):
    if node is None:
        return None
    if key < node.val:
        node.left = delete(node.left, key)
    elif key > node.val:
        node.right = delete(node.right, key)
    else:
        if node.left is None:
            return node.right            # covers the leaf case too
        if node.right is None:
            return node.left
        succ = node.right
        while succ.left:                 # smallest value in right subtree
            succ = succ.left
        node.val = succ.val
        node.right = delete(node.right, succ.val)
    return node`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Every BST operation is O(h), where h is the height. Writing it as O(h) rather than O(log n) is the precise answer — it makes clear that the logarithmic bound only holds if something keeps h logarithmic.',
            },
          ],
        },
        {
          id: 'self-balancing-trees',
          title: 'Self-Balancing Trees: AVL and Red-Black, Conceptually',
          summary:
            'Self-balancing trees automatically restructure themselves (via rotations) after insert/delete to keep height O(log n) guaranteed, trading a bit of extra bookkeeping for a worst case that can never degrade to O(n).',
          keyPoints: [
            'The core idea: after every insert/delete, check whether the tree became "unbalanced" by some criterion, and if so, perform local **rotations** to restore balance — all in O(log n) additional work.',
            '**AVL trees** enforce a strict balance factor (heights of left/right subtrees differ by at most 1) — this gives faster lookups (tree stays closer to minimum possible height) but more frequent/expensive rotations on insert/delete.',
            '**Red-Black trees** enforce a looser balancing rule (via node coloring rules) — lookups are slightly slower than AVL in the worst case, but insert/delete require fewer rotations, which is why most language standard libraries (`TreeMap` in Java, `map`/`set` in C++) use red-black trees internally.',
            'You are very rarely asked to implement rotations from scratch in an interview — what matters is understanding **why** balance is needed (guaranteed O(log n)) and being able to name the tradeoff between AVL and red-black.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Before["After inserting 1, 2, 3 in order -- unbalanced!"]
        B1((1)) --> B2((2))
        B2 --> B3((3))
    end
    subgraph After["A single left-rotation around node 1 restores balance"]
        A2((2)) --> A1((1))
        A2 --> A3((3))
    end
    Before -.->|"rotate"| After`,
            },
            {
              type: 'table',
              headers: ['', 'AVL Tree', 'Red-Black Tree'],
              rows: [
                ['Balance guarantee', 'Strict — subtree heights differ by ≤ 1 at every node', 'Looser — the longest root-to-leaf path is ≤ 2× the shortest'],
                ['Worst-case height', 'About 1.44 · log₂ n', 'At most 2 · log₂(n + 1)'],
                ['Lookup speed', 'Slightly faster (closer to perfectly balanced)', 'Slightly slower in the worst case'],
                ['Insert/delete speed', 'More rotations — deletion can rotate at every level on the way up', 'At most 2 rotations per insert and 3 per delete (plus O(log n) recoloring)'],
                ['Typical real-world use', 'In-memory, lookup-heavy indexes', 'General-purpose ordered maps — Java `TreeMap`, typical C++ `std::map` implementations, many Linux kernel subsystems'],
              ],
            },
            {
              type: 'heading',
              text: 'Balanced trees you will meet in production',
            },
            {
              type: 'table',
              headers: ['Structure', 'Balancing idea', 'Where it shows up'],
              rows: [
                ['B-tree / B+ tree', 'Very wide nodes (hundreds of keys) so the tree is only 3–4 levels deep; nodes split/merge to stay at least half full', 'Database indexes and file systems — each node is one disk page, so height = number of disk reads'],
                ['Skip list', 'Randomized "express lanes" of linked lists; expected O(log n) without rotations', 'Redis sorted sets, some concurrent/lock-free maps (Java `ConcurrentSkipListMap`)'],
                ['Treap', 'BST by key + heap by random priority; expected O(log n)', 'Competitive programming, implicit treaps for sequence editing'],
                ['Splay tree', 'Move each accessed node to the root; amortized O(log n)', 'Caches with strong access locality'],
                ['LSM tree (not a BST)', 'Buffer writes in memory, flush sorted runs, merge in the background', 'Write-heavy stores such as RocksDB and Cassandra'],
              ],
            },
            {
              type: 'p',
              text: 'What "balanced" actually buys you: for any binary tree with n nodes, the *minimum possible* height is O(log n), but the *maximum possible* height (a totally skewed chain) is O(n). A self-balancing tree structurally guarantees the tree never drifts toward that worst case — every insert/delete either leaves the tree balanced or triggers a small number of local rotations (each O(1)) that restore the invariant, keeping the overall operation at O(log n) even in an adversarial sequence of insertions like already-sorted data.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'You will rarely be asked to hand-code AVL/red-black rotations in an interview — full rotation logic is usually considered implementation detail rather than a reasoning test. What matters is being able to state clearly: "a plain BST can degrade to O(n); a self-balancing tree guarantees O(log n) by restructuring itself after every insert/delete."',
            },
          ],
        },
        {
          id: 'heaps-and-priority-queues',
          title: 'Heaps and Priority Queues',
          summary:
            'A heap is a complete binary tree stored compactly in an array, where every parent is smaller (min-heap) or larger (max-heap) than its children — giving O(log n) insert/extract and O(1) peek at the minimum or maximum.',
          keyPoints: [
            'A **min-heap** keeps the smallest element at the root (accessible in O(1)); a **max-heap** keeps the largest — both maintain this only between parent and child, not full sorted order.',
            'Because a heap is a *complete* binary tree, it can be stored densely in a plain array: for a node at index *i*, children live at `2i + 1` and `2i + 2`, and the parent lives at `(i - 1) // 2` — no pointers needed.',
            '`push` (sift-up) and `pop` (sift-down) are both O(log n); peeking at the min/max is O(1); building a heap from n items all at once (`heapify`) is O(n), not O(n log n).',
            '**Heap sort** repeatedly extracts the min/max — O(n log n) time, O(1) extra space (in-place), but **not stable** (equal elements can be reordered relative to each other).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Tree["Min-heap as a tree"]
        R((2)) --> L1((5))
        R --> L2((3))
        L1 --> L3((8))
        L1 --> L4((9))
        L2 --> L5((7))
    end
    subgraph Array["Same heap as an array"]
        direction LR
        I0["idx0: 2"] --- I1["idx1: 5"] --- I2["idx2: 3"] --- I3["idx3: 8"] --- I4["idx4: 9"] --- I5["idx5: 7"]
    end`,
            },
            {
              type: 'table',
              headers: ['Operation', 'Complexity'],
              rows: [
                ['Peek min/max', 'O(1)'],
                ['Insert (push)', 'O(log n)'],
                ['Extract min/max (pop)', 'O(log n)'],
                ['Build heap from n items', 'O(n) — cheaper than n individual O(log n) inserts'],
                ['Heap sort (whole array)', 'O(n log n) time, O(1) extra space'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'priority queue via heapq -- top-K largest elements',
              code: `import heapq

def top_k_largest(nums, k):
    # keep a min-heap of size k: the smallest of the "top k so far"
    # sits at the root, so we can decide in O(log k) whether a new
    # element belongs in the top k at all
    if k <= 0:
        return []
    heap = []
    for num in nums:
        if len(heap) < k:
            heapq.heappush(heap, num)
        elif num > heap[0]:
            heapq.heapreplace(heap, num)   # pop smallest, push num
    return sorted(heap, reverse=True)

# O(n log k) total -- much better than sorting everything (O(n log n))
# when k is small relative to n`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Python\'s `heapq` was historically min-heap only, and the classic workaround is to negate numeric values on push and pop (`heapq.heappush(heap, -val)`). Python 3.14 added public max-heap functions (`heapify_max`, `heappush_max`, `heappop_max`, `heapreplace_max`, `heappushpop_max`). In interviews, negation still works on every version — but say which one you are using. Java\'s `PriorityQueue` is a min-heap by default; pass `Comparator.reverseOrder()` for a max-heap.',
            },
            {
              type: 'heading',
              text: 'Why building a heap is O(n), not O(n log n)',
            },
            {
              type: 'p',
              text: 'Bottom-up `heapify` sifts down every non-leaf node, starting from the last one. Sift-down cost is proportional to a node\'s **height**, not the tree\'s: half the nodes are leaves (cost 0), a quarter have height 1, an eighth height 2, and so on. The total is n · Σ h/2^(h+1), and that series converges to a constant, so the whole build is O(n). Pushing items one at a time instead uses sift-*up*, whose cost is proportional to *depth* — and most nodes are deep — giving O(n log n).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'sift-down and bottom-up heapify from scratch (min-heap)',
              code: `def sift_down(a, i, n):
    while True:
        smallest, l, r = i, 2 * i + 1, 2 * i + 2
        if l < n and a[l] < a[smallest]:
            smallest = l
        if r < n and a[r] < a[smallest]:
            smallest = r
        if smallest == i:
            return                      # heap property holds here
        a[i], a[smallest] = a[smallest], a[i]
        i = smallest

def heapify(a):
    for i in range(len(a) // 2 - 1, -1, -1):   # last non-leaf down to root
        sift_down(a, i, len(a))`,
            },
            {
              type: 'heading',
              text: 'Heap patterns',
            },
            {
              type: 'table',
              headers: ['Problem', 'Heap usage', 'Complexity'],
              rows: [
                ['Top K largest / K closest points', 'Min-heap of size K (evict the weakest of the current best)', 'O(n log K)'],
                ['Merge K sorted lists/arrays', 'Min-heap holding one "cursor" per list', 'O(N log K)'],
                ['Median of a stream', 'Max-heap for lower half + min-heap for upper half', 'O(log n) insert, O(1) median'],
                ['Task scheduling / meeting rooms', 'Min-heap of end times (when does the next resource free up?)', 'O(n log n)'],
                ['Dijkstra, Prim, A*', 'Min-heap keyed by tentative distance/cost', 'O((V + E) log V)'],
                ['Kth smallest in a sorted matrix', 'Min-heap expanding frontier, or binary search on value', 'O(K log K)'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'merge K sorted lists with a heap -- O(N log K)',
              code: `import heapq

def merge_k_sorted(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            # (value, list index, element index): the list index breaks
            # ties so Python never has to compare non-comparable payloads
            heapq.heappush(heap, (lst[0], i, 0))
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return out`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Standard binary heaps have no efficient "decrease key" or "delete arbitrary element" — finding the element is O(n). The standard workaround (used in the Dijkstra code later) is **lazy deletion**: push a new entry with the better priority and skip stale entries when they are popped. Also note that pushing tuples with equal priorities makes Python compare the *next* tuple field, so add a unique tie-breaker (an index or counter) when payloads are not comparable.',
            },
          ],
        },
        {
          id: 'tries-prefix-trees',
          title: 'Tries (Prefix Trees)',
          summary:
            'A trie stores strings one character per edge along shared prefixes, giving O(L) lookup/insert (L = word length) independent of how many other words are stored — ideal for autocomplete, spell-check, and prefix search.',
          keyPoints: [
            'Each node represents one character position; a path from the root spells out a prefix, and a marked "end of word" flag distinguishes a complete word from just a prefix of a longer one.',
            'Lookup and insert are both O(L), where L is the length of the word being searched/inserted — crucially, this does **not** depend on how many total words are stored in the trie.',
            'Unlike a hash set, a trie can efficiently answer "does any word start with this prefix?" in O(L) — a hash set would need to check every stored word individually, O(n × L).',
            'The tradeoff is memory: a trie can use significantly more space than a hash set for the same word list, since shared prefixes are the only thing being compressed, not the full structure.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Root((root)) --> C((c))
    C --> CA((a))
    CA --> CAT(("t *"))
    CA --> CAR(("r *"))
    Root --> D((d))
    D --> DO((o))
    DO --> DOG(("g *"))
    classDef word fill:#cde,stroke:#333
    class CAT,CAR,DOG word`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'a trie supporting insert, search, and prefix search',
              code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end_of_word = True

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_end_of_word

    def starts_with(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

    def _walk(self, s: str):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The `*` marks `cat` and `car` as complete words, while `ca` is just a shared prefix node with no end-of-word flag — this is exactly why a trie can distinguish a valid word from a valid-but-incomplete prefix, something a hash set has no natural way to express.',
            },
            {
              type: 'heading',
              text: 'Design choices and where tries shine',
            },
            {
              type: 'table',
              headers: ['Children representation', 'Pros', 'Cons'],
              rows: [
                ['Fixed array of 26 (or 256)', 'O(1) child access, cache-friendly, simple', 'Wastes memory on sparse nodes; tied to a fixed alphabet'],
                ['Hash map per node', 'Any alphabet (Unicode), memory proportional to actual children', 'Hashing overhead and more allocations'],
                ['Compressed / radix tree', 'Merges single-child chains into one edge labeled with a string — far fewer nodes', 'More complex insert (edges must be split)'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Autocomplete**: walk to the prefix node (O(L)), then DFS beneath it; store a "top suggestions" list at each node to answer in O(L) without the DFS.',
                '**Word Search II** (find all dictionary words in a letter grid): build a trie of the dictionary and DFS the grid *once*, following trie edges — every dead prefix prunes the search immediately, instead of running a separate grid search per word.',
                '**Longest-prefix match**: IP routing tables use binary (bitwise) tries keyed on address bits.',
                '**Maximum XOR of two numbers**: insert each number\'s bits (most significant first) into a binary trie, then greedily walk the opposite bit for each query — O(n · bit-width).',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When pruning a trie-driven search (Word Search II), remove a word\'s end marker once it is found, and delete leaf nodes that no longer lead to any word. That keeps later DFS branches from re-exploring exhausted prefixes and is often the difference between passing and timing out.',
            },
          ],
        },
        {
          id: 'fenwick-and-segment-trees',
          title: 'Range Queries: Fenwick Trees and Segment Trees',
          summary:
            'When an array changes while you keep asking range questions, prefix sums cost O(n) per update; a Fenwick tree (binary indexed tree) or segment tree supports both point updates and range queries in O(log n).',
          keyPoints: [
            'The problem: interleaved `update(i, v)` and `query(l, r)` operations. Plain arrays give O(1) update and O(n) query; prefix sums give O(1) query and O(n) update. Both are O(n) in the worst mix.',
            'A **Fenwick tree** stores partial sums over ranges whose lengths are powers of two determined by each index\'s lowest set bit (`i & -i`). Point update and prefix query each touch O(log n) cells. Compact — one array of size n + 1 — and tiny to code.',
            'A Fenwick tree needs an **invertible** operation (sum, XOR) to turn prefix queries into range queries. For min/max, use a segment tree.',
            'A **segment tree** is a binary tree where each node stores the aggregate (sum, min, max, gcd...) of a segment; any range decomposes into O(log n) nodes. With **lazy propagation** it also handles range updates in O(log n).',
            'Pattern cue: "after each update, answer a range query," "count of smaller elements after self," "number of inversions," or any problem where values arrive over time and you need rank/order statistics.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    R["[0..7] sum 36"] --> A["[0..3] sum 10"]
    R --> B["[4..7] sum 26"]
    A --> A1["[0..1] sum 3"]
    A --> A2["[2..3] sum 7"]
    B --> B1["[4..5] sum 11"]
    B --> B2["[6..7] sum 15"]
    A1 --> L0["1"]
    A1 --> L1["2"]
    A2 --> L2["3"]
    A2 --> L3["4"]
    B1 --> L4["5"]
    B1 --> L5["6"]
    B2 --> L6["7"]
    B2 --> L7["8"]`,
            },
            {
              type: 'p',
              text: 'The diagram is a sum segment tree over `[1, 2, 3, 4, 5, 6, 7, 8]`. A query for indices 1..6 is answered by combining just a handful of nodes whose segments exactly tile the range (leaf 1, node [2..3], node [4..5], leaf 6) — never more than about 2 per level, hence O(log n). A point update changes one leaf and the O(log n) ancestors above it.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Fenwick tree (binary indexed tree) for prefix sums',
              code: `class Fenwick:
    def __init__(self, n):
        self.tree = [0] * (n + 1)        # 1-indexed internally

    def add(self, i, delta):             # nums[i] += delta, i is 0-indexed
        i += 1
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & -i                  # jump to the next range covering i

    def prefix_sum(self, i):             # sum of nums[0..i-1]
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i                  # strip the lowest set bit
        return total

    def range_sum(self, l, r):           # inclusive, 0-indexed
        return self.prefix_sum(r + 1) - self.prefix_sum(l)`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'iterative segment tree for range minimum with point updates',
              code: `class MinSegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.t = [float('inf')] * (2 * self.n)
        self.t[self.n:] = nums                     # leaves live at [n, 2n)
        for i in range(self.n - 1, 0, -1):
            self.t[i] = min(self.t[2 * i], self.t[2 * i + 1])

    def update(self, i, value):
        i += self.n
        self.t[i] = value
        while i > 1:
            i //= 2
            self.t[i] = min(self.t[2 * i], self.t[2 * i + 1])

    def query(self, l, r):                         # min over [l, r), half-open
        res = float('inf')
        l += self.n
        r += self.n
        while l < r:
            if l & 1:
                res = min(res, self.t[l]); l += 1
            if r & 1:
                r -= 1; res = min(res, self.t[r])
            l //= 2
            r //= 2
        return res`,
            },
            {
              type: 'table',
              headers: ['', 'Fenwick tree', 'Segment tree'],
              rows: [
                ['Memory', 'n + 1', '2n (iterative) to 4n (recursive)'],
                ['Operations', 'Invertible aggregates: sum, XOR, counts', 'Any associative aggregate: sum, min, max, gcd, custom merges'],
                ['Range update + range query', 'Possible with two BITs (sum only)', 'Natural with lazy propagation'],
                ['Code size', '~15 lines', '~30–80 lines depending on features'],
                ['Typical use', 'Inversion counting, frequency tables, order statistics', 'Range min/max, interval assignment, complex merges'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Count inversions (or "count of smaller numbers after self") by **coordinate-compressing** values to ranks 0..m−1, then scanning right to left: query the Fenwick tree for how many already-seen values have a smaller rank, then add the current rank. O(n log n), and it generalizes to many "how many earlier elements satisfy X" problems. Merge sort can also count inversions in O(n log n).',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'These structures are rarer in typical product-company interviews than in competitive programming, but recognizing "this needs a Fenwick/segment tree" — and naming the O(log n) trade-off versus prefix sums — is a strong senior signal even if you are not asked to code one.',
            },
          ],
        },
        {
          id: 'graph-representations',
          title: 'Graph Representations',
          summary:
            'The same graph can be stored as an adjacency list (compact, fast to iterate a node\'s neighbors) or an adjacency matrix (fast O(1) edge lookup, but O(V²) space regardless of how sparse the graph actually is).',
          keyPoints: [
            '**Adjacency list**: each vertex stores a list of its neighbors — O(V + E) space, ideal for sparse graphs (most real-world graphs), and iterating a vertex\'s neighbors is proportional to its actual degree.',
            '**Adjacency matrix**: a V × V grid where `matrix[i][j]` marks whether an edge exists — O(V²) space regardless of edge count, but checking "does an edge exist between i and j?" is O(1).',
            'Most graph algorithms (BFS, DFS, Dijkstra, topological sort) are typically implemented against an adjacency list because real interview graphs are usually sparse (E is much closer to V than to V²).',
            'A weighted graph stores the weight alongside each edge — in an adjacency list, as `(neighbor, weight)` pairs; in a matrix, as the cell value itself instead of a boolean.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    A((A)) --- B((B))
    A --- C((C))
    B --- D((D))
    C --- D`,
            },
            {
              type: 'table',
              headers: ['', 'Adjacency List', 'Adjacency Matrix'],
              rows: [
                ['Space', 'O(V + E)', 'O(V²)'],
                ['Check if edge (u, v) exists', 'O(degree of u)', 'O(1)'],
                ['Iterate all neighbors of v', 'O(degree of v) — exactly proportional', 'O(V) — scans the whole row even if v has 1 neighbor'],
                ['Best for', 'Sparse graphs (E << V²) — the common case', 'Dense graphs, or when O(1) edge lookups matter more than space'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'building an adjacency list for an undirected weighted graph',
              code: `from collections import defaultdict

def build_graph(edges):
    # edges: list of (u, v, weight)
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))   # omit this line for a directed graph
    return graph

# graph['A'] -> [('B', 4), ('C', 1)]`,
            },
          ],
        },
        {
          id: 'graph-traversal-bfs-dfs',
          title: 'Graph Traversal: BFS and DFS',
          summary:
            'Breadth-first search explores level by level via a queue and finds shortest paths in unweighted graphs; depth-first search plunges as deep as possible via a stack (or recursion) before backtracking — both run in O(V + E).',
          keyPoints: [
            'BFS uses a **queue**: it fully explores every node at the current distance before moving further out, which is exactly why BFS finds the shortest path (fewest edges) in an unweighted graph.',
            'DFS uses a **stack** (explicit, or implicit via recursion): it commits to one path as deep as possible before backtracking, which is why it is natural for exploring all paths, detecting cycles, and topological sort.',
            'Both are O(V + E) time — each vertex is visited once and each edge is examined once — and O(V) space for the visited set (plus the queue/stack/recursion depth).',
            'On the *same* graph, BFS and DFS generally visit nodes in a completely different order, which is the entire reason to choose one over the other for a given problem.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    A((A)) --> B((B))
    A --> C((C))
    B --> D((D))
    B --> E((E))
    C --> F((F))
    linkStyle default stroke:#888`,
            },
            {
              type: 'table',
              headers: ['Traversal', 'Order visited (starting at A)', 'Why'],
              rows: [
                ['BFS', 'A, B, C, D, E, F', 'Visits every neighbor of A first (distance 1), then every neighbor of those (distance 2)'],
                ['DFS', 'A, B, D, E, C, F', 'Commits fully down one branch (A→B→D, then B→E) before backtracking to explore C'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'BFS and DFS on the same adjacency-list graph',
              code: `from collections import deque

def bfs(graph, start):
    visited = {start}
    order = []
    queue = deque([start])
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

def dfs_iterative(graph, start):
    # mark visited when POPPED (not when pushed) to get a true DFS order;
    # a node may sit on the stack more than once, so skip stale copies
    visited = set()
    order = []
    stack = [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        order.append(node)
        for neighbor in reversed(graph[node]):   # reversed -> visit in list order
            if neighbor not in visited:
                stack.append(neighbor)
    return order`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A subtle but real bug: copying the BFS habit of marking nodes visited *when pushed* into an iterative DFS. That produces a valid traversal (every node reached once) but **not a depth-first order** — with edges A→B, A→C, B→C, B→D, push-marking visits A, B, D, C, while true DFS visits A, B, C, D. It matters as soon as you rely on DFS structure (discovery/finish times, cycle detection, Tarjan-style algorithms). For BFS, marking on push is correct and keeps the queue small.',
            },
            {
              type: 'heading',
              text: 'Grids are graphs',
            },
            {
              type: 'p',
              text: 'A huge fraction of graph interview questions never mention a graph: they hand you a 2D grid. Each cell is a vertex, and its 4 (or 8) neighbors are edges. "Number of islands" is connected components; "rotting oranges" is **multi-source BFS** (enqueue every rotten orange at distance 0, then expand level by level); "shortest path in a binary matrix" is plain BFS.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'multi-source BFS on a grid: minutes until all oranges rot',
              code: `from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue, fresh = deque(), 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))      # every source starts at time 0
            elif grid[r][c] == 1:
                fresh += 1
    minutes = 0
    while queue and fresh:
        for _ in range(len(queue)):       # process exactly one BFS level
            r, c = queue.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2      # mark on push: no duplicates in the queue
                    fresh -= 1
                    queue.append((nr, nc))
        minutes += 1
    return -1 if fresh else minutes`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Other BFS variants worth knowing by name: **0-1 BFS** (edge weights only 0 or 1 — use a deque, push weight-0 edges to the front; O(V + E) without a heap), **bidirectional BFS** (search from both ends and meet in the middle — roughly b^(d/2) work instead of b^d), and **BFS over states** (the "vertex" is a tuple like `(row, col, keys_held)`, as in puzzle and lock problems).',
            },
            {
              type: 'list',
              items: [
                '**Use BFS for**: shortest path in an unweighted graph, "minimum number of steps/moves," finding all nodes within k hops, checking bipartiteness.',
                '**Use DFS for**: exploring all possible paths, detecting cycles, topological sort, connected components, backtracking-style search over a graph-shaped decision space.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A very common interview shorthand: "shortest path with all edges the same weight" almost always means BFS, not Dijkstra — reaching for a priority queue when a plain queue would do is a common over-engineering tell.',
            },
          ],
        },
        {
          id: 'shortest-path-algorithms',
          title: 'Shortest-Path Algorithms: Dijkstra, Bellman-Ford, Floyd-Warshall',
          summary:
            'Dijkstra greedily finds single-source shortest paths in O((V + E) log V) but requires non-negative weights; Bellman-Ford handles negative weights (and detects negative cycles) at O(V × E); Floyd-Warshall computes all-pairs shortest paths at O(V³).',
          keyPoints: [
            '**Dijkstra**: greedily expands the closest unvisited vertex first, using a min-heap — O((V + E) log V). Requires all edge weights to be **non-negative**, because it assumes a vertex\'s shortest distance is finalized once popped, which negative edges can violate.',
            '**Bellman-Ford**: relaxes every edge V − 1 times — O(V × E), slower than Dijkstra but works with negative edge weights, and can detect a negative-weight cycle (one more relaxation pass that still improves a distance means a negative cycle exists).',
            '**Floyd-Warshall**: dynamic programming over all pairs simultaneously — O(V³), which is worse per-pair than running Dijkstra from every vertex on a sparse graph, but simple to implement and fine for dense graphs or small V.',
            'Choosing the right one is a direct function of two questions: are there negative weights, and do you need one source\'s distances or every pair\'s?',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    A((A dist:0)) -->|4| B((B dist:4))
    A -->|1| C((C dist:1))
    C -->|2| B
    B -->|1| D((D dist:6))
    C -->|5| D
    Note["Dijkstra relaxes C->B (1+2=3 < 4) before B is finalized,<br/>so B's distance updates from 4 to 3 -- popping in<br/>increasing distance order guarantees this always happens in time"]`,
            },
            {
              type: 'table',
              headers: ['Algorithm', 'Complexity', 'Handles negative weights?', 'Answers'],
              rows: [
                ['Dijkstra', 'O((V + E) log V)', 'No', 'Single source → all vertices'],
                ['Bellman-Ford', 'O(V × E)', 'Yes, and detects negative cycles', 'Single source → all vertices'],
                ['Floyd-Warshall', 'O(V³)', 'Yes, and detects negative cycles', 'Every pair of vertices'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'Dijkstra with a min-heap',
              code: `import heapq

def dijkstra(graph, source):
    # graph[u] -> list of (v, weight)
    dist = {source: 0}
    visited = set()
    heap = [(0, source)]
    while heap:
        d, u = heapq.heappop(heap)
        if u in visited:
            continue
        visited.add(u)
        for v, weight in graph[u]:
            new_dist = d + weight
            if v not in dist or new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(heap, (new_dist, v))
    return dist`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Running Dijkstra on a graph with a negative edge silently produces a *wrong* answer rather than an error — because Dijkstra finalizes a vertex\'s distance the moment it is popped from the heap, a later negative edge that would have produced a shorter path is never considered. If negative weights are even a remote possibility, use Bellman-Ford (or Floyd-Warshall for all-pairs) instead — or Johnson\'s algorithm, which reweights edges with one Bellman-Ford pass so Dijkstra can then run from every vertex.',
            },
            {
              type: 'heading',
              text: 'Why Dijkstra is correct (the invariant)',
            },
            {
              type: 'p',
              text: 'Invariant: when a vertex u is popped for the first time, `d` is its true shortest distance. Proof sketch: suppose some shorter path to u existed. It must leave the set of already-finalized vertices at some edge (x → y) with y not yet finalized. Then dist(y) ≤ length of that path prefix ≤ (shorter path length) < d. But y would then have been popped before u — contradiction. The step "path prefix ≤ whole path" is exactly where **non-negative weights** are required; a negative edge later on the path could make the whole path shorter than its prefix.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Bellman-Ford with negative-cycle detection -- O(V * E)',
              code: `def bellman_ford(n, edges, source):
    # edges: list of (u, v, weight); vertices are 0..n-1
    INF = float('inf')
    dist = [INF] * n
    dist[source] = 0
    for _ in range(n - 1):               # a shortest path has at most n-1 edges
        changed = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            break                         # early exit: already converged
    for u, v, w in edges:                 # one more pass: any improvement => cycle
        if dist[u] != INF and dist[u] + w < dist[v]:
            raise ValueError("negative-weight cycle reachable from source")
    return dist`,
            },
            {
              type: 'table',
              headers: ['Situation', 'Best choice', 'Complexity'],
              rows: [
                ['Unweighted (all edges equal)', 'BFS', 'O(V + E)'],
                ['Weights are only 0 or 1', '0-1 BFS with a deque', 'O(V + E)'],
                ['DAG, any weights (even negative)', 'Relax edges in topological order', 'O(V + E)'],
                ['Non-negative weights, one source', 'Dijkstra with a binary heap', 'O((V + E) log V)'],
                ['Non-negative weights, single target, good heuristic', 'A* (Dijkstra + admissible heuristic)', 'Same worst case, often far fewer expansions'],
                ['Negative weights, one source', 'Bellman-Ford (or SPFA in practice)', 'O(V · E)'],
                ['All pairs, small or dense graph', 'Floyd-Warshall', 'O(V³) time, O(V²) space'],
                ['"At most K edges/stops"', 'Bellman-Ford limited to K rounds (copy dist each round)', 'O(K · E)'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Many "shortest path" problems hide extra state: "cheapest flight with at most K stops," "shortest path where you may break one wall." Make the state part of the vertex — `(node, stops_used)` or `(row, col, walls_broken)` — and run the usual algorithm on that expanded graph.',
            },
          ],
        },
        {
          id: 'mst-union-find',
          title: 'Minimum Spanning Trees: Kruskal, Prim, and Union-Find',
          summary:
            'A Minimum Spanning Tree connects every vertex with the minimum total edge weight and no cycles; Kruskal builds it by adding cheapest edges globally (via Union-Find to detect cycles), while Prim grows it outward from one vertex (via a min-heap).',
          keyPoints: [
            '**Kruskal\'s algorithm**: sort all edges by weight, then greedily add each edge unless it would create a cycle — cycle detection is done efficiently with a **Union-Find (Disjoint Set)** structure. O(E log E) overall, dominated by the sort.',
            '**Prim\'s algorithm**: start from any vertex and repeatedly add the cheapest edge that connects the growing tree to a new vertex, using a min-heap — O(E log V). On a **dense** graph (E ≈ V²), the heap-free array version of Prim runs in O(V²), which beats both heap-based Prim and Kruskal there.',
            '**Union-Find** supports two operations — `find(x)` (which set is x in?) and `union(x, y)` (merge x\'s and y\'s sets) — and with two optimizations (union by rank, path compression), both run in near-O(1) **amortized** time (technically O(α(n)), the inverse Ackermann function, which is at most 4 for any input size that could physically exist).',
            'Kruskal tends to be simpler to reason about and preferred when edges are already available as a flat list; Prim tends to be preferred when the graph is given as an adjacency list or is dense.',
            'Both are greedy and both are justified by the **cut property**: for any partition of the vertices into two sides, the cheapest edge crossing the partition belongs to some MST. Kruskal\'s chosen edge is the cheapest crossing the cut between two components; Prim\'s is the cheapest crossing the cut between the tree and everything else.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Before["Before union(C, D): two trees, roots A and D"]
        B1((B)) --> A1((A rank 1))
        C1((C)) --> A1
        E1((E)) --> D1((D rank 0))
    end
    subgraph After["After union(C, D): lower-rank root D attaches under A"]
        B2((B)) --> A2((A rank 1))
        C2((C)) --> A2
        D2((D)) --> A2
        E2((E)) --> D2
    end
    Before --> After`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'Union-Find with union-by-rank and path compression',
              code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])   # path compression
        return self.parent[x]

    def union(self, x, y) -> bool:
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False   # already connected -> would create a cycle
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx           # attach smaller-rank tree under larger
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True`,
            },
            {
              type: 'code',
              language: 'python',
              title: "Kruskal's algorithm using Union-Find",
              code: `def kruskal(n, edges):
    # edges: list of (weight, u, v)
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    for weight, u, v in sorted(edges):
        if uf.union(u, v):        # only adds the edge if it doesn't form a cycle
            mst_weight += weight
            edges_used += 1
            if edges_used == n - 1:
                break
    return mst_weight`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Union-Find is not just for MST — it is the go-to tool for "connected components," "does adding this edge create a cycle," "number of provinces/islands via merging," and "accounts belong to the same person" style problems, any time the question is really "are these two things in the same group?"',
            },
          ],
        },
        {
          id: 'topological-sort',
          title: 'Topological Sort for DAGs',
          summary:
            'A topological sort orders the vertices of a Directed Acyclic Graph so that every edge points from an earlier vertex to a later one — used for build systems, course prerequisites, and any "must happen before" dependency graph.',
          keyPoints: [
            'Only defined for a **DAG** (Directed Acyclic Graph) — if the graph has a cycle, no valid ordering can exist, since the cycle creates a contradictory "must come before itself" requirement.',
            '**Kahn\'s algorithm** (BFS-based): repeatedly remove vertices with in-degree 0, decrementing their neighbors\' in-degrees — naturally also detects a cycle (if fewer than V vertices get processed, a cycle exists).',
            'A **DFS-based** approach also works: run DFS, and prepend each vertex to the result the moment it finishes (post-order) — the reverse of DFS finish order is a valid topological order.',
            'Both run in O(V + E); a topological order is generally not unique when multiple vertices simultaneously have in-degree 0 (or an equivalent DFS choice point).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Compile["compile"] --> Test["test"]
    Compile --> Lint["lint"]
    Test --> Deploy["deploy"]
    Lint --> Deploy`,
            },
            {
              type: 'code',
              language: 'python',
              title: "Kahn's algorithm (BFS-based topological sort)",
              code: `from collections import deque, defaultdict

def topological_sort(n, edges):
    graph = defaultdict(list)
    in_degree = [0] * n
    for u, v in edges:            # edge u -> v means "u before v"
        graph[u].append(v)
        in_degree[v] += 1

    queue = deque(v for v in range(n) if in_degree[v] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    if len(order) != n:
        raise ValueError("graph has a cycle -- no valid topological order")
    return order`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A common bug: forgetting to check `len(order) != n` at the end. If the graph has a cycle, Kahn\'s algorithm simply stalls once every remaining vertex still has a positive in-degree — silently returning a partial, incomplete order instead of raising an error is a correctness bug waiting to surface downstream.',
            },
            {
              type: 'heading',
              text: 'DFS-based topological sort with three-color cycle detection',
            },
            {
              type: 'p',
              text: 'In a directed graph, "already visited" is not enough to detect a cycle — reaching a node that was fully finished via another branch is harmless (a cross or forward edge). A cycle exists only when DFS reaches a node that is **still on the current path** (a back edge). Three colors track this: WHITE (unvisited), GRAY (on the stack, in progress), BLACK (finished).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'topological order via DFS finish times',
              code: `def topo_sort_dfs(n, edges):
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n
    order = []

    def visit(u):
        color[u] = GRAY
        for v in graph[u]:
            if color[v] == GRAY:
                raise ValueError("cycle detected")   # back edge
            if color[v] == WHITE:
                visit(v)
        color[u] = BLACK
        order.append(u)              # post-order: u finishes after all its descendants

    for u in range(n):
        if color[u] == WHITE:
            visit(u)
    return order[::-1]               # reverse finish order = topological order`,
            },
            {
              type: 'table',
              headers: ['', 'Kahn (BFS, in-degrees)', 'DFS (finish order)'],
              rows: [
                ['Cycle detection', 'Processed count < V', 'Edge into a GRAY node'],
                ['Recursion', 'None — iterative', 'Recursive (or a manual stack); watch depth limits'],
                ['Lexicographically smallest order', 'Easy — swap the queue for a min-heap', 'Awkward'],
                ['Parallel scheduling ("minimum semesters")', 'Natural — process level by level', 'Needs an extra longest-path pass'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A topological order also unlocks linear-time DP on DAGs: longest path, number of paths, critical-path scheduling, and shortest paths with negative edges all become a single pass relaxing edges in topological order. When a DP\'s dependency graph is a DAG but not a simple index order, topo sort *is* the computation order.',
            },
          ],
        },
        {
          id: 'comparison-sorts-merge-quick',
          title: 'Merge Sort and Quicksort',
          summary:
            'Merge sort guarantees O(n log n) always, is stable, but needs O(n) extra space; quicksort is in-place and typically faster in practice but has an O(n²) worst case that hinges entirely on pivot choice.',
          keyPoints: [
            'Merge sort: divide the array in half recursively, sort each half, then **merge** the two sorted halves — recurrence T(n) = 2T(n/2) + O(n), which solves to O(n log n) in **every** case, no exceptions.',
            'Quicksort: pick a pivot, **partition** the array so smaller elements land left and larger land right, then recursively sort each side — average O(n log n), but O(n²) worst case when the pivot repeatedly splits the array as unevenly as possible (e.g., always picking the first element on an already-sorted array).',
            'Merge sort is **stable** (equal elements keep their relative order) and needs O(n) auxiliary space for the merge step; quicksort is typically **in-place** but not stable. Its stack space is O(log n) only if you recurse into the **smaller** partition first and loop on the larger one; the naive two-recursive-calls version can reach O(n) stack depth in the worst case.',
            'Randomizing the pivot choice (or using median-of-three) makes quicksort\'s worst case astronomically unlikely in practice, which is why real-world quicksort implementations essentially never hit O(n²) on real data.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Partition["Quicksort partition step, pivot = 5"]
        Before["[3, 7, 1, 5, 9, 2, 8]"] --> After["[3, 1, 2] + [5] + [7, 9, 8]<br/>smaller       pivot   larger"]
    end`,
            },
            {
              type: 'table',
              headers: ['', 'Merge Sort', 'Quicksort'],
              rows: [
                ['Best case', 'O(n log n)', 'O(n log n)'],
                ['Average case', 'O(n log n)', 'O(n log n)'],
                ['Worst case', 'O(n log n)', 'O(n²) — bad pivot repeatedly'],
                ['Extra space', 'O(n) for arrays (O(1) extra for linked lists)', 'O(log n) stack if you recurse on the smaller side first; O(n) naive worst case'],
                ['Cache behavior', 'Sequential scans, but copies to a buffer', 'Excellent — partitions in place'],
                ['Best fit', 'Linked lists, external sorting, stability required', 'In-memory arrays of primitives'],
                ['Stable?', 'Yes', 'No (standard in-place version)'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'merge sort',
              code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return _merge(left, right)

def _merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:   # <= keeps it stable
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'quicksort with a randomized pivot (in-place partition)',
              code: `import random

def quicksort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        pivot_index = _partition(arr, lo, hi)
        quicksort(arr, lo, pivot_index - 1)
        quicksort(arr, pivot_index + 1, hi)

def _partition(arr, lo, hi):
    rand_index = random.randint(lo, hi)   # randomize to avoid worst case on sorted input
    arr[rand_index], arr[hi] = arr[hi], arr[rand_index]
    pivot = arr[hi]
    i = lo
    for j in range(lo, hi):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[hi] = arr[hi], arr[i]
    return i`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Quicksort with a fixed pivot choice (always first or always last element) hits its O(n²) worst case on already-sorted or reverse-sorted input — exactly the kind of "clean" input a naive test suite is likely to include. Always randomize the pivot, or use median-of-three, to make the worst case a near-impossible coincidence rather than a predictable failure mode.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Randomization does **not** save the partition above from many duplicate keys. On an array where every element is equal, this two-way (Lomuto) partition puts everything on one side every time, so it degrades to O(n²) regardless of the pivot. Production quicksorts use a **three-way** ("Dutch national flag") partition or a Hoare-style partition that splits equal keys evenly.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'three-way partition quicksort -- linear on all-equal input',
              code: `import random

def quicksort_3way(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    while lo < hi:
        pivot = a[random.randint(lo, hi)]
        lt, i, gt = lo, lo, hi
        # invariant: a[lo:lt] < pivot, a[lt:i] == pivot, a[gt+1:hi+1] > pivot
        while i <= gt:
            if a[i] < pivot:
                a[lt], a[i] = a[i], a[lt]; lt += 1; i += 1
            elif a[i] > pivot:
                a[i], a[gt] = a[gt], a[i]; gt -= 1     # don't advance i: new a[i] unseen
            else:
                i += 1
        # recurse into the smaller side, loop on the larger -> O(log n) stack
        if lt - lo < hi - gt:
            quicksort_3way(a, lo, lt - 1)
            lo = gt + 1
        else:
            quicksort_3way(a, gt + 1, hi)
            hi = lt - 1`,
            },
            {
              type: 'heading',
              text: 'What standard libraries actually use',
            },
            {
              type: 'table',
              headers: ['Runtime', 'Algorithm (broadly)', 'Stable?'],
              rows: [
                ['Python `list.sort` / `sorted`', 'Timsort-family adaptive merge sort (runs detection + galloping merges)', 'Yes'],
                ['Java `Arrays.sort` on primitives', 'Dual-pivot quicksort', 'No (irrelevant for primitives)'],
                ['Java `Arrays.sort` on objects, `Collections.sort`', 'TimSort', 'Yes'],
                ['JavaScript `Array.prototype.sort`', 'Required to be stable since ES2019; V8 uses TimSort', 'Yes'],
                ['C++ `std::sort` / `std::stable_sort`', 'Typically introsort (quicksort → heapsort fallback) / merge sort', 'No / Yes'],
                ['Go `sort` / `slices.Sort`', 'Pattern-defeating quicksort (pdqsort)', 'No (`sort.Stable`/`slices.SortStableFunc` are)'],
              ],
            },
            {
              type: 'p',
              text: 'The trend is clear: real sorts are **hybrids**. They switch to insertion sort for tiny subarrays (low overhead, great cache behavior), detect already-sorted runs (Timsort is O(n) on sorted input), and guard quicksort with a depth limit that falls back to heapsort (introsort, pdqsort) so the worst case stays O(n log n). Knowing *why* each piece exists is more valuable than memorizing any one implementation.',
            },
            {
              type: 'heading',
              text: 'Quickselect: the k-th smallest in expected O(n)',
            },
            {
              type: 'code',
              language: 'python',
              title: 'quickselect -- recurse into only ONE side of the partition',
              code: `import random

def kth_smallest(nums, k):            # k is 1-based
    a = list(nums)
    lo, hi, target = 0, len(a) - 1, k - 1
    while True:
        pivot = a[random.randint(lo, hi)]
        lt, i, gt = lo, lo, hi          # three-way partition, as above
        while i <= gt:
            if a[i] < pivot:
                a[lt], a[i] = a[i], a[lt]; lt += 1; i += 1
            elif a[i] > pivot:
                a[i], a[gt] = a[gt], a[i]; gt -= 1
            else:
                i += 1
        if target < lt:
            hi = lt - 1
        elif target > gt:
            lo = gt + 1
        else:
            return pivot                 # target lands in the "equal" block`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Quickselect\'s expected cost is n + n/2 + n/4 + ... = O(n) because it discards one side each round; the worst case is still O(n²) with unlucky pivots. Median-of-medians guarantees O(n) worst case but with a large constant — mention it, rarely implement it. For "top K" in an interview, a size-K heap (O(n log K), streaming-friendly) and quickselect (O(n) expected, needs all data in memory, mutates a copy) are the two answers to compare.',
            },
          ],
        },
        {
          id: 'non-comparison-sorts',
          title: 'Non-Comparison Sorts: Counting and Radix Sort',
          summary:
            'Comparison-based sorting has a proven Ω(n log n) lower bound — but counting sort and radix sort sidestep that bound entirely by never comparing elements, achieving O(n) when the value range is small enough.',
          keyPoints: [
            'Every comparison-based sort (merge sort, quicksort, heap sort) is proven to require at least Ω(n log n) comparisons in the worst case — this is a fundamental limit, not an implementation weakness.',
            '**Counting sort** sidesteps that bound by never comparing elements at all: it counts occurrences of each value directly, achieving O(n + k) where k is the range of possible values.',
            '**Radix sort** extends this to larger ranges by sorting digit-by-digit (using counting sort as a subroutine for each digit), achieving O(d × (n + k)) where d is the number of digits.',
            'The catch: both require the data to have a small, known, ideally-integer range — they do not generalize to arbitrary comparable objects the way merge sort or quicksort do.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Input["input: [4, 2, 2, 8, 3, 3, 1]"]
        direction LR
        I0["4"] --- I1["2"] --- I2["2"] --- I3["8"] --- I4["3"] --- I5["3"] --- I6["1"]
    end
    subgraph Counts["counts[value] = how many times it appeared"]
        direction LR
        C1["idx1: 1"] --- C2["idx2: 2"] --- C3["idx3: 2"] --- C4["idx4: 1"] --- C8["idx8: 1"]
    end
    subgraph Output["output: read counts left to right"]
        direction LR
        O0["1"] --- O1["2"] --- O2["2"] --- O3["3"] --- O4["3"] --- O5["4"] --- O6["8"]
    end
    Input --> Counts --> Output`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'counting sort -- O(n + k)',
              code: `def counting_sort(arr, max_value):
    counts = [0] * (max_value + 1)
    for num in arr:
        counts[num] += 1
    result = []
    for value, count in enumerate(counts):
        result.extend([value] * count)
    return result

# O(n + k) time and space, where k = max_value.
# Great when k is O(n) or smaller; terrible if k is, say, 10^9
# with only 100 actual elements (huge wasted space/time).`,
            },
            {
              type: 'p',
              text: 'The version above only works for bare integers, because it rebuilds values from counts and discards the original records. Radix sort needs the **stable** variant: compute prefix sums of the counts so each key knows where its block ends in the output, then place records right-to-left. Stability is not optional — LSD radix sort sorts by the least significant digit first, and each later pass relies on earlier passes\' order surviving among equal digits.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'stable counting sort by digit + LSD radix sort (non-negative ints)',
              code: `def counting_sort_by_digit(arr, exp):
    output = [0] * len(arr)
    counts = [0] * 10
    for x in arr:
        counts[(x // exp) % 10] += 1
    for d in range(1, 10):
        counts[d] += counts[d - 1]          # counts[d] = end position of digit d's block
    for x in reversed(arr):                 # right-to-left keeps equal digits stable
        d = (x // exp) % 10
        counts[d] -= 1
        output[counts[d]] = x
    return output

def radix_sort(arr):
    if not arr:
        return arr
    exp = 1
    while max(arr) // exp > 0:              # one pass per decimal digit
        arr = counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

# O(d * (n + b)) time with base b = 10 and d digits; O(n + b) extra space.
# Negative numbers need an offset (or a separate pass for the sign).`,
            },
            {
              type: 'table',
              headers: ['Algorithm', 'Time', 'Extra space', 'Stable?', 'Requires'],
              rows: [
                ['Counting sort', 'O(n + k)', 'O(n + k)', 'Yes (prefix-sum version)', 'Integer keys in a small range 0..k'],
                ['Radix sort (LSD)', 'O(d · (n + b))', 'O(n + b)', 'Yes', 'Fixed-width keys: integers, fixed-length strings'],
                ['Bucket sort', 'O(n) expected', 'O(n)', 'Depends on bucket sort', 'Roughly uniformly distributed values over a known range'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Radix sort is "linear" only when the number of digits d is treated as a constant. For n distinct w-bit integers, d is at least log n digits in base 2 — so with arbitrary keys the practical gap versus O(n log n) comparison sorts is smaller than the asymptotics suggest, and cache-unfriendly scattered writes often make well-tuned quicksort competitive. Reach for these sorts when the key range is genuinely small or fixed-width.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Counting/radix sort don\'t contradict the Ω(n log n) comparison lower bound — they simply don\'t play that game at all: they never ask "is A bigger than B?", so the lower bound (which is specifically a bound on comparison-based sorts) does not apply to them. This is a favorite "explain why this isn\'t a contradiction" interview question.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Reach for counting/radix sort when: the values are integers (or map cleanly to integers), and the range of values is not dramatically larger than n. Sorting a million single-digit exam scores is a perfect fit; sorting a million arbitrary 64-bit hashes is not (k would dwarf n).',
            },
          ],
        },
        {
          id: 'string-matching-kmp-rolling-hash',
          title: 'String Matching: KMP, Rolling Hash, and Palindromes',
          summary:
            'Naive substring search is O(n·m); KMP guarantees O(n + m) by never re-examining text characters, Rabin-Karp gets expected O(n + m) with a rolling hash, and Manacher or expand-around-center handle palindromes without cubic checks.',
          keyPoints: [
            '**Naive search** slides the pattern one position at a time and re-compares from scratch: O(n·m) worst case (think `aaaa...ab` searching for `aaab`).',
            '**KMP** precomputes a failure function (`lps[i]` = length of the longest proper prefix of `pattern[:i+1]` that is also its suffix) so that after a mismatch the pattern shifts without ever moving the text pointer backward. O(n + m) time, O(m) space.',
            '**Rabin-Karp** compares hashes of windows instead of strings. A **rolling hash** updates in O(1) when the window slides by one character. Expected O(n + m); worst case O(n·m) if many hash collisions force verification. Natural for searching many patterns of the same length.',
            'In practice, language built-ins (`str.find`, `String.indexOf`) are heavily optimized — implement KMP to show you understand the idea, not because you should hand-roll it in production.',
            'For palindromes, **expand around center** is O(n²) and trivial to write; **Manacher\'s algorithm** gets O(n) but is rarely expected. DP is also O(n²) time and space — usually the worse trade.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The key idea of KMP: when a mismatch occurs after matching j characters, you already *know* the last j characters of the text (they equal `pattern[:j]`). The failure function tells you the longest prefix of the pattern that is also a suffix of what you just matched — so you can resume matching from that prefix instead of restarting. The text index `i` never decreases, so the matching phase is O(n); the failure-function construction is the same trick applied to the pattern against itself, O(m).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'KMP: failure function and search -- O(n + m)',
              code: `def build_lps(p):
    lps = [0] * len(p)
    k = 0                              # length of the current matched prefix
    for i in range(1, len(p)):
        while k and p[i] != p[k]:
            k = lps[k - 1]             # fall back to the next-best prefix
        if p[i] == p[k]:
            k += 1
        lps[i] = k
    return lps

def kmp_search(text, p):
    if not p:
        return 0
    lps = build_lps(p)
    k = 0
    for i, ch in enumerate(text):
        while k and ch != p[k]:
            k = lps[k - 1]             # text pointer i never moves backward
        if ch == p[k]:
            k += 1
        if k == len(p):
            return i - k + 1           # first match; to find all, set k = lps[k-1]
    return -1

# build_lps("ababaca") -> [0, 0, 1, 2, 3, 0, 1]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'Rabin-Karp with a polynomial rolling hash',
              code: `def rabin_karp(text, p, base=256, mod=1_000_000_007):
    n, m = len(text), len(p)
    if m == 0:
        return 0
    if m > n:
        return -1
    high = pow(base, m - 1, mod)               # weight of the outgoing character
    ph = th = 0
    for i in range(m):
        ph = (ph * base + ord(p[i])) % mod
        th = (th * base + ord(text[i])) % mod
    for i in range(n - m + 1):
        if ph == th and text[i:i + m] == p:    # verify to rule out collisions
            return i
        if i < n - m:
            th = ((th - ord(text[i]) * high) * base + ord(text[i + m])) % mod
    return -1`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Two classic rolling-hash bugs: forgetting to **verify** on a hash match (hashes can collide, so equality of hashes is necessary, not sufficient), and negative intermediates in languages where `%` can return negative values — add `mod` before taking the remainder in C/C++/Java/JavaScript. Use a large prime modulus (or two) and, against adversarial inputs, a randomized base.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'longest palindromic substring: expand around each center -- O(n^2), O(1) space',
              code: `def longest_palindrome(s):
    if not s:
        return ""
    best_l = best_r = 0
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return l + 1, r - 1                    # bounds of the palindrome found
    for c in range(len(s)):
        for l, r in (expand(c, c), expand(c, c + 1)):   # odd and even centers
            if r - l > best_r - best_l:
                best_l, best_r = l, r
    return s[best_l:best_r + 1]`,
            },
            {
              type: 'table',
              headers: ['Task', 'Tool', 'Complexity'],
              rows: [
                ['Find one pattern in text', 'KMP / Z-function / built-in `find`', 'O(n + m)'],
                ['Find many patterns at once', 'Aho-Corasick (a trie plus failure links)', 'O(n + total pattern length + matches)'],
                ['Compare many equal-length substrings', 'Rolling hash (Rabin-Karp)', 'O(1) per window after O(n) setup'],
                ['Repeated substring / longest duplicate substring', 'Rolling hash + binary search on length', 'O(n log n) expected'],
                ['Prefix lookups over a dictionary', 'Trie', 'O(L) per query'],
                ['Longest palindromic substring', 'Expand around center, or Manacher', 'O(n²) / O(n)'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The **Z-function** (`z[i]` = longest common prefix of the string and its suffix starting at i) solves the same problems as KMP and many people find it easier to derive on the spot: search for `pattern + "#" + text` and look for `z[i] == len(pattern)`.',
            },
          ],
        },
        {
          id: 'binary-search-and-variants',
          title: 'Binary Search and Its Variants',
          summary:
            'Binary search halves the remaining search space with every comparison for O(log n) on sorted data — the core template extends far beyond "find exact value" to rotated arrays and first/last-occurrence queries.',
          keyPoints: [
            'The invariant that makes binary search correct: at every step, the answer (if it exists) is guaranteed to still be within `[left, right]` — every comparison must preserve that invariant, or the algorithm is subtly broken.',
            'A classic off-by-one trap: using `mid = (left + right) // 2` with `while left < right` vs `while left <= right` changes how `left`/`right` must be updated (`mid` vs `mid ± 1`) — mixing conventions is the single most common binary search bug.',
            '**Search in a rotated sorted array**: at every step, at least one half of `[left, mid]` or `[mid, right]` is guaranteed to be normally sorted — determine which half is sorted, then check if the target lies within that half\'s range.',
            '**Find first/last occurrence** (a "lower bound"/"upper bound" search): instead of stopping at the first match, keep narrowing toward the boundary — this is also the technique behind "binary search on the answer" for optimization problems.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    S1["[1,3,5,7,9,11,13]  target=11<br/>left=0 right=6 mid=3 (val 7) -- 7<11, search right"]
    S2["[7,9,11,13]  left=4 right=6 mid=5 (val 11) -- found!"]
    S1 --> S2`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'the classic template',
              code: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2   # avoids overflow in other languages
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'search in a rotated sorted array',
              code: `def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:       # left half is normally sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:                              # right half is normally sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'find the first occurrence (leftmost) of a target',
              code: `def find_first(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            result = mid
            right = mid - 1   # keep searching left for an even earlier match
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Binary search bugs are almost always off-by-one errors, not logic errors — an infinite loop from `mid = left` never advancing, or an out-of-bounds access from an unguarded `mid ± 1`. Pick one consistent template, verify it on a 1-element and 2-element array by hand, and reuse that exact template every time rather than re-deriving the boundaries under interview pressure.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The rotated-array search above assumes **distinct** values. With duplicates, `nums[left] == nums[mid] == nums[right]` makes it impossible to tell which half is sorted, so you can only shrink by one (`left += 1`), and the worst case degrades to O(n). Always ask "can there be duplicates?" before committing to the template.',
            },
            {
              type: 'heading',
              text: 'A single reusable template: find the first index where a predicate is true',
            },
            {
              type: 'p',
              text: 'Almost every binary-search problem reduces to one question: given a monotonic predicate `ok(i)` that is False for a prefix and True afterwards, find the first True. Lower bound, upper bound, insertion point, and "binary search on the answer" are all this one loop with a different predicate. Use a half-open range `[lo, hi)` where `hi` itself is a valid "answer if nothing earlier works" sentinel, and the loop invariant is: **everything before `lo` is False, everything from `hi` on is True**.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'first-true template (half-open) and what it gives you for free',
              code: `def first_true(lo, hi, ok):
    # invariant: ok is False on [.., lo) and True on [hi, ..)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if ok(mid):
            hi = mid          # mid might be the answer -> keep it
        else:
            lo = mid + 1      # mid is definitely too small -> discard it
    return lo                 # == hi; may equal the sentinel hi

def lower_bound(nums, target):        # first index with nums[i] >= target
    return first_true(0, len(nums), lambda i: nums[i] >= target)

def upper_bound(nums, target):        # first index with nums[i] > target
    return first_true(0, len(nums), lambda i: nums[i] > target)

# count of target = upper_bound - lower_bound.
# Python's bisect.bisect_left / bisect_right are exactly these two functions.`,
            },
            {
              type: 'heading',
              text: 'Binary search on the answer',
            },
            {
              type: 'p',
              text: 'When the problem asks for the smallest/largest value of some quantity subject to a feasibility condition, and feasibility is **monotonic** (if capacity C suffices, any larger capacity also suffices), you do not search an array — you search the range of possible answers, with a greedy O(n) check as the predicate. Total cost: O(n log(range)).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'capacity to ship packages within D days -- search over the answer',
              code: `def ship_within_days(weights, days):
    def can_ship(capacity):
        needed, load = 1, 0
        for w in weights:
            if load + w > capacity:       # start a new day
                needed += 1
                load = 0
            load += w
        return needed <= days

    lo = max(weights)                    # must fit the heaviest package
    hi = sum(weights)                    # one day always works
    return first_true(lo, hi, can_ship)  # smallest feasible capacity`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Recognition cues for binary search on the answer: "minimize the maximum" or "maximize the minimum" (split array largest sum, aggressive cows, Koko eating bananas), "smallest X such that..." with a cheap yes/no check, or a floating-point answer (search a real interval until the width falls below epsilon, or for a fixed ~100 iterations).',
            },
          ],
        },
        {
          id: 'dynamic-programming-fundamentals',
          title: 'Dynamic Programming: Optimal Substructure and Overlapping Subproblems',
          summary:
            'DP applies precisely when a problem has optimal substructure (an optimal solution is built from optimal solutions to subproblems) and overlapping subproblems (naive recursion recomputes the same subproblem repeatedly) — memoization and tabulation are two ways to exploit both.',
          keyPoints: [
            '**Optimal substructure**: the optimal solution to a problem can be constructed from optimal solutions to its subproblems — without this property, DP cannot help at all, no matter how much repeated work exists.',
            '**Overlapping subproblems**: a naive recursive solution calls itself on the *same* inputs many times — without this property, memoization has nothing to cache and provides no speedup (e.g., merge sort\'s subproblems never overlap, so memoizing it would help nothing).',
            '**Memoization (top-down)**: keep the natural recursive structure, but cache each subproblem\'s result the first time it is computed — subsequent calls with the same input return instantly from the cache.',
            '**Tabulation (bottom-up)**: build up the answer iteratively from the smallest subproblems to the largest, storing every intermediate result in a table — avoids recursion overhead and stack depth limits entirely.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    F5["fib(5)"] --> F4a["fib(4)"]
    F5 --> F3a["fib(3)"]
    F4a --> F3b["fib(3)"]
    F4a --> F2a["fib(2)"]
    F3a --> F2b["fib(2)"]
    F3a --> F1a["fib(1)"]
    F3b --> F2c["fib(2)"]
    F3b --> F1b["fib(1)"]
    classDef repeat fill:#fdd,stroke:#933
    class F3b,F2a,F2b,F2c repeat`,
            },
            {
              type: 'p',
              text: 'The diagram above is the entire case for DP in one picture: computing `fib(5)` naively recomputes `fib(3)` twice and `fib(2)` three times — and this duplication grows exponentially with n, which is exactly why naive recursive Fibonacci is O(2ⁿ) despite there being only n *distinct* subproblems.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'naive recursion -> memoization (top-down) -> tabulation (bottom-up)',
              code: `# Naive: O(2^n) time -- recomputes every subproblem from scratch, repeatedly
def fib_naive(n):
    if n <= 1:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

# Memoized (top-down): O(n) time, O(n) space (cache + recursion stack)
def fib_memo(n, cache=None):
    if cache is None:
        cache = {}
    if n <= 1:
        return n
    if n in cache:
        return cache[n]
    cache[n] = fib_memo(n - 1, cache) + fib_memo(n - 2, cache)
    return cache[n]

# Tabulated (bottom-up): O(n) time, O(1) space -- no recursion at all
def fib_tabulation(n):
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1`,
            },
            {
              type: 'table',
              headers: ['', 'Memoization (top-down)', 'Tabulation (bottom-up)'],
              rows: [
                ['Structure', 'Natural recursion + a cache', 'Iterative loop filling a table'],
                ['Computes', 'Only the subproblems actually needed', 'Every subproblem up to n, even unused ones'],
                ['Space overhead', 'Cache + recursion call stack', 'Just the table (often reducible to O(1) with rolling variables)'],
                ['Risk', 'Stack overflow on deep recursion', 'None — but can be less intuitive to derive the fill order'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'DP is not "memoize any recursion" — it specifically requires **overlapping** subproblems. If you find yourself memoizing a divide-and-conquer algorithm like merge sort, notice that every subproblem is called exactly once, so the cache never gets a hit and buys you nothing but wasted memory.',
            },
          ],
        },
        {
          id: 'dp-in-practice',
          title: 'Dynamic Programming in Practice: The State-Recurrence Framework',
          summary:
            'A repeatable four-step framework — define the state, write the recurrence, identify base cases, decide computation order — turns "this feels like DP" into an actual, correct solution, worked through with coin change and longest common subsequence.',
          keyPoints: [
            'Step 1: **define the state** — what does `dp[i]` (or `dp[i][j]`) actually represent in plain English? Getting this wrong makes every later step impossible to reason about.',
            'Step 2: **write the recurrence** — how does the state at `i` relate to smaller states? This is usually "try every choice at this step, and take the best."',
            'Step 3: **identify base cases** — the smallest states that can be answered directly, with no further recursion needed.',
            'Step 4: **decide computation order** — for tabulation, states must be filled in an order where every state\'s dependencies are already computed (usually smallest-to-largest index).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    A["1. Define the state<br/>what does dp[i] mean?"] --> B["2. Write the recurrence<br/>dp[i] in terms of smaller states"]
    B --> C["3. Identify base cases<br/>the smallest states, answered directly"]
    C --> D["4. Decide computation order<br/>fill dependencies before dependents"]`,
            },
            {
              type: 'heading',
              text: 'Worked example 1: Coin Change (minimum coins to make an amount)',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**State**: `dp[a]` = the minimum number of coins needed to make amount `a`.',
                '**Recurrence**: `dp[a] = 1 + min(dp[a - c] for c in coins if c <= a)` — try using each coin last, and take the best of those options.',
                '**Base case**: `dp[0] = 0` — zero coins needed to make amount zero.',
                '**Order**: compute `dp[a]` for a = 1, 2, ..., target, in increasing order, since each depends only on smaller amounts.',
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'coin change -- bottom-up tabulation',
              code: `def coin_change(coins, amount):
    INF = float('inf')
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1

# Time: O(amount * len(coins)), Space: O(amount)`,
            },
            {
              type: 'heading',
              text: 'Worked example 2: Longest Common Subsequence (LCS)',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**State**: `dp[i][j]` = length of the LCS of `text1[:i]` and `text2[:j]` (the first i and first j characters, respectively).',
                '**Recurrence**: if `text1[i-1] == text2[j-1]`, the matching characters extend the best subsequence found so far: `dp[i][j] = dp[i-1][j-1] + 1`. Otherwise, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` — skip a character from whichever string helps more.',
                '**Base case**: `dp[0][j] = dp[i][0] = 0` — an empty string has an LCS of length 0 with anything.',
                '**Order**: fill row by row (or column by column) — `dp[i][j]` only depends on `dp[i-1][j-1]`, `dp[i-1][j]`, and `dp[i][j-1]`, all already computed if filled in row-major order.',
              ],
            },
            {
              type: 'table',
              headers: ['dp[i][j]', "'' ", "'A'", "'C'", "'E'"],
              rows: [
                ["''", '0', '0', '0', '0'],
                ["'A'", '0', '1', '1', '1'],
                ["'B'", '0', '1', '1', '1'],
                ["'C'", '0', '1', '2', '2'],
                ["'D'", '0', '1', '2', '2'],
                ["'E'", '0', '1', '2', '3'],
              ],
            },
            {
              type: 'p',
              text: 'The table above fills in the LCS length of `"ABCDE"` against `"ACE"` — reading the bottom-right cell gives the answer, 3 (the subsequence `"ACE"` itself). Each cell only ever looks up, left, and diagonal-up-left, which is exactly why filling row by row left-to-right always has every dependency ready.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'longest common subsequence -- bottom-up tabulation',
              code: `def lcs_length(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

# Time: O(m * n), Space: O(m * n) -- reducible to O(min(m, n)) with rolling rows`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'This four-step framework applies to essentially every DP problem you will encounter: 0/1 knapsack, edit distance, longest increasing subsequence, house robber, partition equal subset sum. When stuck, explicitly write out "state = ...", "recurrence = ...", "base case = ...", "order = ..." on the whiteboard before writing any code — it is the single highest-leverage habit for DP interviews.',
            },
            {
              type: 'heading',
              text: 'Worked example 3: 0/1 knapsack and the reverse-iteration trick',
            },
            {
              type: 'p',
              text: 'The 2D table `dp[i][w]` only ever reads row `i-1`, so one row is enough — but the iteration direction becomes a correctness issue. Iterating capacity **downward** guarantees `dp[w - wt]` still holds the previous item\'s value when you read it. Iterating upward would let the same item be used repeatedly, silently turning 0/1 knapsack into *unbounded* knapsack (which is, in fact, exactly what you want for coin change with unlimited coins).',
            },
            {
              type: 'code',
              language: 'python',
              title: '0/1 knapsack with a 1D array -- O(n * W) time, O(W) space',
              code: `def knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)          # dp[w] = best value with capacity w
    for wt, val in zip(weights, values):
        for w in range(capacity, wt - 1, -1):   # DOWNWARD: each item used at most once
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[capacity]`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '"O(n · W)" is **pseudo-polynomial**: it is polynomial in the numeric value of W, not in the number of bits needed to write W down. Knapsack is NP-hard in general, and the DP does not contradict that — a capacity of 10^18 makes the table impossible. State this precisely when asked; it is a common senior-level probe.',
            },
            {
              type: 'heading',
              text: 'Worked example 4: Longest Increasing Subsequence in O(n log n)',
            },
            {
              type: 'p',
              text: 'The straightforward DP (`dp[i]` = LIS ending at i, minimized over all j < i) is O(n²). The faster method keeps `tails[k]` = the smallest possible tail value of any increasing subsequence of length k+1 seen so far. `tails` is always sorted, so each new number replaces the first tail that is ≥ it (binary search) or extends the array. Note that `tails` is **not** itself a valid subsequence — only its length is the answer.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'LIS length -- patience-style tails array',
              code: `from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)    # bisect_left => strictly increasing LIS
        if i == len(tails):
            tails.append(x)          # extends the longest subsequence found
        else:
            tails[i] = x             # a smaller tail for length i+1 is strictly better
    return len(tails)`,
            },
            {
              type: 'heading',
              text: 'Worked example 5: Edit distance',
            },
            {
              type: 'code',
              language: 'python',
              title: 'edit distance (Levenshtein) with a rolling row -- O(m*n) time, O(n) space',
              code: `def edit_distance(a, b):
    m, n = len(a), len(b)
    prev = list(range(n + 1))                 # dp[0][j] = j insertions
    for i in range(1, m + 1):
        curr = [i] + [0] * n                  # dp[i][0] = i deletions
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                curr[j] = prev[j - 1]         # characters match: no cost
            else:
                curr[j] = 1 + min(prev[j - 1],   # replace
                                  prev[j],       # delete from a
                                  curr[j - 1])   # insert into a
        prev = curr
    return prev[n]`,
            },
            {
              type: 'heading',
              text: 'DP pattern families',
            },
            {
              type: 'table',
              headers: ['Family', 'State shape', 'Examples'],
              rows: [
                ['Linear / 1D', '`dp[i]` over a prefix or position', 'House robber, climbing stairs, decode ways, max subarray (Kadane)'],
                ['Knapsack (include/exclude)', '`dp[i][capacity]` or 1D by capacity', '0/1 knapsack, subset sum, partition equal subset, coin change (combinations vs minimum)'],
                ['Two sequences', '`dp[i][j]` over prefixes of two strings', 'LCS, edit distance, interleaving string, regex/wildcard matching'],
                ['Interval', '`dp[l][r]` over a substring/range', 'Palindromic substrings, burst balloons, matrix-chain multiplication'],
                ['Grid / paths', '`dp[r][c]`', 'Unique paths, minimum path sum, maximal square'],
                ['Bitmask', '`dp[mask][last]`', 'Travelling salesman (n ≤ ~20), assignment problems'],
                ['Tree DP', '`dp[node][state]` computed post-order', 'House robber III, diameter-style problems, rerooting'],
                ['State machine', '`dp[i][state]` with transitions', 'Best time to buy and sell stock with cooldown / k transactions'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Coin change counts depend on loop **order**. To count *combinations* (1+2 and 2+1 are the same), put the coins in the outer loop and amounts in the inner loop. Swapping them counts *permutations*. For the minimum-coins version the order does not matter, which is why the two variants are so easy to confuse.',
            },
          ],
        },
        {
          id: 'greedy-algorithms',
          title: 'Greedy Algorithms: When Local Optimal Gives Global Optimal',
          summary:
            'A greedy algorithm makes the locally optimal choice at each step and never reconsiders it — this only produces a globally optimal answer when the problem has the greedy-choice property, and proving that (rather than just hoping) is the actual skill being tested.',
          keyPoints: [
            'A greedy algorithm commits to the best-looking choice at each step and never backtracks — much simpler and faster than DP or backtracking, when it is actually correct.',
            'Greedy works when the problem has the **greedy-choice property** (a locally optimal choice is always part of *some* globally optimal solution) combined with **optimal substructure**.',
            'Classic correct greedy examples: activity/interval selection (always pick the activity that finishes earliest), Huffman coding, Dijkstra\'s algorithm (with non-negative weights), fractional knapsack.',
            'Classic greedy **failure**: 0/1 knapsack — greedily taking the highest value-per-weight item can lock in a suboptimal combination, because unlike the fractional version, you cannot take a partial item to "top off" the remaining capacity exactly; this is precisely why 0/1 knapsack needs DP instead.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    T["timeline"] --- A1["Activity A: 1-4"]
    T --- A2["Activity B: 3-5"]
    T --- A3["Activity C: 0-6"]
    T --- A4["Activity D: 5-7"]
    T --- A5["Activity E: 8-9"]
    Note["sorted by finish time: A(4), B(5), D(7), E(9), C(6 excluded, overlaps)<br/>greedy picks A, then D (B overlaps A), then E -> 3 activities"]`,
            },
            {
              type: 'table',
              headers: ['Problem', 'Does greedy work?', 'Why'],
              rows: [
                ['Activity selection (max non-overlapping intervals)', 'Yes', 'Picking the earliest-finishing activity always leaves the most room for future choices — provable by an exchange argument'],
                ['Fractional knapsack', 'Yes', 'Items can be split, so always taking the highest value/weight ratio first is never wrong'],
                ['0/1 knapsack', 'No', 'Items can\'t be split — the highest ratio item might not fit alongside the true optimal combination, and greedy can\'t undo an earlier choice'],
                ['Dijkstra\'s shortest path', 'Yes (non-negative weights only)', 'Once a vertex is popped as the current minimum, no future edge can produce a shorter path to it — this breaks with negative weights'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'activity selection -- classic correct greedy',
              code: `def max_non_overlapping_activities(intervals):
    # sort by finish time -- the greedy choice that provably works
    intervals.sort(key=lambda pair: pair[1])
    count = 0
    last_finish = float('-inf')
    for start, finish in intervals:
        if start >= last_finish:
            count += 1
            last_finish = finish
    return count

# O(n log n), dominated by the sort`,
            },
            {
              type: 'p',
              text: 'Why sort by finish time and not start time or duration? An **exchange argument** proves it: take any optimal solution, and if its first-chosen activity doesn\'t finish earliest, swap it for the one that does — the swap can only free up more room for subsequent choices, never less, so the solution stays optimal (or improves). This kind of exchange-argument reasoning is exactly what interviewers want to hear when they ask "why does greedy work here?" — a plausible-sounding heuristic is not the same as a proof.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The most common greedy mistake in interviews is not writing a wrong greedy algorithm — it is failing to justify *why* it works, or worse, applying greedy to a problem (like 0/1 knapsack) where it provably fails on a specific counterexample. Always be ready to either sketch an exchange argument for why greedy is safe, or to name a concrete input where the greedy choice leads to a suboptimal answer.',
            },
            {
              type: 'heading',
              text: 'A counterexample to keep in your pocket: coin change',
            },
            {
              type: 'p',
              text: 'With US denominations (1, 5, 10, 25), always taking the largest coin that fits is optimal. With coins {1, 3, 4} and amount 6, greedy picks 4 + 1 + 1 (three coins) while the optimum is 3 + 3 (two coins). Greedy works only for special "canonical" coin systems; for arbitrary denominations you need the DP from the previous topic. A single 10-second counterexample like this is worth more in an interview than any amount of hand-waving.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'jump game: greedy farthest-reach in O(n), O(1) space',
              code: `def can_jump(nums):
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False               # index i is unreachable
        farthest = max(farthest, i + jump)
    return True

def min_jumps(nums):
    jumps = cur_end = farthest = 0
    for i in range(len(nums) - 1):     # no need to jump from the last index
        farthest = max(farthest, i + nums[i])
        if i == cur_end:               # finished the current "BFS level"
            jumps += 1
            cur_end = farthest
    return jumps                       # assumes the end is reachable`,
            },
            {
              type: 'table',
              headers: ['Greedy strategy', 'Typical problems', 'Proof technique'],
              rows: [
                ['Sort by finish time, take what fits', 'Activity selection, non-overlapping intervals, minimum arrows to burst balloons', 'Exchange argument'],
                ['Sort by ratio / deadline, take best first', 'Fractional knapsack, job sequencing with deadlines', 'Exchange argument'],
                ['Always extend the frontier farthest', 'Jump game I/II, gas station, minimum taps to water a garden', 'Invariant: "reachable set is a prefix"'],
                ['Repeatedly merge the two cheapest', 'Huffman coding, connecting ropes (min-heap)', 'Greedy-choice + induction on the merged tree'],
                ['Cheapest safe edge', 'Kruskal, Prim', 'Cut property'],
                ['Stay ahead', 'Task scheduling, minimizing maximum lateness (earliest deadline first)', 'Show greedy is never behind optimal at any step'],
              ],
            },
          ],
        },
        {
          id: 'interval-problems',
          title: 'Interval Problems: Sorting, Merging, and Sweeping',
          summary:
            'Most interval questions collapse once you sort by start (or end) time: merging, inserting, finding overlaps, and counting the maximum number of simultaneous intervals all become a single pass — or a pass plus a min-heap.',
          keyPoints: [
            'First decision: **sort by start** (merge, insert, meeting rooms) or **sort by end** (maximum non-overlapping set, minimum removals) — the choice follows from what you are optimizing.',
            'After sorting by start, intervals that overlap with the running merged interval are exactly the consecutive ones with `start <= current_end`. Decide up front whether touching endpoints (`[1,2]` and `[2,3]`) count as overlapping.',
            'To count how many intervals overlap at the same time (meeting rooms II), either use a min-heap of end times or a **sweep line** over +1/−1 events — both O(n log n).',
            'The sort dominates: O(n log n) time. The scan itself is O(n).',
            'Edge cases that trip people: empty input, a single interval, one interval fully containing others, and identical intervals.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    I["intervals: [1,3] [8,10] [2,6] [15,18]"] --> S["sort by start:<br/>[1,3] [2,6] [8,10] [15,18]"]
    S --> M1["[1,3] + [2,6] overlap -> [1,6]"]
    M1 --> M2["[8,10] starts after 6 -> new interval"]
    M2 --> M3["[15,18] -> new interval"]
    M3 --> R["result: [1,6] [8,10] [15,18]"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'merge overlapping intervals -- O(n log n)',
              code: `def merge_intervals(intervals):
    if not intervals:
        return []
    intervals = sorted(intervals, key=lambda iv: iv[0])
    merged = [intervals[0][:]]
    for start, end in intervals[1:]:
        last = merged[-1]
        if start <= last[1]:                 # overlap (touching counts here)
            last[1] = max(last[1], end)      # max: the new one may be contained
        else:
            merged.append([start, end])
    return merged`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'minimum meeting rooms -- min-heap of end times',
              code: `import heapq

def min_meeting_rooms(intervals):
    heap = []                                # end times of rooms currently in use
    for start, end in sorted(intervals):
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)     # reuse the room that frees up first
        else:
            heapq.heappush(heap, end)        # all busy -> open a new room
    return len(heap)`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'the same answer with a sweep line over events',
              code: `def min_meeting_rooms_sweep(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))
    events.sort()           # at equal times, -1 sorts before +1: a meeting ending
                            # at t frees its room for one starting at t
    cur = best = 0
    for _, delta in events:
        cur += delta
        best = max(best, cur)
    return best`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'minimum intervals to remove so the rest do not overlap (sort by END)',
              code: `def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda iv: iv[1])
    kept, last_end = 0, float('-inf')
    for start, end in intervals:
        if start >= last_end:      # compatible with the last kept interval
            kept += 1
            last_end = end
    return len(intervals) - kept`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The sweep-line idea extends well beyond meetings: skyline problems, "car pooling" (capacity over time), and range-update problems all turn into "convert to +delta/−delta events, sort, scan." If coordinates are small and bounded, a difference array replaces the sort and gives O(n + range).',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Sorting by start and greedily keeping the first one is a classic wrong approach to "maximum non-overlapping intervals": a single long interval that starts first can block many short ones. Sort by **end time** for that problem; sort by **start time** for merging. If you cannot say why, reread the exchange argument in the greedy topic.',
            },
          ],
        },
        {
          id: 'backtracking',
          title: 'Backtracking: Systematic Search with Pruning',
          summary:
            'Backtracking explores a decision tree of choices, abandoning ("pruning") a branch the moment it can no longer lead to a valid solution — turning brute-force exponential enumeration into something that is still exponential in the worst case but often fast in practice.',
          keyPoints: [
            'Backtracking builds a solution incrementally, one choice at a time, and **undoes** ("backtracks") the most recent choice whenever it leads to a dead end or a full invalid solution.',
            'The key performance idea is **pruning**: checking a partial solution\'s validity as early as possible avoids exploring entire subtrees of choices that could never work out — this is what separates backtracking from pure brute-force enumeration.',
            'Canonical examples: N-Queens (place queens so none attack each other), generating all subsets/permutations/combinations, Sudoku solving, word search on a grid.',
            'Worst-case complexity is often still exponential (e.g., N-Queens is technically O(N!) in the absolute worst case) — the practical win from pruning is a constant-factor-feeling but often dramatic reduction in the actual number of branches explored.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Start["{} (choose element for index 0)"] --> A["include 1"]
    Start --> B["exclude 1"]
    A --> AA["include 1,2"]
    A --> AB["exclude 2 -> {1}"]
    B --> BA["include 2 -> {2}"]
    B --> BB["exclude 2 -> {}"]
    classDef leaf fill:#dfd,stroke:#393
    class AA,AB,BA,BB leaf`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'generating all subsets via backtracking',
              code: `def subsets(nums):
    result = []
    current = []

    def backtrack(start):
        result.append(current[:])          # record every partial state as a valid subset
        for i in range(start, len(nums)):
            current.append(nums[i])         # choose
            backtrack(i + 1)                 # explore
            current.pop()                    # un-choose (the "backtrack" step)

    backtrack(0)
    return result

# O(2^n) subsets total, each taking O(n) to copy -> O(n * 2^n)`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'N-Queens with pruning',
              code: `def solve_n_queens(n):
    solutions = []
    cols, diag1, diag2 = set(), set(), set()   # occupied columns/diagonals -- O(1) conflict checks
    placement = []

    def backtrack(row):
        if row == n:
            solutions.append(placement[:])
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue   # prune -- this column is under attack, skip immediately
            cols.add(col); diag1.add(row - col); diag2.add(row + col)
            placement.append(col)

            backtrack(row + 1)

            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)
            placement.pop()

    backtrack(0)
    return solutions`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The `cols`/`diag1`/`diag2` sets in N-Queens are the pruning: without them, checking whether a queen placement is safe against every previously placed queen costs O(n) per check, and the algorithm still has to explore invalid branches to discover they are invalid. With them, an unsafe column is rejected in O(1) *before* recursing into it at all — pruning the entire subtree beneath that choice.',
            },
            {
              type: 'heading',
              text: 'The choose / explore / un-choose template, and handling duplicates',
            },
            {
              type: 'p',
              text: 'Every backtracking solution has the same skeleton: a **state** (the partial solution), a set of **choices** available at this step, a **goal test**, and a **pruning rule**. The only things that vary between subsets, permutations, combination sum, and Sudoku are what a "choice" is and when to prune. When the input has duplicates and the output must be unique, the standard fix is: sort first, then skip a value if it equals the previous value **at the same recursion level** (`i > start and nums[i] == nums[i-1]`).',
            },
            {
              type: 'code',
              language: 'python',
              title: 'unique permutations of a list with duplicates',
              code: `def permute_unique(nums):
    nums.sort()
    result, path = [], []
    used = [False] * len(nums)

    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            # skip a duplicate unless its identical predecessor is already in the path
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack()
            path.pop()
            used[i] = False

    backtrack()
    return result

# Worst case O(n * n!) -- n! permutations, each O(n) to copy`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'combination sum: reuse allowed, pruning on the remaining target',
              code: `def combination_sum(candidates, target):
    candidates.sort()                       # sorting enables the early break below
    result, path = [], []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break                       # prune: every later candidate is larger too
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])   # i, not i+1: reuse allowed
            path.pop()

    backtrack(0, target)
    return result`,
            },
            {
              type: 'table',
              headers: ['Problem', 'Size of the search space', 'Typical pruning'],
              rows: [
                ['Subsets', '2ⁿ', 'None needed — every node is a valid answer'],
                ['Permutations', 'n!', 'Skip used elements; skip duplicate siblings'],
                ['Combination sum', 'Exponential in target / min(candidate)', 'Sort and break when a candidate exceeds the remainder'],
                ['N-Queens', 'Roughly n! placements before pruning, far fewer after', 'Column and diagonal sets; bitmask versions are faster still'],
                ['Sudoku', '9^(empty cells) naive', 'Row/col/box constraint sets; choose the most constrained cell first (MRV heuristic)'],
                ['Word search in a grid', '4^L paths from each cell', 'Mark visited in place and restore; stop at the first mismatch'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The two most common backtracking bugs: (1) appending `path` itself instead of a copy (`path[:]`), so every stored answer mutates into the final empty list; (2) forgetting to undo a side effect (a visited mark, a used flag, a set insertion) on the way out, so later branches see stale state. If your results look "almost right but missing some branches," check the un-choose step first.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Backtracking vs DP: if the same partial state (e.g., `(index, remaining)`) can be reached by many different paths **and you only need a count or an optimum**, memoize it — that is DP. If you must output every solution, enumeration is unavoidable and the output size itself bounds the runtime.',
            },
          ],
        },
        {
          id: 'bit-manipulation',
          title: 'Bit Manipulation Tricks for Interviews',
          summary:
            'A small set of bitwise tricks — XOR for finding a lone element, AND-with-(n-1) for clearing/counting bits, shifts for fast multiply/divide by powers of two — shows up repeatedly as an O(1)-space shortcut to problems that otherwise look like they need extra memory.',
          keyPoints: [
            '`x ^ x == 0` and `x ^ 0 == x`, and XOR is commutative/associative — this is the entire mechanism behind "find the single non-duplicate element" in O(n) time, O(1) space.',
            '`n & (n - 1)` clears the lowest set bit — repeating this until n becomes 0 counts the number of set bits (Brian Kernighan\'s algorithm), and running it once tells you whether n is a power of two (`n & (n - 1) == 0`).',
            '`x << k` and `x >> k` are equivalent to multiplying/dividing by `2^k` for non-negative integers — often faster than actual multiplication/division, though modern compilers usually do this optimization automatically.',
            'A **bitmask** (an integer where each bit represents "is item i included?") is a compact way to represent a subset — useful for DP over subsets when the number of items is small (roughly ≤ 20).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Mask["bitmask 0b01011 = subset {item0, item1, item3}"]
        direction LR
        B4["bit4: 0<br/>item4 out"] --- B3["bit3: 1<br/>item3 in"] --- B2["bit2: 0<br/>item2 out"] --- B1["bit1: 1<br/>item1 in"] --- B0["bit0: 1<br/>item0 in"]
    end`,
            },
            {
              type: 'table',
              headers: ['Trick', 'Expression', 'Use'],
              rows: [
                ['Check if bit i is set', '`n & (1 << i)`', 'Test membership in a bitmask'],
                ['Set bit i', '`n | (1 << i)`', 'Add an item to a bitmask'],
                ['Clear bit i', '`n & ~(1 << i)`', 'Remove an item from a bitmask'],
                ['Clear lowest set bit', '`n & (n - 1)`', 'Count set bits; check power of two'],
                ['Isolate lowest set bit', '`n & (-n)`', 'Fenwick tree (BIT) indexing'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'XOR trick: find the single number that appears once',
              code: `def single_number(nums):
    # every number appears twice except one -- XOR all of them together
    # and every pair cancels to 0, leaving only the lone number.
    result = 0
    for num in nums:
        result ^= num
    return result

# O(n) time, O(1) space -- a hash-set approach would also work but needs O(n) space`,
            },
            {
              type: 'code',
              language: 'python',
              title: "counting set bits with Brian Kernighan's algorithm",
              code: `def count_set_bits(n):
    count = 0
    while n:
        n &= (n - 1)   # clears the lowest set bit each iteration
        count += 1
    return count

# O(number of set bits), not O(number of total bits) -- faster than
# checking every bit position individually when n is sparse`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Bit tricks are a strong signal when a problem explicitly demands O(1) extra space and the input is otherwise integer-based — "find the missing/duplicate number," "find the single non-duplicate," and "subset enumeration for small n" are the interview-favorite triggers for reaching into this toolbox.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'two singles: XOR everything, then split by one differing bit',
              code: `def single_number_iii(nums):
    # every value appears twice except two distinct values a and b
    xor_all = 0
    for x in nums:
        xor_all ^= x                    # == a ^ b, nonzero because a != b
    low_bit = xor_all & -xor_all        # a bit where a and b differ
    a = 0
    for x in nums:
        if x & low_bit:                 # partition into two groups, a and b separated
            a ^= x
    return a, xor_all ^ a`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'enumerate all subsets of a small set with a bitmask',
              code: `def all_subsets(items):
    n = len(items)
    for mask in range(1 << n):                       # 2^n masks
        yield [items[i] for i in range(n) if mask >> i & 1]

# Iterate all submasks of a mask in O(2^popcount):
#   sub = mask
#   while sub:
#       ...use sub...
#       sub = (sub - 1) & mask
#   (handle the empty submask separately)`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Language semantics bite here. Python integers are arbitrary precision, so `~x` is `-x - 1` and negative numbers behave as if they have infinitely many leading 1 bits — fixed-width problems (32-bit complement, "reverse bits") need an explicit mask like `& 0xFFFFFFFF`. In JavaScript, bitwise operators silently convert operands to **32-bit signed integers**, so `1 << 31` is negative and values above 2³² − 1 are truncated; use `>>> 0` to get an unsigned view or `BigInt` for wider values. In Java and C/C++, `>>` on signed values is arithmetic (sign-extending) in practice while `>>>` (Java) is logical.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Operator precedence is a frequent source of silent bugs: in most languages `==` binds tighter than `&`, so `n & 1 == 0` parses as `n & (1 == 0)`. Always parenthesize: `(n & 1) == 0`. (Python is the exception — comparison binds looser than `&` — which makes it a bad place to build the habit.)',
            },
          ],
        },
        {
          id: 'interview-approach-and-patterns',
          title: 'How to Approach a Coding Interview Problem, End to End',
          summary:
            'A repeatable process — clarify, brute force, optimize, code, test, discuss complexity — turns an unfamiliar prompt into a structured conversation, and recognizing a small set of recurring patterns turns "I have no idea" into "this looks like two pointers."',
          keyPoints: [
            'Clarify constraints and edge cases **before** writing any code — input size, duplicates allowed, sorted or not, what to return on no valid answer.',
            'State a brute-force solution first, even a bad one — it establishes correctness as a baseline and often reveals the exact inefficiency worth optimizing.',
            'Optimize by naming the pattern the problem resembles, then implement it — narrate the complexity improvement out loud as you go, not just at the end.',
            'Always close with a manual test trace on a small example and an explicit statement of final time and space complexity — both are frequently graded even when not explicitly asked for.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    A["1. Clarify<br/>constraints & edge cases"] --> B["2. Brute force<br/>(establish correctness)"]
    B --> C["3. Identify the pattern<br/>& optimize"]
    C --> D["4. Code it,<br/>narrating out loud"]
    D --> E["5. Trace through<br/>a small example"]
    E --> F["6. State final<br/>time & space complexity"]`,
            },
            {
              type: 'heading',
              text: 'Pattern-recognition cheat sheet',
            },
            {
              type: 'table',
              headers: ['Signal in the prompt', 'Likely pattern'],
              rows: [
                ['Sorted array + find a pair/triplet matching a target', 'Two pointers, or binary search'],
                ['"Longest/shortest contiguous subarray/substring satisfying X"', 'Sliding window'],
                ['"Connected components" / "are these grouped together?"', 'Union-Find, or BFS/DFS'],
                ['"Fewest steps/moves" on an unweighted graph or grid', 'BFS'],
                ['"All possible combinations/subsets/permutations"', 'Backtracking'],
                ['"Maximum/minimum value subject to constraints," with choices that build on smaller choices', 'Dynamic programming'],
                ['"Top K" / "Kth largest/smallest"', 'Heap (priority queue), or quickselect'],
                ['A problem about prefixes of strings (autocomplete, word search)', 'Trie'],
                ['"Next greater/smaller element"', 'Monotonic stack'],
                ['Search space is monotonic ("if X works, so does anything bigger/smaller than X")', 'Binary search on the answer'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Clarify**: "Can the array be empty? Are there duplicates? Should I return indices or values? What if there\'s no valid answer — throw, return null, return -1?" Asking these signals real engineering instinct, not just algorithm recall.',
                '**Brute force first**: even an O(n²) or O(n³) solution stated clearly ("I could compare every pair") establishes a correctness baseline and gives you and the interviewer a shared reference point for the optimization that follows.',
                '**Narrate the optimization**: "This nested loop is checking membership, which is O(n) in a list — if I use a hash set instead, that check becomes O(1), so the whole thing drops from O(n²) to O(n)." This sentence alone often demonstrates more than the code itself.',
                '**Test with an example**: trace your own code by hand on a small, concrete input (including at least one edge case: empty input, single element, all-duplicates) before declaring it done — this catches off-by-one and edge-case bugs live, which is far better than an interviewer catching them for you.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewers consistently report that candidates lose more points for **silent** problem solving than for an imperfect solution — narrating your reasoning (what you\'re trying, why, what it costs) turns the interview into a conversation they can steer and score, instead of a test they can only watch and guess about.',
            },
            {
              type: 'heading',
              text: 'Reading the constraints: input size tells you the target complexity',
            },
            {
              type: 'p',
              text: 'A judge or interviewer that says "n ≤ 10⁵" is handing you the intended complexity. Assume roughly 10⁸ simple operations per second in a compiled language, and far fewer (closer to 10⁷) in pure Python or JavaScript loops. Work backward from n.',
            },
            {
              type: 'table',
              headers: ['Constraint on n', 'Target complexity', 'Typical techniques'],
              rows: [
                ['n ≤ 10–12', 'O(n!) or O(n · 2ⁿ)', 'Brute-force permutations, backtracking'],
                ['n ≤ 20–25', 'O(2ⁿ) to O(n · 2ⁿ)', 'Subset enumeration, bitmask DP, meet in the middle'],
                ['n ≤ 500', 'O(n³)', 'Floyd-Warshall, interval DP'],
                ['n ≤ 5,000', 'O(n²)', '2D DP (LCS, edit distance), all pairs'],
                ['n ≤ 10⁵ – 10⁶', 'O(n log n) or O(n)', 'Sorting, heap, binary search, sliding window, two pointers, Union-Find'],
                ['n ≤ 10⁸ or larger', 'O(n) with a tiny constant, O(log n), or O(1)', 'Math / closed form, binary search on the answer, bit tricks'],
              ],
            },
            {
              type: 'heading',
              text: 'Beyond the first working solution',
            },
            {
              type: 'list',
              items: [
                '**Name the trade-off**: "O(n) time and O(n) space with a hash map, or O(n log n) time and O(1) extra space if I sort in place" — presenting two points on the curve is a senior signal.',
                '**Handle scale follow-ups**: "What if the input does not fit in memory?" (external merge sort, streaming algorithms, a size-K heap, sketches like Bloom filter / HyperLogLog), "What if it is a stream?" (online algorithms, two heaps), "What if it must be concurrent?" (locking, immutable snapshots, lock-free structures).',
                '**Check overflow and numeric edges**: 32-bit integer overflow in sums or midpoints (`left + (right - left) / 2`), negative numbers in modulo, floating-point equality.',
                '**Test deliberately**: empty input, one element, all equal, already sorted, reverse sorted, maximum size, and a case that exercises each branch. Say them out loud.',
                '**Keep the code readable**: meaningful names, small helper functions, and invariants stated in comments. Interviewers are reading for how you would write production code.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'AI assistants can now produce a correct textbook solution to most standard interview problems in seconds, so the discriminating signals have shifted toward what they cannot do for you: clarifying ambiguous requirements, choosing between trade-offs for a stated context, debugging your own half-working code live, and explaining *why* an approach is correct. Practice explaining, not just solving.',
            },
          ],
        },
      ],
    },
    {
      id: 'dsa-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'Classic "explain the approach" DSA interview questions, with full-depth answers covering complexity and why the obvious alternative is worse.',
          qa: [
            {
              question: 'What is the difference between Big-O, Big-Θ, and Big-Ω, and why do people say "O(n)" when they usually mean Θ(n)?',
              answer:
                'Big-O is an upper bound ("never worse than this"), Big-Ω is a lower bound ("never better than this"), and Big-Θ is a tight bound where the upper and lower bounds match, meaning the algorithm always does that much work (up to constant factors) for a given input class. In casual conversation, "O(n)" is almost always shorthand for "the worst case is Θ(n)". Notation (O, Ω, Θ) and case (best, average, worst) are independent axes: you can give an upper bound on the best case or a tight bound on the worst case. Quicksort illustrates it: Θ(n log n) best and expected case, Θ(n²) worst case, so no single Θ describes it without naming the case.',
            },
            {
              question: 'Why is `x in some_list` inside a loop a common source of accidental O(n²) algorithms in Python, and how do you fix it?',
              answer:
                'A Python `list`\'s membership check (`x in list`) is O(n) because it has to scan the list linearly in the worst case. Calling it inside a loop that already runs n times turns an apparently-simple piece of code into O(n²) overall, even though nothing about the surrounding logic looks like a nested loop. The fix is almost always to swap the container for a `set` or `dict`, which give O(1) average-case membership checks — the algorithm\'s shape doesn\'t change at all, just the data structure backing one lookup, and the complexity drops from O(n²) to O(n).',
            },
            {
              question: 'Compare arrays and linked lists. When would you actually choose a linked list in practice?',
              answer:
                'Arrays give O(1) random access via index arithmetic but O(n) insert/delete in the middle (everything after must shift), and they have excellent cache locality since elements sit contiguously in memory. Linked lists give O(1) insert/delete *given a pointer to the right node* but O(n) access (no index arithmetic — you must walk from the head), and worse cache locality since nodes are scattered. In practice, linked lists are chosen when insertions/deletions at arbitrary, already-located positions dominate over random access — e.g., implementing an LRU cache\'s eviction order, or an undo history where you\'re always operating at a known position — and even then, many real systems still prefer an array-backed structure (like a dynamic array or a doubly linked list combined with a hash map) because cache locality often wins in wall-clock time despite equal Big-O.',
            },
            {
              question: 'How do hash tables achieve average O(1) lookup, and what causes the worst case to degrade to O(n)?',
              answer:
                'A hash function maps each key to an array index (a "bucket"), so with a good, uniform hash function and a reasonable load factor, most buckets hold zero or one entries and a lookup is essentially O(1): compute the hash, jump to the bucket, done. The worst case degrades to O(n) when many keys collide into the same bucket — either because the hash function distributes keys poorly, because the load factor grew too high without the table resizing, or in an adversarial scenario where an attacker deliberately crafts keys that all hash to the same value (a real denial-of-service vector against naive implementations, which is why languages like Python randomize the hash seed per process). Chaining degrades gracefully (buckets just become longer lists, still findable, just slower); open addressing under heavy collision suffers from clustering, where probing for a free slot takes longer and longer.',
            },
            {
              question: 'Explain the two-pointer technique, and why it requires the array to be sorted for correctness (not just for speed).',
              answer:
                'Two pointers works by starting at two positions (often the two ends of a sorted array) and moving them based on a comparison against a target, discarding the half of the search space that comparison rules out. On a sorted array, if the sum at the current two pointers is too small, moving the left pointer right is *guaranteed* to help — because everything to the left is smaller, and the array\'s sorted order means there\'s no way moving the right pointer left could help instead. Correctness depends on this monotonic relationship holding: on an unsorted array, sliding a pointer inward could just as easily skip past the actual answer, since a smaller or larger value could be sitting anywhere. This is why two pointers is O(n) time and O(1) space, but only correct when the sortedness invariant is actually present (or first established by sorting, at the cost of O(n log n)).',
            },
            {
              question: 'What is the sliding window technique, and how is it different from two pointers?',
              answer:
                'Sliding window maintains a contiguous range (the "window") over the input and incrementally updates some running state (a sum, a character-frequency map, a distinct-element count) as the window\'s edges move, avoiding recomputing that state from scratch for every window position. It is closely related to two pointers — both use two indices moving through the array — but the conceptual difference is what the two indices represent: in two pointers, they usually represent two independent candidate positions converging toward each other; in sliding window, they represent the two edges of one contiguous region that expands and contracts. Sliding window is the natural fit whenever the problem is phrased around a *contiguous* subarray or substring ("longest substring without repeating characters," "maximum sum of any k consecutive elements").',
            },
            {
              question: 'How would you validate that a string of brackets is balanced, and what data structure makes it O(n)?',
              answer:
                'Use a stack: scan the string left to right, pushing every opening bracket, and on every closing bracket, check that it matches the type on top of the stack (pop it if so, otherwise the string is invalid). At the end, the string is balanced only if the stack is empty (no unmatched opens remain). This is O(n) time and O(n) worst-case space — a stack is the right structure specifically because bracket matching is inherently Last-In-First-Out: the most recently opened bracket must be the next one closed, which is exactly what a stack enforces for free.',
            },
            {
              question: 'What is a monotonic stack, and what class of problems does it solve efficiently?',
              answer:
                'A monotonic stack maintains its elements in strictly increasing or strictly decreasing order at all times, by popping elements that would violate that order before pushing a new one. It solves "next greater/smaller element" style problems (and derivatives like "daily temperatures" or "largest rectangle in histogram") in O(n) total, because although there appears to be a nested loop (an outer scan plus an inner while-loop that pops), each element is pushed and popped from the stack at most once across the entire run — so the amortized total work is O(n), not O(n²), even though a naive comparison-of-every-pair approach for the same problem would be O(n²).',
            },
            {
              question: 'Walk through in-order, pre-order, post-order, and level-order tree traversal, and give a real use case for each.',
              answer:
                'In-order (left, node, right) visits a binary search tree\'s nodes in sorted order — used whenever you need sorted output or an in-order successor/predecessor. Pre-order (node, left, right) visits the root before its subtrees, which is why it\'s used for serializing/cloning a tree — you can reconstruct the tree top-down from a pre-order list plus knowledge of null markers. Post-order (left, right, node) visits children before their parent, which is essential whenever a node\'s own computation depends on its children\'s results first — safely deleting a tree bottom-up, or computing subtree sizes/heights. Level-order (breadth-first, via a queue) visits nodes level by level, which is the natural choice for "print by level" or finding the shortest path in an unweighted tree — it is the only one of the four that is not depth-first.',
            },
            {
              question: 'Why can a binary search tree degrade from O(log n) to O(n), and how do self-balancing trees prevent that?',
              answer:
                'A BST\'s O(log n) guarantee assumes the tree stays roughly balanced — but a plain BST has no mechanism enforcing that. Inserting already-sorted data one element at a time (e.g., 1, 2, 3, 4, 5 in order) produces a tree that is really just a linked list wearing a tree\'s clothing: every node has only a right child, and every operation becomes O(n). Self-balancing trees (AVL, red-black) prevent this by checking, after every insert/delete, whether some balance criterion is violated, and if so, performing local rotations to restore it — AVL enforces a strict height-difference-of-1 rule (faster lookups, more rotation overhead), red-black enforces a looser rule via node coloring (slightly slower lookups, fewer rotations, which is why most standard library ordered maps use red-black trees). Both guarantee O(log n) worst case, no exceptions, at the cost of extra bookkeeping on every mutation.',
            },
            {
              question: 'What is a heap, how is it stored in memory, and why is peeking the min/max O(1) but extracting it O(log n)?',
              answer:
                'A heap is a complete binary tree where every parent is smaller than its children (min-heap) or larger (max-heap) — critically, this ordering is only enforced between parent and child, not across the whole tree, which is what makes it cheaper to maintain than a fully sorted structure. Because a heap is *complete* (filled left to right, no gaps), it can be stored densely in a plain array with no pointers at all: a node at index i has children at 2i+1 and 2i+2. Peeking the min/max is O(1) because it always sits at index 0 by construction. Extracting it is O(log n) because removing the root leaves a hole that must be refilled (typically by moving the last element to the root) and then "sifted down" into its correct position, which takes time proportional to the tree\'s height, i.e., O(log n).',
            },
            {
              question: 'Design a solution to find the K largest elements in a stream of numbers. What is the time complexity, and why beat sorting?',
              answer:
                'Maintain a min-heap of size K. For each new number: if the heap has fewer than K elements, push it; otherwise, compare it against the heap\'s smallest element (the root) — if the new number is larger, pop the root and push the new number, otherwise discard it. At any point, the heap holds exactly the K largest elements seen so far, with the K-th largest at the root. This is O(log K) per element, O(n log K) total for n elements — which beats sorting the entire stream (O(n log n)) whenever K is meaningfully smaller than n, and crucially also works on a true streaming input where you never have the full dataset in memory at once, which sorting fundamentally cannot do.',
            },
            {
              question: 'What is a trie, and why would you use one instead of a hash set for a set of strings?',
              answer:
                'A trie is a tree where each edge represents one character, and paths from the root spell out strings — shared prefixes across multiple strings share the same path, only diverging where the strings differ. A hash set gives O(1) average lookup for "does this exact string exist," same as a trie\'s O(L) lookup (L = string length) in practice for reasonable lengths — so for exact-match membership alone, a trie doesn\'t obviously win. The real advantage is prefix queries: "does any stored word start with this prefix?" is O(L) on a trie (just walk the prefix\'s path and check it exists), but on a hash set it would require checking every single stored string individually, O(n × L) in the worst case. This is exactly why tries are the standard tool for autocomplete, spell-check, and IP-routing-style longest-prefix-match problems.',
            },
            {
              question: 'Compare adjacency list and adjacency matrix graph representations. When does the matrix actually win?',
              answer:
                'An adjacency list stores, for each vertex, only its actual neighbors — O(V + E) total space, and iterating a vertex\'s neighbors costs exactly its degree. An adjacency matrix stores a full V×V grid regardless of how many edges actually exist — O(V²) space always, but checking "does edge (u, v) exist" is O(1) versus O(degree of u) for the list. The matrix wins specifically when the graph is dense (E is close to V², so the O(V²) space isn\'t much worse than E anyway) or when the algorithm needs frequent O(1) arbitrary edge-existence checks rather than neighbor iteration (e.g., Floyd-Warshall\'s all-pairs DP naturally indexes by pairs of vertices). For the sparse graphs common in most interview problems and real-world networks, the adjacency list\'s O(V + E) space is a decisive win.',
            },
            {
              question: 'When would you use BFS over DFS on a graph, and vice versa?',
              answer:
                'Use BFS whenever you need the shortest path in an unweighted graph, or "fewest steps/moves" style problems, or need to process nodes strictly in order of distance from a source (e.g., finding all nodes within k hops) — BFS\'s queue guarantees every node at distance d is processed before any node at distance d+1. Use DFS when you need to explore all possible paths (not just the shortest), detect cycles, compute a topological sort, find connected components, or when the problem is naturally recursive/tree-shaped (like exhaustively searching a decision space, which shades into backtracking). Both run in O(V + E), so the choice is about which traversal order matches what the problem is actually asking, not about performance.',
            },
            {
              question: "Why doesn't Dijkstra's algorithm work with negative edge weights, and what would you use instead?",
              answer:
                'Dijkstra\'s greedy strategy finalizes a vertex\'s shortest distance the moment it is popped from the priority queue as the current minimum, on the assumption that no future edge could possibly produce an even shorter path to it (true only if all remaining edge weights are non-negative). A negative edge discovered later could reduce the true shortest distance to an already-finalized vertex below what Dijkstra committed to, and Dijkstra has no mechanism to revisit and lower a distance it already treated as final — so it silently produces a wrong answer rather than erroring out, which makes this bug particularly dangerous. Bellman-Ford handles negative weights correctly (at the cost of O(V × E) instead of O((V+E) log V)) because it relaxes every edge repeatedly rather than assuming any vertex is "done" early, and it can even detect a negative-weight cycle if a distance can still be improved after V − 1 full relaxation passes.',
            },
            {
              question: 'Explain how Union-Find (Disjoint Set) works, and why union-by-rank plus path compression gets it to near-constant time.',
              answer:
                'Union-Find maintains a forest where each set is a tree, and `find(x)` walks up parent pointers to the tree\'s root, which serves as that set\'s canonical representative; `union(x, y)` merges two sets by attaching one root under the other. Without optimization, repeated unions can produce a long, skewed chain, making `find` degrade toward O(n). **Union by rank** attaches the smaller (lower-rank) tree under the larger one\'s root rather than arbitrarily, keeping trees shallow. **Path compression** makes every node visited during a `find` point directly at the root afterward, flattening the tree for all future lookups through those nodes. Combined, the amortized cost per operation becomes O(α(n)), the inverse Ackermann function — which is so slow-growing that it is effectively ≤ 5 for any input size that could ever exist in practice, making Union-Find operations "constant time" for all practical purposes.',
            },
            {
              question: 'How would you detect a cycle in a directed graph, and how is that different from detecting a cycle in an undirected graph?',
              answer:
                'In a **directed** graph, a DFS-based approach tracks not just visited nodes but the current recursion path (nodes "in progress"): if DFS reaches a node that is already on the current path (not just previously visited), a cycle exists — this distinction matters because a node visited via a *different*, already-completed path is not a cycle. Alternatively, Kahn\'s topological-sort algorithm detects a cycle for free: if fewer than V vertices ever reach in-degree 0 and get processed, the remaining vertices are locked in a cycle. In an **undirected** graph, cycle detection is simpler: a plain DFS or BFS that encounters an already-visited neighbor which is *not* the immediate parent indicates a cycle (checking against the parent is necessary because the edge you just came from always appears as an already-visited neighbor, but it isn\'t a cycle). Union-Find also works cleanly for the undirected case: process edges one by one, and if both endpoints are already in the same set before you union them, adding that edge creates a cycle.',
            },
            {
              question: "Explain Kruskal's algorithm for minimum spanning tree, and why it needs Union-Find specifically.",
              answer:
                'Kruskal\'s algorithm sorts all edges by weight ascending, then greedily adds each edge to the MST unless doing so would create a cycle (which would mean the tree is no longer a valid *tree*, since a spanning tree by definition has exactly V − 1 edges and no cycles). The question at each step is "are these two vertices already connected in the MST being built so far?" — which is exactly the question Union-Find answers in near-O(1) amortized time via `find`. Without Union-Find, checking connectivity would require a full graph traversal (BFS/DFS) from scratch on every candidate edge, which would be far slower — Union-Find is what makes Kruskal\'s overall complexity O(E log E) (dominated by the initial sort) rather than something closer to O(E × V).',
            },
            {
              question: 'Compare merge sort and quicksort. Why does quicksort remain popular despite a worse worst-case complexity?',
              answer:
                'Merge sort guarantees O(n log n) in every case (its recurrence T(n) = 2T(n/2) + O(n) has no data-dependent branching), is stable, but needs O(n) auxiliary space for the merge step. Quicksort averages O(n log n) but has an O(n²) worst case that depends entirely on pivot choice — a pivot that repeatedly splits the array as unevenly as possible (e.g., always the smallest or largest remaining element) degrades badly. Quicksort remains popular because, with a randomized or median-of-three pivot, its worst case becomes an astronomically unlikely coincidence rather than a realistic risk, it sorts in-place (O(log n) space instead of O(n)), and its inner loop has excellent cache locality and lower constant factors than merge sort\'s — in practice, well-implemented quicksort is often faster than merge sort on random data despite having the same average-case Big-O.',
            },
            {
              question: 'Why do comparison-based sorting algorithms have a proven Ω(n log n) lower bound, and how do counting sort and radix sort get around it?',
              answer:
                'Any comparison-based sort can be modeled as a decision tree where each internal node is a comparison and each leaf is one possible output ordering; since there are n! possible orderings of n elements, the tree needs at least n! leaves, and a binary tree with n! leaves must have depth at least log₂(n!), which is Θ(n log n) by Stirling\'s approximation — so no comparison-based algorithm can beat that in the worst case, full stop. Counting sort and radix sort get around this not by beating the bound but by not playing that game: they never ask "is A bigger than B?" at all. Counting sort directly tallies occurrences of each value into a table indexed by the value itself, achieving O(n + k) where k is the value range; radix sort extends this to larger ranges by repeatedly counting-sorting on individual digits, O(d × (n + k)). The tradeoff is that both require integer (or integer-mappable) keys within a range that isn\'t dramatically larger than n — they don\'t generalize to arbitrary comparable objects.',
            },
            {
              question: 'Design an algorithm to search for a target in a sorted array that has been rotated at an unknown pivot, in O(log n).',
              answer:
                'Run a modified binary search: at each step, compare `nums[mid]` against `nums[left]` to determine which half of the current range `[left, mid]` or `[mid, right]` is "normally" sorted (rotation guarantees at least one half always is). Then check whether the target falls within that sorted half\'s value range: if it does, recurse into that half; otherwise, the target must be in the other (still-rotated) half, so recurse there instead. This preserves binary search\'s O(log n) guarantee because every step still discards half the remaining search space — the only added complexity is the extra logic to figure out *which* half is safe to reason about with a simple range check, since a naive comparison against `nums[mid]` alone doesn\'t directly tell you which direction to go the way it would in a non-rotated sorted array.',
            },
            {
              question: 'What makes a problem suitable for dynamic programming, and what is the difference between memoization and tabulation?',
              answer:
                'A problem is suitable for DP when it has both **optimal substructure** (an optimal solution can be built from optimal solutions to smaller subproblems) and **overlapping subproblems** (a naive recursive solution calls itself on the same inputs repeatedly). Without optimal substructure, DP has nothing correct to build on top of; without overlapping subproblems, memoizing has nothing to cache and buys no speedup (e.g., memoizing merge sort helps nothing, since its subproblems never repeat). Memoization (top-down) keeps the natural recursive formulation and caches each subproblem\'s result the first time it\'s computed, so only subproblems actually needed get solved — at the cost of recursion overhead and stack-depth risk. Tabulation (bottom-up) iteratively fills a table from the smallest subproblems upward in a carefully chosen order, avoiding recursion entirely and often allowing space optimization (like collapsing a 2D table to a rolling 1D array), at the cost of computing every subproblem even ones that end up unused.',
            },
            {
              question: 'Walk through the state, recurrence, and base case for solving 0/1 Knapsack with dynamic programming, and explain why greedy fails here.',
              answer:
                'State: `dp[i][w]` = the maximum value achievable using only the first i items with a knapsack capacity of w. Recurrence: for item i, either skip it (`dp[i-1][w]`) or take it if it fits (`value[i] + dp[i-1][w - weight[i]]`), and take the max of those two options: `dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w - weight[i]])` when `weight[i] <= w`. Base case: `dp[0][w] = 0` for all w (no items means zero value). This is O(n × W) time and space. Greedy (always take the highest value-per-weight item first) fails here because items are indivisible: greedily committing to a high-ratio item can leave awkward leftover capacity that a different, slightly-lower-ratio combination would have used more effectively — unlike the fractional knapsack variant, there is no way to "top off" the remaining capacity with a partial item to compensate, so a locally optimal choice can permanently lock out the true global optimum. DP avoids this by systematically considering both include/exclude for every item rather than committing irreversibly.',
            },
            {
              question: 'Explain the difference between a greedy approach and dynamic programming using activity selection vs 0/1 knapsack as contrasting examples.',
              answer:
                'Activity selection (choosing the maximum number of non-overlapping intervals) has the greedy-choice property: always picking the activity that finishes earliest is provably never wrong, because it can be shown via an exchange argument that any optimal solution can be transformed into one that starts with the earliest-finishing activity without becoming worse — so a single greedy pass, sorted by finish time, suffices in O(n log n) with no need to reconsider earlier choices. 0/1 knapsack lacks this property: the "best-looking" choice at any point (say, highest value-per-weight) is not guaranteed to be part of *some* optimal solution, because indivisible items interact with the remaining capacity in ways a single greedy pass cannot foresee or undo. DP handles this by systematically exploring the include/exclude choice for every item against every possible remaining capacity, rather than committing to one choice per step — the extra O(n × W) cost over greedy\'s O(n log n) is exactly the price of correctness when the greedy-choice property doesn\'t hold.',
            },
            {
              question: 'Design an algorithm to place N queens on an N×N chessboard so that none attack each other, and explain how pruning changes the practical runtime.',
              answer:
                'Use backtracking: place queens row by row, and for each row, try every column, checking whether that placement conflicts with any previously placed queen (same column, or same diagonal — tracked via sets of occupied columns and the two diagonal directions, each check O(1)). If a placement is safe, recurse to the next row; if the recursive call fails to complete a valid board, undo the placement ("backtrack") and try the next column. Without pruning, brute-force enumeration of all possible queen placements is O(N^N) (N choices for each of N queens\' columns, checked independently). With backtracking\'s early conflict pruning, an entire subtree of hopeless placements is abandoned the moment a conflict is detected, rather than being fully explored down to a complete (invalid) board — in practice this collapses the runtime dramatically, even though the theoretical worst case remains exponential (bounded by roughly O(N!) with the pruning applied).',
            },
            {
              question: 'You need to find the number of connected components in an undirected graph. Compare a BFS/DFS-based approach with a Union-Find-based approach.',
              answer:
                'BFS/DFS approach: iterate over every vertex; for each unvisited vertex, run a full BFS or DFS marking every reachable vertex as visited, and increment a counter once per traversal started — the counter\'s final value is the number of components. O(V + E) time, O(V) space for the visited set. Union-Find approach: initialize each vertex as its own set, then union the endpoints of every edge; the number of components is the number of distinct roots remaining afterward. Also roughly O(E · α(V)) time (near-linear), O(V) space. The two are functionally equivalent in complexity for a static graph, but Union-Find is the clearly better choice when edges arrive incrementally over time (e.g., "how many components after each new edge is added?") since it supports online updates in near-O(1) per edge, whereas BFS/DFS would need to be rerun from scratch after each change — this "static vs. incremental" distinction is usually the deciding factor an interviewer is listening for.',
            },
            {
              question: 'Design an LRU (Least Recently Used) cache with O(1) get and put.',
              answer:
                'Combine a hash map with a doubly linked list: the hash map stores `key -> node` for O(1) lookup, and the doubly linked list maintains recency order, with the most-recently-used node at the front and the least-recently-used at the back. On `get(key)`: look up the node in O(1) via the map, then move it to the front of the list in O(1) (using its `prev`/`next` pointers directly — no traversal needed). On `put(key, value)`: if the key exists, update its value and move it to the front; otherwise, create a new node at the front, and if capacity is now exceeded, remove the node at the back (also O(1), and remove it from the map too). The hash map alone would give O(1) lookup but no way to track recency; a plain list alone would give recency tracking but O(n) lookup/removal by key — combining both, with the map storing direct pointers into the list, is what makes every operation O(1).',
            },
            {
              question: 'What is the sliding window maximum problem, and how does a monotonic deque solve it in O(n) instead of O(n × k)?',
              answer:
                'Given an array and a window size k, find the maximum in every contiguous window of size k as it slides across the array. A naive approach recomputes the max over each window from scratch, O(k) per window and O(n × k) overall. A monotonic deque solves it in O(n): maintain a deque of indices whose corresponding values are in strictly decreasing order; for each new element, pop from the back any indices whose values are smaller than the current one (they can never be the max again while the current, larger element is still in the window), then push the current index; also pop from the front any index that has fallen outside the current window. The front of the deque is always the index of the current window\'s maximum. Each index is pushed and popped at most once across the whole run, so the total work is O(n) despite the sliding-window structure.',
            },
            {
              question: 'How would you find the median of a continuous stream of numbers efficiently?',
              answer:
                'Maintain two heaps: a max-heap holding the smaller half of the numbers seen so far, and a min-heap holding the larger half, kept balanced in size (differing by at most one element). The median is then either the max-heap\'s root (odd count) or the average of both heaps\' roots (even count) — both O(1) to read. On inserting a new number: push it into the appropriate heap based on comparison with the max-heap\'s current root, then rebalance by moving one element between heaps if their sizes differ by more than one, which is O(log n). This beats the naive approach of re-sorting (or maintaining a fully sorted structure) after every insertion, which would be O(n log n) or O(n) per insertion respectively — the two-heap approach gets each insertion down to O(log n) while still answering "what\'s the median right now?" in O(1).',
            },
            {
              question: 'When facing a completely unfamiliar problem in an interview, what is a productive sequence of steps to work through it, and why does starting with brute force matter even if you suspect it\'s the wrong final answer?',
              answer:
                'First, clarify constraints and edge cases explicitly (input size, duplicates, sorted or not, what to do with no valid answer) — this alone often reveals structure that suggests an approach. Second, state a brute-force solution, even an obviously inefficient one ("I could check every pair") — this establishes a correctness baseline, gives you and the interviewer a shared reference point, and very often the brute force\'s specific inefficiency (a repeated linear scan, a redundant recomputation) points directly at which pattern fixes it (hashing removes the scan, memoization removes the recomputation). Third, name the pattern the problem resembles (two pointers, sliding window, DP, etc.) and explain *why* it applies, not just that it does. Fourth, code the optimized solution, narrating decisions out loud. Fifth, trace through a small example by hand, including at least one edge case. Sixth, explicitly state final time and space complexity. Skipping the brute-force step is a common mistake under pressure — it feels like wasted time, but it is usually the fastest path to spotting the actual optimization, and it gives you a fallback to fully implement if the optimized idea doesn\'t pan out mid-interview.',
            },
            {
              question: 'Why is appending to a dynamic array amortized O(1) even though a resize copies everything? What happens if you grow by a fixed amount instead of a factor?',
              answer:
                'Growing by a constant factor g > 1 means resizes happen at sizes 1, g, g², ... and the total copy work for n appends is a geometric series bounded by roughly n · g/(g − 1) — a constant multiple of n. So n appends cost O(n) total and each is O(1) amortized, with no probabilistic assumption: it holds for every sequence of operations. If you instead grow by a fixed increment c, you resize every c appends and each resize copies the whole array, giving about n²/(2c) total work — Θ(n²), or Θ(n) per append amortized. The growth factor only trades memory slack against copy frequency (Java\'s ArrayList grows by about 1.5x, many implementations use 2x). Two caveats worth stating: shrink at a lower threshold than you grow (e.g., at 1/4 full) to avoid thrashing, and amortized O(1) still permits an occasional Θ(n) latency spike, which matters for real-time paths.',
            },
            {
              question: 'What is the difference between amortized and average-case complexity?',
              answer:
                'Average-case analysis assumes a probability distribution over inputs and averages the cost over it; if the real inputs are not distributed that way, the guarantee evaporates. Amortized analysis makes no probabilistic assumption: it bounds the total cost of any worst-case sequence of m operations and divides by m, so it is a deterministic guarantee about sequences. Dynamic array appends, two-stack queues, monotonic stacks, and Union-Find with path compression are amortized. Hash table lookups are a different thing again — expected O(1) over the randomness of the hash function. A precise answer names which of the three (worst-case, amortized, expected) a given bound is.',
            },
            {
              question: 'How does prefix sum plus a hash map count subarrays that sum to K, and why does sliding window fail on the same problem when values can be negative?',
              answer:
                'Let P[i] be the sum of the first i elements. A subarray (j, i] sums to K exactly when P[i] − P[j] = K, i.e. P[j] = P[i] − K. Scan left to right keeping a hash map of how many times each prefix sum has appeared; at each position add map[P[i] − K] to the answer, then record P[i]. Seed the map with {0: 1} so subarrays beginning at index 0 are counted, and query before inserting so empty subarrays are not counted. That is O(n) time and O(n) space. Sliding window needs the condition to be monotonic in window size — extending the window only ever increases the sum — which holds for non-negative numbers. With negatives, adding an element can lower the sum, so there is no safe rule for when to advance the left pointer, and the technique is simply incorrect, not just slow.',
            },
            {
              question: 'Explain the \'dominated element\' argument behind a monotonic deque for sliding window maximum.',
              answer:
                'In a window moving right, an older element leaves the window before a newer one does. So if an older element is not larger than a newer element, it can never be the maximum of any window that still contains it, because the newer element is in every such window and is at least as large. It is dominated and can be discarded the moment the newer element arrives. Keeping only non-dominated indices leaves a deque whose values are strictly decreasing from front to back. The front is therefore always the window maximum; expired indices are popped from the front, dominated ones from the back. Each index is pushed and popped at most once, so the whole scan is O(n), versus O(n · k) for recomputing each window.',
            },
            {
              question: 'Why is building a binary heap from an array O(n) rather than O(n log n)?',
              answer:
                'Bottom-up heapify sifts down each non-leaf node, starting from the last parent. The cost of a sift-down is bounded by the node\'s height, not by the tree\'s height. About n/2 nodes are leaves (height 0, no work), n/4 have height 1, n/8 have height 2, and so on, so the total work is on the order of n · Σ h/2^h, a convergent series equal to a constant times n. Inserting n elements one at a time uses sift-up, whose cost is bounded by depth, and most nodes are deep, so that approach really is Θ(n log n) in the worst case. This asymmetry is why heapq.heapify (and constructing a PriorityQueue from a collection, or C++ make_heap) is the right way to start from existing data.',
            },
            {
              question: 'Why does a BFS-style \'mark on push\' break an iterative DFS?',
              answer:
                'In BFS every node is discovered at its final distance the first time it is seen, so marking it visited when it is enqueued is safe and prevents duplicate queue entries. In DFS the order of visit matters: if you mark nodes when pushing them, a node is claimed immediately by the current node even though a deeper path from an earlier sibling should have reached it first in a true depth-first order. You still visit every node exactly once, so connectivity answers are right, but the traversal order is not depth-first, which silently breaks anything built on DFS structure: discovery and finish times, cycle detection with back edges, topological order by finish time, bridges, and strongly connected components. The fix is to mark when you pop (and skip nodes already visited), or to simulate the recursion with an explicit iterator stack.',
            },
            {
              question: 'How would you find the shortest path in a graph with weights restricted to 0 and 1, or with at most K edges allowed?',
              answer:
                'For 0/1 weights, use 0-1 BFS: a deque instead of a heap, pushing the neighbor to the front when the edge weight is 0 and to the back when it is 1. Distances come off the deque in non-decreasing order, so it matches Dijkstra\'s result in O(V + E) instead of O((V + E) log V). For at most K edges (or K stops), distance alone is not enough state: reaching a node cheaper but with more edges used is not strictly better. Run Bellman-Ford for exactly K rounds, copying the distance array each round so that updates within a round cannot chain, giving O(K · E). Or expand the state to (node, edges_used) and run BFS/Dijkstra on that product graph. The general lesson is to put whatever the constraint depends on into the vertex.',
            },
            {
              question: 'Why are Kruskal and Prim both correct? State the cut property and how each algorithm uses it.',
              answer:
                'Cut property: for any partition of the vertices into two non-empty sets, a lightest edge crossing the partition belongs to some minimum spanning tree (and if it is the unique lightest, to every one). Proof sketch by exchange: take any MST that lacks the edge e; adding e creates a cycle which must cross the cut again at another, heavier-or-equal edge; swapping that edge for e does not increase the total weight. Prim maintains a growing tree and always adds the lightest edge crossing the cut between the tree and the remaining vertices, so each choice is safe by the cut property. Kruskal processes edges in sorted order; when it adds an edge joining two different components, that edge is the lightest one crossing the cut between one of those components and the rest, because all lighter edges were already added or skipped as cycle-forming. Both therefore only ever add edges that belong to some MST.',
            },
            {
              question: 'How do you reconstruct the actual solution from a DP, not just its value, and how do you reduce the DP\'s space?',
              answer:
                'To reconstruct, either store a parent/choice pointer alongside each state (which decision produced the optimum) and walk back from the final state, or re-derive the decision while walking back by checking which transition equals the stored value (for LCS: if the characters match go diagonally, otherwise move toward the neighbor with the larger value). For space, notice which previous states each state depends on: if row i depends only on row i − 1, keep two rows (or one row with a careful iteration direction, as in 1D 0/1 knapsack where capacity iterates downward). The catch is that rolling arrays discard the table you need for reconstruction; if you need both linear space and the solution, use a divide-and-conquer technique such as Hirschberg\'s algorithm for LCS, which recomputes halves at the cost of a constant factor in time.',
            },
            {
              question: 'What does \'pseudo-polynomial\' mean, using 0/1 knapsack as the example?',
              answer:
                'The DP for 0/1 knapsack runs in O(n · W), where W is the capacity. That looks polynomial, but complexity is measured against the size of the input in bits, and W is written in about log W bits, so the runtime is exponential in the length of that part of the input. It is polynomial in the numeric value of W, hence pseudo-polynomial. This does not contradict knapsack being NP-hard: the DP is fast only when W is small, and it becomes unusable for a capacity like 10^18. The same applies to subset sum and partition. In practice, you check the constraints: if W is at most around 10^5 the DP is fine; if weights are huge but there are few items (n at most about 40), meet in the middle (O(2^(n/2))) is the better choice.',
            },
            {
              question: 'When would you choose a segment tree or Fenwick tree over prefix sums, and what can each not do?',
              answer:
                'Prefix sums answer range-sum queries in O(1) but any point update invalidates O(n) prefixes, so they suit static data. When updates and queries interleave, a Fenwick tree gives O(log n) point update and O(log n) prefix/range sum with one array and about fifteen lines of code. It relies on the operation being invertible (subtracting two prefixes yields a range), so it works for sum, XOR and counts, but not directly for min or max. A segment tree stores an aggregate per node and handles any associative operation (min, max, gcd, custom merges), and with lazy propagation it supports range updates in O(log n); the price is more memory (2n to 4n) and more code. If only range updates arrive and queries happen once at the end, a difference array is simpler and O(1) per update.',
            },
            {
              question: 'Your quicksort is randomized, yet it times out on an array of a million identical values. Why, and how do you fix it?',
              answer:
                'With a two-way partition (elements < pivot left, everything else right, the Lomuto scheme) every element equals the pivot, so each partition puts everything on one side and the recursion peels off a single element per level: O(n²) time and O(n) stack depth, no matter how the pivot was chosen. Randomization protects against bad pivot values, not against bad value distributions. The fix is a three-way partition (less than / equal to / greater than the pivot) so the equal block is excluded from recursion, which makes the all-equal case linear, or a Hoare-style partition that stops on equal keys and splits them evenly. Also recurse into the smaller side first and loop on the larger so the stack stays O(log n). This is why library sorts use introsort or pdqsort style hybrids.',
            },
          ],
        },
      ],
    },
  ],
}
