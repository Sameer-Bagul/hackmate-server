import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;
    private isConfigured: boolean = false;

    constructor() {
        this.initialize();
    }

    private initialize() {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP not configured. Email functionality disabled.');
            this.isConfigured = false;
            return;
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        this.isConfigured = true;
    }

    async sendEmail(to: string, subject: string, text: string, html?: string) {
        if (!this.isConfigured || !this.transporter) {
            console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
            return { success: false, mock: true };
        }

        try {
            await this.transporter.sendMail({
                from: `"HackMate CLI" <${process.env.SMTP_USER}>`,
                to,
                subject,
                text,
                html: html || text,
            });
            console.log(`📧 Email sent to ${to}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to send email:', error);
            throw error;
        }
    }

    async sendOTP(to: string, otp: string) {
        const subject = 'Your HackMate Verification Code';
        const text = `Your OTP code is: ${otp}. It expires in 10 minutes.`;
        const html = `<b>Your OTP code is: ${otp}</b><br>It expires in 10 minutes.`;
        
        return this.sendEmail(to, subject, text, html);
    }

    async sendWelcomeEmail(to: string, username: string) {
        const subject = 'Welcome to HackMate!';
        const text = `Welcome ${username}! Start connecting with fellow developers.`;
        const html = `<h2>Welcome ${username}!</h2><p>Start connecting with fellow developers.</p>`;
        
        return this.sendEmail(to, subject, text, html);
    }

    async sendPasswordResetOTP(to: string, otp: string) {
        const subject = 'HackMate Password Reset';
        const text = `You requested a password reset. Your OTP code is: ${otp}. It expires in 10 minutes.`;
        const html = `
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Use the following OTP code to proceed:</p>
            <div style="margin: 20px 0; padding: 15px; background: #f4f4f5; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #18181b;">
                ${otp}
            </div>
            <p>This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
        `;
        
        return this.sendEmail(to, subject, text, html);
    }
}

export const emailService = new EmailService();

// Legacy export for backward compatibility
export const sendEmail = (to: string, subject: string, text: string) => {
    return emailService.sendEmail(to, subject, text);
};

