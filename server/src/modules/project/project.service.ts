import { ProjectModel } from '../../models/index.js';
import { Types } from 'mongoose';

export const createProject = async (title: string, description: string, ownerId: string, skills?: string[]) => {
    return ProjectModel.create({
        title,
        description,
        ownerId,
        skills
    });
};

export const listOpenProjects = async () => {
    return ProjectModel.find({ status: 'open' })
        .populate('ownerId', 'username email')
        .sort({ createdAt: -1 })
        .limit(50);
};

export const findProjectById = async (id: string) => {
    return ProjectModel.findById(id)
        .populate('ownerId', 'username email')
        .populate('applicants.userId', 'username email');
};

export const getProjectForAction = async (id: string) => {
    return ProjectModel.findById(id);
};

export const applyToProject = async (project: any, userId: string, message?: string) => {
    project.applicants.push({
        userId: new Types.ObjectId(userId),
        status: 'pending',
        message,
        createdAt: new Date()
    });
    await project.save();
};

export const acceptApplicant = async (project: any, applicantId: string) => {
    const applicant = project.applicants.find((a: any) => a.userId.toString() === applicantId);
    if (!applicant) return false;

    applicant.status = 'accepted';
    await project.save();
    return true;
};

export const rejectApplicant = async (project: any, applicantId: string) => {
    const applicant = project.applicants.find((a: any) => a.userId.toString() === applicantId);
    if (!applicant) return false;

    applicant.status = 'rejected';
    await project.save();
    return true;
};

export const deleteProject = async (project: any) => {
    await project.deleteOne();
};
