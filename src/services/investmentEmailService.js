const nodemailer = require('nodemailer');

class InvestmentEmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST_1,
            port: process.env.SMTP_PORT_1,
            secure: process.env.SMTP_SECURE_1 === 'true',
            auth: {
                user: process.env.SMTP_USER_1,
                pass: process.env.SMTP_PASS_1
            }
        });
    }

    /**
     * Send investment email
     * @param {string} email - Recipient email
     * @param {string} amount - Investment amount in ₹
     * @param {string} date - Date of investment
     * @param {string} employeeName - Name of the employee
     * @returns {Promise<boolean>} - Success status
     */
    async sendInvestmentEmail(email, amount, date, employeeName) {
        const mailOptions = {
            from: process.env.SMTP_FROM_1,
            to: email,
            subject: 'Investment Confirmation',
            html: this.getEmailTemplate(amount, date, employeeName),
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Failed to send investment email:', error);
            return false;
        }
    }

    /**
     * Get investment email template
     * @param {string} amount - Investment amount in ₹
     * @param {string} date - Date of investment
     * @param {string} employeeName - Name of the employee
     * @returns {string} - HTML email template
     */
    getEmailTemplate(amount, date, employeeName) {
        return `
        <div style="max-width: 480px; margin: 0 auto; padding: 0 16px; font-family: 'Inter', Arial, sans-serif;">
    <div style="border: 1px solid #eee; border-radius: 16px; padding: 32px 20px; background: #fff;">
        <div style="margin-bottom: 28px;">
            <div style="display: inline-block; padding: 12px 0 16px 0; border-radius: 8px;">
                <div style="text-align: left;">
                    <h1 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #333;">INVESTOR RELATIONS</h1>
                    <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #666; font-weight: normal;">INTELLARIS PRIVATE LIMITED</p>
                </div>
            </div>
        </div>
        <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">Dear <strong>${employeeName}</strong>, thank you for your investment. We have received your investment of <span style="font-weight: 600;">₹${amount}</span> on <span style="font-weight: 600;">${date}</span>.</p>
        <div style="margin: 32px 0; text-align: left;">
            <span style="font-size: 2rem; font-weight: 600; color:rgb(0, 0, 0);">₹${amount}</span>
        </div>
        <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">We sincerely appreciate your confidence in our vision. Your investment will be managed with the highest standards of responsibility, governance, and strategic focus to drive innovation, measurable impact, and sustainable long-term value.</p>
        <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">As a valued investor, you are now an integral part of INTELLARIS's mission to shape the future of digital finance and advanced technology.</p>
        <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;">You will receive regular updates on your investment performance, key business milestones, and strategic developments. We look forward to your continued partnership as we scale with purpose and precision.</p>
        <p style="font-size: 0.75rem; color: #888; text-align: left;">For any queries regarding your investment, please contact our Investor Relations team at <a href="mailto:investor-relations@intellaris.co" style="color: #007bff; text-decoration: underline;">investor-relations@intellaris.co</a> or visit <a href="https://www.intellaris.co" style="color: #007bff; text-decoration: underline;">www.intellaris.co</a></p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
        <div style="margin-bottom: 16px;">
            <p style="font-size: 0.75rem; color: #000; text-align: left;">This is to certify that the above investment details are true and correct to the best of our knowledge and belief. This document has been generated electronically and is an authentic confirmation of your investment.</p>
            <p style="font-size: 0.75rem; color: #000; text-align: left; font-weight: 600;">Reference ID: ${Date.now()}</p>
        </div>
        <div style="margin: 16px 0; text-align: left;">
            <p style="font-size: 0.75rem; color: #000; margin-bottom: 4px; text-decoration: underline;">Authorized Signatory</p>
            <p style="font-size: 0.75rem; color: #000; font-weight: 600; margin-bottom: 2px;">Ripun Basumatary</p>
            <p style="font-size: 0.75rem; color: #000; margin-bottom: 4px;">Founder & Managing Director</p>
            <div style="background-color: white; display: inline-block; padding: 4px; border-radius: 4px;">
                <img src="https://res.cloudinary.com/dojodcwxm/image/upload/v1749220347/ripun_sign_farrsv.png" alt="Digital Signature" style="max-width: 120px;" />
            </div>
        </div>
        <p style="font-size: 0.85rem; color: #aaa; text-align: left;">This is a system generated investment confirmation email. Please do not reply to this email.</p>
    </div>
</div>
        `;
    }
}

module.exports = new InvestmentEmailService(); 