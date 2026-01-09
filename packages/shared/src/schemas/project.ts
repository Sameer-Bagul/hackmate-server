import { z } from 'zod';

export const CreateProjectSchema = {
    body: z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        skills: z.array(z.string()).optional()
    })
};

export const ProjectParamsSchema = {
    params: z.object({ id: z.string() })
};

export const ApplyProjectSchema = {
    params: z.object({ id: z.string() }),
    body: z.object({ message: z.string().optional() })
};

export const ApplicantActionSchema = {
    params: z.object({ id: z.string() }),
    body: z.object({ applicantId: z.string() })
};

export type CreateProjectBody = z.infer<typeof CreateProjectSchema.body>;
export type ProjectParams = z.infer<typeof ProjectParamsSchema.params>;
export type ApplyProjectBody = z.infer<typeof ApplyProjectSchema.body>;
export type ApplicantActionBody = z.infer<typeof ApplicantActionSchema.body>;
