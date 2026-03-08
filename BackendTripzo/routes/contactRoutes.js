// routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware'); 
router.post('/', authMiddleware, contactController.createContact);

module.exports = router;