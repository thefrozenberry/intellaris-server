const asyncHandler = require('express-async-handler');
const Payslip = require('../../models/employee/Payslip');

/**
 * @desc    Get employee payslips
 * @route   GET /api/v1/employee/payslips
 * @access  Private
 */
const getPayslips = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { year, month, status, page = 1, limit = 10 } = req.query;

        const filters = {};
        if (year) filters.year = year;
        if (month) filters.month = month;
        if (status && status !== 'all') filters.status = status;

        const result = await Payslip.getEmployeePayslips(employeeId, filters, parseInt(page), parseInt(limit));

        res.json({
            success: true,
            data: {
                payslips: result.payslips,
                pagination: result.pagination
            },
            message: 'Payslips retrieved successfully'
        });

    } catch (error) {
        console.error('Get payslips error:', error);
        res.status(500).json({
            success: false,
            error: 'PAYSLIPS_FETCH_FAILED',
            message: 'Failed to retrieve payslips'
        });
    }
});

/**
 * @desc    Get latest payslip
 * @route   GET /api/v1/employee/payslips/latest
 * @access  Private
 */
const getLatestPayslip = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const payslip = await Payslip.getLatestPayslip(employeeId);

        if (!payslip) {
            return res.status(404).json({
                success: false,
                error: 'NO_PAYSLIP_FOUND',
                message: 'No payslip found for this employee'
            });
        }

        res.json({
            success: true,
            data: { payslip },
            message: 'Latest payslip retrieved successfully'
        });

    } catch (error) {
        console.error('Get latest payslip error:', error);
        res.status(500).json({
            success: false,
            error: 'PAYSLIP_FETCH_FAILED',
            message: 'Failed to retrieve latest payslip'
        });
    }
});

module.exports = {
    getPayslips,
    getLatestPayslip
}; 