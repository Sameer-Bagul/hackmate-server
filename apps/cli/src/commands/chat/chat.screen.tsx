import React from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

interface ChatScreenProps {
    messages: any[];
    input: string;
    setInput: (val: string) => void;
    status: string;
    handleSend: () => void;
    exit: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
    messages,
    input,
    setInput,
    status,
    handleSend,
    exit
}) => {
    useInput((input, key) => {
        if (key.escape) {
            exit();
        }
    });

    return (
        <Box flexDirection="column" padding={1} height={20} borderStyle="round" borderColor="cyan">
            <Text bold color="yellow">Status: {status}</Text>
            <Box flexDirection="column" flexGrow={1} justifyContent="flex-end">
                {messages.slice(-10).map((m, i) => (
                    <Text key={i}>
                        <Text bold color={m.senderId === 'me' ? 'green' : 'blue'}>
                            {m.username || (m.senderId === 'me' ? 'Me' : 'Them')}:
                        </Text> {m.content}
                    </Text>
                ))}
            </Box>
            <Box borderStyle="single" marginTop={1}>
                <Text> {'>'} </Text>
                <TextInput value={input} onChange={setInput} onSubmit={handleSend} />
            </Box>
            <Text color="gray">ESC to exit</Text>
        </Box>
    );
};
