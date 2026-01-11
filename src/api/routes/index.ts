import { FastifyPluginAsync } from 'fastify';
import authRoutes from './auth.routes.js';
import matchRoutes from './match.routes.js';
import profileRoutes from './profile.routes.js';
import chatRoutes from './chat.routes.js';
import groupRoutes from './group.routes.js';
import networkRoutes from './network.routes.js';
import projectRoutes from './project.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';

const apiRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(matchRoutes, { prefix: '/match' });
    await fastify.register(profileRoutes, { prefix: '/profile' });
    await fastify.register(chatRoutes, { prefix: '/chat' });
    await fastify.register(groupRoutes, { prefix: '/groups' });
    await fastify.register(networkRoutes, { prefix: '/network' });
    await fastify.register(projectRoutes, { prefix: '/projects' });
    await fastify.register(notificationRoutes, { prefix: '/notifications' });
    await fastify.register(adminRoutes, { prefix: '/admin' });
};

export default apiRoutes;
