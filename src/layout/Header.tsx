// src/layout/Header.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Search, ChevronRight, ChevronLeft } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "./UserNav"

interface HeaderProps {
    onMenuClick: () => void
    isSidebarCollapsed: boolean
    toggleSidebar: () => void
    user: any
    onLogout: () => void
}

export const Header = ({ onMenuClick, isSidebarCollapsed, toggleSidebar, user, onLogout }: HeaderProps) => {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden rounded-lg h-9 w-9"
                    onClick={onMenuClick}
                >
                    <Menu className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex rounded-lg h-9 w-9"
                    onClick={toggleSidebar}
                >
                    {isSidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>

                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 text-sm bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Activity Indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                </div>

                {/* Theme Toggle */}
                <ModeToggle />

                {/* User Menu */}
                <UserNav user={user} onLogout={onLogout} />
            </div>
        </header>
    )
}
