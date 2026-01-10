import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';
import { useSocket } from '../../context/index.js';

interface UseChatLogicProps {
    targetUsername?: string;
    groupName?: string;
}

export const useChatLogic = ({ targetUsername, groupName }: UseChatLogicProps) => {
    const { exit } = useApp();
    const { socket } = useSocket();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('Connecting...');
    const [targetId, setTargetId] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);

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
                    setMessages(hist.data);
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
                    setMessages(hist.data);
                }

                if (!socket) {
                    setStatus('Socket disconnected...');
                    return;
                }

                if (groupId && socket.connected) {
                    socket.emit('join:group', groupId);
                }

            } catch (e: any) {
                setStatus(`Error: ${e.message}`);
            }
        };
        init();
    }, [targetUsername, groupName, groupId, socket?.connected]);

    useEffect(() => {
        if (!socket) return;

        const onDmReceive = (msg: any) => {
            if (targetId && msg.senderId === targetId) {
                setMessages(prev => [...prev, msg]);
            }
        };

        const onGroupReceive = (msg: any) => {
            if (groupId && msg.groupId === groupId) {
                setMessages(prev => [...prev, msg]);
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
    }, [socket, targetId, groupId]);

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
