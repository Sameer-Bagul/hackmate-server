import { connectDB, UserModel, ProfileModel } from '../src/models/index.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function cleanup() {
    try {
        console.log('🔌 Connecting to database...');
        const mongoUrl = process.env.MONGO_URI || process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error('MONGO_URI is not defined');
        }
        await connectDB(mongoUrl);
        console.log('📦 MongoDB Connected');

        console.log('🔍 Scanning for orphan profiles...');

        const profiles = await ProfileModel.find({});
        let deletedCount = 0;

        for (const profile of profiles) {
            // Check for explicit corrupted bio
            if (profile.bio && profile.bio.includes('const hashedPassword')) {
                console.log(`🗑️  Deleting corrupted profile (Bad Bio): ${profile._id}`);
                await ProfileModel.findByIdAndDelete(profile._id);
                deletedCount++;
                continue;
            }

            // Check if user exists
            if (profile.userId) {
                const user = await UserModel.findById(profile.userId);
                if (!user) {
                    console.log(`🗑️  Deleting orphan profile (No User): ${profile.fullName || 'Unknown'} (${profile._id})`);
                    await ProfileModel.findByIdAndDelete(profile._id);
                    deletedCount++;
                }
            } else {
                console.log(`🗑️  Deleting orphan profile (Null UserID): ${profile._id}`);
                await ProfileModel.findByIdAndDelete(profile._id);
                deletedCount++;
            }
        }

        console.log(`\n✅ Cleanup complete. Deleted ${deletedCount} corrupted profiles.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

cleanup();
