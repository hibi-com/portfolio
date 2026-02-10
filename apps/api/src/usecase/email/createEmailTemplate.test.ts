import { describe, expect, test, vi } from "vitest";
import type { CreateEmailTemplateInput, EmailRepository, EmailTemplate } from "~/domain/email";
import { CreateEmailTemplateUseCase } from "./createEmailTemplate";

describe("CreateEmailTemplateUseCase", () => {
    const mockTemplate: EmailTemplate = {
        id: "template-1",
        name: "Welcome Email",
        slug: "welcome-email",
        subject: "Welcome to our service",
        htmlBody: "<h1>Welcome!</h1>",
        textBody: "Welcome!",
        category: "MARKETING",
        variables: ["name", "email"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockRepository = (overrides: Partial<EmailRepository> = {}): EmailRepository => ({
        findAllLogs: vi.fn().mockResolvedValue([]),
        findLogById: vi.fn().mockResolvedValue(null),
        findLogsByCustomerId: vi.fn().mockResolvedValue([]),
        createLog: vi.fn().mockResolvedValue({} as any),
        updateLogStatus: vi.fn().mockResolvedValue({} as any),
        findAllTemplates: vi.fn().mockResolvedValue([]),
        findTemplateById: vi.fn().mockResolvedValue(null),
        findTemplateBySlug: vi.fn().mockResolvedValue(null),
        createTemplate: vi.fn().mockResolvedValue(mockTemplate),
        updateTemplate: vi.fn().mockResolvedValue(mockTemplate),
        deleteTemplate: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("メールテンプレートを作成できる", async () => {
                // Given: テンプレート作成入力
                const input: CreateEmailTemplateInput = {
                    name: "Welcome Email",
                    slug: "welcome-email",
                    subject: "Welcome to our service",
                    htmlBody: "<h1>Welcome!</h1>",
                    textBody: "Welcome!",
                    category: "MARKETING",
                    variables: ["name", "email"],
                };

                const mockRepository = createMockRepository({
                    createTemplate: vi.fn().mockResolvedValue(mockTemplate),
                });

                const useCase = new CreateEmailTemplateUseCase(mockRepository);

                // When: テンプレートを作成
                const result = await useCase.execute(input);

                // Then: テンプレートが作成される
                expect(result).toEqual(mockTemplate);
                expect(result.name).toBe("Welcome Email");
                expect(result.slug).toBe("welcome-email");
                expect(result.category).toBe("MARKETING");
                expect(mockRepository.createTemplate).toHaveBeenCalledWith(input);
                expect(mockRepository.createTemplate).toHaveBeenCalledTimes(1);
            });

            test("変数なしでテンプレートを作成できる", async () => {
                // Given: 変数なしのテンプレート
                const input: CreateEmailTemplateInput = {
                    name: "Simple Email",
                    slug: "simple-email",
                    subject: "Simple subject",
                    htmlBody: "<p>Simple content</p>",
                    category: "TRANSACTIONAL",
                };

                const simpleTemplate: EmailTemplate = {
                    ...mockTemplate,
                    name: "Simple Email",
                    slug: "simple-email",
                    variables: [],
                    category: "TRANSACTIONAL",
                };

                const mockRepository = createMockRepository({
                    createTemplate: vi.fn().mockResolvedValue(simpleTemplate),
                });

                const useCase = new CreateEmailTemplateUseCase(mockRepository);

                // When: テンプレートを作成
                const result = await useCase.execute(input);

                // Then: 変数なしでテンプレートが作成される
                expect(result.variables).toEqual([]);
                expect(result.category).toBe("TRANSACTIONAL");
            });
        });
    });
});
