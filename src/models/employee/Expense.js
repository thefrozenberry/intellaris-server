const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
        // Auto-generated in format EXP001, EXP002, etc.
    },
    employeeId: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    category: {
        type: String,
        enum: ['Travel', 'Meals', 'Transport', 'Accommodation', 'Fuel', 'Internet', 'Office Supplies', 'Training', 'Software', 'Hardware', 'Other'],
        required: true,
        index: true
    },
    subcategory: {
        type: String,
        maxlength: 100
    },
    expenseDate: {
        type: Date,
        required: true,
        index: true
    },
    submittedDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Approved', 'Rejected', 'Paid', 'Cancelled'],
        default: 'Pending',
        index: true
    },
    
    // Receipt details
    receipts: [{
        fileName: String,
        originalName: String,
        filePath: String,
        fileSize: Number,
        mimeType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            default: false
        },
        verificationNotes: String
    }],
    
    // Client billing details
    billableToClient: {
        type: Boolean,
        default: false
    },
    clientProject: String,
    clientName: String,
    clientBillDate: Date,
    clientBillAmount: Number,
    
    // Approval workflow
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
        actionDate: Date,
        amountApproved: Number
    }],
    
    finalApprover: {
        approverId: String,
        approverName: String,
        approverEmail: String
    },
    approvedDate: Date,
    rejectedDate: Date,
    approvedAmount: Number,
    approverComments: String,
    rejectionReason: String,
    
    // Payment details
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Cash', 'Cheque', 'Petty Cash', 'Credit Card Reimbursement']
    },
    paymentDate: Date,
    paymentReference: String,
    paymentAmount: Number,
    paymentNotes: String,
    paidBy: String,
    
    // Tax implications
    taxApplicable: {
        type: Boolean,
        default: false
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    taxCategory: String,
    tdsApplicable: {
        type: Boolean,
        default: false
    },
    tdsAmount: {
        type: Number,
        default: 0
    },
    
    // Trip/Travel details (for travel expenses)
    tripDetails: {
        purpose: String,
        from: String,
        to: String,
        departureDate: Date,
        returnDate: Date,
        mode: {
            type: String,
            enum: ['Flight', 'Train', 'Bus', 'Car', 'Taxi', 'Auto', 'Other']
        },
        distance: Number,
        companionEmployees: [String]
    },
    
    // Advance details
    advanceAmount: {
        type: Number,
        default: 0
    },
    advanceDate: Date,
    advanceReference: String,
    balanceAmount: {
        type: Number,
        default: function() {
            return this.amount - this.advanceAmount;
        }
    },
    
    // Finance team processing
    financeNotes: String,
    financeProcessedBy: String,
    financeProcessedDate: Date,
    accountingEntry: String,
    
    // System metadata
    lastModified: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    
    // Notifications
    notifications: {
        employeeNotified: { type: Boolean, default: false },
        approverNotified: { type: Boolean, default: false },
        financeNotified: { type: Boolean, default: false }
    }
}, {
    timestamps: true,
    collection: 'expense_claims'
});

// Indexes for better query performance
expenseSchema.index({ employeeId: 1, status: 1 });
expenseSchema.index({ employeeId: 1, expenseDate: -1 });
expenseSchema.index({ status: 1, submittedDate: -1 });
expenseSchema.index({ category: 1, status: 1 });
expenseSchema.index({ billableToClient: 1, clientProject: 1 });
expenseSchema.index({ expenseDate: -1, status: 1 });

