import { describe, expect, test, vi } from "vitest";
import type { Pipeline, PipelineRepository } from "~/domain/pipeline";
import { GetPipelinesUseCase } from "./getPipelines";

describe("GetPipelinesUseCase", () => {
    const mockPipelines: Pipeline[] = [
        {
            id: "pipeline-1",
            name: "Sales Pipeline",
            description: "Main sales pipeline",
            isDefault: true,
            stages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "pipeline-2",
            name: "Marketing Pipeline",
            description: "Marketing campaigns",
            isDefault: false,
            stages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const createMockRepository = (overrides: Partial<PipelineRepository> = {}): PipelineRepository => ({
        findAll: vi.fn().mockResolvedValue(mockPipelines),
        findById: vi.fn().mockResolvedValue(null),
        findDefault: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({} as any),
        update: vi.fn().mockResolvedValue({} as any),
        delete: vi.fn().mockResolvedValue(undefined),
        createStage: vi.fn().mockResolvedValue({} as any),
        updateStage: vi.fn().mockResolvedValue({} as any),
        deleteStage: vi.fn().mockResolvedValue(undefined),
        findStageById: vi.fn().mockResolvedValue(null),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("全てのパイプラインを取得できる", async () => {
                // Given: パイプラインが存在する
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockResolvedValue(mockPipelines),
                });

                // When: パイプラインを取得する
                const useCase = new GetPipelinesUseCase(mockRepository);
                const result = await useCase.execute();

                // Then: パイプライン一覧が返される
                expect(result).toEqual(mockPipelines);
                expect(result).toHaveLength(2);
                expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            });

            test("パイプラインが存在しない場合空配列を返す", async () => {
                // Given: パイプラインが存在しない
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockResolvedValue([]),
                });

                // When: パイプラインを取得する
                const useCase = new GetPipelinesUseCase(mockRepository);
                const result = await useCase.execute();

                // Then: 空配列が返される
                expect(result).toEqual([]);
                expect(result).toHaveLength(0);
            });
        });

        describe("異常系", () => {
            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                // Given: リポジトリがエラーをスローする
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                // When & Then: エラーがスローされる
                const useCase = new GetPipelinesUseCase(mockRepository);
                await expect(useCase.execute()).rejects.toThrow("Database error");
            });
        });

        describe("境界値", () => {
            test("1件のパイプラインのみ存在する場合", async () => {
                // Given: 1件のパイプライン
                const singlePipeline = [mockPipelines[0]];
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockResolvedValue(singlePipeline),
                });

                // When: パイプラインを取得する
                const useCase = new GetPipelinesUseCase(mockRepository);
                const result = await useCase.execute();

                // Then: 1件のパイプラインが返される
                expect(result).toHaveLength(1);
                expect(result[0]).toEqual(mockPipelines[0]);
            });

            test("大量のパイプラインが存在する場合でも取得できる", async () => {
                // Given: 大量のパイプライン
                const manyPipelines = Array.from({ length: 100 }, (_, i) => ({
                    id: `pipeline-${i}`,
                    name: `Pipeline ${i}`,
                    description: undefined,
                    isDefault: false,
                    stages: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockResolvedValue(manyPipelines),
                });

                // When: パイプラインを取得する
                const useCase = new GetPipelinesUseCase(mockRepository);
                const result = await useCase.execute();

                // Then: 全てのパイプラインが返される
                expect(result).toHaveLength(100);
            });
        });
    });
});
