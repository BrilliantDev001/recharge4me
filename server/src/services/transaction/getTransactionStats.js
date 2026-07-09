const Transaction = require("../../models/transaction.model");

const getTransactionStats = async (userId) => {
  const [totals, statusCounts] = await Promise.all([
    Transaction.aggregate([
      { $match: { recipient: userId, status: "success" } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$valueNaira" },
          count: { $sum: 1 },
        },
      },
    ]),
    Transaction.aggregate([
      { $match: { recipient: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const totalValue = totals[0]?.totalValue || 0;
  const successCount = totals[0]?.count || 0;

  const totalAll = statusCounts.reduce((sum, s) => sum + s.count, 0);
  const successRate =
    totalAll > 0 ? ((successCount / totalAll) * 100).toFixed(1) : "0.0";

  return {
    totalRecharges: `₦${totalValue.toLocaleString()}`,
    totalTransactions: totalAll,
    successRate: `${successRate}%`,
  };
};

module.exports = getTransactionStats;
