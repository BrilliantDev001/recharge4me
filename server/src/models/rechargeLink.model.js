const mongoose = require("mongoose");

const rechargeLinkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, },
    isActive: { type: Boolean, default: true },
    allowDataBundles: { type: Boolean, default: true },
    showVerification: { type: Boolean, default: true },
    allowAnonymousSponsors: { type: Boolean, default: true },
    totalViews: { type: Number, default: 0 },
    lastActivityAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RechargeLink", rechargeLinkSchema);
