import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import autoload from '@fastify/autoload';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildApp(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
    const app = fastify(opts);

    // Register Plugins
    await app.register(autoload, {
        dir: path.join(__dirname, 'plugins'),
    });

    // Register Modules (Routes)
    await app.register(autoload, {
        dir: path.join(__dirname, 'modules'),
        dirNameRoutePrefix: true,
        options: { prefix: '/api' },
    });

    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    return app;
}
