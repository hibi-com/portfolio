import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { DIContainer } from "~/di/container";
import { createTestContainer } from "../setup/container.setup";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";

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

            const useCase = container.getGetPostBySlugUseCase();
            const result = await useCase.execute("test-post");

            expect(result).not.toBeNull();
            expect(result?.title).toBe("Test Post");
            expect(result?.slug).toBe("test-post");
            expect(result?.content).toBe(testContent);
        });

        test("異常系: 存在しないslugの場合はnullを返す", async () => {
            await seedTestData({
                posts: [{ id: "post-1", title: "Existing Post", slug: "existing-post" }],
            });

            const useCase = container.getGetPostBySlugUseCase();
            const result = await useCase.execute("non-existent-slug");

            expect(result).toBeNull();
        });

        test("正常系: 複数の投稿がある場合、指定したslugの投稿のみ取得する", async () => {
            await seedTestData({
                posts: [
                    { id: "post-1", title: "First Post", slug: "first-post" },
                    { id: "post-2", title: "Second Post", slug: "second-post" },
                    { id: "post-3", title: "Third Post", slug: "third-post" },
                ],
            });

            const useCase = container.getGetPostBySlugUseCase();
            const result = await useCase.execute("second-post");

            expect(result).not.toBeNull();
            expect(result?.title).toBe("Second Post");
            expect(result?.slug).toBe("second-post");
        });
    });
});
