const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class EmployeeJWTService {
    constructor() {
        this.accessTokenSecret = process.env.EMPLOYEE_JWT_SECRET || process.env.JWT_ACCESS_SECRET;
        this.refreshTokenSecret = process.env.EMPLOYEE_JWT_SECRET || process.env.JWT_REFRESH_SECRET;
        this.accessTokenExpiry = process.env.EMPLOYEE_JWT_ACCESS_EXPIRY || '15m';
        this.refreshTokenExpiry = process.env.EMPLOYEE_JWT_REFRESH_EXPIRY || '7d';
        
        if (!this.accessTokenSecret) {
            throw new Error('JWT secret not configured');
        }
    }

    /**
     * Generate access token for employee
     * @param {Object} employee - Employee object
     * @returns {string} - JWT access token
     */
    generateAccessToken(employee) {
        const payload = {
            employeeId: employee.id,
            enCode: employee.enCode,
            email: employee.email,
            fullName: employee.fullName,
            department: employee.department,
            designation: employee.designation,
            isActive: employee.isActive,
            profileCompleted: employee.profileCompleted,
            type: 'employee_access'
        };

        return jwt.sign(payload, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpiry,
            issuer: 'intellaris-employee-system',
            audience: 'intellaris-employee',
            jwtid: uuidv4()
        });
    }

    /**
     * Generate refresh token for employee
     * @param {Object} employee - Employee object
     * @returns {string} - JWT refresh token
     */
    generateRefreshToken(employee) {
        const payload = {
            employeeId: employee.id,
            enCode: employee.enCode,
            email: employee.email,
            type: 'employee_refresh',
            tokenVersion: Date.now() // For token invalidation
        };

        return jwt.sign(payload, this.refreshTokenSecret, {
            expiresIn: this.refreshTokenExpiry,
            issuer: 'intellaris-employee-system',
            audience: 'intellaris-employee',
            jwtid: uuidv4()
        });
    }

    /**
     * Generate both access and refresh tokens
     * @param {Object} employee - Employee object
     * @returns {Object} - Object containing access and refresh tokens
     */
    generateTokens(employee) {
        return {
            accessToken: this.generateAccessToken(employee),
            refreshToken: this.generateRefreshToken(employee),
            tokenType: 'Bearer',
            expiresIn: this.parseExpiry(this.accessTokenExpiry)
        };
    }

    /**
     * Verify access token
     * @param {string} token - JWT access token
     * @returns {Object} - Decoded token payload
     * @throws {Error} - If token is invalid or expired
     */
    verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, this.accessTokenSecret, {
                issuer: 'intellaris-employee-system',
                audience: 'intellaris-employee'
            });

            if (decoded.type !== 'employee_access') {
                throw new Error('Invalid token type');
            }

            return decoded;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Access token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid access token');
            } else if (error.name === 'NotBeforeError') {
                throw new Error('Access token not active yet');
            }
            throw error;
        }
    }

    /**
     * Verify refresh token
     * @param {string} token - JWT refresh token
     * @returns {Object} - Decoded token payload
     * @throws {Error} - If token is invalid or expired
     */
    verifyRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, this.refreshTokenSecret, {
                issuer: 'intellaris-employee-system',
                audience: 'intellaris-employee'
            });

            if (decoded.type !== 'employee_refresh') {
                throw new Error('Invalid token type');
            }

            return decoded;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Refresh token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid refresh token');
            } else if (error.name === 'NotBeforeError') {
                throw new Error('Refresh token not active yet');
            }
            throw error;
        }
    }

    /**
     * Decode token without verification (for debugging)
     * @param {string} token - JWT token
     * @returns {Object} - Decoded token
     */
    decodeToken(token) {
        return jwt.decode(token, { complete: true });
    }

    /**
     * Check if token is expired without throwing error
     * @param {string} token - JWT token
     * @returns {boolean} - True if expired
     */
    isTokenExpired(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                return true;
            }
            
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    }

    /**
     * Get token expiry time
     * @param {string} token - JWT token
     * @returns {Date|null} - Expiry date or null if invalid
     */
    getTokenExpiry(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                return null;
            }
            return new Date(decoded.exp * 1000);
        } catch (error) {
            return null;
        }
    }

    /**
     * Get remaining time until token expires
     * @param {string} token - JWT token
     * @returns {number} - Remaining time in seconds, 0 if expired
     */
    getTokenRemainingTime(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                return 0;
            }
            
            const currentTime = Math.floor(Date.now() / 1000);
            const remainingTime = decoded.exp - currentTime;
            return Math.max(0, remainingTime);
        } catch (error) {
            return 0;
        }
    }

    /**
     * Extract employee ID from token
     * @param {string} token - JWT token
     * @returns {string|null} - Employee ID or null if invalid
     */
    getEmployeeIdFromToken(token) {
        try {
            const decoded = jwt.decode(token);
            return decoded?.employeeId || null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Create a new access token from refresh token
     * @param {string} refreshToken - Valid refresh token
     * @param {Object} employee - Updated employee object
     * @returns {Object} - New access token
     */
    refreshAccessToken(refreshToken, employee) {
        // Verify refresh token first
        const decoded = this.verifyRefreshToken(refreshToken);
        
        // Ensure the refresh token belongs to the same employee
        if (decoded.employeeId !== employee.id) {
            throw new Error('Token mismatch');
        }

        // Generate new access token
        return {
            accessToken: this.generateAccessToken(employee),
            tokenType: 'Bearer',
            expiresIn: this.parseExpiry(this.accessTokenExpiry)
        };
    }

    /**
     * Parse expiry string to seconds
     * @param {string} expiry - Expiry string (e.g., '15m', '7d')
     * @returns {number} - Expiry in seconds
     */
    parseExpiry(expiry) {
        const match = expiry.match(/^(\d+)([smhd])$/);
        if (!match) {
            return 900; // Default 15 minutes
        }

        const [, amount, unit] = match;
        const value = parseInt(amount);

        switch (unit) {
            case 's': return value;
            case 'm': return value * 60;
            case 'h': return value * 60 * 60;
            case 'd': return value * 60 * 60 * 24;
            default: return 900;
        }
    }

    /**
     * Generate a secure token for password reset or email verification
     * @param {Object} data - Data to embed in token
     * @param {string} expiry - Token expiry (default: 1h)
     * @returns {string} - Secure token
     */
    generateSecureToken(data, expiry = '1h') {
        return jwt.sign(
            { ...data, type: 'secure_token' },
            this.accessTokenSecret,
            {
                expiresIn: expiry,
                issuer: 'intellaris-employee-system',
                jwtid: uuidv4()
            }
        );
    }

    /**
     * Verify secure token
     * @param {string} token - Secure token
     * @returns {Object} - Decoded token data
     */
    verifySecureToken(token) {
        try {
            const decoded = jwt.verify(token, this.accessTokenSecret, {
                issuer: 'intellaris-employee-system'
            });

            if (decoded.type !== 'secure_token') {
                throw new Error('Invalid token type');
            }

            return decoded;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Secure token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid secure token');
            }
            throw error;
        }
    }

    /**
     * Blacklist a token (in production, you'd store this in Redis or database)
     * @param {string} token - Token to blacklist
     * @param {string} reason - Reason for blacklisting
     */
    blacklistToken(token, reason = 'manual_revocation') {
        // In a real implementation, you would store the token JTI in a blacklist
        // For now, this is a placeholder
        console.log(`Token blacklisted: ${token.substring(0, 20)}... Reason: ${reason}`);
    }

    /**
     * Check if token is blacklisted
     * @param {string} token - Token to check
     * @returns {boolean} - True if blacklisted
     */
    isTokenBlacklisted(token) {
        // In a real implementation, you would check against your blacklist storage
        // For now, always return false
        return false;
    }
}

module.exports = new EmployeeJWTService(); 