import { Link } from "react-router-dom";
import "./LegalPageLayout.css";

function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="legal-page">
      <header className="legal-page__header">
        <Link to="/" className="legal-page__logo">
          <span className="legal-page__logo-mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" fill="currentColor" />
            </svg>
          </span>
          Recharge4Me
        </Link>
        <Link to="/" className="legal-page__back">
          Back to Home
        </Link>
      </header>

      <main className="legal-page__content">
        <h1 className="legal-page__title">{title}</h1>
        {lastUpdated && (
          <p className="legal-page__updated">Last updated: {lastUpdated}</p>
        )}
        <div className="legal-page__body">{children}</div>
      </main>
    </div>
  );
}

export default LegalPageLayout;
