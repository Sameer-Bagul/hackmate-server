import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    description: string;
    ownerId: mongoose.Types.ObjectId;
    isPrivate: boolean;
    members: {
        userId: mongoose.Types.ObjectId;
        role: 'admin' | 'member';
        joinedAt: Date;
    }[];
    joinRequests: {
        userId: mongoose.Types.ObjectId;
        status: 'pending' | 'rejected';
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isPrivate: { type: Boolean, default: false },
        members: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                role: { type: String, enum: ['admin', 'member'], default: 'member' },
                joinedAt: { type: Date, default: Date.now }
            }
        ],
        joinRequests: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                status: { type: String, enum: ['pending', 'rejected'], default: 'pending' },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

GroupSchema.index({ ownerId: 1 });
GroupSchema.index({ 'members.userId': 1 });

export const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);
