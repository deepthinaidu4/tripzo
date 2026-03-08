// models/Booking.js

const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tripDate: {
        type: Date,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    numberOfMembers: {
        type: Number,
        required: true,
        min: 1,
    },
    companions: {
        type: String,
        required: true,
        enum: ["single", "family", "friends"],
    },
        phoneNumber: {
        type: String,
        required: true, 
    },
        emergencyContact: {
        type: String,
        required: false,
    },
    flight: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        seatCount: { type: Number, required: true },
    },
    vehicle: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        passengerCount: { type: Number, required: true },
    },
    hotel: {
        name: { type: String, required: true },
        roomType: { type: String, required: true },
        price: { type: Number, required: true },
        nights: { type: Number, required: true },
    },
    price: { 
        totalPrice: { type: Number, required: true },
        flightPrice: { type: Number, required: true },
        vehiclePrice: { type: Number, required: true },
        hotelPrice: { type: Number, required: true }, 
        discounts: { type: Number, default: 0 }, 
        taxes: { type: Number, required: true },
        serviceCharges: { type: Number, required: true },
    },
    paymentMethod: { 
        type: String,
        enum: ['UPI', 'Net Banking', 'Card'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", BookingSchema);