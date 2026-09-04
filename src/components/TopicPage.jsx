import { Link } from 'react-router-dom'
import { getAdjacentTopics } from '../data/topics.js'
import Markdown from './Markdown.jsx'

/**
 * Standard shell every lesson page renders into: title, summary, key
 * takeaways, the live demo, and prev/next navigation. Keeps every lesson
 * visually consistent without repeating boilerplate markup.
 */
export default function TopicPage({
  groupId,
  topicId,
  level,
  title,
  summary,
  keyPoints = [],
  children,
}) {
  const { prev, next } = getAdjacentTopics(groupId, topicId)

  return (
    <article className="topic-page">
      <header className="topic-page__header">
        <span className={`level-badge level-badge--${level}`}>{level}</span>
        <h1>{title}</h1>
        <p className="topic-page__summary">
          <Markdown text={summary} />
        </p>
      </header>

      {keyPoints.length > 0 && (
        <section className="key-points" aria-label="Key concepts">
          <h2>Key concepts</h2>
          <ul>
            {keyPoints.map((point) => (
              <li key={point}>
                <Markdown text={point} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="topic-page__demo" aria-label="Live demo">
        {children}
      </section>

      <nav className="topic-page__pager" aria-label="Lesson navigation">
        {prev ? (
          <Link className="pager-link pager-link--prev" to={`/${prev.groupId}/${prev.id}`}>
            <span>Previous</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="pager-link pager-link--next" to={`/${next.groupId}/${next.id}`}>
            <span>Next</span>
            {next.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
