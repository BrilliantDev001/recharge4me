import { useState } from 'react'
import Button from '../../common/Button/Button.jsx'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="/" className="navbar__logo">
          <span className="navbar__logo-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" fill="currentColor" />
            </svg>
          </span>
          Recharge4Me
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <a href="/login" className="navbar__login">
            Login
          </a>
          <Button variant="primary" size="sm" as="a" href="/signup">
            Create Account
          </Button>
        </div>

        <button
          className="navbar__menu-toggle"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className={`navbar__burger ${isMenuOpen ? 'navbar__burger--open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`navbar__mobile-panel ${isMenuOpen ? 'navbar__mobile-panel--open' : ''}`}>
        <nav className="navbar__mobile-links" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__mobile-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="navbar__mobile-actions">
          <Button variant="outline" size="md" as="a" href="/login">
            Login to Dashboard
          </Button>
          <Button variant="primary" size="md" as="a" href="/signup">
            Create Free Account
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
