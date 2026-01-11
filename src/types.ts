import { FastifyRequest } from 'fastify';
import { AuthenticatedUser } from './schemas/index.js';

export { AuthenticatedUser };

export interface AuthRequest extends FastifyRequest {
    user: AuthenticatedUser;
}
