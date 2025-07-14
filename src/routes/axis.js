const express = require('express');
const router = express.Router();
const axisBankController = require('../controllers/axisBankController');
const { registerCustomerValidation, requestOtpValidation, fetchCustomerAccountsValidation, getTokenValidation, setVpaValidation, vpaAvailabilityValidation, verifyVpaValidation, setResetMpinValidation } = require('../middlewares/axisValidation');

/**
 * Axis Bank API Routes
 */

/**
 * @route POST /api/axis/upi/register
 * @desc Register a customer with Axis Bank UPI
 * @access Private
 */
router.post(
  '/upi/register',
  registerCustomerValidation,
  axisBankController.registerCustomer
);

/**
 * @route POST /api/axis/upi/otp/request
 * @desc Request OTP for UPI account registration with Axis Bank
 * @access Private
 */
router.post(
  '/upi/otp/request',
  requestOtpValidation,
  axisBankController.requestOtp
);

/**
 * @route POST /api/axis/upi/accounts/fetch
 * @desc Fetch customer accounts by phone number from Axis Bank
 * @access Private
 */
router.post(
  '/upi/accounts/fetch',
  fetchCustomerAccountsValidation,
  axisBankController.fetchCustomerAccounts
);

/**
 * @route GET /api/axis/upi/get-token
 * @desc Fetch token into UPI Payment Service Provider Switch
 * @access Private
 */
router.get(
  '/upi/get-token',
  getTokenValidation,
  axisBankController.getToken
);

/**
 * @route POST /api/axis/upi/set-vpa
 * @desc Set Virtual Primary Address for UPI
 * @access Private
 */
router.post(
  '/upi/set-vpa',
  setVpaValidation,
  axisBankController.setVpa
);

/**
 * @route GET /api/axis/upi/vpa-availability
 * @desc Check availability of Virtual Primary Address for UPI
 * @access Private
 */
router.get(
  '/upi/vpa-availability',
  vpaAvailabilityValidation,
  axisBankController.checkVpaAvailability
);

/**
 * @route POST /api/axis/upi/verify-vpa
 * @desc Verify Virtual Primary Address for UPI (P2P or P2M)
 * @access Private
 */
router.post(
  '/upi/verify-vpa',
  verifyVpaValidation,
  axisBankController.verifyVpa
);

/**
 * @route POST /api/axis/upi/set-reset-mpin
 * @desc Set/Reset MPIN for UPI
 * @access Private
 */
router.post(
  '/upi/set-reset-mpin',
  setResetMpinValidation,
  axisBankController.setResetMpin
);

module.exports = router; 