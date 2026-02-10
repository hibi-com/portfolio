import { z } from "zod";

export const inquiryStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "CLOSED"]);
export const inquiryPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const inquiryCategorySchema = z.enum([
    "GENERAL",
    "TECHNICAL",
    "BILLING",
    "SALES",
    "COMPLAINT",
    "FEATURE_REQUEST",
    "OTHER",
]);

export const inquirySchema = z.object({
    id: z.string().min(1),
    customerId: z.string().optional(),
    assigneeId: z.string().optional(),
    subject: z.string().min(1),
    content: z.string().min(1),
    status: inquiryStatusSchema,
    priority: inquiryPrioritySchema,
    category: inquiryCategorySchema,
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    resolvedAt: z.coerce.date().optional(),
    closedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const inquiryResponseSchema = z.object({
    id: z.string().min(1),
    inquiryId: z.string().min(1),
    userId: z.string().optional(),
    content: z.string().min(1),
    isInternal: z.boolean(),
    attachments: z.array(z.string()).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createInquiryInputSchema = z.object({
    customerId: z.string().optional(),
    assigneeId: z.string().optional(),
    subject: z.string().min(1),
    content: z.string().min(1),
    status: inquiryStatusSchema.optional(),
    priority: inquiryPrioritySchema.optional(),
    category: inquiryCategorySchema.optional(),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateInquiryInputSchema = z.object({
    customerId: z.string().optional(),
    assigneeId: z.string().optional(),
    subject: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    status: inquiryStatusSchema.optional(),
    priority: inquiryPrioritySchema.optional(),
    category: inquiryCategorySchema.optional(),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createInquiryResponseInputSchema = z.object({
    inquiryId: z.string().min(1),
    userId: z.string().optional(),
    content: z.string().min(1),
    isInternal: z.boolean().optional(),
    attachments: z.array(z.string()).optional(),
});

export type InquiryStatus = z.infer<typeof inquiryStatusSchema>;
export type InquiryPriority = z.infer<typeof inquiryPrioritySchema>;
export type InquiryCategory = z.infer<typeof inquiryCategorySchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryResponse = z.infer<typeof inquiryResponseSchema>;
export type CreateInquiryInput = z.infer<typeof createInquiryInputSchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquiryInputSchema>;
export type CreateInquiryResponseInput = z.infer<typeof createInquiryResponseInputSchema>;
