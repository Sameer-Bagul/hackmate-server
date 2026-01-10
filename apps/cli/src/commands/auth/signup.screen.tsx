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
    step: 'username' | 'email' | 'password' | 'otp' | 'profile_setup';
    setStep: (v: 'username' | 'email' | 'password' | 'otp' | 'profile_setup') => void;
    error: string | null;
    loading: boolean;
    handleSubmit: () => void;
    otp: string;
    setOtp: (v: string) => void;
    handleVerifyParams: () => void;
    status: string;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
    username, setUsername,
    email, setEmail,
    password, setPassword,
    step, setStep,
    error, loading,
    handleSubmit,
    otp, setOtp, handleVerifyParams, status
}) => {
    if (loading && !step.includes('otp')) {
        return <Text>{status || 'Loading...'}</Text>;
    }

    if (step === 'otp') {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
                <Text bold>📩 Verifying Email</Text>
                <Text>We sent a code to {email}. Check your console/email!</Text>
                <Text color="red">{error}</Text>
                <Box marginTop={1}>
                    <Text>Enter OTP: </Text>
                    <TextInput
                        value={otp}
                        onChange={setOtp}
                        onSubmit={handleVerifyParams}
                    />
                </Box>
                {loading && <Text>Verifying code...</Text>}
            </Box>
        );
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
