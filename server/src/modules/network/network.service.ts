import { UserModel, FriendRequestModel, NotificationModel } from '../../models/index.js';
import { Types } from 'mongoose';

export const findUserById = async (id: string) => {
    return UserModel.findById(id);
};

export const findExistingRequest = async (currentUserId: string, targetUserId: string) => {
    return FriendRequestModel.findOne({
        $or: [
            { senderId: currentUserId, receiverId: targetUserId },
            { senderId: targetUserId, receiverId: currentUserId }
        ],
        status: 'pending'
    });
};

export const createFriendRequest = async (currentUserId: string, targetUserId: string) => {
    const newReq = await FriendRequestModel.create({
        senderId: currentUserId,
        receiverId: targetUserId
    });

    await NotificationModel.create({
        userId: new Types.ObjectId(targetUserId),
        type: 'friend_request',
        content: `You have a new friend request!`,
        relatedId: newReq._id
    });

    return newReq;
};

export const listIncomingRequests = async (userId: string) => {
    return FriendRequestModel.find({
        receiverId: userId,
        status: 'pending'
    }).populate('senderId', 'username email');
};

export const findRequestById = async (id: string) => {
    return FriendRequestModel.findById(id);
};

export const acceptFriendRequest = async (req: any) => {
    req.status = 'accepted';
    await req.save();

    await UserModel.findByIdAndUpdate(req.senderId, { $addToSet: { friends: req.receiverId } });
    await UserModel.findByIdAndUpdate(req.receiverId, { $addToSet: { friends: req.senderId } });
};

export const rejectFriendRequest = async (req: any) => {
    req.status = 'rejected';
    await req.save();
};

export const getUserFriends = async (userId: string) => {
    const user = await UserModel.findById(userId).populate('friends', 'username email');
    return user?.friends || [];
};

export const blockUser = async (currentUserId: string, targetUserId: string) => {
    await UserModel.findByIdAndUpdate(currentUserId, {
        $addToSet: { blocked: targetUserId },
        $pull: { friends: targetUserId }
    });

    await UserModel.findByIdAndUpdate(targetUserId, {
        $pull: { friends: currentUserId }
    });
};
