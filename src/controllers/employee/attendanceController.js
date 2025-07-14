const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Attendance = require('../../models/employee/Attendance');

/**
 * @desc    Check in employee
 * @route   POST /api/v1/employee/attendance/checkin
 * @access  Private
 */
const checkIn = [
    body('location').optional().isLength({ max: 255 }).withMessage('Location must not exceed 255 characters'),
    body('workMode').optional().isIn(['WFO', 'WFH', 'Hybrid']).withMessage('Invalid work mode'),

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
            const { location, coordinates, workMode, deviceInfo } = req.body;
            const employeeId = req.employee.id;
            const ipAddress = req.ip;

            const attendance = await Attendance.checkIn(
                employeeId,
                location,
                coordinates,
                workMode,
                ipAddress,
                deviceInfo
            );

            res.status(201).json({
                success: true,
                data: {
                    attendance: {
                        id: attendance._id,
                        date: attendance.formattedDate,
                        checkIn: attendance.checkIn,
                        status: attendance.status,
                        workingHours: attendance.formattedWorkingHours,
                        isPresent: attendance.isPresent
                    }
                },
                message: 'Checked in successfully'
            });

        } catch (error) {
            console.error('Check-in error:', error);
            
            if (error.message === 'Already checked in for today') {
                return res.status(400).json({
                    success: false,
                    error: 'ALREADY_CHECKED_IN',
                    message: 'You have already checked in for today'
                });
            }

            res.status(500).json({
                success: false,
                error: 'CHECKIN_FAILED',
                message: 'Failed to check in. Please try again.'
            });
        }
    })
];

/**
 * @desc    Check out employee
 * @route   POST /api/v1/employee/attendance/checkout
 * @access  Private
 */
const checkOut = [
    body('location').optional().isLength({ max: 255 }).withMessage('Location must not exceed 255 characters'),

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
            const { location, coordinates, deviceInfo } = req.body;
            const employeeId = req.employee.id;
            const ipAddress = req.ip;

            const attendance = await Attendance.checkOut(
                employeeId,
                location,
                coordinates,
                ipAddress,
                deviceInfo
            );

            res.json({
                success: true,
                data: {
                    attendance: {
                        id: attendance._id,
                        date: attendance.formattedDate,
                        checkIn: attendance.checkIn,
                        checkOut: attendance.checkOut,
                        status: attendance.status,
                        workingHours: attendance.formattedWorkingHours,
                        breakTime: attendance.formattedBreakTime,
                        totalHours: Math.floor(attendance.totalHours / 60) + 'h ' + (attendance.totalHours % 60) + 'm',
                        overtimeHours: attendance.overtimeHours || 0
                    }
                },
                message: 'Checked out successfully'
            });

        } catch (error) {
            console.error('Check-out error:', error);
            
            if (error.message === 'Must check in before checking out') {
                return res.status(400).json({
                    success: false,
                    error: 'NOT_CHECKED_IN',
                    message: 'You must check in before checking out'
                });
            }

            if (error.message === 'Already checked out for today') {
                return res.status(400).json({
                    success: false,
                    error: 'ALREADY_CHECKED_OUT',
                    message: 'You have already checked out for today'
                });
            }

            res.status(500).json({
                success: false,
                error: 'CHECKOUT_FAILED',
                message: 'Failed to check out. Please try again.'
            });
        }
    })
];

/**
 * @desc    Start break
 * @route   POST /api/v1/employee/attendance/break/start
 * @access  Private
 */
const startBreak = [
    body('type').optional().isIn(['Lunch', 'Tea', 'Personal', 'Meeting', 'Other']).withMessage('Invalid break type'),
    body('description').optional().isLength({ max: 255 }).withMessage('Description must not exceed 255 characters'),

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
            const { type, description } = req.body;
            const employeeId = req.employee.id;

            const attendance = await Attendance.getTodayAttendance(employeeId);

            if (!attendance || !attendance.checkIn?.time) {
                return res.status(400).json({
                    success: false,
                    error: 'NOT_CHECKED_IN',
                    message: 'You must check in before starting a break'
                });
            }

            const breakEntry = attendance.startBreak(type, description);
            await attendance.save();

            res.json({
                success: true,
                data: {
                    break: {
                        id: breakEntry._id,
                        type: breakEntry.type,
                        startTime: breakEntry.startTime,
                        description: breakEntry.description
                    },
                    attendance: {
                        isOnBreak: attendance.isOnBreak,
                        currentBreakStart: attendance.currentBreakStart
                    }
                },
                message: 'Break started successfully'
            });

        } catch (error) {
            console.error('Start break error:', error);
            
            if (error.message === 'Already on break') {
                return res.status(400).json({
                    success: false,
                    error: 'ALREADY_ON_BREAK',
                    message: 'You are already on a break'
                });
            }

            res.status(500).json({
                success: false,
                error: 'START_BREAK_FAILED',
                message: 'Failed to start break. Please try again.'
            });
        }
    })
];

/**
 * @desc    End break
 * @route   POST /api/v1/employee/attendance/break/end
 * @access  Private
 */
