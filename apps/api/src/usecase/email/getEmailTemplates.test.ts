import { describe, expect, test, vi } from "vitest";
import type { EmailRepository, EmailTemplate } from "~/domain/email";
import { GetEmailTemplatesUseCase } from "./getEmailTemplates";

describe("GetEmailTemplatesUseCase", () => {
    const mockTemplates: EmailTemplate[] = [
        {
            id: "template-1",
            name: "Welcome Email",
            slug: "welcome-email",
            subject: "Welcome!",
            htmlBody: "<h1>Welcome!</h1>",
            textBody: "Welcome!",
            category: "MARKETING",
            variables: ["name"],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "template-2",
            name: "Password Reset",
            slug: "password-reset",
            subject: "Reset your password",
            htmlBody: "<p>Reset link</p>",
            textBody: "Reset link",
            category: "TRANSACTIONAL",
            variables: ["resetLink"],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const createMockRepository = (overrides: Partial<EmailRepository> = {}): EmailRepository => ({
        findAllLogs: vi.fn().mockResolvedValue([]),
        findLogById: vi.fn().mockResolvedValue(null),
        findLogsByCustomerId: vi.fn().mockResolvedValue([]),
        createLog: vi.fn().mockResolvedValue({} as any),
        updateLogStatus: vi.fn().mockResolvedValue({} as any),
        findAllTemplates: vi.fn().mockResolvedValue(mockTemplates),
        findTemplateById: vi.fn().mockResolvedValue(null),
        findTemplateBySlug: vi.fn().mockResolvedValue(null),
        createTemplate: vi.fn().mockResolvedValue({} as any),
        updateTemplate: vi.fn().mockResolvedValue({} as any),
        deleteTemplate: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("全メールテンプレートを取得できる", async () => {
                // Given: モックリポジトリ
                const mockRepository = createMockRepository({
                    findAllTemplates: vi.fn().mockResolvedValue(mockTemplates),
                });

                const useCase = new GetEmailTemplatesUseCase(mockRepository);

                // When: テンプレート一覧を取得
                const result = await useCase.execute();

                // Then: テンプレート一覧が返される
                expect(result).toEqual(mockTemplates);
                expect(result).toHaveLength(2);
                expect(result[0].category).toBe("MARKETING");
                expect(result[1].category).toBe("TRANSACTIONAL");
                expect(mockRepository.findAllTemplates).toHaveBeenCalledTimes(1);
            });
        });

        describe("エッジケース", () => {
            test("テンプレートが存在しない場合は空配列を返す", async () => {
                // Given: テンプレートなし
                const mockRepository = createMockRepository({
                    findAllTemplates: vi.fn().mockResolvedValue([]),
                });

                const useCase = new GetEmailTemplatesUseCase(mockRepository);

                // When: テンプレート一覧を取得
                const result = await useCase.execute();

                // Then: 空配列が返される
                expect(result).toEqual([]);
                expect(result).toHaveLength(0);
            });
        });
    });
});
