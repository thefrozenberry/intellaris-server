const asyncHandler = require('express-async-handler');
const Announcement = require('../../models/employee/Announcement');

/**
 * @desc    Get announcements for employee
 * @route   GET /api/v1/employee/announcements
 * @access  Private
 */
const getAnnouncements = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const employeeData = {
            department: req.employee.department,
            designation: req.employee.designation
        };
        const { type, urgent, unreadOnly, page = 1, limit = 10 } = req.query;

        const filters = {};
        if (type && type !== 'all') filters.type = type;
        if (urgent !== undefined) filters.urgent = urgent === 'true';
        if (unreadOnly !== undefined) filters.unreadOnly = unreadOnly === 'true';

        const result = await Announcement.getAnnouncementsForEmployee(
            employeeId, 
            employeeData, 
            filters, 
            parseInt(page), 
            parseInt(limit)
        );

        res.json({
            success: true,
            data: {
                announcements: result.announcements,
                pagination: result.pagination
            },
            message: 'Announcements retrieved successfully'
        });

    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({
            success: false,
            error: 'ANNOUNCEMENTS_FETCH_FAILED',
            message: 'Failed to retrieve announcements'
        });
    }
});

/**
 * @desc    Get unread announcements count
 * @route   GET /api/v1/employee/announcements/unread-count
 * @access  Private
 */
const getUnreadCount = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const employeeData = {
            department: req.employee.department,
            designation: req.employee.designation
        };

        const count = await Announcement.getUnreadCount(employeeId, employeeData);

        res.json({
            success: true,
            data: count,
            message: 'Unread count retrieved successfully'
        });

    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            error: 'UNREAD_COUNT_FAILED',
            message: 'Failed to retrieve unread count'
        });
    }
});

/**
 * @desc    Mark announcement as read
 * @route   POST /api/v1/employee/announcements/:announcementId/read
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res) => {
    try {
        const { announcementId } = req.params;
        const employeeId = req.employee.id;
        const ipAddress = req.ip;
        const device = req.get('User-Agent') || 'Unknown';

        const announcement = await Announcement.findOne({ id: announcementId });

        if (!announcement) {
            return res.status(404).json({
                success: false,
                error: 'ANNOUNCEMENT_NOT_FOUND',
                message: 'Announcement not found'
            });
        }

        announcement.markAsRead(employeeId, ipAddress, device);
        await announcement.save();

        res.json({
            success: true,
            data: {
                announcementId,
                readAt: new Date()
            },
            message: 'Announcement marked as read'
        });

    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            error: 'MARK_READ_FAILED',
            message: 'Failed to mark announcement as read'
        });
    }
});

module.exports = {
    getAnnouncements,
    getUnreadCount,
    markAsRead
}; 