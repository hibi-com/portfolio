/**
 * @sequence docs/sequence/api/portfolio-by-slug.md
 * @description GET /api/portfolio/:slug - ポートフォリオ詳細取得の統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Client → API → DIContainer → UseCase → Repository → DB
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "../../../src/di/container";

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
            // Given: DBにポートフォリオが存在する
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

            // When: GetPortfolioBySlugUseCase を実行
            const useCase = container.getGetPortfolioBySlugUseCase();
            const result = await useCase.execute("test-portfolio");

            // Then: ポートフォリオがレスポンスされる
            expect(result).not.toBeNull();
            expect(result?.title).toBe("Test Portfolio");
            expect(result?.slug).toBe("test-portfolio");
            expect(result?.company).toBe("Test Company");
        });

        test("異常系: 存在しないslugの場合はnullを返す", async () => {
            // Given: DBにポートフォリオが存在する
            await seedTestData({
                portfolios: [{ id: "pf-1", title: "Existing Portfolio", slug: "existing-portfolio" }],
            });

            // When: 存在しないslugで GetPortfolioBySlugUseCase を実行
            const useCase = container.getGetPortfolioBySlugUseCase();
            const result = await useCase.execute("non-existent-slug");

            // Then: nullがレスポンスされる
            expect(result).toBeNull();
        });

        test("正常系: 複数のポートフォリオがある場合、指定したslugのポートフォリオのみ取得する", async () => {
            // Given: DBに複数のポートフォリオが存在する
            await seedTestData({
                portfolios: [
                    { id: "pf-1", title: "First Portfolio", slug: "first-portfolio", company: "Company A" },
                    { id: "pf-2", title: "Second Portfolio", slug: "second-portfolio", company: "Company B" },
                    { id: "pf-3", title: "Third Portfolio", slug: "third-portfolio", company: "Company C" },
                ],
            });

            // When: GetPortfolioBySlugUseCase を実行
            const useCase = container.getGetPortfolioBySlugUseCase();
            const result = await useCase.execute("second-portfolio");

            // Then: 指定したポートフォリオのみがレスポンスされる
            expect(result).not.toBeNull();
            expect(result?.title).toBe("Second Portfolio");
            expect(result?.company).toBe("Company B");
        });
    });
});
