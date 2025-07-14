const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generate a JWT access token
 * @param {string} userId - The user ID to include in the token
 * @returns {string} The JWT access token
 */
function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
}

/**
 * Generate a JWT refresh token
 * @param {string} userId - The user ID to include in the token
 * @returns {Promise<string>} The JWT refresh token
 */
async function generateRefreshToken(userId) {
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  // Calculate expiry date based on expiry time in .env
  const expiryTime = process.env.JWT_REFRESH_EXPIRY || '7d';
  const expiryNumber = parseInt(expiryTime);
  const expiryUnit = expiryTime.replace(/\d+/g, '');
  
  let expiresAt;
  if (expiryUnit === 'd') {
    expiresAt = new Date(Date.now() + expiryNumber * 24 * 60 * 60 * 1000);
  } else if (expiryUnit === 'h') {
    expiresAt = new Date(Date.now() + expiryNumber * 60 * 60 * 1000);
  } else if (expiryUnit === 'm') {
    expiresAt = new Date(Date.now() + expiryNumber * 60 * 1000);
  } else {
    // Default to 7 days
    expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  // Store the refresh token in the database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    }
  });

  return refreshToken;
}

/**
 * Verify a JWT access token
 * @param {string} token - The JWT access token to verify
 * @returns {Object|null} The decoded token payload or null if invalid
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Verify a JWT refresh token
 * @param {string} token - The JWT refresh token to verify
 * @returns {Promise<Object|null>} The user ID or null if invalid
 */
async function verifyRefreshToken(token) {
  try {
    // Verify the token signature
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    // Check if the token exists in the database and is active
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token,
        userId: decoded.userId,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!storedToken) {
      return null;
    }

    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
}

/**
 * Invalidate a refresh token
 * @param {string} token - The refresh token to invalidate
 * @returns {Promise<boolean>} Whether the token was invalidated
 */
async function invalidateRefreshToken(token) {
  try {
    await prisma.refreshToken.update({
      where: { token },
      data: { isActive: false }
    });
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  invalidateRefreshToken
}; 