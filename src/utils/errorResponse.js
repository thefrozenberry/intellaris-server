/**
 * Custom error class for API error responses
 * Extends the built-in Error class
 * @class ErrorResponse
 */
class ErrorResponse extends Error {
  /**
   * Create a new ErrorResponse instance
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    
    // Capture stack trace (Node.js specific)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse; 