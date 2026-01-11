import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendRequest extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
    },
    { timestamps: true }
);

// Ensure unique request between two users (handled in logic or compound index)
FriendRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export const FriendRequestModel = mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
