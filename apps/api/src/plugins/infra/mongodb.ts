import fp from 'fastify-plugin';
import mongodb, { FastifyMongodbOptions } from '@fastify/mongodb';

export default fp<FastifyMongodbOptions>(async (fastify) => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in environment!');
    }
    await fastify.register(mongodb, {
        forceClose: true,
        url: process.env.MONGO_URI,
    });
});
