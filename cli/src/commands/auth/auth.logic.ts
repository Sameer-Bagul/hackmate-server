import { useState } from 'react';
import { useApp } from 'ink';
import api from '../../api.js';
import { saveToken, saveUser } from '../../config.js';

export const useLoginLogic = () => {
    const { exit } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState<'username' | 'password'>('username');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', { username, password });
            saveToken(data.token);
            saveUser(data.user);
            console.log('✅ Login successful!');
            exit();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
            setStep('username');
            setUsername('');
            setPassword('');
        }
    };

    return {
        username, setUsername,
        password, setPassword,
        step, setStep,
        error, loading,
        handleSubmit
    };
};

export const useSignupLogic = () => {
    const { exit } = useApp();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'username' | 'email' | 'password' | 'otp' | 'profile_setup'>('username');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setStatus('Creating account...');
        try {
            // 1. Signup
            const { data } = await api.post('/auth/signup', { username, email, password });
            saveToken(data.token);
            saveUser(data.user);

            // 2. Send OTP automatically
            setStatus('Account created! Sending verification OTP...');
            // Fix: Send empty body to ensure JSON content-type
            await api.post('/auth/otp/send', {});

            setLoading(false);
            setStep('otp');
            setStatus('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed');
            setLoading(false);
            // Reset if signup failed
            if (step !== 'otp') {
                setStep('username');
                setUsername('');
                setEmail('');
                setPassword('');
            }
        }
    };

    const handleVerifyParams = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/otp/verify', { code: otp });
            console.log('✅ Signup & Verification successful! Setting up profile...');
            // Transition to profile setup instead of exiting
            setStep('profile_setup');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP');
            setLoading(false);
        }
    };

    return {
        username, setUsername,
        email, setEmail,
        password, setPassword,
        otp, setOtp,
        step, setStep,
        error, loading, status,
        handleSubmit,
        handleVerifyParams
    };
};
