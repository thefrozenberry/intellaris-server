const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const {
  registerUserValidation,
  updateUserValidation,
  getUserByIdentifierValidation,
  addBankAccountValidation,
  addVpaValidation,
  addCardValidation,
  documentUploadValidation,
  getUsersValidation,
  spendingAnalyticsValidation
} = require('../middlewares/userValidation');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  }
});

/**
 * User routes for managing user accounts and data
 */

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  registerUserValidation,
  userController.registerUser
);

/**
 * @route   PUT /api/users
 * @desc    Update user information
 * @access  Private
 */
router.put(
  '/',
  authenticate,
  updateUserValidation,
  userController.updateUser
);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  userController.getUserProfile
);

/**
 * @route   GET /api/users/:identifier
 * @desc    Get user by ID, mobile, or customer ID (admin only)
 * @access  Private, Admin
 */
router.get(
  '/:identifier',
  authenticate,
  isAdmin,
  getUserByIdentifierValidation,
  userController.getUserByIdentifier
);

/**
 * @route   POST /api/users/bank-accounts
 * @desc    Add bank account for user
 * @access  Private
 */
router.post(
  '/bank-accounts',
  authenticate,
  addBankAccountValidation,
  userController.addBankAccount
);

/**
 * @route   POST /api/users/vpa
 * @desc    Add VPA for user
 * @access  Private
 */
router.post(
  '/vpa',
  authenticate,
  addVpaValidation,
  userController.addVpa
);

/**
 * @route   POST /api/users/cards
 * @desc    Add card for user
 * @access  Private
 */
router.post(
  '/cards',
  authenticate,
  addCardValidation,
  userController.addCard
);

/**
 * @route   POST /api/users/documents
 * @desc    Upload document
 * @access  Private
 */
router.post(
  '/documents',
  authenticate,
  upload.single('document'),
  userController.uploadDocument
);

/**
 * @route   POST /api/users/documents/upload-url
 * @desc    Generate upload URL for document (deprecated)
 * @access  Private
 */
router.post(
  '/documents/upload-url',
  authenticate,
  documentUploadValidation,
  userController.getDocumentUploadUrl
);

/**
 * @route   GET /api/users
 * @desc    Get users for admin panel
 * @access  Private, Admin
 */
router.get(
  '/',
  authenticate,
  isAdmin,
  getUsersValidation,
  userController.getUsers
);

/**
 * @route   GET /api/users/analytics/spending
 * @desc    Get spending analytics for user
 * @access  Private
 */
router.get(
  '/analytics/spending',
  authenticate,
  spendingAnalyticsValidation,
  userController.getSpendingAnalytics
);

module.exports = router; 