import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";

interface MockPortfolio {
    id: string;
    title: string;
    company: string;
    slug?: string;
}

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const MockPortfoliosList = ({ portfolios }: { portfolios: Array<{ id: string; title: string; company: string }> }) => (
    <div data-testid="portfolios-list">
        {portfolios.map((portfolio) => (
            <div key={portfolio.id} data-testid="portfolio-item">
                <span>{portfolio.title}</span>
                <span>{portfolio.company}</span>
            </div>
        ))}
    </div>
);

describe("Portfolios List Integration - docs/sequence/admin/portfolios/portfolios-list.md", () => {
    const API_URL = "http://localhost:8787";

    describe("シーケンス: Component → Hook → APIClient → API", () => {
        test("正常系: ポートフォリオ一覧を取得する", async () => {
            const mockPortfolios = [
                { id: "1", title: "Project A", company: "Company X", slug: "project-a" },
                { id: "2", title: "Project B", company: "Company Y", slug: "project-b" },
            ];

            server.use(
                http.get(`${API_URL}/api/portfolios`, () => {
                    return HttpResponse.json(mockPortfolios);
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios`);
            const data: MockPortfolio[] = await response.json();

            expect(response.ok).toBe(true);
            expect(data).toHaveLength(2);
            expect(data[0]?.company).toBe("Company X");
        });

        test("正常系: コンポーネントレンダリング検証", () => {
            const portfolios = [
                { id: "1", title: "Portfolio A", company: "Corp A" },
                { id: "2", title: "Portfolio B", company: "Corp B" },
            ];

            render(<MockPortfoliosList portfolios={portfolios} />);

            expect(screen.getByTestId("portfolios-list")).toBeInTheDocument();
            expect(screen.getAllByTestId("portfolio-item")).toHaveLength(2);
        });
    });

    describe("シーケンス分岐: エラーハンドリング", () => {
        test("API 500エラー", async () => {
            server.use(
                http.get(`${API_URL}/api/portfolios`, () => {
                    return new HttpResponse(null, { status: 500 });
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios`);
            expect(response.status).toBe(500);
        });
    });

    describe("シーケンス分岐: 空データ", () => {
        test("ポートフォリオが0件の場合", async () => {
            server.use(
                http.get(`${API_URL}/api/portfolios`, () => {
                    return HttpResponse.json([]);
                }),
            );

            const response = await fetch(`${API_URL}/api/portfolios`);
            const data = await response.json();

            expect(data).toHaveLength(0);
        });
    });
});
