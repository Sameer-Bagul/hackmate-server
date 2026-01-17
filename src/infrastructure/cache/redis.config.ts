import fp from 'fastify-plugin';
import { Redis } from '@upstash/redis';
import { FastifyInstance } from 'fastify';

// Extend FastifyInstance type
declare module 'fastify' {
    interface FastifyInstance {
        redis: Redis;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    // Validate Redis credentials
    const isProd = process.env.NODE_ENV === 'production';
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (isProd && (!redisUrl || !redisToken)) {
        throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production');
    }

    // Initialize Upstash Redis client
    const redis = new Redis({
        url: redisUrl || 'https://example.upstash.io',
        token: redisToken || 'example_token',
    });

    // Check connection (optional, as it's stateless HTTP, but good for sanity)
    try {
        // We won't block startup on this, but lets log it key exist or just attach it.
        // Upstash is serverless, so "connection" is just config.
    } catch (err) {
        fastify.log.error({ err }, 'Redis Init Error');
    }

    // Decorate fastify instance
    fastify.decorate('redis', redis);

    fastify.log.info('✨ Upstash Redis Plugin Registered');
});
