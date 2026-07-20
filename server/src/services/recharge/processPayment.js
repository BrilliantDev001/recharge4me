const Transaction = require("../../models/transaction.model");
const { verifyTransaction } = require("../../utils/paystack");
const { purchaseAirtime, purchaseData } = require("../../utils/vtpass");
const notifyRecharge = require("../notifications/createRechargeNotification");

const VTPASS_SUCCESS_CODE = "000";

/**
 * Given a Paystack reference, independently verifies the payment and,
 * if genuinely successful, triggers delivery (VTpass for Airtime;
 * Data is simulated for now — see note below).
 *
 * Idempotent: if this transaction has already moved past "pending",
 * it's returned as-is instead of being reprocessed. This matters
 * because Paystack webhooks can fire more than once for the same
 * event, and a sponsor might also land back on our callback URL —
 * we never want to charge/deliver twice for one payment.
 */
const processPaymentByReference = async (reference) => {
  const transaction = await Transaction.findOne({ reference });

  if (!transaction) {
    throw new Error("No transaction found for this reference.");
  }

  if (transaction.status !== "pending") {
    return transaction; // already processed — safe no-op
  }

  const paystackData = await verifyTransaction(reference);

  if (paystackData.status !== "success") {
    transaction.status = "payment_failed";
    await transaction.save();
    return transaction;
  }

  // Confirm the amount actually paid matches what we expected —
  // never trust the client or the webhook body for this figure.
  const amountPaidNaira = paystackData.amount / 100;
  if (amountPaidNaira !== transaction.valueNaira) {
    transaction.status = "payment_failed";
    await transaction.save();
    throw new Error(
      "Amount paid does not match the expected transaction amount.",
    );
  }

  transaction.status = "paid";
  transaction.paystackVerifiedAt = new Date();
  await transaction.save();

  if (transaction.type === "Airtime") {
    try {
      const { requestId, data } = await purchaseAirtime({
        network: transaction.network,
        phone: transaction.recipientPhone,
        amountNaira: transaction.valueNaira,
      });

      transaction.vtpassRequestId = requestId;
      transaction.vtpassStatus = data.code;

      if (data.code === VTPASS_SUCCESS_CODE) {
        transaction.status = "success";
        transaction.deliveredAt = new Date();
      } else {
        // Payment succeeded but VTpass couldn't deliver — money has
        // been collected, so this needs a manual refund/retry process,
        // not silent failure. Flagged clearly via status.
        transaction.status = "delivery_failed";
      }
    } catch (error) {
      transaction.status = "delivery_failed";
      transaction.vtpassStatus = error.message;
    }
  } else {
    try {
      const { requestId, data } = await purchaseData({
        network: transaction.network,
        phone: transaction.recipientPhone,
        variationCode: transaction.variationCode,
      });

      transaction.vtpassRequestId = requestId;
      transaction.vtpassStatus = data.code;

      if (data.code === VTPASS_SUCCESS_CODE) {
        transaction.status = "success";
        transaction.deliveredAt = new Date();
      } else {
        transaction.status = "delivery_failed";
      }
    } catch (error) {
      transaction.status = "delivery_failed";
      transaction.vtpassStatus = error.message;
    }
  }

  await transaction.save();

  // Notify the recipient regardless of outcome — they should know
  // either way. Wrapped so a notification/email hiccup never breaks
  // the actual payment/delivery result already saved above.
  try {
    await notifyRecharge(transaction);
  } catch (error) {
    console.error("Failed to send recharge notification:", error.message);
  }

  return transaction;
};

module.exports = processPaymentByReference;
