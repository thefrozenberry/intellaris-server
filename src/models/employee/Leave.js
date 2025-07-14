const mongoose = require('mongoose');
const moment = require('moment');

const leaveApplicationSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
        // Auto-generated in format L001, L002, etc.
    },
    employeeId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave', 'Emergency Leave', 'Casual Leave'],
        required: true,
        index: true
    },
    fromDate: {
        type: Date,
        required: true,
        index: true
    },
    toDate: {
        type: Date,
        required: true,
        index: true
    },
    days: {
        type: Number,
        required: true,
        min: 0.5
    },
    isHalfDay: {
        type: Boolean,
        default: false
    },
    halfDaySession: {
        type: String,
        enum: ['morning', 'afternoon'],
        required: function() { return this.isHalfDay; }
    },
    reason: {
        type: String,
        required: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Withdrawn'],
        default: 'Pending',
        index: true
    },
    appliedDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    
    // Emergency contact (for emergency leaves)
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    
    // Approval workflow
    approvalLevel: {
        type: Number,
        default: 1
    },
    approvers: [{
        level: Number,
        approverId: String,
        approverName: String,
        approverEmail: String,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected']
        },
        comments: String,
        actionDate: Date
    }],
    
    finalApprover: {
        approverId: String,
        approverName: String,
        approverEmail: String
    },
    approvedDate: Date,
    rejectedDate: Date,
    approvalComments: String,
    rejectionReason: String,
    
    // Handover details
    handoverTo: {
        employeeId: String,
        employeeName: String,
        email: String
    },
    handoverNotes: String,
    handoverCompleted: {
        type: Boolean,
        default: false
    },
    
    // Attachments (medical certificates, etc.)
    attachments: [{
        fileName: String,
        filePath: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Return from leave
    actualReturnDate: Date,
    returnNotes: String,
    extendedDays: {
        type: Number,
        default: 0
    },
    
    // HR notes
    hrNotes: String,
    hrProcessedBy: String,
    hrProcessedDate: Date,
    
    // Cancellation details
    cancelledDate: Date,
    cancellationReason: String,
    cancelledBy: String,
    
    // System metadata
    lastModified: {
        type: Date,
        default: Date.now
    },
    notification: {
        employeeNotified: { type: Boolean, default: false },
        approverNotified: { type: Boolean, default: false },
        hrNotified: { type: Boolean, default: false }
    }
}, {
    timestamps: true,
    collection: 'leave_applications'
});

