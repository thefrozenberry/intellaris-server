const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
        // Auto-generated in format A001, A002, etc.
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    type: {
        type: String,
        enum: ['General', 'HR', 'IT', 'Finance', 'Operations', 'Policy', 'Event', 'Holiday', 'Training', 'Emergency'],
        required: true,
        index: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Normal', 'High', 'Urgent'],
        default: 'Normal',
        index: true
    },
    urgent: {
        type: Boolean,
        default: false,
        index: true
    },
    
    // Publishing details
    author: {
        employeeId: String,
        name: {
            type: String,
            required: true
        },
        email: String,
        department: String
    },
    publishedDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    expiryDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    
    // Target audience
    targetAudience: {
        type: String,
        enum: ['All Employees', 'Department Specific', 'Role Specific', 'Location Specific', 'Custom'],
        default: 'All Employees'
    },
    targetCriteria: {
        departments: [String],
        roles: [String],
        locations: [String],
        employeeIds: [String],
        excludeEmployeeIds: [String]
    },
    
    // Attachments
    attachments: [{
        fileName: String,
        originalName: String,
        filePath: String,
        fileSize: Number,
        mimeType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Read tracking
    readBy: [{
        employeeId: {
            type: String,
            required: true
        },
        readAt: {
            type: Date,
            default: Date.now
        },
        ipAddress: String,
        device: String
    }],
    
    // Analytics
    analytics: {
        totalEmployees: {
            type: Number,
            default: 0
        },
        totalReads: {
            type: Number,
            default: 0
        },
        readPercentage: {
            type: Number,
            default: 0
        },
        firstReadAt: Date,
        lastReadAt: Date
    },
    
    // Notification settings
    notifications: {
        sendEmail: {
            type: Boolean,
            default: false
        },
        sendSMS: {
            type: Boolean,
            default: false
        },
        sendPushNotification: {
            type: Boolean,
            default: true
        },
        emailSent: {
            type: Boolean,
            default: false
        },
        smsSent: {
            type: Boolean,
            default: false
        },
        pushNotificationSent: {
            type: Boolean,
            default: false
        }
    },
    
    // Comments/Feedback
    commentsEnabled: {
        type: Boolean,
        default: false
    },
    comments: [{
        employeeId: String,
        employeeName: String,
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        isApproved: {
            type: Boolean,
            default: true
        }
    }],
    
    // Approval workflow
    requiresApproval: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'approved'
    },
    approvedBy: {
        employeeId: String,
        name: String,
        approvedAt: Date
    },
    rejectedBy: {
        employeeId: String,
        name: String,
        rejectedAt: Date,
        reason: String
    },
    
    // Pinning and featuring
    isPinned: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    pinnedUntil: Date,
    featuredUntil: Date,
    
    // Scheduling
    isScheduled: {
        type: Boolean,
        default: false
    },
    scheduledPublishDate: Date,
    autoExpire: {
        type: Boolean,
        default: false
    },
    autoExpireDays: {
        type: Number,
        default: 30
    },
    
    // Tags and categories
    tags: [{
        type: String,
        trim: true,
        maxlength: 50
    }],
    category: String,
    
    // Versioning
    version: {
        type: Number,
        default: 1
    },
    isRevision: {
        type: Boolean,
        default: false
    },
    originalAnnouncementId: String,
    revisionHistory: [{
        version: Number,
        revisedBy: String,
        revisedAt: Date,
        changes: String
    }],
    
    // System metadata
    lastModified: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'announcements'
});

// Indexes for better query performance
announcementSchema.index({ publishedDate: -1 });
announcementSchema.index({ type: 1, publishedDate: -1 });
announcementSchema.index({ urgent: 1, publishedDate: -1 });
announcementSchema.index({ isActive: 1, publishedDate: -1 });
announcementSchema.index({ targetAudience: 1 });
announcementSchema.index({ 'targetCriteria.departments': 1 });
announcementSchema.index({ 'targetCriteria.employeeIds': 1 });
announcementSchema.index({ isPinned: 1, isFeatured: 1 });
announcementSchema.index({ expiryDate: 1 });
announcementSchema.index({ 'readBy.employeeId': 1 });

