// utils/distance.js

const axios = require("axios");
const MAPQUEST_API_KEY = process.env.MAPQUEST_API_KEY;

/**
 * Get distance between two places using MapQuest API
 * @param {string} origin - starting place (e.g., "Hyderabad, India")
 * @param {string} destination - ending place (e.g., "Paris, France")
 * @returns {Promise<number>} distance in kilometers
 */
async function getDistance(origin, destination) {
    try {
        if (!MAPQUEST_API_KEY) {
            console.error("MAPQUEST_API_KEY is not set in the environment variables.");
            return -1;
        }
        
        const url = `https://www.mapquestapi.com/directions/v2/route?key=${MAPQUEST_API_KEY}&from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&unit=k`;

        const response = await axios.get(url);

        if (response.data && response.data.route && response.data.route.distance) {
            return response.data.route.distance;
        } else {
            console.error("MapQuest API unable to route:", response.data.info.messages[0]);
            return -1; 
        }
    } catch (error) {
        console.error("Error fetching distance from MapQuest:", error.message);
        return -1;
    }
}

module.exports = { getDistance };