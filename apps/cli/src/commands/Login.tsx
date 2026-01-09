import React, { useState } from 'react';
import { Text, Box, useApp } from 'ink';
import TextInput from 'ink-text-input';
import api from '../api.js';
import { saveToken, saveUser } from '../config.js';

export const Login = () => {
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

    if (loading) {
        return <Text>Authenticating...</Text>;
    }

    return (
        <Box flexDirection="column" padding={1}>
            <Text color="green" bold> HackMate Login </Text>

            {error && <Text color="red">{error}</Text>}

            <Box>
                <Text>Username: </Text>
                {step === 'username' ? (
                    <TextInput
                        value={username}
                        onChange={setUsername}
                        onSubmit={() => setStep('password')}
                    />
                ) : (
                    <Text>{username}</Text>
                )}
            </Box>

            {step === 'password' && (
                <Box>
                    <Text>Password: </Text>
                    <TextInput
                        value={password}
                        onChange={setPassword}
                        onSubmit={handleSubmit}
                        mask="*"
                    />
                </Box>
            )}
        </Box>
    );
};
