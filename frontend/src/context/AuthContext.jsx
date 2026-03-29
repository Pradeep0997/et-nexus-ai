import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'etnexus_user';

function loadUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch { return null; }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadUser);
    const [error, setError] = useState(null);

    // Mock user DB stored in localStorage
    const getUsers = () => {
        try { return JSON.parse(localStorage.getItem('etnexus_users') || '[]'); }
        catch { return []; }
    };
    const saveUsers = (users) => localStorage.setItem('etnexus_users', JSON.stringify(users));

    const register = useCallback(({ name, email, password }) => {
        setError(null);
        const users = getUsers();
        if (users.find((u) => u.email === email)) {
            setError('An account with this email already exists.');
            return false;
        }
        const newUser = { id: crypto.randomUUID(), name, email, password, persona: 'INVESTOR' };
        saveUsers([...users, newUser]);
        const session = { id: newUser.id, name: newUser.name, email: newUser.email };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setUser(session);
        return true;
    }, []);

    const login = useCallback(({ email, password }) => {
        setError(null);
        const users = getUsers();
        const found = users.find((u) => u.email === email && u.password === password);
        if (!found) {
            setError('Invalid email or password.');
            return false;
        }
        const session = { id: found.id, name: found.name, email: found.email };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setUser(session);
        return true;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return (
        <AuthContext.Provider value={{ user, error, register, login, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
