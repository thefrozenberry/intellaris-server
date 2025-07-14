const { verifyAccessToken } = require('../utils/jwt');
const { ApiError } = require('./errorHandler');
const { API_PASSWORD, ACCESS_CODE, CLIENT_ID, CLIENT_SECRET } = require('../utils/apiAccess');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    // Check if header exists
    if (!authHeader) {
      return next(ApiError.unauthorized('Authorization header is required'));
    }
    
    // Check if it's a Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(ApiError.unauthorized('Invalid authorization format. Use Bearer token'));
    }
    
    const token = parts[1];
    
    // Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    
    // Set user ID in request
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    next(ApiError.unauthorized('Authentication failed'));
  }
};

/**
 * Middleware to check if user is an admin
 */
const isAdmin = async (req, res, next) => {
  try {
    const { userId } = req;
    
    // Get user and check if admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPreferences: true
      }
    });
    
    if (!user) {
      return next(ApiError.unauthorized('User not found'));
    }
    
    // Check if user is admin (VIP in this case)
    const isUserAdmin = user.userPreferences?.isVip === true;
    
    if (!isUserAdmin) {
      return next(ApiError.forbidden('Admin access required'));
    }
    
    next();
  } catch (error) {
    next(ApiError.unauthorized('Admin verification failed'));
  }
};

/**
 * Middleware to check API access for external integrations
 */
const apiAccess = (req, res, next) => {
  try {
    const apiPassword = req.headers['x-api-password'];
    const accessCode = req.headers['x-access-code'];
    const clientId = req.headers['x-client-id'];
    const clientSecret = req.headers['x-client-secret'];
    
    if (!apiPassword || apiPassword !== API_PASSWORD) {
      return next(ApiError.unauthorized('Invalid API password'));
    }
    
    if (!accessCode || accessCode !== ACCESS_CODE) {
      return next(ApiError.unauthorized('Invalid access code'));
    }
    
    if (!clientId || clientId !== CLIENT_ID) {
      return next(ApiError.unauthorized('Invalid client ID'));
    }
    
    if (!clientSecret || clientSecret !== CLIENT_SECRET) {
      return next(ApiError.unauthorized('Invalid client secret'));
    }
    
    next();
  } catch (error) {
    next(ApiError.unauthorized('API access verification failed'));
  }
};

module.exports = {
  authenticate,
  isAdmin,
  apiAccess
}; 