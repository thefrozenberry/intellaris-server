const mandateService = require('../services/mandateService');
const { validateInput } = require('../middlewares/validateInput');
const logger = require('../utils/logger');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Initiate a mandate creation request
 * @route   POST /api/v1/mandate/initiate
 * @access  Private
 */
exports.initiateMandate = async (req, res) => {
  try {
    const result = await mandateService.initiateMandate(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in initiateMandate: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

/**
 * @desc    Validate a mandate
 * @route   POST /api/v1/mandate/validate
 * @access  Private
 */
exports.validateMandate = async (req, res) => {
  try {
    const result = await mandateService.validateMandate(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in validateMandate: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

/**
 * @desc    Revoke a mandate
 * @route   POST /api/v1/mandate/revoke
 * @access  Private
 */
exports.revokeMandate = async (req, res) => {
  try {
    const result = await mandateService.revokeMandate(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in revokeMandate: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

/**
 * @desc    Execute a mandate payment
 * @route   POST /api/v1/mandate/execute
 * @access  Private
 */
exports.executeMandate = async (req, res) => {
  try {
    const result = await mandateService.executeMandate(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in executeMandate: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

/**
 * @desc    Get mandate details
 * @route   GET /api/v1/mandate/:umn
 * @access  Private
 */
exports.getMandateDetails = async (req, res) => {
  try {
    const result = await mandateService.getMandateDetails(req.params.umn);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in getMandateDetails: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

/**
 * @desc    Authorize (approve or decline) a mandate
 * @route   POST /api/v1/mandate/authorize
 * @access  Private
 */
exports.authorizeMandate = async (req, res) => {
  try {
    const result = await mandateService.authorizeMandate(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in authorizeMandate: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

/**
 * @desc    Execute a mandate transaction by payee
 * @route   POST /api/v1/mandate/execute-transaction
 * @access  Private
 */
exports.mandateExecuteTransaction = async (req, res) => {
  try {
    const result = await mandateService.mandateExecuteTransaction(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in mandateExecuteTransaction: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

/**
 * @desc    Modify an existing mandate
 * @route   POST /api/v1/mandate/modify
 * @access  Private
 */
exports.modifyMandate = asyncHandler(async (req, res) => {
  const response = await mandateService.modifyMandate(req.body);
  
  res.status(200).json({
    success: true,
    message: 'Mandate modified successfully',
    data: response
  });
});

/**
 * @desc    Update mandate status (suspend/activate/revoke)
 * @route   POST /api/v1/mandate/update-status
 * @access  Private
 */
exports.updateMandateStatus = asyncHandler(async (req, res) => {
  const response = await mandateService.updateMandate(req.body);
  
  // Determine the action based on the newstate value
  let action = 'updated';
  if (req.body.Data && req.body.Data.newstate) {
    switch (req.body.Data.newstate) {
      case 'REVOKE':
        action = 'revoked';
        break;
      case 'SUSPEND':
        action = 'suspended';
        break;
      case 'ACTIVATE':
        action = 'activated';
        break;
    }
  }
  
  res.status(200).json({
    success: true,
    message: `Mandate ${action} successfully`,
    data: response
  });
});

/**
 * @desc    Get detailed mandate information
 * @route   POST /api/v1/mandate/get-mandate
 * @access  Private
 */
exports.getMandate = async (req, res) => {
  try {
    const result = await mandateService.getMandate(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in getMandate: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

/**
 * @desc    Get transactions for a mandate
 * @route   POST /api/v1/mandate/get-transactions
 * @access  Private
 */
exports.getMandateTransactions = async (req, res) => {
  try {
    const result = await mandateService.getMandateTransactions(req.body);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in getMandateTransactions: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
}; 