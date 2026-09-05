import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

const PRODUCTS = [
  { id: 'kb-01', name: 'Mechanical Keyboard' },
  { id: 'ms-02', name: 'Wireless Mouse' },
]

function ProductList() {
  return (
    <ul>
      {PRODUCTS.map((p) => (
        <li key={p.id}><Link to={p.id}>{p.name}</Link></li> // relative link
      ))}
    </ul>
  )
}

function ProductDetail() {
  const { productId } = useParams() // reads the dynamic ":productId" segment
  const navigate = useNavigate()
  const product = PRODUCTS.find((p) => p.id === productId)
  return (
    <div>
      <h4>{product?.name ?? 'Not found'}</h4>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  )
}`

const PRODUCTS = [
  { id: 'kb-01', name: 'Mechanical Keyboard', price: '$89' },
  { id: 'ms-02', name: 'Wireless Mouse', price: '$39' },
  { id: 'mn-03', name: 'Ultrawide Monitor', price: '$429' },
]

function ProductList() {
  return (
    <div>
      <p className="demo-note">Nested route: /advanced/routing/products</p>
      <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem' }}>
        {PRODUCTS.map((p) => (
          <li key={p.id}>
            <Link to={p.id}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find((p) => p.id === productId)
  return (
    <div>
      <p className="demo-note">
        Nested route: /advanced/routing/products/{productId} — read via{' '}
        <code>useParams()</code>
      </p>
      {product ? (
        <p>
          <strong>{product.name}</strong> — {product.price}
        </p>
      ) : (
        <p>Product not found.</p>
      )}
      <button className="btn" onClick={() => navigate(-1)}>
        ← Back (useNavigate(-1))
      </button>
    </div>
  )
}

function RoutingIndex() {
  return (
    <div>
      <p className="demo-note">
        Nested index route: /advanced/routing — pick a sub-route below.
      </p>
      <Link className="btn" to="products" style={{ display: 'inline-block', textDecoration: 'none' }}>
        Go to product list →
      </Link>
    </div>
  )
}

export default function RoutingDeepDive() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="routing"
      level="advanced"
      title="Routing Deep Dive"
      summary="React Router maps URL paths to component trees. This whole lesson site is one big example — but the box below embeds a second, nested router demonstrating dynamic params and programmatic navigation."
      keyPoints={[
        '<Routes>/<Route path element> declare which component renders for a given URL — this app\'s own Layout/Sidebar routing is a live example.',
        'A ":segment" in a path (e.g. /products/:productId) becomes a dynamic param, read with useParams().',
        'Link/NavLink navigate without a full page reload; NavLink additionally exposes isActive for styling the current route.',
        'useNavigate() gives you programmatic navigation — navigate("/path"), or navigate(-1) to go back, useful after form submits.',
        'Routes can nest arbitrarily (a parent path ending in /* plus child <Routes> inside its element, exactly like the demo below).',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — a nested router inside this page</h3>
        <div className="demo-live">
          <Routes>
            <Route index element={<RoutingIndex />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:productId" element={<ProductDetail />} />
          </Routes>
        </div>
        <CodeBlock code={code} title="routing.jsx" />
      </div>

      <Callout kind="note">
        This app itself is built with exactly this system — every sidebar link is a{' '}
        <code>&lt;Route path="/:group/:topic"&gt;</code> defined once in{' '}
        <code>src/App.jsx</code>. See <code>src/data/topics.js</code> for how the routes are
        generated from a single data source.
      </Callout>
    </TopicPage>
  )
}
