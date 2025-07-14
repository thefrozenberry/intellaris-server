const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');
const ErrorResponse = require('../utils/errorResponse');
const { generateHeaders } = require('../utils/axisHeaders');

/**
 * Initiate a mandate creation request
 * @param {Object} mandateData - Mandate data
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.initiateMandate = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/initiatedmandate`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Initiating mandate creation request for UMN: ${mandateData.Data.umn}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Mandate creation successful with UMN: ${response.data.Data.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in initiateMandate service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      throw new ErrorResponse(
        error.response.data.message || 'Failed to initiate mandate',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to initiate mandate', 500);
  }
};

/**
 * Validate a mandate
 * @param {Object} mandateData - Mandate validation data
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.validateMandate = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/validatemandate`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Validating mandate for UMN: ${mandateData.umn}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Mandate validation successful for UMN: ${mandateData.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in validateMandate service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      throw new ErrorResponse(
        error.response.data.message || 'Failed to validate mandate',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to validate mandate', 500);
  }
};

/**
 * Revoke a mandate
 * @param {Object} mandateData - Mandate revocation data
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.revokeMandate = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/revokemandate`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Revoking mandate for UMN: ${mandateData.umn}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Mandate revocation successful for UMN: ${mandateData.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in revokeMandate service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      throw new ErrorResponse(
        error.response.data.message || 'Failed to revoke mandate',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to revoke mandate', 500);
  }
};

/**
 * Execute a mandate payment
 * @param {Object} mandateData - Mandate execution data
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.executeMandate = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/executemandate`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Executing mandate payment for UMN: ${mandateData.umn}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Mandate execution successful for UMN: ${mandateData.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in executeMandate service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      throw new ErrorResponse(
        error.response.data.message || 'Failed to execute mandate payment',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to execute mandate payment', 500);
  }
};

/**
 * Get mandate details
 * @param {string} umn - Unique Mandate Number
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.getMandateDetails = async (umn) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/mandate/${umn}`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Getting mandate details for UMN: ${umn}`);
    
    const response = await axios.get(url, { headers });
    
    logger.info(`Retrieved mandate details for UMN: ${umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in getMandateDetails service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      throw new ErrorResponse(
        error.response.data.message || 'Failed to get mandate details',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to get mandate details', 500);
  }
};

/**
 * Authorize (approve or decline) a mandate
 * @param {Object} mandateData - Mandate authorization data
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.authorizeMandate = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/authorizemandate`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Authorizing mandate for UMN: ${mandateData.Data.umn} with action: ${mandateData.Data.action}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Mandate authorization successful for UMN: ${response.data.Data.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in authorizeMandate service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      throw new ErrorResponse(
        error.response.data.message || 'Failed to authorize mandate',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to authorize mandate', 500);
  }
};

/**
 * Execute a mandate transaction by payee
 * @param {Object} mandateData - Mandate execution transaction data
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.mandateExecuteTransaction = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/mandateexecute`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Executing mandate transaction for UMN: ${mandateData.Data.umn} with amount: ${mandateData.Data.amount}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Mandate transaction execution successful for UMN: ${response.data.Data.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in mandateExecuteTransaction service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      
      // Handle specific error cases based on test ID
      if (error.response.status === 400) {
        const errorMessage = error.response.data.message || '';
        if (errorMessage.includes('already executed')) {
          throw new ErrorResponse('Mandate has already been executed', 400);
        } else if (errorMessage.includes('expired')) {
          throw new ErrorResponse('Mandate has expired', 400);
        }
      }
      
      throw new ErrorResponse(
        error.response.data.message || 'Failed to execute mandate transaction',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to execute mandate transaction', 500);
  }
};

/**
 * Modify a mandate
 * @param {Object} mandateData - Mandate modification data
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.modifyMandate = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/modifyMandate`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Modifying mandate for UMN: ${mandateData.Data.umn}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Mandate modification successful for UMN: ${response.data.Data.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in modifyMandate service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      
      // Handle specific error cases based on test ID
      if (error.response.status === 400) {
        const errorMessage = error.response.data.message || '';
        if (errorMessage.includes('already executed')) {
          throw new ErrorResponse('Mandate has already been executed', 400);
        } else if (errorMessage.includes('not created')) {
          throw new ErrorResponse('Mandate not created', 400);
        }
      }
      
      throw new ErrorResponse(
        error.response.data.message || 'Failed to modify mandate',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to modify mandate', 500);
  }
};

/**
 * Update a mandate status (suspend/activate/revoke)
 * @param {Object} mandateData - Mandate update data
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.updateMandate = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/updatemandate`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Updating mandate status to ${mandateData.Data.newstate} for UMN: ${mandateData.Data.umn}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    // The response.data.Data is a string for this API, parse it to get an object
    if (typeof response.data.Data === 'string') {
      try {
        response.data.Data = JSON.parse(response.data.Data);
      } catch (parseError) {
        logger.error(`Error parsing Data string: ${parseError.message}`);
      }
    }
    
    logger.info(`Mandate status update successful for UMN: ${mandateData.Data.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in updateMandate service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      
      // Handle specific error cases based on test ID
      if (error.response.status === 400) {
        const errorMessage = error.response.data.message || '';
        if (errorMessage.includes('not found')) {
          throw new ErrorResponse('Mandate not found', 400);
        } else if (errorMessage.includes('already revoked')) {
          throw new ErrorResponse('Mandate already revoked', 400);
        }
      }
      
      throw new ErrorResponse(
        error.response.data.message || 'Failed to update mandate status',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to update mandate status', 500);
  }
};

/**
 * Get mandate details by UMN, customer ID, and transaction ID
 * @param {Object} mandateData - Request data containing UMN and other identifiers
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.getMandate = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/getmandate`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Fetching mandate details for UMN: ${mandateData.Data.umn}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Successfully fetched mandate details for UMN: ${mandateData.Data.umn}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in getMandate service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      throw new ErrorResponse(
        error.response.data.message || 'Failed to fetch mandate details',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to fetch mandate details', 500);
  }
};

/**
 * Get transactions for a mandate
 * @param {Object} mandateData - Request data containing customer ID and app ID
 * @returns {Promise<Object>} - Response from Axis Bank API
 */
exports.getMandateTransactions = async (mandateData) => {
  try {
    const url = `${config.AXIS_API_URL}/transactions/getmandatetxn`;
    
    const headers = generateHeaders({
      clientId: config.AXIS_CLIENT_ID,
      clientSecret: config.AXIS_CLIENT_SECRET,
      testId: config.AXIS_TEST_ID || '1', // 1 for success scenario
      contentType: 'application/json'
    });
    
    logger.info(`Fetching mandate transactions for customer: ${mandateData.Data.customerid}`);
    
    const response = await axios.post(url, mandateData, { headers });
    
    logger.info(`Successfully fetched mandate transactions for customer: ${mandateData.Data.customerid}`);
    
    return response.data;
  } catch (error) {
    logger.error(`Error in getMandateTransactions service: ${error.message}`);
    
    if (error.response) {
      logger.error(`API Error Response: ${JSON.stringify(error.response.data)}`);
      throw new ErrorResponse(
        error.response.data.message || 'Failed to fetch mandate transactions',
        error.response.status
      );
    }
    
    throw new ErrorResponse('Failed to fetch mandate transactions', 500);
  }
}; 