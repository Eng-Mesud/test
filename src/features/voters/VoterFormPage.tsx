"use client"

import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { voterService } from "@/services/voterService"
import { VoterForm } from "./components/voter-form"
import { PageShell } from "@/components/shared/page-shell"
import { Card, CardContent } from "@/components/ui/card"

export default function VoterFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [fetching, setFetching] = React.useState(!!id);

    // Fetch data if editing
    React.useEffect(() => {
        if (id) {
            setFetching(true);
            voterService.getVoter(parseInt(id))
                .then(setInitialData)
                .finally(() => setFetching(false));
        }
    }, [id]);

    const handleSave = async (values: any) => {
        setLoading(true);
        try {
            if (id) {
                await voterService.updateVoter(parseInt(id), values);
                toast.success("Voter record updated");
            } else {
                await voterService.createVoter(values);
                toast.success("Voter registered successfully");
            }
            navigate("/dashboard/voters");
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center">Loading voter details...</div>;

    return (
        <PageShell
            title={id ? "Edit Voter" : "New Voter Registration"}
            description={id ? `Updating record for ${initialData?.fullName}` : "Add a new voter to the system"}
            breadcrumb={[
                { label: "Operations" },
                { label: "Voters", href: "/dashboard/voters" },
                { label: id ? "Edit" : "New" }
            ]}
        >
            <Card>
                <CardContent className="pt-6">
                    <VoterForm
                        initialData={initialData}
                        onSubmit={handleSave}
                        loading={loading}
                        onCancel={() => navigate("/dashboard/voters")}
                    />
                </CardContent>
            </Card>
        </PageShell>
    );
}