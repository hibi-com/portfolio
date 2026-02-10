import { describe, expect, test, vi } from "vitest";
import type { EmailLog, EmailService, SendEmailInput } from "~/domain/email";
import { SendEmailUseCase } from "./sendEmail";

describe("SendEmailUseCase", () => {
    const mockEmailLog: EmailLog = {
        id: "log-1",
        templateId: null,
        customerId: "customer-1",
        toEmail: "test@example.com",
        subject: "Test Email",
        htmlBody: "<p>This is a test email</p>",
        textBody: "This is a test email",
        status: "SENT",
        resendId: "resend-123",
        errorMessage: null,
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockService = (overrides: Partial<EmailService> = {}): EmailService => ({
        send: vi.fn().mockResolvedValue(mockEmailLog),
        sendWithTemplate: vi.fn().mockResolvedValue(mockEmailLog),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("メールを送信できる", async () => {
                // Given: メール送信入力
                const input: SendEmailInput = {
                    toEmail: "test@example.com",
                    subject: "Test Email",
                    htmlBody: "<p>This is a test email</p>",
                    textBody: "This is a test email",
                    customerId: "customer-1",
                };

                const mockService = createMockService({
                    send: vi.fn().mockResolvedValue(mockEmailLog),
                });

                const useCase = new SendEmailUseCase(mockService);

                // When: メールを送信
                const result = await useCase.execute(input);

                // Then: メールが送信されログが返される
                expect(result).toEqual(mockEmailLog);
                expect(result.status).toBe("SENT");
                expect(result.toEmail).toBe("test@example.com");
                expect(mockService.send).toHaveBeenCalledWith(input);
                expect(mockService.send).toHaveBeenCalledTimes(1);
            });

            test("HTMLのみのメールを送信できる", async () => {
                // Given: HTML本文のみの入力
                const input: SendEmailInput = {
                    toEmail: "test@example.com",
                    subject: "HTML Email",
                    htmlBody: "<h1>HTML Only</h1>",
                };

                const htmlOnlyLog: EmailLog = {
                    ...mockEmailLog,
                    htmlBody: "<h1>HTML Only</h1>",
                    textBody: null,
                };

                const mockService = createMockService({
                    send: vi.fn().mockResolvedValue(htmlOnlyLog),
                });

                const useCase = new SendEmailUseCase(mockService);

                // When: メールを送信
                const result = await useCase.execute(input);

                // Then: HTML本文のみでメールが送信される
                expect(result.htmlBody).toBe("<h1>HTML Only</h1>");
                expect(result.textBody).toBeNull();
            });

            test("顧客IDなしでメールを送信できる", async () => {
                // Given: 顧客IDなしの入力
                const input: SendEmailInput = {
                    toEmail: "test@example.com",
                    subject: "Test Email",
                    htmlBody: "<p>Test</p>",
                };

                const logWithoutCustomer: EmailLog = {
                    ...mockEmailLog,
                    customerId: null,
                };

                const mockService = createMockService({
                    send: vi.fn().mockResolvedValue(logWithoutCustomer),
                });

                const useCase = new SendEmailUseCase(mockService);

                // When: メールを送信
                const result = await useCase.execute(input);

                // Then: 顧客IDなしでメールが送信される
                expect(result.customerId).toBeNull();
            });
        });
    });
});
