const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const otpService = require('../services/otpService');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, invalidateRefreshToken } = require('../utils/jwt');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * Authentication controller with methods for OTP and token management
 */
class AuthController {
  /**
   * Request OTP for mobile login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async requestOTP(req, res, next) {
    try {
      const { mobile } = req.body;
      
      // Generate and store OTP - logs the OTP to the console
      const result = await otpService.generateAndStoreOTP(mobile);
      
      // Return success response
      res.status(200).json({
        status: 'success',
        message: result,
        data: {
          mobile
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify OTP and authenticate user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async verifyOTP(req, res, next) {
    try {
      const { mobile, otp } = req.body;
      
      // Verify OTP
      const isValid = await otpService.verifyOTP(mobile, otp);
      
      if (!isValid) {
        throw ApiError.badRequest('Invalid OTP');
      }
      
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { mobile }
      });
      
      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: { mobile }
        });
      }
      
      // Update last login timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
      
      // Generate tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = await generateRefreshToken(user.id);
      
      // Return success response with tokens
      res.status(200).json({
        status: 'success',
        message: 'Authentication successful',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            mobile: user.mobile
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      // Verify refresh token
      const result = await verifyRefreshToken(refreshToken);
      
      if (!result) {
        throw ApiError.unauthorized('Invalid or expired refresh token');
      }
      
      // Generate new access token
      const accessToken = generateAccessToken(result.userId);
      
      // Return success response with new access token
      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: {
          accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user by invalidating refresh token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      // Invalidate refresh token
      await invalidateRefreshToken(refreshToken);
      
      // Return success response
      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController(); 