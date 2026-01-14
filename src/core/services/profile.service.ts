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

        return {
            ...profile.toObject(),
            user: {
                id: user._id,
                username: user.username,
                email: user.email
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

        // Count profile views (we'll store this in profile later, for now return 0)
        const profileViews = 0;

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
}

export const profileService = new ProfileService();
