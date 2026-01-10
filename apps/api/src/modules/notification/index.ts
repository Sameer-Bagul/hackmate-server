import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { NotificationModel } from '@hackmate/db';

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    app.addHook('onRequest', fastify.authenticate);

    // LIST Notifications
    app.get('/', async (request, reply) => {
        // @ts-ignore
        const currentUserId = request.user.id;

        const notifications = await NotificationModel.find({ userId: currentUserId })
            .sort({ createdAt: -1 })
            .limit(50);

        return notifications;
    });

    // MARK AS READ
    app.post('/:id/read', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        // @ts-ignore
        const currentUserId = request.user.id;

        const notif = await NotificationModel.findOne({ _id: id, userId: currentUserId });
        if (!notif) return reply.notFound('Notification not found');

        notif.read = true;
        await notif.save();

        return { message: 'Marked as read' };
    });
};

export default notificationRoutes;
