import React from 'react';
import { Text, Box } from 'ink';

interface NotificationScreenProps {
    action: string;
    data: any;
    error: string | null;
    loading: boolean;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({ action, data, error, loading }) => {
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;

    if (action === 'list') {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
                <Text bold>🔔 Notifications</Text>
                {Array.isArray(data) && data.length === 0 && <Text italic color="gray">No notifications.</Text>}
                {Array.isArray(data) && data.map((n: any) => (
                    <Box key={n._id} flexDirection="column" marginY={1}>
                        <Text bold={!n.read} color={n.read ? 'gray' : 'white'}>
                            {n.read ? '' : '• '} {n.content}
                        </Text>
                        <Text color="gray" italic>{new Date(n.createdAt).toLocaleString()}</Text>
                    </Box>
                ))}
            </Box>
        );
    }

    return <Text>Notification System</Text>;
};
