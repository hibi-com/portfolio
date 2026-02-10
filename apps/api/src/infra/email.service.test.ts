import { beforeEach, describe, expect, test, vi } from "vitest";
import type { EmailLog, EmailRepository, EmailTemplate } from "~/domain/email";
import { ResendEmailService } from "./email.service";

const mockEmailRepository: EmailRepository = {
	findAllLogs: vi.fn(),
	findLogById: vi.fn(),
	findLogsByCustomerId: vi.fn(),
	createLog: vi.fn(),
	updateLogStatus: vi.fn(),
	findAllTemplates: vi.fn(),
	findTemplateById: vi.fn(),
	findTemplateBySlug: vi.fn(),
	createTemplate: vi.fn(),
	updateTemplate: vi.fn(),
	deleteTemplate: vi.fn(),
};

global.fetch = vi.fn();

describe("ResendEmailService", () => {
	let service: ResendEmailService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new ResendEmailService(mockEmailRepository, "test-api-key", "default@example.com");
	});

	const mockEmailLog: EmailLog = {
		id: "log-uuid-1",
		customerId: "customer-uuid-1",
		fromEmail: "from@example.com",
		toEmail: "to@example.com",
		subject: "Test Subject",
		status: "PENDING",
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	const mockTemplate: EmailTemplate = {
		id: "template-uuid-1",
		name: "Welcome Email",
		slug: "welcome-email",
		category: "TRANSACTIONAL",
		subject: "Welcome {{name}}",
		htmlContent: "<p>Welcome {{name}}</p>",
		textContent: "Welcome {{name}}",
		variables: ["name"],
		isActive: true,
		createdAt: new Date("2025-01-01T00:00:00Z"),
		updatedAt: new Date("2025-01-01T00:00:00Z"),
	};

	describe("send", () => {
		describe("正常系", () => {
			test("メールを送信してログを作成できる", async () => {
				// Given: メール送信が成功する場合
				vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
				vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
					...mockEmailLog,
					status: "SENT",
					resendId: "resend-id-1",
					sentAt: new Date(),
				});
				vi.mocked(fetch).mockResolvedValue({
					ok: true,
					json: async () => ({ id: "resend-id-1" }),
				} as Response);

				// When: メールを送信
				const result = await service.send({
					toEmail: "to@example.com",
					subject: "Test",
					htmlContent: "<p>Test</p>",
				});

				// Then: 送信成功ログが返却される
				expect(result.status).toBe("SENT");
				expect(result.resendId).toBe("resend-id-1");
				expect(mockEmailRepository.createLog).toHaveBeenCalledWith(
					expect.objectContaining({
						toEmail: "to@example.com",
						status: "PENDING",
					}),
				);
				expect(mockEmailRepository.updateLogStatus).toHaveBeenCalledWith(
					"log-uuid-1",
					"SENT",
					expect.objectContaining({
						resendId: "resend-id-1",
					}),
				);
			});

			test("fromEmailが指定されていない場合はデフォルトを使用する", async () => {
				// Given: fromEmailが指定されていない場合
				vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
				vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
					...mockEmailLog,
					status: "SENT",
				});
				vi.mocked(fetch).mockResolvedValue({
					ok: true,
					json: async () => ({ id: "resend-id-1" }),
				} as Response);

				// When: メールを送信
				await service.send({
					toEmail: "to@example.com",
					subject: "Test",
					htmlContent: "<p>Test</p>",
				});

				// Then: デフォルトのfromEmailが使用される
				expect(mockEmailRepository.createLog).toHaveBeenCalledWith(
					expect.objectContaining({
						fromEmail: "default@example.com",
					}),
				);
			});
		});

		describe("異常系", () => {
			test("Resend APIがエラーを返す場合はFAILEDステータスになる", async () => {
				// Given: Resend APIがエラーを返す場合
				vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
				vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
					...mockEmailLog,
					status: "FAILED",
					errorMessage: "API Error",
				});
				vi.mocked(fetch).mockResolvedValue({
					ok: false,
					json: async () => ({
						statusCode: 400,
						message: "API Error",
						name: "BadRequest",
					}),
				} as Response);

				// When: メールを送信
				const result = await service.send({
					toEmail: "to@example.com",
					subject: "Test",
					htmlContent: "<p>Test</p>",
				});

				// Then: FAILEDステータスが返却される
				expect(result.status).toBe("FAILED");
				expect(result.errorMessage).toBe("API Error");
				expect(mockEmailRepository.updateLogStatus).toHaveBeenCalledWith(
					"log-uuid-1",
					"FAILED",
					expect.objectContaining({
						errorMessage: "API Error",
					}),
				);
			});

			test("ネットワークエラーの場合もFAILEDステータスになる", async () => {
				// Given: ネットワークエラーが発生する場合
				vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
				vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
					...mockEmailLog,
					status: "FAILED",
					errorMessage: "Network error",
				});
				vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

				// When: メールを送信
				const result = await service.send({
					toEmail: "to@example.com",
					subject: "Test",
					htmlContent: "<p>Test</p>",
				});

				// Then: FAILEDステータスが返却される
				expect(result.status).toBe("FAILED");
				expect(result.errorMessage).toBe("Network error");
			});
		});
	});

	describe("sendWithTemplate", () => {
		describe("正常系", () => {
			test("テンプレートを使用してメールを送信できる", async () => {
				// Given: テンプレートが存在し、変数を置換する場合
				vi.mocked(mockEmailRepository.findTemplateBySlug).mockResolvedValue(mockTemplate);
				vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
				vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
					...mockEmailLog,
					status: "SENT",
				});
				vi.mocked(fetch).mockResolvedValue({
					ok: true,
					json: async () => ({ id: "resend-id-1" }),
				} as Response);

				// When: テンプレートを使用してメールを送信
				const result = await service.sendWithTemplate(
					"welcome-email",
					"to@example.com",
					{ name: "John" },
					"customer-uuid-1",
				);

				// Then: 変数が置換されてメールが送信される
				expect(result.status).toBe("SENT");
				expect(mockEmailRepository.createLog).toHaveBeenCalledWith(
					expect.objectContaining({
						toEmail: "to@example.com",
						subject: "Welcome John",
						htmlContent: "<p>Welcome John</p>",
					}),
				);
			});

			test("変数がない場合はそのままテンプレートを使用する", async () => {
				// Given: テンプレートが存在し、変数を指定しない場合
				vi.mocked(mockEmailRepository.findTemplateBySlug).mockResolvedValue(mockTemplate);
				vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
				vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
					...mockEmailLog,
					status: "SENT",
				});
				vi.mocked(fetch).mockResolvedValue({
					ok: true,
					json: async () => ({ id: "resend-id-1" }),
				} as Response);

				// When: テンプレートを使用してメールを送信
				const result = await service.sendWithTemplate("welcome-email", "to@example.com");

				// Then: テンプレートがそのまま使用される
				expect(result.status).toBe("SENT");
				expect(mockEmailRepository.createLog).toHaveBeenCalledWith(
					expect.objectContaining({
						subject: "Welcome {{name}}",
						htmlContent: "<p>Welcome {{name}}</p>",
					}),
				);
			});
		});

		describe("異常系", () => {
			test("テンプレートが存在しない場合はエラーをスローする", async () => {
				// Given: テンプレートが存在しない場合
				vi.mocked(mockEmailRepository.findTemplateBySlug).mockResolvedValue(null);

				// When & Then: エラーがスローされる
				await expect(service.sendWithTemplate("non-existent", "to@example.com")).rejects.toThrow(
					"Template not found: non-existent",
				);
			});

			test("テンプレートが無効な場合はエラーをスローする", async () => {
				// Given: テンプレートが無効な場合
				vi.mocked(mockEmailRepository.findTemplateBySlug).mockResolvedValue({
					...mockTemplate,
					isActive: false,
				});

				// When & Then: エラーがスローされる
				await expect(service.sendWithTemplate("welcome-email", "to@example.com")).rejects.toThrow(
					"Template is not active: welcome-email",
				);
			});
		});
	});
});
