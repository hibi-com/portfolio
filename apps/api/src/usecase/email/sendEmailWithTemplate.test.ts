import type { EmailLog, EmailService } from "~/domain/email";
import { SendEmailWithTemplateUseCase } from "./sendEmailWithTemplate";

describe("SendEmailWithTemplateUseCase", () => {
    const now = "2024-01-01T00:00:00.000Z";
    const mockEmailLog: EmailLog = {
        id: "log-1",
        templateId: "template-1",
        fromEmail: "from@example.com",
        toEmail: "test@example.com",
        subject: "Welcome!",
        status: "SENT",
        resendId: "resend-123",
        sentAt: now,
        createdAt: now,
        updatedAt: now,
    };

    const createMockService = (overrides: Partial<EmailService> = {}): EmailService => ({
        send: vi.fn().mockResolvedValue({} as any),
        sendWithTemplate: vi.fn().mockResolvedValue(mockEmailLog),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("テンプレートを使用してメールを送信できる", async () => {
                const templateSlug = "welcome-email";
                const toEmail = "test@example.com";
                const variables = { name: "John", email: "test@example.com" };
                const customerId = "customer-1";

                const mockService = createMockService({
                    sendWithTemplate: vi.fn().mockResolvedValue(mockEmailLog),
                });

                const useCase = new SendEmailWithTemplateUseCase(mockService);

                const result = await useCase.execute(templateSlug, toEmail, variables, customerId);

                expect(result).toEqual(mockEmailLog);
                expect(result.templateId).toBe("template-1");
                expect(result.status).toBe("SENT");
                expect(mockService.sendWithTemplate).toHaveBeenCalledWith(templateSlug, toEmail, variables, customerId);
                expect(mockService.sendWithTemplate).toHaveBeenCalledTimes(1);
            });

            test("変数なしでテンプレートメールを送信できる", async () => {
                const templateSlug = "simple-email";
                const toEmail = "test@example.com";

                const simpleLog: EmailLog = {
                    ...mockEmailLog,
                    htmlContent: "<p>Simple content</p>",
                };

                const mockService = createMockService({
                    sendWithTemplate: vi.fn().mockResolvedValue(simpleLog),
                });

                const useCase = new SendEmailWithTemplateUseCase(mockService);

                const result = await useCase.execute(templateSlug, toEmail);

                expect(result).toEqual(simpleLog);
                expect(mockService.sendWithTemplate).toHaveBeenCalledWith(templateSlug, toEmail, undefined, undefined);
            });

            test("顧客IDなしでテンプレートメールを送信できる", async () => {
                const templateSlug = "welcome-email";
                const toEmail = "test@example.com";
                const variables = { name: "John" };

                const logWithoutCustomer: EmailLog = {
                    ...mockEmailLog,
                    customerId: undefined,
                };

                const mockService = createMockService({
                    sendWithTemplate: vi.fn().mockResolvedValue(logWithoutCustomer),
                });

                const useCase = new SendEmailWithTemplateUseCase(mockService);

                const result = await useCase.execute(templateSlug, toEmail, variables);

                expect(result.customerId).toBeUndefined();
                expect(mockService.sendWithTemplate).toHaveBeenCalledWith(templateSlug, toEmail, variables, undefined);
            });
        });
    });
});
