import { FastifyPluginAsync } from 'fastify';
import * as chatController from './chat.controller.js';
import { GetChatHistorySchema, GetGroupChatHistorySchema } from './chat.schema.js';

const chatRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get(
        '/history/:userId',
        {
            schema: GetChatHistorySchema,
            onRequest: [fastify.authenticate],
        },
        chatController.getChatHistoryHandler
    );

    fastify.get(
        '/history/group/:groupId',
        {
            schema: GetGroupChatHistorySchema,
            onRequest: [fastify.authenticate],
        },
        chatController.getGroupChatHistoryHandler
    );
};

export default chatRoutes;
