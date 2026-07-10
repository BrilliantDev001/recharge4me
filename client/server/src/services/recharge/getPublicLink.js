const User = require("../../models/user.model");
const RechargeLink = require("../../models/rechargeLink.model");

const getPublicLink = async (username) => {
  const user = await User.findOne({ username }).select(
    "name username phone profileMessage avatar isVerified",
  );

  if (!user) {
    throw new Error("This recharge link does not exist.");
  }

  const link = await RechargeLink.findOne({ user: user._id });

  if (!link || !link.isActive) {
    throw new Error("This recharge link is currently inactive.");
  }

  link.totalViews += 1;
  link.lastActivityAt = new Date();
  await link.save();

  return {
    fullName: user.name,
    username: user.username,
    phone: user.phone,
    profileMessage: user.profileMessage,
    avatar: user.avatar,
    isVerified: link.showVerification ? user.isVerified : false,
    allowDataBundles: link.allowDataBundles,
    allowAnonymousSponsors: link.allowAnonymousSponsors,
  };
};

module.exports = getPublicLink;
