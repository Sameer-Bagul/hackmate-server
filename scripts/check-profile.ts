import { connectDB, ProfileModel, UserModel } from '../src/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkProfile() {
    try {
        const mongoUrl = process.env.MONGO_URI || process.env.MONGO_URL;
        await connectDB(mongoUrl!);

        const username = 'priya_dev';
        const user = await UserModel.findOne({ username });
        if (!user) {
            console.log('User not found');
            return;
        }

        const profile = await ProfileModel.findOne({ userId: user._id });
        console.log('Profile:', profile);

        const neoUser = await UserModel.findOne({ username: 'neo' });
        const neoProfile = await ProfileModel.findOne({ userId: neoUser?._id });
        console.log('Neo Profile:', neoProfile);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkProfile();
