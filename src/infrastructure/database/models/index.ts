import mongoose from 'mongoose';

export * from './User.js';
export * from './Profile.js';
export * from './Message.js';
export * from './FriendRequest.js';
export * from './Project.js';
export * from './Group.js';
export * from './Notification.js';
export * from './Settings.js';

export const connectDB = async (url: string) => {
    try {
        await mongoose.connect(url);
        console.log('📦 MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    }
};
