import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../src/models/index.js';

import path from 'path';

dotenv.config();

const run = async () => {
    if (!process.env.MONGO_URI) {
        console.error("❌ No MONGO_URI. Make sure .env is set.");
        process.exit(1);
    }

    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);

    const user = await UserModel.findOne({ username: 'neo' }); // Assuming 'neo' is the username from previous context
    if (user) {
        user.isVerified = false;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();
        console.log('✅ User "neo" has been UN-VERIFIED. You can now test OTP.');
    } else {
        console.log('❌ User "neo" not found. Did you use a different username?');
    }

    await mongoose.disconnect();
    process.exit(0);
}

run();
