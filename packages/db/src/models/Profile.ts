import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
    userId: mongoose.Types.ObjectId;
    bio?: string;
    intent: 'startup' | 'collab' | 'friends' | 'mentorship';
    stack: string[];
    location?: string;
    github?: string;
    website?: string;
}

const ProfileSchema = new Schema<IProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        bio: { type: String },
        intent: {
            type: String,
            enum: ['startup', 'collab', 'friends', 'mentorship'],
            default: 'collab',
        },
        stack: [{ type: String }],
        location: { type: String },
        github: { type: String },
        website: { type: String },
    },
    { timestamps: true }
);

export const ProfileModel = mongoose.model<IProfile>('Profile', ProfileSchema);
