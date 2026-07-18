import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout/DashboardLayout.jsx'
import Switch from '../../components/common/Switch/Switch.jsx'
import Button from '../../components/common/Button/Button.jsx'
import StatCard from '../../components/common/StatCard/StatCard.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog.jsx'
import TrendChart from '../../components/common/TrendChart/TrendChart.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getMyLink, updateLinkSettings } from '../../api/client.js'
import { getPublicLinkUrl, getPublicLinkDisplay } from "../../utils/link.js";
import { QRCodeCanvas } from 'qrcode.react'
import { Link } from 'react-router-dom';
import { LINK_QUICK_STATS_MOBILE, ENGAGEMENT_TIMELINE } from '../../data/dashboardContent.js'
import './RechargeLink.css'

const STAT_ICONS = {
  cursor: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 3l14 7-6 2-2 6-6-15z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bolt: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  history: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  card: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
}

function QrGraphic({ size = 96 }) {
  // real QR codes render via QRCodeCanvas below
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill="var(--color-bg-surface)" />
      {[
        [4, 4], [4, 14], [4, 24], [14, 4], [24, 4], [14, 24], [24, 24],
        [70, 4], [80, 4], [90, 4], [70, 14], [70, 24], [80, 24], [90, 24],
        [4, 70], [4, 80], [4, 90], [14, 90], [24, 70], [24, 90],
        [40, 10], [50, 20], [60, 10], [45, 40], [55, 50], [40, 60], [60, 65],
        [45, 80], [60, 85], [75, 45], [85, 55], [75, 70], [85, 80], [70, 90], [85, 90],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="8" height="8" fill="var(--color-neutral-900)" />
      ))}
    </svg>
  )
}

