import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { matchController } from '../controllers/match.controller.js';

const matchRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.addHook('onRequest', fastify.authenticate);

    // GET /match/discover - Find compatible developers with same intent
    fastify.get('/discover', matchController.discover.bind(matchController));

    // GET /match/top - Get top matches with filters
    fastify.get('/top', matchController.getTopMatches.bind(matchController));

    // GET /match/compare/:username1/:username2 - Compare two users
    fastify.get('/compare/:username1/:username2', {
        schema: {
            params: z.object({
                username1: z.string(),
                username2: z.string()
            })
        }
    }, matchController.compareProfiles.bind(matchController));

    // POST /match/sync-github - Sync current user's GitHub data
    fastify.post('/sync-github', matchController.syncGithub.bind(matchController));

    // GET /match/github/:username - Get GitHub analysis for a user
    fastify.get('/github/:username', {
        schema: {
            params: z.object({
                username: z.string()
            })
        }
    }, matchController.getGithubAnalysis.bind(matchController));
};

export default matchRoutes;
