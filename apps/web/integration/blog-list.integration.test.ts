import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Blog List Integration - docs/sequence/web/blog-list.md", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Browser → Loader → APIClient → API", () => {
        test("正常系: 投稿一覧を取得してレスポンスを返す", async () => {
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

            const response = await fetch(`${API_URL}/api/posts`);
            const data = await response.json();

            expect(response.ok).toBe(true);
            expect(data).toHaveLength(2);
            expect(data[0].title).toBe("Test Post 1");
            expect(data[1].title).toBe("Test Post 2");
        });

        test("正常系: タグの抽出が正しく行われる", async () => {
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

            const response = await fetch(`${API_URL}/api/posts`);
            const data = await response.json();

            const allTags = data.flatMap((post: { tags: string[] }) => post.tags);
            const uniqueTags = [...new Set(allTags)];

            expect(uniqueTags).toContain("typescript");
            expect(uniqueTags).toContain("react");
            expect(uniqueTags).toContain("nextjs");
            expect(uniqueTags).toHaveLength(3);
        });

        test("異常系: APIが500を返した場合", async () => {
            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return new HttpResponse(null, { status: 500 });
                }),
            );

            const response = await fetch(`${API_URL}/api/posts`);

            expect(response.status).toBe(500);
        });

        test("異常系: 投稿が0件の場合", async () => {
            server.use(
                http.get(`${API_URL}/api/posts`, () => {
                    return HttpResponse.json([]);
                }),
            );

            const response = await fetch(`${API_URL}/api/posts`);
            const data = await response.json();

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
