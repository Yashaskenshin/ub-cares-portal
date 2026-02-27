import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        // Check session storage on initial load
        return sessionStorage.getItem('isAuthenticated') === 'true';
    });

    const login = async (password: string): Promise<boolean> => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : 'https://ubcares-production.up.railway.app');
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('jwtToken', data.token);
                return true;
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('jwtToken');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
