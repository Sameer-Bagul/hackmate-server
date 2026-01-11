import fastify, { FastifyInstance, FastifyServerOptions, FastifyPluginAsync } from 'fastify';
import autoload from '@fastify/autoload';
import path from 'path';
import { fileURLToPath } from 'url';

import auth from './modules/auth/index.js';
import chat from './modules/chat/index.js';
import profile from './modules/profile/index.js';
import admin from './modules/admin/index.js';
import network from './modules/network/index.js';
import project from './modules/project/index.js';
import group from './modules/group/index.js';
import notification from './modules/notification/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

export async function buildApp(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
    const app = fastify(opts);

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // Register Infra Plugins
    await app.register(autoload, {
        dir: path.join(__dirname, 'plugins/infra'),
        options: opts,
    });

    // Register Security Plugins
    await app.register(autoload, {
        dir: path.join(__dirname, 'plugins/security'),
        options: opts,
    });

    // Register Modules
    await app.register(auth, { prefix: '/auth' });
    await app.register(chat, { prefix: '/chat' });
    await app.register(profile, { prefix: '/profile' });
    await app.register(admin, { prefix: '/admin' });
    await app.register(network, { prefix: '/network' });
    await app.register(project, { prefix: '/project' });
    await app.register(group, { prefix: '/groups' });
    await app.register(notification, { prefix: '/notifications' });

    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    return app;
}
