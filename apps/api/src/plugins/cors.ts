import fp from 'fastify-plugin';
import cors, { FastifyCorsOptions } from '@fastify/cors';

export default fp<FastifyCorsOptions>(async (fastify) => {
    await fastify.register(cors, {
        origin: true, // Allow all for dev, tighten for prod
    });
});
