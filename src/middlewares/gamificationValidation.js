const { body } = require('express-validator');
const { validate } = require('./validateInput');

/**
 * Validation rules for receiver API (transaction details)
 */
const receiveTransactionValidation = [
  // Transaction amount validation
  body('amount')
    .notEmpty()
    .withMessage('Transaction amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  
  // Payment type validation (currently only 'merchant' is accepted)
  body('paymentType')
    .notEmpty()
    .withMessage('Payment type is required')
    .equals('merchant')
    .withMessage('Currently only merchant payment type is supported'),
  
  // Customer ID validation
  body('customerId')
    .notEmpty()
    .withMessage('Customer ID is required')
    .isString()
    .withMessage('Customer ID must be a string'),
  
  // Transaction ID validation
  body('transactionId')
    .notEmpty()
    .withMessage('Transaction ID is required')
    .isString()
    .withMessage('Transaction ID must be a string'),
  
  // Reference ID validation (8-10 digit unique identifier)
  body('referenceId')
    .notEmpty()
    .withMessage('Reference ID is required')
    .isString()
    .withMessage('Reference ID must be a string')
    .matches(/^\d{8,10}$/)
    .withMessage('Reference ID must be 8-10 digits'),
  
  validate
];

/**
 * Validation rules for sender API (game results)
 */
const recordGameScoreValidation = [
  // Customer ID validation
  body('customerId')
    .notEmpty()
    .withMessage('Customer ID is required')
    .isString()
    .withMessage('Customer ID must be a string'),
  
  // Reference ID validation (8-10 digit unique identifier)
  body('referenceId')
    .notEmpty()
    .withMessage('Reference ID is required')
    .isString()
    .withMessage('Reference ID must be a string')
    .matches(/^\d{8,10}$/)
    .withMessage('Reference ID must be 8-10 digits'),
  
  // Points earned validation
  body('pointsEarned')
    .notEmpty()
    .withMessage('Points earned (final rushes) are required')
    .isInt({ min: 0 })
    .withMessage('Points earned must be a non-negative integer'),
  
  validate
];

module.exports = {
  receiveTransactionValidation,
  recordGameScoreValidation
}; 