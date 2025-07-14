const Employee = require('../models/employee/Employee');
const businessEmailSetupService = require('../services/businessEmailSetupService');

/**
 * POST /api/send-business-email-setup
 * Body: { enCode, businessEmail, password }
 * No authentication required
 */
exports.sendBusinessEmailSetup = async (req, res) => {
    try {
        const { enCode, businessEmail, password } = req.body;
        
        if (!enCode || !businessEmail || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'enCode, businessEmail, and password are required.' 
            });
        }

        const employee = await Employee.findOne({ enCode });
        if (!employee) {
            return res.status(404).json({ 
                success: false, 
                message: 'No employee found for this enCode.' 
            });
        }

        const emailSent = await businessEmailSetupService.sendBusinessEmailSetup(
            employee.email,
            employee.fullName,
            businessEmail,
            password
        );

        if (emailSent) {
            return res.json({ 
                success: true, 
                message: 'Business email setup notification sent successfully.' 
            });
        } else {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to send business email setup notification.' 
            });
        }
    } catch (error) {
        console.error('Error in sendBusinessEmailSetup:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 