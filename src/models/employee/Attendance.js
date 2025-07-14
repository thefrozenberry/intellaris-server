const mongoose = require('mongoose');
const moment = require('moment');

const attendanceBreakSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    type: {
        type: String,
        enum: ['Lunch', 'Tea', 'Personal', 'Meeting', 'Other'],
        default: 'Personal'
    },
    description: String
}, { _id: true });

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    checkIn: {
        time: Date,
        location: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        workMode: {
            type: String,
            enum: ['WFO', 'WFH', 'Hybrid'],
            default: 'WFO'
        },
        ipAddress: String,
        deviceInfo: String
    },
    checkOut: {
        time: Date,
        location: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        ipAddress: String,
        deviceInfo: String
    },
    breaks: [attendanceBreakSchema],
    workingHours: {
        type: Number, // in minutes
        default: 0
    },
    breakTime: {
        type: Number, // in minutes
        default: 0
    },
    totalHours: {
        type: Number, // in minutes (working hours + break time)
        default: 0
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Half Day', 'Work From Home'],
        default: 'Absent'
    },
    isPresent: {
        type: Boolean,
        default: false
    },
    isLate: {
        type: Boolean,
        default: false
    },
    lateMinutes: {
        type: Number,
        default: 0
    },
    earlyLeaveMinutes: {
        type: Number,
        default: 0
    },
    isOnBreak: {
        type: Boolean,
        default: false
    },
    currentBreakStart: Date,
    notes: String,
    approvedBy: String,
    approvalNotes: String,
    
    // Overtime tracking
    overtimeHours: {
        type: Number,
        default: 0
    },
    isOvertimeApproved: {
        type: Boolean,
        default: false
    },

    // GPS and location verification
    locationVerified: {
        type: Boolean,
        default: false
    },
    gpsAccuracy: Number,
    
    // System metadata
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    autoCheckOut: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'attendance_records'
});

// Compound indexes for better query performance
attendanceSchema.index({ employeeId: 1, date: -1 });
attendanceSchema.index({ date: -1, status: 1 });
attendanceSchema.index({ employeeId: 1, status: 1 });
attendanceSchema.index({ 'checkIn.time': -1 });

// Ensure unique attendance record per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// Virtual for formatted date
attendanceSchema.virtual('formattedDate').get(function() {
    return moment(this.date).format('YYYY-MM-DD');
});

// Virtual for formatted working hours
attendanceSchema.virtual('formattedWorkingHours').get(function() {
    const hours = Math.floor(this.workingHours / 60);
    const minutes = this.workingHours % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
});

// Virtual for formatted break time
attendanceSchema.virtual('formattedBreakTime').get(function() {
    const hours = Math.floor(this.breakTime / 60);
    const minutes = this.breakTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
});

// Pre-save middleware to calculate working hours and status
attendanceSchema.pre('save', function(next) {
    // Calculate break time
    this.breakTime = this.breaks.reduce((total, breakItem) => {
        return total + (breakItem.duration || 0);
    }, 0);

    // Calculate working hours if both check-in and check-out exist
    if (this.checkIn?.time && this.checkOut?.time) {
        const totalMinutes = Math.floor((this.checkOut.time - this.checkIn.time) / (1000 * 60));
        this.totalHours = totalMinutes;
        this.workingHours = Math.max(0, totalMinutes - this.breakTime);
    }

    // Determine status
    this.determineStatus();
    
    this.lastUpdated = new Date();
    next();
});

// Instance method to determine attendance status
attendanceSchema.methods.determineStatus = function() {
    const officialStartTime = 9 * 60; // 9:00 AM in minutes
    const officialEndTime = 18 * 60; // 6:00 PM in minutes
    const graceTime = 15; // 15 minutes grace period
    const halfDayHours = 4 * 60; // 4 hours in minutes

    if (this.checkIn?.time) {
        this.isPresent = true;
        const checkInMinutes = this.checkIn.time.getHours() * 60 + this.checkIn.time.getMinutes();
        
        // Check if late
        if (checkInMinutes > officialStartTime + graceTime) {
            this.isLate = true;
            this.lateMinutes = checkInMinutes - officialStartTime;
            this.status = 'Late';
        } else {
            this.isLate = false;
            this.lateMinutes = 0;
            this.status = 'Present';
        }

        // Check for work from home
        if (this.checkIn.workMode === 'WFH') {
            this.status = 'Work From Home';
        }

        // Check for half day
        if (this.workingHours > 0 && this.workingHours < halfDayHours) {
            this.status = 'Half Day';
        }

        // Check for early leave
        if (this.checkOut?.time) {
            const checkOutMinutes = this.checkOut.time.getHours() * 60 + this.checkOut.time.getMinutes();
            if (checkOutMinutes < officialEndTime) {
                this.earlyLeaveMinutes = officialEndTime - checkOutMinutes;
            }
        }

        // Calculate overtime
        const standardWorkingHours = 8 * 60; // 8 hours in minutes
        if (this.workingHours > standardWorkingHours) {
            this.overtimeHours = this.workingHours - standardWorkingHours;
        }
    } else {
        this.isPresent = false;
        this.status = 'Absent';
    }
};

// Instance method to start break
attendanceSchema.methods.startBreak = function(breakType = 'Personal', description = '') {
    if (this.isOnBreak) {
        throw new Error('Already on break');
    }

    this.breaks.push({
        startTime: new Date(),
        type: breakType,
        description
    });

    this.isOnBreak = true;
    this.currentBreakStart = new Date();
    
    return this.breaks[this.breaks.length - 1];
};

