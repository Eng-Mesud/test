//user-form.tsx
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { FormInput } from "@/components/shared/form/form-input"
import { FormSelect } from "@/components/shared/form/form-select"
import { FormPassword } from "@/components/shared/form/form-password"
import { Loader2 } from "lucide-react"
import type { UserFormValues } from "@/schemas/userSchema"
import { userSchema } from "@/schemas/userSchema"

interface UserFormProps {
    initialData?: any
    onSubmit: (data: UserFormValues) => void
    loading: boolean
    onCancel: () => void
}

const ROLE_OPTIONS = [
    { label: "Administrator", value: "admin" },
    { label: "Standard User", value: "user" },
]

export function UserForm({ initialData, onSubmit, loading, onCancel }: UserFormProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            role: "user",
            password: "",
        },
    })

    React.useEffect(() => {
        if (initialData) {
            form.reset({
                username: initialData.username || "",
                role: initialData.role || "user",
                password: "",
            })
        }
    }, [initialData, form])

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
                <FormInput
                    control={form.control}
                    name="username"
                    label="Username"
                    placeholder="Enter username"
                    description="Unique name for account access."
                />

                <FormSelect
                    control={form.control}
                    name="role"
                    label="Access Level"
                    options={ROLE_OPTIONS}
                />

                <FormPassword
                    control={form.control}
                    name="password"
                    label="Password"
                    description={initialData ? "Leave blank to keep current" : "Minimum 6 characters"}
                />
            </FieldGroup>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[100px]">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update User" : "Create User"}
                </Button>
            </div>
        </form>
    )
}