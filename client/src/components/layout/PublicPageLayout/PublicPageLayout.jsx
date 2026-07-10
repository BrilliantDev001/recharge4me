import { useNavigate } from 'react-router-dom'
import './PublicPageLayout.css'

/**
 * Shell for the sponsor-facing public flow (Public Recharge Page,
 * Payment Success) — deliberately has no sidebar, no dashboard
 * topbar, and no authenticated-user chrome, since visitors here
 * are anonymous sponsors, not the logged-in link owner.
 */
function PublicPageLayout({ label, showBackArrow = false, children, footer }) {
  const navigate = useNavigate()

  return (
    <div className="public-page-layout">
      <header className="public-page-topbar">
        <div className="container public-page-topbar__inner">
          {showBackArrow ? (
            <button type="button" className="public-page-topbar__back" onClick={() => navigate(-1)} aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <span className="public-page-topbar__spacer" aria-hidden="true" />
          )}
          <span className="public-page-topbar__label">{label}</span>
          <span className="public-page-topbar__spacer" aria-hidden="true" />
        </div>
      </header>

      <main className="public-page-main">{children}</main>

      {footer !== false && (
        <footer className="public-page-footer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" fill="currentColor" />
          </svg>
          Powered by <strong>Recharge4Me</strong>
        </footer>
      )}
    </div>
  )
}

export default PublicPageLayout
