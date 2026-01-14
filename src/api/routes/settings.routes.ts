import { FastifyPluginAsync } from 'fastify';
import * as settingsController from '../controllers/settings.controller.js';

const settingsRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.get('/', settingsController.getSettingsHandler);
    fastify.put('/privacy', settingsController.updatePrivacyHandler);
    fastify.put('/preferences', settingsController.updatePreferencesHandler);
};

export default settingsRoutes;
