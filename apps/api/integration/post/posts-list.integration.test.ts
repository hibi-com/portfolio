import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { DIContainer } from "~/di/container";
import { createTestContainer } from "../setup/container.setup";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";

describe("GET /api/posts - 投稿一覧取得", () => {
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
        test("正常系: 投稿一覧を取得する", async () => {
            await seedTestData({
                posts: [
                    { id: "post-1", title: "Test Post 1", slug: "test-post-1" },
                    { id: "post-2", title: "Test Post 2", slug: "test-post-2" },
                    { id: "post-3", title: "Test Post 3", slug: "test-post-3" },
                ],
            });

            const useCase = container.getGetPostsUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(3);
            expect(result.map((p) => p.title)).toContain("Test Post 1");
            expect(result.map((p) => p.title)).toContain("Test Post 2");
            expect(result.map((p) => p.title)).toContain("Test Post 3");
        });

        test("異常系: 投稿が0件の場合は空配列を返す", async () => {
            const useCase = container.getGetPostsUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(0);
        });

        test("正常系: stickyフラグが設定された投稿を取得する", async () => {
            await seedTestData({
                posts: [
                    { id: "post-1", title: "Normal Post", slug: "normal", sticky: false },
                    { id: "post-2", title: "Sticky Post", slug: "sticky", sticky: true },
                ],
            });

            const useCase = container.getGetPostsUseCase();
            const result = await useCase.execute();

            expect(result).toHaveLength(2);
            const stickyPost = result.find((p) => p.slug === "sticky");
            const normalPost = result.find((p) => p.slug === "normal");
            expect(stickyPost?.sticky).toBe(true);
            expect(normalPost?.sticky).toBe(false);
        });
    });
});
