const crypto = require("crypto");
const processPaymentByReference = require("../../services/recharge/processPayment");

const paystackWebhookController = async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const rawBody = req.body; // Buffer — this route uses express.raw(), not express.json()

    const expectedSignature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      // Don't process, but still respond 200 — no need to reveal
      // validation details to whoever/whatever sent this.
      return res.sendStatus(200);
    }

    const event = JSON.parse(rawBody.toString("utf8"));

    if (event.event === "charge.success") {
      await processPaymentByReference(event.data.reference);
    }

    // Acknowledge quickly. Paystack retries on non-200 responses,
    // which could cause repeat processing — processPaymentByReference
    // is idempotent so retries are harmless regardless, but there's
    // no reason to invite extra ones.
    res.sendStatus(200);
  } catch (error) {
    console.error("Paystack webhook error:", error.message);
    res.sendStatus(200); // still 200 — logged server-side, avoid retry storms
  }
};

module.exports = paystackWebhookController;
