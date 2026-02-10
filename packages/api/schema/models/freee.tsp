enum SyncStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    FAILED,
}

enum SyncDirection {
    IMPORT,
    EXPORT,
    BIDIRECTIONAL,
}

model FreeeIntegration {
    id: string;
    userId: string;
    companyId: int32;
    companyName?: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: string;
    scopes?: string[];
    isActive: boolean;
    lastSyncAt?: string;
    createdAt: string;
    updatedAt: string;
}

model SyncErrorDetail {
    record: string;
    error: string;
}

model FreeeSyncLog {
    id: string;
    integrationId: string;
    direction: SyncDirection;
    status: SyncStatus;
    entityType: string;
    totalRecords?: int32;
    successCount?: int32;
    errorCount?: int32;
    errorDetails?: SyncErrorDetail[];
    startedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

model CustomerFreeeMapping {
    id: string;
    customerId: string;
    freeePartnerId: int32;
    freeeCompanyId: int32;
    lastSyncAt: string;
    syncHash?: string;
    createdAt: string;
    updatedAt: string;
}

model DealFreeeMapping {
    id: string;
    dealId: string;
    freeeDealId: int32;
    freeeCompanyId: int32;
    lastSyncAt: string;
    syncHash?: string;
    createdAt: string;
    updatedAt: string;
}

model CreateFreeeIntegrationInput {
    userId: string;
    companyId: int32;
    companyName?: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: string;
    scopes?: string[];
}

model UpdateFreeeTokensInput {
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: string;
}

model CreateSyncLogInput {
    integrationId: string;
    direction: SyncDirection;
    entityType: string;
}

model UpdateSyncLogInput {
    status?: SyncStatus;
    totalRecords?: int32;
    successCount?: int32;
    errorCount?: int32;
    errorDetails?: SyncErrorDetail[];
    startedAt?: string;
    completedAt?: string;
}

model CreateCustomerMappingInput {
    customerId: string;
    freeePartnerId: int32;
    freeeCompanyId: int32;
    syncHash?: string;
}

model CreateDealMappingInput {
    dealId: string;
    freeeDealId: int32;
    freeeCompanyId: int32;
    syncHash?: string;
}

model FreeePartner {
    id: int32;
    name: string;
    code?: string;
    shortcut1?: string;
    shortcut2?: string;
    orgCode?: int32;
    countryCode?: string;
    addressRegionCode?: string;
    streetName1?: string;
    streetName2?: string;
    zipcode?: string;
    phone?: string;
    email?: string;
}

model FreeeOAuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: int32;
    tokenType: string;
    scope: string;
    createdAt: int32;
}

model FreeeCompany {
    id: int32;
    displayName: string;
    role: string;
}

model FreeeAuthUrlResponse {
    url: string;
}

model FreeeCallbackInput {
    code: string;
    state: string;
}
