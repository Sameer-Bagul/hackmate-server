import React from 'react';
import { Text, Box } from 'ink';
import TextInput from 'ink-text-input';

interface LoginScreenProps {
    username: string;
    setUsername: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    step: 'username' | 'password';
    setStep: (v: 'username' | 'password') => void;
    error: string | null;
    loading: boolean;
    handleSubmit: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
    username, setUsername,
    password, setPassword,
    step, setStep,
    error, loading,
    handleSubmit
}) => {
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
