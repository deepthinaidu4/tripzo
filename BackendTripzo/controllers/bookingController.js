// controllers/bookingController.js

const Trip = require("../models/Trip");
const Hotel = require("../models/Hotel");
const User = require("../models/User");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");

const CONVERSION_RATE_USD_TO_INR = 83.5;
const SERVICE_CHARGE_INR = 500;
const TAX_RATE = 0.1; // 10% tax

const convertToINR = (priceUSD) => priceUSD * CONVERSION_RATE_USD_TO_INR;

// =============================================
// Function to Calculate and Return Trip Price
// =============================================
exports.calculatePrice = async (req, res) => {
    try {
        const {
            origin,
            destination,
            numberOfMembers,
            selectedFlight,
            selectedVehicle,
            selectedHotel,
            nights,
        } = req.body;

        if (!origin || !destination || !numberOfMembers || !selectedFlight || !selectedVehicle || !selectedHotel || !nights) {
            console.error("Missing required fields in calculatePrice request:", req.body);
            return res.status(400).json({ message: "Missing required booking details." });
        }
        
        console.log(`Received request to calculate price for:
            Origin: ${origin}
            Destination: ${destination}
            Number of Members: ${numberOfMembers}
            Selected Flight: ${selectedFlight}
            Selected Vehicle: ${selectedVehicle}
            Selected Hotel: ${selectedHotel}
            Nights: ${nights}`);

        // REMOVE the distance calculation line
        // const distanceKm = await getDistance(origin, destination);
        // console.log(`Distance between ${origin} and ${destination}: ${distanceKm.toFixed(2)} km`);

        const trip = await Trip.findOne({ destination });
        const hotel = await Hotel.findOne({ _id: new mongoose.Types.ObjectId(selectedHotel) });
        
        if (!trip || !hotel) {
            return res.status(404).json({ message: "Trip or Hotel not found." });
        }
        
        const flightOption = trip.flights.find(f => f.name === selectedFlight);
        const vehicleOption = trip.vehicles.find(v => v.name === selectedVehicle);

        if (!flightOption || !vehicleOption) {
            return res.status(404).json({ message: "Selected flight or vehicle not found for this trip." });
        }

        const baseFlightPriceUSD = flightOption.price;
        const baseHotelPriceUSD = hotel.pricePerNight; 
        const baseVehiclePriceUSD = vehicleOption.price; 

        const totalFlightPriceUSD = baseFlightPriceUSD * numberOfMembers;
        const totalHotelPriceUSD = baseHotelPriceUSD * nights * numberOfMembers; 
        const totalVehiclePriceUSD = baseVehiclePriceUSD * nights; 

        const totalBeforeDiscountsUSD = totalFlightPriceUSD + totalHotelPriceUSD + totalVehiclePriceUSD;
        
        let discountUSD = 0;
        let discountAppliedType = "None"; 
        if (trip.offer && trip.offer > 0) {
            discountUSD = totalBeforeDiscountsUSD * (trip.offer / 100);
            discountAppliedType = `${trip.offer}% Trip Offer`;
        } else if (totalBeforeDiscountsUSD > 1500) { 
            discountUSD = totalBeforeDiscountsUSD * 0.10;
            discountAppliedType = "10% Price-based Offer";
        }
        
        const finalPriceUSD = totalBeforeDiscountsUSD - discountUSD;
        const taxesUSD = finalPriceUSD * TAX_RATE;
        const finalPriceINR = convertToINR(finalPriceUSD) + SERVICE_CHARGE_INR + convertToINR(taxesUSD);
        const flightPriceINR = convertToINR(totalFlightPriceUSD);
        const hotelPriceINR = convertToINR(totalHotelPriceUSD);
        const vehiclePriceINR = convertToINR(totalVehiclePriceUSD);
        const discountINR = convertToINR(discountUSD);
        const taxesINR = convertToINR(taxesUSD);

        res.status(200).json({
            success: true,
            breakdown: {
                totalPrice: finalPriceINR,
                flightPrice: flightPriceINR,
                hotelPrice: hotelPriceINR,
                vehiclePrice: vehiclePriceINR,
                discounts: discountINR,
                taxes: taxesINR,
                serviceCharges: SERVICE_CHARGE_INR,
            },
        });

    } catch (err) {
        console.error("Error calculating price:", err);
        res.status(500).json({
            message: "Server error occurred while calculating price.",
            error: err.message
        });
    }
};

