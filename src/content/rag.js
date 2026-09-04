export const ragSection = {
  id: 'rag',
  label: 'RAG',
  icon: '📖',
  groups: [
    {
      id: 'rag-guide',
      label: 'Guide',
      topics: [
        {
          id: 'llm-fundamentals',
          title: 'LLM Fundamentals Interviewers Assume You Know',
          summary:
            'Before RAG makes sense, you need the handful of LLM mechanics that explain *why* it works: tokens as the real unit of cost, autoregressive generation, sampling controls, and precisely what hallucination is.',
          keyPoints: [
            'Models operate on subword tokens, not words or characters — cost, latency, and the context window are all token budgets.',
            'Generation is autoregressive: each token is conditioned on everything before it, which is why a bad early token can cascade and why chain-of-thought helps.',
            'Temperature/top-p/top-k control sampling randomness — near-zero for factual/code tasks, higher for creative tasks.',
            '"Lost in the middle": information in the middle of a long context is recalled less reliably than information at the start or end — a direct argument for retrieval over just pasting everything into context.',
            'Hallucination is fluent, confident, unsupported text from a next-token predictor optimized for plausibility, not a database with a verify step.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Tokens, not words**: models operate on subword tokens (via BPE or similar); the "context window" is a token budget covering both input and output combined for most APIs. Always reason in tokens, not characters, when estimating cost or feasibility.',
                '**Autoregressive generation**: the model predicts one token at a time, each conditioned on everything before it — this is *why* a single bad early token can cascade into a badly derailed response, and why techniques like chain-of-thought help (they give the model "space" to reason token-by-token before committing to an answer).',
                '**Temperature/top-p/top-k**: control sampling randomness. Temperature 0 (or near it) for deterministic, factual, or code-generation tasks; higher temperature for creative/brainstorming tasks. "Temperature 0" doesn\'t guarantee perfect determinism across all providers/hardware, but it minimizes variance.',
                '**Context window is not free**: stuffing more into context doesn\'t just cost money — very long contexts can suffer from the "lost in the middle" effect, where information in the middle of a long context is attended to less reliably than information at the start or end. This is a direct argument *for* retrieval (fetch only what\'s relevant) over "just paste the whole knowledge base into context."',
                '**Why prompting matters as much as it does**: instructions, examples, and structure directly shape output quality because the model has no separate "configuration" channel — everything is conditioning on the same token stream. Key techniques: **few-shot examples**, **chain-of-thought prompting** ("think step by step"), **role/system prompts**, and **structured output** (JSON-schema-constrained generation — the default over "please respond in JSON" prompt begging for anything consumed programmatically downstream).',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Mitigations for hallucination worth naming (not just "use RAG"): grounding in retrieved sources with citations, lower temperature for factual tasks, explicit "say you don\'t know if unsure" instructions, structured output validation, and a verification/self-critique pass.',
            },
          ],
        },
        {
          id: 'rag-overview',
          title: 'Retrieval-Augmented Generation, End to End',
          summary:
            'RAG retrieves relevant, authoritative content at query time and feeds it into the prompt as context, so the model answers *from* provided context rather than from memory — reducing hallucination and letting the knowledge base update without retraining anything.',
          keyPoints: [
            'The model answers from retrieved context, not parametric (trained-in) knowledge — the knowledge base can update without retraining anything.',
            'Ingestion (offline) chunks and embeds documents into a vector database; query time embeds the query, retrieves, re-ranks, and assembles context.',
            'RAG reduces hallucination but does not eliminate it — retrieval can return irrelevant chunks, and the model can still misread or over-generalize from what it\'s given.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**The core idea**: instead of relying on a model\'s parametric (trained-in) knowledge, retrieve relevant, up-to-date, authoritative source content at query time and feed it into the prompt as context — the model answers *from* the provided context rather than from memory, dramatically reducing hallucination for knowledge-grounded tasks and letting the knowledge base be updated without retraining anything.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Ingestion["Offline: Ingestion Pipeline"]
        Docs[Source Documents] --> Chunker[Chunking]
        Chunker --> Embedder[Embedding Model]
        Embedder --> VectorDB[(Vector Database)]
    end
    subgraph QueryTime["Online: Query Time"]
        Query[User Query] --> QEmbed[Embed Query]
        QEmbed --> Retrieve[Vector Similarity Search]
        VectorDB --> Retrieve
        Retrieve --> Rerank[Re-ranking]
        Rerank --> Context[Assemble Context]
        Query --> Context
        Context --> LLM[LLM Generation]
        LLM --> Answer[Answer + Citations]
    end`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The rest of this guide walks the pipeline stage by stage — chunking, embeddings and vector search, hybrid search and re-ranking, evaluation, and advanced patterns — because that\'s exactly how you should decompose debugging a RAG system too: a bad answer is either a retrieval failure or a generation failure, and treating the whole pipeline as one opaque black box makes it undebuggable.',
            },
          ],
        },
        {
          id: 'chunking',
          title: 'Chunking Strategies',
          summary:
            'Splitting documents into retrievable units is the single highest-leverage, most under-discussed decision in a RAG pipeline — get it wrong and no amount of downstream tuning fixes it.',
          keyPoints: [
            'Too large: retrieved chunks contain irrelevant padding that dilutes context and can push out other relevant chunks.',
            'Too small: chunks lose the surrounding context needed to make sense on their own.',
            'Fixed-size with overlap is simplest but boundaries fall arbitrarily mid-thought.',
            'Semantic/recursive and document-structure-aware chunking respect natural boundaries — paragraphs, headers, tables.',
            'Sentence-window retrieval decouples the unit optimized for search precision from the unit used for generation context.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Too large: retrieved chunks contain irrelevant padding that dilutes the context and can push out other relevant chunks; too small: chunks lose surrounding context needed to make sense on their own.',
            },
            {
              type: 'heading',
              text: 'Strategies',
            },
            {
              type: 'list',
              items: [
                '**Fixed-size with overlap** — simplest, chunk boundaries fall arbitrarily mid-thought.',
                '**Semantic/recursive chunking** — split on natural boundaries (paragraphs, sections), falling back to smaller units only if a section is still too large.',
                '**Document-structure-aware chunking** — respect markdown headers, code blocks, table boundaries; never split a table row from its header.',
                '**Sentence-window retrieval** — embed and index small units like single sentences for precise matching, but retrieve a wider window of surrounding text around each match to preserve context for generation. This decouples the unit optimized for *search precision* from the unit used for *generation context*.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'There\'s no universal correct chunk size. Start with a size aligned to the document\'s natural structure (a paragraph, a subsection) rather than an arbitrary token count, then evaluate retrieval quality (context precision/recall) empirically on a representative query set.',
            },
          ],
        },
        {
          id: 'embeddings-vector-search',
          title: 'Embeddings and Vector Search',
          summary:
            'An embedding model maps text to a dense vector so semantically similar text lands close together; at scale, exact nearest-neighbor search is too slow, so production systems trade a little recall for a lot of speed via ANN.',
          keyPoints: [
            'Embeddings place semantically similar text close together in vector space, measured by cosine similarity or dot product.',
            'Approximate Nearest Neighbor (ANN) search — HNSW or IVF — trades a small amount of recall for a massive speed improvement.',
            'Purpose-built vector DBs (Pinecone, Weaviate, Qdrant, Milvus) vs. vector-search-as-a-feature (pgvector, Elasticsearch/OpenSearch, Redis, MongoDB Atlas).',
            'Choose a bolt-on option when you already run that database and needs are modest; choose purpose-built when retrieval performance/scale is first-class or you need advanced features.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'An embedding model maps text to a dense vector such that semantically similar text lands close together in vector space (measured by cosine similarity or dot product). Retrieval finds the *k* nearest neighbor vectors to the query\'s embedding.',
            },
            {
              type: 'p',
              text: 'At scale, exact nearest-neighbor search is too slow, so production vector databases use **Approximate Nearest Neighbor (ANN)** algorithms — most commonly **HNSW** (Hierarchical Navigable Small World graphs — a layered graph structure enabling fast approximate search with a tunable accuracy/speed tradeoff) or **IVF** (Inverted File Index — partition the vector space into clusters, search only the most relevant clusters). ANN trades a small amount of recall for a massive speed improvement, which is the correct trade for nearly all real applications given how imprecise "relevance" itself already is.',
            },
            {
              type: 'heading',
              text: 'Vector database options',
            },
            {
              type: 'p',
              text: 'A frequent "which one" question: **purpose-built** (Pinecone, Weaviate, Qdrant, Milvus — managed or self-hosted, built specifically around vector search with rich filtering), or **vector-search-as-a-feature** bolted onto an existing database (pgvector for Postgres, Elasticsearch/OpenSearch\'s vector engine, Redis, MongoDB Atlas Vector Search).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Choose a bolt-on option when you already run that database and want to avoid adding a new piece of infrastructure and your scale/query-pattern needs are modest; choose a purpose-built vector DB when retrieval performance/scale is a first-class requirement or you need advanced features (hybrid search, metadata filtering at scale, multi-tenancy isolation) that bolt-ons handle less maturely.',
            },
          ],
        },
        {
          id: 'hybrid-search-reranking',
          title: 'Hybrid Search and Re-ranking',
          summary:
            'Pure vector search can miss exact keyword matches; hybrid search merges vector and keyword results, and a two-stage retrieve-cheap-then-rerank-precise pattern is standard in production RAG.',
          keyPoints: [
            'Pure semantic search can miss exact keyword/entity matches (SKUs, exact names, acronyms) because semantic similarity doesn\'t guarantee lexical overlap.',
            'Hybrid search combines vector similarity with keyword search (BM25/full-text), merged via Reciprocal Rank Fusion.',
            'Re-ranking retrieves a larger candidate set cheaply, then runs a cross-encoder over query+candidate pairs to reorder by true relevance.',
            'Bi-encoders (vector search) are fast but less accurate; cross-encoders are far more accurate but too slow to run over a whole corpus — production systems use both.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Pure vector (semantic) search can miss exact keyword/entity matches that a user explicitly typed (product SKUs, exact names, acronyms) because semantic similarity doesn\'t guarantee lexical overlap. **Hybrid search** combines vector similarity with traditional keyword search (BM25/full-text) and merges the results, commonly via **Reciprocal Rank Fusion** (RRF) — which combines ranked lists from each method without needing to normalize incomparable raw scores.',
            },
            {
              type: 'p',
              text: '**Re-ranking** adds a second, more expensive but more accurate pass: retrieve a larger candidate set cheaply (e.g., top 50 via vector search), then run a specialized cross-encoder re-ranking model over the query + each candidate pair to reorder by true relevance, and keep only the top few (e.g., 5) for the final context.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This two-stage "retrieve cheap, rerank precise" pattern is standard in production RAG because a cross-encoder (which jointly encodes query and document) is far more accurate at relevance judgment than a bi-encoder (which encodes query and document independently, as vector search does) but is too slow to run over an entire corpus.',
            },
          ],
        },
        {
          id: 'rag-evaluation',
          title: 'RAG Evaluation',
          summary:
            'Evaluating only the final answer conflates retrieval failures with generation failures. Decompose metrics by pipeline stage, and use LLM-as-judge to score qualities that don\'t reduce to exact-match string comparison.',
          keyPoints: [
            'Retrieval metrics: Context Precision, Context Recall, MRR/NDCG.',
            'Generation metrics: Faithfulness/Groundedness (the direct hallucination-in-RAG metric) and Answer Relevance.',
            'LLM-as-judge scores faithfulness/relevance at scale, but judge models have their own biases and need periodic human-correlation checks.',
            'RAGAS and similar frameworks operationalize these metrics into a runnable evaluation harness.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Evaluating only the final answer conflates retrieval failures with generation failures and makes debugging impossible — decompose by pipeline stage instead.',
            },
            {
              type: 'table',
              headers: ['Stage', 'Metric', 'What it measures'],
              rows: [
                ['Retrieval', 'Context Precision', 'Of the retrieved chunks, what fraction are actually relevant?'],
                ['Retrieval', 'Context Recall', 'Of the chunks that *should* have been retrieved, what fraction were?'],
                ['Retrieval', 'MRR / NDCG', 'Classic IR ranking-quality metrics — is the most relevant chunk ranked first?'],
                ['Generation', 'Faithfulness / Groundedness', 'Is every claim in the answer actually supported by the retrieved context, or did the model add unsupported claims — the direct hallucination-in-RAG metric.'],
                ['Generation', 'Answer Relevance', 'Does the answer actually address the question asked, independent of whether it\'s grounded.'],
              ],
            },
            {
              type: 'p',
              text: '**LLM-as-judge** is increasingly the standard way to score faithfulness/relevance at scale — prompt a strong LLM to evaluate a (question, context, answer) triple against a rubric, since these qualities are semantic and don\'t reduce to exact-match string comparison.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Judge models have their own biases (favoring longer/more confident-sounding answers), so a judge prompt needs careful calibration, and a small human-labeled evaluation set should periodically validate that the LLM judge\'s scores correlate with human judgment.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '**RAGAS** and similar frameworks operationalize these metrics into a runnable evaluation harness — worth naming as the "don\'t reinvent this" answer to "how would you evaluate a RAG system."',
            },
          ],
        },
        {
          id: 'advanced-rag-patterns',
          title: 'Advanced RAG Patterns',
          summary:
            'Beyond a single fixed retrieve-then-generate pass: query transformation to improve retrieval, agentic RAG to let the model decide when and how to retrieve, and GraphRAG for multi-hop relational questions.',
          keyPoints: [
            'HyDE: generate a hypothetical answer first, then embed *that* for retrieval — often closer in embedding space to real relevant documents.',
            'Multi-query expansion: rephrase the query several ways and merge results to reduce sensitivity to exact phrasing.',
            'Agentic RAG: the model decides whether to retrieve, formulates its own queries, and iterates if results are insufficient.',
            'GraphRAG: retrieve by traversing a knowledge graph for multi-hop questions that pure vector similarity handles poorly.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Query transformation',
            },
            {
              type: 'p',
              text: 'Rewrite/expand the user\'s raw query before retrieval — **HyDE** (Hypothetical Document Embeddings: ask the LLM to generate a hypothetical answer first, then embed *that* for retrieval, since a hypothetical answer is often closer in embedding space to real relevant documents than the terse original question), and **multi-query expansion** (generate several rephrasings of the query and retrieve for each, merging results, to reduce sensitivity to exact query phrasing).',
            },
            {
              type: 'heading',
              text: 'Agentic RAG',
            },
            {
              type: 'p',
              text: 'Instead of a single fixed retrieve-then-generate pass, let the model decide *whether* to retrieve, formulate its own search queries, evaluate whether retrieved results are sufficient, and iteratively retrieve again if not — turning RAG from a pipeline into a tool the agent chooses to invoke. This is exactly where LangGraph-style agent loops and RAG intersect.',
            },
            {
              type: 'heading',
              text: 'GraphRAG',
            },
            {
              type: 'p',
              text: 'Build a knowledge graph from the corpus (entities and relationships extracted via LLM) and retrieve by graph traversal in addition to/instead of vector similarity — better for questions requiring multi-hop reasoning across explicitly connected facts ("who is the manager of the person who approved this project") that pure vector similarity handles poorly, since the relevant chunks may not be semantically similar to the query at all, only relationally connected.',
            },
          ],
        },
        {
          id: 'finetuning-vs-rag-vs-prompting',
          title: 'Fine-Tuning vs. RAG vs. Prompt Engineering',
          summary:
            'The single most common interview trap: candidates reach for fine-tuning to teach a model new facts. RAG is almost always the right tool for that; fine-tuning is for changing how a model behaves.',
          keyPoints: [
            'Prompt engineering: fast, no infra, but can\'t inject knowledge beyond the context window.',
            'RAG: best for injecting current/proprietary/large knowledge with citeable, updatable facts.',
            'Fine-tuning: best for teaching consistent format/style/tone, not for injecting new facts.',
            'Reach for fine-tuning only after prompting and RAG have been tried and demonstrably fall short.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Best for', 'Not good for'],
              rows: [
                ['**Prompt engineering**', 'Fast iteration, no infra, works with any capable base model, easy to update', 'Can\'t inject knowledge beyond context window; limited by base model\'s inherent capability'],
                ['**RAG**', 'Injecting current/proprietary/large knowledge bases; needs citeable, updatable facts; reducing hallucination on knowledge-grounded questions', 'Doesn\'t change the model\'s underlying behavior/style/reasoning ability; adds retrieval infra and latency'],
                ['**Fine-tuning**', 'Teaching a consistent output format/style/tone at scale; specializing behavior on a narrow task; reducing prompt length (baking instructions into weights)', 'Expensive and slow to iterate on; doesn\'t reliably inject *new factual knowledge* the way people assume; needs meaningful, well-curated training data'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The single most common interview trap: candidates reach for fine-tuning to "teach the model new facts." The better-informed answer is that RAG is almost always the correct tool for that job — fine-tuning is for changing *how* a model behaves (format, tone, task specialization), not primarily for injecting knowledge. Reach for fine-tuning only after prompting and RAG have been tried and demonstrably fall short on a specific, measurable dimension.',
            },
          ],
        },
        {
          id: 'case-study-support-assistant',
          title: 'Case Study: Enterprise Support Assistant (RAG + Agent + MCP)',
          summary:
            'A capstone system design: answer employee questions grounded in internal docs, take actions when needed, gate side-effecting actions behind human approval, and support multiple internal tools without custom integration per tool.',
          keyPoints: [
            'RAG grounds knowledge questions with citations, surfaced for user trust and to make faithfulness failures auditable.',
            'LangGraph provides explicit control flow: a routing node chooses between "answer from knowledge" and "take an action."',
            'MCP standardizes the tool layer — ticketing, deployment, and doc/repo access are each an independent MCP server.',
            'Evaluation runs on every pipeline/prompt change against a held-out set, the same discipline as a test suite applied to a probabilistic system.',
            'Cost/latency tiering: cheap/fast models for routing and quality checks, the most capable model reserved for final generation and genuine multi-step reasoning.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**Requirements**: answer employee questions grounded in internal docs (HR policy, engineering runbooks, product specs), take actions when needed (create a ticket, check a deployment\'s status), require human approval for any action with side effects, and support multiple internal tool providers without custom integration per tool.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    User[Employee] --> Host[Assistant Host App]
    Host --> Graph[LangGraph Agent]
    Graph --> Router{Needs retrieval,<br/>a tool, or both?}
    Router -->|Knowledge question| RAGNode[RAG Node]
    RAGNode --> VectorDB[(Vector DB:<br/>chunked internal docs)]
    RAGNode --> Rerank[Re-rank top candidates]
    Rerank --> GenNode[Generate grounded answer]
    Router -->|Action needed| ToolNode[Tool-Call Node]
    ToolNode --> MCPClient[MCP Client]
    MCPClient --> MCPTicket[MCP Server: Ticketing System]
    MCPClient --> MCPDeploy[MCP Server: Deployment Status]
    MCPClient --> MCPRepo[MCP Server: Internal Git/Docs]
    ToolNode --> RiskCheck{High-risk action?}
    RiskCheck -->|Yes| HumanApproval[Human-in-the-loop<br/>approval, LangGraph checkpoint]
    RiskCheck -->|No| Execute[Execute directly]
    HumanApproval --> Execute
    GenNode --> Response[Response with citations]
    Execute --> Response`,
            },
            {
              type: 'heading',
              text: 'Key design decisions',
            },
            {
              type: 'list',
              items: [
                '**RAG grounds knowledge questions**, with citations surfaced to the user — both for user trust and because it makes faithfulness failures immediately visible/auditable, unlike an ungrounded answer where a hallucination is invisible until someone happens to fact-check it.',
                '**LangGraph provides the explicit control flow**: a routing node decides between "answer from knowledge" and "take an action," and a conditional edge gates any side-effecting tool call behind human approval — implemented as a graph checkpoint that pauses execution and resumes once a human approves via a UI.',
                '**MCP standardizes the tool layer**: the ticketing system, deployment dashboard, and internal doc/repo access are each a separate MCP server, built and maintained independently — the agent host doesn\'t need bespoke integration code per tool, and adding a fourth internal system later means standing up one more MCP server, not modifying the agent\'s core code.',
                '**Evaluation is built in, not bolted on after launch**: a held-out set of representative questions with expected-correct citations is run through the faithfulness/relevance metrics on every change to the retrieval pipeline or prompt, to catch regressions before they reach users — the same discipline as a test suite, applied to a system whose "correctness" is probabilistic rather than exact.',
                '**Cost/latency tiering**: the routing node itself, and simple retrieval-quality checks, can run on a smaller/cheaper/faster model, reserving the most capable (and expensive) model for final answer generation and any step requiring genuine multi-step reasoning — a real production cost lever that\'s easy to skip in a demo but expected in a system design discussion.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'rag-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'RAG and LLM-fundamentals interview questions, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'Why does RAG reduce hallucination, and does it eliminate it?',
              answer:
                'RAG reduces hallucination by conditioning generation on retrieved, verifiable source content instead of relying solely on the model\'s parametric knowledge, and by making faithfulness checkable (does the answer\'s claims actually appear in the provided context?). It doesn\'t eliminate hallucination: the model can still misread or over-generalize from the retrieved context, retrieval itself can return irrelevant or incomplete chunks (garbage in, garbage out), and the model can still blend retrieved facts with unsupported additions unless explicitly constrained and evaluated for faithfulness.',
            },
            {
              question: 'Walk through why chunk size matters and how you\'d choose one for a new RAG system.',
              answer:
                'Too-large chunks dilute relevance (a chunk mixing the relevant answer with unrelated surrounding text reduces retrieval precision and wastes context budget) and increase the chance a single chunk exceeds what\'s useful to include. Too-small chunks lose the surrounding context needed to interpret them correctly and increase the number of chunks needed to cover an answer, increasing the chance of missing one. There\'s no universal correct size — start with a size aligned to the document\'s natural structure (a paragraph, a subsection) rather than an arbitrary token count, evaluate retrieval quality (context precision/recall) empirically on a representative query set, and consider sentence-window retrieval to decouple retrieval-unit precision from generation-context breadth rather than trying to find one chunk size that serves both goals.',
            },
            {
              question: 'What\'s the difference between a bi-encoder and a cross-encoder, and why do production RAG systems use both?',
              answer:
                'A bi-encoder embeds the query and each document independently into the same vector space, allowing fast similarity search (embeddings can be precomputed for the whole corpus and compared via nearest-neighbor search) but with less accuracy, since the model never directly compares query and document together. A cross-encoder takes the query and a candidate document together as joint input and outputs a relevance score, capturing much richer interaction between them and giving materially better relevance judgments — but it must run once per query-document pair, making it too slow to run over an entire corpus. Production systems use a bi-encoder (vector search) to cheaply narrow a large corpus to a small candidate set, then a cross-encoder to re-rank just that small set precisely — getting both the cross-encoder\'s accuracy and the bi-encoder\'s speed.',
            },
            {
              question: 'Why is "just fine-tune the model on our knowledge base" usually the wrong first move when a team wants an LLM to know their proprietary/current information?',
              answer:
                'Fine-tuning is empirically better at teaching a model a consistent output style, format, or task-specific behavior than at reliably injecting new, precise factual knowledge — a fine-tuned model can still hallucinate or misremember facts from its fine-tuning data, and unlike RAG, there\'s no way to verify at answer-time which facts the model actually "knows" versus is inventing, nor any citation trail. It\'s also far more expensive and slower to iterate on (new/changed information requires re-fine-tuning) than RAG\'s approach of retrieving current information at query time, which can be updated by simply re-indexing a document. The correct default for "the model needs to know X" is RAG; fine-tuning is better reserved for changing the model\'s behavior/format/tone or specializing it to a narrow task pattern, tried only after prompting and RAG have been evaluated and found insufficient.',
            },
            {
              question: 'How would you debug a RAG system that\'s producing plausible-sounding but factually wrong answers?',
              answer:
                'Decompose the failure by pipeline stage rather than only looking at the final answer: first check whether the *right* chunks were even retrieved (a context recall failure — the correct source material never made it into the context, so the model had nothing to be faithful to and effectively fell back on parametric knowledge or fabrication); if retrieval looks correct, check faithfulness specifically (did the model\'s answer actually align with what the retrieved context said, or did it embellish/misread it — a generation-stage failure). These require different fixes: a retrieval failure points to chunking, embedding model quality, or missing hybrid/re-ranking; a generation failure points to prompt instructions (explicitly constrain the model to only use provided context, and to say when it\'s insufficient) or model capability. Running this diagnosis against an evaluation set with known-correct answers and expected source chunks (rather than eyeballing individual failures) is what makes this tractable at scale rather than anecdotal.',
            },
            {
              question: 'Explain "lost in the middle" and why it\'s a specific argument for retrieval over simply using a very large context window.',
              answer:
                'Empirical studies of long-context LLMs show that relevant information positioned in the middle of a very long context is attended to and recalled less reliably than information at the very beginning or end — performance on "find the needle in the haystack" tasks is U-shaped with respect to the needle\'s position, not flat. This means that simply pasting an entire large knowledge base into a huge context window doesn\'t guarantee the model will actually use the relevant part correctly, even if the context window is technically large enough to fit it — a strong argument for retrieval (surfacing only the most relevant, small set of chunks, ideally positioned prominently in the prompt) over "just make the context window bigger," since precision of what\'s included matters more than raw capacity once you exceed a modest size.',
            },
            {
              question: 'What\'s Reciprocal Rank Fusion and why is it used to combine vector and keyword search results instead of just averaging their raw scores?',
              answer:
                'Vector similarity scores (e.g., cosine similarity, roughly 0 to 1) and keyword/BM25 scores (an unbounded, corpus-and-query-dependent scale) are not on comparable scales, so directly averaging or summing them would let whichever method happens to produce larger numbers dominate the merged ranking regardless of actual relevance. Reciprocal Rank Fusion sidesteps this by ignoring the raw scores entirely and instead combining each result\'s *rank position* within its own list (typically `1 / (k + rank)` summed across the lists a document appears in) — since rank position is always a comparable, bounded ordinal regardless of how each underlying method computed it, RRF reliably merges rankings from fundamentally different scoring systems without needing to normalize incompatible scales.',
            },
          ],
        },
      ],
    },
  ],
}