const endBreak = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;

        const attendance = await Attendance.getTodayAttendance(employeeId);

        if (!attendance || !attendance.checkIn?.time) {
            return res.status(400).json({
                success: false,
                error: 'NOT_CHECKED_IN',
                message: 'You must check in first'
            });
        }

        const breakEntry = attendance.endBreak();
        await attendance.save();

        res.json({
            success: true,
            data: {
                break: {
                    id: breakEntry._id,
                    type: breakEntry.type,
                    startTime: breakEntry.startTime,
                    endTime: breakEntry.endTime,
                    duration: breakEntry.duration + ' minutes'
                },
                attendance: {
                    isOnBreak: attendance.isOnBreak,
                    totalBreakTime: attendance.formattedBreakTime
                }
            },
            message: 'Break ended successfully'
        });

    } catch (error) {
        console.error('End break error:', error);
        
        if (error.message === 'Not currently on break') {
            return res.status(400).json({
                success: false,
                error: 'NOT_ON_BREAK',
                message: 'You are not currently on a break'
            });
        }

        res.status(500).json({
            success: false,
            error: 'END_BREAK_FAILED',
            message: 'Failed to end break. Please try again.'
        });
    }
});

/**
 * @desc    Get today's attendance
 * @route   GET /api/v1/employee/attendance/today
 * @access  Private
 */
const getTodayAttendance = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const attendance = await Attendance.getTodayAttendance(employeeId);

        if (!attendance) {
            return res.json({
                success: true,
                data: {
                    attendance: null,
                    hasCheckedIn: false,
                    hasCheckedOut: false,
                    isOnBreak: false
                },
                message: 'No attendance record for today'
            });
        }

        res.json({
            success: true,
            data: {
                attendance: {
                    id: attendance._id,
                    date: attendance.formattedDate,
                    checkIn: attendance.checkIn,
                    checkOut: attendance.checkOut,
                    breaks: attendance.breaks,
                    status: attendance.status,
                    workingHours: attendance.formattedWorkingHours,
                    breakTime: attendance.formattedBreakTime,
                    isPresent: attendance.isPresent,
                    isLate: attendance.isLate,
                    lateMinutes: attendance.lateMinutes,
                    isOnBreak: attendance.isOnBreak,
                    overtimeHours: attendance.overtimeHours
                },
                hasCheckedIn: !!attendance.checkIn?.time,
                hasCheckedOut: !!attendance.checkOut?.time,
                isOnBreak: attendance.isOnBreak
            },
            message: 'Today\'s attendance retrieved successfully'
        });

    } catch (error) {
        console.error('Get today attendance error:', error);
        res.status(500).json({
            success: false,
            error: 'ATTENDANCE_FETCH_FAILED',
            message: 'Failed to retrieve today\'s attendance'
        });
    }
});

/**
 * @desc    Get attendance history
 * @route   GET /api/v1/employee/attendance/history
 * @access  Private
 */
const getAttendanceHistory = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { fromDate, toDate, page = 1, limit = 10 } = req.query;

        const result = await Attendance.getAttendanceHistory(
            employeeId,
            fromDate,
            toDate,
            parseInt(page),
            parseInt(limit)
        );

        res.json({
            success: true,
            data: {
                records: result.records,
                pagination: result.pagination
            },
            message: 'Attendance history retrieved successfully'
        });

    } catch (error) {
        console.error('Get attendance history error:', error);
        res.status(500).json({
            success: false,
            error: 'ATTENDANCE_HISTORY_FAILED',
            message: 'Failed to retrieve attendance history'
        });
    }
});

/**
 * @desc    Get weekly summary
 * @route   GET /api/v1/employee/attendance/weekly
 * @access  Private
 */
const getWeeklySummary = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { weekStartDate } = req.query;

        const startDate = weekStartDate ? new Date(weekStartDate) : new Date();
        const summary = await Attendance.getWeeklySummary(employeeId, startDate);

        res.json({
            success: true,
            data: {
                weeklySummary: summary
            },
            message: 'Weekly attendance summary retrieved successfully'
        });

    } catch (error) {
        console.error('Get weekly summary error:', error);
        res.status(500).json({
            success: false,
            error: 'WEEKLY_SUMMARY_FAILED',
            message: 'Failed to retrieve weekly summary'
        });
    }
});

/**
 * @desc    Get attendance summary
 * @route   GET /api/v1/employee/attendance/summary
 * @access  Private
 */
const getAttendanceSummary = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { fromDate, toDate } = req.query;

        const summary = await Attendance.getAttendanceSummary(employeeId, fromDate, toDate);

        res.json({
            success: true,
            data: {
                summary
            },
            message: 'Attendance summary retrieved successfully'
        });

    } catch (error) {
        console.error('Get attendance summary error:', error);
        res.status(500).json({
            success: false,
            error: 'ATTENDANCE_SUMMARY_FAILED',
            message: 'Failed to retrieve attendance summary'
        });
    }
});

module.exports = {
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    getTodayAttendance,
    getAttendanceHistory,
    getWeeklySummary,
    getAttendanceSummary
}; 