// server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

// --- Debug environment (optional) ---
console.log("=== ENVIRONMENT DEBUG ===");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("========================");

// Routes
const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const tripRoutes = require("./routes/tripRoutes");
const distanceRoute = require("./routes/distanceRoute");
const weatherRoute = require("./routes/weatherRoute");
const chatRoute = require("./routes/chatRoute");
const contactRoute = require("./routes/contactRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../FrontendTripzo")));
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});
app.use(cors());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api", weatherRoute);
app.use("/api", distanceRoute);
app.use("/api/chat", chatRoute);
app.use("/api/contacts", contactRoute);

// Root check
app.get("/", (req, res) => {
  res.json({
    message: "Tripzo Backend API is running 🚀",
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

// Hello test
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Tripzo API 👋" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// --- Database Connection ---
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};
connectDB();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log(`⛅ Try: http://localhost:${PORT}/api/weather?city=Paris`);
});

// --- Graceful Shutdown ---
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM, shutting down");
  server.close(() => console.log("✅ Process terminated"));
});
process.on("SIGINT", () => {
  console.log("👋 SIGINT, shutting down");
  server.close(() => console.log("✅ Process terminated"));
});
