// scripts/testSendOtp.js

require('dotenv').config();
const mongoose = require('mongoose');

// Import necessary models and services
const Employee = require('../src/models/employee/Employee');
const OtpSession = require('../src/models/employee/OtpSession');
const EmployeeOTPService = require('../src/services/employee/otpService');

const testSendOtp = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');

        const enCodeToTest = '001';

        console.log(`Finding employee with enCode: ${enCodeToTest}`);
        const employee = await Employee.findOne({ enCode: enCodeToTest });

        if (!employee) {
            console.error(`Employee with enCode ${enCodeToTest} not found.`);
            mongoose.disconnect();
            return;
        }

        console.log(`Employee found: ${employee.fullName} (${employee.email}, ${employee.phoneNumber})`);

        // Create OTP session
        console.log('Creating OTP session...');
        // We'll need employee.id, enCode, ipAddress, userAgent
        // For a script, we can use dummy values for IP and UserAgent
        const dummyIp = '127.0.0.1';
        const dummyUserAgent = 'TestScript';

        const otpSession = await OtpSession.createSession(
            employee.id,
            employee.enCode,
            dummyIp,
            dummyUserAgent
        );

        console.log(`OTP session created with OTP: ${otpSession.otpCode}`);

        // Instantiate the OTP service
        const otpService = new EmployeeOTPService();

        // Send OTP via email and SMS
        console.log('Sending OTP...');
        const sendResult = await otpService.sendOTP(
            employee.email,
            employee.phoneNumber,
            otpSession.otpCode,
            employee.fullName,
            employee.profileImage,
            employee.designation
        );

        console.log('OTP send result:', sendResult);

        if (sendResult.sms.sent) {
            console.log(`SMS OTP sent successfully to ${employee.phoneNumber}`);
        } else {
            console.error(`Failed to send SMS OTP to ${employee.phoneNumber}:`, sendResult.sms.error);
        }

        if (sendResult.email.sent) {
             console.log(`Email OTP sent successfully to ${employee.email}`);
         } else {
             console.error(`Failed to send Email OTP to ${employee.email}:`, sendResult.email.error);
         }


    } catch (error) {
        console.error('An error occurred during the test:', error);
    } finally {
        console.log('Disconnecting from MongoDB...');
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

testSendOtp(); 