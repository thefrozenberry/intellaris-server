const { body, param, validationResult } = require('express-validator');
const { validateInput } = require('./validateInput');
const Joi = require('joi');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * Helper function to validate request using Joi schema
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {void}
 */
const validateRequest = (req, res, next, schema) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return next(new ErrorResponse(errorMessages.join(', '), 400));
  }
  
  next();
};

/**
 * Validation rules for initiating a mandate
 */
exports.validateInitiateMandate = [
  body('Data.CustomerID').notEmpty().withMessage('Customer ID is required'),
  body('Data.txnID').notEmpty().withMessage('Transaction ID is required'),
  body('Data.appid').notEmpty().withMessage('Application ID is required'),
  body('Data.umn').notEmpty().withMessage('UMN is required'),
  body('Data.mandateName').notEmpty().withMessage('Mandate name is required'),
  body('Data.revocable').isIn(['Y', 'N']).withMessage('Revocable must be Y or N'),
  body('Data.shareToPayee').isIn(['Y', 'N']).withMessage('ShareToPayee must be Y or N'),
  body('Data.validityStart').notEmpty().withMessage('Validity start is required'),
  body('Data.validityEnd').notEmpty().withMessage('Validity end is required'),
  body('Data.amountRule').isIn(['EXACT', 'MAX']).withMessage('Amount rule must be EXACT or MAX'),
  body('Data.amountRuleValue').notEmpty().withMessage('Amount rule value is required'),
  body('Data.recurrence').isIn(['ONETIME', 'DAILY', 'WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'HALFYEARLY', 'YEARLY', 'ASPRESENTED'])
    .withMessage('Invalid recurrence pattern'),
  body('Data.ruleType').isIn(['BEFORE', 'ON', 'AFTER']).withMessage('Rule type must be BEFORE, ON, or AFTER'),
  body('Data.payerAddr').notEmpty().withMessage('Payer address is required'),
  body('Data.payerName').notEmpty().withMessage('Payer name is required'),
  body('Data.payeeAddr').notEmpty().withMessage('Payee address is required'),
  body('Data.payeeName').notEmpty().withMessage('Payee name is required'),
  body('Data.executeByPayeePSP').isIn(['Y', 'N']).withMessage('ExecuteByPayeePSP must be Y or N'),
  body('Data.accountDetails').notEmpty().withMessage('Account details are required'),
  body('Data.accountDetails.name').notEmpty().withMessage('Account name is required'),
  body('Data.accountDetails.accRefNumber').notEmpty().withMessage('Account reference number is required'),
  body('Data.accountDetails.maskedAccnumber').notEmpty().withMessage('Masked account number is required'),
  body('Data.accountDetails.ifsc').notEmpty().withMessage('IFSC code is required'),
  body('Data.accountDetails.type').notEmpty().withMessage('Account type is required'),
  body('Data.accountDetails.iin').notEmpty().withMessage('IIN is required'),
  body('Data.creds').notEmpty().withMessage('Credentials are required'),
  body('Data.creds.type').notEmpty().withMessage('Credential type is required'),
  body('Data.creds.subType').notEmpty().withMessage('Credential subtype is required'),
  body('Data.creds.data').notEmpty().withMessage('Credential data is required'),
  body('Data.creds.data.code').notEmpty().withMessage('Credential code is required'),
  body('Data.creds.data.ki').notEmpty().withMessage('Credential ki is required'),
  body('Data.creds.data.encryptedBase64String').notEmpty().withMessage('Encrypted credential is required'),
  body('Data.Device').notEmpty().withMessage('Device information is required'),
  body('Data.initiatedBy').isIn(['PAYER_INITIATED', 'PAYEE_INITIATED']).withMessage('InitiatedBy must be PAYER_INITIATED or PAYEE_INITIATED'),
  body('Risk').notEmpty().withMessage('Risk information is required'),
  validateInput
];

/**
 * Validation rules for executing a mandate
 */
exports.validateExecuteMandate = [
  body('umn').notEmpty().withMessage('UMN is required'),
  body('txnId').notEmpty().withMessage('Transaction ID is required'),
  body('amount').notEmpty().withMessage('Amount is required'),
  validateInput
];

/**
 * Validation rules for revoking a mandate
 */
exports.validateRevokeMandate = [
  body('umn').notEmpty().withMessage('UMN is required'),
  body('reason').notEmpty().withMessage('Reason is required'),
  validateInput
];

/**
 * Validation rules for validating a mandate
 */
exports.validateMandateValidation = [
  body('umn').notEmpty().withMessage('UMN is required'),
  validateInput
];

/**
 * Validation rules for getting mandate details
 */
exports.validateGetMandateDetails = [
  param('umn').notEmpty().withMessage('UMN is required'),
  validateInput
];

/**
 * Validation rules for authorizing a mandate (approve or decline)
 */
exports.validateAuthorizeMandate = [
  body('Data.CustomerID').notEmpty().withMessage('Customer ID is required'),
  body('Data.appId').notEmpty().withMessage('Application ID is required'),
  body('Data.action').isIn(['APPROVE', 'DECLINE']).withMessage('Action must be APPROVE or DECLINE'),
  body('Data.accountDetails').notEmpty().withMessage('Account details are required'),
  body('Data.accountDetails.accRefNumber').notEmpty().withMessage('Account reference number is required'),
  body('Data.accountDetails.accType').notEmpty().withMessage('Account type is required'),
  body('Data.accountDetails.ifsc').notEmpty().withMessage('IFSC code is required'),
  body('Data.accountDetails.maskedAccnumber').notEmpty().withMessage('Masked account number is required'),
  body('Data.accountDetails.mbeba').isIn(['Y', 'N']).withMessage('MBEBA must be Y or N'),
  body('Data.accountDetails.vpa').notEmpty().withMessage('VPA is required'),
  body('Data.accountDetails.name').notEmpty().withMessage('Account name is required'),
  body('Data.accountDetails.type').notEmpty().withMessage('Account type is required'),
  body('Data.creds').notEmpty().withMessage('Credentials are required'),
  body('Data.creds.type').notEmpty().withMessage('Credential type is required'),
  body('Data.creds.subType').notEmpty().withMessage('Credential subtype is required'),
  body('Data.creds.data').notEmpty().withMessage('Credential data is required'),
  body('Data.creds.data.code').notEmpty().withMessage('Credential code is required'),
  body('Data.creds.data.ki').notEmpty().withMessage('Credential ki is required'),
  body('Data.creds.data.encryptedBase64String').notEmpty().withMessage('Encrypted credential is required'),
  body('Data.Device').notEmpty().withMessage('Device information is required'),
  body('Data.Device.mobile').notEmpty().withMessage('Mobile number is required'),
  body('Data.Device.geocode').notEmpty().withMessage('Geocode is required'),
  body('Data.Device.location').notEmpty().withMessage('Location is required'),
  body('Data.Device.ip').notEmpty().withMessage('IP address is required'),
  body('Data.Device.type').notEmpty().withMessage('Device type is required'),
  body('Data.Device.id').notEmpty().withMessage('Device ID is required'),
  body('Data.Device.os').notEmpty().withMessage('Device OS is required'),
  body('Data.Device.app').notEmpty().withMessage('App is required'),
  body('Data.Device.capability').notEmpty().withMessage('Device capability is required'),
  body('Data.umn').notEmpty().withMessage('UMN is required'),
  body('Data.txnID').notEmpty().withMessage('Transaction ID is required'),
  body('Risk').notEmpty().withMessage('Risk information is required'),
  validateInput
];

/**
 * Validation rules for executing a mandate transaction
 */
exports.validateMandateExecuteTransaction = [
  body('Data.customerid').notEmpty().withMessage('Customer ID is required'),
  body('Data.txnid').notEmpty().withMessage('Transaction ID is required'),
  body('Data.appId').notEmpty().withMessage('Application ID is required'),
  body('Data.umn').notEmpty().withMessage('UMN is required'),
  body('Data.remarks').notEmpty().withMessage('Remarks are required'),
  body('Data.validitystart').notEmpty().withMessage('Validity start is required'),
  body('Data.validityend').notEmpty().withMessage('Validity end is required'),
  body('Data.amount').notEmpty().withMessage('Amount is required'),
  body('Data.execute').equals('EXECUTE').withMessage('Execute must be "EXECUTE"'),
  body('Data.device').notEmpty().withMessage('Device information is required'),
  body('Data.device.app').notEmpty().withMessage('App is required'),
  body('Data.device.capability').notEmpty().withMessage('Device capability is required'),
  body('Data.device.gcmid').notEmpty().withMessage('GCMID is required'),
  body('Data.device.geocode').notEmpty().withMessage('Geocode is required'),
  body('Data.device.id').notEmpty().withMessage('Device ID is required'),
  body('Data.device.ip').notEmpty().withMessage('IP address is required'),
  body('Data.device.location').notEmpty().withMessage('Location is required'),
  body('Data.device.mobile').notEmpty().withMessage('Mobile number is required'),
  body('Data.device.os').notEmpty().withMessage('Device OS is required'),
  body('Data.device.type').notEmpty().withMessage('Device type is required'),
  validateInput
];

/**
 * Validate modify mandate request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateModifyMandateRequest = (req, res, next) => {
  const schema = Joi.object({
    Data: Joi.object({
      CustomerID: Joi.string().required().description('Customer Id'),
      txnID: Joi.string().required().description('Transaction ID'),
      appId: Joi.string().required().description('Application Id'),
      umn: Joi.string().required().description('UMN'),
      mandateName: Joi.string().required().description('Name of the mandate'),
      validityStart: Joi.string().required().description('Start time of request validity'),
      validityEnd: Joi.string().required().description('End time of request validity'),
      amountRule: Joi.string().required().valid('MAX', 'EXACT').description('Defines amount rule MAX|EXACT'),
      amountRuleValue: Joi.string().required().description('Amount'),
      recurrence: Joi.string().required().valid(
        'ONETIME', 'DAILY', 'WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 
        'BIMONTHLY', 'QUARTERLY', 'HALFYEARLY', 'YEARLY', 'ASPRESENTED'
      ).description('Defines recurrence pattern'),
      note: Joi.string().required().description('Remarks'),
      executeByPayeePSP: Joi.string().required().valid('Y', 'N').description('Whether transaction will be executed by payee PSP'),
      creds: Joi.object({
        type: Joi.string().required().description('PIN'),
        subType: Joi.string().required().description('MPIN'),
        data: Joi.object({
          code: Joi.string().required().description('NPCI'),
          ki: Joi.string().required().description('20150822'),
          encryptedBase64String: Joi.string().required().description('Encrypted base64 string')
        }).required()
      }).required(),
      Device: Joi.string().required().description('Device information'),
      initiatedBy: Joi.string().required().valid('PAYER_INITIATED', 'PAYEE_INITIATED').description('PAYER_INITIATED | PAYEE_INITIATED')
    }).required(),
    Risk: Joi.object().required()
  });

  validateRequest(req, res, next, schema);
};

/**
 * Validate update mandate request (suspend/activate/revoke)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
exports.validateUpdateMandateRequest = (req, res, next) => {
  const schema = Joi.object({
    Data: Joi.object({
      customerid: Joi.string().required().description('Customer Id'),
      appId: Joi.string().required().description('Application Id'),
      creds: Joi.object({
        type: Joi.string().required().description('PIN'),
        subType: Joi.string().required().description('MPIN'),
        data: Joi.object({
          code: Joi.string().required().description('NPCI'),
          ki: Joi.string().required().description('20150822'),
          encryptedBase64String: Joi.string().required().description('Encrypted base64 string')
        }).required()
      }).required(),
      Device: Joi.string().required().description('Device information'),
      newstate: Joi.string().required().valid('SUSPEND', 'ACTIVATE', 'REVOKE').description('SUSPEND|ACTIVATE|REVOKE'),
      txnID: Joi.string().required().description('Transaction ID'),
      umn: Joi.string().required().description('UMN')
    }).required(),
    Risk: Joi.object().required()
  });

  validateRequest(req, res, next, schema);
};

/**
 * Validation rules for fetching mandate details
 */
exports.validateGetMandateRequest = [
  body('Data.customerid').notEmpty().withMessage('Customer ID is required'),
  body('Data.txnid').notEmpty().withMessage('Transaction ID is required'),
  body('Data.appid').notEmpty().withMessage('Application ID is required'),
  body('Data.umn').notEmpty().withMessage('UMN is required'),
  validateInput
];

/**
 * Validation rules for fetching mandate transactions
 */
exports.validateGetMandateTransactionsRequest = [
  body('Data.customerid').notEmpty().withMessage('Customer ID is required'),
  body('Data.appid').notEmpty().withMessage('Application ID is required'),
  // txnid is optional as per the schema
  validateInput
]; 