import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import * as projectController from '../controllers/project.controller.js';
import { 
    CreateProjectSchema, 
    ProjectParamsSchema, 
    ApplyProjectSchema, 
    ApplicantActionSchema 
} from '../../shared/validators/index.js';

const projectRoutes: FastifyPluginAsync = async (fastify) => {
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    app.addHook('onRequest', fastify.authenticate);

    app.post('/', { schema: CreateProjectSchema }, projectController.createProjectHandler);
    app.get('/', projectController.listProjectsHandler);
    app.get('/:id', { schema: ProjectParamsSchema }, projectController.getProjectHandler);
    app.post('/:id/apply', { schema: ApplyProjectSchema }, projectController.applyProjectHandler);
    app.post('/:id/accept', { schema: ApplicantActionSchema }, projectController.acceptApplicantHandler);
    app.post('/:id/reject', { schema: ApplicantActionSchema }, projectController.rejectApplicantHandler);
    app.delete('/:id', { schema: ProjectParamsSchema }, projectController.deleteProjectHandler);
};

export default projectRoutes;
