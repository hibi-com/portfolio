import { describe, expect, test, vi } from "vitest";
import type { Pipeline, PipelineRepository } from "~/domain/pipeline";
import { GetPipelineByIdUseCase } from "./getPipelineById";

describe("GetPipelineByIdUseCase", () => {
    const mockPipeline: Pipeline = {
        id: "pipeline-1",
        name: "Sales Pipeline",
        description: "Main sales pipeline",
        isDefault: true,
        stages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockRepository = (overrides: Partial<PipelineRepository> = {}): PipelineRepository => ({
        findAll: vi.fn().mockResolvedValue([]),
        findById: vi.fn().mockResolvedValue(mockPipeline),
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
            test("パイプラインIDからパイプラインを取得できる", async () => {
                // Given: 有効なパイプラインIDが与えられる
                const id = "pipeline-1";
                const mockRepository = createMockRepository({
                    findById: vi.fn().mockResolvedValue(mockPipeline),
                });

                // When: パイプラインを取得する
                const useCase = new GetPipelineByIdUseCase(mockRepository);
                const result = await useCase.execute(id);

                // Then: パイプラインが返される
                expect(result).toEqual(mockPipeline);
                expect(mockRepository.findById).toHaveBeenCalledWith(id);
                expect(mockRepository.findById).toHaveBeenCalledTimes(1);
            });

            test("パイプラインが存在しない場合nullを返す", async () => {
                // Given: 存在しないパイプラインID
                const id = "non-existent";
                const mockRepository = createMockRepository({
                    findById: vi.fn().mockResolvedValue(null),
                });

                // When: パイプラインを取得する
                const useCase = new GetPipelineByIdUseCase(mockRepository);
                const result = await useCase.execute(id);

                // Then: nullが返される
                expect(result).toBeNull();
                expect(mockRepository.findById).toHaveBeenCalledWith(id);
            });
        });

        describe("異常系", () => {
            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                // Given: リポジトリがエラーをスローする
                const id = "pipeline-1";
                const mockRepository = createMockRepository({
                    findById: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                // When & Then: エラーがスローされる
                const useCase = new GetPipelineByIdUseCase(mockRepository);
                await expect(useCase.execute(id)).rejects.toThrow("Database error");
            });
        });

        describe("エッジケース", () => {
            test("空文字のIDでも処理できる", async () => {
                // Given: 空文字のID
                const id = "";
                const mockRepository = createMockRepository({
                    findById: vi.fn().mockResolvedValue(null),
                });

                // When: パイプラインを取得する
                const useCase = new GetPipelineByIdUseCase(mockRepository);
                const result = await useCase.execute(id);

                // Then: nullが返される
                expect(result).toBeNull();
                expect(mockRepository.findById).toHaveBeenCalledWith(id);
            });
        });
    });
});
