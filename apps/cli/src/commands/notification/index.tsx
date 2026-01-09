import React from 'react';
import { useNotificationLogic } from './notification.logic.js';
import { NotificationScreen } from './notification.screen.js';

interface NotificationProps {
    action?: 'list';
}

export const Notification: React.FC<NotificationProps> = (props) => {
    const logic = useNotificationLogic(props);
    return <NotificationScreen {...logic} />;
};
