import { FastifyPluginAsync } from 'fastify';
import { ProfileModel } from '../../models/index.js';
import { calculateMatchScore } from './service.js';

const match: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/discover', async (request, reply) => {
        // @ts-ignore
        const userId = request.user.id;

        const myProfile = await ProfileModel.findOne({ userId });
        if (!myProfile) {
            return reply.code(400).send({ message: 'Create your profile first' });
        }

        // Fetch all other profiles
        // In production, use aggregation/geo-spatial queries for efficiency
        const candidates = await ProfileModel.find({ userId: { $ne: userId } }).populate('userId', 'username email');

        const results = candidates.map(candidate => calculateMatchScore(myProfile, candidate));

        // Sort by score desc
        results.sort((a, b) => b.score - a.score);

        return results;
    });
};

export default match;
