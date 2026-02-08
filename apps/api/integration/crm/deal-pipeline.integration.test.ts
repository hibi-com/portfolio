/**
 * @sequence docs/sequence/api/crm/deal-move-stage.md
 * @description 商談パイプライン操作の統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Client → API → DIContainer → UseCase → DealRepository → DB
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "../../../src/di/container";

describe("商談パイプライン操作", () => {
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

    describe("GET /api/crm/deals - 商談一覧取得", () => {
        test("正常系: 商談一覧を取得する", async () => {
            // Given: パイプライン、ステージ、商談が存在する
            await seedTestData({
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [
                            { id: "stage-1", name: "Initial", order: 1 },
                            { id: "stage-2", name: "Negotiation", order: 2 },
                        ],
                    },
                ],
                deals: [
                    { id: "deal-1", name: "Deal 1", stageId: "stage-1", status: "OPEN" },
                    { id: "deal-2", name: "Deal 2", stageId: "stage-2", status: "OPEN" },
                ],
            });

            // When: GetDealsUseCase を実行
            const useCase = container.getGetDealsUseCase();
            const result = await useCase.execute();

            // Then: 商談一覧がレスポンスされる
            expect(result).toHaveLength(2);
            expect(result.map((d: any) => d.name)).toContain("Deal 1");
            expect(result.map((d: any) => d.name)).toContain("Deal 2");
        });

        test("異常系: 商談が0件の場合は空配列を返す", async () => {
            // Given: 商談が存在しない

            // When: GetDealsUseCase を実行
            const useCase = container.getGetDealsUseCase();
            const result = await useCase.execute();

            // Then: 空配列がレスポンスされる
            expect(result).toHaveLength(0);
        });
    });

    describe("PUT /api/crm/deals/:id/stage - 商談ステージ移動", () => {
        test("正常系: 商談のステージを移動する", async () => {
            // Given: パイプラインと商談が存在する
            await seedTestData({
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [
                            { id: "stage-1", name: "Initial", order: 1 },
                            { id: "stage-2", name: "Negotiation", order: 2 },
                            { id: "stage-3", name: "Closing", order: 3 },
                        ],
                    },
                ],
                deals: [{ id: "deal-1", name: "Test Deal", stageId: "stage-1", status: "OPEN" }],
            });

            // When: MoveDealToStageUseCase を実行
            const useCase = container.getMoveDealToStageUseCase();
            const result = await useCase.execute("deal-1", "stage-2");

            // Then: ステージが更新される
            expect(result).not.toBeNull();
            expect(result?.stageId).toBe("stage-2");
        });

        test("異常系: 存在しない商談のステージ移動は失敗する", async () => {
            // Given: ステージのみ存在
            await seedTestData({
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [{ id: "stage-1", name: "Initial", order: 1 }],
                    },
                ],
            });

            // When: 存在しない商談で MoveDealToStageUseCase を実行
            const useCase = container.getMoveDealToStageUseCase();

            // Then: エラーがスローされる
            await expect(useCase.execute("non-existent-deal", "stage-1")).rejects.toThrow();
        });

        test("異常系: クローズ済み商談のステージ移動は失敗する", async () => {
            // Given: WONステータスの商談が存在する
            await seedTestData({
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        stages: [
                            { id: "stage-1", name: "Initial", order: 1 },
                            { id: "stage-2", name: "Won", order: 2 },
                        ],
                    },
                ],
                deals: [{ id: "deal-1", name: "Won Deal", stageId: "stage-2", status: "WON" }],
            });

            // When: WON商談で MoveDealToStageUseCase を実行
            const useCase = container.getMoveDealToStageUseCase();

            // Then: エラーがスローされる
            await expect(useCase.execute("deal-1", "stage-1")).rejects.toThrow();
        });
    });

    describe("GET /api/crm/pipelines - パイプライン一覧取得", () => {
        test("正常系: パイプライン一覧を取得する", async () => {
            // Given: パイプラインが存在する
            await seedTestData({
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Sales Pipeline",
                        isDefault: true,
                        stages: [
                            { id: "stage-1", name: "Initial", order: 1 },
                            { id: "stage-2", name: "Negotiation", order: 2 },
                        ],
                    },
                    {
                        id: "pipeline-2",
                        name: "Enterprise Pipeline",
                        isDefault: false,
                        stages: [{ id: "stage-3", name: "Discovery", order: 1 }],
                    },
                ],
            });

            // When: GetPipelinesUseCase を実行
            const useCase = container.getGetPipelinesUseCase();
            const result = await useCase.execute();

            // Then: パイプライン一覧がレスポンスされる
            expect(result).toHaveLength(2);
            expect(result.map((p: any) => p.name)).toContain("Sales Pipeline");
            expect(result.map((p: any) => p.name)).toContain("Enterprise Pipeline");
        });

        test("正常系: パイプラインにステージが含まれる", async () => {
            // Given: ステージ付きパイプラインが存在する
            await seedTestData({
                pipelines: [
                    {
                        id: "pipeline-1",
                        name: "Test Pipeline",
                        stages: [
                            { id: "stage-1", name: "Stage 1", order: 1 },
                            { id: "stage-2", name: "Stage 2", order: 2 },
                        ],
                    },
                ],
            });

            // When: GetPipelineByIdUseCase を実行
            const useCase = container.getGetPipelineByIdUseCase();
            const result = await useCase.execute("pipeline-1");

            // Then: ステージが含まれる
            expect(result).not.toBeNull();
            expect(result?.stages).toHaveLength(2);
            expect(result?.stages[0].name).toBe("Stage 1");
        });
    });
});
