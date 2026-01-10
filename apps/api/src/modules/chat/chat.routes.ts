import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import * as chatController from './chat.controller.js';
import { GetChatHistorySchema, GetGroupChatHistorySchema } from './chat.schema.js';

const chatRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();

    app.get(
        '/history/:userId',
        {
            schema: GetChatHistorySchema,
            onRequest: [fastify.authenticate],
        },
        chatController.getChatHistoryHandler
    );

    app.get(
        '/history/group/:groupId',
        {
            schema: GetGroupChatHistorySchema,
            onRequest: [fastify.authenticate],
        },
        chatController.getGroupChatHistoryHandler
    );

    app.get(
        '/conversations',
        {
            onRequest: [fastify.authenticate],
            // Schema response could be defined but lazy for now
        },
        chatController.getConversationsHandler
    );
};

export default chatRoutes;
