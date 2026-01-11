import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthRequest } from '../../shared/types/index.js';
import * as projectService from '../../core/services/project.service.js';
import { CreateProjectBody, ProjectParams, ApplyProjectBody, ApplicantActionBody } from '../../shared/validators/index.js';

export const createProjectHandler = async (request: FastifyRequest<{ Body: CreateProjectBody }>, reply: FastifyReply) => {
    const { title, description, skills } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const project = await projectService.createProject(title, description, currentUserId, skills);
    return project;
};

export const listProjectsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    return projectService.listOpenProjects();
};

export const getProjectHandler = async (request: FastifyRequest<{ Params: ProjectParams }>, reply: FastifyReply) => {
    const { id } = request.params;
    const project = await projectService.findProjectById(id);

    if (!project) return reply.notFound('Project not found');
    return project;
};

export const applyProjectHandler = async (
    request: FastifyRequest<{ Params: ProjectParams; Body: ApplyProjectBody }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { message } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const project = await projectService.getProjectForAction(id);
    if (!project) return reply.notFound('Project not found');

    if (project.ownerId.toString() === currentUserId) {
        return reply.badRequest('Cannot apply to your own project');
    }

    const existing = project.applicants.find((a: any) => a.userId.toString() === currentUserId);
    if (existing) return reply.badRequest('Already applied');

    await projectService.applyToProject(project, currentUserId, message);
    return { message: 'Application sent' };
};

export const acceptApplicantHandler = async (
    request: FastifyRequest<{ Params: ProjectParams; Body: ApplicantActionBody }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { applicantId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const project = await projectService.getProjectForAction(id);
    if (!project) return reply.notFound('Project not found');

    if (project.ownerId.toString() !== currentUserId) {
        return reply.forbidden('Not your project');
    }

    const success = await projectService.acceptApplicant(project, applicantId);
    if (!success) return reply.notFound('Applicant not found');

    return { message: 'Applicant accepted' };
};

export const rejectApplicantHandler = async (
    request: FastifyRequest<{ Params: ProjectParams; Body: ApplicantActionBody }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    const { applicantId } = request.body;
    const currentUserId = (request as AuthRequest).user.id;

    const project = await projectService.getProjectForAction(id);
    if (!project) return reply.notFound('Project not found');

    if (project.ownerId.toString() !== currentUserId) {
        return reply.forbidden('Not your project');
    }

    const success = await projectService.rejectApplicant(project, applicantId);
    if (!success) return reply.notFound('Applicant not found');

    return { message: 'Applicant rejected' };
};

export const deleteProjectHandler = async (request: FastifyRequest<{ Params: ProjectParams }>, reply: FastifyReply) => {
    const { id } = request.params;
    const currentUserId = (request as AuthRequest).user.id;

    const project = await projectService.getProjectForAction(id);
    if (!project) return reply.notFound('Project not found');

    if (project.ownerId.toString() !== currentUserId) {
        return reply.forbidden('Not your project');
    }

    await projectService.deleteProject(project);
    return { message: 'Project deleted' };
};
