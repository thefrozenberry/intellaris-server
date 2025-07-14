const rateLimit = require('express-rate-limit');

// Simple memory store for development fallback
class MemoryStore {
  constructor() {
    this.hits = {};
    this.resetTime = {};
  }

  async increment(key, options) {
    const now = Date.now();
    if (!this.hits[key]) {
      this.hits[key] = 0;
      this.resetTime[key] = now + options.windowMs;
    }

    // Reset if time expired
    if (now > this.resetTime[key]) {
      this.hits[key] = 0;
      this.resetTime[key] = now + options.windowMs;
    }

    this.hits[key]++;
    
    return {
      totalHits: this.hits[key],
      resetTime: this.resetTime[key],
      remaining: Math.max(options.max - this.hits[key], 0)
    };
  }

  async decrement(key) {
    if (this.hits[key]) {
      this.hits[key] = Math.max(0, this.hits[key] - 1);
    }
  }

  async resetKey(key) {
    delete this.hits[key];
    delete this.resetTime[key];
  }

  async resetAll() {
    this.hits = {};
    this.resetTime = {};
  }
}

/**
 * Create a rate limiter for OTP requests (5 requests per minute per IP)
 */
const otpRequestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(), // Create a new instance for each limiter
  message: {
    status: 'error',
    message: 'Too many OTP requests. Please try again after some time.'
  },
  keyGenerator: (req) => {
    // Use mobile number as key if available, otherwise use IP
    return req.body.mobile || req.ip;
  },
  skip: (req) => {
    // Skip rate limiting for non-OTP routes
    return !req.path.includes('/auth/request-otp');
  }
});

/**
 * Create a rate limiter for OTP verification (10 attempts per minute per mobile)
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 attempts per minute
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(), // Create a new instance for each limiter
  message: {
    status: 'error',
    message: 'Too many OTP verification attempts. Please try again after some time.'
  },
  keyGenerator: (req) => {
    // Use mobile number as key if available, otherwise use IP
    return req.body.mobile || req.ip;
  },
  skip: (req) => {
    // Skip rate limiting for non-OTP verification routes
    return !req.path.includes('/auth/verify-otp');
  }
});

module.exports = {
  otpRequestLimiter,
  otpVerifyLimiter
}; 