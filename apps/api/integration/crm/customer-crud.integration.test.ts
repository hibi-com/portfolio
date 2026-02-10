import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { DIContainer } from "~/di/container";
import { createTestContainer } from "../setup/container.setup";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";

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
            await seedTestData({
                customers: [
                    { id: "cust-1", name: "Customer 1", email: "cust1@example.com", status: "ACTIVE" },
                    { id: "cust-2", name: "Customer 2", email: "cust2@example.com", status: "PROSPECT" },
                    { id: "cust-3", name: "Customer 3", email: "cust3@example.com", status: "INACTIVE" },
                ],
            });

            const useCase = container.getGetCustomersUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(3);
            expect(result.map((c: any) => c.name)).toContain("Customer 1");
            expect(result.map((c: any) => c.name)).toContain("Customer 2");
            expect(result.map((c: any) => c.name)).toContain("Customer 3");
        });

        test("異常系: 顧客が0件の場合は空配列を返す", async () => {
            const useCase = container.getGetCustomersUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(0);
        });

        test("正常系: 各ステータスの顧客を取得する", async () => {
            await seedTestData({
                customers: [
                    { id: "cust-1", name: "Active Customer", status: "ACTIVE" },
                    { id: "cust-2", name: "Prospect Customer", status: "PROSPECT" },
                    { id: "cust-3", name: "Churned Customer", status: "CHURNED" },
                ],
            });

            const useCase = container.getGetCustomersUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(3);
            const statuses = result.map((c: any) => c.status);
            expect(statuses).toContain("ACTIVE");
            expect(statuses).toContain("PROSPECT");
            expect(statuses).toContain("CHURNED");
        });
    });

    describe("GET /api/crm/customers/:id - 顧客詳細取得", () => {
        test("正常系: IDで顧客を取得する", async () => {
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

            const useCase = container.getGetCustomerByIdUseCase();
            const result = await useCase.execute("cust-1");

            expect(result).not.toBeNull();
            expect(result?.name).toBe("Test Customer");
            expect(result?.email).toBe("test@example.com");
            expect(result?.company).toBe("Test Company");
        });

        test("異常系: 存在しないIDの場合はnullを返す", async () => {
            await seedTestData({
                customers: [{ id: "cust-1", name: "Existing Customer" }],
            });

            const useCase = container.getGetCustomerByIdUseCase();
            const result = await useCase.execute("non-existent-id");

            expect(result).toBeNull();
        });
    });

    describe("POST /api/crm/customers - 顧客作成", () => {
        test("正常系: 顧客を作成する", async () => {
            const input = {
                name: "New Customer",
                email: "new@example.com",
                phone: "03-9999-9999",
                company: "New Company",
                status: "PROSPECT" as const,
            };

            const useCase = container.getCreateCustomerUseCase();
            const result = await useCase.execute(input);

            expect(result).toBeDefined();
            expect(result.name).toBe("New Customer");
            expect(result.email).toBe("new@example.com");
            expect(result.status).toBe("PROSPECT");
            expect(result.id).toBeDefined();
        });

        test("正常系: 最小限の情報で顧客を作成する", async () => {
            const input = {
                name: "Minimal Customer",
            };

            const useCase = container.getCreateCustomerUseCase();
            const result = await useCase.execute(input);

            expect(result).toBeDefined();
            expect(result.name).toBe("Minimal Customer");
            expect(result.status).toBe("PROSPECT");
        });
    });

    describe("PUT /api/crm/customers/:id - 顧客更新", () => {
        test("正常系: 顧客を更新する", async () => {
            await seedTestData({
                customers: [{ id: "cust-1", name: "Original Name", status: "PROSPECT" }],
            });

            const useCase = container.getUpdateCustomerUseCase();
            const result = await useCase.execute("cust-1", {
                name: "Updated Name",
                status: "ACTIVE",
            });

            expect(result).not.toBeNull();
            expect(result?.name).toBe("Updated Name");
            expect(result?.status).toBe("ACTIVE");
        });

        test("異常系: 存在しない顧客の更新はnullを返す", async () => {
            const useCase = container.getUpdateCustomerUseCase();
            const result = await useCase.execute("non-existent-id", { name: "Updated" });

            expect(result).toBeNull();
        });
    });

    describe("DELETE /api/crm/customers/:id - 顧客削除", () => {
        test("正常系: 顧客を削除する", async () => {
            await seedTestData({
                customers: [{ id: "cust-1", name: "To Be Deleted" }],
            });

            const useCase = container.getDeleteCustomerUseCase();
            await useCase.execute("cust-1");

            const getUseCase = container.getGetCustomerByIdUseCase();
            const result = await getUseCase.execute("cust-1");
            expect(result).toBeNull();
        });
    });
});
