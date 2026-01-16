import fp from 'fastify-plugin';
import cors, { FastifyCorsOptions } from '@fastify/cors';

export default fp<FastifyCorsOptions>(async (fastify) => {
    const isProd = process.env.NODE_ENV === 'production';

    const origin = isProd
        ? (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : true)
        : true;

    await fastify.register(cors, { origin });
});
