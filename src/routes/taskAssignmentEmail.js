const express = require('express');
const router = express.Router();
const taskAssignmentEmailController = require('../controllers/taskAssignmentEmailController');
const { apiAccess } = require('../middlewares/authMiddleware');

// Apply API access control middleware
router.use(apiAccess);

// Task assignment email route
router.post('/send-task-assignment-email', taskAssignmentEmailController.sendTaskAssignmentEmail);

module.exports = router; 