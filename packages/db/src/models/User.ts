import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    profileId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
