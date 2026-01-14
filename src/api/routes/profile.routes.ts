import { FastifyPluginAsync } from 'fastify';
import { profileController } from '../controllers/profile.controller.js';

const profileRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/', profileController.getMyProfile.bind(profileController));

    fastify.put('/', profileController.updateProfile.bind(profileController));

    fastify.get('/stats', profileController.getUserStats.bind(profileController));

    fastify.get('/:username', profileController.getProfileByUsername.bind(profileController));
};

export default profileRoutes;
