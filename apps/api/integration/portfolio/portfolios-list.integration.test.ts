import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { DIContainer } from "~/di/container";
import { createTestContainer } from "../setup/container.setup";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";

describe("GET /api/portfolios - ポートフォリオ一覧取得", () => {
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
        test("正常系: ポートフォリオ一覧を取得する", async () => {
            await seedTestData({
                portfolios: [
                    { id: "pf-1", title: "Portfolio 1", slug: "portfolio-1", company: "Company A" },
                    { id: "pf-2", title: "Portfolio 2", slug: "portfolio-2", company: "Company B" },
                    { id: "pf-3", title: "Portfolio 3", slug: "portfolio-3", company: "Company C" },
                ],
            });

            const useCase = container.getGetPortfoliosUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(3);
            expect(result.map((p) => p.title)).toContain("Portfolio 1");
            expect(result.map((p) => p.title)).toContain("Portfolio 2");
            expect(result.map((p) => p.title)).toContain("Portfolio 3");
        });

        test("異常系: ポートフォリオが0件の場合は空配列を返す", async () => {
            const useCase = container.getGetPortfoliosUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(0);
        });

        test("正常系: ポートフォリオの会社情報が正しく取得される", async () => {
            await seedTestData({
                portfolios: [
                    {
                        id: "pf-1",
                        title: "Project Alpha",
                        slug: "project-alpha",
                        company: "Tech Corp",
                        description: "A great project",
                    },
                ],
            });

            const useCase = container.getGetPortfoliosUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(1);
            expect(result[0]?.company).toBe("Tech Corp");
            expect(result[0]?.description).toBe("A great project");
        });
    });
});
