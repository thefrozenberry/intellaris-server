const { body, param, query, validationResult } = require('express-validator');
const { ApiError } = require('./errorHandler');

/**
 * Middleware to check for validation errors
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.badRequest('Validation error', errors.array()));
  }
  next();
};

/**
 * Validation rules for user registration
 */
const registerUserValidation = [
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),
  
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email address'),
  
  body('userType')
    .optional()
    .isIn(['CUSTOMER', 'MERCHANT']).withMessage('User type must be either CUSTOMER or MERCHANT'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Date of birth must be a valid date'),
  
  body('gender')
    .optional()
    .isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).withMessage('Invalid gender value'),
  
  body('nationality')
    .optional()
    .isString().withMessage('Nationality must be a string'),
  
  body('addresses')
    .optional()
    .isArray().withMessage('Addresses must be an array'),
  
  body('addresses.*.addressType')
    .optional()
    .isString().withMessage('Address type must be a string'),
  
  body('addresses.*.addressLine1')
    .optional()
    .isString().withMessage('Address line 1 must be a string'),
  
  body('addresses.*.city')
    .optional()
    .isString().withMessage('City must be a string'),
  
  body('addresses.*.state')
    .optional()
    .isString().withMessage('State must be a string'),
  
  body('addresses.*.postalCode')
    .optional()
    .isString().withMessage('Postal code must be a string'),
  
  body('addresses.*.country')
    .optional()
    .isString().withMessage('Country must be a string'),
  
  body('preferredLanguage')
    .optional()
    .isString().withMessage('Preferred language must be a string'),
  
  validateRequest
];

/**
 * Validation rules for updating user information
 */
const updateUserValidation = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email address'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Date of birth must be a valid date'),
  
  body('gender')
    .optional()
    .isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).withMessage('Invalid gender value'),
  
  body('nationality')
    .optional()
    .isString().withMessage('Nationality must be a string'),
  
  body('addresses')
    .optional()
    .isArray().withMessage('Addresses must be an array'),
  
  body('addresses.*.id')
    .optional()
    .isString().withMessage('Address ID must be a string'),
  
  body('addresses.*.addressType')
    .optional()
    .isString().withMessage('Address type must be a string'),
  
  body('addresses.*.addressLine1')
    .optional()
    .isString().withMessage('Address line 1 must be a string'),
  
  body('addresses.*.city')
    .optional()
    .isString().withMessage('City must be a string'),
  
  body('addresses.*.state')
    .optional()
    .isString().withMessage('State must be a string'),
  
  body('addresses.*.postalCode')
    .optional()
    .isString().withMessage('Postal code must be a string'),
  
  body('addresses.*.country')
    .optional()
    .isString().withMessage('Country must be a string'),
  
  body('preferences')
    .optional()
    .isObject().withMessage('Preferences must be an object'),
  
  body('preferences.preferredLanguage')
    .optional()
    .isString().withMessage('Preferred language must be a string'),
  
  body('preferences.notificationEnabled')
    .optional()
    .isBoolean().withMessage('Notification enabled must be a boolean'),
  
  body('preferences.emailNotifications')
    .optional()
    .isBoolean().withMessage('Email notifications must be a boolean'),
  
  body('preferences.smsNotifications')
    .optional()
    .isBoolean().withMessage('SMS notifications must be a boolean'),
  
  body('preferences.pushNotifications')
    .optional()
    .isBoolean().withMessage('Push notifications must be a boolean'),
  
  validateRequest
];

/**
 * Validation rules for getting user by identifier
 */
const getUserByIdentifierValidation = [
  param('identifier')
    .notEmpty().withMessage('Identifier is required'),
  
  validateRequest
];

/**
 * Validation rules for adding bank account
 */
const addBankAccountValidation = [
  body('accountNumber')
    .notEmpty().withMessage('Account number is required')
    .isString().withMessage('Account number must be a string'),
  
  body('ifscCode')
    .notEmpty().withMessage('IFSC code is required')
    .isString().withMessage('IFSC code must be a string')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format'),
  
  body('bankName')
    .notEmpty().withMessage('Bank name is required')
    .isString().withMessage('Bank name must be a string'),
  
  body('accountHolderName')
    .notEmpty().withMessage('Account holder name is required')
    .isString().withMessage('Account holder name must be a string'),
  
  body('isPrimary')
    .optional()
    .isBoolean().withMessage('Is primary must be a boolean'),
  
  validateRequest
];

