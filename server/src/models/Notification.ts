import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'friend_request' | 'project_apply' | 'group_join' | 'system';
    content: string;
    read: boolean;
    relatedId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['friend_request', 'project_apply', 'group_join', 'system'], required: true },
        content: { type: String, required: true },
        read: { type: Boolean, default: false },
        relatedId: { type: Schema.Types.ObjectId },
    },
    { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);
