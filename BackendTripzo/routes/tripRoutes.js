// routes/tripRoutes.js

const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.get("/", tripController.getAllTrips);
router.get("/:destination", tripController.getTripDetails);

module.exports = router;