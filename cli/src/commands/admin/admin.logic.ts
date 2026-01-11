import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';

interface UseAdminLogicProps {
    action: 'list' | 'view' | 'delete';
    id?: string;
}

export const useAdminLogic = ({ action, id }: UseAdminLogicProps) => {
    const { exit } = useApp();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const runAction = async () => {
            try {
                if (action === 'list') {
                    const res = await api.get('/admin/users');
                    setData(res.data);
                } else if (action === 'view' && id) {
                    const res = await api.get(`/admin/users/${id}`);
                    setData(res.data);
                } else if (action === 'delete' && id) {
                    await api.delete(`/admin/users/${id}`);
                    setData({ message: `User ${id} deleted successfully.` });
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Operation failed');
            } finally {
                setLoading(false);
            }
        };

        runAction();
    }, [action, id]);

    return {
        action,
        data,
        error,
        loading
    };
};
