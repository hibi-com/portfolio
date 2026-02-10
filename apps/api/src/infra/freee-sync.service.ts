import { createHash } from "node:crypto";
import type { CustomerRepository } from "~/domain/customer";
import type { FreeeOAuthService, FreeePartner, FreeeRepository, FreeeSyncLog, FreeeSyncService } from "~/domain/freee";

const DEFAULT_FREEE_API_BASE = "https://api.freee.co.jp";

type FreeePartnersApiResponse = {
    partners: Array<{
        id: number;
        name: string;
        code?: string;
        shortcut1?: string;
        shortcut2?: string;
        org_code?: number;
        country_code?: string;
        address_attributes?: {
            prefecture_code?: number;
            street_name1?: string;
            street_name2?: string;
            zipcode?: string;
        };
        contact_name?: string;
        email?: string;
        phone?: string;
    }>;
};

type FreeeCreatePartnerApiResponse = { partner: { id: number } };

export class FreeeSyncServiceImpl implements FreeeSyncService {
    private readonly apiBase: string;

    constructor(
        private readonly freeeRepository: FreeeRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly oauthService: FreeeOAuthService,
        freeeApiBaseUrl?: string,
    ) {
        this.apiBase = freeeApiBaseUrl?.replace(/\/$/, "") ?? DEFAULT_FREEE_API_BASE;
    }

    private async ensureValidToken(integrationId: string): Promise<string> {
        const integration = await this.freeeRepository.findIntegrationById(integrationId);
        if (!integration) {
            throw new Error("Integration not found");
        }

        if (new Date() >= new Date(integration.tokenExpiresAt)) {
            const tokens = await this.oauthService.refreshTokens(integration.refreshToken);
            const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

            await this.freeeRepository.updateTokens(integrationId, {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                tokenExpiresAt: expiresAt.toISOString(),
            });

            return tokens.accessToken;
        }

        return integration.accessToken;
    }

    private computePartnerHash(partner: FreeePartner): string {
        const data = JSON.stringify({
            name: partner.name,
            code: partner.code,
            email: partner.email,
            phone: partner.phone,
            zipcode: partner.zipcode,
            streetName1: partner.streetName1,
            streetName2: partner.streetName2,
        });
        return createHash("md5").update(data).digest("hex");
    }

    private computeCustomerHash(customer: { name: string; email?: string; phone?: string }): string {
        const data = JSON.stringify({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
        });
        return createHash("md5").update(data).digest("hex");
    }

    private mapApiPartnerToFreeePartner(
        partnerData: FreeePartnersApiResponse["partners"][number],
    ): FreeePartner {
        return {
            id: partnerData.id,
            name: partnerData.name,
            code: partnerData.code,
            shortcut1: partnerData.shortcut1,
            shortcut2: partnerData.shortcut2,
            orgCode: partnerData.org_code,
            countryCode: partnerData.country_code,
            addressRegionCode: partnerData.address_attributes?.prefecture_code?.toString(),
            streetName1: partnerData.address_attributes?.street_name1,
            streetName2: partnerData.address_attributes?.street_name2,
            zipcode: partnerData.address_attributes?.zipcode,
            phone: partnerData.phone,
            email: partnerData.email,
        };
    }

    private async processPartnerFromFreee(
        partnerData: FreeePartnersApiResponse["partners"][number],
        integration: { companyId: number },
    ): Promise<void> {
        const partner = this.mapApiPartnerToFreeePartner(partnerData);
        const existingMapping = await this.freeeRepository.findCustomerMappingByFreeeId(
            partner.id,
            integration.companyId,
        );
        const newHash = this.computePartnerHash(partner);

        if (existingMapping) {
            if (existingMapping.syncHash !== newHash) {
                await this.customerRepository.update(existingMapping.customerId, {
                    name: partner.name,
                    email: partner.email,
                    phone: partner.phone,
                });
                await this.freeeRepository.updateCustomerMappingSyncHash(existingMapping.id, newHash);
            }
            return;
        }

        const customer = await this.customerRepository.create({
            name: partner.name,
            email: partner.email,
            phone: partner.phone,
            notes: "Imported from freee",
        });
        await this.freeeRepository.createCustomerMapping({
            customerId: customer.id,
            freeePartnerId: partner.id,
            freeeCompanyId: integration.companyId,
            syncHash: newHash,
        });
    }

