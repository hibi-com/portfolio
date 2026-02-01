import { describe, expect, test } from "vitest";
import type { Portfolio } from "./types";

describe("Portfolio Entity Types", () => {
    describe("Portfolio", () => {
        test("should have required fields", () => {
            const portfolio: Portfolio = {
                company: "Test Company",
                current: false,
                date: "2024-01-01",
                slug: "test-portfolio",
                title: "Test Portfolio",
            };

            expect(portfolio.company).toBe("Test Company");
            expect(portfolio.current).toBe(false);
            expect(portfolio.date).toBe("2024-01-01");
            expect(portfolio.slug).toBe("test-portfolio");
            expect(portfolio.title).toBe("Test Portfolio");
        });

        test("should support Date object for date field", () => {
            const portfolio: Portfolio = {
                company: "Test Company",
                current: false,
                date: new Date("2024-01-01"),
                slug: "test-portfolio",
                title: "Test Portfolio",
            };

            expect(portfolio.date).toBeInstanceOf(Date);
        });

        test("should support optional fields", () => {
            const portfolio: Portfolio = {
                company: "Test Company",
                current: true,
                date: "2024-01-01",
                slug: "test-portfolio",
                title: "Test Portfolio",
                id: "portfolio-1",
                description: "Test description",
                intro: "Test intro",
                overview: "Test overview",
                content: {
                    html: "<p>Test content</p>",
                },
                images: [
                    {
                        url: "https://example.com/image.jpg",
                    },
                ],
                thumbnailTemp: "https://example.com/thumbnail.jpg",
            };

            expect(portfolio.id).toBe("portfolio-1");
            expect(portfolio.description).toBe("Test description");
            expect(portfolio.intro).toBe("Test intro");
            expect(portfolio.overview).toBe("Test overview");
            expect(portfolio.content?.html).toBe("<p>Test content</p>");
            expect(portfolio.images).toHaveLength(1);
            expect(portfolio.thumbnailTemp).toBe("https://example.com/thumbnail.jpg");
        });

        test("should support images array", () => {
            const portfolio: Portfolio = {
                company: "Test Company",
                current: false,
                date: "2024-01-01",
                slug: "test-portfolio",
                title: "Test Portfolio",
                images: [
                    {
                        url: "https://example.com/image1.jpg",
                    },
                    {
                        url: "https://example.com/image2.jpg",
                    },
                ],
            };

            expect(portfolio.images).toHaveLength(2);
            expect(portfolio.images?.[0]?.url).toBe("https://example.com/image1.jpg");
            expect(portfolio.images?.[1]?.url).toBe("https://example.com/image2.jpg");
        });
    });
});
