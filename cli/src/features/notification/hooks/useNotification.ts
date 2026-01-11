import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import api from '../../../api.js';

interface UseNotificationLogicProps {
    action?: 'list';
}

export const useNotificationLogic = ({ action = 'list' }: UseNotificationLogicProps) => {
    const { exit } = useApp();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            try {
                if (action === 'list') {
                    const res = await api.get('/notifications');
                    setData(res.data);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Error');
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [action]);

    return {
        action,
        data,
        error,
        loading
    };
};
