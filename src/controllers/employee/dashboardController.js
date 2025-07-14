const asyncHandler = require('express-async-handler');
const Employee = require('../../models/employee/Employee');
const Attendance = require('../../models/employee/Attendance');
const Task = require('../../models/employee/Task');
const { LeaveBalance } = require('../../models/employee/Leave');
const Announcement = require('../../models/employee/Announcement');

/**
 * @desc    Get dashboard data
 * @route   GET /api/v1/employee/dashboard
 * @access  Private
 */
const getDashboardData = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const employeeData = {
            department: req.employee.department,
            designation: req.employee.designation
        };

        // Get all dashboard data in parallel
        const [
            todayAttendance,
            taskSummary,
            leaveBalance,
            unreadCount,
            employee
        ] = await Promise.all([
            Attendance.getTodayAttendance(employeeId),
            Task.getTaskSummary(employeeId),
            LeaveBalance.getOrCreateBalance(employeeId),
            Announcement.getUnreadCount(employeeId, employeeData),
            Employee.findOne({ id: employeeId })
        ]);

        // Quick stats
        const quickStats = {
            attendance: {
                hasCheckedIn: !!todayAttendance?.checkIn?.time,
                hasCheckedOut: !!todayAttendance?.checkOut?.time,
                isOnBreak: todayAttendance?.isOnBreak || false,
                workingHours: todayAttendance?.formattedWorkingHours || '00:00:00',
                status: todayAttendance?.status || 'Absent'
            },
            tasks: {
                total: taskSummary.total,
                pending: taskSummary.pending,
                inProgress: taskSummary.inProgress,
                completed: taskSummary.completed,
                overdue: taskSummary.overdue
            },
            leaves: {
                remainingAnnual: leaveBalance.remainingAnnualLeave,
                remainingSick: leaveBalance.remainingSickLeave,
                remainingPersonal: leaveBalance.remainingPersonalLeave
            },
            announcements: {
                totalUnread: unreadCount.totalUnread,
                urgentUnread: unreadCount.urgentUnread
            },
            profile: {
                completionPercentage: employee.profileCompletion.percentage,
                isComplete: employee.profileCompleted
            }
        };

        res.json({
            success: true,
            data: {
                employee: {
                    id: employee.id,
                    fullName: employee.fullName,
                    designation: employee.designation,
                    department: employee.department,
                    profileImage: employee.profileImage
                },
                quickStats,
                lastUpdated: new Date()
            },
            message: 'Dashboard data retrieved successfully'
        });

    } catch (error) {
        console.error('Get dashboard data error:', error);
        res.status(500).json({
            success: false,
            error: 'DASHBOARD_FETCH_FAILED',
            message: 'Failed to retrieve dashboard data'
        });
    }
});

module.exports = {
    getDashboardData
}; 