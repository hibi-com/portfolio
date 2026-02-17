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

globalThis.fetch = vi.fn();

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
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
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
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
    };

    describe("send", () => {
        describe("正常系", () => {
            test("メールを送信してログを作成できる", async () => {
                vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
                vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
                    ...mockEmailLog,
                    status: "SENT",
                    resendId: "resend-id-1",
                    sentAt: new Date().toISOString(),
                });
                vi.mocked(fetch).mockResolvedValue({
                    ok: true,
                    json: async () => ({ id: "resend-id-1" }),
                } as Response);

                const result = await service.send({
                    toEmail: "to@example.com",
                    subject: "Test",
                    htmlContent: "<p>Test</p>",
                });

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
                vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
                vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
                    ...mockEmailLog,
                    status: "SENT",
                });
                vi.mocked(fetch).mockResolvedValue({
                    ok: true,
                    json: async () => ({ id: "resend-id-1" }),
                } as Response);

                await service.send({
                    toEmail: "to@example.com",
                    subject: "Test",
                    htmlContent: "<p>Test</p>",
                });

                expect(mockEmailRepository.createLog).toHaveBeenCalledWith(
                    expect.objectContaining({
                        fromEmail: "default@example.com",
                    }),
                );
            });
        });

        describe("異常系", () => {
            test("Resend APIがエラーを返す場合はFAILEDステータスになる", async () => {
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

                const result = await service.send({
                    toEmail: "to@example.com",
                    subject: "Test",
                    htmlContent: "<p>Test</p>",
                });

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
                vi.mocked(mockEmailRepository.createLog).mockResolvedValue(mockEmailLog);
                vi.mocked(mockEmailRepository.updateLogStatus).mockResolvedValue({
                    ...mockEmailLog,
                    status: "FAILED",
                    errorMessage: "Network error",
                });
                vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

                const result = await service.send({
                    toEmail: "to@example.com",
                    subject: "Test",
                    htmlContent: "<p>Test</p>",
                });

                expect(result.status).toBe("FAILED");
                expect(result.errorMessage).toBe("Network error");
            });
        });
    });

    describe("sendWithTemplate", () => {
        describe("正常系", () => {
            test("テンプレートを使用してメールを送信できる", async () => {
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

                const result = await service.sendWithTemplate(
                    "welcome-email",
                    "to@example.com",
                    { name: "John" },
                    "customer-uuid-1",
                );

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

                const result = await service.sendWithTemplate("welcome-email", "to@example.com");

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
                vi.mocked(mockEmailRepository.findTemplateBySlug).mockResolvedValue(null);

                await expect(service.sendWithTemplate("non-existent", "to@example.com")).rejects.toThrow(
                    "Template not found: non-existent",
                );
            });

            test("テンプレートが無効な場合はエラーをスローする", async () => {
                vi.mocked(mockEmailRepository.findTemplateBySlug).mockResolvedValue({
                    ...mockTemplate,
                    isActive: false,
                });

                await expect(service.sendWithTemplate("welcome-email", "to@example.com")).rejects.toThrow(
                    "Template is not active: welcome-email",
                );
            });
        });
    });
});
