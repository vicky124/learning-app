// A stand-in for an expensive/rarely-used component that benefits from
// being split into its own chunk and only loaded on demand.
export default function HeavyPanel() {
  return (
    <div style={{ padding: '0.8rem 1rem', border: '1px solid var(--border)', borderRadius: 8 }}>
      <strong>📦 HeavyPanel loaded!</strong>
      <p className="demo-note">
        This component lives in its own file and was fetched as a separate chunk only once it
        was actually needed.
      </p>
    </div>
  )
}
