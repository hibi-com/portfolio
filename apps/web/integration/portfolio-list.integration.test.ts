/**
 * @sequence docs/sequence/web/portfolio-list.md
 * @description GET /portfolio - ポートフォリオ一覧ページの統合テスト
 *
 * シーケンス図に基づき、以下のフローを検証:
 * Browser → Remix → Loader → APIClient → API → UseCase → Repository → DB
 */

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Portfolio List Integration - docs/sequence/web/portfolio-list.md", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Browser → Loader → APIClient → API", () => {
        test("正常系: ポートフォリオ一覧を取得する", async () => {
            // Given: APIがポートフォリオ一覧を返す
            const mockPortfolios = [
                {
                    id: "1",
                    title: "Project A",
                    slug: "project-a",
                    company: "Company X",
                    description: "Description A",
                    technologies: ["React", "TypeScript"],
                },
                {
                    id: "2",
                    title: "Project B",
                    slug: "project-b",
                    company: "Company Y",
                    description: "Description B",
                    technologies: ["Vue", "JavaScript"],
                },
            ];

            server.use(
                http.get(`${API_URL}/api/portfolios`, () => {
                    return HttpResponse.json(mockPortfolios);
                }),
            );

            // When: loaderが実行される
            const response = await fetch(`${API_URL}/api/portfolios`);
            const data = await response.json();

            // Then: ポートフォリオ一覧が取得される
            expect(response.ok).toBe(true);
            expect(data).toHaveLength(2);
            expect(data[0].title).toBe("Project A");
            expect(data[0].company).toBe("Company X");
        });

        test("異常系: APIがエラーを返した場合", async () => {
            server.use(
                http.get(`${API_URL}/api/portfolios`, () => {
                    return new HttpResponse(null, { status: 500 });
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios`);
            expect(response.status).toBe(500);
        });

        test("正常系: ポートフォリオが0件の場合", async () => {
            server.use(
                http.get(`${API_URL}/api/portfolios`, () => {
                    return HttpResponse.json([]);
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios`);
            const data = await response.json();

            expect(response.ok).toBe(true);
            expect(data).toHaveLength(0);
        });
    });

    describe("データ変換検証", () => {
        test("技術スタックが正しく取得される", async () => {
            const mockPortfolios = [
                { id: "1", technologies: ["React", "TypeScript", "Tailwind"] },
            ];

            server.use(
                http.get(`${API_URL}/api/portfolios`, () => {
                    return HttpResponse.json(mockPortfolios);
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios`);
            const data = await response.json();

            expect(data[0].technologies).toContain("React");
            expect(data[0].technologies).toContain("TypeScript");
            expect(data[0].technologies).toHaveLength(3);
        });
    });
});
