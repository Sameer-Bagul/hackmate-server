import { FastifyRequest, FastifyReply } from 'fastify';
import * as settingsService from '../../core/services/settings.service.js';
import { AuthRequest } from '../../shared/types/index.js';

export const getSettingsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userId = (request as AuthRequest).user.id;
        const settings = await settingsService.getSettings(userId);
        return settings;
    } catch (error: any) {
        return reply.code(500).send({ message: error.message || 'Failed to fetch settings' });
    }
};

export const updatePrivacyHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userId = (request as AuthRequest).user.id;
        const settings = await settingsService.updatePrivacySettings(userId, request.body);
        return settings;
    } catch (error: any) {
        return reply.code(400).send({ message: error.message || 'Failed to update privacy settings' });
    }
};

export const updatePreferencesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userId = (request as AuthRequest).user.id;
        const settings = await settingsService.updatePreferences(userId, request.body);
        return settings;
    } catch (error: any) {
        return reply.code(400).send({ message: error.message || 'Failed to update preferences' });
    }
};
