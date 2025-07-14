/**
 * API Access credentials utility
 * This file handles API access credentials from environment variables with fallback values
 */

// Default values if environment variables are not set
const DEFAULT_API_PASSWORD = 'Ripun54321';
const DEFAULT_ACCESS_CODE = 'RIPUN-ACCESS-V1';
const DEFAULT_CLIENT_ID = 'ripun_7f3b2c9d-84a1-4dcb-90e6-fb17e16ab3da';
const DEFAULT_CLIENT_SECRET = 'cb85fc11-9ab6-4e52-bd0a-64c9b15166f2';

// Export API access credentials with environment variable support
module.exports = {
  API_PASSWORD: process.env.API_PASSWORD || DEFAULT_API_PASSWORD,
  ACCESS_CODE: process.env.ACCESS_CODE || DEFAULT_ACCESS_CODE,
  CLIENT_ID: process.env.CLIENT_ID || DEFAULT_CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET || DEFAULT_CLIENT_SECRET
}; 