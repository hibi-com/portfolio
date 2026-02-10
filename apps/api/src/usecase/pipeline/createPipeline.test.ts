import { describe, expect, test, vi } from "vitest";
import type { CreatePipelineInput, Pipeline, PipelineRepository } from "~/domain/pipeline";
import { CreatePipelineUseCase } from "./createPipeline";

describe("CreatePipelineUseCase", () => {
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
        findById: vi.fn().mockResolvedValue(null),
        findDefault: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(mockPipeline),
        update: vi.fn().mockResolvedValue(mockPipeline),
        delete: vi.fn().mockResolvedValue(undefined),
        createStage: vi.fn().mockResolvedValue({} as any),
        updateStage: vi.fn().mockResolvedValue({} as any),
        deleteStage: vi.fn().mockResolvedValue(undefined),
        findStageById: vi.fn().mockResolvedValue(null),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("パイプラインを作成できる", async () => {
                // Given: パイプライン作成データが与えられる
                const input: CreatePipelineInput = {
                    name: "Sales Pipeline",
                    description: "Main sales pipeline",
                    isDefault: true,
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockResolvedValue(mockPipeline),
                });

                // When: パイプラインを作成する
                const useCase = new CreatePipelineUseCase(mockRepository);
                const result = await useCase.execute(input);

                // Then: パイプラインが返される
                expect(result).toEqual(mockPipeline);
                expect(mockRepository.create).toHaveBeenCalledWith(input);
                expect(mockRepository.create).toHaveBeenCalledTimes(1);
            });

            test("最小限の情報でパイプラインを作成できる", async () => {
                // Given: 名前のみのパイプライン作成データ
                const input: CreatePipelineInput = {
                    name: "Minimal Pipeline",
                };
                const minimalPipeline: Pipeline = {
                    ...mockPipeline,
                    name: "Minimal Pipeline",
                    description: undefined,
                    isDefault: false,
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockResolvedValue(minimalPipeline),
                });

                // When: パイプラインを作成する
                const useCase = new CreatePipelineUseCase(mockRepository);
                const result = await useCase.execute(input);

                // Then: パイプラインが返される
                expect(result.name).toBe("Minimal Pipeline");
                expect(result.isDefault).toBe(false);
            });

            test("説明付きのパイプラインを作成できる", async () => {
                // Given: 説明付きのパイプライン作成データ
                const input: CreatePipelineInput = {
                    name: "Marketing Pipeline",
                    description: "Pipeline for marketing campaigns",
                    isDefault: false,
                };
                const pipelineWithDescription: Pipeline = {
                    ...mockPipeline,
                    name: "Marketing Pipeline",
                    description: "Pipeline for marketing campaigns",
                    isDefault: false,
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockResolvedValue(pipelineWithDescription),
                });

                // When: パイプラインを作成する
                const useCase = new CreatePipelineUseCase(mockRepository);
                const result = await useCase.execute(input);

                // Then: 説明付きパイプラインが返される
                expect(result.description).toBe("Pipeline for marketing campaigns");
            });
        });

        describe("異常系", () => {
            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                // Given: リポジトリがエラーをスローする
                const input: CreatePipelineInput = {
                    name: "Test Pipeline",
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                // When & Then: エラーがスローされる
                const useCase = new CreatePipelineUseCase(mockRepository);
                await expect(useCase.execute(input)).rejects.toThrow("Database error");
            });
        });

        describe("エッジケース", () => {
            test("空文字の名前でパイプラインを作成しようとするとリポジトリでエラーになる", async () => {
                // Given: 空文字の名前
                const input: CreatePipelineInput = {
                    name: "",
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockRejectedValue(new Error("Name is required")),
                });

                // When & Then: エラーがスローされる
                const useCase = new CreatePipelineUseCase(mockRepository);
                await expect(useCase.execute(input)).rejects.toThrow("Name is required");
            });

            test("長い説明文でパイプラインを作成できる", async () => {
                // Given: 長い説明文
                const longDescription = "a".repeat(1000);
                const input: CreatePipelineInput = {
                    name: "Test Pipeline",
                    description: longDescription,
                };
                const pipelineWithLongDesc: Pipeline = {
                    ...mockPipeline,
                    description: longDescription,
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockResolvedValue(pipelineWithLongDesc),
                });

                // When: パイプラインを作成する
                const useCase = new CreatePipelineUseCase(mockRepository);
                const result = await useCase.execute(input);

                // Then: 長い説明文のパイプラインが返される
                expect(result.description).toBe(longDescription);
            });
        });
    });
});