// Instance method to end break
attendanceSchema.methods.endBreak = function() {
    if (!this.isOnBreak || !this.currentBreakStart) {
        throw new Error('Not currently on break');
    }

    const currentBreak = this.breaks[this.breaks.length - 1];
    if (!currentBreak.endTime) {
        currentBreak.endTime = new Date();
        currentBreak.duration = Math.floor((currentBreak.endTime - currentBreak.startTime) / (1000 * 60));
    }

    this.isOnBreak = false;
    this.currentBreakStart = null;
    
    return currentBreak;
};

// Static method to get today's attendance
attendanceSchema.statics.getTodayAttendance = async function(employeeId) {
    const today = moment().startOf('day').toDate();
    return await this.findOne({ employeeId, date: today });
};

// Static method to check in
attendanceSchema.statics.checkIn = async function(employeeId, location, coordinates, workMode, ipAddress, deviceInfo) {
    const today = moment().startOf('day').toDate();
    
    let attendance = await this.findOne({ employeeId, date: today });
    
    if (attendance && attendance.checkIn?.time) {
        throw new Error('Already checked in for today');
    }

    if (!attendance) {
        attendance = new this({
            employeeId,
            date: today
        });
    }

    attendance.checkIn = {
        time: new Date(),
        location,
        coordinates,
        workMode,
        ipAddress,
        deviceInfo
    };

    await attendance.save();
    return attendance;
};

// Static method to check out
attendanceSchema.statics.checkOut = async function(employeeId, location, coordinates, ipAddress, deviceInfo) {
    const today = moment().startOf('day').toDate();
    
    const attendance = await this.findOne({ employeeId, date: today });
    
    if (!attendance || !attendance.checkIn?.time) {
        throw new Error('Must check in before checking out');
    }

    if (attendance.checkOut?.time) {
        throw new Error('Already checked out for today');
    }

    attendance.checkOut = {
        time: new Date(),
        location,
        coordinates,
        ipAddress,
        deviceInfo
    };

    await attendance.save();
    return attendance;
};

// Static method to get attendance history
attendanceSchema.statics.getAttendanceHistory = async function(employeeId, fromDate, toDate, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const query = { employeeId };
    if (fromDate || toDate) {
        query.date = {};
        if (fromDate) query.date.$gte = moment(fromDate).startOf('day').toDate();
        if (toDate) query.date.$lte = moment(toDate).endOf('day').toDate();
    }

    const [records, total] = await Promise.all([
        this.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        this.countDocuments(query)
    ]);

    return {
        records,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Static method to get weekly summary
attendanceSchema.statics.getWeeklySummary = async function(employeeId, weekStartDate) {
    const startDate = moment(weekStartDate).startOf('week').toDate();
    const endDate = moment(weekStartDate).endOf('week').toDate();

    const records = await this.find({
        employeeId,
        date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).lean();

    const totalWeeklyMinutes = records.reduce((total, record) => total + (record.workingHours || 0), 0);
    const totalWeeklyHours = Math.floor(totalWeeklyMinutes / 60);
    const remainingMinutes = totalWeeklyMinutes % 60;

    return {
        weekStartDate: moment(startDate).format('YYYY-MM-DD'),
        weekEndDate: moment(endDate).format('YYYY-MM-DD'),
        dailyRecords: records.map(record => ({
            date: moment(record.date).format('YYYY-MM-DD'),
            day: moment(record.date).format('dddd'),
            workingHours: record.formattedWorkingHours || '00:00:00',
            status: record.status
        })),
        totalWeeklyHours: `${totalWeeklyHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`,
        averageDailyHours: records.length > 0 ? 
            `${Math.floor(totalWeeklyMinutes / records.length / 60).toString().padStart(2, '0')}:${Math.floor((totalWeeklyMinutes / records.length) % 60).toString().padStart(2, '0')}:00` : 
            '00:00:00'
    };
};

// Static method to get attendance summary
attendanceSchema.statics.getAttendanceSummary = async function(employeeId, fromDate, toDate) {
    const query = { employeeId };
    if (fromDate || toDate) {
        query.date = {};
        if (fromDate) query.date.$gte = moment(fromDate).startOf('day').toDate();
        if (toDate) query.date.$lte = moment(toDate).endOf('day').toDate();
    }

    const summary = await this.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                totalWorkingDays: { $sum: 1 },
                presentDays: {
                    $sum: { $cond: [{ $eq: ['$isPresent', true] }, 1, 0] }
                },
                absentDays: {
                    $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
                },
                lateDays: {
                    $sum: { $cond: [{ $eq: ['$isLate', true] }, 1, 0] }
                },
                totalWorkingMinutes: { $sum: '$workingHours' },
                totalBreakMinutes: { $sum: '$breakTime' },
                totalOvertimeMinutes: { $sum: '$overtimeHours' }
            }
        }
    ]);

    const result = summary[0] || {
        totalWorkingDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        totalWorkingMinutes: 0,
        totalBreakMinutes: 0,
        totalOvertimeMinutes: 0
    };

    // Format time fields
    const formatMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`;
    };

    return {
        ...result,
        totalWorkingHours: formatMinutes(result.totalWorkingMinutes),
        averageWorkingHours: result.presentDays > 0 ? 
            formatMinutes(Math.floor(result.totalWorkingMinutes / result.presentDays)) : '00:00:00',
        totalBreakTime: formatMinutes(result.totalBreakMinutes),
        totalOvertimeHours: formatMinutes(result.totalOvertimeMinutes)
    };
};

module.exports = mongoose.model('Attendance', attendanceSchema); 