import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
    bio: z.string().optional(),
    intent: z.enum(['startup', 'collab', 'friends', 'mentorship']).optional(),
    stack: z.array(z.string()).optional(),
    location: z.string().optional(),
    age: z.number().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    company: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    interests: z.array(z.string()).optional(),
    github: z.string().optional(),
    website: z.string().optional(),
});

export type ProfileUpdateBody = z.infer<typeof ProfileUpdateSchema>;
