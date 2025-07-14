const express = require('express');
const router = express.Router();

// Import controllers
const {
    getPayslips,
    getLatestPayslip
} = require('../../controllers/employee/payslipController');

/**
 * @route   GET /api/v1/employee/payslips
 * @desc    Get employee payslips
 * @access  Private
 */
router.get('/', getPayslips);

/**
 * @route   GET /api/v1/employee/payslips/latest
 * @desc    Get latest payslip
 * @access  Private
 */
router.get('/latest', getLatestPayslip);

module.exports = router; 