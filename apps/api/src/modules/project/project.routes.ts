import { FastifyPluginAsync } from 'fastify';
import * as projectController from './project.controller.js';
import { CreateProjectSchema, ProjectParamsSchema, ApplyProjectSchema, ApplicantActionSchema } from './project.schema.js';

const projectRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', fastify.authenticate);

    fastify.post('/', { schema: CreateProjectSchema }, projectController.createProjectHandler);
    fastify.get('/', projectController.listProjectsHandler);
    fastify.get('/:id', { schema: ProjectParamsSchema }, projectController.getProjectHandler);
    fastify.post('/:id/apply', { schema: ApplyProjectSchema }, projectController.applyProjectHandler);
    fastify.post('/:id/accept', { schema: ApplicantActionSchema }, projectController.acceptApplicantHandler);
    fastify.post('/:id/reject', { schema: ApplicantActionSchema }, projectController.rejectApplicantHandler);
    fastify.delete('/:id', { schema: ProjectParamsSchema }, projectController.deleteProjectHandler);
};

export default projectRoutes;
