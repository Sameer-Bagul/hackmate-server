import mongoose from 'mongoose';
import { UserModel, ProfileModel, connectDB } from './index.js';
import argon2 from 'argon2';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../apps/api/.env' }); // adjusted path
dotenv.config();

const SEED_USERS = [
    {
        username: 'neo',
        email: 'neo@matrix.com',
        password: 'password123',
        profile: {
            intent: 'startup',
            stack: ['Rust', 'Tauri', 'Solana'],
            bio: 'Looking for a co-founder for a Web3 terminal.',
            location: 'Zion',
            github: 'theone',
        },
    },
    {
        username: 'trinity',
        email: 'trinity@matrix.com',
        password: 'password123',
        profile: {
            intent: 'startup',
            stack: ['TypeScript', 'React', 'Node.js'],
            bio: 'Expert hacker into cybersecurity.',
            location: 'Zion',
            github: 'trinity',
        },
    },
    {
        username: 'morpheus',
        email: 'morpheus@matrix.com',
        password: 'password123',
        profile: {
            intent: 'mentorship',
            stack: ['Go', 'Kubernetes', 'Terraform'],
            bio: 'Guiding the next gen.',
            location: 'Nebuchadnezzar',
            github: 'dreamking',
        },
    },
];

async function seed() {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/hackmate';
    await connectDB(mongoUrl);

    await UserModel.deleteMany({});
    await ProfileModel.deleteMany({});
    console.log('🧹 Cleaned DB');

    const passwordHash = await argon2.hash('password123');

    for (const u of SEED_USERS) {
        const user = await UserModel.create({
            username: u.username,
            email: u.email,
            passwordHash,
        });

        const profile = await ProfileModel.create({
            userId: user._id,
            ...u.profile,
        });

        user.profileId = profile._id as mongoose.Types.ObjectId; // Cast to fix type mismatch
        await user.save();
        console.log(`✅ Created user: ${u.username}`);
    }

    process.exit(0);
}

seed();
