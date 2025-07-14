const express = require('express');
const router = express.Router();

// Import controllers
const {
    getAllEmployees,
    updateEmployee
} = require('../../controllers/employee/employeeController');

/**
 * @route   GET /api/v1/employee/list
 * @desc    Get all employees
 * @access  Public
 */
router.get('/list', getAllEmployees);

/**
 * @route   PUT /api/v1/employee/:id
 * @desc    Update employee details
 * @access  Public
 */
router.put('/:id', updateEmployee);

module.exports = router; 