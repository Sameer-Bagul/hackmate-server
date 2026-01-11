import React, { useEffect, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import api from '../../../api.js';

interface Conversation {
    user: {
        id: string;
        username: string;
    };
    lastMessage: {
        content: string;
        createdAt: string;
    };
}

import { useChatLogic } from '../hooks/useChat.js';
import { ChatScreen } from './chat.screen.js';

export const ChatList = () => {
    const { exit } = useApp();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeChatUser, setActiveChatUser] = useState<string | null>(null);

    useEffect(() => {
        // Only load if not chatting
        if (activeChatUser) return;

        api.get('/chat/conversations')
            .then(({ data }) => {
                setConversations(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to load conversations');
                setLoading(false);
            });
    }, [activeChatUser]);

    useInput((input, key) => {
        if (activeChatUser) return; // Disable list nav when chatting

        if (key.escape) {
            exit();
        }
        if (key.upArrow) {
            setSelectedIndex(prev => Math.max(0, prev - 1));
        }
        if (key.downArrow) {
            setSelectedIndex(prev => Math.min(conversations.length - 1, prev + 1));
        }
        if (key.return) {
            const target = conversations[selectedIndex]?.user.username;
            if (target) {
                setActiveChatUser(target);
            }
        }
    });

    if (activeChatUser) {
        return <ActiveChat username={activeChatUser} onBack={() => setActiveChatUser(null)} />;
    }

    if (loading) return <Text>Loading conversations...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;
    if (conversations.length === 0) {
        return (
            <Box flexDirection="column" padding={1}>
                <Text>No conversations found.</Text>
                <Text color="gray">Start a chat with: <Text color="cyan">hackmate chat dm &lt;username&gt;</Text></Text>
                <Box marginTop={1}>
                    <Text color="yellow">Press ESC to exit</Text>
                </Box>
            </Box>
        );
    }

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
            <Box marginBottom={1}>
                <Text bold>Direct Messages</Text>
            </Box>
            {conversations.map((conv, i) => (
                <Box key={conv.user.id} flexDirection="column" marginBottom={1}>
                    <Text color={i === selectedIndex ? 'green' : 'white'}>
                        {i === selectedIndex ? '> ' : '  '}
                        @{conv.user.username} <Text color="gray">({new Date(conv.lastMessage.createdAt).toLocaleDateString()})</Text>
                    </Text>
                    <Text color="gray" dimColor>
                        {conv.lastMessage.content.substring(0, 50)}...
                    </Text>
                </Box>
            ))}
            <Box marginTop={1}>
                <Text color="cyan">Press Enter to chat, ESC to exit</Text>
            </Box>
        </Box>
    );
};

const ActiveChat = ({ username, onBack }: { username: string, onBack: () => void }) => {
    const logic = useChatLogic({ targetUsername: username, onExit: onBack });
    return <ChatScreen {...logic} />;
};
