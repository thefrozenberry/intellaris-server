const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Employee = require('../../models/employee/Employee');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), 'uploads', 'employee', 'profiles');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const employeeId = req.employee.id;
        const extension = path.extname(file.originalname);
        cb(null, `${employeeId}_profile_${Date.now()}${extension}`);
    }
});

const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), 'uploads', 'employee', 'documents');
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const employeeId = req.employee.id;
        const documentType = req.body.documentType || 'document';
        const extension = path.extname(file.originalname);
        cb(null, `${employeeId}_${documentType}_${Date.now()}${extension}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

const documentUpload = multer({ 
    storage: documentStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed!'));
        }
    }
});

/**
 * @desc    Get employee profile
 * @route   GET /api/v1/employee/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
    try {
        const employee = await Employee.findOne({ id: req.employee.id });
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: 'EMPLOYEE_NOT_FOUND',
                message: 'Employee profile not found'
            });
        }

        // Remove sensitive fields
        const profileData = employee.toObject();
        delete profileData.accessCode;
        delete profileData.passwordHash;
        delete profileData.loginAttempts;
        delete profileData.lockUntil;

        res.json({
            success: true,
            data: {
                profile: profileData
            },
            message: 'Profile retrieved successfully'
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'PROFILE_FETCH_FAILED',
            message: 'Failed to retrieve profile'
        });
    }
});

/**
 * @desc    Update employee profile
 * @route   PUT /api/v1/employee/profile
 * @access  Private
 */
const updateProfile = [
    // Validation rules
    body('fullName').optional().isLength({ min: 2, max: 255 }).withMessage('Full name must be between 2 and 255 characters'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('phoneNumber').optional().matches(/^\+91\s\d{5}\s\d{5}$/).withMessage('Phone number must be in format: +91 XXXXX XXXXX'),
    body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
    body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('maritalStatus').optional().isIn(['Single', 'Married', 'Divorced', 'Widowed']).withMessage('Invalid marital status'),
    body('designation').optional().isLength({ min: 2, max: 255 }).withMessage('Designation must be between 2 and 255 characters'),
    body('profileImage').optional().isURL().withMessage('Profile image must be a valid URL'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        try {
            const employee = await Employee.findOne({ id: req.employee.id });
            
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee profile not found'
                });
            }

            // Update allowed fields
            const allowedUpdates = [
                'fullName', 'email', 'phoneNumber', 'homeAddress', 'dateOfBirth', 
                'gender', 'maritalStatus', 'designation', 'department', 
                'reportingManager', 'employmentType', 'workMode', 'profileImage'
            ];

            allowedUpdates.forEach(field => {
                if (req.body[field] !== undefined) {
                    employee[field] = req.body[field];
                }
            });

            await employee.save();

            res.json({
                success: true,
                data: {
                    profileCompletion: employee.profileCompletion,
                    updatedFields: Object.keys(req.body)
                },
                message: 'Profile updated successfully'
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: 'PROFILE_UPDATE_FAILED',
                message: 'Failed to update profile'
            });
        }
    })
];

/**
 * @desc    Update profile image URL
 * @route   PUT /api/v1/employee/profile/image
 * @access  Private
 */
const updateProfileImage = [
    body('profileImageUrl')
        .isURL()
        .withMessage('Profile image URL must be a valid URL')
        .contains('cloudinary.com')
        .withMessage('Profile image must be a Cloudinary URL'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        try {
            const { profileImageUrl } = req.body;
            
            const employee = await Employee.findOne({ id: req.employee.id });
            
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee profile not found'
                });
            }

            // Update profile image URL
            employee.profileImage = profileImageUrl;
            await employee.save();

            res.json({
                success: true,
                data: {
                    profileImage: employee.profileImage,
                    updatedAt: new Date()
                },
                message: 'Profile image updated successfully'
            });

        } catch (error) {
            console.error('Update profile image error:', error);
            res.status(500).json({
                success: false,
                error: 'IMAGE_UPDATE_FAILED',
                message: 'Failed to update profile image'
            });
        }
    })
];

/**
 * @desc    Update documents information
 * @route   PUT /api/v1/employee/profile/documents
 * @access  Private
 */
const updateDocuments = [
    body('panNumber').optional().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Invalid PAN number format'),
    body('aadhaarNumber').optional().matches(/^\d{12}$/).withMessage('Aadhaar number must be 12 digits'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        try {
            const employee = await Employee.findOne({ id: req.employee.id });
            
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee profile not found'
                });
            }

            // Update document fields
            const documentFields = ['panNumber', 'panName', 'aadhaarNumber', 'passportNumber', 'drivingLicense'];
            
            documentFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    employee.documents[field] = req.body[field];
                }
            });

            await employee.save();

            res.json({
                success: true,
                data: {
                    documents: employee.documents,
                    profileCompletion: employee.profileCompletion
                },
                message: 'Documents updated successfully'
            });

        } catch (error) {
            console.error('Update documents error:', error);
            res.status(500).json({
                success: false,
                error: 'DOCUMENTS_UPDATE_FAILED',
                message: 'Failed to update documents'
            });
        }
    })
];

/**
 * @desc    Upload document
 * @route   POST /api/v1/employee/profile/documents/upload
 * @access  Private
 */
const uploadDocument = [
    documentUpload.single('document'),
    asyncHandler(async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'NO_FILE_UPLOADED',
                    message: 'Please upload a document file'
                });
            }

            const { documentType } = req.body;
            
            if (!documentType) {
                return res.status(400).json({
                    success: false,
                    error: 'DOCUMENT_TYPE_REQUIRED',
                    message: 'Document type is required'
                });
            }

            const employee = await Employee.findOne({ id: req.employee.id });
            
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee profile not found'
                });
            }

            // Add document to uploaded documents array
            employee.documents.uploadedDocuments.push({
                type: documentType,
                fileName: req.file.filename,
                filePath: `/uploads/employee/documents/${req.file.filename}`,
                uploadedAt: new Date(),
                verified: false
            });

            await employee.save();

            res.json({
                success: true,
                data: {
                    document: {
                        type: documentType,
                        fileName: req.file.filename,
                        filePath: `/uploads/employee/documents/${req.file.filename}`,
                        fileSize: req.file.size,
                        uploadedAt: new Date()
                    },
                    profileCompletion: employee.profileCompletion
                },
                message: 'Document uploaded successfully'
            });

        } catch (error) {
            console.error('Upload document error:', error);
            res.status(500).json({
                success: false,
                error: 'DOCUMENT_UPLOAD_FAILED',
                message: 'Failed to upload document'
            });
        }
    })
];

/**
 * @desc    Update banking information
 * @route   PUT /api/v1/employee/profile/banking
 * @access  Private
 */
const updateBanking = [
    body('accountNumber').optional().isLength({ min: 9, max: 18 }).withMessage('Account number must be between 9 and 18 digits'),
    body('ifscCode').optional().matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        try {
            const employee = await Employee.findOne({ id: req.employee.id });
            
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee profile not found'
                });
            }

            // Update banking fields
            const bankingFields = ['accountNumber', 'ifscCode', 'bankName', 'accountType', 'accountHolderName'];
            
            bankingFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    employee.banking[field] = req.body[field];
                }
            });

            // Reset verification status when banking details are updated
            employee.banking.verified = false;

            await employee.save();

            res.json({
                success: true,
                data: {
                    banking: employee.banking,
                    profileCompletion: employee.profileCompletion
                },
                message: 'Banking information updated successfully'
            });

        } catch (error) {
            console.error('Update banking error:', error);
            res.status(500).json({
                success: false,
                error: 'BANKING_UPDATE_FAILED',
                message: 'Failed to update banking information'
            });
        }
    })
];

/**
 * @desc    Get profile completion status
 * @route   GET /api/v1/employee/profile/completion
 * @access  Private
 */
const getProfileCompletion = asyncHandler(async (req, res) => {
    try {
        const employee = await Employee.findOne({ id: req.employee.id });
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: 'EMPLOYEE_NOT_FOUND',
                message: 'Employee profile not found'
            });
        }

        res.json({
            success: true,
            data: {
                profileCompletion: employee.profileCompletion,
                completedSections: Object.keys(employee.profileCompletion.sections).filter(
                    section => employee.profileCompletion.sections[section].completed
                ),
                missingSections: Object.keys(employee.profileCompletion.sections).filter(
                    section => !employee.profileCompletion.sections[section].completed && 
                               employee.profileCompletion.sections[section].required
                )
            },
            message: 'Profile completion status retrieved successfully'
        });

    } catch (error) {
        console.error('Get profile completion error:', error);
        res.status(500).json({
            success: false,
            error: 'PROFILE_COMPLETION_FAILED',
            message: 'Failed to retrieve profile completion status'
        });
    }
});

/**
 * @desc    Update regulatory consents
 * @route   PUT /api/v1/employee/profile/consents
 * @access  Private
 */
const updateRegulatoryConsents = [
    body('termsAccepted').isBoolean().withMessage('Terms acceptance must be a boolean'),
    body('privacyPolicyAccepted').isBoolean().withMessage('Privacy policy acceptance must be a boolean'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        try {
            const { termsAccepted, privacyPolicyAccepted } = req.body;
            
            const employee = await Employee.findOne({ id: req.employee.id });
            
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee profile not found'
                });
            }

            // Update regulatory consents
            employee.regulatoryConsents = {
                termsAccepted,
                privacyPolicyAccepted,
                acceptedAt: new Date()
            };

            await employee.save();

            res.json({
                success: true,
                data: {
                    regulatoryConsents: employee.regulatoryConsents,
                    profileCompletion: employee.profileCompletion
                },
                message: 'Regulatory consents updated successfully'
            });

        } catch (error) {
            console.error('Update regulatory consents error:', error);
            res.status(500).json({
                success: false,
                error: 'CONSENTS_UPDATE_FAILED',
                message: 'Failed to update regulatory consents'
            });
        }
    })
];

module.exports = {
    getProfile,
    updateProfile,
    updateProfileImage,
    updateDocuments,
    uploadDocument,
    updateBanking,
    getProfileCompletion,
    updateRegulatoryConsents
}; 