import api from "../api/apiClient"
import type { UserFormValues, UserFilters, PaginatedResponse } from "@/schemas"

export const userService = {
    // Uses the PaginatedResponse interface for the return type
    getUsers: async (params: UserFilters): Promise<PaginatedResponse<UserFormValues>> => {
        const res = await api.get<PaginatedResponse<UserFormValues>>("/users", { params })
        return res.data
    },

    // Use UserFormValues directly instead of re-typing the object
    createUser: async (data: UserFormValues) => {
        const res = await api.post<UserFormValues>("/users", data)
        return res.data
    },

    // Use Partial<UserFormValues> to allow updating only specific fields
    updateUser: async (id: number, data: Partial<UserFormValues>) => {
        const res = await api.put<UserFormValues>(`/users/${id}`, data)
        return res.data
    },

    deleteUser: async (id: number) => {
        const res = await api.delete(`/users/${id}`)
        return res.data
    },

    getUserById: async (id: number): Promise<UserFormValues> => {
        const res = await api.get<UserFormValues>(`/users/${id}`)
        return res.data
    },
}