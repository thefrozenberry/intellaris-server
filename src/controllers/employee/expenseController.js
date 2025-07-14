const asyncHandler = require('express-async-handler');
const Expense = require('../../models/employee/Expense');

/**
 * @desc    Get employee expenses
 * @route   GET /api/v1/employee/expenses
 * @access  Private
 */
const getExpenses = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { status, category, page = 1, limit = 10 } = req.query;

        const filters = {};
        if (status && status !== 'all') filters.status = status;
        if (category && category !== 'all') filters.category = category;

        const result = await Expense.getEmployeeExpenses(employeeId, filters, parseInt(page), parseInt(limit));

        res.json({
            success: true,
            data: {
                expenses: result.expenses,
                pagination: result.pagination
            },
            message: 'Expenses retrieved successfully'
        });

    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({
            success: false,
            error: 'EXPENSES_FETCH_FAILED',
            message: 'Failed to retrieve expenses'
        });
    }
});

/**
 * @desc    Get expense summary
 * @route   GET /api/v1/employee/expenses/summary
 * @access  Private
 */
const getExpenseSummary = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { timeframe = 'thisMonth' } = req.query;

        const summary = await Expense.getExpenseSummary(employeeId, timeframe);

        res.json({
            success: true,
            data: { summary },
            message: 'Expense summary retrieved successfully'
        });

    } catch (error) {
        console.error('Get expense summary error:', error);
        res.status(500).json({
            success: false,
            error: 'EXPENSE_SUMMARY_FAILED',
            message: 'Failed to retrieve expense summary'
        });
    }
});

module.exports = {
    getExpenses,
    getExpenseSummary
}; 