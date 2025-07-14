const express = require('express');
const router = express.Router();
const investmentEmailController = require('../controllers/investmentEmailController');

// No authentication required
router.post('/send-investment-email', investmentEmailController.sendInvestmentEmail);

module.exports = router; 