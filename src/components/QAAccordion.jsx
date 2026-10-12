import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Markdown from './Markdown.jsx'

/**
 * Interview-style Q&A list: each question is collapsed by default so you
 * can quiz yourself before revealing the answer, matching the rest of the
 * app's "click to reveal/expand" pattern used throughout the sidebar.
 */
export default function QAAccordion({ qa = [] }) {
  const [openIndex, setOpenIndex] = useState(null)
  const { hash } = useLocation()

  // Deep links from site search (#q-3) open that question. Adjusted during
  // render (not in an effect) so the accordion is already open on the
  // first paint after navigation.
  const match = /^#q-(\d+)$/.exec(hash)
  const linkedIndex = match && Number(match[1]) <= qa.length ? Number(match[1]) - 1 : null
  const [seenHash, setSeenHash] = useState(null)
  if (hash !== seenHash) {
    setSeenHash(hash)
    if (linkedIndex !== null) setOpenIndex(linkedIndex)
  }

  useEffect(() => {
    if (linkedIndex !== null) document.getElementById(`q-${linkedIndex + 1}`)?.scrollIntoView({ block: 'start' })
  }, [linkedIndex])

  return (
    <div className="qa-list">
      {qa.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div className={`qa-item ${isOpen ? 'qa-item--open' : ''}`} key={i} id={`q-${i + 1}`}>
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
