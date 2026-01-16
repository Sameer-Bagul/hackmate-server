import { FastifyPluginAsync } from 'fastify';
import rateLimit from '@fastify/rate-limit';

const rateLimitPlugin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const isProd = process.env.NODE_ENV === 'production';
    if (!isProd) {
        // Disable rate limiting in development for convenience
        return;
    }

    const max = Number(process.env.RATE_LIMIT_MAX ?? 100);
    const timeWindow = process.env.RATE_LIMIT_WINDOW ?? '1 minute';

    await fastify.register(rateLimit, {
        max,
        timeWindow,
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
