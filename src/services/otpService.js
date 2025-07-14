const { ApiError } = require('../middlewares/errorHandler');
const smsService = require('../utils/smsService');

/**
 * Class for handling OTP generation, storage, and verification
 */
class OTPService {
  /**
   * Generate a new OTP for a mobile number and send it
   * @param {string} mobile - The mobile number to generate an OTP for
   * @returns {Promise<string>} Success message
   */
  async generateAndStoreOTP(mobile) {
    try {
      // Validate mobile number format
      if (!mobile || typeof mobile !== 'string' || mobile.length < 10) {
        throw ApiError.badRequest('Invalid mobile number');
      }
      
      // Debug info for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Requesting OTP for ${mobile}`);
      }
      
      // Send the OTP via console logging
      const sent = await smsService.sendSMS(mobile, "Your verification code is: {code}");
      
      if (!sent) {
        throw ApiError.internal('Failed to send OTP. Please try again later.');
      }
      
      return "OTP sent successfully";
    } catch (error) {
      console.error('Error generating OTP:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('Failed to generate OTP');
    }
  }
  
  /**
   * Verify an OTP for a mobile number
   * @param {string} mobile - The mobile number to verify
   * @param {string} otp - The OTP to verify
   * @returns {Promise<boolean>} Whether the OTP is valid
   */
  async verifyOTP(mobile, otp) {
    try {
      // Validate inputs
      if (!mobile || !otp) {
        throw ApiError.badRequest('Mobile number and OTP are required');
      }
      
      // For debugging in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`Verifying OTP for ${mobile}`);
        console.log(`Input OTP: ${otp}`);
      }
      
      // Verify the OTP
      const isValid = await smsService.verifyOTP(mobile, otp);
      
      // For debugging in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`OTP verification result: ${isValid ? 'Valid' : 'Invalid'}`);
      }
      
      return isValid;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Error verifying OTP:', error);
      throw ApiError.internal('Failed to verify OTP');
    }
  }
  
  /**
   * Send OTP via SMS
   * @param {string} mobile - The mobile number to send the OTP to
   * @param {string} message - The message template with {code} placeholder
   * @returns {Promise<boolean>} - Whether the SMS was sent successfully
   */
  async sendOTPviaSMS(mobile, message) {
    try {
      // This method is no longer needed as we use smsService.sendSMS directly
      // in the generateAndStoreOTP method. Keeping it here for backward compatibility
      console.log('Warning: sendOTPviaSMS is deprecated. OTP is now sent directly via generateAndStoreOTP');
      return true;
    } catch (error) {
      console.error('Error sending OTP via SMS:', error);
      return false;
    }
  }
}

module.exports = new OTPService(); 