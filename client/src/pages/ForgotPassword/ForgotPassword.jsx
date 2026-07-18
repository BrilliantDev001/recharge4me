import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button/Button.jsx'
import TextField from '../../components/common/TextField/TextField.jsx'
import '../../styles/shared/authCard.css'
import './ForgotPassword.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Email address is required.')
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    // Mock request — real backend integration comes later.
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSent(true)
    }, 900)
  }

  return (
    <div className="fp-page">
      <div className="fp-brand">
        <span className="fp-brand__icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 4v6h6M20 20v-6h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 14a8 8 0 0014.9 3M19 10A8 8 0 004.1 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="fp-brand__name hide-mobile">Recharge4Me</span>
      </div>

      <div className="fp-card">
        {isSent ? (
          <div className="fp-card__panel fp-card__panel--result">
            <div className="auth-card__icon auth-card__icon--secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
                <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="auth-card__title">Check your email</h1>
            <p className="auth-card__subtitle">
              We've sent password reset instructions to <strong>{email}</strong>. The link will
              expire in 15 minutes.
            </p>
            <Button
              variant="ghost"
              size="md"
              className="fp-resend-btn"
              onClick={() => setIsSent(false)}
            >
              Didn't get it? Try again
            </Button>
            <Link to="/login" className="fp-back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 12H5M11 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to log in
            </Link>
          </div>
        ) : (
          <>
            <div className="fp-card__header">
              <h1 className="auth-card__title hide-mobile">Forgot password?</h1>
              <h1 className="auth-card__title hide-desktop">Reset Password</h1>
              <p className="auth-card__subtitle hide-mobile">
                No worries, we'll send you reset instructions.
              </p>
              <p className="auth-card__subtitle hide-desktop">
                Enter the email address associated with your Recharge4Me account to get started.
              </p>
            </div>

            <div className="fp-card__panel">
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  label="Email address"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={handleChange}
                  error={error}
                  autoComplete="email"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  }
                />
                <p className="fp-hint hide-desktop">
                  We'll send a secure, one-time password recovery link to your inbox.
                </p>

                {/*
                  WHY always-enabled rather than disabled-until-valid
                  (mobile mockup's muted button suggests a disabled
                  state): disabling a submit button without telling
                  the user why is a well-documented UX anti-pattern —
                  they can't tell if the form is broken or what's
                  missing. Validating on submit and showing an inline
                  error message is clearer and works the same way on
                  both breakpoints.
                */}
                <Button type="submit" variant="secondary" size="lg" disabled={isSubmitting} className="fp-submit-btn">
                  {isSubmitting ? 'Sending…' : 'Reset Password'}
                </Button>
              </form>

              <Link to="/login" className="fp-back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5M11 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>

      {/* ---------- Mobile-only trust row ---------- */}
      <div className="fp-trust-row hide-desktop">
        <div className="fp-trust-item">
          <span className="fp-trust-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          Encrypted
        </div>
        <div className="fp-trust-item">
          <span className="fp-trust-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5l8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          Secure
        </div>
      </div>
      <p className="fp-trust-note hide-desktop">Protected by industry-standard encryption protocols.</p>

      {/* ---------- Desktop-only sub-footer ---------- */}
      <div className="fp-links-row hide-mobile">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <span className="fp-links-dot" aria-hidden="true" />
        <Link to="/terms-of-service">Terms of Service</Link>
        <span className="fp-links-dot" aria-hidden="true" />
        <Link to="/support">Help Center</Link>
      </div>
      <p className="fp-recaptcha-note hide-mobile">
        Protected by reCAPTCHA. The Google Privacy Policy and Terms of Service apply.
      </p>

      <footer className="fp-footer">
        <p className="hide-mobile">
          &copy; {new Date().getFullYear()} Recharge4Me. All rights reserved. Premium Mobile
          Airtime Solutions.
        </p>
        <p className="fp-footer__mobile hide-desktop">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" fill="currentColor" />
          </svg>
          Recharge4Me
        </p>
      </footer>
    </div>
  )
}

export default ForgotPassword
