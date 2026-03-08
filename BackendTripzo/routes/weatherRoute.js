// routes/weatherRoute.js
const express = require("express");
const router = express.Router();
const { getWeatherByCity } = require("../utils/weather");

router.get("/weather", async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    const weatherData = await getWeatherByCity(city);

    if (!weatherData) {
        return res.status(404).json({ error: "City not found or API error" });
    }

    res.json(weatherData);
});

module.exports = router;
