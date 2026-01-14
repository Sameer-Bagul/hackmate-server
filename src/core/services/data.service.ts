import { UserModel, ProfileModel, MessageModel, ProjectModel, GroupModel, FriendRequestModel } from '../../infrastructure/database/models/index.js';

export const exportUserData = async (userId: string) => {
    // Get user data
    const user = await UserModel.findById(userId).select('-password');
    
    if (!user) {
        throw new Error('User not found');
    }
    
    // Get profile
    const profile = await ProfileModel.findOne({ userId });
    
    // Get messages - handle potential errors
    let messages: any[] = [];
    try {
        messages = await MessageModel.find({ senderId: userId })
            .populate('receiverId', 'username email')
            .populate('groupId', 'name');
    } catch (err) {
        console.error('Error fetching messages:', err);
    }
    
    // Get connections (friends)
    const userWithFriends = await UserModel.findById(userId)
        .populate('friends', 'username email')
        .select('friends');
    
    // Get projects
    let projects: any[] = [];
    try {
        projects = await ProjectModel.find({ ownerId: userId });
    } catch (err) {
        console.error('Error fetching projects:', err);
    }
    
    // Get groups
    let groups: any[] = [];
    try {
        groups = await GroupModel.find({ 'members.userId': userId });
    } catch (err) {
        console.error('Error fetching groups:', err);
    }
    
    // Get friend requests
    let friendRequests: any[] = [];
    try {
        friendRequests = await FriendRequestModel.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).populate('senderId receiverId', 'username email');
    } catch (err) {
        console.error('Error fetching friend requests:', err);
    }
    
    return {
        user: user.toObject(),
        profile: profile?.toObject() || null,
        messages: messages.map(m => m.toObject()),
        connections: userWithFriends?.friends || [],
        projects: projects.map(p => p.toObject()),
        groups: groups.map(g => g.toObject()),
        friendRequests: friendRequests.map(fr => fr.toObject()),
        exportDate: new Date().toISOString(),
        format: 'JSON',
        version: '1.0'
    };
};
