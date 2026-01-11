import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ProfileModel, UserModel } from '../../models/index.js';
import { calculateMatchScore } from './service.js';
import { analyzeGitHubData } from '../../services/githubService.js';

const match: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.addHook('onRequest', fastify.authenticate);

    // GET /match/discover - Find compatible developers with same intent
    fastify.get('/discover', async (request, reply) => {
        // @ts-ignore
        const userId = request.user.id;

        const myProfile = await ProfileModel.findOne({ userId });
        if (!myProfile) {
            return reply.code(400).send({ message: 'Create your profile first' });
        }

        // Fetch profiles with same intent only
        const candidates = await ProfileModel.find({ 
            userId: { $ne: userId },
            intent: myProfile.intent  // Filter by matching intent
        }).populate('userId', 'username email');

        const results = candidates.map(candidate => calculateMatchScore(myProfile, candidate));

        // Sort by score desc
        results.sort((a, b) => b.score - a.score);

        return results;
    });

    // GET /match/top?limit=10&city=...&country=...&minScore=50&intent=...
    fastify.get('/top', async (request, reply) => {
        // @ts-ignore
        const userId = request.user.id;
        const { limit = 10, city, country, minScore = 0, intent } = request.query as { 
            limit?: number; 
            city?: string; 
            country?: string;
            minScore?: number;
            intent?: string;
        };

        const myProfile = await ProfileModel.findOne({ userId });
        if (!myProfile) {
            return reply.code(400).send({ message: 'Create your profile first' });
        }

        // Build filter query - default to same intent unless specified
        const filter: any = { 
            userId: { $ne: userId },
            intent: intent || myProfile.intent  // Filter by intent (default to user's intent)
        };
        
        if (city) {
            filter.location = new RegExp(city, 'i');
        }
        
        if (country) {
            filter.location = new RegExp(country, 'i');
        }

        const candidates = await ProfileModel.find(filter).populate('userId', 'username email');

        // Calculate matches
        let results = candidates.map(candidate => calculateMatchScore(myProfile, candidate));

        // Filter by minimum score
        results = results.filter(r => r.score >= Number(minScore));

        // Sort by score desc and limit
        results.sort((a, b) => b.score - a.score);

        return results.slice(0, Number(limit));
    });

    // GET /match/compare/:username1/:username2 - Compare two users
    fastify.get('/compare/:username1/:username2', {
        schema: {
            params: z.object({
                username1: z.string(),
                username2: z.string()
            })
        }
    }, async (request, reply) => {
        const { username1, username2 } = request.params as { username1: string; username2: string };

        // Find both users
        const [user1, user2] = await Promise.all([
            UserModel.findOne({ username: username1 }),
            UserModel.findOne({ username: username2 })
        ]);

        if (!user1 || !user2) {
            return reply.code(404).send({ message: 'One or both users not found' });
        }

        // Get profiles
        const [profile1, profile2] = await Promise.all([
            ProfileModel.findOne({ userId: user1._id }),
            ProfileModel.findOne({ userId: user2._id })
        ]);

        if (!profile1 || !profile2) {
            return reply.code(404).send({ message: 'One or both profiles not found' });
        }

        // Fetch GitHub data if available
        let github1, github2;
        if (profile1.github) {
            github1 = await analyzeGitHubData(profile1.github);
        }
        if (profile2.github) {
            github2 = await analyzeGitHubData(profile2.github);
        }

        // Calculate match score both ways
        const match1to2 = calculateMatchScore(profile1, profile2, github1 || undefined, github2 || undefined);
        const match2to1 = calculateMatchScore(profile2, profile1, github2 || undefined, github1 || undefined);

        return {
            user1: {
                username: user1.username,
                profile: profile1,
                github: github1
            },
            user2: {
                username: user2.username,
                profile: profile2,
                github: github2
            },
            compatibility: {
                score: Math.round((match1to2.score + match2to1.score) / 2),
                percentage: Math.round((match1to2.compatibilityPercentage + match2to1.compatibilityPercentage) / 2),
                reasons: [...new Set([...match1to2.matchReasons, ...match2to1.matchReasons])]
            },
            detailed: {
                user1_to_user2: {
                    score: match1to2.score,
                    percentage: match1to2.compatibilityPercentage,
                    reasons: match1to2.matchReasons
                },
                user2_to_user1: {
                    score: match2to1.score,
                    percentage: match2to1.compatibilityPercentage,
                    reasons: match2to1.matchReasons
                }
            }
        };
    });

    // POST /match/sync-github - Sync current user's GitHub data
    fastify.post('/sync-github', async (request, reply) => {
        // @ts-ignore
        const userId = request.user.id;

        const profile = await ProfileModel.findOne({ userId });
        if (!profile) {
            return reply.code(404).send({ message: 'Profile not found' });
        }

        if (!profile.github) {
            return reply.code(400).send({ message: 'GitHub username not set in profile' });
        }

        const githubData = await analyzeGitHubData(profile.github);
        
        if (!githubData) {
            return reply.code(404).send({ message: 'GitHub profile not found or inaccessible' });
        }

        // Update profile with GitHub data
        profile.stack = [...new Set([...profile.stack, ...githubData.skills])];
        if (githubData.profile.location && !profile.location) {
            profile.location = githubData.profile.location;
        }
        if (githubData.profile.bio && !profile.bio) {
            profile.bio = githubData.profile.bio;
        }

        await profile.save();

        return {
            message: 'GitHub data synced successfully',
            profile,
            githubData
        };
    });

    // GET /match/github/:username - Get GitHub analysis for a user
    fastify.get('/github/:username', {
        schema: {
            params: z.object({
                username: z.string()
            })
        }
    }, async (request, reply) => {
        const { username } = request.params as { username: string };

        const githubData = await analyzeGitHubData(username);
        
        if (!githubData) {
            return reply.code(404).send({ message: 'GitHub profile not found' });
        }

        return githubData;
    });
};

export default match;
