// models/Hotel.js

const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    destination: { 
        type: String,
        ref: "Trip",
        required: true,
    },
    roomType: {
        type: String,
        enum: ["double bed", "triple bed", "family suite"], 
        required: true,
    },
    pricePerNight: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Hotel", HotelSchema);