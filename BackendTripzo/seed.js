// seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trip = require('./models/Trip');
const Hotel = require('./models/Hotel');

dotenv.config();

const tripData = [
    {
        destination: "Maldives",
        continent:"Asia",
        basePrice: 500, 
        description: "Crystal-clear waters and luxury resorts.",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        flights: [
            { name: "Air India", price: 200 }, 
            { name: "Emirates", price: 250 }, 
        ],
        vehicles: [
            { name: "Sedan", price: 20 }, 
            { name: "Mini Van", price: 30 }, 
        ],
        offer: 30,
    },
    {
        destination: "Paris, France",
        continent:"Europe",
        basePrice: 300, 
        description: "Romantic city of lights and culture.",
        imageUrl: "images/paris.jpg",
        flights: [
            { name: "Air France", price: 250 }, 
            { name: "Lufthansa", price: 300 }, 
        ],
        vehicles: [
            { name: "Sedan", price: 15 }, 
            { name: "Mini Bus", price: 25 },
        ],
        offer: 25,
    },
    {
        destination: "Bali, Indonesia",
        continent:"Asia",
        basePrice: 250, 
        description: "Beaches, temples, and peaceful scenery.",
        imageUrl: "https://www.turismoasiatico.com/wp-content/uploads/2020/04/UlunDanuBratanTemploBALIAdobeStock_323680669-2048x1367.jpeg", 
        flights: [
            { name: "Singapore Airlines", price: 150 }, 
            { name: "Thai Airways", price: 180 },
        ],
        vehicles: [
            { name: "Scooter", price: 5 }, 
            { name: "Mini Van", price: 20 }, 
        ],
        offer: 30, 
    },
    {
        destination: "Tokyo, Japan",
        continent:"Asia",
        basePrice: 400, 
        description: "Modern vibes and ancient traditions.",
        imageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
        flights: [
            { name: "Japan Airlines", price: 350 }, 
            { name: "Cathay Pacific", price: 400 },
        ],
        vehicles: [
            { name: "Sedan", price: 25 }, 
            { name: "Mini Van", price: 35 }, 
        ],
        offer: 0,
    },
    {
        destination: "New York City, USA",
        continent:"America",
        basePrice: 350, 
        description: "The city that never sleeps.",
        imageUrl: "images/city.jpg",
        flights: [
            { name: "Delta", price: 300 }, 
            { name: "United Airlines", price: 350 }, 
        ],
        vehicles: [
            { name: "Taxi", price: 20 }, 
            { name: "SUV", price: 40 }, 
        ],
        offer: 15, 
    },
    {
        destination: "Rome, Italy",
        continent:"Europe",
        basePrice: 280, 
        description: "History, architecture, and pizza!",
        imageUrl: "images/rome italy.avif",
        flights: [
            { name: "Alitalia", price: 200 },
            { name: "KLM", price: 250 }, 
        ],
        vehicles: [
            { name: "Sedan", price: 15 }, 
            { name: "Mini Bus", price: 25 },
        ],
        offer: 30,
    },
    {
        destination: "Dubai, UAE",
        continent:"Asia",
        basePrice: 380, 
        description: "Luxury, skyscrapers, and desert safaris.",
        imageUrl: "images/dubai pic.webp",
        flights: [
            { name: "Emirates", price: 280 }, 
            { name: "Flydubai", price: 250 }, 
        ],
        vehicles: [
            { name: "Sedan", price: 20 }, 
            { name: "SUV", price: 35 },
        ],
        offer: 0,
    },
    {
        destination: "Barcelona, Spain",
        continent:"Europe",
        basePrice: 260, 
        description: "Beaches, art, and tapas culture.",
        imageUrl: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
        flights: [
            { name: "Iberia", price: 210 }, 
            { name: "Vueling", price: 190 }, 
        ],
        vehicles: [
            { name: "Sedan", price: 15 }, 
            { name: "Mini Bus", price: 25 },
        ],
        offer: 0,
    },
    {
        destination: "Reykjavik, Iceland",
        continent:"Europe",
        basePrice: 450, 
        description: "Northern lights and wild landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
        flights: [
            { name: "Icelandair", price: 320 },
            { name: "SAS", price: 350 }, 
        ],
        vehicles: [
            { name: "SUV", price: 40 }, 
            { name: "Jeep", price: 55 }, 
        ],
        offer: 0,
    }
];

const hotelData = [
    {
        name: "Maldives Paradise Resort",
        destination: "Maldives",
        roomType: "double bed",
        pricePerNight: 70, 
    },
    {
        name: "Maldives Family Fun Hotel",
        destination: "Maldives",
        roomType: "family suite",
        pricePerNight: 120, 
    },
    {
        name: "Hotel de Ville",
        destination: "Paris, France",
        roomType: "double bed",
        pricePerNight: 50,
    },
    {
        name: "The Grand Paris Inn",
        destination: "Paris, France",
        roomType: "triple bed",
        pricePerNight: 80,
    },
    {
        name: "Bali Serenity Villa",
        destination: "Bali, Indonesia",
        roomType: "double bed",
        pricePerNight: 40,
    },
    {
        name: "Bali Jungle Lodge",
        destination: "Bali, Indonesia",
        roomType: "family suite",
        pricePerNight: 90,
    },
    {
        name: "Tokyo Plaza",
        destination: "Tokyo, Japan",
        roomType: "double bed",
        pricePerNight: 60, 
    },
    {
        name: "Imperial Hotel Tokyo",
        destination: "Tokyo, Japan",
        roomType: "family suite",
        pricePerNight: 110, 
    },
    {
        name: "New York Central Hotel",
        destination: "New York City, USA",
        roomType: "double bed",
        pricePerNight: 90, 
    },
    {
        name: "The Grand Hyatt",
        destination: "New York City, USA",
        roomType: "family suite",
        pricePerNight: 200,
    },
    {
        name: "Rome Colosseum Inn",
        destination: "Rome, Italy",
        roomType: "double bed",
        pricePerNight: 45, 
    },
    {
        name: "The Roman Family Getaway",
        destination: "Rome, Italy",
        roomType: "triple bed",
        pricePerNight: 80, 
    },
    {
        name: "Dubai Oasis Hotel",
        destination: "Dubai, UAE",
        roomType: "double bed",
        pricePerNight: 70,
    },
    {
        name: "The Burj View Suites",
        destination: "Dubai, UAE",
        roomType: "family suite",
        pricePerNight: 150,
    },
    {
        name: "Barcelona Beachside Stay",
        destination: "Barcelona, Spain",
        roomType: "double bed",
        pricePerNight: 55, 
    },
    {
        name: "Gaudi's Paradise Apartments",
        destination: "Barcelona, Spain",
        roomType: "family suite",
        pricePerNight: 110, 
    },
    {
        name: "Reykjavik Aurora Lodge",
        destination: "Reykjavik, Iceland",
        roomType: "double bed",
        pricePerNight: 80, 
    },
    {
        name: "The Icelandic Hideout",
        destination: "Reykjavik, Iceland",
        roomType: "triple bed",
        pricePerNight: 130, 
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected for seeding.");

        await Trip.deleteMany({});
        await Hotel.deleteMany({});
        console.log("Database cleared.");

        await Trip.insertMany(tripData);
        await Hotel.insertMany(hotelData);
        console.log("✅ Trip and Hotel data successfully seeded!");

        await mongoose.connection.close();
        console.log("✅ Connection closed.");
        
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();