// src/auth/RoleRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RoleRoute({
    roles,
    children,
}: {
    roles: string[];
    children: JSX.Element;
}) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/auth/login" replace />;
    if (!roles.includes(user.role)) return <Navigate to="/403" replace />;

    return children;
}
