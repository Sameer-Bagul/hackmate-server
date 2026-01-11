import React from 'react';
import { Text, Box } from 'ink';
import TextInput from 'ink-text-input';

interface ProjectScreenProps {
    action: string;
    data: any;
    error: string | null;
    loading: boolean;
    formStep: number;
    setFormStep: (step: number) => void;
    formData: { title: string; description: string; skills: string };
    setFormData: (data: any) => void;
    message: string;
    setMessage: (msg: string) => void;
    handleCreateSubmit: () => void;
    handleApplySubmit: () => void;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({
    action,
    data,
    error,
    loading,
    formStep,
    setFormStep,
    formData,
    setFormData,
    message,
    setMessage,
    handleCreateSubmit,
    handleApplySubmit
}) => {
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;

    if (action === 'list') {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="magenta">
                <Text bold>🔥 Open Projects</Text>
                {Array.isArray(data) && data.length === 0 && <Text italic color="gray">No open projects.</Text>}
                {Array.isArray(data) && data.map((p: any) => (
                    <Box key={p._id} flexDirection="column" marginY={1}>
                        <Text bold color="cyan">{p.title} <Text color="gray">(ID: {p._id})</Text></Text>
                        <Text color="green">By @{p.ownerId?.username}</Text>
                        <Text>{p.description.substring(0, 100)}...</Text>
                        <Text color="blue">Skills: {p.skills?.join(', ')}</Text>
                    </Box>
                ))}
            </Box>
        );
    }

    if (action === 'view') {
        return (
            <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
                <Text bold color="magenta">{data.title}</Text>
                <Text color="gray">Started by @{data.ownerId?.username}</Text>
                <Box marginY={1}>
                    <Text>{data.description}</Text>
                </Box>
                <Text bold>Skills required: <Text color="blue">{data.skills?.join(', ')}</Text></Text>
                <Box marginY={1}>
                    <Text>───────────────</Text>
                </Box>
                <Text bold>Applicants ({data.applicants?.length || 0}):</Text>
                {data.applicants?.map((a: any) => (
                    <Text key={a.userId._id}>
                        • {a.userId.username} [{a.status}] - "{a.message}"
                        <Text color="gray"> (ID: {a.userId._id})</Text>
                    </Text>
                ))}
            </Box>
        );
    }

    if (action === 'create') {
        if (data?.message) return <Text color="green">✅ {data.message}</Text>;

        return (
            <Box flexDirection="column" padding={1}>
                <Text bold>Create New Project</Text>
                {formStep === 0 && (
                    <Box>
                        <Text>Title: </Text>
                        <TextInput value={formData.title} onChange={v => setFormData({ ...formData, title: v })} onSubmit={() => setFormStep(1)} />
                    </Box>
                )}
                {formStep === 1 && (
                    <Box>
                        <Text>Description: </Text>
                        <TextInput value={formData.description} onChange={v => setFormData({ ...formData, description: v })} onSubmit={() => setFormStep(2)} />
                    </Box>
                )}
                {formStep === 2 && (
                    <Box>
                        <Text>Skills (comma sep): </Text>
                        <TextInput value={formData.skills} onChange={v => setFormData({ ...formData, skills: v })} onSubmit={handleCreateSubmit} />
                    </Box>
                )}
            </Box>
        );
    }

    if (action === 'apply') {
        if (data?.message) return <Text color="green">✅ {data.message}</Text>;
        return (
            <Box flexDirection="column" padding={1}>
                <Text bold>Apply to Project</Text>
                <Text>Message to owner: </Text>
                <TextInput value={message} onChange={setMessage} onSubmit={handleApplySubmit} />
            </Box>
        );
    }

    return <Text color="green">✅ {data?.message}</Text>;
};
