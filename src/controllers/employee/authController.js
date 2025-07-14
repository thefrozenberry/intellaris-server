const express = require('express');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Employee = require('../../models/employee/Employee');
const OtpSession = require('../../models/employee/OtpSession');
const EmployeeOTPService = require('../../services/employee/otpService');

// Initialize OTP service
const otpService = new EmployeeOTPService();

// Services
const jwtService = require('../../services/employee/jwtService');

// Validation rules
const registrationValidation = [
    body('fullName')
        .isLength({ min: 2, max: 255 })
        .withMessage('Full name must be between 2 and 255 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name must contain only letters and spaces'),
    
    body('enCode')
        .isLength({ min: 3, max: 3 })
        .withMessage('EN code must be exactly 3 digits')
        .isNumeric()
        .withMessage('EN code must contain only digits'),
    
    body('code')
        .isLength({ min: 10, max: 10 })
        .withMessage('Access code must be exactly 10 letters')
        .matches(/^[a-zA-Z]{10}$/)
        .withMessage('Access code must contain only letters'),
    
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('homeAddress')
        .isLength({ min: 10, max: 500 })
        .withMessage('Home address must be between 10 and 500 characters'),
    
    body('phoneNumber')
        .matches(/^\+91\s\d{5}\s\d{5}$/)
        .withMessage('Phone number must be in format: +91 XXXXX XXXXX'),
    
    body('designation')
        .isLength({ min: 2, max: 255 })
        .withMessage('Designation must be between 2 and 255 characters'),
    
    body('department')
        .isLength({ min: 2, max: 255 })
        .withMessage('Department must be between 2 and 255 characters'),
    
    body('workMode')
        .isIn(['WFO', 'WFH', 'Hybrid'])
        .withMessage('Work mode must be one of: WFO, WFH, Hybrid'),
    
    body('reportingManager')
        .isLength({ min: 2, max: 255 })
        .withMessage('Reporting manager must be between 2 and 255 characters'),
    
    body('dateOfJoining')
        .isISO8601()
        .withMessage('Date of joining must be a valid date in ISO format (YYYY-MM-DD)'),
    
    body('profileImage')
        .optional()
        .isURL()
        .withMessage('Profile image must be a valid URL (Cloudinary URL)'),
    
    body('digitalSignature')
        .optional()
        .isURL()
        .withMessage('Digital signature must be a valid URL (Cloudinary URL)'),
    
    body('gender')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be one of: Male, Female, Other')
];

const credentialCheckValidation = [
    body('enCode')
        .isLength({ min: 3, max: 3 })
        .withMessage('EN code must be exactly 3 digits')
        .isNumeric()
        .withMessage('EN code must contain only digits'),
    
    body('code')
        .isLength({ min: 10, max: 10 })
        .withMessage('Access code must be exactly 10 letters')
        .matches(/^[a-zA-Z]{10}$/)
        .withMessage('Access code must contain only letters')
];

const otpVerificationValidation = [
    body('sessionId')
        .isUUID()
        .withMessage('Invalid session ID'),
    
    body('otp')
        .isLength({ min: 4, max: 4 })
        .withMessage('OTP must be exactly 4 digits')
        .isNumeric()
        .withMessage('OTP must contain only digits')
];

const otpDisplayValidation = [
    body('enCode')
        .isLength({ min: 3, max: 3 })
        .withMessage('EN code must be exactly 3 digits')
        .isNumeric()
        .withMessage('EN code must contain only digits'),
    
    body('code')
        .isLength({ min: 10, max: 10 })
        .withMessage('Access code must be exactly 10 letters')
        .matches(/^[a-zA-Z]{10}$/)
        .withMessage('Access code must contain only letters')
];

/**
 * @desc    Register a new employee
 * @route   POST /api/v1/employee/auth/register
 * @access  Public
 */