// Pre-save middleware to auto-generate announcement ID
announcementSchema.pre('save', async function(next) {
    if (!this.isNew || this.id) return next();

    try {
        const lastAnnouncement = await this.constructor.findOne(
            {},
            { id: 1 },
            { sort: { id: -1 } }
        );

        let nextNumber = 1;
        if (lastAnnouncement && lastAnnouncement.id) {
            const match = lastAnnouncement.id.match(/^A(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        this.id = `A${nextNumber.toString().padStart(3, '0')}`;
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to update analytics and handle auto-expiry
announcementSchema.pre('save', function(next) {
    // Update read analytics
    this.analytics.totalReads = this.readBy.length;
    
    // Update read percentage if total employees is set
    if (this.analytics.totalEmployees > 0) {
        this.analytics.readPercentage = Math.round((this.analytics.totalReads / this.analytics.totalEmployees) * 100);
    }
    
    // Set first and last read times
    if (this.readBy.length > 0) {
        const readTimes = this.readBy.map(read => read.readAt).sort((a, b) => a - b);
        this.analytics.firstReadAt = readTimes[0];
        this.analytics.lastReadAt = readTimes[readTimes.length - 1];
    }
    
    // Handle auto-expiry
    if (this.autoExpire && !this.expiryDate && this.publishedDate) {
        const expiryDate = new Date(this.publishedDate);
        expiryDate.setDate(expiryDate.getDate() + (this.autoExpireDays || 30));
        this.expiryDate = expiryDate;
    }
    
    // Check if announcement has expired
    if (this.expiryDate && this.expiryDate < new Date()) {
        this.isActive = false;
    }
    
    // Handle pinned/featured expiry
    if (this.pinnedUntil && this.pinnedUntil < new Date()) {
        this.isPinned = false;
    }
    
    if (this.featuredUntil && this.featuredUntil < new Date()) {
        this.isFeatured = false;
    }
    
    this.lastModified = new Date();
    next();
});

// Instance method to mark as read by employee
announcementSchema.methods.markAsRead = function(employeeId, ipAddress = '', device = '') {
    // Check if already read by this employee
    const existingRead = this.readBy.find(read => read.employeeId === employeeId);
    
    if (!existingRead) {
        this.readBy.push({
            employeeId,
            readAt: new Date(),
            ipAddress,
            device
        });
    }
    
    return this;
};

// Instance method to check if read by employee
announcementSchema.methods.isReadBy = function(employeeId) {
    return this.readBy.some(read => read.employeeId === employeeId);
};

// Instance method to add comment
announcementSchema.methods.addComment = function(employeeId, employeeName, content) {
    if (!this.commentsEnabled) {
        throw new Error('Comments are not enabled for this announcement');
    }
    
    this.comments.push({
        employeeId,
        employeeName,
        content,
        timestamp: new Date()
    });
    
    return this.comments[this.comments.length - 1];
};

// Instance method to pin announcement
announcementSchema.methods.pin = function(duration = null) {
    this.isPinned = true;
    
    if (duration) {
        this.pinnedUntil = new Date(Date.now() + duration);
    }
    
    return this;
};

// Instance method to feature announcement
announcementSchema.methods.feature = function(duration = null) {
    this.isFeatured = true;
    
    if (duration) {
        this.featuredUntil = new Date(Date.now() + duration);
    }
    
    return this;
};

// Static method to get announcements for employee
announcementSchema.statics.getAnnouncementsForEmployee = async function(employeeId, employeeData = {}, filters = {}, page = 1, limit = 10) {
    const query = {
        isActive: true,
        isArchived: false,
        approvalStatus: 'approved'
    };
    
    // Handle scheduled announcements
    query.publishedDate = { $lte: new Date() };
    
    // Apply filters
    if (filters.type && filters.type !== 'all') {
        query.type = filters.type;
    }
    
    if (filters.urgent !== undefined) {
        query.urgent = filters.urgent;
    }
    
    if (filters.unreadOnly) {
        query['readBy.employeeId'] = { $ne: employeeId };
    }
    
    // Target audience filtering
    const targetQuery = {
        $or: [
            { targetAudience: 'All Employees' },
            { 'targetCriteria.employeeIds': employeeId }
        ]
    };
    
    // Add department-specific targeting
    if (employeeData.department) {
        targetQuery.$or.push({
            targetAudience: 'Department Specific',
            'targetCriteria.departments': employeeData.department
        });
    }
    
    // Add role-specific targeting
    if (employeeData.designation) {
        targetQuery.$or.push({
            targetAudience: 'Role Specific',
            'targetCriteria.roles': employeeData.designation
        });
    }
    
    // Exclude if employee is in exclusion list
    targetQuery.$or.push({
        'targetCriteria.excludeEmployeeIds': { $ne: employeeId }
    });
    
    query.$and = [targetQuery];
    
    const skip = (page - 1) * limit;
    
    const [announcements, total] = await Promise.all([
        this.find(query)
            .sort({ isPinned: -1, isFeatured: -1, publishedDate: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query)
    ]);
    
    // Add read status for each announcement
    const announcementsWithReadStatus = announcements.map(announcement => ({
        ...announcement,
        isRead: announcement.readBy.some(read => read.employeeId === employeeId)
    }));
    
    return {
        announcements: announcementsWithReadStatus,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Static method to get unread count for employee
announcementSchema.statics.getUnreadCount = async function(employeeId, employeeData = {}) {
    const query = {
        isActive: true,
        isArchived: false,
        approvalStatus: 'approved',
        publishedDate: { $lte: new Date() },
        'readBy.employeeId': { $ne: employeeId }
    };
    
    // Target audience filtering (same as above)
    const targetQuery = {
        $or: [
            { targetAudience: 'All Employees' },
            { 'targetCriteria.employeeIds': employeeId }
        ]
    };
    
    if (employeeData.department) {
        targetQuery.$or.push({
            targetAudience: 'Department Specific',
            'targetCriteria.departments': employeeData.department
        });
    }
    
    if (employeeData.designation) {
        targetQuery.$or.push({
            targetAudience: 'Role Specific',
            'targetCriteria.roles': employeeData.designation
        });
    }
    
    query.$and = [targetQuery];
    
    const [totalUnread, urgentUnread] = await Promise.all([
        this.countDocuments(query),
        this.countDocuments({ ...query, urgent: true })
    ]);
    
    return {
        totalUnread,
        urgentUnread
    };
};

// Static method to get announcement analytics
announcementSchema.statics.getAnnouncementAnalytics = async function(announcementId) {
    const announcement = await this.findOne({ id: announcementId });
    
    if (!announcement) {
        throw new Error('Announcement not found');
    }
    
    const readByDepartment = await this.aggregate([
        { $match: { id: announcementId } },
        { $unwind: '$readBy' },
        {
            $lookup: {
                from: 'employees',
                localField: 'readBy.employeeId',
                foreignField: 'id',
                as: 'employee'
            }
        },
        { $unwind: '$employee' },
        {
            $group: {
                _id: '$employee.department',
                readCount: { $sum: 1 }
            }
        },
        { $sort: { readCount: -1 } }
    ]);
    
    return {
        basic: announcement.analytics,
        readByDepartment,
        readTimeline: announcement.readBy.map(read => ({
            date: read.readAt,
            count: 1
        }))
    };
};

module.exports = mongoose.model('Announcement', announcementSchema); 