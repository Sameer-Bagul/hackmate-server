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
    // Initialize Upstash Redis client
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL || 'https://example.upstash.io',
        token: process.env.UPSTASH_REDIS_REST_TOKEN || 'example_token',
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
