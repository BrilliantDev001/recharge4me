import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PublicPageLayout from "../../components/layout/PublicPageLayout/PublicPageLayout.jsx";
import { getPublicLink, submitRecharge } from "../../api/client.js";
import {
  PRESET_AMOUNTS,
  MIN_RECHARGE_AMOUNT,
} from "../../data/dashboardContent.js";
import "./PublicRechargePage.css";

function PublicRechargePage() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [linkData, setLinkData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [rechargeType, setRechargeType] = useState("airtime");
  const [amount, setAmount] = useState(String(PRESET_AMOUNTS[2]));
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorMessage, setSponsorMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    getPublicLink(username)
      .then(setLinkData)
      .catch((error) => setLoadError(error.message));
  }, [username]);

  const handleAmountInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setAmount(value);
    if (amountError) setAmountError("");
  };

  const handleRecharge = async () => {
    const numericAmount = parseInt(amount, 10) || 0;
    if (numericAmount < MIN_RECHARGE_AMOUNT) {
      setAmountError(`Minimum recharge amount is ₦${MIN_RECHARGE_AMOUNT}.`);
      return;
    }

    setIsProcessing(true);

    try {
      // NOTE: no network is sent here — the backend uses the recipient's
      // own stored, verified network. Nothing here to guess or spoof.
      const result = await submitRecharge(username, {
        amount: numericAmount,
        type: rechargeType === "airtime" ? "Airtime" : "Data",
        isAnonymous,
        sponsorName: isAnonymous ? "" : sponsorName.trim(),
        sponsorMessage: sponsorMessage.trim(),
      });

      window.location.href = result.authorizationUrl;
    } catch (error) {
      setAmountError(error.message);
      setIsProcessing(false);
    }
  };

  if (loadError) {
    return (
      <PublicPageLayout label="Recharge Link">
        <div className="prp-card">
          <p style={{ padding: "2rem", textAlign: "center" }}>{loadError}</p>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout label="Recharge Link">
      <div className="prp-card">
        <div className="prp-profile">
          <span className="prp-avatar">
            {username?.charAt(0).toUpperCase()}
          </span>
          <p className="prp-name">
            @{username}{" "}
            {linkData?.isVerified && (
              <span className="prp-pro-badge">Verified</span>
            )}
          </p>
          {linkData?.profileMessage && (
            <p className="prp-profile-message">"{linkData.profileMessage}"</p>
          )}
        </div>

        <div className="prp-form">
          {linkData?.network && (
            <div className="prp-network-display">
              <span className="prp-network-display__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="6"
                    y="2"
                    width="12"
                    height="20"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 18h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Recharging a <strong>{linkData.network}</strong> line
            </div>
          )}

          <p className="prp-form-label">Recharge Type</p>
          <div className="prp-segmented">
            <button
              type="button"
              className={`prp-segmented__btn ${rechargeType === "airtime" ? "prp-segmented__btn--active" : ""}`}
              onClick={() => setRechargeType("airtime")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="6"
                  y="2"
                  width="12"
                  height="20"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 18h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Airtime
            </button>
            {linkData?.allowDataBundles && (
              <button
                type="button"
                className={`prp-segmented__btn ${rechargeType === "data" ? "prp-segmented__btn--active" : ""}`}
                onClick={() => setRechargeType("data")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 16.5a15 15 0 0120 0M6 12a10 10 0 0112 0M10 7.5a5 5 0 014 0"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="20" r="1" fill="currentColor" />
                </svg>
                Mobile Data
              </button>
            )}
          </div>

          <div className="prp-amount-header">
            <p className="prp-form-label">Amount</p>
            <p className="prp-min-label">Min: ₦{MIN_RECHARGE_AMOUNT}</p>
          </div>
          <div
            className={`prp-amount-input ${amountError ? "prp-amount-input--error" : ""}`}
          >
            <span>₦</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountInput}
              aria-label="Custom amount"
            />
          </div>
          {amountError && <p className="prp-amount-error">{amountError}</p>}

          <div className="prp-preset-row">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`prp-preset-chip ${amount === String(preset) ? "prp-preset-chip--active" : ""}`}
                onClick={() => {
                  setAmount(String(preset));
                  setAmountError("");
                }}
              >
                ₦{preset}
              </button>
            ))}
          </div>

          {linkData?.allowAnonymousSponsors && (
            <label className="prp-anonymous-toggle">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              Send anonymously
            </label>
          )}

          {!isAnonymous && (
            <>
              <p className="prp-form-label">Your Name (optional)</p>
              <input
                type="text"
                className="prp-text-input"
                placeholder="e.g. Alex Johnson"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                maxLength={60}
              />
            </>
          )}

          <p className="prp-form-label">Add a Message (optional)</p>
          <textarea
            className="prp-text-input prp-message-input"
            placeholder="e.g. Hope this helps you stay connected!"
            value={sponsorMessage}
            onChange={(e) => setSponsorMessage(e.target.value)}
            maxLength={200}
            rows={3}
          />

          <button
            type="button"
            className="prp-recharge-btn"
            onClick={handleRecharge}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing…" : "Recharge Now"}
          </button>
          <p className="prp-disclaimer">
            By clicking "Recharge Now", you agree to the Terms of Service.
            Airtime will be sent instantly to the recipient.
          </p>

          <div className="prp-trust-row">
            <div className="prp-trust-item">
              <span className="prp-trust-item__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5l8-3z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="prp-trust-item__title">Secure</p>
              <p className="prp-trust-item__subtitle">Encrypted SSL</p>
            </div>
            <div className="prp-trust-item">
              <span className="prp-trust-item__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2L3 14H11L10 22L21 9H13L13 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="prp-trust-item__title">Instant</p>
              <p className="prp-trust-item__subtitle">Auto-delivery</p>
            </div>
            <div className="prp-trust-item">
              <span className="prp-trust-item__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s-7-4.5-7-10a7 7 0 0114 0c0 5.5-7 10-7 10z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="prp-trust-item__title">Zero Fees</p>
              <p className="prp-trust-item__subtitle">No extra charges</p>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}

export default PublicRechargePage;
