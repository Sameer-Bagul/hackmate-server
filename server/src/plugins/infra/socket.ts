import fp from 'fastify-plugin';
import io from 'fastify-socket.io';
import { ServerOptions } from 'socket.io';
import { FastifyInstance } from 'fastify';
import { MessageModel } from '../../models/index.js';

// Extend FastifyInstance to include io
declare module 'fastify' {
    interface FastifyInstance {
        io: any;
    }
}

export default fp<ServerOptions>(async (fastify: FastifyInstance) => {
    await fastify.register(io as any, {
        cors: {
            origin: '*', // Allow all for dev, tighten for prod
            methods: ['GET', 'POST'],
        },
    });

    fastify.ready(err => {
        if (err) throw err;

        fastify.io.on('connection', async (socket: any) => {
            try {
                // Simple Auth Handshake
                const token = socket.handshake.auth.token;
                if (!token) {
                    throw new Error('Authentication error');
                }

                // Verify token (using fastify's jwt decorator logic, or manual verification if needed)
                // Here we assume client sends "Bearer <token>"
                const decoded = fastify.jwt.verify(token.replace('Bearer ', ''));
                socket.user = decoded;

                fastify.log.info(`Socket connected: ${socket.id} (User: ${JSON.stringify(decoded)})`);

                // Join a room specific to the user for private messaging
                // Assuming decoded user has an _id or id field
                const userId = (decoded as any)._id || (decoded as any).id;
                if (userId) {
                    socket.join(userId);
                }

                socket.on('dm:send', async (payload: { to: string; content: string }) => {
                    const { to, content } = payload;
                    const senderId = (decoded as any)._id;

                    const message = await MessageModel.create({
                        senderId,
                        receiverId: to,
                        content,
                    });

                    fastify.io.to(to).emit('dm:receive', message);
                });

                socket.on('disconnect', () => {
                    fastify.log.info(`Socket disconnected: ${socket.id}`);
                });

            } catch (error) {
                socket.disconnect(true);
                fastify.log.warn(`Socket connection rejected: ${error}`);
            }
        });
    });
});
