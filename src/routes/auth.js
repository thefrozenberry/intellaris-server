const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requestOTPValidation, verifyOTPValidation, refreshTokenValidation } = require('../middlewares/validateInput');
const { otpRequestLimiter, otpVerifyLimiter } = require('../utils/rateLimiter');

/**
 * Authentication routes
 */

// Route for requesting OTP
router.post(
  '/request-otp',
  otpRequestLimiter,
  requestOTPValidation,
  authController.requestOTP
);

// Route for verifying OTP
router.post(
  '/verify-otp',
  otpVerifyLimiter,
  verifyOTPValidation,
  authController.verifyOTP
);

// Route for refreshing access token
router.post(
  '/refresh-token',
  refreshTokenValidation,
  authController.refreshToken
);

// Route for logging out
router.post(
  '/logout',
  refreshTokenValidation,
  authController.logout
);

module.exports = router; 