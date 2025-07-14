const mongoose = require('mongoose');
const moment = require('moment');

const payslipSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
        // Auto-generated in format PAY_YYYY_MM_EMPID
    },
    employeeId: {
        type: String,
        required: true,
        index: true
    },
    month: {
        type: String,
        required: true,
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 
               'July', 'August', 'September', 'October', 'November', 'December']
    },
    year: {
        type: Number,
        required: true,
        min: 2020,
        max: 2050
    },
    payPeriod: {
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        }
    },
    
    // Basic salary components
    basicSalary: {
        type: Number,
        required: true,
        min: 0
    },
    
    // Allowances
    allowances: {
        hra: {
            type: Number,
            default: 0
        },
        transport: {
            type: Number,
            default: 0
        },
        medical: {
            type: Number,
            default: 0
        },
        specialAllowance: {
            type: Number,
            default: 0
        },
        communicationAllowance: {
            type: Number,
            default: 0
        },
        conveyanceAllowance: {
            type: Number,
            default: 0
        },
        lunchAllowance: {
            type: Number,
            default: 0
        },
        educationAllowance: {
            type: Number,
            default: 0
        },
        performanceBonus: {
            type: Number,
            default: 0
        },
        otherAllowances: {
            type: Number,
            default: 0
        }
    },
    
    // Variable pay
    variablePay: {
        incentive: {
            type: Number,
            default: 0
        },
        bonus: {
            type: Number,
            default: 0
        },
        commission: {
            type: Number,
            default: 0
        },
        overtime: {
            type: Number,
            default: 0
        },
        arrears: {
            type: Number,
            default: 0
        }
    },
    
    // Deductions
    deductions: {
        pf: {
            type: Number,
            default: 0
        },
        esi: {
            type: Number,
            default: 0
        },
        tds: {
            type: Number,
            default: 0
        },
        professionalTax: {
            type: Number,
            default: 0
        },
        loanDeduction: {
            type: Number,
            default: 0
        },
        advanceDeduction: {
            type: Number,
            default: 0
        },
        insurancePremium: {
            type: Number,
            default: 0
        },
        lateComingFine: {
            type: Number,
            default: 0
        },
        absentDeduction: {
            type: Number,
            default: 0
        },
        otherDeductions: {
            type: Number,
            default: 0
        }
    },
    
    // Calculated amounts
    grossSalary: {
        type: Number,
        required: true
    },
    totalAllowances: {
        type: Number,
        default: 0
    },
    totalVariablePay: {
        type: Number,
        default: 0
    },
    totalDeductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
    },
    
    // Attendance details
    attendanceDetails: {
        totalWorkingDays: {
            type: Number,
            required: true
        },
        presentDays: {
            type: Number,
            required: true
        },
        absentDays: {
            type: Number,
            default: 0
        },
        lateDays: {
            type: Number,
            default: 0
        },
        leaveDays: {
            type: Number,
            default: 0
        },
        holidayDays: {
            type: Number,
            default: 0
        },
        weekendDays: {
            type: Number,
            default: 0
        },
        overtimeHours: {
            type: Number,
            default: 0
        }
    },
    
    // Tax details
    taxDetails: {
        taxableIncome: {
            type: Number,
            default: 0
        },
        exemptIncome: {
            type: Number,
            default: 0
        },
        tdsDeducted: {
            type: Number,
            default: 0
        },
        section80CDeduction: {
            type: Number,
            default: 0
        },
        section80DDeduction: {
            type: Number,
            default: 0
        },
        hra80Exemption: {
            type: Number,
            default: 0
        }
    },
    
    // Year-to-date totals
    ytdTotals: {
        grossSalary: {
            type: Number,
            default: 0
        },
        netSalary: {
            type: Number,
            default: 0
        },
        tdsDeducted: {
            type: Number,
            default: 0
        },
        pfDeducted: {
            type: Number,
            default: 0
        },
        esiDeducted: {
            type: Number,
            default: 0
        }
    },
    
    // Processing details
    status: {
        type: String,
        enum: ['Draft', 'Processed', 'Sent', 'Acknowledged'],
        default: 'Processed'
    },
    processedDate: {
        type: Date,
        default: Date.now
    },
    processedBy: {
        type: String,
        required: true
    },
    approvedBy: String,
    approvedDate: Date,
    
    // File details
    generatedFilePath: String,
    downloadUrl: String,
    fileSize: Number,
    passwordProtected: {
        type: Boolean,
        default: true
    },
    
    // Email details
    emailSent: {
        type: Boolean,
        default: false
    },
    emailSentDate: Date,
    employeeAcknowledged: {
        type: Boolean,
        default: false
    },
    acknowledgedDate: Date,
    
    // Remarks
    remarks: String,
    hrNotes: String,
    
    // Revision details
    isRevised: {
        type: Boolean,
        default: false
    },
    originalPayslipId: String,
    revisionReason: String,
    revisionDate: Date,
    
    // Bank details for salary transfer
    bankTransfer: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        transferDate: Date,
        transferReference: String,
        transferStatus: {
            type: String,
            enum: ['Pending', 'Initiated', 'Success', 'Failed'],
            default: 'Pending'
        }
    }
}, {
    timestamps: true,
    collection: 'payslips'
});

// Compound indexes for better query performance
payslipSchema.index({ employeeId: 1, year: -1, month: -1 });
payslipSchema.index({ year: -1, month: -1, status: 1 });
payslipSchema.index({ processedDate: -1 });
payslipSchema.index({ 'bankTransfer.transferStatus': 1 });

