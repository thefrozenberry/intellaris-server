const express = require('express');
const router = express.Router();
const businessEmailSetupController = require('../controllers/businessEmailSetupController');

// Business email setup route
router.post('/send-business-email-setup', businessEmailSetupController.sendBusinessEmailSetup);

module.exports = router; 