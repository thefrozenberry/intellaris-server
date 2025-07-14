const axios = require('axios');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get user's current location (lat, lng) using Google Maps API
 * @route   GET /api/location
 * @access  Public
 */
const getUserLocation = asyncHandler(async (req, res) => {
  // Google Maps API key from environment variables
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    res.status(500);
    throw new Error('Google Maps API key is not configured');
  }

  // Return the API key to be used on the frontend
  // The actual geolocation will be performed on the client side
  // This is more secure than trying to get location on the server
  res.status(200).json({ 
    success: true,
    apiKey: apiKey,
    message: 'Use this API key with Google Maps JavaScript API on the frontend to get user location'
  });
});

/**
 * @desc    Geocode an address to coordinates
 * @route   POST /api/location/geocode
 * @access  Public
 */
const geocodeAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;
  
  if (!address) {
    res.status(400);
    throw new Error('Address is required');
  }
  
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    res.status(500);
    throw new Error('Google Maps API key is not configured');
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: apiKey
      }
    });

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      res.status(200).json({
        success: true,
        location: location,
        formattedAddress: response.data.results[0].formatted_address
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Geocoding failed with status: ${response.data.status}`
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(`Geocoding error: ${error.message}`);
  }
});

module.exports = {
  getUserLocation,
  geocodeAddress
}; 