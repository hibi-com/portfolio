import { z } from "zod";

export const emailStatusSchema = z.enum(["PENDING", "SENT", "DELIVERED", "BOUNCED", "FAILED"]);
export const emailTemplateCategorySchema = z.enum(["MARKETING", "TRANSACTIONAL", "SUPPORT", "NOTIFICATION"]);

export const emailLogSchema = z.object({
    id: z.string().min(1),
    customerId: z.string().optional(),
    templateId: z.string().optional(),
    resendId: z.string().optional(),
    fromEmail: z.string().min(1),
    toEmail: z.string().min(1),
    ccEmail: z.string().optional(),
    bccEmail: z.string().optional(),
    subject: z.string().min(1),
    htmlContent: z.string().optional(),
    textContent: z.string().optional(),
    status: emailStatusSchema,
    errorMessage: z.string().optional(),
    sentAt: z.coerce.date().optional(),
    deliveredAt: z.coerce.date().optional(),
    openedAt: z.coerce.date().optional(),
    clickedAt: z.coerce.date().optional(),
    bouncedAt: z.coerce.date().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const emailTemplateSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    category: emailTemplateCategorySchema,
    subject: z.string().min(1),
    htmlContent: z.string().min(1),
    textContent: z.string().optional(),
    variables: z.array(z.string()).optional(),
    isActive: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const sendEmailInputSchema = z.object({
    customerId: z.string().optional(),
    templateId: z.string().optional(),
    fromEmail: z.string().optional(),
    toEmail: z.string().min(1),
    ccEmail: z.string().optional(),
    bccEmail: z.string().optional(),
    subject: z.string().min(1),
    htmlContent: z.string().optional(),
    textContent: z.string().optional(),
    variables: z.record(z.string(), z.string()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createEmailTemplateInputSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    category: emailTemplateCategorySchema.optional(),
    subject: z.string().min(1),
    htmlContent: z.string().min(1),
    textContent: z.string().optional(),
    variables: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
});

export const updateEmailTemplateInputSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    category: emailTemplateCategorySchema.optional(),
    subject: z.string().min(1).optional(),
    htmlContent: z.string().min(1).optional(),
    textContent: z.string().optional(),
    variables: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
});

export type EmailStatus = z.infer<typeof emailStatusSchema>;
export type EmailTemplateCategory = z.infer<typeof emailTemplateCategorySchema>;
export type EmailLog = z.infer<typeof emailLogSchema>;
export type EmailTemplate = z.infer<typeof emailTemplateSchema>;
export type SendEmailInput = z.infer<typeof sendEmailInputSchema>;
export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateInputSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateInputSchema>;
