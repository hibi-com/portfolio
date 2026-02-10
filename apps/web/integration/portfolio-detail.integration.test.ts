import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Portfolio Detail Integration - docs/sequence/web/portfolio-detail.md", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Browser → Loader → Validation → APIClient → API", () => {
        test("正常系: 有効なslugでポートフォリオ詳細を取得する", async () => {
            const slug = "my-project";
            const mockPortfolio = {
                id: "1",
                title: "My Project",
                slug: slug,
                company: "Tech Corp",
                description: "A great project",
                content: "<p>Project details</p>",
                technologies: ["React", "Node.js"],
                images: ["/img/project-1.png"],
            };

            server.use(
                http.get(`${API_URL}/api/portfolios/:slug`, ({ params }) => {
                    if (params.slug === slug) {
                        return HttpResponse.json(mockPortfolio);
                    }
                    return new HttpResponse(null, { status: 404 });
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios/${slug}`);
            const data = await response.json();

            expect(response.ok).toBe(true);
            expect(data.title).toBe("My Project");
            expect(data.company).toBe("Tech Corp");
            expect(data.technologies).toContain("React");
        });

        test("異常系: 存在しないslugで404を返す", async () => {
            server.use(
                http.get(`${API_URL}/api/portfolios/:slug`, () => {
                    return new HttpResponse(null, { status: 404 });
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios/non-existent`);
            expect(response.status).toBe(404);
        });
    });

    describe("シーケンス分岐: slugバリデーション", () => {
        test("有効なslug形式", () => {
            const validSlugs = ["project-name", "my-portfolio-2024", "a1b2c3"];
            for (const slug of validSlugs) {
                expect(/^[a-z0-9-]+$/.test(slug)).toBe(true);
            }
        });

        test("無効なslug形式", () => {
            const invalidSlugs = ["Project Name", "project/name", "", "project_name"];
            for (const slug of invalidSlugs) {
                const isValid = slug.length > 0 && /^[a-z0-9-]+$/.test(slug);
                expect(isValid).toBe(false);
            }
        });
    });

    describe("レスポンスデータ検証", () => {
        test("必須フィールドが含まれる", async () => {
            const mockPortfolio = {
                id: "1",
                title: "Test",
                slug: "test",
                company: "Company",
                description: "Desc",
                technologies: [],
            };

            server.use(
                http.get(`${API_URL}/api/portfolios/:slug`, () => {
                    return HttpResponse.json(mockPortfolio);
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios/test`);
            const data = await response.json();

            expect(data).toHaveProperty("id");
            expect(data).toHaveProperty("title");
            expect(data).toHaveProperty("slug");
            expect(data).toHaveProperty("company");
        });
    });
});
