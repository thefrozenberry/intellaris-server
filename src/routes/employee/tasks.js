const express = require('express');
const router = express.Router();

// Import controllers
const {
    getTasks,
    getTaskSummary,
    updateTaskProgress
} = require('../../controllers/employee/taskController');

/**
 * @route   GET /api/v1/employee/tasks
 * @desc    Get employee tasks
 * @access  Private
 */
router.get('/', getTasks);

/**
 * @route   GET /api/v1/employee/tasks/summary
 * @desc    Get task summary
 * @access  Private
 */
router.get('/summary', getTaskSummary);

/**
 * @route   PUT /api/v1/employee/tasks/:taskId/progress
 * @desc    Update task progress
 * @access  Private
 */
router.put('/:taskId/progress', updateTaskProgress);

module.exports = router; 