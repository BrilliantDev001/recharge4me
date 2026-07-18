const User = require("../../models/user.model");
const RechargeLink = require("../../models/rechargeLink.model");
const { detectNetworkFromPhone } = require("../../utils/detectNetwork");

const getPublicLink = async (username) => {
  const user = await User.findOne({ username }).select(
    "phone profileMessage avatar isVerified network",
  );

  if (!user) {
    throw new Error("This recharge link does not exist.");
  }

  // Backfill for accounts created before network detection existed.
  if (!user.network) {
    user.network = detectNetworkFromPhone(user.phone);
    await user.save();
  }

  const link = await RechargeLink.findOneAndUpdate(
    { user: user._id },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  if (!link.isActive) {
    throw new Error("This recharge link is currently inactive.");
  }

  return {
    profileMessage: user.profileMessage,
    avatar: user.avatar,
    isVerified: link.showVerification ? user.isVerified : false,
    network: user.network,
    allowDataBundles: link.allowDataBundles,
    allowAnonymousSponsors: link.allowAnonymousSponsors,
  };
};

module.exports = getPublicLink;
