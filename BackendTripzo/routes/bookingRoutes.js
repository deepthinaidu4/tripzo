// routes/bookingRoutes.js

const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");  

router.post("/calculate-price", bookingController.calculatePrice);
// router.get("/emergency-details", authMiddleware, bookingController.getEmergencyDetails);
router.post("/", authMiddleware, bookingController.createBooking);

router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    console.log("📌 /my-bookings hit");
    console.log("User from token:", req.user);

    const bookings = await Booking.find({ userId: req.user.id });
    console.log("Bookings found:", bookings);

    if (!bookings.length) {
      return res.json({ success: true, bookings: [] });
    }

    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;