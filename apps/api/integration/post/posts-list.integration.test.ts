/**
 * @sequence docs/sequence/api/posts-list.md
 * @description GET /api/posts - 投稿一覧取得の統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Client → API → DIContainer → UseCase → Repository → DB
 */

import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { clearTestDb, seedTestData, setupTestDb, teardownTestDb } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "../../../src/di/container";

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
            // Given: DBに投稿が存在する
            await seedTestData({
                posts: [
                    { id: "post-1", title: "Test Post 1", slug: "test-post-1" },
                    { id: "post-2", title: "Test Post 2", slug: "test-post-2" },
                    { id: "post-3", title: "Test Post 3", slug: "test-post-3" },
                ],
            });

            // When: GetPostsUseCase を実行
            const useCase = container.getGetPostsUseCase();
            const result = await useCase.execute();

            // Then: 投稿一覧がレスポンスされる
            expect(result).toHaveLength(3);
            expect(result.map((p) => p.title)).toContain("Test Post 1");
            expect(result.map((p) => p.title)).toContain("Test Post 2");
            expect(result.map((p) => p.title)).toContain("Test Post 3");
        });

        test("異常系: 投稿が0件の場合は空配列を返す", async () => {
            // Given: DBに投稿が存在しない（clearTestDbで初期化済み）

            // When: GetPostsUseCase を実行
            const useCase = container.getGetPostsUseCase();
            const result = await useCase.execute();

            // Then: 空配列がレスポンスされる
            expect(result).toHaveLength(0);
        });

        test("正常系: stickyフラグが設定された投稿を取得する", async () => {
            // Given: stickyな投稿が存在する
            await seedTestData({
                posts: [
                    { id: "post-1", title: "Normal Post", slug: "normal", sticky: false },
                    { id: "post-2", title: "Sticky Post", slug: "sticky", sticky: true },
                ],
            });

            // When: GetPostsUseCase を実行
            const useCase = container.getGetPostsUseCase();
            const result = await useCase.execute();

            // Then: stickyフラグが正しく取得される
            expect(result).toHaveLength(2);
            const stickyPost = result.find((p) => p.slug === "sticky");
            const normalPost = result.find((p) => p.slug === "normal");
            expect(stickyPost?.sticky).toBe(true);
            expect(normalPost?.sticky).toBe(false);
        });
    });
});
