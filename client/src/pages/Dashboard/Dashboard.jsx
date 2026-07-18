import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard/StatCard.jsx";
import StatusPill from "../../components/common/StatusPill/StatusPill.jsx";
import TrendChart from "../../components/common/TrendChart/TrendChart.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getDashboardData } from "../../api/client.js";
import { getPublicLinkUrl, getPublicLinkDisplay } from "../../utils/link.js";
import QrCodeModal from '../../components/common/QrCodeModal/QrCodeModal.jsx'
import { Link } from 'react-router-dom';
import {
  QUICK_INSIGHTS,
  QUICK_ACTIONS,
  PROFILE_COMPLETENESS,
  RECENT_ACTIVITY_MOBILE,
  TREND_DATA_MONTH,
} from "../../data/dashboardContent.js";
import "./Dashboard.css";

const QUICK_ACTION_ICONS = {
  copy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
  ),
  qr: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M14 14h3v3h-3zM19 19h2v2h-2zM14 19h2v2h-2zM19 14h2v2h-2z"
        fill="currentColor"
      />
    </svg>
  ),
  history: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 7v5l3.5 2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 8a3 3 0 100-6M14 14c2.8.4 5 2.8 5 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const TYPE_ICONS = {
  Airtime: (
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
  ),
  Data: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 2.7 2.5 14.3 0 18M12 3c-2.5 2.7-2.5 14.3 0 18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  "Data Plan": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c2.5 2.7 2.5 14.3 0 18M12 3c-2.5 2.7-2.5 14.3 0 18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
};

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatarColor(name) {
  return `hsl(${name.length * 41}, 60%, 55%)`;
}

