import React from 'react';
import { Text, Box } from 'ink';

interface AdminScreenProps {
    action: string;
    data: any;
    error: string | null;
    loading: boolean;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ action, data, error, loading }) => {
    if (loading) return <Text>Processing Admin Command...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;

    if (action === 'list') {
        return (
            <Box flexDirection="column" padding={1}>
                <Text bold underline>All Users ({data?.length || 0})</Text>
                {Array.isArray(data) && data.map((u: any) => (
                    <Box key={u._id}>
                        <Text color={u.role === 'admin' ? 'red' : 'white'}>
                            {u.username} ({u.email}) - {u.role} [ID: {u._id}]
                        </Text>
                    </Box>
                ))}
            </Box>
        );
    }

    if (action === 'view') {
        return (
            <Box flexDirection="column" padding={1}>
                <Text bold underline>User Details</Text>
                <Text>ID: {data?.user?._id}</Text>
                <Text>Username: {data?.user?.username}</Text>
                <Text>Email: {data?.user?.email}</Text>
                <Text>Role: {data?.user?.role}</Text>
                <Text>Created: {data?.user?.createdAt}</Text>
                <Box marginTop={1}>
                    <Text bold>Profile Data:</Text>
                </Box>
                {data?.profile ? (
                    <Box flexDirection="column">
                        <Text>Bio: {data.profile.bio}</Text>
                        <Text>Skills: {data.profile.skills?.join(', ')}</Text>
                    </Box>
                ) : <Text italic>No profile data</Text>}
            </Box>
        );
    }

    if (action === 'delete') {
        return (
            <Box padding={1}>
                <Text color="green">✅ {data?.message}</Text>
            </Box>
        );
    }

    return null;
};
