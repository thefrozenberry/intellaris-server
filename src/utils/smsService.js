require('dotenv').config();

/**
 * SMS Service for OTPs - Console logging implementation
 * This service simulates sending OTPs by logging them to the console
 */

class SMSService {
  constructor() {
    this.initialized = true;
    console.log('Console-based SMS service initialized');
  }

  /**
   * Send an OTP via console logging
   * @param {string} to - Phone number to send to
   * @param {string} _message - Unused as we generate a random OTP
   * @returns {Promise<boolean>} - Success status
   */
  async sendSMS(to, _message) {
    try {
      // Format the phone number
      const formattedNumber = this.formatPhoneNumber(to);
      
      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the OTP in memory with the phone number as key
      if (!this.otpStore) {
        this.otpStore = new Map();
      }
      this.otpStore.set(formattedNumber, otp);
      
      // Log the OTP to console
      console.log(`\n===== OTP MESSAGE =====`);
      console.log(`TO: ${formattedNumber}`);
      console.log(`CODE: ${otp}`);
      console.log(`=====================\n`);
      
      return true;
    } catch (error) {
      console.error('Error sending verification:', error);
      return false;
    }
  }

  /**
   * Verify an OTP code
   * @param {string} phoneNumber - The phone number to verify
   * @param {string} code - The OTP code to verify
   * @returns {Promise<boolean>} - Whether the verification was successful
   */
  async verifyOTP(phoneNumber, code) {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      
      // Get the stored OTP for this phone number
      if (!this.otpStore) {
        this.otpStore = new Map();
      }
      
      const storedOTP = this.otpStore.get(formattedNumber);
      
      // For testing in development, any code works if there's no stored OTP
      if (!storedOTP && process.env.NODE_ENV === 'development') {
        console.log(`[DEV MODE] OTP verification bypassed for ${formattedNumber}`);
        return true;
      }
      
      const isValid = storedOTP === code;
      
      if (isValid) {
        // Remove the OTP once verified
        this.otpStore.delete(formattedNumber);
        console.log(`OTP verified successfully for ${formattedNumber}`);
      } else {
        console.log(`Invalid OTP for ${formattedNumber}. Expected: ${storedOTP}, Received: ${code}`);
      }
      
      return isValid;
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }

  /**
   * Format a phone number to ensure it has the country code
   * @param {string} phoneNumber - The phone number to format
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Strip all non-numeric characters except the plus sign
    let formattedNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // If the number doesn't start with +, add it
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+' + formattedNumber;
    }
    
    // If it's an Indian number without country code (10 digits), add +91
    if (formattedNumber.length === 11 && formattedNumber.startsWith('+')) {
      formattedNumber = '+91' + formattedNumber.substring(1);
    } else if (formattedNumber.length === 10) {
      formattedNumber = '+91' + formattedNumber;
    }
    
    return formattedNumber;
  }
}

module.exports = new SMSService(); 