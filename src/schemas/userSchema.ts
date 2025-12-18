//userSchema.ts
import { z } from "zod";
import type { BaseFilters } from ".";

export interface UserFilters extends BaseFilters {
  role?: string;
}

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(/^[A-Za-z][A-Za-z0-9_]*$/, "Username must start with a letter and contain only letters, numbers, or underscores"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["admin", "user"], "Role must be either 'Admin' or 'User'"),
})

export type UserFormValues = z.infer<typeof userSchema>;
