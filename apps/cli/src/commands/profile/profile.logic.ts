import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';
import { getUser } from '../../config.js';

export const useProfileViewLogic = (targetUsername?: string) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = getUser();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const endpoint = targetUsername ? `/profile/${targetUsername}` : '/profile';
                const { data } = await api.get(endpoint);
                setProfile(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [targetUsername]);

    return {
        profile,
        loading,
        error,
        user
    };
};

export const useProfileEditLogic = () => {
    const { exit } = useApp();
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState<{
        bio: string;
        intent: string;
        stack: string;
        location: string;
        github: string;
        age?: number;
        gender?: 'male' | 'female' | 'other';
        company?: string;
        interests?: string;
        linkedin?: string;
        twitter?: string;
    }>({
        bio: '',
        intent: 'collab',
        stack: '',
        location: '',
        github: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch existing profile to populate defaults (optional, skipping for speed MVp)
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.put('/profile', {
                ...profile,
                stack: profile.stack.split(',').map((s) => s.trim()),
                interests: profile.interests?.split(',').map((s) => s.trim()),
            });
            console.log('✅ Profile updated!');
            exit();
        } catch (err: any) {
            console.error('❌ Update failed:', err.response?.data?.message || err.message);
            exit();
        }
    };

    return {
        step, setStep,
        profile, setProfile,
        loading,
        handleSubmit
    };
};
