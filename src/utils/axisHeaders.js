/**
 * Utility for generating Axis Bank API request headers
 * @module utils/axisHeaders
 */

/**
 * Generate headers for Axis Bank API requests
 * @param {Object} options - Header options
 * @param {string} options.clientId - Axis Bank client ID
 * @param {string} options.clientSecret - Axis Bank client secret
 * @param {string} options.testId - Test ID for Axis Bank API (controls response type)
 * @param {string} options.contentType - Content-Type header value
 * @returns {Object} - Headers object for API requests
 */
exports.generateHeaders = ({ clientId, clientSecret, testId = '1', contentType = 'application/json' }) => {
  return {
    'X-IBM-Client-Id': clientId,
    'X-IBM-Client-Secret': clientSecret,
    'x-fapi-epoch-millis': Date.now().toString(),
    'x-fapi-channel-id': 'FINTECH_SERVER',
    'x-fapi-uuid': `fintech-server-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    'X-AXIS-TEST-ID': testId,
    'Content-Type': contentType,
    'Accept': 'application/json'
  };
}; 