const express = require('express');
const router = express.Router();

// Import controllers
const {
    getExpenses,
    getExpenseSummary
} = require('../../controllers/employee/expenseController');

/**
 * @route   GET /api/v1/employee/expenses
 * @desc    Get employee expenses
 * @access  Private
 */
router.get('/', getExpenses);

/**
 * @route   GET /api/v1/employee/expenses/summary
 * @desc    Get expense summary
 * @access  Private
 */
router.get('/summary', getExpenseSummary);

module.exports = router; 