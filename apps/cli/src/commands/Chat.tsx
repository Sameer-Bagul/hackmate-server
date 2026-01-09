import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { io, Socket } from 'socket.io-client';
import { getToken, getUser } from '../config.js'; // user config
import api from '../api.js';

interface Message {
    _id?: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
}

interface ChatProps {
    targetUsername?: string; // Optional: start chat with this user
}

export const Chat: React.FC<ChatProps> = ({ targetUsername }) => {
    const { exit } = useApp();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [status, setStatus] = useState('Connecting...');
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async (userId: string) => {
        try {
            const { data } = await api.get(`/chat/history/${userId}`);
            setMessages(data);
        } catch (e) {
            // Ignore history fetch errors for now
        }
    };

    // Load config and connect socket
    useEffect(() => {
        const init = async () => {
            const token = getToken();
            const user = getUser() as any; // Cast to expected type

            if (!token || !user) {
                setError('Not logged in. Run `hackmate auth login` first.');
                return;
            }

            setCurrentUser(user);

            // If targetUsername provided, fetch their ID
            if (targetUsername) {
                try {
                    setStatus(`Looking for ${targetUsername}...`);
                    const { data } = await api.get(`/profile/${targetUsername}`);
                    setTargetUserId(data.user.id);
                    setStatus(`Chatting with ${targetUsername}`);

                    // Fetch history
                    fetchHistory(data.user.id);

                } catch (e: any) {
                    setError(`User ${targetUsername} not found.`);
                    return;
                }
            }

            // Connect Socket
            const newSocket = io('http://localhost:3001', {
                auth: { token: `Bearer ${token}` },
            });

            newSocket.on('connect', () => {
                setStatus(`Connected as ${user.username}`);
            });

            newSocket.on('connect_error', (err) => {
                setError(`Socket Error: ${err.message}`);
            });

            newSocket.on('dm:receive', (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
            });

            setSocket(newSocket);
        };

        const token = getToken();
        if (token) {
            init();
        } else {
            setError('Not logged in.');
        }

        return () => {
            socket?.disconnect();
        };
    }, []);

    // Handle Input
    useInput((_input, key) => {
        if (key.escape) {
            exit();
        }
    });

    const handleSubmit = () => {
        if (!input.trim() || !socket || !targetUserId) return;

        const msg = {
            senderId: currentUser.id,
            receiverId: targetUserId,
            content: input,
            createdAt: new Date().toISOString(),
        };

        // Optimistic update
        setMessages((prev) => [...prev, msg]);

        // Send
        socket.emit('dm:send', { to: targetUserId, content: input });
        setInput('');
    };

    if (error) {
        return <Text color="red">{error}</Text>;
    }

    return (
        <Box flexDirection="column" height={20} borderStyle="round" borderColor="green">
            <Box borderStyle="single" borderColor="gray">
                <Text>{status}</Text>
            </Box>

            {/* Messages Area */}
            <Box flexDirection="column" flexGrow={1} padding={1}>
                {messages.map((m, i) => (
                    <Box key={i} flexDirection="row">
                        <Text color={m.senderId === currentUser?.id ? 'blue' : 'green'}>
                            {m.senderId === currentUser?.id ? 'You' : 'Them'}:
                        </Text>
                        <Text> {m.content}</Text>
                    </Box>
                ))}
            </Box>

            {/* Input Area */}
            <Box borderStyle="single" borderColor="gray">
                <Text color="green">❯ </Text>
                <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
            </Box>
        </Box>
    );
};
