import { describe, expect, test, vi } from "vitest";
import type { EmailLog, EmailService } from "~/domain/email";
import { SendEmailWithTemplateUseCase } from "./sendEmailWithTemplate";

describe("SendEmailWithTemplateUseCase", () => {
    const mockEmailLog: EmailLog = {
        id: "log-1",
        templateId: "template-1",
        customerId: "customer-1",
        toEmail: "test@example.com",
        subject: "Welcome!",
        htmlBody: "<h1>Welcome, John!</h1>",
        textBody: "Welcome, John!",
        status: "SENT",
        resendId: "resend-123",
        errorMessage: null,
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockService = (overrides: Partial<EmailService> = {}): EmailService => ({
        send: vi.fn().mockResolvedValue({} as any),
        sendWithTemplate: vi.fn().mockResolvedValue(mockEmailLog),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("テンプレートを使用してメールを送信できる", async () => {
                // Given: テンプレートスラッグ、宛先、変数
                const templateSlug = "welcome-email";
                const toEmail = "test@example.com";
                const variables = { name: "John", email: "test@example.com" };
                const customerId = "customer-1";

                const mockService = createMockService({
                    sendWithTemplate: vi.fn().mockResolvedValue(mockEmailLog),
                });

                const useCase = new SendEmailWithTemplateUseCase(mockService);

                // When: テンプレートでメールを送信
                const result = await useCase.execute(templateSlug, toEmail, variables, customerId);

                // Then: テンプレートが適用されたメールが送信される
                expect(result).toEqual(mockEmailLog);
                expect(result.templateId).toBe("template-1");
                expect(result.status).toBe("SENT");
                expect(mockService.sendWithTemplate).toHaveBeenCalledWith(
                    templateSlug,
                    toEmail,
                    variables,
                    customerId,
                );
                expect(mockService.sendWithTemplate).toHaveBeenCalledTimes(1);
            });

            test("変数なしでテンプレートメールを送信できる", async () => {
                // Given: 変数なしのテンプレート
                const templateSlug = "simple-email";
                const toEmail = "test@example.com";

                const simpleLog: EmailLog = {
                    ...mockEmailLog,
                    htmlBody: "<p>Simple content</p>",
                    textBody: "Simple content",
                };

                const mockService = createMockService({
                    sendWithTemplate: vi.fn().mockResolvedValue(simpleLog),
                });

                const useCase = new SendEmailWithTemplateUseCase(mockService);

                // When: 変数なしでメールを送信
                const result = await useCase.execute(templateSlug, toEmail);

                // Then: メールが送信される
                expect(result).toEqual(simpleLog);
                expect(mockService.sendWithTemplate).toHaveBeenCalledWith(
                    templateSlug,
                    toEmail,
                    undefined,
                    undefined,
                );
            });

            test("顧客IDなしでテンプレートメールを送信できる", async () => {
                // Given: 顧客IDなし
                const templateSlug = "welcome-email";
                const toEmail = "test@example.com";
                const variables = { name: "John" };

                const logWithoutCustomer: EmailLog = {
                    ...mockEmailLog,
                    customerId: null,
                };

                const mockService = createMockService({
                    sendWithTemplate: vi.fn().mockResolvedValue(logWithoutCustomer),
                });

                const useCase = new SendEmailWithTemplateUseCase(mockService);

                // When: 顧客IDなしでメールを送信
                const result = await useCase.execute(templateSlug, toEmail, variables);

                // Then: メールが送信される
                expect(result.customerId).toBeNull();
                expect(mockService.sendWithTemplate).toHaveBeenCalledWith(
                    templateSlug,
                    toEmail,
                    variables,
                    undefined,
                );
            });
        });
    });
});
