import { useAuth } from "@/auth/AuthContext"

export default function DashboardPage() {
    const { user } = useAuth()

    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="rounded-lg border p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.username}!</h2>
                <p className="text-muted-foreground">
                    You are logged in as a <span className="font-medium text-foreground">{user?.role}</span>.
                </p>
                <p className="mt-4">
                    Select an item from the sidebar to manage your application data.
                </p>
            </div>
        </div>
    )
}
