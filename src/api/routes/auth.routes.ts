import { FastifyPluginAsync } from 'fastify';
import { authController } from '../controllers/auth.controller.js';

const authRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.post('/signup', authController.signup.bind(authController));

    fastify.post('/login', authController.login.bind(authController));

    fastify.post('/otp/send', { 
        onRequest: [fastify.authenticate] 
    }, authController.sendOTP.bind(authController));

    fastify.post('/otp/verify', { 
        onRequest: [fastify.authenticate] 
    }, authController.verifyOTP.bind(authController));

    fastify.get('/check', authController.checkAvailability.bind(authController));
};

export default authRoutes;
