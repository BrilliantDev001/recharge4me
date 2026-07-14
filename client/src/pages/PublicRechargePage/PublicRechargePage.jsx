import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PublicPageLayout from '../../components/layout/PublicPageLayout/PublicPageLayout.jsx'
import { getPublicLink, submitRecharge } from '../../api/client.js'
import { NETWORK_PROVIDERS, PRESET_AMOUNTS, MIN_RECHARGE_AMOUNT } from '../../data/dashboardContent.js'
import './PublicRechargePage.css'

function maskPhone(phone) {
  // "+234 812 345 6789" -> "+234 812 **** 789"
  const parts = phone.split(' ')
  if (parts.length < 3) return phone
  const last = parts[parts.length - 1]
  const maskedLast = '*'.repeat(Math.max(last.length - 3, 0)) + last.slice(-3)
  return [...parts.slice(0, -1), maskedLast].join(' ')
}

function PublicRechargePage() {
  const { username } = useParams()
  const navigate = useNavigate()

  const [linkData, setLinkData] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORK_PROVIDERS[0].id)
  const [rechargeType, setRechargeType] = useState('airtime')
  const [amount, setAmount] = useState(String(PRESET_AMOUNTS[2]))
  const [isProcessing, setIsProcessing] = useState(false)
  const [amountError, setAmountError] = useState('')

  useEffect(() => {
    getPublicLink(username)
      .then(setLinkData)
      .catch((error) => setLoadError(error.message))
  }, [username])

  const handleAmountInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setAmount(value)
    if (amountError) setAmountError('')
  }

  const handleRecharge = async () => {
    const numericAmount = parseInt(amount, 10) || 0
    if (numericAmount < MIN_RECHARGE_AMOUNT) {
      setAmountError(`Minimum recharge amount is ₦${MIN_RECHARGE_AMOUNT}.`)
      return
    }

    setIsProcessing(true)
    const network = NETWORK_PROVIDERS.find((n) => n.id === selectedNetwork)

    try {
      const result = await submitRecharge(username, {
        amount: numericAmount,
        network: network?.label,
        type: rechargeType === 'airtime' ? 'Airtime' : 'Data',
        isAnonymous: true, // no sponsor-name field on this page yet — deferred
      })

      // Full browser redirect (not a React route) — Paystack's checkout
      // is hosted on their own domain. They'll redirect back to
      // /payment-success?reference=... once the sponsor pays.
      window.location.href = result.authorizationUrl
    } catch (error) {
      setAmountError(error.message)
      setIsProcessing(false)
    }
  }

  if (loadError) {
    return (
      <PublicPageLayout label="Recharge Link">
        <div className="prp-card">
          <p style={{ padding: '2rem', textAlign: 'center' }}>{loadError}</p>
        </div>
      </PublicPageLayout>
    )
  }

  return (
    <PublicPageLayout label="Recharge Link">
      <div className="prp-card">
        <div className="prp-profile">
          <span className="prp-avatar">{linkData?.fullName?.charAt(0)}</span>
          <p className="prp-name">
            {linkData?.fullName} {linkData?.isVerified && <span className="prp-pro-badge">Verified</span>}
          </p>
          <p className="prp-phone">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {linkData?.phone && maskPhone(linkData.phone)}
          </p>
          {username && <p className="prp-username">@{username}</p>}
        </div>

        <div className="prp-form">
          <p className="prp-form-label">Select Network Provider</p>
          <div className="prp-network-grid">
            {NETWORK_PROVIDERS.map((network) => (
              <button
                key={network.id}
                type="button"
                className={`prp-network-btn ${selectedNetwork === network.id ? 'prp-network-btn--active' : ''}`}
                onClick={() => setSelectedNetwork(network.id)}
              >
                <span className="prp-network-btn__logo" style={{ backgroundColor: network.color, color: network.textColor }}>
                  {network.label.charAt(0)}
                </span>
                {network.label}
              </button>
            ))}
          </div>

          <p className="prp-form-label">Recharge Type</p>
          <div className="prp-segmented">
            <button
              type="button"
              className={`prp-segmented__btn ${rechargeType === 'airtime' ? 'prp-segmented__btn--active' : ''}`}
              onClick={() => setRechargeType('airtime')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Airtime
            </button>
            <button
              type="button"
              className={`prp-segmented__btn ${rechargeType === 'data' ? 'prp-segmented__btn--active' : ''}`}
              onClick={() => setRechargeType('data')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M2 16.5a15 15 0 0120 0M6 12a10 10 0 0112 0M10 7.5a5 5 0 014 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="20" r="1" fill="currentColor" />
              </svg>
              Mobile Data
            </button>
          </div>

          <div className="prp-amount-header">
            <p className="prp-form-label">Amount</p>
            <p className="prp-min-label">Min: ₦{MIN_RECHARGE_AMOUNT}</p>
          </div>
          <div className={`prp-amount-input ${amountError ? 'prp-amount-input--error' : ''}`}>
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
                className={`prp-preset-chip ${amount === String(preset) ? 'prp-preset-chip--active' : ''}`}
                onClick={() => {
                  setAmount(String(preset))
                  setAmountError('')
                }}
              >
                ₦{preset}
              </button>
            ))}
          </div>

          <button type="button" className="prp-recharge-btn" onClick={handleRecharge} disabled={isProcessing}>
            {isProcessing ? 'Processing…' : 'Recharge Now'}
          </button>
          <p className="prp-disclaimer">
            By clicking "Recharge Now", you agree to the Terms of Service. Airtime will be sent
            instantly to the recipient.
          </p>

          <div className="prp-trust-row">
            <div className="prp-trust-item">
              <span className="prp-trust-item__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5l8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="prp-trust-item__title">Secure</p>
              <p className="prp-trust-item__subtitle">Encrypted SSL</p>
            </div>
            <div className="prp-trust-item">
              <span className="prp-trust-item__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="prp-trust-item__title">Instant</p>
              <p className="prp-trust-item__subtitle">Auto-delivery</p>
            </div>
            <div className="prp-trust-item">
              <span className="prp-trust-item__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21s-7-4.5-7-10a7 7 0 0114 0c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="prp-trust-item__title">Zero Fees</p>
              <p className="prp-trust-item__subtitle">No extra charges</p>
            </div>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  )
}

export default PublicRechargePage
