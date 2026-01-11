import { FastifyPluginAsync } from 'fastify';
import rateLimit from '@fastify/rate-limit';

const rateLimitPlugin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        errorResponseBuilder: (request, context) => ({
            statusCode: 429,
            error: 'Too Many Requests',
            message: `I'm sorry, Dave. I'm afraid I can't do that. You hit the rate limit!`,
            date: Date.now(),
            expiresIn: context.ttl // milliseconds
        })
    });
};

export default rateLimitPlugin;
