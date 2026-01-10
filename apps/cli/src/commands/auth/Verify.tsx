import React from 'react';
import { Text, Box, Newline } from 'ink';
import TextInput from 'ink-text-input';
import { useVerifyLogic } from './verify.logic.js';

export const Verify = () => {
    const { step, otp, setOtp, loading, error, handleSendOtp, handleVerifyOtp, email } = useVerifyLogic();

    if (step === 'request') {
        return (
            <Box borderStyle="round" borderColor="cyan" flexDirection="column" padding={1}>
                <Text bold>📧 Email Verification</Text>
                <Text>Verify your account to unlock full features.</Text>
                <Newline />
                {loading ? (
                    <Text>Sending OTP...</Text>
                ) : (
                    <Text>Press <Text color="green" underline bold>Enter</Text> to send code to registered email.</Text>
                )}
                {error && <Text color="red">❌ {error}</Text>}
                {/* Auto-trigger via Enter would need raw input handling, for MVP just rendering text instructions often implies pressing Enter if using inquirer or similar, but here we might need a key handler. 
                    Actually, let's just use TextInput for "Press Enter" simulation or a useInput hook. 
                    For simplicity, let's just AUTO SEND if it's the first step/component mount? 
                    Or simpler: Ask "Type 'send' to receive OTP"?
                    Let's use a dummy input to capture Enter.
                */}
                <Box marginTop={1}>
                    <Text color="gray">Type 'send' and press Enter: </Text>
                    <TextInput value={otp} onChange={v => setOtp(v)} onSubmit={() => { if (otp.trim() === 'send') handleSendOtp(); }} />
                </Box>
            </Box>
        );
    }

    if (step === 'input') {
        return (
            <Box borderStyle="round" borderColor="yellow" flexDirection="column" padding={1}>
                <Text>📩 OTP sent! Check your console/email.</Text>
                <Newline />
                <Text>Enter 6-digit Code:</Text>
                <TextInput
                    value={otp}
                    onChange={setOtp}
                    onSubmit={handleVerifyOtp}
                    placeholder="123456"
                />
                {loading && <Text>Verifying...</Text>}
                {error && <Box marginTop={1}><Text color="red">❌ {error}</Text></Box>}
            </Box>
        );
    }

    return (
        <Box borderStyle="round" borderColor="green" padding={1}>
            <Text bold color="green">✅ Email Verified Successfully!</Text>
        </Box>
    );
};
