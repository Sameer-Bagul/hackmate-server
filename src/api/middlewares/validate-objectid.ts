import { FastifyRequest, FastifyReply } from 'fastify';
import { isValidObjectId } from '../../shared/utils/index.js';

/**
 * Middleware to validate ObjectId parameters
 */
export const validateObjectId = (paramName: string = 'id') => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const params = request.params as Record<string, string>;
        const id = params[paramName];

        if (!id) {
            return reply.code(400).send({ 
                error: 'Bad Request',
                message: `Missing required parameter: ${paramName}` 
            });
        }

        if (!isValidObjectId(id)) {
            return reply.code(400).send({ 
                error: 'Bad Request',
                message: `Invalid ObjectId format for parameter: ${paramName}` 
            });
        }
    };
};

/**
 * Middleware to validate multiple ObjectId parameters
 */
export const validateObjectIds = (...paramNames: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const params = request.params as Record<string, string>;

        for (const paramName of paramNames) {
            const id = params[paramName];

            if (!id) {
                return reply.code(400).send({ 
                    error: 'Bad Request',
                    message: `Missing required parameter: ${paramName}` 
                });
            }

            if (!isValidObjectId(id)) {
                return reply.code(400).send({ 
                    error: 'Bad Request',
                    message: `Invalid ObjectId format for parameter: ${paramName}` 
                });
            }
        }
    };
};

/**
 * Validate ObjectId in request body
 */
export const validateBodyObjectId = (fieldName: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const body = request.body as Record<string, any>;
        const id = body[fieldName];

        if (id && !isValidObjectId(id)) {
            return reply.code(400).send({ 
                error: 'Bad Request',
                message: `Invalid ObjectId format for field: ${fieldName}` 
            });
        }
    };
};
