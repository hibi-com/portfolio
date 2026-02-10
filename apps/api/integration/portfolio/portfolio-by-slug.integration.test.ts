import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { DIContainer } from "~/di/container";
import { createTestContainer } from "../setup/container.setup";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";

describe("GET /api/portfolio/:slug - ポートフォリオ詳細取得", () => {
    let container: DIContainer;

    beforeAll(async () => {
        await setupTestDb();
        container = createTestContainer();
    });

    afterEach(async () => {
        await clearTestDb();
    });

    afterAll(async () => {
        await teardownTestDb();
    });

    describe("シーケンス: Client → API → UseCase → Repository → DB", () => {
        test("正常系: slugでポートフォリオを取得する", async () => {
            await seedTestData({
                portfolios: [
                    {
                        id: "pf-1",
                        title: "Test Portfolio",
                        slug: "test-portfolio",
                        company: "Test Company",
                        description: "Test description",
                    },
                ],
            });

            const useCase = container.getGetPortfolioBySlugUseCase();
            const result = await useCase.execute("test-portfolio");

            expect(result).not.toBeNull();
            expect(result?.title).toBe("Test Portfolio");
            expect(result?.slug).toBe("test-portfolio");
            expect(result?.company).toBe("Test Company");
        });

        test("異常系: 存在しないslugの場合はnullを返す", async () => {
            await seedTestData({
                portfolios: [{ id: "pf-1", title: "Existing Portfolio", slug: "existing-portfolio" }],
            });

            const useCase = container.getGetPortfolioBySlugUseCase();
            const result = await useCase.execute("non-existent-slug");

            expect(result).toBeNull();
        });

        test("正常系: 複数のポートフォリオがある場合、指定したslugのポートフォリオのみ取得する", async () => {
            await seedTestData({
                portfolios: [
                    { id: "pf-1", title: "First Portfolio", slug: "first-portfolio", company: "Company A" },
                    { id: "pf-2", title: "Second Portfolio", slug: "second-portfolio", company: "Company B" },
                    { id: "pf-3", title: "Third Portfolio", slug: "third-portfolio", company: "Company C" },
                ],
            });

            const useCase = container.getGetPortfolioBySlugUseCase();
            const result = await useCase.execute("second-portfolio");

            expect(result).not.toBeNull();
            expect(result?.title).toBe("Second Portfolio");
            expect(result?.company).toBe("Company B");
        });
    });
});
