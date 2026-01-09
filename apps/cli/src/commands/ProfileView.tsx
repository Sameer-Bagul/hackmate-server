import React, { useEffect, useState } from 'react';
import { Text, Box } from 'ink';
import api from '../api.js';
import { IProfile } from '@hackmate/db';
import { getUser } from '../config.js';

export const ProfileView = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = getUser();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/profile');
                setProfile(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <Text>Loading profile...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;
    if (!profile) return <Text>No profile found for @{user?.username}. Run "hackmate profile edit" to create one.</Text>;

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
            <Text bold color="cyan"> @{user?.username} </Text>
            <Text>───────────────</Text>
            <Text>Intent: <Text color="green">{profile.intent}</Text></Text>
            <Text>Bio: {profile.bio || 'N/A'}</Text>
            <Text>Stack: {profile.stack?.join(', ') || 'N/A'}</Text>
            <Text>Location: {profile.location || 'N/A'}</Text>
            <Text>GitHub: {profile.github || 'N/A'}</Text>
        </Box>
    );
};
