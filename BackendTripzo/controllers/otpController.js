// controllers/optController.js

const twilio = require("twilio");
const crypto = require("crypto");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

let otpStore = {}; 

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = crypto.randomInt(100000, 999999);

    otpStore[phone] = otp;
    await client.messages.create({
      body: `Your Tripzo OTP is ${otp}`,
      from: process.env.TWILIO_PHONE, 
      to: `+91${phone}`
    });

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send OTP", error: err.message });
  }
};

exports.verifyOtp = (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] && otpStore[phone].toString() === otp.toString()) {
    delete otpStore[phone]; 
    res.json({ msg: "OTP verified successfully" });
  } else {
    res.status(400).json({ msg: "Invalid or expired OTP" });
  }
};
