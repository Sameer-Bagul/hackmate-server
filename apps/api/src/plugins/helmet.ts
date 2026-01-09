import fp from 'fastify-plugin';
import helmet, { FastifyHelmetOptions } from '@fastify/helmet';

export default fp<FastifyHelmetOptions>(async (fastify) => {
    await fastify.register(helmet, {
        global: true,
    });
});
