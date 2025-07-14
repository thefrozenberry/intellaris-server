/**
 * Utility functions for standardized API responses
 */

/**
 * Create a success response object
 * 
 * @param {object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {object} Standardized success response
 */
const successResponse = (data = null, message = "Operation successful", statusCode = 200) => {
  return {
    success: true,
    status: statusCode,
    message,
    data
  };
};

/**
 * Create an error response object
 * 
 * @param {string} message - Error message
 * @param {object} error - Error details
 * @param {number} statusCode - HTTP status code (default: 500)
 * @returns {object} Standardized error response
 */
const errorResponse = (message = "An error occurred", error = null, statusCode = 500) => {
  return {
    success: false,
    status: statusCode,
    message,
    error
  };
};

module.exports = {
  successResponse,
  errorResponse
}; 