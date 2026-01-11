import { ProfileModel, UserModel } from '../../infrastructure/database/models/index.js';

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
}

export const profileService = new ProfileService();
