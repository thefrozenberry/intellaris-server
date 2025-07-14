const nodemailer = require('nodemailer');

class TaskAssignmentEmailService {
    constructor() {
        // Use fallback values if env vars are missing
        const smtpHost = process.env.SMTP_HOST_2 || 'smtp.zoho.in';
        const smtpPort = process.env.SMTP_PORT_2 || 587;
        const smtpSecure = (process.env.SMTP_SECURE_2 || 'false') === 'true';
        const smtpUser = process.env.SMTP_USER_2 || 'ops@intellaris.co';
        const smtpPass = process.env.SMTP_PASS_2 || '';
        const smtpFrom = process.env.SMTP_FROM_2 || 'ops@intellaris.co';

        this.smtpFrom = smtpFrom;

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        this.transporter.verify(function(error, success) {
            if (error) {
                console.error('SMTP Configuration Error:', error);
            } else {
                console.log('SMTP Server is ready to take our messages');
            }
        });
    }

    /**
     * Send task assignment email
     * @param {string} email - Recipient email
     * @param {Object} taskData - Task data object
     * @returns {Promise<boolean>} - Success status
     */
    async sendTaskAssignmentEmail(email, taskData) {
        const mailOptions = {
            from: this.smtpFrom,
            to: email,
            subject: `Official Task Assignment – OPS/INT/${taskData.referenceId} | Due by ${taskData.deadline}`,
            html: this.getEmailTemplate(taskData),
        };
        try {
            console.log('Mail options:', mailOptions);
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Failed to send task assignment email:', error);
            throw error;
        }
    }

