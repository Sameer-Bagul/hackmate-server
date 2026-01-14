import { FastifyPluginAsync } from 'fastify';
import * as presenceController from '../controllers/presence.controller.js';

const presenceRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.put('/status', presenceController.updatePresenceHandler);
    fastify.get('/:userId', presenceController.getPresenceHandler);
};

export default presenceRoutes;
