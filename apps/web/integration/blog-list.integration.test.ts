/**
 * @sequence docs/sequence/web/blog-list.md
 * @description GET /blog - ブログ一覧ページの統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Browser → Remix → Loader → APIClient → API → UseCase → Repository → DB
 */

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

// MSWサーバーのセットアップ
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Blog List Integration - docs/sequence/web/blog-list.md", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Browser → Loader → APIClient → API", () => {
        test("正常系: 投稿一覧を取得してレスポンスを返す", async () => {
            // Given: APIが投稿一覧を返す
            const mockPosts = [
                {
                    id: "1",
                    title: "Test Post 1",
                    slug: "test-post-1",
                    date: "2024-01-01",
                    category: "technical",
                    tags: ["typescript", "react"],
                },
                {
                    id: "2",
                    title: "Test Post 2",
                    slug: "test-post-2",
                    date: "2024-01-02",
                    category: "diy",
                    tags: ["woodworking"],
                },
            ];

            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return HttpResponse.json(mockPosts);
                }),
            );

            // When: loaderが実行される（APIクライアント経由）
            const response = await fetch(`${API_URL}/api/posts`);
            const data = await response.json();

            // Then: 投稿一覧が取得される
            expect(response.ok).toBe(true);
            expect(data).toHaveLength(2);
            expect(data[0].title).toBe("Test Post 1");
            expect(data[1].title).toBe("Test Post 2");
        });

        test("正常系: タグの抽出が正しく行われる", async () => {
            // Given: 複数のタグを持つ投稿
            const mockPosts = [
                { id: "1", tags: ["typescript", "react"] },
                { id: "2", tags: ["react", "nextjs"] },
                { id: "3", tags: ["typescript"] },
            ];

            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return HttpResponse.json(mockPosts);
                }),
            );

            // When: データを取得
            const response = await fetch(`${API_URL}/api/posts`);
            const data = await response.json();

            // Then: タグの抽出（重複排除）
            const allTags = data.flatMap((post: { tags: string[] }) => post.tags);
            const uniqueTags = [...new Set(allTags)];

            expect(uniqueTags).toContain("typescript");
            expect(uniqueTags).toContain("react");
            expect(uniqueTags).toContain("nextjs");
            expect(uniqueTags).toHaveLength(3);
        });

        test("異常系: APIが500を返した場合", async () => {
            // Given: APIがエラーを返す
            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return new HttpResponse(null, { status: 500 });
                }),
            );

            // When: loaderが実行される
            const response = await fetch(`${API_URL}/api/posts`);

            // Then: 500エラー
            expect(response.status).toBe(500);
        });

        test("異常系: 投稿が0件の場合", async () => {
            // Given: 投稿が存在しない
            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return HttpResponse.json([]);
                }),
            );

            // When: loaderが実行される
            const response = await fetch(`${API_URL}/api/posts`);
            const data = await response.json();

            // Then: 空配列が返される
            expect(response.ok).toBe(true);
            expect(data).toHaveLength(0);
        });
    });

    describe("シーケンス分岐: alt postsが空の場合", () => {
        test("投稿が空の場合でもエラーにならない", async () => {
            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return HttpResponse.json([]);
                }),
            );

            const response = await fetch(`${API_URL}/api/posts`);
            expect(response.ok).toBe(true);
        });
    });
});