    private async processCustomerToFreee(
        customer: { id: string; name: string; email?: string; phone?: string },
        integration: { companyId: number },
        accessToken: string,
    ): Promise<void> {
        const existingMapping = await this.freeeRepository.findCustomerMappingByCustomerId(
            customer.id,
            integration.companyId,
        );
        const newHash = this.computeCustomerHash(customer);

        if (existingMapping) {
            if (existingMapping.syncHash !== newHash) {
                const response = await fetch(
                    `${this.apiBase}/api/1/partners/${existingMapping.freeePartnerId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            company_id: integration.companyId,
                            name: customer.name,
                            email: customer.email,
                            phone: customer.phone,
                        }),
                    },
                );
                if (!response.ok) {
                    throw new Error(`Failed to update partner: ${response.status}`);
                }
                await this.freeeRepository.updateCustomerMappingSyncHash(existingMapping.id, newHash);
            }
            return;
        }

        const response = await fetch(`${this.apiBase}/api/1/partners`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                company_id: integration.companyId,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create partner: ${response.status}`);
        }

        const partnerData: FreeeCreatePartnerApiResponse = await response.json();
        await this.freeeRepository.createCustomerMapping({
            customerId: customer.id,
            freeePartnerId: partnerData.partner.id,
            freeeCompanyId: integration.companyId,
            syncHash: newHash,
        });
    }

    async syncPartnersFromFreee(integrationId: string): Promise<FreeeSyncLog> {
        const syncLog = await this.freeeRepository.createSyncLog({
            integrationId,
            direction: "IMPORT",
            entityType: "partner",
        });

        await this.freeeRepository.updateSyncLog(syncLog.id, {
            status: "IN_PROGRESS",
            startedAt: new Date().toISOString(),
        });

        const integration = await this.freeeRepository.findIntegrationById(integrationId);
        if (!integration) {
            return this.freeeRepository.updateSyncLog(syncLog.id, {
                status: "FAILED",
                errorDetails: [{ record: "", error: "Integration not found" }],
                completedAt: new Date().toISOString(),
            });
        }

        try {
            const accessToken = await this.ensureValidToken(integrationId);

            const response = await fetch(
                `${this.apiBase}/api/1/partners?company_id=${integration.companyId}&limit=100`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch partners: ${response.status}`);
            }

            const data: FreeePartnersApiResponse = await response.json();
            const partners = data.partners;
            let successCount = 0;
            let errorCount = 0;
            const errorDetails: Array<{ record: string; error: string }> = [];

            for (const partnerData of partners) {
                try {
                    await this.processPartnerFromFreee(partnerData, integration);
                    successCount++;
                } catch (error) {
                    errorCount++;
                    errorDetails.push({
                        record: `partner:${partnerData.id}`,
                        error: error instanceof Error ? error.message : String(error),
                    });
                }
            }

            await this.freeeRepository.updateLastSyncAt(integrationId);

            return this.freeeRepository.updateSyncLog(syncLog.id, {
                status: "COMPLETED",
                totalRecords: partners.length,
                successCount,
                errorCount,
                errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
                completedAt: new Date().toISOString(),
            });
        } catch (error) {
            return this.freeeRepository.updateSyncLog(syncLog.id, {
                status: "FAILED",
                errorDetails: [{ record: "", error: error instanceof Error ? error.message : String(error) }],
                completedAt: new Date().toISOString(),
            });
        }
    }

    async syncPartnersToFreee(integrationId: string): Promise<FreeeSyncLog> {
        const syncLog = await this.freeeRepository.createSyncLog({
            integrationId,
            direction: "EXPORT",
            entityType: "partner",
        });

        await this.freeeRepository.updateSyncLog(syncLog.id, {
            status: "IN_PROGRESS",
            startedAt: new Date().toISOString(),
        });

        const integration = await this.freeeRepository.findIntegrationById(integrationId);
        if (!integration) {
            return this.freeeRepository.updateSyncLog(syncLog.id, {
                status: "FAILED",
                errorDetails: [{ record: "", error: "Integration not found" }],
                completedAt: new Date().toISOString(),
            });
        }

        try {
            const accessToken = await this.ensureValidToken(integrationId);
            const customers = await this.customerRepository.findAll();

            let successCount = 0;
            let errorCount = 0;
            const errorDetails: Array<{ record: string; error: string }> = [];

            for (const customer of customers) {
                try {
                    await this.processCustomerToFreee(customer, integration, accessToken);
                    successCount++;
                } catch (error) {
                    errorCount++;
                    errorDetails.push({
                        record: `customer:${customer.id}`,
                        error: error instanceof Error ? error.message : String(error),
                    });
                }
            }

            await this.freeeRepository.updateLastSyncAt(integrationId);

            return this.freeeRepository.updateSyncLog(syncLog.id, {
                status: "COMPLETED",
                totalRecords: customers.length,
                successCount,
                errorCount,
                errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
                completedAt: new Date().toISOString(),
            });
        } catch (error) {
            return this.freeeRepository.updateSyncLog(syncLog.id, {
                status: "FAILED",
                errorDetails: [{ record: "", error: error instanceof Error ? error.message : String(error) }],
                completedAt: new Date().toISOString(),
            });
        }
    }

    async syncDealsFromFreee(integrationId: string): Promise<FreeeSyncLog> {
        const syncLog = await this.freeeRepository.createSyncLog({
            integrationId,
            direction: "IMPORT",
            entityType: "deal",
        });

        await this.freeeRepository.updateSyncLog(syncLog.id, {
            status: "IN_PROGRESS",
            startedAt: new Date().toISOString(),
        });

        return this.freeeRepository.updateSyncLog(syncLog.id, {
            status: "COMPLETED",
            totalRecords: 0,
            successCount: 0,
            errorCount: 0,
            completedAt: new Date().toISOString(),
        });
    }

    async syncDealsToFreee(integrationId: string): Promise<FreeeSyncLog> {
        const syncLog = await this.freeeRepository.createSyncLog({
            integrationId,
            direction: "EXPORT",
            entityType: "deal",
        });

        await this.freeeRepository.updateSyncLog(syncLog.id, {
            status: "IN_PROGRESS",
            startedAt: new Date().toISOString(),
        });

        return this.freeeRepository.updateSyncLog(syncLog.id, {
            status: "COMPLETED",
            totalRecords: 0,
            successCount: 0,
            errorCount: 0,
            completedAt: new Date().toISOString(),
        });
    }
}
