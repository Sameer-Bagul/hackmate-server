import { MessageModel } from '@hackmate/db';
import { Types } from 'mongoose';

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

export const getConversations = async (userId: string) => {
    // Aggregation to find recent conversations (distinct by other user)
    // We want to find distinct 'other' users in messages where I am sender or receiver.
    // And get the last message for each.

    // This is a bit complex in Mongo. Simplified approach:
    // 1. Match my messages
    // 2. Sort users by date desc
    // 3. Group by 'other user'

    // Using a more manual aggregation pipeline
    return MessageModel.aggregate([
        {
            $match: {
                $or: [{ senderId: new Types.ObjectId(userId) }, { receiverId: new Types.ObjectId(userId) }],
                // Filter out group messages for now, or just focus on DMs
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
                from: 'users', // Collection name usually plural lower
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
