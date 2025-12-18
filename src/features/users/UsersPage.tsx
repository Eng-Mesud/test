//userspage.tsx
import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/userService";
import { DataTable } from "@/components/shared/data-table";
import { PageShell } from "@/components/shared/page-shell";
import { UserForm } from "./components/user-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { UserFilters, UserFormValues } from "@/schemas/userSchema";

export default function UserPage() {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // 1. State Management
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        pageSize: 10,
        search: "",
        role: "all",
    });

    const [debouncedSearch] = useDebounce(filters.search, 500);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // 2. API Logic
    // Inside UserPage.tsx -> fetchUsers
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers({
                ...filters,
                search: debouncedSearch || undefined,
                role: filters.role === "all" ? undefined : filters.role,
            });

            // SAFE: response.items is guaranteed to be an array by the service
            setData(response.items);
            setTotal(response.totalCount);
        } catch (error) {
            // Optional: on error, set to empty state to be safe
            setData([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [filters.page, filters.pageSize, filters.role, debouncedSearch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Update handleSave in UserPage.tsx
    const handleSave = async (values: UserFormValues) => {
        try {
            setLoading(true);
            if (selectedUser) {
                // If editing and password is empty string, remove it from payload
                const updatePayload = { ...values };
                if (!updatePayload.password) delete updatePayload.password;

                await userService.updateUser(selectedUser.id, updatePayload);
                toast.success("Changes saved");
            } else {
                // For new users, ensure password exists or show validation
                if (!values.password) {
                    toast.error("Password is required for new users");
                    return;
                }
                await userService.createUser(values);
                toast.success("User created");
            }
            setIsFormOpen(false);
            fetchUsers();
        } finally {
            setLoading(false);
        }
    };
    // 3. Table Columns Definition
    const columns: ColumnDef<any>[] = [
        { accessorKey: "username", header: "Username" },
        { accessorKey: "role", header: "Role" },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => { setSelectedUser(row.original); setIsFormOpen(true); }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setSelectedUserId(row.original.id); setIsDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // 4. Page Toolbar (Filters)
    const UserToolbar = (
        <div className="flex items-center gap-2">
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search users..."
                    className="pl-9 h-9 border-gray-200"
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                />
            </div>
            <Select value={filters.role} onValueChange={(v) => setFilters(f => ({ ...f, role: v ?? "all", page: 1 }))}>
                <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <PageShell
            title="Users"
            description="Create and manage system users and their access levels."
            breadcrumb={[{ label: "Administration" }, { label: "Users" }]}
            actions={
                <Button onClick={() => { setSelectedUser(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> New User
                </Button>
            }
        >
            <DataTable
                title="Account Listing"
                columns={columns}
                data={data}
                rowCount={total}
                isLoading={loading}
                toolbar={UserToolbar}
                pagination={{ pageIndex: filters.page - 1, pageSize: filters.pageSize }}
                onPaginationChange={(p) => setFilters(f => ({ ...f, page: p.pageIndex + 1, pageSize: p.pageSize }))}
            />
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                {/* Slide-over Form */}
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{selectedUser ? "Edit User" : "Create New User"}</DialogTitle>
                    </DialogHeader>
                    {/* Form is now focused and clean in the center of the screen */}
                    <UserForm
                        initialData={selectedUser}
                        onSubmit={handleSave}
                        loading={loading}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                // Inside UserPage.tsx -> ConfirmDialog onConfirm
                onConfirm={async () => {
                    if (!selectedUserId) return;
                    try {
                        setLoading(true);
                        // Conversion: your service expects number, state is string | null
                        await userService.deleteUser(Number(selectedUserId));
                        toast.success("User deleted successfully");
                        setIsDeleteDialogOpen(false);
                        fetchUsers();
                    } catch (error) {
                        // Error is handled by your API interceptor
                    } finally {
                        setLoading(false);
                        setSelectedUserId(null);
                    }
                }}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
            />
        </PageShell>
    );
}