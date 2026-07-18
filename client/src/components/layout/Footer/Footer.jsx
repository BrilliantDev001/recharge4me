import { Link } from "react-router-dom";
import "./Footer.css";

const FOOTER_COLUMNS = [
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms-of-service" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", to: "/support" },
      { label: "Help Center", to: "/support" },
    ],
  },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-mark" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2L3 14H11L10 22L21 9H13L13 2Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Recharge4Me
            </Link>
            <p className="footer__tagline">
              Empowering individuals and creators to receive mobile support
              effortlessly across the globe. Premium SaaS quality for daily
              mobile needs.
            </p>
          </div>

          <div className="footer__columns">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="footer__column">
                <h4 className="footer__column-title">{column.title}</h4>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="footer__link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} Recharge4Me Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
