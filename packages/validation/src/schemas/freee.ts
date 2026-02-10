import { z } from "zod";

export const syncStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"]);
export const syncDirectionSchema = z.enum(["IMPORT", "EXPORT", "BIDIRECTIONAL"]);

export const freeeIntegrationSchema = z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    companyId: z.number().int(),
    companyName: z.string().optional(),
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    tokenExpiresAt: z.coerce.date(),
    scopes: z.array(z.string()).optional(),
    isActive: z.boolean(),
    lastSyncAt: z.coerce.date().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const syncErrorDetailSchema = z.object({
    record: z.string(),
    error: z.string(),
});

export const freeeSyncLogSchema = z.object({
    id: z.string().min(1),
    integrationId: z.string().min(1),
    direction: syncDirectionSchema,
    status: syncStatusSchema,
    entityType: z.string().min(1),
    totalRecords: z.number().int().optional(),
    successCount: z.number().int().optional(),
    errorCount: z.number().int().optional(),
    errorDetails: z.array(syncErrorDetailSchema).optional(),
    startedAt: z.coerce.date().optional(),
    completedAt: z.coerce.date().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const customerFreeeMappingSchema = z.object({
    id: z.string().min(1),
    customerId: z.string().min(1),
    freeePartnerId: z.number().int(),
    freeeCompanyId: z.number().int(),
    lastSyncAt: z.coerce.date(),
    syncHash: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const dealFreeeMappingSchema = z.object({
    id: z.string().min(1),
    dealId: z.string().min(1),
    freeeDealId: z.number().int(),
    freeeCompanyId: z.number().int(),
    lastSyncAt: z.coerce.date(),
    syncHash: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const createFreeeIntegrationInputSchema = z.object({
    userId: z.string().min(1),
    companyId: z.number().int(),
    companyName: z.string().optional(),
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    tokenExpiresAt: z.coerce.date(),
    scopes: z.array(z.string()).optional(),
});

export const updateFreeeTokensInputSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    tokenExpiresAt: z.coerce.date(),
});

export const createSyncLogInputSchema = z.object({
    integrationId: z.string().min(1),
    direction: syncDirectionSchema,
    entityType: z.string().min(1),
});

export const updateSyncLogInputSchema = z.object({
    status: syncStatusSchema.optional(),
    totalRecords: z.number().int().optional(),
    successCount: z.number().int().optional(),
    errorCount: z.number().int().optional(),
    errorDetails: z.array(syncErrorDetailSchema).optional(),
    startedAt: z.coerce.date().optional(),
    completedAt: z.coerce.date().optional(),
});

export const createCustomerMappingInputSchema = z.object({
    customerId: z.string().min(1),
    freeePartnerId: z.number().int(),
    freeeCompanyId: z.number().int(),
    syncHash: z.string().optional(),
});

export const createDealMappingInputSchema = z.object({
    dealId: z.string().min(1),
    freeeDealId: z.number().int(),
    freeeCompanyId: z.number().int(),
    syncHash: z.string().optional(),
});

export const freeePartnerSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    code: z.string().optional(),
    shortcut1: z.string().optional(),
    shortcut2: z.string().optional(),
    orgCode: z.number().int().optional(),
    countryCode: z.string().optional(),
    addressRegionCode: z.string().optional(),
    streetName1: z.string().optional(),
    streetName2: z.string().optional(),
    zipcode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
});

export const freeeOAuthTokensSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    expiresIn: z.number().int(),
    tokenType: z.string().min(1),
    scope: z.string().min(1),
    createdAt: z.number().int(),
});

export const freeeCompanySchema = z.object({
    id: z.number().int(),
    displayName: z.string().min(1),
    role: z.string().min(1),
});

export type SyncStatus = z.infer<typeof syncStatusSchema>;
export type SyncDirection = z.infer<typeof syncDirectionSchema>;
export type FreeeIntegration = z.infer<typeof freeeIntegrationSchema>;
export type SyncErrorDetail = z.infer<typeof syncErrorDetailSchema>;
export type FreeeSyncLog = z.infer<typeof freeeSyncLogSchema>;
export type CustomerFreeeMapping = z.infer<typeof customerFreeeMappingSchema>;
export type DealFreeeMapping = z.infer<typeof dealFreeeMappingSchema>;
export type CreateFreeeIntegrationInput = z.infer<typeof createFreeeIntegrationInputSchema>;
export type UpdateFreeeTokensInput = z.infer<typeof updateFreeeTokensInputSchema>;
export type CreateSyncLogInput = z.infer<typeof createSyncLogInputSchema>;
export type UpdateSyncLogInput = z.infer<typeof updateSyncLogInputSchema>;
export type CreateCustomerMappingInput = z.infer<typeof createCustomerMappingInputSchema>;
export type CreateDealMappingInput = z.infer<typeof createDealMappingInputSchema>;
export type FreeePartner = z.infer<typeof freeePartnerSchema>;
export type FreeeOAuthTokens = z.infer<typeof freeeOAuthTokensSchema>;
export type FreeeCompany = z.infer<typeof freeeCompanySchema>;
