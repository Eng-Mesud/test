import { FullPageLoader } from "@/components/ui/loader";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// src/auth/Guard.tsx
interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: if provided, check role. If not, just check login.
}

export function AuthGuard({ children, allowedRoles }: GuardProps) {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  // 1. Check if logged in
  if (!user) return <Navigate to="/auth/login" replace />;

  // 2. Check if role is authorized (if roles were provided)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}