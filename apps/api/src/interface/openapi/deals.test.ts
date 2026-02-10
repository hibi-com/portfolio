import { describe, expect, test, vi, beforeEach } from "vitest";
import { dealsRouter } from "./deals";

// DIContainerをモック
vi.mock("~/di/container", () => ({
	DIContainer: vi.fn().mockImplementation(() => ({
		getGetDealsUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue([
				{
					id: "123e4567-e89b-12d3-a456-426614174000",
					name: "Test Deal",
					stageId: "stage-123",
					status: "OPEN",
					createdAt: "2024-01-01T00:00:00.000Z",
					updatedAt: "2024-01-01T00:00:00.000Z",
				},
			]),
		})),
		getGetDealByIdUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Test Deal",
				stageId: "stage-123",
				status: "OPEN",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getCreateDealUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "New Deal",
				stageId: "stage-123",
				status: "OPEN",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getUpdateDealUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Updated Deal",
				stageId: "stage-123",
				status: "WON",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getDeleteDealUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue(undefined),
		})),
		getMoveDealToStageUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Test Deal",
				stageId: "stage-456",
				status: "OPEN",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
	})),
}));

// Logger & Metricsをモック
vi.mock("~/lib/logger", () => ({
	getLogger: vi.fn(() => ({
		logError: vi.fn(),
	})),
	getMetrics: vi.fn(() => ({
		httpRequestDuration: {
			observe: vi.fn(),
		},
		httpRequestTotal: {
			inc: vi.fn(),
		},
	})),
}));

// Validation utilityをモック
vi.mock("~/lib/validation", () => ({
	isValidUuid: vi.fn((str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)),
}));

describe("dealsRouter", () => {
	const mockEnv = {
		DATABASE_URL: "test-db-url",
		CACHE_URL: "test-cache-url",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("GET /deals", () => {
		describe("正常系", () => {
			test("ディール一覧を200で返す", async () => {
				// Given: モック環境
				const req = new Request("http://localhost/deals", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await dealsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(Array.isArray(json)).toBe(true);
			});
		});
	});

	describe("GET /deals/:id", () => {
		describe("正常系", () => {
			test("指定されたIDのディールを200で返す", async () => {
				// Given: 有効なUUID
				const req = new Request("http://localhost/deals/123e4567-e89b-12d3-a456-426614174000", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await dealsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(json).toHaveProperty("id");
			});
		});

		describe("異常系", () => {
			test("無効なUUID形式の場合は400を返す", async () => {
				// Given: 無効なUUID
				const req = new Request("http://localhost/deals/invalid-uuid", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await dealsRouter.request(req, mockEnv);

				// Then: 400エラー
				expect(res.status).toBe(400);
			});
		});
	});

	describe("POST /deals", () => {
		describe("正常系", () => {
			test("新しいディールを201で作成する", async () => {
				// Given: 有効なディールデータ
				const req = new Request("http://localhost/deals", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "New Deal",
						stageId: "stage-123",
					}),
				});

				// When: リクエスト実行
				const res = await dealsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(201);
			});
		});
	});

	describe("PUT /deals/:id/stage", () => {
		describe("正常系", () => {
			test("ディールのステージを200で移動する", async () => {
				// Given: 有効なstageId
				const req = new Request("http://localhost/deals/123e4567-e89b-12d3-a456-426614174000/stage", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						stageId: "stage-456",
					}),
				});

				// When: リクエスト実行
				const res = await dealsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(json).toHaveProperty("stageId", "stage-456");
			});
		});
	});

	describe("DELETE /deals/:id", () => {
		describe("正常系", () => {
			test("ディールを204で削除する", async () => {
				// Given: 削除対象ID
				const req = new Request("http://localhost/deals/123e4567-e89b-12d3-a456-426614174000", {
					method: "DELETE",
				});

				// When: リクエスト実行
				const res = await dealsRouter.request(req, mockEnv);

				// Then: 204 No Content
				expect(res.status).toBe(204);
			});
		});
	});
});
