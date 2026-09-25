import { FastifyRequest, FastifyReply } from 'fastify';
import { ProfileModel, UserModel } from '../../infrastructure/database/models/index.js';
import { calculateMatchScore } from '../../core/services/match.service.js';
import { analyzeGitHubData, syncGitHubProfileBackground } from '../../core/services/github.service.js';

export class MatchController {

    async discover(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.id;

        const myProfile = await ProfileModel.findOne({ userId });
        if (!myProfile) {
            return reply.code(400).send({ message: 'Create your profile first' });
        }

        // Fetch profiles with same intent only
        const candidates = await ProfileModel.find({
            userId: { $ne: userId },
            intent: myProfile.intent
        }).populate('userId', 'username email');

        // Use cached GitHub Data
        let myGitHubData = myProfile.githubData;

        const results = await Promise.all(candidates.map(async (candidate) => {
            let candidateGitHubData = candidate.githubData;
            return calculateMatchScore(myProfile, candidate, myGitHubData || undefined, candidateGitHubData || undefined);
        }));

        // Sort by score desc
        results.sort((a, b) => b.score - a.score);

        return results;
    }

    async getTopMatches(request: FastifyRequest, reply: FastifyReply) {
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

        // Build filter query
        const filter: any = {
            userId: { $ne: userId },
            intent: intent || myProfile.intent
        };

        if (city) {
            filter.location = new RegExp(city, 'i');
        }

        if (country) {
            filter.location = new RegExp(country, 'i');
        }

        const candidates = await ProfileModel.find(filter).populate('userId', 'username email');

        // Use cached GitHub Data for me
        let myGitHubData = myProfile.githubData;

        // Calculate matches
        let results = await Promise.all(candidates.map(async (candidate) => {
            let candidateGitHubData = candidate.githubData;
            return calculateMatchScore(myProfile, candidate, myGitHubData || undefined, candidateGitHubData || undefined);
        }));

        // Filter by minimum score
        results = results.filter(r => r.score >= Number(minScore));

        // Sort by score desc and limit
        results.sort((a, b) => b.score - a.score);

        return results.slice(0, Number(limit));
    }

    async compareProfiles(request: FastifyRequest, reply: FastifyReply) {
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

        // Fetch cached GitHub data
        let github1 = profile1.githubData;
        let github2 = profile2.githubData;

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
    }

    async syncGithub(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.id;

        const profile = await ProfileModel.findOne({ userId });
        if (!profile) {
            return reply.code(404).send({ message: 'Profile not found' });
        }

        if (!profile.github) {
            return reply.code(400).send({ message: 'GitHub username not set in profile' });
        }

        // Sync Github data in background
        const token = (request.user as any)?.githubAccessToken || '';
        syncGitHubProfileBackground(userId, profile.github, token).catch((err: any) => console.error(err));
        
        return {
            message: 'GitHub data sync started in background',
            profile
        };
    }

    async getGithubAnalysis(request: FastifyRequest, reply: FastifyReply) {
        const { username } = request.params as { username: string };

        const githubData = await analyzeGitHubData(username);

        if (!githubData) {
            return reply.code(404).send({ message: 'GitHub profile not found' });
        }

        return githubData;
    }
}

export const matchController = new MatchController();
