
const User = require("../../models/user.model");
const { generateVerificationToken } = require("../../utils/generateToken");
const { sendVerificationEmail } = require("../../utils/mailer");

const resendVerification = async (email) => {
  if (!email) {
    throw new Error("Email is required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("No account found with that email address.");
  }

  if (user.isVerified) {
    throw new Error("This account is already verified. Please log in.");
  }

  const { rawToken, hashedToken, expiresAt } = generateVerificationToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expiresAt;
  await user.save();

  await sendVerificationEmail(user.email, user.name, rawToken);

  return { message: "Verification email resent. Please check your inbox." };
};

module.exports = resendVerification;