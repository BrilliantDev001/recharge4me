import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout/DashboardLayout.jsx'
import TextField from '../../components/common/TextField/TextField.jsx'
import Switch from '../../components/common/Switch/Switch.jsx'
import Button from '../../components/common/Button/Button.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog.jsx'
import ExpandableRow from '../../components/common/ExpandableRow/ExpandableRow.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getProfile, updateProfile, updateNotificationPrefs } from '../../api/client.js'
import { getPublicLinkDisplay } from '../../utils/link.js'
import { PROFILE_INFO, APP_LANGUAGE } from '../../data/dashboardContent.js'
import './Settings.css'

const TABS = [
  { id: 'profile', label: 'Profile & Info' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
]

function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const fileInputRef = useRef(null)

  // ---------- Shared state (desktop tabs + mobile expandable rows both read/write this) ----------
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [profileUser, setProfileUser] = useState(null)
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', headline: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [notifPrefs, setNotifPrefs] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsAlerts: false,
    marketingEmails: false,
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [toast, setToast] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    getProfile()
      .then(({ user: fetched }) => {
        setProfileUser(fetched)
        const [firstName, ...rest] = (fetched.name || '').split(' ')
        setProfileForm({
          firstName: firstName || '',
          lastName: rest.join(' '),
          headline: fetched.profileMessage || '',
        })
        if (fetched.notificationPrefs) setNotifPrefs(fetched.notificationPrefs)
        if (fetched.avatar && !fetched.avatar.startsWith('/images/')) setAvatarUrl(fetched.avatar)
      })
      .catch(() => {})
  }, [])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(reader.result)
    reader.readAsDataURL(file)
    // NOTE: photo isn't persisted to the backend yet — it's a local
    // preview only until we add real file upload/storage. Deferred.
  }

  const handleProfileSave = async () => {
    try {
      const { user: updated } = await updateProfile({
        name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
        profileMessage: profileForm.headline,
      })
      setProfileUser(updated)
      showToast('Profile updated successfully.')
    } catch (error) {
      showToast(error.message)
    }
  }

  const toggleNotifPref = (key) => {
    const next = { ...notifPrefs, [key]: !notifPrefs[key] }
    setNotifPrefs(next)
    updateNotificationPrefs(next).catch(() => setNotifPrefs(notifPrefs))
  }

  const handlePasswordSave = () => {
    const errors = {}
    if (!passwordForm.current) errors.current = 'Current password is required.'
    if (!passwordForm.next) {
      errors.next = 'New password is required.'
    } else if (passwordForm.next.length < 8) {
      errors.next = 'Password must be at least 8 characters.'
    }
    if (passwordForm.confirm !== passwordForm.next) {
      errors.confirm = 'Passwords do not match.'
    }
    setPasswordErrors(errors)
    if (Object.keys(errors).length === 0) {
      setPasswordForm({ current: '', next: '', confirm: '' })
      showToast('Password updated successfully.')
    }
  }

  const handleDeleteAccount = () => {
    setIsDeleteDialogOpen(false)
    showToast('Account deletion requested. This is a demo — nothing was actually deleted.')
  }

  const avatarNode = avatarUrl ? (
    <img src={avatarUrl} alt="" className="settings-avatar-img" />
  ) : (
    <span className="settings-avatar-initial">{user?.name?.charAt(0)}</span>
  )

  // ---------- Shared content blocks ----------

  const personalInfoForm = (
    <>
      <div className="settings-field-row">
        <TextField
          label="First Name"
          value={profileForm.firstName}
          onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
        />
        <TextField
          label="Last Name"
          value={profileForm.lastName}
          onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
        />
      </div>
      <TextField
        label="Public Headline"
        value={profileForm.headline}
        onChange={(e) => setProfileForm((p) => ({ ...p, headline: e.target.value }))}
      />
      <p className="settings-helper-text">This appears on your public recharge link page.</p>
    </>
  )

  const changePasswordForm = (
    <>
      <TextField
        label="Current Password"
        isPassword
        value={passwordForm.current}
        onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
        error={passwordErrors.current}
      />
      <TextField
        label="New Password"
        isPassword
        value={passwordForm.next}
        onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))}
        error={passwordErrors.next}
      />
      <TextField
        label="Confirm New Password"
        isPassword
        value={passwordForm.confirm}
        onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
        error={passwordErrors.confirm}
      />
    </>
  )

  return (
    <DashboardLayout activeNavItem="settings" activeTab="settings" mobileLabel="Settings">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="settings-file-input"
        onChange={handlePhotoUpload}
      />

      {toast && <p className="settings-toast">{toast}</p>}

      {/* ===================== DESKTOP ===================== */}
      <div className="hide-mobile">
        <p className="settings-eyebrow">Settings</p>

        <div className="settings-layout">
          <nav className="settings-tabs" aria-label="Settings sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`settings-tab ${activeTab === tab.id ? 'settings-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.id === 'profile' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4.5 20a7.5 7.5 0 0115 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {tab.id === 'security' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
                {tab.id === 'notifications' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="settings-panel">
            {activeTab === 'profile' && (
              <>
                <section className="settings-card">
                  <h3 className="settings-card__title">Personal Information</h3>
                  <p className="settings-card__subtitle">Manage your public profile and how sponsors see your link.</p>

                  <div className="settings-photo-row">
                    <div className="settings-avatar-wrap">
                      <span className="settings-avatar">{avatarNode}</span>
                      <button
                        type="button"
                        className="settings-avatar-edit-btn"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Upload new photo"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M4 8h3l2-3h6l2 3h3v11H4V8z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
                          <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.75" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <p className="settings-photo-row__title">Your Profile Picture</p>
                      <p className="settings-photo-row__text">
                        Upload a professional photo to build trust with sponsors. JPG, PNG or GIF. Max size 2MB.
                      </p>
                      <div className="settings-photo-row__actions">
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                          Update Photo
                        </Button>
                        {avatarUrl && (
                          <button type="button" className="settings-remove-btn" onClick={() => setAvatarUrl(null)}>
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="settings-divider" />

                  {personalInfoForm}

                  <div className="settings-card__footer">
                    <button
                      type="button"
                      className="settings-cancel-btn"
                      onClick={() => {
                        const [firstName, ...rest] = (profileUser?.name || '').split(' ')
                        setProfileForm({ firstName, lastName: rest.join(' '), headline: profileUser?.profileMessage || '' })
                      }}
                    >
                      Cancel
                    </button>
                    <Button variant="secondary" size="md" onClick={handleProfileSave}>
                      Save Changes
                    </Button>
                  </div>
                </section>

                <section className="settings-card">
                  <h3 className="settings-card__title">Contact Details</h3>
                  <p className="settings-card__subtitle">Verified information used for notifications and transactions.</p>

                  <div className="settings-contact-row">
                    <span className="settings-contact-row__icon settings-contact-row__icon--primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div className="settings-contact-row__text">
                      <p className="settings-contact-row__label">Email Address</p>
                      <p className="settings-contact-row__value">{profileUser?.email}</p>
                    </div>
                    <span className="settings-badge settings-badge--verified">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Verified
                    </span>
                  </div>

                  <div className="settings-contact-row">
                    <span className="settings-contact-row__icon settings-contact-row__icon--secondary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div className="settings-contact-row__text">
                      <p className="settings-contact-row__label">Phone Number</p>
                      <p className="settings-contact-row__value">{profileUser?.phone}</p>
                    </div>
                    <span className="settings-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Primary
                    </span>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <section className="settings-card">
                  <h3 className="settings-card__title">Change Password</h3>
                  <p className="settings-card__subtitle">Use a strong password you don't use elsewhere.</p>
                  {changePasswordForm}
                  <div className="settings-card__footer settings-card__footer--start">
                    <Button variant="secondary" size="md" onClick={handlePasswordSave}>
                      Update Password
                    </Button>
                  </div>
                </section>

                <section className="settings-card">
                  <h3 className="settings-card__title">Two-Factor Authentication</h3>
                  <p className="settings-card__subtitle">Add an extra layer of security to your account.</p>
                  <div className="settings-toggle-row">
                    <div>
                      <p className="settings-toggle-row__title">Enable 2FA</p>
                      <p className="settings-toggle-row__subtitle">Require a verification code at login, in addition to your password.</p>
                    </div>
                    <Switch checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled((v) => !v)} label="Two-factor authentication" />
                  </div>
                </section>

                <section className="settings-card">
                  <h3 className="settings-card__title">Active Sessions</h3>
                  <p className="settings-card__subtitle">Devices currently signed in to your account.</p>
                  <div className="settings-session-row">
                    <div>
                      <p className="settings-session-row__title">Chrome on Windows</p>
                      <p className="settings-session-row__subtitle">This device</p>
                    </div>
                    <span className="settings-badge settings-badge--verified">Current</span>
                  </div>
                  <div className="settings-session-row">
                    <div>
                      <p className="settings-session-row__title">Safari on iPhone</p>
                      <p className="settings-session-row__subtitle">Lagos, Nigeria • 2 days ago</p>
                    </div>
                    <button type="button" className="settings-signout-link" onClick={() => showToast('Session ended.')}>
                      Sign Out
                    </button>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <section className="settings-card">
                  <h3 className="settings-card__title">Notification Preferences</h3>
                  <p className="settings-card__subtitle">Choose how you'd like to be notified about activity on your account.</p>

                  <div className="settings-toggle-row">
                    <p className="settings-toggle-row__title">Push Notifications</p>
                    <Switch
                      checked={notifPrefs.pushNotifications}
                      onChange={() => toggleNotifPref('pushNotifications')}
                      label="Push notifications"
                    />
                  </div>
                  <div className="settings-toggle-row">
                    <p className="settings-toggle-row__title">Email Notifications</p>
                    <Switch
                      checked={notifPrefs.emailNotifications}
                      onChange={() => toggleNotifPref('emailNotifications')}
                      label="Email notifications"
                    />
                  </div>
                  <div className="settings-toggle-row">
                    <p className="settings-toggle-row__title">SMS Alerts</p>
                    <Switch
                      checked={notifPrefs.smsAlerts}
                      onChange={() => toggleNotifPref('smsAlerts')}
                      label="SMS alerts"
                    />
                  </div>
                  <div className="settings-toggle-row">
                    <p className="settings-toggle-row__title">Marketing Emails</p>
                    <Switch
                      checked={notifPrefs.marketingEmails}
                      onChange={() => toggleNotifPref('marketingEmails')}
                      label="Marketing emails"
                    />
                  </div>
                </section>

                <section className="settings-card">
                  <h3 className="settings-card__title">Preferences</h3>
                  <p className="settings-card__subtitle">General display and link preferences.</p>

                  <div className="settings-select-row">
                    <label htmlFor="app-language">App Language</label>
                    <select id="app-language" defaultValue={APP_LANGUAGE} className="settings-select">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>French</option>
                      <option>Portuguese</option>
                    </select>
                  </div>

                  <Link to="/recharge-link" className="settings-link-row">
                    <div>
                      <p className="settings-link-row__title">Public Page Link</p>
                      <p className="settings-link-row__subtitle">{getPublicLinkDisplay(user?.username)}</p>
                    </div>
                    <span className="settings-badge settings-badge--verified">Active</span>
                  </Link>
                </section>
              </>
            )}
          </div>
        </div>

        {/* ===================== DESKTOP DANGER ZONE ===================== */}
        <section className="settings-danger-zone">
          <h3 className="settings-danger-zone__title">Danger Zone</h3>
          <div className="settings-danger-row">
            <div>
              <p className="settings-danger-row__title">Delete Account</p>
              <p className="settings-danger-row__subtitle">Permanently remove your account and all associated data.</p>
            </div>
            <Button variant="outline" size="md" className="settings-danger-btn" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete Account
            </Button>
          </div>
          <div className="settings-danger-row">
            <div>
              <p className="settings-danger-row__title">Request Data Export</p>
              <p className="settings-danger-row__subtitle">Download all your transaction history and account data.</p>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => showToast('Export requested — check your email shortly.')}
            >
              Request Export
            </Button>
          </div>
        </section>
      </div>

      {/* ===================== MOBILE ===================== */}
      <div className="hide-desktop">
        <div className="settings-mobile-header">
          <span className="settings-avatar settings-avatar--mobile">
            {avatarNode}
            <span className="settings-mobile-header__online" aria-hidden="true" />
          </span>
          <div className="settings-mobile-header__text">
            <p className="settings-mobile-header__name">
              {user?.name} <span className="settings-pro-badge">Pro</span>
            </p>
            <p className="settings-mobile-header__email">{profileUser?.email}</p>
            {PROFILE_INFO.isVerifiedIdentity && (
              <p className="settings-mobile-header__verified">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified Identity
              </p>
            )}
          </div>
        </div>

        <p className="settings-section-label">Account &amp; Security</p>
        <ExpandableRow
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4.5 20a7.5 7.5 0 0115 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          iconBg="var(--color-bg-surface-alt)"
          title="Personal Information"
          subtitle="Update your name and profile details"
        >
          {personalInfoForm}
          <Button variant="secondary" size="md" className="settings-mobile-save-btn" onClick={handleProfileSave}>
            Save Changes
          </Button>
        </ExpandableRow>

        <ExpandableRow
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          iconBg="var(--color-success-bg)"
          title="Phone Number"
          subtitle={profileUser?.phone}
          trailingText="Primary"
        >
          <p className="settings-helper-text">
            This number receives SMS alerts and is shown as your primary contact for verified transactions.
          </p>
        </ExpandableRow>

        <ExpandableRow
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
          iconBg="#ede9fe"
          title="Password & Security"
          subtitle="Change password, manage 2FA"
        >
          {changePasswordForm}
          <Button variant="secondary" size="md" className="settings-mobile-save-btn" onClick={handlePasswordSave}>
            Update Password
          </Button>
          <div className="settings-toggle-row settings-toggle-row--mobile">
            <p className="settings-toggle-row__title">Two-Factor Authentication</p>
            <Switch checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled((v) => !v)} label="Two-factor authentication" />
          </div>
        </ExpandableRow>

        <p className="settings-section-label">Preferences</p>
        <div className="settings-mobile-toggle-row">
          <span className="settings-mobile-toggle-row__icon" style={{ backgroundColor: '#fef9c3' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className="settings-mobile-toggle-row__text">
            <p className="settings-toggle-row__title">Push Notifications</p>
            <p className="settings-toggle-row__subtitle">Manage alert sounds and frequency</p>
          </div>
          <Switch
            checked={notifPrefs.pushNotifications}
            onChange={() => toggleNotifPref('pushNotifications')}
            label="Push notifications"
          />
        </div>

        <ExpandableRow
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 12h18M12 3c2.5 2.7 2.5 14.3 0 18M12 3c-2.5 2.7-2.5 14.3 0 18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
          iconBg="#dbeafe"
          title="App Language"
          subtitle={APP_LANGUAGE}
        >
          <div className="settings-select-row">
            <label htmlFor="app-language-mobile">Select language</label>
            <select id="app-language-mobile" defaultValue={APP_LANGUAGE} className="settings-select">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>French</option>
              <option>Portuguese</option>
            </select>
          </div>
        </ExpandableRow>

        <Link to="/recharge-link" className="settings-mobile-link-row">
          <span className="settings-mobile-toggle-row__icon" style={{ backgroundColor: 'var(--color-success-bg)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M14 5h5v5M19 5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className="settings-mobile-toggle-row__text">
            <p className="settings-toggle-row__title">Public Page Link</p>
            <p className="settings-toggle-row__subtitle">{getPublicLinkDisplay(user?.username)}</p>
          </div>
          <span className="settings-badge settings-badge--verified">Active</span>
        </Link>

        <p className="settings-section-label settings-section-label--danger">Danger Zone</p>
        <button type="button" className="settings-mobile-danger-row" onClick={() => setIsDeleteDialogOpen(true)}>
          <span className="settings-mobile-toggle-row__icon" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0v13a2 2 0 01-2 2H9a2 2 0 01-2-2V7h10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="settings-mobile-toggle-row__text">
            <p className="settings-mobile-danger-row__title">Delete Account</p>
            <p className="settings-toggle-row__subtitle">Permanently remove your account and data</p>
          </div>
        </button>
        <button
          type="button"
          className="settings-mobile-danger-row"
          onClick={() => showToast('Export requested — check your email shortly.')}
        >
          <span className="settings-mobile-toggle-row__icon" style={{ backgroundColor: 'var(--color-bg-surface-alt)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5l8-3z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="settings-mobile-toggle-row__text">
            <p className="settings-toggle-row__title">Request Data Export</p>
            <p className="settings-toggle-row__subtitle">Download all your transaction history</p>
          </div>
        </button>

        <div className="settings-mobile-footer">
          <p>Recharge4Me v2.4.0</p>
          <p>
            Made with <span aria-hidden="true">❤️</span> for Global Connectivity
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete your account?"
        description="This permanently deletes your account, your public link, and all transaction history. This action cannot be undone."
        confirmLabel="Yes, Delete Account"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </DashboardLayout>
  )
}

export default Settings
