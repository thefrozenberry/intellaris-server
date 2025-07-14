const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
        // Auto-generated in format T001, T002, etc.
    },
    employeeId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
        index: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
        default: 'Pending',
        index: true
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    dueDate: {
        type: Date,
        index: true
    },
    startDate: {
        type: Date
    },
    completedDate: {
        type: Date
    },
    project: {
        type: String,
        maxlength: 100,
        index: true
    },
    assignedBy: {
        type: String,
        required: true,
        maxlength: 255
    },
    assignedByEmail: {
        type: String
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: 50
    }],
    estimatedHours: {
        type: Number,
        min: 0,
        default: 0
    },
    actualHours: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // Task details
    category: {
        type: String,
        enum: ['Development', 'Testing', 'Documentation', 'Meeting', 'Research', 'Training', 'Other'],
        default: 'Other'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Expert'],
        default: 'Medium'
    },
    
    // Collaboration
    collaborators: [{
        employeeId: String,
        name: String,
        role: {
            type: String,
            enum: ['Reviewer', 'Contributor', 'Observer']
        }
    }],
    
    // Comments and updates
    comments: [{
        authorId: String,
        authorName: String,
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['comment', 'progress_update', 'status_change'],
            default: 'comment'
        }
    }],
    
    // Attachments
    attachments: [{
        fileName: String,
        filePath: String,
        fileSize: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        uploadedBy: String
    }],
    
    // Dependencies
    dependencies: [{
        taskId: String,
        type: {
            type: String,
            enum: ['blocks', 'blocked_by', 'related']
        }
    }],
    
    // Approval workflow
    requiresApproval: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: String,
    approvalDate: Date,
    approvalComments: String,
    
    // Time tracking
    timeEntries: [{
        date: {
            type: Date,
            required: true
        },
        hours: {
            type: Number,
            required: true,
            min: 0
        },
        description: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Reminder settings
    reminders: [{
        date: Date,
        type: {
            type: String,
            enum: ['due_date', 'custom', 'overdue']
        },
        message: String,
        sent: {
            type: Boolean,
            default: false
        }
    }],
    
    // System metadata
    isOverdue: {
        type: Boolean,
        default: false
    },
    lastProgressUpdate: Date,
    lastStatusChange: Date,
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'tasks'
});

// Indexes for better query performance
taskSchema.index({ employeeId: 1, status: 1 });
taskSchema.index({ employeeId: 1, dueDate: 1 });
taskSchema.index({ employeeId: 1, priority: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedBy: 1, createdAt: -1 });
taskSchema.index({ dueDate: 1, status: 1 });
taskSchema.index({ 'tags': 1 });

// Virtual for checking if task is overdue
taskSchema.virtual('isTaskOverdue').get(function() {
    return this.dueDate && this.dueDate < new Date() && this.status !== 'Completed';
});

