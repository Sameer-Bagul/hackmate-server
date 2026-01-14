import { SettingsModel } from '../../infrastructure/database/models/index.js';

export const getSettings = async (userId: string) => {
    let settings = await SettingsModel.findOne({ userId });
    
    // Create default settings if not exists
    if (!settings) {
        settings = await SettingsModel.create({ userId });
    }
    
    return settings;
};

export const updatePrivacySettings = async (userId: string, privacyData: any) => {
    // Validate privacy data
    const validVisibility = ['public', 'connections', 'private'];
    const validMessageSettings = ['anyone', 'connections', 'none'];
    
    if (privacyData.profileVisibility && !validVisibility.includes(privacyData.profileVisibility)) {
        throw new Error('Invalid profileVisibility value');
    }
    
    if (privacyData.messageSettings && !validMessageSettings.includes(privacyData.messageSettings)) {
        throw new Error('Invalid messageSettings value');
    }
    
    const settings = await SettingsModel.findOneAndUpdate(
        { userId },
        { $set: { privacy: privacyData } },
        { new: true, upsert: true, runValidators: true }
    );
    
    return settings;
};

export const updatePreferences = async (userId: string, preferencesData: any) => {
    // Validate notifications object if provided
    if (preferencesData.notifications) {
        const { email, push, inApp } = preferencesData.notifications;
        if (email !== undefined && typeof email !== 'boolean') {
            throw new Error('Invalid notification.email value');
        }
        if (push !== undefined && typeof push !== 'boolean') {
            throw new Error('Invalid notification.push value');
        }
        if (inApp !== undefined && typeof inApp !== 'boolean') {
            throw new Error('Invalid notification.inApp value');
        }
    }
    
    const settings = await SettingsModel.findOneAndUpdate(
        { userId },
        { $set: { preferences: preferencesData } },
        { new: true, upsert: true, runValidators: true }
    );
    
    return settings;
};
