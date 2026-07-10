const User = require("../../models/user.model");
const { hashToken } = require("../../utils/generateToken");

const verifyEmail = async (rawToken) => {
  if (!rawToken) {
    throw new Error("Verification token is required.");
  }

  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    throw new Error("This verification link is invalid or has expired.");
  }

  user.isVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  return {
    message: "Email verified successfully!",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    },
  };
};

module.exports = verifyEmail;