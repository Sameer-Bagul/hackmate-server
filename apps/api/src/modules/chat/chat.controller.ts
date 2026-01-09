import { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import { AuthRequest } from '../../types.js';
import * as chatService from './chat.service.js';
import { GetChatHistoryParams, GetGroupChatHistoryParams } from './chat.schema.js';

export const getChatHistoryHandler = async (
    request: FastifyRequest<{ Params: GetChatHistoryParams }>,
    reply: FastifyReply
) => {
    const { userId } = request.params;
    const currentUserId = (request as AuthRequest).user.id;

    if (!Types.ObjectId.isValid(userId)) {
        return reply.badRequest('Invalid User ID');
    }

    const messages = await chatService.getDirectMessages(currentUserId, userId);
    return messages;
};

export const getGroupChatHistoryHandler = async (
    request: FastifyRequest<{ Params: GetGroupChatHistoryParams }>,
    reply: FastifyReply
) => {
    const { groupId } = request.params;

    if (!Types.ObjectId.isValid(groupId)) {
        return reply.badRequest('Invalid Group ID');
    }

    const messages = await chatService.getGroupMessages(groupId);
    return messages;
};
