import React from 'react';
import { AuthProvider } from './AuthContext.js';
import { SocketProvider } from './SocketContext.js';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AuthProvider>
            <SocketProvider>
                {children}
            </SocketProvider>
        </AuthProvider>
    );
};

export * from './AuthContext.js';
export * from './SocketContext.js';
