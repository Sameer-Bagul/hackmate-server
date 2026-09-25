import { FastifyPluginAsync } from 'fastify';
import { authController } from '../controllers/auth.controller.js';

const authRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.post('/signup', {
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '1 hour'
            }
        }
    }, authController.signup.bind(authController));

    fastify.post('/login', {
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '15 minutes'
            }
        }
    }, authController.login.bind(authController));

    fastify.post('/otp/send', { 
        onRequest: [fastify.authenticate] 
    }, authController.sendOTP.bind(authController));

    fastify.post('/otp/verify', { 
        onRequest: [fastify.authenticate] 
    }, authController.verifyOTP.bind(authController));

    fastify.get('/check', authController.checkAvailability.bind(authController));

    fastify.post('/forgot-password', {
        config: {
            rateLimit: {
                max: 3,
                timeWindow: '30 minutes'
            }
        }
    }, authController.forgotPassword.bind(authController));
    
    fastify.post('/verify-reset-otp', {
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '15 minutes'
            }
        }
    }, authController.verifyResetOtp.bind(authController));
    
    fastify.post('/reset-password', {
        config: {
            rateLimit: {
                max: 3,
                timeWindow: '30 minutes'
            }
        }
    }, authController.resetPassword.bind(authController));
    
    // GitHub OAuth Routes
    fastify.get('/github/login', authController.githubLogin.bind(authController));
    fastify.get('/github/callback', authController.githubCallback.bind(authController));
    
    // CLI Polling Route for OAuth
    fastify.get('/cli/poll', authController.cliPoll.bind(authController));
};

export default authRoutes;
