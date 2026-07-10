const resendVerification = require("../../services/auth/resendVerification.service");

const resendVerificationController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await resendVerification(email);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = resendVerificationController;
