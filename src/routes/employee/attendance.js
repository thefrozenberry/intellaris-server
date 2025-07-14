const express = require('express');
const router = express.Router();

// Import controllers
const {
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    getTodayAttendance,
    getAttendanceHistory,
    getWeeklySummary,
    getAttendanceSummary
} = require('../../controllers/employee/attendanceController');

/**
 * @route   POST /api/v1/employee/attendance/checkin
 * @desc    Check in employee
 * @access  Private
 */
router.post('/checkin', checkIn);

/**
 * @route   POST /api/v1/employee/attendance/checkout
 * @desc    Check out employee
 * @access  Private
 */
router.post('/checkout', checkOut);

/**
 * @route   POST /api/v1/employee/attendance/break/start
 * @desc    Start break
 * @access  Private
 */
router.post('/break/start', startBreak);

/**
 * @route   POST /api/v1/employee/attendance/break/end
 * @desc    End break
 * @access  Private
 */
router.post('/break/end', endBreak);

/**
 * @route   GET /api/v1/employee/attendance/today
 * @desc    Get today's attendance
 * @access  Private
 */
router.get('/today', getTodayAttendance);

/**
 * @route   GET /api/v1/employee/attendance/history
 * @desc    Get attendance history
 * @access  Private
 */
router.get('/history', getAttendanceHistory);

/**
 * @route   GET /api/v1/employee/attendance/weekly
 * @desc    Get weekly summary
 * @access  Private
 */
router.get('/weekly', getWeeklySummary);

/**
 * @route   GET /api/v1/employee/attendance/summary
 * @desc    Get attendance summary
 * @access  Private
 */
router.get('/summary', getAttendanceSummary);

module.exports = router; 