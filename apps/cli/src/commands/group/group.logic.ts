import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';

interface UseGroupLogicProps {
    action?: 'list' | 'create' | 'view' | 'join' | 'accept';
    id?: string;
    extraArg?: string;
}

export const useGroupLogic = ({ action = 'list', id, extraArg }: UseGroupLogicProps) => {
    const { exit } = useApp();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [createStep, setCreateStep] = useState(0);
    const [formData, setFormData] = useState({ name: '', description: '', isPrivate: false });

    useEffect(() => {
        const run = async () => {
            try {
                if (action === 'list') {
                    const res = await api.get('/groups');
                    setData(res.data);
                    setLoading(false);
                } else if (action === 'view' && id) {
                    const res = await api.get(`/groups/${id}`);
                    setData(res.data);
                    setLoading(false);
                } else if (action === 'join' && id) {
                    await api.post(`/groups/${id}/join`);
                    setData({ message: 'Request sent/Joined' });
                    setLoading(false);
                } else if (action === 'accept' && id && extraArg) {
                    await api.post(`/groups/${id}/accept`, { userId: extraArg });
                    setData({ message: 'User accepted' });
                    setLoading(false);
                }
                if (action === 'create') setLoading(false);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Error');
                setLoading(false);
            }
        };
        run();
    }, [action, id, extraArg]);

    const handleCreateSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/groups', formData);
            setData({ message: 'Group created!' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create');
        } finally {
            setLoading(false);
        }
    };

    return {
        action,
        data,
        error,
        loading,
        createStep,
        setCreateStep,
        formData,
        setFormData,
        handleCreateSubmit
    };
};
