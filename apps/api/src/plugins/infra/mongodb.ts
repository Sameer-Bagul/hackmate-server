import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { FastifyPluginAsync } from 'fastify';

const mongodbPlugin: FastifyPluginAsync = async (fastify) => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in environment!');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        fastify.log.info('✨ MongoDB (Mongoose) Connected');

        // Close connection on shutdown
        fastify.addHook('onClose', async () => {
            await mongoose.disconnect();
            fastify.log.info('MongoDB Disconnected');
        });
    } catch (err) {
        fastify.log.error(err, 'MongoDB Connection Failed');
        throw err;
    }
};

export default fp(mongodbPlugin);
