import { describe, expect, test, vi } from "vitest";
import type { Pipeline, PipelineRepository, UpdatePipelineInput } from "~/domain/pipeline";
import { UpdatePipelineUseCase } from "./updatePipeline";

describe("UpdatePipelineUseCase", () => {
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
                // Given: パイプラインIDと更新データが与えられる
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

                // When: パイプラインを更新する
                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                // Then: 更新されたパイプラインが返される
                expect(result).toEqual(updatedPipeline);
                expect(mockRepository.update).toHaveBeenCalledWith(id, input);
                expect(mockRepository.update).toHaveBeenCalledTimes(1);
            });

            test("名前のみ更新できる", async () => {
                // Given: 名前のみの更新データ
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

                // When: パイプラインを更新する
                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                // Then: 名前が更新されたパイプラインが返される
                expect(result.name).toBe("New Name");
            });

            test("説明のみ更新できる", async () => {
                // Given: 説明のみの更新データ
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

                // When: パイプラインを更新する
                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                // Then: 説明が更新されたパイプラインが返される
                expect(result.description).toBe("New description");
            });

            test("デフォルトフラグを更新できる", async () => {
                // Given: デフォルトフラグの更新データ
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

                // When: パイプラインを更新する
                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                // Then: デフォルトフラグが更新される
                expect(result.isDefault).toBe(false);
            });
        });

        describe("異常系", () => {
            test("存在しないパイプラインIDの場合、リポジトリからエラーがスローされる", async () => {
                // Given: 存在しないパイプラインID
                const id = "non-existent";
                const input: UpdatePipelineInput = {
                    name: "Updated Name",
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockRejectedValue(new Error("Pipeline not found")),
                });

                // When & Then: エラーがスローされる
                const useCase = new UpdatePipelineUseCase(mockRepository);
                await expect(useCase.execute(id, input)).rejects.toThrow("Pipeline not found");
            });

            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                // Given: リポジトリがエラーをスローする
                const id = "pipeline-1";
                const input: UpdatePipelineInput = {
                    name: "Updated Name",
                };
                const mockRepository = createMockRepository({
                    update: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                // When & Then: エラーがスローされる
                const useCase = new UpdatePipelineUseCase(mockRepository);
                await expect(useCase.execute(id, input)).rejects.toThrow("Database error");
            });
        });

        describe("エッジケース", () => {
            test("空のオブジェクトで更新しようとすると処理される", async () => {
                // Given: 空の更新データ
                const id = "pipeline-1";
                const input: UpdatePipelineInput = {};
                const mockRepository = createMockRepository({
                    update: vi.fn().mockResolvedValue(mockPipeline),
                });

                // When: パイプラインを更新する
                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                // Then: 元のパイプラインが返される
                expect(result).toEqual(mockPipeline);
                expect(mockRepository.update).toHaveBeenCalledWith(id, input);
            });

            test("長い説明文で更新できる", async () => {
                // Given: 長い説明文
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

                // When: パイプラインを更新する
                const useCase = new UpdatePipelineUseCase(mockRepository);
                const result = await useCase.execute(id, input);

                // Then: 長い説明文で更新される
                expect(result.description).toBe(longDescription);
            });
        });
    });
});
