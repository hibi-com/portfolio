import { z } from "zod";

export const customerStatusSchema = z.enum(["ACTIVE", "INACTIVE", "PROSPECT", "CHURNED"]);

export const customerSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    website: z.url().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    status: customerStatusSchema,
    tags: z.array(z.string()).optional(),
    customFields: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createCustomerInputSchema = z.object({
    name: z.string().min(1),
    email: z.email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    website: z.url().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    status: customerStatusSchema.optional(),
    tags: z.array(z.string()).optional(),
    customFields: z.record(z.string(), z.unknown()).optional(),
});

export const updateCustomerInputSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    website: z.url().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    status: customerStatusSchema.optional(),
    tags: z.array(z.string()).optional(),
    customFields: z.record(z.string(), z.unknown()).optional(),
});

export type CustomerStatus = z.infer<typeof customerStatusSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerInputSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerInputSchema>;
