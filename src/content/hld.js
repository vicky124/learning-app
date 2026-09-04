export const hldSection = {
  id: 'hld',
  label: 'HLD',
  icon: '🏗️',
  groups: [
    {
      id: 'hld-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-hld',
          title: 'What High-Level Design Actually Is (and How It Differs From LLD)',
          summary:
            'HLD produces the "org chart" of a system - which services, stores, and queues exist and how they talk - while Low-Level Design designs the internals of a single box on that chart.',
          keyPoints: [
            'HLD answers "what are the pieces and how do they fit together"; LLD answers "how is this one piece actually built" (classes, algorithms, concurrency inside a service).',
            'The boundary is fuzzy on purpose - an HLD answer that stays too shallow looks like a slideshow; one that dives too deep into one box runs out of time to cover the system.',
            'Both get called "system design" casually - when a company says "system design round" without qualifying it, ask which one, because the two are graded on completely different rubrics.',
            'This guide is scoped to HLD: which services/stores/queues exist and how they talk. Deep component internals - load balancing algorithms, cache eviction policies, DB storage engines - belong to a lower-level fundamentals track.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**System design** as a broad term covers everything from "how do you architect a distributed system spanning ten services" down to "how do you design the class hierarchy for a parking garage." **High-Level Design (HLD)** narrows this to the former: given a product requirement, decide which services, data stores, caches, and queues exist, how they communicate, and why - without designing the internals of any single component in detail. **Low-Level Design (LLD)** is the complementary, narrower discipline: given one component (or a small, self-contained problem like "design a rate limiter" or "design a parking lot"), design its classes, interfaces, data structures, and algorithms in code-adjacent detail.',
            },
            {
              type: 'heading',
              text: 'HLD vs LLD, side by side',
            },
            {
              type: 'table',
              headers: ['Dimension', 'High-Level Design (HLD)', 'Low-Level Design (LLD)'],
              rows: [
                ['Question being answered', 'What components exist, and how do they talk to each other?', 'How is *this one* component built internally?'],
                ['Typical artifact', 'A box-and-arrow architecture diagram spanning services, stores, queues', 'Class diagrams, interface contracts, algorithms, concurrency handling'],
                ['Example prompt', '"Design Twitter\'s news feed"', '"Design the rate-limiter class a single service uses"'],
                ['Granularity', 'One box per service - internals hidden', 'One service\'s internals, fully exposed'],
                ['What it tests', 'Requirement scoping, estimation, and tradeoffs across a distributed system', 'OOP design, design patterns, data structures, thread-safety'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    subgraph HLD["HLD view - one box per service"]\n        C1[Client] --> LB1[Load Balancer]\n        LB1 --> Svc1[Feed Service]\n        Svc1 --> DB1[(Database)]\n    end\n    subgraph LLD["LLD view - inside one box"]\n        Class1["FeedService class"]\n        Class1 --> M1["rankPosts(posts)"]\n        Class1 --> M2["mergeSources(sources)"]\n        Class1 --> Cache1["LRUCache&lt;UserId, Feed&gt;"]\n    end\n    Svc1 -.->|zoom in| Class1',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If an interviewer pushes you to explain exactly how a load balancer picks a server, or exactly how a cache evicts entries, that is a signal they want an LLD-flavored digression - it is fine to go there briefly, but say out loud that you are doing it ("stepping into the LLD of the cache for a second") so the interviewer can pull you back to the architecture level if that is not what they wanted.',
            },
          ],
        },
        {
          id: 'client-server-api',
          title: 'The Client-Server Model & What an API Really Is',
          summary:
            'Nearly every HLD diagram is an elaboration of one idea: a client sends a request, a server does work and sends back a response - an API is just the agreed-upon shape of that conversation.',
          keyPoints: [
            'Client-server model: the client initiates, the server responds; in modern designs the server treats each request as independent (stateless), so any server instance can handle any request.',
            'An **API** is a contract - a set of operations, their inputs, and their outputs - and says nothing about how the server implements them internally.',
            'REST, RPC, and GraphQL are three common shapes for that contract; HLD interviews mostly care about what fields the contract carries, not which wire format you pick.',
            'Every arrow between two boxes on an HLD diagram implicitly means "an API call (or a message) with a specific request and response shape" - being able to state that shape concretely is what separates a real design from a cartoon of boxes and arrows.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A **client** is anything that initiates a request - a browser, a mobile app, another backend service. A **server** is anything that listens for requests and responds. The client-server model just says: the client always initiates, the server always responds, and (in almost every modern web-scale design) the server does not remember anything about the client between requests - each request carries everything the server needs to handle it. That last property, **statelessness**, is what makes it possible to put many identical server instances behind a load balancer, covered next.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Client\n    participant Server\n    participant DB as Database\n\n    Client->>Server: HTTP request, e.g. GET /api/v1/users/42\n    Server->>DB: query for user 42\n    DB-->>Server: row(s)\n    Server-->>Client: HTTP response - status code + JSON body\n    Note over Client,Server: the request/response shape IS the API contract',
            },
            {
              type: 'heading',
              text: 'What "an API" means at the HLD level',
            },
            {
              type: 'list',
              items: [
                '**REST** - resource-oriented (`GET /users/42`, `POST /orders`); the most common default for public/client-facing APIs, maps naturally onto CRUD.',
                '**RPC** (gRPC, Thrift) - action-oriented (`getUser(42)`, `createOrder(...)`); common for internal service-to-service calls where performance and strict typing matter more than browsability.',
                '**GraphQL** - the client specifies exactly which fields it needs in one request; useful when many different clients (web, mobile, third parties) need different slices of the same underlying data and you want to avoid over-fetching or under-fetching.',
                'Internal service-to-service calls are frequently gRPC or plain HTTP+JSON; the choice rarely matters for an HLD interview - naming the *contract fields* for your 3-6 key endpoints matters far more than picking a wire protocol.',
              ],
            },
            {
              type: 'code',
              language: 'text',
              title: 'a minimal, concrete API contract',
              code: `POST /api/v1/orders
  body: { "userId": "u_123", "items": [{ "sku": "abc", "qty": 2 }] }
  201: { "orderId": "o_789", "status": "pending", "total": 41.98 }
  400: { "error": "invalid sku" }`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Treat every arrow you draw between two boxes as a placeholder for a contract you have not yet written. If you cannot say, on the spot, roughly what request and response cross that arrow, that box has not actually been designed yet - it has just been drawn.',
            },
          ],
        },
        {
          id: 'single-server-database-basics',
          title: 'The Starting Point: One Server, One Database',
          summary:
            'Every HLD ends up distributed, but it starts conceptually as one application server talking to one database - understanding why that setup breaks is what motivates every building block that follows.',
          keyPoints: [
            'A **database** exists to durably store state so it survives past a single request or process - the app server itself is usually treated as disposable and stateless, the database is not.',
            'The simplest possible working system is: client -> single app server -> single database, reachable over the network, with no caching, no queue, and no replica.',
            'This setup breaks along three axes as load grows: the app server runs out of CPU/connections, the database runs out of capacity for reads or writes, and a single machine is a single point of failure.',
            'Nearly every later building block (load balancer, cache, replica, shard, queue) exists to relieve one specific pressure point in this simple starting picture - naming *which* pressure point a building block relieves is a stronger answer than just naming the building block.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A **database** is software whose job is to store data durably (surviving a crash or restart), let you query it efficiently, and enforce rules about it (uniqueness, relationships, types). Contrast this with the application server: if an app server process dies, you restart it and nothing is lost, because it was not supposed to be holding anything durable in memory. If a database loses data, that is a real incident. This asymmetry - servers are disposable, databases are not - is the single most load-bearing assumption in HLD, and it is why almost every scaling technique treats "add another app server" as cheap and "add another database" as an entire design decision.',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Client -->|request| App[App Server]\n    App -->|read / write| DB[(Database)]\n    App -.->|no redundancy| SPOF["Single point of failure:<br/>App or DB dying takes<br/>the whole system down"]',
            },
            {
              type: 'heading',
              text: 'Where this breaks first, and the typical first fix',
            },
            {
              type: 'list',
              items: [
                '**App server runs out of CPU/connections** as request volume grows -> add more app server instances behind a load balancer (cheap, because the app server is stateless).',
                '**Database runs out of capacity for reads** (the far more common case, since most systems are read-heavy) -> add a cache in front of it, then read replicas.',
                '**Database runs out of capacity for writes**, or its data no longer fits on one machine -> partition/shard the data across multiple database instances (a much bigger structural decision, usually deferred as long as possible).',
                '**Single machine = single point of failure** for either tier -> redundancy: multiple app server instances (already true once you add a load balancer), and a database replica that can be promoted if the primary dies.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is the picture every later topic in this guide adds one piece to. After reading "Core Building Blocks," come back here and check that you can map each block - load balancer, cache, replica, shard, queue - back to one specific pressure point in this simple starting diagram. If you can, you understand the *why*, not just the vocabulary.',
            },
          ],
        },
        {
          id: 'scaling-fundamentals',
          title: 'Vertical vs Horizontal Scaling',
          summary:
            'The single server from the previous topic can only grow two ways - get a bigger machine, or get more machines - and almost every architectural building block in HLD exists to make the second option possible.',
          keyPoints: [
            '**Vertical scaling** = a bigger machine (more CPU/RAM/faster disk) - the simplest move, requires no application changes, but hits a hard ceiling (the largest instance available) and is still a single point of failure.',
            '**Horizontal scaling** = more machines - no practical ceiling, and redundancy comes almost for free, but it requires the application to be designed for it.',
            'Statelessness in the application layer is the prerequisite that makes horizontal scaling of app servers trivial - any request can go to any server, because no server is holding session state the others lack.',
            'Databases are the hard part to scale horizontally, because they hold state by definition - this is exactly why replication and sharding get their own dedicated vocabulary in the building-blocks topic.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n    subgraph Vertical["Vertical scaling"]\n        Small[Small server] -->|upgrade| Big["Bigger server<br/>more CPU/RAM"]\n        Big -->|upgrade again| Biggest["Biggest available server<br/>- hits a ceiling"]\n    end\n    subgraph Horizontal["Horizontal scaling"]\n        LB2[Load Balancer] --> H1[Server 1]\n        LB2 --> H2[Server 2]\n        LB2 --> H3[Server 3]\n        LB2 --> H4[...Server N]\n    end',
            },
            {
              type: 'table',
              headers: ['Dimension', 'Vertical scaling', 'Horizontal scaling'],
              rows: [
                ['Ceiling', 'Hard - largest instance size available', 'No practical ceiling'],
                ['Code changes required', 'None', 'App layer must be stateless; data layer must support partitioning/replication'],
                ['Redundancy', 'None - still one machine', 'Comes largely for free (more machines = survives losing one)'],
                ['Cost curve', 'Non-linear - the biggest instances cost disproportionately more per unit of capacity', 'Roughly linear - N machines cost ~N x one machine'],
                ['Typical use', 'The right first move for a startup-scale system, or for a database primary before sharding is justified', 'The default once you outgrow one machine, or need redundancy'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Vertical scaling is a legitimate, correct first move - not something to skip past to look impressive. Naming "we could just get a bigger box for now, and here is the QPS/data-size point at which that stops working" shows judgment; jumping straight to "microservices and sharding" for a system that estimation shows fits comfortably on one well-provisioned machine is a common overengineering tell.',
            },
          ],
        },
        {
          id: 'what-hld-tests',
          title: 'What HLD Interviews Actually Test',
          summary:
            'HLD interviews grade your process as much as your final diagram — clarifying scope, quantifying load, and making tradeoffs explicit matter as much as the boxes you draw.',
          keyPoints: [
            'HLD means deciding which services/stores/queues exist and how they talk — deep component internals (LB algorithms, caching strategies, DB internals) are a separate, lower-level concern.',
            'Interviewers grade requirement clarification, estimation, API/data model design, component architecture, deep-dive quality, tradeoff articulation, and communication.',
            'Component architecture and deep-dive quality together are worth half the typical rubric — going deep with real mechanisms beats covering more surface area shallowly.',
            'Saying \'I chose X over Y because Z, which costs us W\' unprompted is one of the highest-signal things a candidate can do.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**HLD** (a.k.a. "system design" in the narrower sense) evaluates whether you can turn a vague product ask into a set of services, data stores, and integration points that meet **explicit and implicit non-functional requirements** — scale, latency, availability, consistency, cost. Interviewers are grading your *process* as much as your final diagram: do you clarify scope, quantify load, make tradeoffs explicit, and justify each component?',
            },
            {
              type: 'p',
              text: 'This guide treats HLD as "which services/stores/queues exist and how they talk," and leaves deep component internals — load balancing algorithms, caching strategies, DB internals, CAP theorem depth — to a separate, lower-level system-design-fundamentals track. Read both together if you have them.',
            },
            {
              type: 'heading',
              text: 'How HLD rounds are graded, concretely',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Requirement clarification (10%)** — did you scope the problem instead of solving an imaginary one?',
                '**Estimation (10%)** — can you turn "100M users" into "we need ~12K QPS and 5 shards" with reasonable arithmetic?',
                '**API/data model design (15%)** — is the contract precise enough that two teams could build against it independently?',
                '**Component architecture (25%)** — right building blocks, right places, no accidental single points of failure.',
                '**Deep dive quality (25%)** — when pushed on the hard part of the problem (the thing that makes this prompt interesting, not generic CRUD), do you go deep with real mechanisms, not hand-waving?',
                '**Tradeoff articulation (10%)** — do you say "I chose X over Y because Z, which costs us W" unprompted?',
                '**Communication (5%)** — structured, checks in with the interviewer, doesn\'t silently disappear into a monologue.',
              ],
            },
            {
              type: 'mermaid',
              code: 'pie title HLD interview grading weight (typical rubric)\n    "Requirement clarification" : 10\n    "Estimation" : 10\n    "API / data model design" : 15\n    "Component architecture" : 25\n    "Deep dive quality" : 25\n    "Tradeoff articulation" : 10\n    "Communication" : 5',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Component architecture and deep-dive quality together are half the rubric. A candidate who draws a competent-but-generic diagram and then goes genuinely deep on the one hard problem the prompt is actually testing will consistently outscore one who covers more boxes shallowly.',
            },
          ],
        },
        {
          id: 'framework',
          title: 'The Repeatable HLD Framework',
          summary:
            'The same ten-step sequence works for almost any HLD prompt — clarify, estimate, define the contract, draw the diagram, model the data, deep-dive, then name the tradeoffs.',
          keyPoints: [
            'Clarify functional and non-functional requirements before drawing anything — read vs write heavy, latency target, consistency needs, and scale all change the design.',
            'Back-of-envelope estimation anchors every later decision: it tells you whether you actually need sharding, a CDN, or a cache at all.',
            'Defining the API contract early forces you to nail the data model before you draw boxes.',
            'Deep-diving 2-3 components the interviewer actually cares about matters more than covering the whole system shallowly.',
            'Discussing tradeoffs explicitly is the single highest-signal thing you can do in the entire interview.',
          ],
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '**Clarify functional requirements** — list core features explicitly; ask what\'s out of scope.',
                '**Clarify non-functional requirements** — read-heavy or write-heavy? Latency target (p99)? Consistency needs (strong vs eventual)? Expected scale (DAU, QPS, data volume)? Availability target (99.9% vs 99.99%)?',
                '**Back-of-envelope estimation** — QPS, storage growth/year, bandwidth. This anchors every later decision (do you need sharding? a CDN? a cache?).',
                '**Define the API contract** — 3-6 key endpoints with request/response shape. Forces you to nail down the data model early.',
                '**Draw the high-level component diagram** — client → LB → services → data stores → async workers/queues.',
                '**Design the data model / schema** at a level deeper than HLD usually gets credit for — table names, key columns, what\'s indexed, what\'s partitioned by what.',
                '**Deep-dive 2-3 components** the interviewer cares about (usually: the data model/sharding strategy, and one hard problem specific to the prompt — e.g., "how do you rank the feed," "how do you dedupe," "how do you guarantee exactly-once").',
                '**Identify bottlenecks and single points of failure**, then address them (replication, caching, queueing, circuit breakers).',
                '**Discuss tradeoffs explicitly** — this is the single highest-signal thing you can do. "I chose eventual consistency here because X, at the cost of Y."',
                '**Discuss failure modes and monitoring** — what metrics would page you, what does degraded-but-alive look like for this system.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n    S1["1. Clarify functional reqs"] --> S2["2. Clarify non-functional reqs"]\n    S2 --> S3["3. Back-of-envelope estimation"]\n    S3 --> S4["4. Define API contract"]\n    S4 --> S5["5. Draw component diagram"]\n    S5 --> S6["6. Design data model"]\n    S6 --> S7["7. Deep-dive 2-3 components"]\n    S7 --> S8["8. Identify bottlenecks / SPOFs"]\n    S8 --> S9["9. Discuss tradeoffs"]\n    S9 --> S10["10. Failure modes & monitoring"]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Step 9 (tradeoffs) is worth memorizing as a habit, not a step: unprompted tradeoff articulation is rated separately in most rubrics and is the thing junior candidates consistently forget to say out loud even when they clearly know it.',
            },
          ],
        },
        {
          id: 'mock-interview-run',
          title: 'Running the Interview: Time Budgeting & What to Draw First',
          summary:
            'Knowing the ten-step framework is necessary but not sufficient - most candidates who "know the steps" still run out of time on the deep dive because they never rehearsed a time budget.',
          keyPoints: [
            'A 45-60 minute HLD interview is not evenly split across the ten steps - the deep dive deserves roughly a third of the time, and it is the section most candidates shortchange by over-polishing the initial diagram.',
            'Draw the high-level box diagram first, in under a couple of minutes, and deliberately rough - a rough diagram the interviewer can react to beats a polished one that ate ten minutes of silence.',
            'Narrate while you draw - silence for more than about 20-30 seconds reads as "stuck," even when you are simply thinking.',
            'If time is running short, say so out loud and propose what to cut ("I\'ll skip the notification service deep-dive and spend the remaining time on sharding the message store") - naming the tradeoff between coverage and depth is itself a strong signal.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Phase', 'Target time (of a ~45 min slot)', 'What "done" looks like'],
              rows: [
                ['Clarify requirements + estimate', '~7 min', 'An explicit scope list, plus 2-3 headline numbers (QPS, storage/year)'],
                ['API contract + high-level diagram', '~9 min', 'A rough box diagram on the board/whiteboard, 3-6 endpoints named'],
                ['Data model', '~4 min', 'Key tables/columns named, what is indexed and what is partitioned by what'],
                ['Deep dive (1-2 components)', '~16 min', 'A real mechanism discussed, not hand-waving - the section worth the most rubric weight'],
                ['Tradeoffs + failure modes + wrap-up', '~9 min', 'At least 2 tradeoffs named unprompted, one failure mode discussed'],
              ],
            },
            {
              type: 'mermaid',
              code: 'pie title Time budget for a 45-minute HLD interview\n    "Clarify + estimate" : 15\n    "API contract + diagram" : 20\n    "Data model" : 10\n    "Deep dive" : 35\n    "Tradeoffs + failure modes + wrap-up" : 20',
            },
            {
              type: 'heading',
              text: 'What to draw first, concretely',
            },
            {
              type: 'list',
              items: [
                'Draw the client -> load balancer -> service(s) -> database skeleton immediately after estimation - do not wait until you feel "ready," the skeleton is what makes everything after it concrete.',
                'Label the arrows with the API calls you already defined - an unlabeled arrow invites the interviewer to ask "what exactly happens here," which costs you time you could have spent proactively.',
                'Leave room on the board/canvas for the parts you will deep-dive into - do not cram detail into the first pass; a second, denser pass over one subsystem is expected and normal.',
                'Add caches, queues, and replicas only once you have named the specific pressure point they relieve, not preemptively - "I am adding a cache here because reads outnumber writes 100:1 and redirect latency needs to stay under 100ms" outscores silently drawing a Redis box because it "belongs" in system design diagrams.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The most common failure mode is spending 20 minutes perfecting the box diagram and leaving 5 minutes for the deep dive. Deep-dive quality is typically worth as much as component architecture and estimation combined - protect that time budget even if it means presenting a visibly rougher diagram.',
            },
          ],
        },
        {
          id: 'estimation',
          title: 'Back-of-Envelope Estimation',
          summary:
            'A small set of rules of thumb turns "100M users" into concrete QPS, storage, and latency numbers — the exact figures matter less than showing the reasoning that leads to a design decision.',
          keyPoints: [
            'State assumptions out loud — the exact numbers matter less than showing you can reason from them to a design decision.',
            '1M requests/day is roughly 12 QPS average, but peak traffic runs 3-5x that.',
            'Read:write ratios for social/feed systems are often 100:1 to 1000:1 — this single ratio should drive your caching and read-replica strategy.',
            'A worked Twitter-scale feed example shows estimation *driving* architecture decisions, not just decorating them afterward.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Quantity', 'Rule of thumb'],
              rows: [
                ['1 million requests/day', '~12 QPS average, ~3-5x that at peak'],
                ['100M DAU, 10 requests/user/day', '~1B requests/day → ~11,600 QPS average'],
                ['1 KB per record, 1B records', '~1 TB raw storage (before replication/indexes)'],
                ['Read:Write ratio for social feeds', 'often 100:1 to 1000:1 → optimize reads (cache, CDN, read replicas)'],
                ['Network round trip same region', '~0.5-2 ms'],
                ['Network round trip cross-continent', '~100-150 ms'],
                ['SSD random read', '~0.1-0.2 ms'],
                ['Memory access', '~100 ns'],
                ['Replication factor (typical)', '3x (survive 2 node failures with quorum reads/writes)'],
                ['Cache hit ratio target', '90%+ for read-heavy systems with power-law access'],
              ],
            },
            {
              type: 'p',
              text: 'Always state assumptions out loud ("let\'s assume 500M MAU, 20% DAU, average 5 items read per session") — the exact numbers matter less than showing you can reason from them to a design decision (e.g., "at 50K QPS on the read path, a single Postgres primary won\'t cut it, so we need read replicas + cache").',
            },
            {
              type: 'heading',
              text: 'Fully worked example — Twitter-scale feed, done end to end',
            },
            {
              type: 'list',
              items: [
                'Assume 500M MAU, 200M DAU, average session reads 5 times/day → 1B feed reads/day → ~11,600 QPS average, ~35-40K QPS at peak (3x multiplier for daily traffic curve).',
                'Assume 200M DAU post at a 1:20 ratio (1 post per 20 reads) → 50M posts/day → ~580 writes/sec average.',
                'Average post size ~300 bytes text + metadata ≈ 1 KB. 50M posts/day × 1 KB = ~50 GB/day of new post data → ~18 TB/year before replication; ×3 replication ≈ 54 TB/year.',
                'Precomputed feed: assume each user follows ~200 people, feed cache holds the latest 800 post-IDs per user (not full post bodies — just IDs, hydrated at read time) × 8 bytes/ID ≈ 6.4 KB/user × 500M users ≈ 3.2 TB of feed-cache data — this single number is what tells you the precomputed feed needs a horizontally-scaled store like Redis Cluster or Cassandra, not a single Redis box.',
                'Conclusion chain an interviewer wants to hear: "~40K peak QPS, read-heavy at ~70:1 ratio → precompute is worth it for the 99% of normal users; ~3.2TB feed-cache footprint needs a sharded store; ~54TB/year of post data needs a horizontally scalable primary store (Cassandra/DynamoDB) rather than a single Postgres instance." This is estimation *driving* the architecture, not decoration after the fact.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    DAU["DAU + usage pattern"] --> QPS["Requests/sec<br/>avg + peak"]\n    QPS --> RW["Read:Write ratio"]\n    RW --> Storage["Storage growth/year<br/>x replication factor"]\n    Storage --> Decision{"Fits on one<br/>well-tuned DB?"}\n    Decision -->|Yes| SingleDB["Single primary +<br/>replicas + cache"]\n    Decision -->|No| Sharded["Sharded / horizontally<br/>scaled store"]',
            },
          ],
        },
        {
          id: 'building-blocks',
          title: 'Core Building Blocks & Vocabulary',
          summary:
            'The vocabulary you assemble every HLD diagram from — load balancers, gateways, caches, queues, and the handful of storage/partitioning primitives that recur across almost every system.',
          keyPoints: [
            'Load balancers, API gateways, and stateless application services form the request-handling backbone of nearly every design.',
            'Caches and CDNs exist to keep the vast majority of reads off the primary data store.',
            'Message queues/event streams decouple producers from consumers and absorb traffic spikes.',
            'Sharding, replication, and consistent hashing are how a single logical store scales past one machine.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Load Balancer** (L4 vs L7, round robin / least-connections / consistent hashing).',
                '**API Gateway** (auth, rate limiting, routing, request aggregation).',
                '**Stateless application/service layer** (horizontally scalable).',
                '**Cache** (Redis/Memcached — read-through, write-through, write-behind, cache-aside).',
                '**CDN** (static assets, edge caching, geo-distributed reads).',
                '**Relational DB** (strong consistency, joins, transactions) vs **NoSQL** (horizontal scale, flexible schema, eventual consistency).',
                '**Message queue / event stream** (Kafka, SQS, RabbitMQ — decoupling, async processing, buffering spikes).',
                '**Search index** (Elasticsearch — full text, faceted search).',
                '**Blob/object storage** (S3 — media, backups, data lake).',
                '**Sharding / partitioning** (by key, range, or consistent hashing) and **replication** (leader-follower, multi-leader, leaderless/quorum).',
                '**Service discovery**, **circuit breakers**, **rate limiters**, **distributed locks**.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Client -->|HTTPS| CDN\n    CDN --> LB[Load Balancer]\n    LB --> GW[API Gateway<br/>authn, rate limit, routing]\n    GW --> SvcA[Service A<br/>stateless]\n    GW --> SvcB[Service B<br/>stateless]\n    SvcA --> Cache[(Redis Cache)]\n    SvcA --> DBPrimary[(Primary DB)]\n    DBPrimary --> DBReplica1[(Read Replica)]\n    DBPrimary --> DBReplica2[(Read Replica)]\n    SvcB --> Queue[[Message Queue]]\n    Queue --> Worker[Async Worker Pool]\n    Worker --> Blob[(Object Storage)]\n    Worker --> Search[(Search Index)]\n    SvcA --> Blob',
            },
          ],
        },
        {
          id: 'cdn-caching',
          title: 'CDNs & Edge Caching',
          summary:
            'A CDN moves content geographically closer to users and off your origin entirely - one of the highest-leverage, lowest-effort wins in almost any HLD answer that involves static or semi-static content.',
          keyPoints: [
            'A CDN is a globally-distributed network of edge servers that cache content close to users, so most requests never reach your origin servers at all.',
            'Static/immutable assets (images, video segments, JS/CSS bundles) are the easy case - cache aggressively with a long TTL and a content-hashed filename, so a new version is simply a new URL and there is nothing to invalidate.',
            'Dynamic/personalized content can still benefit from edge caching of the cacheable parts (e.g., a product page\'s static shell) or from edge compute that personalizes at the edge instead of round-tripping to origin.',
            'Cache invalidation at a CDN is expensive and slow (propagation across hundreds of edge nodes) - prefer versioned/hashed URLs over "purge on update" wherever possible.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A **CDN (Content Delivery Network)** is a set of servers ("edge nodes" or "PoPs" - points of presence) distributed across many geographic regions, sitting in front of your actual application/storage servers (the **origin**). When a user requests a cacheable resource, the request hits the nearest edge node instead of traveling all the way to the origin; if that edge node already has the content cached, it serves it directly, shaving off both the cross-region network latency and the load on your origin entirely.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n    User["User request"] --> Edge["Nearest CDN Edge Node"]\n    Edge --> Hit{"Cached?"}\n    Hit -->|Yes: cache hit| Serve["Serve directly from edge<br/>~ms latency"]\n    Hit -->|No: cache miss| Origin["Fetch from Origin Server"]\n    Origin --> StoreEdge["Store at edge with TTL"]\n    StoreEdge --> Serve2["Serve to user"]\n    Origin -.->|only on first request<br/>per region| Edge',
            },
            {
              type: 'heading',
              text: 'What to cache at the edge, and how',
            },
            {
              type: 'list',
              items: [
                '**Static assets** (images, JS/CSS bundles, fonts) - content-hashed filenames (`app.a1b2c3.js`) plus a very long (often "forever") TTL; a deploy simply produces new filenames, so there is nothing stale to invalidate.',
                '**Public, non-personalized API responses** (a product catalog page, a public leaderboard) - a short TTL (seconds to minutes) trades a small amount of staleness for a large reduction in origin load.',
                '**Video/HLS/DASH segments** - the textbook CDN use case (see the Video Streaming case study below); nearly all bytes served by a video platform are immutable segments once transcoded.',
                '**Personalized pages** are generally *not* cached wholesale - either cache only the static shell and hydrate personalized parts client-side, or use edge compute (CDN-run functions, e.g. Cloudflare Workers/Lambda@Edge) to personalize without a round trip to origin.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Forgetting to mention a CDN is a common miss in case studies that are obviously read-heavy and static-content-heavy (video streaming, image hosting, a static marketing site). Naming it explicitly - and naming *what specifically* gets cached and for how long, not just "we use a CDN" - is the actual signal an interviewer is listening for.',
            },
          ],
        },
        {
          id: 'url-shortener',
          title: 'Case Study: URL Shortener',
          summary:
            'A read-heavy, pure key-value lookup problem — the real interview signal is ID generation strategy, hot-key caching, and choosing 302 over 301 for the right reasons.',
          keyPoints: [
            'Read:write ratio of ~100:1 with near-instant redirect latency (<100ms p99) — availability matters more than strong consistency here.',
            'Access is 100% key-based lookup by code, which is the single fact that justifies a key-value store over a relational DB.',
            'A Snowflake-style distributed ID generator, base62-encoded, is generally the production-grade answer to ID collisions.',
            'Click analytics must be async (event to a queue) — never a synchronous counter increment in the hot redirect path.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**Functional:** shorten a long URL, redirect short → long, optional custom alias, optional expiry, basic click analytics. **Non-functional:** read-heavy (100:1 read:write), redirect latency should be near-instant (< 100ms p99), short codes must be unique, high availability > strong consistency for redirects.',
            },
            {
              type: 'p',
              text: '**Estimation:** 100M new URLs/month → ~40 writes/sec average. Reads (redirects) at 100x → ~4,000 reads/sec average, spikier in practice (viral links can spike a single key to thousands of QPS — a hot-key problem the cache layer must handle, e.g., via local in-process caching in front of Redis for the hottest handful of keys). A 7-char base62 code → 62^7 ≈ 3.5 trillion combinations, comfortably enough for years of growth at this rate.',
            },
            {
              type: 'code',
              language: 'text',
              title: 'API contract',
              code: `POST /api/v1/shorten
  body: { "longUrl": "https://...", "customAlias"?: "...", "expiresAt"?: "2027-01-01" }
  200: { "shortUrl": "https://sho.rt/aZ3kP9q" }

GET /{code}
  302 Redirect -> Location: <longUrl>
  404 if not found or expired`,
            },
            {
              type: 'code',
              language: 'text',
              title: 'Data model',
              code: `Table: url_mapping
  code           VARCHAR(10)  PRIMARY KEY
  long_url       TEXT         NOT NULL
  created_by     BIGINT
  created_at     TIMESTAMP
  expires_at     TIMESTAMP    NULL
  click_count    BIGINT       DEFAULT 0   -- eventually consistent counter, updated async`,
            },
            {
              type: 'p',
              text: 'Access pattern is 100% key-based lookup by `code` — no joins, no range scans needed on the hot path — which is the single fact that justifies a key-value store (DynamoDB/Cassandra) over a relational DB here.',
            },
            {
              type: 'heading',
              text: 'Key design decisions',
            },
            {
              type: 'list',
              items: [
                '**ID generation**: avoid a single auto-increment counter (bottleneck + guessable/enumerable, a security concern too). Options: (a) pre-generate a range of unique IDs per app server (ticket server / range allocation), (b) hash-based (MD5/SHA of URL + salt, truncate, handle collisions with a retry+salt loop), (c) Snowflake-style distributed ID generator (timestamp + machine ID + sequence) then base62-encode — generally the production-grade answer because it\'s collision-free by construction and roughly time-sortable.',
                '**Storage**: a key-value store (DynamoDB/Cassandra) is a natural fit — access pattern is pure key lookup, no joins needed.',
                '**Caching**: cache-aside with Redis for hot URLs (power-law distribution — a small fraction of links get most traffic); consider a local (in-process) LRU layer in front of Redis for the handful of extremely hot keys to shave off network hops entirely.',
                '**Redirect type**: 302 (temporary) lets you change/expire mappings and keeps analytics possible; 301 is cacheable by browsers but loses your ability to track clicks or update the mapping — a subtle but frequently-tested tradeoff.',
                '**Click analytics**: don\'t synchronously increment a counter in the hot path DB row (write contention on popular links). Instead, emit a lightweight click event to a queue/stream, and aggregate asynchronously.',
              ],
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant User\n    participant LB\n    participant API as Shortener Service\n    participant Cache as Redis\n    participant DB as Key-Value Store\n\n    User->>LB: POST /shorten {longUrl}\n    LB->>API: forward\n    API->>API: generate unique code (Snowflake ID -> base62)\n    API->>DB: put(code, longUrl)\n    API-->>User: 201 {shortUrl}\n\n    User->>LB: GET /r/{code}\n    LB->>API: forward\n    API->>Cache: get(code)\n    alt cache hit\n        Cache-->>API: longUrl\n    else cache miss\n        API->>DB: get(code)\n        DB-->>API: longUrl\n        API->>Cache: set(code, longUrl, ttl)\n    end\n    API-->>User: 302 Redirect to longUrl',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Follow-ups interviewers love: "How do you shorten under high concurrency without ID collisions?" (pre-allocated ID ranges per server, or a distributed sequence generator). "How do you handle custom aliases colliding with generated codes?" (single namespace, uniqueness constraint). "How do you purge expired links at scale?" (TTL in the KV store itself, or a background sweep job partitioned by expiry bucket). "How would you prevent someone from enumerating all shortened URLs?" (don\'t use sequential IDs as codes; rate-limit the lookup endpoint; don\'t leak existence via timing differences).',
            },
          ],
        },
        {
          id: 'news-feed',
          title: 'Case Study: News Feed',
          summary:
            'The central tradeoff is fan-out on write vs fan-out on read — and the answer production systems actually ship is a hybrid of both, split by follower count.',
          keyPoints: [
            'Fan-out on write (push): O(1) reads, but breaks down for celebrities with millions of followers.',
            'Fan-out on read (pull): cheap writes, but expensive reads especially for users following thousands of accounts.',
            'Hybrid — push for normal users, pull for celebrity accounts, merged at read time — is the answer that signals real production experience.',
            'Storing only post-ID references in the feed table (not full post bodies) and hydrating at read time keeps the feed-cache footprint small and lets posts be edited/deleted without rewriting every follower\'s feed.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'The central tradeoff: fan-out on write vs fan-out on read',
            },
            {
              type: 'list',
              items: [
                '**Fan-out on write (push)**: when a user posts, immediately write the post into every follower\'s precomputed feed (a list in Redis/Cassandra per user). Read is O(1) — just fetch the precomputed feed. Breaks down for celebrities with millions of followers (a single post triggers millions of writes — a "thundering herd" on write).',
                '**Fan-out on read (pull)**: feed is computed at read time by merging posts from all people you follow. Write is cheap (O(1)). Read is expensive, especially for users following thousands of accounts.',
                '**Hybrid (what production systems actually do)**: push for regular users, pull for celebrity/high-fan-out accounts, merged at read time. This is the answer that signals real experience.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n    subgraph Write Path\n        Post[User posts] --> FanoutDecider{Follower count?}\n        FanoutDecider -->|Normal user| PushWorker[Fan-out worker]\n        PushWorker --> FeedCache1[(Follower A\'s<br/>precomputed feed)]\n        PushWorker --> FeedCache2[(Follower B\'s<br/>precomputed feed)]\n        FanoutDecider -->|Celebrity, millions of followers| SkipPush[Skip push,<br/>store post only]\n    end\n    subgraph Read Path\n        ReadReq[GET /feed] --> Merger[Feed Merger]\n        Merger --> FeedCache1\n        Merger --> CelebPosts[(Celebrity posts<br/>pulled live)]\n        Merger --> RankRerank[Ranking/Re-rank]\n        RankRerank --> Response[Feed response]\n    end',
            },
            {
              type: 'p',
              text: '**Deep dive talking points:** feed ranking (engagement prediction model vs reverse-chronological — this is where an ML ranking service plugs in), pagination via cursor (not offset, which breaks under concurrent inserts), storage choice (a wide-column store like Cassandra for the precomputed feed — a natural fit for "list per user, append-heavy, range scans by time").',
            },
            {
              type: 'code',
              language: 'text',
              title: 'Data model (Cassandra-style, partitioned by user_id)',
              code: `Table: user_feed
  user_id       PARTITION KEY
  post_id       CLUSTERING KEY (DESC by post timestamp embedded in a Snowflake ID)
  author_id
  inserted_at

Table: posts
  post_id       PARTITION KEY
  author_id
  content
  media_urls
  created_at`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The feed table stores only `post_id` references, not full post content — hydration (fetching the actual post body/media/like-count) happens in a second batch-get step at read time against the `posts` table (and its own cache). This "store references, hydrate at read" pattern keeps the feed-cache footprint small and lets post content be edited/deleted without rewriting every follower\'s feed.',
            },
          ],
        },
        {
          id: 'chat-messaging',
          title: 'Case Study: Chat / Messaging System',
          summary:
            'A different muscle from the mostly-read-path feed/shortener problems — this one tests real-time delivery, per-conversation ordering, and durable offline handling.',
          keyPoints: [
            'The connection layer is stateful (WebSocket gateways) even though the rest of the system is stateless — a user_id → gateway_instance mapping in Redis routes messages to the right node.',
            'Ordering only needs to be guaranteed per-conversation, not globally — a per-conversation sequence number avoids a single global bottleneck.',
            'Delivery is at-least-once with client-side dedup by message ID — true exactly-once over an unreliable network is not achievable in practice.',
            'Offline messages must be durably persisted, never held solely in an in-memory queue, and delivered via a sync protocol on reconnect.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**Functional:** 1:1 and group messaging, online presence, delivery receipts (sent/delivered/read), offline message delivery, message history/sync across devices. **Non-functional:** low latency delivery (< 200ms for online recipients), messages must not be lost, ordering must be preserved per-conversation, must scale to billions of messages/day.',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    ClientA[Client A] <-->|WebSocket| GWA[Connection Gateway 1]\n    ClientB[Client B] <-->|WebSocket| GWB[Connection Gateway 2]\n    GWA --> PresenceSvc[Presence Service]\n    GWA --> MsgSvc[Message Service]\n    GWB --> MsgSvc\n    MsgSvc --> MsgQueue[[Message Queue / Log]]\n    MsgQueue --> MsgStore[(Message Store<br/>partitioned by conversation_id)]\n    MsgSvc --> Router{Recipient online?}\n    Router -->|Yes, on GW2| GWB\n    Router -->|No| PushSvc[Push Notification Service]\n    MsgStore --> SyncSvc[Sync Service<br/>for offline delivery on reconnect]',
            },
            {
              type: 'heading',
              text: 'Key design decisions',
            },
            {
              type: 'list',
              items: [
                '**Connection layer is stateful** (WebSocket gateways hold long-lived connections) even though the rest of the system is stateless — a `user_id → gateway_instance` mapping (in Redis) lets the Message Service know which gateway node, if any, currently holds a socket to the recipient.',
                '**Message ordering**: assign each message a monotonically increasing ID *per conversation* (not globally) — e.g., a per-conversation sequence number, or a Snowflake ID which is roughly time-ordered — so clients can detect gaps and request re-sync.',
                '**Delivery guarantee**: at-least-once from server to client, with client-side dedup by message ID, because "exactly-once" over an unreliable network+client is not achievable in practice.',
                '**Offline delivery**: messages for offline recipients are durably persisted (never solely held in an in-memory queue) and delivered via a sync protocol when the client reconnects (client sends "give me everything after message ID X"), plus a push notification (APNs/FCM) to prompt the user to open the app.',
                '**Group chat fan-out**: similar push/pull tradeoff as the news feed — small groups fan out directly to each member\'s active connection; a message store per-conversation (not per-recipient) avoids N-way duplication of the message body itself.',
                '**Read receipts / typing indicators**: high-frequency, low-durability-requirement events — a good fit for a lighter-weight, possibly lossy channel (don\'t put "typing..." events through the same durable, ordered pipeline as message content; losing one is harmless).',
              ],
            },
          ],
        },
        {
          id: 'ride-sharing',
          title: 'Case Study: Ride-Sharing Dispatch',
          summary:
            'Tests geospatial indexing and real-time matching under tight latency budgets — and how consistency requirements can vary wildly between components of the same system.',
          keyPoints: [
            'Geospatial cells (quadtree, geohash, S2 cells) turn "find drivers within 2km" into a lookup of a handful of cells instead of scanning every driver.',
            'Millions of drivers pinging every few seconds is itself a massive write-heavy stream — this flows through a queue (Kafka), not directly into the index.',
            'Matching must return in ~1-2 seconds: query the geo-index, filter by availability, rank by ETA (not just raw distance), offer with a short accept-timeout.',
            'Driver location can be a few seconds stale (fine — eventually consistent), but "has this ride offer already been accepted" must be strongly consistent to avoid double-booking a driver.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n    Driver[Driver app] -->|location ping every 4s| LocationSvc[Location Ingestion Service]\n    LocationSvc --> GeoIndex[(Geospatial Index<br/>Redis GEO / Quadtree / S2 cells)]\n    Rider[Rider app] -->|request ride| MatchSvc[Matching Service]\n    MatchSvc --> GeoIndex\n    GeoIndex -->|nearby drivers| MatchSvc\n    MatchSvc --> ETASvc[ETA/Routing Service]\n    MatchSvc --> PricingSvc[Surge Pricing Service]\n    MatchSvc -->|offer| Driver\n    Driver -->|accept| TripSvc[Trip Service]\n    TripSvc --> TripDB[(Trip Store)]',
            },
            {
              type: 'heading',
              text: 'Key design decisions',
            },
            {
              type: 'list',
              items: [
                '**Geospatial indexing**: divide the map into cells (quadtree, geohash, or Google\'s S2 cells) so "find drivers within 2km" is a lookup of a handful of cells instead of scanning every driver — Redis\'s `GEOADD`/`GEORADIUS` implements a version of this out of the box for moderate scale; at Uber\'s actual scale, custom quadtree/S2-based services with in-memory sharded indexes are used.',
                '**Location update volume dominates the system**: millions of drivers pinging every few seconds is itself a massive write-heavy stream — this typically flows through a queue (Kafka) rather than hitting the index synchronously per ping, with the index updated from consumers.',
                '**Matching is a race against time**: must return a match in ~1-2 seconds; the matching service queries the geo-index for nearby drivers, filters by availability/vehicle type, ranks by ETA (not just raw distance — traffic matters), and offers to the top candidate with a short accept-timeout before moving to the next.',
                '**Surge pricing** is computed from the same real-time supply (available drivers in a cell) vs demand (open ride requests in a cell) signal, recalculated on a short interval (e.g., every 1-5 minutes) per geo-cell, not globally.',
                '**Consistency needs vary wildly by component**: driver location can be a few seconds stale (eventual consistency is fine — the driver is still moving anyway), but "has this ride offer already been accepted by another rider/driver" must be strongly consistent (a distributed lock or a single-writer-per-offer pattern) to avoid double-booking the same driver.',
              ],
            },
          ],
        },
        {
          id: 'video-streaming',
          title: 'Case Study: Video Streaming Platform',
          summary:
            'Tests the split between a hot, latency-sensitive playback path and a heavy, async upload/transcoding pipeline that must never compete with it for capacity.',
          keyPoints: [
            'Upload/transcoding and playback are entirely separate pipelines with different latency budgets — minutes vs sub-second.',
            'Adaptive bitrate streaming (HLS/DASH) is why transcoding into multiple resolutions is a core, non-optional part of the pipeline.',
            'A CDN is not optional at this scale — nearly all bytes served are static video segments, the textbook CDN use case.',
            'Metadata (views, likes, recommendations) is decoupled from video bytes so a spike in engagement never competes with video-serving capacity.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Uploader --> UploadSvc[Upload Service]\n    UploadSvc --> RawStore[(Raw Video Store, S3)]\n    UploadSvc --> Queue[[Transcoding Queue]]\n    Queue --> Transcoders[Transcoding Workers<br/>multiple resolutions/bitrates]\n    Transcoders --> CDNOrigin[(Processed Video Store, S3)]\n    CDNOrigin --> CDN[CDN Edge Nodes]\n    Viewer --> CDN\n    Viewer --> MetadataSvc[Metadata/Recommendation Service]\n    MetadataSvc --> MetaDB[(Video Metadata DB)]\n    Transcoders --> MetaDB',
            },
            {
              type: 'heading',
              text: 'Key design decisions',
            },
            {
              type: 'list',
              items: [
                '**Upload and playback are entirely separate pipelines** with different latency budgets — uploads can take minutes to process (transcoding into multiple resolutions/formats for adaptive bitrate streaming), while playback must start in under a second.',
                '**Adaptive bitrate streaming** (HLS/DASH): video is chunked into short segments (2-10s) at multiple quality levels; the client player switches quality dynamically based on measured bandwidth — this is why "transcode into 5 different resolutions" is a core, non-optional part of the pipeline, not an optimization.',
                '**CDN is not optional at this scale** — nearly all bytes served are static video segments, the textbook CDN use case (see the dedicated CDN topic above); origin (S3) is only hit on a CDN cache miss (first request for a segment in a region).',
                '**Metadata (views, likes, recommendations) is decoupled from the video bytes themselves** — a separate service/DB, updated asynchronously, so a spike in "like" button clicks never competes with video byte-serving for capacity.',
                '**Storage cost tradeoff**: storing every resolution forever is expensive; production systems often transcode top resolutions eagerly and lower/rare ones lazily (on first request), or evict rarely-watched high-res variants and regenerate on demand — a cost/latency tradeoff worth naming explicitly.',
              ],
            },
          ],
        },
        {
          id: 'consistency-tradeoffs',
          title: 'Consistency, Availability & the Tradeoffs You Must Name',
          summary:
            'CAP explains behavior during a partition; PACELC explains the latency-vs-consistency tradeoff a healthy system makes every single request — and idempotency is what makes retries safe in either world.',
          keyPoints: [
            'CAP theorem is about behavior during a network partition, not a permanent three-way choice — partition tolerance is not optional.',
            'PACELC is more useful in interviews: even without a partition, you trade Latency for Consistency.',
            'Use strong consistency where correctness must be exact (payments, inventory, seat booking); eventual consistency where staleness is an acceptable latency/availability win (like counts, recommendations).',
            'Idempotency is required wherever retries happen — which is everywhere in a distributed system.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**CAP theorem**: under a network partition, choose Consistency or Availability (Partition tolerance is not optional in a distributed system). Say this precisely — CAP is about behavior *during a partition*, not a permanent three-way choice.',
                '**PACELC** (more useful in interviews): even without a partition (Else), you trade Latency for Consistency. This is the framework that explains why systems like DynamoDB default to eventual consistency even when healthy — it\'s faster.',
                '**Strong consistency** where correctness must be exact (payments, inventory decrement, seat booking).',
                '**Eventual consistency** where staleness is acceptable for a latency/availability win (social feed like counts, view counts, recommendations).',
                '**Idempotency**: any HLD involving retries (and all distributed systems need retries) must design idempotent writes — idempotency keys on payment/order APIs, `UPSERT` semantics, dedup on message consumption.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n    Partition{"Network<br/>partition?"}\n    Partition -->|Yes - P| APChoice{"Choose"}\n    APChoice -->|A| Availability["Availability:<br/>keep responding,<br/>maybe stale"]\n    APChoice -->|C| Consistency1["Consistency:<br/>reject/block until resolved"]\n    Partition -->|No - Else| ELChoice{"Choose"}\n    ELChoice -->|L| Latency["Latency:<br/>respond fast,<br/>maybe stale"]\n    ELChoice -->|C| Consistency2["Consistency:<br/>wait for confirmation"]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The real-world answer to "CP or AP?" is almost never a single choice for the whole system — it\'s "we chose CP for the payments service and AP for the feed service," made per-component based on what each actually needs.',
            },
          ],
        },
        {
          id: 'rate-limiter',
          title: 'Case Study: Distributed Rate Limiter (HLD level)',
          summary:
            'Where an LLD answer covers the algorithm (token bucket, sliding window), the HLD-level question is where the shared counter state lives once you have N stateless API servers behind a load balancer.',
          keyPoints: [
            'Local in-memory counters per server don\'t work once you scale horizontally — each server only sees its own slice of traffic.',
            'Centralize counters in Redis using atomic operations (INCR + EXPIRE, or a Lua script for atomicity across multiple keys).',
            'Alternatively, push rate limiting to the edge (API Gateway / CDN layer) so it\'s enforced before requests even reach app servers.',
            'If the shared counter store goes down, fail-open vs fail-closed is a product/business call, not just an engineering one.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Client --> LB[Load Balancer]\n    LB --> S1[API Server 1]\n    LB --> S2[API Server 2]\n    LB --> S3[API Server 3]\n    S1 --> Redis[(Redis Cluster<br/>token buckets, atomic INCR/EXPIRE)]\n    S2 --> Redis\n    S3 --> Redis',
            },
            {
              type: 'p',
              text: 'Key point: local in-memory counters per server don\'t work once you scale horizontally (each server only sees its own slice of traffic). Centralize counters in Redis using atomic operations (`INCR` + `EXPIRE`, or a Lua script for atomicity across multiple keys), or push rate limiting to the edge (API Gateway / CDN layer) so it\'s enforced before requests even reach app servers.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Mention the failure mode: if Redis is down, decide fail-open (allow all — risk overload) vs fail-closed (block all — risk false denial). This decision is a product/business call, not just an engineering one.',
            },
          ],
        },
        {
          id: 'failure-resilience',
          title: 'Failure Modes, Resilience & Observability',
          summary:
            'The section most candidates skip — naming single points of failure, cascading-failure mitigations, and what you\'d actually alert on is a reliable senior-level signal.',
          keyPoints: [
            'Any component with exactly one instance is a single point of failure — name the mitigation for each (replica + failover, clustered broker, multi-AZ).',
            'Cascading failures happen when a slow dependency exhausts caller thread pools — mitigate with timeouts, circuit breakers, and bulkheads.',
            'Thundering herd (many clients retrying at once) is mitigated with jittered backoff, request coalescing, and staggered TTLs.',
            'The four golden signals — latency, traffic, errors, saturation — are what you name when asked what you\'d alert on.',
            'An unbounded queue is not a backpressure strategy, it\'s a delayed outage.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Single points of failure**: any component with exactly one instance is one — a single DB primary, a single message broker node, a single-region deployment. For each, name the mitigation (replica + automated failover, clustered broker, multi-AZ deployment).',
                '**Cascading failures**: a slow downstream dependency exhausts caller thread pools/connections, which then makes the caller slow to *its* callers, and the failure propagates upward. Mitigate with timeouts (always set them — an unbounded timeout is a bug), circuit breakers, and bulkheads (isolate resource pools per dependency so one slow dependency can\'t starve calls to a healthy one).',
                '**Thundering herd**: many clients retry simultaneously after a failure (e.g., a cache expires and every request stampedes the DB at once). Mitigate with jittered exponential backoff, request coalescing (only one in-flight request per key refills the cache, others wait on it), and staggered TTLs.',
                '**Graceful degradation**: define what "degraded but alive" looks like per system — serve stale cached data, disable a non-critical feature (recommendations), return a simplified response — rather than a binary up/down.',
                '**Observability**: the "four golden signals" — latency, traffic, errors, saturation. In an interview, naming what you\'d alert on (e.g., "p99 redirect latency > 200ms," "cache hit ratio < 80%," "queue depth growing unboundedly") is a strong senior-level signal that\'s rarely asked for explicitly but always rewarded.',
                '**Backpressure**: when a downstream consumer can\'t keep up, the system needs an explicit strategy — buffer (queue, bounded!), drop (shed load, acceptable for non-critical telemetry), or slow the producer (reactive streams, TCP-style flow control) — an unbounded queue is not a strategy, it\'s a delayed outage.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    subgraph NoBreaker["Without a circuit breaker"]\n        A1[Service A] -->|calls B, no timeout| B1[Slow Service B]\n        B1 -->|response never returns| A1\n        A1 --> C1["A\'s thread pool<br/>exhausted waiting"]\n        C1 --> D1[A becomes slow too]\n        D1 --> E1[Failure cascades<br/>to A\'s callers]\n    end\n    subgraph WithBreaker["With a circuit breaker"]\n        A2[Service A] -->|calls B, with timeout| B2[Slow Service B]\n        B2 -->|failures exceed threshold| Open["Circuit opens:<br/>fail fast / fallback"]\n        Open --> Healthy["A stays responsive,<br/>B gets time to recover"]\n    end',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is the section most candidates skip entirely because it comes after the "interesting" architecture work. Bringing it up unprompted — even briefly — is a disproportionately strong signal relative to how little time it takes to say.',
            },
          ],
        },
        {
          id: 'practice-prompts',
          title: 'Common HLD Prompts to Practice',
          summary:
            'The recurring set of prompts across most HLD interview loops — practicing the framework against each of these builds pattern recognition fast.',
          keyPoints: [
            'Most HLD prompts are variations on a small number of underlying shapes: read-heavy lookup, feed/ranking, real-time messaging, geospatial matching, and heavy async pipelines.',
            'Recognizing which shape a new prompt maps to is most of the battle — the estimation and building-block vocabulary transfers directly.',
            'Practicing the same ten-step framework against several of these is more valuable than memorizing any single system\'s diagram.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'URL shortener, news feed, chat system (WhatsApp/Slack), rate limiter, notification system, ride-sharing dispatch (Uber), video streaming (YouTube/Netflix), e-commerce checkout/inventory, distributed cache, search autocomplete/typeahead, web crawler, payment processing system, collaborative document editing (Google Docs — OT/CRDT), distributed job scheduler, API rate-limited third-party integration proxy, ad click aggregation/analytics pipeline.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Run the full ten-step framework (clarify → estimate → API contract → diagram → data model → deep dive → bottlenecks → tradeoffs → failure modes) against two or three of these end to end before an interview — the estimation numbers and building blocks are largely reusable, but the reps of doing the full sequence out loud are what build speed.',
            },
          ],
        },
      ],
    },
    {
      id: 'hld-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: '30 HLD interview questions with full-depth answers, covering foundational concepts, the framework, case-study follow-ups, and tradeoff reasoning.',
          qa: [
            {
              question: 'What\'s the actual difference between High-Level Design and Low-Level Design, and how do you know which one an interviewer wants?',
              answer:
                'HLD decides which services, stores, and queues exist and how they communicate — the artifact is a box-and-arrow architecture diagram, and the skills tested are requirement scoping, estimation, and system-wide tradeoffs. LLD designs the internals of one component — the artifact is class diagrams and algorithms, and the skills tested are OOP design, patterns, and data structures. If a prompt is ambiguous ("design a rate limiter" could be either), ask: it changes whether you should be drawing services and databases or writing out a class with a token-bucket algorithm.',
            },
            {
              question: 'What is an API, conceptually, and why does every arrow on an HLD diagram imply one?',
              answer:
                'An API is a contract: a defined set of operations with specific inputs and outputs, saying nothing about how the server implements them. Any two boxes on an architecture diagram that are connected by an arrow are, by definition, communicating through some request/response (or message) shape — that shape is an API whether or not it is ever exposed publicly. Being unable to state roughly what crosses a given arrow on the spot is a reliable sign that box has been drawn but not actually designed.',
            },
            {
              question: 'How do you know when a single-server, single-database setup is no longer good enough, and what\'s the very first thing you\'d add?',
              answer:
                'Watch three signals: the app server is CPU/connection-saturated under normal load, the database is slow or saturated on reads or writes, or the setup has no redundancy and an outage would be unacceptable. The cheapest and usually first fix is adding a second app server behind a load balancer (free, since the app layer should already be stateless) and a cache in front of the database for the hottest reads — sharding the database itself is a much bigger structural decision and should be the last resort, justified by an actual estimation number showing a single well-tuned primary genuinely cannot keep up.',
            },
            {
              question: 'What is a CDN doing under the hood, and why can\'t you just rely on caching at your origin servers?',
              answer:
                'A CDN places cached copies of content on servers physically distributed across many regions, so a user\'s request is served from the nearest edge node instead of crossing the network to a single origin location — this cuts the actual physical round-trip latency (speed-of-light-bound, not just processing time) in a way that caching only at the origin cannot, since an origin-only cache still requires every user worldwide to reach that one location. A CDN also removes that traffic from your origin entirely, which a same-location cache tier does not.',
            },
            {
              question: 'How would you budget your time in a 45-60 minute HLD interview if you noticed you were falling behind?',
              answer:
                'Say so explicitly rather than silently rushing: name what you are cutting and why ("I will skip the notification service deep-dive and put the remaining time into sharding the message store, since that is the harder problem here"). Protect the deep-dive phase above all else — it typically carries as much rubric weight as component architecture and estimation combined — even if it means presenting a visibly rougher initial diagram. Cutting scope deliberately and out loud reads as self-awareness; running out of time silently reads as poor planning.',
            },
            {
              question: 'Walk me through how you\'d approach any system design question in the first 5 minutes.',
              answer:
                'Clarify functional scope and explicitly state what\'s out of scope; ask about scale (users, QPS, data size) and non-functional priorities (consistency vs availability, latency target); do a quick back-of-envelope calculation to know if this is a "single server" problem or a "must shard" problem; then sketch the API contract before drawing boxes — the API shape usually reveals the data model, which drives everything else.',
            },
            {
              question: 'Explain CAP theorem and why "we chose CA" is usually a wrong answer.',
              answer:
                'CAP says that during a network partition, a distributed system must choose between Consistency (every read sees the latest write) and Availability (every request gets a response, possibly stale). "CA" implies no partition tolerance, which isn\'t a real option for any system spanning more than one node/data center — partitions will happen. The real-world answer is "we chose CP for the payments service and AP for the feed service," i.e., the choice is made per-component based on what each actually needs, not once for the whole system.',
            },
            {
              question: 'When would you choose SQL over NoSQL for a new service, even at scale?',
              answer:
                'When the data has strong relational structure requiring multi-row/multi-table transactions (e.g., an order + its line items + inventory decrement must commit atomically), when you need flexible ad-hoc queries/joins, or when the write volume is within what a well-tuned relational DB with read replicas and partitioning (e.g., Postgres with Citus, or Vitess for MySQL) can handle — which is a lot higher than people assume. NoSQL wins when the access pattern is simple key-based lookup at massive scale, schema is naturally flexible/evolving, or you need multi-region active-active writes with automatic conflict resolution.',
            },
            {
              question: 'How do you design a system to handle a traffic spike 10x normal load without falling over?',
              answer:
                'Queue-based load leveling (absorb bursts in a queue, process at a sustainable rate — protects downstream stores), autoscaling with pre-warmed capacity if the spike is predictable (e.g., a sale event), aggressive caching and CDN offload to shrink the load that reaches origin, circuit breakers and graceful degradation (serve stale/cached data or a reduced feature set rather than failing entirely), and load shedding/rate limiting at the edge so the system fails predictably for a subset of requests rather than catastrophically for all.',
            },
            {
              question: 'Explain fan-out on write vs fan-out on read and how you\'d decide between them for a given feature.',
              answer:
                'Fan-out on write precomputes and pushes data to every consumer at write time — cheap, fast reads, expensive/bursty writes, breaks down when one writer has a huge number of consumers (celebrity problem). Fan-out on read computes the result at read time by pulling from sources — cheap writes, expensive reads, especially as the number of sources per reader grows. Decide based on the read:write ratio and the fan-out skew: uniform, moderate fan-out favors push; highly skewed fan-out (a few "hot" producers with huge audiences) favors a hybrid — push for most, pull-and-merge for the hot few.',
            },
            {
              question: 'How do you design idempotency into a payment API?',
              answer:
                'Require the client to generate and send a unique idempotency key per logical operation (e.g., a UUID generated once per checkout attempt, reused on retries). The server stores the key with the operation\'s result; on a retried request with the same key, it returns the stored result instead of re-executing the charge. The key/result pair needs a TTL and must be checked-and-set atomically (unique constraint in the DB, or a distributed lock) to avoid a race where two retries both pass the "not seen before" check simultaneously.',
            },
            {
              question: 'What\'s the difference between a message queue and an event stream (e.g., SQS vs Kafka), and when do you pick one over the other?',
              answer:
                'A queue (SQS/RabbitMQ) is typically consumed once and removed — good for task distribution/work queues where each message represents one unit of work for exactly one consumer group. An event stream (Kafka) retains events for a configurable window and supports multiple independent consumer groups replaying the same log at their own pace — good when multiple services need the same events for different purposes (analytics, audit, triggering downstream workflows) and when you need ordered, replayable history. Pick a queue for simple task offloading; pick a stream when multiple consumers need the same events or you need replay/audit.',
            },
            {
              question: 'How would you shard a database that\'s outgrown a single instance, and what breaks when you do?',
              answer:
                'Choose a shard key with high cardinality and access patterns that stay local to one shard (e.g., `user_id` for a per-user data model) — avoid hot keys. Options: range-based (simple, but risks hot shards for sequential keys/time-series), hash-based (even distribution, but range queries become cross-shard), or consistent hashing (minimizes reshuffling when adding/removing shards). What breaks: cross-shard joins and transactions become expensive or impossible without a distributed transaction protocol (2PC/Saga); auto-increment IDs no longer work globally (need a distributed ID generator); "show me all X" aggregate queries need scatter-gather or a separate analytics store.',
            },
            {
              question: 'How do you keep a cache consistent with the database?',
              answer:
                'Most common: cache-aside (read: check cache, on miss read DB and populate cache; write: update DB, then invalidate — not update — the cache entry to avoid races) with a TTL as a safety net against missed invalidations. Write-through (write to cache and DB synchronously) keeps them in lockstep but adds write latency. Write-behind (write to cache, async flush to DB) is fastest but risks data loss on cache failure before flush. For invalidation correctness under concurrent writes, prefer deleting the cache key over updating it (delete is idempotent and avoids stale overwrites from out-of-order writes).',
            },
            {
              question: 'How do you handle exactly-once processing when your infrastructure only guarantees at-least-once delivery?',
              answer:
                'True exactly-once delivery across a network is effectively impossible to guarantee end-to-end; the practical answer is at-least-once delivery + idempotent processing = effectively-once outcome. Techniques: dedup using a message ID stored in the consumer\'s processed-set (DB unique constraint or a dedup cache with TTL matching the max possible redelivery window), designing writes to be naturally idempotent (`UPSERT` instead of `INSERT`, `SET balance = X` instead of `balance += X` where feasible), and using transactional outbox patterns to atomically commit a DB write with the corresponding event publish.',
            },
            {
              question: 'Design a notification system that needs to reach a user across email, SMS, and push, at scale, without duplicate sends.',
              answer:
                'Producer services emit a `NotificationRequested` event to a queue rather than calling providers directly (decoupling + retry safety). A notification service consumes the event, resolves the user\'s channel preferences, dedups using an idempotency key (e.g., `eventId + channel`) stored with a TTL, and dispatches to per-channel worker pools (email/SMS/push have very different rate limits and failure modes, so isolate them so one channel\'s outage doesn\'t back up the others). Failed sends go through a retry-with-backoff and eventually a dead-letter queue for manual/alerted investigation. Rate limit per user to avoid notification storms.',
            },
            {
              question: 'How would you design for multi-region availability, and what\'s the hardest part?',
              answer:
                'Serve reads from the nearest region via geo-DNS/anycast and regional read replicas or a multi-region database (e.g., DynamoDB Global Tables, Spanner). The hardest part is writes: either pick one region as the write leader (simpler, but adds latency for far regions and creates a single point of failure for writes) or allow multi-region writes and resolve conflicts (last-write-wins, CRDTs, or application-level merge logic) — which reintroduces the CAP tradeoff at global scale. Also account for data residency/compliance constraints (GDPR) that may force certain data to stay in-region regardless of the technical design.',
            },
            {
              question: 'What\'s a circuit breaker and why is it a HLD-level concern, not just a library detail?',
              answer:
                'A circuit breaker stops calling a failing downstream dependency after a failure threshold, "opens" and fails fast (or falls back) for a cooldown period, then allows a trial request to check recovery ("half-open") before fully closing again. It\'s an HLD concern because it changes system-level behavior under partial failure — without it, one slow/broken downstream service can exhaust caller thread pools/connections and cascade the outage upstream ("cascading failure"), turning a single component\'s problem into a full-system outage. Deciding where breakers sit (service mesh, API gateway, per-client library) and what the fallback behavior is (cached data? degraded feature? error?) is an architecture decision.',
            },
            {
              question: 'How do you design pagination for a feed that\'s constantly being written to, at scale?',
              answer:
                'Avoid offset-based pagination (`LIMIT 20 OFFSET 1000`) — it gets slower as offset grows and produces duplicates/skips when rows are inserted between page fetches. Use cursor-based pagination: the client passes an opaque cursor (typically an encoded timestamp + ID from the last item seen), and the query fetches "items older than this cursor," which stays O(page size) regardless of position and is stable under concurrent inserts.',
            },
            {
              question: 'How do you decide the right database for a given workload in an interview, quickly?',
              answer:
                'Ask (mentally): what\'s the access pattern — key lookup, range scan, full-text search, graph traversal, time-series, or complex joins? What\'s the consistency requirement — must every read see the latest write? What\'s the write pattern — steady, bursty, append-only? Then match: key lookup at scale → DynamoDB/Cassandra; relational integrity + transactions → Postgres/MySQL (+ sharding tool if needed); full-text/search → Elasticsearch; time-series metrics → TimescaleDB/InfluxDB/Prometheus; graph relationships → Neo4j; blobs/media → S3. Naming the access pattern first, then the store, signals real judgment rather than a memorized "use Redis for everything" answer.',
            },
            {
              question: 'In the ride-sharing dispatch design, why is driver location updated via a queue instead of writing directly to the geospatial index?',
              answer:
                'Millions of drivers pinging their location every few seconds is itself a massive, continuous write stream — pushing that directly and synchronously into the index would make the index the bottleneck for the entire system and couples the availability of location ingestion to the availability of the index. Routing pings through a queue (Kafka) decouples ingestion rate from index-update rate, lets you buffer/absorb bursts, allows multiple downstream consumers (the geo-index updater, but also analytics or fraud-detection consumers) to process the same stream independently, and lets you replay/recover if the index needs to be rebuilt.',
            },
            {
              question: 'Why does the chat system design use per-conversation sequence numbers instead of a single global message ID sequence?',
              answer:
                'A single global sequence number requires every message-send anywhere in the system to coordinate through one shared counter, creating a bottleneck and a single point of contention at massive scale. Per-conversation sequencing only requires ordering guarantees *within* a conversation (which is the actual user-facing requirement — nobody cares if their message ID is globally ordered relative to a stranger\'s unrelated chat), so each conversation\'s counter can be maintained independently and in parallel, which is far more horizontally scalable while still satisfying the real ordering requirement.',
            },
            {
              question: 'In the video streaming design, why is upload processing (transcoding) fully decoupled from playback, and what would happen if it weren\'t?',
              answer:
                'Upload/transcoding is CPU-heavy, can take minutes, and has a relaxed latency requirement (a creator expects "processing," not instant availability). Playback needs to start in under a second and serve enormous read fan-out via CDN. If these shared infrastructure directly (e.g., transcoding workers also served playback requests), a burst of uploads would degrade playback latency for unrelated viewers, and vice versa — a viral video causing a playback traffic spike would compete for the same compute as unrelated ongoing transcodes. Decoupling via a queue and separate worker pools means each path can scale and fail independently.',
            },
            {
              question: 'How would you evolve a single-region monolith with one Postgres database into the sharded, multi-region design typical of an HLD interview answer — what\'s the realistic order of steps?',
              answer:
                '(1) Extract read traffic to replicas first — cheapest win, no data-model change, addresses read scaling immediately. (2) Introduce caching (cache-aside) for the hottest read paths to cut DB load further. (3) Only once vertical scaling and replicas are genuinely insufficient, shard the primary — pick a shard key aligned to the dominant access pattern, and expect to rewrite queries that previously joined across what are now shard boundaries. (4) Introduce async processing (queue + workers) to move non-critical-path work (emails, analytics, search indexing) off the request path. (5) Multi-region only after single-region is solid — it multiplies operational complexity (conflict resolution, data residency, latency-vs-consistency tradeoffs) and should be justified by an actual requirement (global user base, regulatory, disaster recovery), not done preemptively. Naming this order, rather than jumping straight to "shard everything and go multi-region," is what signals real production experience over interview-prep memorization.',
            },
            {
              question: 'What\'s the difference between horizontal and vertical scaling, and where does each hit a wall?',
              answer:
                'Vertical scaling (bigger machine — more CPU/RAM/faster disk) is simple, requires no application changes, but hits a hard ceiling (largest available instance size) and creates a single point of failure with no redundancy. Horizontal scaling (more machines) has no practical ceiling and adds redundancy for free, but requires the application to be designed for it — statelessness in app servers, a data layer that supports partitioning/replication, and coordination mechanisms (load balancing, service discovery, distributed locks) that a single-machine design never needed. Interview signal: know that vertical scaling is a legitimate first move for a startup-scale system, not something to skip past to look impressive.',
            },
            {
              question: 'How would you design the "search autocomplete/typeahead" feature for a product like Google or Amazon search?',
              answer:
                'Core data structure is a **Trie** (prefix tree) mapping prefixes to the top-K most likely completions, precomputed offline from historical query logs/frequency (not computed live per keystroke). The trie (or a flattened, serialized version of it) is small enough to be cached entirely in memory per shard, sharded by prefix range if it doesn\'t fit on one node, and served from edge/CDN-adjacent locations for sub-50ms latency since this fires on every keystroke. Personalization (recent searches, location) is layered on top of the base global suggestions at request time rather than baked into the precomputed trie, keeping the expensive precomputation global and reusable across users while personalization stays a cheap, small overlay.',
            },
            {
              question: 'In a collaborative document editor (Google Docs-style), what\'s the core technical challenge and how is it typically solved?',
              answer:
                'The challenge is merging concurrent edits from multiple users editing the same region of a document without conflicts or lost updates, while keeping every client\'s view eventually consistent and preserving user intent. Two established approaches: **Operational Transformation (OT)** — transform each incoming operation against concurrently applied operations so it can still be applied correctly regardless of arrival order (what Google Docs historically used) — requires a central server to sequence operations. **CRDTs (Conflict-free Replicated Data Types)** — design the data structure itself (e.g., a sequence CRDT for text) so that concurrent operations commute and merge deterministically without needing a central sequencer, enabling true peer-to-peer or offline-first editing. OT is generally more complex to implement correctly but was historically more mature; CRDTs are increasingly favored for offline-first and decentralized collaboration apps.',
            },
            {
              question: 'Your interviewer says "the cache is down, what happens now?" How do you answer well?',
              answer:
                'Don\'t say "the system goes down" — that\'s a design flaw to fix, not a fact to accept. A well-designed system treats the cache as a performance optimization, not a dependency for correctness: on cache unavailability, requests fall through to the database directly (with a circuit breaker to stop hammering a possibly-struggling DB, and a timeout so cache calls fail fast rather than hanging), throughput/latency degrades (this is where you\'d expect a paging alert on elevated latency and DB load) but the system stays functionally correct and available, just slower — and you\'d have autoscaling/capacity headroom on the DB tier sized to survive exactly this scenario for the expected MTTR of the cache.',
            },
            {
              question: 'How do you approach estimating storage growth over multiple years for capacity planning, and why does it matter in an interview?',
              answer:
                'Compute year-1 storage from your write-QPS estimate × average record size × seconds/year, then apply a growth multiplier if user/traffic growth is expected (e.g., 50% YoY), and always multiply by the replication factor (commonly 3x) since raw and stored-with-redundancy are very different numbers. It matters because it\'s the number that determines whether "a single well-provisioned database" is even in the realm of plausibility for years 1-3, or whether the design needs sharding from day one — naming the actual number (not just "it\'ll be big") is what separates estimation theater from estimation that drives a decision.',
            },
            {
              question: 'How would you design an ad click aggregation / analytics pipeline that needs to count billions of events per day accurately for billing purposes?',
              answer:
                'Ingest raw click events into a durable, ordered log (Kafka) immediately at the edge — this is the source of truth and enables replay if downstream aggregation has a bug. A stream-processing layer (Flink/Spark Streaming/Kafka Streams) aggregates counts in windows (e.g., per-minute, per-hour rollups) with exactly-once processing semantics (checkpointing + idempotent sinks) since billing accuracy makes "effectively-once" non-negotiable here unlike a "like count" which can tolerate minor drift. Raw events are also archived to cold storage (S3) for reprocessing/audits and for handling late-arriving events (watermarking with a bounded lateness window, after which late events either get dropped or trigger a correction record rather than silently corrupting an already-closed window). Serve pre-aggregated rollups from a fast OLAP store (e.g., a columnar warehouse) rather than querying raw events for every dashboard/billing request.',
            },
          ],
        },
      ],
    },
  ],
}
