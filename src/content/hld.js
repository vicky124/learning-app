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
                '**Requirement clarification (~10%)** — did you scope the problem instead of solving an imaginary one?',
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
              text: 'The percentages above are an illustrative composite, not any one company\'s official sheet - real rubrics vary by company and by level. What is consistent across them: component architecture and deep-dive quality together dominate. A candidate who draws a competent-but-generic diagram and then goes genuinely deep on the one hard problem the prompt is actually testing will consistently outscore one who covers more boxes shallowly.',
            },
            {
              type: 'heading',
              text: 'How the bar moves with seniority',
            },
            {
              type: 'table',
              headers: ['Level', 'What the interviewer expects you to drive', 'What gets you down-leveled'],
              rows: [
                ['Mid-level (SDE II)', 'A working end-to-end design with sensible building blocks; you can go deep on one component when prompted', 'Unable to estimate; no API or data model; boxes with no justification'],
                ['Senior', 'You drive the whole interview, pick the hard problem yourself, quantify it, and name 2-3 non-obvious tradeoffs and failure modes unprompted', 'Waiting to be led; generic "add Kafka and Redis" answers; no discussion of what breaks'],
                ['Staff+', 'You reason about evolution over time, operability, cost, org/ownership boundaries, migration paths, and which requirements you would push back on', 'A technically correct design that ignores cost, on-call burden, rollout/migration, or blast radius'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A useful self-check: after each major decision, ask yourself "what number justifies this, what does it cost, and what breaks first?" If you can answer all three out loud, you are performing at the senior bar for that decision.',
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
                ['Seconds per day / per year', '~86,400 ≈ 10^5 / ~3.15 × 10^7 (round to 10^5 and 3 × 10^7 for mental math)'],
                ['Replication factor (typical)', '3x storage; with quorum (2 of 3) reads/writes you tolerate 1 replica down and stay available, and lose no acknowledged data even if 2 of 3 disks die'],
                ['Cache hit ratio target', '90%+ for read-heavy systems with power-law access - and note that going from 90% to 99% cuts DB load 10x, not 10%'],
              ],
            },
            {
              type: 'heading',
              text: 'Latency numbers worth knowing (order of magnitude)',
            },
            {
              type: 'p',
              text: 'The classic "latency numbers every programmer should know" list dates from the 2000s; hardware has moved (NVMe SSDs, 25-100 Gbps datacenter NICs), but the *ratios* are what matter in an interview and they are still roughly right. Memorize orders of magnitude, not exact figures.',
            },
            {
              type: 'table',
              headers: ['Operation', 'Order of magnitude', 'Design implication'],
              rows: [
                ['L1 cache / main memory reference', '~1 ns / ~100 ns', 'In-process caches are ~1000x faster than any network hop'],
                ['Read 1 MB sequentially from memory', '~tens of µs', 'Scanning in-memory data is cheap; serializing it over a network is not'],
                ['NVMe SSD random read', '~tens to ~100 µs', 'An indexed DB lookup that hits disk still fits in a ~1 ms budget'],
                ['Round trip within one datacenter / AZ', '~0.1-0.5 ms', 'A chain of 10 synchronous internal calls still costs only a few ms - but fan-out amplifies tail latency'],
                ['Round trip between AZs in one region', '~0.5-2 ms', 'Synchronous replication across AZs is affordable'],
                ['Redis / Memcached GET over the network', '~0.2-1 ms', 'Cache hits are dominated by network, not lookup cost'],
                ['Spinning-disk seek', '~5-10 ms', 'Why random I/O on HDDs is avoided for hot paths'],
                ['Round trip cross-continent (e.g. US East to Europe)', '~70-150 ms', 'Synchronous cross-region writes add this to every request - the core multi-region tradeoff'],
                ['TLS + TCP handshake to a far origin', 'several round trips', 'Why CDNs terminate TLS at the edge and why connection reuse (HTTP/2, HTTP/3) matters'],
              ],
            },
            {
              type: 'heading',
              text: 'The estimation toolkit: four formulas',
            },
            {
              type: 'code',
              language: 'text',
              title: 'formulas you will reuse in every interview',
              code: `QPS (avg)      = daily_requests / 86,400          (~ daily / 10^5)
QPS (peak)     = QPS_avg x peak_factor             (2-5x typical; 10x+ for events)
Storage/year   = writes/sec x record_size x 3.15e7 x replication_factor
Bandwidth      = QPS x payload_size                (do egress and ingress separately)
Concurrency    = arrival_rate x time_in_system     (Little's Law: L = λ × W)
Servers needed = peak_QPS / per_server_QPS  x (1 / target_utilization)   (e.g. 0.6-0.7)

Example (Little's Law): 20,000 req/s at 50 ms each
  -> 20,000 x 0.05 = 1,000 requests in flight at any instant
  -> that is the connection-pool / thread budget you must provision across the fleet`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '**Little\'s Law** is the most under-used tool in HLD interviews. It converts throughput plus latency into concurrency - which is what actually exhausts thread pools, DB connections, and WebSocket servers. When an interviewer asks "how many DB connections do you need?" or "what happens when the dependency slows from 20 ms to 2 s?", it gives you the answer: 100x the latency means 100x the in-flight requests at the same QPS.',
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
                'Fan-out cost check: 50M posts/day × ~200 average followers = ~10B feed-insert operations/day (~115K/sec average, several hundred K/sec at peak). That is the hidden write amplification of push-based feeds - and the skew matters more than the average: one account with 100M followers would generate 100M inserts from a single post, which is exactly why celebrities are excluded from push.',
                'Conclusion chain an interviewer wants to hear: "~40K peak feed-read QPS against ~600 post writes/sec (20:1 by request count, far higher by rows read, since each feed read touches dozens of posts) → precompute is worth it for the 99% of normal users; ~3.2TB feed-cache footprint needs a sharded store; ~54TB/year of post data needs a horizontally scalable primary store (Cassandra/DynamoDB) rather than a single Postgres instance." This is estimation *driving* the architecture, not decoration after the fact.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    DAU["DAU + usage pattern"] --> QPS["Requests/sec<br/>avg + peak"]\n    QPS --> RW["Read:Write ratio"]\n    RW --> Storage["Storage growth/year<br/>x replication factor"]\n    Storage --> Decision{"Fits on one<br/>well-tuned DB?"}\n    Decision -->|Yes| SingleDB["Single primary +<br/>replicas + cache"]\n    Decision -->|No| Sharded["Sharded / horizontally<br/>scaled store"]',
            },
            {
              type: 'heading',
              text: 'Rough single-node capacity anchors (to judge "does it fit on one box?")',
            },
            {
              type: 'table',
              headers: ['Component', 'Ballpark sustained throughput per node', 'Caveat'],
              rows: [
                ['Stateless app server (simple JSON API)', '~1K-10K+ req/s', 'Depends entirely on per-request work; measure, do not assume'],
                ['Relational primary (Postgres/MySQL), indexed point queries', '~10K-50K simple reads/s; low thousands to ~10K+ writes/s', 'Complex queries, large rows, and fsync/replication settings change this by an order of magnitude'],
                ['Redis / Memcached node', '~100K+ simple ops/s', 'Single hot key is limited by one shard/thread regardless of cluster size'],
                ['Kafka broker', 'Hundreds of MB/s of sequential writes', 'Partition count, replication and message size dominate'],
                ['One WebSocket gateway node', 'Tens to hundreds of thousands of idle connections', 'Memory per connection and message rate, not connection count, usually bind first'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Estimation theater: computing numbers and then never using them. Every number you compute should end in a sentence that starts with "so..." - "so one Postgres primary handles the writes", "so the feed cache must be sharded", "so egress is the dominant cost and we need a CDN". If a number does not change a decision, skip it and save the time for the deep dive.',
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
            {
              type: 'heading',
              text: 'Each block, the pressure it relieves, and the cost it adds',
            },
            {
              type: 'table',
              headers: ['Building block', 'Relieves', 'New cost / failure mode it introduces'],
              rows: [
                ['Load balancer (L4 or L7)', 'App-tier CPU/connection limits; single-server SPOF', 'Itself must be redundant; L7 adds TLS termination cost; sticky sessions undermine statelessness'],
                ['API gateway', 'Duplicated cross-cutting logic (auth, quotas, routing) in every service', 'Extra hop; becomes a critical shared dependency and a deployment bottleneck if teams pile logic into it'],
                ['Cache (Redis/Valkey, Memcached)', 'Read load and read latency on the primary store', 'Staleness, invalidation bugs, stampedes on expiry, hot keys, cold-start after a flush'],
                ['CDN', 'Origin egress, cross-region latency for cacheable content', 'Purge propagation, cache-key mistakes that leak personalized data'],
                ['Read replicas', 'Read QPS on the primary', 'Replication lag: read-your-writes violations'],
                ['Sharding', 'Write throughput and dataset size beyond one node', 'Cross-shard queries/transactions, hot shards, resharding operations'],
                ['Queue / stream', 'Spiky load; tight coupling between producer and consumer', 'Async = eventual consistency; duplicates, ordering, poison messages, consumer lag'],
                ['Search index', 'Full-text and faceted queries the primary DB is bad at', 'A second copy of the data that lags the source of truth; reindexing at scale'],
                ['Object storage', 'Storing large blobs in a database', 'Higher per-request latency; needs CDN in front for hot reads'],
              ],
            },
            {
              type: 'heading',
              text: 'L4 vs L7 load balancing, in one paragraph',
            },
            {
              type: 'p',
              text: 'An **L4** load balancer routes TCP/UDP connections by IP and port without reading the payload - very fast, protocol-agnostic, and good for long-lived connections (WebSockets, databases, gRPC when you balance per connection). An **L7** load balancer terminates HTTP(S), so it can route by path, header or cookie, retry idempotent requests, do canary/weighted routing, and balance *per request* - which matters for gRPC/HTTP/2, where one long-lived connection carries many requests and L4 balancing would pin all of them to one backend. Most modern stacks use both: an L4 layer (often anycast) at the edge, L7 proxies (Envoy, NGINX, cloud ALBs) behind it, and frequently a service mesh or proxyless gRPC doing client-side L7 balancing for east-west traffic.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Naming specific products is fine but optional - "a Redis-compatible cache (Redis or Valkey)" or "a Kafka-compatible log" is better than tying the design to a vendor. What interviewers grade is whether you can say *why* that category of store fits the access pattern.',
            },
          ],
        },
        {
          id: 'replication-partitioning',
          title: 'Replication, Partitioning & Consistent Hashing (Deep Dive)',
          summary:
            'How one logical database becomes many machines: replication for availability and read scale, partitioning for write scale and size - and the quorum math, rebalancing, and hot-key problems interviewers probe once you say "we shard it."',
          keyPoints: [
            'Replication copies the same data to several nodes (availability, read scale); partitioning splits different data across nodes (write scale, capacity). Real systems do both: every partition is replicated.',
            'Leader-follower is the default; multi-leader and leaderless (quorum) designs trade simpler writes-anywhere availability for conflict resolution.',
            'With N replicas, write quorum W and read quorum R, choosing R + W > N guarantees every read overlaps the latest acknowledged write - but not linearizability on its own.',
            'Consistent hashing with virtual nodes means adding a node moves only ~1/N of the keys instead of nearly all of them.',
            'The shard key is the most consequential decision: it must spread load evenly *and* keep the dominant query on one shard.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Replication strategies',
            },
            {
              type: 'table',
              headers: ['Strategy', 'How writes work', 'Strength', 'Weakness', 'Examples'],
              rows: [
                ['Single-leader (primary/replica)', 'All writes go to one leader, which ships its log to followers', 'Simple, no write conflicts, easy strong consistency on the leader', 'Leader is a write bottleneck; failover can lose un-replicated writes if async', 'Postgres, MySQL, most managed SQL'],
                ['Multi-leader', 'Several leaders (often one per region) accept writes and replicate to each other', 'Local write latency in every region; survives a region outage', 'Concurrent writes to the same row conflict and must be resolved (LWW, CRDT, app merge)', 'Multi-region active-active setups, collaborative/offline apps'],
                ['Leaderless (quorum)', 'Client/coordinator writes to N replicas, succeeds after W acks; reads from R replicas', 'No failover step; tolerates slow/dead nodes gracefully', 'Weaker guarantees by default; read repair / anti-entropy needed; tunable but subtle', 'Cassandra, ScyllaDB, Dynamo-style stores'],
                ['Consensus-replicated (Raft/Paxos)', 'A leader commits a write once a majority of replicas have logged it', 'Linearizable, automatic safe failover, no lost acknowledged writes', 'Every write pays a majority round trip; cross-region majorities are slow', 'etcd, ZooKeeper, CockroachDB, Spanner, TiDB, YugabyteDB'],
              ],
            },
            {
              type: 'heading',
              text: 'Synchronous vs asynchronous replication',
            },
            {
              type: 'p',
              text: 'With **asynchronous** replication the leader acknowledges a write as soon as it is durable locally; followers catch up later. Writes are fast, but if the leader dies, the last few hundred milliseconds of acknowledged writes may be gone after failover (RPO > 0), and reads from a lagging follower can go back in time. With **synchronous** replication the leader waits for at least one follower before acknowledging - zero data loss on single-node failure, at the cost of the follower round trip on every write, and a stalled follower can stall writes. Production setups usually pick **semi-synchronous**: wait for one replica (ideally in another availability zone), replicate to the rest asynchronously.',
            },
            {
              type: 'heading',
              text: 'Replication lag anomalies you must be able to name',
            },
            {
              type: 'list',
              items: [
                '**Read-your-writes violation** - a user updates their profile, the next page load hits a lagging replica and shows the old value. Fix: route a user\'s reads to the leader for a short window after they write, or track the write\'s log position and only read from replicas that have caught up to it.',
                '**Monotonic-reads violation** - two successive reads hit different replicas and the second one is *older*, so a comment appears and then disappears. Fix: pin each user/session to one replica (hash by user id).',
                '**Consistent-prefix violation** - in a partitioned system, an answer is seen before the question it replies to. Fix: keep causally related writes in the same partition, or carry causal metadata.',
              ],
            },
            {
              type: 'heading',
              text: 'Quorum math',
            },
            {
              type: 'code',
              language: 'text',
              title: 'N replicas, W write acks, R read responses',
              code: `Overlap rule:  R + W > N   -> every read set intersects every write set

N=3, W=2, R=2   classic balanced setting
                tolerates 1 node down for both reads and writes
N=3, W=3, R=1   fast reads, but ANY node down blocks writes
N=3, W=1, R=1   fastest, highest availability, no overlap -> stale reads likely
N=5, W=3, R=3   tolerates 2 nodes down

Caveats (what interviewers probe):
- "sloppy quorums" + hinted handoff can accept writes on non-home nodes -> overlap no longer guaranteed
- concurrent writes still need a conflict rule (last-write-wins drops data silently)
- clock skew makes LWW timestamps unreliable; version vectors detect true concurrency`,
            },
            {
              type: 'heading',
              text: 'Partitioning schemes',
            },
            {
              type: 'table',
              headers: ['Scheme', 'Good at', 'Bad at', 'Typical use'],
              rows: [
                ['Range (by key order)', 'Range scans, ordered iteration', 'Hot spots on sequential keys (timestamps, auto-increment ids all hit the last range)', 'Bigtable/HBase, Spanner, CockroachDB (auto-splitting ranges)'],
                ['Hash (hash(key) mod N)', 'Even spread of load', 'Range queries; changing N remaps almost every key', 'Simple fixed-size sharding'],
                ['Consistent hashing (ring + virtual nodes)', 'Adding/removing nodes moves ~1/N of keys', 'Range queries; needs vnodes to avoid uneven arcs', 'Dynamo-style stores, Cassandra, distributed caches'],
                ['Directory / lookup service', 'Arbitrary placement, moving individual tenants', 'An extra lookup hop and a critical metadata service', 'Multi-tenant SaaS, Vitess-style keyspace maps'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'consistent hashing with virtual nodes (sketch)',
              code: `import bisect, hashlib

def h(s: str) -> int:
    return int(hashlib.md5(s.encode()).hexdigest(), 16)

class Ring:
    def __init__(self, nodes, vnodes=128):
        self.vnodes = vnodes
        self.ring = []          # sorted list of (hash, node)
        for n in nodes:
            self.add(n)

    def add(self, node):
        for i in range(self.vnodes):            # many points per node -> smooth distribution
            bisect.insort(self.ring, (h(f"{node}#{i}"), node))

    def remove(self, node):
        self.ring = [(k, n) for k, n in self.ring if n != node]

    def lookup(self, key, replicas=3):
        """Walk clockwise from hash(key); return the first 'replicas' DISTINCT nodes."""
        i = bisect.bisect(self.ring, (h(key), ""))
        out = []
        while len(out) < replicas and len(out) < len({n for _, n in self.ring}):
            node = self.ring[i % len(self.ring)][1]
            if node not in out:
                out.append(node)
            i += 1
        return out`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    K["key: user_42"] --> H["hash(key) = position on ring"]\n    H --> W["walk clockwise"]\n    W --> V1["vnode A#17 -> primary = Node A"]\n    W --> V2["next distinct: Node C"]\n    W --> V3["next distinct: Node B"]\n    V1 --> RS["Replica set: A, C, B"]\n    V2 --> RS\n    V3 --> RS',
            },
            {
              type: 'heading',
              text: 'Choosing a shard key',
            },
            {
              type: 'list',
              items: [
                '**High cardinality and even load** - `country` is a terrible shard key (a handful of values, one of them huge); `user_id` usually works.',
                '**Locality for the dominant query** - if 95% of queries are "everything for tenant T", shard by `tenant_id` so they hit one shard; scatter-gather across all shards should be the rare path.',
                '**Avoid monotonically increasing keys under range partitioning** - all inserts land on the newest range. Hash-prefix the key, or use a store that splits hot ranges automatically.',
                '**Plan for the whale** - one tenant or celebrity bigger than a shard. Options: give it a dedicated shard, sub-partition it (`tenant_id + bucket`), or append a random suffix to hot keys and fan reads out over the suffixes.',
                '**Resharding is an operation, not an event** - you need double-writes or log-based copy, a backfill, a verification step, and a cut-over. Over-provisioning logical shards (e.g. 1,024 logical shards mapped onto 16 physical nodes) lets you move whole logical shards later instead of re-hashing keys.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Saying "we use consistent hashing" does not solve hot keys. Consistent hashing balances *keys* across nodes; it does nothing when one key gets 100x the traffic of the others. For that you need caching (often in-process), key splitting, or request coalescing.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewer probe: "Your primary dies. Walk me through failover." Strong answer: failure detection (heartbeats/lease expiry, with a timeout tuned to avoid false positives), electing the most up-to-date replica (ideally via consensus, not ad-hoc scripts), fencing the old leader so it cannot keep accepting writes if it was only partitioned (fencing tokens / epoch numbers), repointing clients (DNS, proxy, or service discovery), and stating the data-loss window you accepted with async replication.',
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
            'Modern CDNs can purge globally in seconds or less, but purges are rate-limited, easy to get wrong, and every purge sends a burst of misses to origin - prefer versioned/hashed URLs over "purge on update" wherever possible, and use surrogate keys/cache tags when you must purge.',
            'Origin shielding (tiered caching) collapses misses from hundreds of PoPs into one regional cache, so a cold or purged object costs the origin roughly one request instead of one per PoP.',
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
              kind: 'note',
              text: 'Back-of-envelope for why this matters: a video or image platform serving 10 PB/month at a 95% CDN hit ratio pulls only ~0.5 PB/month from origin. At 80% it pulls 2 PB - four times the origin egress bill and origin capacity. Small hit-ratio changes are large cost changes.',
            },
            {
              type: 'heading',
              text: 'How the edge decides what to cache: headers and cache keys',
            },
            {
              type: 'code',
              language: 'text',
              title: 'Cache-Control recipes',
              code: `# Fingerprinted static asset (app.3f9a1c.js) - cache "forever", never revalidate
Cache-Control: public, max-age=31536000, immutable

# Public API response - browsers keep it 0s, CDN keeps it 60s,
# and may serve stale for 5 min while refetching in the background
Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300, stale-if-error=86400

# Personalized response - must never be stored by a shared cache
Cache-Control: private, no-store

# Purge-by-tag support (header name is CDN-specific, e.g. Surrogate-Key / Cache-Tag)
Surrogate-Key: product-123 category-shoes`,
            },
            {
              type: 'list',
              items: [
                '**Cache key** - by default roughly host + path + query string. Adding headers or cookies to the key (`Vary: Cookie`) fragments the cache until hit ratio collapses; omitting something that changes the response (e.g. `Accept-Language`) serves the wrong variant to users. Normalize query strings and strip tracking parameters before keying.',
                '**Origin shield / tiered cache** - edge PoPs fetch misses from a mid-tier regional cache, not the origin directly; this protects origin after a deploy or purge and raises effective hit ratio for long-tail content.',
                '**Request collapsing** - when 10,000 viewers request the same uncached live-video segment at once, a well-configured CDN sends one request upstream and fans the response out; this is the edge equivalent of the cache-stampede fix in the caching deep dive.',
                '**stale-while-revalidate / stale-if-error** - serve a slightly stale copy instantly while refreshing in the background, and keep serving stale if the origin is down. This turns the CDN into a resilience layer, not just a performance one.',
                '**Edge compute** - functions running at the PoP (auth checks, A/B bucketing, geolocation redirects, header rewriting, even full SSR) avoid a round trip to origin; keep them small and stateless, and remember data they need still has to come from somewhere (edge KV stores are typically eventually consistent).',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The scariest CDN bug is caching a personalized response under a shared key - user A\'s account page served to user B. It has caused real data-exposure incidents. Default dynamic routes to `private, no-store` and opt specific routes *into* shared caching deliberately.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Forgetting to mention a CDN is a common miss in case studies that are obviously read-heavy and static-content-heavy (video streaming, image hosting, a static marketing site). Naming it explicitly - and naming *what specifically* gets cached and for how long, not just "we use a CDN" - is the actual signal an interviewer is listening for.',
            },
          ],
        },
        {
          id: 'caching-strategies',
          title: 'Application Caching Deep Dive: Patterns, Stampedes & Hot Keys',
          summary:
            'A cache is the cheapest way to multiply read capacity and the easiest way to introduce subtle correctness bugs - this topic covers the write/read patterns, invalidation races, stampedes, hot keys and sizing that interviewers probe after you draw a Redis box.',
          keyPoints: [
            'Cache-aside (lazy loading) is the default: read from cache, on miss read the DB and populate; on write, update the DB then delete the cache key.',
            'Delete-on-write beats update-on-write because concurrent updates can land out of order and leave the cache permanently stale; a TTL is the safety net for any missed invalidation.',
            'A cache stampede (dogpile) happens when a hot key expires and thousands of requests miss at once - fix with request coalescing/locking, early probabilistic refresh, and jittered TTLs.',
            'Hot keys exceed what one cache shard can serve no matter how big the cluster is - fix with an in-process L1 cache, key replication with random suffixes, or edge caching.',
            'Size the cache from the working set, not the dataset: with power-law access, caching the top 10-20% of keys often captures most of the reads.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'The caching patterns compared',
            },
            {
              type: 'table',
              headers: ['Pattern', 'Read path', 'Write path', 'Use when', 'Main risk'],
              rows: [
                ['Cache-aside', 'App checks cache; on miss reads DB and fills cache', 'App writes DB, then deletes key', 'Default for most read-heavy services', 'Brief staleness; stampede on hot-key miss'],
                ['Read-through', 'Cache library/service loads from DB on miss', 'Usually combined with write-through or invalidation', 'You want loading logic centralized in a caching layer', 'Same as cache-aside, hidden inside a library'],
                ['Write-through', 'Always hits cache', 'Write cache and DB synchronously', 'Data read immediately after write; cache must never be cold for recent writes', 'Higher write latency; caches data nobody reads'],
                ['Write-behind (write-back)', 'Always hits cache', 'Write cache; flush to DB asynchronously in batches', 'Very high write rates where batching helps (counters, metrics)', 'Data loss if the cache dies before flush; ordering issues'],
                ['Refresh-ahead', 'Always hits cache', 'Background job refreshes entries before they expire', 'Predictable hot set (home page, top products)', 'Wasted refreshes on keys nobody reads anymore'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'cache-aside with delete-on-write, jittered TTL and coalescing',
              code: `import random, json, time

TTL = 300  # seconds

def get_product(pid):
    key = f"product:{pid}"
    cached = redis.get(key)
    if cached is not None:
        return json.loads(cached)

    # Coalesce: only one caller rebuilds; others briefly wait or serve stale
    lock_key = f"lock:{key}"
    if redis.set(lock_key, "1", nx=True, ex=5):       # SET NX EX = acquire short lease
        try:
            row = db.query_one("SELECT * FROM products WHERE id = %s", pid)
            ttl = TTL + random.randint(0, 60)            # jitter avoids synchronized expiry
            redis.set(key, json.dumps(row), ex=ttl)
            return row
        finally:
            redis.delete(lock_key)
    else:
        time.sleep(0.05)                                 # or return a stale copy if you keep one
        return get_product(pid)

def update_product(pid, fields):
    db.execute("UPDATE products SET ... WHERE id = %s", pid)
    redis.delete(f"product:{pid}")    # delete, don't set: avoids out-of-order stale overwrites`,
            },
            {
              type: 'heading',
              text: 'The invalidation race everyone gets asked about',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant R as Reader\n    participant C as Cache\n    participant DB as Database\n    participant W as Writer\n    R->>C: GET k (miss)\n    R->>DB: read k = v1\n    W->>DB: write k = v2\n    W->>C: DELETE k\n    R->>C: SET k = v1 (stale value written AFTER the delete)\n    Note over C: cache now holds v1 until TTL expires',
            },
            {
              type: 'p',
              text: 'Delete-on-write narrows the window but does not eliminate it: a slow reader can repopulate the cache with a value it read *before* the write. Mitigations, in increasing order of effort: keep TTLs short enough that the worst case is tolerable; use a **delayed second delete** (delete again a few hundred ms after the write); write a version number with the value and only set if the version is newer (a compare-and-set in a Lua script); or drive invalidation from the database change log (**CDC** - e.g. Debezium reading the Postgres WAL or MySQL binlog), so invalidations are ordered exactly like commits and cannot be skipped if the app crashes between "write DB" and "delete cache".',
            },
            {
              type: 'heading',
              text: 'Stampedes, hot keys and cold starts',
            },
            {
              type: 'list',
              items: [
                '**Stampede / dogpile** - a popular key expires; 5,000 concurrent requests all miss and all query the DB. Fixes: request coalescing (single-flight per key, as in the sketch above), serving stale while one request refreshes, **probabilistic early expiration** (each reader refreshes with a probability that rises as expiry approaches), and jittered TTLs so keys written together do not expire together.',
                '**Hot key** - one key (a celebrity profile, a flash-sale item) receives more traffic than a single cache shard can handle. Fixes: an in-process L1 cache with a TTL of a few seconds in every app server (turns N requests into one per server per TTL), replicating the key as `key#0..key#9` and reading a random copy, or pushing it to the CDN.',
                '**Big keys** - a 5 MB value serialized on every request saturates network and blocks single-threaded cache nodes. Store large objects in object storage, cache only IDs or summaries, or split into fields (hashes).',
                '**Cold start** - after a cache cluster restart or a region failover, hit ratio is 0% and the DB sees 10-100x normal load. Fixes: warm the cache from a snapshot or from replayed access logs, ramp traffic gradually, and make sure DB capacity planning includes a "cache is empty" scenario.',
                '**Negative caching** - cache "not found" results (with a short TTL) so that requests for non-existent keys - including malicious enumeration - do not all fall through to the DB. Bloom filters serve the same purpose for very large key spaces.',
              ],
            },
            {
              type: 'heading',
              text: 'Sizing and eviction',
            },
            {
              type: 'p',
              text: 'Estimate the **working set**, not the dataset: if 1B URLs exist but 20% of them get ~80% of traffic in a given day, and each entry is ~500 bytes including overhead, the hot set is 200M × 500 B ≈ 100 GB - a small Redis/Valkey cluster, not a 500 GB one. Eviction is usually LRU or LFU approximations; LFU resists "scan pollution" (a batch job touching every key once) better than LRU. Always set a `maxmemory` policy explicitly - a cache that runs out of memory and starts rejecting writes is a self-inflicted outage.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A cache must never be the only copy of data you cannot lose, unless you deliberately designed it as a durable store (persistence, replication, and an accepted RPO). "We keep sessions/carts only in Redis" is a valid choice only if you have said out loud what happens when that node is lost.',
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
                '**Abuse is a first-class requirement**: shorteners are a favorite tool for phishing and malware links. Scan destinations asynchronously against threat-intelligence lists at creation time and periodically afterward, support takedown (which is another reason to prefer 302 - a 301 cached in browsers cannot be revoked), and rate-limit creation per account/IP.',
              ],
            },
            {
              type: 'heading',
              text: 'ID generation, concretely',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Snowflake-style 64-bit ID -> base62 short code',
              code: `ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
EPOCH_MS = 1_700_000_000_000   # custom epoch keeps the timestamp bits small

# 41 bits timestamp (ms, ~69 years) | 10 bits machine id (1,024 workers) | 12 bits sequence (4,096 ids/ms/worker)
def next_id(now_ms, machine_id, seq):
    return ((now_ms - EPOCH_MS) << 22) | (machine_id << 12) | seq

def base62(n: int) -> str:
    out = []
    while n:
        n, r = divmod(n, 62)
        out.append(ALPHABET[r])
    return "".join(reversed(out)) or "0"

# A full 63-bit Snowflake id encodes to ~11 base62 chars.
# Want 7 chars? Use a smaller counter space: range allocation from a ticket server
# (each app node leases a block of 100,000 ids), then base62-encode; optionally run the
# counter through a reversible bit-permutation so consecutive codes do not look sequential.`,
            },
            {
              type: 'table',
              headers: ['Strategy', 'Code length', 'Coordination', 'Enumerable?', 'Notes'],
              rows: [
                ['Hash(longUrl) truncated', '7 chars', 'None, but collision check on write', 'No', 'Same URL -> same code (dedup for free) unless you salt per user; collision retries grow as the table fills'],
                ['Ticket server / range allocation', '6-7 chars', 'One small range-lease service, hit once per block', 'Yes unless permuted', 'Simple, compact; lost ranges on crash are harmless gaps'],
                ['Snowflake-style', '~11 chars', 'None at request time (machine id assigned once)', 'Partially (time-ordered)', 'Collision-free, but codes are longer; needs clock-skew protection'],
                ['Random 7-char + uniqueness check', '7 chars', 'Conditional insert (put-if-absent)', 'No', 'Clean and unguessable; collision probability rises as the 3.5T space fills, still tiny at billions of rows'],
              ],
            },
            {
              type: 'p',
              text: '**Storage estimate:** 100M new links/month × 12 months × ~500 bytes per row (URL, metadata, index overhead) ≈ 600 GB/year, ~1.8 TB with 3x replication - comfortably within a sharded key-value store, and even within a single large relational instance for the first year or two. Saying this out loud shows you know the storage tier is *not* the hard part of this problem; the redirect read path and hot keys are.',
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
            {
              type: 'heading',
              text: 'Deep dive: the details that separate a senior answer',
            },
            {
              type: 'list',
              items: [
                '**Do not fan out to inactive users.** A large fraction of followers have not opened the app in weeks. Push only to users active in the last N days; for everyone else, build the feed on demand (pull) when they return. This alone can cut fan-out writes dramatically.',
                '**Cap feed length.** Keep only the latest few hundred to ~1,000 post IDs per user in the hot store (a capped list or sorted set trimmed on insert); older pages fall back to a slower pull-based query. Nobody scrolls back 10,000 items, so do not pay to store them in memory.',
                '**Celebrity threshold is a tunable, not a constant.** Pick a follower cutoff (often in the tens to hundreds of thousands) based on measured fan-out cost; at read time, merge the precomputed feed with recent posts from the handful of celebrities the user follows (each cached aggressively because millions of readers request the same few posts).',
                '**Fan-out is a queue, not a loop.** The post service writes the post and emits a `PostCreated` event; fan-out workers consume it, page through the follower list in batches, and write to feed shards. A slow fan-out delays visibility by seconds - acceptable - but must never block the author\'s request.',
                '**Deletes and privacy changes.** Because feeds hold only IDs, deletion is handled at hydration: the hydration step drops posts that are deleted, from blocked users, or no longer visible. Never trust the precomputed feed as an authorization source.',
                '**Pagination with a cursor.** Return an opaque cursor encoding (score or timestamp, post_id) of the last item. With ranked feeds, also snapshot the candidate set per session so that re-ranking between page loads does not duplicate or skip items.',
              ],
            },
            {
              type: 'heading',
              text: 'Ranked feeds: the modern multi-stage pipeline',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Cand["Candidate generation<br/>followed accounts, groups,<br/>recommended / embedding retrieval<br/>~thousands"] --> Light["Lightweight ranker<br/>cheap model, prune to ~hundreds"]\n    Light --> Heavy["Heavy ranker<br/>deep model predicts<br/>P(like), P(reply), P(hide)..."]\n    Heavy --> Rules["Re-rank and filter<br/>diversity, dedup, safety,<br/>ads insertion, freshness"]\n    Rules --> Out["Final page<br/>~20-50 items"]\n    Feat[("Feature store<br/>user + post + author features")] --> Light\n    Feat --> Heavy',
            },
            {
              type: 'p',
              text: 'Most large feeds are no longer pure follow graphs: a significant share of items come from recommendation (accounts you do not follow), retrieved via embeddings and approximate nearest-neighbor search. The architecture consequence is a **funnel**: cheap stages process many candidates, expensive model inference runs only on the survivors, and the whole thing must fit a latency budget of a few hundred milliseconds. If you go down this path in an interview, name the budget per stage, the feature store that feeds the models (with online/offline consistency), and the fallback when the ranking service is slow - serve reverse-chronological from the precomputed feed rather than an error.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewer probe: "A user with 50M followers posts. Walk me through what happens in the next 5 seconds." Strong answer: the post is written once to the posts store and its cache; no fan-out happens (celebrity path); followers who open the app in the next seconds merge the celebrity\'s recent posts at read time; the post itself becomes a hot key, so it sits in in-process caches and the CDN for media; like/reply counters are sharded and updated asynchronously.',
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
              type: 'p',
              text: 'The architecture diagram above shows what the pieces are; the sequence below shows what actually happens, in order, for two of the cases that matter most: the recipient is online (delivered straight through), and the recipient is offline (durably stored, then synced on reconnect).',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Sender\n    participant GWSender as Sender\'s Gateway\n    participant MsgSvc as Message Service\n    participant Store as Message Store\n    participant GWRecipient as Recipient\'s Gateway\n    participant Recipient\n\n    Sender->>GWSender: send message (conversation_id, body)\n    GWSender->>MsgSvc: forward\n    MsgSvc->>Store: persist message, assign per-conversation seq number\n    Store-->>MsgSvc: ack\n    MsgSvc-->>GWSender: ack (message durably stored)\n    GWSender-->>Sender: delivery receipt: sent\n\n    alt recipient currently online\n        MsgSvc->>GWRecipient: push message (found via user_id -> gateway map)\n        GWRecipient->>Recipient: deliver over open WebSocket\n        Recipient-->>GWRecipient: ack\n        GWRecipient-->>MsgSvc: delivered\n        MsgSvc-->>GWSender: delivery receipt: delivered\n    else recipient offline\n        Note over MsgSvc,Store: message already durably stored above - nothing extra to do now\n        MsgSvc->>Recipient: push notification (APNs/FCM) as a hint to open the app\n        Recipient->>MsgSvc: reconnects later, requests sync since last seq number\n        MsgSvc->>Store: fetch messages after last acked seq\n        Store-->>MsgSvc: missed messages\n        MsgSvc-->>Recipient: deliver missed messages in order\n    end',
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
            {
              type: 'heading',
              text: 'Estimation that shapes the design',
            },
            {
              type: 'list',
              items: [
                '500M DAU × 40 messages sent/day = 20B messages/day → ~230K messages/sec average, ~0.5-1M/sec at peak.',
                'At ~200 bytes per message plus metadata (~300 B stored), that is ~6 TB/day, ~2 PB/year before replication - a write-heavy, append-only, time-ordered workload, the textbook fit for a wide-column / LSM-tree store (Cassandra, ScyllaDB, HBase) partitioned by `conversation_id` with messages clustered by sequence number.',
                'If ~30% of DAU are connected at peak, that is ~150M concurrent WebSocket connections. At ~100K-500K connections per tuned gateway node, you need hundreds to low thousands of gateway nodes - which is why the connection layer is its own tier and why gateway deploys must drain connections gradually instead of dropping millions at once.',
              ],
            },
            {
              type: 'code',
              language: 'sql',
              title: 'message store (CQL-style), bucketed so huge conversations do not create giant partitions',
              code: `CREATE TABLE messages (
  conversation_id  bigint,
  bucket           int,          -- e.g. seq / 10000, or month: caps partition size
  seq              bigint,       -- per-conversation, assigned by the owning message server
  message_id       uuid,         -- client-generated, used for idempotent retries / dedup
  sender_id        bigint,
  body             blob,         -- ciphertext if end-to-end encrypted
  sent_at          timestamp,
  PRIMARY KEY ((conversation_id, bucket), seq)
) WITH CLUSTERING ORDER BY (seq DESC);

-- per user per device: how far each device has synced
CREATE TABLE device_cursor (
  user_id bigint, device_id text, conversation_id bigint, last_acked_seq bigint,
  PRIMARY KEY ((user_id, device_id), conversation_id)
);`,
            },
            {
              type: 'heading',
              text: 'Deep-dive topics interviewers push on',
            },
            {
              type: 'list',
              items: [
                '**Who assigns the sequence number?** Route all writes for a conversation to one owner (partition the message service by `conversation_id`), which assigns `seq` with an in-memory counter persisted with the message. Two servers incrementing the same counter concurrently is how you get duplicate or out-of-order sequence numbers.',
                '**Idempotent send.** The client generates `message_id` before sending and retries with the same id after a timeout; the server dedups on it. Without this, a flaky mobile network produces duplicated messages.',
                '**Multi-device.** Delivery state is per device, not per user: each device keeps its own `last_acked_seq` cursor and syncs from there. "Read" status is per user and syncs across devices as a small event.',
                '**Large groups.** Fan-out of a message to a 100K-member channel cannot be a synchronous loop. Store the message once; fan out a lightweight "new message in channel X up to seq N" notification only to online members (or let clients pull on open), and do not send push notifications to every member.',
                '**End-to-end encryption.** With E2EE (Signal protocol style), the server stores and routes ciphertext it cannot read - so server-side search, spam scanning on content, and server-rendered previews are off the table, and group messaging requires per-device key distribution. Name this as a requirement-driven constraint, not a footnote.',
                '**Presence at scale.** Presence for a user with 5,000 contacts must not fan out on every connect/disconnect. Use heartbeats with a timeout, debounce flapping mobile connections, and have clients subscribe to presence only for conversations currently on screen.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewer probe: "A gateway node crashes with 300K connected users. What happens?" Clients detect the dropped socket, reconnect with jittered backoff (otherwise 300K simultaneous reconnects become a self-inflicted thundering herd), land on another gateway, update the `user_id -> gateway` mapping, and sync from their last acked sequence number. No message is lost because nothing was ever held only in gateway memory.',
            },
          ],
        },
        {
          id: 'ride-sharing',
          title: 'Case Study: Ride-Sharing Dispatch',
          summary:
            'Tests geospatial indexing and real-time matching under tight latency budgets — and how consistency requirements can vary wildly between components of the same system.',
          keyPoints: [
            'Geospatial cells (quadtree, geohash, S2 cells, H3 hexagons) turn "find drivers within 2km" into a lookup of a handful of cells instead of scanning every driver.',
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
                '**Geospatial indexing**: divide the map into cells (quadtree, geohash, Google\'s S2 cells, or Uber\'s open-source hexagonal **H3** grid) so "find drivers within 2km" is a lookup of a handful of cells instead of scanning every driver — Redis\'s `GEOADD`/`GEOSEARCH` (geohash-encoded sorted sets; the older `GEORADIUS` is deprecated) implements a version of this out of the box for moderate scale; at very large scale, custom services keep sharded in-memory indexes keyed by cell id. Hexagons are popular because every neighbor is equidistant from the center, which makes "ring of neighboring cells" searches and supply/demand heatmaps cleaner than with squares.',
                '**Location update volume dominates the system**: millions of drivers pinging every few seconds is itself a massive write-heavy stream — this typically flows through a queue (Kafka) rather than hitting the index synchronously per ping, with the index updated from consumers.',
                '**Matching is a race against time**: must return a match in ~1-2 seconds; the matching service queries the geo-index for nearby drivers, filters by availability/vehicle type, ranks by ETA (not just raw distance — traffic matters), and offers to the top candidate with a short accept-timeout before moving to the next.',
                '**Surge pricing** is computed from the same real-time supply (available drivers in a cell) vs demand (open ride requests in a cell) signal, recalculated on a short interval (e.g., every 1-5 minutes) per geo-cell, not globally.',
                '**Consistency needs vary wildly by component**: driver location can be a few seconds stale (eventual consistency is fine — the driver is still moving anyway), but "has this ride offer already been accepted by another rider/driver" must be strongly consistent (a distributed lock or a single-writer-per-offer pattern) to avoid double-booking the same driver.',
              ],
            },
            {
              type: 'heading',
              text: 'Estimation',
            },
            {
              type: 'p',
              text: 'Assume 5M drivers online at peak, each sending a location every 4 seconds → **~1.25M location writes/sec**. Each update is ~100 bytes, so ~125 MB/s of ingest - trivial for a log like Kafka, but far too much to persist every point into a relational table synchronously. The *current* position of each driver is tiny (5M × ~100 B ≈ 500 MB) and fits in memory on a handful of nodes; the *history* (for trip receipts, ETA model training, fraud) goes to cheap append-only storage. Splitting "latest location" (hot, in-memory, overwritten) from "location history" (cold, append-only) is the key data-modeling insight.',
            },
            {
              type: 'heading',
              text: 'Preventing double assignment',
            },
            {
              type: 'code',
              language: 'sql',
              title: 'claim a driver with a conditional write (optimistic concurrency)',
              code: `-- Driver row carries a status and a version. The matcher only wins if the driver is still free.
UPDATE drivers
   SET status = 'OFFERED', offer_id = :offer_id, offer_expires_at = now() + interval '15 seconds',
       version = version + 1
 WHERE driver_id = :driver_id
   AND status = 'AVAILABLE'
   AND version = :expected_version;
-- 1 row updated  -> this matcher owns the offer; push it to the driver
-- 0 rows updated -> someone else claimed the driver; try the next candidate

-- Driver accepts: transition OFFERED -> ON_TRIP only if the offer is still ours and unexpired
UPDATE drivers SET status = 'ON_TRIP'
 WHERE driver_id = :driver_id AND offer_id = :offer_id AND offer_expires_at > now();`,
            },
            {
              type: 'p',
              text: 'The same idea works in a key-value store with a conditional put (e.g. DynamoDB condition expressions) or a Redis `SET key value NX PX 15000` lease. The important property is that the claim is a single atomic compare-and-set on one record, so no distributed lock service is needed, and the offer expires on its own if the driver never responds.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewer probes: "How do you handle a city-wide spike after a concert?" (surge pricing to rebalance supply, batch matching over a short window instead of greedy first-come matching, which yields better global assignments). "What if a whole region\'s location service fails?" (drivers buffer pings locally, matching degrades to a wider radius from slightly stale positions, trips in progress continue because the trip service does not depend on live location to complete).',
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
            {
              type: 'heading',
              text: 'The upload path in detail',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Client asks the Upload Service for an upload session; the service returns **pre-signed URLs** for a multipart, resumable upload directly to object storage. Video bytes never flow through your application servers.',
                'Client uploads parts in parallel and retries individual failed parts; on completion, object storage emits an event (or the client calls "complete").',
                'A workflow orchestrator (a durable workflow engine or a DAG of queue-driven steps) runs: validate/probe → split into segments (e.g. a few seconds each, on keyframes) → transcode segments **in parallel** across many workers → package into HLS/DASH (commonly CMAF so one set of segments serves both) → generate thumbnails, captions, content-safety checks → write manifests → mark the video "ready" in metadata.',
                'Each step is idempotent and checkpointed, so a crashed worker only redoes one segment, not the whole two-hour film.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Raw["Raw upload in object storage"] --> Split["Split on keyframes<br/>into N chunks"]\n    Split --> T1["Transcode chunk 1<br/>x renditions"]\n    Split --> T2["Transcode chunk 2<br/>x renditions"]\n    Split --> TN["Transcode chunk N<br/>x renditions"]\n    T1 --> Pkg["Package HLS / DASH<br/>CMAF segments + manifests"]\n    T2 --> Pkg\n    TN --> Pkg\n    Pkg --> Ready["Mark ready in metadata DB<br/>warm CDN for popular creators"]',
            },
            {
              type: 'heading',
              text: 'Codecs and encoding choices (the cost lever)',
            },
            {
              type: 'table',
              headers: ['Choice', 'Why it matters'],
              rows: [
                ['H.264/AVC', 'Plays everywhere; the compatibility baseline, but the least bandwidth-efficient'],
                ['HEVC, VP9, AV1', 'Substantially fewer bits for the same quality (AV1 is the most efficient of these and royalty-free), but far more expensive to encode and not decoded in hardware on every device - so platforms encode popular titles in newer codecs and keep H.264 as the fallback'],
                ['Per-title / per-scene encoding', 'Choose the bitrate ladder per video based on its complexity; a static lecture needs far fewer bits than a sports match'],
                ['Low-latency HLS / DASH', 'Partial segments and chunked transfer bring live-stream latency down from tens of seconds to a few seconds, at the cost of more requests and tighter CDN tuning'],
              ],
            },
            {
              type: 'p',
              text: '**Estimation:** 500 hours of video uploaded per minute × ~1 GB per hour of source ≈ 30 TB/hour of raw ingest; after transcoding into ~6 renditions the stored output is often comparable to or larger than the source. On the read side, 1B hours watched/day at an average ~3 Mbps ≈ 1.35 GB per viewer-hour × 1B ≈ ~1.35 EB of egress per day. You do not need the exact figure - the point of the exercise is that egress dominates cost, so CDN hit ratio, codec efficiency, and ISP-embedded caches (appliances placed inside ISP networks) are first-order design decisions, not optimizations.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewer probe: "How does the player decide which quality to fetch?" The player downloads a manifest listing renditions, measures throughput and buffer level, and picks the rendition for each next segment (buffer-based and throughput-based ABR algorithms). The server side stays dumb and cacheable - all adaptation logic lives in the client, which is exactly why the CDN can serve it.',
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
            {
              type: 'heading',
              text: 'The consistency spectrum (more precise than "strong vs eventual")',
            },
            {
              type: 'table',
              headers: ['Model', 'Guarantee', 'Cost', 'Where you would use it'],
              rows: [
                ['Linearizable (strong)', 'Every read sees the latest completed write; the system behaves like a single copy', 'Coordination on every write (and often every read); cross-region latency', 'Leader election, locks, account balances, uniqueness (usernames), seat inventory'],
                ['Serializable (transactions)', 'Concurrent transactions produce a result equal to some serial order', 'Locking or abort/retry under contention', 'Multi-row invariants: transfers, booking with constraints'],
                ['Causal', 'If A could have influenced B, everyone sees A before B; unrelated writes may be seen in any order', 'Tracking causal metadata', 'Comments and replies, collaborative apps'],
                ['Read-your-writes / monotonic reads', 'A user always sees their own writes and never goes back in time', 'Session stickiness or log-position tracking', 'Profile edits, settings, "I just posted it, where is it?"'],
                ['Eventual', 'Replicas converge if writes stop; reads may be stale', 'Cheapest; lowest latency; highest availability', 'Like counts, view counts, feeds, search index, recommendations'],
              ],
            },
            {
              type: 'p',
              text: 'Two modern developments are worth knowing because they shift the old tradeoffs. First, **globally consistent SQL databases** (Spanner, CockroachDB, YugabyteDB, Aurora DSQL and similar) offer serializable transactions across regions using consensus plus carefully bounded clock uncertainty - you still pay cross-region round trips on writes, but you no longer have to build conflict resolution yourself. Second, mainstream key-value stores have added opt-in strong modes - for example DynamoDB global tables can be created with **multi-Region strong consistency** (generally available since mid-2025), where writes synchronously replicate to another region before acknowledging. PACELC still holds: the strong mode is a deliberate latency-for-consistency trade, chosen per table.',
            },
            {
              type: 'heading',
              text: 'Isolation anomalies interviewers like to probe',
            },
            {
              type: 'list',
              items: [
                '**Lost update** - two requests read stock = 5, both write stock = 4; one sale disappears. Fix: atomic `UPDATE ... SET stock = stock - 1 WHERE stock > 0`, `SELECT ... FOR UPDATE`, or optimistic concurrency with a version column.',
                '**Write skew** - two on-call doctors each check "is someone else on call?", both see yes, both go off call. Each wrote a different row, so row locks did not help. Fix: serializable isolation, or materialize the constraint into a single row you can lock.',
                '**Read skew / non-repeatable read** - a report reads account A before a transfer and account B after it, and money appears to vanish. Fix: snapshot isolation (repeatable read) for read-only reports.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '"We will use a distributed lock in Redis" is not a correctness guarantee on its own: a process can pause (GC, VM migration) past its lease, wake up, and write while another holder owns the lock. For correctness-critical locks, pair the lease with a **fencing token** (a monotonically increasing number the storage layer checks and rejects if stale), or push the invariant into the database itself with a conditional write or unique constraint.',
            },
          ],
        },
        {
          id: 'event-driven-patterns',
          title: 'Queues, Event Streams, Outbox & Sagas',
          summary:
            'Asynchronous messaging is how large systems decouple, absorb spikes, and coordinate multi-service workflows - and it is also where duplicates, reordering, lost events and partial failures come from. This topic covers the patterns that make async designs correct.',
          keyPoints: [
            'A queue distributes work items to competing consumers; a log/stream retains an ordered, replayable history that many independent consumer groups read at their own pace.',
            'Ordering in a partitioned log is per partition only - choose the partition key so that events which must stay ordered (same order, same account) land on the same partition.',
            'The dual-write problem (write DB, then publish event) loses or invents events on crashes; the transactional outbox or change data capture fixes it.',
            'A saga replaces a distributed transaction with a sequence of local transactions plus compensating actions; it gives you eventual, not atomic, consistency.',
            'Every consumer must be idempotent, because every practical broker delivers at least once in some failure scenario.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Queue vs log, precisely',
            },
            {
              type: 'table',
              headers: ['Dimension', 'Work queue (SQS, RabbitMQ, Kafka share groups)', 'Partitioned log (Kafka, Kinesis, Pulsar, Redpanda)'],
              rows: [
                ['Consumption model', 'Competing consumers; each message handled by one worker, then acknowledged and removed', 'Consumer groups track an offset per partition; many groups read the same data independently'],
                ['Retention', 'Until acknowledged (plus a max retention)', 'Time- or size-based (days, or indefinitely with tiered storage); replayable'],
                ['Ordering', 'Usually best-effort; FIFO variants exist with throughput limits', 'Strict within a partition, none across partitions'],
                ['Scaling consumers', 'Add workers freely', 'Parallelism capped by partition count for classic consumer groups'],
                ['Per-message retry / DLQ', 'Native: visibility timeout, redelivery count, dead-letter queue', 'Not native to classic consumers: a poison message blocks its partition unless you build retry topics'],
                ['Best for', 'Background jobs, task distribution, per-item retries', 'Event sourcing, CDC, analytics, fan-out of the same events to many services, replay'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The line between the two has blurred: Apache Kafka now supports queue-style **share groups** (KIP-932 "Queues for Kafka"; production-ready as of Kafka 4.2), where consumers cooperatively process records from the same partitions with per-record acknowledgement and delivery counts, so parallelism is no longer capped by partition count. Kafka 4.x also runs only in KRaft mode - ZooKeeper is gone. In an interview, describe the *semantics* you need (competing consumers vs replayable fan-out) and then name a product.',
            },
            {
              type: 'heading',
              text: 'The dual-write problem and the transactional outbox',
            },
            {
              type: 'p',
              text: 'An order service that does `INSERT order` and then `publish(OrderCreated)` has two failure windows: crash after the insert and the event is never published (downstream never ships the order); publish first and crash before the insert and you have announced an order that does not exist. Wrapping both in a distributed transaction (2PC) across a database and a broker is slow, fragile, and often unsupported. The **transactional outbox** writes the event into an `outbox` table *in the same local transaction* as the business row; a relay process (polling the table, or CDC reading the database log) publishes outbox rows to the broker and marks them sent. Publishing becomes at-least-once, which consumers handle with idempotency.',
            },
            {
              type: 'code',
              language: 'sql',
              title: 'transactional outbox',
              code: `BEGIN;
  INSERT INTO orders (id, user_id, total, status)
       VALUES ('o_789', 'u_123', 41.98, 'PENDING');
  INSERT INTO outbox (id, aggregate_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), 'o_789', 'OrderCreated', '{"orderId":"o_789","total":41.98}', now());
COMMIT;   -- both rows or neither: no lost or phantom events

-- Relay (or Debezium-style CDC on the WAL) publishes rows in order, then marks/deletes them.
-- Consumer side: dedup table keyed by event id, written in the same transaction as the effect.
INSERT INTO processed_events (event_id) VALUES (:event_id)
  ON CONFLICT DO NOTHING;   -- 0 rows inserted -> already handled, skip`,
            },
            {
              type: 'heading',
              text: 'Sagas: choreography vs orchestration',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant O as Order Saga Orchestrator\n    participant Pay as Payment Service\n    participant Inv as Inventory Service\n    participant Ship as Shipping Service\n    O->>Pay: authorize payment\n    Pay-->>O: authorized\n    O->>Inv: reserve items\n    Inv-->>O: reserved\n    O->>Ship: create shipment\n    Ship-->>O: FAILED (address invalid)\n    Note over O: compensate in reverse order\n    O->>Inv: release reservation\n    O->>Pay: void authorization\n    O-->>O: mark order CANCELLED',
            },
            {
              type: 'table',
              headers: ['Style', 'How it works', 'Pros', 'Cons'],
              rows: [
                ['Choreography', 'Each service reacts to events and emits its own (OrderCreated -> PaymentAuthorized -> ItemsReserved...)', 'No central coordinator; loose coupling', 'Workflow logic is scattered; hard to see or change the overall flow; cyclic dependencies creep in'],
                ['Orchestration', 'A central orchestrator (often a durable workflow engine such as Temporal, AWS Step Functions, or a state machine you persist) issues commands and tracks state', 'The flow is explicit, testable, observable; timeouts and compensations live in one place', 'The orchestrator is another critical component; risk of it becoming a "god service"'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Compensations are business actions, not rollbacks** - you cannot un-send an email; you send a correction. Design each step with its compensation (authorize/void, reserve/release) from the start.',
                '**Use semantic locks / pending states** - an order in `PENDING` is visible to other operations as "not final", which prevents acting on data the saga may still compensate.',
                '**Prefer reservations and authorizations over immediate side effects** - authorize a card and capture later; reserve inventory with a TTL and confirm later. Reversible steps make compensation cheap.',
              ],
            },
            {
              type: 'heading',
              text: 'Operating async systems',
            },
            {
              type: 'list',
              items: [
                '**Consumer lag** (how far behind the head a consumer group is) is the key health metric; alert on lag *growth*, not just absolute value.',
                '**Poison messages** go to a dead-letter queue after N attempts, with alerting and a replay tool - otherwise one malformed event blocks a partition forever.',
                '**Schema evolution** - events outlive the code that produced them. Use a schema registry and backward-compatible changes (add optional fields; never repurpose a field).',
                '**Ordering vs parallelism** - partition by the entity whose order matters (`account_id`), and accept that unrelated entities are processed in parallel and out of order relative to each other.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewer probe: "Kafka has exactly-once semantics, so why do I need idempotent consumers?" Kafka transactions give exactly-once for read-process-write *within Kafka* (consume from a topic, produce to another, commit offsets atomically). The moment your consumer has an external side effect - writing to Postgres, calling a payment provider, sending an email - you are back to at-least-once and need idempotency at the side effect.',
            },
          ],
        },
        {
          id: 'payment-system',
          title: 'Case Study: Payment System & Ledger',
          summary:
            'The canonical "correctness over everything" design: idempotent APIs, a double-entry ledger as the source of truth, an explicit payment state machine, asynchronous integration with external processors, and daily reconciliation to catch what everything else missed.',
          keyPoints: [
            'Money movement is modeled as an append-only, double-entry ledger: every transaction posts balanced debits and credits, and balances are derived, never edited in place.',
            'Every mutating API takes an idempotency key; a retried request returns the stored result instead of charging twice.',
            'Payments are a state machine (created -> authorized -> captured -> settled / refunded / failed) with transitions applied via conditional writes.',
            'External processors are slow, flaky and asynchronous - use timeouts, retries with the same idempotency key toward the provider, webhooks, and an "unknown" state that is resolved by querying status.',
            'Reconciliation against processor and bank settlement files is mandatory; it is how real systems detect bugs, missed webhooks, and fraud.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**Functional:** accept payments for orders, refunds, payouts to merchants/sellers, balance and transaction history. **Non-functional:** never double-charge, never lose a payment, full auditability, strong consistency for balances, availability matters but correctness wins any conflict. Throughput is usually modest compared to social systems - even 10,000 payments/sec at peak is achievable on a well-partitioned relational store - so the interview is about correctness under failure, not raw scale.',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Client["Checkout client"] -->|"POST /payments<br/>Idempotency-Key"| API["Payment API"]\n    API --> Idem[("Idempotency store")]\n    API --> PS["Payment Service<br/>state machine"]\n    PS --> PDB[("Payments DB")]\n    PS -->|"authorize / capture"| PSP["External processor (PSP)"]\n    PSP -->|webhook| WH["Webhook handler"]\n    WH --> PS\n    PS -->|outbox events| Bus[["Event log"]]\n    Bus --> Ledger["Ledger Service<br/>double-entry, append-only"]\n    Ledger --> LDB[("Ledger DB")]\n    Recon["Daily reconciliation"] --> LDB\n    Recon --> Files["PSP / bank settlement files"]',
            },
            {
              type: 'heading',
              text: 'Idempotency done properly',
            },
            {
              type: 'code',
              language: 'text',
              title: 'idempotent request handling',
              code: `POST /v1/payments
Idempotency-Key: 7f3c...-checkout-o_789        (client generates once per logical attempt)
{ "orderId": "o_789", "amount": 4198, "currency": "USD", "method": "pm_abc" }

Server:
1. INSERT INTO idempotency (key, request_hash, status) VALUES (:key, :hash, 'IN_PROGRESS')
     -> unique violation? load the row:
          status = COMPLETED  -> return the stored response (same status code + body)
          status = IN_PROGRESS -> 409 / retry-after (a concurrent duplicate is running)
          request_hash differs -> 422 (same key reused for a different request: client bug)
2. Execute the payment, calling the PSP with a provider-side idempotency key derived from ours
3. UPDATE idempotency SET status='COMPLETED', response=:resp WHERE key=:key
Keys expire after a retention window (e.g. 24h-7d) long enough to cover client retries.`,
            },
            {
              type: 'heading',
              text: 'Double-entry ledger',
            },
            {
              type: 'code',
              language: 'sql',
              title: 'ledger schema and a balanced posting',
              code: `CREATE TABLE ledger_entries (
  entry_id        bigint PRIMARY KEY,
  transaction_id  uuid      NOT NULL,      -- groups the legs of one posting
  account_id      bigint    NOT NULL,      -- customer, merchant, fees, processor clearing...
  direction       char(1)   NOT NULL CHECK (direction IN ('D','C')),
  amount_minor    bigint    NOT NULL CHECK (amount_minor > 0),   -- integer minor units, never floats
  currency        char(3)   NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
-- Invariant enforced per transaction_id: SUM(debits) = SUM(credits). Rows are never updated or deleted;
-- a refund is a new, reversing transaction.

-- Capture of a $41.98 payment with a $1.50 fee:
-- D processor_clearing 4198 | C merchant_payable 4048 | C platform_fee_revenue 150`,
            },
            {
              type: 'list',
              items: [
                '**Balances are derived** from entries (with periodic snapshots/materialized balances for speed). Because history is immutable, you can always answer "why is this balance what it is?" - auditors require exactly this.',
                '**Hot accounts** (the platform\'s fee account touched by every payment) become contention points. Split them into N sub-accounts and sum them for reporting, or batch postings to them.',
                '**Store money as integer minor units plus currency**, never floating point. Currency conversion is its own posting with an explicit FX rate recorded.',
              ],
            },
            {
              type: 'heading',
              text: 'The payment state machine and the "unknown" outcome',
            },
            {
              type: 'mermaid',
              code: 'stateDiagram-v2\n    [*] --> CREATED\n    CREATED --> AUTHORIZING\n    AUTHORIZING --> AUTHORIZED: PSP approved\n    AUTHORIZING --> FAILED: PSP declined\n    AUTHORIZING --> UNKNOWN: timeout\n    UNKNOWN --> AUTHORIZED: status query / webhook\n    UNKNOWN --> FAILED: status query / webhook\n    AUTHORIZED --> CAPTURED: capture\n    AUTHORIZED --> VOIDED: cancel\n    CAPTURED --> REFUNDED: refund\n    CAPTURED --> SETTLED: settlement file\n    FAILED --> [*]\n    SETTLED --> [*]',
            },
            {
              type: 'p',
              text: 'The hardest case is a **timeout to the processor**: you do not know whether the card was charged. Never blindly retry with a new request (double charge) and never mark it failed (lost money). Move it to `UNKNOWN`, retry with the *same* provider idempotency key or query the processor\'s status API, and accept the webhook as an additional signal. Every transition is a conditional update (`WHERE status = :expected`) so a late webhook and a status poller racing each other cannot both apply.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Reconciliation is not optional. Every day, compare your ledger against the processor\'s settlement reports and bank statements, line by line. Mismatches (missing webhooks, partial captures, currency rounding, chargebacks) go to an exceptions queue. Interviewers specifically listen for this - it is the difference between a design that is correct on paper and one that is correct in production.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Keep raw card data out of your systems entirely: use the processor\'s hosted fields or tokenization so only tokens reach your servers. This shrinks PCI DSS scope dramatically and is the expected answer to "how do you store card numbers?" - you do not.',
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
            {
              type: 'heading',
              text: 'Algorithm choice in one table',
            },
            {
              type: 'table',
              headers: ['Algorithm', 'State per key', 'Burst behavior', 'Notes'],
              rows: [
                ['Fixed window counter', '1 counter', 'Allows up to 2x the limit across a window boundary', 'Simplest; fine for coarse daily quotas'],
                ['Sliding window log', 'Every timestamp in the window', 'Exact', 'Memory grows with the limit; too expensive for high limits'],
                ['Sliding window counter', '2 counters', 'Close approximation, smooths boundary bursts', 'Weights the previous window by overlap; a common production choice'],
                ['Token bucket', 'Tokens + last refill time', 'Allows bursts up to bucket size, then a steady rate', 'Most common for APIs; two intuitive knobs (rate, burst)'],
                ['Leaky bucket / GCRA', '1 timestamp', 'Smooths output to a constant rate', 'GCRA is a compact, exact token-bucket equivalent'],
              ],
            },
            {
              type: 'code',
              language: 'text',
              title: 'token bucket as one atomic Redis Lua script (sketch)',
              code: `-- KEYS[1] = bucket key, ARGV = capacity, refill_per_sec, now_ms, cost
local b = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local cap, rate, now, cost = tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3]), tonumber(ARGV[4])
local tokens = tonumber(b[1]) or cap
local ts     = tonumber(b[2]) or now
tokens = math.min(cap, tokens + (now - ts) / 1000 * rate)      -- refill lazily, no background job
local allowed = tokens >= cost
if allowed then tokens = tokens - cost end
redis.call('HSET', KEYS[1], 'tokens', tokens, 'ts', now)
redis.call('PEXPIRE', KEYS[1], math.ceil(cap / rate * 1000) * 2)   -- idle buckets disappear
return allowed and 1 or 0`,
            },
            {
              type: 'heading',
              text: 'Scaling past one Redis round trip per request',
            },
            {
              type: 'list',
              items: [
                '**Layered limits**: coarse per-IP limits at the CDN/WAF edge (absorbs abuse and DDoS cheaply), per-API-key/tenant quotas at the gateway, and fine-grained per-endpoint or per-resource limits in the service.',
                '**Local token pre-allocation**: each server leases a batch of tokens (e.g. 10% of the limit) from the central store and spends them locally, refreshing asynchronously. Trades a little accuracy for far fewer remote calls.',
                '**Shard by limit key** in a Redis/Valkey cluster so each key\'s counter lives on one node and the Lua script stays single-shard (all keys in one script must hash to the same slot).',
                '**Multi-region**: either enforce limits per region (simple, allows N x the global limit in the worst case) or sync counters asynchronously across regions and accept brief overshoot - exact global limits require cross-region coordination on every request, which is rarely worth it.',
                '**Tell the client**: return `429 Too Many Requests` with `Retry-After` and remaining-quota headers so well-behaved clients back off instead of hammering.',
                '**Cost-based limits**: for expensive endpoints (search, LLM inference), charge each request by cost (e.g. tokens or compute units), not by count.',
              ],
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
            {
              type: 'heading',
              text: 'SLOs, error budgets and availability math',
            },
            {
              type: 'table',
              headers: ['Availability target', 'Allowed downtime per 30 days', 'What it implies architecturally'],
              rows: [
                ['99.9%', '~43 minutes', 'Single region, multi-AZ, automated failover, careful deploys'],
                ['99.95%', '~22 minutes', 'Fast automated failover; no manual steps on the critical path'],
                ['99.99%', '~4.3 minutes', 'Humans cannot react in time - detection and failover must be automatic; often multi-region or cell-based'],
                ['99.999%', '~26 seconds', 'Active-active across regions, extreme change discipline; very few systems truly need it'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Serial dependencies multiply**: a request that synchronously needs five services, each 99.9% available, is at most ~99.5% available. Every synchronous hop you add lowers the ceiling; async decoupling and graceful fallbacks raise it.',
                '**Redundancy adds**: two independent replicas at 99% each give ~99.99% for "at least one is up" - *if* failures are independent. Shared dependencies (same deploy, same config push, same region) break that independence, and are the cause of most large outages.',
                '**SLO and error budget**: an SLO such as "99.9% of redirects succeed under 200 ms over 30 days" leaves a 0.1% error budget. When the budget is burning fast, freeze risky launches; alert on **burn rate** (how quickly the budget is being consumed) rather than on raw thresholds, which cuts noisy pages.',
              ],
            },
            {
              type: 'heading',
              text: 'Retries done safely',
            },
            {
              type: 'code',
              language: 'python',
              title: 'capped exponential backoff with full jitter and a retry budget',
              code: `import random, time

def call_with_retries(fn, max_attempts=3, base=0.1, cap=2.0, budget=None):
    for attempt in range(max_attempts):
        try:
            return fn(timeout=0.3)                     # always a deadline, never unbounded
        except RetryableError:
            if attempt == max_attempts - 1:
                raise
            if budget and not budget.try_spend():      # e.g. retries <= 10% of requests
                raise                                  # stop retry storms amplifying an outage
            time.sleep(random.uniform(0, min(cap, base * 2 ** attempt)))   # full jitter`,
            },
            {
              type: 'p',
              text: 'Retries at every layer multiply: three layers each retrying three times turn one user request into up to 27 calls on the struggling bottom service. Retry at one layer (usually closest to the client or at the mesh), retry only idempotent operations, propagate deadlines downstream so work for a caller that already gave up is abandoned, and cap retries with a budget. Pair this with **load shedding** - reject excess requests early and cheaply (prioritizing critical traffic, e.g. checkout over recommendations) instead of letting queues grow until every request times out.',
            },
            {
              type: 'heading',
              text: 'Disaster recovery and multi-region',
            },
            {
              type: 'table',
              headers: ['Strategy', 'RPO (data loss)', 'RTO (time to recover)', 'Cost / complexity'],
              rows: [
                ['Backup and restore', 'Hours (last backup)', 'Hours to a day', 'Low'],
                ['Pilot light (data replicated, minimal compute in standby region)', 'Seconds to minutes', 'Tens of minutes', 'Moderate'],
                ['Warm standby (scaled-down full stack running)', 'Seconds', 'Minutes', 'Higher'],
                ['Active-active (all regions serve traffic)', 'Near zero (sync) to seconds (async)', 'Near zero - shift traffic', 'Highest: conflict handling, data residency, double capacity'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Cell-based architecture** - instead of one giant deployment, run many identical, independent "cells", each serving a slice of users/tenants with its own databases and queues, behind a thin routing layer. A bad deploy or poison request takes out one cell (a few percent of users), not everyone. Large cloud providers and SaaS companies use this to bound blast radius.',
                '**Static stability** - the system keeps working in the face of a failure *without* needing to make changes (e.g. pre-provisioned capacity in other zones rather than relying on autoscaling during the outage, which may itself depend on the failed control plane).',
                '**Practice failover** - a DR plan that has never been exercised does not exist. Game days and chaos experiments in production-like environments are how teams find the hidden single points of failure (DNS, secrets, a config service, a single-region identity provider).',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interviewer probe: "What would page you for this system?" Name 3-4 SLO-based alerts tied to user experience (error rate and p99 latency on the main path, freshness lag for async pipelines, queue consumer lag) plus a couple of saturation signals (DB CPU/connections, cache memory). Then say what the runbook does first - shed load, fail over, roll back the last deploy - because most incidents are caused by changes.',
            },
          ],
        },
        {
          id: 'llm-system-design',
          title: 'Designing LLM-Powered Systems (RAG, Inference & Agents)',
          summary:
            'GenAI features now appear in HLD loops as "design a support chatbot over our docs" or "design an LLM gateway." The fundamentals still apply, but the cost model, latency profile, and failure modes are different: tokens and GPUs replace requests and CPUs.',
          keyPoints: [
            'LLM inference is GPU-bound and priced per token; capacity planning is in tokens/sec, and latency splits into time-to-first-token (prefill) and per-token generation speed (decode).',
            'Retrieval-augmented generation (RAG) grounds answers in your data: ingest and chunk documents, embed them, retrieve relevant chunks (vector plus keyword search), re-rank, then prompt the model with citations.',
            'Stream responses token by token (SSE or WebSockets) so perceived latency is the time to first token, not the full generation.',
            'An LLM gateway centralizes provider routing, fallbacks, token-based rate limits and budgets, caching, logging, and safety filters.',
            'Evaluation and guardrails are part of the architecture: offline eval sets, online feedback, prompt-injection defenses, and permission-aware retrieval.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Reference architecture: RAG assistant',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    subgraph Ingest["Offline / async ingestion"]\n        Src["Docs, tickets, wiki"] --> Parse["Parse + chunk"]\n        Parse --> Emb["Embedding model"]\n        Emb --> VDB[("Vector index + keyword index<br/>with ACL metadata")]\n    end\n    subgraph Serve["Online request path"]\n        U["User"] --> GW["API / LLM gateway<br/>auth, quotas, streaming"]\n        GW --> Ret["Retriever<br/>hybrid search + ACL filter"]\n        Ret --> VDB\n        Ret --> RR["Re-ranker"]\n        RR --> Prompt["Prompt builder<br/>system prompt + context + history"]\n        Prompt --> LLM["Model inference<br/>hosted API or self-hosted GPUs"]\n        LLM -->|token stream| GW\n        GW --> Logs[("Traces, feedback,<br/>eval store")]\n    end',
            },
            {
              type: 'heading',
              text: 'What is different from a classic web service',
            },
            {
              type: 'table',
              headers: ['Concern', 'Classic service', 'LLM-backed service'],
              rows: [
                ['Unit of capacity', 'Requests/sec, CPU', 'Input + output tokens/sec, GPU memory (model weights + KV cache)'],
                ['Latency', 'Tens of ms', 'Hundreds of ms to first token, then seconds of streaming; long prompts raise prefill time'],
                ['Cost', 'Mostly fixed infrastructure', 'Per-token, often the dominant variable cost; output tokens typically cost more than input'],
                ['Determinism', 'Same input, same output', 'Sampling makes outputs vary; correctness is statistical and must be evaluated'],
                ['Caching', 'Exact-key caches', 'Provider prompt/prefix caching for repeated prefixes, exact-response caches, and cautious semantic caches'],
                ['Security', 'Injection via inputs (SQL, XSS)', 'Prompt injection via *retrieved content and tool outputs*; data exfiltration through tool calls'],
              ],
            },
            {
              type: 'heading',
              text: 'Back-of-envelope for an internal assistant',
            },
            {
              type: 'code',
              language: 'text',
              title: 'token-based capacity and cost estimate',
              code: `50,000 employees, 20% daily active, 10 questions/day each   -> 100,000 requests/day
Peak factor 5x over an 8-hour workday                        -> 100,000 / 28,800 x 5 ≈ 17 req/s peak
Per request: ~4,000 input tokens (system + 6 retrieved chunks + history), ~400 output tokens
Peak token throughput: 17 x 4,400 ≈ 75,000 tokens/s (mostly prefill)
Daily volume: 100,000 x 4,400 ≈ 440M tokens/day

Levers: fewer/shorter chunks (input tokens dominate), prefix caching for the shared
system prompt, a smaller model for easy queries (routing), cap output length.`,
            },
            {
              type: 'heading',
              text: 'Key design decisions',
            },
            {
              type: 'list',
              items: [
                '**Hosted API vs self-hosted models** - hosted APIs give the strongest models with zero GPU operations but impose provider rate limits, data-handling reviews, and per-token cost; self-hosting (with an inference server using continuous batching and paged KV-cache management, such as vLLM or similar) gives control and can be cheaper at steady high volume, but GPU capacity is scarce, slow to scale, and must be planned like a database, not like stateless web servers.',
                '**Hybrid retrieval beats pure vectors** - combine embedding similarity with keyword (BM25) search, then re-rank; exact identifiers (error codes, SKUs, names) are where pure vector search fails.',
                '**Permission-aware retrieval** - store ACL metadata with every chunk and filter at query time using the *caller\'s* identity. Retrieving documents the user cannot see and asking the model not to mention them is a data leak waiting to happen.',
                '**Freshness** - the index is a derived copy of source data; drive re-embedding from change events (CDC/webhooks) and track index lag like any other async pipeline.',
                '**Gateway with fallbacks** - route across models/providers, fail over on errors or rate limits, enforce per-team token budgets, and apply token-based (not request-based) rate limiting.',
                '**Agents and tools** - when the model can call tools (search, ticket creation, code execution), treat every tool call as untrusted: least-privilege credentials, allow-lists, human confirmation for irreversible actions, step and cost limits per run, and durable workflow state so long-running agent tasks survive restarts.',
                '**Evaluation as infrastructure** - maintain a versioned eval set (questions with expected answers or grading rubrics), run it on every prompt/model/retrieval change, and log production traces with user feedback to grow the set. Without this, every change is a guess.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Prompt injection is the defining security problem: any retrieved document, web page, email or tool output can contain instructions the model may follow. Defenses are layered, not absolute - separate trusted instructions from untrusted content, restrict what tools can do, require confirmation for side effects, and never give the model credentials broader than the requesting user\'s.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'In an interview, keep the GenAI parts grounded in classic HLD: the ingestion pipeline is a queue-driven async job, the vector index is a sharded, replicated store with its own consistency and freshness questions, the gateway is a rate-limited API gateway, and streaming is a long-lived connection problem. Interviewers reward candidates who see the familiar shapes, not those who treat the LLM as magic.',
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
              text: 'Most prompts an interviewer hands you are really one of a small number of recurring shapes wearing a different costume. Once you recognize the shape, the estimation numbers, the building blocks, and even the deep-dive talking points mostly transfer over from a case study you already know.',
            },
            {
              type: 'heading',
              text: 'Read-heavy key lookup',
            },
            {
              type: 'list',
              items: [
                'URL shortener — same shape as the case study above: near-instant key → value lookup, cache the hot keys.',
                'Distributed cache (design Redis/Memcached itself) — the lookup problem turned inside-out: now *you* are building the key-value store, not just using one.',
                'Search autocomplete / typeahead — a lookup by prefix instead of by exact key (a trie), but still "precompute once, serve reads fast."',
              ],
            },
            {
              type: 'heading',
              text: 'Feed, ranking & aggregation',
            },
            {
              type: 'list',
              items: [
                'News feed — the fan-out-on-write vs fan-out-on-read tradeoff from the case study above.',
                'Ad click aggregation / analytics pipeline — same read-optimization instinct, but the hard part is counting correctly at volume, not ranking.',
              ],
            },
            {
              type: 'heading',
              text: 'Real-time & collaborative',
            },
            {
              type: 'list',
              items: [
                'Chat system (WhatsApp/Slack) — the case study above: stateful connections, per-conversation ordering, offline delivery.',
                'Notification system (email/SMS/push) — a simpler cousin of chat: fan-out to multiple channels instead of maintaining a live connection.',
                'Collaborative document editing (Google Docs) — the hardest of this group; the core challenge is merging concurrent edits (OT or CRDTs), not just delivering messages.',
              ],
            },
            {
              type: 'heading',
              text: 'Geospatial & matching',
            },
            {
              type: 'list',
              items: [
                'Ride-sharing dispatch (Uber/Lyft) — the case study above: geo-indexing plus a race against a tight matching deadline.',
              ],
            },
            {
              type: 'heading',
              text: 'Heavy async pipelines',
            },
            {
              type: 'list',
              items: [
                'Video streaming (YouTube/Netflix) — the case study above: upload/transcode fully decoupled from playback.',
                'Web crawler — a queue-driven pipeline (URL frontier → fetch workers → dedupe → store), constrained by politeness/rate limits per domain rather than by a user-facing latency budget.',
                'Distributed job scheduler — reliably running work at a future time or on a recurring cadence, at scale — the interesting part is exactly-once-ish execution despite worker crashes.',
                'E-commerce checkout / inventory, and payment processing (see the Payment System case study) — a strongly-consistent core (never oversell, never double-charge) wrapped in mostly-async supporting flows (confirmation emails, analytics).',
                'API rate-limited third-party integration proxy — your system fronting a flaky, rate-limited external API: queueing, backoff, and circuit breaking dominate the design.',
              ],
            },
            {
              type: 'heading',
              text: 'Contention & correctness under load',
            },
            {
              type: 'list',
              items: [
                'Ticket booking / flash sale (Ticketmaster-style) — millions of users competing for a few thousand seats: a virtual waiting room to meter admission, short-TTL seat holds via conditional writes, and an idempotent checkout. The hard part is fairness and contention, not storage.',
                'Distributed counter / leaderboard (likes, live view counts, game rankings) — sharded counters with periodic aggregation, sorted sets for top-K, and an explicit decision on how stale a number may be.',
              ],
            },
            {
              type: 'heading',
              text: 'GenAI systems',
            },
            {
              type: 'list',
              items: [
                'RAG assistant over company documents, or an LLM gateway shared by many teams — see the LLM-powered systems topic: token-based capacity planning, streaming, permission-aware retrieval, evaluation, and prompt-injection defenses.',
              ],
            },
            {
              type: 'heading',
              text: 'A building-block component, not a full system',
            },
            {
              type: 'list',
              items: [
                'Rate limiter — covered at HLD level in the case study above (where does the shared counter live); the LLD guide covers the algorithm itself (token bucket, sliding window) in depth.',
              ],
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
          summary: '42 HLD interview questions with full-depth answers, covering foundational concepts, the framework, case-study follow-ups, data and consistency internals, async patterns, reliability, cost, and GenAI systems.',
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
                'A queue (SQS/RabbitMQ) is typically consumed once and removed — good for task distribution/work queues where each message represents one unit of work for exactly one consumer group. An event stream (Kafka) retains events for a configurable window and supports multiple independent consumer groups replaying the same log at their own pace — good when multiple services need the same events for different purposes (analytics, audit, triggering downstream workflows) and when you need ordered, replayable history. Pick a queue for simple task offloading; pick a stream when multiple consumers need the same events or you need replay/audit. Two nuances score points: ordering in a log is only per partition (so the partition key is a correctness decision), and classic Kafka consumer-group parallelism is capped by partition count while a poison record blocks its partition - which is why queues with per-message retries and DLQs remain better for job processing. The categories are converging: Kafka 4.2 made queue-style share groups (KIP-932) production-ready, so the same platform can now serve both models.',
            },
            {
              question: 'How would you shard a database that\'s outgrown a single instance, and what breaks when you do?',
              answer:
                'Choose a shard key with high cardinality and access patterns that stay local to one shard (e.g., `user_id` for a per-user data model) — avoid hot keys. Options: range-based (simple, but risks hot shards for sequential keys/time-series), hash-based (even distribution, but range queries become cross-shard), or consistent hashing (minimizes reshuffling when adding/removing shards). What breaks: cross-shard joins and transactions become expensive or impossible without a distributed transaction protocol (2PC/Saga); auto-increment IDs no longer work globally (need a distributed ID generator); "show me all X" aggregate queries need scatter-gather or a separate analytics store.',
            },
            {
              question: 'How do you keep a cache consistent with the database?',
              answer:
                'Most common: cache-aside (read: check cache, on miss read DB and populate cache; write: update DB, then invalidate — not update — the cache entry to avoid races) with a TTL as a safety net against missed invalidations. Write-through (write to cache and DB synchronously) keeps them in lockstep but adds write latency. Write-behind (write to cache, async flush to DB) is fastest but risks data loss on cache failure before flush. For invalidation correctness under concurrent writes, prefer deleting the cache key over updating it (delete is idempotent and avoids stale overwrites from out-of-order writes). Then name the residual race: a slow reader that loaded the old value before the write can repopulate the cache after the delete. Mitigate with short TTLs, a delayed second delete, versioned compare-and-set writes, or by driving invalidation from the database change log (CDC), which also covers the case where the app crashes between the DB write and the cache delete. Finally, state the staleness budget per data type - "profile pictures may be 60 s stale, account balances are never served from cache".',
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
                'Serve reads from the nearest region via geo-DNS/anycast and regional read replicas or a multi-region database (e.g., DynamoDB Global Tables, Spanner). The hardest part is writes: either pick one region as the write leader (simpler, but adds latency for far regions and creates a single point of failure for writes) or allow multi-region writes and resolve conflicts (last-write-wins, CRDTs, or application-level merge logic) — which reintroduces the CAP tradeoff at global scale. Also account for data residency/compliance constraints (GDPR) that may force certain data to stay in-region regardless of the technical design. A strong answer also distinguishes per data type: globally consistent stores (Spanner, CockroachDB, or DynamoDB global tables created in multi-Region strong consistency mode) for the small set of data that must never conflict - balances, usernames, inventory - paying a cross-region round trip per write, while everything else (feeds, profiles, analytics) replicates asynchronously. Many teams avoid multi-writer conflicts entirely by "homing" each user or tenant to one region for writes, routing their writes there, and replicating out for reads and DR. Finish with RPO/RTO targets and how failover is exercised, because untested failover is the most common multi-region failure.',
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
            {
              question: 'Design a ticket-booking system for a concert where 2 million people try to buy 50,000 seats the moment sales open. Where does it break and how do you protect it?',
              answer:
                'The write path for seats is tiny (50K rows) but the contention is extreme, so the design is about admission control and atomic holds, not storage. (1) Put a **virtual waiting room** in front: users get a queue token at the edge (CDN/edge compute serves the static waiting page), and a controller admits users into the purchase flow at a rate the backend can sustain - this converts a 2M-user spike into a steady, fair stream. (2) Seat selection places a **hold** with a conditional write (`UPDATE seats SET status=\'HELD\', hold_id=?, expires_at=now()+10min WHERE seat_id=? AND status=\'AVAILABLE\'`) - a single-row compare-and-set, no distributed lock. Holds expire automatically so abandoned carts release seats. (3) Checkout is an idempotent payment call keyed by the hold; on success the seat goes HELD -> SOLD conditionally on the same hold_id. (4) Read traffic for the seat map is served from a cache that is allowed to be a few seconds stale; the conditional write is the source of truth, so a stale map only means occasional "seat just taken" errors. (5) Shed load explicitly: rate-limit per account and device, block bots at the edge, and return friendly "try again" responses rather than timing out. Name the failure mode: without the waiting room, the database connection pool saturates and everyone fails at once.',
            },
            {
              question: 'Why is the transactional outbox pattern needed, and what are its trade-offs versus change data capture?',
              answer:
                'Writing to the database and publishing to a broker are two separate systems; doing them sequentially means a crash between them either loses the event or publishes an event for a transaction that rolled back. The outbox writes the event into an `outbox` table in the same local transaction as the business change, so they commit atomically; a relay later publishes outbox rows and marks them sent. Trade-offs: delivery becomes at-least-once (consumers must dedup by event id), there is a small publish delay, and the outbox table needs cleanup. **CDC** (e.g. Debezium tailing the Postgres WAL or MySQL binlog) can be the relay - it reads committed changes in commit order with low latency and no polling load. Using CDC directly on business tables (no outbox) is even less code, but couples consumers to your internal schema; publishing explicit outbox events keeps a stable, intentional event contract. A common production answer: outbox table for the contract, CDC as the transport.',
            },
            {
              question: 'Explain a saga with a concrete example. When would you refuse to use one?',
              answer:
                'Booking a trip: reserve flight, reserve hotel, charge card. Each is a local transaction in a different service. If the charge fails, the saga runs compensations in reverse - cancel hotel, cancel flight. An orchestrator (a durable workflow engine or persisted state machine) is usually clearer than choreography once there are more than three steps, because the flow, timeouts and compensations live in one place. Key properties to state: sagas provide no isolation - other requests can see intermediate states, so use pending/semantic-lock states; compensations are business operations that may themselves fail and must be retried idempotently; and steps should prefer reversible actions (authorize then capture, hold then confirm). I would refuse a saga when the invariant must hold atomically at every instant and the data can live together - e.g. moving money between two accounts in the same ledger belongs in one ACID transaction, not a saga across services. Often the right fix is redrawing service boundaries so the invariant lives in one database.',
            },
            {
              question: 'Your read replicas lag by a few seconds and users complain that their edits "disappear" after saving. How do you fix it without sending all reads to the primary?',
              answer:
                'This is a read-your-writes violation. Options from cheapest to most precise: (1) after a user writes, route *that user\'s* reads to the primary for a short window (e.g. 10-30 s, tracked via a cookie or session flag) - everyone else keeps using replicas; (2) record the primary\'s log position (LSN/GTID) returned by the write, pass it with subsequent reads, and only serve from a replica that has replayed at least that position, otherwise fall back to the primary; (3) for the specific screen the user just edited, return the written data in the write response and render it client-side. Also add monotonic-read stickiness (hash user to one replica) so successive reads do not go back in time, alert on replication lag, and remove replicas that exceed a lag threshold from the read pool. Mention that lag spikes usually come from long-running transactions, big batch writes, or an under-provisioned replica - fixing the cause is part of the answer.',
            },
            {
              question: 'How do you choose a shard key, and what do you do when a single tenant or user becomes larger than a shard?',
              answer:
                'A good shard key has high cardinality, spreads both data and traffic evenly, and keeps the dominant query on one shard (e.g. `tenant_id` for a B2B SaaS where nearly every query is scoped to a tenant). Validate it against the top 3 queries: anything that becomes scatter-gather should be rare or served by a separate read model (a search index or warehouse). For whales: give the big tenant dedicated shard(s) via a directory/lookup table rather than pure hashing; sub-partition it with a compound key (`tenant_id, bucket`) and accept fan-out queries for that tenant only; or for hot single keys (a celebrity\'s counter), split the value across N sub-keys and sum on read. Design in advance for movement: many logical shards mapped onto fewer physical nodes, so rebalancing means moving a logical shard (copy, catch up from the log, verify, cut over) instead of re-hashing every key.',
            },
            {
              question: 'What happens during leader failover in a replicated database, and what can go wrong?',
              answer:
                'Steps: detect failure (missed heartbeats or an expired lease), elect a new leader - ideally the most up-to-date replica, chosen through consensus (Raft-style) rather than an ad-hoc script - reconfigure clients to the new leader (proxy, DNS, or service discovery), and bring the old leader back as a follower. What goes wrong: (1) **data loss** - with asynchronous replication, writes acknowledged by the old leader but not yet replicated are lost, so state your RPO or use semi-synchronous replication; (2) **split brain** - a leader that was only partitioned, not dead, keeps accepting writes; prevent this with fencing (epoch numbers / fencing tokens that storage rejects, or STONITH-style isolation) and leases that expire before a new leader is elected; (3) **false positives** - a too-aggressive timeout fails over on a GC pause, causing unnecessary disruption; (4) **thundering reconnect** - all clients reconnect at once and overload the new leader. Consensus-based databases handle the first two by construction, at the cost of majority-acknowledged writes.',
            },
            {
              question: 'How would you design a distributed job scheduler that runs millions of scheduled jobs per day with no job lost and no job run twice concurrently?',
              answer:
                'Store jobs durably in a partitioned table keyed by `(time_bucket, job_id)` with next_run_at, status and a lease column. Scheduler workers each own a set of partitions (assigned via a coordination service or consistent hashing) and repeatedly query "jobs due in the next few seconds" from their partitions, claiming each with a conditional update that sets a lease (`status = RUNNING, lease_owner = me, lease_expires = now() + 60s WHERE status = SCHEDULED`). Claimed jobs are pushed onto a work queue; executors heartbeat to extend the lease and mark completion; a sweeper returns jobs with expired leases to SCHEDULED. This gives at-least-once execution - a worker can die after doing the work but before recording it - so job handlers must be idempotent (e.g. keyed by `job_id + scheduled_time`), and true "no concurrent double-run" needs fencing tokens checked by the side effect. For recurring jobs, compute the next occurrence when completing the current one in the same transaction. Avoid hot partitions at round times (everyone schedules at 00:00) by adding jitter or spreading by job_id hash.',
            },
            {
              question: 'What is cell-based architecture and why do large platforms adopt it?',
              answer:
                'A cell is a complete, independent copy of the service stack (compute, databases, queues) serving a subset of customers; a thin routing layer maps each customer to a cell. It limits **blast radius**: a bad deploy, a poison request, a noisy tenant or a corrupted database affects one cell - a few percent of customers - instead of everyone. It also gives a known-good unit of scale (add cells instead of growing one giant cluster past tested limits) and makes progressive rollouts natural (deploy cell by cell). Costs: the routing layer becomes critical and must be extremely simple and highly available; cross-cell features (global search, analytics, a user moving cells) need separate aggregation paths; and there is overhead in running many copies. It is the right answer when the requirement is very high availability for a multi-tenant system and correlated failures, not raw capacity, are the main risk.',
            },
            {
              question: 'How would you design an LLM-backed customer support assistant over a company\'s help-center and ticket history? What would you monitor?',
              answer:
                'Ingestion: an async pipeline parses documents and resolved tickets, chunks them, embeds them, and writes to a hybrid (vector + keyword) index with source, freshness and ACL metadata; updates arrive via change events so the index lags the source by minutes, not days. Serving: the gateway authenticates the user, the retriever runs hybrid search filtered by what this user may see, a re-ranker picks the top few chunks, the prompt builder adds system instructions and conversation history, and the model streams tokens back over SSE with citations. Add a router that sends simple questions to a smaller, cheaper model, prefix caching for the shared system prompt, and a fallback provider or model on errors. Guardrails: treat retrieved text as untrusted (prompt injection), require confirmation before any tool action like issuing a refund, and hand off to a human when confidence is low. Monitor: time to first token and total latency, tokens and cost per conversation, retrieval hit quality, answer quality on a regression eval set run on every change, user feedback and escalation rate, and index freshness lag.',
            },
            {
              question: 'Interviewers increasingly ask about cost. How do you bring cost into an HLD answer without derailing it?',
              answer:
                'Identify the one or two dominant cost drivers from your estimates and design around them explicitly. For media systems it is egress and storage, so CDN hit ratio, codec efficiency and storage tiering (hot, infrequent-access, archive by age) matter most. For data-heavy systems it is storage multiplied by replication and indexes, so retention policies, compaction, and moving cold data to object storage dominate. For chatty microservices it can be cross-AZ and cross-region data transfer, which favors zone-aware routing. For GenAI it is tokens, so prompt size, model routing and caching dominate. Then name the trade-off you would make: "I would accept a 10-minute delay on analytics to batch writes and cut cost", or "lower renditions are transcoded lazily on first view". One or two such sentences, tied to numbers, signal staff-level thinking without stealing time from the deep dive.',
            },
            {
              question: 'How do you migrate a live system to a new database or schema with zero downtime?',
              answer:
                'Use expand-and-contract with dual reads and writes: (1) **expand** - create the new store/schema alongside the old one; (2) start **dual-writing** (or better, stream changes from the old store via CDC to avoid inconsistent dual writes); (3) **backfill** historical data in idempotent batches, then let the change stream catch up; (4) **verify** - shadow-read from the new store and compare results against the old one, logging mismatches until the rate is effectively zero; (5) **cut over reads** gradually behind a feature flag (1%, 10%, 100%), keeping the old path as instant rollback; (6) switch the source of truth for writes; (7) **contract** - stop writing to and remove the old store once you are confident. Each phase is reversible until the last one. Mention what usually bites: write ordering between the backfill and live changes (use versions or timestamps to keep the newest), long-running backfills overloading the primary (throttle them), and application code that still reads the old schema.',
            },
            {
              question: 'What is the difference between availability and durability, and how do replication factor and quorum settings affect each?',
              answer:
                'Availability is whether the system answers requests right now; durability is whether acknowledged data survives failures. They are tuned separately. With 3 replicas and quorum writes (W=2), an acknowledged write exists on at least two nodes, so it survives the loss of any single node - and even two nodes if the survivor is one that holds it; the system stays writable with one node down but not two. With W=1 the system is more available for writes, but an acknowledged write can be lost if that one node dies before replicating. Object stores achieve extreme durability by spreading erasure-coded fragments across many devices and facilities, while their availability SLA is far lower than their durability figure - a good illustration that the two are different numbers. Backups add durability against a failure mode replication cannot fix: logical corruption or accidental deletes, which replicate faithfully to every copy.',
            },
          ],
        },
      ],
    },
  ],
}
