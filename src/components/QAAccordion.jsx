import { useState } from 'react'
import Markdown from './Markdown.jsx'

/**
 * Interview-style Q&A list: each question is collapsed by default so you
 * can quiz yourself before revealing the answer, matching the rest of the
 * app's "click to reveal/expand" pattern used throughout the sidebar.
 */
export default function QAAccordion({ qa = [] }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="qa-list">
      {qa.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div className={`qa-item ${isOpen ? 'qa-item--open' : ''}`} key={i}>
            <button
              type="button"
              className="qa-item__question"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="qa-item__number">Q{i + 1}</span>
              <span className="qa-item__text">
                <Markdown text={item.question} />
              </span>
              <span className={`sidebar__chevron ${isOpen ? 'sidebar__chevron--open' : ''}`} aria-hidden="true">
                ▸
              </span>
            </button>
            <div className={`sidebar__drawer ${isOpen ? 'sidebar__drawer--open' : ''}`}>
              <div className="sidebar__drawer-inner" inert={!isOpen}>
                <div className="qa-item__answer">
                  <Markdown text={item.answer} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
