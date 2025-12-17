// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/apiClient";

interface User {
    id: number;
    username: string;
    role: string;
    isActive: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Memoized logout handler to prevent effect loops
    const handleLogoutState = useCallback(() => {
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
    }, []);

    useEffect(() => {
        // Sync React state with Axios Interceptor events
        window.addEventListener("auth-logout", handleLogoutState);

        // Initial check for session on app load
        api.get("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => handleLogoutState())
            .finally(() => setLoading(false));

        return () => window.removeEventListener("auth-logout", handleLogoutState);
    }, [handleLogoutState]);

    const login = async (username: string, password: string) => {
        const res = await api.post("/auth/login", { username, password });
        const { accessToken, user: userData } = res.data;
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            handleLogoutState();
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;