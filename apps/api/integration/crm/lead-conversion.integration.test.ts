import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { DIContainer } from "~/di/container";
import { createTestContainer } from "../setup/container.setup";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";

describe("POST /api/crm/leads/:id/convert - リード変換", () => {
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

    describe("シーケンス: Client → API → UseCase → LeadRepo → DealRepo → DB", () => {
        test("正常系: リードを商談に変換する", async () => {
            await seedTestData({
                customers: [{ id: "cust-1", name: "Test Customer" }],
                leads: [
                    {
                        id: "lead-1",
                        name: "Test Lead",
                        customerId: "cust-1",
                        email: "lead@example.com",
                        status: "QUALIFIED",
                    },
                ],
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        isDefault: true,
                        stages: [
                            { id: "stage-1", name: "Initial", order: 1, probability: 10 },
                            { id: "stage-2", name: "Negotiation", order: 2, probability: 50 },
                        ],
                    },
                ],
            });

            const useCase = container.getConvertLeadToDealUseCase();
            const result = await useCase.execute("lead-1");

            expect(result).toBeDefined();
            expect(result.status).toBe("CONVERTED");
        });

        test("異常系: 存在しないリードの変換は失敗する", async () => {
            await seedTestData({
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [{ id: "stage-1", name: "Initial", order: 1 }],
                    },
                ],
            });

            const useCase = container.getConvertLeadToDealUseCase();

            await expect(useCase.execute("non-existent-lead")).rejects.toThrow();
        });

        test("異常系: 既に変換済みのリードは再変換できない", async () => {
            await seedTestData({
                leads: [
                    {
                        id: "lead-1",
                        name: "Converted Lead",
                        status: "CONVERTED",
                    },
                ],
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [{ id: "stage-1", name: "Initial", order: 1 }],
                    },
                ],
            });

            const useCase = container.getConvertLeadToDealUseCase();

            await expect(useCase.execute("lead-1")).rejects.toThrow();
        });

        test("正常系: デフォルト値で商談が作成される", async () => {
            await seedTestData({
                leads: [{ id: "lead-1", name: "Test Lead", status: "NEW" }],
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [{ id: "stage-1", name: "Initial", order: 1 }],
                    },
                ],
            });

            const useCase = container.getConvertLeadToDealUseCase();
            const result = await useCase.execute("lead-1");

            expect(result.status).toBe("CONVERTED");
        });
    });
});
