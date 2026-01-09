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
    const [step, setStep] = useState<'username' | 'email' | 'password'>('username');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/signup', { username, email, password });
            saveToken(data.token);
            saveUser(data.user);
            console.log('✅ Signup successful! Welcome to HackMate.');
            exit();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed');
            setLoading(false);
            setStep('username');
            setUsername('');
            setEmail('');
            setPassword('');
        }
    };

    return {
        username, setUsername,
        email, setEmail,
        password, setPassword,
        step, setStep,
        error, loading,
        handleSubmit
    };
};
