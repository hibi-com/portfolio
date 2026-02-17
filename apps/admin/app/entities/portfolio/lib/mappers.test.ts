import type { Portfolio } from "../model/types";
import { mapApiPortfolioToPortfolio, portfolioToListItem } from "./mappers";

describe("mapApiPortfolioToPortfolio", () => {
    test("should return Portfolio entity with all fields", () => {
        const mockPortfolio: Portfolio = {
            id: "1",
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            overview: "Test overview",
            description: "Test description",
            content: { html: "<p>Test</p>" },
            thumbnailTemp: "/test.jpg",
            intro: "Test intro",
        };

        const result = mapApiPortfolioToPortfolio(mockPortfolio);

        expect(result).toEqual(mockPortfolio);
    });

    test("should handle Portfolio with optional fields undefined", () => {
        const mockPortfolio: Portfolio = {
            id: "1",
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
        };

        const result = mapApiPortfolioToPortfolio(mockPortfolio);

        expect(result).toEqual(mockPortfolio);
        expect(result.overview).toBeUndefined();
        expect(result.description).toBeUndefined();
        expect(result.content).toBeUndefined();
        expect(result.thumbnailTemp).toBeUndefined();
        expect(result.intro).toBeUndefined();
    });

    test("should handle Portfolio with id undefined", () => {
        const mockPortfolio: Portfolio = {
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
        };

        const result = mapApiPortfolioToPortfolio(mockPortfolio);

        expect(result).toEqual(mockPortfolio);
        expect(result.id).toBeUndefined();
    });
});

describe("portfolioToListItem", () => {
    test("should return PortfolioListItem with required fields", () => {
        const mockPortfolio: Portfolio = {
            id: "1",
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            overview: "Test overview",
        };

        const result = portfolioToListItem(mockPortfolio);

        expect(result).toEqual({
            id: "1",
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            overview: "Test overview",
        });
    });

    test("should exclude fields not in PortfolioListItem", () => {
        const mockPortfolio: Portfolio = {
            id: "1",
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
            overview: "Test overview",
            description: "Test description",
            content: { html: "<p>Test</p>" },
            thumbnailTemp: "/test.jpg",
            intro: "Test intro",
        };

        const result = portfolioToListItem(mockPortfolio);

        expect(result).not.toHaveProperty("description");
        expect(result).not.toHaveProperty("content");
        expect(result).not.toHaveProperty("thumbnailTemp");
        expect(result).not.toHaveProperty("intro");
    });

    test("should handle Portfolio with id undefined", () => {
        const mockPortfolio: Portfolio = {
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
        };

        const result = portfolioToListItem(mockPortfolio);

        expect(result.id).toBeUndefined();
    });

    test("should handle Portfolio with overview undefined", () => {
        const mockPortfolio: Portfolio = {
            id: "1",
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: "2024-01-01",
            current: false,
        };

        const result = portfolioToListItem(mockPortfolio);

        expect(result.overview).toBeUndefined();
    });
});
