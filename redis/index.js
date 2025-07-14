const Redis = require('ioredis');
const dotenv = require('dotenv');
dotenv.config();

// Check if we're using Upstash Redis (TLS)
const isUpstash = process.env.REDIS_URL?.startsWith('rediss://');

// Redis connection options
const redisOptions = {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Only reconnect on specific errors
      return true;
    }
  },
  connectTimeout: 10000, // 10 seconds
  enableAutoPipelining: false,
  enableOfflineQueue: true,
  keepAlive: 10000,
  // TLS options for Upstash Redis
  tls: isUpstash ? {
    rejectUnauthorized: false,
  } : undefined
};

// Create Redis client
let redisClient;

try {
  redisClient = new Redis(process.env.REDIS_URL, redisOptions);
  console.info('Redis client initialized');
} catch (error) {
  console.error('Failed to initialize Redis client:', error.message);
  // Create a fallback memory store for development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using in-memory OTP store for development');
    global.memoryOtpStore = {};
  }
}

// Handle Redis errors
redisClient?.on('error', (err) => {
  console.error('Redis connection error:', err.message);
  // Don't crash the server on Redis connection errors
});

// Confirm connection
redisClient?.on('connect', () => {
  console.info('Redis client connected successfully');
});

// Handle reconnection
redisClient?.on('reconnecting', () => {
  console.info('Redis client reconnecting...');
});

// Set OTP in Redis with expiration
async function setOTP(mobile, hashedOTP) {
  try {
    if (!redisClient?.status || redisClient?.status !== 'ready') {
      throw new Error('Redis client not ready');
    }
    
    const key = `otp:${mobile}`;
    const ttl = 5 * 60; // 5 minutes TTL in seconds
    
    await redisClient.set(key, hashedOTP);
    await redisClient.expire(key, ttl);
    return true;
  } catch (error) {
    console.error('Error storing OTP in Redis:', error.message);
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
    if (!redisClient?.status || redisClient?.status !== 'ready') {
      throw new Error('Redis client not ready');
    }
    
    const key = `otp:${mobile}`;
    return await redisClient.get(key);
  } catch (error) {
    console.error('Error retrieving OTP from Redis:', error.message);
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
    if (!redisClient?.status || redisClient?.status !== 'ready') {
      throw new Error('Redis client not ready');
    }
    
    const key = `otp:${mobile}`;
    return await redisClient.del(key);
  } catch (error) {
    console.error('Error deleting OTP from Redis:', error.message);
    // Fallback for development when Redis is unavailable
    if (process.env.NODE_ENV === 'development' && global.memoryOtpStore) {
      delete global.memoryOtpStore[mobile];
      console.info(`[DEV] OTP deleted from memory for ${mobile}`);
    }
    return 0;
  }
}

module.exports = {
  redisClient,
  setOTP,
  getOTP,
  deleteOTP
}; 