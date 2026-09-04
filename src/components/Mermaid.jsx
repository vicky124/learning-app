import { useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'

let initialized = false
function ensureInitialized() {
  if (initialized) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      darkMode: true,
      background: '#0b0d13',
      primaryColor: '#1b1f2e',
      primaryTextColor: '#e7e9f2',
      primaryBorderColor: '#61dafb',
      lineColor: '#61dafb',
      secondaryColor: '#161925',
      tertiaryColor: '#161925',
    },
    securityLevel: 'strict',
  })
  initialized = true
}

/** Renders one mermaid diagram from its text definition. */
export default function Mermaid({ code }) {
  const id = useId().replace(/[:]/g, '-')
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ensureInitialized()

    mermaid
      .render(`mermaid-${id}`, code)
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [code, id])

  if (error) {
    return (
      <div className="mermaid-error">
        Diagram failed to render: {error}
      </div>
    )
  }

  return <div className="mermaid-diagram" ref={containerRef} />
}
