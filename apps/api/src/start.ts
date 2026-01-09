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
