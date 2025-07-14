const { body, query, header } = require('express-validator');

/**
 * Validation rules for UPI customer registration
 */
const registerCustomerValidation = [
  // Test ID validation (optional)
  query('testId')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Test ID must be a number between 1 and 99'),
  
  // Basic customer information
  body('name')
    .notEmpty()
    .withMessage('Customer name is required')
    .isString()
    .withMessage('Name must be a string'),
  
  body('mobileNumber')
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9]{10,12}$/)
    .withMessage('Mobile number must be 10-12 digits'),
  
  body('vpa')
    .optional()
    .isString()
    .withMessage('VPA must be a string'),
  
  body('type')
    .optional()
    .isIn(['Customer', 'Merchant'])
    .withMessage('Type must be either Customer or Merchant'),
  
  // Device information validation (optional fields)
  body('deviceInfo')
    .optional()
    .isObject()
    .withMessage('Device info must be an object'),
  
  body('deviceInfo.app')
    .optional()
    .isString()
    .withMessage('App name must be a string'),
  
  body('deviceInfo.os')
    .optional()
    .isString()
    .withMessage('OS must be a string'),
  
  body('deviceInfo.mobile')
    .optional()
    .matches(/^[0-9]{10,12}$/)
    .withMessage('Device mobile number must be 10-12 digits'),
  
  body('deviceInfo.geocode')
    .optional()
    .isString()
    .withMessage('Geocode must be a string'),
  
  body('deviceInfo.location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
  
  body('deviceInfo.ip')
    .optional()
    .isIP()
    .withMessage('IP must be a valid IP address'),
];

/**
 * Validation rules for UPI OTP request
 */
const requestOtpValidation = [
  // Test ID validation (optional)
  query('testId')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Test ID must be a number between 1 and 99'),
    
  // Basic OTP request information
  body('mobileNumber')
    .optional()
    .matches(/^[0-9]{10,12}$/)
    .withMessage('Mobile number must be 10-12 digits'),
  
  body('customerId')
    .optional()
    .matches(/^[0-9]{10,12}$/)
    .withMessage('Customer ID must be 10-12 digits'),
    
  body('bankId')
    .optional()
    .isString()
    .withMessage('Bank ID must be a string'),
    
  body('txnId')
    .optional()
    .isString()
    .withMessage('Transaction ID must be a string'),
    
  // Device information validation (optional fields)
  body('device')
    .optional()
    .isObject()
    .withMessage('Device info must be an object'),
    
  // Account information validation (optional fields)
  body('ac')
    .optional()
    .isObject()
    .withMessage('Account info must be an object'),
    
  body('ac.accRefNumber')
    .optional()
    .isString()
    .withMessage('Account reference number must be a string'),
    
  body('ac.ifsc')
    .optional()
    .isString()
    .withMessage('IFSC code must be a string'),
    
  body('card')
    .optional()
    .custom(value => {
      // Accept either a number or a string that can be converted to a number
      return !isNaN(Number(value));
    })
    .withMessage('Card information must be a valid number'),
    
  body('expiry')
    .optional()
    .isString()
    .matches(/^(0[1-9]|1[0-2])\/20[0-9]{2}$/)
    .withMessage('Expiry must be in format MM/YYYY'),
];

/**
 * Validation rules for UPI Fetch Customer Accounts
 */
