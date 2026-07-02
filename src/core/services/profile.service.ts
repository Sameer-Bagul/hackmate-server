import { ProfileModel, UserModel } from '../../infrastructure/database/models/index.js';
import { MessageModel, GroupModel, ProjectModel, FriendRequestModel } from '../../infrastructure/database/models/index.js';

export class ProfileService {
    async getMyProfile(userId: string) {
        const profile = await ProfileModel.findOne({ userId });
        if (!profile) {
            throw new Error('Profile not found');
        }
        return profile;
    }

    async updateProfile(userId: string, data: any) {
        const profile = await ProfileModel.findOneAndUpdate(
            { userId },
            { $set: data },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (profile) {
            await UserModel.findByIdAndUpdate(userId, { profileId: profile._id });
        }

        return profile;
    }

    async getProfileByUsername(username: string) {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        const profile = await ProfileModel.findOne({ userId: user._id });
        if (!profile) {
            throw new Error('Profile not found');
        }

        // Increment views and get updated profile
        let updatedProfile = await ProfileModel.findOneAndUpdate(
            { _id: profile._id },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!updatedProfile) {
            throw new Error('Failed to update profile views');
        }

        // GitHub API Integration
        if (updatedProfile.github) {
            try {
                let ghUsername = updatedProfile.github;
                const match = updatedProfile.github.match(/github\.com\/([^\/]+)/);
                if (match && match[1]) {
                    ghUsername = match[1];
                }
                // Strip @ or any trailing spaces just in case
                ghUsername = ghUsername.replace('@', '').trim();
                
                if (ghUsername) {
                    const now = new Date();
                    const lastUpdated = updatedProfile.githubStats?.lastUpdated;
                    
                    // Only update once per hour to avoid rate limits
                    if (!lastUpdated || (now.getTime() - lastUpdated.getTime() > 3600000)) {
                        const [userRes, reposRes] = await Promise.all([
                            fetch(`https://api.github.com/users/${ghUsername}`),
                            fetch(`https://api.github.com/users/${ghUsername}/repos?per_page=100`)
                        ]);
                        
                        if (userRes.ok && reposRes.ok) {
                            const userData = await userRes.json() as any;
                            const reposData = await reposRes.json() as any;
                            
                            const topLanguages: Record<string, number> = {};
                            reposData.forEach((repo: any) => {
                                if (repo.language) {
                                    topLanguages[repo.language] = (topLanguages[repo.language] || 0) + 1;
                                }
                            });
                            
                            let topRepo = undefined;
                            if (reposData.length > 0) {
                                const sortedRepos = [...reposData].sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);
                                topRepo = {
                                    name: sortedRepos[0].name,
                                    stars: sortedRepos[0].stargazers_count,
                                    url: sortedRepos[0].html_url,
                                    description: sortedRepos[0].description
                                };
                            }
                            
                            updatedProfile.githubStats = {
                                avatarUrl: userData.avatar_url,
                                followers: userData.followers,
                                publicRepos: userData.public_repos,
                                topLanguages,
                                topRepo,
                                lastUpdated: now
                            };
                            await updatedProfile.save();
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch github stats:", err);
            }
        }

        // Aggregate Ecosystem Data
        const projects = await ProjectModel.find({ ownerId: user._id }).limit(10);
        const connectionsCount = user.friends?.length || 0;
        const messagesCount = await MessageModel.countDocuments({ senderId: user._id });
        const groupsCount = await GroupModel.countDocuments({ 'members.userId': user._id });
        
        const reputation = connectionsCount * 100 + projects.length * 50;

        return {
            ...updatedProfile.toObject(),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                presence: user.presence,
                role: user.role
            },
            ecosystem: {
                projects,
                connectionsCount,
                reputation,
                messagesCount,
                groupsCount
            }
        };
    }

    async getUserStats(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Count messages sent
        const messagesCount = await MessageModel.countDocuments({ senderId: userId });

        // Count connections (friends)
        const connectionsCount = user.friends?.length || 0;

        // Count projects created
        const projectsCount = await ProjectModel.countDocuments({ ownerId: userId });

        // Count groups
        const groupsCount = await GroupModel.countDocuments({ 'members.userId': userId });

        // Get profile for views
        const profile = await ProfileModel.findOne({ userId });
        const profileViews = profile?.views || 0;

        // Calculate streak (placeholder - would need activity tracking)
        const streak = 0;

        // Calculate reputation (placeholder - would need points system)
        const reputation = connectionsCount * 100 + projectsCount * 50;

        return {
            messagesCount,
            profileViews,
            connectionsCount,
            projectsCount,
            groupsCount,
            streak,
            reputation
        };
    }

    async getLeaderboard() {
        const topProfiles = await ProfileModel.find()
            .sort({ views: -1 })
            .limit(50)
            .lean();

        const leaderboard = [];
        for (const profile of topProfiles) {
            const user = await UserModel.findById(profile.userId).lean();
            if (!user) continue;

            const projectsCount = await ProjectModel.countDocuments({ ownerId: user._id });
            const connectionsCount = user.friends?.length || 0;
            
            // Calculate a comprehensive HackMate ranking score
            const reputation = connectionsCount * 100 + projectsCount * 50 + (profile.views || 0) * 10;
            const githubScore = (profile.githubStats?.followers || 0) * 5 + (profile.githubStats?.publicRepos || 0) * 2;
            const totalScore = reputation + githubScore;

            leaderboard.push({
                username: user.username,
                fullName: profile.fullName || user.username,
                avatarUrl: profile.githubStats?.avatarUrl || null,
                intent: profile.intent,
                views: profile.views || 0,
                score: totalScore,
                stack: profile.stack || []
            });
        }

        // Sort array by final total score descending
        return leaderboard.sort((a, b) => b.score - a.score);
    }
}

export const profileService = new ProfileService();
