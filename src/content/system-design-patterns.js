export const systemDesignPatternsSection = {
  id: 'system-design-patterns',
  label: 'System Design Patterns',
  icon: '🗺️',
  groups: [
    {
      id: 'system-design-patterns-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-a-distributed-system',
          title: 'What Is a Distributed System, and Why Do We Need One?',
          summary:
            'The foundational motivation for everything that follows: a single machine has hard physical limits, and every technique in this guide exists to work around what breaks when you spread work across many machines.',
          keyPoints: [
            'A distributed system is a collection of independent computers that coordinate over a network and present themselves to users as a single coherent system.',
            'Vertical scaling (a bigger machine) hits hard physical and economic limits; horizontal scaling (more machines) has no such ceiling, but trades that limit for an entirely new category of problems.',
            'The moment there is more than one machine, there is a network between them — and a network is slower, less reliable, and more failure-prone than a function call. This single fact is the root cause of almost everything covered in this guide.',
            'The "Fallacies of Distributed Computing" catalog the false assumptions engineers make about networks that reliably cause production incidents.',
            'Every later topic — partitioning, replication, consensus, caching, idempotency — is a structured, named answer to "how do multiple machines cooperate correctly despite an unreliable network?"',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Every technique in this guide exists to answer one underlying question: once a system outgrows a single machine, how do multiple machines cooperate correctly — and stay useful — despite failures that a single-machine system never has to think about? Before diving into any specific mechanism, it is worth being explicit about *why* single-machine solutions eventually stop working, because every later tradeoff traces back to this.',
            },
            {
              type: 'heading',
              text: 'Why Not Just Use a Bigger Machine?',
            },
            {
              type: 'p',
              text: '**Vertical scaling** (a faster CPU, more RAM, a bigger disk) is the simplest way to handle more load, and it is the right first move for a huge number of systems — it adds zero coordination complexity. But it runs into two hard limits: **physical** (there is a ceiling on how much CPU/RAM/disk a single machine can practically hold) and **economic** (the cost of ever-larger machines grows much faster than linearly, and cloud providers price the largest instance tiers at a steep premium). A single machine is also, by definition, **a single point of failure** — when it goes down, the whole system goes down with it, no matter how large it is.',
            },
            {
              type: 'p',
              text: '**Horizontal scaling** (more machines instead of a bigger one) has no such ceiling — need more capacity, add another commodity machine — and survives individual machine failures by design. That is the appeal. The cost is what this entire guide is about: coordinating many independent machines correctly is a fundamentally harder problem than running code on one.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    subgraph Vertical["Vertical Scaling"]\n        direction TB\n        Small[Small Server] -->|upgrade| Medium[Bigger Server] -->|upgrade| Huge[Biggest Server<br/>money and physics<br/>both run out]\n    end\n    subgraph Horizontal["Horizontal Scaling"]\n        direction TB\n        LB{Load Balancer / Router} --> N1[Node 1]\n        LB --> N2[Node 2]\n        LB --> N3[Node 3]\n        LB --> N4[Node N...]\n    end',
            },
            {
              type: 'heading',
              text: 'The Network Changes Everything',
            },
            {
              type: 'p',
              text: 'In a single-process program, calling a function is nearly instant and nearly always succeeds — the two things happen on the same machine, sharing memory, with no network in between. The moment two machines need to coordinate, every one of those assumptions breaks: a message can be delayed, dropped, duplicated, or arrive out of order, and — critically — **a caller cannot always tell the difference between "the request failed" and "the request succeeded but the response was lost."** That ambiguity alone is the seed of an entire later topic (idempotency and delivery semantics).',
            },
            {
              type: 'list',
              items: [
                '**The network is reliable.** It is not — packets get dropped, connections reset, links fail.',
                '**Latency is zero.** A round trip across a data center, let alone across regions, is orders of magnitude slower than an in-process call.',
                '**Bandwidth is infinite.** Large payloads and high request volume both compete for finite network capacity.',
                '**The network is secure.** Every hop is a potential attack surface; nothing crossing a network should be implicitly trusted.',
                '**Topology doesn\'t change.** Nodes get added, removed, and rescheduled constantly in any system that auto-scales or self-heals.',
                '**There is one administrator.** Real systems span teams, vendors, and cloud providers, each with their own failure modes and change schedules.',
                '**Transport cost is zero.** Serialization, encryption, and data transfer all cost real CPU and money at scale.',
                '**The network is homogeneous.** Different links, protocols, and hardware behave differently under load.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Naming these explicitly — "that design assumes the network call always succeeds, which it won\'t" — is a strong senior-level move in an interview. It is also, not coincidentally, exactly the assumption that later causes production incidents when a team skips it.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Every mechanism from here on — partitioning a dataset, replicating it, getting nodes to agree via consensus, caching to reduce network round trips, making retries safe with idempotency — is a structured, named answer to problems created directly by the fallacies above. Keep them in mind; they explain *why* each later technique exists, not just *what* it does.',
            },
          ],
        },
        {
          id: 'cap-theorem',
          title: 'The CAP Theorem — Consistency, Availability, and the Price of a Network Partition',
          summary:
            'Every distributed data system makes this tradeoff whether or not the team ever says its name out loud; understanding it precisely — not the oversimplified "pick 2 of 3" — is what separates a junior and a senior answer.',
          keyPoints: [
            'CAP: when a network partition happens, a distributed data system must choose between Consistency (every read sees the latest write) and Availability (every request gets a non-error response) — it cannot guarantee both.',
            'Partition tolerance is not really a design choice for a distributed system — networks partition regardless of what you want, so the real, ongoing decision is CP vs AP for how the system behaves *when* one happens.',
            'CP systems (etcd, ZooKeeper, HBase, MongoDB in its default majority-write config) refuse to serve a request rather than risk returning stale or conflicting data when they cannot reach a quorum.',
            'AP systems (Cassandra, Riak, DynamoDB global tables in their default multi-Region eventual mode) keep serving reads and writes through a partition and reconcile divergent replicas afterward (read repair, last-write-wins, CRDTs).',
            'CP vs AP is usually a per-operation or per-table setting, not a property of a product: Cassandra at `QUORUM` behaves very differently from Cassandra at `ONE`, and DynamoDB offers strongly consistent reads and (since mid-2025) multi-Region strong consistency as an opt-in mode.',
            'CAP only describes behavior *during* a partition — outside of one, a well-built system delivers both consistency and availability, which is exactly why the tradeoff is easy to state wrong in an interview.',
            'PACELC extends CAP: even with no partition (Else), a system still trades Latency against Consistency on every request.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Formally: in the presence of a network **P**artition, a distributed data system must choose between **C**onsistency (every read receives the most recent write, or an error) and **A**vailability (every request receives a non-error response, without guaranteeing it contains the latest write). This is not a free-form design preference — once a partition happens, one of the two has to give, and CAP says so with mathematical certainty.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    P((Partition Tolerance<br/>not really optional —<br/>networks WILL partition))\n    C((Consistency<br/>every read = latest write))\n    A((Availability<br/>every request gets a response))\n\n    C ---|"CP: refuse to answer<br/>rather than risk stale data<br/>etcd, ZooKeeper, HBase"| P\n    A ---|"AP: keep answering,<br/>reconcile after the fact<br/>Cassandra, DynamoDB, Riak"| P\n    C -.-|"CA: only true with no real<br/>partition possible at all<br/>(effectively single-node)"| A',
            },
            {
              type: 'heading',
              text: 'What Actually Happens During a Partition',
            },
            {
              type: 'p',
              text: 'Picture two data centers, each holding a replica of the same key, and the network link between them drops. A write arrives at data center A. Should A (a) accept the write and risk data center B serving stale reads until the link recovers — choosing **A**vailability — or (b) refuse the write until it can confirm data center B is reachable and in sync — choosing **C**onsistency? There is no third option that gets both; that is the entire theorem in one concrete scenario.',
            },
            {
              type: 'table',
              headers: ['System', 'Choice during a partition', 'Concrete behavior'],
              rows: [
                ['etcd / ZooKeeper / Consul', 'CP', 'Reject writes (and often reads) on the minority side of a partition until quorum is restored — exactly why they are used for leader election and config, not general-purpose app data.'],
                ['Cassandra (consistency level `ONE`) / Riak', 'AP', 'Keep accepting reads/writes on both sides during a partition; reconcile afterward. Cassandra resolves conflicts per cell with last-write-wins timestamps (not vector clocks); Riak uses dotted version vectors and can surface siblings for the app to merge.'],
                ['DynamoDB global tables (MREC, the default)', 'AP across Regions', 'Each Region accepts writes locally and replicates asynchronously (typically under a second); concurrent writes to the same item in different Regions are resolved last-writer-wins.'],
                ['DynamoDB global tables (MRSC, GA June 2025)', 'CP across Regions', 'A write is synchronously replicated to at least one other Region before it is acknowledged, giving RPO zero and strongly consistent reads in any replica — at the cost of higher write latency. The mode is chosen at table creation.'],
                ['Postgres primary + synchronous standby', 'CP-ish', 'With `synchronous_commit` waiting on a standby, the primary stalls writes if the standby is unreachable — consistency over availability, unless an operator relaxes it.'],
                ['A traditional single-node RDBMS', 'N/A', 'Not a distributed system in the CAP sense — no partition is possible with one node, so the theorem does not apply until replicas are added.'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The "C" in CAP is **linearizability** — a much stronger property than the "C" in ACID (which means "invariants are preserved"). Mixing the two up is a common source of confused interview answers. The next topic covers the full spectrum of consistency models between linearizable and eventual.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '"CA" is a common trap answer in interviews — a system that is both fully consistent and fully available with no partition tolerance can only exist if a partition is truly impossible, which in practice means a single node (or nodes close enough that the network between them is treated as infallible). Any real multi-node, multi-region system has to pick CP or AP for its partition behavior, whether or not the team ever consciously decided to.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '**PACELC** (Daniel Abadi) is the more complete version working system designers actually reach for: **if P**artitioned, choose **A**vailability or **C**onsistency (that\'s CAP); **E**lse (no partition, normal operation), choose **L**atency or **C**onsistency — because even a healthy-network synchronous quorum write to guarantee consistency adds latency versus an async, eventually-consistent write. This is why, e.g., Cassandra and DynamoDB in their default modes are roughly "PA/EL" (available under partition, low-latency/eventually-consistent normally) while Spanner, etcd, or a system requiring synchronous quorum writes is "PC/EC" even when nothing is partitioned.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '**How interviewers probe this**: "Your service is AP — what does a user actually see during a partition?" A strong answer is concrete: "the cart may show an item they removed on their other device, and we merge carts as a union on heal" — not just "eventual consistency." Always pair the letter with the user-visible anomaly and the reconciliation rule.',
            },
          ],
        },
        {
          id: 'consistency-models-clocks',
          title: 'Consistency Models, Time, and Ordering',
          summary:
            'Between "linearizable" and "eventually consistent" sits a whole spectrum of guarantees — and because physical clocks cannot be trusted, distributed systems use logical clocks to reason about ordering.',
          keyPoints: [
            'Linearizability: every operation appears to take effect atomically at a single instant between its start and end, in real-time order. Strongest single-object model; requires consensus or a single leader.',
            'Serializability is about multi-object transactions (result equals *some* serial order); strict serializability = serializable + linearizable (Spanner, CockroachDB, FoundationDB).',
            'Session guarantees — read-your-writes, monotonic reads, monotonic writes, writes-follow-reads — fix the anomalies users actually notice, and are much cheaper than linearizability.',
            'Causal consistency is the strongest model that remains available under partition; it preserves "happened-before" but lets concurrent writes be seen in different orders.',
            'Wall clocks drift and jump (NTP corrections, leap seconds, VM pauses), so "latest timestamp wins" silently loses writes. Lamport clocks give a total order consistent with causality; vector clocks detect concurrency; hybrid logical clocks (HLC) blend both with physical time.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Saying "eventually consistent" is the start of a conversation, not the end of one. Eventual consistency only promises that *if writes stop*, replicas *eventually* converge — it says nothing about what a reader sees in the meantime, including seeing a value go backwards in time. Real systems pick a more precise point on the spectrum below, and the choice determines which bugs your users can hit.',
            },
            {
              type: 'table',
              headers: ['Model', 'Guarantee', 'Available under partition?', 'Typical implementation'],
              rows: [
                ['Strict serializability', 'Transactions appear in a single serial order that respects real time', 'No', 'Spanner (TrueTime), CockroachDB, FoundationDB'],
                ['Linearizability', 'Single-object ops appear atomic and in real-time order; once a read sees a value, all later reads do too', 'No', 'Raft/Paxos log (etcd, ZooKeeper writes), single leader with sync replication'],
                ['Sequential consistency', 'All nodes see the same order, consistent with each client\'s program order, but not necessarily real time', 'No', 'ZooKeeper reads (without `sync`)'],
                ['Causal consistency', 'If A happened-before B, everyone sees A before B; concurrent ops may be seen in any order', 'Yes', 'MongoDB causally consistent sessions, COPS-style systems, CRDT-based stores'],
                ['Session guarantees', 'Read-your-writes, monotonic reads, etc., scoped to one client session', 'Mostly (sticky to a replica)', 'Sticky routing, client-carried version tokens / LSNs'],
                ['Eventual consistency', 'Replicas converge if writes stop; no ordering promise meanwhile', 'Yes', 'Cassandra at `ONE`, DNS, async read replicas'],
              ],
            },
            {
              type: 'heading',
              text: 'The Anomalies Users Actually Notice',
            },
            {
              type: 'list',
              items: [
                '**Read-your-writes violation**: a user edits their profile, the page reloads from a lagging replica, and the edit "disappears." Fix: route a user\'s reads to the leader for N seconds after a write, or have the client carry the write\'s log position (LSN/version) and only read from replicas that have caught up to it.',
                '**Monotonic-reads violation**: two refreshes hit two replicas with different lag; a comment appears, then vanishes, then reappears. Fix: pin a session to one replica (hash user ID to replica).',
                '**Causality violation**: in a chat, a reply is visible before the message it answers. Fix: causal metadata (vector clocks / dependency tracking) or a single ordered log per conversation.',
              ],
            },
            {
              type: 'heading',
              text: 'Why You Cannot Trust Wall Clocks',
            },
            {
              type: 'p',
              text: 'Physical clocks on different machines drift by milliseconds, NTP can step a clock backwards, and a GC pause or VM migration can freeze a process for seconds without it noticing. So "compare timestamps to decide which write is newer" (last-write-wins) can discard a write that really happened later. Spanner solves this with special hardware (GPS + atomic clocks) and an explicit uncertainty interval — it *waits out* the uncertainty before committing. Everyone else uses **logical clocks**.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Lamport clock vs vector clock (minimal)',
              code: `// Lamport clock: a single counter. Gives a total order consistent with causality,
// but cannot tell you whether two events were concurrent.
class LamportClock {
  private t = 0;
  tick(): number { return ++this.t; }                        // local event / send
  receive(remote: number): number {                          // on message receipt
    this.t = Math.max(this.t, remote) + 1;
    return this.t;
  }
}

// Vector clock: one counter per node. Can detect concurrency (a conflict).
type VC = Record<string, number>;

function compare(a: VC, b: VC): 'before' | 'after' | 'equal' | 'concurrent' {
  let aLess = false, bLess = false;
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[k] ?? 0, y = b[k] ?? 0;
    if (x < y) aLess = true;
    if (y < x) bLess = true;
  }
  if (aLess && bLess) return 'concurrent';   // true conflict: must merge (or keep siblings)
  if (aLess) return 'before';
  if (bLess) return 'after';
  return 'equal';
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '**Hybrid Logical Clocks (HLC)**, used by CockroachDB and YugabyteDB, combine a physical timestamp with a logical counter: they stay close to wall-clock time (useful for humans and for MVCC snapshot reads) while still never going backwards and always respecting causality. Naming HLC when asked "how do you order events across nodes without TrueTime?" is a strong signal.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**CRDTs** (conflict-free replicated data types — G-counters, OR-sets, LWW-registers, sequence CRDTs used by collaborative editors) guarantee convergence without coordination, but only for operations that are commutative by design. They do not help with invariants like "balance must not go below zero" — anything that needs a global check still needs coordination.',
            },
          ],
        },
        {
          id: 'basic-sharding-partitioning',
          title: 'Partitioning (Sharding) a Dataset — the Basic Idea',
          summary:
            'Before consistent hashing solves the rebalancing problem elegantly, it helps to see the plain version of the problem: split a dataset across multiple machines, and decide, simply, what goes where.',
          keyPoints: [
            'Partitioning (sharding) splits a large dataset across multiple machines because a single machine eventually cannot hold or serve all of it — the data-layer version of the vertical-vs-horizontal scaling problem.',
            'Hash-based partitioning spreads keys evenly across shards but destroys range-query locality; range-based partitioning keeps ranges together for efficient range scans but risks a hot shard when access is skewed.',
            'A naive `hash(key) % N` scheme remaps nearly every key whenever N changes — the exact pain point consistent hashing (the next topic) exists to fix.',
            'Something has to know which shard owns which key or range — a routing/directory layer, or client-side logic embedding the rule — and that component becomes critical infrastructure in its own right.',
            'Partitioning and replication solve different problems and are used together in practice: partitioning scales throughput/storage by splitting data up, replication adds durability/availability by copying it.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The same problem that motivates horizontal scaling of compute applies directly to data: a dataset can grow past what one machine can store or serve. **Partitioning** (also called **sharding**) is the answer — split the dataset into pieces (**shards**, or **partitions**) and place each piece on a different machine, so no single machine needs to hold everything.',
            },
            {
              type: 'heading',
              text: 'Two Basic Strategies',
            },
            {
              type: 'list',
              items: [
                '**Hash-based partitioning**: compute `hash(key)`, then assign the key to a shard based on that hash (e.g., `hash(key) % N`). Spreads keys roughly evenly across shards regardless of the key values themselves, which avoids hot shards from sequential or skewed key patterns — but two keys that were adjacent before hashing end up on unrelated shards, so an efficient range scan ("all orders between two dates") is no longer possible on one shard.',
                '**Range-based partitioning**: assign contiguous ranges of the key space to each shard (shard 1 owns A-H, shard 2 owns I-P, and so on). Keeps range scans fast and local to one or a few shards, but is vulnerable to a **hot shard**: if writes are skewed toward one part of the key space (the classic case — a table partitioned by timestamp means every *current* write lands on the single "latest" shard), that one shard takes disproportionate load while the others sit idle.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    Data[(Full Dataset<br/>too large / too hot for one machine)] --> Strategy{Partitioning Strategy}\n    Strategy -->|hash key, e.g. hash key mod 3| Shard1[(Shard 1<br/>scattered keys)]\n    Strategy -->|hash key, e.g. hash key mod 3| Shard2[(Shard 2<br/>scattered keys)]\n    Strategy -->|hash key, e.g. hash key mod 3| Shard3[(Shard 3<br/>scattered keys)]\n\n    Data -.->|OR: range of keys| RShard1[(Shard A: keys A-H)]\n    Data -.->|OR: range of keys| RShard2[(Shard B: keys I-P)]\n    Data -.->|OR: range of keys| RShard3[(Shard C: keys Q-Z)]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The naive version of hash-based partitioning — `hash(key) % N` — has a serious flaw: change `N` (add or remove one machine) and the modulo result changes for almost every key, forcing a near-total data reshuffle. That flaw is significant enough to be worth its own topic: **consistent hashing**, next, is the standard fix.',
            },
            {
              type: 'heading',
              text: 'Something Has to Know Where a Key Lives',
            },
            {
              type: 'p',
              text: 'Whichever strategy is used, a client or gateway needs to be able to answer "which shard owns this key?" before it can route a request — either by running the same partitioning function client-side, or by asking a **routing/directory service** that tracks shard boundaries explicitly (this is how systems like Vitess, MongoDB\'s `mongos` router, and HBase\'s region servers actually work in production, as opposed to a client blindly hashing). That routing layer becomes critical infrastructure: if it is wrong or unavailable, requests go to the wrong shard, or nowhere at all.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Partitioning and replication solve different problems and are almost always used together: partitioning splits data up to scale storage/throughput across machines; replication copies each partition onto multiple machines for durability and availability. A production cluster shards the dataset into partitions *and* replicates each partition — see the next two topics.',
            },
            {
              type: 'heading',
              text: 'Choosing the Shard Key — the Decision You Cannot Easily Undo',
            },
            {
              type: 'p',
              text: 'The shard key determines which queries are cheap (single-shard) and which are expensive (scatter-gather across every shard). Pick it from the dominant access pattern: a multi-tenant SaaS shards by `tenant_id` so every tenant query hits one shard; a chat app shards messages by `conversation_id` so a conversation\'s history is one range scan. Changing it later means rewriting every row, so it is the single highest-stakes decision in a sharded design.',
            },
            {
              type: 'table',
              headers: ['Concern', 'What goes wrong', 'Mitigation'],
              rows: [
                ['Hot key / celebrity problem', 'One key (a viral post, a giant tenant) gets far more traffic than any shard can absorb; hashing does not help because it is one key.', 'Split the key with a suffix (`post:123#0..15`) and aggregate on read; cache it aggressively; give whale tenants dedicated shards.'],
                ['Monotonic keys', 'Auto-increment IDs or timestamps under range partitioning send all inserts to the last shard.', 'Hash-prefix the key, use random/UUIDv7-with-hash IDs, or compound keys like `(tenant_id, created_at)`.'],
                ['Cross-shard queries', 'Queries not keyed by the shard key must fan out to every shard; tail latency becomes the slowest shard.', 'Denormalize a second copy keyed differently, or maintain a global secondary index.'],
                ['Cross-shard transactions', 'An operation touching two shards loses single-node ACID.', 'Design aggregates to live on one shard; otherwise use a Saga or a database with distributed transactions (Spanner, CockroachDB, Vitess with 2PC).'],
                ['Resharding', 'Splitting a shard while it serves traffic risks downtime or lost writes.', 'Pre-split into many more logical partitions than physical nodes (e.g. 1,024 logical shards on 8 machines) and move whole logical partitions; use online copy + CDC catch-up + cutover.'],
              ],
            },
            {
              type: 'heading',
              text: 'Local vs Global Secondary Indexes',
            },
            {
              type: 'p',
              text: 'A **local** (document-partitioned) index lives on each shard and only indexes that shard\'s rows — writes stay single-shard and cheap, but a query by the indexed column must scatter-gather to all shards (Cassandra/Elasticsearch-style). A **global** (term-partitioned) index is itself partitioned by the indexed value — a lookup hits one index shard, but every write now touches two places, so the index is usually updated asynchronously and is eventually consistent (DynamoDB GSIs work this way). Name the tradeoff explicitly when an interviewer asks "how would you look up orders by email if you shard by user ID?"',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Logical shards decouple the key from physical placement',
              code: `const LOGICAL_SHARDS = 1024; // fixed forever; never changes

// Stable: a key always maps to the same logical shard.
function logicalShard(tenantId: string): number {
  return murmur3(tenantId) % LOGICAL_SHARDS;
}

// Mutable: a small directory (stored in etcd / a config table, cached in every router)
// maps logical shards to physical clusters. Rebalancing = moving entries here.
const directory: Map<number, string> = loadShardDirectory(); // e.g. 0-127 -> "pg-cluster-a"

function routeFor(tenantId: string): string {
  return directory.get(logicalShard(tenantId))!;
}`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Do not shard prematurely. A single well-tuned Postgres or MySQL primary with read replicas handles far more than most teams assume (multiple terabytes and tens of thousands of transactions per second on modern hardware). Exhaust vertical scaling, read replicas, caching, and archiving cold data first — sharding permanently taxes every feature you build afterward.',
            },
          ],
        },
        {
          id: 'consistent-hashing',
          title: 'Consistent Hashing — Adding a Node Without Reshuffling Everything',
          summary:
            'The mechanism behind scaling a sharded system without a catastrophic amount of data movement every time a node joins or leaves.',
          keyPoints: [
            'Plain `hash(key) % N` sharding remaps almost every key when N changes — a catastrophic amount of data movement on every node add/remove.',
            'Consistent hashing maps both nodes and keys onto a hash ring; a key belongs to the first node found walking clockwise from its hash position.',
            'Adding or removing a node only affects the keys in its immediate arc on the ring — roughly `1/N` of all keys, not all of them.',
            'Virtual nodes give each physical node many positions on the ring so load balances statistically, and a failed node\'s load spreads across many survivors.',
            'Saying "we hash mod N" for a system expected to scale is an interview flag; naming consistent hashing (or range-based sharding with a routing service) is the senior-level answer.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**The problem it solves**: with plain `hash(key) % N` sharding, adding or removing one node changes `N`, which remaps almost every key to a different node — a catastrophic amount of data movement, exactly the flaw called out at the end of the previous topic.',
            },
            {
              type: 'p',
              text: '**How it works**: map both nodes and keys onto a hash ring (0 to 2^32-1). A key belongs to the first node found walking clockwise from the key\'s hash position. Adding/removing a node only affects the keys between it and its predecessor on the ring — roughly `1/N` of all keys, not all of them.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    subgraph Ring["Hash Ring (0 to 2^32-1)"]\n        direction LR\n        NodeA((Node A)) --- KeyRange1[keys hash here -> Node A]\n        NodeB((Node B)) --- KeyRange2[keys hash here -> Node B]\n        NodeC((Node C)) --- KeyRange3[keys hash here -> Node C]\n    end',
            },
            {
              type: 'heading',
              text: 'Virtual Nodes',
            },
            {
              type: 'p',
              text: 'A raw hash ring can still be unbalanced (a node might land on a large arc of the ring by chance, or a small one). Production systems assign each physical node **many virtual nodes** (tokens) scattered around the ring, so load balances statistically across physical nodes regardless of ring geometry, and losing one physical node spreads its load thinly across many other nodes instead of dumping it all on one neighbor. Virtual nodes also let you give a bigger machine proportionally more tokens.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Real-world numbers change over time**: Cassandra used 256 tokens per node by default for years, but Cassandra 4.0 lowered the default `num_tokens` to 16 combined with a smarter token-allocation algorithm, because very high vnode counts made repairs and streaming slower and hurt availability with many nodes. And the managed DynamoDB service does not use a literal hash ring at all — it hashes the partition key into partitions whose placement is tracked by a metadata/routing service (the original 2007 Dynamo paper is where the ring-with-vnodes design comes from).',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'A consistent-hash ring with virtual nodes',
              code: `import { createHash } from 'node:crypto';

const h = (s: string) => createHash('md5').update(s).digest().readUInt32BE(0);

class HashRing {
  private ring: { pos: number; node: string }[] = [];
  constructor(nodes: string[], private vnodes = 128) { nodes.forEach((n) => this.add(n)); }

  add(node: string) {
    for (let i = 0; i < this.vnodes; i++) this.ring.push({ pos: h(\`\${node}#\${i}\`), node });
    this.ring.sort((a, b) => a.pos - b.pos);
  }

  remove(node: string) { this.ring = this.ring.filter((v) => v.node !== node); }

  // First vnode clockwise from the key's position (binary search), wrapping around.
  get(key: string): string {
    const p = h(key);
    let lo = 0, hi = this.ring.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; this.ring[mid].pos < p ? (lo = mid + 1) : (hi = mid); }
    return this.ring[lo % this.ring.length].node;
  }

  // Replication: walk clockwise collecting N *distinct physical* nodes.
  preferenceList(key: string, n: number): string[] {
    const out: string[] = [];
    let i = this.ring.findIndex((v) => v.pos >= h(key));
    if (i < 0) i = 0;
    for (let j = 0; out.length < n && j < this.ring.length; j++) {
      const node = this.ring[(i + j) % this.ring.length].node;
      if (!out.includes(node)) out.push(node);
    }
    return out;
  }
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Alternatives worth naming: **rendezvous (highest-random-weight) hashing** — each key picks the node with the highest `hash(key, node)`; no ring, minimal remapping, popular for picking cache/CDN nodes — and **jump consistent hash** (Google, 2014), which is tiny and perfectly balanced but only supports adding/removing nodes at the end of a numbered list. Envoy offers ring-hash and Maglev load-balancing policies built on these ideas.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If you say "we hash mod N" for a system expected to scale/rebalance, that\'s a flag. Reaching for consistent hashing (or explicitly saying "partitions tracked by a routing/config service that maps partitions or key ranges to nodes," which DynamoDB, HBase, Bigtable, CockroachDB, and Vitess actually use in practice instead of a literal ring) is the senior-level answer.',
            },
          ],
        },
        {
          id: 'replication-strategies',
          title: 'Replication Strategies',
          summary:
            'Single-leader, multi-leader, and leaderless replication trade off write availability, conflict handling, and read consistency differently.',
          keyPoints: [
            'Single-leader: all writes go to one leader, reads can go to either; simple, but the leader is a write bottleneck and failover needs leader election.',
            'Multi-leader: multiple nodes accept writes, trading better write availability for the need to resolve write conflicts.',
            'Leaderless (quorum-based): any replica can accept a write; `W + R > N` guarantees overlap between write and read sets, giving tunable per-operation consistency.',
            'Disagreeing replicas on a read are resolved with read repair or hinted handoff.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Single-leader (leader-follower)**: all writes go to one leader, replicated to followers; reads can go to either (stale on followers). Simple, but the leader is a write bottleneck and a failover event (leader dies) needs a leader-election mechanism and has a brief unavailability window. Used by: Postgres/MySQL standard replication, MongoDB replica sets.',
                '**Multi-leader**: multiple nodes accept writes (e.g., one per data center), replicating to each other. Better write availability and lower write latency per region, but **write conflicts** are now possible and need a resolution strategy (last-write-wins by timestamp, version vectors, or application-level merge/CRDTs).',
                '**Leaderless (quorum-based)**: any replica can accept a write; a write is considered successful once acknowledged by `W` replicas, a read once `R` replicas agree, with `W + R > N` guaranteeing overlap between write and read sets (Dynamo-style). Tunable per-operation consistency (favor availability with `W=1` or consistency with `W=N`). Used by: Cassandra, DynamoDB, Riak.',
              ],
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Client\n    participant N1 as Replica 1\n    participant N2 as Replica 2\n    participant N3 as Replica 3\n    Note over N1,N3: Quorum write, N=3, W=2\n    Client->>N1: write(key, value)\n    Client->>N2: write(key, value)\n    Client->>N3: write(key, value)\n    N1-->>Client: ack\n    N2-->>Client: ack\n    Note over Client: 2 of 3 acked -> write succeeds<br/>(doesn\'t wait for N3)',
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Follow-up interviewers ask**: "what if two replicas disagree on a read?" → read repair (return the latest by version/timestamp, and push the correct value to the stale replica), hinted handoff (if a replica was down during a write, another node temporarily holds the write on its behalf and delivers it once the original comes back), and periodic **anti-entropy repair** using Merkle trees to find and fix divergent ranges without comparing every row.',
            },
            {
              type: 'heading',
              text: 'Synchronous vs Asynchronous Replication',
            },
            {
              type: 'table',
              headers: ['Mode', 'Durability on leader crash', 'Write latency', 'Availability'],
              rows: [
                ['Asynchronous', 'Acknowledged writes not yet shipped are lost (RPO > 0)', 'Lowest', 'Highest — followers never block writes'],
                ['Synchronous (all followers)', 'No loss', 'Highest, bounded by slowest follower', 'Poor — any follower outage blocks writes'],
                ['Semi-synchronous / quorum (e.g. 1 of N standbys, `ANY 1 (s1, s2)` in Postgres)', 'No loss if the acked standby survives', 'One extra round trip to the fastest standby', 'Good — tolerates individual follower failures'],
              ],
            },
            {
              type: 'heading',
              text: 'Failover Is Where Replication Gets Dangerous',
            },
            {
              type: 'list',
              items: [
                '**Split brain**: the old leader was only partitioned, not dead, and keeps accepting writes after a new leader is promoted. Prevent with consensus-based leader election plus **fencing** (the old leader\'s writes are rejected because its epoch/term is stale), or STONITH in classic HA setups.',
                '**Lost writes on async failover**: the promoted follower was behind; writes the old leader acknowledged vanish. If those IDs were already used elsewhere (e.g. cached, sent in emails), you get duplicate or dangling references — a real GitHub outage in 2012 was caused by exactly this with auto-increment keys.',
                '**Failure detection is a guess**: a timeout too short causes needless failovers under load spikes (which add more load); too long extends outages. Tools like Patroni (Postgres, backed by etcd/Consul) or managed services (Aurora, Cloud SQL HA) encode these tradeoffs for you.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`W + R > N` does not by itself give linearizability. With sloppy quorums (hinted handoff to nodes outside the preference list), concurrent writes, or a write that failed on some replicas but succeeded on others, a quorum read can still return stale or flip-flopping values. Treat Dynamo-style quorums as "usually fresh," and use a consensus-based store or lightweight transactions (Cassandra `IF` / Paxos) when you need a real compare-and-set.',
            },
          ],
        },
        {
          id: 'database-internals',
          title: 'Database Internals: How Storage Engines Actually Work',
          summary:
            'B-trees and LSM trees make fundamentally different read/write tradeoffs, and a write-ahead log is the universal durability mechanism underneath both.',
          keyPoints: [
            'B-trees update in place and are read-optimized (Postgres, MySQL/InnoDB) — great for read-heavy, moderate-write OLTP workloads.',
            'LSM trees buffer writes in memory and flush as immutable sorted files, turning random writes into sequential ones (Cassandra, RocksDB, LevelDB).',
            'Bloom filters let an LSM read skip SSTables that definitely don\'t contain a key, avoiding unnecessary disk reads.',
            'A write-ahead log (WAL) is the universal durability mechanism: append the change durably before mutating the in-memory structure.',
            'Composite indexes only help queries whose filter/sort order is a left-prefix of the index\'s column order.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'B-Trees',
            },
            {
              type: 'p',
              text: '(used by Postgres, MySQL/InnoDB): balanced tree structure, each node holds sorted keys and pointers; reads and writes are O(log n) with a small constant (few disk seeks due to high fan-out). Writes are in-place, which makes B-trees great for read-heavy, moderate-write workloads but means a single write can touch multiple pages (write amplification from page splits).',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    Root["Root node<br/>sorted keys + pointers"] --> N1["Node: keys 1-100"]\n    Root --> N2["Node: keys 101-200"]\n    Root --> N3["Node: keys 201-300"]\n    N1 --> L1["Leaf: rows for keys 1-33"]\n    N1 --> L2["Leaf: rows for keys 34-66"]\n    N1 --> L3["Leaf: rows for keys 67-100"]\n    Write["Write key=45"] -.->|"in-place update,<br/>may split a full page"| L2\n    Read["Read key=45"] -.->|"O(log n): Root -> N1 -> L2"| L2',
            },
            {
              type: 'p',
              text: 'The shape to notice: a read for one key walks straight down from the root to one leaf — a handful of pointer hops regardless of how many rows the table has, which is exactly what "O(log n) with a small constant" means in practice. A write to an existing key updates that same leaf page in place; the cost only shows up when a page is full and has to split, which is where the "write amplification" mentioned above comes from.',
            },
            {
              type: 'heading',
              text: 'LSM Trees (Log-Structured Merge Trees)',
            },
            {
              type: 'p',
              text: '(used by Cassandra, RocksDB, LevelDB, and under the hood in many "NoSQL" stores): writes go to an in-memory structure (memtable) plus an append-only write-ahead log for durability; when the memtable fills, it\'s flushed to disk as an immutable sorted file (SSTable). Reads may need to check multiple SSTables (mitigated by bloom filters to skip files that definitely don\'t contain the key) plus the memtable. A background **compaction** process merges and discards obsolete/overwritten entries across SSTable levels. LSM trees turn random writes into sequential writes (much faster on both spinning disks and, to a lesser extent, SSDs), trading it for read amplification (multiple files to check) and compaction overhead (background CPU/IO). This is *the* mechanism behind "NoSQL stores have better write throughput" — know it\'s LSM trees, not magic.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    Write[Write request] --> WAL[Write-Ahead Log<br/>append-only, durability]\n    Write --> Memtable[Memtable<br/>in-memory sorted structure]\n    Memtable -->|fills up| Flush[Flush to disk]\n    Flush --> SSTable1[SSTable Level 0]\n    SSTable1 -->|compaction| SSTable2[SSTable Level 1<br/>merged, deduped]\n    SSTable2 -->|compaction| SSTable3[SSTable Level 2]\n    Read[Read request] --> Memtable\n    Read --> BloomFilter{Bloom filter:<br/>might key exist?}\n    BloomFilter -->|maybe| SSTable1\n    BloomFilter -->|maybe| SSTable2',
            },
            {
              type: 'heading',
              text: 'Write-Ahead Log (WAL)',
            },
            {
              type: 'p',
              text: 'Before any in-memory structure is mutated, the change is appended to a durable, sequential log. If the process crashes, the WAL is replayed on restart to recover state that hadn\'t yet been flushed. This is the universal durability mechanism underneath both relational DBs and LSM-based stores — mention it whenever discussing "how do you not lose data on a crash."',
            },
            {
              type: 'heading',
              text: 'Indexing',
            },
            {
              type: 'p',
              text: 'A secondary index is itself a separate B-tree/LSM structure mapping indexed-column values to primary keys/row locations — which is why every index speeds up reads on that column but slows down writes (every write now updates N index structures, not just the primary one) and consumes additional storage. Composite indexes only help queries whose filter/sort order is a left-prefix of the index\'s column order — a frequently-tested subtlety.',
            },
          ],
        },
        {
          id: 'consensus-algorithms',
          title: 'Consensus Algorithms — Paxos, Raft, and Why They Exist',
          summary:
            'Consensus lets multiple nodes agree on a single value or order despite failures and network delays — the mechanism underneath leader election, distributed locks, and strongly-consistent replicated logs.',
          keyPoints: [
            'Consensus is needed for leader election, distributed locks, config stores, and any strongly-consistent replicated log.',
            'Paxos proves consensus is achievable in an asynchronous network with crash failures, but is notoriously hard to implement correctly.',
            'Raft was designed explicitly to be more understandable, decomposing into Leader, Follower, and Candidate roles.',
            'A leader is elected by majority vote; log entries commit once replicated to a majority; randomized election timeouts avoid split-vote livelock.',
            'Consensus clusters run with an odd number of nodes (3 or 5) to maximize fault tolerance per node deployed.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Consensus is needed whenever multiple nodes must agree on a single value/order despite failures and network delays — leader election, distributed locks, config stores, and any strongly-consistent replicated log. This is also the mechanism a CP system (previous CAP theorem topic) reaches for to implement its consistency guarantee correctly.',
            },
            {
              type: 'heading',
              text: 'Paxos',
            },
            {
              type: 'p',
              text: 'The original proof that consensus is achievable in an asynchronous network with crash failures; notoriously hard to understand and implement correctly, so it\'s rarely implemented from scratch in interviews — know that it exists and what it guarantees (safety: never agree on two different values; a majority quorum is required to make progress).',
            },
            {
              type: 'heading',
              text: 'Raft',
            },
            {
              type: 'p',
              text: 'Designed explicitly to be more understandable than Paxos, and is what most modern systems actually implement (etcd, Consul, CockroachDB, Kafka\'s KRaft mode). Three roles: **Leader** (handles all client writes, replicates a log to followers), **Follower** (passive, applies the leader\'s log), **Candidate** (a follower that hasn\'t heard from a leader within a timeout, so it starts an election). A leader is elected by majority vote; log entries are committed once replicated to a majority; if the leader fails, a new election happens after a randomized timeout (randomization avoids split-vote livelock).',
            },
            {
              type: 'mermaid',
              code: 'stateDiagram-v2\n    [*] --> Follower\n    Follower --> Candidate : election timeout elapses, no heartbeat from leader\n    Candidate --> Leader : receives majority of votes\n    Candidate --> Follower : discovers current leader or higher term\n    Leader --> Follower : discovers a node with higher term (steps down)\n    Candidate --> Candidate : election timeout, split vote, retry with new term',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '**Why this matters practically**: whenever your HLD answer includes "a distributed lock," "leader election," "a strongly consistent config store," or "a replicated log for a database," the mechanism underneath is Raft (or Paxos) — naming it, and knowing it needs a majority quorum to make progress (hence deploying an odd number of nodes: 3 or 5, tolerating 1 or 2 failures respectively), is a strong senior/staff signal.',
            },
            {
              type: 'heading',
              text: 'Terms, Commit Rules, and Linearizable Reads',
            },
            {
              type: 'list',
              items: [
                '**Terms** are Raft\'s logical clock: every election increments the term, and any message carrying a stale term is rejected. This is what stops a deposed leader that wakes up from a GC pause from corrupting the log.',
                '**Election restriction**: a node only votes for a candidate whose log is at least as up to date as its own, so a newly elected leader always contains every committed entry.',
                '**Commit**: an entry is committed once stored on a majority; the leader only counts replicas toward committing entries from its *own* term (earlier-term entries commit indirectly), a subtle rule that closes a real safety hole.',
                '**Reads are not free**: a leader that serves reads from local state might already have been deposed. Linearizable reads use a **ReadIndex** round (confirm leadership with a heartbeat quorum) or a **leader lease** (which relies on bounded clock drift). etcd defaults to linearizable reads and offers a cheaper `serializable` read option that may be stale.',
              ],
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant C as Client\n    participant L as Leader (term 7)\n    participant F1 as Follower 1\n    participant F2 as Follower 2\n    C->>L: SET x=5\n    L->>L: append entry #42 (term 7)\n    par replicate\n        L->>F1: AppendEntries #42\n        L->>F2: AppendEntries #42\n    end\n    F1-->>L: ok\n    Note over L: 2 of 3 have #42 -> committed\n    L->>L: apply to state machine\n    L-->>C: OK\n    F2-->>L: ok (late, harmless)',
            },
            {
              type: 'table',
              headers: ['Where consensus shows up (2026)', 'Notes'],
              rows: [
                ['etcd (Kubernetes control plane)', 'Raft; every Kubernetes object lives here, which is why etcd latency and disk fsync speed matter for cluster health.'],
                ['Apache Kafka (KRaft)', 'Kafka 4.0 (2025) removed ZooKeeper entirely; cluster metadata is a Raft-replicated log managed by controller nodes.'],
                ['CockroachDB, TiKV, YugabyteDB', 'Multi-Raft: one Raft group per data range, thousands per cluster, so consensus scales horizontally.'],
                ['Google Spanner, Chubby', 'Paxos (Multi-Paxos) per split; Chubby is the lock service that inspired ZooKeeper.'],
                ['ZooKeeper', 'ZAB (ZooKeeper Atomic Broadcast) — a Paxos-family protocol; still used by HBase, older Kafka, Solr.'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Consensus tolerates **crash** failures, not malicious (**Byzantine**) ones — a node that lies breaks Raft. Byzantine fault tolerance (PBFT, Tendermint, HotStuff) needs 3f+1 nodes to tolerate f liars and is mostly relevant to blockchains and cross-organization systems, not to a typical backend. Also: never stretch a 3-node Raft cluster across 2 data centers — losing the DC with 2 nodes takes the whole cluster down. Use 3 zones (or 5 nodes across 3 zones).',
            },
          ],
        },
        {
          id: 'distributed-locks-leases',
          title: 'Distributed Locks, Leases, Leader Election, and Fencing Tokens',
          summary:
            'Mutual exclusion across machines is harder than it looks: a lock holder can pause, lose its lease, and keep writing. Leases bound the damage; fencing tokens are what actually make it safe.',
          keyPoints: [
            'A distributed lock must have a lease (TTL) — otherwise a crashed holder blocks everyone forever. But a lease means a slow holder can lose the lock without knowing it.',
            'Process pauses (GC, VM steal, page faults, a blocked syscall) can last longer than any lease, so "check I hold the lock, then write" is a race no matter how careful the client is.',
            'Fencing tokens fix it: the lock service hands out a monotonically increasing number with each grant, and the protected resource rejects any write carrying a token lower than one it has already seen.',
            'Efficiency locks (avoid doing work twice; occasional overlap is harmless) can use a single Redis `SET NX PX`. Correctness locks (overlap corrupts data) need a consensus-backed service (etcd, ZooKeeper, Consul) plus fencing.',
            'Often the best lock is no lock: a conditional write (`UPDATE ... WHERE version = ?`), a unique constraint, or single-writer partitioning removes the need for one entirely.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Typical needs: "only one instance should run the nightly billing job," "only one worker should process this user\'s ledger at a time," "only one replica should be the active scheduler." The naive implementation — acquire a lock in Redis, do the work, release it — works in the demo and fails in production in a specific, well-documented way.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant A as Client A\n    participant L as Lock Service\n    participant B as Client B\n    participant S as Storage\n    A->>L: acquire (lease 10s)\n    L-->>A: granted, token=33\n    Note over A: long GC pause (15s)\n    Note over L: lease expires\n    B->>L: acquire\n    L-->>B: granted, token=34\n    B->>S: write(data, token=34)\n    S-->>B: ok, highest seen = 34\n    Note over A: wakes up, still thinks it holds the lock\n    A->>S: write(data, token=33)\n    S-->>A: REJECTED: 33 < 34',
            },
            {
              type: 'p',
              text: 'Without the token check in the storage layer, Client A\'s stale write would silently overwrite Client B\'s — both clients believed they held the lock at the moment they wrote. No amount of re-checking on the client side closes this window, because the pause can happen between the check and the write. This is the core of Martin Kleppmann\'s well-known critique of using Redlock for correctness.',
            },
            {
              type: 'code',
              language: 'sql',
              title: 'Fencing enforced by the resource (Postgres)',
              code: `-- The protected row remembers the highest fencing token that has written to it.
UPDATE jobs
SET    state = 'done',
       result = $1,
       fence_token = $2
WHERE  id = $3
  AND  fence_token < $2;      -- stale holder => 0 rows updated => abort

-- The same idea without a lock service at all: optimistic concurrency.
UPDATE accounts
SET    balance = balance - 50, version = version + 1
WHERE  id = 42 AND version = 17;  -- 0 rows => someone else won; reload and retry`,
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Efficiency lock in Redis: acquire with NX + PX, release only if still the owner',
              code: `import { randomUUID } from 'node:crypto';

const RELEASE = \`
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0\`;

async function withLock<T>(redis: Redis, key: string, ttlMs: number, fn: () => Promise<T>) {
  const owner = randomUUID();
  const ok = await redis.set(key, owner, 'PX', ttlMs, 'NX');   // atomic acquire
  if (ok !== 'OK') return null;                               // someone else has it
  try {
    return await fn();   // must finish well within ttlMs, or extend the lease
  } finally {
    // Compare-and-delete atomically, so we never delete a lock someone else now owns.
    await redis.eval(RELEASE, 1, key, owner);
  }
}`,
            },
            {
              type: 'table',
              headers: ['Option', 'Safety', 'When to use'],
              rows: [
                ['Single Redis/Valkey `SET NX PX`', 'Lost on failover (async replication); no fencing token', 'Efficiency only: dedupe cron runs, rate-limit expensive recomputes'],
                ['Redlock (N independent Redis masters)', 'Depends on bounded clock drift and pauses; still no fencing token', 'Rarely worth the complexity; if you need correctness use consensus'],
                ['etcd lease + revision / ZooKeeper ephemeral sequential node', 'Linearizable; revision or zxid usable as fencing token', 'Correctness locks, leader election (Kubernetes `Lease` objects are built on this)'],
                ['Database row lock / advisory lock (`pg_advisory_lock`)', 'As strong as the DB; held only while the session lives', 'When the protected work is in the same database anyway'],
                ['Conditional write / unique constraint', 'Strongest and simplest', 'Whenever the invariant can be expressed as a single atomic write'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '**Leader election is just a long-lived lock with heartbeats.** In Kubernetes, controllers use a `coordination.k8s.io/v1` Lease object: the leader renews it periodically; standbys take over if it is not renewed within the lease duration. The same fencing caveat applies — a deposed leader must stop acting the moment it fails to renew, and downstream systems should reject its stale epoch.',
            },
          ],
        },
        {
          id: 'load-balancing',
          title: 'Load Balancing — Algorithms and Layers',
          summary:
            'L4 vs L7 balancing, the common routing algorithms, and why production systems combine active and passive health checks.',
          keyPoints: [
            'Layer 4 balances on IP/port only, very fast but content-blind; Layer 7 inspects HTTP for content-based routing at the cost of overhead.',
            'Round robin ignores load; least connections is better for long-lived/uneven-duration requests.',
            'Consistent hashing keeps the same client/key routed to the same server — critical for sticky sessions and cache locality.',
            'Production systems combine active health checks (pinging `/health`) with passive ones (ejecting servers observed erroring in real traffic).',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Layer 4 (transport layer)**: balances based on IP/port, doesn\'t inspect HTTP content, very fast, can\'t route based on URL path or headers.',
                '**Layer 7 (application layer)**: inspects HTTP request (path, headers, cookies), enabling content-based routing (`/api/*` → service A, `/static/*` → CDN), but adds overhead from parsing/terminating connections.',
                '**Round robin**: simplest, cycles through servers; ignores actual server load.',
                '**Least connections**: routes to the server with the fewest active connections; better for long-lived/uneven-duration requests.',
                '**Consistent hashing**: routes the same client/key to the same server consistently — critical for sticky sessions or when a server holds in-memory state/cache for a key (e.g., WebSocket connection gateways, or a caching layer where you want the same key always hitting the same cache instance to maximize hit ratio). The same hash-ring mechanism from earlier in this guide, applied to routing instead of storage.',
                '**Health checks**: active (LB pings a `/health` endpoint periodically) vs passive (LB observes real traffic failures and ejects a server that\'s erroring). Production systems use both.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    Client([Client requests]) --> LB{Load Balancer}\n    LB -->|round robin /<br/>least connections /<br/>consistent hash| S1[Server 1]\n    LB --> S2[Server 2]\n    LB --> S3[Server 3]\n\n    LB -.->|active health check:<br/>periodic GET /health| S1\n    LB -.->|active health check| S2\n    LB -.->|active health check| S3\n    S3 -.->|passive: real traffic erroring<br/>-> ejected from rotation| LB',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A retried request that a load balancer routes to a *different* backend than the one that timed out is exactly the ambiguous-failure scenario from the idempotency topic later in this guide — the client cannot assume the first backend didn\'t already process it.',
            },
            {
              type: 'heading',
              text: 'Beyond Round Robin: Algorithms Production Proxies Actually Use',
            },
            {
              type: 'table',
              headers: ['Algorithm', 'How it decides', 'Strength', 'Weakness'],
              rows: [
                ['Round robin / weighted RR', 'Next server in order (weights for bigger boxes)', 'Trivial, stateless', 'Blind to slow or overloaded backends'],
                ['Least connections / least request', 'Fewest in-flight requests', 'Adapts to uneven request cost', 'Needs global view; many LBs each see only their own traffic'],
                ['Power of two choices (P2C)', 'Pick 2 random backends, send to the less loaded', 'Near-optimal balance with no global state; avoids herding onto one "best" server', 'Slightly worse than perfect information (which you never have anyway)'],
                ['Peak EWMA / latency-aware', 'Weight by exponentially weighted moving average of latency', 'Routes around slow (not just dead) instances', 'Can oscillate; needs tuning'],
                ['Ring hash / Maglev', 'Consistent hash on a header, cookie, or key', 'Cache affinity, sticky sessions', 'Hot keys overload one backend'],
              ],
            },
            {
              type: 'p',
              text: 'Envoy\'s `LEAST_REQUEST` policy is, by default, P2C over in-flight requests (`choice_count` defaults to 2), which is why it behaves well even with many independent proxies (one per pod in a service mesh). The deeper insight: in a fleet with many load balancers, "send to the globally least-loaded server" causes every LB to pick the same server at once — randomization is a feature, not a compromise.',
            },
            {
              type: 'heading',
              text: 'Where Load Balancing Lives',
            },
            {
              type: 'list',
              items: [
                '**DNS / GeoDNS / anycast** (Route 53 latency routing, Cloudflare anycast): picks a region or PoP. Coarse and slow to change because of DNS caching and TTLs.',
                '**L4 network LB** (AWS NLB, Google Maglev, Katran/IPVS): millions of connections per second, preserves client IP, cannot see HTTP.',
                '**L7 edge proxy / API gateway** (ALB, Envoy, NGINX, HAProxy, cloud API gateways): TLS termination, path/header routing, auth, rate limiting.',
                '**Client-side / sidecar LB** (gRPC client LB, service mesh sidecars): each caller balances across instances discovered from a registry. Essential for gRPC, because HTTP/2 multiplexes many requests over one long-lived TCP connection — an L4 balancer would pin all of a client\'s traffic to one backend.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Health checks that check too much**: if `/health` also verifies the database, a brief DB blip makes every instance fail its check at once and the LB ejects the entire fleet — turning a partial outage into a total one. Keep liveness checks shallow (is this process able to serve?), use readiness checks for warm-up, and configure a **panic threshold** (Envoy routes to all hosts anyway if too many are marked unhealthy).',
            },
          ],
        },
        {
          id: 'resilience-patterns',
          title: 'Resilience Patterns: Timeouts, Retries, Circuit Breakers, and Bulkheads',
          summary:
            'In a call graph of dozens of services, something is always failing. These patterns stop a local failure from becoming a cascading, system-wide outage.',
          keyPoints: [
            'Every remote call needs a timeout, and timeouts must shrink as you go deeper in the call chain (deadline propagation) — otherwise upstream gives up while downstream keeps burning resources.',
            'Retries need exponential backoff with jitter, a small attempt cap, a retry budget, and idempotent targets — naive retries multiply load exactly when the system is weakest (retry storms).',
            'A circuit breaker stops calling a dependency that is clearly failing (open), probes it occasionally (half-open), and resumes when it recovers (closed) — failing fast instead of queueing.',
            'Bulkheads isolate resources (thread pools, connection pools, concurrency limits, even whole cells) so one slow dependency cannot exhaust capacity needed by everything else.',
            'Graceful degradation and load shedding decide in advance what to drop under stress: serve stale cache, hide recommendations, reject low-priority traffic first.',
            'Today these usually live in the platform (Envoy/Istio, gRPC service config, Resilience4j, Polly) rather than hand-written in every service — but you still must choose the numbers.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The classic cascading failure: Service C slows down. B\'s threads all block waiting on C. A\'s threads block waiting on B. Clients retry, tripling the load. Within minutes, every service is down even though only C had a problem. Each pattern below cuts one link in that chain.',
            },
            {
              type: 'mermaid',
              code: 'stateDiagram-v2\n    [*] --> Closed\n    Closed --> Open : failure rate over threshold<br/>in rolling window\n    Open --> HalfOpen : cool-down timer elapses\n    HalfOpen --> Closed : trial requests succeed\n    HalfOpen --> Open : any trial request fails\n    note right of Open : fail fast, return fallback,<br/>do not touch dependency',
            },
            {
              type: 'heading',
              text: 'Timeouts and Deadline Propagation',
            },
            {
              type: 'p',
              text: 'Set timeouts from measured latency (e.g. a little above the dependency\'s p99.9), not from round numbers like 30 seconds. Better still, propagate a **deadline**: the edge sets "this request must finish by T," every hop passes the remaining budget along (gRPC does this natively with `grpc-timeout`), and a service that receives a request with no time left rejects it immediately instead of doing useless work.',
            },
            {
              type: 'heading',
              text: 'Retries Done Right',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Capped exponential backoff with full jitter and a retry budget',
              code: `const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Token-bucket style budget: retries may add at most ~10% extra load.
class RetryBudget {
  private tokens = 10;
  onSuccess() { this.tokens = Math.min(10, this.tokens + 0.1); }
  tryRetry(): boolean { if (this.tokens >= 1) { this.tokens -= 1; return true; } return false; }
}

const RETRYABLE = new Set([408, 429, 502, 503, 504]); // never blindly retry 4xx like 400/409

async function callWithRetry<T>(fn: () => Promise<T>, budget: RetryBudget, maxAttempts = 3) {
  const base = 100, cap = 2_000;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fn();
      budget.onSuccess();
      return res;
    } catch (err: any) {
      const retryable = RETRYABLE.has(err.status) || err.code === 'ECONNRESET';
      if (!retryable || attempt >= maxAttempts || !budget.tryRetry()) throw err;
      // Full jitter: random in [0, min(cap, base * 2^attempt)] — desynchronizes clients.
      const backoff = Math.random() * Math.min(cap, base * 2 ** attempt);
      const retryAfter = Number(err.headers?.['retry-after']) * 1000 || 0;
      await sleep(Math.max(backoff, retryAfter));
    }
  }
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Retry amplification**: if each of 4 layers retries 3 times, one failing call at the bottom becomes 3^4 = 81 calls. Retry at **one** layer (usually closest to the failure or at the edge), not at every hop, and only for idempotent operations or ones protected by an idempotency key.',
            },
            {
              type: 'heading',
              text: 'Bulkheads, Load Shedding, and Cells',
            },
            {
              type: 'list',
              items: [
                '**Bulkhead**: separate connection pools / concurrency limits per dependency, so a hung payment provider can only tie up the 20 slots reserved for it, not all 200 request threads.',
                '**Adaptive concurrency limits** (Netflix `concurrency-limits`, Envoy adaptive concurrency filter): measure latency and automatically shrink the allowed in-flight requests when the service starts queueing — TCP congestion control applied to RPC.',
                '**Load shedding**: when saturated, reject early and cheaply (HTTP 503 / 429 with `Retry-After`) rather than accepting work you will time out on. Prioritize: shed analytics and prefetch before checkout.',
                '**Graceful degradation**: define fallbacks per dependency — stale cached data, a default recommendation list, "estimated delivery unavailable" — so a non-critical failure degrades a feature, not the page.',
                '**Cell-based architecture**: partition the whole stack into independent cells (each with its own services and data) serving a subset of customers, behind a thin routing layer. A bad deploy or poison request only hurts one cell. AWS uses cells and **shuffle sharding** (assign each customer a random small subset of workers so two customers rarely share all of them) to limit blast radius.',
              ],
            },
            {
              type: 'code',
              language: 'yaml',
              title: 'The same policies declared in a service mesh (Istio)',
              code: `apiVersion: networking.istio.io/v1
kind: DestinationRule
metadata:
  name: payments
spec:
  host: payments.prod.svc.cluster.local
  trafficPolicy:
    connectionPool:            # bulkhead
      tcp: { maxConnections: 100 }
      http: { http2MaxRequests: 200, maxRequestsPerConnection: 50 }
    outlierDetection:          # passive health check / per-host circuit breaker
      consecutive5xxErrors: 5
      interval: 10s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
---
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: payments
spec:
  hosts: [payments.prod.svc.cluster.local]
  http:
    - route: [{ destination: { host: payments.prod.svc.cluster.local } }]
      timeout: 2s
      retries:
        attempts: 2
        perTryTimeout: 800ms
        retryOn: connect-failure,refused-stream,unavailable,503`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Note that Envoy/Istio "circuit breaking" is mostly connection-pool limits plus outlier ejection of individual hosts — not the classic Hystrix-style per-dependency open/half-open state machine. If you need fallbacks with business logic ("return cached price"), that still belongs in application code (Resilience4j for Java, Polly for .NET, `cockatiel` or `opossum` for Node). Hystrix itself has been in maintenance mode since 2018.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewers love "what happens when this dependency is slow (not down)?" Slow is worse than down: down fails fast, slow holds resources. Answer with timeouts, a bulkhead, a circuit breaker on latency/error rate, and a named fallback.',
            },
          ],
        },
        {
          id: 'rate-limiting-backpressure',
          title: 'Rate Limiting, Throttling, and Backpressure',
          summary:
            'Protect shared capacity and enforce fairness: the main limiter algorithms, how to implement them atomically in a distributed setting, and how backpressure propagates overload upstream instead of letting queues explode.',
          keyPoints: [
            'Token bucket allows controlled bursts up to the bucket size while enforcing an average rate — the most common choice for APIs.',
            'Fixed window is simple but allows 2x bursts at window boundaries; sliding window log is exact but memory-heavy; sliding window counter approximates it cheaply.',
            'A distributed limiter needs atomic check-and-decrement — a Redis Lua script or a native limiter — and must decide whether to fail open or fail closed when the limiter store is down.',
            'Return `429 Too Many Requests` with `Retry-After` (and ideally `RateLimit-*` headers) so well-behaved clients back off.',
            'Backpressure means a consumer signals "slow down" to its producer (bounded queues, pull-based consumption, flow control) — unbounded queues just convert overload into latency and then memory exhaustion.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Algorithm', 'State per key', 'Burst behavior', 'Notes'],
              rows: [
                ['Fixed window counter', '1 counter', 'Up to 2x limit across a window boundary', 'Simplest; fine for coarse daily quotas'],
                ['Sliding window log', 'Timestamp of every request', 'Exact', 'Memory grows with rate; use Redis sorted sets'],
                ['Sliding window counter', '2 counters', 'Approximate, smooth', 'Weighted blend of current + previous window; good default for distributed limits'],
                ['Token bucket', 'Tokens + last refill time', 'Bursts up to bucket capacity, then steady rate', 'Used by AWS API Gateway, Stripe, Envoy local rate limit'],
                ['Leaky bucket (queue)', 'Queue', 'Smooths output to a constant rate', 'Shapes traffic to a fragile downstream; adds latency'],
                ['GCRA', '1 timestamp (theoretical arrival time)', 'Like token bucket', 'Elegant, single-value state; used by `redis-cell` and several CDN limiters'],
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Atomic token bucket in Redis (Lua runs atomically on the server)',
              code: `const TOKEN_BUCKET = \`
local key      = KEYS[1]
local capacity = tonumber(ARGV[1])   -- max burst
local rate     = tonumber(ARGV[2])   -- tokens per second
local now      = tonumber(ARGV[3])   -- ms, passed in from the caller
local cost     = tonumber(ARGV[4])

local b = redis.call('HMGET', key, 'tokens', 'ts')
local tokens = tonumber(b[1]) or capacity
local ts     = tonumber(b[2]) or now

tokens = math.min(capacity, tokens + (now - ts) / 1000 * rate)
local allowed = tokens >= cost
if allowed then tokens = tokens - cost end

redis.call('HSET', key, 'tokens', tokens, 'ts', now)
redis.call('PEXPIRE', key, math.ceil(capacity / rate * 1000) + 1000)
return { allowed and 1 or 0, tokens }\`;

export async function allow(redis: Redis, clientId: string, capacity = 100, ratePerSec = 10) {
  const [ok] = (await redis.eval(TOKEN_BUCKET, 1, \`rl:\${clientId}\`,
    capacity, ratePerSec, Date.now(), 1)) as [number, number];
  return ok === 1;
}`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Passing `now` from many app servers means clock skew between them slightly distorts the rate. For strict limits, use the Redis server clock (`redis.call(\'TIME\')`) inside the script instead. In Redis Cluster, all keys a script touches must hash to the same slot — keep one key per limiter, or use hash tags like `rl:{client42}:minute`.',
            },
            {
              type: 'heading',
              text: 'Design Decisions Interviewers Probe',
            },
            {
              type: 'list',
              items: [
                '**Where to limit**: at the edge (API gateway / CDN / WAF) for abuse and per-API-key quotas; inside services for protecting specific dependencies; both in practice.',
                '**Global vs local**: an exact global limit costs a network round trip per request. Many systems use local in-memory buckets per instance (limit / instance count) and accept imprecision, or sync counts asynchronously in batches.',
                '**Fail open vs fail closed**: if Redis is down, do you allow all traffic (availability, risk of overload) or block it (safety, self-inflicted outage)? Most public APIs fail open with a local fallback limiter.',
                '**What key**: API key, user ID, IP (beware NAT and IPv6 ranges), tenant, or endpoint cost class. Weight expensive endpoints with a higher `cost`.',
              ],
            },
            {
              type: 'heading',
              text: 'Backpressure',
            },
            {
              type: 'p',
              text: 'Rate limiting is a policy you impose; **backpressure** is a signal that flows from an overloaded consumer to its producers. Mechanisms: bounded queues that block or reject when full; pull-based consumption (Kafka consumers fetch only what they can handle, so a slow consumer builds *lag*, not memory pressure); reactive-streams demand signaling; and transport flow control (TCP windows, HTTP/2 and gRPC stream flow control). The anti-pattern is the unbounded in-memory queue: it hides overload as rising latency until the process runs out of memory, and then you lose everything in it.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Little\'s Law (`L = λ × W`: items in system = arrival rate × time in system) is the quick sanity check: if a queue receives 1,000 msg/s and each takes 50 ms with 20 workers, capacity is 400 msg/s — the queue will grow by 600 msg/s forever. No queue size fixes that; only more capacity or shedding does.',
            },
          ],
        },
        {
          id: 'caching-strategies',
          title: 'Caching Strategies, Deep Dive',
          summary:
            'Cache-aside, read-through, write-through, and write-behind each place responsibility for loading and durability differently, and each has a different failure mode.',
          keyPoints: [
            'Cache-aside: app checks cache, on miss reads DB and populates cache — good for uneven access patterns.',
            'Read-through centralizes the loading logic in the cache itself; write-through keeps cache and DB consistent at the cost of write latency.',
            'Write-behind (write-back) gives the fastest writes but risks data loss if the cache node fails before flushing.',
            'Eviction policy choice (LRU, LFU, TTL) should match the actual access pattern.',
            'Cache stampede is mitigated with request coalescing or probabilistic early expiration.',
            'Real systems layer multiple caches (CDN, distributed cache, sometimes an in-process cache) so a hit at any layer short-circuits everything behind it.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Cache-aside (lazy loading)**: app checks cache, on miss reads DB and populates cache. Cache only holds what\'s actually been requested (good for uneven access patterns); a cache-aside miss adds one extra round trip on the unlucky first request per key/TTL cycle.',
                '**Read-through**: the cache itself is responsible for loading from the DB on a miss (app only ever talks to the cache) — same performance characteristics as cache-aside but centralizes the loading logic in the caching layer rather than the app.',
                '**Write-through**: writes go to the cache, which synchronously writes to the DB before acknowledging — keeps cache and DB always consistent, at the cost of write latency (every write pays both cache and DB latency).',
                '**Write-behind (write-back)**: writes go to the cache and are acknowledged immediately; the cache asynchronously flushes to the DB in the background. Fastest writes, but risks data loss if the cache node fails before flushing, and needs careful ordering/batching logic.',
                '**Eviction policies**: LRU (evict least-recently-used, good general default), LFU (evict least-frequently-used, better when popularity is stable over time and you don\'t want a single recent burst to evict a perennially popular item), TTL-based (simplest, good when staleness has a hard deadline like a session token).',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Client[Client / Browser] --> CDN[CDN Edge Cache<br/>static/public assets]\n    CDN --> AppCache[Distributed Cache<br/>Redis / Memcached]\n    AppCache --> DB[(Primary Database)]\n\n    CDN -.->|hit here: never reaches origin| Client\n    AppCache -.->|hit here: DB never queried| CDN',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Cache stampede / dogpile**: many concurrent requests miss the cache for the same key simultaneously (e.g., right after expiry) and all hit the DB at once. Mitigate with request coalescing (a mutex/promise per key so only one request repopulates the cache while others wait on it), or probabilistic early expiration (refresh slightly before actual TTL, staggered per request, to spread out refreshes).',
            },
            {
              type: 'heading',
              text: 'Cache-Aside, Implemented Properly',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Cache-aside with single-flight, TTL jitter, and negative caching',
              code: `const inflight = new Map<string, Promise<Product | null>>();
const NOT_FOUND = '__nf__';

async function getProduct(id: string): Promise<Product | null> {
  const key = \`product:v3:\${id}\`;                 // version the key with the schema
  const cached = await redis.get(key);
  if (cached === NOT_FOUND) return null;           // negative cache: stops "miss" floods
  if (cached) return JSON.parse(cached);

  // Single-flight: concurrent misses in THIS process share one DB query.
  if (!inflight.has(key)) {
    inflight.set(key, (async () => {
      try {
        const row = await db.products.findById(id);
        const ttl = 300 + Math.floor(Math.random() * 60);   // jitter: avoid synchronized expiry
        await redis.set(key, row ? JSON.stringify(row) : NOT_FOUND, 'EX', row ? ttl : 30);
        return row;
      } finally {
        inflight.delete(key);
      }
    })());
  }
  return inflight.get(key)!;
}

// On write: update the source of truth FIRST, then DELETE (not set) the cache entry.
async function updateProduct(p: Product) {
  await db.products.update(p);
  await redis.del(\`product:v3:\${p.id}\`);
}`,
            },
            {
              type: 'heading',
              text: 'Invalidation: The Genuinely Hard Part',
            },
            {
              type: 'list',
              items: [
                '**Delete, don\'t set, on write.** If two writers each update the DB then `SET` the cache, their cache writes can land in the opposite order to their DB writes, leaving the cache permanently wrong until TTL. Deleting is order-insensitive.',
                '**The read-write race still exists**: a reader misses, reads the old row, stalls; a writer updates the DB and deletes the key; the reader then writes the stale row into the cache. Mitigations: short TTLs as a safety net, a delayed second delete ("double delete"), or versioned values with a compare-and-set (only write if newer version).',
                '**Invalidate from the database\'s change stream, not the app.** Driving cache deletes from CDC (Debezium reading the WAL/binlog) catches every writer — including batch jobs and manual fixes — that app-level invalidation misses. Meta\'s published work on cache consistency (TAO/Memcache) is built on this idea.',
                '**Always set a TTL** — even with perfect invalidation logic — so any bug self-heals in bounded time.',
                '**Hot keys**: one key receiving huge read volume overloads one cache shard. Use a small in-process L1 cache (seconds of TTL) in front of Redis, or replicate the key under several suffixes and pick one randomly.',
                '**Large values and big keys** block single-threaded Redis command processing; keep values small and avoid `KEYS *` or huge `HGETALL` in production.',
              ],
            },
            {
              type: 'table',
              headers: ['Strategy', 'Read path', 'Write path', 'Consistency risk', 'Typical use'],
              rows: [
                ['Cache-aside', 'App: cache, then DB on miss', 'App writes DB, deletes key', 'Stale window + read/write race', 'The default for most web apps'],
                ['Read-through', 'Cache loads from DB on miss', 'Usually combined with write-through or invalidation', 'Same as cache-aside', 'Libraries/caches with loaders (Caffeine, DAX, NCache)'],
                ['Write-through', 'Cache', 'Cache writes DB synchronously', 'Low, but a failed DB write must not leave the cache updated', 'Read-after-write-heavy data'],
                ['Write-behind', 'Cache', 'Cache acks, flushes to DB async', 'Data loss on cache failure; ordering issues', 'Counters, metrics, write-coalescing'],
                ['Refresh-ahead', 'Cache', 'Background refresh before expiry', 'Wasted refreshes for keys no longer used', 'Small set of very hot keys'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Ecosystem note: after Redis changed its license in 2024, the Linux Foundation fork **Valkey** became the default in several clouds (e.g. AWS ElastiCache and MemoryDB offer it), and Redis 8 later added AGPLv3 as a licensing option. For design discussions they are interchangeable — the patterns above apply to both, and to Memcached for pure caching.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Treating the cache as a database.** If your system cannot survive the cache being flushed (cold start, failover, eviction under memory pressure), you have built an unreplicated primary datastore by accident. Capacity-plan the DB for a realistic cold-cache scenario, or warm caches gradually and shed load during recovery.',
            },
          ],
        },
        {
          id: 'architectural-styles',
          title: 'Architectural Styles: Monolith vs Microservices vs Serverless',
          summary:
            'Microservices are an organizational scaling solution as much as a technical one, and the Strangler Fig pattern is the standard low-risk way to migrate incrementally.',
          keyPoints: [
            'Monoliths are simplest operationally and fit early-stage products and small teams with unclear domain boundaries.',
            'Microservices trade development-time simplicity for operational complexity — network calls fail in ways function calls can\'t.',
            'Conway\'s Law: team boundaries end up mirroring service boundaries, so the choice is organizational as much as technical.',
            'The Strangler Fig pattern migrates a monolith incrementally via a routing layer, rather than a risky big-bang rewrite.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Monolith', 'Microservices', 'Serverless (FaaS)'],
              rows: [
                ['Deployment', 'One unit', 'Independently deployable services', 'Independently invoked functions'],
                ['Team scaling', 'Gets harder past a certain team size (merge conflicts, coupled release cycles)', 'Teams own services independently', 'Teams own functions/small services'],
                ['Operational complexity', 'Low (one thing to run, monitor, debug)', 'High (service discovery, distributed tracing, network calls replace function calls)', 'Managed by cloud provider, but cold starts and vendor lock-in are real costs'],
                ['Latency', 'In-process calls, fast', 'Network hops between services add latency and failure modes', 'Cold start latency can be significant; pay-per-invocation'],
                ['When it fits', 'Early-stage products, small teams, unclear domain boundaries', 'Large orgs, clear bounded contexts, independent scaling needs per component', 'Spiky/unpredictable load, event-driven glue code, low ops budget'],
              ],
            },
            {
              type: 'p',
              text: '**The single most important thing to say in an interview about this choice**: microservices are an *organizational* scaling solution as much as a technical one (Conway\'s Law — team boundaries end up mirroring service boundaries) and they trade development-time simplicity for operational complexity (network calls can fail in ways function calls can\'t — partial failure, latency, serialization). Don\'t default to microservices for a system with one small team and a not-yet-understood domain; that\'s the classic case of paying distributed-systems tax for no benefit.',
            },
            {
              type: 'heading',
              text: 'The Strangler Fig Pattern',
            },
            {
              type: 'p',
              text: 'The standard, low-risk way to migrate a monolith to microservices incrementally: put a routing layer in front of the monolith, peel off one capability at a time into a new service, route an increasing share of traffic to it, and only decommission the monolith\'s code path for that capability once the new service has proven itself — never a big-bang rewrite.',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Client --> Router{Routing / Facade Layer}\n    Router -->|capability not yet migrated| Monolith[Legacy Monolith]\n    Router -->|capability A: migrated| ServiceA[New Service: Capability A]\n    Router -.->|capability B: next to extract| Monolith\n\n    ServiceA -.->|monolith code path for A<br/>eventually decommissioned| Monolith',
            },
            {
              type: 'p',
              text: 'The hard part of a strangler migration is almost never the routing — it is the **data**. The extracted service needs its own database, but the monolith still reads and writes those tables. The usual sequence: (1) extract the code behind an interface inside the monolith, (2) give the new service its own schema and keep it in sync with CDC or dual-writes-via-outbox while both run, (3) shadow or canary traffic and compare results, (4) flip the source of truth, (5) delete the monolith\'s copy. An **anti-corruption layer** translates between the legacy model and the new service\'s cleaner model so legacy concepts do not leak in.',
            },
            {
              type: 'heading',
              text: 'The Modular Monolith: the Underrated Middle Ground',
            },
            {
              type: 'p',
              text: 'A **modular monolith** is one deployable with strictly enforced internal module boundaries: each module owns its tables, exposes a narrow public API, and other modules may not reach into its internals (enforced with tooling such as ArchUnit, Spring Modulith, Nx module boundaries, or Packwerk for Rails). You get most of the design benefits of microservices — clear ownership, low coupling — with none of the network tax, and a well-bounded module can later be extracted into a service with little drama. Shopify is the well-known large-scale example. Many teams that went "microservices first" have publicly consolidated back toward this shape.',
            },
            {
              type: 'heading',
              text: 'Drawing Service Boundaries',
            },
            {
              type: 'list',
              items: [
                '**Use bounded contexts from Domain-Driven Design**: a boundary is where the meaning of a word changes ("Product" in Catalog is a description and images; in Inventory it is a SKU count; in Shipping it is weight and dimensions).',
                '**Database per service**: each service owns its data and others access it only through its API or events. A shared database is the most common way teams build a **distributed monolith** — every schema change requires coordinated deploys.',
                '**Optimize for change, not for nouns**: things that change together should live together. If every feature requires changing three services in lockstep, the boundaries are wrong.',
                '**Prefer async between contexts, sync within a request only when the user is waiting**: long synchronous call chains multiply latency and multiply failure probability (five services at 99.9% each give roughly 99.5% end to end).',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Serverless has matured: cold starts are much less of an issue than they once were thanks to provisioned concurrency, AWS Lambda SnapStart (snapshot-restore, now available for Java, Python and .NET), lighter runtimes, and container-based serverless (Cloud Run, Azure Container Apps, AWS Fargate) that blurs the line with "regular" containers. The enduring tradeoffs are execution-time limits, per-invocation cost at sustained high load, connection-pool exhaustion against relational databases (use a proxy such as RDS Proxy), and harder local testing.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Signs you have a distributed monolith**: services share a database; you cannot deploy one without deploying others; a single user request makes a long synchronous chain of calls; one service going down takes most features down. The fix is usually fewer, larger services with real ownership — not more services.',
            },
          ],
        },
        {
          id: 'api-gateway-bff-service-mesh',
          title: 'API Gateway, Backend-for-Frontend, Service Discovery, and Service Mesh',
          summary:
            'How traffic gets into and around a microservice system: the edge gateway and BFF patterns for north-south traffic, and service discovery plus sidecar or sidecarless meshes for east-west traffic.',
          keyPoints: [
            'An API gateway is the single entry point that handles cross-cutting edge concerns: TLS, authentication, rate limiting, routing, request shaping — but must not accumulate business logic.',
            'Backend-for-Frontend (BFF) gives each client type (web, iOS, partner API) its own thin aggregation layer, owned by the team that builds that client.',
            'Service discovery maps logical service names to live instances — via DNS (Kubernetes Services), a registry (Consul, Eureka), or xDS from a control plane.',
            'A service mesh moves mTLS, retries, timeouts, load balancing, and telemetry out of application code into proxies managed by a control plane.',
            'Sidecarless meshes (Istio ambient mode, Cilium) reduce the per-pod resource and operational cost that made classic sidecar meshes expensive.',
            'Do not adopt a mesh for a handful of services; its value scales with the number of services and teams, and its operational cost is real.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Web[Web app] --> WebBFF["Web BFF"]\n    Mobile[Mobile app] --> MobileBFF["Mobile BFF"]\n    Partner[Partner integrations] --> GW\n    WebBFF --> GW["API Gateway<br/>TLS, authN, rate limits"]\n    MobileBFF --> GW\n    GW --> Orders[Orders]\n    GW --> Catalog[Catalog]\n    subgraph Mesh["Service mesh: mTLS, retries, telemetry"]\n        Orders <--> Payments[Payments]\n        Orders <--> Inventory[Inventory]\n        Catalog <--> Pricing[Pricing]\n    end\n    CP["Control plane<br/>(istiod / Linkerd)"] -.->|config, certs via xDS| Mesh',
            },
            {
              type: 'heading',
              text: 'API Gateway',
            },
            {
              type: 'p',
              text: 'Responsibilities: TLS termination, authentication and coarse authorization (validate the JWT or session once), rate limiting and quotas, routing and versioning, request/response transformation, caching of public responses, WAF/bot protection, and observability at the edge. Implementations: managed (AWS API Gateway, Azure API Management, Google Apigee/API Gateway), self-hosted (Kong, Envoy Gateway, NGINX, Traefik), and the Kubernetes **Gateway API**, which has largely superseded the older Ingress resource as the standard way to configure L7 routing in clusters.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**The "smart gateway" anti-pattern**: once orchestration and business rules creep into the gateway (the ESB problem of the 2000s), it becomes a shared bottleneck every team must change and deploy. Keep the gateway generic and push composition into BFFs or services.',
            },
            {
              type: 'heading',
              text: 'Backend-for-Frontend',
            },
            {
              type: 'p',
              text: 'A mobile screen might need data from five services shaped very differently than the web page does. A BFF per client type aggregates those calls server-side (one round trip over the slow mobile network instead of five), trims payloads, and evolves at the pace of its client. The rule: the BFF is owned by the client team and contains presentation-oriented composition only. A GraphQL layer (often federated across services) is a common alternative that lets clients specify the shape themselves, at the cost of query-cost control and caching complexity.',
            },
            {
              type: 'heading',
              text: 'Service Discovery',
            },
            {
              type: 'table',
              headers: ['Approach', 'How it works', 'Tradeoff'],
              rows: [
                ['DNS-based (Kubernetes Service)', 'Stable virtual IP or DNS name; kube-proxy / eBPF routes to ready pods', 'Simple and universal; L4 only, DNS caching can lag'],
                ['Client-side registry (Consul, Eureka)', 'Instances register and heartbeat; clients query and balance', 'Rich, fast-updating; client libraries per language'],
                ['Control-plane push (xDS)', 'Control plane streams endpoints and policy to proxies (Envoy) or gRPC clients (proxyless)', 'Powerful and dynamic; the control plane is critical infrastructure'],
              ],
            },
            {
              type: 'heading',
              text: 'Service Mesh: Sidecar vs Sidecarless',
            },
            {
              type: 'p',
              text: 'In the classic **sidecar** model (Istio, Linkerd), every pod runs a proxy that intercepts traffic, giving uniform mTLS, retries, timeouts, traffic splitting for canaries, and golden-signal metrics without code changes. The cost is a proxy per pod (memory, CPU, latency per hop) and sidecar lifecycle issues. **Istio ambient mode** (generally available since Istio 1.24) splits this into a per-node L4 proxy (ztunnel) handling mTLS and an optional per-namespace L7 "waypoint" proxy only where L7 features are needed. Cilium provides mesh features using eBPF in the kernel plus a per-node Envoy.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interview framing: "north-south" traffic (clients into the system) goes through the gateway; "east-west" traffic (service to service) is governed by the mesh. The mesh gives you zero-trust mTLS identity between services (SPIFFE IDs) — which is how "downstream services trust the caller" is actually enforced, rather than trusting the network.',
            },
          ],
        },
        {
          id: 'messaging-queues-streams',
          title: 'Messaging: Queues vs Logs, Partitions, Ordering, and Dead-Letter Queues',
          summary:
            'Message queues and event logs look similar but have different semantics. Understanding partitions, consumer groups, offsets, and poison messages is what makes asynchronous designs actually work.',
          keyPoints: [
            'A queue (SQS, RabbitMQ) hands each message to one consumer and deletes it on ack; a log (Kafka, Kinesis, Pulsar, Redpanda) retains messages and lets each consumer group track its own position (offset), so events can be replayed.',
            'Ordering is only guaranteed within a partition; choose the partition key (e.g. `orderId`) so events that must stay ordered share a partition.',
            'Parallelism of a Kafka consumer group is capped by the partition count — over-partitioning has costs, under-partitioning caps throughput.',
            'Commit the offset only after processing succeeds (at-least-once), and make handlers idempotent; committing first gives at-most-once.',
            'Poison messages need retry topics with backoff and a dead-letter queue, plus alerting and a redrive tool — otherwise one bad message blocks a whole partition.',
            'Kafka transactions give exactly-once for read-process-write within Kafka; side effects in external systems still need idempotency or the outbox pattern.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Work queue (SQS, RabbitMQ classic queues)', 'Event log (Kafka, Kinesis, Pulsar)'],
              rows: [
                ['Consumption model', 'Competing consumers; message deleted after ack', 'Each consumer group reads independently; data retained by time/size'],
                ['Replay', 'No (once acked, gone)', 'Yes — reset offsets to reprocess or bootstrap a new service'],
                ['Ordering', 'Best effort (SQS standard) or per message group (SQS FIFO)', 'Strict per partition'],
                ['Scaling consumers', 'Add consumers freely', 'At most one active consumer per partition per group (share groups, KIP-932, introduced in the Kafka 4.x line, add queue-like consumption)'],
                ['Per-message retry/delay', 'Built in (visibility timeout, redrive policy)', 'Must build retry topics yourself; a stuck message blocks its partition'],
                ['Best for', 'Task distribution, background jobs', 'Event streaming, CDC, event sourcing, fan-out to many independent consumers'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    P[Producer<br/>key = orderId] --> T\n    subgraph T["Topic: orders (3 partitions)"]\n        P0["P0: o1, o4, o1"]\n        P1["P1: o2, o5"]\n        P2["P2: o3, o6, o3"]\n    end\n    subgraph G1["Group: billing"]\n        C1[consumer 1]\n        C2[consumer 2]\n    end\n    subgraph G2["Group: analytics"]\n        C3[consumer 1]\n    end\n    P0 --> C1\n    P1 --> C1\n    P2 --> C2\n    P0 --> C3\n    P1 --> C3\n    P2 --> C3',
            },
            {
              type: 'heading',
              text: 'A Correct Consumer Loop',
            },
            {
              type: 'code',
              language: 'java',
              title: 'Kafka consumer: process, then commit; dedupe with an inbox table',
              code: `props.put("enable.auto.commit", "false");
props.put("isolation.level", "read_committed");   // skip aborted transactional writes

try (var consumer = new KafkaConsumer<String, OrderEvent>(props)) {
  consumer.subscribe(List.of("orders"));
  while (running) {
    var records = consumer.poll(Duration.ofMillis(500));
    for (var rec : records) {
      try {
        tx.execute(() -> {
          // Inbox / processed-messages table makes redelivery a no-op.
          boolean firstTime = jdbc.update(
              "INSERT INTO processed_events(event_id) VALUES (?) ON CONFLICT DO NOTHING",
              rec.value().eventId()) == 1;
          if (firstTime) billing.apply(rec.value());   // same DB transaction as the inbox row
        });
      } catch (RetryableException e) {
        retryProducer.send(new ProducerRecord<>("orders.retry.1m", rec.key(), rec.value()));
      } catch (Exception poison) {
        dlqProducer.send(new ProducerRecord<>("orders.dlq", rec.key(), rec.value()));
      }
    }
    consumer.commitSync();   // only after the whole batch is handled
  }
}`,
            },
            {
              type: 'list',
              items: [
                '**Producer settings**: `acks=all` plus `enable.idempotence=true` (the default since Kafka 3.0) prevents duplicates and reordering from producer retries within a partition. Use `min.insync.replicas=2` with replication factor 3 so an ack really means two copies.',
                '**Rebalances**: when consumers join or leave, partitions move. Processing that is not finished before a rebalance may be redone by the new owner — another reason handlers must be idempotent. Cooperative rebalancing and the newer consumer group protocol (KIP-848, generally available in Kafka 4.0 and enabled on clients via `group.protocol=consumer`) reduce the stop-the-world pauses.',
                '**Consumer lag** (latest offset minus committed offset) is the key health metric; alert on its growth rate, not on a fixed number.',
                '**Retry topics**: moving a failing message to `orders.retry.1m` frees the partition but breaks per-key ordering for that key. If order matters, park the whole key (or pause the partition) instead.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Choosing a partition key with low cardinality or heavy skew** (e.g. `country` when 60% of traffic is one country) creates a hot partition that no amount of consumers can fix, since only one consumer per group can read it. Also note that increasing the partition count later changes the key-to-partition mapping for new messages, breaking per-key ordering across the change — choose a generous count up front.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Kafka\'s exactly-once semantics (idempotent producer + transactions + `read_committed` consumers) covers consume-from-Kafka, process, produce-to-Kafka loops such as Kafka Streams jobs. The moment your handler sends an email, calls Stripe, or writes to a different database, you are back to at-least-once and need idempotency keys or an inbox table on that side.',
            },
          ],
        },
        {
          id: 'event-driven-cqrs',
          title: 'Event-Driven Architecture, CQRS, and Event Sourcing',
          summary:
            'Decoupling services via events, separating the write and read models, and storing state as a sequence of events are three related but distinct techniques.',
          keyPoints: [
            'Event-driven architecture decouples producers from consumers via a broker, at the cost of harder tracing and eventual consistency.',
            'CQRS separates the write model (business rules) from read model(s) optimized for the shapes consumers actually need.',
            'Event sourcing stores the sequence of events that produced current state instead of just the current state.',
            'Event sourcing\'s biggest underestimated cost is event schema evolution/versioning over time.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Event-Driven Architecture',
            },
            {
              type: 'p',
              text: 'Services communicate by publishing/subscribing to events on a broker (Kafka/SNS/EventBridge) rather than calling each other directly. Benefits: loose coupling (a producer doesn\'t know or care who consumes its events), independent scaling, natural audit trail. Costs: harder to trace a single business transaction across services (needs distributed tracing/correlation IDs), eventual consistency between services becomes the default, and debugging "why didn\'t X happen" requires understanding an asynchronous chain rather than a stack trace. A consumer can also see the same event more than once — see the delivery-semantics topic later in this guide for how that\'s handled safely.',
            },
            {
              type: 'heading',
              text: 'CQRS (Command Query Responsibility Segregation)',
            },
            {
              type: 'p',
              text: 'Separate the write model (commands, optimized for validating and persisting business rules) from the read model (queries, optimized for the shapes the UI actually needs — often heavily denormalized). The write side publishes events on state changes; one or more read models are built/updated by consuming those events. This lets you scale reads and writes independently and tailor each to its actual access pattern, at the cost of eventual consistency between a write and its visibility in a read model (a "the like count updated one second late" tradeoff, similar to fan-out feeds).',
            },
            {
              type: 'heading',
              text: 'Event Sourcing',
            },
            {
              type: 'p',
              text: 'Instead of storing current state, store the full sequence of events that led to it (e.g., `AccountOpened`, `MoneyDeposited`, `MoneyWithdrawn`) and derive current state by replaying events. Benefits: perfect audit trail, ability to reconstruct state as of any point in time, natural fit with CQRS (events are what feed the read models). Costs: replaying a long event history to get current state is expensive without periodic snapshots; schema evolution of events over time needs careful versioning; it\'s a genuinely harder mental model that shouldn\'t be reached for without a real requirement (audit/compliance, temporal queries, or an existing event-driven system it fits naturally into).',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Command[Command: WithdrawMoney] --> WriteModel[Write Model<br/>validates business rules]\n    WriteModel --> EventStore[(Event Store<br/>AccountOpened, MoneyDeposited, MoneyWithdrawn...)]\n    EventStore --> Projector[Projector /<br/>Read Model Builder]\n    Projector --> ReadModel1[(Read Model:<br/>Account Balance View)]\n    Projector --> ReadModel2[(Read Model:<br/>Transaction History View)]\n    Query[Query: GetBalance] --> ReadModel1',
            },
            {
              type: 'heading',
              text: 'Event Sourcing Mechanics: Append with Optimistic Concurrency',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Aggregate rehydration, invariant check, and a version-checked append',
              code: `type Event =
  | { type: 'AccountOpened'; v: 1; owner: string }
  | { type: 'MoneyDeposited'; v: 1; amount: number }
  | { type: 'MoneyWithdrawn'; v: 1; amount: number };

function evolve(balance: number, e: Event): number {
  switch (e.type) {
    case 'AccountOpened':  return 0;
    case 'MoneyDeposited': return balance + e.amount;
    case 'MoneyWithdrawn': return balance - e.amount;
  }
}

async function withdraw(accountId: string, amount: number) {
  // 1. Load latest snapshot (if any) plus the events after it.
  const snap = await snapshots.latest(accountId);          // { balance, version } | null
  const events = await store.read(accountId, { fromVersion: snap?.version ?? 0 });
  const balance = events.reduce((b, e) => evolve(b, e.data), snap?.balance ?? 0);
  const version = events.at(-1)?.version ?? snap?.version ?? 0;

  // 2. Enforce the invariant against current state.
  if (balance < amount) throw new Error('InsufficientFunds');

  // 3. Append ONLY if nobody else appended since we read (expected version).
  //    A concurrent withdrawal makes this fail; the caller reloads and retries.
  await store.append(accountId, [{ type: 'MoneyWithdrawn', v: 1, amount }],
                     { expectedVersion: version });
}`,
            },
            {
              type: 'list',
              items: [
                '**Optimistic concurrency per stream** (expected version) is what protects invariants; implemented as a unique constraint on `(stream_id, version)` in Postgres, or natively in EventStoreDB/Kurrent, Axon, Marten.',
                '**Snapshots** every N events bound rehydration cost. They are a cache: you must be able to throw them away and rebuild.',
                '**Upcasting** converts old event versions to the current shape when read, so handlers only know the latest schema. Never edit stored events in place; for GDPR erasure, use **crypto-shredding** (encrypt personal data per subject and delete the key).',
                '**Projections must be idempotent and rebuildable**: track the last processed position per projection, and be able to rebuild a read model from position 0 into a new table, then swap.',
                '**Events are facts in past tense** (`OrderPlaced`), not commands (`PlaceOrder`). Distinguish internal domain events (fine-grained, private) from integration events published to other services (stable, versioned contract).',
              ],
            },
            {
              type: 'table',
              headers: ['Technique', 'Use it when', 'Avoid when'],
              rows: [
                ['Event-driven integration', 'Many independent consumers react to business facts; producers should not know them', 'The caller needs an immediate answer to proceed'],
                ['CQRS (separate read models)', 'Read shapes differ wildly from write shapes, or reads outscale writes massively', 'Simple CRUD — a read replica or a SQL view is enough'],
                ['Event sourcing', 'Audit is a core requirement, temporal queries, complex domain with valuable history (ledgers, workflows)', 'You mainly need current state and ad-hoc querying; team new to the pattern'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Event notification vs event-carried state transfer**: a thin event ("order 42 changed") forces every consumer to call back the producer for details, recreating synchronous coupling and load spikes. A fat event carrying the relevant state lets consumers build local copies — at the cost of a larger, harder-to-evolve contract. Pick deliberately, and register schemas (Avro/Protobuf/JSON Schema in a schema registry with compatibility rules) so producers cannot break consumers.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'CQRS and event sourcing are independent: you can have CQRS without event sourcing (write to normal tables, project via CDC into a search index) and, less commonly, event sourcing without separate read models. Do not adopt both for a whole system — apply them to the one or two bounded contexts that genuinely need them.',
            },
          ],
        },
        {
          id: 'idempotency-delivery-semantics',
          title: 'Idempotency and Delivery Semantics: At-Least-Once, At-Most-Once, "Exactly-Once"',
          summary:
            'Once a request can time out ambiguously — and in a distributed system it always eventually will — idempotency is what stops a safe retry from silently corrupting state.',
          keyPoints: [
            'A network timeout is ambiguous: the request may have failed before or after the server processed it, so the caller cannot know whether to retry.',
            'At-least-once delivery (retry until acknowledged) is the easiest and most common guarantee to build, but it requires the receiver to be idempotent to be safe.',
            'At-most-once (never retry) avoids duplicates but risks silently losing work.',
            'True "exactly-once" delivery is not achievable as a pure network guarantee — what production systems actually build is at-least-once delivery plus idempotent processing, which behaves like exactly-once from the caller\'s perspective.',
            'An idempotency key (a client-generated unique ID attached to a request) lets the receiver recognize and safely no-op a retried request instead of double-processing it.',
            'Idempotency is what makes Saga compensations, payment retries, and message-queue consumers safe — it directly enables the distributed transactions topic that follows.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Topic one flagged the core problem: a network call can fail in a way that leaves the caller unable to tell whether the request never arrived, arrived but the response was lost, or arrived and is still being processed. If a caller\'s only safe move on timeout is "give up," the system is fragile; if the safe move is "retry," the system needs a way to make retries harmless. That is what this topic is about.',
            },
            {
              type: 'heading',
              text: 'The Three Delivery Semantics',
            },
            {
              type: 'table',
              headers: ['Semantics', 'How it works', 'Risk', 'When it fits'],
              rows: [
                ['At-most-once', 'Send once, never retry.', 'A lost message is lost forever — silent data loss.', 'Rarely acceptable alone; sometimes fine for best-effort telemetry/metrics.'],
                ['At-least-once', 'Retry until acknowledged.', 'The same message/request may be processed more than once (duplicates).', 'The most common real-world default — safe only if the receiver is idempotent.'],
                ['"Exactly-once"', 'Each message\'s effect is applied exactly one time, no more, no less.', 'Not actually achievable as a pure network guarantee — see below.', 'What people usually mean is at-least-once delivery + idempotent processing, which behaves like exactly-once from the caller\'s point of view.'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '"Exactly-once delivery" as a literal network-layer guarantee is not achievable in an asynchronous system with unreliable networks — a sender fundamentally cannot know with certainty whether its message was received without also handling the case where the *acknowledgment* itself is lost, which puts you right back in retry territory. What message queues that advertise "exactly-once" (Kafka\'s idempotent/transactional producers, SQS FIFO) actually provide is at-least-once delivery combined with deduplication — exactly-once *processing effects*, not exactly-once transmission. Know what\'s actually guaranteed before relying on it.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Client\n    participant Server\n    Note over Client,Server: Without an idempotency key\n    Client->>Server: ChargeCard($50)\n    Server->>Server: charges card, response lost in transit\n    Note over Client: times out, doesn\'t know if it worked\n    Client->>Server: ChargeCard($50)  (retry)\n    Server->>Server: charges card AGAIN - customer double-charged\n\n    Note over Client,Server: With an idempotency key\n    Client->>Server: ChargeCard($50, key=abc123)\n    Server->>Server: charges card, stores result for key=abc123, response lost\n    Client->>Server: ChargeCard($50, key=abc123)  (retry, same key)\n    Server->>Server: sees key=abc123 already processed -> returns stored result, no second charge',
            },
            {
              type: 'heading',
              text: 'Idempotency Keys in Practice',
            },
            {
              type: 'p',
              text: 'An **idempotency key** is a unique identifier the *client* generates once per logical operation (not per network attempt) and sends with every retry of that same operation. The server stores, keyed by that identifier, either "already in progress" or the final result, for a reasonable retention window — a repeated request with the same key returns the stored result instead of re-executing the operation. This is exactly how payment APIs (Stripe\'s `Idempotency-Key` header is the canonical example) let clients retry a charge safely after an ambiguous timeout.',
            },
            {
              type: 'p',
              text: 'Some operations are naturally idempotent without any extra machinery — `SET x = 5` produces the same end state no matter how many times it runs — while others are not by default — `increment balance by 5` applied twice is a bug. An idempotency key (or an equivalent, like a unique constraint on a `request_id` column) is what turns a naturally non-idempotent operation into a safely-retryable one.',
            },
            {
              type: 'code',
              language: 'sql',
              title: 'Server-side idempotency store (Postgres)',
              code: `CREATE TABLE idempotency_keys (
  client_id     text        NOT NULL,
  key           text        NOT NULL,
  request_hash  text        NOT NULL,         -- detect same key reused with a different body
  status        text        NOT NULL,         -- 'in_progress' | 'completed'
  response_code int,
  response_body jsonb,
  locked_until  timestamptz,                  -- recover from a crash mid-request
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (client_id, key)
);

-- Step 1: claim the key atomically. 1 row inserted => we own it; 0 rows => seen before.
INSERT INTO idempotency_keys (client_id, key, request_hash, status, locked_until)
VALUES ($1, $2, $3, 'in_progress', now() + interval '30 seconds')
ON CONFLICT (client_id, key) DO NOTHING;

-- Step 2 (we own it): do the work AND record the result in the SAME local transaction
-- as the business change, so "charged but result not stored" cannot happen.
UPDATE idempotency_keys
SET status = 'completed', response_code = $4, response_body = $5
WHERE client_id = $1 AND key = $2;

-- If 0 rows were inserted in step 1:
--   completed + same hash   -> replay the stored response
--   completed + other hash  -> 422: key reused with a different payload
--   in_progress, not expired -> 409: concurrent duplicate, retry later`,
            },
            {
              type: 'list',
              items: [
                '**Scope keys per client/tenant** so two customers cannot collide, and expire them after a documented window (Stripe documents that keys can be pruned after at least 24 hours).',
                '**Store the result atomically with the side effect** whenever the side effect is in your own database. When the side effect is external (a payment provider), pass your key through to *their* idempotency mechanism so the guarantee holds end to end.',
                '**Natural idempotency keys beat synthetic ones** where available: an `order_id` for "charge order", an `event_id` for a consumer, a `(user_id, day)` for a daily reward.',
                '**Prefer state transitions over deltas**: "set status from PENDING to PAID where status = PENDING" is idempotent by construction; "add 50 to balance" is not.',
                '**The `Idempotency-Key` HTTP header** is being standardized by the IETF HTTPAPI working group (`draft-ietf-httpapi-idempotency-key-header`), codifying the conventions popularized by Stripe and others.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'This is not an isolated topic — it is the mechanism that makes several other ideas in this guide actually safe in production: a load-balanced client retrying a request against a different backend (Load Balancing), a message-queue consumer that might see the same message twice (Event-Driven Architecture), and a Saga orchestrator retrying a step or a compensation after a crash (Distributed Transactions, next) all depend on the operation they\'re retrying being idempotent.',
            },
          ],
        },
        {
          id: 'distributed-transactions',
          title: 'Distributed Transactions: 2PC and Saga',
          summary:
            'Two-phase commit guarantees atomicity but blocks on a coordinator failure; the Saga pattern trades strict atomicity for availability via compensating transactions.',
          keyPoints: [
            'Two-Phase Commit: a coordinator asks participants to prepare, then commits or aborts — guarantees atomicity but the coordinator is a blocking single point of failure.',
            'Saga: breaks a transaction into local steps, each with a compensating transaction to undo it if a later step fails.',
            'Choreography: services react to each other\'s events, no central coordinator, but the flow is implicit and harder to trace.',
            'Orchestration: a central orchestrator explicitly calls each step and its compensations — easier to monitor as one defined workflow.',
            'Both a Saga\'s steps and its compensations must be idempotent — an orchestrator that retries after a crash relies entirely on the mechanism from the previous topic.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Two-Phase Commit (2PC)',
            },
            {
              type: 'p',
              text: 'A coordinator asks all participants to "prepare" (lock resources, confirm they *can* commit) in phase 1, then tells them all to "commit" (or "abort" if any participant said no) in phase 2. Guarantees atomicity across services/databases, but the coordinator is a single point of failure/blocking — if it crashes between phases, participants can be left holding locks indefinitely ("in doubt"). Rarely used across microservices in practice because of this blocking behavior and the tight coupling it requires (all participants must be up and reachable simultaneously).',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Coordinator\n    participant P1 as Participant 1 (Inventory)\n    participant P2 as Participant 2 (Payment)\n\n    Note over Coordinator,P2: Phase 1: Prepare (vote)\n    Coordinator->>P1: prepare()\n    Coordinator->>P2: prepare()\n    P1-->>Coordinator: yes, locked & ready\n    P2-->>Coordinator: yes, locked & ready\n\n    Note over Coordinator,P2: Phase 2: Commit (only if ALL voted yes)\n    Coordinator->>P1: commit()\n    Coordinator->>P2: commit()\n    P1-->>Coordinator: ack\n    P2-->>Coordinator: ack\n\n    Note over P1,P2: If the coordinator crashes between<br/>phase 1 and phase 2, both participants<br/>are stuck holding locks, "in doubt"',
            },
            {
              type: 'heading',
              text: 'Saga Pattern',
            },
            {
              type: 'p',
              text: 'Break a distributed transaction into a sequence of local transactions, each with a corresponding **compensating transaction** that undoes it if a later step fails (e.g., `ReserveInventory` ↔ `ReleaseInventory`, `ChargePayment` ↔ `RefundPayment`). Two coordination styles:',
            },
            {
              type: 'list',
              items: [
                '**Choreography**: each service publishes an event on completing its step; the next service reacts to it. No central coordinator, but the overall flow is implicit and harder to trace/reason about as the number of steps grows.',
                '**Orchestration**: a central orchestrator service explicitly calls each step and invokes compensations on failure. Easier to reason about and monitor as a single defined workflow, at the cost of that orchestrator becoming a (non-blocking, but still central) point of coordination logic.',
              ],
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Orchestrator\n    participant Inventory\n    participant Payment\n    participant Shipping\n\n    Orchestrator->>Inventory: ReserveStock(orderId)\n    Inventory-->>Orchestrator: Reserved\n    Orchestrator->>Payment: ChargeCard(orderId)\n    Payment-->>Orchestrator: Failed (insufficient funds)\n    Orchestrator->>Inventory: CompensateReleaseStock(orderId)\n    Inventory-->>Orchestrator: Released\n    Orchestrator-->>Orchestrator: Order marked FAILED',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is the standard answer to "how do you handle a checkout flow that spans Inventory, Payment, and Shipping services without a shared database transaction." Notice both `ChargeCard` and its compensation `RefundPayment` need to be safe to retry — if the orchestrator itself crashes and resumes, it may re-issue a step it already ran. That safety is exactly the idempotency guarantee from the previous topic; a Saga without idempotent steps is not actually safe.',
            },
            {
              type: 'heading',
              text: 'Designing a Saga That Survives Production',
            },
            {
              type: 'list',
              items: [
                '**Order steps by reversibility**: put compensatable steps first, then the **pivot transaction** (the go/no-go point, often the payment capture), then **retriable** steps that must eventually succeed and are never compensated (send confirmation, create shipment request). Hard-to-undo steps go after the pivot.',
                '**Compensation is semantic, not a rollback**: you cannot un-send an email; you send a correction. A refund is a new transaction, visible on the customer\'s statement. Design compensations with the business.',
                '**Sagas lack isolation (the "I" in ACID)**: other transactions see intermediate states. Countermeasures: a **semantic lock** (order status `PENDING` that other flows respect), commutative updates, re-reading values before acting, and reservations with expiry instead of hard decrements.',
                '**Compensations can fail too**: they must be retried until they succeed, and an un-compensatable failure goes to a human-handled queue with full context.',
                '**Persist orchestrator state durably** before each step, so a crash resumes rather than restarts. This is exactly what durable-execution engines provide.',
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Orchestrated saga as a durable workflow (Temporal TypeScript SDK style)',
              code: `import { proxyActivities } from '@temporalio/workflow';
import type * as acts from './activities';

const { reserveStock, releaseStock, chargeCard, refundCard, createShipment } =
  proxyActivities<typeof acts>({
    startToCloseTimeout: '30 seconds',
    retry: { maximumAttempts: 5, backoffCoefficient: 2 },  // activities must be idempotent
  });

export async function checkoutWorkflow(order: Order): Promise<string> {
  const compensations: Array<() => Promise<void>> = [];
  try {
    await reserveStock(order.id, order.items);
    compensations.unshift(() => releaseStock(order.id));

    await chargeCard(order.id, order.total);          // pivot: idempotency key = order.id
    compensations.unshift(() => refundCard(order.id));

    await createShipment(order.id);                   // retriable, past the pivot
    return 'COMPLETED';
  } catch (err) {
    for (const undo of compensations) await undo();   // run in reverse order
    return 'FAILED';
  }
}
// The workflow's progress is event-sourced by the engine: if the worker crashes after
// chargeCard, a new worker replays history and continues at createShipment.`,
            },
            {
              type: 'table',
              headers: ['Approach', 'Atomicity', 'Availability / coupling', 'Real-world fit'],
              rows: [
                ['2PC / XA', 'Atomic', 'Blocking on coordinator failure; all participants must support the protocol', 'Within one database vendor or tightly coupled infra; rarely across services'],
                ['Distributed SQL (Spanner, CockroachDB, YugabyteDB)', 'Atomic, serializable', 'Consensus-replicated, so no single blocking coordinator; higher write latency', 'When the data can live in one distributed database'],
                ['Saga (orchestrated)', 'Eventual via compensation', 'Loosely coupled; central workflow state', 'Complex multi-step business flows, external parties'],
                ['Saga (choreographed)', 'Eventual via compensation', 'Most decoupled; flow is implicit', 'Short flows with 2-4 steps and stable ownership'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Durable-execution engines — Temporal, AWS Step Functions, Azure Durable Functions, Restate, and Cadence — have become the mainstream way to implement orchestrated sagas, replacing hand-rolled state machines over a database table. In interviews, naming one and explaining *why* it works (persisted event history, deterministic replay, activity retries with idempotency) is stronger than drawing the boxes.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Every saga step that "updates my database and then publishes an event" hides the **dual-write problem** — the process can crash between the two. The next topic, the transactional outbox, is the standard fix and is essentially mandatory for choreographed sagas.',
            },
          ],
        },
        {
          id: 'transactional-outbox-cdc',
          title: 'The Dual-Write Problem: Transactional Outbox, Inbox, and Change Data Capture',
          summary:
            'Writing to your database and publishing a message are two separate systems, and no amount of try/catch makes them atomic. The outbox pattern (often fed by CDC) is how reliable event-driven systems actually publish.',
          keyPoints: [
            'Dual write: "save to DB, then publish to Kafka" loses the event if the process crashes in between; "publish, then save" emits events for changes that never happened.',
            'Transactional outbox: write the business change and an outbox row in the same local ACID transaction; a separate relay publishes outbox rows to the broker.',
            'The relay is at-least-once (it may publish a row twice after a crash), so consumers must deduplicate — typically with an inbox / processed-events table keyed by event ID.',
            'Relays either poll the outbox table or tail the database log with CDC (Debezium, cloud-native CDC); log tailing gives lower latency and less DB load.',
            'Ordering: publish with the aggregate ID as the message key so events for one entity stay in order on one partition.',
            'Listen-to-yourself and CDC on business tables are alternatives with different tradeoffs; distributed transactions (XA) between DB and broker are the option you almost never want.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n    API[Order Service] -->|"BEGIN<br/>INSERT order<br/>INSERT outbox row<br/>COMMIT"| DB[(Orders DB)]\n    DB -->|"WAL / binlog"| CDC["Relay<br/>(Debezium or poller)"]\n    CDC -->|"key = orderId"| K[[Kafka topic: orders]]\n    K --> C1["Billing consumer<br/>+ inbox dedupe"]\n    K --> C2["Search indexer"]\n    K --> C3["Email service"]',
            },
            {
              type: 'code',
              language: 'sql',
              title: 'Outbox table and the atomic write',
              code: `CREATE TABLE outbox (
  id             uuid PRIMARY KEY,          -- becomes the event ID consumers dedupe on
  aggregate_type text        NOT NULL,      -- e.g. 'Order' -> routes to topic 'orders'
  aggregate_id   text        NOT NULL,      -- message key -> per-entity ordering
  type           text        NOT NULL,      -- 'OrderPlaced'
  payload        jsonb       NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

BEGIN;
  INSERT INTO orders (id, customer_id, total, status)
  VALUES ('o-42', 'c-7', 99.00, 'PLACED');

  INSERT INTO outbox (id, aggregate_type, aggregate_id, type, payload)
  VALUES (gen_random_uuid(), 'Order', 'o-42', 'OrderPlaced',
          '{"orderId":"o-42","customerId":"c-7","total":99.00}');
COMMIT;   -- both rows or neither: the event exists iff the state change exists`,
            },
            {
              type: 'heading',
              text: 'Two Ways to Run the Relay',
            },
            {
              type: 'table',
              headers: ['Relay', 'How', 'Pros', 'Cons'],
              rows: [
                ['Polling publisher', '`SELECT ... FROM outbox ORDER BY created_at LIMIT 100 FOR UPDATE SKIP LOCKED`, publish, then delete/mark sent', 'Simple, no extra infrastructure', 'Polling latency and DB load; careful with ordering across concurrent pollers and commit-time vs insert-time ordering'],
                ['Log-tailing CDC', 'Debezium (Kafka Connect or Debezium Server) reads the Postgres WAL / MySQL binlog; its outbox event router SMT maps rows to topics', 'Low latency, no polling load, exact commit order', 'Operating Kafka Connect, replication slots (an abandoned Postgres slot retains WAL until the disk fills)'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Publishing from an `afterCommit` hook or a Spring `@TransactionalEventListener` is not an outbox.** The hook runs in memory after commit; if the process dies before it fires, the event is gone. The durable row in the same transaction is the entire point.',
            },
            {
              type: 'heading',
              text: 'The Consumer Side: Inbox Pattern',
            },
            {
              type: 'p',
              text: 'Because the relay can publish a row twice (it published, then crashed before marking it sent) and the broker can redeliver after a rebalance, consumers record each processed event ID in an **inbox** table within the same transaction as their own state change (see the Kafka consumer example in the messaging topic). Outbox on the producer side plus inbox on the consumer side is what "effectively exactly-once" looks like across service boundaries.',
            },
            {
              type: 'heading',
              text: 'Alternatives and When They Fit',
            },
            {
              type: 'list',
              items: [
                '**CDC directly on business tables** (no outbox table): zero application changes, great for feeding search indexes, caches, and analytics. Downside: you publish your internal schema as a contract; renaming a column breaks consumers. Use an outbox for integration events between services.',
                '**Listen to yourself**: publish the event first, and have the service consume its own event to update its database. Works with a log as the source of truth, but the service cannot read its own write immediately.',
                '**Event sourcing**: the event store *is* the database, so there is no dual write — subscribers read the store directly.',
                '**Cloud-native variants**: DynamoDB Streams, Cosmos DB change feed, Spanner change streams, and MongoDB change streams all act as built-in CDC, so writing an outbox item in the same transaction and consuming the stream is the equivalent pattern.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If an interviewer hears "and then the service publishes an `OrderPlaced` event," the follow-up is almost always "what if it crashes right after the DB commit?" Answering "transactional outbox with Debezium, keyed by order ID, and idempotent consumers with an inbox table" closes the topic in one sentence.',
            },
          ],
        },
        {
          id: 'case-study-ecommerce',
          title: 'Case Study: End-to-End Architecture for an E-Commerce Platform',
          summary:
            'Ties together nearly every concept above into one coherent system — a strong template for "design Amazon/Flipkart" prompts.',
          keyPoints: [
            'The product catalog is read-heavy → cached, served from replicas, and mirrored into Elasticsearch via change-data-capture.',
            'The cart is ephemeral and high-write → a fast key-value store with TTL, not the relational order DB.',
            'Checkout is the one place strong consistency is non-negotiable — the Order Orchestrator runs a Saga across Inventory, Payment, and Shipping.',
            'Everything off checkout\'s latency budget (email, analytics, recommendations) goes through the event bus asynchronously.',
            'Auth is centralized at the API Gateway; downstream services trust a signed, gateway-issued context.',
            'Every single point of failure is explicitly eliminated: replicated DBs, a clustered event bus, and a load-balanced gateway.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Ties together nearly every concept above — partitioning, replication, caching, consensus-backed coordination, event-driven decoupling, idempotency, and Sagas — into one coherent system. A strong template for "design Amazon/Flipkart" prompts.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    Client[Web/Mobile Client] --> CDN[CDN<br/>static assets, product images]\n    Client --> APIGW[API Gateway<br/>authn, rate limiting, routing]\n\n    APIGW --> ProductSvc[Product Catalog Service]\n    APIGW --> CartSvc[Cart Service]\n    APIGW --> OrderSvc[Order Orchestrator]\n    APIGW --> UserSvc[User/Auth Service]\n    APIGW --> SearchSvc[Search Service]\n\n    ProductSvc --> ProductDB[(Product DB<br/>Postgres, read replicas)]\n    ProductSvc --> ProductCache[(Redis Cache)]\n    SearchSvc --> ES[(Elasticsearch)]\n    ProductSvc -.change data capture.-> ES\n\n    CartSvc --> CartStore[(Cart Store<br/>Redis / DynamoDB, TTL-based)]\n\n    OrderSvc --> InventorySvc[Inventory Service]\n    OrderSvc --> PaymentSvc[Payment Service]\n    OrderSvc --> ShippingSvc[Shipping Service]\n    InventorySvc --> InventoryDB[(Inventory DB<br/>strong consistency)]\n    PaymentSvc --> PaymentGW[External Payment Gateway]\n    OrderSvc --> OrderDB[(Order DB)]\n\n    OrderSvc --> EventBus[[Event Bus / Kafka]]\n    EventBus --> NotificationSvc[Notification Service]\n    EventBus --> AnalyticsSvc[Analytics Pipeline]\n    EventBus --> RecommendationSvc[Recommendation Service]\n\n    UserSvc --> UserDB[(User DB)]\n    UserSvc --> AuthCache[(Session/Token Cache)]',
            },
            {
              type: 'heading',
              text: 'Key architectural decisions, and why',
            },
            {
              type: 'list',
              items: [
                '**Product catalog is read-heavy and read-mostly** → aggressively cached, served from replicas, and mirrored into Elasticsearch via change-data-capture for search — the catalog DB is never queried directly for search-style access patterns.',
                '**Cart is ephemeral, per-user, high write volume** → a fast key-value store with TTL (abandoned carts expire naturally), not the relational order DB.',
                '**Checkout is the one place strong consistency is non-negotiable** → the Order Orchestrator runs a Saga across Inventory (must not oversell), Payment (must not double-charge — idempotency keys), and Shipping, with explicit compensations on failure, rather than a single distributed transaction across services.',
                '**Everything non-critical-path off checkout\'s latency budget goes through the event bus** — sending a confirmation email, updating analytics, feeding the recommendation engine, are all async subscribers to `OrderPlaced`, not synchronous calls the checkout flow waits on. This is the practical application of "decouple with an event bus."',
                '**Auth is centralized at the API Gateway** (validate the token once, on the way in) rather than every downstream service re-validating a raw credential — downstream services trust a signed, gateway-issued context (see the Authentication & Authorization guide for the deep dive).',
                '**Single points of failure are explicitly eliminated**: every DB has replicas, the event bus is a clustered/partitioned Kafka deployment (not one broker), and the API Gateway itself is deployed behind a load balancer across multiple instances/AZs.',
                '**`OrderPlaced` is published via a transactional outbox**, not a direct Kafka call after the DB commit — otherwise a crash between the two silently drops the email, the analytics row, and the warehouse pick request.',
                '**Inventory uses reservations with expiry, not immediate decrements**: checkout reserves stock (`available - reserved`), payment capture confirms it, and an expired reservation releases it automatically — which also handles abandoned payment pages without a compensation step.',
                '**Flash sales get special treatment**: a hot SKU is a hot key. Pre-split stock into buckets, gate entry with a queue/waiting room and a rate limiter, and shed non-critical features first (recommendations, reviews) under load.',
              ],
            },
            {
              type: 'heading',
              text: 'Failure Walkthrough Interviewers Expect',
            },
            {
              type: 'table',
              headers: ['Failure', 'What the design does'],
              rows: [
                ['Payment provider times out', 'Retry with the same idempotency key (order ID); if still unknown, mark order `PAYMENT_PENDING` and reconcile via provider webhook or status poll — never charge twice, never assume failure.'],
                ['Redis cache cluster lost', 'Catalog falls back to replicas behind a concurrency limit; L1 in-process cache absorbs the hottest keys; non-critical widgets degrade.'],
                ['Kafka unavailable for 10 minutes', 'Orders still commit — outbox rows accumulate and the relay drains them on recovery; consumers catch up from their offsets.'],
                ['Inventory service slow', 'Circuit breaker opens; checkout returns a clear "try again" rather than hanging; bulkhead keeps browse and cart working.'],
                ['Bad deploy in one region/cell', 'Canary + automated rollback on error-rate SLO; cell isolation limits blast radius to a fraction of customers.'],
              ],
            },
          ],
        },
        {
          id: 'common-interview-prompts',
          title: 'Common System Design & Architecture Interview Prompts',
          summary:
            'A practical prompt list to rehearse against — each one draws on the mechanisms covered above.',
          keyPoints: [
            'These prompts are less about memorizing one correct architecture and more about correctly applying CAP tradeoffs, partitioning, consensus, caching, and replication to a new domain.',
            'Several of these map directly onto a subset of the e-commerce case study\'s building blocks.',
            'Practice explaining the mechanism (why), not just naming the component (what).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'For each of these, the weak answer names a technology ("I\'d use Redis"). The strong answer names the mechanism that technology relies on — which is exactly what the rest of this guide equips you to do. A one-line pointer to the relevant mechanism is included below; cover it up and see if you can supply it yourself before reading it.',
            },
            {
              type: 'list',
              items: [
                'Design a distributed cache (like Redis) from scratch. — *Mechanism:* consistent hashing to place keys, an eviction policy per node, and a replication strategy so a node failure doesn\'t lose the cached data outright.',
                'Design a distributed job scheduler (like Airflow/Quartz at scale). — *Mechanism:* leader election (Raft) so only one scheduler instance dispatches a given job at a time, plus idempotent job execution so a retried/duplicated dispatch is safe.',
                'Design a config management system. — *Mechanism:* a small, strongly-consistent store (etcd/ZooKeeper, backed by consensus) as the source of truth, with local caching at each service and a push/watch mechanism to propagate changes.',
                'Design a service mesh\'s core routing/observability behavior. — *Mechanism:* a sidecar proxy per service instance doing L7 load balancing, retries, and circuit breaking, with a control plane pushing routing config to every sidecar.',
                'Design a multi-tenant SaaS architecture (data isolation strategies). — *Mechanism:* pick a point on the isolation spectrum — shared tables with a `tenant_id` column (cheapest, weakest isolation) vs. schema-per-tenant vs. database-per-tenant (most isolation, most operational overhead) — and justify it by the compliance/noisy-neighbor requirements, not by default.',
                'Design a CI/CD pipeline architecture. — *Mechanism:* an event-driven pipeline (push triggers a build event), with build/test/deploy stages as independently scalable workers consuming from a queue, and idempotent deploy steps so a retried deployment doesn\'t double-apply.',
                'Design a metrics/monitoring pipeline (like Prometheus/Datadog). — *Mechanism:* high-volume time-series writes favor an LSM-tree-style storage engine; the pipeline itself is a stream-processing/aggregation problem much like the ad-click pipeline in the HLD guide.',
                'Design a feature flag system. — *Mechanism:* the same read-heavy, low-latency shape as config management — cache flag evaluations locally at each service and push updates, rather than making every request block on a network round trip to check a flag.',
                'Design a distributed lock manager. — *Mechanism:* consensus underneath (Raft/etcd/ZooKeeper) with leases so a crashed holder cannot deadlock the resource forever, and monotonically increasing **fencing tokens** that the protected resource checks, because a paused holder can outlive its lease. Redlock-style approaches lack fencing and depend on timing assumptions, so they are only appropriate for efficiency locks.',
                'Design a rate limiter for a public API. — *Mechanism:* token bucket or sliding-window counter per API key, atomic updates in Redis via a Lua script, local fallback limiter, a fail-open/closed decision, and `429` + `Retry-After` responses.',
                'Design a notification system (email/SMS/push) that never double-sends. — *Mechanism:* transactional outbox from the triggering service, a queue per channel with retries and a DLQ, idempotency keyed by `(notification_id, channel)`, per-user rate limits and preferences, and provider failover behind circuit breakers.',
                'Design a payment / ledger service. — *Mechanism:* double-entry ledger as an append-only (often event-sourced) log, idempotency keys on every external call, a state machine per payment with a reconciliation job against the provider, and strong consistency (single leader or serializable transactions) for balances.',
                'Design a webhook delivery platform. — *Mechanism:* durable queue per destination (bulkheads so one slow customer endpoint cannot starve others), exponential backoff with jitter for hours, signed payloads, an event ID for receiver-side dedupe, and a replay UI backed by retained events.',
                'Design an API gateway. — *Mechanism:* L7 load balancing plus the cross-cutting concerns centralized at the edge — authentication (see the case study above), rate limiting, and request routing — so downstream services don\'t each reimplement them.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'system-design-patterns-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: '44 system design and architecture interview questions with full-depth answers.',
          qa: [
            {
              question: 'What is a distributed system, and why can\'t every problem just be solved by using a bigger single machine?',
              answer:
                'A distributed system is a collection of independent computers that coordinate over a network to appear as one system to users. Vertical scaling a single machine is simpler (no coordination complexity) and is the right first move for many systems, but it hits a physical ceiling (a machine can only hold so much CPU/RAM/disk) and an economic one (cost grows faster than linearly at the top end), and it remains a single point of failure no matter how large it gets. Horizontal scaling (many machines) has no such ceiling and tolerates individual machine failures, but introduces a network between the machines — and a network is slower, less reliable, and fails in ways an in-process function call never does. Every technique in a distributed systems curriculum (partitioning, replication, consensus, caching, idempotency) exists specifically to manage that tradeoff.',
            },
            {
              question: 'What exactly does the CAP theorem say, and what\'s the most common misunderstanding about it in interviews?',
              answer:
                'CAP says that during a network partition, a distributed data system must choose between Consistency (every read reflects the latest write) and Availability (every request gets a non-error response) — it cannot guarantee both simultaneously in that scenario. The most common misunderstanding is treating it as "pick any 2 of 3 at all times," including offering "CA" as an option — but partition tolerance isn\'t really a design choice for a real multi-node system; networks partition whether or not you plan for it, so the only meaningful, ongoing decision is how the system behaves when a partition happens (CP or AP). The other common gap is forgetting CAP only describes partition behavior — outside of a partition, a well-built system delivers both consistency and availability; PACELC is the fuller model that also covers the latency-vs-consistency tradeoff during normal operation.',
            },
            {
              question: 'What are the "Fallacies of Distributed Computing," and why does naming them matter in a system design interview?',
              answer:
                'They\'re a catalog of false assumptions engineers make about networks that reliably cause production incidents when unexamined: the network is reliable, latency is zero, bandwidth is infinite, the network is secure, topology doesn\'t change, there is one administrator, transport cost is zero, and the network is homogeneous. They matter in an interview because a design that implicitly assumes any of these (e.g., "the service just calls the other service and gets the result" with no mention of timeouts, retries, or partial failure) signals the candidate hasn\'t internalized what actually makes distributed systems hard. Explicitly naming the assumption being violated — "that call can time out, so we need a retry policy and idempotency on the receiving end" — is a concrete, low-cost way to demonstrate senior-level awareness.',
            },
            {
              question: 'What\'s the difference between partitioning and replication, and why do real systems need both?',
              answer:
                'Partitioning (sharding) splits a dataset into pieces spread across multiple machines to scale storage and throughput — no single machine has to hold or serve all the data. Replication copies each piece of data onto multiple machines to provide durability (a disk failure doesn\'t lose data) and availability (a machine going down doesn\'t make that data unreachable). They solve different problems and are orthogonal: partitioning alone with no replication means losing one shard\'s machine loses that slice of data entirely; replication alone with no partitioning means every machine still has to hold the full dataset, which doesn\'t solve the scaling problem. Production distributed databases (Cassandra, DynamoDB, sharded MongoDB) do both at once — the dataset is split into partitions, and each partition is itself replicated across several nodes.',
            },
            {
              question: 'Explain consistent hashing and why virtual nodes matter.',
              answer:
                'Consistent hashing places both nodes and keys on a hash ring; a key is owned by the next node clockwise. Adding/removing a node only remaps the keys in its immediate arc (~1/N of all keys), unlike `hash % N` which remaps almost everything. Virtual nodes assign each physical node many positions on the ring so load balances evenly regardless of ring geometry, and a failed node\'s load spreads across many survivors instead of dumping entirely onto one neighbor. They also let heterogeneous hardware take proportional load (more tokens for bigger machines). The tradeoffs to mention: more vnodes means more metadata and slower repair/streaming (which is why Cassandra 4.0 cut its default from 256 to 16 tokens with a smarter allocator), consistent hashing does nothing for a single hot key, and many production systems (DynamoDB, Bigtable, CockroachDB) instead use explicit partitions tracked by a metadata service, which allows splitting hot ranges on demand. Alternatives worth naming are rendezvous hashing and jump consistent hash.',
            },
            {
              question: 'What\'s the difference between Paxos and Raft, and why did Raft become more popular in real systems?',
              answer:
                'Both solve distributed consensus with the same safety guarantees (a majority quorum, never agreeing on two different values for the same slot). Paxos describes the algorithm more abstractly and is notoriously difficult to reason about and implement correctly in its full multi-decree form. Raft was explicitly designed for understandability: it decomposes the problem into leader election, log replication, and safety, with a single, clearly-defined leader role at any time. That clarity is why etcd, Consul, and most modern infrastructure choose Raft over classic Paxos, even though they\'re equivalent in theoretical power.',
            },
            {
              question: 'Why do consensus clusters typically run with an odd number of nodes (3 or 5), not an even number?',
              answer:
                'Progress requires a strict majority quorum. With 3 nodes, you tolerate 1 failure (need 2 of 3). With 4 nodes, you still only tolerate 1 failure (need 3 of 4) — the 4th node adds cost without adding fault tolerance, since a majority of 4 is 3, the same as needing to survive with 3. Odd numbers maximize fault tolerance per node deployed and also avoid tie votes during leader election.',
            },
            {
              question: 'Explain the tradeoff between B-trees and LSM trees, and when you\'d pick each for a new data store.',
              answer:
                'B-trees update in place and are read-optimized — great for workloads with a high proportion of point/range reads and moderate writes (typical OLTP relational workloads). LSM trees buffer writes in memory and flush as immutable sorted files, turning random writes into sequential ones, which gives much higher write throughput at the cost of read amplification (checking multiple files, mitigated by bloom filters) and background compaction overhead. Pick B-trees for read-heavy, transactional workloads; pick LSM trees for write-heavy workloads (logging, time-series, event ingestion) where write throughput matters more than the fastest possible single read.',
            },
            {
              question: 'What is a write-ahead log and why do virtually all durable storage engines have one?',
              answer:
                'A WAL is an append-only log that records every intended change before it\'s applied to the main data structure (whether a B-tree page or an LSM memtable). Because it\'s append-only, writing to it is fast (sequential I/O) and the write can be considered durable as soon as it\'s flushed to the log — the actual in-memory/page-cache update can happen after. If the process crashes before flushing the "real" structure to disk, replaying the WAL on restart recovers all committed changes. It\'s the universal mechanism that lets a database claim durability without requiring every write to be a slow, fully-synced random I/O to its main data files.',
            },
            {
              question: 'Why does adding an index speed up reads but slow down writes, and what\'s a "left-prefix" rule for composite indexes?',
              answer:
                'An index is a separate ordered structure (usually its own B-tree/LSM tree) mapping column value → row location, so a lookup on that column can binary-search instead of scanning every row — but every write to the table now must also update every index defined on it, multiplying write cost by the number of indexes. A composite index on `(A, B, C)` is physically sorted by A first, then B within each A, then C within each (A, B) — so it can efficiently serve queries filtering on `A`, or `A and B`, or `A and B and C`, but not a query filtering on `B` alone, because the index isn\'t sorted by B independently of A. This is the "left-prefix" rule, and it\'s a frequent gotcha in both interviews and real production slow-query debugging.',
            },
            {
              question: 'When should you choose microservices over a monolith, and what\'s the most common mistake teams make with this decision?',
              answer:
                'Choose microservices when you have clear, stable bounded contexts, multiple teams that need to deploy independently without blocking each other, and components with genuinely different scaling profiles. The most common mistake is adopting microservices prematurely — before the domain boundaries are well understood — which results in "distributed monolith": services that are still tightly coupled (shared database, synchronous call chains, coordinated deployments) but now also pay the full tax of network calls, partial failure, and operational complexity, with none of the independence benefits.',
            },
            {
              question: 'What does it mean for an operation to be idempotent, and why does that matter specifically for retrying requests in a distributed system?',
              answer:
                'An operation is idempotent if performing it multiple times has the same effect as performing it once — `SET balance = 100` is idempotent, `balance += 100` is not. It matters because, per the fallacies of distributed computing, a network call\'s failure is ambiguous: a caller who times out cannot tell whether the request never arrived or arrived and succeeded but the response was lost. The only generally safe response to that ambiguity is to retry — and retrying is only safe if doing the operation twice has the same effect as doing it once. In practice this is achieved with an idempotency key (a client-generated ID sent with every retry of the same logical operation) that lets the receiver recognize and no-op a duplicate rather than re-executing it — this is exactly how payment APIs prevent a retried request from double-charging a customer.',
            },
            {
              question: 'What\'s the practical difference between at-least-once, at-most-once, and "exactly-once" delivery — and is exactly-once actually real?',
              answer:
                'At-most-once sends a message once and never retries — simple, but a lost message is lost forever. At-least-once retries until acknowledged — no message is silently lost, but the same message may be delivered/processed more than once, so the receiver must handle duplicates. "Exactly-once" describes each message\'s effect being applied precisely once, but as a pure network-transmission guarantee it is not achievable in an asynchronous system with unreliable networks — the sender can never be fully certain its message (or the acknowledgment of it) wasn\'t lost, which reintroduces the need to retry. What systems that market "exactly-once" (Kafka\'s idempotent producers, SQS FIFO) actually deliver is at-least-once transmission plus deduplication/idempotent processing on the receiving end, which behaves like exactly-once from the caller\'s point of view without literally being a single-transmission guarantee.',
            },
            {
              question: 'Explain the Saga pattern and the difference between choreography and orchestration.',
              answer:
                'A Saga breaks a multi-service transaction into a sequence of local transactions, each paired with a compensating action to undo it if a later step fails — avoiding a blocking two-phase-commit-style distributed transaction. In choreography, each service publishes an event when it completes its step and reacts to others\' events, with no central coordinator — simple for short flows, but the overall business process becomes implicit and hard to observe/debug as steps grow. In orchestration, a central orchestrator explicitly invokes each step and its compensation on failure — easier to monitor, test, and reason about as one defined workflow, at the cost of that orchestrator being a piece of central logic (not a blocking coordinator like in 2PC, since each local transaction still commits independently).',
            },
            {
              question: 'What\'s the practical difference between choosing eventual consistency for a "like count" versus needing strong consistency for "account balance," in terms of actual implementation?',
              answer:
                'A like count can be incremented via an eventually-consistent, highly-available path (e.g., a counter in a leaderless/quorum store, or even an async aggregation pipeline) because a user seeing "241 likes" vs "242 likes" for a few seconds has zero real-world consequence, and optimizing for availability/low-latency writes at extreme scale is worth that imprecision. An account balance must use a strongly consistent path (single-leader write with synchronous replication acknowledgment, or a serializable transaction) because two concurrent reads returning different, both-stale balances could let a user overdraw an account or a system double-spend — the cost of an occasional slower write is far preferable to the cost of financial incorrectness. The implementation difference: the like counter can tolerate `W=1` or async fire-and-forget; the balance requires a transaction with proper isolation (or a Saga with compensations if it spans services) and no read-your-own-write violations.',
            },
            {
              question: 'What\'s CQRS and what specific problem does it solve that a single shared model doesn\'t?',
              answer:
                'CQRS separates the model used to validate and persist writes (optimized around business rules and invariants) from the model(s) used to serve reads (optimized around the exact shapes the UI/API consumers need, often heavily denormalized and pre-joined). A single shared model forces a compromise: either it\'s normalized (good for write correctness, requires expensive joins for read-heavy queries) or denormalized (fast reads, but risks invariant violations and redundant update logic on writes). CQRS lets each side use the model that\'s actually efficient for its job, at the cost of the read side lagging the write side by the time it takes events to propagate (eventual consistency between write and read models).',
            },
            {
              question: 'What is event sourcing, and what\'s the biggest practical cost teams underestimate when adopting it?',
              answer:
                'Event sourcing stores the sequence of events that produced the current state (rather than just the current state), and derives state by replaying events — giving a perfect audit trail and the ability to reconstruct state at any historical point. The biggest underestimated cost is **event schema evolution**: once events are in the store, you can never really delete or freely restructure the old ones (they\'re the permanent history), so every change to an event\'s shape needs a versioning/migration strategy (upcasting old event versions to the current shape at read time, or maintaining parallel handlers), and this discipline has to be designed in from day one — retrofitting it onto an event store that already has years of un-versioned events is extremely painful.',
            },
            {
              question: 'Why is two-phase commit rarely used across microservices in practice, even though it guarantees atomicity?',
              answer:
                '2PC requires every participant to be reachable and to hold locks on its resources throughout both phases — if the coordinator crashes after participants have "prepared" but before it sends the final commit/abort, participants are stuck holding locks indefinitely ("in-doubt" transactions), blocking other operations on those resources. This tight coupling (everyone must be simultaneously available, and lock duration is at the mercy of network/coordinator latency) is exactly what microservice architectures try to avoid — it reintroduces the availability and coupling costs microservices were adopted to escape. The Saga pattern trades strict atomicity for eventual consistency with compensations, which fits the "independent, eventually-consistent services" model far better.',
            },
            {
              question: 'Explain the difference between read-through and cache-aside caching — they sound similar.',
              answer:
                'Functionally similar (a miss triggers a DB read and cache population), but the responsibility differs: in cache-aside, the *application code* explicitly checks the cache, and on a miss, explicitly reads the DB and explicitly writes the result into the cache — the cache is a "dumb" key-value store the app orchestrates around. In read-through, the *cache itself* (via a configured loader function) is responsible for fetching from the DB on a miss — the application only ever talks to the cache, never falls back to the DB directly. Read-through centralizes the loading logic (useful if many different services would otherwise duplicate cache-aside boilerplate); cache-aside gives the application more explicit control (e.g., choosing not to cache certain results based on business logic).',
            },
            {
              question: 'What causes a cache stampede, and what are two different ways to prevent it?',
              answer:
                'A cache stampede happens when a hot key\'s cache entry expires (or the cache restarts cold) and a large number of concurrent requests all miss simultaneously, all falling through to the database at once — which can be enough load to take the database down even though it normally handles that traffic fine when cached. Prevention: (1) request coalescing/single-flight — the first request to miss acquires a per-key lock/promise and repopulates the cache while all concurrent requests for that same key wait on the result instead of independently hitting the DB; (2) probabilistic early expiration — refresh a hot key\'s cache entry slightly before its actual TTL, with jitter, so refreshes are staggered across time instead of a whole cohort of keys expiring in the same instant (which itself often happens because they were all cached at the same time by a cold-start warm-up).',
            },
            {
              question: 'In the e-commerce architecture case study, why is the shopping cart stored in a different data store than the order?',
              answer:
                'The cart has fundamentally different access and lifecycle characteristics than an order: it\'s mutated frequently (every add/remove), is per-user and often abandoned (most carts never convert), and needs no long-term durability guarantee beyond a reasonable expiry — a fast key-value store with a TTL is a good fit, and losing an abandoned cart occasionally is a non-event. An order, once placed, is a permanent financial/business record that needs strong durability, auditability, and often relational integrity with line items, payment records, and inventory decrements — it belongs in a properly durable, likely relational, store. Conflating the two into one data store means over-provisioning durability/consistency guarantees for cart data that doesn\'t need them, or under-provisioning them for order data that can\'t do without them.',
            },
            {
              question: 'Why does the case study put authentication/token validation at the API Gateway instead of in every downstream service?',
              answer:
                'Centralizing auth at the gateway means the actual credential/token verification logic (signature checks, revocation checks, session lookups) exists in exactly one place, avoiding both duplicated logic across N services (each a chance to get it subtly wrong) and duplicated latency cost (N services each independently validating the same token). Downstream services instead trust a lightweight, signed context the gateway attaches to the forwarded request (e.g., a validated JWT or an internal service-to-service token asserting the caller\'s identity/claims) — this is the standard "trust boundary" pattern: expensive/sensitive verification happens once at the edge, and internal services trust what crossed that boundary. The tradeoff to name: this makes the gateway a critical dependency for every request, so its own availability and the token-validation latency it adds become first-class concerns.',
            },
            {
              question: 'What\'s the difference between choreography-based events and a Saga orchestrator, in terms of how you\'d debug "order #4521 got stuck halfway through checkout" at 2am?',
              answer:
                'With choreography, debugging requires reconstructing the implicit flow from scattered event logs across every service that touched the order — there\'s no single place that shows "step 3 of 5 completed, step 4 failed," you have to correlate timestamps and event payloads across systems (a correlation/trace ID is essential here, without one this is nearly undebuggable at scale). With orchestration, the orchestrator itself holds explicit state for the workflow ("Inventory: done, Payment: failed, Shipping: not started") which can typically be queried directly — you look at one place and see exactly which step failed and why, then decide whether to retry or trigger compensations manually. This operational debuggability is a major practical reason teams choose orchestration for complex, multi-step business transactions even though choreography is architecturally more decoupled.',
            },
            {
              question: 'Why is "just use a distributed transaction" usually the wrong answer when an interviewer asks about a checkout flow spanning Inventory, Payment, and Shipping services?',
              answer:
                'A distributed transaction (2PC) requires all three services to hold locks and remain available simultaneously for the duration of the transaction, meaning the checkout\'s availability is now the *product* of all three services\' availability (if any one is briefly unavailable or slow, the whole transaction blocks or fails), and a coordinator crash mid-transaction can leave resources locked indefinitely. It also assumes all three can even participate in a shared transactional protocol, which often isn\'t true once Payment involves an external, third-party gateway you don\'t control. The Saga pattern accepts a brief window of intermediate, visible state (inventory reserved but payment not yet confirmed) in exchange for each service only ever managing its own local transaction plus a well-defined compensating action — trading strict atomicity for availability and loose coupling, which is almost always the right trade for cross-service business workflows.',
            },
            {
              question: 'How would you decide between hash-based and range-based partitioning for a new sharded system?',
              answer:
                'Hash-based partitioning (hash the key, mod/ring to a shard) distributes load evenly and avoids hot shards from sequential access patterns, but destroys the ability to do efficient range scans (e.g., "all events between time T1 and T2") since adjacent keys land on unrelated shards. Range-based partitioning (contiguous key ranges per shard) keeps range scans efficient and local to one or a few shards, but risks a hot shard when writes are skewed toward one part of the key space (the classic failure mode: partitioning a time-series table by timestamp range means all *current* writes hit the single "latest" shard). The decision hinges on the dominant query pattern: point lookups at even load favor hash-based; range queries on an inherently ordered key (with a mitigation for the "hot latest shard" problem, like also hashing a secondary dimension into the key) favor range-based.',
            },
            {
              question: 'What does "the coordinator is a single point of failure" mean concretely for 2PC, and how does Saga orchestration avoid the same problem despite also having a central orchestrator?',
              answer:
                'In 2PC, the coordinator\'s failure mid-protocol leaves participants in an "in-doubt" state — they\'ve prepared (locked resources) but don\'t know whether to commit or abort, and must block until the coordinator recovers or a recovery protocol resolves the ambiguity; this is a true availability failure, not just an inconvenience. A Saga orchestrator\'s failure is different in kind: each step is already a committed local transaction (no locks held across steps), so if the orchestrator crashes, it can simply resume from its last recorded state once restarted (or a new orchestrator instance can pick up the persisted workflow state) — nothing is left "in doubt" because nothing was ever left half-committed waiting on a second phase. The orchestrator needing to be *eventually* available to resume/complete a workflow is a much weaker requirement than 2PC\'s participants needing the coordinator to be available to release locks *right now*.',
            },
            {
              question: 'Explain how a bloom filter helps an LSM-tree-based store avoid unnecessary disk reads, and what\'s the tradeoff in using one.',
              answer:
                'A bloom filter is a compact, probabilistic set structure: it can say "this key is definitely not in this SSTable" with 100% certainty, or "this key might be in this SSTable" with some configurable false-positive rate. Before checking a given SSTable file for a key, the engine first checks that file\'s bloom filter in memory; if it says "definitely not present," the (relatively expensive) disk read for that file is skipped entirely, which is why LSM reads across many SSTable levels don\'t get proportionally slower with every additional level. The tradeoff is the false-positive rate itself (tunable via the filter\'s size — more bits per key means fewer false positives but more memory) — a false positive just costs one wasted disk read (still correct, just not optimal), never an incorrect answer, since bloom filters never produce false negatives.',
            },
            {
              question: 'What\'s the "Strangler Fig" pattern and why is it preferred over a full rewrite when migrating a monolith to microservices?',
              answer:
                'The Strangler Fig pattern puts a routing/facade layer in front of the existing monolith, then incrementally extracts one capability at a time into a new service, routing an increasing share of relevant traffic to the new service while the monolith continues serving everything not yet migrated — named after the fig vine that gradually envelops and eventually replaces its host tree. It\'s preferred over a big-bang rewrite because a full rewrite carries enormous risk (the team is offline from delivering new value for months/years, and the rewrite target is often a moving one since the old system doesn\'t stop changing), whereas the Strangler Fig approach ships incremental value, lets you validate each extracted service against real production traffic before fully committing, and provides an easy rollback (route traffic back to the monolith) if a newly extracted service has problems.',
            },
            {
              question: 'Why do most production systems favor W+R>N quorum reads/writes over always requiring all N replicas to acknowledge?',
              answer:
                'Requiring all N replicas to ack every write means the write\'s availability is only as good as the least-available replica — any single slow or down node blocks every write. A quorum (`W + R > N`, e.g., `W=2, R=2, N=3`) guarantees that any write set and any read set overlap by at least one replica (so a read is guaranteed to see the latest acknowledged write, or can compare versions to determine which is newest), while tolerating up to `N - W` (or `N - R`) replicas being unavailable at any given time without blocking the operation entirely. This is the mechanism that lets leaderless/Dynamo-style systems offer tunable consistency-vs-availability per operation (lower W/R for availability, higher for consistency) rather than a single fixed system-wide guarantee.',
            },
            {
              question: 'How would you explain the relationship between Raft/Paxos-style consensus and the CAP theorem — are they solving the same problem?',
              answer:
                'They\'re related but distinct: CAP describes a fundamental *tradeoff* a distributed system must make during a network partition (favor consistency or availability); consensus algorithms (Raft/Paxos) are a *mechanism* for achieving strong consistency safely when a system chooses the "C" side of that tradeoff — they let a cluster agree on a single, totally-ordered sequence of operations despite node failures and network delays, which is exactly what\'s needed to make replicated state provably consistent. A consensus-based system (like etcd) explicitly chooses CP behavior: during a partition, the minority side becomes unavailable for writes (can\'t reach a quorum) rather than risk two sides diverging — so consensus algorithms are one of the standard tools you reach for specifically *because* you\'ve decided to sit on the C side of CAP for that component.',
            },
            {
              question: 'In the e-commerce case study, why does the Product Catalog Service sync into Elasticsearch via change-data-capture instead of the Search Service querying the Product DB directly?',
              answer:
                'Full-text/faceted search (fuzzy matching, relevance ranking, filtering across many attributes) requires an inverted-index data structure that a relational or document DB isn\'t built to serve efficiently — running that kind of query pattern directly against the Product DB would be slow and would compete for resources with the DB\'s actual job of serving transactional catalog reads/writes. Change-data-capture (streaming the DB\'s write-ahead log or change events into a pipeline that updates Elasticsearch) keeps the search index near-real-time consistent with the source of truth without the Product Service needing to know or care that a search index exists — it\'s a clean example of "the system that owns the data doesn\'t need to own every way that data gets queried," and it decouples search-index scaling/availability from the catalog DB\'s.',
            },
            {
              question: 'What is the dual-write problem, and how does the transactional outbox pattern solve it? What guarantees does it give and not give?',
              answer:
                'A service that updates its database and then publishes an event to a broker is writing to two systems with no shared transaction. If it crashes after the DB commit but before the publish, the event is lost; if it publishes first and the DB commit fails, consumers react to a change that never happened. Wrapping both in try/catch cannot fix this because the crash can happen between any two lines. The outbox pattern writes the business change and an outbox row in the same local ACID transaction, so the event exists if and only if the state change exists. A separate relay (a poller using `FOR UPDATE SKIP LOCKED`, or log-tailing CDC like Debezium) publishes outbox rows to the broker. What it guarantees: no lost events and no phantom events, plus per-aggregate ordering if you key messages by aggregate ID. What it does not guarantee: exactly-once publication — the relay can publish a row twice after a crash — so consumers must be idempotent, usually via an inbox table of processed event IDs updated in the same transaction as their own state change. Operational costs include outbox table cleanup and, with CDC, managing replication slots so an idle slot does not retain WAL until the disk fills.',
            },
            {
              question: 'Why is a lock with a TTL in Redis not enough to guarantee mutual exclusion, and what is a fencing token?',
              answer:
                'The TTL is necessary so a crashed holder does not block everyone forever, but it creates a new failure: a holder can be paused (a long GC, VM steal time, a page fault, a stalled disk) for longer than the TTL, the lock expires, another client acquires it, and then the first client wakes up and writes, believing it still holds the lock. Checking "do I still hold it?" right before writing does not help because the pause can occur between the check and the write. Single-node Redis locks are also lost on failover because replication is asynchronous. A fencing token is a monotonically increasing number issued with each lock grant (an etcd revision or ZooKeeper zxid works). The client sends it with every write, and the protected resource rejects any write whose token is lower than the highest it has already accepted — so the stale holder\'s write fails safely. The key insight is that safety must be enforced by the resource, not by the client. For locks that only prevent duplicate work, a Redis `SET NX PX` with an owner-checked release is fine; for correctness, use a consensus-backed lock with fencing, or better, avoid the lock with a conditional write.',
            },
            {
              question: 'Walk me through how you would implement retries for a call from Service A to Service B safely.',
              answer:
                'First, decide whether the operation is safe to retry: reads and naturally idempotent writes are; non-idempotent writes need an idempotency key that B honors. Second, set a per-attempt timeout based on B\'s measured latency (around its p99.9) and respect an overall deadline propagated from the caller, so A never keeps retrying after its own caller has given up. Third, only retry retryable failures — connection errors, 502/503/504, 429 (honoring `Retry-After`) — never 400/401/409. Fourth, use capped exponential backoff with full jitter so many clients do not retry in lockstep. Fifth, cap attempts (2-3) and add a retry budget (e.g. retries may add at most 10% extra traffic), which prevents retry storms when B is genuinely overloaded. Sixth, retry at one layer only — if every hop in a 4-deep chain retries 3 times, one failure becomes 81 calls. Finally, put a circuit breaker in front of B so that when it is clearly unhealthy A fails fast with a fallback instead of queueing work, and emit metrics on retries so you notice when they become the norm. In a service mesh much of this is configuration (Istio `retries`, `perTryTimeout`), but the idempotency and budget decisions are still yours.',
            },
            {
              question: 'How does a circuit breaker differ from a retry policy and from a bulkhead, and how do they work together?',
              answer:
                'They address different failure shapes. Retries handle transient, independent failures by trying again — they increase load. A circuit breaker handles sustained failure by stopping calls entirely: after the error or slow-call rate crosses a threshold in a rolling window it opens and fails fast (optionally returning a fallback), after a cool-down it lets a few trial requests through (half-open), and it closes again if they succeed. It decreases load on a struggling dependency and frees the caller\'s resources. A bulkhead limits how much of the caller\'s capacity any one dependency can consume (a dedicated connection pool or concurrency limit), so a slow dependency exhausts only its compartment rather than every thread. Together: the bulkhead caps concurrency, the timeout bounds each attempt, the retry handles blips within a budget, and the breaker trips when blips become an outage. Order matters — retries should sit inside the breaker so retried failures count toward tripping it. Note that Envoy/Istio "circuit breaking" is mostly connection limits plus outlier ejection of individual hosts; business-level fallbacks still live in libraries like Resilience4j or Polly.',
            },
            {
              question: 'Kafka guarantees ordering — so why do teams still see out-of-order processing?',
              answer:
                'Kafka only guarantees order within a single partition. Common causes of disorder: (1) the producer keys messages by something other than the entity whose order matters (or sends them unkeyed), so related events land on different partitions; (2) the partition count is increased, which changes the key-to-partition mapping for new messages while old ones are still being consumed; (3) the consumer processes records from one partition in parallel (a thread pool per batch) without serializing per key; (4) failed messages are moved to a retry topic and reprocessed later, after newer events for the same key; (5) events for one entity are produced by multiple services into different topics; and (6) before idempotent producers were the default, producer retries with multiple in-flight requests could reorder messages. Fixes: key by aggregate ID, choose a generous partition count up front, use per-key ordered parallelism (e.g. Confluent\'s parallel consumer), park a whole key rather than one message on failure, and make consumers tolerant by carrying a version or sequence number per entity and ignoring events older than what they have already applied.',
            },
            {
              question: 'What is the difference between linearizability and serializability, and why does it matter in system design?',
              answer:
                'Linearizability is a recency guarantee on individual objects: every operation appears to take effect atomically at some instant between its invocation and response, so once any client reads a new value, no client can later read the old one. It is what the "C" in CAP means and what you need for leader election, locks, and unique-username checks. Serializability is an isolation guarantee for multi-object transactions: the outcome equals some serial execution of the transactions, but not necessarily one consistent with real time — a serializable database may legally return a slightly stale snapshot. Strict serializability combines both (Spanner, CockroachDB, FoundationDB). It matters because the costs differ: linearizability requires a consensus round or a single leader on the read path, and is unavailable under partition; serializability is about concurrency control (2PL, SSI, or deterministic ordering). Many incidents come from assuming one implies the other, such as reading from a replica of a "serializable" database and expecting to see a write that just committed on the primary — that is a read-your-writes violation, a session-guarantee problem rather than an isolation problem.',
            },
            {
              question: 'Why is last-write-wins conflict resolution dangerous, and what are the alternatives?',
              answer:
                'LWW picks the write with the highest timestamp and silently discards the others. Because clocks on different nodes drift and can jump backwards, the "later" timestamp may belong to the write that actually happened first, so a causally newer update is lost with no error. Even with perfect clocks, LWW discards genuinely concurrent updates — two users adding different items to a shared cart, and one addition vanishes. It is acceptable when overwrites are the intended semantics (a cache entry, a user\'s latest location) or when writes to a key are naturally single-writer. Alternatives: version vectors to detect concurrency and keep both versions as siblings for the application to merge (Riak); CRDTs that merge automatically by construction (counters, OR-sets, collaborative text); conditional writes / compare-and-set against a version number so concurrent writers detect the conflict and retry; routing all writes for a key to a single leader or a single partition consumer; and hybrid logical clocks to at least keep timestamps causally consistent. The interview move is to say which entities can tolerate LWW and which need a merge or coordination rule.',
            },
            {
              question: 'When would you choose a modular monolith over microservices, and how would you keep the option to split later?',
              answer:
                'Choose a modular monolith when you have one or a few teams, a domain that is still being discovered, or no component with a dramatically different scaling, availability, or compliance profile. It gives you one deploy, in-process calls, single-database transactions, and simple debugging, while strict module boundaries prevent the big-ball-of-mud that gives monoliths their bad name. To keep the split option open: give each module ownership of its own tables and forbid cross-module joins or foreign keys; expose a narrow public interface per module and enforce the boundary with tooling (ArchUnit, Spring Modulith, Nx boundaries, Packwerk); communicate between modules through interfaces or in-process domain events that could later go over a broker; and keep the module\'s data access behind a repository so a future service can own it. When a module needs independent scaling or deployment, extract it using the strangler fig approach — the hard part, data separation, will already be done. Splitting should be driven by team autonomy or genuinely different operational needs, not by fashion.',
            },
            {
              question: 'How do you keep a cache consistent with the database, and what race conditions remain even with a careful cache-aside implementation?',
              answer:
                'The standard approach is cache-aside with update-the-database-then-delete-the-key, plus a TTL on every entry. Deleting rather than setting avoids the race where two writers\' cache sets land in the opposite order to their DB writes. A race still remains: a reader misses, reads the old row from the DB, and stalls; a writer commits the new row and deletes the key; the reader then populates the cache with the stale row, which persists until TTL. Mitigations include short TTLs as a bound, a delayed second delete, storing a version with each value and only writing if newer (compare-and-set via a Lua script), or leases as described in Facebook\'s memcache paper, where the cache issues a token on miss and rejects a fill whose token was invalidated by an intervening delete. Another important improvement is driving invalidation from the database change stream (CDC) rather than application code, so writes from batch jobs, migrations, and other services also invalidate. Also consider replica lag: if the filler reads from a lagging replica after an invalidation, it can repopulate stale data, so read from the primary on cache fill for data that must be fresh.',
            },
            {
              question: 'Design question: how would you shard a multi-tenant SaaS database where a few tenants are 1,000 times larger than the median?',
              answer:
                'Shard by `tenant_id` so almost all queries are single-shard and tenant isolation is natural, but do not hash tenants directly onto physical nodes. Instead map tenants to a large number of logical shards, and keep a directory (in a small strongly consistent store, cached in every router) mapping tenants or logical shards to physical clusters. That directory is what makes the skew manageable: small tenants are packed many per cluster, while whales get dedicated clusters (and possibly their own cells for blast-radius and noisy-neighbor isolation, which enterprise customers often pay for). Moving a tenant becomes an online operation — bulk copy, CDC catch-up, brief write freeze, flip the directory entry. For the very largest tenant, you may need a second-level shard key inside the tenant (e.g. `(tenant_id, project_id)`). Cross-tenant analytics should go to a separate warehouse fed by CDC rather than scatter-gather queries. Mention per-tenant rate limits and resource quotas, and that Citus, Vitess, and distributed SQL databases provide much of this machinery out of the box.',
            },
            {
              question: 'What is a cell-based architecture and how does shuffle sharding reduce blast radius?',
              answer:
                'A cell-based architecture partitions the entire stack — services, queues, and data stores — into independent, identical units called cells, each serving a fixed subset of customers, with a very thin routing layer in front that maps a customer to a cell. Cells share nothing at runtime, so a bad deploy, a poison-pill request, a noisy customer, or a capacity exhaustion affects only that cell\'s customers. Deployments roll out cell by cell, which turns a global outage into a partial one and gives a natural canary. Scaling means adding cells rather than growing one ever-larger system, which keeps every cell within tested limits. Shuffle sharding applies the same idea at a finer grain: instead of assigning each customer to one fixed group of workers, assign each a random small combination of workers (e.g. 2 of 8). With many possible combinations, two customers rarely share all their workers, so a customer whose requests crash workers takes down only their own combination while nearly everyone else keeps at least one healthy worker. Costs: the router becomes critical and must be extremely simple, cross-cell operations (global search, migrations of a customer between cells) need extra machinery, and per-cell overhead raises baseline cost.',
            },
            {
              question: 'An interviewer asks: "Your design says the service publishes an event and the email service sends a confirmation. How do you guarantee the customer gets exactly one email?"',
              answer:
                'Break it into the two hops. Producer side: the order service must not dual-write, so it uses a transactional outbox — the order row and an `OrderPlaced` outbox row commit together, and a relay publishes it. That guarantees at least once, not exactly once. Consumer side: the email service receives each event at least once (relay retries, consumer rebalances), so it deduplicates on a stable key. A naive "check if sent, then send" still has a window, so the robust version records an intent first: insert a row keyed by `(order_id, template)` with a unique constraint; only the consumer whose insert succeeds proceeds; then call the email provider passing that key as the provider\'s idempotency key if it supports one; then mark the row sent. If the process crashes after calling the provider but before marking sent, the retry may resend — at that point you are at the boundary of what is achievable, because the external provider is outside your transaction. So the honest answer is: effectively-once through outbox + inbox + provider idempotency, with a small residual duplicate risk you either accept for emails or eliminate only if the provider deduplicates by key. Saying that last part explicitly shows you understand why exactly-once delivery is impossible end to end.',
            },
            {
              question: 'What does a service mesh actually give you, and when is it not worth it?',
              answer:
                'A service mesh moves cross-cutting network concerns from application libraries into infrastructure: automatic mutual TLS with workload identities (SPIFFE), so service-to-service authentication and encryption are uniform; L7 traffic management such as retries, timeouts, outlier ejection, weighted routing for canaries and traffic mirroring; consistent golden-signal metrics and trace propagation across every language; and authorization policies between services. The control plane (istiod, Linkerd\'s control plane) pushes configuration and certificates to the data plane (sidecar Envoy/linkerd2-proxy, or in Istio ambient mode a per-node ztunnel plus optional waypoint proxies). It is not worth it when you have a handful of services, a single language where a good RPC library already provides retries, deadlines, and TLS, or a team without capacity to operate it — the mesh adds latency per hop, resource overhead, upgrade risk, and a new class of misconfiguration outages. Sidecarless designs reduce the resource cost substantially, but the operational learning curve remains. A useful heuristic is to adopt it when the pain of enforcing mTLS and consistent policy across many teams and languages exceeds the cost of running the mesh.',
            },
          ],
        },
      ],
    },
  ],
}
