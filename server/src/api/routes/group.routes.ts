import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import * as groupController from '../controllers/group.controller.js';
import { CreateGroupSchema, GroupParamsSchema, GroupUserActionSchema } from '../../shared/validators/index.js';

const groupRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    app.addHook('onRequest', fastify.authenticate);

    app.post('/', { schema: CreateGroupSchema }, groupController.createGroupHandler);
    app.get('/', groupController.listGroupsHandler);
    app.get('/:id', { schema: GroupParamsSchema }, groupController.getGroupHandler);
    app.post('/:id/join', { schema: GroupParamsSchema }, groupController.joinGroupHandler);
    app.post('/:id/accept', { schema: GroupUserActionSchema }, groupController.acceptRequestHandler);
    app.post('/:id/reject', { schema: GroupUserActionSchema }, groupController.rejectRequestHandler);
    app.post('/:id/kick', { schema: GroupUserActionSchema }, groupController.kickUserHandler);
    app.post('/:id/leave', { schema: GroupParamsSchema }, groupController.leaveGroupHandler);
};

export default groupRoutes;
