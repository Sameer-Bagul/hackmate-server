import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../../core/services/auth.service.js';
import { SignupSchema, LoginSchema } from '../../shared/validators/index.js';

export class AuthController {
    
    async signup(request: FastifyRequest, reply: FastifyReply) {
        try {
            const body = SignupSchema.parse(request.body);
            const result = await authService.signup(body, request.server.jwt.sign.bind(request.server.jwt));
            return result;
        } catch (error: any) {
            if (error.message === 'User already exists') {
                return reply.code(409).send({ message: error.message });
            }
            throw error;
        }
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            const body = LoginSchema.parse(request.body);
            const result = await authService.login(body, request.server.jwt.sign.bind(request.server.jwt));
            return result;
        } catch (error: any) {
            if (error.message === 'Invalid credentials') {
                return reply.code(401).send({ message: error.message });
            }
            throw error;
        }
    }

    async sendOTP(request: FastifyRequest, reply: FastifyReply) {
        // @ts-ignore
        const userId = request.user.id;
        
        const { user, otp } = await authService.sendOTP(userId);

        // Send email
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"HackMate" <${process.env.SMTP_USER}>`,
                to: user.email,
                subject: 'Your HackMate Verification Code',
                text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
                html: `<b>Your OTP code is: ${otp}</b><br>It expires in 10 minutes.`,
            });
            request.log.info(`📧 Email sent to ${user.email}`);
        } else {
            request.log.warn('SMTP credentials missing, falling back to console log');
            console.log(`📧 [MOCK EMAIL] To: ${user.email} | OTP: ${otp}`);
        }

        return { message: 'OTP sent' };
    }

    async verifyOTP(request: FastifyRequest, reply: FastifyReply) {
        try {
            // @ts-ignore
            const userId = request.user.id;
            const { code } = request.body as { code: string };
            
            const result = await authService.verifyOTP(userId, code);
            return result;
        } catch (error: any) {
            if (error.message === 'User not found') {
                return reply.code(404).send({ message: error.message });
            }
            if (error.message === 'Invalid OTP' || error.message === 'OTP expired') {
                return reply.code(400).send({ message: error.message });
            }
            throw error;
        }
    }
}

export const authController = new AuthController();
