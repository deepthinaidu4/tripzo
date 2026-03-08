// models/Trip.js

const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }, 
});

const VehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }, 
});

const TripSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    continent:{
        type: String,
        required: true,
        trim: true,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    description: String,
    imageUrl: String,
    flights: [FlightSchema], 
    vehicles: [VehicleSchema], 
    offer: { 
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Trip", TripSchema);