// Pre-save middleware to auto-generate task ID
taskSchema.pre('save', async function(next) {
    if (!this.isNew || this.id) return next();

    try {
        // Find the highest existing task ID
        const lastTask = await this.constructor.findOne(
            {},
            { id: 1 },
            { sort: { id: -1 } }
        );

        let nextNumber = 1;
        if (lastTask && lastTask.id) {
            const match = lastTask.id.match(/^T(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        // Generate new task ID
        this.id = `T${nextNumber.toString().padStart(3, '0')}`;
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to update status-related fields
taskSchema.pre('save', function(next) {
    // Update overdue status
    this.isOverdue = this.isTaskOverdue;
    
    // Track status changes
    if (this.isModified('status')) {
        this.lastStatusChange = new Date();
        
        // Set completion date when status changes to completed
        if (this.status === 'Completed' && !this.completedDate) {
            this.completedDate = new Date();
            this.progress = 100;
        }
        
        // Clear completion date if status changes from completed
        if (this.status !== 'Completed' && this.completedDate) {
            this.completedDate = undefined;
        }
    }
    
    // Track progress updates
    if (this.isModified('progress')) {
        this.lastProgressUpdate = new Date();
        
        // Auto-update status based on progress
        if (this.progress === 100 && this.status !== 'Completed') {
            this.status = 'Completed';
            this.completedDate = new Date();
        } else if (this.progress > 0 && this.status === 'Pending') {
            this.status = 'In Progress';
        }
    }
    
    // Calculate actual hours from time entries
    this.actualHours = this.timeEntries.reduce((total, entry) => total + entry.hours, 0);
    
    next();
});

// Instance method to add comment
taskSchema.methods.addComment = function(authorId, authorName, content, type = 'comment') {
    this.comments.push({
        authorId,
        authorName,
        content,
        type,
        timestamp: new Date()
    });
    return this.comments[this.comments.length - 1];
};

// Instance method to update progress
taskSchema.methods.updateProgress = function(newProgress, notes = '') {
    const oldProgress = this.progress;
    this.progress = Math.max(0, Math.min(100, newProgress));
    
    if (notes) {
        this.addComment(this.employeeId, 'System', 
            `Progress updated from ${oldProgress}% to ${this.progress}%. ${notes}`, 
            'progress_update');
    }
    
    return this;
};

// Instance method to add time entry
taskSchema.methods.addTimeEntry = function(date, hours, description = '') {
    this.timeEntries.push({
        date: new Date(date),
        hours,
        description
    });
    
    // Recalculate actual hours
    this.actualHours = this.timeEntries.reduce((total, entry) => total + entry.hours, 0);
    
    return this.timeEntries[this.timeEntries.length - 1];
};

// Instance method to add attachment
taskSchema.methods.addAttachment = function(fileName, filePath, fileSize, uploadedBy) {
    this.attachments.push({
        fileName,
        filePath,
        fileSize,
        uploadedBy,
        uploadedAt: new Date()
    });
    
    return this.attachments[this.attachments.length - 1];
};

// Static method to get employee tasks with filtering
taskSchema.statics.getEmployeeTasks = async function(employeeId, filters = {}, page = 1, limit = 10) {
    const query = { employeeId, isArchived: false };
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    
    if (filters.priority && filters.priority !== 'all') {
        query.priority = filters.priority;
    }
    
    if (filters.project && filters.project !== 'all') {
        query.project = filters.project;
    }
    
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } },
            { tags: { $in: [new RegExp(filters.search, 'i')] } }
        ];
    }
    
    if (filters.dueDate) {
        const date = new Date(filters.dueDate);
        query.dueDate = {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999))
        };
    }
    
    const skip = (page - 1) * limit;
    
    const [tasks, total] = await Promise.all([
        this.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query)
    ]);
    
    return {
        tasks,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Static method to get task summary
taskSchema.statics.getTaskSummary = async function(employeeId) {
    const summary = await this.aggregate([
        {
            $match: { employeeId, isArchived: false }
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: {
                    $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
                },
                inProgress: {
                    $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
                },
                completed: {
                    $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
                },
                onHold: {
                    $sum: { $cond: [{ $eq: ['$status', 'On Hold'] }, 1, 0] }
                },
                overdue: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $lt: ['$dueDate', new Date()] },
                                    { $ne: ['$status', 'Completed'] },
                                    { $ne: ['$status', 'Cancelled'] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                totalEstimatedHours: { $sum: '$estimatedHours' },
                totalActualHours: { $sum: '$actualHours' }
            }
        }
    ]);
    
    return summary[0] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        onHold: 0,
        overdue: 0,
        totalEstimatedHours: 0,
        totalActualHours: 0
    };
};

// Static method to get overdue tasks
taskSchema.statics.getOverdueTasks = async function(employeeId) {
    return await this.find({
        employeeId,
        dueDate: { $lt: new Date() },
        status: { $nin: ['Completed', 'Cancelled'] },
        isArchived: false
    }).sort({ dueDate: 1 });
};

// Static method to get tasks due soon
taskSchema.statics.getTasksDueSoon = async function(employeeId, days = 3) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await this.find({
        employeeId,
        dueDate: {
            $gte: new Date(),
            $lte: futureDate
        },
        status: { $nin: ['Completed', 'Cancelled'] },
        isArchived: false
    }).sort({ dueDate: 1 });
};

// Static method to get project-wise task distribution
taskSchema.statics.getProjectTaskDistribution = async function(employeeId) {
    return await this.aggregate([
        {
            $match: { employeeId, isArchived: false }
        },
        {
            $group: {
                _id: '$project',
                taskCount: { $sum: 1 },
                completedTasks: {
                    $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
                },
                pendingTasks: {
                    $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
                },
                inProgressTasks: {
                    $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
                }
            }
        },
        {
            $sort: { taskCount: -1 }
        }
    ]);
};

module.exports = mongoose.model('Task', taskSchema); 