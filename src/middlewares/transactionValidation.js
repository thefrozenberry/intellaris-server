const { body, header, query } = require('express-validator');
const { validate } = require('./validateInput');

/**
 * Validation rules for UPI Pay Request
 */
const payRequestValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // PayRequest validation
  body('PayRequest')
    .notEmpty()
    .withMessage('PayRequest is required')
    .isObject()
    .withMessage('PayRequest must be an object'),
  
  // SubHeader validation
  body('PayRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('PayRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('PayRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('PayRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('PayRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // PayRequestBody validation
  body('PayRequest.PayRequestBody')
    .notEmpty()
    .withMessage('PayRequestBody is required')
    .isObject()
    .withMessage('PayRequestBody must be an object'),
  
  body('PayRequest.PayRequestBody.customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  body('PayRequest.PayRequestBody.txnId')
    .notEmpty()
    .withMessage('txnId is required')
    .isString()
    .withMessage('txnId must be a string'),
  
  body('PayRequest.PayRequestBody.amount')
    .notEmpty()
    .withMessage('amount is required')
    .isString()
    .withMessage('amount must be a string'),
  
  body('PayRequest.PayRequestBody.purpose')
    .notEmpty()
    .withMessage('purpose is required')
    .isString()
    .withMessage('purpose must be a string'),
  
  body('PayRequest.PayRequestBody.initmode')
    .notEmpty()
    .withMessage('initmode is required')
    .isString()
    .withMessage('initmode must be a string'),
  
  body('PayRequest.PayRequestBody.mcc')
    .notEmpty()
    .withMessage('mcc is required')
    .isString()
    .withMessage('mcc must be a string'),
  
  // Payees validation
  body('PayRequest.PayRequestBody.payees')
    .isArray()
    .withMessage('payees must be an array'),
  
  body('PayRequest.PayRequestBody.payees.*.beneVpa')
    .notEmpty()
    .withMessage('beneVpa is required for each payee')
    .isString()
    .withMessage('beneVpa must be a string'),
  
  body('PayRequest.PayRequestBody.payees.*.bamount')
    .notEmpty()
    .withMessage('bamount is required for each payee')
    .isString()
    .withMessage('bamount must be a string'),
  
  // Account validation
  body('PayRequest.PayRequestBody.ac')
    .notEmpty()
    .withMessage('ac is required')
    .isObject()
    .withMessage('ac must be an object'),
  
  body('PayRequest.PayRequestBody.ac.name')
    .notEmpty()
    .withMessage('ac.name is required')
    .isString()
    .withMessage('ac.name must be a string'),
  
  body('PayRequest.PayRequestBody.ac.type')
    .notEmpty()
    .withMessage('ac.type is required')
    .isString()
    .withMessage('ac.type must be a string'),
  
  body('PayRequest.PayRequestBody.ac.accRefNumber')
    .notEmpty()
    .withMessage('ac.accRefNumber is required')
    .isString()
    .withMessage('ac.accRefNumber must be a string'),
  
  body('PayRequest.PayRequestBody.ac.vpa')
    .notEmpty()
    .withMessage('ac.vpa is required')
    .isString()
    .withMessage('ac.vpa must be a string'),
  
  // Device validation
  body('PayRequest.PayRequestBody.device')
    .optional()
    .isObject()
    .withMessage('device must be an object'),
  
  // Credential validation
  body('PayRequest.PayRequestBody.cred')
    .notEmpty()
    .withMessage('cred is required')
    .isObject()
    .withMessage('cred must be an object'),
  
  body('PayRequest.PayRequestBody.cred.type')
    .notEmpty()
    .withMessage('cred.type is required')
    .isString()
    .withMessage('cred.type must be a string'),
  
  body('PayRequest.PayRequestBody.cred.subType')
    .notEmpty()
    .withMessage('cred.subType is required')
    .isString()
    .withMessage('cred.subType must be a string'),
  
  body('PayRequest.PayRequestBody.cred.data')
    .notEmpty()
    .withMessage('cred.data is required')
    .isObject()
    .withMessage('cred.data must be an object'),
  
  validate
];

/**
 * Validation rules for UPI Collect Request
 */
const collectRequestValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // CollectRequest validation
  body('CollectRequest')
    .notEmpty()
    .withMessage('CollectRequest is required')
    .isObject()
    .withMessage('CollectRequest must be an object'),
  
  // SubHeader validation
  body('CollectRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('CollectRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('CollectRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('CollectRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('CollectRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // CollectRequestBody validation
  body('CollectRequest.CollectRequestBody')
    .notEmpty()
    .withMessage('CollectRequestBody is required')
    .isObject()
    .withMessage('CollectRequestBody must be an object'),
  
  // Required fields
  body('CollectRequest.CollectRequestBody.purpose')
    .notEmpty()
    .withMessage('purpose is required')
    .isString()
    .withMessage('purpose must be a string'),
  
  body('CollectRequest.CollectRequestBody.remarks')
    .notEmpty()
    .withMessage('remarks is required')
    .isString()
    .withMessage('remarks must be a string'),
  
  body('CollectRequest.CollectRequestBody.txnId')
    .notEmpty()
    .withMessage('txnId is required')
    .isString()
    .withMessage('txnId must be a string'),
  
  body('CollectRequest.CollectRequestBody.vpa')
    .notEmpty()
    .withMessage('vpa is required')
    .isString()
    .withMessage('vpa must be a string'),
  
  body('CollectRequest.CollectRequestBody.payerVpa')
    .notEmpty()
    .withMessage('payerVpa is required')
    .isString()
    .withMessage('payerVpa must be a string'),
  
  body('CollectRequest.CollectRequestBody.initmode')
    .notEmpty()
    .withMessage('initmode is required')
    .isString()
    .withMessage('initmode must be a string'),
  
  body('CollectRequest.CollectRequestBody.expiry')
    .notEmpty()
    .withMessage('expiry is required')
    .isString()
    .withMessage('expiry must be a string'),
  
  body('CollectRequest.CollectRequestBody.amount')
    .notEmpty()
    .withMessage('amount is required')
    .isString()
    .withMessage('amount must be a string'),
  
  body('CollectRequest.CollectRequestBody.bankId')
    .notEmpty()
    .withMessage('bankId is required')
    .isString()
    .withMessage('bankId must be a string'),
  
  // Account validation
  body('CollectRequest.CollectRequestBody.ac')
    .notEmpty()
    .withMessage('ac is required')
    .isObject()
    .withMessage('ac must be an object'),
  
  body('CollectRequest.CollectRequestBody.ac.name')
    .notEmpty()
    .withMessage('ac.name is required')
    .isString()
    .withMessage('ac.name must be a string'),
  
  body('CollectRequest.CollectRequestBody.ac.type')
    .notEmpty()
    .withMessage('ac.type is required')
    .isString()
    .withMessage('ac.type must be a string'),
  
  body('CollectRequest.CollectRequestBody.ac.accRefNumber')
    .notEmpty()
    .withMessage('ac.accRefNumber is required')
    .isString()
    .withMessage('ac.accRefNumber must be a string'),
  
  body('CollectRequest.CollectRequestBody.ac.vpa')
    .notEmpty()
    .withMessage('ac.vpa is required')
    .isString()
    .withMessage('ac.vpa must be a string'),
  
  // Device validation
  body('CollectRequest.CollectRequestBody.device')
    .notEmpty()
    .withMessage('device is required')
    .isObject()
    .withMessage('device must be an object'),
  
  body('CollectRequest.CollectRequestBody.device.app')
    .optional()
    .isString()
    .withMessage('device.app must be a string'),
  
  body('CollectRequest.CollectRequestBody.device.id')
    .optional()
    .isString()
    .withMessage('device.id must be a string'),
  
  body('CollectRequest.CollectRequestBody.device.mobile')
    .optional()
    .isString()
    .withMessage('device.mobile must be a string'),
  
  validate
];

/**
 * Validation rules for UPI Collect Approve Request
 */
const collectApproveRequestValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // CollectApproveRequest validation
  body('CollectApproveRequest')
    .notEmpty()
    .withMessage('CollectApproveRequest is required')
    .isObject()
    .withMessage('CollectApproveRequest must be an object'),
  
  // SubHeader validation
  body('CollectApproveRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('CollectApproveRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('CollectApproveRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('CollectApproveRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('CollectApproveRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // CollectApproveRequestBody validation
  body('CollectApproveRequest.CollectApproveRequestBody')
    .notEmpty()
    .withMessage('CollectApproveRequestBody is required')
    .isObject()
    .withMessage('CollectApproveRequestBody must be an object'),
  
  // Required fields
  body('CollectApproveRequest.CollectApproveRequestBody.customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  body('CollectApproveRequest.CollectApproveRequestBody.txnId')
    .notEmpty()
    .withMessage('txnId is required')
    .isString()
    .withMessage('txnId must be a string'),
  
  // Device validation
  body('CollectApproveRequest.CollectApproveRequestBody.device')
    .notEmpty()
    .withMessage('device is required')
    .isObject()
    .withMessage('device must be an object'),
  
  // Credential validation
  body('CollectApproveRequest.CollectApproveRequestBody.cred')
    .notEmpty()
    .withMessage('cred is required')
    .isObject()
    .withMessage('cred must be an object'),
  
  body('CollectApproveRequest.CollectApproveRequestBody.cred.type')
    .notEmpty()
    .withMessage('cred.type is required')
    .isString()
    .withMessage('cred.type must be a string'),
  
  body('CollectApproveRequest.CollectApproveRequestBody.cred.subType')
    .notEmpty()
    .withMessage('cred.subType is required')
    .isString()
    .withMessage('cred.subType must be a string'),
  
  body('CollectApproveRequest.CollectApproveRequestBody.cred.data')
    .notEmpty()
    .withMessage('cred.data is required')
    .isObject()
    .withMessage('cred.data must be an object'),
  
  // Account validation
  body('CollectApproveRequest.CollectApproveRequestBody.ac')
    .notEmpty()
    .withMessage('ac is required')
    .isObject()
    .withMessage('ac must be an object'),
  
  body('CollectApproveRequest.CollectApproveRequestBody.ac.name')
    .notEmpty()
    .withMessage('ac.name is required')
    .isString()
    .withMessage('ac.name must be a string'),
  
  body('CollectApproveRequest.CollectApproveRequestBody.ac.type')
    .notEmpty()
    .withMessage('ac.type is required')
    .isString()
    .withMessage('ac.type must be a string'),
  
  body('CollectApproveRequest.CollectApproveRequestBody.ac.accRefNumber')
    .notEmpty()
    .withMessage('ac.accRefNumber is required')
    .isString()
    .withMessage('ac.accRefNumber must be a string'),
  
  body('CollectApproveRequest.CollectApproveRequestBody.ac.vpa')
    .notEmpty()
    .withMessage('ac.vpa is required')
    .isString()
    .withMessage('ac.vpa must be a string'),
  
  validate
];

/**
 * Validation rules for UPI Collect Decline Request
 */
const collectDeclineRequestValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // CollectDeclineRequest validation
  body('CollectDeclineRequest')
    .notEmpty()
    .withMessage('CollectDeclineRequest is required')
    .isObject()
    .withMessage('CollectDeclineRequest must be an object'),
  
  // SubHeader validation
  body('CollectDeclineRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('CollectDeclineRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('CollectDeclineRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('CollectDeclineRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('CollectDeclineRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // CollectDeclineRequestBody validation
  body('CollectDeclineRequest.CollectDeclineRequestBody')
    .notEmpty()
    .withMessage('CollectDeclineRequestBody is required')
    .isObject()
    .withMessage('CollectDeclineRequestBody must be an object'),
  
  // Required fields
  body('CollectDeclineRequest.CollectDeclineRequestBody.txnid')
    .notEmpty()
    .withMessage('txnid is required')
    .isString()
    .withMessage('txnid must be a string'),
  
  body('CollectDeclineRequest.CollectDeclineRequestBody.initiatedtime')
    .isString()
    .withMessage('initiatedtime must be a string'),
  
  body('CollectDeclineRequest.CollectDeclineRequestBody.payeeVpa')
    .notEmpty()
    .withMessage('payeeVpa is required')
    .isString()
    .withMessage('payeeVpa must be a string'),
  
  body('CollectDeclineRequest.CollectDeclineRequestBody.payerVpa')
    .notEmpty()
    .withMessage('payerVpa is required')
    .isString()
    .withMessage('payerVpa must be a string'),
  
  body('CollectDeclineRequest.CollectDeclineRequestBody.mobile')
    .notEmpty()
    .withMessage('mobile is required')
    .isString()
    .withMessage('mobile must be a string'),
  
  body('CollectDeclineRequest.CollectDeclineRequestBody.beneName')
    .notEmpty()
    .withMessage('beneName is required')
    .isString()
    .withMessage('beneName must be a string'),
  
  validate
];

/**
 * Validation rules for UPI Self Pay Request
 */
const selfPayRequestValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isString()
    .withMessage('X-AXIS-TEST-ID must be a string'),
  
  // SelfPayRequest validation
  body('SelfPayRequest')
    .notEmpty()
    .withMessage('SelfPayRequest is required')
    .isObject()
    .withMessage('SelfPayRequest must be an object'),
  
  // SubHeader validation
  body('SelfPayRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('SelfPayRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('SelfPayRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('SelfPayRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('SelfPayRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // SelfPayRequestBody validation
  body('SelfPayRequest.SelfPayRequestBody')
    .notEmpty()
    .withMessage('SelfPayRequestBody is required')
    .isObject()
    .withMessage('SelfPayRequestBody must be an object'),
  
  // Required fields
  body('SelfPayRequest.SelfPayRequestBody.customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  body('SelfPayRequest.SelfPayRequestBody.txnId')
    .notEmpty()
    .withMessage('txnId is required')
    .isString()
    .withMessage('txnId must be a string'),
  
  body('SelfPayRequest.SelfPayRequestBody.amount')
    .notEmpty()
    .withMessage('amount is required')
    .isString()
    .withMessage('amount must be a string'),
  
  // Payees validation (optional array)
  body('SelfPayRequest.SelfPayRequestBody.payees')
    .optional()
    .isArray()
    .withMessage('payees must be an array'),
  
  body('SelfPayRequest.SelfPayRequestBody.payees.*.beneVpa')
    .optional()
    .isString()
    .withMessage('beneVpa must be a string'),
  
  // Account validation
  body('SelfPayRequest.SelfPayRequestBody.ac')
    .notEmpty()
    .withMessage('ac is required')
    .isObject()
    .withMessage('ac must be an object'),
  
  body('SelfPayRequest.SelfPayRequestBody.ac.accRefNumber')
    .notEmpty()
    .withMessage('ac.accRefNumber is required')
    .isString()
    .withMessage('ac.accRefNumber must be a string'),
  
  // Device validation
  body('SelfPayRequest.SelfPayRequestBody.device')
    .notEmpty()
    .withMessage('device is required')
    .isObject()
    .withMessage('device must be an object'),
  
  // Credential validation
  body('SelfPayRequest.SelfPayRequestBody.cred')
    .notEmpty()
    .withMessage('cred is required')
    .isObject()
    .withMessage('cred must be an object'),
  
  validate
];

/**
 * Validation rules for UPI Transaction Status Request
 */
const transactionStatusValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // TransactionStatusRequest validation
  body('TransactionStatusRequest')
    .notEmpty()
    .withMessage('TransactionStatusRequest is required')
    .isObject()
    .withMessage('TransactionStatusRequest must be an object'),
  
  // SubHeader validation
  body('TransactionStatusRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('TransactionStatusRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('TransactionStatusRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('TransactionStatusRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('TransactionStatusRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // TransactionStatusRequestBody validation
  body('TransactionStatusRequest.TransactionStatusRequestBody')
    .notEmpty()
    .withMessage('TransactionStatusRequestBody is required')
    .isObject()
    .withMessage('TransactionStatusRequestBody must be an object'),
  
  // Required fields
  body('TransactionStatusRequest.TransactionStatusRequestBody.tranId')
    .notEmpty()
    .withMessage('tranId is required')
    .isString()
    .withMessage('tranId must be a string'),
  
  body('TransactionStatusRequest.TransactionStatusRequestBody.mobileNumber')
    .notEmpty()
    .withMessage('mobileNumber is required')
    .isString()
    .withMessage('mobileNumber must be a string'),
  
  validate
];

/**
 * Validation rules for UPI Transaction History Request
 */
const transactionHistoryValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Optional headers
  header('X-AXIS-serviceRequestId')
    .optional()
    .isString()
    .withMessage('X-AXIS-serviceRequestId must be a string'),
  
  header('X-AXIS-serviceRequestVersion')
    .optional()
    .isString()
    .withMessage('X-AXIS-serviceRequestVersion must be a string'),
  
  header('X-AXIS-channelId')
    .optional()
    .isString()
    .withMessage('X-AXIS-channelId must be a string'),
  
  header('X-Axis-requestUUID')
    .optional()
    .isString()
    .withMessage('X-Axis-requestUUID must be a string'),
  
  // Query parameters
  query('fromDate')
    .optional()
    .isString()
    .withMessage('fromDate must be a string')
    .matches(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
    .withMessage('fromDate must be in format dd/MM/yyyy'),
  
  query('toDate')
    .optional()
    .isString()
    .withMessage('toDate must be a string')
    .matches(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)
    .withMessage('toDate must be in format dd/MM/yyyy'),
  
  validate
];

/**
 * Validation rules for UPI Balance Inquiry Request
 */
const balanceInquiryValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // BalanceInquiryRequest validation
  body('BalanceInquiryRequest')
    .notEmpty()
    .withMessage('BalanceInquiryRequest is required')
    .isObject()
    .withMessage('BalanceInquiryRequest must be an object'),
  
  // SubHeader validation
  body('BalanceInquiryRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('BalanceInquiryRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('BalanceInquiryRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('BalanceInquiryRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('BalanceInquiryRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // BalanceInquiryRequestBody validation
  body('BalanceInquiryRequest.BalanceInquiryRequestBody')
    .notEmpty()
    .withMessage('BalanceInquiryRequestBody is required')
    .isObject()
    .withMessage('BalanceInquiryRequestBody must be an object'),
  
  // Required fields
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.txnId')
    .notEmpty()
    .withMessage('txnId is required')
    .isString()
    .withMessage('txnId must be a string'),
  
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.vpa')
    .notEmpty()
    .withMessage('vpa is required')
    .isString()
    .withMessage('vpa must be a string'),
  
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.bankId')
    .notEmpty()
    .withMessage('bankId is required')
    .isString()
    .withMessage('bankId must be a string'),
  
  // Account validation
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.account')
    .notEmpty()
    .withMessage('account is required')
    .isObject()
    .withMessage('account must be an object'),
  
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.account.accRefNumber')
    .notEmpty()
    .withMessage('account.accRefNumber is required')
    .isString()
    .withMessage('account.accRefNumber must be a string'),
  
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.account.name')
    .notEmpty()
    .withMessage('account.name is required')
    .isString()
    .withMessage('account.name must be a string'),
  
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.account.type')
    .notEmpty()
    .withMessage('account.type is required')
    .isString()
    .withMessage('account.type must be a string'),
  
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.account.vpa')
    .notEmpty()
    .withMessage('account.vpa is required')
    .isString()
    .withMessage('account.vpa must be a string'),
  
  // Device validation
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.device')
    .optional()
    .isObject()
    .withMessage('device must be an object'),
  
  // Credential validation
  body('BalanceInquiryRequest.BalanceInquiryRequestBody.cred')
    .notEmpty()
    .withMessage('cred is required')
    .isObject()
    .withMessage('cred must be an object'),
  
  validate
];

/**
 * Validation rules for UPI Pending Transaction List Request
 */
const pendingTransactionListValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Required headers
  header('X-AXIS-serviceRequestId')
    .notEmpty()
    .withMessage('X-AXIS-serviceRequestId is required')
    .isString()
    .withMessage('X-AXIS-serviceRequestId must be a string'),
  
  header('X-AXIS-serviceRequestVersion')
    .notEmpty()
    .withMessage('X-AXIS-serviceRequestVersion is required')
    .isString()
    .withMessage('X-AXIS-serviceRequestVersion must be a string'),
  
  header('X-AXIS-channelId')
    .notEmpty()
    .withMessage('X-AXIS-channelId is required')
    .isString()
    .withMessage('X-AXIS-channelId must be a string'),
  
  header('X-Axis-requestUUID')
    .notEmpty()
    .withMessage('X-Axis-requestUUID is required')
    .isString()
    .withMessage('X-Axis-requestUUID must be a string'),
  
  // Query parameters
  query('customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  query('applicationID')
    .notEmpty()
    .withMessage('applicationID is required')
    .isString()
    .withMessage('applicationID must be a string'),
  
  validate
];

/**
 * Validation rules for UPI Change MPIN Request
 */
const changeMPINValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isString()
    .withMessage('X-AXIS-TEST-ID must be a string'),
  
  // ChangeMPINRequest validation
  body('ChangeMPINRequest')
    .notEmpty()
    .withMessage('ChangeMPINRequest is required')
    .isObject()
    .withMessage('ChangeMPINRequest must be an object'),
  
  // SubHeader validation
  body('ChangeMPINRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('ChangeMPINRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('ChangeMPINRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('ChangeMPINRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('ChangeMPINRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // SetResetMPINRequestBody validation
  body('ChangeMPINRequest.SetResetMPINRequestBody')
    .notEmpty()
    .withMessage('SetResetMPINRequestBody is required')
    .isObject()
    .withMessage('SetResetMPINRequestBody must be an object'),
  
  // Required fields
  body('ChangeMPINRequest.SetResetMPINRequestBody.customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.bank')
    .notEmpty()
    .withMessage('bank is required')
    .isString()
    .withMessage('bank must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.txnId')
    .notEmpty()
    .withMessage('txnId is required')
    .isString()
    .withMessage('txnId must be a string'),
  
  // Account validation
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac')
    .notEmpty()
    .withMessage('account (ac) is required')
    .isObject()
    .withMessage('account (ac) must be an object'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac.accRefNumber')
    .notEmpty()
    .withMessage('account reference number is required')
    .isString()
    .withMessage('account reference number must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac.name')
    .notEmpty()
    .withMessage('account name is required')
    .isString()
    .withMessage('account name must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac.ifsc')
    .notEmpty()
    .withMessage('IFSC code is required')
    .isString()
    .withMessage('IFSC code must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac.maskedAccnumber')
    .notEmpty()
    .withMessage('masked account number is required')
    .isString()
    .withMessage('masked account number must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac.status')
    .notEmpty()
    .withMessage('account status is required')
    .isString()
    .withMessage('account status must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac.type')
    .notEmpty()
    .withMessage('account type is required')
    .isString()
    .withMessage('account type must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac.vpa')
    .notEmpty()
    .withMessage('VPA is required')
    .isString()
    .withMessage('VPA must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.ac.aeba')
    .notEmpty()
    .withMessage('AEBA flag is required')
    .isString()
    .withMessage('AEBA flag must be a string'),
  
  // Credential validation for existing MPIN
  body('ChangeMPINRequest.SetResetMPINRequestBody.cred')
    .notEmpty()
    .withMessage('credentials (cred) are required')
    .isObject()
    .withMessage('credentials (cred) must be an object'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.cred.type')
    .notEmpty()
    .withMessage('credential type is required')
    .isString()
    .withMessage('credential type must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.cred.subType')
    .notEmpty()
    .withMessage('credential subType is required')
    .isString()
    .withMessage('credential subType must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.cred.data')
    .notEmpty()
    .withMessage('credential data is required')
    .isObject()
    .withMessage('credential data must be an object'),
  
  // Credential validation for new MPIN
  body('ChangeMPINRequest.SetResetMPINRequestBody.newcred')
    .notEmpty()
    .withMessage('new credentials (newcred) are required')
    .isObject()
    .withMessage('new credentials (newcred) must be an object'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.newcred.type')
    .notEmpty()
    .withMessage('new credential type is required')
    .isString()
    .withMessage('new credential type must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.newcred.subType')
    .notEmpty()
    .withMessage('new credential subType is required')
    .isString()
    .withMessage('new credential subType must be a string'),
  
  body('ChangeMPINRequest.SetResetMPINRequestBody.newcred.data')
    .notEmpty()
    .withMessage('new credential data is required')
    .isObject()
    .withMessage('new credential data must be an object'),
  
  // Device validation
  body('ChangeMPINRequest.SetResetMPINRequestBody.device')
    .notEmpty()
    .withMessage('device information is required')
    .isObject()
    .withMessage('device information must be an object'),
  
  validate
];

/**
 * Validation rules for UPI Customer De-Registration Request
 */
const customerDeregistrationValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Optional headers
  header('X-AXIS-serviceRequestId')
    .optional()
    .isString()
    .withMessage('X-AXIS-serviceRequestId must be a string'),
  
  header('X-AXIS-serviceRequestVersion')
    .optional()
    .isString()
    .withMessage('X-AXIS-serviceRequestVersion must be a string'),
  
  header('X-AXIS-channelId')
    .optional()
    .isString()
    .withMessage('X-AXIS-channelId must be a string'),
  
  header('X-Axis-requestUUID')
    .optional()
    .isString()
    .withMessage('X-Axis-requestUUID must be a string'),
  
  // Query parameters
  query('customerId')
    .optional()
    .isString()
    .withMessage('customerId must be a string'),
  
  query('applicationId')
    .optional()
    .isString()
    .withMessage('applicationId must be a string'),
  
  validate
];

/**
 * Validation rules for UPI Remove Accounts Request
 */
const removeAccountValidation = [
  // Test ID header validation
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Optional headers
  header('X-AXIS-serviceRequestId')
    .optional()
    .isString()
    .withMessage('X-AXIS-serviceRequestId must be a string'),
  
  header('X-AXIS-serviceRequestVersion')
    .optional()
    .isString()
    .withMessage('X-AXIS-serviceRequestVersion must be a string'),
  
  header('X-AXIS-channelId')
    .optional()
    .isString()
    .withMessage('X-AXIS-channelId must be a string'),
  
  header('X-Axis-requestUUID')
    .optional()
    .isString()
    .withMessage('X-Axis-requestUUID must be a string'),
  
  // Query parameters
  query('customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  query('accountNumber')
    .optional()
    .isString()
    .withMessage('accountNumber must be a string'),
  
  query('applicationId')
    .optional()
    .isString()
    .withMessage('applicationId must be a string'),
  
  validate
];

module.exports = {
  payRequestValidation,
  collectRequestValidation,
  collectApproveRequestValidation,
  collectDeclineRequestValidation,
  selfPayRequestValidation,
  transactionStatusValidation,
  transactionHistoryValidation,
  balanceInquiryValidation,
  pendingTransactionListValidation,
  changeMPINValidation,
  customerDeregistrationValidation,
  removeAccountValidation
}; 