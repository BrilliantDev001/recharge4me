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
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    reference: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
