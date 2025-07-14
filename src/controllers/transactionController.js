const transactionService = require('../services/transactionService');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Controller for handling UPI payment requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with payment result
 */
async function payRequest(req, res) {
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

    // Extract payment data from request body
    const payRequestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Process payment through transaction service
    const paymentResult = await transactionService.processPayRequest(payRequestData, testId);
    
    // Return success response
    return res.status(200).json(paymentResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to process payment request',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI collect requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with collect request result
 */
async function collectRequest(req, res) {
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

    // Extract collect request data from request body
    const collectRequestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Process collect request through transaction service
    const collectResult = await transactionService.processCollectRequest(collectRequestData, testId);
    
    // Return success response
    return res.status(200).json(collectResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to process collect request',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI collect approve requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with collect approve result
 */
async function collectApprove(req, res) {
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

    // Extract collect approve request data from request body
    const collectApproveRequestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Process collect approve request through transaction service
    const collectApproveResult = await transactionService.processCollectApprove(collectApproveRequestData, testId);
    
    // Return success response
    return res.status(200).json(collectApproveResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to process collect approve request',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI collect decline requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with collect decline result
 */
async function collectDecline(req, res) {
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

    // Extract collect decline request data from request body
    const collectDeclineRequestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Process collect decline request through transaction service
    const collectDeclineResult = await transactionService.processCollectDecline(collectDeclineRequestData, testId);
    
    // Return success response
    return res.status(200).json(collectDeclineResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to process collect decline request',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI self payment requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with self payment result
 */
async function selfPay(req, res) {
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

    // Extract self pay request data from request body
    const selfPayRequestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = req.headers['x-axis-test-id'] || '1';
    
    // Process self pay request through transaction service
    const selfPayResult = await transactionService.processSelfPay(selfPayRequestData, testId);
    
    // Return success response
    return res.status(200).json(selfPayResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to process self payment request',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI transaction status requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with transaction status
 */
async function transactionStatus(req, res) {
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

    // Extract transaction status request data from request body
    const transactionStatusRequestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Process transaction status request through transaction service
    const statusResult = await transactionService.getTransactionStatus(transactionStatusRequestData, testId);
    
    // Return success response
    return res.status(200).json(statusResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to retrieve transaction status',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI transaction history requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with transaction history
 */
async function transactionHistory(req, res) {
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

    // Extract query parameters
    const { fromDate, toDate } = req.query;
    
    // Extract header data for API Connect
    const requestHeaders = {
      requestUUID: req.headers['x-axis-requestuuid'],
      serviceRequestId: req.headers['x-axis-servicerequestid'],
      serviceRequestVersion: req.headers['x-axis-servicerequestversion'],
      channelId: req.headers['x-axis-channelid']
    };
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Get transaction history through transaction service
    const historyResult = await transactionService.getTransactionHistory(fromDate, toDate, requestHeaders, testId);
    
    // Return success response
    return res.status(200).json(historyResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to retrieve transaction history',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI balance inquiry requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with account balance information
 */
async function balanceInquiry(req, res) {
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

    // Extract balance inquiry request data from request body
    const balanceInquiryRequestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Process balance inquiry request through transaction service
    const balanceResult = await transactionService.processBalanceInquiry(balanceInquiryRequestData, testId);
    
    // Return success response
    return res.status(200).json(balanceResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to retrieve account balance',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI pending transaction list requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with pending transaction list
 */
async function pendingTransactionList(req, res) {
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

    // Extract query parameters
    const { customerId, applicationID } = req.query;
    
    // Extract header data for API Connect
    const requestHeaders = {
      requestUUID: req.headers['x-axis-requestuuid'],
      serviceRequestId: req.headers['x-axis-servicerequestid'],
      serviceRequestVersion: req.headers['x-axis-servicerequestversion'],
      channelId: req.headers['x-axis-channelid']
    };
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Get pending transactions through transaction service
    const pendingResult = await transactionService.getPendingTransactionList(customerId, applicationID, requestHeaders, testId);
    
    // Return success response
    return res.status(200).json(pendingResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to retrieve pending transaction list',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI Change MPIN requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with MPIN change result
 */
async function changeMPIN(req, res) {
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

    // Extract change MPIN request data from request body
    const changeMPINRequestData = req.body;
    
    // Get test ID for response type (default to success = 1)
    const testId = req.headers['x-axis-test-id'] || '1';
    
    // Process MPIN change request through transaction service
    const changeMPINResult = await transactionService.processChangeMPIN(changeMPINRequestData, testId);
    
    // Return success response
    return res.status(200).json(changeMPINResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to change MPIN',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI Customer De-Registration requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with customer de-registration result
 */
async function customerDeregistration(req, res) {
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

    // Extract query parameters
    const { customerId, applicationId } = req.query;
    
    // Extract header data for API Connect
    const requestHeaders = {
      requestUUID: req.headers['x-axis-requestuuid'],
      serviceRequestId: req.headers['x-axis-servicerequestid'],
      serviceRequestVersion: req.headers['x-axis-servicerequestversion'],
      channelId: req.headers['x-axis-channelid']
    };
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Process customer de-registration request through transaction service
    const deregistrationResult = await transactionService.processCustomerDeregistration(
      customerId, 
      applicationId, 
      requestHeaders, 
      testId
    );
    
    // Return success response
    return res.status(200).json(deregistrationResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to de-register customer',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for handling UPI Remove Accounts requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with account removal result
 */
async function removeAccount(req, res) {
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

    // Extract query parameters
    const { customerId, accountNumber, applicationId } = req.query;
    
    // Extract header data for API Connect
    const requestHeaders = {
      requestUUID: req.headers['x-axis-requestuuid'],
      serviceRequestId: req.headers['x-axis-servicerequestid'],
      serviceRequestVersion: req.headers['x-axis-servicerequestversion'],
      channelId: req.headers['x-axis-channelid']
    };
    
    // Get test ID for response type (default to success = 1)
    const testId = parseInt(req.headers['x-axis-test-id'] || '1');
    
    // Process account removal request through transaction service
    const removalResult = await transactionService.processRemoveAccount(
      customerId, 
      accountNumber, 
      applicationId, 
      requestHeaders, 
      testId
    );
    
    // Return success response
    return res.status(200).json(removalResult);
  } catch (error) {
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to remove account',
      error.error || error.message,
      error.status || 500
    ));
  }
}

module.exports = {
  payRequest,
  collectRequest,
  collectApprove,
  collectDecline,
  selfPay,
  transactionStatus,
  transactionHistory,
  balanceInquiry,
  pendingTransactionList,
  changeMPIN,
  customerDeregistration,
  removeAccount
}; 