"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "use-debounce"
import { toast } from "sonner"
import { Edit, Plus, Search, Trash2, UserCheck } from "lucide-react"

import { voterService } from "@/services/voterService"
import { DataTable } from "@/components/shared/data-table"
import { PageShell } from "@/components/shared/page-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { formatDate } from "@/lib/date-formatter"
import { Badge } from "@/components/ui/badge"

export default function VoterPage() {
    const navigate = useNavigate();

    // 1. State Management
    const [data, setData] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [filters, setFilters] = React.useState({
        page: 1,
        pageSize: 10,
        search: "",
    });

    const [debouncedSearch] = useDebounce(filters.search, 500);
    const [voterToDelete, setVoterToDelete] = React.useState<any>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    // 2. API Logic
    const fetchVoters = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await voterService.getVoters({
                ...filters,
                search: debouncedSearch || undefined,
            });
            setData(res.items);
            setTotal(res.totalCount);
        } catch (error) {
            console.error("Failed to fetch voters", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [filters.page, filters.pageSize, debouncedSearch]);

    React.useEffect(() => { fetchVoters() }, [fetchVoters]);

    // 3. Table Column Definitions
    const columns: any[] = [
        {
            accessorKey: "fullName",
            header: "Full Name",
            cell: ({ row }: any) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{row.original.fullName}</span>
                    <span className="text-xs text-muted-foreground">{row.original.mobileNumber || "No mobile"}</span>
                </div>
            )
        },
        {
            accessorKey: "referenceNumber",
            header: "Ref #",
            cell: ({ row }: any) => (
                <Badge variant="outline" className="font-mono text-xs">
                    {row.original.referenceNumber}
                </Badge>
            )
        },
        { accessorKey: "regionName", header: "Region" },
        { accessorKey: "districtName", header: "District" },
        {
            accessorKey: "registrationDate",
            header: "Reg Date",
            cell: ({ row }: any) => formatDate(row.original.registrationDate)
        },
        {
            id: "actions",
            header: () => <div className="text-right px-4">Actions</div>,
            cell: ({ row }: any) => (
                <div className="flex gap-1 justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => navigate(`/dashboard/voters/edit/${row.original.id}`)}
                        title="Edit Voter"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-red-50"
                        onClick={() => {
                            setVoterToDelete(row.original);
                            setIsDeleteDialogOpen(true);
                        }}
                        title="Delete Voter"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // 4. Toolbar Component
    const VoterToolbar = (
        <div className="flex items-center gap-2">
            <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or ref number..."
                    className="pl-9 h-9"
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                />
            </div>
        </div>
    );

    return (
        <PageShell
            title="Voter Registry"
            description="Access and manage the centralized voter database."
            breadcrumb={[{ label: "Operations" }, { label: "Voters" }]}
            actions={
                <Button
                    onClick={() => navigate("/dashboard/voters/new")}
                    className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                    <Plus className="mr-2 h-4 w-4" /> Register New Voter
                </Button>
            }
        >
            <DataTable
                title="Voters"
                columns={columns}
                data={data}
                rowCount={total}
                isLoading={loading}
                toolbar={VoterToolbar}
                pagination={{
                    pageIndex: filters.page - 1,
                    pageSize: filters.pageSize
                }}
                onPaginationChange={(p) => setFilters(f => ({
                    ...f,
                    page: p.pageIndex + 1,
                    pageSize: p.pageSize
                }))}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setVoterToDelete(null);
                }}
                onConfirm={async () => {
                    try {
                        await voterService.deleteVoter(voterToDelete.id);
                        toast.success("Voter record successfully removed");
                        fetchVoters();
                    } catch (error) {
                        toast.error("Failed to delete voter record");
                    } finally {
                        setIsDeleteDialogOpen(false);
                    }
                }}
                title="Delete Voter Record"
                description={`Are you sure you want to delete ${voterToDelete?.fullName}? This action cannot be undone.`}
            />
        </PageShell>
    );
}