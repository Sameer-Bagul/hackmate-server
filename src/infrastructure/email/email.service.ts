import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP not configured. Skipping email.');
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // or use host/port if not gmail
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"HackMate CLI" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
        });
        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
};
