import fp from 'fastify-plugin';
import mongodb, { FastifyMongodbOptions } from '@fastify/mongodb';

export default fp<FastifyMongodbOptions>(async (fastify) => {
    await fastify.register(mongodb, {
        forceClose: true,
        url: process.env.MONGO_URL || 'mongodb://root:examplepassword@localhost:27017/hackmate?authSource=admin',
    });
});
