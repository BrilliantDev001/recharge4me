const crypto = require("crypto");
const User = require("../../models/user.model");
const RechargeLink = require("../../models/rechargeLink.model");
const Transaction = require("../../models/transaction.model");
const { initializeTransaction } = require("../../utils/paystack");

const MIN_RECHARGE_AMOUNT = 100;

const generateReference = () =>
  `R4M-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

const submitRecharge = async (username, payload) => {
  // NOTE: network is intentionally NOT accepted from the sponsor here —
  // it's determined entirely by the recipient's own stored profile, so
  // there's no picker to guess from and no way for a request to spoof
  // a different network than the recipient's real one.
  const { amount, type, sponsorName, sponsorMessage, isAnonymous } = payload;

  const numericAmount = Number(amount);

  if (!numericAmount || numericAmount < MIN_RECHARGE_AMOUNT) {
    throw new Error(`Minimum recharge amount is ₦${MIN_RECHARGE_AMOUNT}.`);
  }

  if (!["Airtime", "Data"].includes(type)) {
    throw new Error("Invalid recharge type.");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("This recharge link does not exist.");
  }

  if (!user.network) {
    throw new Error(
      "This user hasn't confirmed their network yet. Please check back shortly.",
    );
  }

  const link = await RechargeLink.findOneAndUpdate(
    { user: user._id },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  if (!link.isActive) {
    throw new Error("This recharge link is currently inactive.");
  }

  if (type === "Data" && !link.allowDataBundles) {
    throw new Error(
      "This user is not currently accepting data bundle recharges.",
    );
  }

  if (isAnonymous && !link.allowAnonymousSponsors) {
    throw new Error("This user requires sponsors to identify themselves.");
  }

  const reference = generateReference();

  const transaction = await Transaction.create({
    recipient: user._id,
    sponsorName: isAnonymous
      ? "Anonymous Sponsor"
      : sponsorName || "Anonymous Sponsor",
    isAnonymous: Boolean(isAnonymous),
    sponsorMessage: sponsorMessage?.slice(0, 200) || "",
    recipientPhone: user.phone,
    type,
    network: user.network,
    quantity: numericAmount,
    quantityUnit: "NGN",
    valueNaira: numericAmount,
    status: "pending",
    reference,
  });

  const placeholderEmail = `sponsor+${reference}@example.com`;

  const { authorization_url } = await initializeTransaction({
    email: placeholderEmail,
    amountNaira: numericAmount,
    reference,
    callbackUrl: `${process.env.CLIENT_URL}/payment-success?reference=${reference}`,
  });

  return {
    reference: transaction.reference,
    authorizationUrl: authorization_url,
  };
};

module.exports = submitRecharge;
