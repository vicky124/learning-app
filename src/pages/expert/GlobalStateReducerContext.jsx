import { createContext, useContext, useReducer } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: crypto.randomUUID(), name: action.name }]
    case 'remove':
      return state.filter((item) => item.id !== action.id)
    case 'clear':
      return []
    default:
      return state
  }
}

function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  // useReducer + Context = a lightweight, dependency-free global store.
  return <CartContext.Provider value={{ items, dispatch }}>{children}</CartContext.Provider>
}

function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

// Any component, anywhere in the tree, can read/dispatch:
function AddToCartButton({ name }) {
  const { dispatch } = useCart()
  return <button onClick={() => dispatch({ type: 'add', name })}>Add {name}</button>
}`

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: `${Date.now()}-${Math.random()}`, name: action.name }]
    case 'remove':
      return state.filter((item) => item.id !== action.id)
    case 'clear':
      return []
    default:
      return state
  }
}

function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  return <CartContext.Provider value={{ items, dispatch }}>{children}</CartContext.Provider>
}

function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

function ProductShelf() {
  const { dispatch } = useCart()
  const products = ['Coffee', 'Notebook', 'Headphones']
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {products.map((name) => (
        <button key={name} className="btn" onClick={() => dispatch({ type: 'add', name })}>
          Add {name}
        </button>
      ))}
    </div>
  )
}

function CartSummary() {
  const { items, dispatch } = useCart()
  return (
    <div style={{ marginTop: '0.8rem' }}>
      <strong>Cart ({items.length})</strong>
      <ul className="todo-list">
        {items.map((item) => (
          <li key={item.id}>
            <span className="label">{item.name}</span>
            <button className="btn btn--danger" onClick={() => dispatch({ type: 'remove', id: item.id })}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {items.length > 0 && (
        <button className="btn" style={{ marginTop: '0.5rem' }} onClick={() => dispatch({ type: 'clear' })}>
          Clear cart
        </button>
      )}
    </div>
  )
}

export default function GlobalStateReducerContext() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="global-state"
      level="expert"
      title="Reducer + Context (Global State)"
      summary="Combining useReducer for predictable transitions with Context for tree-wide access gives you a small, dependency-free global store — the pattern most external state libraries formalize further."
      keyPoints={[
        'The reducer owns all the transition logic; the Provider exposes { state, dispatch } through Context.',
        'A custom hook (useCart) wraps useContext and throws if called outside the Provider — fails fast with a clear error instead of a confusing crash.',
        'Any descendant component can dispatch actions or read state without prop drilling, regardless of nesting depth.',
        'This pattern does not solve performance the way a selector-based store (Redux, Zustand) does — every consumer re-renders on every state change, since Context has no partial subscriptions.',
        'For larger apps with frequent, granular updates, a dedicated state library often outperforms hand-rolled Context because it supports subscribing to just a slice of state.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — a tiny shopping cart store</h3>
        <div className="demo-live">
          <CartProvider>
            <ProductShelf />
            <CartSummary />
          </CartProvider>
        </div>
        <CodeBlock code={code} title="CartStore.jsx" />
      </div>

      <Callout kind="tip">
        This is exactly the shape of store that Redux (reducer + store + dispatch) and
        Zustand/Jotai (hook-based access) are built to formalize at scale, with better
        performance characteristics for large component trees.
      </Callout>
    </TopicPage>
  )
}
