import { z } from "zod";

export const dealStatusSchema = z.enum(["OPEN", "WON", "LOST", "STALLED"]);

export const dealSchema = z.object({
    id: z.string().min(1),
    customerId: z.string().optional(),
    leadId: z.string().optional(),
    stageId: z.string().min(1),
    name: z.string().min(1),
    value: z.number().min(0).optional(),
    currency: z.string().min(1),
    expectedCloseDate: z.coerce.date().optional(),
    actualCloseDate: z.coerce.date().optional(),
    status: dealStatusSchema,
    notes: z.string().optional(),
    lostReason: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createDealInputSchema = z.object({
    customerId: z.string().optional(),
    leadId: z.string().optional(),
    stageId: z.string().min(1),
    name: z.string().min(1),
    value: z.number().min(0).optional(),
    currency: z.string().optional(),
    expectedCloseDate: z.coerce.date().optional(),
    status: dealStatusSchema.optional(),
    notes: z.string().optional(),
});

export const updateDealInputSchema = z.object({
    customerId: z.string().optional(),
    stageId: z.string().optional(),
    name: z.string().min(1).optional(),
    value: z.number().min(0).optional(),
    currency: z.string().optional(),
    expectedCloseDate: z.coerce.date().optional(),
    actualCloseDate: z.coerce.date().optional(),
    status: dealStatusSchema.optional(),
    notes: z.string().optional(),
    lostReason: z.string().optional(),
});

export type DealStatus = z.infer<typeof dealStatusSchema>;
export type Deal = z.infer<typeof dealSchema>;
export type CreateDealInput = z.infer<typeof createDealInputSchema>;
export type UpdateDealInput = z.infer<typeof updateDealInputSchema>;
