import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveToken, saveUser, getToken, getUser, logout as configLogout } from '../config.js';

export interface User {
    username: string;
    id: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSession = () => {
            const storedUser = getUser();
            const storedToken = getToken();

            if (storedUser && storedToken) {
                // @ts-ignore - Conf types might be slightly off given strict null checks, but this is safe runtime
                setUser(storedUser);
                setToken(storedToken as string);
            }
            setIsLoading(false);
        };
        loadSession();
    }, []);

    const login = (newToken: string, newUser: User) => {
        saveToken(newToken);
        saveUser(newUser);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        configLogout();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user && !!token,
            login,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
