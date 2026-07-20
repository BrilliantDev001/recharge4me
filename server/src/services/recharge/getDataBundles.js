const User = require("../../models/user.model");
const RechargeLink = require("../../models/rechargeLink.model");
const { getDataVariations } = require("../../utils/vtpass");
const { detectNetworkFromPhone } = require("../../utils/detectNetwork");

const getDataBundles = async (username) => {
  const user = await User.findOne({ username }).select("phone network");

  if (!user) {
    throw new Error("This recharge link does not exist.");
  }

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

  if (!link.allowDataBundles) {
    throw new Error(
      "This user is not currently accepting data bundle recharges.",
    );
  }

  const bundles = await getDataVariations(user.network);

  // Sort cheapest first — much easier for a sponsor to scan.
  return bundles.sort((a, b) => a.price - b.price);
};

module.exports = getDataBundles;
