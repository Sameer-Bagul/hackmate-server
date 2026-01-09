import React, { useEffect, useState } from 'react';
import { Text, Box, useApp, Newline } from 'ink';
import api from '../api.js';

export const Discover = () => {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const { data } = await api.get('/match/discover');
                setMatches(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch matches');
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    if (loading) return <Text>Finding your tribe...</Text>;
    if (error) return <Text color="red">Error: {error}</Text>;
    if (matches.length === 0) return <Text>No matches found yet. Try back later!</Text>;

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="magenta"> 🚀 Top Matches for You </Text>
            <Newline />
            {matches.map((match, i) => (
                <Box key={i} flexDirection="column" borderStyle="single" borderColor="cyan" marginBottom={1} paddingX={1}>
                    <Box justifyContent="space-between">
                        <Text bold color="cyan">@{match.userId.username}</Text>
                        <Text color="green">{match.score} pts</Text>
                    </Box>
                    <Text italic>{match.bio}</Text>
                    <Text>Stack: {match.stack.join(', ')}</Text>
                    <Newline />
                    <Text color="gray">Why? {match.matchReasons.join(' • ')}</Text>
                </Box>
            ))}
        </Box>
    );
};
