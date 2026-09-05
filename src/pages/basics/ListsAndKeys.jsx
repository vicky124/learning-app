import { useState } from 'react'
import TopicPage from '../../components/TopicPage.jsx'
import CodeBlock from '../../components/CodeBlock.jsx'
import Callout from '../../components/Callout.jsx'

const code = `function FruitList({ fruits }) {
  return (
    <ul>
      {fruits.map((fruit) => (
        // "key" must be stable & unique among siblings — an id, not the array index.
        <li key={fruit.id}>{fruit.name}</li>
      ))}
    </ul>
  )
}`

let nextId = 4
const initialFruits = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]

function ListsDemo() {
  const [fruits, setFruits] = useState(initialFruits)
  const [text, setText] = useState('')

  function addFruit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setFruits((f) => [...f, { id: nextId++, name: text.trim() }])
    setText('')
  }

  function removeFruit(id) {
    setFruits((f) => f.filter((fruit) => fruit.id !== id))
  }

  function shuffle() {
    setFruits((f) => [...f].sort(() => Math.random() - 0.5))
  }

  return (
    <div>
      <form onSubmit={addFruit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a fruit…"
        />
        <button className="btn" type="submit">
          Add
        </button>
        <button className="btn" type="button" onClick={shuffle}>
          Shuffle
        </button>
      </form>
      <ul className="todo-list">
        {fruits.map((fruit) => (
          <li key={fruit.id}>
            <span className="label">{fruit.name}</span>
            <button className="btn btn--danger" onClick={() => removeFruit(fruit.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ListsAndKeys() {
  return (
    <TopicPage
      groupId="react-guide"
      topicId="lists-keys"
      level="basics"
      title="Lists & Keys"
      summary="Rendering an array of data means mapping it to an array of elements. React needs a stable key on each item so it can match elements across re-renders instead of rebuilding the DOM from scratch."
      keyPoints={[
        'array.map() turns data into JSX elements — keys go on the outermost element returned from the callback.',
        'Keys must be unique among siblings and stable across re-renders — a database id, not Math.random() on every render.',
        'Avoid using the array index as a key when the list can be reordered, filtered, or have items inserted/removed.',
        'A wrong/missing key can cause state to "stick" to the wrong row when the list changes order.',
        'Keys are not passed to the component as a prop — read the id from your own data if you need it inside.',
      ]}
    >
      <div className="demo-section">
        <h3>Live demo — add, remove, shuffle</h3>
        <p className="demo-note">
          Try shuffling: each row keeps its own identity because the key is the stable{' '}
          <code>id</code>, not its position in the array.
        </p>
        <div className="demo-live">
          <ListsDemo />
        </div>
        <CodeBlock code={code} title="FruitList.jsx" />
      </div>

      <Callout kind="warning">
        Using the array index as <code>key</code> is only safe for lists that are static — never
        reordered, filtered, or mutated in the middle. Otherwise it causes subtle bugs with
        input focus, animation, and internal component state.
      </Callout>
    </TopicPage>
  )
}