function Dashboard() {
  const { user } = useAuth();
  const [copyState, setCopyState] = useState("idle"); // 'idle' | 'copied'
  const [data, setData] = useState(null);
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch(() => {});
  }, []);

  const heroStats = data?.heroStats || {
    newRechargesThisWeek: 0,
    totalAvailableCredit: 0,
  };
  const mainStats = data?.mainStats || [];
  const recentRecharges = data?.recentRecharges || [];
  const trendDataWeek = data?.trendDataWeek || [];
  const linkActivity = data?.linkActivity || { totalClicks: 0, isActive: true };

  const handleCopyLink = () => {
    navigator.clipboard
      ?.writeText(getPublicLinkUrl(user?.username))
      .catch(() => {});
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2000);
  };

  return (
    <DashboardLayout
      activeNavItem="dashboard"
      activeTab="home"
      mobileLabel="Dashboard"
    >
      {/* ===================== HERO ===================== */}
      <section className="db-hero">
        <div className="db-hero__bolt-bg" aria-hidden="true">
          <svg width="220" height="220" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L3 14H11L10 22L21 9H13L13 2Z"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* ---------- Mobile-only greeting row ---------- */}
        <div className="db-hero__mobile-row hide-desktop">
          <div className="db-hero__avatar-wrap">
            <span className="db-hero__avatar">
              {initials(user?.name || "")}
            </span>
            <span className="db-hero__online-dot" aria-hidden="true" />
          </div>
          <div>
            <p className="db-hero__greeting">
              Hello, {user?.name?.split(" ")[0]}!
            </p>
            <p className="db-hero__account-id">
              Account ID: #{user?.id?.slice(-6).toUpperCase()}
            </p>
          </div>
          <span className="db-hero__pro-badge">PRO</span>
        </div>

        {/* ---------- Desktop-only greeting ---------- */}
        <div className="hide-mobile">
          <h1 className="db-hero__title">
            Welcome back, {user?.name?.split(" ")[0]}!{" "}
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="db-hero__subtitle">
            You've received {heroStats.newRechargesThisWeek} new recharges this
            week. Your public link is active and performing well.
          </p>
        </div>

        {/* ---------- Mobile-only credit balance ---------- */}
        <div className="hide-desktop">
          <p className="db-hero__credit-label">Total Available Credit</p>
          <p className="db-hero__credit-value">
            ₦
            {heroStats.totalAvailableCredit.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* ---------- Desktop-only inline link row ---------- */}
        <div className="db-hero__link-row hide-mobile">
          <span className="db-hero__link-icon" aria-hidden="true">
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
          <span className="db-hero__link-text">
            {getPublicLinkDisplay(user?.username)}
          </span>
          <button
            type="button"
            className="db-hero__pill-btn"
            onClick={handleCopyLink}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            {copyState === "copied" ? "Copied!" : "Copy Link"}
          </button>
          <button
            type="button"
            className="db-hero__pill-btn"
            onClick={() => setIsQrOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.75"
              />
            </svg>
            Show QR
          </button>
        </div>

        {/* ---------- Mobile-only action buttons ---------- */}
        <div className="db-hero__mobile-actions hide-desktop">
          <button
            type="button"
            className="db-hero__mobile-btn db-hero__mobile-btn--light"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Withdraw
          </button>
          <button
            type="button"
            className="db-hero__mobile-btn db-hero__mobile-btn--outline"
          >
            History
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      <div className="db-grid">
        <div className="db-grid__main">
          {/* ---------- Mobile-only Public Recharge Link card ---------- */}
          <section className="db-linkcard hide-desktop">
            <div className="db-linkcard__header">
              <p className="db-linkcard__label">Public Recharge Link</p>
              <span className="db-linkcard__active">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 12.5l2.5 2.5L16 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Active
              </span>
            </div>
            <div className="db-linkcard__box">
              <div>
                <p className="db-linkcard__url-label">Your Unique URL</p>
                <p className="db-linkcard__url">
                  {getPublicLinkDisplay(user?.username)}
                </p>
              </div>
              <div className="db-linkcard__box-actions">
                <button
                  type="button"
                  className="db-linkcard__icon-btn"
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                <button
                  type="button"
                  className="db-linkcard__icon-btn"
                  onClick={() => setIsQrOpen(true)}
                  aria-label="Show QR code"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="db-linkcard__footer-links">
              <a
                href={`/u/${user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 5h5v5M19 5l-9 9"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
                Preview Public Page
              </a>
              {/* <span aria-hidden="true">|</span> */}
              {/* <a href="#">Edit Customization</a> */}
            </div>
          </section>

          {copyState === "copied" && (
            <p className="db-copy-toast hide-desktop">
              Link copied to clipboard!
            </p>
          )}

          {/* ---------- Desktop-only main stats row ---------- */}
          <div className="db-stats-row hide-mobile">
            {mainStats.map((stat) => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
              />
            ))}
          </div>

          {/* ---------- Mobile-only Quick Insights grid ---------- */}
          <section className="hide-desktop">
            <p className="db-section-label">Quick Insights</p>
            <div className="db-insights-grid">
              {QUICK_INSIGHTS.map((item) => (
                <StatCard
                  key={item.id}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                  trend={item.trend}
                  footnote=""
                  compact
                />
              ))}
            </div>
          </section>

          <TrendChart
            title="Recharge Trends"
            subtitle="Daily performance overview"
            rangeOptions={[
              { id: "week", label: "Week", data: trendDataWeek },
              { id: "month", label: "Month", data: TREND_DATA_MONTH },
            ]}
          />

          {/* ---------- Desktop-only Recent Recharges table ---------- */}
          <section className="db-table-card hide-mobile">
            <div className="db-table-card__header">
              <div>
                <h3 className="db-table-card__title">Recent Recharges</h3>
                <p className="db-table-card__subtitle">
                  Latest contributions to your balance
                </p>
              </div>
              <Link to="/transactions" className="db-table-card__view-all">
                View All Transactions
              </Link>
            </div>

            <div className="db-table__scroll">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Sponsor</th>
                    <th>Type</th>
                    <th>Amount/Value</th>
                    <th>Date &amp; Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecharges.map((txn) => (
                    <tr key={txn.id}>
                      <td>
                        <div className="db-table__sponsor">
                          <span
                            className="db-table__avatar"
                            style={{ background: avatarColor(txn.sponsor) }}
                          >
                            {txn.sponsor.charAt(0)}
                          </span>
                          {txn.sponsor}
                        </div>
                      </td>
                      <td>
                        <span className="db-table__type">
                          {TYPE_ICONS[txn.type]}
                          {txn.type}
                        </span>
                      </td>
                      <td className="db-table__amount">{txn.amount}</td>
                      <td className="db-table__time">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M12 7v5l3.5 2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        {new Date(txn.time).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <StatusPill status={txn.status} />
                      </td>
                    </tr>
                  ))}
                  {recentRecharges.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        No recharges yet — share your link to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---------- Mobile-only Recent Activity list ---------- */}
          <section className="hide-desktop">
            <div className="db-section-header-row">
              <p className="db-section-label">Recent Activity</p>
              <Link to="/transactions" className="db-view-all-link">
                View All
              </Link>
            </div>
            <div className="db-activity-list">
              {RECENT_ACTIVITY_MOBILE.map((item) => (
                <div key={item.id} className="db-activity-item">
                  <span className="db-activity-item__icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17 7L7 17M7 7v10h10"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="db-activity-item__main">
                    <p className="db-activity-item__sponsor">{item.sponsor}</p>
                    <p className="db-activity-item__meta">
                      {item.type} • {item.time}
                    </p>
                  </div>
                  <div className="db-activity-item__end">
                    <p className="db-activity-item__amount">{item.amount}</p>
                    <StatusPill status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ---------- Desktop-only right rail ---------- */}
        <aside className="db-rail hide-mobile">
          <div className="db-rail-card">
            <h3 className="db-rail-card__title">Link Activity</h3>
            <p className="db-rail-card__subtitle">Real-time link engagement</p>
            <div className="db-rail-stat">
              <span className="db-rail-stat__icon db-rail-stat__icon--primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M9 7h8v8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="db-rail-stat__value">
                  {linkActivity.totalClicks.toLocaleString()}
                </p>
                <p className="db-rail-stat__label">Total Clicks</p>
              </div>
            </div>
            <div className="db-rail-stat">
              <span className="db-rail-stat__icon db-rail-stat__icon--secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="6"
                    y="2"
                    width="12"
                    height="20"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  />
                </svg>
              </span>
              <div>
                <p className="db-rail-stat__value">
                  {linkActivity.isActive ? "Active" : "Paused"}
                </p>
                <p className="db-rail-stat__label">Link Status</p>
              </div>
            </div>
          </div>

          <div className="db-rail-card">
            <h3 className="db-rail-card__title">Quick Actions</h3>
            <p className="db-rail-card__subtitle">Boost your link visibility</p>
            <div className="db-quick-actions-grid">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="db-quick-action-tile"
                  onClick={
                    action.id === "qa-copy"
                      ? handleCopyLink
                      : action.id === "qa-qr"
                        ? () => setIsQrOpen(true)
                        : undefined
                  }
                >
                  <span className="db-quick-action-tile__icon">
                    {QUICK_ACTION_ICONS[action.icon]}
                  </span>
                  {action.id === "qa-copy" && copyState === "copied"
                    ? "Copied!"
                    : action.label}
                </button>
              ))}
            </div>

            <div className="db-profile-notice">
              <span className="db-profile-notice__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 12.5l2.5 2.5L16 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="db-profile-notice__title">
                  Your profile is {PROFILE_COMPLETENESS.percent}% complete
                </p>
                <p className="db-profile-notice__text">
                  {PROFILE_COMPLETENESS.message}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ---------- Desktop-only footer ---------- */}
      <footer className="db-footer hide-mobile">
        <p>
          &copy; {new Date().getFullYear()} Recharge4Me. All rights reserved.
        </p>
        <div className="db-footer__links">
          <Link to="/support">Support Center</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </footer>

      {isQrOpen && (
        <QrCodeModal
          url={getPublicLinkUrl(user?.username)}
          onClose={() => setIsQrOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
