const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sponsorName: { type: String, default: "Anonymous Sponsor", trim: true },
    isAnonymous: { type: Boolean, default: false },
    sponsorMessage: { type: String, default: "", trim: true, maxlength: 200 },
    variationCode: { type: String, default: null }, // Data bundles only
    variationLabel: { type: String, default: null }, // e.g. "N1000 1.5GB - 30 days"
    recipientPhone: { type: String, required: true },
    type: { type: String, enum: ["Airtime", "Data"], required: true },
    network: {
      type: String,
      enum: ["MTN", "Airtel", "Glo", "9mobile"],
      required: true,
    },
    quantity: { type: Number, required: true },
    quantityUnit: { type: String, enum: ["NGN", "GB"], required: true },
    valueNaira: { type: Number, required: true },

    // Overall status shown to the user.
    // pending -> payment_failed
    // pending -> paid -> success
    // pending -> paid -> delivery_failed (money collected, VTpass delivery failed)
    status: {
      type: String,
      enum: ["pending", "paid", "success", "payment_failed", "delivery_failed"],
      default: "pending",
    },

    reference: { type: String, required: true, unique: true },

    // ---------- Payment leg (Paystack) ----------
    paystackVerifiedAt: { type: Date, default: null },

    // ---------- Delivery leg (VTpass) ----------
    vtpassRequestId: { type: String, default: null },
    vtpassStatus: { type: String, default: null }, // raw status VTpass returns
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
