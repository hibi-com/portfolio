import type { PrismaClient } from "@portfolio/db";
import type {
    CreateCustomerMappingInput,
    CreateDealMappingInput,
    CreateFreeeIntegrationInput,
    CreateSyncLogInput,
    CustomerFreeeMapping,
    DealFreeeMapping,
    FreeeIntegration,
    FreeeRepository,
    FreeeSyncLog,
    SyncDirection,
    SyncStatus,
    UpdateFreeeTokensInput,
    UpdateSyncLogInput,
} from "~/domain/freee";

export class FreeeRepositoryImpl implements FreeeRepository {
    private readonly prisma: PrismaClient;

    constructor(databaseUrl?: string) {
        this.prisma = new PrismaClient({
            datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
        });
    }

    private parseJsonField<T>(value: string | null | undefined): T | undefined {
        if (!value) return undefined;
        try {
            return JSON.parse(value) as T;
        } catch {
            return undefined;
        }
    }

    private stringifyJsonField(value: unknown): string | null {
        if (value === undefined || value === null) return null;
        return JSON.stringify(value);
    }

    private mapToIntegration(record: {
        id: string;
        userId: string;
        companyId: number;
        companyName: string | null;
        accessToken: string;
        refreshToken: string;
        tokenExpiresAt: Date;
        scopes: string | null;
        isActive: boolean;
        lastSyncAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }): FreeeIntegration {
        return {
            id: record.id,
            userId: record.userId,
            companyId: record.companyId,
            companyName: record.companyName ?? undefined,
            accessToken: record.accessToken,
            refreshToken: record.refreshToken,
            tokenExpiresAt: record.tokenExpiresAt,
            scopes: this.parseJsonField<string[]>(record.scopes),
            isActive: record.isActive,
            lastSyncAt: record.lastSyncAt ?? undefined,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }

    private mapToSyncLog(record: {
        id: string;
        integrationId: string;
        direction: string;
        status: string;
        entityType: string;
        totalRecords: number | null;
        successCount: number | null;
        errorCount: number | null;
        errorDetails: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }): FreeeSyncLog {
        return {
            id: record.id,
            integrationId: record.integrationId,
            direction: record.direction as SyncDirection,
            status: record.status as SyncStatus,
            entityType: record.entityType,
            totalRecords: record.totalRecords ?? undefined,
            successCount: record.successCount ?? undefined,
            errorCount: record.errorCount ?? undefined,
            errorDetails: this.parseJsonField<Array<{ record: string; error: string }>>(record.errorDetails),
            startedAt: record.startedAt ?? undefined,
            completedAt: record.completedAt ?? undefined,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }

    private mapToCustomerMapping(record: {
        id: string;
        customerId: string;
        freeePartnerId: number;
        freeeCompanyId: number;
        lastSyncAt: Date;
        syncHash: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): CustomerFreeeMapping {
        return {
            id: record.id,
            customerId: record.customerId,
            freeePartnerId: record.freeePartnerId,
            freeeCompanyId: record.freeeCompanyId,
            lastSyncAt: record.lastSyncAt,
            syncHash: record.syncHash ?? undefined,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }

    private mapToDealMapping(record: {
        id: string;
        dealId: string;
        freeeDealId: number;
        freeeCompanyId: number;
        lastSyncAt: Date;
        syncHash: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): DealFreeeMapping {
        return {
            id: record.id,
            dealId: record.dealId,
            freeeDealId: record.freeeDealId,
            freeeCompanyId: record.freeeCompanyId,
            lastSyncAt: record.lastSyncAt,
            syncHash: record.syncHash ?? undefined,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }

    async findIntegrationById(id: string): Promise<FreeeIntegration | null> {
        const integration = await this.prisma.freeeIntegration.findUnique({
            where: { id },
        });
        return integration ? this.mapToIntegration(integration) : null;
    }

    async findIntegrationByUserId(userId: string): Promise<FreeeIntegration | null> {
        const integration = await this.prisma.freeeIntegration.findFirst({
            where: { userId, isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return integration ? this.mapToIntegration(integration) : null;
    }

    async findIntegrationByCompanyId(userId: string, companyId: number): Promise<FreeeIntegration | null> {
        const integration = await this.prisma.freeeIntegration.findUnique({
            where: { userId_companyId: { userId, companyId } },
        });
        return integration ? this.mapToIntegration(integration) : null;
    }

    async findActiveIntegrations(): Promise<FreeeIntegration[]> {
        const integrations = await this.prisma.freeeIntegration.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return integrations.map((i) => this.mapToIntegration(i));
    }

    async createIntegration(input: CreateFreeeIntegrationInput): Promise<FreeeIntegration> {
        const integration = await this.prisma.freeeIntegration.create({
            data: {
                userId: input.userId,
                companyId: input.companyId,
                companyName: input.companyName,
                accessToken: input.accessToken,
                refreshToken: input.refreshToken,
                tokenExpiresAt: input.tokenExpiresAt,
                scopes: this.stringifyJsonField(input.scopes),
            },
        });
        return this.mapToIntegration(integration);
    }

    async updateTokens(id: string, input: UpdateFreeeTokensInput): Promise<FreeeIntegration> {
        const integration = await this.prisma.freeeIntegration.update({
            where: { id },
            data: {
                accessToken: input.accessToken,
                refreshToken: input.refreshToken,
                tokenExpiresAt: input.tokenExpiresAt,
            },
        });
        return this.mapToIntegration(integration);
    }

    async updateLastSyncAt(id: string): Promise<FreeeIntegration> {
        const integration = await this.prisma.freeeIntegration.update({
            where: { id },
            data: { lastSyncAt: new Date() },
        });
        return this.mapToIntegration(integration);
    }

    async deactivateIntegration(id: string): Promise<FreeeIntegration> {
        const integration = await this.prisma.freeeIntegration.update({
            where: { id },
            data: { isActive: false },
        });
        return this.mapToIntegration(integration);
    }

    async deleteIntegration(id: string): Promise<void> {
        await this.prisma.freeeIntegration.delete({
            where: { id },
        });
    }

    async findSyncLogById(id: string): Promise<FreeeSyncLog | null> {
        const log = await this.prisma.freeeSyncLog.findUnique({
            where: { id },
        });
        return log ? this.mapToSyncLog(log) : null;
    }

    async findSyncLogsByIntegrationId(integrationId: string, limit = 20): Promise<FreeeSyncLog[]> {
        const logs = await this.prisma.freeeSyncLog.findMany({
            where: { integrationId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
        return logs.map((l) => this.mapToSyncLog(l));
    }

    async createSyncLog(input: CreateSyncLogInput): Promise<FreeeSyncLog> {
        const log = await this.prisma.freeeSyncLog.create({
            data: {
                integrationId: input.integrationId,
                direction: input.direction,
                entityType: input.entityType,
            },
        });
        return this.mapToSyncLog(log);
    }

    async updateSyncLog(id: string, input: UpdateSyncLogInput): Promise<FreeeSyncLog> {
        const log = await this.prisma.freeeSyncLog.update({
            where: { id },
            data: {
                status: input.status,
                totalRecords: input.totalRecords,
                successCount: input.successCount,
                errorCount: input.errorCount,
                errorDetails: this.stringifyJsonField(input.errorDetails),
                startedAt: input.startedAt,
                completedAt: input.completedAt,
            },
        });
        return this.mapToSyncLog(log);
    }

    async findCustomerMappingByCustomerId(
        customerId: string,
        freeeCompanyId: number,
    ): Promise<CustomerFreeeMapping | null> {
        const mapping = await this.prisma.customerFreeeMapping.findUnique({
            where: { customerId_freeeCompanyId: { customerId, freeeCompanyId } },
        });
        return mapping ? this.mapToCustomerMapping(mapping) : null;
    }

    async findCustomerMappingByFreeeId(
        freeePartnerId: number,
        freeeCompanyId: number,
    ): Promise<CustomerFreeeMapping | null> {
        const mapping = await this.prisma.customerFreeeMapping.findUnique({
            where: { freeePartnerId_freeeCompanyId: { freeePartnerId, freeeCompanyId } },
        });
        return mapping ? this.mapToCustomerMapping(mapping) : null;
    }

    async createCustomerMapping(input: CreateCustomerMappingInput): Promise<CustomerFreeeMapping> {
        const mapping = await this.prisma.customerFreeeMapping.create({
            data: {
                customerId: input.customerId,
                freeePartnerId: input.freeePartnerId,
                freeeCompanyId: input.freeeCompanyId,
                lastSyncAt: new Date(),
                syncHash: input.syncHash,
            },
        });
        return this.mapToCustomerMapping(mapping);
    }

    async updateCustomerMappingSyncHash(id: string, syncHash: string): Promise<CustomerFreeeMapping> {
        const mapping = await this.prisma.customerFreeeMapping.update({
            where: { id },
            data: { syncHash, lastSyncAt: new Date() },
        });
        return this.mapToCustomerMapping(mapping);
    }

    async deleteCustomerMapping(id: string): Promise<void> {
        await this.prisma.customerFreeeMapping.delete({
            where: { id },
        });
    }

    async findDealMappingByDealId(dealId: string, freeeCompanyId: number): Promise<DealFreeeMapping | null> {
        const mapping = await this.prisma.dealFreeeMapping.findUnique({
            where: { dealId_freeeCompanyId: { dealId, freeeCompanyId } },
        });
        return mapping ? this.mapToDealMapping(mapping) : null;
    }

    async findDealMappingByFreeeId(freeeDealId: number, freeeCompanyId: number): Promise<DealFreeeMapping | null> {
        const mapping = await this.prisma.dealFreeeMapping.findUnique({
            where: { freeeDealId_freeeCompanyId: { freeeDealId, freeeCompanyId } },
        });
        return mapping ? this.mapToDealMapping(mapping) : null;
    }

    async createDealMapping(input: CreateDealMappingInput): Promise<DealFreeeMapping> {
        const mapping = await this.prisma.dealFreeeMapping.create({
            data: {
                dealId: input.dealId,
                freeeDealId: input.freeeDealId,
                freeeCompanyId: input.freeeCompanyId,
                lastSyncAt: new Date(),
                syncHash: input.syncHash,
            },
        });
        return this.mapToDealMapping(mapping);
    }

    async updateDealMappingSyncHash(id: string, syncHash: string): Promise<DealFreeeMapping> {
        const mapping = await this.prisma.dealFreeeMapping.update({
            where: { id },
            data: { syncHash, lastSyncAt: new Date() },
        });
        return this.mapToDealMapping(mapping);
    }

    async deleteDealMapping(id: string): Promise<void> {
        await this.prisma.dealFreeeMapping.delete({
            where: { id },
        });
    }
}
