import { z } from 'zod';
import { objectIdSchema } from './common.js';

export const TargetUserBodySchema = {
    body: z.object({ targetUserId: objectIdSchema })
};

export const RequestIdBodySchema = {
    body: z.object({ requestId: objectIdSchema })
};

export type TargetUserBody = z.infer<typeof TargetUserBodySchema.body>;
export type RequestIdBody = z.infer<typeof RequestIdBodySchema.body>;
