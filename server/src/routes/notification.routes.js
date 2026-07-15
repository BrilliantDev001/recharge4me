const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const getNotificationsController = require("../controllers/notifications/getNotifications.controller");
const markAsReadController = require("../controllers/notifications/markAsRead.controller");

router.get("/", protect, getNotificationsController);
router.patch("/:id/read", protect, markAsReadController);

module.exports = router;
