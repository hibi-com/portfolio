import { describe, expect, test, vi } from "vitest";
import type { EmailLog, EmailService, SendEmailInput } from "~/domain/email";
import { SendEmailUseCase } from "./sendEmail";

describe("SendEmailUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockEmailLog: EmailLog = {
        id: "log-1",
        fromEmail: "from@example.com",
        toEmail: "test@example.com",
        subject: "Test Email",
        status: "SENT",
        resendId: "resend-123",
        sentAt: now,
        createdAt: now,
        updatedAt: now,
        customerId: "customer-1",
    };

    const createMockService = (overrides: Partial<EmailService> = {}): EmailService => ({
        send: vi.fn().mockResolvedValue(mockEmailLog),
        sendWithTemplate: vi.fn().mockResolvedValue(mockEmailLog),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("メールを送信できる", async () => {
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

                const result = await useCase.execute(input);

                expect(result).toEqual(mockEmailLog);
                expect(result.status).toBe("SENT");
                expect(result.toEmail).toBe("test@example.com");
                expect(mockService.send).toHaveBeenCalledWith(input);
                expect(mockService.send).toHaveBeenCalledTimes(1);
            });

            test("HTMLのみのメールを送信できる", async () => {
                const input: SendEmailInput = {
                    toEmail: "test@example.com",
                    subject: "HTML Email",
                    htmlBody: "<h1>HTML Only</h1>",
                };

                const htmlOnlyLog: EmailLog = {
                    ...mockEmailLog,
                    htmlContent: "<h1>HTML Only</h1>",
                };

                const mockService = createMockService({
                    send: vi.fn().mockResolvedValue(htmlOnlyLog),
                });

                const useCase = new SendEmailUseCase(mockService);

                const result = await useCase.execute(input);

                expect(result.htmlContent).toBe("<h1>HTML Only</h1>");
            });

            test("顧客IDなしでメールを送信できる", async () => {
                const input: SendEmailInput = {
                    toEmail: "test@example.com",
                    subject: "Test Email",
                    htmlBody: "<p>Test</p>",
                };

                const logWithoutCustomer: EmailLog = {
                    ...mockEmailLog,
                    customerId: undefined,
                };

                const mockService = createMockService({
                    send: vi.fn().mockResolvedValue(logWithoutCustomer),
                });

                const useCase = new SendEmailUseCase(mockService);

                const result = await useCase.execute(input);

                expect(result.customerId).toBeUndefined();
            });
        });
    });
});
