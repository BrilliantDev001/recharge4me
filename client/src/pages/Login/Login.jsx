import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout/AuthLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import TextField from "../../components/common/TextField/TextField.jsx";
import Checkbox from "../../components/common/Checkbox/Checkbox.jsx";
import Button from "../../components/common/Button/Button.jsx";
import "../../styles/shared/authCard.css";
import "./Login.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear the field's error as soon as the user starts correcting it
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      nextErrors.password = "Password is required.";
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
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout topLabel="Secure Login">
      <div className="auth-card">
        <div className="auth-card__icon auth-card__icon--primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect
              x="5"
              y="11"
              width="14"
              height="9"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.75"
            />
            <path
              d="M8 11V7a4 4 0 018 0v4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">
          Enter your details below to access your recharge dashboard
        </p>

        {submitError && (
          <div className="auth-card__error-banner" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M12 8v5M12 16h.01"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <span>{submitError}</span>
          </div>
        )}

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
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
            label="Password"
            isPassword
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange("password")}
            error={errors.password}
            autoComplete="current-password"
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

          <div className="auth-card__options-row">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link to="/forgot-password" className="auth-card__forgot-link">
              Forgot password?
            </Link>
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
            {isSubmitting ? "Signing In…" : "Sign In"}
          </Button>
        </form>

        {/* <div className="auth-card__divider">
          <span>OR CONTINUE WITH</span>
        </div> */}

        {/* <div className="auth-card__social-row">
          <button type="button" className="auth-card__social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1a6.6 6.6 0 010-4.2V7.05H2.18a11 11 0 000 9.9l3.66-2.85z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z"
              />
            </svg>
            Google
          </button>
          <button type="button" className="auth-card__social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.8 1.2 1.8 1.2 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2A11.5 11.5 0 0112 5.8c1 0 2.1.1 3.1.4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.7 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" />
            </svg>
            GitHub
          </button>
        </div> */}

        <p className="auth-card__footer-text">
          Don't have an account? <Link to="/signup">Create an account</Link>
        </p>
      </div>

      <div className="auth-card__below">
        <div className="auth-card__trust-row">
          <span className="auth-card__trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5l8-3z"
                stroke="currentColor"
                strokeWidth="1.75"
              />
            </svg>
            Secure SSL
          </span>
          <span className="auth-card__trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect
                x="5"
                y="11"
                width="14"
                height="9"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M8 11V7a4 4 0 018 0v4"
                stroke="currentColor"
                strokeWidth="1.75"
              />
            </svg>
            Encrypted Data
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
