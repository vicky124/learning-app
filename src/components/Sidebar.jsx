import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { menuSections } from '../data/topics.js'

// The route shape is /:groupId/:topicId, so the first path segment tells us
// which group (and therefore which section) is currently active.
function activeGroupIdFromPath(pathname) {
  const [, group] = pathname.split('/')
  return group || null
}

export default function Sidebar({ open, onNavigate }) {
  const location = useLocation()
  const activeGroupId = activeGroupIdFromPath(location.pathname)

  const activeSectionId = useMemo(() => {
    const section = menuSections.find((s) => s.groups.some((g) => g.id === activeGroupId))
    return section?.id ?? menuSections[0]?.id ?? null
  }, [activeGroupId])

  // Drawers start open only for whichever section/group contains the page
  // you're currently on — everything else starts collapsed.
  const [openSections, setOpenSections] = useState(() => new Set([activeSectionId]))
  const [openGroups, setOpenGroups] = useState(() => new Set([activeGroupId]))

  function toggleSection(id) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleGroup(id) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">
          📚
        </span>
        <div>
          <strong>Learning Hub</strong>
          <div className="sidebar__subtitle">Basics to Advanced</div>
        </div>
      </div>

      <NavLink to="/" end className="sidebar__home" onClick={onNavigate}>
        🏠 Home
      </NavLink>

      <nav className="sidebar__nav">
        {menuSections.map((section) => {
          const sectionOpen = openSections.has(section.id)
          return (
            <div className="sidebar__section" key={section.id}>
              <button
                type="button"
                className="sidebar__section-toggle"
                aria-expanded={sectionOpen}
                onClick={() => toggleSection(section.id)}
              >
                <span className="sidebar__section-icon" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="sidebar__section-label">{section.label}</span>
                <span className={`sidebar__chevron ${sectionOpen ? 'sidebar__chevron--open' : ''}`} aria-hidden="true">
                  ▸
                </span>
              </button>

              <div className={`sidebar__drawer ${sectionOpen ? 'sidebar__drawer--open' : ''}`}>
                <div className="sidebar__drawer-inner" inert={!sectionOpen}>
                  {section.groups.map((group) => {
                    const groupOpen = openGroups.has(group.id)
                    return (
                      <div className="sidebar__group" key={group.id}>
                        <button
                          type="button"
                          className="sidebar__group-toggle"
                          aria-expanded={groupOpen}
                          onClick={() => toggleGroup(group.id)}
                        >
                          <span>{group.label}</span>
                          <span
                            className={`sidebar__chevron ${groupOpen ? 'sidebar__chevron--open' : ''}`}
                            aria-hidden="true"
                          >
                            ▸
                          </span>
                        </button>
                        <div className={`sidebar__drawer ${groupOpen ? 'sidebar__drawer--open' : ''}`}>
                          <div className="sidebar__drawer-inner" inert={!groupOpen}>
                            <ul>
                              {group.topics.map((topic) => (
                                <li key={topic.id}>
                                  <NavLink
                                    to={`/${group.id}/${topic.id}`}
                                    className={({ isActive }) =>
                                      'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
                                    }
                                    onClick={onNavigate}
                                  >
                                    {topic.title}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
