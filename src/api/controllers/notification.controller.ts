import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthRequest } from '../../shared/types/index.js';
import * as notificationService from '../../core/services/notification.service.js';

export const getNotificationsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const currentUserId = (request as AuthRequest).user.id;
    const notifications = await notificationService.getUserNotifications(currentUserId);
    return notifications;
};

export const markAsReadHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const currentUserId = (request as AuthRequest).user.id;

    try {
        await notificationService.markAsRead(id, currentUserId);
        return { message: 'Marked as read' };
    } catch (error: any) {
        if (error.message === 'Notification not found') {
            return reply.notFound(error.message);
        }
        throw error;
    }
};
