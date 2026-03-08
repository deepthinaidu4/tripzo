// routes/distanceRoute.js
const express = require("express");
const router = express.Router();
const { getDistance } = require("../utils/distance");

router.get("/distance", async (req, res) => {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        return res.status(400).json({ error: "Origin and destination are required" });
    }

    try {
        const distanceKm = await getDistance(origin, destination);
        res.json({
            origin,
            destination,
            distanceKm: distanceKm.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching distance" });
    }
});

module.exports = router;
