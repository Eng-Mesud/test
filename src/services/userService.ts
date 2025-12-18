// src/services/userService.ts
import type { UserFilters, UserFormValues } from "@/schemas/userSchema"
import api from "../api/apiClient"
import type { PaginatedResponse } from "@/schemas"
import { normalize } from "@/lib/normalize" // Import the normalizer

export const userService = {
    getUsers: async (params: UserFilters): Promise<PaginatedResponse<UserFormValues>> => {
        const res = await api.get<PaginatedResponse<UserFormValues>>("/users", { params })
        // GUARANTEE: even if res.data is null, this returns { items: [], totalCount: 0, ... }
        return normalize.paginated<UserFormValues>(res.data)
    },

    createUser: async (data: UserFormValues) => {
        const res = await api.post<UserFormValues>("/users", data)
        return res.data
    },

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
        // GUARANTEE: If the user doesn't exist, it returns these safe defaults instead of null
        return normalize.item<UserFormValues>(res.data, {
            username: "",
            role: "user",
            password: ""
        })
    },
}