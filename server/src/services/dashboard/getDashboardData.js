const Transaction = require("../../models/transaction.model");
const RechargeLink = require("../../models/rechargeLink.model");

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDashboardData = async (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [totals, airtimeCount, dataVolume, weekCount, recent, link, trendRaw] =
    await Promise.all([
      Transaction.aggregate([
        { $match: { recipient: userId, status: "success" } },
        { $group: { _id: null, totalValue: { $sum: "$valueNaira" } } },
      ]),
      Transaction.countDocuments({
        recipient: userId,
        status: "success",
        type: "Airtime",
      }),
      Transaction.aggregate([
        { $match: { recipient: userId, status: "success", type: "Data" } },
        { $group: { _id: null, totalGB: { $sum: "$quantity" } } },
      ]),
      Transaction.countDocuments({
        recipient: userId,
        status: "success",
        createdAt: { $gte: sevenDaysAgo },
      }),
      Transaction.find({ recipient: userId }).sort({ createdAt: -1 }).limit(5),
      RechargeLink.findOne({ user: userId }),
      Transaction.aggregate([
        {
          $match: {
            recipient: userId,
            status: "success",
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            value: { $sum: "$valueNaira" },
          },
        },
      ]),
    ]);

  const totalValueReceived = totals[0]?.totalValue || 0;
  const totalDataGB = dataVolume[0]?.totalGB || 0;

  const trendMap = new Map(trendRaw.map((t) => [t._id, t.value]));
  const trendDataWeek = DAY_LABELS.map((label, index) => ({
    label,
    value: trendMap.get(index + 1) || 0,
  }));

  const recentRecharges = recent.map((txn) => ({
    id: txn._id,
    sponsor: txn.isAnonymous ? "Unknown Sponsor" : txn.sponsorName,
    type: txn.type,
    amount:
      txn.quantityUnit === "GB"
        ? `${txn.quantity}GB`
        : `₦${txn.quantity.toLocaleString()}.00`,
    time: txn.createdAt,
    status: txn.status,
  }));

  return {
    heroStats: {
      newRechargesThisWeek: weekCount,
      totalAvailableCredit: totalValueReceived,
    },
    mainStats: [
      {
        id: "stat-value",
        label: "Total Value Received",
        value: `₦${totalValueReceived.toLocaleString()}`,
        icon: "trending-up",
      },
      {
        id: "stat-airtime",
        label: "Airtime Recharges",
        value: `${airtimeCount} Units`,
        icon: "mobile",
      },
      {
        id: "stat-data",
        label: "Data Volume",
        value: `${totalDataGB} GB`,
        icon: "database",
      },
    ],
    linkActivity: {
      totalClicks: link?.totalViews || 0,
      isActive: link?.isActive ?? true,
    },
    recentRecharges,
    trendDataWeek,
  };
};

module.exports = getDashboardData;
