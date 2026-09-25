import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash?: string;
    githubId?: string;
    githubAccessToken?: string;
    avatarUrl?: string;
    profileId?: mongoose.Types.ObjectId;
    role: 'admin' | 'user';
    friends: mongoose.Types.ObjectId[];
    blocked: mongoose.Types.ObjectId[];
    presence?: 'online' | 'away' | 'busy' | 'offline';
    lastSeen?: Date;
    createdAt: Date;
    updatedAt: Date;
    otpCode?: string;
    otpExpires?: Date;
    isVerified?: boolean;
    resetPasswordOtp?: string;
    resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String },
        githubId: { type: String, sparse: true, unique: true },
        githubAccessToken: { type: String },
        avatarUrl: { type: String },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        presence: { type: String, enum: ['online', 'away', 'busy', 'offline'], default: 'offline' },
        lastSeen: { type: Date, default: Date.now },
        otpCode: { type: String },
        otpExpires: { type: Date },
        isVerified: { type: Boolean, default: false },
        resetPasswordOtp: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
