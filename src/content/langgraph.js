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
            '`set_entry_point` (or `START`) marks where execution begins; routing to `END` ends that branch of execution.',
            '`.compile(checkpointer=...)` turns the graph definition into a runnable app, and — given a checkpointer — persists state after every node, which is what enables pause/resume, replay, and human-in-the-loop.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'a minimal StateGraph — the same tool-loop as a real graph',
              code: `from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

def call_model(state: AgentState):
    response = model_with_tools.invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state: AgentState):
    last_message = state["messages"][-1]
    return "tools" if last_message.tool_calls else END

graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tools", tool_node)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")  # the cycle: tool result flows back to reasoning
app = graph.compile(checkpointer=memory_saver)  # enables persistence/resume`,
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
          ],
        },
        {
          id: 'human-in-the-loop-patterns',
          title: 'Human-in-the-Loop: Interrupts and Approval Gates',
          summary:
            'Some actions an agent might take are too risky to run unsupervised. LangGraph\'s `interrupt()` lets a running graph pause mid-execution, hand control to a human, and resume exactly where it left off — the mechanism behind every "approve this action" pattern.',
          keyPoints: [
            '`interrupt(payload)`, called inside a node, pauses graph execution at that exact point and surfaces `payload` to the calling application — the graph\'s execution is suspended, not destroyed.',
            'Resuming happens by invoking the compiled graph again with `Command(resume=value)`, which picks up exactly where `interrupt()` left off, with `value` becoming that call\'s return value inside the node.',
            'This requires a **checkpointer** — without persisted state, there is nothing to resume from once the process that started the run has moved on or restarted.',
            'Static breakpoints (`interrupt_before=["node_name"]` at compile/invoke time) pause before a specific node every time it would run — simpler than a dynamic in-node `interrupt()` call, but less flexible about deciding when/why to pause.',
            'A common production pattern: pause before any node that calls a side-effecting tool, show the proposed action to a human via a UI, and resume with either approval, rejection, or an edited version of the action.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'pausing for approval and resuming',
              code: `from langgraph.types import interrupt, Command

def request_approval(state: AgentState):
    decision = interrupt({
        "action": state["proposed_action"],
        "message": "Approve this action?",
    })
    if decision != "approve":
        return {"status": "rejected"}
    return {"status": "approved"}

# graph.add_node("approval", request_approval), wired in with add_edge/add_conditional_edges
app = graph.compile(checkpointer=memory_saver)

# First call runs the graph until it hits the interrupt, then pauses:
app.invoke(
    {"proposed_action": "delete_prod_database"},
    config={"configurable": {"thread_id": "run-1"}},
)

# ...later, once a human has reviewed it via your own UI...
app.invoke(
    Command(resume="approve"),
    config={"configurable": {"thread_id": "run-1"}},   # same thread_id resumes the same run
)`,
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
    Graph->>Graph: resume exactly where it paused, decision = "approve"`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A checkpointer is not optional here — `interrupt()` relies on the graph\'s state having been persisted so a later, possibly entirely separate process invocation can resume it via the same `thread_id`. Compiling a graph without a checkpointer and calling `interrupt()` inside it will not give you a durable pause; there is nothing for a later `Command(resume=...)` call to resume from.',
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
            'A subgraph can share the parent graph\'s full state schema, or define its own narrower schema with explicit mapping at the boundary — deliberately limiting what a worker agent can see or change.',
            'The same auditability argument from "why LangGraph exists" applies here concretely: every handoff between agents is a visible edge/state transition in the graph, not an implicit function call buried inside one agent\'s internal reasoning.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'a supervisor routing to specialized worker subgraphs',
              code: `from langgraph.types import Command

def supervisor(state: AgentState):
    next_agent = decide_next_agent(state)   # an LLM call, or simpler routing logic
    return Command(goto=next_agent, update={"last_router_decision": next_agent})

graph = StateGraph(AgentState)
graph.add_node("supervisor", supervisor)
graph.add_node("researcher", researcher_subgraph)   # itself a compiled StateGraph
graph.add_node("writer", writer_subgraph)           # itself a compiled StateGraph
graph.set_entry_point("supervisor")
graph.add_edge("researcher", "supervisor")   # workers report back to the supervisor
graph.add_edge("writer", "supervisor")
# supervisor's Command(goto=...) handles routing to researcher / writer / END directly
app = graph.compile(checkpointer=memory_saver)`,
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
              type: 'heading',
              text: 'Transports',
            },
            {
              type: 'p',
              text: '**stdio** (the server runs as a local subprocess, communicating over standard input/output — simplest, used for local tools with no network hop, e.g., a local filesystem or git server) and **Streamable HTTP** (the server runs remotely, communicating over HTTP with support for streaming responses — used for remote/shared/multi-user servers, e.g., a company\'s internal API exposed as an MCP server for many users\' AI assistants to share).',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is the layer LangChain/LangGraph tool integrations previously each reinvented independently — before MCP, every framework (LangChain tools, custom function-calling glue) solved "give a model access to external systems" in its own incompatible way.',
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
        model="claude-opus-5",
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
                'A manual "pause outside the graph" approach typically means splitting your workflow into two separate invocations at the application level — run part one, store some intermediate result yourself, wait, then manually reconstruct enough context to run part two — which pushes all the state-tracking work onto your application code and is easy to get subtly wrong as the graph grows more complex. `interrupt()`, called inside a node, instead suspends execution at that exact point in the graph, with the checkpointer persisting the *entire* graph state (not just an intermediate result you remembered to save) automatically. Resuming with `Command(resume=value)` and the same `thread_id` picks up execution exactly where it left off — inside the same node, with `value` becoming that `interrupt()` call\'s return value — without your application needing to know or reconstruct anything about how the graph got there. This is what makes it practical to pause arbitrarily deep inside a multi-step, possibly multi-agent graph, not just at the very top level.',
            },
            {
              question: 'What is a checkpointer in LangGraph, and what does it actually persist?',
              answer:
                'A checkpointer is the component LangGraph uses to save the graph\'s state after every node execution, keyed by a `thread_id` you supply in the invocation config. It persists the entire state object as defined by the graph\'s state schema — not just a single field, and not just "the last message" — meaning a resumed run has access to everything any prior node wrote to state, exactly as it was at that point in execution. This is what enables three related capabilities: **resuming** a paused run (including one paused via `interrupt()`), **replaying** a past run for debugging by re-invoking from an earlier checkpoint, and **multi-turn persistence** for a long-running conversation or agent session across separate process invocations (e.g., separate HTTP requests to a backend). Without a checkpointer, a compiled graph still runs, but nothing survives past a single `.invoke()` call.',
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
          ],
        },
      ],
    },
  ],
}