// Ensure unique payslip per employee per month/year
payslipSchema.index({ employeeId: 1, year: 1, month: 1 }, { unique: true });

// Pre-save middleware to auto-generate payslip ID
payslipSchema.pre('save', async function(next) {
    if (!this.isNew || this.id) return next();

    try {
        const monthNumber = moment().month(this.month).format('MM');
        this.id = `PAY_${this.year}_${monthNumber}_${this.employeeId}`;
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to calculate totals
payslipSchema.pre('save', function(next) {
    // Calculate total allowances
    this.totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + (val || 0), 0);
    
    // Calculate total variable pay
    this.totalVariablePay = Object.values(this.variablePay).reduce((sum, val) => sum + (val || 0), 0);
    
    // Calculate gross salary
    this.grossSalary = this.basicSalary + this.totalAllowances + this.totalVariablePay;
    
    // Calculate total deductions
    this.totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + (val || 0), 0);
    
    // Calculate net salary
    this.netSalary = this.grossSalary - this.totalDeductions;
    
    // Calculate taxable income
    this.taxDetails.taxableIncome = this.grossSalary - this.taxDetails.exemptIncome;
    
    next();
});

// Instance method to generate download URL
payslipSchema.methods.generateDownloadUrl = function() {
    this.downloadUrl = `/api/v1/employee/payslips/${this.id}/download`;
    return this.downloadUrl;
};

// Instance method to mark as acknowledged
payslipSchema.methods.acknowledge = function() {
    this.employeeAcknowledged = true;
    this.acknowledgedDate = new Date();
    this.status = 'Acknowledged';
    return this;
};

// Instance method to send email
payslipSchema.methods.markEmailSent = function() {
    this.emailSent = true;
    this.emailSentDate = new Date();
    this.status = 'Sent';
    return this;
};

// Static method to get employee payslips
payslipSchema.statics.getEmployeePayslips = async function(employeeId, filters = {}, page = 1, limit = 10) {
    const query = { employeeId };
    
    if (filters.year) {
        query.year = parseInt(filters.year);
    }
    
    if (filters.month) {
        query.month = filters.month;
    }
    
    if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
    }
    
    const skip = (page - 1) * limit;
    
    const [payslips, total] = await Promise.all([
        this.find(query)
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query)
    ]);
    
    return {
        payslips,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Static method to get yearly salary summary
payslipSchema.statics.getYearlySalarySummary = async function(employeeId, year) {
    const summary = await this.aggregate([
        {
            $match: { employeeId, year: parseInt(year) }
        },
        {
            $group: {
                _id: null,
                totalGrossSalary: { $sum: '$grossSalary' },
                totalNetSalary: { $sum: '$netSalary' },
                totalDeductions: { $sum: '$totalDeductions' },
                totalTds: { $sum: '$deductions.tds' },
                totalPf: { $sum: '$deductions.pf' },
                totalEsi: { $sum: '$deductions.esi' },
                totalAllowances: { $sum: '$totalAllowances' },
                totalVariablePay: { $sum: '$totalVariablePay' },
                monthsProcessed: { $sum: 1 },
                totalWorkingDays: { $sum: '$attendanceDetails.totalWorkingDays' },
                totalPresentDays: { $sum: '$attendanceDetails.presentDays' },
                totalAbsentDays: { $sum: '$attendanceDetails.absentDays' },
                totalLeaveDays: { $sum: '$attendanceDetails.leaveDays' }
            }
        }
    ]);
    
    return summary[0] || {
        totalGrossSalary: 0,
        totalNetSalary: 0,
        totalDeductions: 0,
        totalTds: 0,
        totalPf: 0,
        totalEsi: 0,
        totalAllowances: 0,
        totalVariablePay: 0,
        monthsProcessed: 0,
        totalWorkingDays: 0,
        totalPresentDays: 0,
        totalAbsentDays: 0,
        totalLeaveDays: 0
    };
};

// Static method to get salary comparison
payslipSchema.statics.getSalaryComparison = async function(employeeId, currentYear, previousYear) {
    const [currentYearData, previousYearData] = await Promise.all([
        this.getYearlySalarySummary(employeeId, currentYear),
        this.getYearlySalarySummary(employeeId, previousYear)
    ]);
    
    const calculateGrowth = (current, previous) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(2);
    };
    
    return {
        currentYear: currentYearData,
        previousYear: previousYearData,
        growth: {
            grossSalary: calculateGrowth(currentYearData.totalGrossSalary, previousYearData.totalGrossSalary),
            netSalary: calculateGrowth(currentYearData.totalNetSalary, previousYearData.totalNetSalary)
        }
    };
};

// Static method to get latest payslip
payslipSchema.statics.getLatestPayslip = async function(employeeId) {
    return await this.findOne({ employeeId })
        .sort({ year: -1, month: -1 })
        .lean();
};

// Static method to check if payslip exists for month/year
payslipSchema.statics.checkPayslipExists = async function(employeeId, year, month) {
    const count = await this.countDocuments({
        employeeId,
        year: parseInt(year),
        month
    });
    return count > 0;
};

// Virtual for formatted pay period
payslipSchema.virtual('formattedPayPeriod').get(function() {
    const from = moment(this.payPeriod.from).format('DD MMM YYYY');
    const to = moment(this.payPeriod.to).format('DD MMM YYYY');
    return `${from} - ${to}`;
});

// Virtual for month number
payslipSchema.virtual('monthNumber').get(function() {
    return moment().month(this.month).format('MM');
});

module.exports = mongoose.model('Payslip', payslipSchema); 