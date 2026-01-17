import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

/**
 * Global error handler for consistent error responses
 */
export const errorHandler = async (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) => {
    // Log the error
    request.log.error(error);

    // Zod validation errors
    if (error instanceof ZodError) {
        return reply.code(400).send({
            error: 'Validation Error',
            message: 'Invalid request data',
            details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }

    // MongoDB duplicate key error
    if ((error as any).code === 11000) {
        const field = Object.keys((error as any).keyPattern || {})[0] || 'field';
        return reply.code(409).send({
            error: 'Conflict',
            message: `${field} already exists`
        });
    }

    // MongoDB CastError (invalid ObjectId)
    if ((error as any).name === 'CastError') {
        return reply.code(400).send({
            error: 'Bad Request',
            message: 'Invalid ID format'
        });
    }

    // JWT errors
    if (error.message?.includes('Authorization token')) {
        return reply.code(401).send({
            error: 'Unauthorized',
            message: 'Invalid or missing authentication token'
        });
    }

    // Fastify validation errors
    if (error.validation) {
        return reply.code(400).send({
            error: 'Validation Error',
            message: error.message,
            details: error.validation
        });
    }

    // Default to 500 for unknown errors
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 
        ? 'Internal Server Error' 
        : error.message || 'An error occurred';

    return reply.code(statusCode).send({
        error: error.name || 'Error',
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
};
