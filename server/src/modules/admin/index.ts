import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { UserModel, ProfileModel } from '../../models/index.js';

const adminRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();

    // Middleware to ensure user is admin
    app.addHook('onRequest', fastify.authenticate);
    app.addHook('onRequest', async (request, reply) => {
        const user = request.user as { role: string; id: string };
        if (user.role !== 'admin') {
            return reply.code(403).send({ message: 'Forbidden: Admins only' });
        }
    });

    // LIST all users
    app.get('/users', async (request, reply) => {
        const users = await UserModel.find({}, '-passwordHash');
        return users;
    });

    // VIEW a user
    app.get('/users/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await UserModel.findById(id, '-passwordHash');
        if (!user) return reply.code(404).send({ message: 'User not found' });

        const profile = await ProfileModel.findOne({ userId: user._id });
        return { user, profile };
    });

    // DELETE a user
    app.delete('/users/:id', {
        schema: {
            params: z.object({ id: z.string() })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };

        // Prevent deleting yourself
        const requestUser = request.user as { role: string; id: string };
        if (id === requestUser.id) {
            return reply.code(400).send({ message: 'Cannot delete yourself' });
        }

        const user = await UserModel.findByIdAndDelete(id);
        if (!user) return reply.code(404).send({ message: 'User not found' });

        // Cleanup profile and messages preferably, but start with profile
        await ProfileModel.deleteOne({ userId: id });

        return { message: 'User deleted' };
    });

    // UPDATE a user (e.g. promote to admin)
    app.put('/users/:id', {
        schema: {
            params: z.object({ id: z.string() }),
            body: z.object({
                role: z.enum(['admin', 'user']).optional(),
                username: z.string().optional(),
                email: z.string().email().optional()
            })
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as { role?: 'admin' | 'user', username?: string, email?: string };

        const user = await UserModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }).select('-passwordHash');
        if (!user) return reply.code(404).send({ message: 'User not found' });

        return user;
    });
};

export default adminRoutes;
