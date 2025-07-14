const nodemailer = require('nodemailer');
const emailToSmsService = require('../../utils/emailToSmsService');
const axios = require('axios');

class EmployeeOTPService {
    constructor() {
        // Initialize nodemailer transporter for regular emails
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async fetchImage(imageUrl) {
        try {
            // Validate imageUrl
            if (!imageUrl || typeof imageUrl !== 'string') {
                throw new Error('Invalid image URL');
            }

            // Ensure URL is properly formatted
            const url = new URL(imageUrl);
            if (!url.protocol.startsWith('http')) {
                throw new Error('Invalid URL protocol');
            }

            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                timeout: 5000 // 5 second timeout
            });
            return Buffer.from(response.data, 'binary');
        } catch (error) {
            console.error('Failed to fetch image:', error.message);
            // Use default image
            const defaultImageUrl = 'https://res.cloudinary.com/dojodcwxm/image/upload/v1747373314/touchpay_1_snko6o.svg';
            try {
                const response = await axios.get(defaultImageUrl, {
                    responseType: 'arraybuffer',
                    timeout: 5000
                });
                return Buffer.from(response.data, 'binary');
            } catch (defaultError) {
                console.error('Failed to fetch default image:', defaultError.message);
                // Return empty buffer if both attempts fail
                return Buffer.from('');
            }
        }
    }

    /**
     * Generate 4-digit OTP
     * @returns {string} - 4 digit OTP
     */
    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    /**
     * Send OTP via email
     * @param {string} email - Employee email
     * @param {string} otp - OTP code
     * @param {string} employeeName - Employee name
     * @param {string} profileImage - Employee profile image URL
     * @param {string} designation - Employee designation
     * @returns {Promise<boolean>} - Success status
     */
    async sendEmailOTP(email, otp, employeeName, profileImage, designation) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Confirm Your Identity with a One-Time Passcode',
                html: this.getEmailTemplate(otp, employeeName),
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Failed to send email OTP:', error);
            return false;
        }
    }

    /**
     * Send OTP via SMS using email-to-SMS gateway
     * @param {string} phoneNumber - Employee phone number
     * @param {string} otp - OTP code
     * @param {string} employeeName - Employee name
     * @returns {Promise<boolean>} - Success status
     */
    async sendSMSOTP(phoneNumber, otp, employeeName) {
        try {
            const message = `Your Intellaris login OTP is: ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`;
            return await emailToSmsService.sendSMS(phoneNumber, message);
        } catch (error) {
            console.error('Failed to send SMS OTP:', error);
            return false;
        }
    }

    /**
     * Send OTP to both email and phone
     * @param {string} email - Employee email
     * @param {string} phoneNumber - Employee phone number
     * @param {string} otp - OTP code
     * @param {string} employeeName - Employee name
     * @param {string} profileImage - Employee profile image URL
     * @param {string} designation - Employee designation
     * @returns {Promise<Object>} - Status of both email and SMS sending
     */
    async sendOTP(email, phoneNumber, otp, employeeName, profileImage, designation) {
        const results = await Promise.allSettled([
            this.sendEmailOTP(email, otp, employeeName, profileImage, designation),
            this.sendSMSOTP(phoneNumber, otp, employeeName)
        ]);

        return {
            email: {
                sent: results[0].status === 'fulfilled' && results[0].value,
                error: results[0].status === 'rejected' ? results[0].reason : null
            },
            sms: {
                sent: results[1].status === 'fulfilled' && results[1].value,
                error: results[1].status === 'rejected' ? results[1].reason : null
            },
            success: (results[0].status === 'fulfilled' && results[0].value) || 
                    (results[1].status === 'fulfilled' && results[1].value)
        };
    }

    /**
     * Get email template for OTP
     * @param {string} otp - OTP code
     * @param {string} employeeName - Employee name
     * @returns {string} - HTML email template
     */
    getEmailTemplate(otp, employeeName) {
        return `
        <div style="max-width: 480px; margin: 0 auto; padding: 0 16px; font-family: 'Inter', Arial, sans-serif;">
    <div style="border: 1px solid #eee; border-radius: 16px; padding: 32px 20px; background: #fff;">
        <div style="margin-bottom: 28px;">
            <div style="display: inline-block; padding: 12px 0 16px 0; border-radius: 8px;">
                <div style="text-align: left;">
                    <h1 style="margin: 0; font-size: 1rem; font-weight: 700; color: #333;">INTELLARIS EMPLOYEE PORTAL</h1>
                    <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #666; font-weight: normal;">VERIFY YOUR IDENTITY</p>
                </div>
            </div>
        </div>
        <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">Dear <strong>${employeeName}</strong>,</p>
        <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">You have requested to login to your Intellaris Employee Portal account. Please use the following One-Time Password (OTP) to complete your login. Valid for 5 minutes.</p>
        <div style="margin: 32px 0; text-align: left;">
            <p style="font-size: 0.75rem; margin-bottom: 8px; color: #666;">Your login passcode is,</p>
            <span style="font-size: 2rem; font-weight: 600; color: #000;">${otp}</span>
        </div>
        <p style="font-size: 0.75rem; color: #888; text-align: left;">If you did not request this OTP, you can simply ignore this, it might be someone entered your EN-Code & Passphrase by mistake.</p>
    </div>
</div>
        `;
    }

    /**
     * Validate OTP format
     * @param {string} otp - OTP to validate
     * @returns {boolean} - True if valid format
     */
    validateOTPFormat(otp) {
        return /^\d{4}$/.test(otp);
    }
}

module.exports = EmployeeOTPService; 