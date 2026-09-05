import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function UserCard({ name, role, children }) {
  return (
    <div className="user-card">
      <strong>{name}</strong>
      <span className="pill">{role}</span>
      {/* "children" is whatever was nested between the opening/closing tags */}
      <div>{children}</div>
    </div>
  )
}

// Usage — props flow one-way, parent -> child
<UserCard name="Ada Lovelace" role="Engineer">
  <em>Loves algorithms.</em>
</UserCard>`

function UserCard({ name, role, children }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '0.8rem 1rem',
      }}
    >
      <strong>{name}</strong> <span className="pill">{role}</span>
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  )
}

export default function ComponentsProps() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="components-props"
      level="basics"
      title="Components & Props"
      summary="Components are functions that return JSX. Props are the read-only inputs a parent passes down to configure a child — React's version of function arguments."
      keyPoints={[
        'A component is just a function; PascalCase names distinguish them from HTML tags.',
        'Props are read-only. A component must never mutate the props object it receives.',
        'children is a special prop populated with whatever is nested inside the JSX tag.',
        'Destructuring props in the function signature — function Card({ title }) — is the idiomatic style.',
        'Data flows one-way (parent → child); a child talks back up via a callback prop the parent supplies.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo</h3>
        <p className="demo-note">Two instances of the same component, configured with different props.</p>
        <div className="demo-live" style={{ display: 'grid', gap: '0.6rem' }}>
          <UserCard name="Ada Lovelace" role="Engineer">
            <em>Loves algorithms.</em>
          </UserCard>
          <UserCard name="Grace Hopper" role="Rear Admiral">
            <em>Popularized the term "debugging".</em>
          </UserCard>
        </div>
        <CodeBlock code={code} title="UserCard.jsx" />
      </div>

      <Callout kind="tip">
        Reach for <code>propTypes</code> or, better, TypeScript when a component's prop shape
        grows — it turns "wrong prop passed" from a runtime bug into a compile-time error.
      </Callout>
    </TopicPage>
  )
}
