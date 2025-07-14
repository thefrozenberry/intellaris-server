const userService = require('../services/userService');
const { ApiError } = require('../middlewares/errorHandler');
const fileStorage = require('../utils/fileStorage');

/**
 * Controller for user-related operations
 */
class UserController {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async registerUser(req, res, next) {
    try {
      const userData = req.body;
      
      // Check if mobile number already exists
      try {
        await userService.getUserByMobile(userData.mobile);
        return next(ApiError.badRequest('Mobile number already registered'));
      } catch (error) {
        // User not found, so we can continue with registration
        if (error.statusCode !== 404) {
          throw error;
        }
      }
      
      // Create user
      const user = await userService.createUser(userData);
      
      // Return success response
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          userId: user.id,
          customerId: user.customerId,
          mobile: user.mobile
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update user information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateUser(req, res, next) {
    try {
      const { userId } = req;
      const userData = req.body;
      
      // Update user
      const updatedUser = await userService.updateUser(userId, userData);
      
      // Return success response
      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: {
          userId: updatedUser.id,
          customerId: updatedUser.customerId,
          name: updatedUser.name,
          mobile: updatedUser.mobile,
          email: updatedUser.email
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getUserProfile(req, res, next) {
    try {
      const { userId } = req;
      
      // Get user profile
      const user = await userService.getUserById(userId);
      
      // Return success response
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get user by ID, mobile, or customer ID (admin only)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getUserByIdentifier(req, res, next) {
    try {
      const { identifier } = req.params;
      let user;
      
      // Try to find by different identifiers
      if (identifier.match(/^CUS\d+$|^MER\d+$/)) {
        // Find by customer ID
        user = await userService.getUserByCustomerId(identifier);
      } else if (identifier.match(/^\d{10}$/)) {
        // Find by mobile number (assuming 10 digits)
        user = await userService.getUserByMobile(identifier);
      } else {
        // Find by user ID
        user = await userService.getUserById(identifier);
      }
      
      // Return success response
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Add bank account for user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async addBankAccount(req, res, next) {
    try {
      const { userId } = req;
      const accountData = req.body;
      
      // Add bank account
      const bankAccount = await userService.addBankAccount(userId, accountData);
      
      // Return success response
      res.status(201).json({
        status: 'success',
        message: 'Bank account added successfully',
        data: bankAccount
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Add virtual payment address (VPA) for user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async addVpa(req, res, next) {
    try {
      const { userId } = req;
      const vpaData = req.body;
      
      // Add VPA
      const vpa = await userService.addVpa(userId, vpaData);
      
      // Return success response
      res.status(201).json({
        status: 'success',
        message: 'VPA added successfully',
        data: vpa
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Add card for user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async addCard(req, res, next) {
    try {
      const { userId } = req;
      const cardData = req.body;
      
      // Add card
      const card = await userService.addCard(userId, cardData);
      
      // Return success response
      res.status(201).json({
        status: 'success',
        message: 'Card added successfully',
        data: card
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Upload document
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async uploadDocument(req, res, next) {
    try {
      const { userId } = req;
      const { documentType, documentNumber } = req.body;
      const file = req.file;
      
      if (!file) {
        return next(ApiError.badRequest('No file uploaded'));
      }
      
      // Get document data
      const documentData = {
        documentType,
        documentNumber,
        originalFilename: file.originalname
      };
      
      // Process document
      const result = await userService.uploadDocument(userId, documentData);
      
      // Save the file
      await fileStorage.saveFile(result.filePath, file.buffer);
      
      // Return success response
      res.status(200).json({
        status: 'success',
        message: 'Document uploaded successfully',
        data: {
          document: result.document
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get users for admin panel
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getUsers(req, res, next) {
    try {
      const { page, limit, search, userType, kycStatus } = req.query;
      
      // Get users
      const result = await userService.getUsers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search,
        userType,
        kycStatus
      });
      
      // Return success response
      res.status(200).json({
        status: 'success',
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get spending analytics for user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getSpendingAnalytics(req, res, next) {
    try {
      const { userId } = req;
      const { period, startDate, endDate, groupBy } = req.query;
      
      // Get spending analytics
      const analytics = await userService.getSpendingAnalytics(userId, {
        period,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        groupBy
      });
      
      // Return success response
      res.status(200).json({
        status: 'success',
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate pre-signed URL for document upload (deprecated, kept for backward compatibility)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getDocumentUploadUrl(req, res, next) {
    return next(ApiError.badRequest('This endpoint is no longer supported. Please use the direct file upload endpoint.'));
  }
}

module.exports = new UserController(); 