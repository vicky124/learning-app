import { Link } from 'react-router-dom'
import { menuSections } from '../data/topics.js'

export default function Home() {
  return (
    <div>
      <div className="home-hero">
        <h1>Learn, concept by concept</h1>
        <p>
          A growing collection of self-contained lessons — React's are interactive, live demos
          you can play with right in the browser; every other subject is a written guide with
          real depth, plus an <strong>Interview Q&amp;A</strong> section you can quiz yourself
          against. Work through a subject in order, or jump straight to whatever you need. See{' '}
          <code>DOCUMENTATION.md</code> in the project root for the full written guide to how
          this app itself is built.
        </p>
      </div>

      {menuSections.map((section) => (
        <section className="home-section" key={section.id}>
          <h2 className="home-section__title">
            <span aria-hidden="true">{section.icon}</span> {section.label}
          </h2>
          <div className="home-grid">
            {section.groups.map((group) => (
              <div className="home-card" key={group.id}>
                <h3>{group.label}</h3>
                <ol>
                  {group.topics.map((topic) => (
                    <li key={topic.id}>
                      <Link to={`/${group.id}/${topic.id}`}>{topic.title}</Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
