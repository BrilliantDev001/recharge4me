import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./AccountMenu.css";

function AccountMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="account-menu" ref={containerRef}>
      <button
        type="button"
        className="dashboard-topbar__avatar-btn"
        aria-label="Account menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="dashboard-topbar__avatar">
          {user?.name?.charAt(0)}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="account-menu__dropdown">
          <div className="account-menu__header">
            <p className="account-menu__name">{user?.name}</p>
            <p className="account-menu__email">{user?.email}</p>
          </div>
          <button
            type="button"
            className="account-menu__item"
            onClick={() => {
              setIsOpen(false);
              navigate("/settings");
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 13a7.7 7.7 0 000-2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 00-1.7-1L15 3h-6l-.4 2.6a7.6 7.6 0 00-1.7 1l-2.3-1-2 3.4L4.6 11a7.7 7.7 0 000 2l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 001.7 1L9 21h6l.4-2.6a7.6 7.6 0 001.7-1l2.3 1 2-3.4z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            Settings
          </button>
          <button
            type="button"
            className="account-menu__item account-menu__item--danger"
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountMenu;
