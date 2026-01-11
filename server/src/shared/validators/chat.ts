import { z } from 'zod';

export const GetChatHistorySchema = {
    params: z.object({
        userId: z.string(),
    }),
};

export const GetGroupChatHistorySchema = {
    params: z.object({
        groupId: z.string(),
    }),
};

export type GetChatHistoryParams = z.infer<typeof GetChatHistorySchema.params>;
export type GetGroupChatHistoryParams = z.infer<typeof GetGroupChatHistorySchema.params>;
