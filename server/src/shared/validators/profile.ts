import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
    fullName: z.string().optional(),
    bio: z.string().optional(),
    intent: z.enum(['startup', 'collab', 'friends', 'mentorship', 'dating']).optional(),
    stack: z.array(z.string()).optional(),
    location: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    // Personal Information
    age: z.number().min(18).max(100).optional(),
    dateOfBirth: z.string().optional(), // ISO date string
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
    // Dating Preferences
    lookingFor: z.enum(['friendship', 'dating', 'relationship', 'networking']).optional(),
    orientation: z.enum(['straight', 'gay', 'lesbian', 'bisexual', 'pansexual', 'asexual', 'other']).optional(),
    interestedIn: z.array(z.enum(['male', 'female', 'other'])).optional(),
    ageRangeMin: z.number().min(18).max(100).optional(),
    ageRangeMax: z.number().min(18).max(100).optional(),
    // Hobbies & Interests
    hobbies: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    // Professional
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    yearsOfExperience: z.number().min(0).optional(),
    // Social Links
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
    // Contact
    mobileNumber: z.string().optional(),
});

export type ProfileUpdateBody = z.infer<typeof ProfileUpdateSchema>;
