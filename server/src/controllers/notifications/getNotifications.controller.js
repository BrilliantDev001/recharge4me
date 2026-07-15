const getNotifications = require("../../services/notifications/getNotifications");

const getNotificationsController = async (req, res) => {
  try {
    const result = await getNotifications(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getNotificationsController;
