//voterSchema.ts
import { z } from "zod";
import type { BaseFilters } from ".";

export const voterSchema = z.object({
    fullName: z.string().min(3, "Min 3 characters").max(150),
    dob: z.string().optional().nullable(),
    gender: z.enum(["Male", "Female"]).nullable().optional(),
    referenceNumber: z.string().min(3, "Required").max(50),
    regionId: z.string().min(1, "Region is required"), // For UI cascade logic
    districtId: z.string().min(1, "District is required"),
    voteCenterId: z.string().optional().nullable(),
    mobileNumber: z.string().max(20).optional().nullable(),
    registrationDate: z.string().min(1, "Required"),
});

export type VoterFormValues = z.infer<typeof voterSchema>;

export interface VoterFilters extends BaseFilters {
    regionId?: string;
    districtId?: string;
    voteCenterId?: string;
    from?: string;
    to?: string;
}