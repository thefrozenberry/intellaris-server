const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { LeaveApplication, LeaveBalance } = require('../../models/employee/Leave');

/**
 * @desc    Apply for leave
 * @route   POST /api/v1/employee/leaves/apply
 * @access  Private
 */
const applyLeave = [
    body('type').isIn(['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave', 'Emergency Leave', 'Casual Leave']).withMessage('Invalid leave type'),
    body('fromDate').isISO8601().withMessage('Invalid from date'),
    body('toDate').isISO8601().withMessage('Invalid to date'),
    body('reason').isLength({ min: 10, max: 500 }).withMessage('Reason must be between 10 and 500 characters'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        try {
            const employeeId = req.employee.id;
            const { type, fromDate, toDate, reason, isHalfDay, halfDaySession } = req.body;

            // Check for overlapping leaves
            const hasOverlap = await LeaveApplication.checkLeaveOverlap(employeeId, fromDate, toDate);
            
            if (hasOverlap) {
                return res.status(400).json({
                    success: false,
                    error: 'LEAVE_OVERLAP',
                    message: 'You already have leave applied for overlapping dates'
                });
            }

            // Create leave application
            const leaveApplication = new LeaveApplication({
                employeeId,
                type,
                fromDate: new Date(fromDate),
                toDate: new Date(toDate),
                reason,
                isHalfDay: isHalfDay || false,
                halfDaySession
            });

            await leaveApplication.save();

            res.status(201).json({
                success: true,
                data: {
                    leaveApplication: {
                        id: leaveApplication.id,
                        type: leaveApplication.type,
                        fromDate: leaveApplication.fromDate,
                        toDate: leaveApplication.toDate,
                        days: leaveApplication.days,
                        status: leaveApplication.status,
                        appliedDate: leaveApplication.appliedDate
                    }
                },
                message: 'Leave application submitted successfully'
            });

        } catch (error) {
            console.error('Apply leave error:', error);
            res.status(500).json({
                success: false,
                error: 'LEAVE_APPLICATION_FAILED',
                message: 'Failed to submit leave application'
            });
        }
    })
];

/**
 * @desc    Get leave applications
 * @route   GET /api/v1/employee/leaves
 * @access  Private
 */
const getLeaveApplications = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { status, type, year, page = 1, limit = 10 } = req.query;

        const filters = {};
        if (status && status !== 'all') filters.status = status;
        if (type && type !== 'all') filters.type = type;
        if (year) filters.year = year;

        const result = await LeaveApplication.getEmployeeLeaves(employeeId, filters, parseInt(page), parseInt(limit));

        res.json({
            success: true,
            data: {
                applications: result.applications,
                pagination: result.pagination
            },
            message: 'Leave applications retrieved successfully'
        });

    } catch (error) {
        console.error('Get leave applications error:', error);
        res.status(500).json({
            success: false,
            error: 'LEAVE_FETCH_FAILED',
            message: 'Failed to retrieve leave applications'
        });
    }
});

/**
 * @desc    Get leave balance
 * @route   GET /api/v1/employee/leaves/balance
 * @access  Private
 */
const getLeaveBalance = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const balance = await LeaveBalance.getOrCreateBalance(employeeId);

        res.json({
            success: true,
            data: {
                balance: {
                    leaveYear: balance.leaveYear,
                    totalAnnualLeave: balance.totalAnnualLeave,
                    usedAnnualLeave: balance.usedAnnualLeave,
                    remainingAnnualLeave: balance.remainingAnnualLeave,
                    totalSickLeave: balance.totalSickLeave,
                    usedSickLeave: balance.usedSickLeave,
                    remainingSickLeave: balance.remainingSickLeave,
                    totalPersonalLeave: balance.totalPersonalLeave,
                    usedPersonalLeave: balance.usedPersonalLeave,
                    remainingPersonalLeave: balance.remainingPersonalLeave,
                    carryForwardLeave: balance.carryForwardLeave,
                    compOffLeave: balance.compOffLeave
                }
            },
            message: 'Leave balance retrieved successfully'
        });

    } catch (error) {
        console.error('Get leave balance error:', error);
        res.status(500).json({
            success: false,
            error: 'LEAVE_BALANCE_FAILED',
            message: 'Failed to retrieve leave balance'
        });
    }
});

module.exports = {
    applyLeave,
    getLeaveApplications,
    getLeaveBalance
}; 