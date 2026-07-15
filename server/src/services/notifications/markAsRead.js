const Notification = require("../../models/notification.model");

const markAsRead = async (userId, notificationId) => {
  if (notificationId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw new Error("Notification not found.");
    }

    return notification;
  }

  // No specific ID provided — mark everything as read ("Mark all as read").
  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true },
  );
  return { message: "All notifications marked as read." };
};

module.exports = markAsRead;
