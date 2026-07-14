const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const getTransactionsController = require("../controllers/transaction/getTransactions");
const getTransactionStatsController = require("../controllers/transaction/getTransactionStats");
const verifyPaymentController = require("../controllers/transaction/verifyPayment.controller");

// Protected — dashboard-side
router.get("/", protect, getTransactionsController);
router.get("/stats", protect, getTransactionStatsController);

// Public — sponsor's Payment Success page calls this as a fallback/
// primary check, since webhooks can't reach localhost during dev
router.get("/verify/:reference", verifyPaymentController);

module.exports = router;
