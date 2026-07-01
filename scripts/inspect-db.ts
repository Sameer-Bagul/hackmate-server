import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UserModel as User } from '../src/infrastructure/database/models/User.js';

dotenv.config();

async function inspectDB() {
    try {
        console.log('Connecting to database...');
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.\n');

        const totalUsers = await User.countDocuments();
        console.log(`📊 Total Users Registered: ${totalUsers}`);

        const admins = await User.find({ role: 'admin' }).select('username email role');
        console.log(`\n👑 Admins Found (${admins.length}):`);
        admins.forEach(admin => {
            console.log(`   - Username: ${admin.username} | Email: ${admin.email}`);
        });

        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('username email role createdAt');
        console.log(`\n🆕 Latest 5 Users:`);
        latestUsers.forEach(user => {
            console.log(`   - Username: ${user.username} | Role: ${user.role}`);
        });

        console.log('\n✅ Inspection complete.');
    } catch (error) {
        console.error('Error inspecting DB:', error);
    } finally {
        await mongoose.disconnect();
    }
}

inspectDB();
