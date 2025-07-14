const Employee = require('../models/employee/Employee');
const investmentEmailService = require('../services/investmentEmailService');

/**
 * POST /api/send-investment-email
 * Body: { enCode, amount, date }
 * No authentication required
 */
exports.sendInvestmentEmail = async (req, res) => {
    try {
        const { enCode, amount, date } = req.body;
        if (!enCode || !amount || !date) {
            return res.status(400).json({ success: false, message: 'enCode, amount, and date are required.' });
        }
        const employee = await Employee.findOne({ enCode });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'No user found for this enCode.' });
        }
        const emailSent = await investmentEmailService.sendInvestmentEmail(employee.email, amount, date, employee.fullName);
        if (emailSent) {
            return res.json({ success: true, message: 'Investment email sent successfully.' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to send investment email.' });
        }
    } catch (error) {
        console.error('Error in sendInvestmentEmail:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}; 