import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { escapeRegExp, searchTopics, tokenize } from '../data/searchIndex.js'

// Wrap every occurrence of a query term in <mark> for the result list.
function Highlight({ text, terms }) {
  if (!terms.length || !text) return text
  const re = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  return text.split(re).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))
}

/**
 * Command-palette style search across every subject. Opened from the topbar
 * button or Ctrl/⌘+K; arrow keys move through results, Enter opens one.
 */
export default function SearchDialog({ open, onClose }) {
  const navigate = useNavigate()
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  // Searching ~thousands of entries is fast, but deferring keeps typing
  // responsive on slow devices while results catch up.
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => searchTopics(deferredQuery), [deferredQuery])
  const terms = useMemo(() => tokenize(deferredQuery), [deferredQuery])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      inputRef.current?.select()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  function go(result) {
    onClose()
    navigate(result.entry.path)
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault()
      go(results[activeIndex])
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      aria-label="Search lessons"
      onClose={onClose}
      // Clicking the ::backdrop lands on the <dialog> element itself.
      onClick={(e) => e.target === dialogRef.current && onClose()}
    >
      <div className="search-dialog__panel">
        <div className="search-dialog__input-row">
          <span aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            className="search-dialog__input"
            type="search"
            placeholder="Search topics, concepts, interview questions…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${activeIndex}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="search-dialog__kbd">Esc</kbd>
        </div>

        {deferredQuery.trim() === '' ? (
          <p className="search-dialog__hint">Type to search every subject — titles, explanations and Q&amp;A.</p>
        ) : results.length === 0 ? (
          <p className="search-dialog__hint">No results for “{deferredQuery}”.</p>
        ) : (
          <ul className="search-dialog__results" id={listId} role="listbox" ref={listRef}>
            {results.map((result, i) => (
              <li
                key={result.entry.key}
                id={`${listId}-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === activeIndex}
                className={`search-result ${i === activeIndex ? 'search-result--active' : ''}`}
                onMouseMove={() => setActiveIndex(i)}
                onClick={() => go(result)}
              >
                <span className="search-result__icon" aria-hidden="true">
                  {result.entry.kind === 'qa' ? '💬' : result.entry.icon}
                </span>
                <span className="search-result__body">
                  <span className="search-result__crumb">{result.entry.crumb}</span>
                  <span className="search-result__title">
                    <Highlight text={result.entry.title} terms={terms} />
                  </span>
                  {result.snippet && (
                    <span className="search-result__snippet">
                      <Highlight text={result.snippet} terms={terms} />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>
  )
}
