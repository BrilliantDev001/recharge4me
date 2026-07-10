import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./Sidebar.css";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    to: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="13"
          y="3"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="3"
          y="13"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="13"
          y="13"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
        />
      </svg>
    ),
  },
  {
    id: "recharge-link",
    label: "Recharge Link",
    to: "/recharge-link",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 15l6-6M8 12l-2 2a3.5 3.5 0 004.9 4.9l2-2M16 12l2-2a3.5 3.5 0 00-4.9-4.9l-2 2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "transactions",
    label: "Transactions",
    to: "/transactions",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M12 7v5l3.5 2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    to: "/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function Sidebar({ activeItem = "dashboard" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" fill="currentColor" />
          </svg>
        </span>
        <div>
          <p className="sidebar__brand-name">Recharge4Me</p>
          <p className="sidebar__brand-tag">Premium SaaS</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Dashboard">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`sidebar__nav-item ${isActive ? "sidebar__nav-item--active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={(e) => {
                // Screens not yet built stay inert rather than 404ing.
                if (item.to === "#") e.preventDefault();
              }}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              {item.label}
              {isActive && (
                <span className="sidebar__nav-dot" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        {/*
          WHY both a profile row and an account-level card appear
          here: two different mockups showed two different sidebar
          footers (one a user identity row, the other a plan/billing
          card) for what is really the same persistent sidebar.
          Stacking both keeps every piece of real information from
          each mockup rather than discarding one.
        */}
        <div className="sidebar__profile-row">
          <span className="sidebar__profile-avatar">
            {user?.name?.charAt(0) || "?"}
          </span>
          <div className="sidebar__profile-text">
            <p className="sidebar__profile-name">{user?.name}</p>
            <p className="sidebar__profile-email">{user?.email}</p>
          </div>
          <span className="sidebar__profile-online" aria-hidden="true" />
        </div>

        <div className="sidebar__account-card">
          <span className="sidebar__account-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20V10M12 20V4M20 20v-7"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {/* <p className="sidebar__account-label">Account Level</p>
          <p className="sidebar__account-plan">Pro Plan Active</p>
          <button type="button" className="sidebar__billing-btn">
            View Billing
          </button> */}
        </div>

        <button
          type="button"
          className="sidebar__logout"
          onClick={handleLogout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
