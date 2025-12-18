// src/layout/DashboardLayout.tsx
import { Link, useLocation, Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    LogOut,
    Shield,
    MapPin,
    FileText,
    Activity,
    ChevronDown,
    Sparkles,
    User,
    Users2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { LucideIcon } from "lucide-react"
import { Header } from "./Header"
import { useAuth } from "@/auth/AuthContext"

// Types
interface NavItem {
    title: string
    icon: LucideIcon
    href: string
    description?: string
    gradient?: string
    badge?: string
    subItems?: NavItem[]
}

interface NavSection {
    section: string
    items: NavItem[]
}

interface DashboardLayoutProps {
    children?: React.ReactNode
}

// Navigation Configuration
const navItems: NavSection[] = [
    {
        section: "Overview",
        items: [
            {
                title: "Dashboard",
                icon: LayoutDashboard,
                href: "/dashboard",
                description: "System overview and analytics",
                gradient: "from-blue-500 to-cyan-500",
            },
        ],
    },
    {
        section: "Management",
        items: [
            {
                title: "User Management",
                icon: Users,
                href: "/dashboard/users",
                description: "Manage system users",
                gradient: "from-purple-500 to-pink-500",
                subItems: [
                    {
                        title: "All Users",
                        icon: Users,
                        href: "/dashboard/users",
                        description: "View all users",
                    },
                    {
                        title: "Active Users",
                        icon: Activity,
                        href: "/dashboard/users/active",
                        description: "Currently active users",
                    },
                ],
            },
            {
                title: "Location Management",
                icon: MapPin,
                href: "/dashboard/locations",
                description: "Manage locations",
                gradient: "from-indigo-500 to-blue-500",
                subItems: [
                    {
                        title: "Regions",
                        icon: MapPin,
                        href: "/dashboard/locations",
                        description: "Manage regions",
                    },
                    {
                        title: "Districts",
                        icon: MapPin,
                        href: "/dashboard/locations",
                        description: "Manage districts",
                    },
                    {
                        title: "Vote Centers",
                        icon: MapPin,
                        href: "/dashboard/locations",
                        description: "Manage vote centers",
                    },
                ],
            },
            {
                title: "Voters",
                icon: Users2,
                href: "/dashboard/voters",
                description: "View and manage voters",
                gradient: "from-teal-500 to-green-500",
            },
            {
                title: "Reports",
                icon: FileText,
                href: "/dashboard/reports",
                description: "View and generate reports",
                gradient: "from-teal-500 to-green-500",
            },
        ],
    },
]

// Main Dashboard Layout Component
export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})
    const [isHovering, setIsHovering] = useState(false)
    const [showLogoutAlert, setShowLogoutAlert] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false)
            } else {
                setIsSidebarOpen(true)
            }
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const toggleSubmenu = (title: string) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    const handleMobileNavigate = () => {
        setIsMobileMenuOpen(false)
    }

    // Determine if sidebar should show expanded (open OR hovering when collapsed)
    const isExpanded = isSidebarOpen || isHovering

    const renderNavItem = (item: NavItem, isSubmenu = false, isMobile = false) => {
        const isActive = location.pathname === item.href
        const hasSubItems = item.subItems && item.subItems.length > 0
        const isSubmenuExpanded = expandedMenus[item.title]

        if (hasSubItems && !isSubmenu) {
            return (
                <div key={item.title} className="space-y-1">
                    <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={cn(
                            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                            <item.icon className="h-4 w-4" />
                        </div>

                        {(isExpanded || isMobile) && (
                            <>
                                <span className="flex-1 text-left truncate">{item.title}</span>
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 shrink-0 transition-transform",
                                        isSubmenuExpanded && "rotate-180"
                                    )}
                                />
                            </>
                        )}
                    </button>

                    {(isExpanded || isMobile) && isSubmenuExpanded && item.subItems && (
                        <div className="ml-4 space-y-0.5 border-l-2 border-border pl-3">
                            {item.subItems.map((subItem) => renderNavItem(subItem, true, isMobile))}
                        </div>
                    )}
                </div>
            )
        }

        return (
            <Link
                key={item.href}
                to={item.href}
                onClick={isMobile ? handleMobileNavigate : undefined}
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    isSubmenu && "py-2"
                )}
            >
                <div
                    className={cn(
                        "flex shrink-0 items-center justify-center rounded-md",
                        isActive ? "bg-primary-foreground/10" : "bg-muted",
                        isSubmenu ? "h-7 w-7" : "h-8 w-8"
                    )}
                >
                    <item.icon className={cn(isSubmenu ? "h-3.5 w-3.5" : "h-4 w-4")} />
                </div>

                {(isExpanded || isMobile) && (
                    <div className="flex flex-1 items-center justify-between min-w-0">
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                            <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {item.badge}
                            </span>
                        )}
                    </div>
                )}
            </Link>
        )
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar - Desktop */}
            <aside
                onMouseEnter={() => !isSidebarOpen && setIsHovering(true)}
                onMouseLeave={() => !isSidebarOpen && setIsHovering(false)}
                className={cn(
                    "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col border-r bg-card transition-all duration-300",
                    isExpanded ? "lg:w-64" : "lg:w-16"
                )}
            >
                {/* Sidebar Header */}
                <div className={cn(
                    "flex h-14 items-center border-b px-4",
                    !isExpanded && "justify-center px-2"
                )}>
                    {isExpanded ? (
                        <div className="flex items-center gap-2.5">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-bold leading-tight">Admin Panel</span>
                                <span className="text-xs text-muted-foreground">System Management</span>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                    <nav className="p-3 space-y-1">
                        {navItems.map((section) => (
                            <div key={section.section} className="space-y-1 pb-4">
                                {isExpanded && (
                                    <div className="px-3 py-2">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {section.section}
                                        </span>
                                    </div>
                                )}
                                {section.items.map((item) => renderNavItem(item, false, false))}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="border-t p-3 space-y-2">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
                            !isExpanded && "justify-center px-2"
                        )}
                        onClick={() => setShowLogoutAlert(true)}
                    >
                        <LogOut className={cn("h-4 w-4", isExpanded && "mr-2")} />
                        {isExpanded && <span>Sign Out</span>}
                    </Button>

                    {isExpanded && (
                        <div className="rounded-lg bg-muted p-3">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold truncate">Admin Dashboard</p>
                                    <p className="text-xs text-muted-foreground">v1.0.0</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Logout Alert Dialog */}
            <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be redirected to the login page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={logout} className="bg-red-600 hover:bg-red-700 text-white">
                            Sign Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="border-b p-4">
                        <SheetTitle>
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-bold leading-tight">Admin Panel</span>
                                    <span className="text-xs text-muted-foreground">System Management</span>
                                </div>
                            </div>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="overflow-y-auto p-3 h-[calc(100vh-5rem)]">
                        <nav className="space-y-1">
                            {navItems.map((section) => (
                                <div key={section.section} className="space-y-1 pb-4">
                                    <div className="px-3 py-2">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {section.section}
                                        </span>
                                    </div>
                                    {section.items.map((item) => renderNavItem(item, false, true))}
                                </div>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main content */}
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300",
                isExpanded ? "lg:pl-64" : "lg:pl-16"
            )}>
                <Header
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    isSidebarCollapsed={!isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    user={user}
                    onLogout={logout}
                />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children || <Outlet />}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
