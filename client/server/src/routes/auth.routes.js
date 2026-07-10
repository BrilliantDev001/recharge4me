const express = require("express");

const router = express.Router();

const registerUser = require("../controllers/auth/registerUser.controller");
const loginUser = require("../controllers/auth/loginUser.controller");

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
