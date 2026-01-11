import { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import { AuthRequest } from '../../types.js';
import * as networkService from './network.service.js';
import { TargetUserBody, RequestIdBody } from './network.schema.js';

export const sendRequestHandler = async (request: FastifyRequest<{ Body: TargetUserBody }>, reply: FastifyReply) => {
    const { targetUserId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    if (targetUserId === currentUserId) return reply.badRequest('Cannot send request to yourself');

    const currentUser = await networkService.findUserById(currentUserId);
    if (currentUser?.blocked.includes(new Types.ObjectId(targetUserId))) {
        return reply.badRequest('You have blocked this user');
    }

    const existing = await networkService.findExistingRequest(currentUserId, targetUserId);
    if (existing) return reply.badRequest('Request already exists');

    if (currentUser?.friends.includes(new Types.ObjectId(targetUserId))) {
        return reply.badRequest('Already friends');
    }

    await networkService.createFriendRequest(currentUserId, targetUserId);
    return { message: 'Friend request sent' };
};

export const listRequestsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const currentUserId = (request as AuthRequest).user.id;
    return networkService.listIncomingRequests(currentUserId);
};

export const acceptRequestHandler = async (request: FastifyRequest<{ Body: RequestIdBody }>, reply: FastifyReply) => {
    const { requestId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const req = await networkService.findRequestById(requestId);
    if (!req) return reply.notFound('Request not found');
    if (req.receiverId.toString() !== currentUserId) return reply.forbidden('Not your request');
    if (req.status !== 'pending') return reply.badRequest('Request not pending');

    await networkService.acceptFriendRequest(req);
    return { message: 'Request accepted' };
};

export const rejectRequestHandler = async (request: FastifyRequest<{ Body: RequestIdBody }>, reply: FastifyReply) => {
    const { requestId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const req = await networkService.findRequestById(requestId);
    if (!req) return reply.notFound('Request not found');
    if (req.receiverId.toString() !== currentUserId) return reply.forbidden('Not your request');

    await networkService.rejectFriendRequest(req);
    return { message: 'Request rejected' };
};

export const listFriendsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const currentUserId = (request as AuthRequest).user.id;
    return networkService.getUserFriends(currentUserId);
};

export const blockUserHandler = async (request: FastifyRequest<{ Body: TargetUserBody }>, reply: FastifyReply) => {
    const { targetUserId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    await networkService.blockUser(currentUserId, targetUserId);
    return { message: 'User blocked' };
};
