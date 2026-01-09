import { FastifyRequest } from 'fastify';
import { AuthenticatedUser } from '@hackmate/shared';

export { AuthenticatedUser };

export interface AuthRequest extends FastifyRequest {
    user: AuthenticatedUser;
}
