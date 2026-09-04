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
          id: 'what-langchain-solves',
          title: 'LangChain — What It Actually Solves',
          summary:
            'LangChain is a framework of composable abstractions over the "glue code" every LLM application ends up writing by hand: prompt templating, calling a model, parsing output, chaining calls, retrieval, and tool use.',
          keyPoints: [
            'LCEL composes components with the `|` pipe operator, giving streaming/batching/async "for free" across a whole chain.',
            'Chains sequence calls to a model, a tool, and a parser — from a simple prompt-then-parse chain to a multi-step RetrievalQA chain.',
            'Retrievers standardize the interface over any retrieval backend so the rest of a chain doesn\'t care which one is plugged in.',
            'Memory abstractions carry conversation history across turns, from full replay to summarization to entity-specific memory.',
            'Classic LangChain agents follow the ReAct pattern: reason, act (call a tool), observe, repeat — the predecessor to LangGraph\'s more explicit agent construction.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'LangChain is a framework of composable abstractions over the "glue code" every LLM application ends up writing by hand: prompt templating, calling a model, parsing its output, chaining multiple calls together, integrating retrieval, and giving a model tools to call.',
            },
            {
              type: 'list',
              items: [
                '**LCEL (LangChain Expression Language)**: a declarative way to compose components with the `|` pipe operator (`prompt | model | output_parser`), giving you streaming, batching, and async support "for free" across the whole chain without writing that plumbing yourself.',
                '**Chains**: a sequence of calls (to a model, a tool, a parser) composed together — from a simple prompt-then-parse chain to a multi-step `RetrievalQA` chain that retrieves context and generates an answer in one call.',
                '**Retrievers**: a standardized interface over any retrieval backend (a vector store, a keyword search, a hybrid combination, or even a web search) so the rest of your chain doesn\'t care which one is plugged in underneath.',
                '**Memory**: abstractions for carrying conversation history across turns — from simply replaying the full message history, to summarizing older turns to keep context bounded, to entity-specific memory that tracks facts about specific entities mentioned across a conversation.',
                '**Agents (classic LangChain)**: given a set of tools and a goal, the model decides which tool to call and in what order, typically via the **ReAct** pattern (interleaved **Re**asoning and **Act**ing — the model emits a thought, then an action/tool call, observes the result, and repeats until it can produce a final answer). This is the predecessor to LangGraph\'s more explicit, controllable agent construction.',
              ],
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
          id: 'langchain-tradeoffs',
          title: 'Where LangChain Earns Criticism — and When to Reach for It',
          summary:
            'Heavy abstraction layers can obscure exactly what prompt is being sent to the model; the honest, senior answer to "should we use LangChain" depends entirely on how much real orchestration complexity you actually have.',
          keyPoints: [
            'Abstraction layers can make it hard to see exactly what prompt is being sent, complicating debugging and customization.',
            'Version churn has historically broken backward compatibility.',
            'For a genuinely simple single-call task, LangChain\'s abstraction overhead is pure cost with no benefit.',
            'Worth it once you have real orchestration complexity: multi-step chains, several swappable retrieval/model backends, agents.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Heavy abstraction layers can obscure exactly what prompt is being sent to the model and make debugging/customizing behavior harder than writing the API call directly; version churn has historically broken backward compatibility; and for a genuinely simple single-call task, LangChain\'s abstraction overhead is pure cost with no benefit.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The honest, senior answer to "should we use LangChain": it\'s worth it once you have real orchestration complexity (multi-step chains, several swappable retrieval/model backends, agents); for a single prompt-and-parse call, call the provider\'s SDK directly.',
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
              question: 'Explain the difference between LangChain\'s classic agent and a LangGraph agent, concretely.',
              answer:
                'A classic LangChain agent runs an internal, largely opaque loop (the AgentExecutor) that repeatedly calls the model, executes any requested tool, and feeds the result back, until the model stops requesting tools — you configure it but don\'t directly see or control the state transitions. A LangGraph agent makes that same loop an explicit graph you define yourself: a reasoning node, a tool-execution node, and a conditional edge between them that you can inspect, add branches to (e.g., route to a human-approval node instead of executing directly), and checkpoint/resume — the functional behavior can be identical to a simple ReAct agent, but the control flow is explicit code you own rather than framework internals, which is what enables multi-agent routing, human-in-the-loop gates, and persistence that classic agents don\'t support cleanly.',
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
