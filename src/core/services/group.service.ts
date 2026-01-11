import { GroupModel } from '../../infrastructure/database/models/index.js';

export const createGroup = async (name: string, ownerId: string, description?: string, isPrivate: boolean = false) => {
    return GroupModel.create({
        name,
        description,
        isPrivate,
        ownerId,
        members: [{ userId: ownerId, role: 'admin', joinedAt: new Date() }]
    });
};

export const findGroupByName = async (name: string) => {
    return GroupModel.findOne({ name });
};

export const listGroups = async () => {
    return GroupModel.find()
        .populate('ownerId', 'username')
        .sort({ createdAt: -1 })
        .limit(50);
};

export const getGroupById = async (id: string) => {
    return GroupModel.findById(id)
        .populate('ownerId', 'username email')
        .populate('members.userId', 'username')
        .populate('joinRequests.userId', 'username');
};

export const findGroupById = async (id: string) => {
    return GroupModel.findById(id);
};
