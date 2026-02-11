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
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
            id: "pipeline-2",
            name: "Marketing Pipeline",
            description: "Marketing campaigns",
            isDefault: false,
            stages: [],
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
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
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockResolvedValue(mockPipelines),
                });

                const useCase = new GetPipelinesUseCase(mockRepository);
                const result = await useCase.execute();

                expect(result).toEqual(mockPipelines);
                expect(result).toHaveLength(2);
                expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            });

            test("パイプラインが存在しない場合空配列を返す", async () => {
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockResolvedValue([]),
                });

                const useCase = new GetPipelinesUseCase(mockRepository);
                const result = await useCase.execute();

                expect(result).toEqual([]);
                expect(result).toHaveLength(0);
            });
        });

        describe("異常系", () => {
            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                const useCase = new GetPipelinesUseCase(mockRepository);
                await expect(useCase.execute()).rejects.toThrow("Database error");
            });
        });

        describe("境界値", () => {
            test("1件のパイプラインのみ存在する場合", async () => {
                const singlePipeline = [mockPipelines[0]];
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockResolvedValue(singlePipeline),
                });

                const useCase = new GetPipelinesUseCase(mockRepository);
                const result = await useCase.execute();

                expect(result).toHaveLength(1);
                expect(result[0]).toEqual(mockPipelines[0]);
            });

            test("大量のパイプラインが存在する場合でも取得できる", async () => {
                const manyPipelines = Array.from({ length: 100 }, (_, i) => ({
                    id: `pipeline-${i}`,
                    name: `Pipeline ${i}`,
                    description: undefined,
                    isDefault: false,
                    stages: [],
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                }));
                const mockRepository = createMockRepository({
                    findAll: vi.fn().mockResolvedValue(manyPipelines),
                });

                const useCase = new GetPipelinesUseCase(mockRepository);
                const result = await useCase.execute();

                expect(result).toHaveLength(100);
            });
        });
    });
});
