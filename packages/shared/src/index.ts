import { z } from 'zod';

export const UserSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;
