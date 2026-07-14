const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const { generateVerificationToken } = require("../../utils/generateToken");
const { sendVerificationEmail } = require("../../utils/mailer");

const NIGERIAN_PHONE_REGEX = /^(0|\+234)[789][01]\d{8}$/;

// const registerUser = async (userData) => {
//   const { name, username, email, phone, password } = userData;

  const registerUser = async (registerData) => {
  const { name, username, email, phone, password } = registerData;

  if (!NIGERIAN_PHONE_REGEX.test(phone)) {
    throw new Error("Please enter a valid Nigerian phone number (e.g. 08011111111).");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new Error("Username is already taken");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error("Already have an account, please login");
  }

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new Error("Phone number already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    email,
    phone,
    password: hashedPassword,
  });

  const { rawToken, hashedToken, expiresAt } = generateVerificationToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expiresAt;
  await user.save();

  await sendVerificationEmail(user.email, user.name, rawToken);

  return {
    message: "User registered successfully! Please check your email to verify your account.",
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
  };
};

module.exports = registerUser;
