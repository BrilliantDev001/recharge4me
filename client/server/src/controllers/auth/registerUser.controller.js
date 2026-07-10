const { registerUser } = require("../../services/auth/registerUser.service");

const registerUserController = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = registerUserController;

