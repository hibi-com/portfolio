import { beforeEach, describe, expect, test, vi } from "vitest";
import type { CustomerRepository } from "~/domain/customer";
import type { FreeeIntegration, FreeeOAuthService, FreeeRepository } from "~/domain/freee";
import { FreeeSyncServiceImpl } from "./freee-sync.service";

const mockFreeeRepository: FreeeRepository = {
	findIntegrationById: vi.fn(),
	findIntegrationByUserId: vi.fn(),
	findIntegrationByCompanyId: vi.fn(),
	findActiveIntegrations: vi.fn(),
	createIntegration: vi.fn(),
	updateTokens: vi.fn(),
	updateLastSyncAt: vi.fn(),
	deactivateIntegration: vi.fn(),
	deleteIntegration: vi.fn(),
	findSyncLogById: vi.fn(),
	findSyncLogsByIntegrationId: vi.fn(),
	createSyncLog: vi.fn(),
	updateSyncLog: vi.fn(),
	findCustomerMappingByCustomerId: vi.fn(),
	findCustomerMappingByFreeeId: vi.fn(),
	createCustomerMapping: vi.fn(),
	updateCustomerMappingSyncHash: vi.fn(),
	deleteCustomerMapping: vi.fn(),
	findDealMappingByDealId: vi.fn(),
	findDealMappingByFreeeId: vi.fn(),
	createDealMapping: vi.fn(),
	updateDealMappingSyncHash: vi.fn(),
	deleteDealMapping: vi.fn(),
};

const mockCustomerRepository: CustomerRepository = {
	findAll: vi.fn(),
	findById: vi.fn(),
	findByEmail: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
};

const mockOAuthService: FreeeOAuthService = {
	getAuthorizationUrl: vi.fn(),
	exchangeCodeForTokens: vi.fn(),
	refreshTokens: vi.fn(),
	getCompanies: vi.fn(),
};

global.fetch = vi.fn();