const fetchCustomerAccountsValidation = [
  // Test ID header validation (required)
  header('X-AXIS-TEST-ID')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Query parameter for test ID (alternative to header)
  query('testId')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Test ID must be a number between 1 and 99'),
  
  // Request validation
  body('FetchCustomerAccountsRequest')
    .notEmpty()
    .withMessage('FetchCustomerAccountsRequest is required')
    .isObject()
    .withMessage('FetchCustomerAccountsRequest must be an object'),
  
  // SubHeader validation
  body('FetchCustomerAccountsRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('FetchCustomerAccountsRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('FetchCustomerAccountsRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('FetchCustomerAccountsRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('FetchCustomerAccountsRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // FetchCustomerAccountsRequestBody validation
  body('FetchCustomerAccountsRequest.FetchCustomerAccountsRequestBody')
    .notEmpty()
    .withMessage('FetchCustomerAccountsRequestBody is required')
    .isObject()
    .withMessage('FetchCustomerAccountsRequestBody must be an object'),
  
  body('FetchCustomerAccountsRequest.FetchCustomerAccountsRequestBody.bankId')
    .optional()
    .isString()
    .withMessage('bankId must be a string'),
  
  body('FetchCustomerAccountsRequest.FetchCustomerAccountsRequestBody.customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  body('FetchCustomerAccountsRequest.FetchCustomerAccountsRequestBody.txnId')
    .optional()
    .isString()
    .withMessage('txnId must be a string'),
  
  // Device information validation
  body('FetchCustomerAccountsRequest.FetchCustomerAccountsRequestBody.device')
    .notEmpty()
    .withMessage('device is required')
    .isObject()
    .withMessage('device must be an object'),
  
  body('FetchCustomerAccountsRequest.FetchCustomerAccountsRequestBody.device.mobile')
    .optional()
    .isString()
    .withMessage('device.mobile must be a string'),
];

/**
 * Validation rules for UPI Get Token
 */
const getTokenValidation = [
  // Test ID header validation (required)
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Headers validation
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
  
  // Query parameters validation
  query('customerId')
    .notEmpty()
    .withMessage('customerId is required')
    .isString()
    .withMessage('customerId must be a string'),
  
  query('type')
    .notEmpty()
    .withMessage('type is required')
    .isIn(['INITIAL', 'ROTATE'])
    .withMessage('type must be either INITIAL or ROTATE'),
  
  query('challenge')
    .notEmpty()
    .withMessage('challenge is required')
    .isString()
    .withMessage('challenge must be a string'),
];

/**
 * Validation rules for UPI Set VPA
 */
const setVpaValidation = [
  // Test ID header validation (required)
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Request body validation
  body('SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  body('SetVPARequestBody')
    .notEmpty()
    .withMessage('SetVPARequestBody is required')
    .isObject()
    .withMessage('SetVPARequestBody must be an object'),
  
  body('SetVPARequestBody.setVpas')
    .notEmpty()
    .withMessage('setVpas is required')
    .isArray()
    .withMessage('setVpas must be an array'),
  
  body('SetVPARequestBody.setVpas.*.account')
    .notEmpty()
    .withMessage('account is required for each VPA entry')
    .isString()
    .withMessage('account must be a string'),
  
  body('SetVPARequestBody.setVpas.*.customerid')
    .notEmpty()
    .withMessage('customerid is required for each VPA entry')
    .isString()
    .withMessage('customerid must be a string'),
  
  body('SetVPARequestBody.setVpas.*.defaultvpa')
    .notEmpty()
    .withMessage('defaultvpa is required for each VPA entry')
    .isString()
    .withMessage('defaultvpa must be a string')
    .isIn(['Y', 'N'])
    .withMessage('defaultvpa must be either Y or N'),
  
  body('SetVPARequestBody.setVpas.*.ifsc')
    .notEmpty()
    .withMessage('ifsc is required for each VPA entry')
    .isString()
    .withMessage('ifsc must be a string'),
  
  body('SetVPARequestBody.setVpas.*.newvpa')
    .notEmpty()
    .withMessage('newvpa is required for each VPA entry')
    .isString()
    .withMessage('newvpa must be a string'),
  
  body('SetVPARequestBody.setVpas.*.oldvpa')
    .optional()
    .isString()
    .withMessage('oldvpa must be a string')
];

/**
 * Validation rules for UPI VPA Availability
 */
const vpaAvailabilityValidation = [
  // Test ID header validation (required)
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Headers validation
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
  
  // Query parameters validation - at least one required
  query()
    .custom((value, { req }) => {
      const hasCustomerId = !!req.query.customerId;
      const hasVpa = !!req.query.vpa;
      
      if (!hasCustomerId && !hasVpa) {
        throw new Error('Either customerId or vpa must be provided');
      }
      return true;
    }),
  
  query('customerId')
    .optional()
    .isString()
    .withMessage('customerId must be a string'),
  
  query('vpa')
    .optional()
    .isString()
    .withMessage('vpa must be a string'),
  
  query('applicationID')
    .optional()
    .isString()
    .withMessage('applicationID must be a string')
];

/**
 * Validation rules for UPI Verify VPA
 */
const verifyVpaValidation = [
  // Test ID header validation (required)
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Request body validation
  body('SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  body('VerifyVPARequestBody')
    .notEmpty()
    .withMessage('VerifyVPARequestBody is required')
    .isObject()
    .withMessage('VerifyVPARequestBody must be an object'),
  
  body('VerifyVPARequestBody.customerid')
    .notEmpty()
    .withMessage('customerid is required')
    .isString()
    .withMessage('customerid must be a string'),
  
  body('VerifyVPARequestBody.vpa')
    .notEmpty()
    .withMessage('vpa is required')
    .isString()
    .withMessage('vpa must be a string'),
  
  // Device information validation
  body('VerifyVPARequestBody.device')
    .notEmpty()
    .withMessage('device information is required')
    .isObject()
    .withMessage('device must be an object'),
  
  body('VerifyVPARequestBody.device.app')
    .notEmpty()
    .withMessage('device.app is required')
    .isString()
    .withMessage('device.app must be a string'),
  
  body('VerifyVPARequestBody.device.mobile')
    .notEmpty()
    .withMessage('device.mobile is required')
    .isString()
    .withMessage('device.mobile must be a string'),
  
  // Optional device fields
  body('VerifyVPARequestBody.device.capability')
    .optional()
    .isString()
    .withMessage('device.capability must be a string'),
  
  body('VerifyVPARequestBody.device.id')
    .optional()
    .isString()
    .withMessage('device.id must be a string'),
  
  body('VerifyVPARequestBody.device.ip')
    .optional()
    .isString()
    .withMessage('device.ip must be a string'),
  
  body('VerifyVPARequestBody.device.location')
    .optional()
    .isString()
    .withMessage('device.location must be a string'),
  
  body('VerifyVPARequestBody.device.os')
    .optional()
    .isString()
    .withMessage('device.os must be a string'),
  
  body('VerifyVPARequestBody.device.type')
    .optional()
    .isString()
    .withMessage('device.type must be a string'),
  
  // Payer information validation
  body('VerifyVPARequestBody.payerInfo')
    .optional()
    .isObject()
    .withMessage('payerInfo must be an object'),
  
  body('VerifyVPARequestBody.payerInfo.accountnumber')
    .optional()
    .isString()
    .withMessage('payerInfo.accountnumber must be a string'),
  
  body('VerifyVPARequestBody.payerInfo.mcc')
    .optional()
    .isString()
    .withMessage('payerInfo.mcc must be a string'),
  
  body('VerifyVPARequestBody.payerInfo.name')
    .optional()
    .isString()
    .withMessage('payerInfo.name must be a string'),
  
  body('VerifyVPARequestBody.payerInfo.payervpa')
    .optional()
    .isString()
    .withMessage('payerInfo.payervpa must be a string')
];

/**
 * Validation rules for UPI Set Reset MPIN
 */
const setResetMpinValidation = [
  // Test ID header validation (required)
  header('X-AXIS-TEST-ID')
    .notEmpty()
    .withMessage('X-AXIS-TEST-ID is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('X-AXIS-TEST-ID must be a number between 1 and 99'),
  
  // Request body validation - SubHeader
  body('SetResetMPINRequest.SubHeader')
    .notEmpty()
    .withMessage('SubHeader is required')
    .isObject()
    .withMessage('SubHeader must be an object'),
  
  body('SetResetMPINRequest.SubHeader.requestUUID')
    .notEmpty()
    .withMessage('requestUUID is required')
    .isString()
    .withMessage('requestUUID must be a string'),
  
  body('SetResetMPINRequest.SubHeader.serviceRequestId')
    .notEmpty()
    .withMessage('serviceRequestId is required')
    .isString()
    .withMessage('serviceRequestId must be a string'),
  
  body('SetResetMPINRequest.SubHeader.serviceRequestVersion')
    .notEmpty()
    .withMessage('serviceRequestVersion is required')
    .isString()
    .withMessage('serviceRequestVersion must be a string'),
  
  body('SetResetMPINRequest.SubHeader.channelId')
    .notEmpty()
    .withMessage('channelId is required')
    .isString()
    .withMessage('channelId must be a string'),
  
  // Request body validation - SetResetMPINRequestBody
  body('SetResetMPINRequest.SetResetMPINRequestBody')
    .notEmpty()
    .withMessage('SetResetMPINRequestBody is required')
    .isObject()
    .withMessage('SetResetMPINRequestBody must be an object'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.customerid')
    .notEmpty()
    .withMessage('customerid is required')
    .isString()
    .withMessage('customerid must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.card')
    .notEmpty()
    .withMessage('card is required')
    .isString()
    .withMessage('card must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.expiry')
    .notEmpty()
    .withMessage('expiry is required')
    .isString()
    .withMessage('expiry must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.txnId')
    .notEmpty()
    .withMessage('txnId is required')
    .isString()
    .withMessage('txnId must be a string'),
  
  // Optional fields validation
  body('SetResetMPINRequest.SetResetMPINRequestBody.bank')
    .optional()
    .isString()
    .withMessage('bank must be a string'),
  
  // Account info validation
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac')
    .optional()
    .isObject()
    .withMessage('ac must be an object'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.ifsc')
    .optional()
    .isString()
    .withMessage('ifsc must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.maskedAccnumber')
    .optional()
    .isString()
    .withMessage('maskedAccnumber must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.status')
    .optional()
    .isString()
    .withMessage('status must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.vpa')
    .optional()
    .isString()
    .withMessage('vpa must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.type')
    .optional()
    .isString()
    .withMessage('type must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.accRefNumber')
    .optional()
    .isString()
    .withMessage('accRefNumber must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.name')
    .optional()
    .isString()
    .withMessage('name must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.iin')
    .optional()
    .isString()
    .withMessage('iin must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.ac.aeba')
    .optional()
    .isString()
    .withMessage('aeba must be a string'),
  
  // Device info validation
  body('SetResetMPINRequest.SetResetMPINRequestBody.device')
    .optional()
    .isObject()
    .withMessage('device must be an object'),
  
  // Credential validations - mpincred
  body('SetResetMPINRequest.SetResetMPINRequestBody.mpincred')
    .optional()
    .isObject()
    .withMessage('mpincred must be an object'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.mpincred.data')
    .optional()
    .isObject()
    .withMessage('mpincred.data must be an object'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.mpincred.data.encryptedBase64String')
    .optional()
    .isString()
    .withMessage('mpincred.data.encryptedBase64String must be a string'),
  
  // Credential validations - otpcred
  body('SetResetMPINRequest.SetResetMPINRequestBody.otpcred')
    .optional()
    .isObject()
    .withMessage('otpcred must be an object'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.otpcred.data')
    .optional()
    .isObject()
    .withMessage('otpcred.data must be an object'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.otpcred.data.encryptedBase64String')
    .optional()
    .isString()
    .withMessage('otpcred.data.encryptedBase64String must be a string'),
  
  // Credential validations - atmpincred
  body('SetResetMPINRequest.SetResetMPINRequestBody.atmpincred')
    .optional()
    .isObject()
    .withMessage('atmpincred must be an object'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.atmpincred.data')
    .optional()
    .isObject()
    .withMessage('atmpincred.data must be an object'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.atmpincred.data.encryptedBase64String')
    .optional()
    .isString()
    .withMessage('atmpincred.data.encryptedBase64String must be a string'),
  
  body('SetResetMPINRequest.SetResetMPINRequestBody.regtype')
    .optional()
    .isString()
    .withMessage('regtype must be a string')
];

module.exports = {
  registerCustomerValidation,
  requestOtpValidation,
  fetchCustomerAccountsValidation,
  getTokenValidation,
  setVpaValidation,
  vpaAvailabilityValidation,
  verifyVpaValidation,
  setResetMpinValidation
}; 