const axisBankService = require('../services/axisBankService');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Controller for UPI customer registration via Axis Bank
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with registration result
 */
async function registerCustomer(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract customer data from request body
    const customerData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.query.testId || '1');
    
    // Register customer with Axis Bank
    const registrationResult = await axisBankService.registerCustomer(customerData, testId);
    
    // Return success response
    return res.status(200).json(successResponse(
      registrationResult,
      'Customer registered successfully with Axis Bank UPI',
      200
    ));
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to register customer with Axis Bank',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for UPI OTP request via Axis Bank
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with OTP request result
 */
async function requestOtp(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract OTP request data from request body
    const otpData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.query.testId || '1');
    
    // Request OTP from Axis Bank
    const otpResult = await axisBankService.requestOtp(otpData, testId);
    
    // Return success response
    return res.status(200).json(successResponse(
      otpResult,
      'OTP requested successfully from Axis Bank',
      200
    ));
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to request OTP from Axis Bank',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for fetching customer accounts via Axis Bank UPI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with customer accounts
 */
async function fetchCustomerAccounts(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract fetch accounts request data from request body
    const fetchAccountsData = req.body;
    
    // Get test ID from header or query parameter (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || req.query.testId || '1');
    
    // Fetch customer accounts from Axis Bank
    const accountsResult = await axisBankService.fetchCustomerAccounts(fetchAccountsData, testId);
    
    // Return success response
    return res.status(200).json(successResponse(
      accountsResult,
      'Customer accounts fetched successfully from Axis Bank',
      200
    ));
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to fetch customer accounts from Axis Bank',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for fetching token from Axis Bank UPI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with token data
 */
async function getToken(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract request parameters from query and headers
    const { customerId, type, challenge } = req.query;
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    const requestUUID = req.headers['x-axis-requestuuid'];
    const serviceRequestId = req.headers['x-axis-servicerequestid'];
    const serviceRequestVersion = req.headers['x-axis-servicerequestversion'];
    const channelId = req.headers['x-axis-channelid'];
    
    // Fetch token from Axis Bank service
    const tokenResult = await axisBankService.getToken({
      customerId,
      type,
      challenge,
      testId,
      requestUUID,
      serviceRequestId,
      serviceRequestVersion,
      channelId
    });
    
    // Return success response
    return res.status(200).json(successResponse(
      tokenResult,
      'Token fetched successfully from Axis Bank',
      200
    ));
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to fetch token from Axis Bank',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for setting VPA via Axis Bank UPI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with set VPA result
 */
async function setVpa(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract request data from request body
    const requestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Set VPA through Axis Bank service
    const setVpaResult = await axisBankService.setVpa(requestData, testId);
    
    // Return success response
    return res.status(200).json(successResponse(
      setVpaResult,
      'VPA set successfully in Axis Bank UPI',
      200
    ));
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to set VPA in Axis Bank UPI',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for checking VPA availability via Axis Bank UPI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with VPA availability result
 */
async function checkVpaAvailability(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract request parameters from query and headers
    const { customerId, vpa, applicationID } = req.query;
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    const requestUUID = req.headers['x-axis-requestuuid'];
    const serviceRequestId = req.headers['x-axis-servicerequestid'];
    const serviceRequestVersion = req.headers['x-axis-servicerequestversion'];
    const channelId = req.headers['x-axis-channelid'];
    
    // Check VPA availability through Axis Bank service
    const vpaAvailabilityResult = await axisBankService.checkVpaAvailability({
      customerId,
      vpa,
      applicationID,
      testId,
      requestUUID,
      serviceRequestId,
      serviceRequestVersion,
      channelId
    });
    
    // Return success response
    return res.status(200).json(successResponse(
      vpaAvailabilityResult,
      'VPA availability checked successfully with Axis Bank UPI',
      200
    ));
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to check VPA availability with Axis Bank UPI',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for verifying VPA via Axis Bank UPI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with VPA verification result
 */
async function verifyVpa(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract request data from request body
    const requestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Verify VPA through Axis Bank service
    const verifyVpaResult = await axisBankService.verifyVpa(requestData, testId);
    
    // Return success response
    return res.status(200).json(successResponse(
      verifyVpaResult,
      'VPA verified successfully with Axis Bank UPI',
      200
    ));
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to verify VPA with Axis Bank UPI',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Set/Reset MPIN for UPI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response
 */
async function setResetMpin(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: errors.array(),
        statusCode: 400
      });
    }

    // Get test ID from header
    const testId = req.header('X-AXIS-TEST-ID');

    // Forward the request to Axis Bank UPI Set Reset MPIN API
    const result = await axisBankService.setResetMpin(req.body, testId);

    // Return success response
    return res.status(200).json({
      status: 'success',
      message: 'MPIN set/reset successfully with Axis Bank UPI',
      data: result
    });
  } catch (error) {
    console.error('Error in setResetMpin controller:', error);
    
    // Return error response
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'Internal server error',
      errors: error.errors || [],
      statusCode: error.statusCode || 500
    });
  }
}

module.exports = {
  registerCustomer,
  requestOtp,
  fetchCustomerAccounts,
  getToken,
  setVpa,
  checkVpaAvailability,
  verifyVpa,
  setResetMpin
}; 