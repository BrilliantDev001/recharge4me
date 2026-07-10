const getTransactionStats = require("../../services/transaction/getTransactionStats");

const getTransactionStatsController = async (req, res) => {
  try {
    const result = await getTransactionStats(req.user._id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getTransactionStatsController;
