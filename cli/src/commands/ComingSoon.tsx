import React from 'react';
import { Text, Box } from 'ink';

interface ComingSoonProps {
    feature: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ feature }) => (
    <Box borderStyle="round" borderColor="yellow" padding={1} flexDirection="column">
        <Text color="yellow" bold>🚧 Feature Under Construction: {feature}</Text>
        <Text>This command is part of the HackMate "Best CLI" spec but is not yet implemented.</Text>
        <Text color="gray">Stay tuned for updates!</Text>
    </Box>
);
