const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Task = require('../../models/employee/Task');

/**
 * @desc    Get employee tasks
 * @route   GET /api/v1/employee/tasks
 * @access  Private
 */
const getTasks = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { status, priority, project, page = 1, limit = 10, search } = req.query;

        const filters = {};
        if (status && status !== 'all') filters.status = status;
        if (priority && priority !== 'all') filters.priority = priority;
        if (project && project !== 'all') filters.project = project;
        if (search) filters.search = search;

        const result = await Task.getEmployeeTasks(employeeId, filters, parseInt(page), parseInt(limit));

        res.json({
            success: true,
            data: {
                tasks: result.tasks,
                pagination: result.pagination
            },
            message: 'Tasks retrieved successfully'
        });

    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            error: 'TASKS_FETCH_FAILED',
            message: 'Failed to retrieve tasks'
        });
    }
});

/**
 * @desc    Get task summary
 * @route   GET /api/v1/employee/tasks/summary
 * @access  Private
 */
const getTaskSummary = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const summary = await Task.getTaskSummary(employeeId);

        res.json({
            success: true,
            data: { summary },
            message: 'Task summary retrieved successfully'
        });

    } catch (error) {
        console.error('Get task summary error:', error);
        res.status(500).json({
            success: false,
            error: 'TASK_SUMMARY_FAILED',
            message: 'Failed to retrieve task summary'
        });
    }
});

/**
 * @desc    Update task progress
 * @route   PUT /api/v1/employee/tasks/:taskId/progress
 * @access  Private
 */
const updateTaskProgress = [
    body('progress').isNumeric().isFloat({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.mapped()
            });
        }

        try {
            const { taskId } = req.params;
            const { progress, notes } = req.body;
            const employeeId = req.employee.id;

            const task = await Task.findOne({ id: taskId, employeeId });

            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'TASK_NOT_FOUND',
                    message: 'Task not found'
                });
            }

            task.updateProgress(progress, notes);
            await task.save();

            res.json({
                success: true,
                data: {
                    taskId: task.id,
                    progress: task.progress,
                    status: task.status
                },
                message: 'Task progress updated successfully'
            });

        } catch (error) {
            console.error('Update task progress error:', error);
            res.status(500).json({
                success: false,
                error: 'TASK_UPDATE_FAILED',
                message: 'Failed to update task progress'
            });
        }
    })
];

module.exports = {
    getTasks,
    getTaskSummary,
    updateTaskProgress
}; 