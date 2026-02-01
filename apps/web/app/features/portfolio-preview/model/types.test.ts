import { describe, expect, test } from "vitest";
import type { Portfolio } from "~/entities/portfolio";
import type { PortfolioPreviewProps } from "./types";

describe("PortfolioPreview Feature Types", () => {
    describe("PortfolioPreviewProps", () => {
        test("should have required fields", () => {
            const mockPortfolio: Portfolio = {
                company: "Test Company",
                current: false,
                date: "2024-01-01",
                slug: "test-portfolio",
                title: "Test Portfolio",
            };

            const props: PortfolioPreviewProps = {
                current: true,
                data: mockPortfolio,
            };

            expect(props.current).toBe(true);
            expect(props.data).toBeDefined();
            expect(props.data.company).toBe("Test Company");
            expect(props.data.slug).toBe("test-portfolio");
            expect(props.data.title).toBe("Test Portfolio");
        });

        test("should support Portfolio with optional fields", () => {
            const mockPortfolio: Portfolio = {
                company: "Test Company",
                current: false,
                date: new Date("2024-01-01"),
                slug: "test-portfolio",
                title: "Test Portfolio",
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
                id: "portfolio-1",
            };

            const props: PortfolioPreviewProps = {
                current: false,
                data: mockPortfolio,
            };

            expect(props.current).toBe(false);
            expect(props.data.description).toBe("Test description");
            expect(props.data.intro).toBe("Test intro");
            expect(props.data.overview).toBe("Test overview");
            expect(props.data.content?.html).toBe("<p>Test content</p>");
            expect(props.data.images).toHaveLength(1);
            expect(props.data.thumbnailTemp).toBe("https://example.com/thumbnail.jpg");
            expect(props.data.id).toBe("portfolio-1");
        });

        test("should support date as string", () => {
            const mockPortfolio: Portfolio = {
                company: "Test Company",
                current: false,
                date: "2024-01-01",
                slug: "test-portfolio",
                title: "Test Portfolio",
            };

            const props: PortfolioPreviewProps = {
                current: true,
                data: mockPortfolio,
            };

            expect(typeof props.data.date).toBe("string");
            expect(props.data.date).toBe("2024-01-01");
        });

        test("should support date as Date object", () => {
            const mockPortfolio: Portfolio = {
                company: "Test Company",
                current: false,
                date: new Date("2024-01-01"),
                slug: "test-portfolio",
                title: "Test Portfolio",
            };

            const props: PortfolioPreviewProps = {
                current: true,
                data: mockPortfolio,
            };

            expect(props.data.date).toBeInstanceOf(Date);
        });
    });
});
