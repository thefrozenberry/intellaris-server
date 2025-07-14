const express = require('express');
const router = express.Router();
const mandateController = require('../controllers/mandateController');
const {
  validateInitiateMandate,
  validateExecuteMandate,
  validateRevokeMandate,
  validateMandateValidation,
  validateGetMandateDetails,
  validateAuthorizeMandate,
  validateMandateExecuteTransaction,
  validateModifyMandateRequest,
  validateUpdateMandateRequest,
  validateGetMandateRequest,
  validateGetMandateTransactionsRequest
} = require('../middlewares/mandateValidation');

/**
 * @route   POST /api/v1/mandate/initiate
 * @desc    Initiate a mandate creation request
 * @access  Private
 */
router.post('/initiate', validateInitiateMandate, mandateController.initiateMandate);

/**
 * @route   POST /api/v1/mandate/validate
 * @desc    Validate a mandate
 * @access  Private
 */
router.post('/validate', validateMandateValidation, mandateController.validateMandate);

/**
 * @route   POST /api/v1/mandate/revoke
 * @desc    Revoke a mandate
 * @access  Private
 */
router.post('/revoke', validateRevokeMandate, mandateController.revokeMandate);

/**
 * @route   POST /api/v1/mandate/execute
 * @desc    Execute a mandate payment
 * @access  Private
 */
router.post('/execute', validateExecuteMandate, mandateController.executeMandate);

/**
 * @route   POST /api/v1/mandate/execute-transaction
 * @desc    Execute a mandate transaction by payee
 * @access  Private
 */
router.post('/execute-transaction', validateMandateExecuteTransaction, mandateController.mandateExecuteTransaction);

/**
 * @route   GET /api/v1/mandate/:umn
 * @desc    Get mandate details
 * @access  Private
 */
router.get('/:umn', validateGetMandateDetails, mandateController.getMandateDetails);

/**
 * @route   POST /api/v1/mandate/authorize
 * @desc    Authorize (approve or decline) a mandate
 * @access  Private
 */
router.post('/authorize', validateAuthorizeMandate, mandateController.authorizeMandate);

// Modify mandate
router.post(
  '/modify',
  validateModifyMandateRequest,
  mandateController.modifyMandate
);

// Update mandate status (suspend/activate/revoke)
router.post(
  '/update-status', 
  validateUpdateMandateRequest,
  mandateController.updateMandateStatus
);

/**
 * @route   POST /api/v1/mandate/get-mandate
 * @desc    Get detailed mandate information
 * @access  Private
 */
router.post('/get-mandate', validateGetMandateRequest, mandateController.getMandate);

/**
 * @route   POST /api/v1/mandate/get-transactions
 * @desc    Get transactions for a mandate
 * @access  Private
 */
router.post('/get-transactions', validateGetMandateTransactionsRequest, mandateController.getMandateTransactions);

module.exports = router; 