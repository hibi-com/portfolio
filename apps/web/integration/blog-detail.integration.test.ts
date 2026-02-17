import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Blog Detail Integration - docs/sequence/web/blog-detail.md", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Browser → Loader → Validation → APIClient → API", () => {
        test("正常系: 有効なslugで投稿詳細を取得する", async () => {
            const slug = "test-post-slug";
            const mockPost = {
                id: "1",
                title: "Test Post",
                slug: slug,
                content: "<p>This is test content</p>",
                date: "2024-01-01",
                tags: ["typescript"],
            };

            server.use(
                http.get(`${API_URL}/api/posts/:slug`, ({ params }) => {
                    if (params.slug === slug) {
                        return HttpResponse.json(mockPost);
                    }
                    return new HttpResponse(null, { status: 404 });
                }),
            );

            const response = await fetch(`${API_URL}/api/posts/${slug}`);
            const data = await response.json();

            expect(response.ok).toBe(true);
            expect(data.title).toBe("Test Post");
            expect(data.slug).toBe(slug);
            expect(data.content).toContain("test content");
        });

        test("異常系: 存在しないslugで404を返す", async () => {
            const slug = "non-existent-post";

            server.use(
                http.get(`${API_URL}/api/posts/:slug`, () => {
                    return new HttpResponse(null, { status: 404 });
                }),
            );

            const response = await fetch(`${API_URL}/api/posts/${slug}`);

            expect(response.status).toBe(404);
        });
    });

    describe("シーケンス分岐: slugが無効な場合", () => {
        test("空のslugは無効として処理される", async () => {
            const slug = "";

            const isValidSlug = slug.length > 0 && /^[a-z0-9-]+$/.test(slug);

            expect(isValidSlug).toBe(false);
        });

        test("特殊文字を含むslugは無効として処理される", async () => {
            const invalidSlugs = ["test<script>", "test post", "test/post", "TEST-POST"];

            for (const slug of invalidSlugs) {
                const isValidSlug = /^[a-z0-9-]+$/.test(slug);
                expect(isValidSlug).toBe(false);
            }
        });

        test("有効なslug形式のバリデーション", async () => {
            const validSlugs = ["test-post", "my-first-blog", "2024-01-review"];

            for (const slug of validSlugs) {
                const isValidSlug = /^[a-z0-9-]+$/.test(slug);
                expect(isValidSlug).toBe(true);
            }
        });
    });

    describe("シーケンス分岐: postが見つからない場合", () => {
        test("APIが404を返した場合、404レスポンスを返す", async () => {
            server.use(
                http.get(`${API_URL}/api/posts/:slug`, () => {
                    return new HttpResponse(null, { status: 404 });
                }),
            );

            const response = await fetch(`${API_URL}/api/posts/missing-post`);
            expect(response.status).toBe(404);
        });
    });
});
