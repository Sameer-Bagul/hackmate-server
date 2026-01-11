import { NotificationModel } from '../../infrastructure/database/models/index.js';

export const getUserNotifications = async (userId: string) => {
    return NotificationModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
};

export const markAsRead = async (notificationId: string, userId: string) => {
    const notif = await NotificationModel.findOne({ _id: notificationId, userId });
    if (!notif) {
        throw new Error('Notification not found');
    }

    notif.read = true;
    await notif.save();
    return notif;
};
