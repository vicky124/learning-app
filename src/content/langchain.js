export const langchainSection = {
  id: 'langchain',
  label: 'LangChain',
  icon: '🦜',
  groups: [
    {
      id: 'langchain-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-problem-langchain-solves',
          title: 'What Problem Does LangChain Solve? The Chain Abstraction',
          summary:
            'Every real LLM application ends up writing the same handful of glue code — format a prompt, call a model, parse the output, maybe retrieve something first. LangChain\'s core idea is to package each of those steps as a standardized, swappable component and let you wire them into a "chain."',
          keyPoints: [
            'Every real LLM application needs the same handful of pieces: format a prompt, call a model, parse its output — LangChain packages each as a standardized, swappable component.',
            'A "chain" is simply a sequence of these components wired together so the output of one feeds the input of the next.',
            'The value isn\'t any single component (each is a thin wrapper you could write yourself in a few lines) — it\'s that they all share a common interface, so components snap together and can be swapped independently without touching the rest of the pipeline.',
            'LangChain is a framework, not a hosted service — it runs inside your own application code/infrastructure, calling out to whichever model provider(s) you configure.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Without a framework, a basic "answer using retrieved context" feature already means hand-writing: string-template the prompt, call the model SDK, extract text from its response object, and — if you want retrieval — separately call a vector store and stitch its results into the prompt yourself. None of this is individually hard, but every team ends up rebuilding the same wiring, with subtly different bugs each time (forgetting to handle streaming, forgetting to handle a tool call in the response, forgetting async support). LangChain\'s bet is that if every one of these pieces — prompt template, model call, output parser, retriever — implements the *same* interface, they become interchangeable, testable in isolation, and composable with a single operator.',
            },
            {
              type: 'heading',
              text: 'The chain, as a mental model',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Input(["chain input<br/>e.g. { question: '...' }"]) --> Prompt["PromptTemplate<br/>fills variables into prompt text"]
    Prompt --> Model["Chat Model<br/>sends prompt, gets a response"]
    Model --> Parser["Output Parser<br/>extracts structured result"]
    Parser --> Output(["chain output<br/>e.g. a string or object"])`,
            },
            {
              type: 'list',
              items: [
                '**Chains**: a sequence of calls (to a model, a tool, a parser) composed together — from a simple prompt-then-parse chain to a multi-step retrieve-then-generate chain.',
                '**Retrievers**: a standardized interface over any retrieval backend (a vector store, a keyword search, a hybrid combination, or even a web search) so the rest of a chain doesn\'t care which one is plugged in underneath.',
                '**Memory**: abstractions for carrying conversation history across turns — covered in its own topic below.',
                '**Agents (classic LangChain)**: given a set of tools and a goal, the model decides which tool to call and in what order — covered in its own topic below, along with why LangGraph exists as its modern successor.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'LangChain is one of several frameworks in this space, not the only option — LlamaIndex leans retrieval/indexing-first, and LangGraph (from the same team) exists specifically for explicit, controllable agent orchestration rather than linear chains. This guide covers LangChain\'s own abstractions; see the separate LangGraph guide for why a graph-based model was built on top of/alongside it.',
            },
          ],
        },
        {
          id: 'core-building-blocks',
          title: 'The Core Building Blocks: Prompts, Models, Parsers, Retrievers',
          summary:
            'Before composing anything with LCEL, it helps to know the four pieces you are actually composing — each is simple in isolation, and each implements the same shared interface that makes piping them together possible.',
          keyPoints: [
            'PromptTemplate / ChatPromptTemplate: parameterized prompt text with named variables filled in at call time, keeping prompt text out of business logic.',
            'Chat models are the standard interface today — a list of role-tagged messages (system/human/AI) in, a message out — used even for single-turn, non-conversational tasks.',
            'Output parsers turn a model\'s raw text/message into a structured object — from a plain string parser to a schema-validated (Pydantic) parser.',
            'Retrievers expose a standardized `.invoke(query) -> list[Document]` interface over any retrieval backend, so the rest of a chain doesn\'t care what search technology is underneath.',
            'Every one of these implements the same base `Runnable` interface — this is what makes piping them together with `|` possible at all.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'each building block, used standalone',
              code: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_anthropic import ChatAnthropic

# 1. Prompt template — parameterized text, filled in at call time
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a concise support agent."),
    ("human", "{question}"),
])
messages = prompt.format_messages(question="How do I reset my password?")

# 2. Chat model — messages in, a message out
model = ChatAnthropic(model="claude-opus-5")
response = model.invoke(messages)   # response.content is the raw text

# 3. Output parser — turn the raw response into what your code actually wants
answer = StrOutputParser().invoke(response)   # just the string

# 4. Retriever — same interface regardless of backend (vector store, hybrid, web search…)
docs = retriever.invoke("password reset policy")   # -> list[Document]`,
            },
            {
              type: 'table',
              headers: ['Component', 'Purpose', 'Typical class'],
              rows: [
                ['Prompt template', 'Fill named variables into prompt text/messages', '`ChatPromptTemplate`, `PromptTemplate`'],
                ['Chat model', 'Send messages to a provider, get a response message back', '`ChatAnthropic`, `ChatOpenAI`, …'],
                ['Output parser', 'Turn the raw model response into a structured value', '`StrOutputParser`, `PydanticOutputParser`, `JsonOutputParser`'],
                ['Retriever', 'Fetch relevant documents for a query, regardless of backend', '`VectorStoreRetriever`, custom retrievers'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Vars(["named variables<br/>e.g. { question }"]) --> PT["Prompt Template"]
    PT --> Msgs["formatted messages"]
    Msgs --> CM["Chat Model"]
    CM --> Raw["raw response message"]
    Raw --> OP["Output Parser"]
    OP --> Struct["structured value<br/>(string, object, …)"]
    Query(["query"]) --> Ret["Retriever"]
    Ret --> Docs["list[Document]"]
    Docs -.can feed into.-> Vars`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Once you understand that every one of these implements the same `Runnable` interface (`.invoke()`, `.batch()`, `.stream()`, and async equivalents), you understand the shape of essentially all of LangChain — the framework\'s complexity is almost entirely in the breadth of pre-built components, not in a deep or unusual core abstraction.',
            },
          ],
        },
        {
          id: 'lcel-in-practice',
          title: 'LCEL in Practice: A Minimal RAG Chain',
          summary:
            'A concrete LCEL chain shows what the pipe operator actually buys you: retrieval, prompt formatting, model call, and output parsing composed into one declarative pipeline.',
          keyPoints: [
            'A dict literal on the left of the first `|` runs its values in parallel and feeds their results into the prompt template as named variables.',
            '`RunnablePassthrough()` forwards the original input (the question) unchanged alongside the retrieved-and-formatted context.',
            'Every stage — prompt, model, parser — is swappable independently because each implements the same Runnable interface.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'A minimal LCEL chain: retrieve, then generate a grounded answer.',
              code: `from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

prompt = ChatPromptTemplate.from_template(
    "Answer using only the context below. If the answer isn't in the "
    "context, say you don't know.\\n\\nContext:\\n{context}\\n\\nQuestion: {question}"
)

def format_docs(docs):
    return "\\n\\n".join(d.page_content for d in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)
# rag_chain.invoke("What's our refund policy for annual plans?")`,
            },
            {
              type: 'p',
              text: 'Reading it left to right: the retriever fetches documents and `format_docs` joins them into a string for `context`, while `RunnablePassthrough()` forwards the original question unchanged for `question`. Both run against the same input, their outputs land in the prompt template\'s variables, the filled prompt goes to the model, and `StrOutputParser()` extracts the plain-text answer from the model\'s response object.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Because every stage implements the same `Runnable` interface, streaming, batching, and async all work automatically across the whole composed chain — swap the model or the retriever for a different implementation and the rest of the pipeline needs no changes.',
            },
          ],
        },
        {
          id: 'lcel-composability-runnables',
          title: 'LCEL Composition Patterns: Parallel, Lambda, Branch, and Fallbacks',
          summary:
            'The `|` operator is just function composition, but real chains need more than a straight line: running steps concurrently, wrapping plain functions, branching conditionally, and falling back to a backup model when the primary fails.',
          keyPoints: [
            '`RunnableParallel` (the dict-literal shorthand seen in the RAG chain above) runs multiple branches concurrently and merges their outputs into named fields.',
            '`RunnableLambda` wraps a plain Python function so it can participate in a chain exactly like any other Runnable.',
            '`RunnableBranch` implements conditional routing within a chain — the LCEL equivalent of an if/else based on the input.',
            '`.with_fallbacks([...])` attaches one or more backup Runnables to retry with if the primary fails — e.g., a cheaper/faster model failing over to a stronger one on error.',
            'Because every stage shares the same Runnable interface, `.invoke()`, `.batch()`, `.stream()`, and their async equivalents work identically across an entire composed chain, no matter how deep or how many branches it has.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The `|` operator is literally function composition: `a | b` means "run `a`, feed its output into `b`." Everything else in LCEL is about expressing patterns beyond a straight line — running things concurrently, branching, and recovering from failure — while staying inside that same composable Runnable interface.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Input(["chain input"]) --> Par["RunnableParallel"]
    subgraph Branches [" "]
        direction TB
        B1["context:<br/>retriever ⏐ format_docs"]
        B2["question:<br/>RunnablePassthrough()"]
    end
    Par --> B1
    Par --> B2
    B1 --> Merge["merged dict<br/>{context, question}"]
    B2 --> Merge
    Merge --> Prompt[ChatPromptTemplate]
    Prompt --> Model[Primary Chat Model]
    Model -->|on error| Fallback["Fallback Model<br/>.with_fallbacks([...])"]
    Model --> Parser[StrOutputParser]
    Fallback --> Parser
    Parser --> Output(["chain output"])`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'RunnableLambda, RunnableBranch, and fallbacks',
              code: `from langchain_core.runnables import RunnableLambda, RunnableBranch

# RunnableLambda: any plain function becomes a chain-compatible step
uppercase = RunnableLambda(lambda text: text.upper())
pipeline = prompt | model | StrOutputParser() | uppercase

# RunnableBranch: route based on a condition inspected at runtime
route = RunnableBranch(
    (lambda x: "refund" in x["question"].lower(), refund_chain),
    (lambda x: "billing" in x["question"].lower(), billing_chain),
    general_chain,  # default branch
)

# Fallbacks: retry with a stronger/backup model if the primary fails
robust_model = fast_cheap_model.with_fallbacks([strong_expensive_model])
robust_chain = prompt | robust_model | StrOutputParser()`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Streaming "for free" is not magic — it works because every Runnable in a chain implements `.stream()`, and LCEL\'s composition machinery chains those `.stream()` calls together token-by-token instead of waiting for each stage to fully complete before starting the next. This is exactly the plumbing you would otherwise have to hand-write to stream through a multi-step pipeline yourself.',
            },
          ],
        },
        {
          id: 'memory-and-conversation-history',
          title: 'Memory and Conversation History Management',
          summary:
            'An LCEL chain is stateless by default — every `.invoke()` starts fresh. Giving a chain "memory" of past turns means explicitly loading and saving history around it, with a real design choice in how much of that history to keep verbatim.',
          keyPoints: [
            'A chain built purely with LCEL is stateless — each `.invoke()` call has no memory of previous calls unless the caller explicitly passes prior history in.',
            '`RunnableWithMessageHistory` wraps a chain and manages loading/saving message history per session, keyed by a session ID.',
            'Full-history replay (pass every past message back in on every call) is simplest but eventually exceeds the context window or gets expensive on long conversations.',
            'Summarization memory periodically compresses older turns into a running summary that substitutes for verbatim history, trading fidelity for bounded size.',
            'Entity/structured memory extracts and stores durable facts (a stated preference, a name, an account ID) separately, rather than relying on replaying raw conversation for long-term recall.',
            'Modern LangChain favors persisting message history externally (a database, or LangGraph\'s checkpointer for agents) over the older in-chain Memory classes from early LangChain versions.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Nothing about `prompt | model | parser` remembers anything between calls — each `.invoke()` is a fresh, independent execution. "Memory" in LangChain is really just a pattern: store the conversation somewhere, load the relevant part of it back into the prompt on each turn, and save the new turn afterward. `RunnableWithMessageHistory` packages exactly this pattern around any chain.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'wrapping a chain with per-session message history',
              code: `from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

store = {}  # swap for a database-backed store (e.g. Redis, Postgres) in production

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

chain_with_history = RunnableWithMessageHistory(
    rag_chain,                         # any Runnable — e.g. the RAG chain above
    get_session_history,
    input_messages_key="question",
    history_messages_key="history",
)

chain_with_history.invoke(
    {"question": "What's our refund policy?"},
    config={"configurable": {"session_id": "user-42"}},
)
# a later call with the same session_id automatically includes prior turns`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    In(["invoke({question}, session_id)"]) --> Load["load history<br/>for this session_id"]
    Load --> Merge["merge history + new question<br/>into chain input"]
    Merge --> Chain["underlying chain<br/>(prompt ⏐ model ⏐ parser)"]
    Chain --> Out["response"]
    Out --> Save["save this turn<br/>back to history store"]
    Save --> Store[("history store<br/>keyed by session_id")]
    Store -.-> Load`,
            },
            {
              type: 'table',
              headers: ['Strategy', 'How it works', 'Best for'],
              rows: [
                ['Full replay', 'Every past message is resent verbatim on every call', 'Short conversations where exact recall matters and cost/context isn\'t a concern'],
                ['Summarization', 'Older turns are periodically compressed by an LLM into a running summary, kept instead of full history', 'Long conversations where the gist matters more than exact past wording'],
                ['Entity / structured memory', 'Durable facts (preferences, names, IDs) are extracted and stored separately as structured data, not raw messages', 'Long-term relationships where specific facts must be reliably recalled regardless of how long ago they were mentioned'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'For an agent (not just a linear chain), LangGraph\'s checkpointer is the more capable modern equivalent — it persists the entire graph state (not just messages) after every node, enabling pause/resume and human-in-the-loop, not only conversation recall. See the LangGraph guide\'s topic on core primitives.',
            },
          ],
        },
        {
          id: 'tool-calling-in-langchain',
          title: 'Tool / Function Calling in LangChain',
          summary:
            'The underlying capability is the model provider\'s own tool-calling mechanism; what LangChain adds is a standardized way to define a tool once and bind it to any supported chat model, instead of hand-writing each provider\'s schema format.',
          keyPoints: [
            'The underlying capability is the model provider\'s native tool/function-calling mechanism — LangChain standardizes how tools are *defined and bound*, not the capability itself.',
            '`@tool` turns a plain Python function (with a docstring and type hints) into a schema-carrying tool definition the model can be shown.',
            '`.bind_tools([...])` attaches a set of tools to a chat model, so every subsequent call includes their schemas and the model may respond with a tool call instead of plain text.',
            'The application — not LangChain automatically — is still responsible for actually executing the requested tool and returning its result, unless you use a pre-built agent executor that drives this loop for you.',
            '`.with_structured_output(Schema)` reuses this exact same tool-calling machinery under the hood on many providers, even when you are not building an "agent" at all — it is often the cleanest way to get schema-validated JSON out of a model.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'python',
              title: 'defining and binding a tool',
              code: `from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get the current weather for a given city."""
    return call_weather_api(city)

model_with_tools = model.bind_tools([get_weather])

response = model_with_tools.invoke("What's the weather in Tokyo?")
# response.tool_calls -> [{"name": "get_weather", "args": {"city": "Tokyo"}, "id": "..."}]

# Your code executes the requested tool and returns the result:
from langchain_core.messages import ToolMessage

results = [
    ToolMessage(content=str(get_weather.invoke(call["args"])), tool_call_id=call["id"])
    for call in response.tool_calls
]
final = model_with_tools.invoke([*previous_messages, response, *results])`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant App
    participant Model as Chat Model (tools bound)
    participant Tool as get_weather()
    App->>Model: invoke(messages)
    Model-->>App: AIMessage with tool_calls
    App->>Tool: execute requested tool(args)
    Tool-->>App: result
    App->>Model: invoke(messages + ToolMessage(result))
    Model-->>App: AIMessage with final text answer`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'This is the same fundamental loop shown in raw form (no LangChain at all) in the LangGraph guide\'s "hand-rolled agentic tool-use loop" topic — comparing the two side by side is the fastest way to see exactly what LangChain\'s `@tool` and `.bind_tools()` are actually saving you from writing by hand: mostly the provider-specific JSON schema formatting and message-shape boilerplate, not the control flow itself.',
            },
          ],
        },
        {
          id: 'classic-agents-react-in-langchain',
          title: 'Classic Agents in LangChain: The ReAct Pattern',
          summary:
            'Given a set of tools and a goal, a classic LangChain agent decides which tool to call and in what order using the ReAct pattern — an opaque loop that AgentExecutor drives for you, and precisely what LangGraph was built to make explicit and controllable.',
          keyPoints: [
            'ReAct interleaves reasoning ("Thought") and acting ("Action": call a tool) with "Observation" of the result, repeating until the model emits a final answer.',
            '`create_react_agent` + `AgentExecutor` wrap this loop so you don\'t hand-write it — you supply tools, a model, and a prompt, and the executor drives the loop internally.',
            'The loop is opaque: you configure inputs and get a final output, but you don\'t see or directly control individual state transitions the way you would in a graph.',
            'Common built-in safety valves: `max_iterations` (a hard cap on loop count) and `handle_parsing_errors` (recover gracefully if the model\'s output can\'t be parsed into a valid action).',
            'This exact opacity — no easy way to add a human-approval step mid-loop, or route between multiple specialized agents — is precisely what LangGraph was built to address; see the separate LangGraph guide.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Thought["Thought:<br/>reason about what to do next"] --> Action["Action:<br/>call a tool"]
    Action --> Observation["Observation:<br/>tool result"]
    Observation --> Thought
    Thought -->|model has enough info| Final["Final Answer"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'a classic ReAct agent via AgentExecutor',
              code: `from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub

prompt = hub.pull("hwchase17/react")   # a pre-built ReAct prompt template
agent = create_react_agent(model, tools, prompt)

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=6,          # hard stop, prevents runaway loops
    handle_parsing_errors=True,
)

executor.invoke({
    "input": "What's the weather in Tokyo, and should I bring an umbrella?"
})`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Functionally, this can behave identically to a simple LangGraph agent for a single-agent, no-special-control-flow case. The difference is entirely in *visibility and control*: `AgentExecutor`\'s loop is framework-internal, while a LangGraph graph makes the same loop explicit code you own — which is what enables checkpointing, human-in-the-loop gates, and multi-agent handoffs that AgentExecutor does not support cleanly.',
            },
          ],
        },
        {
          id: 'langchain-tradeoffs',
          title: 'Where LangChain Earns Criticism — and When to Reach for It',
          summary:
            'Heavy abstraction layers can obscure exactly what prompt is being sent to the model; the honest, senior answer to "should we use LangChain" depends entirely on how much real orchestration complexity you actually have.',
          keyPoints: [
            'Abstraction layers can make it hard to see exactly what prompt is being sent, complicating debugging and customization.',
            'Version churn has historically broken backward compatibility across releases.',
            'For a genuinely simple single-call task, LangChain\'s abstraction overhead is pure cost with no benefit.',
            'Worth it once you have real orchestration complexity: multi-step chains, several swappable retrieval/model backends, memory, or tool use.',
            'For agents specifically, LangGraph (not classic LangChain agents) is the modern recommendation once you need explicit, controllable, or multi-agent flow.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Heavy abstraction layers can obscure exactly what prompt is being sent to the model and make debugging/customizing behavior harder than writing the API call directly; version churn has historically broken backward compatibility; and for a genuinely simple single-call task, LangChain\'s abstraction overhead is pure cost with no benefit.',
            },
            {
              type: 'list',
              items: [
                '**Debuggability**: a deeply nested chain of Runnables can make it non-obvious exactly what final prompt reached the model — tools like LangSmith (tracing) exist largely to make this visible again, which is itself a sign of the cost the abstraction imposes.',
                '**Version churn**: LangChain has historically restructured its own APIs (the split into `langchain-core`, `langchain-community`, provider-specific packages) in ways that broke code written against earlier versions — worth factoring into a "how stable is this dependency" assessment.',
                '**Overhead for simple cases**: a single prompt-and-parse call gains nothing from LCEL\'s composability machinery — it is pure indirection over what would otherwise be a five-line API call.',
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TD
    Task["New LLM feature to build"] --> Simple{"Single prompt-and-parse call,<br/>one model, no retrieval/memory/tools?"}
    Simple -->|Yes| Raw["Call the provider SDK directly<br/>a few lines, nothing to gain from LCEL"]
    Simple -->|No| Complex{"Real orchestration complexity:<br/>multi-step chains, swappable backends,<br/>memory, or tool use?"}
    Complex -->|Yes| LC["Use LangChain<br/>Runnables + LCEL composition"]
    Complex -->|No| Raw
    LC --> Agentic{"Needs agentic control flow:<br/>branching, human approval,<br/>multi-agent handoffs?"}
    Agentic -->|Yes| LG["Reach for LangGraph<br/>explicit, controllable graph"]
    Agentic -->|No| LC`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The honest, senior answer to "should we use LangChain": it\'s worth it once you have real orchestration complexity (multi-step chains, several swappable retrieval/model backends, memory across turns, tool use); for a single prompt-and-parse call, call the provider\'s SDK directly. And for anything agentic beyond the simplest tool loop, reach for LangGraph rather than classic LangChain agents — it is the actively developed answer for controllable agent orchestration.',
            },
          ],
        },
      ],
    },
    {
      id: 'langchain-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'LangChain interview questions, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'What is LCEL, and what does the `|` operator actually do under the hood?',
              answer:
                'LCEL (LangChain Expression Language) is a declarative way to compose Runnable components. Every component — a prompt template, a model, an output parser, a retriever — implements the same `Runnable` interface, exposing `.invoke()`, `.batch()`, `.stream()`, and async equivalents. The `|` operator is Python\'s overloaded bitwise-or, redefined on `Runnable` to mean function composition: `a | b` returns a new `RunnableSequence` whose `.invoke(x)` calls `a.invoke(x)` and feeds the result into `b.invoke(...)`. Because this composition is defined generically over the shared interface rather than hard-coded per pair of components, streaming/batching/async propagate through the whole chain automatically — `.stream()` on a composed chain streams `a`\'s output into `b`\'s `.stream()` rather than waiting for `a` to fully finish first.',
            },
            {
              question: 'What\'s the difference between RunnableParallel and simply chaining Runnables in sequence with `|`?',
              answer:
                'Sequential piping (`a | b`) means `b` runs only after `a` completes, using `a`\'s output as its entire input. `RunnableParallel` (commonly written as a plain dict literal, e.g. `{"context": retriever, "question": RunnablePassthrough()}`) instead runs multiple branches concurrently against the *same* input and merges each branch\'s output into a named field of a combined dict — this is how a RAG chain retrieves context and passes through the original question at the same time rather than one after the other. Choosing between them is really about data dependency: use sequential piping when a step genuinely needs the previous step\'s output, and RunnableParallel when multiple independent pieces of work can happen concurrently and just need to be combined afterward.',
            },
            {
              question: 'How does LangChain\'s tool/function calling work under the hood, and what is LangChain actually adding versus the raw provider API?',
              answer:
                'The actual capability — a model emitting a structured request to call a named function with arguments — comes entirely from the model provider\'s own API; LangChain does not add new model capability. What it adds is a standardized way to *define* a tool (the `@tool` decorator turns a plain Python function\'s signature and docstring into a JSON-schema tool definition) and *bind* it to a model (`.bind_tools([...])` handles translating that standardized definition into whatever schema format the specific provider\'s API expects). Execution of the requested tool and feeding the result back to the model is still something your application code does explicitly — LangChain gives you the wiring and format-translation, not automatic execution, unless you opt into a higher-level construct like `AgentExecutor` that drives that loop for you.',
            },
            {
              question: 'What\'s the difference between full-replay memory, summarization memory, and entity/structured memory, and when would you choose each?',
              answer:
                'Full-replay memory resends every past message verbatim on every call — simplest and most faithful, but its token cost grows linearly with conversation length and it eventually exceeds the context window on long conversations. Summarization memory periodically compresses older turns into a running summary kept instead of the full verbatim history, bounding size at the cost of losing exact past wording — appropriate when the gist of earlier conversation matters more than precise recall. Entity/structured memory extracts and stores specific durable facts (a stated preference, an account ID, a name) as structured data separate from the raw conversation, so they can be reliably recalled regardless of how long ago they were mentioned or how much conversation has happened since — appropriate for long-term relationships where specific facts, not general gist, need to survive. Production systems often combine these: structured memory for durable facts, summarization for general context, and only a recent window of full-replay for immediate conversational coherence.',
            },
            {
              question: 'Explain the difference between LangChain\'s classic agent and a LangGraph agent, concretely.',
              answer:
                'A classic LangChain agent runs an internal, largely opaque loop (the AgentExecutor) that repeatedly calls the model, executes any requested tool, and feeds the result back, until the model stops requesting tools — you configure it but don\'t directly see or control the state transitions. A LangGraph agent makes that same loop an explicit graph you define yourself: a reasoning node, a tool-execution node, and a conditional edge between them that you can inspect, add branches to (e.g., route to a human-approval node instead of executing directly), and checkpoint/resume — the functional behavior can be identical to a simple ReAct agent, but the control flow is explicit code you own rather than framework internals, which is what enables multi-agent routing, human-in-the-loop gates, and persistence that classic agents don\'t support cleanly.',
            },
            {
              question: 'What is an output parser, and why prefer a dedicated structured output parser over simply asking the model to "please respond in JSON" in the prompt?',
              answer:
                'An output parser is a Runnable that turns a model\'s raw response (plain text, or a message object) into the structured value your application actually wants — a plain string (`StrOutputParser`), a validated object matching a schema (`PydanticOutputParser`), or arbitrary parsed JSON (`JsonOutputParser`). Asking a model to "please respond in JSON" purely through prompt instructions is unreliable: the model can still wrap the JSON in explanatory prose, produce syntactically invalid JSON, or omit required fields, none of which is caught until something downstream fails to parse it. A structured output approach (LangChain\'s `.with_structured_output(Schema)`, which on many providers uses the same underlying tool-calling machinery to constrain generation) instead validates against a schema at the API/parsing level, catching and often preventing malformed output before it ever reaches your application code, rather than hoping the model followed the prompt\'s formatting instructions.',
            },
            {
              question: 'When would you deliberately choose NOT to use LangChain for an LLM feature?',
              answer:
                'For a genuinely simple, single-call feature — one prompt template, one model call, plain text or a single structured field back — LangChain\'s abstraction machinery (Runnables, LCEL composition, provider-agnostic wrappers) adds indirection with no corresponding benefit over calling the provider\'s SDK directly in a few lines; the abstraction only pays for itself once there is real orchestration complexity (multiple swappable backends, multi-step chains, memory, or tool use). It is also worth avoiding when a team specifically needs to see and control the exact prompt/request sent to the model with no wrapper in between (e.g., squeezing out the last bit of latency, or debugging provider-specific behavior) — a thin abstraction between application code and the raw API can make that harder than necessary. Finally, for genuinely agentic control flow, classic LangChain agents specifically (not LangChain as a whole) are the wrong reach today — LangGraph is the actively recommended tool for that.',
            },
            {
              question: 'How would you handle a conversation that\'s grown too long for the model\'s context window, in a production chat application?',
              answer:
                'The naive fix (just truncate the oldest messages) risks losing context the user still expects the model to remember. Better approaches, often combined: **summarization** (periodically compress older turns into a running summary that\'s kept in context instead of the full verbatim history — trading some fidelity for bounded size), **selective retrieval over conversation history** (treat past conversation turns themselves as a retrievable corpus, and pull back only turns relevant to the current message rather than keeping the entire linear history), and **explicit memory extraction** (pull out durable facts worth remembering — e.g., a stated user preference — into a separate, small, structured memory store rather than relying on raw conversation replay at all for long-term facts). The right combination depends on whether the product needs perfect recall of exact past statements (favor summarization/retrieval hybrids) or mainly needs to remember key facts/preferences across a long relationship (favor explicit structured memory).',
            },
          ],
        },
      ],
    },
  ],
}
