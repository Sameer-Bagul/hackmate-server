import React from 'react';
import { useChatLogic } from '../hooks/useChat.js';
import { ChatScreen } from './chat.screen.js';

interface ChatProps {
    targetUsername?: string;
    groupName?: string;
}

export const Chat: React.FC<ChatProps> = (props) => {
    const logic = useChatLogic(props);
    return <ChatScreen {...logic} />;
};

export * from './ChatList.js';
