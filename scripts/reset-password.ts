import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as argon2 from 'argon2';
import { UserModel as User } from '../src/infrastructure/database/models/User.js';

dotenv.config();

async function resetPassword() {
    const usernameToReset = 'neo';
    const newPassword = 'HackMate2026!'; // You can change this if you want

    try {
        console.log(`Connecting to database to reset password for ${usernameToReset}...`);
        
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        
        // Find the user
        const user = await User.findOne({ username: usernameToReset });
        
        if (!user) {
            console.error(`❌ User '${usernameToReset}' not found.`);
            return;
        }

        // Hash the new password using argon2
        console.log(`Hashing new password...`);
        const hashedPassword = await argon2.hash(newPassword);

        // Update the user document
        user.passwordHash = hashedPassword;
        await user.save();

        console.log(`✅ Password for '${usernameToReset}' successfully changed to: ${newPassword}`);
        console.log(`You can now use this password to log in via the CLI or web app.`);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetPassword();
