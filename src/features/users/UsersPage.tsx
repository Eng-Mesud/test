// src/features/users/UserPage.tsx
import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/userService";
import { DataTable } from "@/components/shared/data-table";
import { UserForm } from "./components/user-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import type { UserFormValues, UserFilters } from "@/schemas";
import type { ColumnDef } from "@tanstack/react-table";

export default function UserPage() {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Local state for all table controls
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        pageSize: 10,
        search: "",
        role: "all",
    });

    const [debouncedSearch] = useDebounce(filters.search, 500);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers({
                ...filters,
                search: debouncedSearch || undefined,
                role: filters.role === "all" ? undefined : filters.role,
            });
            // Backend returns { items, totalCount }
            setData(response.items);
            setTotal(response.totalCount);
        } finally {
            setLoading(false);
        }
    }, [filters.page, filters.pageSize, filters.role, debouncedSearch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSave = async (values: UserFormValues) => {
        try {
            if (selectedUser) {
                await userService.updateUser(selectedUser.id, values);
                toast.success("User updated");
            } else {
                await userService.createUser(values);
                toast.success("User created");
            }
            setIsFormOpen(false);
            fetchUsers();
        } catch (error: any) {
            // We catch the rejected errorData from apiClient.ts here
            // If it's a validation error, the apiClient didn't toast it, so we do it here
            if (error.errorCode === "VALIDATION_ERROR") {
                toast.error(error.message || "Validation failed. Please check your data.");
            }
        }
    };

    const columns: ColumnDef<any>[] = [
        { accessorKey: "username", header: "Username" },
        { accessorKey: "role", header: "Role" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(row.original); setIsFormOpen(true); }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                <Button onClick={() => { setSelectedUser(null); setIsFormOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> New User
                </Button>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
                <Input
                    placeholder="Search..."
                    className="max-w-xs"
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                />
                <Select value={filters.role} onValueChange={(v) => setFilters(f => ({ ...f, role: v, page: 1 }))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                columns={columns}
                data={data}
                rowCount={total}
                isLoading={loading}
                pagination={{ pageIndex: filters.page - 1, pageSize: filters.pageSize }}
                onPaginationChange={(p) => setFilters(f => ({ ...f, page: p.pageIndex + 1, pageSize: p.pageSize }))}
            />

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent>
                    <SheetHeader><SheetTitle>{selectedUser ? "Edit User" : "Create User"}</SheetTitle></SheetHeader>
                    <UserForm initialData={selectedUser} onSubmit={handleSave} loading={loading} />
                </SheetContent>
            </Sheet>
        </div>
    );
}