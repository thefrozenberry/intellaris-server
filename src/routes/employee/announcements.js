const express = require('express');
const router = express.Router();

// Import controllers
const {
    getAnnouncements,
    getUnreadCount,
    markAsRead
} = require('../../controllers/employee/announcementController');

/**
 * @route   GET /api/v1/employee/announcements
 * @desc    Get announcements for employee
 * @access  Private
 */
router.get('/', getAnnouncements);

/**
 * @route   GET /api/v1/employee/announcements/unread-count
 * @desc    Get unread announcements count
 * @access  Private
 */
router.get('/unread-count', getUnreadCount);

/**
 * @route   POST /api/v1/employee/announcements/:announcementId/read
 * @desc    Mark announcement as read
 * @access  Private
 */
router.post('/:announcementId/read', markAsRead);

module.exports = router; 