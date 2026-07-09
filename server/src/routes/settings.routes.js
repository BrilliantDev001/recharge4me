const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const getProfileController = require("../controllers/settings/getProfile");
const updateProfileController = require("../controllers/settings/updateProfile");
const updateNotificationPrefsController = require("../controllers/settings/updateNotificationPrefs");

router.get("/profile", protect, getProfileController);
router.patch("/profile", protect, updateProfileController);
router.patch("/notifications", protect, updateNotificationPrefsController);

module.exports = router;
