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
                const id = "pipeline-1";
                const mockRepository = createMockRepository({
                    delete: vi.fn().mockResolvedValue(undefined),
                });

                const useCase = new DeletePipelineUseCase(mockRepository);
                await useCase.execute(id);

                expect(mockRepository.delete).toHaveBeenCalledWith(id);
                expect(mockRepository.delete).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("存在しないパイプラインIDの場合、リポジトリからエラーがスローされる", async () => {
                const id = "non-existent";
                const mockRepository = createMockRepository({
                    delete: vi.fn().mockRejectedValue(new Error("Pipeline not found")),
                });

                const useCase = new DeletePipelineUseCase(mockRepository);
                await expect(useCase.execute(id)).rejects.toThrow("Pipeline not found");
            });

            test("デフォルトパイプラインの削除時、リポジトリからエラーがスローされる", async () => {
                const id = "default-pipeline";
                const mockRepository = createMockRepository({
                    delete: vi.fn().mockRejectedValue(new Error("Cannot delete default pipeline")),
                });

                const useCase = new DeletePipelineUseCase(mockRepository);
                await expect(useCase.execute(id)).rejects.toThrow("Cannot delete default pipeline");
            });
        });

        describe("エッジケース", () => {
            test("空文字のIDでもリポジトリに委譲される", async () => {
                const id = "";
                const mockRepository = createMockRepository({
                    delete: vi.fn().mockRejectedValue(new Error("Invalid ID")),
                });

                const useCase = new DeletePipelineUseCase(mockRepository);
                await expect(useCase.execute(id)).rejects.toThrow("Invalid ID");
            });
        });
    });
});
