/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack);

  // Determine response status code
  const statusCode = err.statusCode || 500;

  // Format error response
  const errorResponse = {
    status: 'error',
    message: statusCode === 500 ? 'Internal server error' : err.message
  };

  // Add error details in development mode
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.details || null;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }

  static badRequest(message, details = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized', details = null) {
    return new ApiError(401, message, details);
  }

  static forbidden(message = 'Forbidden', details = null) {
    return new ApiError(403, message, details);
  }

  static notFound(message = 'Not found', details = null) {
    return new ApiError(404, message, details);
  }

  static tooManyRequests(message = 'Too many requests', details = null) {
    return new ApiError(429, message, details);
  }

  static internal(message = 'Internal server error', details = null) {
    return new ApiError(500, message, details);
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  ApiError
}; 