import { z } from 'zod';

export const SignupSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
});

export const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type SignupBody = z.infer<typeof SignupSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
