// src/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen w-full">Loading...</div>;
    if (!user) return <Navigate to="/auth/login" replace />;

    return children;
}
