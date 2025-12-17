import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import UsersPage from "./features/users/UsersPage";
// import VotersPage from "./features/voters/VotersPage";
import { AuthGuard } from "./auth/Guard";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/403" element={<ForbiddenPage />} />

                <Route path="/dashboard" element={
                    <AuthGuard>
                        <DashboardLayout />
                    </AuthGuard>
                }>
                    <Route index element={<DashboardPage />} />
                    <Route path="users" element={
                        <AuthGuard allowedRoles={["admin"]}>
                            <UsersPage />
                        </AuthGuard>
                    } />
                    //add voters router
                    {/* <Route path="voters" element={
                        <AuthGuard allowedRoles={["Admin"]}>
                            <VotersPage />
                        </AuthGuard>
                    } /> */}

                    {/* Add more routes here later */}
                </Route>


                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}

export default App;