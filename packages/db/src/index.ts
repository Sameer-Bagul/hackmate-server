import mongoose from 'mongoose';

export * from './models/User.js';
export * from './models/Profile.js';
export * from './models/Profile.js';
export * from './models/Message.js';
export * from './models/FriendRequest.js';
export * from './models/Project.js';
export * from './models/Group.js';
export * from './models/Notification.js';

export const connectDB = async (url: string) => {
    try {
        await mongoose.connect(url);
        console.log('📦 MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    }
};
