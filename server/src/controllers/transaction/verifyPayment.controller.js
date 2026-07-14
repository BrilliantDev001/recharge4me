const processPaymentByReference = require("../../services/recharge/processPayment");

const verifyPaymentController = async (req, res) => {
  try {
    const { reference } = req.params;
    const transaction = await (await processPaymentByReference(reference)).populate("recipient", "name");

    res.status(200).json({
      reference: transaction.reference,
      status: transaction.status,
      amount: transaction.valueNaira,
      network: transaction.network,
      type: transaction.type,
      quantity: transaction.quantity,
      quantityUnit: transaction.quantityUnit,
      recipientName: transaction.recipient?.name,
      recipientPhone: transaction.recipientPhone,
      sponsorName: transaction.sponsorName,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = verifyPaymentController;