// Pre-save middleware to auto-generate expense ID
expenseSchema.pre('save', async function(next) {
    if (!this.isNew || this.id) return next();

    try {
        const lastExpense = await this.constructor.findOne(
            {},
            { id: 1 },
            { sort: { id: -1 } }
        );

        let nextNumber = 1;
        if (lastExpense && lastExpense.id) {
            const match = lastExpense.id.match(/^EXP(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        this.id = `EXP${nextNumber.toString().padStart(3, '0')}`;
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to calculate balance amount
expenseSchema.pre('save', function(next) {
    this.balanceAmount = this.amount - this.advanceAmount;
    this.lastModified = new Date();
    next();
});

// Instance method to add receipt
expenseSchema.methods.addReceipt = function(fileName, originalName, filePath, fileSize, mimeType) {
    this.receipts.push({
        fileName,
        originalName,
        filePath,
        fileSize,
        mimeType,
        uploadedAt: new Date()
    });
    
    return this.receipts[this.receipts.length - 1];
};

// Instance method to approve expense
expenseSchema.methods.approve = function(approverId, approverName, comments = '', approvedAmount = null) {
    this.status = 'Approved';
    this.approvedDate = new Date();
    this.finalApprover = {
        approverId,
        approverName
    };
    this.approverComments = comments;
    this.approvedAmount = approvedAmount || this.amount;
    
    return this;
};

// Instance method to reject expense
expenseSchema.methods.reject = function(approverId, approverName, reason) {
    this.status = 'Rejected';
    this.rejectedDate = new Date();
    this.finalApprover = {
        approverId,
        approverName
    };
    this.rejectionReason = reason;
    
    return this;
};

// Instance method to process payment
expenseSchema.methods.processPayment = function(paymentMethod, paymentReference, paymentAmount, paidBy, notes = '') {
    this.status = 'Paid';
    this.paymentMethod = paymentMethod;
    this.paymentDate = new Date();
    this.paymentReference = paymentReference;
    this.paymentAmount = paymentAmount || this.approvedAmount || this.amount;
    this.paymentNotes = notes;
    this.paidBy = paidBy;
    
    return this;
};

// Static method to get employee expenses
expenseSchema.statics.getEmployeeExpenses = async function(employeeId, filters = {}, page = 1, limit = 10) {
    const query = { employeeId, isArchived: false };
    
    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    
    if (filters.category && filters.category !== 'all') {
        query.category = filters.category;
    }
    
    if (filters.billableToClient !== undefined) {
        query.billableToClient = filters.billableToClient;
    }
    
    if (filters.fromDate || filters.toDate) {
        query.expenseDate = {};
        if (filters.fromDate) query.expenseDate.$gte = new Date(filters.fromDate);
        if (filters.toDate) query.expenseDate.$lte = new Date(filters.toDate);
    }
    
    if (filters.amountMin || filters.amountMax) {
        query.amount = {};
        if (filters.amountMin) query.amount.$gte = parseFloat(filters.amountMin);
        if (filters.amountMax) query.amount.$lte = parseFloat(filters.amountMax);
    }
    
    const skip = (page - 1) * limit;
    
    const [expenses, total] = await Promise.all([
        this.find(query)
            .sort({ submittedDate: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query)
    ]);
    
    return {
        expenses,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Static method to get expense summary
expenseSchema.statics.getExpenseSummary = async function(employeeId, timeframe = 'all') {
    let dateFilter = {};
    
    if (timeframe !== 'all') {
        const now = new Date();
        switch (timeframe) {
            case 'thisMonth':
                dateFilter = {
                    expenseDate: {
                        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                        $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0)
                    }
                };
                break;
            case 'lastMonth':
                dateFilter = {
                    expenseDate: {
                        $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                        $lte: new Date(now.getFullYear(), now.getMonth(), 0)
                    }
                };
                break;
            case 'thisYear':
                dateFilter = {
                    expenseDate: {
                        $gte: new Date(now.getFullYear(), 0, 1),
                        $lte: new Date(now.getFullYear(), 11, 31)
                    }
                };
                break;
        }
    }
    
    const summary = await this.aggregate([
        {
            $match: { employeeId, isArchived: false, ...dateFilter }
        },
        {
            $group: {
                _id: null,
                totalClaims: { $sum: 1 },
                pendingAmount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
                },
                approvedAmount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$approvedAmount', 0] }
                },
                paidAmount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, '$paymentAmount', 0] }
                },
                rejectedAmount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, '$amount', 0] }
                },
                totalSubmitted: { $sum: '$amount' },
                pendingClaims: {
                    $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
                },
                approvedClaims: {
                    $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
                },
                paidClaims: {
                    $sum: { $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0] }
                },
                rejectedClaims: {
                    $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
                }
            }
        }
    ]);
    
    return summary[0] || {
        totalClaims: 0,
        pendingAmount: 0,
        approvedAmount: 0,
        paidAmount: 0,
        rejectedAmount: 0,
        totalSubmitted: 0,
        pendingClaims: 0,
        approvedClaims: 0,
        paidClaims: 0,
        rejectedClaims: 0
    };
};

// Static method to get category-wise expense breakdown
expenseSchema.statics.getCategoryBreakdown = async function(employeeId, timeframe = 'thisYear') {
    let dateFilter = {};
    
    if (timeframe !== 'all') {
        const now = new Date();
        switch (timeframe) {
            case 'thisMonth':
                dateFilter = {
                    expenseDate: {
                        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                        $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0)
                    }
                };
                break;
            case 'thisYear':
                dateFilter = {
                    expenseDate: {
                        $gte: new Date(now.getFullYear(), 0, 1),
                        $lte: new Date(now.getFullYear(), 11, 31)
                    }
                };
                break;
        }
    }
    
    return await this.aggregate([
        {
            $match: { employeeId, isArchived: false, ...dateFilter }
        },
        {
            $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                claimCount: { $sum: 1 },
                approvedAmount: {
                    $sum: { $cond: [{ $in: ['$status', ['Approved', 'Paid']] }, '$approvedAmount', 0] }
                },
                pendingAmount: {
                    $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
                }
            }
        },
        {
            $sort: { totalAmount: -1 }
        }
    ]);
};

module.exports = mongoose.model('Expense', expenseSchema); 