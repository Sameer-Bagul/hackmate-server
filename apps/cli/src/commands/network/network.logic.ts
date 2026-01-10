import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';
import { useAuth } from '../../context/index.js';

interface UseNetworkLogicProps {
    action?: 'list' | 'requests' | 'add' | 'accept' | 'block';
    target?: string;
}

export const useNetworkLogic = ({ action = 'list', target }: UseNetworkLogicProps) => {
    const { exit } = useApp();
    const { isAuthenticated } = useAuth();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            if (!isAuthenticated) return;

            try {
                if (action === 'list') {
                    const res = await api.get('/network/friends');
                    setData(res.data);
                } else if (action === 'requests') {
                    const res = await api.get('/network/requests');
                    setData(res.data);
                } else if (action === 'add' && target) {
                    const userRes = await api.get(`/profile/${target}`);
                    const targetId = userRes.data.user.id;
                    await api.post('/network/request', { targetUserId: targetId });
                    setData({ message: `Friend request sent to ${target}` });
                } else if (action === 'accept' && target) {
                    const reqRes = await api.get('/network/requests');
                    const request = reqRes.data.find((r: any) => r.senderId.username === target);

                    if (!request) throw new Error(`No pending request from ${target}`);

                    await api.post('/network/accept', { requestId: request._id });
                    setData({ message: `Accepted request from ${target}` });
                } else if (action === 'block' && target) {
                    const userRes = await api.get(`/profile/${target}`);
                    const targetId = userRes.data.user.id;
                    await api.post('/network/block', { targetUserId: targetId });
                    setData({ message: `Blocked ${target}` });
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Operation failed');
            } finally {
                setLoading(false);
            }
        };

        if (action !== 'add' && action !== 'accept' && action !== 'block') {
            run();
        } else if (target) {
            run();
        } else {
            setLoading(false);
        }
    }, [action, target, isAuthenticated]);

    return {
        action,
        data,
        error,
        loading
    };
};
