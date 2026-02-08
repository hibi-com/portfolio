/**
 * @sequence docs/sequence/api/crm/lead-convert.md
 * @description リード→商談変換の統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Client → API → DIContainer → UseCase → LeadRepository → DealRepository → DB
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "../../../src/di/container";

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
            // Given: リードとパイプライン/ステージが存在する
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

            // When: ConvertLeadToDealUseCase を実行
            const useCase = container.getConvertLeadToDealUseCase();
            const result = await useCase.execute("lead-1", {
                stageId: "stage-1",
                dealName: "New Deal",
                value: 1000000,
            });

            // Then: 変換が成功する
            expect(result).toBeDefined();
            expect(result.lead).toBeDefined();
            expect(result.deal).toBeDefined();
            expect(result.lead.status).toBe("CONVERTED");
            expect(result.deal.name).toBe("New Deal");
            expect(result.deal.stageId).toBe("stage-1");
        });

        test("異常系: 存在しないリードの変換は失敗する", async () => {
            // Given: パイプライン/ステージのみ存在
            await seedTestData({
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [{ id: "stage-1", name: "Initial", order: 1 }],
                    },
                ],
            });

            // When: 存在しないリードで ConvertLeadToDealUseCase を実行
            const useCase = container.getConvertLeadToDealUseCase();

            // Then: エラーがスローされる
            await expect(
                useCase.execute("non-existent-lead", { stageId: "stage-1" })
            ).rejects.toThrow();
        });

        test("異常系: 既に変換済みのリードは再変換できない", async () => {
            // Given: 変換済みリードが存在する
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

            // When: 変換済みリードで ConvertLeadToDealUseCase を実行
            const useCase = container.getConvertLeadToDealUseCase();

            // Then: エラーがスローされる
            await expect(
                useCase.execute("lead-1", { stageId: "stage-1" })
            ).rejects.toThrow();
        });

        test("正常系: デフォルト値で商談が作成される", async () => {
            // Given: リードとステージが存在
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

            // When: 最小限のパラメータで変換
            const useCase = container.getConvertLeadToDealUseCase();
            const result = await useCase.execute("lead-1", { stageId: "stage-1" });

            // Then: デフォルト値で商談が作成される
            expect(result.deal).toBeDefined();
            expect(result.deal.name).toBe("Test Lead"); // リード名がデフォルト
            expect(result.deal.status).toBe("OPEN");
        });
    });
});
