import { useState } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';
import { useAuth } from '../../context/index.js';

export const useVerifyLogic = () => {
    const { exit } = useApp();
    const { user } = useAuth();
    const [step, setStep] = useState<'request' | 'input' | 'success'>('request');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendOtp = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/otp/send');
            setStep('input');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/otp/verify', { code: otp });
            setStep('success');
            setTimeout(() => exit(), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        otp,
        setOtp,
        loading,
        error,
        handleSendOtp,
        handleVerifyOtp,
        email: user?.username || 'user' // purely for display
    };
};
