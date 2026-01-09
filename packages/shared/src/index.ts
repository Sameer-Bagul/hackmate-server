import { z } from 'zod';

export const UserSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

export interface AuthenticatedUser {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
}

export * from './schemas/auth.js';
export * from './schemas/profile.js';
export * from './schemas/project.js';
export * from './schemas/group.js';
export * from './schemas/network.js';
export * from './schemas/chat.js';
