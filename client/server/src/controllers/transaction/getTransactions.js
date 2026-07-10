const getTransactions = require("../../services/transaction/getTransactions");

const getTransactionsController = async (req, res) => {
  try {
    const { type, status, search, page, limit } = req.query;
    const result = await getTransactions(req.user._id, {
      type,
      status,
      search,
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getTransactionsController;
