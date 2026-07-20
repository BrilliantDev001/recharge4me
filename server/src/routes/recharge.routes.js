const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const getMyLinkController = require("../controllers/recharge/createLink");
const updateLinkSettingsController = require("../controllers/recharge/updateLinkSettings");
const getPublicLinkController = require("../controllers/recharge/getPublicLink");
const submitRechargeController = require("../controllers/recharge/submitRecharge");
const getDataBundlesController = require("../controllers/recharge/getDataBundles");

// Protected — dashboard-side link management
router.get("/me", protect, getMyLinkController);
router.patch("/settings", protect, updateLinkSettingsController);

// Public — sponsor-facing page
router.get("/public/:username", getPublicLinkController);
router.get("/public/:username/data-bundles", getDataBundlesController);
router.post("/public/:username/submit", submitRechargeController);

module.exports = router;
