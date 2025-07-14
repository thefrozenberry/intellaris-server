const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const otpSessionSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    employeeId: {
        type: String,
        required: true
    },
    enCode: {
        type: String,
        required: true
    },
    otpCode: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 4,
        match: /^\d{4}$/
    },
    sessionToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: function() {
            return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        }
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    attemptsCount: {
        type: Number,
        default: 0,
        min: 0
    },
    maxAttempts: {
        type: Number,
        default: 3,
        min: 1
    },
    sentToEmail: {
        type: Boolean,
        default: false
    },
    sentToPhone: {
        type: Boolean,
        default: false
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    verifiedAt: {
        type: Date
    },
    resendCount: {
        type: Number,
        default: 0,
        min: 0
    },
    lastResendAt: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'otp_sessions'
});

// Indexes for better query performance
otpSessionSchema.index({ sessionToken: 1 });
otpSessionSchema.index({ employeeId: 1, createdAt: -1 });
otpSessionSchema.index({ enCode: 1, createdAt: -1 });

// TTL index to automatically delete expired sessions
otpSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual to check if session is expired
otpSessionSchema.virtual('isExpired').get(function() {
    return this.expiresAt < new Date();
});

// Virtual to check if session is valid
otpSessionSchema.virtual('isValid').get(function() {
    return !this.isUsed && !this.isExpired && this.attemptsCount < this.maxAttempts;
});

// Instance method to verify OTP
otpSessionSchema.methods.verifyOtp = function(candidateOtp) {
    if (!this.isValid) {
        throw new Error('Session is not valid');
    }

    const isMatch = this.otpCode === candidateOtp;
    
    if (isMatch) {
        this.isUsed = true;
        this.verifiedAt = new Date();
    } else {
        this.attemptsCount += 1;
    }

    return isMatch;
};

// Instance method to check if can resend
otpSessionSchema.methods.canResend = function() {
    if (!this.lastResendAt) {
        return true;
    }
    
    const resendDelay = 60 * 1000; // 60 seconds
    const timeSinceLastResend = Date.now() - this.lastResendAt.getTime();
    
    return timeSinceLastResend >= resendDelay;
};

// Static method to generate OTP
otpSessionSchema.statics.generateOtp = function() {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Static method to generate session token
otpSessionSchema.statics.generateSessionToken = function() {
    return uuidv4();
};

// Static method to create new session
otpSessionSchema.statics.createSession = async function(employeeId, enCode, ipAddress, userAgent) {
    // First, invalidate any existing active sessions for this employee
    await this.updateMany(
        {
            employeeId,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        },
        {
            isUsed: true
        }
    );

    // Wait a short moment to ensure the update is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create new session with a unique constraint
    const session = new this({
        employeeId,
        enCode,
        otpCode: this.generateOtp(),
        sessionToken: this.generateSessionToken(),
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    });

    try {
        await session.save();
        return session;
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            // If we get a duplicate key error, try one more time
            await new Promise(resolve => setTimeout(resolve, 100));
            return this.createSession(employeeId, enCode, ipAddress, userAgent);
        }
        throw error;
    }
};

// Static method to find valid session
otpSessionSchema.statics.findValidSession = async function(sessionToken) {
    const session = await this.findOne({
        sessionToken,
        isUsed: false,
        expiresAt: { $gt: new Date() }
    });

    if (!session) {
        throw new Error('Invalid or expired session');
    }

    return session;
};

// Static method to cleanup expired sessions
otpSessionSchema.statics.cleanupExpiredSessions = async function() {
    const result = await this.deleteMany({
        expiresAt: { $lt: new Date() }
    });
    
    return result.deletedCount;
};

// Static method to get session statistics
otpSessionSchema.statics.getSessionStats = async function(employeeId, timeRange = 24) {
    const since = new Date(Date.now() - timeRange * 60 * 60 * 1000);
    
    const stats = await this.aggregate([
        {
            $match: {
                employeeId,
                createdAt: { $gte: since }
            }
        },
        {
            $group: {
                _id: null,
                totalSessions: { $sum: 1 },
                successfulSessions: {
                    $sum: { $cond: [{ $eq: ['$isUsed', true] }, 1, 0] }
                },
                expiredSessions: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$isUsed', false] },
                                    { $lt: ['$expiresAt', new Date()] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                maxAttemptsReached: {
                    $sum: {
                        $cond: [
                            { $gte: ['$attemptsCount', '$maxAttempts'] },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    return stats[0] || {
        totalSessions: 0,
        successfulSessions: 0,
        expiredSessions: 0,
        maxAttemptsReached: 0
    };
};

module.exports = mongoose.model('OtpSession', otpSessionSchema); 