import { FastifyInstance } from 'fastify';
import { Server as SocketIOServer } from 'socket.io';
import { MessageModel } from '../database/models/index.js';

export const setupSocketService = (app: FastifyInstance) => {
    // @ts-ignore - fastify-socket.io types might differ slightly or app.io might need casting
    const io: SocketIOServer = app.io;

    if (!io) {
        app.log.warn('Socket.IO not initialized');
        return;
    }

    io.on('connection', (socket: any) => {
        let userId: string | null = null;

        try {
            const token = socket.handshake.auth.token || socket.handshake.headers?.authorization;
            if (token) {
                const cleanToken = token.replace('Bearer ', '');
                const decoded = app.jwt.verify(cleanToken) as { id: string };
                userId = decoded.id;
            }
        } catch (err) {
            app.log.warn('Socket auth failed: ' + (err as Error).message);
        }

        if (userId) {
            socket.join(userId);
            app.log.info(`User connected: ${userId}`);
            socket.data.user = { id: userId }; // Store for later
        } else {
            app.log.warn('Socket connected without auth');
        }

        socket.on('join:group', (groupId: string) => {
            if (!userId) return; // Guard
            socket.join(`group_${groupId}`);
            app.log.info(`Socket ${userId} joined group_${groupId}`);
        });

        socket.on('message', async (data: any) => {
            try {
                if (!userId) {
                    app.log.warn('Unauthenticated socket attempted to send message');
                    return;
                }

                const { to, groupId, content } = data;

                if (!content) return;

                if (to) {
                    // Direct Message
                    const message = await MessageModel.create({
                        senderId: userId,
                        receiverId: to,
                        content: content
                    });

                    // Populate sender info for the receiver
                    await message.populate('senderId', 'username');

                    // Emit to receiver
                    io.to(to).emit('dm:receive', message);

                } else if (groupId) {
                    // Group Message
                    const message = await MessageModel.create({
                        senderId: userId,
                        groupId: groupId,
                        content: content
                    });

                    await message.populate('senderId', 'username');

                    // Emit to group room
                    io.to(`group_${groupId}`).emit('group:receive', message);
                }
            } catch (err) {
                app.log.error(err, 'Socket message error');
            }
        });

        socket.on('disconnect', () => {
            if (userId) app.log.info(`User disconnected: ${userId}`);
        });
    });
};
