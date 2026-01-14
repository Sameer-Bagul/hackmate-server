import { FastifyRequest, FastifyReply } from 'fastify';
import * as presenceService from '../../core/services/presence.service.js';
import { AuthRequest } from '../../shared/types/index.js';

export const updatePresenceHandler = async (request: FastifyRequest<{ Body: { status: string } }>, reply: FastifyReply) => {
    const userId = (request as AuthRequest).user.id;
    const { status } = request.body;
    
    try {
        const user = await presenceService.updatePresence(userId, status);
        
        // Broadcast presence change via Socket.IO if available
        const io = (request.server as any).io;
        if (io) {
            io.emit('presence:update', {
                userId,
                username: user?.username,
                status,
                timestamp: new Date()
            });
        }
        
        return { message: 'Presence updated', status, user };
    } catch (error: any) {
        return reply.badRequest(error.message);
    }
};

export const getPresenceHandler = async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
    const { userId } = request.params;
    const presence = await presenceService.getPresence(userId);
    
    if (!presence) {
        return reply.notFound('User not found');
    }
    
    return presence;
};
