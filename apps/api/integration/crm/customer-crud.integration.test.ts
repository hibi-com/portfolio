/**
 * @sequence docs/sequence/api/crm/customers-list.md
 * @sequence docs/sequence/api/crm/customer-create.md
 * @description CRM Customer CRUD操作の統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Client → API → DIContainer → UseCase → Repository → DB
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "../../../src/di/container";

describe("CRM Customer CRUD", () => {
    let container: DIContainer;

    beforeAll(async () => {
        await setupTestDb();
        container = createTestContainer();
    });

    afterEach(async () => {
        await clearTestDb();
    });

    afterAll(async () => {
        await teardownTestDb();
    });

    describe("GET /api/crm/customers - 顧客一覧取得", () => {
        test("正常系: 顧客一覧を取得する", async () => {
            // Given: DBに顧客が存在する
            await seedTestData({
                customers: [
                    { id: "cust-1", name: "Customer 1", email: "cust1@example.com", status: "ACTIVE" },
                    { id: "cust-2", name: "Customer 2", email: "cust2@example.com", status: "PROSPECT" },
                    { id: "cust-3", name: "Customer 3", email: "cust3@example.com", status: "INACTIVE" },
                ],
            });

            // When: GetCustomersUseCase を実行
            const useCase = container.getGetCustomersUseCase();
            const result = await useCase.execute();

            // Then: 顧客一覧がレスポンスされる
            expect(result).toHaveLength(3);
            expect(result.map((c: any) => c.name)).toContain("Customer 1");
            expect(result.map((c: any) => c.name)).toContain("Customer 2");
            expect(result.map((c: any) => c.name)).toContain("Customer 3");
        });

        test("異常系: 顧客が0件の場合は空配列を返す", async () => {
            // Given: DBに顧客が存在しない

            // When: GetCustomersUseCase を実行
            const useCase = container.getGetCustomersUseCase();
            const result = await useCase.execute();

            // Then: 空配列がレスポンスされる
            expect(result).toHaveLength(0);
        });

        test("正常系: 各ステータスの顧客を取得する", async () => {
            // Given: 異なるステータスの顧客が存在する
            await seedTestData({
                customers: [
                    { id: "cust-1", name: "Active Customer", status: "ACTIVE" },
                    { id: "cust-2", name: "Prospect Customer", status: "PROSPECT" },
                    { id: "cust-3", name: "Churned Customer", status: "CHURNED" },
                ],
            });

            // When: GetCustomersUseCase を実行
            const useCase = container.getGetCustomersUseCase();
            const result = await useCase.execute();

            // Then: ステータスが正しく取得される
            expect(result).toHaveLength(3);
            const statuses = result.map((c: any) => c.status);
            expect(statuses).toContain("ACTIVE");
            expect(statuses).toContain("PROSPECT");
            expect(statuses).toContain("CHURNED");
        });
    });

    describe("GET /api/crm/customers/:id - 顧客詳細取得", () => {
        test("正常系: IDで顧客を取得する", async () => {
            // Given: DBに顧客が存在する
            await seedTestData({
                customers: [
                    {
                        id: "cust-1",
                        name: "Test Customer",
                        email: "test@example.com",
                        phone: "03-1234-5678",
                        company: "Test Company",
                        status: "ACTIVE",
                    },
                ],
            });

            // When: GetCustomerByIdUseCase を実行
            const useCase = container.getGetCustomerByIdUseCase();
            const result = await useCase.execute("cust-1");

            // Then: 顧客がレスポンスされる
            expect(result).not.toBeNull();
            expect(result?.name).toBe("Test Customer");
            expect(result?.email).toBe("test@example.com");
            expect(result?.company).toBe("Test Company");
        });

        test("異常系: 存在しないIDの場合はnullを返す", async () => {
            // Given: DBに顧客が存在する
            await seedTestData({
                customers: [{ id: "cust-1", name: "Existing Customer" }],
            });

            // When: 存在しないIDで GetCustomerByIdUseCase を実行
            const useCase = container.getGetCustomerByIdUseCase();
            const result = await useCase.execute("non-existent-id");

            // Then: nullがレスポンスされる
            expect(result).toBeNull();
        });
    });

    describe("POST /api/crm/customers - 顧客作成", () => {
        test("正常系: 顧客を作成する", async () => {
            // Given: 入力データ
            const input = {
                name: "New Customer",
                email: "new@example.com",
                phone: "03-9999-9999",
                company: "New Company",
                status: "PROSPECT" as const,
            };

            // When: CreateCustomerUseCase を実行
            const useCase = container.getCreateCustomerUseCase();
            const result = await useCase.execute(input);

            // Then: 顧客が作成される
            expect(result).toBeDefined();
            expect(result.name).toBe("New Customer");
            expect(result.email).toBe("new@example.com");
            expect(result.status).toBe("PROSPECT");
            expect(result.id).toBeDefined();
        });

        test("正常系: 最小限の情報で顧客を作成する", async () => {
            // Given: 必須項目のみの入力データ
            const input = {
                name: "Minimal Customer",
            };

            // When: CreateCustomerUseCase を実行
            const useCase = container.getCreateCustomerUseCase();
            const result = await useCase.execute(input);

            // Then: 顧客が作成される
            expect(result).toBeDefined();
            expect(result.name).toBe("Minimal Customer");
            expect(result.status).toBe("PROSPECT"); // デフォルト値
        });
    });

    describe("PUT /api/crm/customers/:id - 顧客更新", () => {
        test("正常系: 顧客を更新する", async () => {
            // Given: DBに顧客が存在する
            await seedTestData({
                customers: [{ id: "cust-1", name: "Original Name", status: "PROSPECT" }],
            });

            // When: UpdateCustomerUseCase を実行
            const useCase = container.getUpdateCustomerUseCase();
            const result = await useCase.execute("cust-1", {
                name: "Updated Name",
                status: "ACTIVE",
            });

            // Then: 顧客が更新される
            expect(result).not.toBeNull();
            expect(result?.name).toBe("Updated Name");
            expect(result?.status).toBe("ACTIVE");
        });

        test("異常系: 存在しない顧客の更新はnullを返す", async () => {
            // When: 存在しないIDで UpdateCustomerUseCase を実行
            const useCase = container.getUpdateCustomerUseCase();
            const result = await useCase.execute("non-existent-id", { name: "Updated" });

            // Then: nullがレスポンスされる
            expect(result).toBeNull();
        });
    });

    describe("DELETE /api/crm/customers/:id - 顧客削除", () => {
        test("正常系: 顧客を削除する", async () => {
            // Given: DBに顧客が存在する
            await seedTestData({
                customers: [{ id: "cust-1", name: "To Be Deleted" }],
            });

            // When: DeleteCustomerUseCase を実行
            const useCase = container.getDeleteCustomerUseCase();
            await useCase.execute("cust-1");

            // Then: 顧客が削除される
            const getUseCase = container.getGetCustomerByIdUseCase();
            const result = await getUseCase.execute("cust-1");
            expect(result).toBeNull();
        });
    });
});
