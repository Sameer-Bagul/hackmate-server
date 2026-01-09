import { FastifyPluginAsync } from 'fastify';
import * as groupController from './group.controller.js';
import { CreateGroupSchema, GroupParamsSchema, GroupUserActionSchema } from './group.schema.js';

const groupRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.post('/', { schema: CreateGroupSchema }, groupController.createGroupHandler);
    fastify.get('/', groupController.listGroupsHandler);
    fastify.get('/:id', { schema: GroupParamsSchema }, groupController.getGroupHandler);
    fastify.post('/:id/join', { schema: GroupParamsSchema }, groupController.joinGroupHandler);
    fastify.post('/:id/accept', { schema: GroupUserActionSchema }, groupController.acceptRequestHandler);
    fastify.post('/:id/reject', { schema: GroupUserActionSchema }, groupController.rejectRequestHandler);
    fastify.post('/:id/kick', { schema: GroupUserActionSchema }, groupController.kickUserHandler);
    fastify.post('/:id/leave', { schema: GroupParamsSchema }, groupController.leaveGroupHandler);
};

export default groupRoutes;
