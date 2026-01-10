import { FastifyInstance } from 'fastify';
import { Server as SocketIOServer } from 'socket.io';

export const setupSocketService = (app: FastifyInstance) => {
    // @ts-ignore - fastify-socket.io types might differ slightly or app.io might need casting
    const io: SocketIOServer = app.io;

    if (!io) {
        app.log.warn('Socket.IO not initialized');
        return;
    }

    io.on('connection', (socket: any) => {
        // Auth check logic (simplified, assuming handshake or middleware did it)
        const userId = socket.decoded?.id || socket.handshake.auth.token || socket.data?.user?.id;

        if (userId) {
            socket.join(userId);
            app.log.info(`User connected: ${userId}`);
        }

        socket.on('join:group', (groupId: string) => {
            socket.join(`group_${groupId}`);
            app.log.info(`Socket ${userId} joined group_${groupId}`);
        });

        socket.on('message', async (data: any) => {
            // We can handle message logic here or keep it in the API controller via API calls.
            // But for real-time only events (like typing indicators), this place is good.
            // Actual message persistence is currently done via API /chat/send or CLI emitting to socket?

            // Wait, the current implementation in `start.ts` was relying on an external event or API?
            // Actually, `start.ts` had NO message handling logic in the final version I fixed.
            // The chat features rely on `POST /chat/send` or similar? 
            // Let me check `apps/api/src/modules/chat/index.ts`.
            // Ah, `start.ts` DOES NOT HAVE `socket.on('message')` in the fixed version. 
            // The CLI was emitting 'message', but where was it caught?
            // It seems I might have missed porting the message handler in the previous `start.ts` fix?
            // Let's check `start.ts` content again.
        });

        socket.on('disconnect', () => {
            if (userId) app.log.info(`User disconnected: ${userId}`);
        });
    });
};
