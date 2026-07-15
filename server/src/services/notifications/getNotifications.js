const Notification = require("../../models/notification.model");

const getNotifications = async (userId) => {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(30),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return { notifications, unreadCount };
};

module.exports = getNotifications;