const registerEmployee = [
    ...registrationValidation,
    asyncHandler(async (req, res) => {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        const { fullName, enCode, code, email, homeAddress, phoneNumber, designation, department, workMode, reportingManager, dateOfJoining, profileImage, digitalSignature, gender } = req.body;

        try {
            // Check if employee with EN code already exists
            const existingEmployee = await Employee.findOne({ enCode });
            if (existingEmployee) {
                return res.status(409).json({
                    success: false,
                    error: 'DUPLICATE_EN_CODE',
                    message: 'Employee with this EN code already exists'
                });
            }

            // Check if email already exists
            const existingEmail = await Employee.findOne({ email });
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    error: 'DUPLICATE_EMAIL',
                    message: 'Employee with this email already exists'
                });
            }

            // Create new employee
            const employee = new Employee({
                fullName,
                enCode,
                accessCode: code, // This will be hashed in pre-save middleware
                email,
                homeAddress,
                phoneNumber,
                designation,
                department,
                workMode,
                reportingManager,
                joiningDate: new Date(dateOfJoining),
                profileImage,
                digitalSignature,
                gender,
                isFirstLogin: true,
                profileCompleted: false
            });

            await employee.save();

            // Return success response (return access code for login)
            res.status(201).json({
                success: true,
                data: {
                    code: code, // Return the 10-letter access code for login
                    enCode: employee.enCode,
                    fullName: employee.fullName,
                    email: employee.email,
                    phoneNumber: employee.phoneNumber,
                    designation: employee.designation,
                    department: employee.department,
                    workMode: employee.workMode,
                    reportingManager: employee.reportingManager,
                    dateOfJoining: employee.joiningDate,
                    profileImage: employee.profileImage,
                    digitalSignature: employee.digitalSignature,
                    gender: employee.gender,
                    registrationDate: employee.createdAt,
                    profileCompleted: employee.profileCompleted,
                    isFirstLogin: employee.isFirstLogin
                },
                message: 'Employee registered successfully'
            });

        } catch (error) {
            console.error('Employee registration error:', error);
            res.status(500).json({
                success: false,
                error: 'REGISTRATION_FAILED',
                message: 'Failed to register employee. Please try again.'
            });
        }
    })
];

/**
 * @desc    Check employee credentials (EN code + access code)
 * @route   POST /api/v1/employee/auth/check-credentials
 * @access  Public
 */
const checkCredentials = [
    ...credentialCheckValidation,
    asyncHandler(async (req, res) => {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        const { enCode, code } = req.body;
        const clientIP = req.ip;
        const userAgent = req.get('User-Agent') || 'Unknown';

        try {
            // Find and verify employee credentials
            const employee = await Employee.findByCredentials(enCode, code);

            if (!employee.isActive) {
                return res.status(403).json({
                    success: false,
                    error: 'ACCOUNT_INACTIVE',
                    message: 'Your account has been deactivated. Please contact HR for assistance.'
                });
            }

            // Get masked contact information
            const { maskedEmail, maskedPhone } = Employee.getMaskedContactInfo(
                employee.email, 
                employee.phoneNumber
            );

            res.json({
                success: true,
                data: {
                    employeeExists: true,
                    employeeId: employee.id,
                    fullName: employee.fullName,
                    maskedEmail,
                    maskedPhone,
                    profileCompleted: employee.profileCompleted,
                    isFirstLogin: employee.isFirstLogin
                },
                message: 'Employee found. OTP will be sent.'
            });

        } catch (error) {
            if (error.message === 'Invalid credentials' || error.message === 'Account is temporarily locked') {
                return res.status(401).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'No employee found with the provided EN code and access code combination. Please check your credentials or contact HR for registration.'
                });
            }

            console.error('Credential check error:', error);
            res.status(500).json({
                success: false,
                error: 'CREDENTIAL_CHECK_FAILED',
                message: 'Failed to verify credentials. Please try again.'
            });
        }
    })
];

/**
 * @desc    Send OTP to employee
 * @route   POST /api/v1/employee/auth/send-otp
 * @access  Public
 */
const sendOTP = [
    ...credentialCheckValidation,
    asyncHandler(async (req, res) => {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        const { enCode, code } = req.body;
        const clientIP = req.ip;
        const userAgent = req.get('User-Agent') || 'Unknown';

        try {
            // Verify credentials first
            const employee = await Employee.findByCredentials(enCode, code);

            if (!employee.isActive) {
                return res.status(403).json({
                    success: false,
                    error: 'ACCOUNT_INACTIVE',
                    message: 'Your account has been deactivated. Please contact HR for assistance.'
                });
            }

            // Create OTP session
            const otpSession = await OtpSession.createSession(
                employee.id,
                enCode,
                clientIP,
                userAgent
            );

            // Send OTP via email and SMS
            const otpResult = await otpService.sendOTP(
                employee.email,
                employee.phoneNumber,
                otpSession.otpCode,
                employee.fullName,
                employee.profileImage,
                employee.designation
            );

            // Update session with send status
            otpSession.sentToEmail = otpResult.email.sent;
            otpSession.sentToPhone = otpResult.sms.sent;
            await otpSession.save();

            if (!otpResult.success) {
                return res.status(500).json({
                    success: false,
                    error: 'OTP_SEND_FAILED',
                    message: 'Failed to send OTP. Please try again.'
                });
            }

            // Get masked contact information
            const { maskedEmail, maskedPhone } = Employee.getMaskedContactInfo(
                employee.email, 
                employee.phoneNumber
            );

            res.json({
                success: true,
                message: '4-digit OTP sent successfully to both email and phone',
                data: {
                    sessionId: otpSession.sessionToken,
                    otpExpiry: otpSession.expiresAt,
                    maskedEmail,
                    maskedPhone,
                    otpLength: 4
                }
            });

        } catch (error) {
            if (error.message === 'Invalid credentials' || error.message === 'Account is temporarily locked') {
                return res.status(401).json({
                    success: false,
                    error: 'INVALID_CREDENTIALS',
                    message: 'Invalid EN code and access code combination'
                });
            }

            console.error('OTP send error:', error);
            res.status(500).json({
                success: false,
                error: 'OTP_SEND_FAILED',
                message: 'Failed to send OTP. Please try again.'
            });
        }
    })
];

