const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');

// Convert fs functions to promise-based
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

// Base upload directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

/**
 * Ensures the upload directory exists
 * @param {string} dirPath - Directory path to check/create
 */
async function ensureDirectoryExists(dirPath) {
  try {
    if (!await exists(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating directory:', error);
    throw new Error('Failed to create upload directory');
  }
}

/**
 * Generates a random unique filename
 * @param {string} originalFilename - Original filename
 * @returns {string} - Unique filename with original extension
 */
function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalFilename);
  return `${timestamp}-${randomString}${extension}`;
}

/**
 * Prepare a location for a file upload and return a file path
 * @param {string} userId - User ID
 * @param {string} documentType - Type of document (e.g., 'AADHAAR', 'PAN')
 * @param {string} originalFilename - Original filename
 * @returns {Object} - Object containing the path and the generated filename
 */
async function prepareFileUpload(userId, documentType, originalFilename) {
  try {
    const uniqueFilename = generateUniqueFilename(originalFilename);
    const userDir = path.join(UPLOAD_DIR, 'users', userId, 'documents', documentType.toLowerCase());
    
    await ensureDirectoryExists(userDir);
    
    const filePath = path.join(userDir, uniqueFilename);
    const relativePath = path.relative(process.cwd(), filePath);
    
    return {
      filePath,
      relativePath,
      fileName: uniqueFilename
    };
  } catch (error) {
    console.error('Error preparing file upload:', error);
    throw new Error('Failed to prepare file upload');
  }
}

/**
 * Save a file to the local storage
 * @param {string} filePath - Path to save the file
 * @param {Buffer} fileData - File data as buffer
 * @returns {boolean} - Success status
 */
async function saveFile(filePath, fileData) {
  try {
    await writeFile(filePath, fileData);
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
}

/**
 * Get file path for serving
 * @param {string} relativePath - Relative path of the file
 * @returns {string} - Full path to access the file
 */
function getFilePath(relativePath) {
  return path.join(process.cwd(), relativePath);
}

module.exports = {
  prepareFileUpload,
  saveFile,
  getFilePath,
  UPLOAD_DIR
}; 