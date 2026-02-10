import { describe, expect, test, vi, beforeEach } from "vitest";
import { emailsRouter } from "./emails";

// DIContainerをモック
vi.mock("~/di/container", () => ({
	DIContainer: vi.fn().mockImplementation(() => ({
		getGetEmailLogsUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue([
				{
					id: "123e4567-e89b-12d3-a456-426614174000",
					to: "test@example.com",
					from: "sender@example.com",
					subject: "Test Email",
					htmlContent: "<p>Test</p>",
					status: "SENT",
					createdAt: "2024-01-01T00:00:00.000Z",
					updatedAt: "2024-01-01T00:00:00.000Z",
				},
			]),
		})),
		getGetEmailLogByIdUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				to: "test@example.com",
				from: "sender@example.com",
				subject: "Test Email",
				htmlContent: "<p>Test</p>",
				status: "SENT",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getGetEmailTemplatesUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue([
				{
					id: "123e4567-e89b-12d3-a456-426614174000",
					name: "Test Template",
					slug: "test-template",
					subject: "Test Subject",
					htmlContent: "<p>Template</p>",
					isActive: true,
					createdAt: "2024-01-01T00:00:00.000Z",
					updatedAt: "2024-01-01T00:00:00.000Z",
				},
			]),
		})),
		getGetEmailTemplateByIdUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Test Template",
				slug: "test-template",
				subject: "Test Subject",
				htmlContent: "<p>Template</p>",
				isActive: true,
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getCreateEmailTemplateUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "New Template",
				slug: "new-template",
				subject: "New Subject",
				htmlContent: "<p>New</p>",
				isActive: true,
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getUpdateEmailTemplateUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				name: "Updated Template",
				slug: "updated-template",
				subject: "Updated Subject",
				htmlContent: "<p>Updated</p>",
				isActive: true,
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getDeleteEmailTemplateUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue(undefined),
		})),
		getSendEmailUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				to: "recipient@example.com",
				from: "sender@example.com",
				subject: "Test Email",
				htmlContent: "<p>Test</p>",
				status: "PENDING",
				createdAt: "2024-01-01T00:00:00.000Z",
				updatedAt: "2024-01-01T00:00:00.000Z",
			}),
		})),
		getSendEmailWithTemplateUseCase: vi.fn(() => ({
			execute: vi.fn().mockResolvedValue({
				id: "123e4567-e89b-12d3-a456-426614174000",
				to: "recipient@example.com",
				from: "sender@example.com",
				subject: "Template Email",
				htmlContent: "<p>Template content</p>",
				status: "PENDING",
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

describe("emailsRouter", () => {
	const mockEnv = {
		DATABASE_URL: "test-db-url",
		CACHE_URL: "test-cache-url",
		RESEND_API_KEY: "test-api-key",
		RESEND_FROM_EMAIL: "sender@example.com",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("GET /logs", () => {
		describe("正常系", () => {
			test("メールログ一覧を200で返す", async () => {
				// Given: モック環境
				const req = new Request("http://localhost/logs", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(Array.isArray(json)).toBe(true);
			});
		});
	});

	describe("GET /logs/:id", () => {
		describe("正常系", () => {
			test("指定されたIDのメールログを200で返す", async () => {
				// Given: 有効なUUID
				const req = new Request("http://localhost/logs/123e4567-e89b-12d3-a456-426614174000", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(json).toHaveProperty("id");
			});
		});

		describe("異常系", () => {
			test("無効なUUID形式の場合は400を返す", async () => {
				// Given: 無効なUUID
				const req = new Request("http://localhost/logs/invalid-uuid", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: 400エラー
				expect(res.status).toBe(400);
			});
		});
	});

	describe("GET /templates", () => {
		describe("正常系", () => {
			test("メールテンプレート一覧を200で返す", async () => {
				// Given: モック環境
				const req = new Request("http://localhost/templates", {
					method: "GET",
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
				const json = await res.json();
				expect(Array.isArray(json)).toBe(true);
			});
		});
	});

	describe("POST /templates", () => {
		describe("正常系", () => {
			test("新しいテンプレートを201で作成する", async () => {
				// Given: 有効なテンプレートデータ
				const req = new Request("http://localhost/templates", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "New Template",
						slug: "new-template",
						subject: "New Subject",
						htmlContent: "<p>New</p>",
					}),
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(201);
			});
		});
	});

	describe("PUT /templates/:id", () => {
		describe("正常系", () => {
			test("テンプレートを200で更新する", async () => {
				// Given: 更新データ
				const req = new Request("http://localhost/templates/123e4567-e89b-12d3-a456-426614174000", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "Updated Template",
					}),
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
			});
		});
	});

	describe("DELETE /templates/:id", () => {
		describe("正常系", () => {
			test("テンプレートを204で削除する", async () => {
				// Given: 削除対象ID
				const req = new Request("http://localhost/templates/123e4567-e89b-12d3-a456-426614174000", {
					method: "DELETE",
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: 204 No Content
				expect(res.status).toBe(204);
			});
		});
	});

	describe("POST /send", () => {
		describe("正常系", () => {
			test("メールを200で送信する", async () => {
				// Given: 有効なメールデータ
				const req = new Request("http://localhost/send", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						to: "recipient@example.com",
						subject: "Test Email",
						htmlContent: "<p>Test</p>",
					}),
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
			});
		});

		describe("異常系", () => {
			test("APIキーがない場合は500を返す", async () => {
				// Given: APIキーなし環境
				const envWithoutKey = {
					...mockEnv,
					RESEND_API_KEY: undefined,
				};

				const req = new Request("http://localhost/send", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						to: "recipient@example.com",
						subject: "Test",
						htmlContent: "<p>Test</p>",
					}),
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, envWithoutKey);

				// Then: 500エラー
				expect(res.status).toBe(500);
			});
		});
	});

	describe("POST /send-with-template", () => {
		describe("正常系", () => {
			test("テンプレートを使ってメールを200で送信する", async () => {
				// Given: 有効なテンプレート送信データ
				const req = new Request("http://localhost/send-with-template", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						to: "recipient@example.com",
						templateSlug: "test-template",
						variables: { name: "Test User" },
					}),
				});

				// When: リクエスト実行
				const res = await emailsRouter.request(req, mockEnv);

				// Then: レスポンス検証
				expect(res.status).toBe(200);
			});
		});
	});
});
