import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
    getChatHistoryHandler,
    getGroupChatHistoryHandler,
    getConversationsHandler
} from '../controllers/chat.controller.js';
import { GetChatHistorySchema, GetGroupChatHistorySchema } from '../../shared/validators/index.js';

const chatRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();

    app.addHook('onRequest', fastify.authenticate);

    app.get('/history/:userId', {
        schema: GetChatHistorySchema
    }, getChatHistoryHandler);

    app.get('/history/group/:groupId', {
        schema: GetGroupChatHistorySchema
    }, getGroupChatHistoryHandler);

    app.get('/conversations', getConversationsHandler);
};

export default chatRoutes;
