const express = require('express');
const router = express.Router();

// Import controllers
const {
    registerEmployee,
    checkCredentials,
    sendOTP,
    verifyOTP,
    resendOTP,
    refreshToken,
    logout,
    getOTP
} = require('../../controllers/employee/authController');

/**
 * @route   POST /api/v1/employee/auth/register
 * @desc    Register a new employee
 * @access  Public
 */
router.post('/register', registerEmployee);

/**
 * @route   POST /api/v1/employee/auth/check-credentials
 * @desc    Check employee credentials (EN code + access code)
 * @access  Public
 */
router.post('/check-credentials', checkCredentials);

/**
 * @route   POST /api/v1/employee/auth/send-otp
 * @desc    Send OTP to employee after credential verification
 * @access  Public
 */
router.post('/send-otp', sendOTP);

/**
 * @route   POST /api/v1/employee/auth/verify-otp
 * @desc    Verify OTP and complete login
 * @access  Public
 */
router.post('/verify-otp', verifyOTP);

/**
 * @route   POST /api/v1/employee/auth/resend-otp
 * @desc    Resend OTP if expired or not received
 * @access  Public
 */
router.post('/resend-otp', resendOTP);

/**
 * @route   POST /api/v1/employee/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh', refreshToken);

/**
 * @route   POST /api/v1/employee/auth/logout
 * @desc    Logout employee and invalidate tokens
 * @access  Public
 */
router.post('/logout', logout);

/**
 * @route   POST /api/v1/employee/auth/get-otp
 * @desc    Get current OTP for display (Development/Testing purpose)
 * @access  Public
 */
router.post('/get-otp', getOTP);

module.exports = router; 