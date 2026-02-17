import type { CreatePipelineInput, Pipeline, PipelineRepository } from "~/domain/pipeline";
import { CreatePipelineUseCase } from "./createPipeline";

describe("CreatePipelineUseCase", () => {
    const mockPipeline: Pipeline = {
        id: "pipeline-1",
        name: "Sales Pipeline",
        description: "Main sales pipeline",
        isDefault: true,
        stages: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
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
                const input: CreatePipelineInput = {
                    name: "Sales Pipeline",
                    description: "Main sales pipeline",
                    isDefault: true,
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockResolvedValue(mockPipeline),
                });

                const useCase = new CreatePipelineUseCase(mockRepository);
                const result = await useCase.execute(input);

                expect(result).toEqual(mockPipeline);
                expect(mockRepository.create).toHaveBeenCalledWith(input);
                expect(mockRepository.create).toHaveBeenCalledTimes(1);
            });

            test("最小限の情報でパイプラインを作成できる", async () => {
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

                const useCase = new CreatePipelineUseCase(mockRepository);
                const result = await useCase.execute(input);

                expect(result.name).toBe("Minimal Pipeline");
                expect(result.isDefault).toBe(false);
            });

            test("説明付きのパイプラインを作成できる", async () => {
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

                const useCase = new CreatePipelineUseCase(mockRepository);
                const result = await useCase.execute(input);

                expect(result.description).toBe("Pipeline for marketing campaigns");
            });
        });

        describe("異常系", () => {
            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                const input: CreatePipelineInput = {
                    name: "Test Pipeline",
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                const useCase = new CreatePipelineUseCase(mockRepository);
                await expect(useCase.execute(input)).rejects.toThrow("Database error");
            });
        });

        describe("エッジケース", () => {
            test("空文字の名前でパイプラインを作成しようとするとリポジトリでエラーになる", async () => {
                const input: CreatePipelineInput = {
                    name: "",
                };
                const mockRepository = createMockRepository({
                    create: vi.fn().mockRejectedValue(new Error("Name is required")),
                });

                const useCase = new CreatePipelineUseCase(mockRepository);
                await expect(useCase.execute(input)).rejects.toThrow("Name is required");
            });

            test("長い説明文でパイプラインを作成できる", async () => {
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

                const useCase = new CreatePipelineUseCase(mockRepository);
                const result = await useCase.execute(input);

                expect(result.description).toBe(longDescription);
            });
        });
    });
});
