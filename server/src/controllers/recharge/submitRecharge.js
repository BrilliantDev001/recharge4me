const submitRecharge = require("../../services/recharge/submitRecharge");

const submitRechargeController = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await submitRecharge(username, req.body);

    res.status(200).json({ message: "Redirecting to payment...", ...result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = submitRechargeController;
