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
            '**Big-O (O)** describes an **upper bound** — "this algorithm never does more than roughly this much work" (worst-case ceiling).',
            '**Big-Ω (Omega)** describes a **lower bound** — "this algorithm always does at least roughly this much work" (best-case floor).',
            '**Big-Θ (Theta)** describes a **tight bound** — both the upper and lower bound match, meaning the algorithm always does *exactly* this much work (up to constants) for a given input class.',
            'When combining complexities: sequential steps **add** (O(a) then O(b) → O(a + b)); nested steps **multiply** (a loop of `b` inside a loop of `a` → O(a × b)). Always drop constants and non-dominant lower-order terms.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'These three notations describe *bounds* on a function that represents an algorithm\'s resource usage as input size *n* grows. In casual interview conversation people almost always say "Big-O" even when they mean the tight Big-Θ bound — for example, "binary search is O(log n)" really means Θ(log n): it is *always* about log n comparisons, not just "at most." Knowing the precise distinction matters when an algorithm\'s best and worst cases genuinely differ, like quicksort (Ω(n log n) best case, O(n²) worst case, so it has no single Θ bound overall).',
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
    Note["all 6 calls sit on the stack at once,\\nwaiting for the one below to return -- O(n) space"]`,
            },
            {
              type: 'list',
              items: [
                '**Memoization (space for time)**: caching subproblem results turns an exponential-time recursive algorithm (like naive Fibonacci) into a linear-time one, at the cost of O(n) extra memory for the cache.',
                '**Precomputed lookup tables**: storing precomputed answers for a small, bounded input range converts repeated computation into O(1) array lookups.',
                '**Bloom filters / hashing**: accepting a small, bounded false-positive rate in exchange for O(1) space-per-element instead of storing every element exactly.',
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
                ['Insert/delete at end', 'O(1) amortized', 'O(1) with a tail pointer, else O(n)'],
                ['Insert/delete at front', 'O(n) — must shift everything', 'O(1)'],
                ['Insert/delete in middle', 'O(n) — must shift', 'O(1) given a pointer to the node; O(n) to find it'],
                ['Extra memory per element', 'None', 'One (or two) pointers per node'],
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
              text: 'The key insight that makes two pointers correct (not just fast) on a sorted array: if the sum of the values at the two current pointers is too small, the *only* way to increase it is to move the left pointer right (since the array is sorted, moving the right pointer left could only decrease or keep the sum the same relative to a smaller value). This lets you discard an entire half of the remaining search space with each comparison, without ever needing a nested loop.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Arr["sorted array, target = 9"]
        A0["2"] --- A1["3"] --- A2["5"] --- A3["6"] --- A4["8"]
    end
    L["left pointer\\nstarts here (2)"] -.-> A0
    R["right pointer\\nstarts here (8)"] -.-> A4
    Note["2 + 8 = 10 > 9 -> move right pointer left\\n2 + 6 = 8 < 9 -> move left pointer right\\n3 + 6 = 9 -> found!"]`,
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
    S1["s = 'a b c a b'\\nwindow [a,b,c]  right hits 2nd 'a' -> shrink"]
    S2["left jumps past first 'a'\\nwindow becomes [b,c,a]  size 3"]
    S3["right hits 2nd 'b' -> shrink again\\nwindow becomes [c,a,b]  size 3"]
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
    F4["factorial(4)\\nwaiting for factorial(3)"] --> F3["factorial(3)\\nwaiting for factorial(2)"]
    F3 --> F2["factorial(2)\\nwaiting for factorial(1)"]
    F2 --> F1["factorial(1)\\nwaiting for factorial(0)"]
    F1 --> F0["factorial(0)\\nbase case: returns 1"]
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
                ['Balance guarantee', 'Strict — height difference ≤ 1 at every node', 'Looser — height of the longest path ≤ 2× the shortest'],
                ['Lookup speed', 'Slightly faster (closer to perfectly balanced)', 'Slightly slower in the worst case'],
                ['Insert/delete speed', 'Slower — more frequent rotations to maintain strict balance', 'Faster — fewer rotations needed on average'],
                ['Typical real-world use', 'Read-heavy workloads (databases with more lookups than writes)', 'General-purpose (C++ `std::map`, Java `TreeMap`, Linux kernel schedulers)'],
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
              text: 'Python\'s `heapq` module only implements a **min-heap**. To simulate a max-heap, negate values on push and pop (`heapq.heappush(heap, -val)`, then negate again on read) — this trick comes up constantly in "top K" and "median of a stream" problems.',
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
    visited = {start}
    order = []
    stack = [start]
    while stack:
        node = stack.pop()
        order.append(node)
        for neighbor in reversed(graph[node]):
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)
    return order`,
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
    Note["Dijkstra relaxes C->B (1+2=3 < 4) before B is finalized,\\nso B's distance updates from 4 to 3 -- popping in\\nincreasing distance order guarantees this always happens in time"]`,
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
              text: 'Running Dijkstra on a graph with a negative edge silently produces a *wrong* answer rather than an error — because Dijkstra finalizes a vertex\'s distance the moment it is popped from the heap, a later negative edge that would have produced a shorter path is never considered. If negative weights are even a remote possibility, Bellman-Ford (or Floyd-Warshall for all-pairs) is the only correct choice.',
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
            '**Prim\'s algorithm**: start from any vertex and repeatedly add the cheapest edge that connects the growing tree to a new vertex, using a min-heap — O(E log V), and tends to be favored on dense graphs.',
            '**Union-Find** supports two operations — `find(x)` (which set is x in?) and `union(x, y)` (merge x\'s and y\'s sets) — and with two optimizations (union by rank, path compression), both run in near-O(1) **amortized** time (technically O(α(n)), the inverse Ackermann function, which is ≤ 5 for any realistic input).',
            'Kruskal tends to be simpler to reason about and preferred when edges are already available as a flat list; Prim tends to be preferred when the graph is given as an adjacency list and is dense.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Before["Before union(B, C): two separate sets"]
        A1((A)) --> A1
        B1((B rank1)) --> B1
        C1((C)) --> B1
    end
    subgraph After["After union(A, B): smaller-rank tree attaches under larger"]
        A2((A rank2)) --> A2
        B2((B)) --> A2
        C2((C)) --> B2
        note1["path compression on next find(C):\\nC -> A directly, skipping B"]
    end`,
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
            'Merge sort is **stable** (equal elements keep their relative order) and needs O(n) auxiliary space for the merge step; quicksort is typically **in-place** (O(log n) space for the recursion stack) but not stable.',
            'Randomizing the pivot choice (or using median-of-three) makes quicksort\'s worst case astronomically unlikely in practice, which is why real-world quicksort implementations essentially never hit O(n²) on real data.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Partition["Quicksort partition step, pivot = 5"]
        Before["[3, 7, 1, 5, 9, 2, 8]"] --> After["[3, 1, 2] + [5] + [7, 9, 8]\\nsmaller       pivot   larger"]
    end`,
            },
            {
              type: 'table',
              headers: ['', 'Merge Sort', 'Quicksort'],
              rows: [
                ['Best case', 'O(n log n)', 'O(n log n)'],
                ['Average case', 'O(n log n)', 'O(n log n)'],
                ['Worst case', 'O(n log n)', 'O(n²) — bad pivot repeatedly'],
                ['Extra space', 'O(n)', 'O(log n) (recursion stack, in-place partition)'],
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
    S1["[1,3,5,7,9,11,13]  target=11\\nleft=0 right=6 mid=3 (val 7) -- 7<11, search right"]
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
    A["1. Define the state\\nwhat does dp[i] mean?"] --> B["2. Write the recurrence\\ndp[i] in terms of smaller states"]
    B --> C["3. Identify base cases\\nthe smallest states, answered directly"]
    C --> D["4. Decide computation order\\nfill dependencies before dependents"]`,
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
    Note["sorted by finish time: A(4), B(5), D(7), E(9), C(6 excluded, overlaps)\\ngreedy picks A, then D (B overlaps A), then E -> 3 activities"]`,
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
        B4["bit4: 0\\nitem4 out"] --- B3["bit3: 1\\nitem3 in"] --- B2["bit2: 0\\nitem2 out"] --- B1["bit1: 1\\nitem1 in"] --- B0["bit0: 1\\nitem0 in"]
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
    A["1. Clarify\\nconstraints & edge cases"] --> B["2. Brute force\\n(establish correctness)"]
    B --> C["3. Identify the pattern\\n& optimize"]
    C --> D["4. Code it,\\nnarrating out loud"]
    D --> E["5. Trace through\\na small example"]
    E --> F["6. State final\\ntime & space complexity"]`,
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
                'Big-O is an upper bound ("never worse than this"), Big-Ω is a lower bound ("never better than this"), and Big-Θ is a tight bound where the upper and lower bounds match, meaning the algorithm always does that much work (up to constant factors) for a given input class. In casual conversation, "O(n)" is almost always shorthand for Θ(n) — e.g., "binary search is O(log n)" really means it always takes on the order of log n steps, not just "at most." The distinction actually matters for an algorithm like quicksort, which has no single Θ bound overall: Ω(n log n) best case, but O(n²) worst case.',
            },
            {
              question: 'Why is `x in some_list` inside a loop a common source of accidental O(n²) algorithms in Python, and how do you fix it?',
              answer:
                'A Python `list`\'s membership check (`x in list`) is O(n) because it has to scan the list linearly in the worst case. Calling it inside a loop that already runs n times turns an apparently-simple piece of code into O(n²) overall, even though nothing about the surrounding logic looks like a nested loop. The fix is almost always to swap the container for a `set` or `dict`, which give O(1) average-case membership checks — the algorithm\'s shape doesn\'t change at all, just the data structure backing one lookup, and the complexity drops from O(n²) to O(n).',
            },
            {
              question: 'Compare arrays and linked lists. When would you actually choose a linked list in practice?',
              answer:
                'Arrays give O(1) random access via index arithmetic but O(n) insert/delete in the middle (everything after must shift), and they have excellent cache locality since elements sit contiguously in memory. Linked lists give O(1) insert/delete *given a pointer to the right node* but O(n) access (no index arithmetic — you must walk from the head), and worse cache locality since nodes are scattered. In practice, linked lists are chosen when insertions/deletions at arbitrary, already-located positions dominate over random access — e.g., implementing an LRU cache\'s eviction order, or a undo history where you\'re always operating at a known position — and even then, many real systems still prefer an array-backed structure (like a dynamic array or a doubly linked list combined with a hash map) because cache locality often wins in wall-clock time despite equal Big-O.',
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
              question: 'Explain the difference between the Strategy of "greedy" and "dynamic programming" using activity selection vs 0/1 knapsack as contrasting examples.',
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
          ],
        },
      ],
    },
  ],
}
