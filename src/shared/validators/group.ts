import { z } from 'zod';
import { objectIdSchema } from './common.js';

export const CreateGroupSchema = {
    body: z.object({
        name: z.string().min(3),
        description: z.string().optional(),
        isPrivate: z.boolean().default(false)
    })
};

export const GroupParamsSchema = {
    params: z.object({ id: objectIdSchema })
};

export const GroupUserActionSchema = {
    params: z.object({ id: objectIdSchema }),
    body: z.object({ userId: objectIdSchema })
};

export type CreateGroupBody = z.infer<typeof CreateGroupSchema.body>;
export type GroupParams = z.infer<typeof GroupParamsSchema.params>;
export type GroupUserActionBody = z.infer<typeof GroupUserActionSchema.body>;
