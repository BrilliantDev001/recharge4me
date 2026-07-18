const submitSupportRequest = require("../../services/support/submitSupportRequest");

const submitSupportRequestController = async (req, res) => {
  try {
    const result = await submitSupportRequest(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = submitSupportRequestController;
