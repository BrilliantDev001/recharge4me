const express = require("express");

const router = express.Router();

const submitSupportRequestController = require("../controllers/support/submitSupportRequest.controller");

router.post("/", submitSupportRequestController);

module.exports = router;
