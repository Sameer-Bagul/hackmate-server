import fp from 'fastify-plugin';
import jwt, { FastifyJWTOptions } from '@fastify/jwt';

import { FastifyRequest, FastifyReply } from 'fastify';

export default fp<FastifyJWTOptions>(async (fastify) => {
    const isProd = process.env.NODE_ENV === 'production';
    const jwtSecret = process.env.JWT_SECRET;

    if (isProd && !jwtSecret) {
        throw new Error('JWT_SECRET is required in production');
    }

    await fastify.register(jwt, {
        secret: jwtSecret || 'supersecret',
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
    interface FastifyJWT {
        payload: { id: string; username: string; role: 'admin' | 'user' };
        user: { id: string; username: string; role: 'admin' | 'user' };
    }
}
