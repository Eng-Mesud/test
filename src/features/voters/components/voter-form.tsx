//voterform
"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { voterSchema, type VoterFormValues } from "@/schemas/voterSchema"
import { voterService } from "@/services/voterService"
import { FormInput } from "@/components/shared/form/form-input"
import { FormSelect } from "@/components/shared/form/form-select"
import { FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function VoterForm({ initialData, onSubmit, loading, onCancel }: any) {
    const [regions, setRegions] = React.useState([]);
    const [districts, setDistricts] = React.useState([]);
    const [centers, setCenters] = React.useState([]);

    const form = useForm<VoterFormValues>({
        resolver: zodResolver(voterSchema),
        defaultValues: {
            fullName: initialData?.fullName || "",
            referenceNumber: initialData?.referenceNumber || "",
            gender: initialData?.gender || "Male",
            dob: initialData?.dob || "",
            mobileNumber: initialData?.mobileNumber || "",
            registrationDate: initialData?.registrationDate || new Date().toISOString().split('T')[0],
            regionId: initialData?.regionId?.toString() || "",
            districtId: initialData?.districtId?.toString() || "",
            voteCenterId: initialData?.voteCenterId?.toString() || "",
        }
    });

    const selectedRegion = useWatch({ control: form.control, name: "regionId" });
    const selectedDistrict = useWatch({ control: form.control, name: "districtId" });

    React.useEffect(() => {
        // voterService.getRegions() is now guaranteed to return an array [ ]
        voterService.getRegions().then(setRegions);
    }, []);

    React.useEffect(() => {
        if (selectedRegion) {
            voterService.getDistricts(selectedRegion).then((data) => {
                // data is guaranteed to be an array, even if the region has no districts
                setDistricts(data);
                if (initialData?.regionId?.toString() !== selectedRegion) {
                    form.setValue("districtId", "");
                    form.setValue("voteCenterId", "");
                }
            });
        } else {
            setDistricts([]);
        }
    }, [selectedRegion]);
    // 3. Cascade: District -> Vote Centers
    React.useEffect(() => {
        if (selectedDistrict) {
            voterService.getVoteCenters(selectedDistrict).then((data) => {
                setCenters(data);
                // Only reset center if the new district doesn't match the initial data's district
                if (initialData?.districtId?.toString() !== selectedDistrict) {
                    form.setValue("voteCenterId", "");
                }
            });
        } else {
            setCenters([]);
        }
    }, [selectedDistrict, form, initialData]);

    // 4. Handle conversion from String (Select) to Long (Backend)
    const handleFormSubmit = (values: VoterFormValues) => {
        const formattedValues = {
            ...values,
            districtId: parseInt(values.districtId),
            voteCenterId: values.voteCenterId ? parseInt(values.voteCenterId) : null,
            // dob can be null in your backend Voter class
            dob: values.dob || null,
        };
        onSubmit(formattedValues);
    };

    return (
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput control={form.control} name="fullName" label="Full Name" placeholder="Enter full name" />
                <FormInput control={form.control} name="referenceNumber" label="Reference / ID Number" placeholder="REF-0000" />

                <FormSelect
                    control={form.control}
                    name="gender"
                    label="Gender"
                    options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" }
                    ]}
                />

                <FormInput control={form.control} name="dob" label="Date of Birth" type="date" />

                <FormSelect
                    control={form.control}
                    name="regionId"
                    label="Region"
                    options={regions.map((r: any) => ({ label: r.name, value: r.id.toString() }))}
                />

                <FormSelect
                    control={form.control}
                    name="districtId"
                    label="District"
                    disabled={!selectedRegion}
                    options={districts.map((d: any) => ({ label: d.name, value: d.id.toString() }))}
                />

                <FormSelect
                    control={form.control}
                    name="voteCenterId"
                    label="Vote Center (Optional)"
                    disabled={!selectedDistrict}
                    options={centers.map((c: any) => ({ label: c.name, value: c.id.toString() }))}
                />

                <FormInput control={form.control} name="mobileNumber" label="Mobile Number" placeholder="e.g. 061xxxxxxx" />

                <div className="md:col-span-2">
                    <FormInput control={form.control} name="registrationDate" label="Registration Date" type="date" />
                </div>
            </FieldGroup>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        initialData ? "Update Voter" : "Register Voter"
                    )}
                </Button>
            </div>
        </form>
    )
}