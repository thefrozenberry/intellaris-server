const gamificationService = require('../services/gamificationService');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Controller for receiving transaction details and calculating max rushes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with max rushes for the transaction
 */
async function receiveTransaction(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract transaction data from request body
    const transactionData = req.body;
    
    // Create transaction and calculate max rushes
    const transaction = await gamificationService.createTransaction(transactionData);
    
    // Return success response with max rushes
    return res.status(200).json(successResponse({
      maxRushes: transaction.maxRushes,
      transactionId: transaction.transactionId,
      referenceId: transaction.referenceId,
      amount: transaction.amount
    }, 'Max rushes calculated successfully', 200));
  } catch (error) {
    console.error('Error in receiveTransaction:', error);
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to process transaction',
      error.error || error.message,
      error.status || 500
    ));
  }
}

/**
 * Controller for recording game results after play
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with updated transaction including points earned
 */
async function recordGameScore(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(
        'Validation failed',
        errors.array(),
        400
      ));
    }

    // Extract game result data from request body
    const gameResultData = req.body;
    
    // Record game results
    const updatedTransaction = await gamificationService.recordGameResults(gameResultData);
    
    // Return success response
    return res.status(200).json(successResponse({
      transactionId: updatedTransaction.transactionId,
      referenceId: updatedTransaction.referenceId,
      pointsEarned: updatedTransaction.pointsEarned,
      maxRushes: updatedTransaction.maxRushes,
      gameCompletedAt: updatedTransaction.gameCompletedAt
    }, 'Game score recorded successfully', 200));
  } catch (error) {
    console.error('Error in recordGameScore:', error);
    // Return error response
    return res.status(error.status || 500).json(errorResponse(
      error.message || 'Failed to record game score',
      error.error || error.message,
      error.status || 500
    ));
  }
}

module.exports = {
  receiveTransaction,
  recordGameScore
}; 