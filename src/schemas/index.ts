// src/schemas/index.ts
import * as z from "zod";

/** Backend Response Interfaces **/
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ApiErrorResponse {
  success: boolean;
  errorCode: string;
  message: string;
  validationErrors?: Record<string, string[]>;
}

/** Filter Interfaces **/
export interface BaseFilters {
  page: number;
  pageSize: number;
  search?: string;
}

export interface UserFilters extends BaseFilters {
  role?: string;
}

export interface VoterFilters extends BaseFilters {
  fromDate?: string;
  toDate?: string;
  regionId?: number;
}

/** Zod Validation Schemas **/
export const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  role: z.enum(["admin", "user", "manager"], "Select a valid role"),
  password: z.string().min(6, "Password must be at least 6 characters").or(z.literal("")).optional(),
})


export const voterSchema = z.object({
  name: z.string().min(3, "Full name is required"),
  mobile: z.string().min(7, "Enter a valid mobile number"),
  regionId: z.number(),
  districtId: z.number(),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type VoterFormValues = z.infer<typeof voterSchema>;