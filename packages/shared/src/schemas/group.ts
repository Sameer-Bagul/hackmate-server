import { z } from 'zod';

export const CreateGroupSchema = {
    body: z.object({
        name: z.string().min(3),
        description: z.string().optional(),
        isPrivate: z.boolean().default(false)
    })
};

export const GroupParamsSchema = {
    params: z.object({ id: z.string() })
};

export const GroupUserActionSchema = {
    params: z.object({ id: z.string() }),
    body: z.object({ userId: z.string() })
};

export type CreateGroupBody = z.infer<typeof CreateGroupSchema.body>;
export type GroupParams = z.infer<typeof GroupParamsSchema.params>;
export type GroupUserActionBody = z.infer<typeof GroupUserActionSchema.body>;
