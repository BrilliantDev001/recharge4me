const getDashboardData = require("../../services/dashboard/getDashboardData");

const getDashboardDataController = async (req, res) => {
  try {
    const result = await getDashboardData(req.user._id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getDashboardDataController;
