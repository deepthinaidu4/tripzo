// controllers/contactController.js

const Contact = require('../models/Contact'); 

exports.createContact = async (req, res) => {
    try {

        const userId = req.user.id;
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ msg: "Please fill all required fields." });
        }

        const newContact = new Contact({
            user: userId, 
            name,
            email,
            message,
        });

        await newContact.save();

        res.status(201).json({ msg: "Thank you! Your message has been sent.", contact: newContact });

    } catch (err) {
        console.error("Error creating contact:", err);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};