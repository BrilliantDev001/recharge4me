const axios = require("axios");

const paystackClient = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

/**
 * Starts a Paystack transaction and returns a hosted checkout URL.
 * amountNaira is converted to kobo here — Paystack only accepts kobo.
 */
async function initializeTransaction({
  email,
  amountNaira,
  reference,
  callbackUrl,
}) {
  try {
    const response = await paystackClient.post("/transaction/initialize", {
      email,
      amount: Math.round(amountNaira * 100),
      reference,
      callback_url: callbackUrl,
    });

    return response.data.data; // { authorization_url, access_code, reference }
  } catch (error) {
    const paystackMessage = error.response?.data?.message;
    throw new Error(
      paystackMessage || "Failed to initialize payment with Paystack.",
    );
  }
}

/**
 * Independently confirms a transaction with Paystack directly —
 * never trust a webhook payload or a browser redirect alone.
 */
async function verifyTransaction(reference) {
  try {
    const response = await paystackClient.get(`/transaction/verify/${reference}`);
    return response.data.data; // { status, amount, reference, ... }
  } catch (error) {
    const paystackMessage = error.response?.data?.message;
    throw new Error(paystackMessage || "Failed to verify payment with Paystack.");
  }
}

module.exports = { initializeTransaction, verifyTransaction };
