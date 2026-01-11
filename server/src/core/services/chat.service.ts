import { MessageModel } from '../../infrastructure/database/models/index.js';
import { Types } from 'mongoose';

export const getDirectMessages = async (currentUserId: string, otherUserId: string) => {
    return MessageModel.find({
        $or: [
            { senderId: currentUserId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUserId },
        ],
    }).sort({ createdAt: 1 })
        .limit(50)
        .populate('senderId', 'username');
};

export const getGroupMessages = async (groupId: string) => {
    return MessageModel.find({
        groupId: groupId
    })
        .populate('senderId', 'username')
        .sort({ createdAt: 1 })
        .limit(50);
};

export const getConversations = async (userId: string) => {
    return MessageModel.aggregate([
        {
            $match: {
                $or: [{ senderId: new Types.ObjectId(userId) }, { receiverId: new Types.ObjectId(userId) }],
                groupId: { $exists: false }
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ['$senderId', new Types.ObjectId(userId)] },
                        '$receiverId',
                        '$senderId'
                    ]
                },
                lastMessage: { $first: '$$ROOT' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                user: {
                    id: '$user._id',
                    username: '$user.username'
                },
                lastMessage: {
                    content: '$lastMessage.content',
                    createdAt: '$lastMessage.createdAt'
                }
            }
        },
        {
            $sort: { 'lastMessage.createdAt': -1 }
        }
    ]);
};