/**
 * Validation rules for adding virtual payment address (VPA)
 */
const addVpaValidation = [
  body('vpa')
    .notEmpty().withMessage('VPA is required')
    .isString().withMessage('VPA must be a string')
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/).withMessage('Invalid VPA format'),
  
  body('bankAccountId')
    .optional()
    .isString().withMessage('Bank account ID must be a string'),
  
  body('isPrimary')
    .optional()
    .isBoolean().withMessage('Is primary must be a boolean'),
  
  validateRequest
];

/**
 * Validation rules for adding card
 */
const addCardValidation = [
  body('cardType')
    .notEmpty().withMessage('Card type is required')
    .isIn(['DEBIT', 'CREDIT']).withMessage('Card type must be either DEBIT or CREDIT'),
  
  body('cardNumber')
    .notEmpty().withMessage('Card number is required')
    .isString().withMessage('Card number must be a string')
    .matches(/^\d{16}$/).withMessage('Card number must be 16 digits'),
  
  body('expiryMonth')
    .notEmpty().withMessage('Expiry month is required')
    .isInt({ min: 1, max: 12 }).withMessage('Expiry month must be between 1 and 12'),
  
  body('expiryYear')
    .notEmpty().withMessage('Expiry year is required')
    .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 20 })
    .withMessage(`Expiry year must be between ${new Date().getFullYear()} and ${new Date().getFullYear() + 20}`),
  
  body('nameOnCard')
    .notEmpty().withMessage('Name on card is required')
    .isString().withMessage('Name on card must be a string'),
  
  body('bankName')
    .notEmpty().withMessage('Bank name is required')
    .isString().withMessage('Bank name must be a string'),
  
  body('isPrimary')
    .optional()
    .isBoolean().withMessage('Is primary must be a boolean'),
  
  validateRequest
];

/**
 * Validation rules for document upload URL request
 */
const documentUploadValidation = [
  body('documentType')
    .notEmpty().withMessage('Document type is required')
    .isIn(['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID', 'SELFIE', 'PROFILE_PHOTO', 'OTHER'])
    .withMessage('Invalid document type'),
  
  body('originalFilename')
    .notEmpty().withMessage('Original filename is required')
    .isString().withMessage('Original filename must be a string'),
  
  body('contentType')
    .notEmpty().withMessage('Content type is required')
    .isString().withMessage('Content type must be a string')
    .matches(/^(image\/(jpeg|png|jpg)|application\/pdf)$/)
    .withMessage('Content type must be image/jpeg, image/png, image/jpg, or application/pdf'),
  
  body('documentNumber')
    .optional()
    .isString().withMessage('Document number must be a string'),
  
  validateRequest
];

/**
 * Validation rules for getting users (admin panel)
 */
const getUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .isString().withMessage('Search query must be a string'),
  
  query('userType')
    .optional()
    .isIn(['CUSTOMER', 'MERCHANT']).withMessage('User type must be either CUSTOMER or MERCHANT'),
  
  query('kycStatus')
    .optional()
    .isIn(['PENDING', 'VERIFIED', 'REJECTED']).withMessage('KYC status must be PENDING, VERIFIED, or REJECTED'),
  
  validateRequest
];

/**
 * Validation rules for spending analytics
 */
const spendingAnalyticsValidation = [
  query('period')
    .optional()
    .isIn(['day', 'week', 'month', 'year']).withMessage('Period must be day, week, month, or year'),
  
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),
  
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid date'),
  
  query('groupBy')
    .optional()
    .isIn(['category', 'day', 'week', 'month']).withMessage('Group by must be category, day, week, or month'),
  
  validateRequest
];

module.exports = {
  registerUserValidation,
  updateUserValidation,
  getUserByIdentifierValidation,
  addBankAccountValidation,
  addVpaValidation,
  addCardValidation,
  documentUploadValidation,
  getUsersValidation,
  spendingAnalyticsValidation
}; 