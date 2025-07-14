const express = require('express');
const router = express.Router();

// Import controllers
const {
    getProfile,
    updateProfile,
    updateProfileImage,
    updateDocuments,
    uploadDocument,
    updateBanking,
    getProfileCompletion,
    updateRegulatoryConsents
} = require('../../controllers/employee/profileController');

/**
 * @route   GET /api/v1/employee/profile
 * @desc    Get employee profile
 * @access  Private
 */
router.get('/', getProfile);

/**
 * @route   PUT /api/v1/employee/profile
 * @desc    Update employee profile
 * @access  Private
 */
router.put('/', updateProfile);

/**
 * @route   GET /api/v1/employee/profile/completion
 * @desc    Get profile completion status
 * @access  Private
 */
router.get('/completion', getProfileCompletion);

/**
 * @route   PUT /api/v1/employee/profile/image
 * @desc    Update profile image URL
 * @access  Private
 */
router.put('/image', updateProfileImage);

/**
 * @route   PUT /api/v1/employee/profile/documents
 * @desc    Update documents information
 * @access  Private
 */
router.put('/documents', updateDocuments);

/**
 * @route   POST /api/v1/employee/profile/documents/upload
 * @desc    Upload document
 * @access  Private
 */
router.post('/documents/upload', uploadDocument);

/**
 * @route   PUT /api/v1/employee/profile/banking
 * @desc    Update banking information
 * @access  Private
 */
router.put('/banking', updateBanking);

/**
 * @route   PUT /api/v1/employee/profile/consents
 * @desc    Update regulatory consents
 * @access  Private
 */
router.put('/consents', updateRegulatoryConsents);

module.exports = router; 