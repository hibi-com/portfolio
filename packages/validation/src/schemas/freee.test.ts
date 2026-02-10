import { describe, expect, test } from "vitest";
import {
	createCustomerMappingInputSchema,
	createDealMappingInputSchema,
	createFreeeIntegrationInputSchema,
	createSyncLogInputSchema,
	customerFreeeMappingSchema,
	dealFreeeMappingSchema,
	freeeCompanySchema,
	freeeIntegrationSchema,
	freeeOAuthTokensSchema,
	freeePartnerSchema,
	freeeSyncLogSchema,
	syncDirectionSchema,
	syncStatusSchema,
	updateFreeeTokensInputSchema,
	updateSyncLogInputSchema,
} from "./freee";

describe("Freee Zod Schemas", () => {
	describe("syncStatusSchema", () => {
		test("should validate valid status values", () => {
			expect(syncStatusSchema.safeParse("PENDING").success).toBe(true);
			expect(syncStatusSchema.safeParse("IN_PROGRESS").success).toBe(true);
			expect(syncStatusSchema.safeParse("COMPLETED").success).toBe(true);
			expect(syncStatusSchema.safeParse("FAILED").success).toBe(true);
		});

		test("should reject invalid status", () => {
			expect(syncStatusSchema.safeParse("UNKNOWN").success).toBe(false);
		});
	});

	describe("syncDirectionSchema", () => {
		test("should validate valid direction values", () => {
			expect(syncDirectionSchema.safeParse("IMPORT").success).toBe(true);
			expect(syncDirectionSchema.safeParse("EXPORT").success).toBe(true);
			expect(syncDirectionSchema.safeParse("BIDIRECTIONAL").success).toBe(true);
		});

		test("should reject invalid direction", () => {
			expect(syncDirectionSchema.safeParse("SYNC").success).toBe(false);
		});
	});

	describe("freeeIntegrationSchema", () => {
		test("should validate complete integration", () => {
			const result = freeeIntegrationSchema.safeParse({
				id: "int-123",
				userId: "user-456",
				companyId: 12345,
				companyName: "Test Corp",
				accessToken: "access-token-xxx",
				refreshToken: "refresh-token-xxx",
				tokenExpiresAt: "2024-12-31T23:59:59Z",
				scopes: ["read", "write"],
				isActive: true,
				lastSyncAt: "2024-01-01T00:00:00Z",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate integration with minimum required fields", () => {
			const result = freeeIntegrationSchema.safeParse({
				id: "int-123",
				userId: "user-456",
				companyId: 12345,
				accessToken: "access-token",
				refreshToken: "refresh-token",
				tokenExpiresAt: "2024-12-31T23:59:59Z",
				isActive: true,
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject integration without companyId", () => {
			const result = freeeIntegrationSchema.safeParse({
				id: "int-123",
				userId: "user-456",
				accessToken: "access-token",
				refreshToken: "refresh-token",
				tokenExpiresAt: "2024-12-31T23:59:59Z",
				isActive: true,
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("freeeSyncLogSchema", () => {
		test("should validate complete sync log", () => {
			const result = freeeSyncLogSchema.safeParse({
				id: "sync-123",
				integrationId: "int-456",
				direction: "IMPORT",
				status: "COMPLETED",
				entityType: "partners",
				totalRecords: 100,
				successCount: 98,
				errorCount: 2,
				errorDetails: [
					{ record: "partner-1", error: "Duplicate entry" },
					{ record: "partner-2", error: "Invalid data" },
				],
				startedAt: "2024-01-01T10:00:00Z",
				completedAt: "2024-01-01T10:05:00Z",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate sync log with minimum required fields", () => {
			const result = freeeSyncLogSchema.safeParse({
				id: "sync-123",
				integrationId: "int-456",
				direction: "EXPORT",
				status: "PENDING",
				entityType: "deals",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("customerFreeeMappingSchema", () => {
		test("should validate complete mapping", () => {
			const result = customerFreeeMappingSchema.safeParse({
				id: "map-123",
				customerId: "cust-456",
				freeePartnerId: 789,
				freeeCompanyId: 12345,
				lastSyncAt: "2024-01-01T00:00:00Z",
				syncHash: "abc123",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate mapping with minimum required fields", () => {
			const result = customerFreeeMappingSchema.safeParse({
				id: "map-123",
				customerId: "cust-456",
				freeePartnerId: 789,
				freeeCompanyId: 12345,
				lastSyncAt: "2024-01-01T00:00:00Z",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("dealFreeeMappingSchema", () => {
		test("should validate complete deal mapping", () => {
			const result = dealFreeeMappingSchema.safeParse({
				id: "map-123",
				dealId: "deal-456",
				freeeDealId: 789,
				freeeCompanyId: 12345,
				lastSyncAt: "2024-01-01T00:00:00Z",
				syncHash: "xyz789",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("freeePartnerSchema", () => {
		test("should validate complete partner", () => {
			const result = freeePartnerSchema.safeParse({
				id: 123,
				name: "Partner Corp",
				code: "PC001",
				shortcut1: "Partner",
				shortcut2: "Corp",
				orgCode: 1,
				countryCode: "JP",
				addressRegionCode: "13",
				streetName1: "Shibuya",
				streetName2: "1-2-3",
				zipcode: "150-0001",
				phone: "03-1234-5678",
				email: "partner@example.com",
			});
			expect(result.success).toBe(true);
		});

		test("should validate partner with minimum required fields", () => {
			const result = freeePartnerSchema.safeParse({
				id: 123,
				name: "Partner",
			});
			expect(result.success).toBe(true);
		});

		test("should reject partner without id", () => {
			const result = freeePartnerSchema.safeParse({
				name: "Partner",
			});
			expect(result.success).toBe(false);
		});

		test("should reject partner without name", () => {
			const result = freeePartnerSchema.safeParse({
				id: 123,
			});
			expect(result.success).toBe(false);
		});
	});

	describe("freeeOAuthTokensSchema", () => {
		test("should validate complete OAuth tokens", () => {
			const result = freeeOAuthTokensSchema.safeParse({
				accessToken: "access-xxx",
				refreshToken: "refresh-xxx",
				expiresIn: 3600,
				tokenType: "Bearer",
				scope: "read write",
				createdAt: 1704067200,
			});
			expect(result.success).toBe(true);
		});

		test("should reject tokens without accessToken", () => {
			const result = freeeOAuthTokensSchema.safeParse({
				refreshToken: "refresh-xxx",
				expiresIn: 3600,
				tokenType: "Bearer",
				scope: "read",
				createdAt: 1704067200,
			});
			expect(result.success).toBe(false);
		});
	});

	describe("freeeCompanySchema", () => {
		test("should validate complete company", () => {
			const result = freeeCompanySchema.safeParse({
				id: 12345,
				displayName: "Test Company",
				role: "admin",
			});
			expect(result.success).toBe(true);
		});

		test("should reject company without displayName", () => {
			const result = freeeCompanySchema.safeParse({
				id: 12345,
				role: "admin",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("createFreeeIntegrationInputSchema", () => {
		test("should validate create integration input", () => {
			const result = createFreeeIntegrationInputSchema.safeParse({
				userId: "user-123",
				companyId: 12345,
				companyName: "New Company",
				accessToken: "access-token",
				refreshToken: "refresh-token",
				tokenExpiresAt: "2024-12-31T23:59:59Z",
				scopes: ["read"],
			});
			expect(result.success).toBe(true);
		});

		test("should validate create integration with minimum fields", () => {
			const result = createFreeeIntegrationInputSchema.safeParse({
				userId: "user-123",
				companyId: 12345,
				accessToken: "access-token",
				refreshToken: "refresh-token",
				tokenExpiresAt: "2024-12-31T23:59:59Z",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("updateFreeeTokensInputSchema", () => {
		test("should validate update tokens input", () => {
			const result = updateFreeeTokensInputSchema.safeParse({
				accessToken: "new-access-token",
				refreshToken: "new-refresh-token",
				tokenExpiresAt: "2025-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject update without accessToken", () => {
			const result = updateFreeeTokensInputSchema.safeParse({
				refreshToken: "new-refresh-token",
				tokenExpiresAt: "2025-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("createSyncLogInputSchema", () => {
		test("should validate create sync log input", () => {
			const result = createSyncLogInputSchema.safeParse({
				integrationId: "int-123",
				direction: "IMPORT",
				entityType: "partners",
			});
			expect(result.success).toBe(true);
		});

		test("should reject sync log without integrationId", () => {
			const result = createSyncLogInputSchema.safeParse({
				direction: "EXPORT",
				entityType: "deals",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("updateSyncLogInputSchema", () => {
		test("should validate update sync log input", () => {
			const result = updateSyncLogInputSchema.safeParse({
				status: "COMPLETED",
				totalRecords: 100,
				successCount: 100,
				errorCount: 0,
				completedAt: "2024-01-01T10:05:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate update sync log with empty object", () => {
			const result = updateSyncLogInputSchema.safeParse({});
			expect(result.success).toBe(true);
		});
	});

	describe("createCustomerMappingInputSchema", () => {
		test("should validate create customer mapping input", () => {
			const result = createCustomerMappingInputSchema.safeParse({
				customerId: "cust-123",
				freeePartnerId: 456,
				freeeCompanyId: 789,
				syncHash: "hash123",
			});
			expect(result.success).toBe(true);
		});

		test("should validate create customer mapping with minimum fields", () => {
			const result = createCustomerMappingInputSchema.safeParse({
				customerId: "cust-123",
				freeePartnerId: 456,
				freeeCompanyId: 789,
			});
			expect(result.success).toBe(true);
		});
	});

	describe("createDealMappingInputSchema", () => {
		test("should validate create deal mapping input", () => {
			const result = createDealMappingInputSchema.safeParse({
				dealId: "deal-123",
				freeeDealId: 456,
				freeeCompanyId: 789,
				syncHash: "hash456",
			});
			expect(result.success).toBe(true);
		});

		test("should validate create deal mapping with minimum fields", () => {
			const result = createDealMappingInputSchema.safeParse({
				dealId: "deal-123",
				freeeDealId: 456,
				freeeCompanyId: 789,
			});
			expect(result.success).toBe(true);
		});
	});
});
