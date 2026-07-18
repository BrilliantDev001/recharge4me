import { Link } from 'react-router-dom'
import './AuthLayout.css'

/**
 * Shared wrapper for auth screens (Login, Signup, Email Verification).
 * Provides the minimal top bar, a centered content area, and a
 * lightweight footer — distinct from the full marketing Navbar/Footer
 * used on the landing page.
 *
 * showBackArrow: set false for one-way/terminal screens (e.g. Email
 * Verification) where "going back" doesn't make sense.
 * logoPosition: 'right' (default, Login/Signup) or 'left' (Email
 * Verification mockup shows the logo taking the back-arrow's slot).
 */
function AuthLayout({ topLabel, showBackArrow = true, logoPosition = 'right', children }) {
  const logo = (
    <Link to="/" className="auth-topbar__logo" aria-label="Recharge4Me home">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" fill="currentColor" />
      </svg>
    </Link>
  )

  const backArrow = showBackArrow ? (
    <Link to="/" className="auth-topbar__back" aria-label="Go back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 5l-7 7 7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  ) : (
    <span className="auth-topbar__spacer" aria-hidden="true" />
  )

  return (
    <div className="auth-layout">
      <header className="auth-topbar">
        <div className="container auth-topbar__inner">
          {logoPosition === 'left' ? logo : backArrow}
          <span className="auth-topbar__label">{topLabel}</span>
          {logoPosition === 'left' ? <span className="auth-topbar__spacer" aria-hidden="true" /> : logo}
        </div>
      </header>

      <main className="auth-main">{children}</main>

      <footer className="auth-footer">
        <div className="container auth-footer__inner">
          <p>&copy; {new Date().getFullYear()} Recharge4Me Inc. All rights reserved.</p>
          <div className="auth-footer__links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuthLayout
