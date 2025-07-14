const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { payRequestValidation, collectRequestValidation, collectApproveRequestValidation, collectDeclineRequestValidation, selfPayRequestValidation, transactionStatusValidation, transactionHistoryValidation, balanceInquiryValidation, pendingTransactionListValidation, changeMPINValidation, customerDeregistrationValidation, removeAccountValidation } = require('../middlewares/transactionValidation');

/**
 * Transaction routes for payment operations
 */

/**
 * @route POST /api/transactions/v1/payrequest
 * @desc Process a UPI payment request
 * @access Private
 */
router.post(
  '/v1/payrequest',
  payRequestValidation,
  transactionController.payRequest
);

/**
 * @route POST /api/transactions/v1/collectrequest
 * @desc Process a UPI collect request
 * @access Private
 */
router.post(
  '/v1/collectrequest',
  collectRequestValidation,
  transactionController.collectRequest
);

/**
 * @route POST /api/transactions/v1/collectapprove
 * @desc Approve a UPI collect request
 * @access Private
 */
router.post(
  '/v1/collectapprove',
  collectApproveRequestValidation,
  transactionController.collectApprove
);

/**
 * @route POST /api/transactions/v1/collectdeclinerequest
 * @desc Decline a UPI collect request
 * @access Private
 */
router.post(
  '/v1/collectdeclinerequest',
  collectDeclineRequestValidation,
  transactionController.collectDecline
);

/**
 * @route POST /api/transactions/v1/selfpay
 * @desc Process a UPI self payment (between own accounts)
 * @access Private
 */
router.post(
  '/v1/selfpay',
  selfPayRequestValidation,
  transactionController.selfPay
);

/**
 * @route POST /api/transactions/v3/transactionstatus
 * @desc Get the status of a UPI transaction
 * @access Private
 */
router.post(
  '/v3/transactionstatus',
  transactionStatusValidation,
  transactionController.transactionStatus
);

/**
 * @route GET /api/transactions/v3/transactionhistory
 * @desc Get UPI transaction history between two dates
 * @access Private
 */
router.get(
  '/v3/transactionhistory',
  transactionHistoryValidation,
  transactionController.transactionHistory
);

/**
 * @route POST /api/transactions/v1/balanceinquiry
 * @desc Check account balance for UPI
 * @access Private
 */
router.post(
  '/v1/balanceinquiry',
  balanceInquiryValidation,
  transactionController.balanceInquiry
);

/**
 * @route GET /api/transactions/v3/pendingtransactionlist
 * @desc Get list of pending UPI transactions that need to be approved
 * @access Private
 */
router.get(
  '/v3/pendingtransactionlist',
  pendingTransactionListValidation,
  transactionController.pendingTransactionList
);

/**
 * @route POST /api/transactions/v1/changempin
 * @desc Change UPI MPIN
 * @access Private
 */
router.post(
  '/v1/changempin',
  changeMPINValidation,
  transactionController.changeMPIN
);

/**
 * @route GET /api/transactions/v2/customer-dergistration
 * @desc De-Register UPI customer
 * @access Private
 */
router.get(
  '/v2/customer-dergistration',
  customerDeregistrationValidation,
  transactionController.customerDeregistration
);

/**
 * @route GET /api/transactions/v4/account/remove
 * @desc Remove a UPI linked account
 * @access Private
 */
router.get(
  '/v4/account/remove',
  removeAccountValidation,
  transactionController.removeAccount
);

module.exports = router; 