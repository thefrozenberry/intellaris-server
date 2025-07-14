const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

// Encryption key should be stored in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes (256 bits)
const IV_LENGTH = 16; // For AES, this is always 16 bytes

/**
 * Encrypts sensitive data using AES-256-CBC
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text in format: iv:encryptedText (base64 encoded)
 */
function encrypt(text) {
  if (!text) return null;
  
  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher using the encryption key and iv
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Return iv + encrypted data as a single base64 string
    return `${iv.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data that was encrypted using the encrypt function
 * @param {string} encryptedText - The encrypted text in format: iv:encryptedText (base64 encoded)
 * @returns {string} - The decrypted text
 */
function decrypt(encryptedText) {
  if (!encryptedText) return null;
  
  try {
    // Split the encrypted text to get the iv and encrypted data
    const [ivBase64, encryptedData] = encryptedText.split(':');
    
    if (!ivBase64 || !encryptedData) {
      throw new Error('Invalid encrypted data format');
    }
    
    // Convert the iv from base64 to buffer
    const iv = Buffer.from(ivBase64, 'base64');
    
    // Create decipher using the encryption key and iv
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Partially masks sensitive information like card numbers
 * @param {string} text - Text to mask
 * @param {number} visibleChars - Number of characters to leave visible at the end
 * @returns {string} - Masked text
 */
function maskSensitiveData(text, visibleChars = 4) {
  if (!text) return null;
  
  const length = text.length;
  if (length <= visibleChars) return text;
  
  const maskedPart = '*'.repeat(length - visibleChars);
  const visiblePart = text.slice(length - visibleChars);
  
  return `${maskedPart}${visiblePart}`;
}

/**
 * Hash data using SHA-256 (one-way hash, cannot be decrypted)
 * @param {string} text - Text to hash
 * @returns {string} - Hashed text
 */
function hashData(text) {
  if (!text) return null;
  return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports = {
  encrypt,
  decrypt,
  maskSensitiveData,
  hashData
}; 