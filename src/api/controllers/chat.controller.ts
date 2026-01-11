import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthRequest } from '../../shared/types/index.js';
import * as chatService from '../../core/services/chat.service.js';
import { GetChatHistoryParams, GetGroupChatHistoryParams } from '../../shared/validators/index.js';

export const getChatHistoryHandler = async (
    request: FastifyRequest<{ Params: GetChatHistoryParams }>,
    reply: FastifyReply
) => {
    const { userId: otherUserId } = request.params;
    const currentUserId = (request as AuthRequest).user.id;

    const messages = await chatService.getDirectMessages(currentUserId, otherUserId);
    return messages;
};

export const getGroupChatHistoryHandler = async (
    request: FastifyRequest<{ Params: GetGroupChatHistoryParams }>,
    reply: FastifyReply
) => {
    const { groupId } = request.params;
    const messages = await chatService.getGroupMessages(groupId);
    return messages;
};

export const getConversationsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const currentUserId = (request as AuthRequest).user.id;
    const conversations = await chatService.getConversations(currentUserId);
    return conversations;
};
