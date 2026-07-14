const Transaction = require("../../models/transaction.model");
const { verifyTransaction } = require("../../utils/paystack");
const { purchaseAirtime } = require("../../utils/vtpass");

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
    // Data bundles: deferred, as discussed — VTpass needs a specific
    // variation_code per bundle, which needs a frontend bundle-picker
    // we haven't built yet. Payment is real; delivery is simulated.
    transaction.status = "success";
    transaction.vtpassStatus = "simulated-data-not-yet-integrated";
    transaction.deliveredAt = new Date();
  }

  await transaction.save();
  return transaction;
};

module.exports = processPaymentByReference;
