import { Link, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { toast } from "sonner"
import {
    LayoutDashboard,
    Users,
    Map,
    MapPin,
    LogOut,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function DashboardLayout() {
    const { user, logout } = useAuth()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        // No need to redirect manually, AuthContext state change will trigger re-render and ProtectedRoute might catch it, 
        // or we redirect explicitly just in case.
        // However, usually logout() clears state, and if the route is protected, it redirects for us.
        toast.success("Logged out successfully")
    }

    const navItems = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Users", href: "/dashboard/users", icon: Users },
        { title: "Regions", href: "/dashboard/regions", icon: Map },
        { title: "Districts", href: "/dashboard/districts", icon: MapPin },
        { title: "Vote Centers", href: "/dashboard/vote-centers", icon: MapPin },
    ]

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <span className="">Admin Panel</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                        location.pathname === item.href
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1">
                        {/* Breadcrumbs or Title could go here */}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full")}>
                            <span className="sr-only">Toggle user menu</span>
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                {user?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex flex-col items-start">
                                <span className="font-medium">{user?.username}</span>
                                <span className="text-xs text-muted-foreground">{user?.role}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
