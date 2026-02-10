import { describe, expect, test, vi } from "vitest";
import type { PipelineRepository } from "~/domain/pipeline";
import { DeletePipelineUseCase } from "./deletePipeline";

describe("DeletePipelineUseCase", () => {
    const createMockRepository = (overrides: Partial<PipelineRepository> = {}): PipelineRepository => ({
        findAll: vi.fn().mockResolvedValue([]),
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
            test("パイプラインを削除できる", async () => {
                // Given: 有効なパイプラインIDが与えられる
                const id = "pipeline-1";
                const mockRepository = createMockRepository({
                    delete: vi.fn().mockResolvedValue(undefined),
                });

                // When: パイプラインを削除する
                const useCase = new DeletePipelineUseCase(mockRepository);
                await useCase.execute(id);

                // Then: リポジトリのdeleteが呼ばれる
                expect(mockRepository.delete).toHaveBeenCalledWith(id);
                expect(mockRepository.delete).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("存在しないパイプラインIDの場合、リポジトリからエラーがスローされる", async () => {
                // Given: 存在しないパイプラインID
                const id = "non-existent";
                const mockRepository = createMockRepository({
                    delete: vi.fn().mockRejectedValue(new Error("Pipeline not found")),
                });

                // When & Then: エラーがスローされる
                const useCase = new DeletePipelineUseCase(mockRepository);
                await expect(useCase.execute(id)).rejects.toThrow("Pipeline not found");
            });

            test("デフォルトパイプラインの削除時、リポジトリからエラーがスローされる", async () => {
                // Given: デフォルトパイプラインのID
                const id = "default-pipeline";
                const mockRepository = createMockRepository({
                    delete: vi.fn().mockRejectedValue(new Error("Cannot delete default pipeline")),
                });

                // When & Then: エラーがスローされる
                const useCase = new DeletePipelineUseCase(mockRepository);
                await expect(useCase.execute(id)).rejects.toThrow("Cannot delete default pipeline");
            });
        });

        describe("エッジケース", () => {
            test("空文字のIDでもリポジトリに委譲される", async () => {
                // Given: 空文字のID
                const id = "";
                const mockRepository = createMockRepository({
                    delete: vi.fn().mockRejectedValue(new Error("Invalid ID")),
                });

                // When & Then: エラーがスローされる
                const useCase = new DeletePipelineUseCase(mockRepository);
                await expect(useCase.execute(id)).rejects.toThrow("Invalid ID");
            });
        });
    });
});
