import type { Pipeline, PipelineRepository, UpdatePipelineInput } from "~/domain/pipeline";
import { UpdatePipelineUseCase } from "./updatePipeline";

describe("UpdatePipelineUseCase", () => {
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
        findById: vi.fn().mockResolvedValue(mockPipeline),
        findDefault: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({} as any),
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
            test("パイプラインを更新できる", async () => {
                const id = "pipeline-1";
                const input: UpdatePipelineInput = {
                    name: "Updated Pipeline",
                    description: "Updated description",
                };
                const updatedPipeline: Pipeline = {
                    ...mockPipeline,
                    name: "Updated Pipeline",
                    description: "Updated description",
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockResolvedValue(updatedPipeline),
                });

                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                expect(result).toEqual(updatedPipeline);
                expect(mockRepository.update).toHaveBeenCalledWith(id, input);
                expect(mockRepository.update).toHaveBeenCalledTimes(1);
            });

            test("名前のみ更新できる", async () => {
                const id = "pipeline-1";
                const input: UpdatePipelineInput = {
                    name: "New Name",
                };
                const updatedPipeline: Pipeline = {
                    ...mockPipeline,
                    name: "New Name",
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockResolvedValue(updatedPipeline),
                });

                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                expect(result.name).toBe("New Name");
            });

            test("説明のみ更新できる", async () => {
                const id = "pipeline-1";
                const input: UpdatePipelineInput = {
                    description: "New description",
                };
                const updatedPipeline: Pipeline = {
                    ...mockPipeline,
                    description: "New description",
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockResolvedValue(updatedPipeline),
                });

                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                expect(result.description).toBe("New description");
            });

            test("デフォルトフラグを更新できる", async () => {
                const id = "pipeline-1";
                const input: UpdatePipelineInput = {
                    isDefault: false,
                };
                const updatedPipeline: Pipeline = {
                    ...mockPipeline,
                    isDefault: false,
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockResolvedValue(updatedPipeline),
                });

                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                expect(result.isDefault).toBe(false);
            });
        });

        describe("異常系", () => {
            test("存在しないパイプラインIDの場合、リポジトリからエラーがスローされる", async () => {
                const id = "non-existent";
                const input: UpdatePipelineInput = {
                    name: "Updated Name",
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockRejectedValue(new Error("Pipeline not found")),
                });

                const useCase = new UpdatePipelineUseCase(mockRepository);
                await expect(useCase.execute(id, input)).rejects.toThrow("Pipeline not found");
            });

            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                const id = "pipeline-1";
                const input: UpdatePipelineInput = {
                    name: "Updated Name",
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                const useCase = new UpdatePipelineUseCase(mockRepository);
                await expect(useCase.execute(id, input)).rejects.toThrow("Database error");
            });
        });

        describe("エッジケース", () => {
            test("空のオブジェクトで更新しようとすると処理される", async () => {
                const id = "pipeline-1";
                const input: UpdatePipelineInput = {};
                const mockRepository = createMockRepository({
                    update: vi.fn().mockResolvedValue(mockPipeline),
                });

                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                expect(result).toEqual(mockPipeline);
                expect(mockRepository.update).toHaveBeenCalledWith(id, input);
            });

            test("長い説明文で更新できる", async () => {
                const id = "pipeline-1";
                const longDescription = "a".repeat(1000);
                const input: UpdatePipelineInput = {
                    description: longDescription,
                };
                const updatedPipeline: Pipeline = {
                    ...mockPipeline,
                    description: longDescription,
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockResolvedValue(updatedPipeline),
                });

                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                expect(result.description).toBe(longDescription);
            });
        });
    });
});
