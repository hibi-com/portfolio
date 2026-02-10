import { describe, expect, test, vi, beforeEach } from "vitest";
import { leadsRouter } from "./leads";

// DIContainerをモック
vi.mock("~/di/container", () => ({
	DIContainer: vi.fn().mockImplementation(() => ({
		getGetLeadsUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue([
				{
					id: "123e4567-e89b-12d3-a456-426614174000",
					name: "Test Lead",
					status: "NEW",
					createdAt: "2024-01-01T00:00:00.000Z",
					updatedAt: "2024-01-01T00:00:00.000Z",
				},
			]),
		})),
		getGetLeadByIdUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Test Lead",
				status: "NEW",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getCreateLeadUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "New Lead",
				status: "NEW",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getUpdateLeadUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Updated Lead",
				status: "QUALIFIED",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getDeleteLeadUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue(undefined),
		})),
		getConvertLeadToDealUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "223e4567-e89b-12d3-a456-426614174000",
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

describe("leadsRouter", () => {
	const mockEnv = {
		DATABASE_URL: "test-db-url",
		CACHE_URL: "test-cache-url",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("GET /leads", () => {
		describe("正常系", () => {
			test("リード一覧を200で返す", async () => {
				// Given: モック環境
				const req = new Request("http://localhost/leads", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await leadsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(Array.isArray(json)).toBe(true);
			});
		});
	});

	describe("GET /leads/:id", () => {
		describe("正常系", () => {
			test("指定されたIDのリードを200で返す", async () => {
				// Given: 有効なUUID
				const req = new Request("http://localhost/leads/123e4567-e89b-12d3-a456-426614174000", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await leadsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(json).toHaveProperty("id");
			});
		});

		describe("異常系", () => {
			test("無効なUUID形式の場合は400を返す", async () => {
				// Given: 無効なUUID
				const req = new Request("http://localhost/leads/invalid-uuid", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await leadsRouter.request(req, mockEnv);

				// Then: 400エラー
				expect(res.status).toBe(400);
			});
		});
	});

	describe("POST /leads", () => {
		describe("正常系", () => {
			test("新しいリードを201で作成する", async () => {
				// Given: 有効なリードデータ
				const req = new Request("http://localhost/leads", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "New Lead",
					}),
				});

				// When: リクエスト実行
				const res = await leadsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(201);
			});
		});
	});

	describe("POST /leads/:id/convert", () => {
		describe("正常系", () => {
			test("リードをディールに変換して200とdealIdを返す", async () => {
				// Given: 有効なUUID
				const req = new Request("http://localhost/leads/123e4567-e89b-12d3-a456-426614174000/convert", {
					method: "POST",
				});

				// When: リクエスト実行
				const res = await leadsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(json).toHaveProperty("dealId");
			});
		});
	});

	describe("DELETE /leads/:id", () => {
		describe("正常系", () => {
			test("リードを204で削除する", async () => {
				// Given: 削除対象ID
				const req = new Request("http://localhost/leads/123e4567-e89b-12d3-a456-426614174000", {
					method: "DELETE",
				});

				// When: リクエスト実行
				const res = await leadsRouter.request(req, mockEnv);

				// Then: 204 No Content
				expect(res.status).toBe(204);
			});
		});
	});
});
