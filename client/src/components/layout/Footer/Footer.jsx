import './Footer.css'

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: ['Link Builder', 'Analytics', 'QR Codes', 'Enterprise'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press Kit', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'Documentation', 'Help Center', 'API Reference'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'],
  },
]

const SOCIAL_ICONS_COUNT = 4

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="/" className="footer__logo">
              <span className="footer__logo-mark" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" fill="currentColor" />
                </svg>
              </span>
              Recharge4Me
            </a>
            <p className="footer__tagline">
              Empowering individuals and creators to receive mobile support effortlessly across
              the globe. Premium SaaS quality for daily mobile needs.
            </p>
            <div className="footer__social">
              {Array.from({ length: SOCIAL_ICONS_COUNT }).map((_, i) => (
                <a key={i} href="#" className="footer__social-icon" aria-label="Social link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="footer__columns">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="footer__column">
                <h4 className="footer__column-title">{column.title}</h4>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="footer__link">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} Recharge4Me Inc. All rights reserved.</p>
          <p className="footer__status">
            <span className="footer__status-dot" aria-hidden="true"></span>
            System Status: Operational
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
