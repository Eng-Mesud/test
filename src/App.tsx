import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import UsersPage from "./features/users/UsersPage";
// import VotersPage from "./features/voters/VotersPage";
import { AuthGuard } from "./auth/Guard";
import { DashboardLayout } from "./layout/DashboardLayout";
import VoterPage from "./features/voters/VoterPage";
import VoterFormPage from "./features/voters/VoterFormPage";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/403" element={<ForbiddenPage />} />

                <Route path="/dashboard" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
                    <Route index element={<DashboardPage />} />

                    {/* Restrict to admin role only */}
                    <Route path="users" element={
                        <AuthGuard allowedRoles={["admin"]}>
                            <UsersPage />
                        </AuthGuard>
                    } />

                    {/* Restrict to multiple roles */}
                    <Route path="voters" element={
                        <AuthGuard allowedRoles={["admin", "user"]}>
                            <VoterPage />
                        </AuthGuard>
                    } />
                    {/* Inside the /dashboard Route group */}

                    <Route path="voters/new" element={
                        <AuthGuard allowedRoles={["admin", "user"]}>
                            <VoterFormPage />
                        </AuthGuard>
                    } />
                    <Route path="voters/edit/:id" element={
                        <AuthGuard allowedRoles={["admin", "user"]}>
                            <VoterFormPage />
                        </AuthGuard>
                    } />
                    {/* <Route path="locations" element={<LocationsPage />} /> */}
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}

export default App;