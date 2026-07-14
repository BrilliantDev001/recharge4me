import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PublicPageLayout from "../../components/layout/PublicPageLayout/PublicPageLayout.jsx";
import { verifyPayment } from "../../api/client.js";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();

  const [pageState, setPageState] = useState("loading"); // 'loading' | 'result' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [transaction, setTransaction] = useState(null);
  const [copyState, setCopyState] = useState("idle");

  useEffect(() => {
    if (!reference) {
      setPageState("error");
      setErrorMessage("No transaction reference was found.");
      return;
    }

    verifyPayment(reference)
      .then((data) => {
        setTransaction(data);
        setPageState("result");
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setPageState("error");
      });
  }, [reference]);

  const handleCopyTxnId = () => {
    navigator.clipboard?.writeText(transaction.reference).catch(() => {});
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2000);
  };

  const handleShare = () => {
    const summary = `Payment ${transaction.status === "success" ? "successful" : "update"}! ₦${transaction.amount.toLocaleString()} for ${transaction.recipientName} via ${transaction.network}.`;
    if (navigator.share) {
      navigator
        .share({ title: "Recharge4Me Receipt", text: summary })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(summary).catch(() => {});
    }
  };

  const handleSave = () => window.print();

  // ---------------- Loading ----------------
  if (pageState === "loading") {
    return (
      <PublicPageLayout label="Transaction Status" showBackArrow>
        <div className="ps-card">
          <h1 className="ps-title">Confirming your payment…</h1>
          <p className="ps-subtitle">
            This only takes a moment — please don't close this page.
          </p>
        </div>
      </PublicPageLayout>
    );
  }

  // ---------------- Error (bad/missing reference, network issue) ----------------
  if (pageState === "error") {
    return (
      <PublicPageLayout label="Transaction Status" showBackArrow>
        <div className="ps-card">
          <h1 className="ps-title">Something went wrong</h1>
          <p className="ps-subtitle">{errorMessage}</p>
          <button
            type="button"
            className="ps-dashboard-btn"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </PublicPageLayout>
    );
  }

  // ---------------- Result: success / delivery_failed / payment_failed ----------------
  const { status } = transaction;
  const isSuccess = status === "success";
  const isDeliveryFailed = status === "delivery_failed";
  const isPaymentFailed = status === "payment_failed";

  const formattedAmount = `₦${transaction.amount.toLocaleString()}.00`;
  const typeLabel =
    transaction.type === "Data" ? "Data Bundle" : "Airtime Top-up";
  const dateTime = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let title = "Payment Successful!";
  let subtitle = `Your ${transaction.type.toLowerCase()} has been delivered instantly.`;
  let statusLabel = "Success";

  if (isDeliveryFailed) {
    title = "Payment Received";
    subtitle =
      "Your payment went through, but we couldn't complete the airtime delivery automatically. Our team has been notified and will resolve this shortly.";
    statusLabel = "Delivery Pending";
  } else if (isPaymentFailed) {
    title = "Payment Not Successful";
    subtitle =
      "Your payment could not be completed. No airtime has been delivered, and you have not been charged.";
    statusLabel = "Failed";
  }

  return (
    <PublicPageLayout label="Transaction Complete" showBackArrow>
      <div className="ps-card">
        <div className="ps-icon-wrap">
          <span className="ps-icon">
            {isPaymentFailed ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </div>

        <h1 className="ps-title">{title}</h1>
        <p className="ps-subtitle">{subtitle}</p>

        {!isPaymentFailed && (
          <div className="ps-amount-box">
            <p className="ps-amount-box__label">Total Amount</p>
            <p className="ps-amount-box__value">{formattedAmount}</p>
          </div>
        )}

        <div className="ps-receipt">
          <div className="ps-receipt__header">
            <h3>Transaction Receipt</h3>
            <span className="ps-receipt__status">{statusLabel}</span>
          </div>

          <div className="ps-receipt__recipient">
            <span className="ps-receipt__avatar">
              {transaction.recipientName?.charAt(0)}
            </span>
            <div className="ps-receipt__recipient-text">
              <p className="ps-receipt__recipient-name">
                {transaction.recipientName}
              </p>
              <p className="ps-receipt__recipient-phone">
                {transaction.recipientPhone}
              </p>
            </div>
            <div className="ps-receipt__network">
              <p className="ps-receipt__network-label">Network</p>
              <p className="ps-receipt__network-value">{transaction.network}</p>
            </div>
          </div>

          <div className="ps-receipt__rows">
            <div className="ps-receipt__row">
              <span>Transaction Type</span>
              <span>{typeLabel}</span>
            </div>
            <div className="ps-receipt__row">
              <span>Sent By</span>
              <span>{transaction.sponsorName}</span>
            </div>
            <div className="ps-receipt__row">
              <span>Transaction Reference</span>
              <span className="ps-receipt__txn-id">
                {transaction.reference}
                <button
                  type="button"
                  onClick={handleCopyTxnId}
                  aria-label="Copy reference"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="9"
                      y="9"
                      width="12"
                      height="12"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <path
                      d="M5 15V5a2 2 0 012-2h10"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                  </svg>
                </button>
              </span>
            </div>
            {copyState === "copied" && (
              <p className="ps-copy-toast">Reference copied!</p>
            )}
            <div className="ps-receipt__row">
              <span>Payment Method</span>
              <span>Card (Paystack)</span>
            </div>
            <div className="ps-receipt__row">
              <span>Date &amp; Time</span>
              <span>{dateTime}</span>
            </div>
          </div>

          {!isPaymentFailed && (
            <>
              <div className="ps-receipt__divider" />
              <div className="ps-receipt__final-row">
                <span>Final Total</span>
                <span>{formattedAmount}</span>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="ps-dashboard-btn"
          onClick={() => navigate("/")}
        >
          Back to Home
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isSuccess && (
          <div className="ps-secondary-actions">
            <button
              type="button"
              className="ps-secondary-btn"
              onClick={handleShare}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="6"
                  cy="12"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="18"
                  cy="6"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8.3 10.8l7.4-4.6M8.3 13.2l7.4 4.6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Share
            </button>
            <button
              type="button"
              className="ps-secondary-btn"
              onClick={handleSave}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Save
            </button>
          </div>
        )}

        <p className="ps-secured-by">
          Secured by <strong>Paystack</strong>
        </p>
      </div>
    </PublicPageLayout>
  );
}

export default PaymentSuccess;