function RechargeLink() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    linkStatusEnabled: true,
    allowDataBundles: true,
    showVerification: true,
    allowAnonymousSponsors: true,
    isLive: true,
  })
  const [stats, setStats] = useState({ totalClicks: 0, conversions: 0, avgRecharge: 0, lastActivity: null })
  const [copyState, setCopyState] = useState('idle')
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenerateDone, setRegenerateDone] = useState(false)

  const desktopQrRef = useRef(null)
  const mobileQrRef = useRef(null)

  const downloadQrCode = (containerRef) => {
    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'recharge4me-qr-code.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleShareLink = () => {
    const url = getPublicLinkUrl(user?.username)
    if (navigator.share) {
      navigator.share({ title: 'My Recharge4Me Link', url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).catch(() => {})
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    }
  }

  useEffect(() => {
    getMyLink()
      .then((data) => {
        setSettings(data.settings)
        setStats(data.stats)
      })
      .catch(() => {})
  }, [])

  const toggleSetting = (key) => {
    const nextValue = !settings[key]
    setSettings((prev) => ({ ...prev, [key]: nextValue }))
    updateLinkSettings({ [key]: nextValue }).catch(() => {
      // Revert on failure so the UI never lies about saved state.
      setSettings((prev) => ({ ...prev, [key]: !nextValue }))
    })
  }

  const linkStatsDisplay = [
    { id: 'ls-clicks', label: 'Total Clicks', value: stats.totalClicks.toLocaleString(), icon: 'cursor' },
    { id: 'ls-conversions', label: 'Conversions', value: stats.conversions.toLocaleString(), icon: 'check' },
    { id: 'ls-avg', label: 'Avg. Recharge', value: `₦${stats.avgRecharge.toLocaleString()}`, icon: 'bolt' },
    {
      id: 'ls-activity',
      label: 'Last Activity',
      value: stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : '—',
      icon: 'history',
    },
  ]

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(getPublicLinkUrl(user?.username)).catch(() => {})
    setCopyState('copied')
    setTimeout(() => setCopyState('idle'), 2000)
  }

  const handleRegenerateConfirm = () => {
    // Mock regeneration — real backend integration comes later.
    setIsRegenerating(true)
    setTimeout(() => {
      setIsRegenerating(false)
      setIsRegenerateDialogOpen(false)
      setRegenerateDone(true)
      setTimeout(() => setRegenerateDone(false), 3000)
    }, 1000)
  }

  return (
    <DashboardLayout
      activeNavItem="recharge-link"
      activeTab="links"
      mobileLabel="Link Management"
      showMobileBackArrow
    >
      {/* ===================== DESKTOP HEADER ===================== */}
      <div className="rl-header hide-mobile">
        <div>
          <h1 className="rl-header__title">Manage Your Link</h1>
          <p className="rl-header__subtitle">Customize how people send you recharges and track your performance.</p>
        </div>
        <Button variant="outline" size="md" as="a" href={`/u/${user?.username}`} target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
            <path d="M14 5h5v5M19 5l-9 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          Preview Page
        </Button>
      </div>

      {/* ===================== MOBILE USER ROW ===================== */}
      <div className="rl-user-row hide-desktop">
        <div className="rl-user-row__avatar-wrap">
          <span className="rl-user-row__avatar">{user?.name?.charAt(0)}</span>
          <span className="rl-user-row__online" aria-hidden="true" />
        </div>
        <div>
          <p className="rl-user-row__name">{user?.name}</p>
          <p className="rl-user-row__managing">Managing @{user?.username}</p>
        </div>
      </div>

      {/* ===================== MOBILE LINK VISIBILITY ===================== */}
      <div className="rl-visibility-row hide-desktop">
        <span className="rl-visibility-row__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 15l6-6M8 12l-2 2a3.5 3.5 0 004.9 4.9l2-2M16 12l2-2a3.5 3.5 0 00-4.9-4.9l-2 2"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="rl-visibility-row__text">
          <p className="rl-visibility-row__title">Link Visibility</p>
          <p className="rl-visibility-row__subtitle">Anyone can send you recharge</p>
        </div>
        <Switch checked={settings.linkStatusEnabled} onChange={() => toggleSetting('linkStatusEnabled')} label="Link visibility" />
      </div>

      <div className="rl-grid">
        <div className="rl-grid__main">
          {/* ===================== DESKTOP URL CARD ===================== */}
          <section className="rl-card hide-mobile">
            <div className="rl-card__header">
              <div>
                <h3 className="rl-card__title">Public Recharge URL</h3>
                <p className="rl-card__subtitle">This is the unique link you share with others.</p>
              </div>
              {settings.linkStatusEnabled && <span className="rl-active-label">Link Active</span>}
            </div>

            <div className="rl-url-row">
              <span className="rl-url-row__text">{getPublicLinkUrl(user?.username)}</span>
              <Button variant="secondary" size="md" onClick={handleCopyLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
                  <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="1.75" />
                </svg>
                {copyState === 'copied' ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>

            <div className="rl-toggles-grid">
              <div className="rl-toggle-row">
                <div>
                  <p className="rl-toggle-row__title">Toggle Link Status</p>
                  <p className="rl-toggle-row__subtitle">Temporarily disable your link</p>
                </div>
                <Switch
                  checked={settings.linkStatusEnabled}
                  onChange={() => toggleSetting('linkStatusEnabled')}
                  label="Toggle link status"
                />
              </div>
              <div className="rl-toggle-row">
                <div>
                  <p className="rl-toggle-row__title">Allow Data Bundles</p>
                  <p className="rl-toggle-row__subtitle">Allow sponsors to send data</p>
                </div>
                <Switch
                  checked={settings.allowDataBundles}
                  onChange={() => toggleSetting('allowDataBundles')}
                  label="Allow data bundles"
                />
              </div>
              <div className="rl-toggle-row">
                <div>
                  <p className="rl-toggle-row__title">Show Verification</p>
                  <p className="rl-toggle-row__subtitle">Display badge on public page</p>
                </div>
                <Switch
                  checked={settings.showVerification}
                  onChange={() => toggleSetting('showVerification')}
                  label="Show verification badge"
                />
              </div>
              <div className="rl-toggle-row">
                <div>
                  <p className="rl-toggle-row__title">Anonymous Sponsors</p>
                  <p className="rl-toggle-row__subtitle">Allow hidden sponsor names</p>
                </div>
                <Switch
                  checked={settings.allowAnonymousSponsors}
                  onChange={() => toggleSetting('allowAnonymousSponsors')}
                  label="Allow anonymous sponsors"
                />
              </div>
            </div>
          </section>

          {/* ===================== DESKTOP DANGER ZONE ===================== */}
          <section className="rl-danger-zone hide-mobile">
            <div>
              <p className="rl-danger-zone__title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9v4M12 17h.01M10.3 3.9L2.5 17a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Danger Zone
              </p>
              <p className="rl-danger-zone__text">Regenerating your link ID will invalidate your current URL permanently.</p>
            </div>
            <Button variant="outline" size="md" className="rl-danger-zone__btn" onClick={() => setIsRegenerateDialogOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
                <path d="M4 4v6h6M20 20v-6h-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 14a8 8 0 0014.9 3M19 10A8 8 0 004.1 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Regenerate Link
            </Button>
          </section>

          {regenerateDone && (
            <p className="rl-toast">Your link has been regenerated successfully.</p>
          )}

          {/* ===================== MOBILE PUBLIC LINK CARD ===================== */}
          <section className="rl-mobile-link-card hide-desktop">
            <div className="rl-mobile-link-card__header">
              <h3>Public Link</h3>
              {settings.isLive && <span className="rl-live-badge">Live</span>}
            </div>
            <p className="rl-mobile-link-card__subtitle">Share this link to receive mobile recharges</p>

            <div className="rl-mobile-url-row">
              <span className="rl-mobile-url-row__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 15l6-6M8 12l-2 2a3.5 3.5 0 004.9 4.9l2-2M16 12l2-2a3.5 3.5 0 00-4.9-4.9l-2 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="rl-mobile-url-row__text">{getPublicLinkDisplay(user?.username)}</span>
              <button type="button" className="rl-mobile-url-row__copy" onClick={handleCopyLink} aria-label="Copy link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            <div className="rl-mobile-link-card__actions">
              <Button variant="secondary" size="md" as="a" href={`/u/${user?.username}`} target="_blank" rel="noopener noreferrer" className="rl-mobile-preview-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
                  <path d="M14 5h5v5M19 5l-9 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
                Preview Page
              </Button>
              <Button variant="outline" size="md" onClick={() => setIsRegenerateDialogOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
                  <path d="M4 4v6h6M20 20v-6h-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 14a8 8 0 0014.9 3M19 10A8 8 0 004.1 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Regenerate
              </Button>
            </div>
          </section>

          {/* ===================== MOBILE QR SECTION ===================== */}
          <section className="rl-mobile-qr hide-desktop">
            <div className="rl-mobile-qr__code" ref={mobileQrRef}>
              <QRCodeCanvas value={getPublicLinkUrl(user?.username)} size={140} level="M" includeMargin />
            </div>
            <p className="rl-mobile-qr__label">Personal QR Code</p>
            <div className="rl-mobile-qr__actions">
              <button type="button" className="rl-mobile-qr__action" onClick={handleShareLink}>
                <span className="rl-mobile-qr__action-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8.3 10.8l7.4-4.6M8.3 13.2l7.4 4.6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                Share
              </button>
              <button type="button" className="rl-mobile-qr__action" onClick={handleCopyLink}>
                <span className="rl-mobile-qr__action-icon rl-mobile-qr__action-icon--primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 15l6-6M8 12l-2 2a3.5 3.5 0 004.9 4.9l2-2M16 12l2-2a3.5 3.5 0 00-4.9-4.9l-2 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Link
              </button>
              <button type="button" className="rl-mobile-qr__action" onClick={() => downloadQrCode(mobileQrRef)}>
                <span className="rl-mobile-qr__action-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Download
              </button>
            </div>
          </section>

          {copyState === 'copied' && <p className="rl-toast hide-desktop">Link copied to clipboard!</p>}

          {/* ===================== DESKTOP LINK STATISTICS ===================== */}
          <section className="hide-mobile">
            <h3 className="rl-section-title">Link Statistics</h3>
            <div className="rl-stats-row">
              {linkStatsDisplay.map((stat) => (
                <StatCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.value}
                  icon={STAT_ICONS[stat.icon]}
                  trend={stat.trend}
                  footnote=""
                  compact
                />
              ))}
            </div>
          </section>

          {/* ===================== MOBILE QUICK STATISTICS ===================== */}
          <section className="hide-desktop">
            <div className="rl-section-header-row">
              <p className="rl-section-title">Quick Statistics</p>
              <Link to="/transactions" className="rl-detailed-link">
                Detailed View
              </Link>
            </div>
            <div className="rl-mobile-stats-grid">
              {LINK_QUICK_STATS_MOBILE.map((stat) => (
                <div key={stat.id} className="rl-mobile-stat-card">
                  <span className="rl-mobile-stat-card__icon">{STAT_ICONS[stat.icon]}</span>
                  <p className="rl-mobile-stat-card__value">{stat.value}</p>
                  <p className="rl-mobile-stat-card__label">{stat.label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== MOBILE UPSELL CARD ===================== */}
          <div className="rl-upsell hide-desktop">
            <span className="rl-upsell__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                <path
                  d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="rl-upsell__title">Need more control?</p>
              <p className="rl-upsell__text">
                Visit advanced settings to set daily limits, restrict networks, or customize your
                landing page theme.
              </p>
            </div>
          </div>

          {/* ===================== DESKTOP ENGAGEMENT TIMELINE ===================== */}
          <div className="hide-mobile">
            <TrendChart
              title="Engagement Timeline"
              subtitle="Daily click-through performance across all platforms."
              data={ENGAGEMENT_TIMELINE}
              valuePrefix=""
            />
          </div>
        </div>

        {/* ===================== DESKTOP QR RAIL ===================== */}
        <aside className="rl-rail hide-mobile">
          <div className="rl-rail-card">
            <h3 className="rl-rail-card__title">Share via QR Code</h3>
            <p className="rl-rail-card__subtitle">Perfect for social bios or printed materials.</p>
            <div className="rl-rail-qr" ref={desktopQrRef}>
              <QRCodeCanvas value={getPublicLinkUrl(user?.username)} size={160} level="M" includeMargin />
            </div>
            <Button variant="outline" size="md" className="rl-rail-qr__download" onClick={() => downloadQrCode(desktopQrRef)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download QR
            </Button>
          </div>
        </aside>
      </div>

      {/* ===================== DESKTOP FOOTER ===================== */}
      <footer className="rl-footer hide-mobile">
        <p>&copy; {new Date().getFullYear()} Recharge4Me. Premium Link Management for modern users.</p>
      </footer>

      <ConfirmDialog
        open={isRegenerateDialogOpen}
        title="Regenerate your link?"
        description="This will permanently invalidate your current URL. Anyone using the old link will no longer be able to reach your page. This can't be undone."
        confirmLabel="Yes, Regenerate"
        cancelLabel="Cancel"
        isDestructive
        isProcessing={isRegenerating}
        onConfirm={handleRegenerateConfirm}
        onCancel={() => setIsRegenerateDialogOpen(false)}
      />
    </DashboardLayout>
  )
}

export default RechargeLink
