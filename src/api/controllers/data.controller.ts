import { FastifyRequest, FastifyReply } from 'fastify';
import * as dataService from '../../core/services/data.service.js';
import { AuthRequest } from '../../shared/types/index.js';

export const exportDataHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userId = (request as AuthRequest).user.id;
        const data = await dataService.exportUserData(userId);
        
        // Set headers for file download
        reply.header('Content-Type', 'application/json');
        reply.header('Content-Disposition', `attachment; filename="hackmate_export_${userId}_${Date.now()}.json"`);
        
        return data;
    } catch (error: any) {
        return reply.code(500).send({ message: error.message || 'Failed to export data' });
    }
};
