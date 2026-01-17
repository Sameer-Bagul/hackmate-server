import { z } from 'zod';
import { objectIdSchema } from './common.js';

export const GetChatHistorySchema = {
    params: z.object({
        userId: objectIdSchema,
    }),
};

export const GetGroupChatHistorySchema = {
    params: z.object({
        groupId: objectIdSchema,
    }),
};

export type GetChatHistoryParams = z.infer<typeof GetChatHistorySchema.params>;
export type GetGroupChatHistoryParams = z.infer<typeof GetGroupChatHistorySchema.params>;
