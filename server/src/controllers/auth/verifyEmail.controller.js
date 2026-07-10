
const verifyEmail = require("../../services/auth/verifyEmail.service");

const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await verifyEmail(token);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = verifyEmailController;