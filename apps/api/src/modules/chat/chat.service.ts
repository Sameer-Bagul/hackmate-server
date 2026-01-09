import { MessageModel } from '@hackmate/db';

export const getDirectMessages = async (currentUserId: string, otherUserId: string) => {
    return MessageModel.find({
        $or: [
            { senderId: currentUserId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUserId },
        ],
    }).sort({ createdAt: 1 }).limit(50);
};

export const getGroupMessages = async (groupId: string) => {
    return MessageModel.find({
        groupId: groupId
    })
        .populate('senderId', 'username')
        .sort({ createdAt: 1 })
        .limit(50);
};
