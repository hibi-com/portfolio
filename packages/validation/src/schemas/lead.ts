import { z } from "zod";

export const leadStatusSchema = z.enum(["NEW", "CONTACTED", "QUALIFIED", "UNQUALIFIED", "CONVERTED"]);

export const leadSchema = z.object({
    id: z.string().min(1),
    customerId: z.string().optional(),
    name: z.string().min(1),
    email: z.email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    status: leadStatusSchema,
    score: z.number().int().min(0).max(100).optional(),
    notes: z.string().optional(),
    convertedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createLeadInputSchema = z.object({
    customerId: z.string().optional(),
    name: z.string().min(1),
    email: z.email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    status: leadStatusSchema.optional(),
    score: z.number().int().min(0).max(100).optional(),
    notes: z.string().optional(),
});

export const updateLeadInputSchema = z.object({
    customerId: z.string().optional(),
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.string().optional(),
    status: leadStatusSchema.optional(),
    score: z.number().int().min(0).max(100).optional(),
    notes: z.string().optional(),
});

export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type Lead = z.infer<typeof leadSchema>;
export type CreateLeadInput = z.infer<typeof createLeadInputSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadInputSchema>;
