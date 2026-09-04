import { useState } from 'react'

/** Displays a labelled, copyable code sample. Purely presentational. */
export default function CodeBlock({ code, language = 'jsx', title }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can be unavailable (permissions, insecure context) — fail silently.
    }
  }

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__title">{title ?? language}</span>
        <button type="button" className="code-block__copy" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="code-block__pre">
        <code>{code}</code>
      </pre>
    </div>
  )
}
