import { connectDB, ProfileModel, UserModel } from '../src/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function updateIntent() {
    try {
        console.log('🔌 Connecting to database...');
        const mongoUrl = process.env.MONGO_URI || process.env.MONGO_URL;
        await connectDB(mongoUrl!);

        // Find user "neo" (which defaults to username 'priya_dev' if I logged in as that, but wait)
        // I logged in as 'priya_dev'.
        // Let's just find 'priya_dev'.

        const username = 'neo';
        const user = await UserModel.findOne({ username });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        const profile = await ProfileModel.findOne({ userId: user._id });
        if (!profile) {
            console.error('Profile not found');
            process.exit(1);
        }

        console.log(`Current intent: ${profile.intent}`);
        profile.intent = 'dating';
        await profile.save();
        console.log(`✅ Updated intent to: ${profile.intent}`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

updateIntent();
