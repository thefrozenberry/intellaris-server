const Employee = require('../models/employee/Employee');
const taskAssignmentEmailService = require('../services/taskAssignmentEmailService');

/**
 * POST /api/send-task-assignment-email
 * Body: { enCode, taskData }
 * No authentication required
 */
exports.sendTaskAssignmentEmail = async (req, res) => {
    try {
        const { enCode, taskData } = req.body;
        
        if (!enCode || !taskData) {
            return res.status(400).json({ 
                success: false, 
                message: 'enCode and taskData are required.' 
            });
        }

        // Validate required task data fields
        const requiredFields = [
            'taskName', 'referenceId', 'assignmentDate', 'deadline',
            'priorityLevel', 'department', 'objective', 'details',
            'deliverables', 'acknowledgmentTime', 'teamLead',
            'submissionPlatform'
        ];

        const missingFields = requiredFields.filter(field => !taskData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required task data fields: ${missingFields.join(', ')}`
            });
        }

        // Find employee by enCode
        const employee = await Employee.findOne({ enCode });
        if (!employee) {
            return res.status(404).json({ 
                success: false, 
                message: 'No employee found for this enCode.' 
            });
        }

        // Add employee information to task data
        const enrichedTaskData = {
            ...taskData,
            employeeName: employee.fullName,
            employeeCode: employee.enCode,
            profileImage: employee.profileImage
        };

        try {
            // Send email
            await taskAssignmentEmailService.sendTaskAssignmentEmail(
                employee.email,
                enrichedTaskData
            );

            return res.json({ 
                success: true, 
                message: 'Task assignment email sent successfully.' 
            });
        } catch (emailError) {
            console.error('Email sending error:', {
                error: emailError.message,
                code: emailError.code,
                stack: emailError.stack
            });

            return res.status(500).json({ 
                success: false, 
                message: 'Failed to send task assignment email.',
                error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
            });
        }
    } catch (error) {
        console.error('Error in sendTaskAssignmentEmail:', {
            error: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 