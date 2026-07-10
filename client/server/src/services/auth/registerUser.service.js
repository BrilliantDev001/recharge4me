const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

const registerUser = async (userData) => {
  const { name, username, email, phone, password } = userData;

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

  return {
    message: "User registered successfully!",
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
  };

  return {
    message: "service reached successfully",
  };
};

module.exports = registerUser;

