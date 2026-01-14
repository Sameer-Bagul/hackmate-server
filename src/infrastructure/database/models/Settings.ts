import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISettings extends Document {
    userId: Types.ObjectId;
    privacy: {
        profileVisibility: 'public' | 'connections' | 'private';
        messageSettings: 'anyone' | 'connections' | 'none';
        showOnlineStatus: boolean;
        allowTagging: boolean;
    };
    preferences: {
        notifications: {
            email: boolean;
            push: boolean;
            inApp: boolean;
        };
        language: string;
        timezone: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const SettingsSchema: Schema<ISettings> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    privacy: {
        profileVisibility: { 
            type: String, 
            enum: ['public', 'connections', 'private'], 
            default: 'public' 
        },
        messageSettings: { 
            type: String, 
            enum: ['anyone', 'connections', 'none'], 
            default: 'connections' 
        },
        showOnlineStatus: { type: Boolean, default: true },
        allowTagging: { type: Boolean, default: true }
    },
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            inApp: { type: Boolean, default: true }
        },
        language: { type: String, default: 'en' },
        timezone: { type: String, default: 'UTC' }
    }
}, { timestamps: true });

export const SettingsModel = mongoose.model<ISettings>('Settings', SettingsSchema);
