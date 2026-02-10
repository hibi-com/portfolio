import type {
	CreateEmailTemplateInput,
	EmailLog,
	EmailsListEmailLogs200,
	EmailsListEmailLogsParams,
	EmailsSendEmailWithTemplateParams,
	EmailTemplate,
	SendEmailInput,
	UpdateEmailTemplateInput,
} from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/emails/emails", () => ({
	getEmails: vi.fn(() => ({
		emailsListEmailLogs: vi.fn(),
		emailsGetEmailLogById: vi.fn(),
		emailsSendEmail: vi.fn(),
		emailsListEmailTemplates: vi.fn(),
		emailsGetEmailTemplateById: vi.fn(),
		emailsGetEmailTemplateBySlug: vi.fn(),
		emailsCreateEmailTemplate: vi.fn(),
		emailsUpdateEmailTemplate: vi.fn(),
		emailsDeleteEmailTemplate: vi.fn(),
		emailsSendEmailWithTemplate: vi.fn(),
	})),
}));

import { getEmails } from "@generated/emails/emails";
import {
	createEmailTemplate,
	deleteEmailTemplate,
	emails,
	getEmailLogById,
	getEmailTemplateById,
	getEmailTemplateBySlug,
	listEmailLogs,
	listEmailTemplates,
	sendEmail,
	sendEmailWithTemplate,
	updateEmailTemplate,
} from "./emails";

