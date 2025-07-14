const nodemailer = require('nodemailer');

class BusinessEmailSetupService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST_2,
            port: process.env.SMTP_PORT_2,
            secure: process.env.SMTP_SECURE_2 === 'true',
            auth: {
                user: process.env.SMTP_USER_2,
                pass: process.env.SMTP_PASS_2
            }
        });
    }

    /**
     * Send business email setup notification
     * @param {string} email - Recipient email
     * @param {string} employeeName - Name of the employee
     * @param {string} businessEmail - Business email address
     * @param {string} password - Email password
     * @returns {Promise<boolean>} - Success status
     */
    async sendBusinessEmailSetup(email, employeeName, businessEmail, password) {
        const mailOptions = {
            from: process.env.SMTP_FROM_2,
            to: email,
            subject: 'Your Business Email Account is Ready',
            html: this.getEmailTemplate(employeeName, businessEmail, password),
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Failed to send business email setup notification:', error);
            return false;
        }
    }

    /**
     * Get business email setup template
     * @param {string} employeeName - Name of the employee
     * @param {string} businessEmail - Business email address
     * @param {string} password - Email password
     * @returns {string} - HTML email template
     */
    getEmailTemplate(employeeName, businessEmail, password) {
        return `
        <div style="max-width: 480px; margin: 0 auto; padding: 0 16px; font-family: 'Inter', Arial, sans-serif;">
            <div style="border: 1px solid #eee; border-radius: 16px; padding: 32px 20px; background: #fff;">
                <div style="margin-bottom: 28px;">
                    <div style="display: inline-block; padding: 12px 0 16px 0; border-radius: 8px;">
                        <div style="text-align: left;">
                            <h1 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #333;">BUSINESS EMAIL SETUP</h1>
                            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #666; font-weight: normal;">INTELLARIS PRIVATE LIMITED</p>
                        </div>
                    </div>
                </div>

                <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">Dear <strong>${employeeName}</strong>,</p>
                
                <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">As a valued member of the INTELLARIS PRIVATE LIMITED, we are pleased to confirm that your official business email account under the ondust.com domain is active and ready for use.</p>
                
                <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">OnDust serves as a foundational stack within the organization, providing the backend framework for the TouchPay platform.</p>

                <div style="margin: 32px 0; border-top: 1px solid #eee; padding-top: 24px;">
                    <p style="font-size: 0.85rem; margin: 0 0 16px 0; color: #000; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Account Details</p>
                    <p style="font-size: 0.85rem; margin: 0 0 16px 0; color: #000; line-height: 1.6;">
                        Your business email account has been successfully created. You can access your account using the following credentials:
                        <br><br>
                        <span style="color: #666; font-size: 0.75rem;">Assigned Mail:</span>
                        <br>
                        <span style="font-weight: 600;">${businessEmail}</span>
                        <br><br>
                        <span style="color: #666; font-size: 0.75rem;">Assigned Password:</span>
                        <br>
                        <span style="font-weight: 600;">${password}</span>
                    </p>
                </div>

                <div style="margin: 32px 0; border-top: 1px solid #eee; padding-top: 24px;">
                    <h3 style="color: #333; font-size: 0.9rem; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.5px;">Usage Guidelines & Compliance</h3>
                    <ul style="font-size: 0.75rem; margin: 0; padding-left: 16px;">
                        <li style="margin-bottom: 12px;">This email account is to be used exclusively for official communication related to your role within the company.</li>
                        <li style="margin-bottom: 12px;">Sharing credentials or using the email for personal matters is prohibited.</li>
                        <li style="margin-bottom: 12px;">All activity is governed by INTELLARIS PRIVATE LIMITED's IT security and data privacy policies, in compliance with relevant regulations including the Information Technology Act, 2000.</li>
                    </ul>
                </div>

                <div style="margin: 32px 0; border-top: 1px solid #eee; padding-top: 24px;">
                    <h3 style="color: #333; font-size: 0.9rem; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.5px;">Setup Process</h3>
                    <p style="font-size: 0.75rem; margin-bottom: 16px;">You may continue to access your email account via:</p>
                    <ul style="font-size: 0.75rem; margin: 0; padding-left: 16px;">
                        <li style="margin-bottom: 12px;">Webmail: <a href="https://mail.zoho.com" style="color: #007bff; text-decoration: underline;">https://mail.zoho.com</a></li>
                        <li style="margin-bottom: 12px;">Zoho Mail Mobile App:
                            <ul style="margin-top: 8px; padding-left: 16px;">
                                <li style="margin-bottom: 8px;"><strong>iOS:</strong> <a href="https://apps.apple.com/us/app/zoho-mail-email-and-calendar/id909262651" style="color: #007bff; text-decoration: underline; font-weight: 600;">Download from App Store</a></li>
                                <li style="margin-bottom: 8px;"><strong>Android:</strong> <a href="https://play.google.com/store/apps/details?id=com.zoho.mail&pcampaignid=web_share" style="color: #007bff; text-decoration: underline; font-weight: 600;">Download from Play Store</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
                    <p style="font-size: 0.75rem; margin-bottom: 12px; text-align: left;">Best regards,<br>
                    <strong>IT Operations Team</strong><br>
                    <strong>INTELLARIS PRIVATE LIMITED</strong></p>
                    
                    <p style="font-size: 0.75rem; color: #666; text-align: left; margin-top: 24px;"><em>This email contains sensitive information. Please handle it securely and do not share with unauthorized personnel.</em></p>
                </div>
            </div>
        </div>
        `;
    }
}

module.exports = new BusinessEmailSetupService(); 