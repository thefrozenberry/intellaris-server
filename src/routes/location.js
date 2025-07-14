const express = require('express');
const router = express.Router();
const { getUserLocation, geocodeAddress } = require('../controllers/locationController');

// Get user location (provides API key for frontend)
router.get('/', getUserLocation);

// Geocode an address to coordinates
router.post('/geocode', geocodeAddress);

module.exports = router; 