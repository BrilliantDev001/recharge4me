import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout/AuthLayout.jsx";
import Button from "../../components/common/Button/Button.jsx";
import TextField from "../../components/common/TextField/TextField.jsx";
import { verifyEmail, resendVerification } from "../../api/client.js";
import "../../styles/shared/authCard.css";
import "./EmailVerification.css";

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendState, setResendState] = useState("idle"); // 'idle' | 'sending' | 'sent'

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token was found in this link.");
      return;
    }

    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((error) => {
        setStatus("error");
        setErrorMessage(error.message);
      });
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResendState("sending");
    try {
      await resendVerification(resendEmail);
      setResendState("sent");
    } catch (error) {
      setResendState("idle");
      setErrorMessage(error.message);
    }
  };

  if (status === "loading") {
    return (
      <AuthLayout
        topLabel="Account Setup"
        showBackArrow={false}
        logoPosition="left"
      >
        <div className="auth-card ev-card">
          <h1 className="auth-card__title">Verifying your email…</h1>
          <p className="auth-card__subtitle">
            Hang tight, this only takes a second.
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (status === "error") {
    return (
      <AuthLayout
        topLabel="Account Setup"
        showBackArrow={false}
        logoPosition="left"
      >
        <div className="auth-card ev-card">
          <h1 className="auth-card__title">Verification Failed</h1>
          <p className="auth-card__subtitle">{errorMessage}</p>

          {resendState === "sent" ? (
            <p
              className="auth-card__subtitle"
              style={{ color: "var(--color-success)" }}
            >
              A new verification email is on its way — check your inbox.
            </p>
          ) : (
            <form onSubmit={handleResend} className="auth-card__form">
              <TextField
                label="Email Address"
                type="email"
                placeholder="Enter your email to resend the link"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="ev-cta"
                isLoading={resendState === "sending"}
              >
                Resend Verification Email
              </Button>
            </form>
          )}

          <p className="ev-help">
            Need help? <a href="#">Contact Support</a>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      topLabel="Account Setup"
      showBackArrow={false}
      logoPosition="left"
    >
      <div className="auth-card ev-card">
        <div className="ev-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect
              x="8"
              y="14"
              width="40"
              height="28"
              rx="6"
              fill="var(--color-neutral-200)"
            />
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
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M8 12.5l2.5 2.5L16 9"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <h1 className="auth-card__title">Email Verified Successfully!</h1>
        <p className="auth-card__subtitle">
          Your Recharge4Me account is now active. Log in to start sharing your
          unique link and receiving airtime.
        </p>

        <span className="ev-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5l8-3z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
          </svg>
          Account Secure &amp; Active
        </span>

        <Button
          variant="secondary"
          size="lg"
          className="ev-cta"
          as="a"
          href="/login"
        >
          Continue to Login
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginLeft: "0.5rem" }}
          >
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
  );
}

export default EmailVerification;
