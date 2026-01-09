import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';

interface UseProjectLogicProps {
    action?: 'list' | 'create' | 'view' | 'apply' | 'accept';
    id?: string;
    extraArg?: string;
}

export const useProjectLogic = ({ action = 'list', id, extraArg }: UseProjectLogicProps) => {
    const { exit } = useApp();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state for create
    const [formStep, setFormStep] = useState(0);
    const [formData, setFormData] = useState({ title: '', description: '', skills: '' });

    // Input state for apply message
    const [message, setMessage] = useState('');

    useEffect(() => {
        const run = async () => {
            try {
                if (action === 'list') {
                    const res = await api.get('/project');
                    setData(res.data);
                    setLoading(false);
                } else if (action === 'view' && id) {
                    const res = await api.get(`/project/${id}`);
                    setData(res.data);
                    setLoading(false);
                } else if (action === 'accept' && id && extraArg) {
                    await api.post(`/project/${id}/accept`, { applicantId: extraArg });
                    setData({ message: 'Applicant accepted!' });
                    setLoading(false);
                }
                // create and apply handle their own loading via interactions
                if (action === 'create' || action === 'apply') {
                    setLoading(false);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Operation failed');
                setLoading(false);
            }
        };
        run();
    }, [action, id, extraArg]);

    const handleCreateSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/project', {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim())
            });
            setData({ message: 'Project created successfully!' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    const handleApplySubmit = async () => {
        setLoading(true);
        try {
            await api.post(`/project/${id}/apply`, { message });
            setData({ message: 'Application sent successfully!' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to apply');
        } finally {
            setLoading(false);
        }
    };

    return {
        action,
        data,
        error,
        loading,
        formStep,
        setFormStep,
        formData,
        setFormData,
        message,
        setMessage,
        handleCreateSubmit,
        handleApplySubmit
    };
};
