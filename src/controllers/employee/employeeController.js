const asyncHandler = require('express-async-handler');
const Employee = require('../../models/employee/Employee');

/**
 * @desc    Get all employees
 * @route   GET /api/v1/employee/list
 * @access  Public
 */
const getAllEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find({ isActive: true })
        .select('-accessCode -passwordHash -loginAttempts -lockUntil')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: employees,
        message: 'Employees retrieved successfully'
    });
});

/**
 * @desc    Update employee details
 * @route   PUT /api/v1/employee/:id
 * @access  Public
 */
const updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields from update data
    delete updateData.accessCode;
    delete updateData.passwordHash;
    delete updateData.loginAttempts;
    delete updateData.lockUntil;
    delete updateData.id;
    delete updateData.enCode;

    const employee = await Employee.findOneAndUpdate(
        { id, isActive: true },
        { $set: updateData },
        { new: true, runValidators: true }
    ).select('-accessCode -passwordHash -loginAttempts -lockUntil');

    if (!employee) {
        res.status(404);
        throw new Error('Employee not found');
    }

    res.json({
        success: true,
        data: employee,
        message: 'Employee updated successfully'
    });
});

module.exports = {
    getAllEmployees,
    updateEmployee
}; 