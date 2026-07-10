const RechargeLink = require("../../models/rechargeLink.model");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");

const getOrCreateLink = async (userId) => {
  let link = await RechargeLink.findOne({ user: userId });

  if (!link) {
    link = await RechargeLink.create({ user: userId });
  }

  const user = await User.findById(userId).select("username");

  const [conversions, avgResult] = await Promise.all([
    Transaction.countDocuments({ recipient: userId, status: "success" }),
    Transaction.aggregate([
      { $match: { recipient: link.user, status: "success" } },
      { $group: { _id: null, avgValue: { $avg: "$valueNaira" } } },
    ]),
  ]);

  const avgRecharge = avgResult[0]?.avgValue || 0;

  return {
    linkUrl: `recharge4.me/${user.username}`,
    settings: {
      linkStatusEnabled: link.isActive,
      allowDataBundles: link.allowDataBundles,
      showVerification: link.showVerification,
      allowAnonymousSponsors: link.allowAnonymousSponsors,
      isLive: link.isActive,
    },
    stats: {
      totalClicks: link.totalViews,
      conversions,
      avgRecharge: Math.round(avgRecharge),
      lastActivity: link.lastActivityAt,
    },
  };
};

module.exports = { getOrCreateLink };
