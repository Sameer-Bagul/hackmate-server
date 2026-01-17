import { Types } from 'mongoose';

/**
 * Validates if a string is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};

/**
 * Validates and converts string to ObjectId
 * @throws Error if invalid
 */
export const toObjectId = (id: string): Types.ObjectId => {
    if (!isValidObjectId(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new Types.ObjectId(id);
};

/**
 * Safely validates multiple ObjectIds
 */
export const validateObjectIds = (...ids: string[]): boolean => {
    return ids.every(id => isValidObjectId(id));
};
