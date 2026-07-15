const markAsRead = require("../../services/notifications/markAsRead");

const markAsReadController = async (req, res) => {
  try {
    const { id } = req.params; // "all" or a specific notification ID
    const result = await markAsRead(req.user._id, id === "all" ? null : id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = markAsReadController;
