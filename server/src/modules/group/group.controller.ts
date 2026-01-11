import { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import { AuthRequest } from '../../types.js';
import * as groupService from './group.service.js';
import { CreateGroupBody, GroupParams, GroupUserActionBody } from './group.schema.js';

export const createGroupHandler = async (request: FastifyRequest<{ Body: CreateGroupBody }>, reply: FastifyReply) => {
    const { name, description, isPrivate } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const existing = await groupService.findGroupByName(name);
    if (existing) return reply.badRequest('Group name taken');

    const group = await groupService.createGroup(name, currentUserId, description, isPrivate);
    return group;
};

export const listGroupsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    return groupService.listGroups();
};

export const getGroupHandler = async (request: FastifyRequest<{ Params: GroupParams }>, reply: FastifyReply) => {
    const { id } = request.params;
    const group = await groupService.getGroupById(id);
    if (!group) return reply.notFound('Group not found');
    return group;
};

export const joinGroupHandler = async (request: FastifyRequest<{ Params: GroupParams }>, reply: FastifyReply) => {
    const { id } = request.params;
    const currentUserId = (request as AuthRequest).user.id;

    const group = await groupService.findGroupById(id);
    if (!group) return reply.notFound('Group not found');

    const isMember = group.members.some(m => m.userId.toString() === currentUserId);
    if (isMember) return reply.badRequest('Already a member');

    const isPending = group.joinRequests.some(r => r.userId.toString() === currentUserId && r.status === 'pending');
    if (isPending) return reply.badRequest('Join request pending');

    if (group.isPrivate) {
        group.joinRequests.push({
            userId: new Types.ObjectId(currentUserId),
            status: 'pending',
            createdAt: new Date()
        });
        await group.save();
        return { message: 'Join request sent' };
    } else {
        group.members.push({
            userId: new Types.ObjectId(currentUserId),
            role: 'member',
            joinedAt: new Date()
        });
        await group.save();
        return { message: 'Joined group' };
    }
};

export const acceptRequestHandler = async (
    request: FastifyRequest<{ Params: GroupParams; Body: GroupUserActionBody }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { userId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const group = await groupService.findGroupById(id);
    if (!group) return reply.notFound('Group not found');

    const admin = group.members.find(m => m.userId.toString() === currentUserId && m.role === 'admin');
    if (!admin) return reply.forbidden('Not an admin');

    const reqIndex = group.joinRequests.findIndex(r => r.userId.toString() === userId && r.status === 'pending');
    if (reqIndex === -1) return reply.badRequest('No pending request');

    group.joinRequests.splice(reqIndex, 1);
    group.members.push({
        userId: new Types.ObjectId(userId),
        role: 'member',
        joinedAt: new Date()
    });

    await group.save();
    return { message: 'User accepted' };
};

export const rejectRequestHandler = async (
    request: FastifyRequest<{ Params: GroupParams; Body: GroupUserActionBody }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { userId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const group = await groupService.findGroupById(id);
    if (!group) return reply.notFound('Group not found');

    const admin = group.members.find(m => m.userId.toString() === currentUserId && m.role === 'admin');
    if (!admin) return reply.forbidden('Not an admin');

    group.joinRequests = group.joinRequests.filter(r => r.userId.toString() !== userId);
    await group.save();
    return { message: 'Request rejected' };
};

export const kickUserHandler = async (
    request: FastifyRequest<{ Params: GroupParams; Body: GroupUserActionBody }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { userId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const group = await groupService.findGroupById(id);
    if (!group) return reply.notFound('Group not found');

    const admin = group.members.find(m => m.userId.toString() === currentUserId && m.role === 'admin');
    if (!admin) return reply.forbidden('Not an admin');

    group.members = group.members.filter(m => m.userId.toString() !== userId);
    await group.save();
    return { message: 'User kicked' };
};

export const leaveGroupHandler = async (request: FastifyRequest<{ Params: GroupParams }>, reply: FastifyReply) => {
    const { id } = request.params;
    const currentUserId = (request as AuthRequest).user.id;

    const group = await groupService.findGroupById(id);
    if (!group) return reply.notFound('Group not found');

    group.members = group.members.filter(m => m.userId.toString() !== currentUserId);
    await group.save();
    return { message: 'Left group' };
};
