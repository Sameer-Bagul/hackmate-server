import { FastifyPluginAsync } from 'fastify';
import * as networkController from './network.controller.js';
import { TargetUserBodySchema, RequestIdBodySchema } from './network.schema.js';

const networkRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.post('/request', { schema: TargetUserBodySchema }, networkController.sendRequestHandler);
    fastify.get('/requests', networkController.listRequestsHandler);
    fastify.post('/accept', { schema: RequestIdBodySchema }, networkController.acceptRequestHandler);
    fastify.post('/reject', { schema: RequestIdBodySchema }, networkController.rejectRequestHandler);
    fastify.get('/friends', networkController.listFriendsHandler);
    fastify.post('/block', { schema: TargetUserBodySchema }, networkController.blockUserHandler);
};

export default networkRoutes;
