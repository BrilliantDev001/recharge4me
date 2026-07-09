const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const getDashboardDataController = require("../controllers/dashboard/getDashboardData");

router.get("/", protect, getDashboardDataController);

module.exports = router;
