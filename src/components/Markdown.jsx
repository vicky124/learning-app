// A deliberately tiny inline-markdown renderer — just enough for the
// content in this app's article-style lessons: **bold**, *italic*,
// `inline code`, and [link text](url). Not a general markdown parser;
// block-level markup (headings, lists, code fences) is modeled as
// structured data instead — see ContentBlocks.jsx.
// The bold alternative must come before the italic one so "**x**" is
// consumed whole rather than leaving stray single asterisks behind.
const TOKEN_RE = /(\*\*.+?\*\*|\*.+?\*|`.+?`|\[.+?\]\(.+?\))/g

export default function Markdown({ text }) {
  if (!text) return null
  const parts = text.split(TOKEN_RE).filter((part) => part !== '')

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>
    }
    const linkMatch = /^\[(.+)\]\((.+)\)$/.exec(part)
    if (linkMatch) {
      const [, label, href] = linkMatch
      const isExternal = /^https?:\/\//.test(href)
      return (
        <a key={i} href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>
          {label}
        </a>
      )
    }
    return part
  })
}
