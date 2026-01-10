import React, { useEffect } from 'react';
import { Text, Box, useApp } from 'ink';
import { useAuth } from '../../context/index.js';

export const Logout = () => {
    const { logout } = useAuth();
    const { exit } = useApp();

    useEffect(() => {
        logout();
        const timer = setTimeout(() => exit(), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box borderStyle="round" borderColor="red" padding={1}>
            <Text color="red">Logging out...</Text>
        </Box>
    );
};
