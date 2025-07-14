const express = require('express');
const router = express.Router();

// Import controllers
const {
    applyLeave,
    getLeaveApplications,
    getLeaveBalance
} = require('../../controllers/employee/leaveController');

/**
 * @route   POST /api/v1/employee/leaves/apply
 * @desc    Apply for leave
 * @access  Private
 */
router.post('/apply', applyLeave);

/**
 * @route   GET /api/v1/employee/leaves
 * @desc    Get leave applications
 * @access  Private
 */
router.get('/', getLeaveApplications);

/**
 * @route   GET /api/v1/employee/leaves/balance
 * @desc    Get leave balance
 * @access  Private
 */
router.get('/balance', getLeaveBalance);

module.exports = router; 