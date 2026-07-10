const express = require("express");

const router = express.Router();

const registerUser = require("../controllers/auth/registerUser.controller");
const loginUser = require("../controllers/auth/loginUser.controller");
const verifyEmail = require("../controllers/auth/verifyEmail.controller");
const resendVerification = require("../controllers/auth/resendVerification.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

module.exports = router;
