const updateNotificationPrefs = require("../../services/settings/updateNotificationPrefs");

const updateNotificationPrefsController = async (req, res) => {
  try {
    const prefs = await updateNotificationPrefs(req.user._id, req.body);

    res
      .status(200)
      .json({ message: "Notification preferences updated.", prefs });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = updateNotificationPrefsController;
