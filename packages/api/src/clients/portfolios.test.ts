import type { Portfolio, PortfoliosListPortfolios200, PortfoliosListPortfoliosParams } from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/portfolios/portfolios", () => ({
    getPortfolios: vi.fn(() => ({
        portfoliosListPortfolios: vi.fn(),
        portfoliosGetPortfolioBySlug: vi.fn(),
        portfoliosUploadPortfolioImage: vi.fn(),
    })),
}));

import { getPortfolios } from "@generated/portfolios/portfolios";
import { getPortfolioBySlug, listPortfolios, portfolios } from "./portfolios";

describe("portfolios client", () => {
    const mockPortfoliosListPortfolios = vi.fn();
    const mockPortfoliosGetPortfolioBySlug = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getPortfolios).mockReturnValue({
            portfoliosListPortfolios: mockPortfoliosListPortfolios,
            portfoliosGetPortfolioBySlug: mockPortfoliosGetPortfolioBySlug,
            portfoliosUploadPortfolioImage: vi.fn(),
        });
    });

    describe("listPortfolios", () => {
        describe("正常系", () => {
            test("パラメータなしで全ポートフォリオを取得する", async () => {
                const mockResponse: PortfoliosListPortfolios200 = {
                    data: [
                        {
                            title: "Project 1",
                            slug: "project-1",
                            company: "Company A",
                            date: "2024-01-01",
                            current: false,
                            content: { html: "<p>Content</p>" },
                        },
                    ],
                    meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
                };
                mockPortfoliosListPortfolios.mockResolvedValue(mockResponse);

                const result = await listPortfolios();

                expect(result).toEqual(mockResponse);
                expect(mockPortfoliosListPortfolios).toHaveBeenCalledWith(undefined);
                expect(mockPortfoliosListPortfolios).toHaveBeenCalledTimes(1);
            });

            test("ページネーションパラメータを渡してポートフォリオを取得する", async () => {
                const params: PortfoliosListPortfoliosParams = { page: 2, perPage: 5 };
                const mockResponse: PortfoliosListPortfolios200 = {
                    data: [],
                    meta: { total: 10, page: 2, perPage: 5, totalPages: 2 },
                };
                mockPortfoliosListPortfolios.mockResolvedValue(mockResponse);

                const result = await listPortfolios(params);

                expect(result).toEqual(mockResponse);
                expect(mockPortfoliosListPortfolios).toHaveBeenCalledWith(params);
            });
        });

        describe("エッジケース", () => {
            test("空の配列が返される場合", async () => {
                const mockResponse: PortfoliosListPortfolios200 = {
                    data: [],
                    meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
                };
                mockPortfoliosListPortfolios.mockResolvedValue(mockResponse);

                const result = await listPortfolios();

                expect(result).toEqual(mockResponse);
            });

            test("配列形式で返される場合", async () => {
                const mockResponse: Portfolio[] = [
                    {
                        title: "Test",
                        slug: "test",
                        company: "Company",
                        date: "2024-01-01",
                        current: false,
                    },
                ];
                mockPortfoliosListPortfolios.mockResolvedValue(mockResponse);

                const result = await listPortfolios();

                expect(result).toEqual(mockResponse);
            });
        });

        describe("異常系", () => {
            test("APIエラーの場合はエラーをそのまま伝播する", async () => {
                const error = new Error("API Error");
                mockPortfoliosListPortfolios.mockRejectedValue(error);

                await expect(listPortfolios()).rejects.toThrow("API Error");
            });
        });
    });

    describe("getPortfolioBySlug", () => {
        describe("正常系", () => {
            test("slugでポートフォリオを取得する", async () => {
                const slug = "project-1";
                const mockPortfolio: Portfolio = {
                    title: "Project 1",
                    slug: "project-1",
                    company: "Company A",
                    date: "2024-01-01",
                    current: false,
                    content: { html: "<p>Content</p>" },
                };
                mockPortfoliosGetPortfolioBySlug.mockResolvedValue(mockPortfolio);

                const result = await getPortfolioBySlug(slug);

                expect(result).toEqual(mockPortfolio);
                expect(mockPortfoliosGetPortfolioBySlug).toHaveBeenCalledWith(slug);
                expect(mockPortfoliosGetPortfolioBySlug).toHaveBeenCalledTimes(1);
            });

            test("日本語slugでポートフォリオを取得する", async () => {
                const slug = "日本語プロジェクト";
                const mockPortfolio: Portfolio = {
                    title: "日本語タイトル",
                    slug: "日本語プロジェクト",
                    company: "日本企業",
                    date: "2024-01-01",
                    current: false,
                    content: { html: "<p>日本語</p>" },
                };
                mockPortfoliosGetPortfolioBySlug.mockResolvedValue(mockPortfolio);

                const result = await getPortfolioBySlug(slug);

                expect(result).toEqual(mockPortfolio);
                expect(mockPortfoliosGetPortfolioBySlug).toHaveBeenCalledWith(slug);
            });
        });

        describe("境界値", () => {
            test("空文字のslugを渡す", async () => {
                const slug = "";
                mockPortfoliosGetPortfolioBySlug.mockResolvedValue(null);

                await getPortfolioBySlug(slug);

                expect(mockPortfoliosGetPortfolioBySlug).toHaveBeenCalledWith("");
            });

            test("特殊文字を含むslugを渡す", async () => {
                const slug = "project-with-special-chars-123";
                const mockPortfolio: Portfolio = {
                    title: "Special Project",
                    slug: slug,
                    company: "Company",
                    date: "2024-01-01",
                    current: false,
                    content: { html: "<p>Content</p>" },
                };
                mockPortfoliosGetPortfolioBySlug.mockResolvedValue(mockPortfolio);

                const result = await getPortfolioBySlug(slug);

                expect(result).toEqual(mockPortfolio);
            });
        });

        describe("異常系", () => {
            test("存在しないslugの場合はAPIエラーを伝播する", async () => {
                const slug = "non-existent";
                const error = new Error("Not Found");
                mockPortfoliosGetPortfolioBySlug.mockRejectedValue(error);

                await expect(getPortfolioBySlug(slug)).rejects.toThrow("Not Found");
            });
        });
    });

    describe("portfolios オブジェクト", () => {
        test("listメソッドが正しく動作する", async () => {
            const mockResponse: PortfoliosListPortfolios200 = {
                data: [],
                meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
            };
            mockPortfoliosListPortfolios.mockResolvedValue(mockResponse);

            const result = await portfolios.list();

            expect(result).toEqual(mockResponse);
        });

        test("getBySlugメソッドが正しく動作する", async () => {
            const mockPortfolio: Portfolio = {
                title: "Test",
                slug: "test",
                company: "Company",
                date: "2024-01-01",
                current: false,
            };
            mockPortfoliosGetPortfolioBySlug.mockResolvedValue(mockPortfolio);

            const result = await portfolios.getBySlug("test");

            expect(result).toEqual(mockPortfolio);
        });
    });
});
