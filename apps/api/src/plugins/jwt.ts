import fp from 'fastify-plugin';
import jwt, { FastifyJWTOptions } from '@fastify/jwt';

import { FastifyRequest, FastifyReply } from 'fastify';

export default fp<FastifyJWTOptions>(async (fastify) => {
    await fastify.register(jwt, {
        secret: process.env.JWT_SECRET || 'supersecret',
    });

    fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any;
    }
}
