import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';
import { useSocket, useAuth } from '../../context/index.js';

interface UseChatLogicProps {
    targetUsername?: string;
    groupName?: string;
    onExit?: () => void;
}

export const useChatLogic = ({ targetUsername, groupName, onExit }: UseChatLogicProps) => {
    const { exit: appExit } = useApp();
    const exit = onExit || appExit;
    const { socket, isConnected } = useSocket();
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('Connecting...');
    const [targetId, setTargetId] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);

    // Helper to format messages for UI (handling "me" vs others)
    const formatMessage = (msg: any) => {
        const senderIdObj = msg.senderId;
        const senderId = typeof senderIdObj === 'object' ? senderIdObj._id : senderIdObj;
        const username = typeof senderIdObj === 'object' ? senderIdObj.username : undefined;

        return {
            ...msg,
            senderId: senderId === user?.id ? 'me' : senderId,
            username: username
        };
    };

    useEffect(() => {
        const init = async () => {
            try {
                // Resolve Target
                if (targetUsername) {
                    setStatus(`Looking for @${targetUsername}...`);
                    const { data } = await api.get(`/profile/${targetUsername}`);
                    setTargetId(data.user.id);
                    setStatus(`talking to @${targetUsername}`);

                    const hist = await api.get(`/chat/history/${data.user.id}`);
                    setMessages(hist.data.map(formatMessage));
                } else if (groupName) {
                    setStatus(`Looking for group ${groupName}...`);
                    const { data: groups } = await api.get('/groups');
                    const group = groups.find((g: any) => g.name === groupName);
                    if (!group) {
                        setStatus(`Group ${groupName} not found`);
                        return;
                    }
                    setGroupId(group._id);
                    setStatus(`talking in #${groupName}`);

                    const hist = await api.get(`/chat/history/group/${group._id}`);
                    setMessages(hist.data.map(formatMessage));
                }

                if (!isConnected || !socket) {
                    if (targetUsername) {
                        setStatus(`talking to @${targetUsername} (Socket Disconnected...)`);
                    } else if (groupName) {
                        setStatus(`talking in #${groupName} (Socket Disconnected...)`);
                    } else {
                        setStatus('Socket disconnected...');
                    }
                    return;
                }

                if (groupId) {
                    socket.emit('join:group', groupId);
                }

                if (!targetUsername && !groupName) {
                    setStatus('Connected (Lobby)');
                } else if (targetUsername) {
                    setStatus(`talking to @${targetUsername} (Connected)`);
                } else if (groupName) {
                    setStatus(`talking in #${groupName} (Connected)`);
                }

            } catch (e: any) {
                setStatus(`Error: ${e.message}`);
            }
        };
        if (user) init();
    }, [targetUsername, groupName, groupId, isConnected, socket, user?.id]);

    useEffect(() => {
        if (!socket) return;

        const onDmReceive = (msg: any) => {
            const incomingSenderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
            // If I am chatting with targetId, and incoming message is FROM targetId
            if (targetId && incomingSenderId === targetId) {
                setMessages(prev => [...prev, formatMessage(msg)]);
            }
        };

        const onGroupReceive = (msg: any) => {
            if (groupId && msg.groupId === groupId) {
                // Check if it's not from me (optimistic update handles "me")
                const incomingSenderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
                if (incomingSenderId !== user?.id) {
                    setMessages(prev => [...prev, formatMessage(msg)]);
                }
            }
        };

        socket.on('dm:receive', onDmReceive);
        socket.on('group:receive', onGroupReceive);

        // Re-join group on reconnect
        socket.on('connect', () => {
            if (groupId) socket.emit('join:group', groupId);
        });

        return () => {
            socket.off('dm:receive', onDmReceive);
            socket.off('group:receive', onGroupReceive);
            socket.off('connect');
        };
    }, [socket, targetId, groupId, user?.id]);

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!socket) return;

        if (targetId) {
            socket.emit('message', { to: targetId, content: input });
            setMessages(prev => [...prev, { content: input, senderId: 'me', createdAt: new Date() }]);
        } else if (groupId) {
            socket.emit('message', { groupId: groupId, content: input });
            setMessages(prev => [...prev, { content: input, senderId: 'me', createdAt: new Date() }]);
        }

        setInput('');
    };

    return {
        messages,
        input,
        setInput,
        status,
        handleSend,
        exit
    };
};
