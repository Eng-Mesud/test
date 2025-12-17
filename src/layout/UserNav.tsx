// src/layout/UserNav.tsx
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { UserCircle, Settings, LogOut } from "lucide-react"

interface UserNavProps {
    user: any
    onLogout: () => void
}

export const UserNav = ({ user, onLogout }: UserNavProps) => {
    const [showLogoutAlert, setShowLogoutAlert] = useState(false)

    const getInitials = (name?: string) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    return (
        <>
            {/* Dropdown Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger className="relative h-8 w-8 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200 p-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <Avatar className="h-7 w-7 ring-2 ring-white dark:ring-gray-700">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
                            {getInitials(user?.username)}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-2"
                    align="end"
                >
                    <DropdownMenuGroup>
                        {/* User Info */}
                        <DropdownMenuLabel className="font-normal p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-gray-700">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
                                        {getInitials(user?.username)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username || "User"}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || "No role"}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

                        {/* Profile & Settings */}
                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 p-2.5">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span className="text-sm">Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 p-2.5">
                            <Settings className="mr-2 h-4 w-4" />
                            <span className="text-sm">Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

                        {/* Sign Out */}
                        <DropdownMenuItem
                            onClick={() => setShowLogoutAlert(true)}
                            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg p-2.5"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span className="text-sm">Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* AlertDialog for Sign Out */}
            <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
                <AlertDialogContent className="z-[999]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be redirected to the login page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setShowLogoutAlert(false)
                                onLogout()
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Sign Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
