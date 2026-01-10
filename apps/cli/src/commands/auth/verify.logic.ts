import { useState } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';
import { useAuth } from '../../context/index.js';

export const useVerifyLogic = () => {
    const { exit } = useApp();
    const { user } = useAuth();
    const [step, setStep] = useState<'request' | 'enter_code' | 'success'>('request');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSendOtp = async () => {
        setLoading(true);
        setError(null);
        setMessage('Sending code...');
        try {
            // Try sending an empty object to ensure JSON content-type
            await api.post('/auth/otp/send', {});
            setStep('enter_code');
            setMessage(null);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
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
