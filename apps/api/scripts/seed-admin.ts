import mongoose from 'mongoose';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import readline from 'readline';
import { UserModel, ProfileModel } from '@hackmate/db';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env! Please set it to your Atlas URI.');
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (query: string, defaultVal: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(`${query} [${defaultVal}]: `, (answer) => {
            resolve(answer.trim() || defaultVal);
        });
    });
};

async function seedAdmin() {
    try {
        console.log(`Connecting to database at: ${MONGO_URI!.replace(/:([^@]+)@/, ':****@')}`);
        await mongoose.connect(MONGO_URI!);
        console.log('🔌 Connected to MongoDB');

        console.log('\n--- 👑 Admin Setup ---');

        await ask('Hey, how are you?', 'Good');
        console.log('Awesome! Let\'s get this server secured.\n');

        const username = await ask('Enter Username', 'admin');

        const existingAdmin = await UserModel.findOne({ username });
        if (existingAdmin) {
            console.log(`⚠️  User '${username}' already exists.`);
            // check role
            if (existingAdmin.role === 'admin') {
                console.log('✅ Account is already an ADMIN.');
                rl.close();
                return;
            } else {
                console.log('⚠️  Updating existing user to ADMIN role...');
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ User updated to Admin.');
                rl.close();
                return;
            }
        }

        const email = await ask('Enter Email', 'admin@hackmate.com');
        const fullName = await ask('Enter Full Name', 'Admin User');
        const mobileNumber = await ask('Enter Mobile Number', '0000000000');
        const bio = await ask('Enter Bio', 'The One Who Knocks');
        const github = await ask('Enter GitHub Username', username);
        const linkedin = await ask('Enter LinkedIn Username', username);
        const password = await ask('Enter Password', 'password123');

        const hashedPassword = await argon2.hash(password);

        // 1. Create User first (without profileId)
        const user = await UserModel.create({
            username,
            email,
            passwordHash: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        // 2. Create Profile with userId
        const profile = await ProfileModel.create({
            userId: user._id,
            fullName,
            username,
            bio: bio,
            mobileNumber,
            github,
            linkedin,
            skills: ['God Mode', 'Root Access'],
            // Removed incorrect 'socials' nesting
            twitter: username
        });

        // 3. Update User with profileId
        user.profileId = profile._id as any;
        await user.save();

        console.log('\n✅ Admin created successfully!');
        console.log(`👤 Username: ${username}`);
        console.log(`🔑 Password: ${password}`);

    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    } finally {
        rl.close();
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedAdmin();
