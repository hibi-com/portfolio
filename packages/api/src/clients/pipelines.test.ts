import type {
	CreatePipelineInput,
	CreatePipelineStageInput,
	Pipeline,
	PipelineStage,
	UpdatePipelineInput,
	UpdatePipelineStageInput,
} from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/pipelines/pipelines", () => ({
	getPipelines: vi.fn(() => ({
		pipelinesListPipelines: vi.fn(),
		pipelinesGetPipelineById: vi.fn(),
		pipelinesGetDefaultPipeline: vi.fn(),
		pipelinesCreatePipeline: vi.fn(),
		pipelinesUpdatePipeline: vi.fn(),
		pipelinesDeletePipeline: vi.fn(),
		pipelinesCreatePipelineStage: vi.fn(),
		pipelinesUpdatePipelineStage: vi.fn(),
		pipelinesDeletePipelineStage: vi.fn(),
	})),
}));

import { getPipelines } from "@generated/pipelines/pipelines";
import {
	createPipeline,
	createPipelineStage,
	deletePipeline,
	deletePipelineStage,
	getDefaultPipeline,
	getPipelineById,
	listPipelines,
	pipelines,
	updatePipeline,
	updatePipelineStage,
} from "./pipelines";

describe("pipelines client", () => {
	const mockPipelinesListPipelines = vi.fn();
	const mockPipelinesGetPipelineById = vi.fn();
	const mockPipelinesGetDefaultPipeline = vi.fn();
	const mockPipelinesCreatePipeline = vi.fn();
	const mockPipelinesUpdatePipeline = vi.fn();
	const mockPipelinesDeletePipeline = vi.fn();
	const mockPipelinesCreatePipelineStage = vi.fn();
	const mockPipelinesUpdatePipelineStage = vi.fn();
	const mockPipelinesDeletePipelineStage = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getPipelines).mockReturnValue({
			pipelinesListPipelines: mockPipelinesListPipelines,
			pipelinesGetPipelineById: mockPipelinesGetPipelineById,
			pipelinesGetDefaultPipeline: mockPipelinesGetDefaultPipeline,
			pipelinesCreatePipeline: mockPipelinesCreatePipeline,
			pipelinesUpdatePipeline: mockPipelinesUpdatePipeline,
			pipelinesDeletePipeline: mockPipelinesDeletePipeline,
			pipelinesCreatePipelineStage: mockPipelinesCreatePipelineStage,
			pipelinesUpdatePipelineStage: mockPipelinesUpdatePipelineStage,
			pipelinesDeletePipelineStage: mockPipelinesDeletePipelineStage,
		});
	});

	const mockStage: PipelineStage = {
		id: "stage-1",
		pipelineId: "pipeline-1",
		name: "Qualification",
		order: 0,
		probability: 25,
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	const mockPipeline: Pipeline = {
		id: "pipeline-1",
		name: "Sales Pipeline",
		description: "Main sales funnel",
		isDefault: true,
		stages: [mockStage],
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	describe("listPipelines", () => {
		describe("正常系", () => {
			test("全パイプラインを取得する", async () => {
				mockPipelinesListPipelines.mockResolvedValue([mockPipeline]);

				const result = await listPipelines();

				expect(result).toEqual([mockPipeline]);
				expect(mockPipelinesListPipelines).toHaveBeenCalledTimes(1);
			});

			test("空配列が返される場合", async () => {
				mockPipelinesListPipelines.mockResolvedValue([]);

				const result = await listPipelines();

				expect(result).toEqual([]);
			});
		});
	});

	describe("getPipelineById", () => {
		describe("正常系", () => {
			test("IDでパイプラインを取得する", async () => {
				mockPipelinesGetPipelineById.mockResolvedValue(mockPipeline);

				const result = await getPipelineById("pipeline-1");

				expect(result).toEqual(mockPipeline);
				expect(mockPipelinesGetPipelineById).toHaveBeenCalledWith("pipeline-1");
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はエラーを伝播する", async () => {
				const error = new Error("Not Found");
				mockPipelinesGetPipelineById.mockRejectedValue(error);

				await expect(getPipelineById("non-existent")).rejects.toThrow("Not Found");
			});
		});
	});

	describe("getDefaultPipeline", () => {
		describe("正常系", () => {
			test("デフォルトパイプラインを取得する", async () => {
				mockPipelinesGetDefaultPipeline.mockResolvedValue(mockPipeline);

				const result = await getDefaultPipeline();

				expect(result).toEqual(mockPipeline);
				expect(result.isDefault).toBe(true);
				expect(mockPipelinesGetDefaultPipeline).toHaveBeenCalledTimes(1);
			});
		});

		describe("異常系", () => {
			test("デフォルトパイプラインが存在しない場合はエラーを伝播する", async () => {
				const error = new Error("No default pipeline");
				mockPipelinesGetDefaultPipeline.mockRejectedValue(error);

				await expect(getDefaultPipeline()).rejects.toThrow("No default pipeline");
			});
		});
	});

	describe("createPipeline", () => {
		describe("正常系", () => {
			test("パイプラインを作成する", async () => {
				const input: CreatePipelineInput = {
					name: "New Pipeline",
					description: "New description",
				};
				mockPipelinesCreatePipeline.mockResolvedValue({ ...mockPipeline, stages: [] });

				const result = await createPipeline(input);

				expect(result).toBeDefined();
				expect(mockPipelinesCreatePipeline).toHaveBeenCalledWith(input);
			});

			test("デフォルトパイプラインとして作成する", async () => {
				const input: CreatePipelineInput = {
					name: "Default Pipeline",
					isDefault: true,
				};
				mockPipelinesCreatePipeline.mockResolvedValue({ ...mockPipeline, isDefault: true });

				const result = await createPipeline(input);

				expect(result.isDefault).toBe(true);
			});
		});
	});

	describe("updatePipeline", () => {
		describe("正常系", () => {
			test("パイプラインを更新する", async () => {
				const input: UpdatePipelineInput = { name: "Updated Pipeline" };
				const updatedPipeline = { ...mockPipeline, name: "Updated Pipeline" };
				mockPipelinesUpdatePipeline.mockResolvedValue(updatedPipeline);

				const result = await updatePipeline("pipeline-1", input);

				expect(result.name).toBe("Updated Pipeline");
				expect(mockPipelinesUpdatePipeline).toHaveBeenCalledWith("pipeline-1", input);
			});
		});
	});

	describe("deletePipeline", () => {
		describe("正常系", () => {
			test("パイプラインを削除する", async () => {
				mockPipelinesDeletePipeline.mockResolvedValue(undefined);

				await deletePipeline("pipeline-1");

				expect(mockPipelinesDeletePipeline).toHaveBeenCalledWith("pipeline-1");
			});
		});
	});

	describe("createPipelineStage", () => {
		describe("正常系", () => {
			test("ステージを作成する", async () => {
				const input: CreatePipelineStageInput = {
					pipelineId: "pipeline-1",
					name: "New Stage",
					order: 1,
					probability: 50,
				};
				mockPipelinesCreatePipelineStage.mockResolvedValue({ ...mockStage, ...input });

				const result = await createPipelineStage("pipeline-1", input);

				expect(result.name).toBe("New Stage");
				expect(mockPipelinesCreatePipelineStage).toHaveBeenCalledWith("pipeline-1", input);
			});
		});
	});

	describe("updatePipelineStage", () => {
		describe("正常系", () => {
			test("ステージを更新する", async () => {
				const input: UpdatePipelineStageInput = { probability: 75 };
				const updatedStage = { ...mockStage, probability: 75 };
				mockPipelinesUpdatePipelineStage.mockResolvedValue(updatedStage);

				const result = await updatePipelineStage("pipeline-1", "stage-1", input);

				expect(result.probability).toBe(75);
				expect(mockPipelinesUpdatePipelineStage).toHaveBeenCalledWith("pipeline-1", "stage-1", input);
			});
		});
	});

	describe("deletePipelineStage", () => {
		describe("正常系", () => {
			test("ステージを削除する", async () => {
				mockPipelinesDeletePipelineStage.mockResolvedValue(undefined);

				await deletePipelineStage("pipeline-1", "stage-1");

				expect(mockPipelinesDeletePipelineStage).toHaveBeenCalledWith("pipeline-1", "stage-1");
			});
		});
	});

	describe("pipelines オブジェクト", () => {
		test("listメソッドが正しく動作する", async () => {
			mockPipelinesListPipelines.mockResolvedValue([mockPipeline]);

			const result = await pipelines.list();

			expect(result).toEqual([mockPipeline]);
		});

		test("getByIdメソッドが正しく動作する", async () => {
			mockPipelinesGetPipelineById.mockResolvedValue(mockPipeline);

			const result = await pipelines.getById("pipeline-1");

			expect(result).toEqual(mockPipeline);
		});

		test("getDefaultメソッドが正しく動作する", async () => {
			mockPipelinesGetDefaultPipeline.mockResolvedValue(mockPipeline);

			const result = await pipelines.getDefault();

			expect(result).toEqual(mockPipeline);
		});

		test("createStageメソッドが正しく動作する", async () => {
			mockPipelinesCreatePipelineStage.mockResolvedValue(mockStage);

			const result = await pipelines.createStage("pipeline-1", { pipelineId: "pipeline-1", name: "Stage", order: 0 });

			expect(result).toEqual(mockStage);
		});

		test("updateStageメソッドが正しく動作する", async () => {
			mockPipelinesUpdatePipelineStage.mockResolvedValue(mockStage);

			const result = await pipelines.updateStage("pipeline-1", "stage-1", { probability: 50 });

			expect(result).toEqual(mockStage);
		});

		test("deleteStageメソッドが正しく動作する", async () => {
			mockPipelinesDeletePipelineStage.mockResolvedValue(undefined);

			await pipelines.deleteStage("pipeline-1", "stage-1");

			expect(mockPipelinesDeletePipelineStage).toHaveBeenCalledWith("pipeline-1", "stage-1");
		});
	});
});
