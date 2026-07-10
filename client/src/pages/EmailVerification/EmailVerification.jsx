import AuthLayout from '../../components/layout/AuthLayout/AuthLayout.jsx'
import Button from '../../components/common/Button/Button.jsx'
import '../../styles/shared/authCard.css'
import './EmailVerification.css'

function EmailVerification() {
  return (
    <AuthLayout topLabel="Account Setup" showBackArrow={false} logoPosition="left">
      <div className="auth-card ev-card">
        <div className="ev-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect x="8" y="14" width="40" height="28" rx="6" fill="var(--color-neutral-200)" />
            <path
              d="M20 26l7 7 12-14"
              stroke="var(--color-success)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ev-icon__badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
              <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <h1 className="auth-card__title">Email Verified Successfully!</h1>
        <p className="auth-card__subtitle">
          Your Recharge4Me account is now active. You can now start sharing your unique link and
          receiving airtime.
        </p>

        <span className="ev-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5l8-3z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          </svg>
          Account Secure &amp; Active
        </span>

        {/* Now that the Dashboard screen exists, this links there for real. */}
        <Button variant="secondary" size="lg" className="ev-cta" as="a" href="/dashboard">
          Continue to Dashboard
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '0.5rem' }}>
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        <p className="ev-help">
          Need help? <a href="#">Contact Support</a>
        </p>
      </div>

      <div className="ev-divider">
        <span>Recharge4Me Premium</span>
      </div>
    </AuthLayout>
  )
}

export default EmailVerification
