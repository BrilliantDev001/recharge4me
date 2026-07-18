import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout.jsx';
import { useAuth } from "../../context/AuthContext.jsx";
import { resendVerification } from "../../api/client.js";
import TextField from '../../components/common/TextField/TextField.jsx';
import Checkbox from '../../components/common/Checkbox/Checkbox.jsx';
import Button from '../../components/common/Button/Button.jsx';
import '../../styles/shared/authCard.css';
import './Signup.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AVATAR_COLORS = ['#FBBF24', '#60A5FA', '#F472B6']

// Backend requires a unique username but this form only collects a
// full name — derive a URL-safe slug automatically. If it's taken,
// the register call fails with a clear message and the user can
// just retry (rare in practice since we suffix with random digits).
function slugifyName(fullName) {
  const base = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `${base || 'user'}-${suffix}`
}

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function Signup() {
  const { register } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [resendState, setResendState] = useState("idle"); // 'idle' | 'sending' | 'sent'
  const [submitError, setSubmitError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreedToTerms) {
      nextErrors.terms =
        "You must agree to the Terms of Service and Privacy Policy.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        name: formData.fullName.trim(),
        username: slugifyName(formData.fullName),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });
      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout topLabel="Create Your Account">
        <div className="auth-card">
          <div className="auth-card__icon auth-card__icon--secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="auth-card__title">Account Created!</h1>
          <p className="auth-card__subtitle">
            Welcome to Recharge4Me, {formData.fullName.split(" ")[0] || "there"}
            . We've sent a verification link to {formData.email || "your email"}{" "}
            — confirm it to activate your account.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="auth-card__submit"
            as="a"
            href="/login"
          >
            Go to Login
          </Button>

          {resendState === "sent" ? (
            <p
              className="auth-card__subtitle"
              style={{ color: "var(--color-success)", marginTop: "1rem" }}
            >
              Verification email resent — check your inbox.
            </p>
          ) : (
            <button
              type="button"
              className="auth-card__link-btn"
              style={{
                marginTop: "1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-primary)",
              }}
              disabled={resendState === "sending"}
              onClick={async () => {
                setResendState("sending");
                try {
                  await resendVerification(formData.email);
                  setResendState("sent");
                } catch {
                  setResendState("idle");
                }
              }}
            >
              {resendState === "sending"
                ? "Resending…"
                : "Didn't get the email? Resend it"}
            </button>
          )}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout topLabel="Create Your Account">
      <div className="auth-card">
        <div className="auth-card__icon auth-card__icon--secondary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5l8-3z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="auth-card__title">Join Recharge4Me</h1>
        <p className="auth-card__subtitle">
          Get your unique link and start receiving airtime today.
        </p>

        {submitError && (
          <div className="auth-card__error-banner" role="alert">
            <span>{submitError}</span>
          </div>
        )}

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Full Name"
            placeholder="Enter your first and last name"
            value={formData.fullName}
            onChange={handleChange("fullName")}
            error={errors.fullName}
            autoComplete="name"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M4.5 20a7.5 7.5 0 0115 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          />

          <TextField
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange("email")}
            error={errors.email}
            autoComplete="email"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 7l9 6 9-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          />

          <TextField
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            autoComplete="tel"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6.6 10.8a13 13 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 9.6 9.6 0 003 .5 1 1 0 011 1V20a1 1 0 01-1 1A16 16 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 9.6 9.6 0 00.5 3 1 1 0 01-.25 1l-2.2 2.2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />

          <div className="auth-card__row auth-card__row--split">
            <TextField
              label="Password"
              isPassword
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange("password")}
              error={errors.password}
              autoComplete="new-password"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="9"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 11V7a4 4 0 018 0v4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <TextField
              label="Confirm"
              isPassword
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="9"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 11V7a4 4 0 018 0v4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </div>

          <div>
            <Checkbox
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (errors.terms)
                  setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              label={
                <>
                  I agree to the{" "}
                  <Link to="/terms-of-service">Terms of Service</Link> and{" "}
                  <Link to="/privacy-policy">Privacy Policy</Link>.
                </>
              }
            />
            {errors.terms && (
              <p
                className="text-field__error"
                role="alert"
                style={{ marginTop: "0.5rem" }}
              >
                {errors.terms}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            disabled={isSubmitting}
            className="auth-card__submit"
            icon={
              !isSubmitting && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )
            }
          >
            {isSubmitting ? "Creating Account…" : "Create Free Account"}
          </Button>
        </form>

        <p className="auth-card__footer-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>

        <div className="auth-card__trust-row">
          <span className="auth-card__trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            SSL Encrypted
          </span>
          <span className="auth-card__trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Safe &amp; Private
          </span>
        </div>
      </div>

      <div className="auth-card__below">
        <div className="auth-card__avatar-stack">
          {AVATAR_COLORS.map((color, i) => (
            <span
              key={i}
              className="auth-card__avatar"
              style={{ background: color }}
            />
          ))}
        </div>
        <p className="auth-card__below-note">
          Join over 50,000+ users receiving recharges securely every day.
        </p>
      </div>
    </AuthLayout>
  );
}

export default Signup
