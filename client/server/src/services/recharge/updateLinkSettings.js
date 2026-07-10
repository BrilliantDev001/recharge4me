const RechargeLink = require("../../models/rechargeLink.model");

const ALLOWED_FIELDS = [
  "linkStatusEnabled",
  "allowDataBundles",
  "showVerification",
  "allowAnonymousSponsors",
];

// Maps frontend toggle keys -> schema field names
const FIELD_MAP = {
  linkStatusEnabled: "isActive",
  allowDataBundles: "allowDataBundles",
  showVerification: "showVerification",
  allowAnonymousSponsors: "allowAnonymousSponsors",
};

const updateLinkSettings = async (userId, updates) => {
  const link = await RechargeLink.findOne({ user: userId });

  if (!link) {
    throw new Error("Recharge link not found for this user.");
  }

  for (const key of Object.keys(updates)) {
    if (ALLOWED_FIELDS.includes(key)) {
      link[FIELD_MAP[key]] = Boolean(updates[key]);
    }
  }

  await link.save();

  return {
    linkStatusEnabled: link.isActive,
    allowDataBundles: link.allowDataBundles,
    showVerification: link.showVerification,
    allowAnonymousSponsors: link.allowAnonymousSponsors,
    isLive: link.isActive,
  };
};

module.exports = updateLinkSettings;
