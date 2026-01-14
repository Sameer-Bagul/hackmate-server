import { FastifyRequest, FastifyReply } from 'fastify';
import { profileService } from '../../core/services/profile.service.js';
import { ProfileUpdateSchema } from '../../shared/validators/index.js';

export class ProfileController {
    
    async getMyProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            // @ts-ignore
            const userId = request.user.id;
            const profile = await profileService.getMyProfile(userId);
            return profile;
        } catch (error: any) {
            if (error.message === 'Profile not found') {
                return reply.code(404).send({ message: error.message });
            }
            throw error;
        }
    }

    async updateProfile(request: FastifyRequest, reply: FastifyReply) {
        // @ts-ignore
        const userId = request.user.id;
        const body = ProfileUpdateSchema.parse(request.body);
        
        const profile = await profileService.updateProfile(userId, body);
        return profile;
    }

    async getProfileByUsername(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username } = request.params as { username: string };
            const result = await profileService.getProfileByUsername(username);
            return result;
        } catch (error: any) {
            if (error.message === 'User not found' || error.message === 'Profile not found') {
                return reply.code(404).send({ message: error.message });
            }
            throw error;
        }
    }

    async getUserStats(request: FastifyRequest, reply: FastifyReply) {
        try {
            // @ts-ignore
            const userId = request.user.id;
            const stats = await profileService.getUserStats(userId);
            return stats;
        } catch (error: any) {
            if (error.message === 'User not found') {
                return reply.code(404).send({ message: error.message });
            }
            throw error;
        }
    }
}

export const profileController = new ProfileController();
