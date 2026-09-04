import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

const COLLAPSE_KEY = 'rla-sidebar-collapsed'

export default function Layout() {
  // Two independent flags driven by the same button: on mobile the sidebar
  // is an overlay drawer (mobileOpen), on desktop it's a persistent column
  // that can collapse to free up width (desktopCollapsed). Only one of the
  // two is visually relevant at a given viewport width (see index.css), so
  // toggling both together lets one button serve both breakpoints.
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(COLLAPSE_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, desktopCollapsed ? '1' : '0')
    } catch {
      // Storage can be unavailable (private mode, quota) — ignore.
    }
  }, [desktopCollapsed])

  function toggleSidebar() {
    setMobileOpen((v) => !v)
    setDesktopCollapsed((v) => !v)
  }

  return (
    <div className={`app-shell ${desktopCollapsed ? 'app-shell--sidebar-collapsed' : ''}`}>
      <header className="topbar">
        <button
          type="button"
          className="topbar__menu-btn"
          aria-label="Toggle navigation"
          aria-expanded={!desktopCollapsed || mobileOpen}
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <span className="topbar__title">Learning Hub</span>
        <a
          className="topbar__link"
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
        >
          react.dev docs ↗
        </a>
      </header>

      <div className="app-shell__body">
        <Sidebar open={mobileOpen} onNavigate={() => setMobileOpen(false)} />
        {mobileOpen && (
          <button
            className="sidebar__backdrop"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