// Separate schema for leave balance tracking
const leaveBalanceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    leaveYear: {
        type: String,
        required: true,
        default: function() {
            return `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
        }
    },
    
    // Annual Leave
    totalAnnualLeave: {
        type: Number,
        default: 24
    },
    usedAnnualLeave: {
        type: Number,
        default: 0
    },
    remainingAnnualLeave: {
        type: Number,
        default: function() {
            return this.totalAnnualLeave - this.usedAnnualLeave;
        }
    },
    
    // Sick Leave
    totalSickLeave: {
        type: Number,
        default: 12
    },
    usedSickLeave: {
        type: Number,
        default: 0
    },
    remainingSickLeave: {
        type: Number,
        default: function() {
            return this.totalSickLeave - this.usedSickLeave;
        }
    },
    
    // Personal Leave
    totalPersonalLeave: {
        type: Number,
        default: 6
    },
    usedPersonalLeave: {
        type: Number,
        default: 0
    },
    remainingPersonalLeave: {
        type: Number,
        default: function() {
            return this.totalPersonalLeave - this.usedPersonalLeave;
        }
    },
    
    // Carry forward leaves from previous year
    carryForwardLeave: {
        type: Number,
        default: 0
    },
    
    // Comp-off leaves
    compOffLeave: {
        type: Number,
        default: 0
    },
    
    // Leave encashment
    encashableLeaves: {
        type: Number,
        default: 0
    },
    
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'leave_balances'
});

// Indexes for leave applications
leaveApplicationSchema.index({ employeeId: 1, status: 1 });
leaveApplicationSchema.index({ employeeId: 1, fromDate: -1 });
leaveApplicationSchema.index({ status: 1, appliedDate: -1 });
leaveApplicationSchema.index({ type: 1, status: 1 });

// Pre-save middleware to auto-generate leave ID
leaveApplicationSchema.pre('save', async function(next) {
    if (!this.isNew || this.id) return next();

    try {
        const lastLeave = await this.constructor.findOne(
            {},
            { id: 1 },
            { sort: { id: -1 } }
        );

        let nextNumber = 1;
        if (lastLeave && lastLeave.id) {
            const match = lastLeave.id.match(/^L(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        this.id = `L${nextNumber.toString().padStart(3, '0')}`;
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to calculate leave days
leaveApplicationSchema.pre('save', function(next) {
    if (this.fromDate && this.toDate) {
        if (this.isHalfDay) {
            this.days = 0.5;
        } else {
            const from = moment(this.fromDate);
            const to = moment(this.toDate);
            this.days = to.diff(from, 'days') + 1;
        }
    }
    
    this.lastModified = new Date();
    next();
});

// Instance method to approve leave
leaveApplicationSchema.methods.approve = function(approverId, approverName, comments = '') {
    this.status = 'Approved';
    this.approvedDate = new Date();
    this.finalApprover = {
        approverId,
        approverName
    };
    this.approvalComments = comments;
    
    return this;
};

// Instance method to reject leave
leaveApplicationSchema.methods.reject = function(approverId, approverName, reason) {
    this.status = 'Rejected';
    this.rejectedDate = new Date();
    this.finalApprover = {
        approverId,
        approverName
    };
    this.rejectionReason = reason;
    
    return this;
};

// Instance method to cancel leave
leaveApplicationSchema.methods.cancel = function(cancelledBy, reason) {
    this.status = 'Cancelled';
    this.cancelledDate = new Date();
    this.cancelledBy = cancelledBy;
    this.cancellationReason = reason;
    
    return this;
};

// Static method to get employee leave applications
leaveApplicationSchema.statics.getEmployeeLeaves = async function(employeeId, filters = {}, page = 1, limit = 10) {
    const query = { employeeId };
    
    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    
    if (filters.type && filters.type !== 'all') {
        query.type = filters.type;
    }
    
    if (filters.year) {
        const yearStart = new Date(filters.year, 0, 1);
        const yearEnd = new Date(filters.year, 11, 31);
        query.fromDate = { $gte: yearStart, $lte: yearEnd };
    }
    
    const skip = (page - 1) * limit;
    
    const [applications, total] = await Promise.all([
        this.find(query)
            .sort({ appliedDate: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query)
    ]);
    
    return {
        applications,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Static method to check leave overlap
leaveApplicationSchema.statics.checkLeaveOverlap = async function(employeeId, fromDate, toDate, excludeId = null) {
    const query = {
        employeeId,
        status: { $in: ['Approved', 'Pending'] },
        $or: [
            {
                fromDate: { $lte: toDate },
                toDate: { $gte: fromDate }
            }
        ]
    };
    
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    
    const overlappingLeaves = await this.find(query);
    return overlappingLeaves.length > 0;
};

// Pre-save middleware for leave balance to update remaining leaves
leaveBalanceSchema.pre('save', function(next) {
    this.remainingAnnualLeave = this.totalAnnualLeave - this.usedAnnualLeave + this.carryForwardLeave;
    this.remainingSickLeave = this.totalSickLeave - this.usedSickLeave;
    this.remainingPersonalLeave = this.totalPersonalLeave - this.usedPersonalLeave;
    this.lastUpdated = new Date();
    next();
});

// Static method to get or create leave balance
leaveBalanceSchema.statics.getOrCreateBalance = async function(employeeId) {
    let balance = await this.findOne({ employeeId });
    
    if (!balance) {
        balance = new this({ employeeId });
        await balance.save();
    }
    
    return balance;
};

// Static method to update leave balance after approval
leaveBalanceSchema.statics.updateAfterLeaveApproval = async function(employeeId, leaveType, days) {
    const balance = await this.getOrCreateBalance(employeeId);
    
    switch (leaveType) {
        case 'Annual Leave':
            balance.usedAnnualLeave += days;
            break;
        case 'Sick Leave':
            balance.usedSickLeave += days;
            break;
        case 'Personal Leave':
            balance.usedPersonalLeave += days;
            break;
        // Add other leave types as needed
    }
    
    await balance.save();
    return balance;
};

// Static method to reverse leave balance (for cancellations)
leaveBalanceSchema.statics.reverseLeaveBalance = async function(employeeId, leaveType, days) {
    const balance = await this.getOrCreateBalance(employeeId);
    
    switch (leaveType) {
        case 'Annual Leave':
            balance.usedAnnualLeave = Math.max(0, balance.usedAnnualLeave - days);
            break;
        case 'Sick Leave':
            balance.usedSickLeave = Math.max(0, balance.usedSickLeave - days);
            break;
        case 'Personal Leave':
            balance.usedPersonalLeave = Math.max(0, balance.usedPersonalLeave - days);
            break;
    }
    
    await balance.save();
    return balance;
};

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);

module.exports = {
    LeaveApplication,
    LeaveBalance
}; 