// Site-wide search over everything in menuSections: topic titles, summaries,
// key points, article body text, and individual interview Q&A entries.
//
// The index is plain data derived from topics.js, built lazily on first
// search (the content files are large, so there's no point flattening them
// until someone actually opens the search dialog).
import { menuSections } from './topics.js'

// Strip the lightweight markdown used throughout the content files so
// snippets read as plain text and matches aren't split by `**`/backticks.
function plain(text = '') {
  return String(text)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[`*_#>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

// Collect searchable prose from an article's blocks. Code and mermaid
// blocks are skipped on purpose — they'd flood results with keyword noise.
function blockText(blocks = []) {
  const parts = []
  for (const block of blocks) {
    if (block.text) parts.push(block.text)
    if (block.title && block.type !== 'code') parts.push(block.title)
    if (Array.isArray(block.items)) {
      for (const item of block.items) parts.push(typeof item === 'string' ? item : item?.text ?? '')
    }
    if (Array.isArray(block.rows)) {
      for (const row of block.rows) parts.push(Array.isArray(row) ? row.join(' ') : '')
    }
  }
  return plain(parts.join(' '))
}

let cachedIndex = null

export function getSearchIndex() {
  if (cachedIndex) return cachedIndex
  const entries = []
  for (const section of menuSections) {
    for (const group of section.groups) {
      for (const topic of group.topics) {
        const path = `/${group.id}/${topic.id}`
        const crumb = `${section.label} › ${group.label}`
        entries.push({
          kind: 'topic',
          key: path,
          path,
          icon: section.icon,
          crumb,
          title: plain(topic.title),
          summary: plain(topic.summary),
          keyPoints: plain((topic.keyPoints ?? []).join(' ')),
          body: blockText(topic.blocks),
          context: plain(`${section.label} ${group.label}`),
        })
        ;(topic.qa ?? []).forEach((item, i) => {
          entries.push({
            kind: 'qa',
            key: `${path}#q-${i + 1}`,
            path: `${path}#q-${i + 1}`,
            icon: section.icon,
            crumb: `${crumb} › Q${i + 1}`,
            title: plain(item.question),
            summary: '',
            keyPoints: '',
            body: plain(item.answer),
            context: plain(`${section.label} ${group.label}`),
          })
        })
      }
    }
  }
  cachedIndex = entries
  return entries
}

// Weighted fields: a hit in the title matters far more than one buried in
// the body. Entries matching every query term always rank above partial
// matches, so adding words narrows the top results the way people expect —
// but partial matches still show (React's hand-built lessons are indexed by
// title only, so "useEffect cleanup" should still find "useEffect &
// Lifecycle").
const FIELDS = [
  ['title', 10],
  ['context', 4],
  ['summary', 3],
  ['keyPoints', 2],
  ['body', 1],
]

export function tokenize(query) {
  return query.toLowerCase().split(/\s+/).filter(Boolean)
}

export function searchTopics(query, limit = 40) {
  const terms = tokenize(query)
  if (terms.length === 0) return []
  const phrase = terms.join(' ')

  const results = []
  for (const entry of getSearchIndex()) {
    let score = 0
    let matchedTerms = 0
    for (const term of terms) {
      let termScore = 0
      for (const [field, weight] of FIELDS) {
        const value = entry[field].toLowerCase()
        if (!value.includes(term)) continue
        termScore += weight
        // Reward whole-word / prefix matches over mid-word substrings.
        if (new RegExp(`\\b${escapeRegExp(term)}`).test(value)) termScore += weight / 2
      }
      if (termScore > 0) matchedTerms++
      score += termScore
    }
    if (matchedTerms === 0) continue
    // Multi-word queries: ignore entries that only hit a single short,
    // common word — they'd swamp the list with noise.
    if (terms.length > 1 && matchedTerms === 1 && score < 10) continue

    const title = entry.title.toLowerCase()
    if (title.includes(phrase)) score += 15
    if (title.startsWith(phrase)) score += 10
    if (entry.kind === 'topic') score += 2

    results.push({ entry, score, matchedTerms, snippet: makeSnippet(entry, terms) })
  }

  results.sort((a, b) => b.matchedTerms - a.matchedTerms || b.score - a.score || a.entry.title.length - b.entry.title.length)
  return results.slice(0, limit)
}

// Show a short window of text around the first match outside the title, so
// the user can see *why* a result matched.
function makeSnippet(entry, terms) {
  for (const field of ['summary', 'keyPoints', 'body']) {
    const text = entry[field]
    if (!text) continue
    const lower = text.toLowerCase()
    const at = Math.min(...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0))
    if (!Number.isFinite(at)) continue
    const start = Math.max(0, at - 60)
    const end = Math.min(text.length, at + 120)
    return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '')
  }
  // Title-only match: fall back to the opening of the summary (or answer).
  const lead = entry.summary || entry.body
  return lead.slice(0, 160) + (lead.length > 160 ? '…' : '')
}

export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
