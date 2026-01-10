declare module 'fastify-type-provider-zod' {
    export type ZodTypeProvider = any;
    export const serializerCompiler: any;
    export const validatorCompiler: any;
}

declare module 'fastify-socket.io' {
    import { FastifyPluginCallback } from 'fastify';
    const fastifySocketIO: FastifyPluginCallback<any>;
    export default fastifySocketIO;
}

declare module 'socket.io' {
    export class Server {
        constructor(httpServer?: any, opts?: any);
        on(event: string, callback: any): void;
        to(room: string): { emit: (event: string, ...args: any[]) => void };
    }
    export interface ServerOptions { }
}
