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
          id: 'embeddings-and-semantic-similarity',
          title: 'What Is a Vector Embedding, and Why Does Semantic Similarity Work?',
          summary:
            'Before anything else about RAG makes sense, you need the one trick every later concept is built on: mapping text to points in space so that "similar meaning" becomes "nearby points" — a geometric problem a computer can actually search efficiently.',
          keyPoints: [
            'An embedding is a list of numbers (a vector, typically hundreds to a few thousand dimensions) produced by a neural network trained so that meaning maps to geometry.',
            'Text with similar meaning lands at nearby points in that vector space, even when the words used are completely different ("puppy" and "dog" are close; "puppy" and "stock market" are far apart).',
            '"Nearby" is measured with **cosine similarity** (the angle between two vectors — ignores magnitude, just direction) or, less commonly, Euclidean distance or raw dot product.',
            'The embedding model is a separate, usually much smaller model than the one that generates answers — it is trained specifically to produce vectors useful for similarity comparison, not to write text.',
            'You must embed with the **same** model at query time that you used at ingestion time — vectors from two different embedding models are not comparable, even if both are high quality individually.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine trying to search a million documents for "what happened to the puppy" using plain string matching — you would miss every document that says "dog" instead of "puppy," every document that says "canine," and every document that phrases the same fact with completely different words. An **embedding model** solves this by converting text into a vector (a list of numbers) positioned in a high-dimensional space such that texts with similar *meaning* end up geometrically close together, regardless of which exact words were used. This is what makes **semantic search** possible: instead of matching characters, you are measuring distance between points that a model has learned to place according to meaning.',
            },
            {
              type: 'heading',
              text: 'A simplified 2D picture',
            },
            {
              type: 'p',
              text: 'Real embeddings have hundreds or thousands of dimensions and cannot be drawn directly, but projecting them down to two dimensions (as tools like t-SNE or UMAP do for visualization) gives the right intuition: words/phrases about the same topic cluster together, and unrelated topics form distant clusters.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Space["Embedding space (simplified to 2 dimensions)"]
        direction LR
        subgraph Animals["cluster: animals"]
            A1((dog))
            A2((puppy))
            A3((cat))
        end
        subgraph Finance["cluster: finance"]
            F1((stock))
            F2((market))
            F3((investment))
        end
    end
    A2 -. "cosine similarity ≈ 0.92 (close)" .-> A1
    A2 -. "cosine similarity ≈ 0.08 (far)" .-> F1`,
            },
            {
              type: 'heading',
              text: 'How similarity is actually measured',
            },
            {
              type: 'list',
              items: [
                '**Cosine similarity** — the cosine of the angle between two vectors, ranging from -1 (opposite) to 1 (identical direction). It ignores vector *length* and only cares about *direction*, which is why it is the default for text embeddings (length can vary with text length/normalization in ways unrelated to meaning).',
                '**Dot product** — similar to cosine similarity but also sensitive to vector magnitude; some embedding models are trained specifically so raw dot product works well, in which case it is slightly cheaper to compute than cosine (no normalization step).',
                '**Euclidean (L2) distance** — straight-line distance between two points; less common for text embeddings but standard for some other domains (e.g., image embeddings in certain pipelines).',
                'Retrieval finds the *k* nearest vectors to the query\'s embedding by whichever metric the embedding model and index were built for — mixing metrics (indexing with one, querying with another) silently degrades results.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Two practical rules that catch a large fraction of real-world "retrieval just doesn\'t work" bugs: (1) always embed the query with the exact same model used to embed the documents — never mix embedding models across ingestion and query time; (2) a general-purpose embedding model trained mostly on web text can underperform badly on narrow domains (legal, medical, code) — a domain-specific or fine-tuned embedding model is often the single highest-leverage fix for weak retrieval in a specialized domain.',
            },
          ],
        },
        {
          id: 'what-is-rag',
          title: 'Retrieval-Augmented Generation, in One Sentence Per Step',
          summary:
            'Strip away every implementation detail and RAG is four steps, repeated for every question: take the query, retrieve relevant text, add that text to the prompt, and let the model generate an answer grounded in it — everything else in this guide is about making steps two and three work well at scale.',
          keyPoints: [
            'Step 1 — a user asks a question.',
            'Step 2 — the system searches a knowledge base for text relevant to that question.',
            'Step 3 — the retrieved text is inserted into the prompt sent to the model, alongside the original question.',
            'Step 4 — the model generates its answer using the retrieved text as grounding, instead of relying only on knowledge baked into its weights during training.',
            'Chunking, embeddings, hybrid search, re-ranking, and evaluation are all refinements of steps 2 and 3 — none of them change this basic four-step shape.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Q["1. Query<br/>user asks a question"] --> R["2. Retrieve<br/>search the knowledge base"]
    R --> A["3. Augment<br/>insert retrieved text into the prompt"]
    A --> G["4. Generate<br/>model answers using that context"]
    G --> AN["Answer, grounded in retrieved text"]`,
            },
            {
              type: 'p',
              text: 'A useful analogy: an LLM answering purely from its training data is taking a **closed-book exam** — it can only use what it memorized, which may be outdated, incomplete, or simply never included the specific fact in question. RAG turns it into an **open-book exam** — the model is handed the relevant page(s) at question time and asked to answer from what is in front of it. This is precisely why RAG lets a knowledge base be updated (add, edit, or remove a document) without retraining or fine-tuning anything: the model\'s weights never change, only what gets handed to it at query time.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The rest of this guide fills in each step: the LLM mechanics that explain why grounding helps at all, how documents get split and embedded ahead of time (step 2\'s preparation), how retrieval is made fast and precise at scale (step 2 itself), how retrieved chunks are combined and ranked (step 3), how to measure whether any of this is actually working (evaluation), and patterns that go beyond this single fixed pass (advanced RAG).',
            },
          ],
        },
        {
          id: 'llm-fundamentals',
          title: 'LLM Fundamentals Interviewers Assume You Know',
          summary:
            'Before RAG\'s design decisions make sense, you need the handful of LLM mechanics that explain *why* it works: tokens as the real unit of cost, autoregressive generation, sampling controls, and precisely what hallucination is.',
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
          id: 'rag-pipeline-in-detail',
          title: 'The RAG Pipeline, Stage by Stage',
          summary:
            'With the one-sentence version in place, this is the same pipeline with its real architecture exposed: an offline ingestion pipeline that prepares the knowledge base, and an online query-time pipeline that runs on every request.',
          keyPoints: [
            'The model answers from retrieved context, not parametric (trained-in) knowledge — the knowledge base can update without retraining anything.',
            'Ingestion (offline) chunks and embeds documents into a vector database; query time embeds the query, retrieves, re-ranks, and assembles context.',
            'RAG reduces hallucination but does not eliminate it — retrieval can return irrelevant chunks, and the model can still misread or over-generalize from what it\'s given.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'RAG splits cleanly into two pipelines that run at completely different times and completely different rates: **ingestion**, run offline whenever the knowledge base changes (once, then incrementally as documents are added/updated), and **query time**, run synchronously on every single user request. Conflating the two is a common source of confusion — an ingestion-time decision (how you chunk) has query-time consequences (what gets retrieved), but the two pipelines themselves are architecturally and operationally separate.',
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
              text: 'This stage-by-stage decomposition is exactly how you should approach debugging a RAG system too: a bad answer is either a retrieval failure (wrong stage: ingestion, chunking, embedding, or the search itself) or a generation failure (the right context was retrieved but the model didn\'t use it correctly) — treating the whole pipeline as one opaque black box makes it undebuggable. The topics that follow walk this pipeline stage by stage.',
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
          title: 'Embedding Models and Vector Search in Production',
          summary:
            'Turning "embeddings place similar text nearby" into a working retrieval system means picking an embedding model and a place to store and search the vectors — and at real scale, exact search is too slow, so approximation becomes unavoidable.',
          keyPoints: [
            'Retrieval finds the *k* nearest neighbor vectors to the query\'s embedding.',
            'Approximate Nearest Neighbor (ANN) search — HNSW or IVF — trades a small amount of recall for a massive speed improvement at scale.',
            'Purpose-built vector DBs (Pinecone, Weaviate, Qdrant, Milvus) vs. vector-search-as-a-feature (pgvector, Elasticsearch/OpenSearch, Redis, MongoDB Atlas).',
            'Choose a bolt-on option when you already run that database and needs are modest; choose purpose-built when retrieval performance/scale is first-class or you need advanced features.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Once documents are embedded, retrieval finds the *k* nearest neighbor vectors to the query\'s embedding. Doing this by brute force — comparing the query vector against every single stored vector — is easy to reason about and perfectly accurate, but scales linearly with corpus size and becomes too slow once a collection reaches millions of vectors.',
            },
            {
              type: 'p',
              text: 'Production vector databases instead use **Approximate Nearest Neighbor (ANN)** algorithms — most commonly **HNSW** (Hierarchical Navigable Small World graphs) or **IVF** (Inverted File Index) — which trade a small amount of recall for a massive speed improvement, the right trade for nearly all real applications given how imprecise "relevance" itself already is. The next topic goes inside these two algorithms in detail.',
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
          id: 'vector-index-algorithms',
          title: 'Inside ANN Indexes: HNSW vs. IVF',
          summary:
            'HNSW and IVF both trade a little accuracy for a lot of speed, but they get there in structurally different ways — one builds a navigable graph, the other partitions space into clusters — and that difference drives real build-time, memory, and update tradeoffs worth knowing conceptually.',
          keyPoints: [
            'HNSW builds a multi-layer graph where higher layers are sparser "express lanes," letting search zoom in from coarse to fine, similar in spirit to a skip list.',
            'IVF partitions the vector space into clusters (via a k-means-like training step) and, at query time, only searches the clusters whose centroids are nearest the query vector.',
            'HNSW generally gives better recall/speed at query time but costs more memory and slower index builds; IVF is more memory-efficient and faster to build/update.',
            'Both expose a tunable accuracy/speed knob (HNSW: `ef_search` / `M`; IVF: `nprobe` / `nlist`) that trades recall for latency without re-architecting anything.',
            'Most managed vector databases default to HNSW (or a hybrid/optimized variant like DiskANN or ScaNN) today — you rarely implement the index yourself, but the tradeoffs directly explain the database\'s memory/latency/recall behavior.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'HNSW: Hierarchical Navigable Small World graphs',
            },
            {
              type: 'p',
              text: 'HNSW organizes vectors into several stacked graph layers. The top layer has very few nodes and long-range connections (a coarse "highway" map); each layer below is denser, down to the bottom layer, which contains every vector with short-range connections to its true nearest neighbors. A search starts at the top layer\'s entry point, greedily walks toward the query vector using the sparse long-range edges, then drops down a layer and repeats with progressively finer, shorter-range edges — conceptually similar to how a skip list finds an element in O(log n) by jumping through progressively denser layers instead of scanning linearly.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph L2["Layer 2 — sparse, long-range links"]
        A2((•)) --- B2((•))
    end
    subgraph L1["Layer 1 — medium density"]
        A1((•)) --- B1((•)) --- C1((•)) --- D1((•))
    end
    subgraph L0["Layer 0 — every vector, short-range links"]
        A0((•)) --- B0((•)) --- C0((•)) --- D0((•)) --- E0((•)) --- F0((•))
    end
    Query((query)) -.entry point.-> A2
    A2 -.descend.-> A1
    A1 -.descend.-> A0
    A0 -.-> C0
    C0 -.result.-> Result[[nearest neighbors found]]`,
            },
            {
              type: 'heading',
              text: 'IVF: Inverted File Index',
            },
            {
              type: 'p',
              text: 'IVF first clusters the entire vector collection into `nlist` groups (via a k-means-style training pass), storing each vector\'s ID under its assigned cluster (its "inverted list"). At query time, instead of searching every vector, IVF compares the query only against the `nprobe` cluster centroids nearest to it, then searches only inside those clusters — skipping the rest of the collection entirely. Fewer clusters searched means faster but less exhaustive (lower recall); more clusters searched trades speed back for recall.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Q((query vector)) --> Centroids{compare against<br/>all cluster centroids}
    Centroids --> C1[Cluster 1 — skipped]
    Centroids --> C2["Cluster 2 — nearest, searched (nprobe)"]
    Centroids --> C3["Cluster 3 — 2nd nearest, searched (nprobe)"]
    Centroids --> C4[Cluster 4 — skipped]
    C2 --> Candidates[Candidate vectors]
    C3 --> Candidates
    Candidates --> Result[[nearest neighbors found]]`,
            },
            {
              type: 'table',
              headers: ['', 'HNSW', 'IVF'],
              rows: [
                ['**Query speed / recall**', 'Very high recall at high speed; generally the stronger default', 'Good, but typically needs more clusters searched (`nprobe`) to match HNSW\'s recall'],
                ['**Memory footprint**', 'Higher — stores multiple graph layers and edge lists per vector', 'Lower — stores cluster assignments plus centroids, closer to the raw vectors\' own size'],
                ['**Index build time**', 'Slower to build — constructing the graph layer by layer is compute-intensive', 'Faster to build — a single clustering pass'],
                ['**Incremental updates**', 'Supports insertion, but can degrade graph quality over many updates without periodic rebuilding', 'New vectors are easy to assign to an existing cluster; periodic re-clustering keeps cluster boundaries accurate'],
                ['**Tuning knob**', '`M` (edges per node) and `ef_search` (search breadth) trade memory/speed for recall', '`nlist` (cluster count) and `nprobe` (clusters searched) trade speed for recall'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'You will rarely hand-implement HNSW or IVF — the value of understanding them is being able to reason about a vector database\'s actual behavior: why query latency rises when recall settings are tightened, why re-indexing a huge collection with HNSW can be slow, and why a memory-constrained deployment might reasonably choose IVF (or a quantized/disk-based variant) over HNSW\'s higher memory footprint.',
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
              type: 'mermaid',
              code: `flowchart LR
    Query[User Query] --> Vec["Vector search<br/>top 50 candidates"]
    Query --> KW["Keyword / BM25 search<br/>top 50 candidates"]
    Vec --> RRF["Reciprocal Rank Fusion<br/>merge by rank, not raw score"]
    KW --> RRF
    RRF --> Merged["Merged candidate set<br/>(bi-encoder speed)"]
    Merged --> CE["Cross-encoder re-ranker<br/>scores query + each candidate jointly"]
    CE --> Top["Top 5 → final context<br/>(cross-encoder accuracy)"]`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This two-stage "retrieve cheap, rerank precise" pattern is standard in production RAG because a cross-encoder (which jointly encodes query and document) is far more accurate at relevance judgment than a bi-encoder (which encodes query and document independently, as vector search does) but is too slow to run over an entire corpus.',
            },
          ],
        },
        {
          id: 'rag-failure-modes',
          title: 'Common RAG Failure Modes',
          summary:
            'Most "the RAG system gave a wrong answer" reports collapse into a small, recognizable set of failure modes, each with a different root cause and fix — recognizing which one you are looking at is most of the debugging work.',
          keyPoints: [
            'Near-miss chunks — text that is lexically or semantically similar to the query but actually answers a different question, retrieved with high confidence.',
            '"Lost in the middle" — the right chunk was retrieved, but buried among others, and the model under-weights it during generation.',
            'A stale index — the source document changed but the vector database was never re-indexed, so retrieval confidently returns outdated information.',
            'A fact split across chunk boundaries — only one of the two chunks containing half the needed information gets retrieved.',
            'Query/document vocabulary mismatch — the user\'s phrasing shares little overlap with how the source document phrases the same fact.',
            'Low precision from over-retrieval — irrelevant chunks are still passed to the model as context, diluting its focus and inflating cost without helping the answer.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A wrong RAG answer is rarely one single kind of bug — it is one of a handful of recognizable failure modes, each pointing to a different stage of the pipeline and a different fix.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Query --> Retrieve
    Retrieve -->|"❌ near-miss chunks"| Rerank
    Retrieve -->|"❌ stale index"| Rerank
    Rerank -->|"❌ lost in the middle"| Context[Assemble Context]
    Context -->|"❌ fact split across chunks"| Generate[Generate]
    Context -->|"❌ low precision, irrelevant padding"| Generate
    Generate --> Answer`,
            },
            {
              type: 'table',
              headers: ['Failure mode', 'Symptom', 'Typical fix'],
              rows: [
                ['Near-miss chunks', 'Answer is confidently wrong, cites text that sounds related but answers a different question', 'Hybrid search, better/domain-tuned embedding model, re-ranking with a cross-encoder'],
                ['Lost in the middle', 'The right chunk was in the context, but the model ignored or under-used it', 'Reduce the number of chunks included, put the most relevant chunk first/last, or use a model less sensitive to context position'],
                ['Stale index', 'Answer reflects an outdated version of a document that has since changed', 'Re-indexing pipeline triggered on document change, not just on a schedule'],
                ['Fact split across chunks', 'Answer is partially correct/incomplete, missing a detail that lived in a neighboring chunk', 'Larger chunk overlap, sentence-window retrieval, or document-structure-aware chunking'],
                ['Vocabulary mismatch', 'Retrieval returns nothing useful for a question phrased differently than the source text', 'Hybrid search, query rewriting/expansion, HyDE'],
                ['Over-retrieval / low precision', 'Correct chunk is present but diluted among noise; cost and latency also increase', 'Re-ranking, tighter top-k, better chunking granularity'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'It is tempting to treat every bad answer as a generation problem and reach for prompt tweaks first. In practice the majority of RAG failures are retrieval failures — the right text was never in the context at all — and no amount of prompt engineering fixes that; always check what was actually retrieved before touching the generation prompt.',
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
              text: 'Evaluating only the final answer conflates retrieval failures with generation failures and makes debugging impossible — decompose by pipeline stage instead, directly mirroring the failure modes above.',
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
              type: 'mermaid',
              code: `flowchart TD
    Start[User question] --> Decide{Model decides:<br/>do I need to retrieve?}
    Decide -->|No — model already knows| Generate[Generate directly]
    Decide -->|Yes| FormQuery[Model formulates a search query]
    FormQuery --> Retrieve[Retrieve chunks]
    Retrieve --> Sufficient{Model judges:<br/>enough to answer?}
    Sufficient -->|No — reformulate| FormQuery
    Sufficient -->|Yes| Generate
    Generate --> Answer`,
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
              question: 'In plain terms, what is a vector embedding, and why does "close together in embedding space" translate to "similar meaning"?',
              answer:
                'An embedding is a list of numbers produced by a neural network trained so that its outputs encode meaning geometrically — the model is trained on tasks where texts with similar meaning are pushed to have similar output vectors and texts with different meaning are pushed apart, typically via contrastive learning on pairs of related/unrelated text. The result is a coordinate system where distance (measured by cosine similarity, most commonly) between two points approximates semantic relatedness rather than lexical overlap, which is exactly why "puppy" and "dog" land close together even though they share no characters in common, while "puppy" and an unrelated topic land far apart.',
            },
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
              question: 'How do HNSW and IVF differ structurally, and how would you decide between them (or a database that uses one vs. the other)?',
              answer:
                'HNSW builds a multi-layer graph — a sparse, long-range-edge "highway" layer on top, progressively denser short-range layers below — and search greedily descends layer by layer from a coarse entry point to a precise neighborhood, similar in spirit to a skip list. IVF instead clusters the whole collection with a k-means-style pass and, at query time, compares the query only against cluster centroids, searching only the nearest `nprobe` clusters rather than every vector. In practice: HNSW tends to give better recall at a given query latency but costs more memory and slower index builds; IVF is more memory-efficient and faster/cheaper to build and update, at the cost of needing more clusters searched to match HNSW\'s recall. Most managed vector databases default to HNSW or an optimized variant today, but a memory-constrained or update-heavy deployment is a legitimate reason to prefer IVF.',
            },
            {
              question: 'Name three distinct RAG failure modes beyond "the model hallucinated," and how you\'d detect each in production.',
              answer:
                'First, near-miss retrieval — a chunk that is lexically or semantically similar to the query but actually answers a different question, detected by inspecting retrieved chunks against ground-truth relevant chunks (Context Precision) rather than only looking at the final answer. Second, a fact split across chunk boundaries, where the needed information is spread across two chunks and only one was retrieved, detected by noticing partially-correct-but-incomplete answers and checking whether the missing detail lived in a neighboring chunk that was not retrieved. Third, a stale index, where a source document changed but the vector database was never re-indexed, detected by comparing an answer\'s cited content against the current live source document rather than assuming the index is always current. All three point to a retrieval-stage problem, not a generation-stage one, which is why decomposing evaluation by pipeline stage rather than only scoring final answers is essential to catching them.',
            },
            {
              question: 'What\'s the difference between HyDE and multi-query expansion, and when would you reach for each?',
              answer:
                'Both are query transformation techniques applied before retrieval, but they solve slightly different problems. HyDE (Hypothetical Document Embeddings) asks the LLM to generate a hypothetical answer to the question first, then embeds that hypothetical answer — rather than the terse original question — for retrieval, since a fuller hypothetical answer is often closer in embedding space to how the real answer is phrased in the source documents than the original question is. Multi-query expansion instead generates several different rephrasings of the same question and retrieves for each, merging the results, which helps when the user\'s specific phrasing might not overlap well with any single retrieval path. HyDE is particularly useful when the vocabulary gap between questions and answers is large (e.g., a terse question vs. a verbose technical document); multi-query expansion is useful when you\'re unsure which phrasing will retrieve best and want to hedge across several.',
            },
            {
              question: 'When would GraphRAG meaningfully outperform standard vector-similarity RAG?',
              answer:
                'GraphRAG earns its added complexity specifically for multi-hop questions where the answer depends on traversing explicit relationships between entities rather than on any single passage being semantically similar to the query — for example "who approved the project that the manager of the person who filed this ticket is responsible for," where no single document chunk is likely to be semantically close to that compound question, but a knowledge graph built from the corpus can traverse the actual relationship chain (ticket → filer → filer\'s manager → projects they\'re responsible for → approver) directly. For questions answerable from a single relevant passage, GraphRAG adds graph-construction and maintenance overhead with little benefit over standard vector retrieval — it\'s a targeted tool for relational, multi-hop reasoning, not a general RAG upgrade.',
            },
            {
              question: 'Explain agentic RAG and how it differs from the standard retrieve-then-generate pipeline.',
              answer:
                'Standard RAG is a single fixed pass: always retrieve, always retrieve exactly once, always generate from whatever came back. Agentic RAG instead gives the model itself control over the retrieval step — the model decides whether retrieval is even needed for a given question, formulates its own search query (potentially different from the user\'s literal wording), evaluates whether what came back is actually sufficient to answer, and if not, reformulates and retrieves again, iterating until it judges it has enough to answer or hits an iteration limit. This turns retrieval from a fixed pipeline stage into a tool the model chooses to invoke, which is exactly the kind of conditional, cyclical control flow that a LangGraph-style agent loop is built to express, rather than a linear LCEL-style chain.',
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
