export const langgraphSection = {
  id: 'langgraph',
  label: 'LangGraph',
  icon: '🕸️',
  groups: [
    {
      id: 'langgraph-guide',
      label: 'Guide',
      topics: [
        {
          id: 'graphs-as-a-mental-model',
          title: 'The Mental Model: Nodes, Edges, and State',
          summary:
            'Before asking why LangGraph exists, get the underlying idea straight: a graph here is nothing more exotic than a set of steps (nodes), the connections that say what runs next (edges), and a shared object that flows through all of them (state).',
          keyPoints: [
            'A **node** is a function: it receives the current state and returns an update to it — nothing more.',
            'An **edge** decides which node runs next — either always the same next node (a fixed edge), or a choice made by inspecting the current state (a conditional edge).',
            '**State** is a single shared object every node reads from and writes to, rather than each step passing its own private return value directly to only the next step in a fixed chain.',
            'Unlike a strict linear pipeline (always A, then B, then C), a graph can loop back on itself, branch into different paths, and (in principle) run independent parts concurrently — because "what runs next" is a decision made at runtime, not a fixed sequence baked in ahead of time.',
            'This mental model is generic to graph-based orchestration in general — it is not specific to LangGraph or even to AI. LangGraph is this idea applied specifically to LLM application control flow.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'If you have ever sketched a flowchart on a whiteboard — boxes for steps, arrows for what happens next, and some shared notion of "where things stand" that the boxes read and update — you already have the entire mental model. The only new part is making that literal in code: an actual shared data structure (state), actual functions (nodes), and actual routing logic (edges) that a runtime executes.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    State[("Shared State<br/>(read + written by every node)")]
    Start([START]) --> A[Node A]
    A -.reads/writes.- State
    A -->|fixed edge| B[Node B]
    B -.reads/writes.- State
    B -->|conditional edge:<br/>state decides which way| C[Node C]
    B -->|conditional edge| End1([END])
    C -.reads/writes.- State
    C --> End2([END])`,
            },
            {
              type: 'heading',
              text: 'Two things that make this more than a flowchart',
            },
            {
              type: 'list',
              items: [
                '**State updates are merged, not passed.** A node does not hand its output to the next node; it returns a *partial update* (`{"field": value}`) that the runtime merges into the shared state using per-field rules called *reducers*. The next node then reads the merged state. This indirection is what lets several nodes run in parallel and still combine their results deterministically.',
                '**Every step can be saved.** Because all the information needed to continue lives in one serializable state object (plus "which nodes are due next"), the runtime can snapshot it after each step. That snapshot — a *checkpoint* — is what makes pause/resume, crash recovery, human approval and "time travel" debugging possible. A plain Python call stack cannot be serialized like that; a graph state can.',
              ],
            },
            {
              type: 'table',
              headers: ['Concept', 'Flowchart analogy', 'LangGraph realization'],
              rows: [
                ['Node', 'A box', 'A function `(state) -> partial update` (or a whole compiled subgraph)'],
                ['Fixed edge', 'An arrow', '`add_edge("a", "b")`'],
                ['Conditional edge', 'A diamond', '`add_conditional_edges("a", router)` or a node returning `Command(goto=...)`'],
                ['State', 'The whiteboard everyone writes on', 'A `TypedDict` / dataclass / Pydantic schema with per-field reducers'],
                ['Snapshot', 'A photo of the whiteboard', 'A checkpoint stored by a checkpointer, keyed by `thread_id`'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is deliberately abstract on purpose — the next topic explains concretely why LangChain\'s own pre-built "agent" abstraction did not already give application developers this level of control, and why a dedicated graph-based framework was built to expose it directly.',
            },
          ],
        },
        {
          id: 'why-langgraph',
          title: 'Why LangGraph Exists When LangChain Already Has "Agents"',
          summary:
            'Classic LangChain agents are a black-box while loop you don\'t control directly. LangGraph models an agent as an explicit instance of the node/edge/state graph from the previous topic, giving you the control flow of a real program instead of an opaque loop.',
          keyPoints: [
            'Classic LangChain agents (the ReAct loop, via `AgentExecutor`) run as a black-box `while` loop you don\'t control directly — hard to add custom branching logic, hard to persist and resume state, hard to have multiple agents collaborate with explicit handoffs, and hard to add a human-approval step in the middle of a run.',
            'LangGraph applies the node/edge/state model directly: you define the nodes, the edges between them, and the shared state object that flows through the graph, as real code you own and can inspect.',
            'Cycles are the structural feature that make LangGraph suited to agents specifically, not just fixed DAG pipelines — a tool-calling node can route back to the reasoning node repeatedly until the model decides it is done.',
            'Persistence (checkpointing) enables pause/resume, replay for debugging, and human-in-the-loop approval gates — covered in depth in later topics.',
            'Multi-agent orchestration models specialized agents as nodes/subgraphs with explicit, auditable routing/handoff logic, instead of implicit agent-to-agent calls buried inside one opaque loop.',
            'Since the 1.0 releases (late 2025) the relationship has inverted: LangChain\'s own agent, `create_agent`, is *built on* LangGraph. LangGraph is the low-level orchestration runtime; LangChain is the higher-level agent API on top of it. `AgentExecutor` is legacy.',
            'LangGraph is not mandatory for agents. If you do not need durability, human approval, branching beyond "did the model call a tool", or multi-agent routing, a plain loop or a prebuilt agent is simpler.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Classic LangChain agents (the ReAct loop) are a black-box `while` loop you don\'t control directly — hard to add custom branching logic, hard to persist and resume state, hard to have multiple agents collaborate with explicit handoffs, and hard to add a human-approval step in the middle of a run. **LangGraph models an agent as an explicit state machine** — a concrete instance of the node/edge/state graph from the previous topic — giving you the control flow of a real program instead of an opaque loop.',
            },
            {
              type: 'heading',
              text: 'What explicit control flow buys you',
            },
            {
              type: 'list',
              items: [
                '**Cycles**: unlike a DAG-based pipeline framework, LangGraph graphs can loop (a tool-calling node can route back to the reasoning node repeatedly until the model decides it\'s done) — this is the structural feature that makes it suited to agents specifically, not just fixed pipelines.',
                '**Persistence (checkpointing)**: LangGraph can persist state after every node execution (to memory, a DB, etc.), enabling pause/resume, replay for debugging, and — critically — **human-in-the-loop**: pause the graph at a specific node (e.g., before executing a risky tool call), wait for external human approval, then resume exactly where it left off.',
                '**Multi-agent orchestration**: model multiple specialized agents as nodes (or subgraphs) in the same graph, with explicit routing/handoff logic between them (a "supervisor" node that decides which specialist agent handles the next step, or agents that hand off directly to each other) — giving you an auditable, debuggable structure for what would otherwise be an implicit, hard-to-trace set of agent-to-agent calls.',
              ],
            },
            {
              type: 'mermaid',
              code: `stateDiagram-v2
    [*] --> Reason
    Reason --> ToolCall : model requests a tool
    Reason --> [*] : model has final answer
    ToolCall --> HumanApproval : if action is high-risk
    ToolCall --> Reason : if action is low-risk, result appended to state
    HumanApproval --> Reason : approved, result appended to state
    HumanApproval --> [*] : rejected, run halted`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When to reach for LangGraph over a plain ReAct agent: whenever you need explicit, auditable control flow — multi-agent handoffs, human approval gates, retry/branching logic that depends on more than "did the model call a tool," or the ability to pause and resume long-running agent sessions. For a simple single-agent tool-loop with no special control-flow requirements, a plain agent loop (or even a hand-rolled `while` loop over the raw API) is simpler and has less to learn/debug.',
            },
            {
              type: 'heading',
              text: 'Where LangGraph sits in the stack today',
            },
            {
              type: 'p',
              text: 'The ecosystem was reorganized around the 1.0 releases. It helps to keep three layers distinct, because interviewers (and docs) mix up the names constantly:',
            },
            {
              type: 'table',
              headers: ['Layer', 'What it is', 'Use it when'],
              rows: [
                ['LangChain `create_agent`', 'A prebuilt tool-calling agent loop with a middleware system (e.g. summarization, human approval, PII handling), compiled to a LangGraph graph under the hood', 'You want a standard agent quickly and the loop shape fits'],
                ['LangGraph (Graph API / Functional API)', 'The low-level runtime: state, reducers, nodes, edges, checkpoints, interrupts, streaming', 'You need custom control flow, multi-step workflows, or multi-agent topologies'],
                ['LangSmith Deployment (formerly LangGraph Platform)', 'Managed/self-hosted server runtime for graphs: task queue, persistence, threads/runs/crons APIs, streaming endpoints, Studio', 'You need to run long-lived, stateful agents in production without building that infrastructure yourself'],
              ],
            },
            {
              type: 'heading',
              text: 'When NOT to use LangGraph',
            },
            {
              type: 'list',
              items: [
                '**A single LLM call or a fixed prompt chain** — a graph adds ceremony and nothing else. Plain functions are easier to read and test.',
                '**Pure deterministic data pipelines** (ETL, batch jobs) — a workflow engine like Airflow, Dagster or Temporal has better scheduling, backfills and ops tooling. LangGraph is optimized for LLM-centric, interactive, partially non-deterministic control flow.',
                '**You already run a durable-execution platform** (e.g. Temporal) and your agent is one activity among many — you may prefer to keep orchestration there and use a thin agent loop inside it.',
                '**The team is not ready for the mental model** — reducers, super-steps, and resume semantics are a real learning curve. A misunderstood framework is worse than a simple loop you fully understand.',
              ],
            },
          ],
        },
        {
          id: 'core-primitives-stategraph',
          title: 'LangGraph\'s Core Primitives: StateGraph, Nodes, Edges, and Checkpointing',
          summary:
            'The concrete mechanics behind the mental model: how you actually define a shared state schema, register nodes and edges, and turn the definition into a runnable, persistable application.',
          keyPoints: [
            '`StateGraph(StateSchema)` is the graph builder — the schema (a `TypedDict` or Pydantic model) declares every field the shared state carries.',
            '`add_node(name, fn)` registers a node; `add_edge(a, b)` wires a fixed transition; `add_conditional_edges(a, router_fn, {...})` wires a branching transition decided by a function that inspects the state.',
            'A **reducer** (e.g., `Annotated[list, add_messages]`) tells LangGraph how to *merge* a node\'s returned update into existing state for that field, instead of simply overwriting it — essential for fields like message history that should append, not replace.',
            '`add_edge(START, "node")` marks where execution begins (the idiomatic form; `set_entry_point` still works); routing to `END` ends that branch of execution.',
            '`.compile(checkpointer=...)` turns the builder into a runnable, immutable graph (a Pregel instance) — and, given a checkpointer, persists state at every super-step, which is what enables pause/resume, replay, and human-in-the-loop.',
            'Nodes can also accept a `runtime: Runtime[Context]` argument to read per-run, non-state context (user id, model choice, DB handles) declared via `StateGraph(State, context_schema=Context)` — keep config out of state.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'a minimal StateGraph — the same tool-loop as a real graph',
              code: `from typing import Annotated, TypedDict
from langchain_core.messages import AnyMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import InMemorySaver

class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]   # append/merge, not overwrite

tools = [search_docs, get_weather]              # @tool-decorated functions
model_with_tools = model.bind_tools(tools)       # any chat model that supports tool calling

def call_model(state: AgentState):
    response = model_with_tools.invoke(state["messages"])
    return {"messages": [response]}              # a PARTIAL update, merged by the reducer

builder = StateGraph(AgentState)
builder.add_node("agent", call_model)
builder.add_node("tools", ToolNode(tools))       # executes every tool call in the last AI message
builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", tools_condition)   # -> "tools" or END
builder.add_edge("tools", "agent")               # the cycle: tool results flow back to reasoning

graph = builder.compile(checkpointer=InMemorySaver())   # dev only; use Postgres/SQLite in prod

config = {"configurable": {"thread_id": "user-42-session-1"}}
result = graph.invoke({"messages": [("user", "Weather in Pune?")]}, config)
print(result["messages"][-1].content)`,
            },
            {
              type: 'p',
              text: '`ToolNode` and `tools_condition` are small prebuilt helpers in `langgraph.prebuilt` — they are not the deprecated prebuilt *agent*. Writing them by hand is a good exercise: the router just checks whether the last AI message has `tool_calls`, and the tool node looks up each requested tool by name, runs it, and returns one `ToolMessage` per call with the matching `tool_call_id`.',
            },
            {
              type: 'p',
              text: 'This compiles to a concrete graph structure — the same shape described abstractly in the mental-model topic, now with real nodes and a real conditional edge:',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    START([START]) --> Agent["agent node<br/>(call_model)"]
    Agent --> Decide{"should_continue<br/>(conditional edge)"}
    Decide -->|tool_calls present| Tools["tools node<br/>(execute requested tools)"]
    Decide -->|no tool_calls| ENDN([END])
    Tools -->|fixed edge| Agent`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Why a reducer matters: by default, a node\'s returned dict *replaces* the corresponding state field entirely. For `messages`, that would mean every model call wipes out the prior conversation instead of extending it. `Annotated[list, add_messages]` tells LangGraph to use the `add_messages` function to merge a node\'s returned messages into the existing list (appending, and de-duplicating/updating by message ID) instead of overwriting it — the same idea applies to any field where "merge" is the correct semantics rather than "replace."',
            },
            {
              type: 'heading',
              text: 'Choosing reducers deliberately',
            },
            {
              type: 'table',
              headers: ['Field semantics', 'Reducer', 'Example'],
              rows: [
                ['Current value (last write wins)', 'none (default overwrite)', '`status: str`, `plan: list[str]` that is fully rewritten'],
                ['Chat history with ids', '`add_messages`', '`messages: Annotated[list[AnyMessage], add_messages]` (or subclass `MessagesState`)'],
                ['Accumulate items from parallel branches', '`operator.add`', '`findings: Annotated[list[str], operator.add]`'],
                ['Counters / merges', 'a custom function `(old, new) -> merged`', 'dict-merge, dedupe-by-key, max(), capped-length list'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'custom reducer, input/output schemas, and runtime context',
              code: `import operator
from dataclasses import dataclass
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.runtime import Runtime

def keep_last_20(old: list[str], new: list[str]) -> list[str]:
    return (old + new)[-20:]          # bounded growth: protects against state bloat

class State(TypedDict):
    question: str
    notes: Annotated[list[str], keep_last_20]
    sources: Annotated[list[str], operator.add]
    answer: str

class InputState(TypedDict):          # what callers may pass in
    question: str

class OutputState(TypedDict):         # what callers get back
    answer: str

@dataclass
class Context:                        # per-run config, NOT persisted in state
    user_id: str
    model_name: str = "default"

def research(state: State, runtime: Runtime[Context]):
    hits = search(state["question"], user=runtime.context.user_id)
    return {"sources": [h.url for h in hits], "notes": [h.summary for h in hits]}

def write(state: State):
    return {"answer": summarize(state["question"], state["notes"])}

builder = StateGraph(State, input_schema=InputState, output_schema=OutputState,
                     context_schema=Context)
builder.add_node("research", research)
builder.add_node("write", write)
builder.add_edge(START, "research")
builder.add_edge("research", "write")
builder.add_edge("write", END)
graph = builder.compile()

graph.invoke({"question": "What changed in v2?"}, context={"user_id": "u-42"})`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Do not put clients, DB connections, API keys or the current user into state. State is serialized into every checkpoint: non-serializable objects break persistence, secrets leak into your checkpoint store, and large blobs make every super-step slower. Put that information in the runtime context (or close over it when building nodes) and keep state to the data the workflow is actually *about*.',
            },
          ],
        },
        {
          id: 'execution-model-supersteps',
          title: 'Under the Hood: Pregel, Super-Steps, and Parallelism',
          summary:
            'A compiled LangGraph is a Pregel-style message-passing program that runs in discrete, transactional super-steps. Understanding that model explains parallel fan-out, concurrent-write errors, the recursion limit, and exactly what a checkpoint contains.',
          keyPoints: [
            'Execution proceeds in **super-steps**. In each super-step, every node that was triggered runs (in parallel if there are several), their updates are applied to state via reducers, and then the next set of triggered nodes is computed.',
            'A super-step is **transactional**: if any node in it raises, none of that step\'s updates are applied (writes from nodes that already succeeded are saved as *pending writes* so they are not re-run on retry).',
            'Two parallel nodes writing the same key **without a reducer** raise `InvalidUpdateError` — the runtime refuses to guess which write wins.',
            '`Send(node, payload)` from a conditional edge creates a dynamic number of parallel tasks (map-reduce), each with its own input.',
            'The **recursion limit** caps the number of super-steps per run and raises `GraphRecursionError` when exceeded. The docs state the default is 1000 from version 1.0.6 (it was 25 in earlier versions); set it per call with `config={"recursion_limit": n}`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'LangGraph\'s runtime is modeled on Google\'s **Pregel** (bulk synchronous parallel) system. Nodes are "actors" that subscribe to *channels* (the state keys). When a channel a node subscribes to is updated, that node becomes eligible to run in the next super-step. The runtime then runs all eligible nodes, collects their writes, applies them to the channels through each channel\'s reducer, saves a checkpoint, and repeats until no node is eligible (or the limit is hit). That is why the API feels like "functions returning partial dicts": a node never mutates shared state directly; it emits writes that the runtime applies between steps.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph S1["Super-step 1"]
        P["plan"]
    end
    subgraph S2["Super-step 2 (parallel)"]
        A["search_web"]
        B["search_docs"]
        C["search_tickets"]
    end
    subgraph S3["Super-step 3"]
        M["merge_and_answer"]
    end
    P --> A
    P --> B
    P --> C
    A --> M
    B --> M
    C --> M
    S1 -.checkpoint.-> CK1[("ckpt 1")]
    S2 -.checkpoint.-> CK2[("ckpt 2")]
    S3 -.checkpoint.-> CK3[("ckpt 3")]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'map-reduce fan-out with Send',
              code: `import operator
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send

class State(TypedDict):
    topics: list[str]
    summaries: Annotated[list[str], operator.add]   # REQUIRED: parallel writers
    report: str

class TopicState(TypedDict):
    topic: str

def plan(state: State):
    return {"topics": ["pricing", "latency", "security"]}

def fan_out(state: State):
    # one parallel task per topic, each receiving its own private input
    return [Send("summarize", {"topic": t}) for t in state["topics"]]

def summarize(state: TopicState):
    return {"summaries": [llm_summarize(state["topic"])]}

def reduce(state: State):
    return {"report": "\\n".join(state["summaries"])}

builder = StateGraph(State)
builder.add_node("plan", plan)
builder.add_node("summarize", summarize)
builder.add_node("reduce", reduce)
builder.add_edge(START, "plan")
builder.add_conditional_edges("plan", fan_out, ["summarize"])
builder.add_edge("summarize", "reduce")    # reduce waits for all parallel tasks
builder.add_edge("reduce", END)
graph = builder.compile()`,
            },
            {
              type: 'table',
              headers: ['Symptom', 'Root cause in the execution model', 'Fix'],
              rows: [
                ['`InvalidUpdateError` on a key', 'Two nodes in the same super-step wrote it and it has no reducer', 'Add a reducer (`operator.add`, custom merge) or write to different keys'],
                ['`GraphRecursionError`', 'A cycle never reached `END` within the step limit', 'Add an explicit stop condition (max iterations in state, `RemainingSteps`), not just a higher limit'],
                ['Join node runs "too early" or twice', 'Branches of different lengths reach the join in different super-steps', 'Make branches equal length, or use `add_edge(["a", "b"], "join")` to wait for all listed nodes'],
                ['Order of list items differs between runs', 'Parallel writes are applied in a deterministic but not "arrival time" order', 'Do not rely on order from parallel branches; sort or key results'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer stopping loops *gracefully*. Declare `remaining_steps: RemainingSteps` (from `langgraph.managed`) in state and have your router return a "wrap up" path when it gets low, instead of letting the run die with `GraphRecursionError` and a half-finished answer. Also keep an explicit `iterations` counter for business rules like "at most 3 revision rounds".',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Parallel nodes in a super-step run concurrently (threads for sync nodes, tasks for async nodes). That is real concurrency: shared mutable objects captured by closures (a list, a client with internal state) need the same care as in any concurrent program. Communicate through state writes, not side channels.',
            },
          ],
        },
        {
          id: 'persistence-checkpointers-time-travel',
          title: 'Persistence: Checkpointers, Threads, Durability, and Time Travel',
          summary:
            'Checkpointers turn a graph run into a durable, inspectable history of snapshots keyed by thread. This topic covers which checkpointer to use, what a checkpoint contains, durability modes, and how to inspect, edit, replay and fork past states.',
          keyPoints: [
            'A **thread** (`config["configurable"]["thread_id"]`) is one conversation/run history. Every super-step writes a **checkpoint** (a `StateSnapshot`: values, next nodes, metadata, pending tasks/interrupts, parent checkpoint id) to that thread.',
            'Pick the checkpointer by environment: `InMemorySaver` for tests and notebooks, SQLite for local single-process apps, Postgres (`langgraph-checkpoint-postgres`) for production. The managed deployment provides persistence for you.',
            '`graph.get_state(config)` reads the latest snapshot; `graph.get_state_history(config)` walks backwards through all of them; `graph.update_state(config, values, as_node=...)` writes a new checkpoint as if a node had produced it.',
            '**Time travel**: invoking with a past `checkpoint_id` replays from that point; updating state at a past checkpoint and then invoking creates a **fork** — a new branch of history — without destroying the original.',
            '**Durability modes** (`durability="exit" | "async" | "sync"` on invoke/stream) trade write latency for crash safety. They replaced the older `checkpoint_during` flag.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'production checkpointer setup (Postgres)',
              code: `from langgraph.checkpoint.postgres import PostgresSaver

DB_URI = "postgresql://app:secret@db:5432/agents"   # load from env/secret manager in real code

with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    checkpointer.setup()          # creates tables; run once (e.g. in a migration step)
    graph = builder.compile(checkpointer=checkpointer)

    config = {"configurable": {"thread_id": "ticket-8812"}}
    graph.invoke({"messages": [("user", "Refund order 991")]}, config)

# async apps: AsyncPostgresSaver from langgraph.checkpoint.postgres.aio`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'inspecting, replaying and forking a thread',
              code: `config = {"configurable": {"thread_id": "ticket-8812"}}

snapshot = graph.get_state(config)
print(snapshot.values)      # current state
print(snapshot.next)        # nodes due to run next (empty tuple = finished)

history = list(graph.get_state_history(config))    # newest first
before_tool = next(s for s in history if s.next == ("tools",))

# 1) Replay: re-run everything after that checkpoint
graph.invoke(None, before_tool.config)

# 2) Fork: change state at that point, then continue on a new branch
fork_config = graph.update_state(
    before_tool.config,
    {"messages": [corrected_ai_message]},   # goes through reducers like a node write
)
graph.invoke(None, fork_config)`,
            },
            {
              type: 'table',
              headers: ['Durability mode', 'When checkpoints are written', 'Trade-off'],
              rows: [
                ['`"exit"`', 'Only when the run finishes, errors, or interrupts', 'Fastest; a crash mid-run loses intermediate progress'],
                ['`"async"`', 'In the background while the next step runs', 'Good performance; small window where a crash loses the latest step'],
                ['`"sync"`', 'Before the next step starts', 'Strongest guarantee; adds write latency to every step'],
              ],
            },
            {
              type: 'heading',
              text: 'Durable execution and idempotency',
            },
            {
              type: 'p',
              text: 'Durable execution means a run that fails (process crash, deploy, timeout) can be resumed from the last checkpoint instead of starting over. The catch: resume granularity is the **node** (or the **task** in the Functional API). Any work inside a node that ran before the failure *will run again*. So the senior rule is: make side effects idempotent (idempotency keys on payments/tickets/emails, upserts instead of inserts), isolate each side effect in its own node or `@task` so its completion is recorded, and keep nodes deterministic in their control flow so a replay takes the same path.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**State bloat** is the most common production problem with checkpointers. Each checkpoint stores the channel values that changed, and long agent threads with large tool outputs (whole web pages, PDFs, query results) grow the checkpoint tables quickly and slow every load. Store large artifacts in object storage and keep a reference in state, trim or summarize message history, and set a retention/TTL policy for old threads.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Thread ids are an authorization boundary. Anyone who can supply a `thread_id` can read and resume that state. Derive thread ids server-side and check that the caller owns the thread; never trust a thread id straight from the browser.',
            },
          ],
        },
        {
          id: 'human-in-the-loop-patterns',
          title: 'Human-in-the-Loop: Interrupts and Approval Gates',
          summary:
            'Some actions an agent might take are too risky to run unsupervised. LangGraph\'s `interrupt()` lets a running graph pause mid-node, hand a payload to a human, persist everything, and later resume with the human\'s answer — the mechanism behind every "approve / edit / reject this action" pattern.',
          keyPoints: [
            '`interrupt(payload)`, called inside a node, raises a special signal that pauses the run, saves a checkpoint, and surfaces `payload` to the caller (in `invoke()` results under the `__interrupt__` key; as an event in streams).',
            'Resuming happens by invoking the graph again with `Command(resume=value)` and the **same `thread_id`**. Crucially, the **node restarts from its beginning**; when execution reaches the `interrupt()` call again, it returns `value` instead of pausing.',
            'Because the node re-runs, any code *before* `interrupt()` executes twice. Side effects there must be idempotent — or move them after the interrupt or into a separate node.',
            'Multiple `interrupt()` calls in one node are matched to resume values **by order**, so do not make the number or order of interrupts depend on non-deterministic data. Never wrap `interrupt()` in a bare `try/except` — it would swallow the pause signal.',
            'A **checkpointer is mandatory**. Static breakpoints (`interrupt_before` / `interrupt_after`) still exist but the docs position them as a debugging tool, not as the way to build human-in-the-loop workflows.',
            'Common decision types: **approve**, **edit** (human modifies the tool arguments), **reject with feedback** (goes back to the model), and **respond** (human supplies information the agent asked for).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'approve / edit / reject a tool call, then resume',
              code: `from typing import Literal
from langgraph.types import interrupt, Command

def review_tool_call(state: AgentState) -> Command[Literal["tools", "agent"]]:
    tool_call = state["messages"][-1].tool_calls[0]

    # Everything above this line re-runs on resume — keep it pure.
    decision = interrupt({
        "question": "Approve this action?",
        "tool": tool_call["name"],
        "args": tool_call["args"],
    })

    if decision["type"] == "approve":
        return Command(goto="tools")
    if decision["type"] == "edit":
        edited = {**tool_call, "args": decision["args"]}
        ai_msg = state["messages"][-1].model_copy(update={"tool_calls": [edited]})
        return Command(goto="tools", update={"messages": [ai_msg]})   # same id -> replaced
    # reject: tell the model why, let it re-plan
    return Command(goto="agent", update={"messages": [{
        "role": "tool", "tool_call_id": tool_call["id"],
        "content": f"Rejected by reviewer: {decision.get('reason', '')}",
    }]})

graph = builder.compile(checkpointer=checkpointer)
config = {"configurable": {"thread_id": "run-1"}}

result = graph.invoke({"messages": [("user", "Close all P3 tickets")]}, config)
if "__interrupt__" in result:
    pending = result["__interrupt__"][0]
    show_in_review_ui(pending.value)     # your UI; the process can exit here

# ...minutes or days later, possibly in another process...
graph.invoke(Command(resume={"type": "approve"}), config)`,
            },
            {
              type: 'p',
              text: 'Notice that the approval node returns `Command(goto=...)` with a `Literal[...]` return annotation. The annotation tells the compiler which edges can exist (for rendering and validation); the `Command` both routes and updates state in one atomic step, which keeps "what the human decided" and "where we go next" from drifting apart.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Graph as LangGraph app
    participant Store as Checkpointer
    participant Human as Human reviewer (UI)
    Graph->>Graph: run nodes... reach approval node
    Graph->>Store: interrupt() pauses execution, state persisted
    Graph-->>Human: proposed action surfaced to a UI
    Human->>Human: reviews the proposed action
    Human->>Graph: invoke(Command(resume="approve"))
    Graph->>Store: load persisted state for this thread_id
    Graph->>Graph: re-run the paused node from its start
    Graph->>Graph: interrupt() now returns "approve", node continues`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A checkpointer is not optional here — `interrupt()` relies on the graph\'s state having been persisted so a later, possibly entirely separate process invocation can resume it via the same `thread_id`. Compiling a graph without a checkpointer and calling `interrupt()` inside it will not give you a durable pause; there is nothing for a later `Command(resume=...)` call to resume from.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The classic resume bug: a node that sends an email (or creates a ticket, or charges a card) and *then* calls `interrupt()` for confirmation. On resume the node restarts, so the email is sent twice. Put the side effect in a node *after* the approval node, or guard it with an idempotency key.',
            },
            {
              type: 'table',
              headers: ['Mechanism', 'Where it is declared', 'Best for'],
              rows: [
                ['`interrupt()` inside a node', 'In node code, conditionally', 'Real human-in-the-loop: approvals, edits, asking the user for missing info'],
                ['`interrupt_before` / `interrupt_after`', 'At compile time (or per call)', 'Debugging and stepping through a graph'],
                ['Human-approval middleware in `create_agent`', 'Agent configuration', 'Approval of specific tool calls in a prebuilt agent without writing nodes'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If several parallel nodes each call `interrupt()`, the run surfaces all of them at once. Each interrupt has an `id`; resume them together by passing a mapping of interrupt id to value in a single `Command(resume={...})`.',
            },
          ],
        },
        {
          id: 'memory-short-term-long-term-store',
          title: 'Memory: Short-Term Thread State vs Long-Term Store',
          summary:
            'Checkpointers give you memory *within* a thread; the Store gives you memory *across* threads (user preferences, learned facts, shared knowledge). Production agents need both, plus a strategy to keep the context window under control.',
          keyPoints: [
            '**Short-term memory** = the thread\'s checkpointed state (usually the message list). It is scoped to one `thread_id` and disappears from the model\'s view in a new thread.',
            '**Long-term memory** = a `BaseStore` (e.g. `InMemoryStore`, `PostgresStore`) passed at `compile(store=...)`. Items are JSON documents organized by **namespace** tuples like `(user_id, "memories")` and a key.',
            'Stores support `put`, `get`, `search` (with optional metadata filters), and — when configured with an embedding index — **semantic search** via `search(namespace, query=..., limit=...)`.',
            'Inside a node, reach the store through the `Runtime` object (`runtime.store`), and read identifiers like `user_id` from `runtime.context` — not from user-controlled message text.',
            'Manage context growth with trimming (`trim_messages`), deletion (return `RemoveMessage(id=...)` through the `add_messages` reducer), or summarization into a separate state field.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph T1["Thread A (Monday)"]
        A1["messages..."]
    end
    subgraph T2["Thread B (Friday)"]
        B1["messages..."]
    end
    CK[("Checkpointer<br/>per-thread state")]
    ST[("Store<br/>namespace: user-42, memories")]
    T1 --- CK
    T2 --- CK
    T1 -- "write: prefers metric units" --> ST
    ST -- "search at start of turn" --> T2`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'reading and writing long-term memories from a node',
              code: `import uuid
from dataclasses import dataclass
from langgraph.graph import StateGraph, MessagesState, START
from langgraph.runtime import Runtime
from langgraph.store.memory import InMemoryStore   # PostgresStore in production

@dataclass
class Context:
    user_id: str

def call_model(state: MessagesState, runtime: Runtime[Context]):
    ns = (runtime.context.user_id, "memories")
    last = state["messages"][-1].content
    memories = runtime.store.search(ns, query=last, limit=5)     # semantic recall
    facts = "\\n".join(f"- {m.value['text']}" for m in memories)

    response = model.invoke(
        [{"role": "system", "content": f"Known facts about the user:\\n{facts}"}]
        + state["messages"]
    )

    if wants_to_remember(last):      # your own extraction logic / LLM call
        runtime.store.put(ns, str(uuid.uuid4()), {"text": extract_fact(last)})
    return {"messages": [response]}

store = InMemoryStore(index={"embed": embeddings, "dims": 1536})   # dims must match the model
builder = StateGraph(MessagesState, context_schema=Context)
builder.add_node("call_model", call_model)
builder.add_edge(START, "call_model")
graph = builder.compile(checkpointer=checkpointer, store=store)

graph.invoke(
    {"messages": [("user", "I'm vegetarian, plan dinner")]},
    {"configurable": {"thread_id": "t-1"}},
    context={"user_id": "user-42"},
)`,
            },
            {
              type: 'table',
              headers: ['Memory type', 'Example', 'Typical write strategy'],
              rows: [
                ['Semantic (facts)', '"User is vegetarian", "Prod DB is Postgres 16"', 'Extract facts in the hot path or a background job; dedupe/update existing items'],
                ['Episodic (experiences)', 'A past successful resolution of a similar ticket', 'Store compact summaries of completed runs; retrieve as few-shot examples'],
                ['Procedural (how to behave)', 'Refined system-prompt instructions for this user/team', 'Update rarely, with review — it changes behavior for every future run'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'keeping short-term memory bounded: summarize and delete',
              code: `from langchain.messages import RemoveMessage
from langgraph.graph import MessagesState

class State(MessagesState):
    summary: str

def summarize_if_long(state: State):
    msgs = state["messages"]
    if len(msgs) <= 20:
        return {}
    older, recent = msgs[:-6], msgs[-6:]
    summary = model.invoke(
        f"Existing summary: {state.get('summary', '')}\\n"
        f"Extend it with these messages: {older}"
    ).content
    # RemoveMessage goes through add_messages and deletes by id
    return {"summary": summary, "messages": [RemoveMessage(id=m.id) for m in older]}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'When trimming or deleting messages, never split an AI message that has `tool_calls` from its matching `ToolMessage` results. Most provider APIs reject a history where a tool result has no preceding tool call (or vice versa). Cut on turn boundaries.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Long-term memory is a privacy and prompt-injection surface. Anything written to the store is replayed into future prompts, so a malicious document that tricks the agent into "remembering" an instruction becomes a persistent injection. Validate what you write, namespace strictly by tenant/user, and provide a way to inspect and delete a user\'s memories.',
            },
          ],
        },
        {
          id: 'streaming-modes',
          title: 'Streaming: Tokens, State Updates, and Custom Progress Events',
          summary:
            'Agents are slow; users tolerate slowness when they can see progress. LangGraph can stream several kinds of data at once — LLM tokens, per-node updates, full state, and your own custom events — including from inside subgraphs.',
          keyPoints: [
            '`graph.stream(...)` / `graph.astream(...)` accept a `stream_mode` (or a list of modes). The core modes are `values`, `updates`, `messages`, `custom`, and `debug`; newer versions also expose `checkpoints` and `tasks`.',
            '`messages` streams LLM tokens as `(message_chunk, metadata)` pairs from any chat model call inside any node — the metadata tells you which node produced it, so you can show only the final answer node\'s tokens.',
            '`custom` streams anything you emit with `get_stream_writer()` (from `langgraph.config`) — ideal for "Searching 3 sources…" progress messages from inside long nodes or tools.',
            'Pass `subgraphs=True` to also receive events from nested graphs, tagged with a namespace showing where they came from.',
            'Recent releases add a typed event-streaming API that the docs recommend for new apps; the `stream_mode`-based API remains supported. Check your installed version before copying examples.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['stream_mode', 'What you receive', 'Typical UI use'],
              rows: [
                ['`values`', 'Full state after each super-step', 'Simple apps, debugging, rendering the whole state'],
                ['`updates`', 'Only `{node_name: update}` per step', 'Progress timelines ("retrieved docs", "called tool X")'],
                ['`messages`', 'LLM token chunks + metadata', 'Typing effect in chat UIs'],
                ['`custom`', 'Whatever you emit with the stream writer', 'Progress bars, intermediate artifacts'],
                ['`debug`', 'Very detailed execution events', 'Local debugging only'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'streaming tokens and custom progress together',
              code: `from langgraph.config import get_stream_writer

def research(state: State):
    writer = get_stream_writer()
    results = []
    for i, source in enumerate(SOURCES, 1):
        writer({"progress": f"Searching {source} ({i}/{len(SOURCES)})"})
        results.extend(search(source, state["question"]))
    return {"docs": results}

for mode, chunk in graph.stream(
    {"question": "Why did p95 latency spike?"},
    config,
    stream_mode=["messages", "custom"],
):
    if mode == "custom":
        ui.show_status(chunk["progress"])
    elif mode == "messages":
        token, meta = chunk
        if meta["langgraph_node"] == "answer":     # hide tokens from internal LLM calls
            ui.append_token(token.content)`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Filter token streams by node (or by tags you attach to a model) — otherwise your users see the raw output of routers, graders and planners as if it were the answer. This is one of the most common "why is my chat UI showing JSON?" bugs.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Streaming and persistence compose: if the client disconnects mid-stream, the run (on a server deployment) can continue in the background and the client can later re-join the thread and read the final state from the checkpoint. Design your API so that "stream" is a view onto a run, not the run itself.',
            },
          ],
        },
        {
          id: 'multi-agent-patterns-langgraph',
          title: 'Multi-Agent Patterns in LangGraph',
          summary:
            'Beyond a single agent looping on its own, LangGraph composes multiple specialized agents as nodes or entire subgraphs with explicit routing between them — most commonly via a supervisor node that decides who acts next.',
          keyPoints: [
            'The simplest multi-agent shape is a **supervisor** node that inspects the state/task and routes (via a conditional edge, or by returning a `Command`) to one of several specialized worker nodes, then routes back to itself to decide the next step or to finish.',
            'A worker can itself be an entire subgraph — a fully compiled `StateGraph` used as a single node in a larger graph — which is how LangGraph composes complex multi-agent systems out of smaller, independently built and tested graphs.',
            '`Command` can update state *and* specify the next node to route to in a single return value, which is what makes direct agent-to-agent handoffs (not only supervisor-mediated ones) straightforward to express.',
            'A subgraph can share keys with the parent (add it directly as a node — shared keys are passed through) or use a completely different schema, in which case you call it from inside a wrapper node that maps parent state in and the result back out — deliberately limiting what a worker agent can see or change.',
            'From inside a subgraph, `Command(goto="other_agent", graph=Command.PARENT)` hands control to a sibling node in the parent graph — the basis of "swarm"-style handoffs.',
            'The same auditability argument from "why LangGraph exists" applies here concretely: every handoff between agents is a visible edge/state transition in the graph, not an implicit function call buried inside one agent\'s internal reasoning.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'a supervisor routing to specialized worker subgraphs',
              code: `from typing import Literal
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from langgraph.types import Command

class Route(BaseModel):
    next: Literal["researcher", "writer", "FINISH"]
    reason: str

router_llm = model.with_structured_output(Route)

def supervisor(state: AgentState) -> Command[Literal["researcher", "writer", "__end__"]]:
    if state.get("handoffs", 0) >= 6:                  # hard business limit, not just recursion_limit
        return Command(goto=END)
    route = router_llm.invoke([SUPERVISOR_PROMPT, *state["messages"]])
    target = END if route.next == "FINISH" else route.next
    return Command(goto=target,
                   update={"last_route": route.reason, "handoffs": state.get("handoffs", 0) + 1})

builder = StateGraph(AgentState)
builder.add_node("supervisor", supervisor)
builder.add_node("researcher", researcher_graph)   # a compiled graph used as a node
builder.add_node("writer", writer_graph)           # (shares the "messages" key with the parent)
builder.add_edge(START, "supervisor")
builder.add_edge("researcher", "supervisor")       # workers always report back
builder.add_edge("writer", "supervisor")
graph = builder.compile(checkpointer=checkpointer)  # subgraphs inherit the parent's checkpointer`,
            },
            {
              type: 'p',
              text: 'The `Command[Literal[...]]` return annotation is not decoration: because routing happens inside the node rather than via `add_conditional_edges`, the annotation is how the compiler learns which edges exist, so the graph renders correctly and invalid targets are caught. Structured output for the routing decision avoids parsing free text and gives you a logged `reason` for every handoff.',
            },
            {
              type: 'heading',
              text: 'Topologies and how they map to LangGraph',
            },
            {
              type: 'table',
              headers: ['Topology', 'How it works', 'Strength', 'Weakness'],
              rows: [
                ['Supervisor', 'Central router node delegates and receives results', 'Easy to reason about and audit', 'Supervisor is a bottleneck and an extra LLM call per hop'],
                ['Supervisor as tool-calling agent', 'Each worker is exposed as a *tool* of the supervisor agent', 'Reuses the normal tool loop; worker gets a focused task string', 'Worker sees only what the supervisor passes it'],
                ['Swarm / handoffs', 'Agents transfer control directly via `Command(goto=..., graph=Command.PARENT)`', 'Fewer hops; the active agent talks to the user', 'Harder to guarantee termination and audit flow'],
                ['Hierarchical', 'Supervisors of supervisors, each team a subgraph', 'Scales to many specialists', 'Latency and debugging cost multiply'],
                ['Parallel workers (map-reduce)', '`Send` fans out to N workers; a reducer merges', 'Throughput for independent subtasks', 'Only for tasks that are actually independent'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'a direct handoff from inside a subgraph to a sibling agent',
              code: `from langgraph.types import Command

def triage_agent_node(state):
    if needs_billing(state):
        # Leave this subgraph and route in the PARENT graph
        return Command(
            goto="billing_agent",
            graph=Command.PARENT,
            update={"messages": [summary_for_handoff(state)]},   # parent key needs a reducer
        )
    return {"messages": [answer(state)]}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Context hand-off is the hard part of multi-agent systems. If every worker receives the full shared message history, you pay for the tokens repeatedly and workers get confused by each other\'s tool chatter. If they receive too little, they redo work. Decide explicitly: pass a focused task description in, return a concise result out, and keep each worker\'s internal scratchpad in its own subgraph state.',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    START([START]) --> Supervisor{"Supervisor node:<br/>decide next agent"}
    Supervisor -->|"goto: researcher"| Researcher["Researcher<br/>(subgraph)"]
    Supervisor -->|"goto: writer"| Writer["Writer<br/>(subgraph)"]
    Supervisor -->|"goto: END"| ENDN([END])
    Researcher --> Supervisor
    Writer --> Supervisor`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Building each worker as its own compiled subgraph is not just organizational tidiness — it means each worker agent can be built, tested, and evaluated in isolation (invoke it directly with representative inputs, check its outputs) before it is ever wired into the larger multi-agent system, the same way you would unit test a function before integrating it.',
            },
          ],
        },
        {
          id: 'functional-api-entrypoint-task',
          title: 'The Functional API: @entrypoint and @task',
          summary:
            'Not every workflow is easier to read as a graph. The Functional API gives you the same runtime — checkpointing, interrupts, streaming, durable execution — on top of ordinary Python control flow (if/for/while), with `@task` marking the units of work whose results are saved.',
          keyPoints: [
            '`@entrypoint(checkpointer=...)` turns a function into a runnable workflow (it supports `invoke`, `stream`, interrupts, threads), just like a compiled graph.',
            '`@task` marks a unit of work — usually an LLM call, API call or other side effect. Calling a task returns a future; `.result()` (or `await`) gets the value. Tasks can run in parallel.',
            'Task results are checkpointed. On resume after an interrupt or a failure, the entrypoint **re-executes from the top**, but completed tasks return their saved results instead of running again — so non-deterministic or side-effecting work must live in tasks.',
            'An entrypoint receives the previous return value for the thread through a `previous` parameter, which makes simple short-term memory easy; `entrypoint.final(value=..., save=...)` separates what you return from what you save.',
            'Graph API and Functional API share the same runtime and can be mixed (an entrypoint can invoke a graph; a graph node can call into functional code).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'a durable essay workflow with a human review step',
              code: `from langgraph.func import entrypoint, task
from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import InMemorySaver

@task
def write_draft(topic: str) -> str:
    return model.invoke(f"Write a short essay about {topic}").content

@task
def fact_check(paragraph: str) -> list[str]:
    return checker.invoke(paragraph)          # an external API call, saved once done

@entrypoint(checkpointer=InMemorySaver())
def essay_workflow(topic: str) -> dict:
    draft = write_draft(topic).result()

    # parallel tasks: futures first, then gather
    futures = [fact_check(p) for p in draft.split("\\n\\n")]
    issues = [i for f in futures for i in f.result()]

    approved = interrupt({"draft": draft, "issues": issues})   # pause for a human
    return {"draft": draft, "approved": approved}

config = {"configurable": {"thread_id": "essay-1"}}
essay_workflow.invoke("vector databases", config)
# later: essay_workflow.invoke(Command(resume=True), config)
# -> write_draft and fact_check are NOT re-run; their saved results are reused`,
            },
            {
              type: 'table',
              headers: ['Aspect', 'Graph API (StateGraph)', 'Functional API (@entrypoint)'],
              rows: [
                ['Control flow', 'Explicit nodes and edges', 'Plain Python if/for/while'],
                ['State', 'Declared schema with reducers, shared by all nodes', 'Function-scoped variables; no reducers needed'],
                ['Checkpoint granularity', 'After every super-step', 'Task results, plus the entrypoint result'],
                ['Visualization / Studio', 'Graph can be rendered and stepped through', 'Opaque function body'],
                ['Best for', 'Agents with cycles, multi-agent topologies, complex routing', 'Adding durability/HITL to existing linear-ish code'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Determinism matters in the Functional API: because the entrypoint body re-runs on resume, anything outside a task (reading the clock, `random`, an un-wrapped HTTP call) may produce a different value the second time and send the workflow down a different path than the one the saved task results belong to. Wrap every non-deterministic operation in a `@task`.',
            },
          ],
        },
        {
          id: 'prebuilt-agents-create-agent',
          title: 'Prebuilt Agents: From create_react_agent to LangChain create_agent',
          summary:
            'For the common "model + tools in a loop" case you rarely hand-build the graph anymore. The LangGraph prebuilt `create_react_agent` is deprecated in v1 in favor of LangChain\'s `create_agent`, which runs on LangGraph and is customized through middleware rather than graph surgery.',
          keyPoints: [
            '`from langchain.agents import create_agent` is the recommended prebuilt agent in the 1.x line; `langgraph.prebuilt.create_react_agent` is deprecated (still importable for migration).',
            'The result is a compiled LangGraph graph: it accepts a checkpointer and store, supports `interrupt`-based human approval, streams with the same modes, and can be dropped into a larger graph as a node.',
            '**Middleware** hooks into the loop (before/after model calls, around tool calls) for cross-cutting concerns such as summarizing long histories, human approval of specific tools, PII redaction, model fallbacks and call limits.',
            'Drop down to a hand-written `StateGraph` when the control flow is not a single tool loop: fixed multi-stage pipelines, parallel fan-out, reflection loops with graders, or multi-agent routing.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'a production-shaped prebuilt agent',
              code: `from langchain.agents import create_agent
from langgraph.checkpoint.postgres import PostgresSaver

agent = create_agent(
    model="anthropic:<model-id>",          # provider:model string or a chat model instance
    tools=[search_orders, issue_refund],
    system_prompt="You are a support agent. Refunds over $100 need approval.",
    checkpointer=checkpointer,             # same persistence as any LangGraph graph
    # middleware=[...]  e.g. summarization, human-in-the-loop for issue_refund
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "Refund order 991"}]},
    {"configurable": {"thread_id": "cust-17"}},
)`,
            },
            {
              type: 'table',
              headers: ['Need', 'Prebuilt agent + middleware', 'Custom StateGraph'],
              rows: [
                ['Tool loop with a system prompt', 'Yes — the default case', 'Overkill'],
                ['Approve certain tool calls', 'Yes — approval middleware', 'Also easy (interrupt node)'],
                ['Deterministic pre/post steps (classify, retrieve, validate)', 'Possible but awkward', 'Natural — explicit nodes'],
                ['Parallel branches / map-reduce', 'No', 'Yes — `Send`, multi-edges'],
                ['Multi-agent with explicit routing', 'Agents as tools of another agent', 'Full control over topology'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Migration tip: `create_react_agent(model, tools, prompt=...)` maps roughly to `create_agent(model, tools, system_prompt=...)`, and the old `pre_model_hook` / `post_model_hook` customizations become middleware. Read the official v1 migration guide for exact parameter changes rather than relying on memory — the signatures moved more than the concepts did.',
            },
          ],
        },
        {
          id: 'mcp-overview',
          title: 'Model Context Protocol (MCP) — The Interoperability Layer',
          summary:
            'Before MCP, connecting a model to external tools/data meant custom glue code per application-tool pair — an M×N problem. MCP is an open, standardized protocol that turns that into an M+N problem.',
          keyPoints: [
            'The M×N integration problem: M applications × N tools, each pair needing its own bespoke glue code.',
            'MCP turns M×N into M+N — a tool provider builds one MCP server and it works with every MCP-compatible client.',
            'Three roles: Host (the end-user-facing app), Client (1:1 connection to one server, lives in the host), Server (exposes capabilities, has no knowledge of who\'s calling it).',
            'The sharpest interview framing: MCP is to AI tool integration what LSP was to IDE-language integration.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**The problem MCP solves**: before MCP, every AI application that wanted to connect a model to external tools/data (a database, a filesystem, a SaaS API) had to write custom, bespoke integration code for that specific combination of application and tool — an M×N integration problem (M applications × N tools, each pair needing its own glue code). **MCP is an open, standardized protocol (introduced by Anthropic) that lets any MCP-compatible application connect to any MCP-compatible tool/data server**, turning the M×N problem into an M+N problem — a tool provider builds one MCP server, and it works with every MCP-compatible client, the same way USB-C lets any compliant device connect to any compliant cable/port regardless of which vendor made either end.',
            },
            {
              type: 'heading',
              text: 'Core architecture — three roles',
            },
            {
              type: 'list',
              items: [
                '**Host**: the end-user-facing AI application (e.g., a chat client, an IDE assistant) that manages the overall interaction and embeds one or more MCP clients.',
                '**Client**: lives inside the host, maintains a 1:1 connection to exactly one MCP server, handling the protocol-level message exchange.',
                '**Server**: an external, typically lightweight process that exposes capabilities (tools, data, prompts) from a specific system (a database, a filesystem, a SaaS API, a code repository) via the standardized MCP interface — a server has no knowledge of which model or host is calling it.',
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph HostApp["Host Application (e.g., an AI assistant)"]
        LLM[LLM]
        Client1[MCP Client 1]
        Client2[MCP Client 2]
        Client3[MCP Client 3]
    end
    Client1 <-->|1:1 connection| ServerA[MCP Server: GitHub]
    Client2 <-->|1:1 connection| ServerB[MCP Server: Postgres]
    Client3 <-->|1:1 connection| ServerC[MCP Server: Filesystem]
    ServerA --> GitHubAPI[(GitHub API)]
    ServerB --> Database[(Postgres DB)]
    ServerC --> FS[(Local Filesystem)]`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'MCP doesn\'t replace function/tool calling as a *model capability* (the underlying LLM call still uses the same tool-use mechanism) — it standardizes *how tools and data sources are packaged, discovered, and connected* to any AI application. The sharpest thing to say in an interview: MCP is to AI tool integration what LSP (Language Server Protocol) was to IDE-language integration — before LSP, every IDE needed custom support for every language; LSP let one language server work with any compliant editor. MCP does the same for AI applications and external capabilities.',
            },
          ],
        },
        {
          id: 'mcp-primitives-transports',
          title: 'MCP Primitives and Transports',
          summary:
            'A server exposes three kinds of capability — tools, resources, and prompts — each with a different control locus, over one of two transports depending on whether the server is local or remote.',
          keyPoints: [
            'Tools: model-invokable functions with a defined input schema — the model decides when to call them.',
            'Resources: read-only, addressable data that the host application decides to attach to context.',
            'Prompts: reusable, server-defined prompt templates a user or host can invoke.',
            'stdio transport for local subprocess tools; Streamable HTTP for remote/shared/multi-user servers.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'The three primitives a server exposes',
            },
            {
              type: 'list',
              items: [
                '**Tools**: model-invokable functions with a defined input schema (e.g., `create_issue(repo, title, body)`) — analogous to function/tool calling, but standardized at the protocol level so any host can discover and call them without custom integration code.',
                '**Resources**: read-only data the host application can attach to context (a file\'s contents, a database schema, a document) — think of these as addressable, application-controlled context (the *host* decides when to attach a resource), distinct from tools (which the *model* decides to invoke).',
                '**Prompts**: reusable, server-defined prompt templates (potentially parameterized) that a user or host can invoke — letting a tool provider ship not just capabilities but also vetted, well-crafted ways of using them.',
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Server["What one MCP server can expose"]
        Tools["Tools<br/>e.g. create_issue(...)"]
        Resources["Resources<br/>e.g. a file's contents"]
        Prompts["Prompts<br/>e.g. a vetted prompt template"]
    end
    Tools -.control locus.-> ModelDecides["The MODEL decides<br/>when to call it"]
    Resources -.control locus.-> HostDecides["The HOST APP decides<br/>when to attach it"]
    Prompts -.control locus.-> UserDecides["A USER or the host<br/>invokes it directly"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'the control-locus distinction, made concrete',
              code: `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("internal-tools")

@mcp.tool()
def create_ticket(title: str, description: str, priority: str = "normal") -> str:
    """Create a support ticket. The MODEL decides when this is needed,
    based on the conversation — exactly like standard function calling."""
    ticket_id = ticketing_api.create(title, description, priority)
    return f"Created ticket {ticket_id}"

@mcp.resource("docs://runbook/{name}")
def get_runbook(name: str) -> str:
    """A read-only resource. The HOST APPLICATION decides when to
    attach this — e.g. because the user opened this exact runbook in
    the UI — not the model choosing to 'call' it mid-conversation."""
    return read_runbook_file(name)`,
            },
            {
              type: 'heading',
              text: 'Transports',
            },
            {
              type: 'p',
              text: '**stdio** (the server runs as a local subprocess, communicating over standard input/output — simplest, used for local tools with no network hop, e.g., a local filesystem or git server) and **Streamable HTTP** (the server runs remotely, communicating over HTTP with support for streaming responses — used for remote/shared/multi-user servers, e.g., a company\'s internal API exposed as an MCP server for many users\' AI assistants to share).',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Local["stdio transport"]
        HostA["Host application"] <-->|"stdin / stdout,<br/>local subprocess, no network hop"| ServerA["MCP Server<br/>e.g. local filesystem or git"]
    end
    subgraph Remote["Streamable HTTP transport"]
        HostB["Host application"] <-->|"HTTP, streaming responses,<br/>a real network hop"| ServerB["MCP Server<br/>e.g. a shared company API"]
    end`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is the layer LangChain/LangGraph tool integrations previously each reinvented independently — before MCP, every framework (LangChain tools, custom function-calling glue) solved "give a model access to external systems" in its own incompatible way. The older HTTP+SSE transport has been superseded by Streamable HTTP in the spec; prefer Streamable HTTP for new remote servers.',
            },
            {
              type: 'heading',
              text: 'Using MCP tools inside a LangGraph agent',
            },
            {
              type: 'code',
              language: 'python',
              title: 'langchain-mcp-adapters: MCP servers become ordinary LangChain tools',
              code: `from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import ToolNode

client = MultiServerMCPClient({
    "git": {"command": "python", "args": ["git_server.py"], "transport": "stdio"},
    "tickets": {"url": "https://mcp.internal.example/mcp", "transport": "streamable_http"},
})

tools = await client.get_tools()          # discovered from the servers at runtime
model_with_tools = model.bind_tools(tools)
tool_node = ToolNode(tools)               # plug into the StateGraph from earlier topics`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Treat MCP servers like any third-party dependency with code-execution reach. Tool descriptions and results flow straight into the model\'s context, so a malicious or compromised server can attempt prompt injection ("tool poisoning"). Pin and review the servers you connect, scope their credentials to least privilege, and keep human approval in front of destructive tools regardless of which server provides them.',
            },
          ],
        },
        {
          id: 'hand-rolled-agent-loop',
          title: 'A Minimal Hand-Rolled Agentic Tool-Use Loop',
          summary:
            'Understanding what LangChain/LangGraph abstract away is a strong interview signal — here is the ReAct-style tool loop in raw form, using the Anthropic Messages API directly.',
          keyPoints: [
            'The loop: call the model, check if it requested a tool, execute the tool(s), append results, repeat until a final answer.',
            'Every tool_use block from one turn must be executed and returned together in a single user message.',
            'This is the exact ReAct loop LangChain\'s classic agents wrap, and the single-node cycle LangGraph makes explicit as a graph.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Understanding what these frameworks are actually doing underneath is a strong interview signal — here\'s the loop in raw form, using the Anthropic Messages API\'s tool-use mechanism as the concrete example:',
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Start(["messages = [user question]"]) --> Call["Call the model"]
    Call --> Check{"stop_reason ==<br/>tool_use ?"}
    Check -->|No| Final["Final answer — break"]
    Check -->|Yes| Exec["Execute every tool_use<br/>block in this turn"]
    Exec --> Append["Append ALL tool_results<br/>in ONE user message"]
    Append --> Call`,
            },
            {
              type: 'code',
              language: 'python',
              code: `import anthropic

client = anthropic.Anthropic()
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string"}},
        "required": ["city"],
    },
}]

messages = [{"role": "user", "content": "What's the weather in Tokyo?"}]

while True:
    response = client.messages.create(
        model=MODEL_ID,          # any current Claude model id, e.g. from config
        max_tokens=1024,
        tools=tools,
        messages=messages,
    )
    messages.append({"role": "assistant", "content": response.content})

    if response.stop_reason != "tool_use":
        break  # model produced a final answer, no more tools to call

    # Execute every tool_use block from this turn, then return ALL results
    # in a single user message (required — splitting them across messages
    # silently trains the model to stop making parallel tool calls).
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)  # your own dispatch
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": str(result),
            })
    messages.append({"role": "user", "content": tool_results})`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'This *is* the ReAct loop LangChain\'s classic agents wrap, and it\'s the single-node cycle LangGraph makes explicit as a graph — seeing it in raw form makes it obvious why LangGraph\'s "cycle back to the reasoning node" edge and LangChain\'s agent executor both exist to manage exactly this loop, plus error handling, max-iteration limits, and parsing robustness you\'d otherwise hand-roll yourself.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'This minimal loop is deliberately unsafe for production: `while True` has no iteration cap, a tool exception crashes the whole loop instead of being returned to the model as an error `tool_result` (with `is_error: true`) it can recover from, and nothing is persisted — a crash on step 7 of 10 loses everything. Those three gaps (bounded loops, error-as-observation, durable state) are exactly what the graph runtime adds.',
            },
          ],
        },
        {
          id: 'agent-architectures-beyond-react',
          title: 'Agent Architectures Beyond ReAct',
          summary:
            'ReAct isn\'t the only pattern: Plan-and-Execute trades adaptiveness for efficiency, reflection improves checkable-quality tasks, and multi-agent supervisor patterns are powerful but frequently over-applied.',
          keyPoints: [
            'Plan-and-Execute separates planning from execution — more token-efficient and predictable, but less adaptive if assumptions turn out wrong.',
            'Reflection/self-critique: the model critiques its own work and revises, at the cost of extra latency/tokens.',
            'Multi-agent supervisor pattern: a coordinator decomposes and delegates to specialized workers, then synthesizes.',
            'Don\'t reach for multi-agent complexity before establishing that a single agent with the right tools actually fails at the task.',
            'Guardrails: schema-validate structured outputs, apply content moderation, and set hard iteration/tool-call limits.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Plan-and-Execute**: separate planning (produce a full multi-step plan up front) from execution (carry out each step, potentially re-planning if a step fails or reveals new information) — more token-efficient and predictable for well-understood multi-step tasks than ReAct\'s step-by-step reasoning, but less adaptive if the plan\'s assumptions turn out wrong mid-execution.',
                '**Reflection/self-critique**: after producing an output, the model (or a second call) critiques its own work against the requirements and revises — meaningfully improves quality on tasks with checkable correctness (code, structured extraction) at the cost of extra latency/tokens per additional pass.',
                '**Multi-agent (supervisor/orchestrator pattern)**: a coordinating agent decomposes a task and delegates subtasks to specialized worker agents (a "research agent," a "coding agent," a "critique agent"), then synthesizes their outputs — useful when subtasks genuinely benefit from different tools/context/prompting strategies, but adds coordination overhead and failure modes (a worker\'s error propagating silently) that a single well-designed agent with good tools often avoids more simply.',
                '**Guardrails and validation**: schema-validate structured outputs (reject and retry on invalid JSON rather than trying to parse malformed output), apply input/output content moderation for user-facing systems, and set hard iteration/tool-call limits on any agent loop to bound cost and prevent infinite loops from a confused agent.',
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph ReAct["ReAct"]
        direction TB
        R1[Thought] --> R2[Action] --> R3[Observation] --> R1
    end
    subgraph PlanExec["Plan-and-Execute"]
        direction TB
        P1["Plan all steps upfront"] --> P2["Execute step 1"] --> P3["Execute step 2"] --> P4["...re-plan only if needed"]
    end
    subgraph Reflect["Reflection"]
        direction TB
        F1["Produce output"] --> F2["Self-critique"] --> F3["Revise"] -.-> F1
    end`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The senior-level caution to voice unprompted: don\'t reach for multi-agent complexity before establishing that a single agent with the right tools and a good prompt actually fails at the task — it\'s one of the most over-applied patterns in current AI engineering.',
            },
          ],
        },
        {
          id: 'production-langgraph-operations',
          title: 'Running LangGraph in Production: Deployment, Reliability, and Observability',
          summary:
            'Getting a graph to work in a notebook is the easy 20%. Production adds concurrency on the same thread, retries and timeouts, idempotent side effects, bounded state, tracing, evaluation and a deployment model for long-running, interruptible runs.',
          keyPoints: [
            '**Deployment options**: self-host the graph behind your own API (FastAPI + Postgres checkpointer + a worker queue), or use **LangSmith Deployment** (formerly LangGraph Platform), which runs graphs on a server runtime with threads/runs/cron APIs, background runs, a task queue and built-in persistence.',
            '**Retries and caching per node**: `add_node(..., retry_policy=RetryPolicy(...))` retries transient failures (rate limits, timeouts); `cache_policy=CachePolicy(ttl=...)` memoizes expensive deterministic nodes.',
            '**Concurrency on one thread**: two requests resuming the same `thread_id` at once will race. Serialize runs per thread (a queue or a lock keyed by thread id) and decide a "double-texting" policy: reject, enqueue, interrupt the current run, or roll it back.',
            '**Observability**: trace every run (LangSmith or OpenTelemetry-based tooling) with node-level spans, token usage and the thread id, so a bad answer can be traced to the exact node, prompt and tool output.',
            '**Testing**: unit-test nodes as plain functions, test routers with labeled examples, and run end-to-end evals on whole trajectories (which tools, in which order) — not only on the final answer.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'node-level retries, caching and a bounded run',
              code: `from langgraph.types import RetryPolicy, CachePolicy
from langgraph.cache.memory import InMemoryCache

builder.add_node(
    "call_model", call_model,
    retry_policy=RetryPolicy(max_attempts=3, initial_interval=1.0),   # transient API errors
)
builder.add_node(
    "embed_docs", embed_docs,
    cache_policy=CachePolicy(ttl=3600),   # same input -> cached output for an hour
)

graph = builder.compile(checkpointer=checkpointer, cache=InMemoryCache())

graph.invoke(
    inputs,
    {"configurable": {"thread_id": tid}, "recursion_limit": 40},   # tight per-use-case cap
    durability="sync",                     # strongest persistence for money-moving flows
)`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    UI["Client / UI"] -->|"POST /threads/id/runs"| API["API layer<br/>auth + thread ownership"]
    API --> Q["Run queue<br/>one active run per thread"]
    Q --> W["Worker<br/>graph.astream(...)"]
    W <--> DB[("Postgres<br/>checkpoints + store")]
    W --> T["Tracing / metrics"]
    W -->|"SSE stream"| UI`,
            },
            {
              type: 'table',
              headers: ['Production pitfall', 'What happens', 'Mitigation'],
              rows: [
                ['Non-idempotent side effect before an interrupt or crash', 'Duplicate emails, tickets, charges on resume', 'Separate node/task after approval; idempotency keys'],
                ['Unbounded message history', 'Context overflow, rising cost, slow checkpoint loads', 'Summarize/trim; artifacts by reference; thread TTLs'],
                ['Graph code changed while threads are paused', 'Resume fails or takes a path that no longer exists', 'Version graphs; keep node names stable; migrate or drain old threads'],
                ['Relying only on `recursion_limit`', 'Runs die with an exception after burning tokens', 'Explicit iteration counters and graceful wrap-up routes'],
                ['Parallel requests on one thread', 'Interleaved or lost state updates', 'Per-thread run queue and a double-texting policy'],
                ['Secrets or clients in state', 'Serialization errors, secrets in the checkpoint DB', 'Runtime context / dependency injection instead'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Paused threads hold a reference to your graph *structure*. If you rename or remove a node that a thread is waiting on (or change the state schema incompatibly) and deploy, those threads may fail to resume. Treat node names and state keys like a public API: add new ones freely, deprecate old ones slowly.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Use LangGraph Studio (or the local dev server from the LangGraph CLI) during development: it renders the graph, shows state at every checkpoint, and lets you edit state and re-run from any step — the fastest way to build intuition for super-steps, interrupts and forks.',
            },
          ],
        },
      ],
    },
    {
      id: 'langgraph-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'LangGraph, MCP, and agent-architecture interview questions, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'What is a "reducer" in LangGraph state (e.g., `Annotated[list, add_messages]`), and why is it needed?',
              answer:
                'By default, when a node returns an update for a state field, LangGraph *replaces* that field\'s existing value with whatever the node returned. For a field like conversation `messages`, that default would be actively wrong — each model call would wipe out the prior conversation instead of extending it. A reducer, attached via `Annotated[Type, reducer_fn]`, tells LangGraph to instead call `reducer_fn(existing_value, new_value)` and store its result — `add_messages` specifically appends new messages to the existing list (and updates/de-duplicates by message ID rather than blindly appending duplicates). The general principle: any state field where the correct semantics are "merge" rather than "overwrite" needs an explicit reducer, or every node touching that field has to manually read, merge, and return the entire updated value itself.',
            },
            {
              question: 'How does LangGraph\'s `interrupt()` differ from just pausing your own code with a manual approval step outside the graph?',
              answer:
                'A manual "pause outside the graph" approach typically means splitting your workflow into two separate invocations at the application level — run part one, store some intermediate result yourself, wait, then manually reconstruct enough context to run part two — which pushes all the state-tracking work onto your application code and is easy to get subtly wrong as the graph grows more complex. `interrupt()`, called inside a node, instead suspends execution at that exact point in the graph, with the checkpointer persisting the *entire* graph state (not just an intermediate result you remembered to save) automatically. Resuming with `Command(resume=value)` and the same `thread_id` restores that state and re-runs the paused node from its beginning; when execution reaches the `interrupt()` call again it returns `value` instead of pausing — without your application needing to know or reconstruct anything about how the graph got there. The senior caveat to add: because the node re-runs, code before the `interrupt()` executes twice, so side effects there must be idempotent or moved into a later node. This is what makes it practical to pause arbitrarily deep inside a multi-step, possibly multi-agent graph, not just at the very top level.',
            },
            {
              question: 'What is a checkpointer in LangGraph, and what does it actually persist?',
              answer:
                'A checkpointer is the component LangGraph uses to save the graph\'s state at every super-step (each step in which one or more nodes ran), keyed by a `thread_id` you supply in the invocation config. Each checkpoint also records which nodes are due next, metadata, any pending interrupts, and pending writes from nodes that succeeded in a step where a sibling failed. It persists the entire state object as defined by the graph\'s state schema — not just a single field, and not just "the last message" — meaning a resumed run has access to everything any prior node wrote to state, exactly as it was at that point in execution. This is what enables three related capabilities: **resuming** a paused run (including one paused via `interrupt()`), **replaying** a past run for debugging by re-invoking from an earlier checkpoint, and **multi-turn persistence** for a long-running conversation or agent session across separate process invocations (e.g., separate HTTP requests to a backend). Without a checkpointer, a compiled graph still runs, but nothing survives past a single `.invoke()` call.',
            },
            {
              question: 'How would you implement a supervisor multi-agent pattern in LangGraph concretely?',
              answer:
                'Define a `supervisor` node whose job is purely routing: it inspects the current state (the task, and whatever prior agents have contributed) and decides which specialized agent should act next, then returns either a conditional-edge decision or a `Command(goto=next_agent, update={...})` that both updates state and specifies the next node in one step. Each specialized agent is registered as its own node — often itself a fully compiled `StateGraph` used as a subgraph, so it can be built and tested independently — and each worker\'s edge routes back to the supervisor rather than onward to another worker directly, so the supervisor remains the single place that decides what happens next and can terminate the loop (route to `END`) once the task is complete. The key property this preserves is auditability: at any point you can inspect exactly which node the graph is in and why the supervisor routed there, rather than an agent\'s internal reasoning silently deciding to "call" another agent.',
            },
            {
              question: 'Why must a StateGraph\'s state updates go through reducers rather than nodes simply overwriting state fields directly by default?',
              answer:
                'If every node\'s returned update simply overwrote the corresponding state field, any two nodes that both need to contribute to the same field (most commonly, message history, but also things like an accumulating list of tool-call results or a running list of retrieved documents across an agentic RAG loop) would silently clobber each other\'s contributions rather than combining them — the second node to run would erase whatever the first node wrote. Overwrite semantics are still the correct default for fields that genuinely represent "the current value" rather than "an accumulating collection" (e.g., a `status` field), which is why reducers are opt-in per field via `Annotated[Type, reducer_fn]` rather than forced on every field — LangGraph does not assume it knows which merge behavior is correct for an arbitrary field, so it asks you to declare it explicitly.',
            },
            {
              question: 'What problem does MCP solve that tool/function calling (already supported by most LLM APIs) doesn\'t?',
              answer:
                'Function/tool calling is a *model capability* — the model\'s ability to emit a structured request to invoke a named function with arguments; every major LLM API already supports this. MCP operates one layer up: it standardizes how the *tools themselves* are packaged, exposed, and discovered by any AI application, so that a tool provider builds one MCP server and it becomes usable by any MCP-compatible host application without custom integration code for each pairing. Without MCP, function calling still works, but every application needing to expose a given external system as tools (a database, a filesystem, a SaaS API) has to write its own bespoke integration — MCP eliminates that duplicated, per-pair integration work, the same way a common protocol lets many clients and many servers interoperate without every pair needing custom code.',
            },
            {
              question: 'In the MCP architecture, why does a "client" maintain exactly one connection to one server, rather than one client managing connections to multiple servers?',
              answer:
                'Keeping the client-to-server relationship 1:1 keeps each connection\'s protocol state (capability negotiation, session lifecycle) simple and isolated — a failure or reconnect on one server\'s connection can\'t affect another\'s. The host application is the layer responsible for managing multiple such client-server pairs simultaneously (one client instance per server it wants to connect to), which keeps the separation of concerns clean: the *host* orchestrates across many capabilities, while each *client* only ever has to reason about the state of a single connection.',
            },
            {
              question: 'When would you choose a multi-agent architecture over a single agent with more tools, and what\'s the risk of over-applying it?',
              answer:
                'Multi-agent architectures earn their complexity when subtasks genuinely need materially different context, tools, or prompting strategies that would otherwise dilute a single agent\'s focus and system prompt (e.g., a "deep research" agent that needs a very different tool set and reasoning style than a "code review" agent, combined under one orchestrator that routes between them). The risk of over-applying it: coordination overhead (agents need well-defined handoff contracts, and a miscommunication between agents is a new failure mode that doesn\'t exist in a single-agent design), harder debugging (a wrong final answer might stem from any of several agents, and tracing it requires inspecting the full multi-agent trace), and higher cost/latency (multiple model calls where one well-tooled agent might have sufficed). The disciplined approach: build and evaluate a single, well-prompted agent with good tools first, and only split into multiple agents once you\'ve empirically shown that a single agent\'s context/tool mixing is causing measurable quality problems.',
            },
            {
              question: 'A stakeholder asks why the AI assistant\'s agent occasionally takes a wrong action instead of just answering a question. How do you diagnose and fix routing failures in an agentic system?',
              answer:
                'This is a routing/tool-selection failure — the model (or an explicit routing node, if using LangGraph) is misclassifying the user\'s intent as requiring an action when it actually just needs a knowledge answer, or vice versa. Diagnose by building an evaluation set of representative queries labeled with the *correct* routing decision, and measuring the router\'s accuracy against it in isolation from the rest of the pipeline (the same "decompose by stage" discipline as RAG debugging). Fixes typically involve tightening the routing prompt/logic with clearer decision criteria and few-shot examples of ambiguous cases, adding a confidence threshold that falls back to asking the user a clarifying question rather than guessing when the routing signal is weak, and — if using LangGraph — making the routing decision an explicit, inspectable node so its reasoning can be logged and audited rather than buried inside an opaque agent\'s internal tool-selection behavior.',
            },
            {
              question: 'Why would a system gate ticketing/deployment actions behind human approval but not RAG-based knowledge answers?',
              answer:
                'The risk profile is fundamentally different: a wrong RAG answer is passively wrong information the user can evaluate and choose to trust or verify (especially with citations shown), while a wrong or premature side-effecting action (creating a duplicate ticket, triggering a deployment rollback) directly changes external system state and may not be easily reversible, with consequences beyond the requesting user. This maps directly to the general principle that the cost of an error should determine how much autonomy an agent is given for that class of action — read-only, informational operations can run fully autonomously with the user as the final check, while state-changing operations warrant a human-in-the-loop gate, implemented cleanly in LangGraph as a checkpointed pause (`interrupt()`) rather than either blocking all autonomy or allowing all actions unchecked.',
            },
            {
              question: 'What\'s the practical difference between "resources" and "tools" in MCP, and why does the protocol distinguish them instead of treating everything as a callable function?',
              answer:
                'Tools are model-invoked — the LLM itself decides, based on the conversation, when and how to call a tool, exactly like standard function calling. Resources are host-controlled, addressable data (a file, a database schema, a document) that the *application* — not the model — decides to attach to the context, for instance a user explicitly picking a file to discuss, or the host automatically attaching a relevant document based on the current view in the application. Distinguishing them matters because it separates two different control loci: giving the model too much autonomous access to pull in arbitrary data as a "tool" call when the application actually wants to control what enters context (for cost, privacy, or determinism reasons) is a different design decision than genuinely wanting the model to decide when it needs to look something up.',
            },
            {
              question: 'Explain LangGraph\'s execution model. What is a super-step, and why does it matter to you as an application developer?',
              answer:
                'A compiled graph is a Pregel-style (bulk synchronous parallel) program. Nodes subscribe to state channels; in each **super-step** the runtime runs every node that was triggered — concurrently if there are several — collects their writes, applies them through each key\'s reducer, saves a checkpoint, and computes which nodes are triggered next. It matters in four practical ways: (1) parallel branches only combine safely if the keys they share have reducers, otherwise you get `InvalidUpdateError`; (2) a super-step is transactional — if one parallel node fails, the step\'s updates are not applied, while writes from the nodes that succeeded are kept as pending writes so they are not recomputed on retry; (3) the recursion limit counts super-steps, not LLM calls; and (4) checkpoints, and therefore resume points and time-travel points, exist at super-step boundaries, which is why a node is the unit of re-execution.',
            },
            {
              question: 'A user approves an action, and your system sends the confirmation email twice. The graph uses interrupt(). What happened and how do you fix it?',
              answer:
                'Almost certainly the email was sent inside the same node *before* the `interrupt()` call. On resume, LangGraph does not continue from the interrupt line; it restores the checkpoint and re-runs the whole node from the top, so everything before `interrupt()` runs again, and only then does `interrupt()` return the resume value. Fixes, in order of preference: move the side effect into a separate node that runs after the approval node; if it must stay, guard it with an idempotency key (e.g. derived from thread id plus action id) checked against the email provider or your own outbox table; and review every node containing `interrupt()` for other pre-interrupt side effects. The same reasoning applies to crash recovery generally: durable execution guarantees at-least-once execution of a node, so side effects must be idempotent.',
            },
            {
              question: 'What is the difference between short-term and long-term memory in LangGraph, and how would you implement "remember my preferences across conversations"?',
              answer:
                'Short-term memory is the thread\'s checkpointed state — the message history and other fields for one `thread_id`. It is automatic once you compile with a checkpointer, but a new thread starts empty. Long-term memory is a **Store** passed at `compile(store=...)`: JSON documents organized by namespace tuples, shared across threads, with optional semantic search over an embedding index. For preferences: namespace by the authenticated user from runtime context, e.g. `(user_id, "preferences")`; at the start of a turn, `search` the namespace (by query or filters) and inject the results into the system prompt; after a turn, extract new or changed preferences (in the hot path with an LLM call, or in a background job to save latency) and `put` them, updating existing keys rather than appending duplicates. Add a user-visible way to view and delete memories, and treat memory writes as an injection surface since they are replayed into every future prompt.',
            },
            {
              question: 'When would you choose the Functional API over the Graph API?',
              answer:
                'Choose the Functional API (`@entrypoint` / `@task`) when your workflow is naturally expressed with ordinary control flow — a mostly linear pipeline, loops over items, existing code you want to make durable or add a human approval to — and you do not need a visual graph or reducer-based state. Choose the Graph API when the control flow itself is the product: agents with cycles, conditional routing, parallel fan-out with merges, multi-agent topologies, or when you want to visualize and step through the structure in Studio. Both share one runtime, so the trade-off is about readability and granularity: the Graph API checkpoints at every super-step and makes state explicit, while the Functional API checkpoints task results and re-runs the entrypoint body on resume, which demands discipline — every non-deterministic or side-effecting operation must live inside a task.',
            },
            {
              question: 'Your agent graph occasionally fails with GraphRecursionError. Walk through your diagnosis.',
              answer:
                'First, accept that raising the limit is rarely the fix — the error means a cycle did not reach `END` within the allowed super-steps (the docs give a default of 1000 in recent 1.x versions; older versions used 25). Pull the traces of failing runs and look at the loop: is the model calling the same tool repeatedly with the same arguments (tool returns an error or empty result the model does not understand), are two agents handing off back and forth, or is a grader/reflection loop never satisfied? Fixes target the cause: return actionable tool errors, add explicit counters in state (max revisions, max handoffs) with a graceful wrap-up route, use `RemainingSteps` to end cleanly before the hard limit, de-duplicate repeated tool calls, and tighten the stop criterion in the prompt or grader. Then set a deliberately tight `recursion_limit` per use case as a cost safety net, and alert on it.',
            },
            {
              question: 'How do you handle two concurrent requests for the same thread_id?',
              answer:
                'Treat a thread like a single-writer log. If two runs execute concurrently on the same thread, both start from the same checkpoint and their writes can interleave or one can effectively overwrite the other, and the model sees an inconsistent history. The standard approach is one active run per thread: a queue or distributed lock keyed by thread id in front of the workers. Then choose a product policy for "double-texting" (the user sends a new message while a run is in progress): reject the new input, enqueue it to run after the current one, interrupt the current run and start a new one with the new input, or roll back the current run. Managed deployments expose these policies directly; if you self-host, you implement them in your API layer.',
            },
            {
              question: 'What should and should not go into graph state?',
              answer:
                'State should contain the data the workflow reasons about and needs to resume: messages, the current plan, intermediate results, flags for routing, counters. It should not contain things that are not serializable or should not be persisted: API clients, DB connections, secrets, and per-request configuration like the user id or model choice — those belong in runtime context (`context_schema` plus `Runtime`) or are injected when building nodes. Large artifacts (documents, images, big query results) should be stored externally and referenced by id, because checkpoints are written at every super-step and big state slows every load and inflates storage. Also prefer narrow input/output schemas so callers cannot inject internal fields, and subgraph-private keys so workers do not leak scratchpad data into the shared state.',
            },
            {
              question: 'create_react_agent is deprecated. What replaced it, and when would you still hand-write a StateGraph?',
              answer:
                'In the 1.x line, LangChain\'s `create_agent` (from `langchain.agents`) replaces LangGraph\'s prebuilt `create_react_agent`. It still compiles to a LangGraph graph, so checkpointers, stores, interrupts and streaming all work the same, and customization moved from hooks/graph edits to middleware (summarization, human approval of tool calls, PII handling, limits, fallbacks). I would still hand-write a `StateGraph` whenever the control flow is not "one model calling tools in a loop": deterministic pre/post-processing stages (classify, retrieve, validate, format), parallel map-reduce, grader-driven reflection loops, multi-agent routing with explicit topology, or workflows where only specific steps involve an LLM. A good pattern is a custom graph whose individual nodes are prebuilt agents.',
            },
            {
              question: 'How does time travel work in LangGraph, and when is it useful beyond debugging?',
              answer:
                'Every super-step produces a checkpoint with an id and a parent id, so a thread is a linked history. `get_state_history(config)` lists it; invoking with a past checkpoint\'s config replays from that point; `update_state(past_config, values, as_node=...)` writes a new checkpoint branching off that point (a fork), and invoking from the returned config continues on the new branch while the original history stays intact. Beyond debugging a bad run, it powers product features: "edit an earlier message and regenerate" in chat UIs, letting a reviewer correct an intermediate result (a wrong extraction or tool argument) and continue rather than restart, and building regression datasets by forking real production states and re-running them with a new prompt or model.',
            },
            {
              question: 'How do you test and evaluate a LangGraph application?',
              answer:
                'Layer it like any system. Unit level: nodes are plain functions of state, so test them with fixture states and mocked models/tools; test routers and conditional edges with labeled examples, because routing errors are the most common agent failure. Graph level: run the compiled graph with an `InMemorySaver` and fake models to assert on paths taken, interrupts raised, and resume behavior (including that side effects are not duplicated on resume). Evaluation level: build a dataset of realistic inputs and score both the final answer and the **trajectory** — which tools were called, with which arguments, in what order, and how many steps — since a correct answer reached through a destructive or expensive path is still a failure. Run these evals in CI on prompt or model changes, and feed production traces that went wrong back into the dataset.',
            },
            {
              question: 'What are the risks of changing a deployed graph while there are paused or long-running threads?',
              answer:
                'A paused thread\'s checkpoint references node names, channel (state key) names and the position of pending interrupts. If a deploy renames or removes the node a thread is waiting in, changes a reducer, or changes a state key\'s type incompatibly, resuming can fail or route somewhere unintended. Mitigations: treat node names and state keys as a public contract (add, do not rename), make new state fields optional with defaults, keep old nodes around until in-flight threads drain, version graphs (deploy a new graph id/assistant for breaking changes and route only new threads to it), and test resuming real checkpoints from the previous version in staging before rollout.',
            },
            {
              question: 'Your stakeholder wants "an autonomous multi-agent system" for invoice processing. How do you push back constructively and what would you build?',
              answer:
                'Start from the task, not the architecture. Invoice processing is mostly a deterministic pipeline with a few judgment calls: extract fields, validate against the purchase order, flag anomalies, route for approval, post to the ERP. I would build a LangGraph workflow (not a free-roaming multi-agent system) with explicit nodes: an LLM extraction node with structured output and schema validation, deterministic validation code, an LLM node only for ambiguous matching, an `interrupt()` approval gate for amounts above a threshold or low-confidence extractions, and an idempotent posting node keyed by invoice id. That delivers the stakeholder\'s real goals — automation, auditability, safety — with each step testable and each decision traceable. Agentic loops or multiple agents get introduced only where evals show a fixed pipeline fails, for example a research sub-agent for resolving vendor mismatches.',
            },
          ],
        },
      ],
    },
  ],
}
