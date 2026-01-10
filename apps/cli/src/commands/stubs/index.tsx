import React, { useState, useEffect } from 'react';
import { Text, Box, useApp } from 'ink';
import Conf from 'conf';

const config = new Conf({ projectName: 'hackmate-cli' });

export const StatsStub = () => (
    <Box borderStyle="round" borderColor="blue" padding={1} flexDirection="column">
        <Text bold underline>📊 Your Stats</Text>
        <Text>🔥 Streak: 12 days</Text>
        <Text>💬 Messages Sent: 1,337</Text>
        <Text>🤝 Profile Views: 42</Text>
        <Text>⭐ Reputation: 9000+</Text>
    </Box>
);

export const MatchStub = () => (
    <Box borderStyle="round" borderColor="magenta" padding={1} flexDirection="column">
        <Text bold color="magenta">❤️ Match Queue</Text>
        <Text>No new matches nearby.</Text>
        <Text color="gray">Try updating your filters or location!</Text>
    </Box>
);

export const BotStub = () => {
    const [enabled, setEnabled] = useState(config.get('bot_enabled') || false);

    useEffect(() => {
        // Toggle simulated state
        config.set('bot_enabled', !enabled);
        setEnabled(!enabled);
    }, []);

    return (
        <Box borderStyle="round" borderColor="cyan" padding={1} flexDirection="column">
            <Text bold color="cyan">🤖 HackBot Status</Text>
            <Text>Status: {enabled ? <Text color="green">ONLINE</Text> : <Text color="red">OFFLINE</Text>}</Text>
            <Text dimColor>Bot auto-reply features {enabled ? 'enabled' : 'disabled'}.</Text>
        </Box>
    );
};

export const ConfigStub = () => {
    const path = config.path;
    const store = config.store;
    return (
        <Box borderStyle="round" borderColor="white" padding={1} flexDirection="column">
            <Text bold>⚙️  Configuration</Text>
            <Text>Path: {path}</Text>
            <Text>Values:</Text>
            <Text color="gray">{JSON.stringify(store, null, 2)}</Text>
        </Box>
    );
};

export const DataStub = () => (
    <Box borderStyle="round" borderColor="yellow" padding={1} flexDirection="column">
        <Text bold>📦 Data Export</Text>
        <Text>Exporting your data to ./hackmate_export.json...</Text>
        <Text color="green">Done!</Text>
    </Box>
);

export const PresenceStub = ({ status }: { status: string }) => (
    <Box borderStyle="round" borderColor="green" padding={1}>
        <Text>Updating presence to: <Text bold color={status === 'online' ? 'green' : 'gray'}>{status.toUpperCase()}</Text></Text>
    </Box>
);
