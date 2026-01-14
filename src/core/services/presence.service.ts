import { UserModel } from '../../infrastructure/database/models/index.js';

export interface PresenceStatus {
    status: 'online' | 'away' | 'busy' | 'offline';
    lastSeen?: Date;
}

export const updatePresence = async (userId: string, status: string) => {
    const validStatuses = ['online', 'away', 'busy', 'offline'];
    
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
    }
    
    const user = await UserModel.findByIdAndUpdate(
        userId,
        { 
            $set: { 
                presence: status,
                lastSeen: new Date()
            }
        },
        { new: true }
    ).select('presence lastSeen username');
    
    return user;
};

export const getPresence = async (userId: string) => {
    const user = await UserModel.findById(userId).select('presence lastSeen');
    return user;
};
