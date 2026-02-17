import { portfolioSchema } from "./schemas";

describe("Portfolio Entity Schemas", () => {
    describe("portfolioSchema", () => {
        test("should validate valid portfolio", () => {
            const validPortfolio = {
                company: "Test Company",
                current: false,
                date: "2024-01-01",
                slug: "test-portfolio",
                title: "Test Portfolio",
            };

            const result = portfolioSchema.safeParse(validPortfolio);
            expect(result.success).toBe(true);
        });

        test("should validate portfolio with Date object", () => {
            const portfolioWithDate = {
                company: "Test Company",
                current: false,
                date: new Date("2024-01-01"),
                slug: "test-portfolio",
                title: "Test Portfolio",
            };

            const result = portfolioSchema.safeParse(portfolioWithDate);
            expect(result.success).toBe(true);
        });

        test("should validate portfolio with optional fields", () => {
            const portfolioWithOptional = {
                company: "Test Company",
                current: false,
                date: "2024-01-01",
                slug: "test-portfolio",
                title: "Test Portfolio",
                content: {
                    html: "<p>Test content</p>",
                },
                description: "Test description",
                id: "portfolio-1",
                images: [{ url: "https://example.com/image.jpg" }],
                intro: "Test intro",
                overview: "Test overview",
                thumbnailTemp: "https://example.com/thumbnail.jpg",
            };

            const result = portfolioSchema.safeParse(portfolioWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid portfolio", () => {
            const invalidPortfolios = [
                {
                    company: "",
                    current: false,
                    date: "2024-01-01",
                    slug: "test-portfolio",
                    title: "Test Portfolio",
                },
                {
                    company: "Test Company",
                    current: false,
                    date: "2024-01-01",
                    slug: "",
                    title: "Test Portfolio",
                },
                {
                    company: "Test Company",
                    current: false,
                    date: "2024-01-01",
                    slug: "test-portfolio",
                    title: "",
                },
            ];

            for (const invalid of invalidPortfolios) {
                const result = portfolioSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });
});
