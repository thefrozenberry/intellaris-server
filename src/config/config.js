/**
 * Configuration file for the application
 * Loads environment variables from .env file
 */
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Axis Bank API configuration
  AXIS_API_URL: process.env.AXIS_API_URL || 'https://apiportal.axisbank.com/gateway/api/v1/bank',
  AXIS_CLIENT_ID: process.env.AXIS_CLIENT_ID || 'your-axis-client-id',
  AXIS_CLIENT_SECRET: process.env.AXIS_CLIENT_SECRET || 'your-axis-client-secret',
  AXIS_TEST_ID: process.env.AXIS_TEST_ID || '1', // Default to success scenario
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  
  // MongoDB Configuration (if needed)
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/fintech-server'
}; 