describe("FreeeSyncServiceImpl", () => {
	let service: FreeeSyncServiceImpl;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new FreeeSyncServiceImpl(mockFreeeRepository, mockCustomerRepository, mockOAuthService);
	});

	const mockIntegration: FreeeIntegration = {
		id: "integration-uuid-1",
		userId: "user-uuid-1",
		companyId: 123456,
		accessToken: "access-token-1",
		refreshToken: "refresh-token-1",
		tokenExpiresAt: new Date("2025-12-31T00:00:00Z"),
		isActive: true,
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	const mockSyncLog = {
		id: "log-uuid-1",
		integrationId: "integration-uuid-1",
		direction: "IMPORT" as const,
		status: "PENDING" as const,
		entityType: "partner",
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	describe("syncPartnersFromFreee", () => {
		describe("正常系", () => {
			test("freeeから取引先を同期できる", async () => {
				// Given: 連携情報が存在し、freee APIが成功する場合
				vi.mocked(mockFreeeRepository.createSyncLog).mockResolvedValue(mockSyncLog);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					status: "IN_PROGRESS",
					startedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.findIntegrationById).mockResolvedValue(mockIntegration);
				vi.mocked(mockOAuthService.refreshTokens).mockResolvedValue({
					accessToken: "new-access-token",
					refreshToken: "new-refresh-token",
					expiresIn: 3600,
					tokenType: "Bearer",
					scope: "read write",
					createdAt: Date.now() / 1000,
				});
				vi.mocked(mockFreeeRepository.updateTokens).mockResolvedValue(mockIntegration);
				vi.mocked(fetch).mockResolvedValue({
					ok: true,
					json: async () => ({
						partners: [
							{
								id: 12345,
								name: "Test Partner",
								code: "P001",
								email: "partner@example.com",
								phone: "03-1234-5678",
							},
						],
					}),
				} as Response);
				vi.mocked(mockFreeeRepository.findCustomerMappingByFreeeId).mockResolvedValue(null);
				vi.mocked(mockCustomerRepository.create).mockResolvedValue({
					id: "customer-uuid-1",
					name: "Test Partner",
					email: "partner@example.com",
					phone: "03-1234-5678",
					status: "PROSPECT",
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.createCustomerMapping).mockResolvedValue({
					id: "mapping-uuid-1",
					customerId: "customer-uuid-1",
					freeePartnerId: 12345,
					freeeCompanyId: 123456,
					lastSyncAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.updateLastSyncAt).mockResolvedValue(mockIntegration);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					status: "COMPLETED",
					totalRecords: 1,
					successCount: 1,
					errorCount: 0,
					completedAt: new Date(),
				});

				// When: freeeから取引先を同期
				const result = await service.syncPartnersFromFreee("integration-uuid-1");

				// Then: 同期が成功する
				expect(result.status).toBe("COMPLETED");
				expect(result.successCount).toBe(1);
				expect(result.errorCount).toBe(0);
				expect(mockCustomerRepository.create).toHaveBeenCalledWith(
					expect.objectContaining({
						name: "Test Partner",
						email: "partner@example.com",
					}),
				);
			});

			test("既存の取引先が変更されている場合は更新される", async () => {
				// Given: 既存マッピングが存在し、ハッシュが異なる場合
				vi.mocked(mockFreeeRepository.createSyncLog).mockResolvedValue(mockSyncLog);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					status: "IN_PROGRESS",
					startedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.findIntegrationById).mockResolvedValue(mockIntegration);
				vi.mocked(fetch).mockResolvedValue({
					ok: true,
					json: async () => ({
						partners: [
							{
								id: 12345,
								name: "Updated Partner",
								email: "updated@example.com",
							},
						],
					}),
				} as Response);
				vi.mocked(mockFreeeRepository.findCustomerMappingByFreeeId).mockResolvedValue({
					id: "mapping-uuid-1",
					customerId: "customer-uuid-1",
					freeePartnerId: 12345,
					freeeCompanyId: 123456,
					syncHash: "old-hash",
					lastSyncAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				vi.mocked(mockCustomerRepository.update).mockResolvedValue({
					id: "customer-uuid-1",
					name: "Updated Partner",
					email: "updated@example.com",
					status: "PROSPECT",
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.updateCustomerMappingSyncHash).mockResolvedValue({
					id: "mapping-uuid-1",
					customerId: "customer-uuid-1",
					freeePartnerId: 12345,
					freeeCompanyId: 123456,
					syncHash: "new-hash",
					lastSyncAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.updateLastSyncAt).mockResolvedValue(mockIntegration);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					status: "COMPLETED",
					totalRecords: 1,
					successCount: 1,
					errorCount: 0,
					completedAt: new Date(),
				});

				// When: 同期を実行
				const result = await service.syncPartnersFromFreee("integration-uuid-1");

				// Then: 顧客が更新される
				expect(result.status).toBe("COMPLETED");
				expect(mockCustomerRepository.update).toHaveBeenCalledWith(
					"customer-uuid-1",
					expect.objectContaining({
						name: "Updated Partner",
						email: "updated@example.com",
					}),
				);
			});
		});

		describe("異常系", () => {
			test("連携情報が存在しない場合はFAILEDステータスになる", async () => {
				// Given: 連携情報が存在しない場合
				vi.mocked(mockFreeeRepository.createSyncLog).mockResolvedValue(mockSyncLog);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					status: "IN_PROGRESS",
					startedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.findIntegrationById).mockResolvedValue(null);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					status: "FAILED",
					errorDetails: [{ record: "", error: "Integration not found" }],
					completedAt: new Date(),
				});

				// When: 同期を実行
				const result = await service.syncPartnersFromFreee("integration-uuid-1");

				// Then: FAILEDステータスになる
				expect(result.status).toBe("FAILED");
				expect(result.errorDetails).toEqual([{ record: "", error: "Integration not found" }]);
			});

			test("freee APIがエラーを返す場合はFAILEDステータスになる", async () => {
				// Given: freee APIがエラーを返す場合
				vi.mocked(mockFreeeRepository.createSyncLog).mockResolvedValue(mockSyncLog);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					status: "IN_PROGRESS",
					startedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.findIntegrationById).mockResolvedValue(mockIntegration);
				vi.mocked(fetch).mockResolvedValue({
					ok: false,
					status: 401,
				} as Response);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					status: "FAILED",
					errorDetails: [{ record: "", error: "Failed to fetch partners: 401" }],
					completedAt: new Date(),
				});

				// When: 同期を実行
				const result = await service.syncPartnersFromFreee("integration-uuid-1");

				// Then: FAILEDステータスになる
				expect(result.status).toBe("FAILED");
			});
		});
	});

	describe("syncPartnersToFreee", () => {
		describe("正常系", () => {
			test("顧客をfreeeに同期できる", async () => {
				// Given: 顧客が存在し、freee APIが成功する場合
				vi.mocked(mockFreeeRepository.createSyncLog).mockResolvedValue({
					...mockSyncLog,
					direction: "EXPORT",
				});
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					direction: "EXPORT",
					status: "IN_PROGRESS",
					startedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.findIntegrationById).mockResolvedValue(mockIntegration);
				vi.mocked(mockCustomerRepository.findAll).mockResolvedValue([
					{
						id: "customer-uuid-1",
						name: "Test Customer",
						email: "customer@example.com",
						phone: "03-1234-5678",
						status: "ACTIVE",
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				]);
				vi.mocked(mockFreeeRepository.findCustomerMappingByCustomerId).mockResolvedValue(null);
				vi.mocked(fetch).mockResolvedValue({
					ok: true,
					json: async () => ({
						partner: {
							id: 12345,
						},
					}),
				} as Response);
				vi.mocked(mockFreeeRepository.createCustomerMapping).mockResolvedValue({
					id: "mapping-uuid-1",
					customerId: "customer-uuid-1",
					freeePartnerId: 12345,
					freeeCompanyId: 123456,
					lastSyncAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				vi.mocked(mockFreeeRepository.updateLastSyncAt).mockResolvedValue(mockIntegration);
				vi.mocked(mockFreeeRepository.updateSyncLog).mockResolvedValue({
					...mockSyncLog,
					direction: "EXPORT",
					status: "COMPLETED",
					totalRecords: 1,
					successCount: 1,
					errorCount: 0,
					completedAt: new Date(),
				});

				// When: 顧客をfreeeに同期
				const result = await service.syncPartnersToFreee("integration-uuid-1");

				// Then: 同期が成功する
				expect(result.status).toBe("COMPLETED");
				expect(result.successCount).toBe(1);
				expect(fetch).toHaveBeenCalledWith(
					"https://api.freee.co.jp/api/1/partners",
					expect.objectContaining({
						method: "POST",
					}),
				);
			});
		});
	});
});
