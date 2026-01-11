import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import autoload from '@fastify/autoload';
import path from 'path';
import { fileURLToPath } from 'url';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

// Refactored API routes
import apiRoutes from './api/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildApp(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
    const app = fastify(opts);

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // Register Config/Security Plugins
    await app.register(autoload, {
        dir: path.join(__dirname, 'config'),
        options: opts,
    });

    // Register Infrastructure
    await app.register(autoload, {
        dir: path.join(__dirname, 'infrastructure/database'),
        options: opts,
        ignorePattern: /models/
    });
    
    await app.register(autoload, {
        dir: path.join(__dirname, 'infrastructure/cache'),
        options: opts,
    });

    await app.register(autoload, {
        dir: path.join(__dirname, 'infrastructure/socket'),
        options: opts,
        ignorePattern: /socket\.service/
    });

    // Register all API Routes (auth, match, profile, chat, group, network, project, notification, admin)
    await app.register(apiRoutes, { prefix: '/api' });

    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    return app;
}
