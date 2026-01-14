import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import * as networkController from '../controllers/network.controller.js';
import { TargetUserBodySchema, RequestIdBodySchema } from '../../shared/validators/index.js';

const networkRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    app.addHook('onRequest', fastify.authenticate);

    app.post('/request', { schema: TargetUserBodySchema }, networkController.sendRequestHandler);
    app.get('/requests', networkController.listRequestsHandler);
    app.post('/accept', { schema: RequestIdBodySchema }, networkController.acceptRequestHandler);
    app.post('/reject', { schema: RequestIdBodySchema }, networkController.rejectRequestHandler);
    app.get('/friends', networkController.listFriendsHandler);
    app.post('/block', { schema: TargetUserBodySchema }, networkController.blockUserHandler);
    app.delete('/friend/:userId', networkController.unfriendUserHandler);
};

export default networkRoutes;
