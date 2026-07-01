import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UserModel } from '../src/infrastructure/database/models/User.js';
import { ProfileModel } from '../src/infrastructure/database/models/Profile.js';

dotenv.config();

async function seedProfile() {
    try {
        console.log('Connecting to database...');
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.\n');

        const neo = await UserModel.findOne({ username: 'neo' });
        if (!neo) {
            console.log('User neo not found!');
            return;
        }

        const existingProfile = await ProfileModel.findOne({ userId: neo._id });
        if (existingProfile) {
            console.log('Profile already exists for neo, updating...');
            await ProfileModel.updateOne({ userId: neo._id }, {
                $set: {
                    fullName: 'Sameer Bagul',
                    bio: 'Building the matrix. Full stack engineer.',
                    location: 'Zion',
                    city: 'Pune',
                    country: 'India',
                    stack: ['React', 'Node.js', 'Fastify', 'TypeScript'],
                    intent: 'collab',
                    github: 'sameerbagul',
                    company: 'HackMate',
                    jobTitle: 'Founder',
                    views: existingProfile.views || 42
                }
            });
        } else {
            console.log('Creating new profile for neo...');
            await ProfileModel.create({
                userId: neo._id,
                fullName: 'Sameer Bagul',
                bio: 'Building the matrix. Full stack engineer.',
                location: 'Zion',
                city: 'Pune',
                country: 'India',
                stack: ['React', 'Node.js', 'Fastify', 'TypeScript'],
                intent: 'collab',
                github: 'sameerbagul',
                company: 'HackMate',
                jobTitle: 'Founder',
                views: 42
            });
        }

        console.log('\n✅ Seed complete.');
    } catch (error) {
        console.error('Error seeding DB:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedProfile();
