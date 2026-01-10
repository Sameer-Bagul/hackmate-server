import React from 'react';
import { Text, Box } from 'ink';

interface ProfileViewScreenProps {
    profile: any;
    loading: boolean;
    error: string | null;
    user: any;
}

export const ProfileViewScreen: React.FC<ProfileViewScreenProps> = ({ profile, loading, error, user }) => {
    if (loading) return <Text>Loading profile...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;
    if (!profile) return <Text>No profile found for @{user?.username}. Run "hackmate profile edit" to create one.</Text>;

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
            <Text bold color="cyan"> @{profile?.user?.username || user?.username} </Text>
            <Text>───────────────</Text>
            <Text>Intent: <Text color="green">{profile.intent}</Text></Text>
            <Text>Bio: {profile.bio || 'N/A'}</Text>
            <Text>Age: {profile.age || 'N/A'} | Gender: {profile.gender || 'N/A'}</Text>
            <Text>Company/College: {profile.company || 'N/A'}</Text>
            <Text>Stack: {profile.stack?.join(', ') || 'N/A'}</Text>
            <Text>Interests: {profile.interests?.join(', ') || 'N/A'}</Text>
            <Text>Location: {profile.location || 'N/A'}</Text>
            <Text>───────────────</Text>
            <Text bold>Socials:</Text>
            <Text>GitHub: {profile.github || 'N/A'}</Text>
            <Text>LinkedIn: {profile.linkedin || 'N/A'}</Text>
            <Text>Twitter: {profile.twitter || 'N/A'}</Text>
            <Text>Website: {profile.website || 'N/A'}</Text>
        </Box>
    );
};
