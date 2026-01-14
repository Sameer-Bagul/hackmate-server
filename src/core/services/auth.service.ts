import argon2 from 'argon2';
import { UserModel, ProfileModel } from '../../infrastructure/database/models/index.js';

interface SignupData {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    bio?: string;
    intent?: string;
    stack?: string[];
    location?: string;
    city?: string;
    country?: string;
    age?: number;
    dateOfBirth?: string;
    gender?: string;
    lookingFor?: string;
    orientation?: string;
    interestedIn?: string[];
    ageRangeMin?: number;
    ageRangeMax?: number;
    hobbies?: string[];
    interests?: string[];
    company?: string;
    jobTitle?: string;
    yearsOfExperience?: number;
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
}

interface LoginData {
    username: string;
    password: string;
}

export class AuthService {
    async signup(data: SignupData, jwtSign: (payload: any) => string) {
        const existing = await UserModel.findOne({ 
            $or: [{ email: data.email }, { username: data.username }] 
        });
        
        if (existing) {
            throw new Error('User already exists');
        }

        const passwordHash = await argon2.hash(data.password);
        const user = await UserModel.create({
            username: data.username,
            email: data.email,
            passwordHash,
        });

        // Create profile with all provided data
        const profileData: any = {
            userId: user._id,
            fullName: data.fullName,
            bio: data.bio,
            intent: data.intent || 'collab',
            stack: data.stack || [],
            location: data.location,
            city: data.city,
            country: data.country,
            age: data.age,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            gender: data.gender,
            lookingFor: data.lookingFor,
            orientation: data.orientation,
            interestedIn: data.interestedIn,
            ageRangeMin: data.ageRangeMin,
            ageRangeMax: data.ageRangeMax,
            hobbies: data.hobbies,
            interests: data.interests,
            company: data.company,
            jobTitle: data.jobTitle,
            yearsOfExperience: data.yearsOfExperience,
            github: data.github,
            linkedin: data.linkedin,
            twitter: data.twitter,
            website: data.website,
        };

        // Remove undefined fields
        Object.keys(profileData).forEach(key => 
            profileData[key] === undefined && delete profileData[key]
        );

        await ProfileModel.create(profileData);

        const token = jwtSign({ id: user._id, username: user.username, role: user.role });
        return { 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            } 
        };
    }

    async login(data: LoginData, jwtSign: (payload: any) => string) {
        const user = await UserModel.findOne({ username: data.username });
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const valid = await argon2.verify(user.passwordHash, data.password);
        if (!valid) {
            throw new Error('Invalid credentials');
        }

        const token = jwtSign({ id: user._id, username: user.username, role: user.role });
        return { 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            } 
        };
    }

    async sendOTP(userId: string) {
        const user = await UserModel.findById(userId) as any;
        if (!user) {
            throw new Error('User not found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        return { user, otp };
    }

    async verifyOTP(userId: string, code: string) {
        const user = await UserModel.findById(userId) as any;

        if (!user) {
            throw new Error('User not found');
        }

        if (user.isVerified) {
            return { message: 'Already verified' };
        }

        if (!user.otpCode || user.otpCode !== code) {
            throw new Error('Invalid OTP');
        }

        if (!user.otpExpires || new Date() > user.otpExpires) {
            throw new Error('OTP expired');
        }

        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        return { message: 'Email verified successfully' };
    }
    async checkAvailability(username: string, email: string) {
        const usernameExists = await UserModel.findOne({ username });
        if (usernameExists) {
            return { available: false, field: 'username' };
        }

        const emailExists = await UserModel.findOne({ email });
        if (emailExists) {
            return { available: false, field: 'email' };
        }

        return { available: true };
    }
}

export const authService = new AuthService();
