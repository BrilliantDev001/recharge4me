const crypto = require("crypto");
const User = require("../../models/user.model");
const RechargeLink = require("../../models/rechargeLink.model");
const Transaction = require("../../models/transaction.model");
const { initializeTransaction } = require("../../utils/paystack");
const { getDataVariations } = require("../../utils/vtpass");

const MIN_RECHARGE_AMOUNT = 100;

const generateReference = () =>
  `R4M-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

const submitRecharge = async (username, payload) => {
  const {
    amount,
    type,
    variationCode,
    sponsorName,
    sponsorMessage,
    isAnonymous,
  } = payload;

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

  if (isAnonymous && !link.allowAnonymousSponsors) {
    throw new Error("This user requires sponsors to identify themselves.");
  }

  let finalAmount;
  let variationLabel = null;

  if (type === "Data") {
    if (!link.allowDataBundles) {
      throw new Error(
        "This user is not currently accepting data bundle recharges.",
      );
    }
    if (!variationCode) {
      throw new Error("Please select a data bundle.");
    }

    // Authoritative price lookup — never trust a price the client
    // sends for a data bundle, same principle as everything else
    // we've built. The variationCode must genuinely exist for this
    // user's real network, and its real current price is what gets
    // charged, not whatever the request claims.
    const availableBundles = await getDataVariations(user.network);
    const matchedBundle = availableBundles.find(
      (b) => b.code === variationCode,
    );

    if (!matchedBundle) {
      throw new Error(
        "That data bundle is no longer available. Please pick another.",
      );
    }

    finalAmount = matchedBundle.price;
    variationLabel = matchedBundle.label;
  } else {
    finalAmount = Number(amount);
    if (!finalAmount || finalAmount < MIN_RECHARGE_AMOUNT) {
      throw new Error(`Minimum recharge amount is ₦${MIN_RECHARGE_AMOUNT}.`);
    }
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
    quantity: finalAmount,
    quantityUnit: "NGN",
    valueNaira: finalAmount,
    variationCode: type === "Data" ? variationCode : null,
    variationLabel,
    status: "pending",
    reference,
  });

  const placeholderEmail = `sponsor+${reference}@example.com`;

  const { authorization_url } = await initializeTransaction({
    email: placeholderEmail,
    amountNaira: finalAmount,
    reference,
    callbackUrl: `${process.env.CLIENT_URL}/payment-success?reference=${reference}`,
  });

  return {
    reference: transaction.reference,
    authorizationUrl: authorization_url,
  };
};

module.exports = submitRecharge;
