// src/lib/normalize.ts
import type { PaginatedResponse } from "@/schemas";

export const normalize = {
    /** For paginated endpoints (tables, listings) */
    paginated: <T>(data: any): PaginatedResponse<T> => ({
        items: Array.isArray(data?.items) ? data.items : [],
        totalCount: typeof data?.totalCount === "number" ? data.totalCount : 0,
        page: typeof data?.page === "number" ? data.page : 1,
        pageSize: typeof data?.pageSize === "number" ? data.pageSize : 10,
    }),

    /** For lookup endpoints (dropdowns, metadata) */
    lookup: <T>(data: any): T[] => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.items)) return data.items;
        return [];
    },

    /** For single entity (edit/view forms) */
    item: <T>(data: any, fallback: T): T => {
        if (data && typeof data === "object") {
            return { ...fallback, ...data };
        }
        return fallback;
    },
};
