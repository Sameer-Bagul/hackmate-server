import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
    userId: mongoose.Types.ObjectId;
    fullName?: string;
    bio?: string;
    intent: 'startup' | 'collab' | 'friends' | 'mentorship' | 'dating';
    stack: string[];
    location?: string;
    city?: string;
    country?: string;
    // Personal Information
    age?: number;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    // Dating Preferences (only for intent: dating)
    lookingFor?: 'friendship' | 'dating' | 'relationship' | 'networking';
    orientation?: 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'pansexual' | 'asexual' | 'other';
    interestedIn?: Array<'male' | 'female' | 'other'>;
    ageRangeMin?: number;
    ageRangeMax?: number;
    // Hobbies & Interests
    hobbies?: string[];
    interests?: string[];
    // Professional
    company?: string;
    jobTitle?: string;
    yearsOfExperience?: number;
    // Social Links
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
    // Stats
    views?: number;
    // Contact
    mobileNumber?: string;
    // GitHub Integration
    githubStats?: {
        avatarUrl?: string;
        followers?: number;
        publicRepos?: number;
        topLanguages?: Record<string, number>;
        lastUpdated?: Date;
    };
}

const ProfileSchema = new Schema<IProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        fullName: { type: String },
        bio: { type: String },
        intent: {
            type: String,
            enum: ['startup', 'collab', 'friends', 'mentorship', 'dating'],
            default: 'collab',
        },
        stack: [{ type: String }],
        location: { type: String },
        city: { type: String },
        country: { type: String },
        // Personal Information
        age: { type: Number, min: 18, max: 100 },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
        // Dating Preferences
        lookingFor: { type: String, enum: ['friendship', 'dating', 'relationship', 'networking'] },
        orientation: { 
            type: String, 
            enum: ['straight', 'gay', 'lesbian', 'bisexual', 'pansexual', 'asexual', 'other'] 
        },
        interestedIn: [{ type: String, enum: ['male', 'female', 'other'] }],
        ageRangeMin: { type: Number, min: 18, max: 100 },
        ageRangeMax: { type: Number, min: 18, max: 100 },
        // Hobbies & Interests
        hobbies: [{ type: String }],
        interests: [{ type: String }],
        // Professional
        company: { type: String },
        jobTitle: { type: String },
        yearsOfExperience: { type: Number, min: 0 },
        // Social Links
        linkedin: { type: String },
        twitter: { type: String },
        github: { type: String },
        website: { type: String },
        // Stats
        views: { type: Number, default: 0 },
        // Contact
        mobileNumber: { type: String },
        // GitHub Integration
        githubStats: {
            avatarUrl: { type: String },
            followers: { type: Number },
            publicRepos: { type: Number },
            topLanguages: { type: Map, of: Number },
            lastUpdated: { type: Date }
        }
    },
    { timestamps: true }
);

export const ProfileModel = mongoose.model<IProfile>('Profile', ProfileSchema);
