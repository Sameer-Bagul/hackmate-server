import { z } from 'zod';

export const TargetUserBodySchema = {
    body: z.object({ targetUserId: z.string() })
};

export const RequestIdBodySchema = {
    body: z.object({ requestId: z.string() })
};

export type TargetUserBody = z.infer<typeof TargetUserBodySchema.body>;
export type RequestIdBody = z.infer<typeof RequestIdBodySchema.body>;