    /**
     * Get task assignment email template
     * @param {Object} taskData - Task data object
     * @returns {string} - HTML email template
     */
    getEmailTemplate(taskData) {
        return `
        <div style="max-width: 440px; margin: 0 auto; padding: 0 12px; font-family: 'Inter', Arial, sans-serif;">
            <div style="border: 1px solid #eee; border-radius: 16px; padding: 28px 16px; background: #fff;">
                <div style="margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px;">
                    <div style="display: inline-block; padding: 12px 0 16px 0; border-radius: 8px;">
                        <div style="text-align: left;">
                            <h1 style="margin: 0; font-size: 1.3rem; font-weight: 700; color: #333;">OPERATIONS COMMAND</h1>
                            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #666; font-weight: normal;">INTELLARIS PRIVATE LIMITED</p>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px;">
                    <div style="display: flex; align-items: center; gap: 32px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center;">
                            <img src="${taskData.profileImage || 'https://stack.intellaris.co/assets/images/default-avatar.png'}" 
                                 alt="${taskData.employeeName}'s Profile" 
                                 style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 1px solid #e0e0e0;"
                                 onerror="this.onerror=null; this.src='https://stack.intellaris.co/assets/images/default-avatar.png';" />
                        </div>
                        <div style="flex: 1; background-color: #ffffff; border: 1px solid #ffffff; border-radius: 8px; padding: 16px;">
                            <p style="font-size: 0.75rem; margin: 0; color: #dc2626; font-weight: 600; margin-bottom: 8px;">IMPORTANT NOTICE</p>
                            <p style="font-size: 0.75rem; margin: 0; color: #4b5563; line-height: 1.5;">
                                This task assignment requires your explicit acknowledgment. Please respond with either <strong>"Accepted"</strong> or <strong>"Declined"</strong> within ${taskData.acknowledgmentTime} working hours.
                            </p>
                        </div>
                    </div>
                    <p style="font-size: 0.75rem; margin-bottom: 24px; text-align: left;">Dear <strong>${taskData.employeeName}</strong>,</p>
                    
                    <p style="font-size: 0.75rem; margin-bottom: 24px; text-align: left;">This communication serves as an official task assignment notification. You have been designated for a critical operational task that requires your immediate attention and expertise. This assignment is integral to our organizational objectives and operational excellence.</p>
                </div>
                
                <div style="margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px;">
                    <h3 style="color: #333; font-size: 0.9rem; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.5px;">Task Overview</h3>
                    <ul style="list-style: none; padding-left: 0; font-size: 0.75rem; margin: 0;">
                        <li style="margin-bottom: 12px;"><strong>Title:</strong> ${taskData.taskName}</li>
                        <li style="margin-bottom: 12px;"><strong>Reference ID:</strong> OPS/INT/${taskData.referenceId}</li>
                        <li style="margin-bottom: 12px;"><strong>Assigned To:</strong> ${taskData.employeeName}, ${taskData.employeeCode}</li>
                        <li style="margin-bottom: 12px;"><strong>Issued By:</strong> Operations Command</li>
                        <li style="margin-bottom: 12px;"><strong>Assignment Date:</strong> ${taskData.assignmentDate}</li>
                        <li style="margin-bottom: 12px;"><strong>Deadline:</strong> ${taskData.deadline}</li>
                        <li style="margin-bottom: 12px;"><strong>Priority Level:</strong> ${taskData.priorityLevel}</li>
                        <li style="margin-bottom: 12px;"><strong>Department/Team:</strong> ${taskData.department}</li>
                        ${taskData.project ? `<li style="margin-bottom: 12px;"><strong>Project:</strong> ${taskData.project}</li>` : ''}
                    </ul>
                </div>
                
                <div style="margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px;">
                    <h3 style="color: #333; font-size: 0.9rem; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.5px;">Task Objective & Details</h3>
                    <p style="font-size: 0.75rem; margin-bottom: 24px; text-align: left;">${taskData.objective}</p>
                    
                    <p style="font-size: 0.75rem; margin-bottom: 24px; text-align: left;"><strong>Details:</strong><br>${taskData.details}</p>
                    
                    <p style="font-size: 0.75rem; margin-bottom: 16px; text-align: left;"><strong>Expected Deliverables:</strong></p>
                    <ul style="font-size: 0.75rem; margin: 0; padding-left: 16px;">
                        ${taskData.deliverables.map(d => `<li style="margin-bottom: 12px;">${d}</li>`).join('')}
                    </ul>
                </div>
                
                ${taskData.resources ? `
                <div style="margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px;">
                    <h3 style="color: #333; font-size: 0.9rem; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.5px;">Resources & References</h3>
                    <ul style="font-size: 0.75rem; margin: 0; padding-left: 16px;">
                        ${taskData.resources.map(r => `<li style="margin-bottom: 12px;">${r}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div style="margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px;">
                    <h3 style="color: #333; font-size: 0.9rem; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.5px;">Next Steps & Expectations</h3>
                    <ol style="font-size: 0.75rem; margin: 0; padding-left: 16px;">
                        <li style="margin-bottom: 12px;">Acknowledge receipt of this assignment within <strong>${taskData.acknowledgmentTime}</strong> working hours.</li>
                        <li style="margin-bottom: 12px;">Initiate task execution immediately upon acknowledgment.</li>
                        <li style="margin-bottom: 12px;">Provide regular progress updates to ${taskData.teamLead} at predetermined intervals.</li>
                        <li style="margin-bottom: 12px;">Submit completed deliverables via ${taskData.submissionPlatform}.</li>
                    </ol>
                </div>
                
                <div style="margin-bottom: 32px; border-bottom: 1px solid #eee; padding-bottom: 24px;">
                    <h3 style="color: #333; font-size: 0.9rem; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.5px;">Important Reminder</h3>
                    <p style="font-size: 0.75rem; margin-bottom: 24px; text-align: left;">Timely completion and quality adherence are mandatory. Any potential delays or challenges must be communicated proactively to prevent escalation. Your commitment to excellence is expected and appreciated.</p>
                    
                    <p style="font-size: 0.75rem; margin-bottom: 24px; text-align: left;">For any clarification or support, please contact the Operations Command Unit within 24 hours of receipt.</p>
                    
                    <p style="font-size: 0.75rem; margin: 0; text-align: left;">We appreciate your commitment to operational excellence.</p>
                </div>
                
                <div style="margin-top: 32px;">
                    <p style="font-size: 0.75rem; margin-bottom: 12px; text-align: left;">Best regards,<br>
                    <strong>Operations Command Unit</strong><br>
                    <strong>INTELLARIS PRIVATE LIMITED</strong><br>
                    <a href="mailto:ops@intellaris.co" style="color: #007bff; text-decoration: underline;">ops@intellaris.co</a> | <a href="http://www.intellaris.co" style="color: #007bff; text-decoration: underline;">www.intellaris.co</a></p>
                    
                    <p style="font-size: 0.75rem; color: #666; text-align: left; margin-top: 24px;"><em>This email is intended for the named recipient only. Please handle this information responsibly.</em></p>
                </div>
            </div>
        </div>
        `;
    }
}

module.exports = new TaskAssignmentEmailService(); 