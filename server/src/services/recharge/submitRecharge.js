const crypto = require("crypto");
const User = require("../../models/user.model");
const RechargeLink = require("../../models/rechargeLink.model");
const Transaction = require("../../models/transaction.model");

const MIN_RECHARGE_AMOUNT = 100;

const generateReference = () =>
  `R4M-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

const submitRecharge = async (username, payload) => {
  const { amount, network, type, sponsorName, isAnonymous } = payload;

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

  const link = await RechargeLink.findOne({ user: user._id });
  if (!link || !link.isActive) {
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

  // NOTE: payment gateway + telco delivery are stubbed for MVP — simulated
  // as an instant success. Swap this block for a real charge + delivery
  // call later; everything downstream (record, receipt) stays the same.
  const status = "success";

  const transaction = await Transaction.create({
    recipient: user._id,
    sponsorName: isAnonymous
      ? "Anonymous Sponsor"
      : sponsorName || "Anonymous Sponsor",
    isAnonymous: Boolean(isAnonymous),
    recipientPhone: user.phone,
    type,
    network,
    quantity: numericAmount,
    quantityUnit: "NGN",
    valueNaira: numericAmount,
    status,
    reference: generateReference(),
  });

  link.lastActivityAt = new Date();
  await link.save();

  return {
    reference: transaction.reference,
    status: transaction.status,
    amount: transaction.valueNaira,
    network: transaction.network,
    type: transaction.type,
    recipientName: user.name,
    date: transaction.createdAt,
  };
};

module.exports = submitRecharge;
