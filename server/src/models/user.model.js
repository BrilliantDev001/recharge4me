const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    profileMessage: { type: String, default: "Thanks for supporting me" },
    avatar: { type: String, default: "/images/default-avatar.png" },
    isVerified: { type: Boolean, default: false, },
    emailVerificationToken: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    rechargeLink: { isActive: { type: Boolean, default: true } },
    notificationPrefs: {
      pushNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