// =============================================
// Function to Create the Final Booking
// =============================================
exports.createBooking = async (req, res) => {
    try {
        const {
            tripDate,
            destination,
            numberOfMembers,
            companions,
            selectedFlight,
            selectedVehicle,
            selectedHotel,
            nights,
            origin,
            phoneNumber,
            emergencyContact,
            paymentMethod,
        } = req.body;
        
        if (!origin || !destination || !numberOfMembers || !selectedFlight || !selectedVehicle || !selectedHotel || !nights || !phoneNumber || !paymentMethod) {
            console.error("Missing required fields in createBooking request:", req.body);
            return res.status(400).json({ message: "Missing required booking details." });
        }
        
        const userId = req.user ? new mongoose.Types.ObjectId(req.user.id) : new mongoose.Types.ObjectId();
        const user = req.user ? await User.findById(userId).select('name') : { name: "Guest" };

        const tripDetails = await Trip.findOne({ destination });
        const hotelDetails = await Hotel.findOne({ _id: new mongoose.Types.ObjectId(selectedHotel) });

        if (!tripDetails || !hotelDetails) {
            return res.status(404).json({ message: "Trip or Hotel details not found." });
        }

        const flightOption = tripDetails.flights.find(f => f.name === selectedFlight);
        const vehicleOption = tripDetails.vehicles.find(v => v.name === selectedVehicle);

        if (!flightOption || !vehicleOption) {
            return res.status(404).json({ message: "Selected flight or vehicle not found for this trip." });
        }
        
        const baseFlightPriceUSD = flightOption.price;
        const baseHotelPriceUSD = hotelDetails.pricePerNight;
        const baseVehiclePriceUSD = vehicleOption.price;
        
        const totalFlightPriceUSD = baseFlightPriceUSD * numberOfMembers;
        const totalHotelPriceUSD = baseHotelPriceUSD * nights * numberOfMembers;
        const totalVehiclePriceUSD = baseVehiclePriceUSD * nights;
        const totalBeforeDiscountsUSD = totalFlightPriceUSD + totalHotelPriceUSD + totalVehiclePriceUSD;
        
        let discountUSD = 0;
        if (tripDetails.offer && tripDetails.offer > 0) {
            discountUSD = totalBeforeDiscountsUSD * (tripDetails.offer / 100);
        } else if (totalBeforeDiscountsUSD > 2000) {
            discountUSD = totalBeforeDiscountsUSD * 0.10;
        }

        const finalPriceUSD = totalBeforeDiscountsUSD - discountUSD;
        const taxesUSD = finalPriceUSD * TAX_RATE;

        const finalPriceINR = convertToINR(finalPriceUSD) + SERVICE_CHARGE_INR + convertToINR(taxesUSD);
        
        const bookingPrice = {
            totalPrice: finalPriceINR,
            flightPrice: convertToINR(totalFlightPriceUSD),
            hotelPrice: convertToINR(totalHotelPriceUSD),
            vehiclePrice: convertToINR(totalVehiclePriceUSD),
            discounts: convertToINR(discountUSD),
            taxes: convertToINR(taxesUSD),
            serviceCharges: SERVICE_CHARGE_INR,
        };

        const newBooking = new Booking({
            userId,
            tripDate,
            destination,
            numberOfMembers,
            companions,
            phoneNumber,
            emergencyContact,
            origin, 
            flight: { 
                name: selectedFlight, 
                price: bookingPrice.flightPrice,
                seatCount: numberOfMembers
            },
            vehicle: { 
                name: selectedVehicle, 
                price: bookingPrice.vehiclePrice,
                passengerCount: numberOfMembers
            },
            hotel: { name: hotelDetails.name, roomType: hotelDetails.roomType, price: bookingPrice.hotelPrice, nights },
            price: bookingPrice,
            paymentMethod: paymentMethod, 
            status: "confirmed",
        });
        await newBooking.save();

        res.status(201).json({
            message: `🎉 Booking for ${user.name} to ${destination} confirmed!`,
            bookingId: newBooking._id,
            booking: newBooking,
        });

    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ 
            message: "Server error occurred while creating booking.",
            error: err.message 
        });
    }
};

// =============================================
// Get All Bookings for Logged-In User
// =============================================
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found for this user." });
        }

        res.status(200).json({
            success: true,
            bookings
        });

    } catch (err) {
        console.error("Error fetching user bookings:", err);
        res.status(500).json({
            message: "Server error occurred while fetching bookings.",
            error: err.message
        });
    }
};

