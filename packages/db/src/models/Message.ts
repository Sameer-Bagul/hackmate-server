import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId?: mongoose.Types.ObjectId;
    groupId?: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
        groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

// Indexes for fast retrieval of chat history between two users
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });
MessageSchema.index({ groupId: 1, createdAt: -1 });

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
