// utils/weather.js

const axios = require("axios");
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeatherByCity(city) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                units: "metric",
                appid: API_KEY
            }
        });

        const data = response.data;

        return {
            city: data.name,
            temperature: `${Math.round(data.main.temp)} °C`,
            humidity: `${data.main.humidity}%`,
            wind: `${data.wind.speed} km/h`,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        };

    } catch (error) {
        console.error("Error fetching weather:", error.message);
        return null;
    }
}

module.exports = { getWeatherByCity };
