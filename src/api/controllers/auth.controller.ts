import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../../core/services/auth.service.js';
import { SignupSchema, LoginSchema } from '../../shared/validators/index.js';
import { emailService } from '../../infrastructure/email/email.service.js';

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
        try {
            const userId = request.user.id;
            
            const { user, otp } = await authService.sendOTP(userId);

            // Use email service
            await emailService.sendOTP(user.email, otp);
            request.log.info(`📧 OTP sent to ${user.email}`);

            return { message: 'OTP sent' };
        } catch (error: any) {
            request.log.error(error, 'Failed to send OTP');
            throw error;
        }
    }

    async verifyOTP(request: FastifyRequest, reply: FastifyReply) {
        try {
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

    async checkAvailability(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username, email } = request.query as { username: string; email: string };
            const result = await authService.checkAvailability(username, email);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export const authController = new AuthController();
