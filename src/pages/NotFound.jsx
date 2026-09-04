import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="home-hero">
      <h1>404 — Lesson not found</h1>
      <p>
        That topic doesn't exist. <Link to="/">Go back home</Link>.
      </p>
    </div>
  )
}
