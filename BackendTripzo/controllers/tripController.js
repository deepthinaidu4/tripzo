// controllers/tripController.js

const Trip = require("../models/Trip");
const Hotel = require("../models/Hotel"); 

exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find({});
        res.status(200).json(trips);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getTripDetails = async (req, res) => {
    try {
        const { destination } = req.params;
        const trip = await Trip.findOne({ destination });
        const hotels = await Hotel.find({ destination });
        
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        
        res.status(200).json({ trip, hotels });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};