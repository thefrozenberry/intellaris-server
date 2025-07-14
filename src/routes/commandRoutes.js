const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController');
const { authenticateToken } = require('../middlewares/auth');

// Execute command endpoint
router.post('/execute', authenticateToken, commandController.executeCommand);

module.exports = router; 