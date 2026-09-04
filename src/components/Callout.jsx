/** Small inline note box. `kind` picks the accent colour/icon. */
export default function Callout({ kind = 'tip', children }) {
  const icons = { tip: '💡', warning: '⚠️', pitfall: '🐛', note: '📌' }
  return (
    <div className={`callout callout--${kind}`}>
      <span className="callout__icon" aria-hidden="true">
        {icons[kind] ?? icons.note}
      </span>
      <div className="callout__body">{children}</div>
    </div>
  )
}
