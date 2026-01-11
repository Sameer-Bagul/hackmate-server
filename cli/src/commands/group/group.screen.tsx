import React from 'react';
import { Text, Box } from 'ink';
import TextInput from 'ink-text-input';

interface GroupScreenProps {
    action: string;
    data: any;
    error: string | null;
    loading: boolean;
    createStep: number;
    setCreateStep: (step: number) => void;
    formData: { name: string; description: string; isPrivate: boolean };
    setFormData: (data: any) => void;
    handleCreateSubmit: () => void;
}

export const GroupScreen: React.FC<GroupScreenProps> = ({
    action,
    data,
    error,
    loading,
    createStep,
    setCreateStep,
    formData,
    setFormData,
    handleCreateSubmit
}) => {
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;

    if (action === 'list') {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="green">
                <Text bold>Groups</Text>
                {Array.isArray(data) && data.length === 0 && <Text italic color="gray">No groups found.</Text>}
                {Array.isArray(data) && data.map((g: any) => (
                    <Box key={g._id} flexDirection="column" marginY={1}>
                        <Text bold color="cyan">{g.name} <Text color="gray">({g.isPrivate ? 'Private' : 'Public'})</Text></Text>
                        <Text>{g.description}</Text>
                        <Text color="gray">ID: {g._id}</Text>
                    </Box>
                ))}
            </Box>
        );
    }

    if (action === 'view') {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
                <Text bold color="green">{data.name}</Text>
                <Text italic>{data.description}</Text>
                <Box marginY={1}>
                    <Text bold>Members ({data.members.length})</Text>
                </Box>
                {data.members.slice(0, 5).map((m: any) => (
                    <Text key={m.userId._id}>• {m.userId.username} [{m.role}]</Text>
                ))}
                {data.joinRequests?.length > 0 && (
                    <Box flexDirection="column" marginTop={1}>
                        <Text bold color="yellow">Pending Requests:</Text>
                        {data.joinRequests.map((r: any) => (
                            <Text key={r.userId._id}>• {r.userId.username} (ID: {r.userId._id})</Text>
                        ))}
                    </Box>
                )}
            </Box>
        );
    }

    if (action === 'create') {
        if (data?.message) return <Text color="green">✅ {data.message}</Text>;
        return (
            <Box flexDirection="column" padding={1}>
                <Text bold>Create Group</Text>
                {createStep === 0 && (
                    <Box>
                        <Text>Name: </Text>
                        <TextInput value={formData.name} onChange={v => setFormData({ ...formData, name: v })} onSubmit={() => setCreateStep(1)} />
                    </Box>
                )}
                {createStep === 1 && (
                    <Box>
                        <Text>Description: </Text>
                        <TextInput value={formData.description} onChange={v => setFormData({ ...formData, description: v })} onSubmit={() => setCreateStep(2)} />
                    </Box>
                )}
                {createStep === 2 && (
                    <Box>
                        <Text>Is Private (y/n): </Text>
                        <TextInput
                            value={formData.isPrivate ? 'y' : 'n'}
                            onChange={v => setFormData({ ...formData, isPrivate: v === 'y' })}
                            onSubmit={handleCreateSubmit}
                        />
                    </Box>
                )}
            </Box>
        );
    }

    return <Text color="green">✅ {data?.message}</Text>;
};
