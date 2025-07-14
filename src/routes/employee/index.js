const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const attendanceRoutes = require('./attendance');
const taskRoutes = require('./tasks');
const leaveRoutes = require('./leaves');
const expenseRoutes = require('./expenses');
const payslipRoutes = require('./payslips');
const announcementRoutes = require('./announcements');
const dashboardRoutes = require('./dashboard');
const employeeRoutes = require('./employees');

// Authentication middleware
const { authenticateEmployee } = require('../../middlewares/employeeAuth');

// Authentication routes (public)
router.use('/auth', authRoutes);

// Employee management routes (public)
router.use('/', employeeRoutes);

// Protected routes
router.use('/profile', authenticateEmployee, profileRoutes);
router.use('/attendance', authenticateEmployee, attendanceRoutes);
router.use('/tasks', authenticateEmployee, taskRoutes);
router.use('/leaves', authenticateEmployee, leaveRoutes);
router.use('/expenses', authenticateEmployee, expenseRoutes);
router.use('/payslips', authenticateEmployee, payslipRoutes);
router.use('/announcements', authenticateEmployee, announcementRoutes);
router.use('/dashboard', authenticateEmployee, dashboardRoutes);

// Employee status endpoint
router.get('/status', authenticateEmployee, (req, res) => {
    res.json({
        success: true,
        data: {
            employee: req.employee,
            tokenInfo: req.tokenInfo,
            serverTime: new Date().toISOString()
        },
        message: 'Employee authenticated successfully'
    });
});

module.exports = router; 