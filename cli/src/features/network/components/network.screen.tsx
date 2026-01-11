import React from 'react';
import { Text, Box } from 'ink';

interface NetworkScreenProps {
    action: string;
    data: any;
    error: string | null;
    loading: boolean;
}

export const NetworkScreen: React.FC<NetworkScreenProps> = ({ action, data, error, loading }) => {
    if (loading) return <Text>Loading network...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;

    if (action === 'list') {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
                <Text bold>My Friends ({data?.length || 0})</Text>
                {data?.length === 0 && <Text italic color="gray">No friends yet. Use 'hackmate network add' to connect!</Text>}
                {Array.isArray(data) && data.map((f: any) => (
                    <Text key={f._id}>• {f.username} ({f.email})</Text>
                ))}
            </Box>
        );
    }

    if (action === 'requests') {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
                <Text bold>Pending Requests ({data?.length || 0})</Text>
                {data?.length === 0 && <Text italic color="gray">No pending requests.</Text>}
                {Array.isArray(data) && data.map((r: any) => (
                    <Text key={r._id}>
                        • From: <Text bold color="yellow">{r.senderId.username}</Text> (at {new Date(r.createdAt).toLocaleDateString()})
                    </Text>
                ))}
            </Box>
        );
    }

    // Success message for actions
    return (
        <Box padding={1}>
            <Text color="green">✅ {data?.message}</Text>
        </Box>
    );
};
