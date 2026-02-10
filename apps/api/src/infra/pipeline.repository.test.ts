import { beforeEach, describe, expect, test, vi } from "vitest";
import { PipelineRepositoryImpl } from "./pipeline.repository";

const mockPrismaClient = {
	pipeline: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		updateMany: vi.fn(),
		delete: vi.fn(),
	},
	pipelineStage: {
		findUnique: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
};

vi.mock("@portfolio/db", () => ({
	createPrismaClient: () => mockPrismaClient,
}));

describe("PipelineRepositoryImpl", () => {
	let repository: PipelineRepositoryImpl;

	beforeEach(() => {
		vi.clearAllMocks();
		repository = new PipelineRepositoryImpl();
	});

	const mockStageData = {
		id: "stage-uuid-1",
		pipelineId: "pipeline-uuid-1",
		name: "Prospect",
		order: 1,
		probability: 10,
		color: "#FF0000",
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	const mockPipelineData = {
		id: "pipeline-uuid-1",
		name: "Sales Pipeline",
		description: "Standard sales pipeline",
		isDefault: true,
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
		stages: [mockStageData],
	};

	describe("findAll", () => {
		describe("正常系", () => {
			test("全パイプラインとステージを取得できる", async () => {
				// Given: パイプラインが存在する場合
				mockPrismaClient.pipeline.findMany.mockResolvedValue([mockPipelineData]);

				// When: 全パイプラインを取得
				const result = await repository.findAll();

				// Then: パイプラインとステージが返却される
				expect(result).toHaveLength(1);
				expect(result[0]?.id).toBe("pipeline-uuid-1");
				expect(result[0]?.stages).toHaveLength(1);
				expect(result[0]?.stages[0]?.name).toBe("Prospect");
			});
		});
	});

	describe("findById", () => {
		describe("正常系", () => {
			test("IDでパイプラインを取得できる", async () => {
				// Given: パイプラインが存在する場合
				mockPrismaClient.pipeline.findUnique.mockResolvedValue(mockPipelineData);

				// When: IDでパイプラインを取得
				const result = await repository.findById("pipeline-uuid-1");

				// Then: パイプラインが返却される
				expect(result).not.toBeNull();
				expect(result?.id).toBe("pipeline-uuid-1");
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はnullを返す", async () => {
				// Given: パイプラインが存在しない場合
				mockPrismaClient.pipeline.findUnique.mockResolvedValue(null);

				// When: IDでパイプラインを取得
				const result = await repository.findById("non-existent");

				// Then: nullが返却される
				expect(result).toBeNull();
			});
		});
	});

	describe("findDefault", () => {
		describe("正常系", () => {
			test("デフォルトパイプラインを取得できる", async () => {
				// Given: デフォルトパイプラインが存在する場合
				mockPrismaClient.pipeline.findFirst.mockResolvedValue(mockPipelineData);

				// When: デフォルトパイプラインを取得
				const result = await repository.findDefault();

				// Then: デフォルトパイプラインが返却される
				expect(result).not.toBeNull();
				expect(result?.isDefault).toBe(true);
				expect(mockPrismaClient.pipeline.findFirst).toHaveBeenCalledWith({
					where: { isDefault: true },
					include: { stages: { orderBy: { order: "asc" } } },
				});
			});
		});
	});

	describe("create", () => {
		describe("正常系", () => {
			test("新しいパイプラインを作成できる", async () => {
				// Given: 作成用データ
				const createData = {
					name: "New Pipeline",
					description: "Test pipeline",
				};
				mockPrismaClient.pipeline.create.mockResolvedValue({
					...mockPipelineData,
					...createData,
					id: "new-pipeline-uuid",
					stages: [],
				});

				// When: パイプラインを作成
				const result = await repository.create(createData);

				// Then: パイプラインが作成される
				expect(result.id).toBe("new-pipeline-uuid");
				expect(result.name).toBe("New Pipeline");
			});

			test("デフォルトパイプラインとして作成すると他のデフォルトが解除される", async () => {
				// Given: デフォルトフラグを付けて作成
				const createData = {
					name: "New Default Pipeline",
					isDefault: true,
				};
				mockPrismaClient.pipeline.updateMany.mockResolvedValue({ count: 1 });
				mockPrismaClient.pipeline.create.mockResolvedValue({
					...mockPipelineData,
					...createData,
					id: "new-default-uuid",
					stages: [],
				});

				// When: パイプラインを作成
				const result = await repository.create(createData);

				// Then: 既存のデフォルトが解除される
				expect(mockPrismaClient.pipeline.updateMany).toHaveBeenCalledWith({
					where: { isDefault: true },
					data: { isDefault: false },
				});
				expect(result.isDefault).toBe(true);
			});
		});
	});

	describe("update", () => {
		describe("正常系", () => {
			test("パイプラインを更新できる", async () => {
				// Given: 更新用データ
				const updateData = { name: "Updated Pipeline" };
				mockPrismaClient.pipeline.update.mockResolvedValue({
					...mockPipelineData,
					...updateData,
				});

				// When: パイプラインを更新
				const result = await repository.update("pipeline-uuid-1", updateData);

				// Then: パイプラインが更新される
				expect(result.name).toBe("Updated Pipeline");
			});
		});
	});

	describe("delete", () => {
		describe("正常系", () => {
			test("パイプラインを削除できる", async () => {
				// Given: パイプラインが存在する場合
				mockPrismaClient.pipeline.delete.mockResolvedValue(mockPipelineData);

				// When: パイプラインを削除
				await repository.delete("pipeline-uuid-1");

				// Then: 削除が実行される
				expect(mockPrismaClient.pipeline.delete).toHaveBeenCalledWith({
					where: { id: "pipeline-uuid-1" },
				});
			});
		});
	});

	describe("createStage", () => {
		describe("正常系", () => {
			test("新しいステージを作成できる", async () => {
				// Given: ステージ作成用データ
				const createData = {
					pipelineId: "pipeline-uuid-1",
					name: "New Stage",
					order: 2,
					probability: 50,
				};
				mockPrismaClient.pipelineStage.create.mockResolvedValue({
					...mockStageData,
					...createData,
					id: "new-stage-uuid",
				});

				// When: ステージを作成
				const result = await repository.createStage(createData);

				// Then: ステージが作成される
				expect(result.id).toBe("new-stage-uuid");
				expect(result.name).toBe("New Stage");
			});
		});
	});

	describe("updateStage", () => {
		describe("正常系", () => {
			test("ステージを更新できる", async () => {
				// Given: ステージ更新用データ
				const updateData = { name: "Updated Stage" };
				mockPrismaClient.pipelineStage.update.mockResolvedValue({
					...mockStageData,
					...updateData,
				});

				// When: ステージを更新
				const result = await repository.updateStage("stage-uuid-1", updateData);

				// Then: ステージが更新される
				expect(result.name).toBe("Updated Stage");
			});
		});
	});

	describe("deleteStage", () => {
		describe("正常系", () => {
			test("ステージを削除できる", async () => {
				// Given: ステージが存在する場合
				mockPrismaClient.pipelineStage.delete.mockResolvedValue(mockStageData);

				// When: ステージを削除
				await repository.deleteStage("stage-uuid-1");

				// Then: 削除が実行される
				expect(mockPrismaClient.pipelineStage.delete).toHaveBeenCalledWith({
					where: { id: "stage-uuid-1" },
				});
			});
		});
	});

	describe("findStageById", () => {
		describe("正常系", () => {
			test("IDでステージを取得できる", async () => {
				// Given: ステージが存在する場合
				mockPrismaClient.pipelineStage.findUnique.mockResolvedValue(mockStageData);

				// When: IDでステージを取得
				const result = await repository.findStageById("stage-uuid-1");

				// Then: ステージが返却される
				expect(result).not.toBeNull();
				expect(result?.id).toBe("stage-uuid-1");
			});
		});
	});
});
