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

export * from './common.js';
export * from './auth.js';
export * from './profile.js';
export * from './project.js';
export * from './group.js';
export * from './network.js';
export * from './chat.js';
