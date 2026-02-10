import { beforeEach, describe, expect, test, vi } from "vitest";
import type { SyncDirection, SyncStatus } from "~/domain/freee";
import { FreeeRepositoryImpl } from "./freee.repository";

const mockPrismaClient = {
	freeeIntegration: {
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		findMany: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	freeeSyncLog: {
		findUnique: vi.fn(),
		findMany: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
	},
	customerFreeeMapping: {
		findUnique: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	dealFreeeMapping: {
		findUnique: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
};

vi.mock("@portfolio/db", () => ({
	createPrismaClient: () => mockPrismaClient,
}));

describe("FreeeRepositoryImpl", () => {
	let repository: FreeeRepositoryImpl;

	beforeEach(() => {
		vi.clearAllMocks();
		repository = new FreeeRepositoryImpl();
	});

	const mockIntegrationData = {
		id: "integration-uuid-1",
		userId: "user-uuid-1",
		companyId: 123456,
		companyName: "Test Company",
		accessToken: "access-token-1",
		refreshToken: "refresh-token-1",
		tokenExpiresAt: new Date("2025-12-31T00:00:00Z"),
		scopes: '["read", "write"]',
		isActive: true,
		lastSyncAt: new Date("2025-01-01T00:00:00Z"),
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	const mockSyncLogData = {
		id: "log-uuid-1",
		integrationId: "integration-uuid-1",
		direction: "IMPORT" as SyncDirection,
		status: "COMPLETED" as SyncStatus,
		entityType: "partner",
		totalRecords: 10,
		successCount: 9,
		errorCount: 1,
		errorDetails: '[{"record": "partner:123", "error": "Duplicate email"}]',
		startedAt: new Date("2025-01-01T10:00:00Z"),
		completedAt: new Date("2025-01-01T10:05:00Z"),
		createdAt: new Date("2025-01-01T10:00:00Z"),
		updatedAt: new Date("2025-01-01T10:05:00Z"),
	};

	const mockCustomerMappingData = {
		id: "mapping-uuid-1",
		customerId: "customer-uuid-1",
		freeePartnerId: 12345,
		freeeCompanyId: 123456,
		lastSyncAt: new Date("2025-01-01T00:00:00Z"),
		syncHash: "hash123",
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	describe("findIntegrationById", () => {
		describe("正常系", () => {
			test("IDで連携情報を取得できる", async () => {
				// Given: 連携情報が存在する場合
				mockPrismaClient.freeeIntegration.findUnique.mockResolvedValue(mockIntegrationData);

				// When: IDで連携情報を取得
				const result = await repository.findIntegrationById("integration-uuid-1");

				// Then: 連携情報が返却される
				expect(result).not.toBeNull();
				expect(result?.id).toBe("integration-uuid-1");
				expect(result?.scopes).toEqual(["read", "write"]);
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はnullを返す", async () => {
				// Given: 連携情報が存在しない場合
				mockPrismaClient.freeeIntegration.findUnique.mockResolvedValue(null);

				// When: IDで連携情報を取得
				const result = await repository.findIntegrationById("non-existent");

				// Then: nullが返却される
				expect(result).toBeNull();
			});
		});
	});

	describe("findIntegrationByUserId", () => {
		describe("正常系", () => {
			test("ユーザーIDでアクティブな連携情報を取得できる", async () => {
				// Given: アクティブな連携情報が存在する場合
				mockPrismaClient.freeeIntegration.findFirst.mockResolvedValue(mockIntegrationData);

				// When: ユーザーIDで連携情報を取得
				const result = await repository.findIntegrationByUserId("user-uuid-1");

				// Then: 連携情報が返却される
				expect(result).not.toBeNull();
				expect(result?.userId).toBe("user-uuid-1");
			});
		});
	});

	describe("createIntegration", () => {
		describe("正常系", () => {
			test("新しい連携情報を作成できる", async () => {
				// Given: 作成用データ
				const createData = {
					userId: "user-uuid-1",
					companyId: 123456,
					companyName: "Test Company",
					accessToken: "access-token-1",
					refreshToken: "refresh-token-1",
					tokenExpiresAt: new Date("2025-12-31T00:00:00Z"),
				};
				mockPrismaClient.freeeIntegration.create.mockResolvedValue({
					...mockIntegrationData,
					...createData,
					id: "new-integration-uuid",
				});

				// When: 連携情報を作成
				const result = await repository.createIntegration(createData);

				// Then: 連携情報が作成される
				expect(result.id).toBe("new-integration-uuid");
				expect(result.companyId).toBe(123456);
			});
		});
	});

	describe("updateTokens", () => {
		describe("正常系", () => {
			test("トークンを更新できる", async () => {
				// Given: トークン更新用データ
				const updateData = {
					accessToken: "new-access-token",
					refreshToken: "new-refresh-token",
					tokenExpiresAt: new Date("2026-01-01T00:00:00Z"),
				};
				mockPrismaClient.freeeIntegration.update.mockResolvedValue({
					...mockIntegrationData,
					...updateData,
				});

				// When: トークンを更新
				const result = await repository.updateTokens("integration-uuid-1", updateData);

				// Then: トークンが更新される
				expect(result.accessToken).toBe("new-access-token");
				expect(result.refreshToken).toBe("new-refresh-token");
			});
		});
	});

	describe("updateLastSyncAt", () => {
		describe("正常系", () => {
			test("最終同期日時を更新できる", async () => {
				// Given: 連携情報が存在する場合
				mockPrismaClient.freeeIntegration.update.mockResolvedValue({
					...mockIntegrationData,
					lastSyncAt: new Date("2025-01-02T00:00:00Z"),
				});

				// When: 最終同期日時を更新
				const result = await repository.updateLastSyncAt("integration-uuid-1");

				// Then: 最終同期日時が更新される
				expect(result.lastSyncAt).toBeDefined();
			});
		});
	});

	describe("deactivateIntegration", () => {
		describe("正常系", () => {
			test("連携情報を無効化できる", async () => {
				// Given: 連携情報が存在する場合
				mockPrismaClient.freeeIntegration.update.mockResolvedValue({
					...mockIntegrationData,
					isActive: false,
				});

				// When: 連携情報を無効化
				const result = await repository.deactivateIntegration("integration-uuid-1");

				// Then: 無効化される
				expect(result.isActive).toBe(false);
			});
		});
	});

	describe("createSyncLog", () => {
		describe("正常系", () => {
			test("同期ログを作成できる", async () => {
				// Given: 同期ログ作成用データ
				const createData = {
					integrationId: "integration-uuid-1",
					direction: "IMPORT" as SyncDirection,
					entityType: "partner",
				};
				mockPrismaClient.freeeSyncLog.create.mockResolvedValue({
					...mockSyncLogData,
					...createData,
					id: "new-log-uuid",
				});

				// When: 同期ログを作成
				const result = await repository.createSyncLog(createData);

				// Then: 同期ログが作成される
				expect(result.id).toBe("new-log-uuid");
				expect(result.direction).toBe("IMPORT");
			});
		});
	});

	describe("updateSyncLog", () => {
		describe("正常系", () => {
			test("同期ログを更新できる", async () => {
				// Given: 同期ログ更新用データ
				const updateData = {
					status: "COMPLETED" as SyncStatus,
					totalRecords: 10,
					successCount: 9,
					errorCount: 1,
				};
				mockPrismaClient.freeeSyncLog.update.mockResolvedValue({
					...mockSyncLogData,
					...updateData,
				});

				// When: 同期ログを更新
				const result = await repository.updateSyncLog("log-uuid-1", updateData);

				// Then: 同期ログが更新される
				expect(result.status).toBe("COMPLETED");
				expect(result.successCount).toBe(9);
				expect(result.errorCount).toBe(1);
			});
		});
	});

	describe("findCustomerMappingByCustomerId", () => {
		describe("正常系", () => {
			test("顧客IDでマッピングを取得できる", async () => {
				// Given: マッピングが存在する場合
				mockPrismaClient.customerFreeeMapping.findUnique.mockResolvedValue(mockCustomerMappingData);

				// When: 顧客IDでマッピングを取得
				const result = await repository.findCustomerMappingByCustomerId("customer-uuid-1", 123456);

				// Then: マッピングが返却される
				expect(result).not.toBeNull();
				expect(result?.customerId).toBe("customer-uuid-1");
				expect(result?.freeePartnerId).toBe(12345);
			});
		});
	});

	describe("createCustomerMapping", () => {
		describe("正常系", () => {
			test("顧客マッピングを作成できる", async () => {
				// Given: マッピング作成用データ
				const createData = {
					customerId: "customer-uuid-1",
					freeePartnerId: 12345,
					freeeCompanyId: 123456,
					syncHash: "hash123",
				};
				mockPrismaClient.customerFreeeMapping.create.mockResolvedValue({
					...mockCustomerMappingData,
					...createData,
					id: "new-mapping-uuid",
				});

				// When: マッピングを作成
				const result = await repository.createCustomerMapping(createData);

				// Then: マッピングが作成される
				expect(result.id).toBe("new-mapping-uuid");
				expect(result.syncHash).toBe("hash123");
			});
		});
	});

	describe("updateCustomerMappingSyncHash", () => {
		describe("正常系", () => {
			test("マッピングのハッシュを更新できる", async () => {
				// Given: マッピングが存在する場合
				mockPrismaClient.customerFreeeMapping.update.mockResolvedValue({
					...mockCustomerMappingData,
					syncHash: "new-hash456",
				});

				// When: ハッシュを更新
				const result = await repository.updateCustomerMappingSyncHash("mapping-uuid-1", "new-hash456");

				// Then: ハッシュが更新される
				expect(result.syncHash).toBe("new-hash456");
			});
		});
	});

	describe("deleteCustomerMapping", () => {
		describe("正常系", () => {
			test("顧客マッピングを削除できる", async () => {
				// Given: マッピングが存在する場合
				mockPrismaClient.customerFreeeMapping.delete.mockResolvedValue(mockCustomerMappingData);

				// When: マッピングを削除
				await repository.deleteCustomerMapping("mapping-uuid-1");

				// Then: 削除が実行される
				expect(mockPrismaClient.customerFreeeMapping.delete).toHaveBeenCalledWith({
					where: { id: "mapping-uuid-1" },
				});
			});
		});
	});
});
