import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../../api/client.js";
import "./NotificationBell.css";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef(null);

  const loadNotifications = () => {
    getNotifications()
      .then((data) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen) loadNotifications(); // refresh on open
    setIsOpen((prev) => !prev);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      markNotificationRead(notification._id).catch(() => {});
    }
    setIsOpen(false);
    navigate("/transactions");
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    markAllNotificationsRead().catch(() => {});
  };

  return (
    <div className="notif-bell" ref={containerRef}>
      <button
        type="button"
        className="dashboard-topbar__icon-btn"
        aria-label="Notifications"
        onClick={handleToggle}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M10 20a2 2 0 004 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="dashboard-topbar__notif-dot" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="notif-bell__dropdown">
          <div className="notif-bell__header">
            <p className="notif-bell__title">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-bell__mark-all"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notif-bell__list">
            {notifications.length === 0 && (
              <p className="notif-bell__empty">
                You don't have any notifications yet.
              </p>
            )}
            {notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                className={`notif-bell__item ${notification.isRead ? "" : "notif-bell__item--unread"}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <span className="notif-bell__item-dot" aria-hidden="true" />
                <span className="notif-bell__item-text">
                  <span className="notif-bell__item-title">
                    {notification.title}
                  </span>
                  <span className="notif-bell__item-message">
                    {notification.message}
                  </span>
                  <span className="notif-bell__item-time">
                    {timeAgo(notification.createdAt)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
