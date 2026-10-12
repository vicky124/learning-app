import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import SearchDialog from './SearchDialog.jsx'

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

  const [searchOpen, setSearchOpen] = useState(false)

  // <main> is the scroll container (not the window), so the browser won't
  // reset it on client-side navigation — do it ourselves on every new page.
  // Layout effect (before paint), otherwise the new page flashes at the old
  // scroll position and then jumps. Hash links (#q-3 from search) skip this
  // and scroll to their target.
  const { pathname, hash } = useLocation()
  const contentRef = useRef(null)
  useLayoutEffect(() => {
    if (!hash) contentRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  // Gentle fade/slide-in for each new page. Uses the Web Animations API on
  // the existing node rather than a `key` remount, so lesson state and
  // nested routes aren't torn down.
  useLayoutEffect(() => {
    const el = contentRef.current?.firstElementChild
    if (!el?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const animation = el.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 220, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    )
    return () => animation.cancel()
  }, [pathname])

  // Global shortcut: Ctrl/⌘+K, or "/" when not already typing somewhere.
  useEffect(() => {
    function onKeyDown(e) {
      const typing = e.target.closest?.('input, textarea, select, [contenteditable="true"]')
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

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
        <button
          type="button"
          className="topbar__search-btn"
          aria-label="Search (Ctrl+K)"
          onClick={() => setSearchOpen(true)}
        >
          <span aria-hidden="true">🔍</span>
          <span className="topbar__search-label">Search…</span>
          <kbd className="topbar__search-kbd">Ctrl K</kbd>
        </button>
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
        <main className="content" ref={contentRef}>
          <Outlet />
        </main>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
