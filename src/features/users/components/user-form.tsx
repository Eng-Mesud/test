"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { userSchema, type UserFormValues } from "@/schemas"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface UserFormProps {
    initialData?: any
    onSubmit: (data: UserFormValues) => void
    loading: boolean
}

export function UserForm({ initialData, onSubmit, loading }: UserFormProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            role: "user",
            password: "",
        },
    })

    // Sync form when initialData (edit mode) changes
    React.useEffect(() => {
        if (initialData) {
            form.reset({
                username: initialData.username,
                role: initialData.role,
                password: "",
            })
        } else {
            form.reset({ username: "", role: "user", password: "" })
        }
    }, [initialData, form])

    return (
        <form id="user-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                {/* Username Field */}
                <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                {...field}
                                id="username"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter username"
                                autoComplete="off"
                            />
                            <FieldDescription>
                                Unique name for account access.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Role Select Field */}
                <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="role">Role</FieldLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger id="role" aria-invalid={fieldState.invalid}>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Password Field */}
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                {...field}
                                id="password"
                                type="password"
                                aria-invalid={fieldState.invalid}
                                placeholder="••••••"
                            />
                            <FieldDescription>
                                {initialData ? "Leave blank to keep current" : "Minimum 6 characters"}
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Form Actions */}
                <Field orientation="horizontal" className="pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={loading}
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Save Changes" : "Create User"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}