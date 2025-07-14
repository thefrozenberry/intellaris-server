const { body, validationResult } = require('express-validator');

/**
 * Middleware to validate input for all requests
 * It checks for validation errors and returns a standardized response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for request OTP endpoint
 */
const requestOTPValidation = [
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit Indian mobile number'),
  validate
];

/**
 * Validation rules for verify OTP endpoint
 */
const verifyOTPValidation = [
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit Indian mobile number'),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
    .isNumeric().withMessage('OTP must contain only numbers'),
  validate
];

/**
 * Validation rules for refresh token endpoint
 */
const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
  validate
];

module.exports = {
  validate,
  validateInput,
  requestOTPValidation,
  verifyOTPValidation,
  refreshTokenValidation
}; 