/**
 * @desc    Verify OTP and complete login
 * @route   POST /api/v1/employee/auth/verify-otp
 * @access  Public
 */
const verifyOTP = [
    ...otpVerificationValidation,
    asyncHandler(async (req, res) => {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        const { sessionId, otp } = req.body;

        try {
            // Find and validate OTP session
            const otpSession = await OtpSession.findValidSession(sessionId);

            // Verify OTP
            const isValidOTP = otpSession.verifyOtp(otp);
            
            if (!isValidOTP) {
                await otpSession.save(); // Save failed attempt
                
                return res.status(400).json({
                    success: false,
                    error: 'INVALID_OTP',
                    message: 'Invalid OTP provided. Please try again.'
                });
            }

            // OTP verified successfully, get employee
            const employee = await Employee.findOne({ id: otpSession.employeeId });
            
            if (!employee || !employee.isActive) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee account not found or inactive'
                });
            }

            // Update employee login information
            employee.lastLoginAt = new Date();
            if (employee.isFirstLogin) {
                employee.isFirstLogin = false;
            }
            await employee.save();

            // Save successful OTP verification
            await otpSession.save();

            // Generate JWT tokens
            const tokens = jwtService.generateTokens(employee);

            res.json({
                success: true,
                data: {
                    token: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    tokenType: tokens.tokenType,
                    expiresIn: tokens.expiresIn,
                    employee: {
                        id: employee.id,
                        enCode: employee.enCode,
                        fullName: employee.fullName,
                        email: employee.email,
                        designation: employee.designation,
                        department: employee.department,
                        profileCompleted: employee.profileCompleted,
                        isFirstLogin: employee.isFirstLogin,
                        lastLoginAt: employee.lastLoginAt
                    }
                },
                message: 'Login successful'
            });

        } catch (error) {
            if (error.message === 'Invalid or expired session') {
                return res.status(400).json({
                    success: false,
                    error: 'SESSION_EXPIRED',
                    message: 'Login session has expired. Please start the login process again.'
                });
            }

            if (error.message === 'Session is not valid') {
                return res.status(400).json({
                    success: false,
                    error: 'OTP_EXPIRED',
                    message: 'OTP has expired. Please request a new one.',
                    data: {
                        canResend: true
                    }
                });
            }

            console.error('OTP verification error:', error);
            res.status(500).json({
                success: false,
                error: 'OTP_VERIFICATION_FAILED',
                message: 'Failed to verify OTP. Please try again.'
            });
        }
    })
];

/**
 * @desc    Resend OTP
 * @route   POST /api/v1/employee/auth/resend-otp
 * @access  Public
 */
const resendOTP = [
    body('sessionId').isUUID().withMessage('Invalid session ID'),
    asyncHandler(async (req, res) => {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        const { sessionId } = req.body;

        try {
            // Find existing session
            const existingSession = await OtpSession.findOne({ sessionToken: sessionId });
            
            if (!existingSession) {
                return res.status(400).json({
                    success: false,
                    error: 'SESSION_NOT_FOUND',
                    message: 'Invalid session. Please start the login process again.'
                });
            }

            // Get employee
            const employee = await Employee.findOne({ id: existingSession.employeeId });
            
            if (!employee || !employee.isActive) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee account not found or inactive'
                });
            }

            // Create new OTP session
            const newSession = await OtpSession.createSession(
                employee.id,
                existingSession.enCode,
                req.ip,
                req.get('User-Agent') || 'Unknown'
            );

            // Send new OTP
            const otpResult = await otpService.sendOTP(
                employee.email,
                employee.phoneNumber,
                newSession.otpCode,
                employee.fullName,
                employee.profileImage,
                employee.designation
            );

            // Update session with send status
            newSession.sentToEmail = otpResult.email.sent;
            newSession.sentToPhone = otpResult.sms.sent;
            newSession.resendCount = (existingSession.resendCount || 0) + 1;
            newSession.lastResendAt = new Date();
            await newSession.save();

            if (!otpResult.success) {
                return res.status(500).json({
                    success: false,
                    error: 'OTP_SEND_FAILED',
                    message: 'Failed to send new OTP. Please try again.'
                });
            }

            res.json({
                success: true,
                message: 'New OTP sent successfully',
                data: {
                    newSessionId: newSession.sessionToken,
                    otpExpiry: newSession.expiresAt
                }
            });

        } catch (error) {
            console.error('OTP resend error:', error);
            res.status(500).json({
                success: false,
                error: 'OTP_RESEND_FAILED',
                message: 'Failed to resend OTP. Please try again.'
            });
        }
    })
];

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/employee/auth/refresh
 * @access  Public
 */
