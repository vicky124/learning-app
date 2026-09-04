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
          id: 'why-langgraph',
          title: 'LangGraph — Why It Exists When LangChain Already Has "Agents"',
          summary:
            'Classic LangChain agents are a black-box while loop you don\'t control directly. LangGraph models an agent as an explicit state machine — a graph of nodes and edges — giving you the control flow of a real program instead of an opaque loop.',
          keyPoints: [
            'State: a shared, typed object every node reads from and writes to — what makes inspection, checkpointing, and resuming possible.',
            'Nodes are functions that take the current state and return an update; edges (fixed or conditional) decide what runs next.',
            'Cycles are the structural feature that make LangGraph suited to agents, not just fixed DAG pipelines.',
            'Persistence (checkpointing) enables pause/resume, replay for debugging, and human-in-the-loop approval gates.',
            'Multi-agent orchestration models specialized agents as nodes/subgraphs with explicit, auditable routing/handoff logic.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Classic LangChain agents (the ReAct loop) are a black-box `while` loop you don\'t control directly — hard to add custom branching logic, hard to persist and resume state, hard to have multiple agents collaborate with explicit handoffs, and hard to add a human-approval step in the middle of a run. **LangGraph models an agent as an explicit state machine (a graph of nodes and edges)** — you define the states, the transitions between them, and the shared state object that flows through the graph, giving you the control flow of a real program instead of an opaque loop.',
            },
            {
              type: 'heading',
              text: 'Core concepts',
            },
            {
              type: 'list',
              items: [
                '**State**: a shared, typed object (e.g., a `TypedDict` or Pydantic model) that every node reads from and writes to as execution proceeds — this is what makes it possible to inspect, checkpoint, and resume execution at any point.',
                '**Nodes**: functions (a model call, a tool call, a custom transformation) that take the current state and return an update to it.',
                '**Edges**: define which node runs next — can be a fixed edge (always go to node B after node A) or a **conditional edge** (a function inspects the state and decides which node to route to — this is what implements branching, retries, and loops).',
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
              type: 'code',
              language: 'python',
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
              type: 'callout',
              kind: 'tip',
              text: 'When to reach for LangGraph over a plain ReAct agent: whenever you need explicit, auditable control flow — multi-agent handoffs, human approval gates, retry/branching logic that depends on more than "did the model call a tool," or the ability to pause and resume long-running agent sessions. For a simple single-agent tool-loop with no special control-flow requirements, a plain agent loop (or even a hand-rolled `while` loop over the raw API) is simpler and has less to learn/debug.',
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
                'The risk profile is fundamentally different: a wrong RAG answer is passively wrong information the user can evaluate and choose to trust or verify (especially with citations shown), while a wrong or premature side-effecting action (creating a duplicate ticket, triggering a deployment rollback) directly changes external system state and may not be easily reversible, with consequences beyond the requesting user. This maps directly to the general principle that the cost of an error should determine how much autonomy an agent is given for that class of action — read-only, informational operations can run fully autonomously with the user as the final check, while state-changing operations warrant a human-in-the-loop gate, implemented cleanly in LangGraph as a checkpointed pause rather than either blocking all autonomy or allowing all actions unchecked.',
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
