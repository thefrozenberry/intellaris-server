const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Employee = require('../models/employee/Employee');
const jwtService = require('../services/employee/jwtService');

/**
 * Employee authentication middleware
 * Verifies JWT token and adds employee data to request
 */
const authenticateEmployee = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Check if token is blacklisted
            if (jwtService.isTokenBlacklisted(token)) {
                return res.status(401).json({
                    success: false,
                    error: 'TOKEN_BLACKLISTED',
                    message: 'Token has been revoked'
                });
            }

            // Verify token
            const decoded = jwtService.verifyAccessToken(token);

            // Get employee from database
            const employee = await Employee.findOne({ 
                id: decoded.employeeId,
                isActive: true 
            });

            if (!employee) {
                return res.status(401).json({
                    success: false,
                    error: 'EMPLOYEE_NOT_FOUND',
                    message: 'Employee account not found or inactive'
                });
            }

            // Add employee to request object
            req.employee = {
                id: employee.id,
                enCode: employee.enCode,
                fullName: employee.fullName,
                email: employee.email,
                department: employee.department,
                designation: employee.designation,
                profileCompleted: employee.profileCompleted,
                isActive: employee.isActive
            };

            // Add decoded token info
            req.tokenInfo = {
                employeeId: decoded.employeeId,
                jwtid: decoded.jti,
                iat: decoded.iat,
                exp: decoded.exp
            };

            next();
        } catch (error) {
            console.error('Employee authentication error:', error);
            
            if (error.message === 'Access token has expired') {
                return res.status(401).json({
                    success: false,
                    error: 'TOKEN_EXPIRED',
                    message: 'Access token has expired. Please refresh your token.'
                });
            }

            return res.status(401).json({
                success: false,
                error: 'INVALID_TOKEN',
                message: 'Invalid or malformed token'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'NO_TOKEN',
            message: 'Access denied. No token provided.'
        });
    }
});

/**
 * Optional authentication middleware
 * Adds employee data if token is provided, but doesn't fail if not
 */
const optionalEmployeeAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwtService.verifyAccessToken(token);
            
            const employee = await Employee.findOne({ 
                id: decoded.employeeId,
                isActive: true 
            });

            if (employee) {
                req.employee = {
                    id: employee.id,
                    enCode: employee.enCode,
                    fullName: employee.fullName,
                    email: employee.email,
                    department: employee.department,
                    designation: employee.designation,
                    profileCompleted: employee.profileCompleted,
                    isActive: employee.isActive
                };
            }
        } catch (error) {
            // Silently fail for optional auth
            console.log('Optional auth failed:', error.message);
        }
    }

    next();
});

/**
 * Check if employee profile is completed
 */
const requireCompleteProfile = asyncHandler(async (req, res, next) => {
    if (!req.employee) {
        return res.status(401).json({
            success: false,
            error: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required'
        });
    }

    if (!req.employee.profileCompleted) {
        return res.status(403).json({
            success: false,
            error: 'PROFILE_INCOMPLETE',
            message: 'Please complete your profile to access this feature',
            data: {
                profileCompletionUrl: '/api/v1/employee/profile/completion'
            }
        });
    }

    next();
});

/**
 * Role-based access control
 */
const requireRole = (roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.employee) {
            return res.status(401).json({
                success: false,
                error: 'AUTHENTICATION_REQUIRED',
                message: 'Authentication required'
            });
        }

        // For now, we'll check by designation/department
        // In a more complex system, you'd have a proper role system
        const employeeRole = req.employee.designation?.toLowerCase();
        const employeeDept = req.employee.department?.toLowerCase();

        const hasRole = roles.some(role => {
            const checkRole = role.toLowerCase();
            return employeeRole?.includes(checkRole) || 
                   employeeDept?.includes(checkRole) ||
                   checkRole === 'all';
        });

        if (!hasRole) {
            return res.status(403).json({
                success: false,
                error: 'INSUFFICIENT_PERMISSIONS',
                message: 'You do not have permission to access this resource',
                data: {
                    requiredRoles: roles,
                    currentRole: req.employee.designation
                }
            });
        }

        next();
    });
};

/**
 * Rate limiting for sensitive operations
 */
const sensitiveOperationLimit = asyncHandler(async (req, res, next) => {
    // This would typically integrate with Redis for distributed rate limiting
    // For now, it's a placeholder that passes through
    next();
});

module.exports = {
    authenticateEmployee,
    optionalEmployeeAuth,
    requireCompleteProfile,
    requireRole,
    sensitiveOperationLimit
}; 