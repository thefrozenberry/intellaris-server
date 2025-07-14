const express = require('express');
const router = express.Router();

// Import controllers
const {
    getDashboardData
} = require('../../controllers/employee/dashboardController');

/**
 * @route   GET /api/v1/employee/dashboard
 * @desc    Get dashboard data
 * @access  Private
 */
router.get('/', getDashboardData);

module.exports = router; 