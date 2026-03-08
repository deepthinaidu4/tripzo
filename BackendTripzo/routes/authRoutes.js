// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/request-otp", authController.requestOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;