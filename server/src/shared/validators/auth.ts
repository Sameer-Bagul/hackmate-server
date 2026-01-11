import { z } from 'zod';

export const SignupSchema = z.object({
    // Account Info
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    // Basic Profile
    fullName: z.string().optional(),
    bio: z.string().optional(),
    intent: z.enum(['startup', 'collab', 'friends', 'mentorship', 'dating']).default('collab'),
    stack: z.array(z.string()).optional(),
    // Location
    city: z.string().optional(),
    country: z.string().optional(),
    location: z.string().optional(),
    // Personal Info
    age: z.number().min(18).max(100).optional(),
    dateOfBirth: z.string().optional(), // ISO date
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
    // Dating Preferences (required if intent is dating)
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
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().optional(),
});

export const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type SignupBody = z.infer<typeof SignupSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;

