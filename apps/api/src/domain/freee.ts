export type {
    CreateCustomerMappingInput,
    CreateDealMappingInput,
    CreateFreeeIntegrationInput,
    CreateSyncLogInput,
    CustomerFreeeMapping,
    DealFreeeMapping,
    FreeeCompany,
    FreeeIntegration,
    FreeeOAuthTokens,
    FreeePartner,
    FreeeSyncLog,
    SyncDirection,
    SyncStatus,
    UpdateFreeeTokensInput,
    UpdateSyncLogInput,
} from "@portfolio/api/generated/zod";

import type {
    CreateCustomerMappingInput,
    CreateDealMappingInput,
    CreateFreeeIntegrationInput,
    CreateSyncLogInput,
    CustomerFreeeMapping,
    DealFreeeMapping,
    FreeeCompany,
    FreeeIntegration,
    FreeeOAuthTokens,
    FreeeSyncLog,
    UpdateFreeeTokensInput,
    UpdateSyncLogInput,
} from "@portfolio/api/generated/zod";

export interface FreeeRepository {
    findIntegrationById(id: string): Promise<FreeeIntegration | null>;
    findIntegrationByUserId(userId: string): Promise<FreeeIntegration | null>;
    findIntegrationByCompanyId(userId: string, companyId: number): Promise<FreeeIntegration | null>;
    findActiveIntegrations(): Promise<FreeeIntegration[]>;
    createIntegration(input: CreateFreeeIntegrationInput): Promise<FreeeIntegration>;
    updateTokens(id: string, input: UpdateFreeeTokensInput): Promise<FreeeIntegration>;
    updateLastSyncAt(id: string): Promise<FreeeIntegration>;
    deactivateIntegration(id: string): Promise<FreeeIntegration>;
    deleteIntegration(id: string): Promise<void>;

    findSyncLogById(id: string): Promise<FreeeSyncLog | null>;
    findSyncLogsByIntegrationId(integrationId: string, limit?: number): Promise<FreeeSyncLog[]>;
    createSyncLog(input: CreateSyncLogInput): Promise<FreeeSyncLog>;
    updateSyncLog(id: string, input: UpdateSyncLogInput): Promise<FreeeSyncLog>;

    findCustomerMappingByCustomerId(customerId: string, freeeCompanyId: number): Promise<CustomerFreeeMapping | null>;
    findCustomerMappingByFreeeId(freeePartnerId: number, freeeCompanyId: number): Promise<CustomerFreeeMapping | null>;
    createCustomerMapping(input: CreateCustomerMappingInput): Promise<CustomerFreeeMapping>;
    updateCustomerMappingSyncHash(id: string, syncHash: string): Promise<CustomerFreeeMapping>;
    deleteCustomerMapping(id: string): Promise<void>;

    findDealMappingByDealId(dealId: string, freeeCompanyId: number): Promise<DealFreeeMapping | null>;
    findDealMappingByFreeeId(freeeDealId: number, freeeCompanyId: number): Promise<DealFreeeMapping | null>;
    createDealMapping(input: CreateDealMappingInput): Promise<DealFreeeMapping>;
    updateDealMappingSyncHash(id: string, syncHash: string): Promise<DealFreeeMapping>;
    deleteDealMapping(id: string): Promise<void>;
}

export interface FreeeOAuthService {
    getAuthorizationUrl(state: string, redirectUri: string): string;
    exchangeCodeForTokens(code: string, redirectUri: string): Promise<FreeeOAuthTokens>;
    refreshTokens(refreshToken: string): Promise<FreeeOAuthTokens>;
    getCompanies(accessToken: string): Promise<FreeeCompany[]>;
}

export interface FreeeSyncService {
    syncPartnersFromFreee(integrationId: string): Promise<FreeeSyncLog>;
    syncPartnersToFreee(integrationId: string): Promise<FreeeSyncLog>;
    syncDealsFromFreee(integrationId: string): Promise<FreeeSyncLog>;
    syncDealsToFreee(integrationId: string): Promise<FreeeSyncLog>;
}