describe("emails client", () => {
	const mockEmailsListEmailLogs = vi.fn();
	const mockEmailsGetEmailLogById = vi.fn();
	const mockEmailsSendEmail = vi.fn();
	const mockEmailsListEmailTemplates = vi.fn();
	const mockEmailsGetEmailTemplateById = vi.fn();
	const mockEmailsGetEmailTemplateBySlug = vi.fn();
	const mockEmailsCreateEmailTemplate = vi.fn();
	const mockEmailsUpdateEmailTemplate = vi.fn();
	const mockEmailsDeleteEmailTemplate = vi.fn();
	const mockEmailsSendEmailWithTemplate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getEmails).mockReturnValue({
			emailsListEmailLogs: mockEmailsListEmailLogs,
			emailsGetEmailLogById: mockEmailsGetEmailLogById,
			emailsSendEmail: mockEmailsSendEmail,
			emailsListEmailTemplates: mockEmailsListEmailTemplates,
			emailsGetEmailTemplateById: mockEmailsGetEmailTemplateById,
			emailsGetEmailTemplateBySlug: mockEmailsGetEmailTemplateBySlug,
			emailsCreateEmailTemplate: mockEmailsCreateEmailTemplate,
			emailsUpdateEmailTemplate: mockEmailsUpdateEmailTemplate,
			emailsDeleteEmailTemplate: mockEmailsDeleteEmailTemplate,
			emailsSendEmailWithTemplate: mockEmailsSendEmailWithTemplate,
		});
	});

	const mockEmailLog: EmailLog = {
		id: "log-123",
		fromEmail: "noreply@example.com",
		toEmail: "user@example.com",
		subject: "Test Email",
		status: "SENT",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	const mockEmailTemplate: EmailTemplate = {
		id: "tmpl-123",
		name: "Welcome Email",
		slug: "welcome-email",
		category: "TRANSACTIONAL",
		subject: "Welcome!",
		htmlContent: "<p>Welcome to our service</p>",
		isActive: true,
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	describe("listEmailLogs", () => {
		describe("正常系", () => {
			test("パラメータなしで全メールログを取得する", async () => {
				const mockResponse: EmailsListEmailLogs200 = {
					data: [mockEmailLog],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockEmailsListEmailLogs.mockResolvedValue(mockResponse);

				const result = await listEmailLogs();

				expect(result).toEqual(mockResponse);
				expect(mockEmailsListEmailLogs).toHaveBeenCalledWith(undefined);
			});

			test("ステータスフィルターを渡してメールログを取得する", async () => {
				const params: EmailsListEmailLogsParams = { status: "SENT" };
				const mockResponse: EmailsListEmailLogs200 = {
					data: [mockEmailLog],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockEmailsListEmailLogs.mockResolvedValue(mockResponse);

				await listEmailLogs(params);

				expect(mockEmailsListEmailLogs).toHaveBeenCalledWith(params);
			});
		});
	});

	describe("getEmailLogById", () => {
		describe("正常系", () => {
			test("IDでメールログを取得する", async () => {
				mockEmailsGetEmailLogById.mockResolvedValue(mockEmailLog);

				const result = await getEmailLogById("log-123");

				expect(result).toEqual(mockEmailLog);
				expect(mockEmailsGetEmailLogById).toHaveBeenCalledWith("log-123");
			});
		});
	});

	describe("sendEmail", () => {
		describe("正常系", () => {
			test("メールを送信する", async () => {
				const input: SendEmailInput = {
					toEmail: "user@example.com",
					subject: "Test",
					htmlContent: "<p>Test</p>",
				};
				mockEmailsSendEmail.mockResolvedValue(mockEmailLog);

				const result = await sendEmail(input);

				expect(result).toEqual(mockEmailLog);
				expect(mockEmailsSendEmail).toHaveBeenCalledWith(input);
			});

			test("テンプレートIDを指定してメールを送信する", async () => {
				const input: SendEmailInput = {
					toEmail: "user@example.com",
					subject: "Test",
					templateId: "tmpl-123",
					variables: { name: "John" },
				};
				mockEmailsSendEmail.mockResolvedValue(mockEmailLog);

				await sendEmail(input);

				expect(mockEmailsSendEmail).toHaveBeenCalledWith(input);
			});
		});
	});

	describe("listEmailTemplates", () => {
		describe("正常系", () => {
			test("全テンプレートを取得する", async () => {
				mockEmailsListEmailTemplates.mockResolvedValue([mockEmailTemplate]);

				const result = await listEmailTemplates();

				expect(result).toEqual([mockEmailTemplate]);
				expect(mockEmailsListEmailTemplates).toHaveBeenCalledWith(undefined);
			});

			test("カテゴリでフィルターする", async () => {
				mockEmailsListEmailTemplates.mockResolvedValue([mockEmailTemplate]);

				await listEmailTemplates({ category: "TRANSACTIONAL" });

				expect(mockEmailsListEmailTemplates).toHaveBeenCalledWith({ category: "TRANSACTIONAL" });
			});
		});
	});

	describe("getEmailTemplateById", () => {
		describe("正常系", () => {
			test("IDでテンプレートを取得する", async () => {
				mockEmailsGetEmailTemplateById.mockResolvedValue(mockEmailTemplate);

				const result = await getEmailTemplateById("tmpl-123");

				expect(result).toEqual(mockEmailTemplate);
				expect(mockEmailsGetEmailTemplateById).toHaveBeenCalledWith("tmpl-123");
			});
		});
	});

	describe("getEmailTemplateBySlug", () => {
		describe("正常系", () => {
			test("slugでテンプレートを取得する", async () => {
				mockEmailsGetEmailTemplateBySlug.mockResolvedValue(mockEmailTemplate);

				const result = await getEmailTemplateBySlug("welcome-email");

				expect(result).toEqual(mockEmailTemplate);
				expect(mockEmailsGetEmailTemplateBySlug).toHaveBeenCalledWith("welcome-email");
			});
		});
	});

	describe("createEmailTemplate", () => {
		describe("正常系", () => {
			test("テンプレートを作成する", async () => {
				const input: CreateEmailTemplateInput = {
					name: "New Template",
					slug: "new-template",
					subject: "Subject",
					htmlContent: "<p>Content</p>",
				};
				mockEmailsCreateEmailTemplate.mockResolvedValue({ ...mockEmailTemplate, ...input });

				const result = await createEmailTemplate(input);

				expect(result.name).toBe("New Template");
				expect(mockEmailsCreateEmailTemplate).toHaveBeenCalledWith(input);
			});

			test("変数付きテンプレートを作成する", async () => {
				const input: CreateEmailTemplateInput = {
					name: "Template with vars",
					slug: "template-vars",
					subject: "Hello {{name}}",
					htmlContent: "<p>Hi {{name}}</p>",
					variables: ["name"],
				};
				mockEmailsCreateEmailTemplate.mockResolvedValue({ ...mockEmailTemplate, ...input });

				const result = await createEmailTemplate(input);

				expect(result.variables).toContain("name");
			});
		});
	});

	describe("updateEmailTemplate", () => {
		describe("正常系", () => {
			test("テンプレートを更新する", async () => {
				const input: UpdateEmailTemplateInput = { name: "Updated Template" };
				const updatedTemplate = { ...mockEmailTemplate, name: "Updated Template" };
				mockEmailsUpdateEmailTemplate.mockResolvedValue(updatedTemplate);

				const result = await updateEmailTemplate("tmpl-123", input);

				expect(result.name).toBe("Updated Template");
				expect(mockEmailsUpdateEmailTemplate).toHaveBeenCalledWith("tmpl-123", input);
			});

			test("テンプレートを無効化する", async () => {
				const input: UpdateEmailTemplateInput = { isActive: false };
				const updatedTemplate = { ...mockEmailTemplate, isActive: false };
				mockEmailsUpdateEmailTemplate.mockResolvedValue(updatedTemplate);

				const result = await updateEmailTemplate("tmpl-123", input);

				expect(result.isActive).toBe(false);
			});
		});
	});

	describe("deleteEmailTemplate", () => {
		describe("正常系", () => {
			test("テンプレートを削除する", async () => {
				mockEmailsDeleteEmailTemplate.mockResolvedValue(undefined);

				await deleteEmailTemplate("tmpl-123");

				expect(mockEmailsDeleteEmailTemplate).toHaveBeenCalledWith("tmpl-123");
			});
		});
	});

	describe("sendEmailWithTemplate", () => {
		describe("正常系", () => {
			test("テンプレートを使ってメールを送信する", async () => {
				const params: EmailsSendEmailWithTemplateParams = {
					templateSlug: "welcome-email",
					toEmail: "user@example.com",
				};
				mockEmailsSendEmailWithTemplate.mockResolvedValue(mockEmailLog);

				const result = await sendEmailWithTemplate(params);

				expect(result).toEqual(mockEmailLog);
				expect(mockEmailsSendEmailWithTemplate).toHaveBeenCalledWith(params, undefined);
			});

			test("変数を渡してテンプレートメールを送信する", async () => {
				const params: EmailsSendEmailWithTemplateParams = {
					templateSlug: "welcome-email",
					toEmail: "user@example.com",
				};
				const body = { variables: { name: "John" } };
				mockEmailsSendEmailWithTemplate.mockResolvedValue(mockEmailLog);

				await sendEmailWithTemplate(params, body);

				expect(mockEmailsSendEmailWithTemplate).toHaveBeenCalledWith(params, body);
			});
		});
	});

	describe("emails オブジェクト", () => {
		test("listLogsメソッドが正しく動作する", async () => {
			const mockResponse: EmailsListEmailLogs200 = {
				data: [],
				meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
			};
			mockEmailsListEmailLogs.mockResolvedValue(mockResponse);

			const result = await emails.listLogs();

			expect(result).toEqual(mockResponse);
		});

		test("getLogByIdメソッドが正しく動作する", async () => {
			mockEmailsGetEmailLogById.mockResolvedValue(mockEmailLog);

			const result = await emails.getLogById("log-123");

			expect(result).toEqual(mockEmailLog);
		});

		test("sendメソッドが正しく動作する", async () => {
			mockEmailsSendEmail.mockResolvedValue(mockEmailLog);

			const result = await emails.send({ toEmail: "user@example.com", subject: "Test" });

			expect(result).toEqual(mockEmailLog);
		});

		test("listTemplatesメソッドが正しく動作する", async () => {
			mockEmailsListEmailTemplates.mockResolvedValue([mockEmailTemplate]);

			const result = await emails.listTemplates();

			expect(result).toEqual([mockEmailTemplate]);
		});

		test("getTemplateByIdメソッドが正しく動作する", async () => {
			mockEmailsGetEmailTemplateById.mockResolvedValue(mockEmailTemplate);

			const result = await emails.getTemplateById("tmpl-123");

			expect(result).toEqual(mockEmailTemplate);
		});

		test("getTemplateBySlugメソッドが正しく動作する", async () => {
			mockEmailsGetEmailTemplateBySlug.mockResolvedValue(mockEmailTemplate);

			const result = await emails.getTemplateBySlug("welcome-email");

			expect(result).toEqual(mockEmailTemplate);
		});

		test("createTemplateメソッドが正しく動作する", async () => {
			mockEmailsCreateEmailTemplate.mockResolvedValue(mockEmailTemplate);

			const result = await emails.createTemplate({
				name: "Test",
				slug: "test",
				subject: "Test",
				htmlContent: "<p>Test</p>",
			});

			expect(result).toEqual(mockEmailTemplate);
		});

		test("sendWithTemplateメソッドが正しく動作する", async () => {
			mockEmailsSendEmailWithTemplate.mockResolvedValue(mockEmailLog);

			const result = await emails.sendWithTemplate({ templateSlug: "welcome-email", toEmail: "user@example.com" });

			expect(result).toEqual(mockEmailLog);
		});
	});
});
