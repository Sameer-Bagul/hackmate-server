import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ProfileModel, UserModel } from '../../models/index.js';

import { ProfileUpdateSchema } from '../../schemas/index.js';

const profile: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/', async (request, reply) => {
        // @ts-ignore
        const userId = request.user.id;
        const profile = await ProfileModel.findOne({ userId });

        if (!profile) {
            return reply.code(404).send({ message: 'Profile not found' });
        }

        return profile;
    });

    fastify.put('/', async (request, reply) => {
        // @ts-ignore
        const userId = request.user.id;
        const body = ProfileUpdateSchema.parse(request.body);

        const profile = await ProfileModel.findOneAndUpdate(
            { userId },
            { $set: body },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Update user reference if needed, or just rely on userId
        if (profile) {
            await UserModel.findByIdAndUpdate(userId, { profileId: profile._id });
        }

        return profile;
    });

    // Public profile lookup by username
    fastify.get('/:username', async (request, reply) => {
        const { username } = request.params as { username: string };

        const user = await UserModel.findOne({ username });
        if (!user) {
            return reply.code(404).send({ message: 'User not found' });
        }

        const profile = await ProfileModel.findOne({ userId: user._id });
        if (!profile) {
            return reply.code(404).send({ message: 'Profile not found' });
        }

        return {
            ...profile.toObject(),
            user: {
                id: user._id,
                username: user.username,
                email: user.email // Consider hiding email for privacy if public
            }
        };
    });
};


export default profile;
