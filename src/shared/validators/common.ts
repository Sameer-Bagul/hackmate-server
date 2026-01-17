import { z } from 'zod';
import { Types } from 'mongoose';

/**
 * Custom Zod schema for MongoDB ObjectId validation
 */
export const objectIdSchema = z.string().refine(
    (val) => Types.ObjectId.isValid(val),
    { message: 'Invalid ObjectId format' }
);

/**
 * Optional ObjectId schema
 */
export const optionalObjectIdSchema = z.string().refine(
    (val) => !val || Types.ObjectId.isValid(val),
    { message: 'Invalid ObjectId format' }
).optional();
