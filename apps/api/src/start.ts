import { buildApp } from './app.js';
import pino from 'pino';
import * as dotenv from 'dotenv';
dotenv.config();

const start = async () => {
    const app = await buildApp({
        logger: {
            level: process.env.LOG_LEVEL || 'info',
            transport: {
                target: 'pino-pretty'
            }
        }
    });

    try {
        const port = parseInt(process.env.PORT || '3000', 10);
        const host = process.env.HOST || '0.0.0.0';

        await app.listen({ port, host });

        // Assuming 'app' is a Fastify instance and 'io' is a Socket.IO server attached to it.
        // This part of the code needs to be adapted based on how Socket.IO is integrated with Fastify.
        // For example, if using fastify-socket.io, 'io' might be app.io.
        // The authentication middleware would typically be set up before the connection handler.

        // Example of how authentication might be integrated (conceptual, depends on actual setup)
        // app.io.use((socket, next) => {
        //     const token = socket.handshake.auth.token; // Or from query/headers
        //     if (!token) {
        //         return next(new Error('Authentication error: No token provided'));
        //     }
        //     try {
        //         const decoded = app.jwt.verify(token); // Assuming app.jwt is available
        //         socket.data.user = decoded;
        //         next();
        //     } catch (err) {
        //         next(new Error('Authentication error: Invalid token'));
        //     }
        // });

        // Initialize Socket Service
        const { setupSocketService } = await import('./plugins/infra/socketService.js');
        setupSocketService(app);

        // Graceful shutdown
        ['SIGINT', 'SIGTERM'].forEach((signal) => {
            process.on(signal, () => {
                app.log.info({ signal }, 'Signal received, closing application');
                app.close(() => {
                    app.log.info('Application closed');
                    process.exit(0);
                });
            });
        });

    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();

