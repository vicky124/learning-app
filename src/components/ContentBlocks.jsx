import { Suspense, lazy } from 'react'
import Markdown from './Markdown.jsx'
import CodeBlock from './CodeBlock.jsx'
import Callout from './Callout.jsx'

// Mermaid (and its diagram-type parsers) is a large dependency — load it
// as its own chunk only on pages that actually render a diagram, instead
// of paying for it on every page visit.
const Mermaid = lazy(() => import('./Mermaid.jsx'))

/**
 * Renders an array of structured content blocks — the article-style
 * counterpart to the React section's hand-built demo components. Used for
 * every non-React subject, whose lessons are explanatory text rather than
 * interactive demos.
 */
export default function ContentBlocks({ blocks = [] }) {
  return (
    <div className="article">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading': {
            const Tag = block.level === 4 ? 'h4' : 'h3'
            return (
              <Tag key={i} className="article__heading">
                <Markdown text={block.text} />
              </Tag>
            )
          }
          case 'p':
            return (
              <p key={i} className="article__p">
                <Markdown text={block.text} />
              </p>
            )
          case 'list': {
            const ListTag = block.ordered ? 'ol' : 'ul'
            return (
              <ListTag key={i} className="article__list">
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Markdown text={item} />
                  </li>
                ))}
              </ListTag>
            )
          }
          case 'code':
            return <CodeBlock key={i} code={block.code} language={block.language} title={block.title} />
          case 'table':
            return (
              <div className="article__table-wrap" key={i}>
                <table className="article__table">
                  <thead>
                    <tr>
                      {block.headers.map((h, j) => (
                        <th key={j}>
                          <Markdown text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>
                            <Markdown text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'mermaid':
            return (
              <Suspense key={i} fallback={<p className="demo-note">Loading diagram…</p>}>
                <Mermaid code={block.code} />
              </Suspense>
            )
          case 'callout':
            return (
              <Callout key={i} kind={block.kind}>
                <Markdown text={block.text} />
              </Callout>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
