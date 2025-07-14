const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv');
const crypto = require('crypto');
const path = require('path');

dotenv.config();

// S3 configuration from environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

/**
 * Generates a random unique filename for S3 storage
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
 * Generates a pre-signed URL for uploading a file to S3
 * @param {string} userId - User ID
 * @param {string} documentType - Type of document (e.g., 'AADHAAR', 'PAN')
 * @param {string} originalFilename - Original filename
 * @param {string} contentType - Content type of the file (e.g., 'image/jpeg')
 * @returns {Object} - Object containing the URL and the generated filename
 */
async function generateUploadUrl(userId, documentType, originalFilename, contentType) {
  try {
    const uniqueFilename = generateUniqueFilename(originalFilename);
    const key = `users/${userId}/documents/${documentType.toLowerCase()}/${uniqueFilename}`;
    
    const putObjectParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType
    };
    
    const command = new PutObjectCommand(putObjectParams);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    
    return {
      uploadUrl: signedUrl,
      fileName: uniqueFilename,
      key
    };
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

/**
 * Generates a pre-signed URL for downloading/viewing a file from S3
 * @param {string} key - S3 object key
 * @returns {string} - Pre-signed URL for viewing/downloading
 */
async function generateDownloadUrl(key) {
  try {
    const getObjectParams = {
      Bucket: BUCKET_NAME,
      Key: key
    };
    
    const command = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    
    return signedUrl;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

module.exports = {
  generateUploadUrl,
  generateDownloadUrl
}; 