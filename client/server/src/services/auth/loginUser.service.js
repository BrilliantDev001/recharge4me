// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../../models/user.model");

// const loginUser = async (loginData) => {
//     const { email, password } = loginData;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required to login." });
//     }

//   const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({message: "Invalid email or password."})
//     // throw new Error("Invalid email or password.");
//   }

//   const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     // throw new Error("Invalid email or password.");
//   }

//   const token = jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_EXPIRES_IN,
//     },
//   );

//   return {
//     message: "Login successful",
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       username: user.username,
//       email: user.email,
//       phone: user.phone,
//     },
//   };
// };

// module.exports = loginUser;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

const loginUser = async (loginData) => {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new Error("Email and password are required to login.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  return {
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      linkUrl: `recharge4.me/${user.username}`,
    },
  };
};

module.exports = loginUser;