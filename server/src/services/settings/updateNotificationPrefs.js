const User = require("../../models/user.model");

const updateNotificationPrefs = async (userId, prefs) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { notificationPrefs: prefs },
    { new: true, runValidators: true, upsert: false },
  ).select("-password");

  if (!user) throw new Error("User not found.");

  return user.notificationPrefs;
};

module.exports = updateNotificationPrefs;
