const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { receiveTransactionValidation, recordGameScoreValidation } = require('../middlewares/gamificationValidation');

/**
 * Gamification routes
 */

/**
 * @route POST /api/gamification/receive
 * @desc Receiver API - Process transaction details and return max rushes
 * @access Private
 */
router.post(
  '/receive',
  receiveTransactionValidation,
  gamificationController.receiveTransaction
);

/**
 * @route POST /api/gamification/record
 * @desc Sender API - Record final points earned after game
 * @access Private
 */
router.post(
  '/record',
  recordGameScoreValidation,
  gamificationController.recordGameScore
);

module.exports = router; 