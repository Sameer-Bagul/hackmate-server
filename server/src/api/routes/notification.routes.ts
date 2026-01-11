import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import * as notificationController from '../controllers/notification.controller.js';

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    app.addHook('onRequest', fastify.authenticate);

    app.get('/', notificationController.getNotificationsHandler);

    app.post('/:id/read', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, notificationController.markAsReadHandler);
};

export default notificationRoutes;
