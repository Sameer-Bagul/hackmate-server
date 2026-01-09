import React from 'react';
import { Text, Box } from 'ink';
import TextInput from 'ink-text-input';

interface SignupScreenProps {
    username: string;
    setUsername: (v: string) => void;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    step: 'username' | 'email' | 'password';
    setStep: (v: 'username' | 'email' | 'password') => void;
    error: string | null;
    loading: boolean;
    handleSubmit: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
    username, setUsername,
    email, setEmail,
    password, setPassword,
    step, setStep,
    error, loading,
    handleSubmit
}) => {
    if (loading) {
        return <Text>Creating account...</Text>;
    }

    return (
        <Box flexDirection="column" padding={1}>
            <Text color="green" bold> HackMate Signup </Text>

            {error && <Text color="red">{error}</Text>}

            <Box>
                <Text>Username: </Text>
                {step === 'username' ? (
                    <TextInput
                        value={username}
                        onChange={setUsername}
                        onSubmit={() => setStep('email')}
                    />
                ) : (
                    <Text>{username}</Text>
                )}
            </Box>

            {(step === 'email' || step === 'password') && (
                <Box>
                    <Text>Email: </Text>
                    {step === 'email' ? (
                        <TextInput
                            value={email}
                            onChange={setEmail}
                            onSubmit={() => setStep('password')}
                        />
                    ) : (
                        <Text>{email}</Text>
                    )}
                </Box>
            )}

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
