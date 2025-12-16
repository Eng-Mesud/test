// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type SetStateAction } from "react";
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

    useEffect(() => {
        api
            .get("/auth/me")
            .then((res: { data: SetStateAction<User | null>; }) => setUser(res.data))
            .catch(() => {
                setUser(null);
                delete api.defaults.headers.common["Authorization"];
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (username: string, password: string) => {
        const res = await api.post("/auth/login", { username, password });
        const { accessToken, user } = res.data;

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setUser(user);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch { }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;