const refreshToken = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    asyncHandler(async (req, res) => {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        const { refreshToken } = req.body;

        try {
            // Verify refresh token
            const decoded = jwtService.verifyRefreshToken(refreshToken);

            // Get employee
            const employee = await Employee.findOne({ id: decoded.employeeId });
            
            if (!employee || !employee.isActive) {
                return res.status(404).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee account not found or inactive'
                });
            }

            // Generate new tokens
            const tokens = jwtService.generateTokens(employee);

            res.json({
                success: true,
                data: {
                    token: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    tokenType: tokens.tokenType,
                    expiresIn: tokens.expiresIn
                },
                message: 'Token refreshed successfully'
            });

        } catch (error) {
            console.error('Token refresh error:', error);
            res.status(401).json({
                success: false,
                error: 'INVALID_REFRESH_TOKEN',
                message: 'Invalid or expired refresh token'
            });
        }
    })
];

/**
 * @desc    Logout employee
 * @route   POST /api/v1/employee/auth/logout
 * @access  Private
 */
const logout = [
    body('refreshToken').optional(),
    asyncHandler(async (req, res) => {
        const { refreshToken } = req.body;
        const accessToken = req.header('Authorization')?.replace('Bearer ', '');

        try {
            // In a production environment, you would:
            // 1. Add the access token to a blacklist
            // 2. Invalidate the refresh token in your storage
            // 3. Clear any session data

            if (refreshToken) {
                jwtService.blacklistToken(refreshToken, 'logout');
            }
            
            if (accessToken) {
                jwtService.blacklistToken(accessToken, 'logout');
            }

            res.json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                error: 'LOGOUT_FAILED',
                message: 'Failed to logout. Please try again.'
            });
        }
    })
];

/**
 * @desc    Get current OTP for display (Development/Testing purpose)
 * @route   POST /api/v1/employee/auth/get-otp
 * @access  Public
 */
const getOTP = [
    ...otpDisplayValidation,
    asyncHandler(async (req, res) => {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        const { enCode, code } = req.body;

        try {
            // Verify credentials first
            const employee = await Employee.findByCredentials(enCode, code);

            if (!employee.isActive) {
                return res.status(403).json({
                    success: false,
                    error: 'ACCOUNT_INACTIVE',
                    message: 'Your account has been deactivated. Please contact HR for assistance.'
                });
            }

            // Find the most recent valid OTP session for this employee
            const otpSession = await OtpSession.findOne({
                employeeId: employee.id,
                isUsed: false,
                expiresAt: { $gt: new Date() }
            }).sort({ createdAt: -1 });

            if (!otpSession) {
                return res.status(404).json({
                    success: false,
                    error: 'NO_ACTIVE_OTP',
                    message: 'No active OTP found. Please request a new OTP first.',
                    data: {
                        shouldRequestNewOTP: true
                    }
                });
            }

            // Get masked contact information
            const { maskedEmail, maskedPhone } = Employee.getMaskedContactInfo(
                employee.email, 
                employee.phoneNumber
            );

            // Calculate time remaining
            const timeRemaining = Math.max(0, Math.floor((otpSession.expiresAt - new Date()) / 1000));

            res.json({
                success: true,
                data: {
                    otp: otpSession.otpCode,
                    sessionId: otpSession.sessionToken,
                    employeeId: employee.id,
                    fullName: employee.fullName,
                    maskedEmail,
                    maskedPhone,
                    expiresAt: otpSession.expiresAt,
                    timeRemainingSeconds: timeRemaining,
                    attemptsRemaining: otpSession.maxAttempts - otpSession.attemptsCount,
                    sentToEmail: otpSession.sentToEmail,
                    sentToPhone: otpSession.sentToPhone
                },
                message: 'Current OTP retrieved successfully'
            });

        } catch (error) {
            if (error.message === 'Invalid credentials' || error.message === 'Account is temporarily locked') {
                return res.status(401).json({
                    success: false,
                    error: 'INVALID_CREDENTIALS',
                    message: 'Invalid EN code and access code combination'
                });
            }

            console.error('Get OTP error:', error);
            res.status(500).json({
                success: false,
                error: 'GET_OTP_FAILED',
                message: 'Failed to retrieve OTP. Please try again.'
            });
        }
    })
];

module.exports = {
    registerEmployee,
    checkCredentials,
    sendOTP,
    verifyOTP,
    resendOTP,
    refreshToken,
    logout,
    getOTP
}; 