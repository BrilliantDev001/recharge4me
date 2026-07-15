const Notification = require("../../models/notification.model");
const User = require("../../models/user.model");
const { sendRechargeNotificationEmail } = require("../../utils/mailer");

const notifyRecharge = async (transaction) => {
  const user = await User.findById(transaction.recipient).select(
    "name email notificationPrefs",
  );

  if (!user) return; // shouldn't happen, but don't let a missing user crash payment processing

  const isSuccess = transaction.status === "success";

  const title = isSuccess
    ? "You've received a recharge!"
    : "Recharge delivery issue";

  const message = isSuccess
    ? `${transaction.sponsorName} sent you ₦${transaction.valueNaira.toLocaleString()} in ${transaction.network} ${transaction.type.toLowerCase()}.`
    : `A payment of ₦${transaction.valueNaira.toLocaleString()} was received, but delivery failed. Our team has been notified.`;

  await Notification.create({
    user: user._id,
    type: isSuccess ? "recharge_received" : "delivery_issue",
    title,
    message,
    relatedTransaction: transaction._id,
  });

  // Default to true if the user has no saved preference yet
  // (e.g. accounts created before this feature existed).
  const emailEnabled = user.notificationPrefs?.emailNotifications !== false;

  if (emailEnabled) {
    await sendRechargeNotificationEmail(user.email, user.name, {
      amount: transaction.valueNaira,
      network: transaction.network,
      type: transaction.type,
      status: transaction.status,
    });
  }
};

module.exports = notifyRecharge;
