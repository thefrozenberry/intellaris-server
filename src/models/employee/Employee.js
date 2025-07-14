const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    // Primary identification
    id: {
        type: String,
        unique: true,
        index: true,
        // Auto-generated in format EMP001, EMP002, etc.
        validate: {
            validator: function(v) {
                // Always allow during creation (will be generated in pre-save)
                if (this.isNew && !v) return true;
                // For existing documents, require the field
                return !!v;
            },
            message: 'Employee ID is required'
        }
    },
    enCode: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 3,
        match: /^\d{3}$/,
        index: true
    },
    accessCode: {
        type: String,
        required: true
        // Removed minlength, maxlength, and match constraints since this will be hashed
        // Original validation happens in the API layer before hashing
    },
    
    // Personal Information
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        index: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\+91\s\d{5}\s\d{5}$/,
        index: true
    },
    homeAddress: {
        type: String,
        required: true,
        maxlength: 500
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed']
    },
    profileImage: {
        type: String, // Cloudinary URL for profile image
    },
    digitalSignature: {
        type: String, // Cloudinary URL for digital signature
    },

    // Employment Details
    designation: {
        type: String,
        required: true,
        maxlength: 255
    },
    department: {
        type: String,
        maxlength: 255,
        index: true
    },
    reportingManager: {
        type: String,
        maxlength: 255
    },
    joiningDate: {
        type: Date
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
        default: 'Full-time'
    },
    workMode: {
        type: String,
        enum: ['WFO', 'WFH', 'Hybrid'],
        default: 'Hybrid'
    },
    probationPeriod: {
        type: String,
        default: '6 months'
    },
    confirmationDate: {
        type: Date
    },

    // Document Information
    documents: {
        panNumber: String,
        panName: String,
        aadhaarNumber: String,
        passportNumber: String,
        drivingLicense: String,
        uploadedDocuments: [{
            type: {
                type: String,
                enum: ['PAN_CARD', 'AADHAAR_CARD', 'APPOINTMENT_LETTER', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER']
            },
            fileName: String,
            filePath: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            },
            verified: {
                type: Boolean,
                default: false
            }
        }]
    },

    // Banking Information
    banking: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountType: {
            type: String,
            enum: ['Savings', 'Current']
        },
        accountHolderName: String,
        verified: {
            type: Boolean,
            default: false
        }
    },

    // Regulatory Consents
    regulatoryConsents: {
        termsAccepted: {
            type: Boolean,
            default: false
        },
        privacyPolicyAccepted: {
            type: Boolean,
            default: false
        },
        acceptedAt: {
            type: Date
        }
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    isFirstLogin: {
        type: Boolean,
        default: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },

    // Security & Login
    passwordHash: String, // Optional if implementing password-based auth
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    lastLoginAt: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },

    // Profile Completion Tracking
    profileCompletion: {
        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        sections: {
            personal: {
                completed: { type: Boolean, default: true }, // Default to true since it's pre-filled
                required: { type: Boolean, default: true }
            },
            regulatoryConsents: {
                completed: { type: Boolean, default: false },
                required: { type: Boolean, default: true }
            }
        }
    }
}, {
    timestamps: true, // Creates createdAt and updatedAt automatically
    collection: 'employees'
});

// Indexes for better query performance
employeeSchema.index({ enCode: 1, accessCode: 1 });
employeeSchema.index({ email: 1, isActive: 1 });
employeeSchema.index({ department: 1, isActive: 1 });
employeeSchema.index({ createdAt: -1 });

// Virtual for account lock status
employeeSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash access code
employeeSchema.pre('save', async function(next) {
    // Only hash the access code if it has been modified (or is new)
    if (!this.isModified('accessCode')) return next();

    try {
        // Hash the access code
        const salt = await bcrypt.genSalt(12);
        this.accessCode = await bcrypt.hash(this.accessCode, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to generate employee ID
employeeSchema.pre('save', async function(next) {
    if (!this.isNew || this.id) return next();

    try {
        // Find the highest existing employee ID
        const lastEmployee = await this.constructor.findOne(
            {},
            { id: 1 },
            { sort: { id: -1 } }
        );

        let nextNumber = 1;
        if (lastEmployee && lastEmployee.id) {
            const match = lastEmployee.id.match(/^EMP(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        // Generate new employee ID with zero padding
        this.id = `EMP${nextNumber.toString().padStart(3, '0')}`;
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to calculate profile completion
employeeSchema.pre('save', function(next) {
    const sections = this.profileCompletion.sections;
    let completedSections = 0;
    let totalRequired = 0;

    // Check personal section - always true since it's pre-filled
    if (sections.personal.required) {
        totalRequired++;
        sections.personal.completed = true;
        completedSections++;
    }

    // Check regulatory consents section
    if (sections.regulatoryConsents.required) {
        totalRequired++;
        const regulatoryConsentsComplete = this.regulatoryConsents && 
            this.regulatoryConsents.termsAccepted && 
            this.regulatoryConsents.privacyPolicyAccepted;
        sections.regulatoryConsents.completed = !!regulatoryConsentsComplete;
        if (regulatoryConsentsComplete) completedSections++;
    }

    // Calculate completion percentage
    this.profileCompletion.percentage = totalRequired > 0 
        ? Math.round((completedSections / totalRequired) * 100) 
        : 0;

    // Set profileCompleted flag
    this.profileCompleted = this.profileCompletion.percentage === 100;

    next();
});

// Instance method to compare access code
employeeSchema.methods.compareAccessCode = async function(candidateCode) {
    return bcrypt.compare(candidateCode, this.accessCode);
};

// Instance method to increment login attempts
employeeSchema.methods.incLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // If we've reached max attempts and it's not locked already, lock the account
    const maxAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; // 2 hours
    
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }
    
    return this.updateOne(updates);
};

// Instance method to reset login attempts
employeeSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

// Static method to find by credentials
employeeSchema.statics.findByCredentials = async function(enCode, accessCode) {
    const employee = await this.findOne({ 
        enCode, 
        isActive: true 
    });

    if (!employee) {
        throw new Error('Invalid credentials');
    }

    if (employee.isLocked) {
        throw new Error('Account is temporarily locked');
    }

    const isMatch = await employee.compareAccessCode(accessCode);
    if (!isMatch) {
        await employee.incLoginAttempts();
        throw new Error('Invalid credentials');
    }

    // Reset login attempts on successful login
    if (employee.loginAttempts > 0) {
        await employee.resetLoginAttempts();
    }

    return employee;
};

// Static method to get masked contact info
employeeSchema.statics.getMaskedContactInfo = function(email, phone) {
    const maskedEmail = email.replace(/(.{1})(.*)(@.*)/, '$1***$3');
    const maskedPhone = phone.replace(/(\+91\s)(\d{2})(\d{3})(\d{5})/, '$1$2***$4');
    return { maskedEmail, maskedPhone };
};

module.exports = mongoose.model('Employee', employeeSchema); 