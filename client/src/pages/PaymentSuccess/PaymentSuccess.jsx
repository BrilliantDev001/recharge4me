import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PublicPageLayout from '../../components/layout/PublicPageLayout/PublicPageLayout.jsx'
import './PaymentSuccess.css'

function generateTxnId() {
  return `TXN-${Math.floor(1000000000 + Math.random() * 8999999999)}`
}

function PaymentSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const [copyState, setCopyState] = useState('idle')

  // Falls back to sensible demo values if this page is opened
  // directly (e.g. a refresh) without state from the recharge flow.
  const details = useMemo(() => {
    const state = location.state || {}
    return {
      amount: state.amount ?? 15000,
      network: state.network ?? 'MTN Nigeria',
      rechargeType: state.rechargeType ?? 'airtime',
      recipientName: state.recipientName ?? 'David King',
      recipientPhone: state.recipientPhone ?? '+234 812 345 6789',
      sentBy: state.sentBy ?? 'Sarah Williams',
      txnId: state.txnId ?? generateTxnId(),
      dateTime: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }, [location.state])

  const formattedAmount = `₦${details.amount.toLocaleString()}.00`

  const handleCopyTxnId = () => {
    navigator.clipboard?.writeText(details.txnId).catch(() => {})
    setCopyState('copied')
    setTimeout(() => setCopyState('idle'), 2000)
  }

  const handleShare = () => {
    const summary = `Payment successful! ${formattedAmount} sent to ${details.recipientName} via ${details.network}.`
    if (navigator.share) {
      navigator.share({ title: 'Recharge4Me Receipt', text: summary }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(summary).catch(() => {})
    }
  }

  const handleSave = () => {
    // No backend to generate a real PDF yet — the browser's print
    // dialog lets the user save this receipt as a PDF right now.
    window.print()
  }

  return (
    <PublicPageLayout label="Transaction Complete" showBackArrow>
      <div className="ps-card">
        <div className="ps-icon-wrap">
          <span className="ps-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <h1 className="ps-title">Payment Successful!</h1>
        <p className="ps-subtitle">Your {details.rechargeType} has been delivered instantly.</p>

        <div className="ps-amount-box">
          <p className="ps-amount-box__label">Total Amount</p>
          <p className="ps-amount-box__value">{formattedAmount}</p>
        </div>

        <div className="ps-receipt">
          <div className="ps-receipt__header">
            <h3>Transaction Receipt</h3>
            <span className="ps-receipt__status">Success</span>
          </div>

          <div className="ps-receipt__recipient">
            <span className="ps-receipt__avatar">{details.recipientName.charAt(0)}</span>
            <div className="ps-receipt__recipient-text">
              <p className="ps-receipt__recipient-name">{details.recipientName}</p>
              <p className="ps-receipt__recipient-phone">{details.recipientPhone}</p>
            </div>
            <div className="ps-receipt__network">
              <p className="ps-receipt__network-label">Network</p>
              <p className="ps-receipt__network-value">{details.network}</p>
            </div>
          </div>

          <div className="ps-receipt__rows">
            <div className="ps-receipt__row">
              <span>Transaction Type</span>
              <span>{details.rechargeType === 'data' ? 'Data Bundle' : 'Airtime Top-up'}</span>
            </div>
            <div className="ps-receipt__row">
              <span>Sent By</span>
              <span>{details.sentBy}</span>
            </div>
            <div className="ps-receipt__row">
              <span>Transaction ID</span>
              <span className="ps-receipt__txn-id">
                {details.txnId}
                <button type="button" onClick={handleCopyTxnId} aria-label="Copy transaction ID">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="1.75" />
                  </svg>
                </button>
              </span>
            </div>
            {copyState === 'copied' && <p className="ps-copy-toast">Transaction ID copied!</p>}
            <div className="ps-receipt__row">
              <span>Payment Method</span>
              <span>Wallet Balance</span>
            </div>
            <div className="ps-receipt__row">
              <span>Date &amp; Time</span>
              <span>{details.dateTime}</span>
            </div>
          </div>

          <div className="ps-receipt__divider" />

          <div className="ps-receipt__final-row">
            <span>Final Total</span>
            <span>{formattedAmount}</span>
          </div>
        </div>

        <button type="button" className="ps-dashboard-btn" onClick={() => navigate('/')}>
          Back to Dashboard
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="ps-secondary-actions">
          <button type="button" className="ps-secondary-btn" onClick={handleShare}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8.3 10.8l7.4-4.6M8.3 13.2l7.4 4.6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Share
          </button>
          <button type="button" className="ps-secondary-btn" onClick={handleSave}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save
          </button>
        </div>

        <p className="ps-secured-by">
          Secured by <strong>PayStack</strong>
        </p>
        <p className="ps-confirmation-note">A confirmation email has been sent to your registered account address.</p>
      </div>
    </PublicPageLayout>
  )
}

export default PaymentSuccess
