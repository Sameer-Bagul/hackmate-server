import { FastifyPluginAsync } from 'fastify';
import { profileController } from '../controllers/profile.controller.js';

const profileRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Public routes
    fastify.get('/:username', profileController.getProfileByUsername.bind(profileController));

    // Protected routes
    fastify.register(async (protectedContext) => {
        protectedContext.addHook('onRequest', protectedContext.authenticate);
        
        protectedContext.get('/', profileController.getMyProfile.bind(profileController));
        protectedContext.put('/', profileController.updateProfile.bind(profileController));
        protectedContext.get('/stats', profileController.getUserStats.bind(profileController));
    });
};

export default profileRoutes;
