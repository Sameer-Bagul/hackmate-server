import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    skills: string[];
    ownerId: mongoose.Types.ObjectId;
    status: 'open' | 'closed';
    applicants: {
        userId: mongoose.Types.ObjectId;
        status: 'pending' | 'accepted' | 'rejected';
        message?: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        skills: [{ type: String }],
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['open', 'closed'], default: 'open' },
        applicants: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
                message: { type: String },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

ProjectSchema.index({ ownerId: 1 });
ProjectSchema.index({ status: 1 });

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
