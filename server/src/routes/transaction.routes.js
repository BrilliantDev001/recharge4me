const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const getTransactionsController = require("../controllers/transaction/getTransactions");
const getTransactionStatsController = require("../controllers/transaction/getTransactionStats");

router.get("/", protect, getTransactionsController);
router.get("/stats", protect, getTransactionStatsController);

module.exports = router;
