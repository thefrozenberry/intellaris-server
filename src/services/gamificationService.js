const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Calculate maximum rushes based on transaction amount
 * @param {number} amount - Transaction amount in rupees
 * @returns {number} Maximum rushes for the transaction
 */
function calculateMaxRushes(amount) {
  if (amount >= 50 && amount <= 100) {
    return 10;
  } else if (amount > 100 && amount <= 250) {
    return 16;
  } else if (amount > 250 && amount <= 1000) {
    return 30;
  } else if (amount > 1000 && amount <= 5000) {
    return 60;
  } else if (amount > 5000 && amount <= 1000000) {
    return 200;
  } else {
    return 0; // For amounts below ₹50 or above ₹1000000
  }
}

/**
 * Create a new gamification transaction
 * @param {Object} data - Transaction data
 * @param {string} data.customerId - Customer ID
 * @param {string} data.transactionId - Transaction ID
 * @param {string} data.referenceId - Reference ID (8-10 digit unique ID)
 * @param {number} data.amount - Transaction amount
 * @param {string} data.paymentType - Payment type (merchant)
 * @returns {Promise<Object>} Created gamification transaction
 */
async function createTransaction(data) {
  const { customerId, transactionId, referenceId, amount, paymentType } = data;

  // Calculate max rushes based on amount
  const maxRushes = calculateMaxRushes(parseFloat(amount));

  // Create new transaction record
  const transaction = await prisma.gamificationTransaction.create({
    data: {
      customerId,
      transactionId,
      referenceId,
      amount: parseFloat(amount),
      paymentType,
      maxRushes,
    }
  });

  return transaction;
}

/**
 * Record points earned after game is played
 * @param {Object} data - Game results data
 * @param {string} data.customerId - Customer ID
 * @param {string} data.referenceId - Reference ID (8-10 digit unique ID)
 * @param {number} data.pointsEarned - Final rushes earned
 * @returns {Promise<Object>} Updated gamification transaction
 */
async function recordGameResults(data) {
  const { customerId, referenceId, pointsEarned } = data;

  // Find and update transaction with game results
  const transaction = await prisma.gamificationTransaction.update({
    where: {
      referenceId
    },
    data: {
      pointsEarned: parseInt(pointsEarned),
      gameCompletedAt: new Date()
    }
  });

  return transaction;
}

module.exports = {
  calculateMaxRushes,
  createTransaction,
  recordGameResults
}; 