/**
 * @sequence docs/sequence/api/post-by-slug.md
 * @description GET /api/post/:slug - 投稿詳細取得の統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Client → API → DIContainer → UseCase → Repository → DB
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "../../../src/di/container";

describe("GET /api/post/:slug - 投稿詳細取得", () => {
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
        test("正常系: slugで投稿を取得する", async () => {
            // Given: DBに投稿が存在する
            const testContent = "<p>This is test content</p>";
            await seedTestData({
                posts: [
                    {
                        id: "post-1",
                        title: "Test Post",
                        slug: "test-post",
                        content: testContent,
                        description: "Test description",
                    },
                ],
            });

            // When: GetPostBySlugUseCase を実行
            const useCase = container.getGetPostBySlugUseCase();
            const result = await useCase.execute("test-post");

            // Then: 投稿がレスポンスされる
            expect(result).not.toBeNull();
            expect(result?.title).toBe("Test Post");
            expect(result?.slug).toBe("test-post");
            expect(result?.content).toBe(testContent);
        });

        test("異常系: 存在しないslugの場合はnullを返す", async () => {
            // Given: DBに投稿が存在する
            await seedTestData({
                posts: [{ id: "post-1", title: "Existing Post", slug: "existing-post" }],
            });

            // When: 存在しないslugで GetPostBySlugUseCase を実行
            const useCase = container.getGetPostBySlugUseCase();
            const result = await useCase.execute("non-existent-slug");

            // Then: nullがレスポンスされる
            expect(result).toBeNull();
        });

        test("正常系: 複数の投稿がある場合、指定したslugの投稿のみ取得する", async () => {
            // Given: DBに複数の投稿が存在する
            await seedTestData({
                posts: [
                    { id: "post-1", title: "First Post", slug: "first-post" },
                    { id: "post-2", title: "Second Post", slug: "second-post" },
                    { id: "post-3", title: "Third Post", slug: "third-post" },
                ],
            });

            // When: GetPostBySlugUseCase を実行
            const useCase = container.getGetPostBySlugUseCase();
            const result = await useCase.execute("second-post");

            // Then: 指定した投稿のみがレスポンスされる
            expect(result).not.toBeNull();
            expect(result?.title).toBe("Second Post");
            expect(result?.slug).toBe("second-post");
        });
    });
});
