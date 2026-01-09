import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { MessageModel } from '@hackmate/db';
import { Types } from 'mongoose';

const chatRoutes: FastifyPluginAsync = async (fastify) => {
    // Get chat history with a specific user
    fastify.get<{ Params: { userId: string } }>('/history/:userId', {
        onRequest: [fastify.authenticate],
        schema: {
            params: z.object({
                userId: z.string(),
            }),
            response: {
                200: z.array(z.object({
                    _id: z.string(),
                    senderId: z.string(),
                    receiverId: z.string(),
                    content: z.string(),
                    createdAt: z.string(),
                })),
            },
        },
    }, async (request, reply) => {
        const { userId } = request.params;
        const currentUserId = (request.user as any)._id; // JWT user ID

        // Validate ObjectIds
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(currentUserId)) {
            return reply.badRequest('Invalid User ID');
        }

        // Fetch messages between the two users, sorted by date (oldest first)
        const messages = await MessageModel.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId },
            ],
        }).sort({ createdAt: 1 }).limit(50); // limit to last 50 messages

        return messages;
    });
};

export default chatRoutes;
