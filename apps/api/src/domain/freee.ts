export type SyncStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
export type SyncDirection = "IMPORT" | "EXPORT" | "BIDIRECTIONAL";

export interface FreeeIntegration {
    id: string;
    userId: string;
    companyId: number;
    companyName?: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: Date;
    scopes?: string[];
    isActive: boolean;
    lastSyncAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface FreeeSyncLog {
    id: string;
    integrationId: string;
    direction: SyncDirection;
    status: SyncStatus;
    entityType: string;
    totalRecords?: number;
    successCount?: number;
    errorCount?: number;
    errorDetails?: Array<{ record: string; error: string }>;
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomerFreeeMapping {
    id: string;
    customerId: string;
    freeePartnerId: number;
    freeeCompanyId: number;
    lastSyncAt: Date;
    syncHash?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DealFreeeMapping {
    id: string;
    dealId: string;
    freeeDealId: number;
    freeeCompanyId: number;
    lastSyncAt: Date;
    syncHash?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateFreeeIntegrationInput {
    userId: string;
    companyId: number;
    companyName?: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: Date;
    scopes?: string[];
}

export interface UpdateFreeeTokensInput {
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: Date;
}

export interface CreateSyncLogInput {
    integrationId: string;
    direction: SyncDirection;
    entityType: string;
}

export interface UpdateSyncLogInput {
    status?: SyncStatus;
    totalRecords?: number;
    successCount?: number;
    errorCount?: number;
    errorDetails?: Array<{ record: string; error: string }>;
    startedAt?: Date;
    completedAt?: Date;
}

export interface CreateCustomerMappingInput {
    customerId: string;
    freeePartnerId: number;
    freeeCompanyId: number;
    syncHash?: string;
}

export interface CreateDealMappingInput {
    dealId: string;
    freeeDealId: number;
    freeeCompanyId: number;
    syncHash?: string;
}

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

export interface FreeePartner {
    id: number;
    name: string;
    code?: string;
    shortcut1?: string;
    shortcut2?: string;
    orgCode?: number;
    countryCode?: string;
    addressRegionCode?: string;
    streetName1?: string;
    streetName2?: string;
    zipcode?: string;
    phone?: string;
    email?: string;
}

export interface FreeeOAuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    scope: string;
    createdAt: number;
}

export interface FreeeCompany {
    id: number;
    displayName: string;
    role: string;
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
