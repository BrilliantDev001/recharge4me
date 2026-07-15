import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar.jsx";
import BottomTabBar from "../BottomTabBar/BottomTabBar.jsx";
import NotificationBell from "../../common/NotificationBell/NotificationBell.jsx";
import AccountMenu from "../../common/AccountMenu/AccountMenu.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./DashboardLayout.css";

/**
 * activeNavItem / activeTab: which Sidebar/BottomTabBar entry to
 * highlight for the current page.
 * mobileLabel: text shown in the mobile top bar.
 * showMobileBackArrow: the Dashboard home shows the logo (no back
 * arrow, nothing to go back to); sub-pages like Recharge Link show
 * a back arrow to Dashboard instead of the logo, matching how each
 * mockup's mobile top bar actually differs.
 */
function DashboardLayout({
  children,
  activeNavItem = "dashboard",
  activeTab = "home",
  mobileLabel = "Dashboard",
  showMobileBackArrow = false,
}) {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <Sidebar activeItem={activeNavItem} />

      <div className="dashboard-layout__main">
        {/* ---------- MOBILE TOP BAR ---------- */}
        <header className="dashboard-topbar-mobile hide-desktop">
          {showMobileBackArrow ? (
            <Link
              to="/dashboard"
              className="dashboard-topbar-mobile__back"
              aria-label="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="dashboard-topbar-mobile__logo"
              aria-label="Recharge4Me home"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L3 14H11L10 22L21 9H13L13 2Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          )}
          <span className="dashboard-topbar-mobile__label">{mobileLabel}</span>
          <span
            className="dashboard-topbar-mobile__spacer"
            aria-hidden="true"
          />
        </header>

        {/* ---------- DESKTOP TOP BAR ---------- */}
        <header className="dashboard-topbar hide-mobile">
          <div className="dashboard-topbar__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M21 21l-4-4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <input type="text" placeholder="Search transactions, sponsors…" />
          </div>

          <div className="dashboard-topbar__actions">
            <NotificationBell />
            <AccountMenu />
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>

      <BottomTabBar activeTab={activeTab} />
    </div>
  );
}

export default DashboardLayout;
