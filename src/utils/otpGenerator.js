const bcrypt = require('bcrypt');

/**
 * Generate a random 6-digit OTP
 * @returns {string} A 6-digit OTP
 */
function generateOTP() {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

/**
 * Hash an OTP using bcrypt
 * @param {string} otp - The OTP to hash
 * @returns {Promise<string>} The hashed OTP
 */
async function hashOTP(otp) {
  const saltRounds = 10;
  return await bcrypt.hash(otp, saltRounds);
}

/**
 * Compare an OTP with a hashed OTP
 * @param {string} plainOTP - The plain OTP to compare
 * @param {string} hashedOTP - The hashed OTP to compare against
 * @returns {Promise<boolean>} Whether the OTP matches the hash
 */
async function compareOTP(plainOTP, hashedOTP) {
  return await bcrypt.compare(plainOTP, hashedOTP);
}

module.exports = {
  generateOTP,
  hashOTP,
  compareOTP
}; 