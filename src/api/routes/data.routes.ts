import { FastifyPluginAsync } from 'fastify';
import * as dataController from '../controllers/data.controller.js';

const dataRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/export', dataController.exportDataHandler);
};

export default dataRoutes;
