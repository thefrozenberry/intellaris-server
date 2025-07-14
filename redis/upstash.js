const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Get credentials from environment variables
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Check if we have valid credentials
const hasCredentials = UPSTASH_URL && UPSTASH_TOKEN;

// Initialize axios instance for Upstash REST API
const upstashApi = hasCredentials ? axios.create({
  baseURL: UPSTASH_URL,
  headers: {
    'Authorization': `Bearer ${UPSTASH_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 5000
}) : null;

/**
 * Check if Upstash connection is working
 * @returns {Promise<boolean>} Whether the connection is working
 */
async function checkConnection() {
  try {
    if (!upstashApi) {
      throw new Error('Upstash API not initialized');
    }
    
    // Test command using Upstash REST API
    const response = await upstashApi.get('/ping');
    return response.status === 200;
  } catch (error) {
    console.error('Upstash connection check failed:', error.message);
    return false;
  }
}

/**
 * Set a value in Upstash Redis
 * @param {string} key - The key to set
 * @param {string} value - The value to set
 * @param {number} ttl - The TTL in seconds
 * @returns {Promise<boolean>} Whether the operation was successful
 */
async function set(key, value, ttl = null) {
  try {
    if (!upstashApi) {
      throw new Error('Upstash API not initialized');
    }
    
    // Encode the key for URL safety
    const encodedKey = encodeURIComponent(key);
    
    // In Upstash REST API, the value doesn't need to be wrapped in another object
    // Just send the value directly
    console.log(`Setting ${key} with value:`, value);
    
    // First set the value
    const setResponse = await upstashApi.post(`/set/${encodedKey}`, value);
    
    if (setResponse.status !== 200) {
      console.error('Upstash SET response:', setResponse.status, setResponse.data);
      throw new Error(`Failed to set key ${key}: ${setResponse.status}`);
    }
    
    // Then set expiry if needed
    if (ttl) {
      // For Upstash REST API, we need to send the ttl as a path parameter, not in the body
      const expireResponse = await upstashApi.post(`/expire/${encodedKey}/${ttl}`);
      
      if (expireResponse.status !== 200) {
        console.error('Upstash EXPIRE response:', expireResponse.status, expireResponse.data);
        throw new Error(`Failed to set expiry for key ${key}: ${expireResponse.status}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in Upstash:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

/**
 * Get a value from Upstash Redis
 * @param {string} key - The key to get
 * @returns {Promise<string|null>} The value or null if not found
 */
async function get(key) {
  try {
    if (!upstashApi) {
      throw new Error('Upstash API not initialized');
    }
    
    // Encode the key for URL safety
    const encodedKey = encodeURIComponent(key);
    
    const response = await upstashApi.get(`/get/${encodedKey}`);
    
    if (response.data && response.data.result !== null) {
      // For debugging - show the raw result
      console.log(`Raw result for ${key}:`, response.data.result);
      
      // The response from Upstash REST API might be a string with quotes
      // We need to remove those quotes if present
      let result = response.data.result;
      
      // If result is a string and has quotes at the beginning and end, remove them
      if (typeof result === 'string') {
        // Check if it starts and ends with quotes
        if (result.startsWith('"') && result.endsWith('"')) {
          result = result.substring(1, result.length - 1);
          console.log(`Unquoted result for ${key}:`, result);
        }
      }
      
      return result;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting ${key} from Upstash:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

/**
 * Delete a key from Upstash Redis
 * @param {string} key - The key to delete
 * @returns {Promise<number>} The number of keys deleted
 */
async function del(key) {
  try {
    if (!upstashApi) {
      throw new Error('Upstash API not initialized');
    }
    
    // Encode the key for URL safety
    const encodedKey = encodeURIComponent(key);
    
    // Upstash REST API uses GET for DEL command, not DELETE
    const response = await upstashApi.get(`/del/${encodedKey}`);
    
    if (response.data && typeof response.data.result === 'number') {
      return response.data.result;
    }
    
    return 0;
  } catch (error) {
    console.error(`Error deleting ${key} from Upstash:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return 0;
  }
}

// Set OTP in Redis with expiration
async function setOTP(mobile, hashedOTP) {
  try {
    const key = `otp:${mobile}`;
    const ttl = 5 * 60; // 5 minutes TTL in seconds
    
    const result = await set(key, hashedOTP, ttl);
    
    if (result) {
      console.info(`OTP stored for ${mobile} with 5min expiry`);
      return true;
    } else {
      throw new Error('Failed to store OTP');
    }
  } catch (error) {
    console.error('Error storing OTP:', error.message);
    
    // Fallback for development when Redis is unavailable
    if (process.env.NODE_ENV === 'development') {
      // Store in memory temporarily (not for production)
      if (!global.memoryOtpStore) global.memoryOtpStore = {};
      global.memoryOtpStore[mobile] = {
        otp: hashedOTP,
        expires: Date.now() + (5 * 60 * 1000)
      };
      console.info(`[DEV] OTP stored in memory for ${mobile}`);
      return true;
    }
    
    return false;
  }
}

// Get OTP from Redis
async function getOTP(mobile) {
  try {
    const key = `otp:${mobile}`;
    const otp = await get(key);
    
    if (otp) {
      console.info(`OTP retrieved for ${mobile}`);
    } else {
      console.info(`No OTP found for ${mobile}`);
    }
    
    return otp;
  } catch (error) {
    console.error('Error retrieving OTP:', error.message);
    
    // Fallback for development when Redis is unavailable
    if (process.env.NODE_ENV === 'development' && global.memoryOtpStore && global.memoryOtpStore[mobile]) {
      if (global.memoryOtpStore[mobile].expires > Date.now()) {
        console.info(`[DEV] OTP retrieved from memory for ${mobile}`);
        return global.memoryOtpStore[mobile].otp;
      }
      delete global.memoryOtpStore[mobile]; // Expired
      console.info(`[DEV] OTP expired for ${mobile}`);
    }
    
    return null;
  }
}

// Delete OTP from Redis
async function deleteOTP(mobile) {
  try {
    const key = `otp:${mobile}`;
    const result = await del(key);
    
    if (result > 0) {
      console.info(`OTP deleted for ${mobile}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting OTP:', error.message);
    
    // Fallback for development when Redis is unavailable
    if (process.env.NODE_ENV === 'development' && global.memoryOtpStore) {
      delete global.memoryOtpStore[mobile];
      console.info(`[DEV] OTP deleted from memory for ${mobile}`);
    }
    
    return 0;
  }
}

// Initialize and check connection when module loads
(async () => {
  try {
    if (!hasCredentials) {
      console.warn('Upstash Redis REST API credentials not found in environment variables.');
      if (process.env.NODE_ENV === 'development') {
        console.info('Using in-memory OTP storage for development.');
        global.memoryOtpStore = {};
      }
      return;
    }
    
    const connected = await checkConnection();
    
    if (connected) {
      console.info('Upstash Redis REST API connection successful');
    } else {
      console.warn('Upstash Redis REST API connection failed.');
      if (process.env.NODE_ENV === 'development') {
        console.info('Using in-memory OTP storage for development.');
        global.memoryOtpStore = {};
      }
    }
  } catch (error) {
    console.error('Error initializing Upstash Redis connection:', error.message);
    if (process.env.NODE_ENV === 'development') {
      global.memoryOtpStore = {};
    }
  }
})();

module.exports = {
  upstashApi,
  set,
  get,
  del,
  setOTP,
  getOTP,
  deleteOTP,
  checkConnection
}; 